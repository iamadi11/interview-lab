/**
 * Web Worker — offload CPU-heavy work from the main thread.
 * Classic interview demo: don't block UI during expensive computations.
 *
 * Usage in a component:
 *   const worker = new Worker(new URL("@/workers/heavy.worker.ts", import.meta.url), { type: "module" });
 *   worker.postMessage({ type: "SORT", payload: largeArray });
 *   worker.onmessage = (e) => console.log(e.data);
 */

type WorkerMessage =
  | { type: "SORT"; payload: number[] }
  | { type: "FIBONACCI"; payload: number }
  | { type: "PRIME_COUNT"; payload: number };

function fibonacci(n: number): number {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) { const t = a + b; a = b; b = t; }
  return b;
}

function countPrimes(n: number): number {
  const sieve = new Uint8Array(n + 1).fill(1);
  sieve[0] = sieve[1] = 0;
  for (let i = 2; i * i <= n; i++) {
    if (sieve[i]) for (let j = i * i; j <= n; j += i) sieve[j] = 0;
  }
  return sieve.reduce((sum, v) => sum + v, 0);
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { type, payload } = e.data;
  switch (type) {
    case "SORT":
      self.postMessage({ type: "SORT_RESULT", result: [...payload].sort((a, b) => a - b) });
      break;
    case "FIBONACCI":
      self.postMessage({ type: "FIBONACCI_RESULT", result: fibonacci(payload) });
      break;
    case "PRIME_COUNT":
      self.postMessage({ type: "PRIME_COUNT_RESULT", result: countPrimes(payload) });
      break;
  }
};
