const http = require("http");
const https = require("https");
const cheerio = require("cheerio");

const server = http.createServer((req, res) => {
    if (!req.url.startsWith("/calculate?q=")) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid endpoint" }));
    }

    let query = decodeURIComponent(req.url.split("=")[1]);

    if (!query) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Query missing" }));
    }

    let url = `https://www.wolframalpha.com/input/?i=${encodeURIComponent(query)}`;

    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (response) => {
        let data = "";

        response.on("data", (chunk) => (data += chunk));
        response.on("end", () => {
            let $ = cheerio.load(data);
            let answer = $(".pod").first().find(".output p").text().trim();

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ query, answer: answer || "No result found!" }));
        });
    }).on("error", (err) => {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to fetch result" }));
    });
});

server.listen(3000, () => console.log("Server running on port 3000"));
