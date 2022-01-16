import { createSolver, evaluateWord, isLineCorrect } from "../index";
import { Line, lineToString } from "../../type";
import { getWordList } from "../../wordlist";

it("solver", async () => {
  const words = await getWordList();

  const solution = words[Math.floor(Math.random() * words.length)];

  const solver = createSolver(words);

  const lines: Line[] = [];

  for (let i = 10; i--; ) {
    const w = solver.getNextWord();

    const eLine: Line = [
      { letter: "x", evaluation: "absent" },
      { letter: "x", evaluation: "absent" },
      { letter: "x", evaluation: "absent" },
      { letter: "x", evaluation: "absent" },
      { letter: "x", evaluation: "absent" },
    ];

    evaluateWord(solution, w, eLine);

    solver.reportLine(eLine);

    lines.push(eLine);
  }

  console.log(solution + "\n" + lines.map(lineToString).join("\n"));

  expect(lines.some(isLineCorrect)).toBeTruthy();
});
