// The Funniest Out-of-Office — make.fun entry
// Writes the single-line out-of-office auto-reply to <OUTPUT_DIR>/entry.txt.
// No dependencies, no network. Node 22.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry, exactly as specified in the design spec: a confession smuggled
// inside a real auto-reply shape — the first honest thing the auto-reply
// has ever said, closed by a promise it clearly will not keep.
const ENTRY =
  "I am out of the office, which is the first honest thing I have said in an auto-reply all year. I will respond when I remember how.";

const MIN_CHARS = 1;
const MAX_CHARS = 140;
const OUTPUT_FILE = "entry.txt";

function fail(message: string): never {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function validateEntry(text: string): void {
  // Count Unicode code points, not UTF-16 code units, so the gate's
  // character count matches what the scorer sees.
  const chars = [...text];

  if (chars.length < MIN_CHARS || chars.length > MAX_CHARS) {
    fail(
      `entry is ${chars.length} characters, outside the ${MIN_CHARS}-${MAX_CHARS} gate`,
    );
  }
  if (!text.trim()) {
    fail("entry must not be only whitespace");
  }
  // A stray leading or trailing space would be invisible in the file yet
  // change the judged text, so the entry must start and end visible.
  if (text !== text.trim()) {
    fail("entry has leading or trailing whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    fail("entry must be a single line");
  }
  // Control characters would break the "one line of plain text" reading,
  // so reject them outright — including the Unicode line/paragraph
  // separators U+2028/U+2029, which split a line for many readers even
  // though they are not \n.
  for (const ch of chars) {
    const code = ch.codePointAt(0)!;
    if (code < 0x20 || code === 0x7f || code === 0x2028 || code === 0x2029) {
      fail(`entry contains disallowed character U+${code.toString(16).toUpperCase().padStart(4, "0")}`);
    }
  }
}

function main(): void {
  validateEntry(ENTRY);

  const outDir = process.env.OUTPUT_DIR ?? "/output";
  // Never remove the output dir itself (it may be a grader mount point):
  // create it if missing and write inside it.
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, OUTPUT_FILE);

  // Write the line exactly, with no trailing newline: the file content
  // is the line and nothing else.
  writeFileSync(outPath, ENTRY, "utf8");

  // Read back and verify byte-for-byte before declaring success: compare
  // the raw bytes, not just the decoded string, so a stray BOM or
  // trailing newline cannot slip through unnoticed.
  const writtenBytes = readFileSync(outPath);
  const expectedBytes = Buffer.from(ENTRY, "utf8");
  if (!writtenBytes.equals(expectedBytes)) {
    fail("verification failed: entry.txt does not match the entry exactly");
  }

  console.log(
    `OK: wrote ${[...ENTRY].length} characters, 1 line, to ${outPath}`,
  );
  console.log(ENTRY);
}

main();
