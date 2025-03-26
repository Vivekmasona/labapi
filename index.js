const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// 📌 API Key और Voice ID को Environment Variables से लीजिए (या सीधे डालें)
const ELEVENLABS_API_KEY = "sk_0a0dac7711dd1bb95c80490f48395c1da38d862fe81757fa"; // 👈 अपनी API Key डालें
const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // 👈 अपनी पसंद की Voice ID डालें

app.get("/", (req, res) => {
    res.send("ElevenLabs TTS API is running!");
});

// 🎙️ **Text-to-Speech API**
app.get("/ai", async (req, res) => {
    const text = req.query.text;
    if (!text) return res.status(400).json({ error: "Please provide text as a query parameter." });

    try {
        console.log("🔹 Generating speech for:", text); // ✅ Debug Log

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

        console.log("✅ ElevenLabs Response Status:", response.status);

        if (response.status !== 200) {
            console.error("❌ ElevenLabs API Error:", response.data);
            return res.status(500).json({ error: "Failed to generate speech." });
        }

        // 📌 MP3 File का नाम Random Generate करें
        const fileName = `Vivekfy_ai_${Math.floor(1000 + Math.random() * 9000)}.mp3`;

        // 🎵 MP3 File Return करें
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        res.send(response.data);

    } catch (error) {
        console.error("❌ Error in API:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to generate speech." });
    }
});

// 🚀 Server Start करें
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
