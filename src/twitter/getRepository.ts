import { readPackageJson } from "github-secret-dotenv/lib/readPackageJson";

const readRepository = () => {
  const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? "").split("/");
  if (!repo) return undefined;
  return { owner, repo };
};

export const getRepository = () => ({
  ...readRepository(),
  ...readPackageJson()!,
});
