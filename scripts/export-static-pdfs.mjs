import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import os from "node:os";
import { buildVisualSlides, buildReferenceIndex, contentsLabel } from "./lib/issue-visuals.mjs";
import { allIssueTopics } from "./lib/topic-content.mjs";
import { readIssues } from "./lib/issue-data.mjs";
import { assertCloudOutput, selectIssueDates, validateIssue } from "./lib/issue-policy.mjs";
const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const issues = await readIssues(root);
for (const date of selectIssueDates(issues, process.env.AI_DAILY_DATES)) {
  const issue=issues.find(issue => issue.date === date);
  validateIssue(issue, issues);
  const input = path.join(root, `data/editions/${date}.json`);
  await fs.access(input); // Static layout requires an exact, validated edition file.
  const output = assertCloudOutput(path.join(root, date), root);
  const plans=["zh","en"].map(locale=>buildVisualSlides(issue,locale).map(({id,type,topicIds})=>({id,type,topicIds})));
  if(JSON.stringify(plans[0])!==JSON.stringify(plans[1]))throw new Error("Bilingual editorial page plans differ");
  const temp=await fs.mkdtemp(path.join(os.tmpdir(),"daily-shared-page-plan-"));
  try {
    const planFile=path.join(temp,"page-plan.json");
    await fs.writeFile(planFile,JSON.stringify(plans[0]));
    const referenceFile=path.join(temp,"reference-index.json");
    await fs.writeFile(referenceFile,JSON.stringify(buildReferenceIndex(issue)));
    const labelsFile=path.join(temp,"contents-labels.json");
    await fs.writeFile(labelsFile,JSON.stringify(Object.fromEntries(allIssueTopics(issue).map(topic=>[topic.id,{zh:contentsLabel(topic,"zh"),en:contentsLabel(topic,"en")}]))));
    const result = await promisify(execFile)("python3", [path.join(root, "scripts/export-pdfs-reportlab.py"), "--issue", input, "--root", root, "--output-dir", output,"--page-plan",planFile,"--reference-index",referenceFile,"--contents-labels",labelsFile], { timeout: 180000, maxBuffer: 1024 * 1024 });
    process.stdout.write(result.stdout);
  } finally { await fs.rm(temp,{recursive:true,force:true}); }
}
