import { run } from "./automation/run";
import { createSolver } from "./solver";
import { getWordList } from "./wordlist";

(async () => {
  const wordList = await getWordList();

  const res = await run(createSolver, wordList);

  console.log(res);
})();
