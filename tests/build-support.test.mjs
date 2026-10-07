import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createStaticServer } from "../scripts/lib/static-server.mjs";
import { checkPdfPages } from "../scripts/lib/pdf-check.mjs";
test("cloud static server serves existing Pages paths and rejects traversal", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "ai-daily-server-"));
  let server;
  try {
    await fs.writeFile(path.join(root, "index.html"), "daily");
    const started = await createStaticServer(root);
    server = started.server;
    const response = await fetch(started.origin + "/ai-daily/");
    assert.equal(await response.text(), "daily");
    const bad = await fetch(started.origin + "/%2e%2e%2foutside");
    assert.equal(bad.status, 403);
  } finally {
    if (server) await new Promise((resolve) => server.close(resolve));
    await fs.rm(root, { recursive: true, force: true });
  }
});
function minimalPdf(pageCount) {
  const objects = [];
  const pageIds = Array.from({ length: pageCount }, (_, i) => i + 3);
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push(
    `<< /Type /Pages /Count ${pageCount} /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] >>`,
  );
  for (const id of pageIds)
    objects.push("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 1152 648] >>");
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1))
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return pdf;
}
test("pdfinfo enforces actual PDF page count at the 50/51 boundary", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "ai-daily-pdf-count-"));
  try {
    for (const count of [50, 51]) {
      const file = path.join(root, `${count}.pdf`);
      await fs.writeFile(file, minimalPdf(count));
      if (count === 50) assert.equal(await checkPdfPages(file), 50);
      else await assert.rejects(checkPdfPages(file), /50 printed pages/);
    }
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});
