import * as fs from "fs";

export const writeDotEnv = (
  dotEnvPath: string,
  env: Record<string, string>
) => {
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
