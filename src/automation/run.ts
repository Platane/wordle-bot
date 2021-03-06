import puppeteer from "puppeteer";
import * as path from "path";
import { tmpdir } from "os";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";
import { Line } from "../type";
import {
  getPlayedLines,
  getShareText,
  mockClipboard,
  readGrid,
  submitWord,
} from "./utils";

type Solver = {
  getNextWord: () => string;
  reportLine: (line: Line) => void;
};
export const run = async (
  createSolver: (wordList: string[]) => Solver,
  wordList: string[],
  localStorage0?: { statistics: string; gameState: string }
) => {
  const WORDLE_URL = "https://www.powerlanguage.co.uk/wordle";
  const browser = await puppeteer.launch({
    //
    // headless: false,
    defaultViewport: { width: 600, height: 600 },
    args: [" --no-sandbox"],
  });

  const page = await browser.newPage();
  await mockClipboard(page);

  // inject gameState and statistics from previous games
  if (localStorage0)
    await page.evaluateOnNewDocument(({ statistics, gameState }: any) => {
      localStorage.setItem("statistics", statistics);
      localStorage.setItem("gameState", gameState);
    }, localStorage0);

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

  while (
    playedLines.length < n &&
    !playedLines.some((line) => line.every((x) => x.evaluation === "correct"))
  ) {
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
        solver = createSolver(wordList);
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

  await page.waitForTimeout(300);

  await recorder.stop();

  // read the text that you get when you click the "share" button
  const sharedText = await getShareText(page);

  // read statistics from localStorage
  const localStorage_ = await page.evaluate(() => ({
    statistics: localStorage.getItem("statistics"),
    gameState: localStorage.getItem("gameState"),
  }));

  await browser.close();

  return { sharedText, playedLines, recordFile, localStorage: localStorage_ };
};
