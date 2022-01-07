export const shuffle = <T>(arr: T[]) => {
  for (let i = arr.length; i--; ) {
    const j = Math.floor(Math.random() * i);

    const tmp = arr[j];
    arr[j] = arr[i];
    arr[i] = tmp;
  }
};
