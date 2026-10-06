import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { generateIssue } from "../scripts/create-issue.mjs";
const input = {
  date: "2026-10-06",
  cutoff: "2026-10-06T12:00:00-04:00",
  timezone: "America/Toronto",
  zhTitle: "日报",
  enTitle: "Daily",
  zhSummary: "已核实更新",
  enSummary: "Verified updates",
  candidates: [],
  laneScans: [],
};
test("empty daily never clones yesterday, preserves archive bytes and is idempotent", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "ai-daily-test-"));
  try {
    await fs.mkdir(path.join(root, "data"));
    const historical = JSON.stringify([
      { date: "2026-10-05", topics: [{ id: "old" }] },
    ]);
    await fs.writeFile(path.join(root, "data/issues.json"), historical);
    const result = await generateIssue({ root, input });
    assert.equal(result.issue.topics.length, 0);
    assert.equal(
      await fs.readFile(path.join(root, "data/issues.json"), "utf8"),
      historical,
    );
    const destination = path.join(root, "data/editions/2026-10-06.json");
    const before = await fs.readFile(destination, "utf8");
    await generateIssue({ root, input });
    assert.equal(await fs.readFile(destination, "utf8"), before);
    assert.match(result.issue.enSummary, /No verified new/);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});
test("invalid input fails before creating an edition or touching archive", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "ai-daily-test-"));
  try {
    await fs.mkdir(path.join(root, "data"));
    await fs.writeFile(path.join(root, "data/issues.json"), "[]");
    await assert.rejects(
      generateIssue({ root, input: { ...input, cutoff: "tomorrow" } }),
      /cutoff/,
    );
    await assert.rejects(
      fs.access(path.join(root, "data/editions/2026-10-06.json")),
    );
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});
