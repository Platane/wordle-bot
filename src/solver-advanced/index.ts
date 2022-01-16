import { Line } from "../type";
import { shuffle } from "../utils.array";
import {
  addConstraintLine,
  Constraint,
  copyConstraint,
  createEmptyConstraint,
  evaluateWord,
  isValid,
  reduceConstraint,
} from "./constraint";
import { Evaluation, Letter, lineToU, uToWord, wordToU } from "./type";

const CANDIDATE_SAMPLE_N = 200;
const REFERENCE_SAMPLE_N = 5000;

export const createSolver = (words_: string[]) => {
  const words = words_.map(wordToU);
  const validWords = words.slice();

  const c = createEmptyConstraint(words[0].length);
  const c0 = createEmptyConstraint(words[0].length);

  const reportLine = (line: Line) => {
    const { u, evaluation } = lineToU(line);

    addConstraintLine(c, u, evaluation);

    reduceConstraint(c);

    for (let i = validWords.length; i--; )
      if (!isValid(c, validWords[i])) validWords.splice(i, 1);
  };

  let bestScore = 0;
  let bestWord: ArrayLike<Letter> | null = null;
  const evaluation = Array.from(
    { length: words[0].length },
    () => Evaluation.absent
  );
  const scoreCache = new Map<number, number>();

  const testCandidate = (w: ArrayLike<Letter>) => {
    let score = 0;

    scoreCache.clear();

    for (let i = Math.min(REFERENCE_SAMPLE_N, words.length); i--; ) {
      const solution = words[i];

      evaluateWord(solution, w, evaluation);

      const key = getEvaluationKey(evaluation);

      let s = scoreCache.get(key);

      if (s === undefined) {
        copyConstraint(c, c0);
        addConstraintLine(c0, w, evaluation);
        s = getScore(c0);
        scoreCache.set(key, s);
      }

      score += s;
    }

    if (score > bestScore) {
      bestScore = score;
      bestWord = w;
    }
  };

  const getNextWord = () => {
    if (validWords.length < 3) return uToWord(validWords[0]);

    bestScore = -Infinity;
    bestWord = null;

    shuffle(words);
    shuffle(validWords);

    for (let i = Math.min(CANDIDATE_SAMPLE_N, words.length); i--; )
      testCandidate(words[i]);

    for (let i = Math.min(CANDIDATE_SAMPLE_N, validWords.length); i--; )
      testCandidate(validWords[i]);

    if (bestWord) return uToWord(bestWord);
    else return null;
  };

  return { reportLine, getNextWord };
};

const getScore = (c: Constraint) => {
  let score = 0;

  for (let i = c.slots.length; i--; ) {
    score -= c.slots[i].values.size;
  }

  for (const [, count] of c.required) {
    score += count * 3;
  }

  return score;
};

const getEvaluationKey = (evaluation: Evaluation[]) => {
  let key = 0;
  for (let i = evaluation.length; i--; ) {
    key += (1 << (i * 2)) * evaluation[i];
  }
  return key;
};
