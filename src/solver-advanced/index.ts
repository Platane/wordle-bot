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
import { Evaluation, lineToU } from "./type";

const CANDIDATE_ANY_SAMPLE_N = 1000;
const CANDIDATE_VALID_SAMPLE_N = 200;
const REFERENCE_SAMPLE_N = 6000;

export const createSolver = (_words: string[]) => {
  const words = _words.slice();
  shuffle(words);
  const validWords = words.slice();

  const c = createEmptyConstraint(words[0].length);
  const c0 = createEmptyConstraint(words[0].length);

  const reportLine = (line: Line) => {
    const { word, evaluation } = lineToU(line);

    addConstraintLine(c, word, evaluation);

    reduceConstraint(c);

    for (let i = validWords.length; i--; )
      if (!isValid(c, validWords[i])) validWords.splice(i, 1);
  };

  let bestScore = 0;
  let bestWord: string;
  const evaluation = Array.from(
    { length: words[0].length },
    () => Evaluation.absent
  );
  const scoreCache = new Map<number, number>();

  const testCandidate = (w: string) => {
    let score = 0;

    scoreCache.clear();

    for (let i = Math.min(REFERENCE_SAMPLE_N, validWords.length); i--; ) {
      const solution = validWords[i];

      evaluateWord(solution, w, evaluation);

      const key = getEvaluationKey5(evaluation);

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
    if (validWords.length < 3) return validWords[0];

    bestScore = -Infinity;
    shuffle(words);

    bestWord = words[0];

    for (let i = Math.min(CANDIDATE_ANY_SAMPLE_N, words.length); i--; )
      testCandidate(words[i]);

    for (let i = Math.min(CANDIDATE_VALID_SAMPLE_N, validWords.length); i--; )
      testCandidate(validWords[i]);

    return bestWord;
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

const getEvaluationKey5 = (evaluation: Evaluation[]) =>
  evaluation[0] +
  evaluation[1] * 4 +
  evaluation[2] * 16 +
  evaluation[3] * 64 +
  evaluation[4] * 256;

const getEvaluationKey = (evaluation: Evaluation[]) => {
  let key = 0;
  for (let i = evaluation.length; i--; ) {
    key += (1 << (i * 2)) * evaluation[i];
  }
  return key;
};
