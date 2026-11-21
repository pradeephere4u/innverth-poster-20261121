// INNVERTH — The Poster for a Place That Isn't There.
// A copy program: it writes the poster image (entry.png, shipped beside this
// file) to /output/entry.png. No network, no randomness, no dependencies
// beyond the Node 22 standard library. The output is byte-identical on
// every run.
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const dest = join(outDir, "entry.png");

if (!existsSync(source)) {
  throw new Error(`entry.png not found next to main.ts (${source})`);
}
if (statSync(source).size === 0) {
  throw new Error("entry.png is empty");
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, dest);

// Sanity check: the written file must be identical to the shipped one.
const a = readFileSync(source);
const b = readFileSync(dest);
if (!a.equals(b)) {
  throw new Error("output entry.png differs from the shipped entry.png");
}

// Gate: the poster must be at most 1 MiB (1,048,576 bytes).
const MAX_BYTES = 1048576;
if (b.length > MAX_BYTES) {
  throw new Error(
    `output entry.png is ${b.length} bytes, over the 1,048,576-byte gate`,
  );
}
console.log(`wrote ${dest} (${b.length} bytes)`);
