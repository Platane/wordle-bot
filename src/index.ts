import "dotenv/config";
import { run } from "./automation/run";
import { createSolver } from "./solver";
import { push } from "./github-push";
import { getWordList } from "./wordlist";
import { lineToString } from "./type";

(async () => {
  const wordList = await getWordList();

  const res = await run(createSolver, wordList);

  const commitMessage =
    res.sharedText + "\n\n" + res.playedLines.map(lineToString).join("\n");

  const url = await push(
    res.recordFile,
    res.sharedText.split("X")[0].trim().replace(/\s+/g, "-") + ".mp4",
    commitMessage
  );
})();
