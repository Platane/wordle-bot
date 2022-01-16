import { evaluateWord } from "../index";
import { Line } from "../../type";

const target: Line = [
  { letter: "a", evaluation: "present" },
  { letter: "b", evaluation: "absent" },
  { letter: "a", evaluation: "correct" },
];

it("should evaluate same solution", () => {
  evaluateWord("abc", "abc", target);
  expect(target).toEqual([
    { letter: "a", evaluation: "correct" },
    { letter: "b", evaluation: "correct" },
    { letter: "c", evaluation: "correct" },
  ]);
});

it("should evaluate present", () => {
  evaluateWord("abc", "xxa", target);
  expect(target).toEqual([
    { letter: "x", evaluation: "absent" },
    { letter: "x", evaluation: "absent" },
    { letter: "a", evaluation: "present" },
  ]);
});

it("should evaluate present", () => {
  evaluateWord("abc", "xaa", target);
  expect(target).toEqual([
    { letter: "x", evaluation: "absent" },
    { letter: "a", evaluation: "present" },
    { letter: "a", evaluation: "absent" },
  ]);
});

it("should evaluate present", () => {
  evaluateWord("abc", "aaa", target);
  expect(target).toEqual([
    { letter: "a", evaluation: "correct" },
    { letter: "a", evaluation: "absent" },
    { letter: "a", evaluation: "absent" },
  ]);
});
