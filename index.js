const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/search", async (req, res) => {
    let query = req.query.q;
    if (!query) return res.json({ error: "Query missing" });

    try {
        let url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
        let response = await axios.get(url);
        res.send(response.data);
    } catch (error) {
        res.json({ error: "Failed to fetch results" });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
