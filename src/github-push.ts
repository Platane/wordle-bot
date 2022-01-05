import { Octokit } from "@octokit/core";
import * as fs from "fs";

export const push = async (path: string, name: string, message = "push") => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN,
  });

  const [owner, repo] = process.env.GITHUB_REPOSITORY!.split("/");
  const repository = { owner, repo };

  const { data: refs } = await octokit.request(
    "GET /repos/{owner}/{repo}/git/matching-refs/{ref}",
    {
      ...repository,
      ref: "",
    }
  );

  const ref = refs.find((r) => r.ref.includes("output"));

  const { sha: lastCommitSha } = ref!.object;

  const {
    data: { tree: lastCommitTree },
  } = await octokit.request(
    "GET /repos/{owner}/{repo}/git/commits/{commit_sha}",
    {
      ...repository,
      commit_sha: lastCommitSha,
    }
  );

  const {
    data: { sha: blobSha },
  } = await octokit.request("POST /repos/{owner}/{repo}/git/blobs", {
    ...repository,
    content: fs.readFileSync(path, "base64").toString(),
    encoding: "base64",
  });

  const {
    data: { sha: treeSha },
  } = await octokit.request("POST /repos/{owner}/{repo}/git/trees", {
    ...repository,
    base_tree: lastCommitTree.sha,
    tree: [
      {
        path: name,
        mode: "100644",
        type: "blob",
        sha: blobSha,
      },
    ],
  });

  const {
    data: { sha: commitSha },
  } = await octokit.request("POST /repos/{owner}/{repo}/git/commits", {
    ...repository,
    tree: treeSha,
    parents: [lastCommitSha],
    message,
    author: {
      name: "wordle-bot",
      email: "me+wordle-bot@platane.me",
    },
    committer: {
      name: "wordle-bot",
      email: "me+wordle-bot@platane.me",
    },
  });

  await octokit.request("PATCH /repos/{owner}/{repo}/git/refs/{ref}", {
    ...repository,
    ref: ref!.ref.split("refs/")[1],
    sha: commitSha,
    force: true,
  });

  return `https://github.com/${repository.owner}/${repository.repo}/blob/${commitSha}/${name}?raw=true`;
};
