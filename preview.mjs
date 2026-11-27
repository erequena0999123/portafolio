import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const folder = fileURLToPath(new URL(".", import.meta.url));
const files = new Map([
  ["/", ["dist/index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["dist/index.html", "text/html; charset=utf-8"]],
  ["/style.css", ["dist/style.css", "text/css; charset=utf-8"]],
  ["/projects.js", ["dist/projects.js", "text/javascript; charset=utf-8"]],
  ["/app.js", ["dist/app.js", "text/javascript; charset=utf-8"]],
  ["/cv/cv-es.pdf", ["dist/cv/cv-es.pdf", "application/pdf"]],
  ["/cv/cv-en.pdf", ["dist/cv/cv-en.pdf", "application/pdf"]]
]);

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }
  const url = new URL(request.url, "http://localhost");
  const file = files.get(url.pathname);
  if (!file) {
    response.writeHead(404).end();
    return;
  }

  const [relativePath, type] = file;
  const path = resolve(folder, relativePath);
  const info = await stat(path).catch(() => null);
  if (!info?.isFile()) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, {
    "Content-Type": type,
    "Content-Length": info.size,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  const stream = createReadStream(path);
  stream.on("error", () => response.destroy());
  response.on("close", () => stream.destroy());
  stream.pipe(response);
});

server.listen(4173, "127.0.0.1", () => {
  console.log("Vista local del portafolio: http://127.0.0.1:4173/");
});
