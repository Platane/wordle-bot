import { evaluateWord } from "../../solver-simple";
import { mockMathRandom } from "../../utils.pseudoRandom";
import { pickRandom } from "../../utils.array";
import { getWordList } from "../../wordlist";
import {
  addConstraintLine,
  createEmptyConstraint,
  isValid,
  reduceConstraint,
} from "../constraint";
import { Evaluation, lineToU } from "../type";

it("should constraint", () => {
  const c = createEmptyConstraint(3);

  addConstraintLine(c, "xxa", [
    Evaluation.absent,
    Evaluation.absent,
    Evaluation.present,
  ]);

  expect(isValid(c, "yyy")).toBe(false);

  addConstraintLine(c, "axx", [
    Evaluation.correct,
    Evaluation.absent,
    Evaluation.absent,
  ]);

  expect(isValid(c, "ayy")).toBe(true);
});

it("should reduce constraint", () => {
  const c = createEmptyConstraint(2);

  addConstraintLine(c, "xa", [Evaluation.absent, Evaluation.present]);

  expect(c.required.size).toBe(1);
  expect(c.slots[0].value).toBe(undefined);

  reduceConstraint(c);

  expect(c.required.size).toBe(0);
  expect(c.slots[0].value).toBeDefined();
});

it("should add required", () => {
  const c = createEmptyConstraint(3);

  addConstraintLine(c, "xax", [
    Evaluation.absent,
    Evaluation.correct,
    Evaluation.absent,
  ]);

  addConstraintLine(c, "axa", [
    Evaluation.present,
    Evaluation.absent,
    Evaluation.absent,
  ]);

  expect(c.required.size).toBe(0);

  addConstraintLine(c, "axa", [
    Evaluation.present,
    Evaluation.absent,
    Evaluation.present,
  ]);

  expect(c.required.size).toBe(1);
});

it("always valid", async () => {
  const words = await getWordList();

  mockMathRandom();

  for (let i = 2000; i--; ) {
    const solution = pickRandom(words);

    const c = createEmptyConstraint(5);

    const xs = [];

    for (let i = 20; i--; ) {
      const candidate = pickRandom(words);

      const line = evaluateWord(solution, candidate);

      const x = lineToU(line);

      xs.push(x);

      addConstraintLine(c, x.word, x.evaluation);

      if (!isValid(c, solution)) {
        debugger;

        const c0 = createEmptyConstraint(5);

        for (const { word: u, evaluation } of xs) {
          0;

          addConstraintLine(c0, u, evaluation);

          console.log(c0);
        }

        expect(isValid(c, solution)).toBe(true);
        return;
      }
    }
  }
});

it("always valid 2", async () => {
  const alphabet = ["a", "b", "c", "d"];
  const words: string[] = [];
  const n = 8;

  mockMathRandom();

  for (let i = 2000; i--; )
    words.push(Array.from({ length: n }, () => pickRandom(alphabet)).join(""));

  for (let i = 20000; i--; ) {
    const solution = pickRandom(words);

    const c = createEmptyConstraint(n);

    const xs = [];

    for (let i = 20; i--; ) {
      const candidate = pickRandom(words);

      const line = evaluateWord(solution, candidate);

      const x = lineToU(line);

      xs.push(x);

      addConstraintLine(c, x.word, x.evaluation);

      if (!isValid(c, solution)) {
        debugger;

        const c0 = createEmptyConstraint(n);

        for (const { word: u, evaluation } of xs) {
          0;

          addConstraintLine(c0, u, evaluation);

          console.log(c0);
        }

        expect(isValid(c, solution)).toBe(true);
        return;
      }
    }
  }
});
