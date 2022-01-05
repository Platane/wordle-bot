export type Tile = {
  letter: string;
  evaluation: "absent" | "present" | "correct";
};
export type Line = Tile[];

export const isLineCorrect = (line: Line) =>
  line.every((t) => t.evaluation === "correct");
