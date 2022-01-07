import { createSolver, evaluateWord } from "../solver";
import { isLineCorrect, Line, lineToString } from "../type";
import { getWordList } from "../wordlist";

it("solver", async () => {
  const words = await getWordList();

  const solution = words[0];

  const solver = createSolver(words);

  const lines: Line[] = [];

  for (let i = 16; i--; ) {
    const w = solver.getNextWord();

    const eLine = evaluateWord(solution, w);

    solver.reportLine(eLine);

    lines.push(eLine);
  }

  console.log(solution + "\n" + lines.map(lineToString).join("\n"));

  expect(lines.some(isLineCorrect)).toBeTruthy();
});
