import { TwitterApi } from "twitter-api-v2";

export const getTwitterClient = () => {
  const twitterClient = new TwitterApi(process.env.TWITTER_ACCESS_TOKEN!);

  return twitterClient;
};

export const tweetResult = async (sharedText: string, recordUrl: string) => {
  const twitterClient = getTwitterClient();

  const videoUrl = getJDelivrUrl(recordUrl);
  await twitterClient.v2.tweet(sharedText + "\n\nSPOILER: " + videoUrl);
};

const getJDelivrUrl = (rawUrl: string) => {
  const u = new URL(rawUrl);
  const [_, repo, commitSha, filename] = u.pathname.match(
    /^\/([^/]+\/[^/]+)\/blob\/([^/]+)\/(.*)$/
  )!;

  return `https://cdn.jsdelivr.net/gh/${repo}@${commitSha}/${filename}`;
};
