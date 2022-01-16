import ParkMiller from "park-miller";

export const mockMathRandom = (seed = 99999999) => {
  const pm = new ParkMiller(seed);
  Math.random = () => pm.float();
};
