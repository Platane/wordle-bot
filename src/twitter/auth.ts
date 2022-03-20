import * as http from "http";
import type { Socket } from "net";
import TwitterApi from "twitter-api-v2";
import "dotenv/config";
import { writeDotEnv } from "./writeDotEnv";
import { createSecretUpdater } from "github-secret-dotenv/lib/github";
import { getRepository } from "./getRepository";

const CALLBACK_URL = "http://localhost:4194/callback";

/**
 * oauth2 flow to generate a new access token
 * at some point, the user is asked to visit a webpage to finish the oauth flow
 *
 * saves the new refresh token and the access token to the .env file and to github secret
 */
(async () => {
  const client = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID!,
    clientSecret: process.env.TWITTER_CLIENT_SECRET!,
  });

  const authLink = await client.generateOAuth2AuthLink(CALLBACK_URL, {
    scope: ["tweet.write", "offline.access", "tweet.read", "users.read"],
  });

  console.log("complete auth flow at:", authLink.url);

  const code = await new Promise<string | null>((resolve) => {
    const server = http.createServer((req, res) => {
      const u = new URL(req.url!, "http://a");

      const state = u.searchParams.get("state");
      const code = u.searchParams.get("code");
      if (u.pathname === "/callback" && state === authLink.state) {
        resolve(code);

        res.write(
          `<!DOCTYPE html>
          <html>
            <head><meta charset="utf-8"></head>
            <body>
              <h1>ok</h1>
              <script>window.close()</script>
            </body>
          </html>`
        );
        res.end();

        server.close();
        sockets.forEach((s) => s.destroy());
      }
    });

    const sockets = new Set<Socket>();
    const listener = server.listen("4194");
    listener.on("connection", (socket) => sockets.add(socket));
  });

  const {
    client: client0,
    accessToken,
    refreshToken,
    expiresIn,
  } = await client.loginWithOAuth2({
    code: code!,
    codeVerifier: authLink.codeVerifier,
    redirectUri: CALLBACK_URL,
  });

  {
    const { data } = await client0.currentUserV2();
    console.log(data, { expiresIn });
  }

  writeDotEnv(".env", {
    TWITTER_ACCESS_TOKEN: accessToken,
    TWITTER_REFRESH_TOKEN: refreshToken!,
  });

  console.log("written to .env");

  const updateSecret = createSecretUpdater({
    ...getRepository()!,
    githubAccessToken:
      process.env.GITHUB_ACCESS_TOKEN ?? process.env.GITHUB_TOKEN!,
  });
  updateSecret("TWITTER_ACCESS_TOKEN", accessToken);
  updateSecret("TWITTER_REFRESH_TOKEN", refreshToken!);

  console.log("uploaded to github secrets");
})();
