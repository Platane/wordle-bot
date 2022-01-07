export enum Evaluation {
  absent = 0,
  present = 1,
  correct = 2,
}

export const isValid = <T>(
  line: ArrayLike<T>,
  evaluation: ArrayLike<Evaluation>,
  candidate: ArrayLike<T>
) => {
  for (let i = line.length; i--; ) {
    const ei = evaluation[i];
    const li = line[i];
    const ci = candidate[i];

    if (ei === Evaluation.correct && li !== ci) return false;

    if (ei !== Evaluation.correct && li === ci) return false;

    if (ei === Evaluation.present) {
      let ok = false;
      for (let j = line.length; j--; )
        if (candidate[j] === line[i] && evaluation[j] !== Evaluation.correct)
          ok = true;

      if (!ok) return false;
    }
  }

  return true;
};

const av = [false, false, false, false, false];
export const evaluateWord = <T>(
  solution: ArrayLike<T>,
  candidate: ArrayLike<T>,
  evaluation: Evaluation[]
) => {
  for (let i = 0; i < candidate.length; i++) {
    if (candidate[i] === solution[i]) {
      evaluation[i] = Evaluation.correct;
      av[i] = false;
    } else {
      evaluation[i] = Evaluation.absent;
      av[i] = true;
    }
  }

  for (let i = 0; i < candidate.length; i++)
    if (av[i])
      for (let j = 0; j < candidate.length; j++)
        if (
          candidate[j] === solution[i] &&
          evaluation[j] === Evaluation.absent
        ) {
          av[i] = false;
          evaluation[j] = Evaluation.present;
          break;
        }
};

export const isCorrect = (evaluation: Evaluation[]) =>
  evaluation.every((e) => e === Evaluation.correct);
