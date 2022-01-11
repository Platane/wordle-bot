import puppeteer from "puppeteer";
import { Line } from "../type";

export const getShareText = async (page: puppeteer.Page): Promise<string> => {
  const shareButton = await page.$("pierce/#share-button");

  if (!shareButton) {
    await page.waitForTimeout(100);
    return getShareText(page);
  }

  await shareButton.click({ delay });
  await page.waitForTimeout(100);

  const clipboardContent = await page.evaluate(() =>
    navigator.clipboard.readText()
  );

  return clipboardContent;
};

export const getPlayedLines = async (page: puppeteer.Page) => {
  await clearSubmission(page);

  const grid = await readGrid(page);

  return grid.filter((l) => l[0].evaluation !== "empty") as Line[];
};

export const readGrid = async (page: puppeteer.Page) => {
  const $board = await page.$("pierce/#board");

  const $rows = await $board?.$$("pierce/.row");

  const grid = await Promise.all(
    $rows?.map(async ($row) => {
      const $tiles = await $row.$$("pierce/.tile");

      return Promise.all(
        $tiles.map(async ($tile) => {
          const letter: string = await page.evaluate(
            (el) => el.textContent,
            $tile
          );
          const evaluation = (await page.evaluate(
            (el) => el.getAttribute("data-state"),
            $tile
          )) as "empty" | "tbd" | "absent" | "present" | "correct";

          return { letter, evaluation };
        })
      );
    }) ?? []
  );

  return grid;
};

const clearSubmission = async (page: puppeteer.Page) => {
  if ((await readGrid(page)).flat().some((t) => t.evaluation === "tbd")) {
    await clickKey(page, "←");
    await clearSubmission(page);
  }
};

const clickKey = async (page: puppeteer.Page, key: string) => {
  const $key = await page.$(`pierce/#keyboard [data-key="${key}"]`);
  await $key?.click({ delay });
};

export const submitWord = async (page: puppeteer.Page, word: string) => {
  await clearSubmission(page);

  const grid = await readGrid(page);
  const k = grid.findIndex((l) => l[0].evaluation === "empty");

  for (let i = 0; i < word.length; i++) {
    const letter = word[i];

    while ((await readGrid(page))[k][i].letter !== letter)
      await clickKey(page, letter);
  }

  await clickKey(page, "↵");

  await page.waitForTimeout(delay);

  await detectError(page);
};

const detectError = async (page: puppeteer.Page) => {
  await page.waitForTimeout(delay);

  const toasterZone = await page.$("pierce/#game-toaster");
  const toast = await toasterZone?.$("pierce/.toast");

  if (toast) {
    const text = await page.evaluate((el) => el.textContent, toast);
    throw new Error(text);
  }
};

const delay = 30;
