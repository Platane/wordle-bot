import ParkMiller from "park-miller";
import { createSolver, evaluateWord } from "../solver";
import { isLineCorrect } from "../type";
import { getWordList } from "../wordlist";

jest.setTimeout(60 * 1000);
it("solver benchmark", async () => {
  const pm = new ParkMiller(10);
  Math.random = () => pm.float();

  const words = await getWordList();

  const solutions = Array.from(
    { length: 200 },
    () => words[Math.floor(words.length * Math.random())]
  );

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
    `number of guess before solution: ${mean(ns)} (${(dt / 200).toFixed(
      0
    )}ms per game)` +
      "\n\n" +
      printHistogram(histogram)
  );
});

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
