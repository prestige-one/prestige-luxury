/** Uniform reservoir sample: one pass and memory proportional to the requested count. */
export function randomSample<T>(items: Iterable<T>, count: number, random = Math.random): T[] {
  const sample: T[] = [];
  if (count <= 0) return sample;
  let seen = 0;
  for (const item of items) {
    seen++;
    if (sample.length < count) sample.push(item);
    else {
      const index = Math.floor(random() * seen);
      if (index < count) sample[index] = item;
    }
  }
  return sample;
}
