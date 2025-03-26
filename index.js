const http = require("http");
const puppeteer = require("puppeteer");

const server = http.createServer(async (req, res) => {
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

    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "domcontentloaded" });

        // Wait for Wolfram answer to load
        await page.waitForSelector(".pod", { timeout: 5000 });

        // Extract the result
        let answer = await page.evaluate(() => {
            let el = document.querySelector(".pod .output p");
            return el ? el.innerText.trim() : "No result found!";
        });

        await browser.close();

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ query, answer }));
    } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to fetch result", details: error.message }));
    }
});

server.listen(3000, () => console.log("Server running on port 3000"));
