import { run } from "../automation/run";
import { getWordList } from "../wordlist";

jest.setTimeout(60 * 1000);
it("should solve wordle with automation", async () => {
  const createSolver = (words: string[]) => ({
    getNextWord: () => words[0],
    reportLine: () => undefined,
  });

  const { recordFile } = await run(createSolver, await getWordList());

  expect(recordFile).toBeDefined();
});
