import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readIssues } from "./lib/issue-data.mjs";
import { assertCloudOutput, selectIssueDates, validateIssue } from "./lib/issue-policy.mjs";
const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const issues = await readIssues(root);
for (const date of selectIssueDates(issues, process.env.AI_DAILY_DATES)) {
  validateIssue(issues.find(issue => issue.date === date), issues);
  const input = path.join(root, `data/editions/${date}.json`);
  await fs.access(input); // Static layout requires an exact, validated edition file.
  const output = assertCloudOutput(path.join(root, date), root);
  const result = await promisify(execFile)("python3", [path.join(root, "scripts/export-pdfs-reportlab.py"), "--issue", input, "--root", root, "--output-dir", output], { timeout: 180000, maxBuffer: 1024 * 1024 });
  process.stdout.write(result.stdout);
}
