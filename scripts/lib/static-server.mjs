import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
const types = new Map([
  [".css", "text/css"],
  [".html", "text/html"],
  [".json", "application/json"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".avif", "image/avif"],
  [".svg", "image/svg+xml"],
  [".md", "text/plain"],
  [".pdf", "application/pdf"],
]);
export async function createStaticServer(root) {
  const server = http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url, "http://127.0.0.1");
      let pathname = decodeURIComponent(url.pathname).replace(
        /^\/ai-daily(?=\/|$)/,
        "",
      );
      if (pathname.endsWith("/")) pathname += "index.html";
      const file = path.resolve(root, "." + pathname);
      const relative = path.relative(root, file);
      if (relative.startsWith("..") || path.isAbsolute(relative)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
      }
      const contents = await fs.readFile(file);
      response.writeHead(200, {
        "content-type":
          types.get(path.extname(file)) ?? "application/octet-stream",
      });
      response.end(contents);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  return { server, origin: `http://127.0.0.1:${server.address().port}` };
}
