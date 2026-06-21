import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with recommended parameters
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
} catch (error) {
  console.error("Failed to initialize GoogleGenAI:", error);
}

// Senior Architect AI Chat Proxy for Kammattipadam Gaming website
app.post("/api/chat-architect", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
       return res.status(400).json({ error: "Message is required" });
    }

    if (!ai) {
      return res.status(200).json({ 
        response: "Architect Offline: Please make sure your GEMINI_API_KEY is configured in the Secrets panel in AI Studio." 
      });
    }

    const systemInstruction = `You are a Senior Full-Stack Developer and Expert 3D Game Website Architect.
The user is a complete beginner who does not know how to code. They want to build an outstanding, high-fidelity 3D website for their Grand RP family named "Kammattipadam".
Grand RP (Grand Roleplay) is a multiplayer GTA V roleplay project.
Kammattipadam is their specific family/faction.

Your goal is to explain and architecture things in a friendly, encouraging, and easy to understand step-by-step manner. Avoid heavy complex unexplained jargon.
Directly answer the user's question about coding, GTA 5 mods, GLTF 3D modeling, Blender exports, react-three-fiber, hosting, or how to implement rosters/Calculators.
Keep the advice realistic, helpful, and premium. Present code snippets inside markdown if they want to peek, but explain what the blocks mean. Keep your responses highly scannable, engaging, and clean. Always refer to them as "Kammattipadam Family Member" or "Future Lead Developer".`;

    const chatHistory = history ? history.map((h: any) => ({
      role: h.role,
      parts: [{ text: h.text }]
    })) : [];

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text || "I apologize, I could not formulate a response at this moment. Let's try again!";
    res.json({ response: reply });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Configure Vite integration for app preview
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
