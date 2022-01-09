import "dotenv/config";
import { run } from "./automation/run";
import { createSolver } from "./solver";
import { push } from "./github-push";
import { getWordList } from "./wordlist";
import { lineToString } from "./type";
import { tweetResult } from "./twitter/client";

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
