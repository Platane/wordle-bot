import { Line } from "../type";

export enum Evaluation {
  absent,
  present,
  correct,
}

export const alphabet = Array.from({ length: 26 }, (_, i) =>
  (i + 10).toString(36)
);

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
  const word = line.reduce((w, l) => w + l.letter, "");
  const evaluation = line.map((l) => toEvaluation(l.evaluation));

  return { word, evaluation };
};
