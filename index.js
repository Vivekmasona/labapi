const chrome = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

module.exports = async (req, res) => {
    if (!req.query.q) {
        return res.status(400).json({ error: "Query missing" });
    }

    let query = req.query.q;
    let url = `https://www.wolframalpha.com/input/?i=${encodeURIComponent(query)}`;

    try {
        const browser = await puppeteer.launch({
            args: chrome.args,
            executablePath: await chrome.executablePath,
            headless: chrome.headless
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "domcontentloaded" });

        let answer = await page.evaluate(() => {
            let el = document.querySelector(".pod .output p");
            return el ? el.innerText.trim() : "No result found!";
        });

        await browser.close();

        res.status(200).json({ query, answer });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch result", details: error.message });
    }
};
