import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import type { Socket } from "net";
import TwitterApi from "twitter-api-v2";
import "dotenv/config";

const writeDotEnv = (dotEnvPath: string, env: Record<string, string>) => {
  let content = "";
  try {
    content = fs.readFileSync(dotEnvPath).toString();
  } catch (e) {}

  for (const [name, value] of Object.entries(env)) {
    const re = new RegExp(`^\s*${name}\s*=(.*)`, "m");

    if (content.match(re))
      content = content.replace(re, (m, v) => m.replace(v, value));
    else content += `\n${name}=${value}`;
  }

  fs.writeFileSync(dotEnvPath, content);
};

(async () => {
  const clientApp = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_KEY_SECRET!,
  });
  const authLink = await clientApp.generateAuthLink(
    "http://localhost:4194/callback"
  );

  console.log("complete auth flow at:", authLink.url);

  const oauth_verifier = await new Promise<string>((resolve) => {
    const server = http.createServer((req, res) => {
      const u = new URL(req.url!, "http://a");

      const oauth_token = u.searchParams.get("oauth_token");
      const oauth_verifier = u.searchParams.get("oauth_verifier");
      if (
        u.pathname === "/callback" &&
        oauth_token === authLink.oauth_token &&
        oauth_verifier
      ) {
        resolve(oauth_verifier);

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

  const clientAuth = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_KEY_SECRET!,
    accessToken: authLink.oauth_token,
    accessSecret: authLink.oauth_token_secret,
  });

  const { accessToken, accessSecret } = await clientAuth.login(oauth_verifier);

  console.log({ accessToken, accessSecret });

  writeDotEnv(path.join(__dirname, "../.env"), {
    TWITTER_ACCESS_TOKEN: accessToken,
    TWITTER_ACCESS_SECRET: accessSecret,
  });

  console.log("written to .env");
})();
