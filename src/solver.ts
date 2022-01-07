import { Line } from "./type";

export const createSolver = (words: string[]) => {
  const validWords = words.slice();
  shuffle(validWords);

  const reportLine = (line: Line) => {
    for (let i = validWords.length; i--; )
      if (!isValidWord(line, validWords[i])) validWords.splice(i, 1);
  };

  const getNextWord = () => {
    let score = 0;
    let w = validWords[0];

    const _w = validWords.slice(0, 500);
    shuffle(_w);

    for (let i = Math.min(100, _w.length); i--; ) {
      const s = getScore(validWords[i], _w);
      if (s > score) {
        score = s;
        w = validWords[i];
      }
    }

    return w;
  };

  return { reportLine, getNextWord };
};

const getScore = (candidate: string, words: string[]) => {
  discardedWordsByKey.clear();

  let sum = 0;

  for (const w of words) {
    // if w is the solution
    evaluateWord_(w, candidate, ev);

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

const discardedWordsByKey = new Map<number, number>();
const ev: Evaluation[] = [];

const countDiscardedWords = (
  line: string,
  evaluation: Evaluation[],
  words: string[]
) => {
  let n = 0;
  for (const w of words) if (!isValidWord_(line, evaluation, w)) n++;

  return n;
};

const shuffle = (arr: string[]) => {
  for (let i = arr.length; i--; ) {
    const j = Math.floor(Math.random() * i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};

export const isValidWord_ = (
  line: string,
  evaluation: Evaluation[],
  word: string
) => {
  for (let i = line.length; i--; ) {
    if (evaluation[i] === Evaluation.correct && line[i] !== word[i])
      return false;
    if (evaluation[i] !== Evaluation.correct && line[i] === word[i])
      return false;
    if (evaluation[i] === Evaluation.present) {
      let ok = false;
      for (let j = line.length; j--; )
        if (word[j] === line[i] && evaluation[j] !== Evaluation.correct)
          ok = true;

      if (!ok) return false;
    }
  }

  return true;
};

export const isValidWord = (line: Line, word: string) => {
  for (let i = line.length; i--; ) {
    const t = line[i];

    if (t.evaluation === "correct" && t.letter !== word[i]) return false;
    if (t.evaluation !== "correct" && t.letter === word[i]) return false;
    if (t.evaluation === "present") {
      let ok = false;
      for (let j = line.length; j--; )
        if (word[j] === t.letter && line[j].evaluation !== "correct") ok = true;

      if (!ok) return false;
    }
  }

  return true;
};

enum Evaluation {
  correct,
  present,
  absent,
}

const evaluateWord_ = (
  solution: string,
  word: string,
  evaluations: Evaluation[]
) => {
  for (let i = 0; i < word.length; i++) {
    if (word[i] === solution[i]) {
      evaluations[i] = Evaluation.correct;
      av[i] = false;
    } else {
      evaluations[i] = Evaluation.absent;
      av[i] = true;
    }
  }

  for (let i = 0; i < word.length; i++)
    if (av[i])
      for (let j = 0; j < word.length; j++)
        if (word[j] === solution[i] && evaluations[j] === Evaluation.absent) {
          av[i] = false;
          evaluations[j] = Evaluation.present;
          break;
        }
};
const evaluationToKey = (evaluations: Evaluation[]) =>
  evaluations.reduce((s, x, i) => s + x * 3 ** i, 0);

const keyToEvaluation = (key: number, evaluations: Evaluation[]) => {
  for (let i = evaluations.length; i--; )
    evaluations[i] = Math.floor(key / 3 ** i) % 3;
};

const av = [false, false, false, false, false];
export const evaluateWord = (
  solution: string,
  word: string,
  target: Line = Array.from({ length: word.length }, () => ({
    evaluation: "correct",
    letter: "x",
  }))
) => {
  for (let i = 0; i < word.length; i++) {
    target[i].letter = word[i];

    if (word[i] === solution[i]) {
      target[i].evaluation = "correct";
      av[i] = false;
    } else {
      target[i].evaluation = "absent";
      av[i] = true;
    }
  }

  for (let i = 0; i < word.length; i++)
    if (av[i])
      for (let j = 0; j < word.length; j++)
        if (word[j] === solution[i] && target[j].evaluation === "absent") {
          av[i] = false;
          target[j].evaluation = "present";
          break;
        }

  return target;
};
