import { TwitterApi } from "twitter-api-v2";

export const getTwitterClient = () => {
  const twitterClient = new TwitterApi(process.env.TWITTER_ACCESS_TOKEN!);

  return twitterClient;
};

export const tweetResult = async (sharedText: string, recordingUrl: string) => {
  const twitterClient = getTwitterClient();
  const { data: firstTweet } = await twitterClient.v2.tweet(sharedText);
  // const mediaId = await twitterClient.v1.uploadMedia(res.recordFile);
  await twitterClient.v2.tweet({
    text: `SPOILER: ${recordingUrl}`,
    // media: { media_ids: [mediaId] },
    reply: { in_reply_to_tweet_id: firstTweet.id },
  });
};