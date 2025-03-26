const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 ElevenLabs API Details (Replace with Your API Key)
const ELEVENLABS_API_KEY = "sk_0a0dac7711dd1bb95c80490f48395c1da38d862fe81757fa"; 
const VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Default ElevenLabs Voice ID

app.use(cors()); // ✅ Fix CORS issues

// 🔹 Test Route
app.get("/", (req, res) => {
    res.send("✅ ElevenLabs TTS API is Running!");
});

// 🎙️ **Text-to-Speech Route**
app.get("/tts", async (req, res) => {
    const text = req.query.text;
    if (!text) return res.status(400).json({ error: "❌ Please provide text as a query parameter." });

    try {
        console.log("🔹 Converting Text to Speech:", text);

        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
            {
                text: text,
                model_id: "eleven_monolingual_v1",
                voice_settings: { stability: 0.5, similarity_boost: 0.5 }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "xi-api-key": ELEVENLABS_API_KEY
                },
                responseType: "arraybuffer"
            }
        );

        console.log("✅ API Response Status:", response.status);

        // 🎵 Send MP3 File
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Content-Disposition", 'attachment; filename="tts_audio.mp3"');
        res.send(response.data);

    } catch (error) {
        console.error("❌ Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "❌ Failed to generate speech." });
    }
});

// 🚀 Start Server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
