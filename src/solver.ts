import { Line } from "./type";

export const createSolver = (words: string[]) => {
  const validWords = [...words];

  const reportLine = (line: Line) => {
    for (let i = validWords.length; i--; )
      if (!isValidWord(line, validWords[i])) validWords.splice(i, 1);
  };

  const getNextWord = () => {
    return validWords[Math.floor(Math.random() * validWords.length)];
  };

  return { reportLine, getNextWord };
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
