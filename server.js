import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const BOT_ID = "72fae477-0056-4481-827d-ae436a468aab";
const API_KEY = "bp_bak_N32vxOuMQ0ps2b6tbxuWg_kp2PiYtk3Nk2fj";

app.post("/api/message", async (req, res) => {
  const userMessage = req.body.message;

  try {
    // ✅ Create a conversation with the user's message
    const response = await fetch("https://api.botpress.cloud/v1/chat/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        botId: BOT_ID,
        payload: {
          type: "text",
          text: userMessage,
        },
      }),
    });

    const raw = await response.text();
    console.log("🧾 Status:", response.status);
    console.log("🧾 Raw Response:", raw.substring(0, 300));

    if (!response.ok) {
      return res.status(response.status).json({
        reply: `⚠️ Botpress error: ${response.status}.`,
        details: raw.substring(0, 200),
      });
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.error("❌ Failed to parse JSON:", err);
      return res.status(500).json({
        reply: "⚠️ Unexpected non-JSON response from Aurora AI.",
        raw: raw.substring(0, 200),
      });
    }

    const replyText =
      data?.responses?.[0]?.payload?.text ||
      data?.response ||
      "⚠️ No reply received from Aurora AI.";

    res.json({ reply: replyText });
  } catch (error) {
    console.error("💥 Network error contacting Botpress:", error);
    res.status(500).json({ reply: "⚠️ Aurora AI backend connection error." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Aurora AI backend running on port ${PORT}`));
