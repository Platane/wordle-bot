import fetch from "node-fetch";
import * as path from "path";
import * as fs from "fs";

const getWordList_ = () =>
  fetch(
    "https://raw.githubusercontent.com/powerlanguage/guess-my-word/master/wordlist/sowpods.txt"
  )
    .then((res) => res.text())
    .then((text) => text.split("\n").filter((word) => word.length === 5));

export const getWordList = async () => {
  const cachePath = path.join(__dirname, "../node_modules/wordList-cache.txt");

  if (fs.existsSync(cachePath))
    return fs.readFileSync(cachePath).toString().split("\n");

  const wordList = await getWordList_();

  fs.writeFileSync(cachePath, wordList.join("\n"));

  return wordList;
};
