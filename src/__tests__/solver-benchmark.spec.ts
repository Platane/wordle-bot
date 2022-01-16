import ParkMiller from "park-miller";
import { createSolver as createSimpleSolver } from "../solver-simple";
import { createSolver as createAdvancedSolver } from "../solver-advanced";
import { evaluateWord, isLineCorrect } from "../solver-simple";
import { getWordList } from "../wordlist";

jest.setTimeout(60 * 1000);

it("solver-simple benchmark", async () => {
  const words = await getWordList();
  const solutions = getSolutions(words);

  run(createSimpleSolver, words, solutions, "solver simple");
});

it("solver-advanced benchmark", async () => {
  const words = await getWordList();
  const solutions = getSolutions(words);

  const pm = new ParkMiller(10);
  Math.random = () => pm.float();

  run(createAdvancedSolver, words, solutions, "solver advanced");
});

const getSolutions = (words: string[]) => {
  const pm = new ParkMiller(10);
  Math.random = () => pm.float();
  return Array.from(
    { length: 500 },
    () => words[Math.floor(words.length * Math.random())]
  );
};

const run = (
  createSolver: any,
  words: string[],
  solutions: string[],
  label = ""
) => {
  const pm = new ParkMiller(10131828);
  Math.random = () => pm.float();

  const a = Date.now();

  const ns: number[] = [];
  for (const solution of solutions) {
    const solver = createSolver(words);

    let n = 0;

    while (true) {
      const w = solver.getNextWord();
      const line = evaluateWord(solution, w);
      solver.reportLine(line);
      n++;

      if (isLineCorrect(line)) break;
    }

    ns.push(n);
  }

  const dt = Date.now() - a;

  const histogram = Array.from({ length: 30 }, () => 0);
  ns.forEach((n) => (histogram[n] = histogram[n] + 1));

  console.log(
    `${label}\n` +
      `number of guess before solution: ${mean(ns)} (${(dt / 200).toFixed(
        0
      )}ms per game)` +
      "\n\n" +
      printHistogram(histogram)
  );
};

const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
const printHistogram = (arr: number[]) => {
  const h = 26;
  const max = Math.max(...arr);

  return arr
    .slice(1, 20)
    .map(
      (n, i) =>
        (1 + i).toString().padEnd(3, " ") +
        " " +
        "🟦".repeat(Math.ceil((n / max) * h)) +
        " " +
        n
    )
    .join("\n");
};
