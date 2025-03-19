const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

// ElevenLabs API Credentials
const ELEVENLABS_API_KEY = "sk_3e56cc371edd52a93082ed6e63b0d57273bd84a78f6e3305";
const VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Voice ID

app.get("/ai", async (req, res) => {
    const text = req.query.text;
    if (!text) return res.status(400).json({ error: "Please provide text as a query parameter." });

    try {
        // Request to ElevenLabs API
        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
            {
                text: text,
                model_id: "eleven_monolingual_v1",
                voice_settings: {
                    stability: 0.8,
                    similarity_boost: 0.8
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

        // Generate random filename
        const randomDigits = crypto.randomInt(10000, 99999);
        const filename = `Vivekfy_AI_${randomDigits}.mp3`;
        const filePath = path.join(__dirname, filename);

        // Save the file locally
        fs.writeFileSync(filePath, response.data);

        // Send file for download
        res.download(filePath, filename, (err) => {
            if (err) console.error("Download error:", err);
            fs.unlinkSync(filePath); // Delete file after download
        });

    } catch (error) {
        console.error("TTS API Error:", error);
        res.status(500).json({ error: "Failed to generate speech." });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
