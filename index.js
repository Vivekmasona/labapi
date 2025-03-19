const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const ELEVENLABS_API_KEY = "sk_3e56cc371edd52a93082ed6e63b0d57273bd84a78f6e3305";
const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";

app.get("/ai", async (req, res) => {
    const text = req.query.text;
    if (!text) return res.status(400).json({ error: "Please provide text as a query parameter." });

    try {
        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
            {
                text: text,
                model_id: "eleven_monolingual_v1",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5
                }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "xi-api-key": ELEVENLABS_API_KEY
                },
                responseType: "arraybuffer"
            }
        );

        if (response.status !== 200) {
            return res.status(500).json({ error: "Failed to generate speech." });
        }

        const randomDigits = crypto.randomInt(10000, 99999);
        const filename = `Vivekfy_AI_${randomDigits}.mp3`;
        const filePath = path.join(__dirname, filename);

        fs.writeFileSync(filePath, response.data);
        res.download(filePath, filename, () => fs.unlinkSync(filePath));

    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to generate speech." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
