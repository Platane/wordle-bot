import * as path from "path";
import TwitterApi from "twitter-api-v2";
import { writeDotEnv } from "./writeDotEnv";
import { createSecretUpdater } from "github-secret-dotenv/lib/github";
import { readPackageJson } from "github-secret-dotenv/lib/readPackageJson";
import "dotenv/config";

/**
 * reads the refresh token from the env var ( either .env or as env var )
 * gets a new access token from the refresh token
 *
 * saves the new refresh token and the access token to the .env file and to github secret
 */
(async () => {
  const client = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID!,
    clientSecret: process.env.TWITTER_CLIENT_SECRET!,
  });

  const {
    client: client0,
    accessToken,
    refreshToken,
    expiresIn,
  } = await client.refreshOAuth2Token(process.env.TWITTER_REFRESH_TOKEN!);

  {
    const { data } = await client0.currentUserV2();
    console.log(data, { expiresIn });
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
