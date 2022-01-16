import { Line } from "../type";
import { pickRandom } from "../utils.array";
import {
  addConstraintLine,
  createEmptyConstraint,
  isValid,
  reduceConstraint,
} from "./contraint";
import { lineToU, uToWord, wordToU } from "./type";

export const createSolver = (words_: string[]) => {
  const words = words_.map(wordToU);
  const validWords = words.slice();

  const c = createEmptyConstraint(words[0].length);

  const reportLine = (line: Line) => {
    const { u, evaluation } = lineToU(line);

    addConstraintLine(c, u, evaluation);

    reduceConstraint(c);

    for (let i = validWords.length; i--; )
      if (!isValid(c, validWords[i])) validWords.splice(i, 1);
  };

  const getNextWord = () => uToWord(pickRandom(validWords));

  return { reportLine, getNextWord };
};
