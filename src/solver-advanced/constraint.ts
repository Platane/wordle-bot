import { alphabet, Evaluation } from "./type";

export type Constraint = {
  required: Map<string, number>;
  slots: ({ values: Set<string> } & (
    | { value: undefined }
    | { value: string }
  ))[];
};

export const createEmptyConstraint = (length: number, _alphabet = alphabet) =>
  ({
    slots: Array.from({ length }, () => ({ values: new Set(_alphabet) })),
    required: new Map(),
  } as Constraint);

export const copyConstraint = (
  c: Constraint,
  target = createEmptyConstraint(c.slots.length)
) => {
  for (let j = c.slots.length; j--; ) {
    target.slots[j].value = c.slots[j].value;
    target.slots[j].values.clear();

    for (const letter of c.slots[j].values) target.slots[j].values.add(letter);
  }

  target.required.clear();
  for (const [letter, i] of c.required) target.required.set(letter, i);

  return target;
};

export const addConstraintLine = (
  c: Constraint,
  word: string,
  evaluation: Evaluation[]
) => {
  const _required = new Map<string, number>();
  for (let j = word.length; j--; ) {
    const letter = word[j];
    const slot = c.slots[j];

    switch (evaluation[j]) {
      case Evaluation.absent: {
        let letterPresentElsewhere = false;
        for (let j0 = word.length; j0--; )
          if (
            j !== j0 &&
            word[j0] === letter &&
            evaluation[j0] === Evaluation.present
          )
            letterPresentElsewhere = true;

        if (letterPresentElsewhere) slot.values.delete(letter);
        else {
          for (let j = word.length; j--; )
            if (c.slots[j].value === undefined)
              c.slots[j].values.delete(letter);
        }

        break;
      }

      case Evaluation.correct: {
        if (slot.value === undefined) {
          slot.values.clear();
          slot.values.add(letter);
          (slot as any).value = letter;

          const newCount = (c.required.get(letter) ?? 0) - 1;
          if (newCount <= 0) c.required.delete(letter);
          else c.required.set(letter, newCount);
        }

        break;
      }

      case Evaluation.present: {
        _required.set(letter, (_required.get(letter) ?? 0) + 1);
        slot.values.delete(letter);

        break;
      }
    }
  }

  for (let [letter, newCount] of _required) {
    for (let j = word.length; j--; )
      if (c.slots[j].value === letter && word[j] !== letter) newCount--;

    const count = c.required.get(letter) ?? 0;

    if (newCount > count) c.required.set(letter, newCount);
  }
};

export const reduceConstraint = (c: Constraint): void => {
  for (const [letter, count] of c.required) {
    let jValid = -1;

    for (let j = c.slots.length; j--; ) {
      const slot = c.slots[j];

      if (slot.value === undefined && slot.values.has(letter)) {
        if (jValid === -1) jValid = j;
        else jValid = -2;
      }
    }

    if (jValid >= 0) {
      if (count > 1) c.required.set(letter, count - 1);
      else c.required.delete(letter);

      const slot = c.slots[jValid];

      slot.values.clear();
      slot.values.add(letter);
      slot.value = letter;

      return reduceConstraint(c);
    }
  }
};

export const isValid = (c: Constraint, word: string) => {
  for (let j = word.length; j--; ) {
    const slot = c.slots[j];
    if (!slot.values.has(word[j])) return false;
  }

  for (const [letter, requiredCount] of c.required) {
    let count = 0;
    for (let j = word.length; j--; )
      if (word[j] === letter && c.slots[j].value === undefined) count++;

    if (count < requiredCount) return false;
  }

  return true;
};

const av = [false, false, false, false, false];
export const evaluateWord = (
  solution: string,
  word: string,
  target: Evaluation[]
) => {
  for (let i = 0; i < word.length; i++) {
    if (word[i] === solution[i]) {
      target[i] = Evaluation.correct;
      av[i] = false;
    } else {
      target[i] = Evaluation.absent;
      av[i] = true;
    }
  }

  for (let i = 0; i < word.length; i++)
    if (av[i])
      for (let j = 0; j < word.length; j++)
        if (word[j] === solution[i] && target[j] === Evaluation.absent) {
          av[i] = false;
          target[j] = Evaluation.present;
          break;
        }

  return target;
};
