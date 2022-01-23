import { evaluateWord } from "../solver-simple";
import { Line } from "../type";

export const colors = ["🟨", "🟩", "⬜"] as const;
export type Color = typeof colors[number];

export const evaluationToColor = (e: Line[number]["evaluation"]) => {
  switch (e) {
    case "correct":
      return "🟩";
    case "present":
      return "🟨";
    case "absent":
      return "⬜";
  }
};

export type Grid = Color[][];

const _l: Line = Array.from({ length: 6 }, () => ({
  evaluation: "correct",
  letter: "x",
}));
export const fill = (grid: Grid, solution: string, wordList: string[]) =>
  grid.map((line) => {
    let bestScore = 0;
    let bestWord = wordList[0];

    for (const word of wordList) {
      evaluateWord(solution, word, _l);

      const score = _l.reduce(
        (s, { evaluation }, i) =>
          s + (evaluationToColor(evaluation) === line[i] ? 1 : 0),
        0
      );

      if (score > bestScore && solution !== word) {
        bestScore = score;
        bestWord = word;
      }
    }

    return bestWord;
  });
