import puppeteer from "puppeteer";
import * as path from "path";
import { tmpdir } from "os";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";
import { isLineCorrect, Line } from "../type";
import { getPlayedLines, getShareText, readGrid, submitWord } from "./utils";

type Solver = {
  getNextWord: () => string;
  reportLine: (line: Line) => void;
};
export const run = async (
  createSolver: (wordList: string[]) => Solver,
  wordList: string[]
) => {
  const WORDLE_URL = "https://www.powerlanguage.co.uk/wordle";
  const browser = await puppeteer.launch({
    //
    // headless: false,
    defaultViewport: { width: 600, height: 600 },
  });

  // allows to read clipboard
  const context = browser.defaultBrowserContext();
  context.overridePermissions(new URL(WORDLE_URL).origin, ["clipboard-read"]);

  const page = await browser.newPage();
  await page.goto(WORDLE_URL);
  await page.waitForTimeout(500);

  // close pop up
  const closeButton = await page.$("pierce/.close-icon");
  if (closeButton) {
    await closeButton.click();
    await page.waitForTimeout(200);
  }

  // start recording the screen
  const recordFile = path.join(
    tmpdir(),
    Math.random().toString(36).slice(-8) + ".mp4"
  );
  const recorder = new PuppeteerScreenRecorder(page, {
    fps: 60,
    videoFrame: { width: 400, height: 400 },
  });
  await recorder.start(recordFile);

  // get the number of tries
  const n = (await readGrid(page)).length;

  // list of played lines, should be empty on a new page
  // played lines will be added as they are played
  const playedLines = await getPlayedLines(page);

  // init solver
  let solver = createSolver(wordList);
  playedLines.forEach(solver.reportLine);

  while (playedLines.length < n && !playedLines.some(isLineCorrect)) {
    // play next line
    const word = solver.getNextWord();
    try {
      await submitWord(page, word);
    } catch (err) {
      // if we get this error,
      // remove the forbidden word from the word list
      // and restart the solver
      if (err instanceof Error && err.message === "Not in word list") {
        console.warn(`"${word}" is not in word list`);
        wordList.splice(wordList.indexOf(word), 1);
        createSolver(wordList);
        playedLines.forEach(solver.reportLine);
      } else {
        throw err;
      }
    }

    // check the new played line
    const newLine = (await getPlayedLines(page))[playedLines.length];
    if (newLine) {
      solver.reportLine(newLine);
      playedLines.push(newLine);
    }
  }

  await page.waitForTimeout(200);

  await recorder.stop();

  // read the text that you get when you click the "share" button
  const sharedText = await getShareText(page);

  await browser.close();

  return { sharedText, playedLines, recordFile };
};
