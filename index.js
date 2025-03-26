const express = require("express");
const axios = require("axios");
const cors = require("cors");
const cheerio = require("cheerio");

const app = express();
app.use(cors());

app.get("/calculate", async (req, res) => {
    let query = req.query.q;
    if (!query) return res.json({ error: "Query missing" });

    try {
        let url = `https://www.wolframalpha.com/input/?i=${encodeURIComponent(query)}`;
        let response = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });

        // Parse HTML
        let $ = cheerio.load(response.data);
        let answer = $("img[alt='Input interpretation']").parent().next().find("img").attr("alt");

        res.json({ query, answer: answer || "No result found!" });
    } catch (error) {
        res.json({ error: "Failed to fetch result" });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
