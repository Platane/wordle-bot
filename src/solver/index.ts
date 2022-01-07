import { Line } from "../type";
import { evaluateWord, Evaluation, isValid } from "./evaluate";
import { shuffle } from "./utils";

const N_CANDIDATES = 100;
const N_SAMPLE = 1000;

export const createSolver = (words: string[]) => {
  const validWords = words.slice();
  shuffle(validWords);

  const reportLine = (line: Line) => {
    let w = "";
    for (let i = 0; i < line.length; i++) {
      w += line[i].letter;
      ev[i] =
        (line[i].evaluation === "correct" && Evaluation.correct) ||
        (line[i].evaluation === "present" && Evaluation.present) ||
        Evaluation.absent;
    }

    for (let i = validWords.length; i--; )
      if (!isValid(w, ev, validWords[i])) validWords.splice(i, 1);
  };

  const getNextWord = () => {
    let score = 0;
    let w = validWords[0];

    shuffle(validWords);

    for (let i = Math.min(N_CANDIDATES, validWords.length); i--; ) {
      const s = getScore(validWords[i], validWords);
      if (s > score) {
        score = s;
        w = validWords[i];
      }
    }

    return w;
  };

  return { reportLine, getNextWord };
};

const discardedWordsByKey = new Map<number, number>();

/**
 * The score is the the number of discarded words on average
 * higher is better
 */
const getScore = (candidate: string, words: string[]) => {
  discardedWordsByKey.clear();

  let sum = 0;

  for (let i = Math.min(N_SAMPLE, words.length); i--; ) {
    // if w is the solution
    evaluateWord(words[i], candidate, ev);

    const key = evaluationToKey(ev);

    let discardedWords = discardedWordsByKey.get(key);

    if (!discardedWords) {
      discardedWords = countDiscardedWords(candidate, ev, words);
      discardedWordsByKey.set(key, discardedWords);
    }

    sum += discardedWords;
  }

  return sum;
};

const ev: Evaluation[] = [0, 0, 0, 0, 0];

const countDiscardedWords = (
  line: string,
  evaluation: Evaluation[],
  words: string[]
) => {
  let n = 0;
  for (let i = Math.min(N_SAMPLE, words.length); i--; )
    if (!isValid(line, evaluation, words[i])) n++;
  return n;
};

const evaluationToKey = (evaluations: Evaluation[]) =>
  evaluations.reduce((s, x, i) => s + x * 10 ** i, 0);
