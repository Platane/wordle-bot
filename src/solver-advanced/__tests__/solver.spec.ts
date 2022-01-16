import { createSolver } from "../index";
import { Line, lineToString } from "../../type";
import { getWordList } from "../../wordlist";
import { pickRandom } from "../../utils.array";
import { mockMathRandom } from "../../utils.pseudoRandom";
import { evaluateWord, isLineCorrect } from "../../solver-simple";

it("solver", async () => {
  const words = await getWordList();

  mockMathRandom(9987);

  const solution = pickRandom(words);

  const solver = createSolver(words);

  const lines: Line[] = [];

  for (let i = 10; i--; ) {
    const w = solver.getNextWord();

    const line = evaluateWord(solution, w!);

    solver.reportLine(line);

    lines.push(line);
  }

  console.log(solution + "\n" + lines.map(lineToString).join("\n"));

  expect(lines.some(isLineCorrect)).toBeTruthy();
});
