import { isValidWord } from "../solver";
import { Line, lineToString } from "../type";

(
  [
    //
    [
      [
        { letter: "a", evaluation: "correct" },
        { letter: "b", evaluation: "correct" },
        { letter: "c", evaluation: "correct" },
      ],
      "abc",
      true,
    ],

    //
    [
      [
        { letter: "a", evaluation: "correct" },
        { letter: "b", evaluation: "correct" },
        { letter: "c", evaluation: "correct" },
      ],
      "abe",
      false,
    ],

    //
    [
      [
        { letter: "a", evaluation: "present" },
        { letter: "b", evaluation: "absent" },
        { letter: "a", evaluation: "correct" },
      ],
      "cca",
      false,
    ],

    //
    [
      [
        { letter: "a", evaluation: "present" },
        { letter: "b", evaluation: "absent" },
        { letter: "a", evaluation: "correct" },
      ],
      "caa",
      true,
    ],
  ] as [Line, string, boolean][]
).forEach(([line, word, expected]) =>
  it(`  ${lineToString(line)}   ${word}  ${
    expected ? "valid" : "not valid"
  }`, () => {
    expect(isValidWord(line, word)).toBe(expected);
  })
);
