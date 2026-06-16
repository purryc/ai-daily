import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { chromium } from "playwright";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const dataPath = path.join(root, "data", "issues.json");
const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".json", "application/json; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".pdf", "application/pdf"],
  [".png", "image/png"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".webp", "image/webp"]
]);

function createStaticServer() {
  const server = http.createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url, "http://127.0.0.1");
      let pathname = decodeURIComponent(requestUrl.pathname);
      if (pathname.endsWith("/")) pathname += "index.html";
      const filePath = path.normalize(path.join(root, pathname));
      if (!filePath.startsWith(root)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
      }
      const contents = await fs.readFile(filePath);
      response.writeHead(200, { "content-type": mimeTypes.get(path.extname(filePath)) ?? "application/octet-stream" });
      response.end(contents);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({ server, origin: `http://127.0.0.1:${address.port}` });
    });
  });
}

const { server, origin } = await createStaticServer();
const tmpRoot = path.join(root, ".tmp-chrome-pdf");
await fs.rm(tmpRoot, { recursive: true, force: true });
await fs.mkdir(tmpRoot, { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  for (const issue of issues) {
    for (const locale of ["zh", "en"]) {
      const output = path.join(root, issue.date, `ai-daily-${issue.date}-${locale}.pdf`);
      await fs.rm(output, { force: true });

      const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
      await page.goto(`${origin}/${issue.date}/${locale}/`, { waitUntil: "networkidle", timeout: 30_000 });
      await page.emulateMedia({ media: "print" });
      await page.pdf({
        path: output,
        printBackground: true,
        preferCSSPageSize: true,
        width: "16in",
        height: "9in",
        margin: { top: "0", right: "0", bottom: "0", left: "0" },
        timeout: 60_000
      });
      await page.close();

      const stats = await fs.stat(output);
      if (stats.size < 10_000) {
        throw new Error(`${output} looks too small to be a valid deck PDF`);
      }
      console.log(`Exported ${path.relative(root, output)} (${Math.round(stats.size / 1024)} KB)`);
    }
  }
} finally {
  await browser.close();
  server.close();
  await fs.rm(tmpRoot, { recursive: true, force: true });
}
