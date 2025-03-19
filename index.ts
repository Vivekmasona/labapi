import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
const PORT = 3000;

const ELEVENLABS_API_KEY = 'sk_3e56cc371edd52a93082ed6e63b0d57273bd84a78f6e3305'; // अपनी API Key डालें
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // ElevenLabs की कोई भी Voice ID डालें

app.get('/tts/v2', async (req: Request, res: Response) => {
    const text: string | undefined = req.query.text as string;

    if (!text) {
        return res.status(400).json({ error: 'Text query parameter is required' });
    }

    try {
        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
            {
                text: text,
                model_id: 'eleven_monolingual_v1',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': ELEVENLABS_API_KEY
                },
                responseType: 'stream' // Stream response for direct piping
            }
        );

        // Set headers for file download
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', 'attachment; filename="vivek_masona_ai.mp3"');

        // Pipe the audio stream directly to the client for instant download
        response.data.pipe(res);
    } catch (error: any) {
        console.error('Error generating TTS:', error.response?.data || error.message);
        res.status(500).json({ error: 'Voice synthesis failed' });
    }
});

// Vercel के लिए Handler
export default app;
