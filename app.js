const http = require("http");
const fs = require("fs");

const PORT = 3000;
const MESSAGE = process.env.APP_MESSAGE || "Hello from Docker Compose!";
const DATA_FILE = "/data/visits.txt";

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "UP" }));
  }

  if (req.url === "/api" || req.url === "/api/") {
    let visits = 0;

    try {
      visits = Number(fs.readFileSync(DATA_FILE, "utf8")) || 0;
    } catch (error) {
      visits = 0;
    }

    visits += 1;
    fs.writeFileSync(DATA_FILE, String(visits));

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      message: MESSAGE,
      service: "Node.js API",
      visits: visits
    }));
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Node.js API listening on port ${PORT}`);
});
