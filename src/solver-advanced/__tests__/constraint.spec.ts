import ParkMiller from "park-miller";
import { evaluateWord, isValidWord } from "../../solver-simple";
import { pickRandom } from "../../utils.array";
import { getWordList } from "../../wordlist";
import {
  addConstraintLine,
  createEmptyConstraint,
  isValid,
  reduceConstraint,
} from "../contraint";
import { Evaluation, lineToU, wordToU } from "../type";

it("should contraint", () => {
  const c = createEmptyConstraint(3);

  addConstraintLine(c, wordToU("xxa"), [
    Evaluation.absent,
    Evaluation.absent,
    Evaluation.present,
  ]);

  expect(isValid(c, wordToU("yyy"))).toBe(false);

  addConstraintLine(c, wordToU("axx"), [
    Evaluation.correct,
    Evaluation.absent,
    Evaluation.absent,
  ]);

  expect(isValid(c, wordToU("ayy"))).toBe(true);
});

it("should reduce constraint", () => {
  const c = createEmptyConstraint(2);

  addConstraintLine(c, wordToU("xa"), [Evaluation.absent, Evaluation.present]);

  expect(c.required.size).toBe(1);
  expect(c.slots[0].value).toBe(undefined);

  reduceConstraint(c);

  expect(c.required.size).toBe(0);
  expect(c.slots[0].value).toBeDefined();
});

it("should add required", () => {
  const c = createEmptyConstraint(3);

  addConstraintLine(c, wordToU("xax"), [
    Evaluation.absent,
    Evaluation.correct,
    Evaluation.absent,
  ]);

  addConstraintLine(c, wordToU("axa"), [
    Evaluation.present,
    Evaluation.absent,
    Evaluation.absent,
  ]);

  expect(c.required.size).toBe(0);

  addConstraintLine(c, wordToU("axa"), [
    Evaluation.present,
    Evaluation.absent,
    Evaluation.present,
  ]);

  expect(c.required.size).toBe(1);
});

xit("should be isomorphic to simple isValid", async () => {
  const words = await getWordList();

  const pm = new ParkMiller(1125930121009);
  Math.random = () => pm.float();

  for (let i = 200; i--; ) {
    const solution = words[Math.floor(Math.random() * words.length)];
    const candidates = Array.from(
      { length: Math.floor(Math.random() * 10) },
      () => pickRandom(words)
    );

    const lines = candidates.map((candidate) =>
      evaluateWord(solution, candidate)
    );
    const c = createEmptyConstraint(words[0].length);
    lines
      .map(lineToU)
      .forEach(({ u, evaluation }) => addConstraintLine(c, u, evaluation));

    for (const w of words) {
      if (
        isValid(c, wordToU(w)) !== lines.every((line) => isValidWord(line, w))
      ) {
        console.log(c, lines);

        debugger;

        isValid(c, wordToU(w));

        expect(false).toBe(true);
      }
    }
  }
});

it("always valid", async () => {
  const words = await getWordList();

  const pm = new ParkMiller(1125930121009);
  Math.random = () => pm.float();

  for (let i = 2000; i--; ) {
    const solution = words[Math.floor(Math.random() * words.length)];

    const c = createEmptyConstraint(5);

    const xs = [];

    for (let i = 20; i--; ) {
      const candidate = words[Math.floor(Math.random() * words.length)];

      const line = evaluateWord(solution, candidate);

      const x = lineToU(line);

      xs.push(x);

      addConstraintLine(c, x.u, x.evaluation);

      if (!isValid(c, wordToU(solution))) {
        debugger;

        const c0 = createEmptyConstraint(5);

        for (const { u, evaluation } of xs) {
          0;

          addConstraintLine(c0, u, evaluation);

          console.log(c0);
        }

        expect(isValid(c, wordToU(solution))).toBe(true);
        return;
      }
    }
  }
});

it("always valid 2", async () => {
  const alphabet = ["a", "b", "c", "d"];
  const words: string[] = [];
  const n = 8;

  const pm = new ParkMiller(1125930121009);
  Math.random = () => pm.float();

  for (let i = 2000; i--; )
    words.push(
      Array.from(
        { length: n },
        () => alphabet[Math.floor(Math.random() * alphabet.length)]
      ).join("")
    );

  for (let i = 20000; i--; ) {
    const solution = words[Math.floor(Math.random() * words.length)];

    const c = createEmptyConstraint(n);

    const xs = [];

    for (let i = 20; i--; ) {
      const candidate = words[Math.floor(Math.random() * words.length)];

      const line = evaluateWord(solution, candidate);

      const x = lineToU(line);

      xs.push(x);

      addConstraintLine(c, x.u, x.evaluation);

      if (!isValid(c, wordToU(solution))) {
        debugger;

        const c0 = createEmptyConstraint(n);

        for (const { u, evaluation } of xs) {
          0;

          addConstraintLine(c0, u, evaluation);

          console.log(c0);
        }

        expect(isValid(c, wordToU(solution))).toBe(true);
        return;
      }
    }
  }
});
