export type Tile = {
  letter: string;
  evaluation: "absent" | "present" | "correct";
};
export type Line = Tile[];

export const isLineCorrect = (line: Line) =>
  line.every((t) => t.evaluation === "correct");

export const tileToString = ({ letter, evaluation }: Tile) =>
  letter +
  ((evaluation === "correct" && "🟩") ||
    (evaluation === "present" && "🟨") ||
    "⬜");

export const lineToString = (line: Line) => line.map(tileToString).join(" ");
