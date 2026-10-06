import fs from "node:fs/promises";
import path from "node:path";
// Keep the legacy archive byte-for-byte intact. New editions override only
// their own dates, and become history for the next research pass.
export async function readIssues(root) {
  const legacy = JSON.parse(
    await fs.readFile(path.join(root, "data/issues.json"), "utf8"),
  );
  const editionsDir = path.join(root, "data/editions");
  let names = [];
  try {
    names = await fs.readdir(editionsDir);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const byDate = new Map(legacy.map((issue) => [issue.date, issue]));
  for (const name of names
    .filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/.test(name))
    .sort()) {
    const issue = JSON.parse(
      await fs.readFile(path.join(editionsDir, name), "utf8"),
    );
    if (name !== `${issue.date}.json`)
      throw new Error(`edition date mismatch: ${name}`);
    byDate.set(issue.date, issue);
  }
  return [...byDate.values()].sort((a, b) => b.date.localeCompare(a.date));
}
