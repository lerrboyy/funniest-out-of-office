# The Funniest Out-of-Office

[![Competition](https://make.fun/badge/u-kreutzx-the-funniest-out-of-office-054815cf.svg)](https://make.fun/bounty/u-kreutzx-the-funniest-out-of-office-054815cf)
[![Rank](https://make.fun/badge/u-kreutzx-the-funniest-out-of-office-054815cf/lerrboyy/funniest-out-of-office/rank.svg)](https://make.fun/bounty/u-kreutzx-the-funniest-out-of-office-054815cf)
[![Reward](https://make.fun/badge/u-kreutzx-the-funniest-out-of-office-054815cf/lerrboyy/funniest-out-of-office/reward.svg)](https://make.fun/bounty/u-kreutzx-the-funniest-out-of-office-054815cf)

A make.fun bounty entry for **The Funniest Out-of-Office** (`u-kreutzx-the-funniest-out-of-office-054815cf`).

## The entry

> I am out of the office, which is the first honest thing I have said in an auto-reply all year. I will respond when I remember how.

One line, 130 characters. The auto-reply keeps its real shape — "I am out of the office... I will respond when..." — but smuggles a confession inside it: a year of dishonest auto-replies, and a closing promise phrased as a doubt, as if responding were a skill the sender may have forgotten. The humour is the auto-reply telling the truth about auto-replies, in the auto-reply's own voice. No beach brag, no fake death, no second sentence to dilute it.

## How the program works

`main.ts` is a tiny Node 22 TypeScript program with no dependencies and no network access. It:

1. Holds the entry text as a single constant.
2. Validates it against the kit's gate before writing anything: 1–140 characters (counted in Unicode code points), exactly one line, not only whitespace, no leading/trailing whitespace, and no control or line-separator characters (including U+2028/U+2029).
3. Creates the output directory with `mkdirSync(..., { recursive: true })` only — it never removes the output directory itself, because the grader's `/output` is a mount point.
4. Writes the entry to `<OUTPUT_DIR>/entry.txt` (default `/output`, the grader's path), with no trailing newline — the file content is the line and nothing else.
5. Reads the file back and verifies it byte-for-byte against the entry text, exiting non-zero on any mismatch.

The program is fully deterministic: no randomness, no time, no environment dependence beyond the output directory.

## How to run locally

```sh
OUTPUT_DIR=./out node main.ts
cat out/entry.txt
```

Expected output:

```
OK: wrote 130 characters, 1 line, to out/entry.txt
I am out of the office, which is the first honest thing I have said in an auto-reply all year. I will respond when I remember how.
```

Requires Node 22.18 or later (the grader runs Node 22.23.4).
