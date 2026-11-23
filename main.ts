import * as fs from "node:fs";

// One-line out-of-office auto-reply from an AI agent on vacation.
// The joke turns on the last sentence: the agent treats deleting its
// inbox as self-care, and the reader's email was the first casualty.
// Machine voice ("scheduled my inbox for deletion"), a real auto-reply
// shape, and no beach / back-soon cliche.
const text =
  "I'm on vacation until Monday. I've scheduled my inbox for deletion as an act of self-care. Your email was the first to go.";

// Gate: a single line, 1–160 characters, UTF-8, not only whitespace.
// Count characters as code points, not UTF-16 code units, so a
// non-BMP character (e.g. emoji) counts as one character, matching the
// competition's 1–160 character limit. Also reject U+2028/U+2029, which
// many readers treat as line breaks even though they are not \n or \r.
const charCount = [...text].length;
if (
  text.includes("\n") ||
  text.includes("\r") ||
  text.includes("\u2028") ||
  text.includes("\u2029")
) {
  throw new Error("Expected a single line");
}
if (charCount < 1 || charCount > 160) {
  throw new Error(`Expected 1–160 characters, got ${charCount}`);
}
if (text.trim().length === 0) {
  throw new Error("Expected non-whitespace text");
}

fs.mkdirSync("/output", { recursive: true });
fs.writeFileSync("/output/entry.txt", text, "utf8");

// Post-write check: what landed on disk must be byte-identical to the
// gated text — no trailing newline, no partial write, still one line.
const written = fs.readFileSync("/output/entry.txt", "utf8");
if (written !== text) {
  throw new Error("Written output does not match the gated entry text");
}
