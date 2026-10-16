import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createStaticServer } from "../scripts/lib/static-server.mjs";
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
