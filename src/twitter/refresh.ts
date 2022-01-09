import * as path from "path";
import TwitterApi from "twitter-api-v2";
import "dotenv/config";
import { writeDotEnv } from "./writeDotEnv";
import { createSecretUpdater } from "github-secret-dotenv/lib/github";
import { readPackageJson } from "github-secret-dotenv/lib/readPackageJson";

(async () => {
  const client = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID!,
    clientSecret: process.env.TWITTER_CLIENT_SECRET!,
  });

  const {
    client: client0,
    accessToken,
    refreshToken,
  } = await client.refreshOAuth2Token(process.env.TWITTER_REFRESH_TOKEN!);

  {
    const { data } = await client0.currentUserV2();
    console.log(data);
  }

  writeDotEnv(path.join(__dirname, "../../.env"), {
    TWITTER_ACCESS_TOKEN: accessToken,
    TWITTER_REFRESH_TOKEN: refreshToken!,
  });

  console.log("written to .env");

  const updateSecret = createSecretUpdater({
    ...readPackageJson(path.join(__dirname, "../.."))!,
    githubAccessToken:
      process.env.GITHUB_ACCESS_TOKEN ?? process.env.GITHUB_TOKEN!,
  });
  updateSecret("TWITTER_ACCESS_TOKEN", accessToken);
  updateSecret("TWITTER_REFRESH_TOKEN", refreshToken!);

  console.log("uploaded to github secrets");
})();
