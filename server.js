const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/generate", (req, res) => {
    const { content } = req.body; // Client se aane wala content

    const htmlResponse = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ElevenLabs Voice Agent</title>
    </head>
    <body>
        <h1>Generated Page</h1>
        <p>${content}</p>
        
        <elevenlabs-convai agent-id="cqldvRaqnFa6lgvRN6In"></elevenlabs-convai>
        <script src="https://cdn.jsdelivr.net/gh/Vivekmasona/vfytts/2.js" async type="text/javascript"></script>
    </body>
    </html>
    `;

    res.send(htmlResponse);
});

// Server ko start karna
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
