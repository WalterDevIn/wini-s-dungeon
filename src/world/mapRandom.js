export function randomInt(random, min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

export function createSeededRandom(seed) {
  let state = seed >>> 0;

  return function random() {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

export function pickDirection(random) {
  const directions = ["north", "south", "west", "east"];
  return directions[randomInt(random, 0, directions.length - 1)];
}
