import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// 🔧 Botpress credentials
const BOT_ID = "72fae477-0056-4481-827d-ae436a468aab";
const API_KEY = "bp_bak_N32vxOuMQ0ps2b6tbxuWg_kp2PiYtk3Nk2fj";

// 🧠 Chat endpoint
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

    // Log full raw response
    const raw = await response.text();
    console.log("🧾 Raw Botpress response:", raw);

    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.error("❌ Failed to parse JSON:", err);
      return res.status(500).json({ reply: "⚠️ Unexpected response from Aurora AI (invalid JSON)." });
    }

    // If Botpress gave a proper text response
    if (data?.responses?.length > 0) {
      const replyText = data.responses.map(r => r.text).join(" ");
      return res.json({ reply: replyText });
    }

    console.warn("⚠️ No reply found in Botpress response:", data);
    return res.json({ reply: "⚠️ No reply received from Aurora AI." });
  } catch (error) {
    console.error("💥 Error contacting Botpress:", error);
    res.status(500).json({ reply: "⚠️ Aurora AI backend error." });
  }
});

// 🌐 Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Aurora AI backend running on port ${PORT}`));
