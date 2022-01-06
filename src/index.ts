import "dotenv/config";
import { run } from "./automation/run";
import { createSolver } from "./solver";
import { push } from "./github-push";
import { getWordList } from "./wordlist";

(async () => {
  const wordList = await getWordList();

  const res = await run(createSolver, wordList);

  const url = await push(
    res.recordFile,
    res.sharedText.split("X")[0].trim().replace(/\s+/g, "-") + ".mp4",
    res.sharedText +
      "\n\n" +
      res.playedLines
        .map((l) =>
          l
            .map(
              (t) =>
                t.letter +
                ((t.evaluation === "correct" && "🟩") ||
                  (t.evaluation === "present" && "🟨") ||
                  "⬜")
            )
            .join(" ")
        )
        .join("\n")
  );

  console.log(url);
})();
