import { alphabet, Evaluation, Letter } from "./type";

export type C = {
  required: Map<Letter, number>;
  slots: ({ values: Set<Letter> } & (
    | { value: undefined }
    | { value: Letter }
  ))[];
};

export const createEmptyConstraint = (
  length: number,
  _alphabet: Letter[] = alphabet
) =>
  ({
    slots: Array.from({ length }, () => ({ values: new Set(_alphabet) })),
    required: new Map(),
  } as C);

export const copyConstraint = (
  c: C,
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
  c: C,
  word: ArrayLike<Letter>,
  evaluation: Evaluation[]
) => {
  const _required = new Map<Letter, number>();
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

export const reduceConstraint = (c: C): void => {
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

export const isValid = (c: C, word: ArrayLike<Letter>) => {
  for (let j = word.length; j--; ) {
    const slot = c.slots[j];
    if (!slot.values.has(word[j])) return false;
  }

  for (const [letter, requiredCount] of c.required.entries()) {
    let count = 0;
    for (let j = word.length; j--; )
      if (word[j] === letter && c.slots[j].value === undefined) count++;

    if (count < requiredCount) return false;
  }

  return true;
};
