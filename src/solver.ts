import { Line } from "./type";

export const createSolver = (words: string[]) => {
  const reportLine = (line: Line) => {};

  const getNextWord = () => {
    return words[Math.floor(Math.random() * words.length)];
  };

  return { reportLine, getNextWord };
};
