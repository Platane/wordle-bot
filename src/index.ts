import "dotenv/config";
import { run } from "./automation/run";
import { createSolver } from "./solver";
import { push } from "./github-push";
import { getWordList } from "./wordlist";
import { lineToString } from "./type";
import TwitterApi from "twitter-api-v2";

(async () => {
  const wordList = await getWordList();

  const res = await run(createSolver, wordList);

  const fileName =
    res.sharedText.match(/Wordle\s+\d+/)![0].replace(/\W+/g, "-") + ".mp4";

  const commitMessage =
    res.sharedText + "\n\n" + res.playedLines.map(lineToString).join("\n");

  const url = await push(res.recordFile, fileName, commitMessage);

  // twitter
  {
    const twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_KEY_SECRET!,

      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });

    const { data: firstTweet } = await twitterClient.v2.tweet(res.sharedText);
    // const mediaId = await twitterClient.v1.uploadMedia(res.recordFile);
    await twitterClient.v2.tweet({
      text: `SPOILER: ${url}`,
      // media: { media_ids: [mediaId] },
      reply: { in_reply_to_tweet_id: firstTweet.id },
    });
  }
})();
