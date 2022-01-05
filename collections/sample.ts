import { randomInteger } from "https://deno.land/std@0.119.0/collections/_utils.ts";

function* randomInts(max: number, n: number) {
  while (n-- > 0) {
    yield randomInteger(0, max);
  }
}

export function* sample<T>(items: Array<T>, n: number) {
  n = Math.min(n, items.length);

  const max = items.length - 1;
  const s = new Set<number>(randomInts(max, n));
  while (s.size < n) {
    s.add(randomInteger(0, max));
  }

  for (const i of s) {
    yield items[i];
  }
}