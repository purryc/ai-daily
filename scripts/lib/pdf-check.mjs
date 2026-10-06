import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createHash } from "node:crypto";
import { validatePageCount } from "./issue-policy.mjs";
const exec = promisify(execFile);
export function validatePdfExportMetadata({ metadata, date, locale, sourceBytes, pdfPages, htmlPages }) {
  validatePageCount(pdfPages);
  validatePageCount(htmlPages);
  const renderer = metadata?.renderer ?? "chromium";
  if (!["chromium", "reportlab"].includes(renderer)) throw new Error("Unknown PDF export renderer");
  if (metadata) {
    if (metadata.date !== date) throw new Error("Stale PDF export date");
    if (metadata.sourceDataSha256 !== createHash("sha256").update(sourceBytes).digest("hex"))
      throw new Error("PDF export source hash mismatch");
    if (metadata.pages?.[locale] !== pdfPages) throw new Error("PDF export actual page count mismatch");
  }
  if (renderer === "chromium" && pdfPages !== htmlPages) throw new Error("PDF/HTML page mismatch");
  return renderer;
}
export async function checkPdfPages(file) {
  let stdout;
  try {
    ({ stdout } = await exec("pdfinfo", [file], { maxBuffer: 1024 * 1024 }));
  } catch (error) {
    if (error.code === "ENOENT")
      throw new Error(
        "PDF validation needs Poppler pdfinfo on the cloud build machine",
      );
    throw error;
  }
  const count = Number(stdout.match(/^Pages:\s+(\d+)\s*$/m)?.[1]);
  validatePageCount(count);
  return count;
}
