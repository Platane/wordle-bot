import { TwitterApi } from "twitter-api-v2";

export const getTwitterClient = () => {
  const twitterClient = new TwitterApi(process.env.TWITTER_ACCESS_TOKEN!);

  return twitterClient;
};

export const tweetResult = async (sharedText: string, recordUrl: string) => {
  const twitterClient = getTwitterClient();
  const { data: firstTweet } = await twitterClient.v2.tweet(sharedText);
  // const mediaId = await twitterClient.v1.uploadMedia(res.recordFile);

  // jsdelivr serves assets with correct mimetype (contrary to github raw)
  const videoUrl = getJDelivrUrl(recordUrl);

  await twitterClient.v2.tweet({
    text: `SPOILER: ${videoUrl}`,
    // media: { media_ids: [mediaId] },
    reply: { in_reply_to_tweet_id: firstTweet.id },
  });
};

const getJDelivrUrl = (rawUrl: string) => {
  const u = new URL(rawUrl);
  const [_, repo, commitSha, filename] = u.pathname.match(
    /^\/([^/]+\/[^/]+)\/blob\/([^/]+)\/(.*)$/
  )!;

  return `https://cdn.jsdelivr.net/gh/${repo}@${commitSha}/${filename}`;
};
