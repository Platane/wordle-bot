import puppeteer from "puppeteer";
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
  const browser = await puppeteer.launch({
    //
    // headless: false,
  });
  const context = browser.defaultBrowserContext();
  context.overridePermissions("https://www.powerlanguage.co.uk", [
    "clipboard-read",
  ]);
  const page = await browser.newPage();
  await page.goto("https://www.powerlanguage.co.uk/wordle/");

  await page.waitForTimeout(500);

  const closeButton = await page.$("pierce/.close-icon");
  if (closeButton) await closeButton.click();

  await page.waitForTimeout(500);

  const n = (await readGrid(page)).length;

  const playedLines = await getPlayedLines(page);

  let solver = createSolver(wordList);
  playedLines.forEach(solver.reportLine);

  while (playedLines.length < n && !playedLines.some(isLineCorrect)) {
    // play next line
    const word = solver.getNextWord();
    try {
      await submitWord(page, word);
    } catch (err: any) {
      if (err.message === "Not in word list") {
        // reset solver with the word
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

  const sharedText = await getShareText(page);

  await browser.close();

  return { sharedText, playedLines };
};
