import { evaluateWord } from "../../solver-simple";
import { evaluationToSquare, lineToString } from "../../type";
import { pickRandom } from "../../utils.array";
import { getWordList } from "../../wordlist";
import { colors, fill, Grid } from "../fill";

it("fill", async () => {
  const words = await getWordList();

  const solution = pickRandom(words);

  const grid = Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => pickRandom(colors as any))
  );

  const moves = fill(grid as any, solution, words);

  const lines = moves.map((w) => evaluateWord(solution, w));

  const grid0 = lines.map((l) =>
    l.map((x) => evaluationToSquare(x.evaluation))
  );

  console.log(
    (
      (100 * getScore(grid as any, grid0)) /
      (grid.length * grid0.length)
    ).toFixed(2) + "%",
    "\n",
    solution,
    moves,
    "\n" +
      grid.map((l) => l.join("")).join("\n") +
      "\n\n" +
      grid0.map((l) => l.join("")).join("\n")
  );

  expect(moves).toBeDefined();
});

const getScore = (grid: Grid, grid0: Grid) => {
  let s = 0;
  for (let i = grid.length; i--; )
    for (let j = grid[0].length; j--; ) s += +(grid[i][j] === grid0[i][j]);
  return s;
};
