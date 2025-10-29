import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// 🔧 Your Botpress credentials
const BOT_ID = "72fae477-0056-4481-827d-ae436a468aab";
const API_KEY = "bp_bak_N32vxOuMQ0ps2b6tbxuWg_kp2PiYtk3Nk2fj";

// 🧠 Route to handle messages from frontend
app.post("/api/message", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch(`https://api.botpress.cloud/v1/bots/${BOT_ID}/converse`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "text",
        text: userMessage,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!data) {
      return res.status(500).json({ reply: "⚠️ Unexpected response from Aurora AI." });
    }

    // Check for valid Botpress message
    if (data?.responses?.length > 0) {
      const replyText = data.responses.map(r => r.text).join(" ");
      return res.json({ reply: replyText });
    }

    return res.json({ reply: "⚠️ No reply received from Aurora AI." });
  } catch (error) {
    console.error("Error contacting Botpress:", error);
    res.status(500).json({ reply: "⚠️ Aurora AI is currently unreachable." });
  }
});

// 🌐 Render deployment port
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Aurora AI backend running on port ${PORT}`));
