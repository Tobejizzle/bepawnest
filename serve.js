/* Minimal zero-dependency static file server for local preview.
   Usage: node serve.js [port]   (serves this folder) */
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = process.argv[2] || 4173;
const types = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".svg": "image/svg+xml", ".json": "application/json", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".ico": "image/x-icon",
  ".xml": "application/xml", ".txt": "text/plain"
};

http.createServer((req, res) => {
  let url = decodeURIComponent(req.url.split("?")[0]);
  if (url === "/") url = "/index.html";
  const file = path.join(root, path.normalize(url));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end("Forbidden"); }
  fs.readFile(file, (err, data) => {
    if (err) {
      // serve branded 404 if present
      fs.readFile(path.join(root, "404.html"), (e2, body) => {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(e2 ? "Not found" : body);
      });
      return;
    }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
}).listen(port, () => console.log(`Serving ${root} at http://localhost:${port}`));
