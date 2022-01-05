import fetch from "node-fetch";

export const getWordList = async () => {
  const res = await fetch(
    "https://raw.githubusercontent.com/powerlanguage/guess-my-word/master/wordlist/sowpods.txt"
  ).then((res) => res.text());

  return res.split("\n").filter((word) => word.length === 5);
};
