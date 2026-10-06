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
    const previous=byDate.get(issue.date);
    const visible=new Set([...(issue.topics??[]),...(issue.contextTopics??[])].map(t=>t.id));
    issue.coveredTopics=[...(previous?.coveredTopics??[]),...(previous?.topics??[]),...(previous?.contextTopics??[])].filter(t=>!visible.has(t.id));
    byDate.set(issue.date, issue);
  }
  let coverageNames=[];
  try { coverageNames=await fs.readdir(path.join(root,"data/coverage")); }
  catch(error) { if(error.code!=="ENOENT")throw error; }
  for(const name of coverageNames.filter(name=>/^\d{4}-\d{2}-\d{2}\.json$/.test(name))) {
    const coverage=JSON.parse(await fs.readFile(path.join(root,"data/coverage",name),"utf8"));
    if(name!==`${coverage.date}.json`)throw new Error(`coverage date mismatch: ${name}`);
    const issue=byDate.get(coverage.date);
    if(!issue)throw new Error(`coverage has no archived issue: ${coverage.date}`);
    const visible=new Set([...(issue.topics??[]),...(issue.contextTopics??[])].map(t=>t.id));
    const hidden=[...(issue.coveredTopics??[]),...(coverage.topics??[]).map(t=>({...t,publicationCommit:coverage.publicationCommit}))].filter(t=>!visible.has(t.id));
    issue.coveredTopics=[...new Map(hidden.map(t=>[t.id,t])).values()];
  }
  return [...byDate.values()].sort((a, b) => b.date.localeCompare(a.date));
}
