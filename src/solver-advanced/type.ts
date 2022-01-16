import { Line } from "../type";

export enum Evaluation {
  absent,
  present,
  correct,
}

export type Letter = string & { __opaque: true };

export const alphabet = Array.from({ length: 26 }, (_, i) =>
  (i + 10).toString(36)
) as Letter[];

export const wordToU = (word: string): ArrayLike<Letter> =>
  word.split("") as Letter[];
// const u = new Uint8Array(word.length);
// for (let i = word.length; i--; ) u[i] = word.charCodeAt(i) - 97;
// return u;

export const uToWord = (word: ArrayLike<Letter>) => Array.from(word).join("");
// word.reduce((w, x) => w + (x + 10).toString(36), "");

export const toEvaluation = (e: Line[0]["evaluation"]) => {
  switch (e) {
    case "absent":
      return Evaluation.absent;
    case "present":
      return Evaluation.present;
    case "correct":
      return Evaluation.correct;
  }
};

export const lineToU = (line: Line) => {
  const w = line.map((l) => l.letter).join("");
  const evaluation = line.map((l) => toEvaluation(l.evaluation));

  return { u: wordToU(w), evaluation };
};
