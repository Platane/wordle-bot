import "dotenv/config";
import { run } from "./automation/run";
import { createSolver } from "./solver-advanced";
import { push } from "./github-push";
import { getWordList } from "./wordlist";
import { tweetResult } from "./twitter/client";
import { lineToString } from "./type";

(async () => {
  const wordList = await getWordList();

  const res = await run(createSolver, wordList);

  console.log(res.sharedText);

  const fileName =
    res.sharedText.match(/Wordle\s+\d+/)![0].replace(/\W+/g, "-") + ".mp4";

  const commitMessage =
    res.sharedText + "\n\n" + res.playedLines.map(lineToString).join("\n");

  const url = await push(res.recordFile, fileName, commitMessage);

  await tweetResult(res.sharedText, url);
})();
