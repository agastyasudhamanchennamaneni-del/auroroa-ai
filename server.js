import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 10000;

// 🔐 Botpress Cloud credentials
const BOT_ID = "72fae477-0056-4481-827d-ae436a468aab";
const BOT_API_KEY = "bp_bak_N32vxOuMQ0ps2b6tbxuWg_kp2PiYtk3Nk2fj";

// ✅ Route to handle frontend messages
app.post("/api/message", async (req, res) => {
  const userMessage = req.body.message;
  console.log("🧠 Incoming message:", userMessage);

  try {
    const response = await fetch(
      `https://api.botpress.cloud/v1/chat/${BOT_ID}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${BOT_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "text",
          text: userMessage,
        }),
      }
    );

    const text = await response.text();
    console.log("🧾 Raw Response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("❌ Failed to parse JSON. Response was not JSON.");
      return res.status(500).json({
        error: "Invalid Botpress response",
        raw: text,
      });
    }

    // Extract bot reply
    const reply =
      data?.responses?.[0]?.text ||
      data?.response?.text ||
      "No reply received from Aurora AI.";

    res.json({ reply });
  } catch (error) {
    console.error("🚨 Server error:", error);
    res.status(500).json({ error: "Server error contacting Aurora AI." });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Aurora Medical AI backend is live and connected to Botpress Cloud!");
});

app.listen(PORT, () => {
  console.log(`🚀 Aurora backend running on port ${PORT}`);
});
