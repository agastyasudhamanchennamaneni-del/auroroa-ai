import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// === CONFIG ===
const BOT_ID = "72fae477-0056-4481-827d-ae436a468aab";
const BOTPRESS_API_KEY = "bp_bak_N32vxOuMQ0ps2b6tbxuWg_kp2PiYtk3Nk2fj";

// === ROUTE ===
app.post("/api/message", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch(`https://api.botpress.cloud/v1/chat/${BOT_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${BOTPRESS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "message",
        payload: {
          text: userMessage,
        },
      }),
    });

    const result = await response.json();

    // Debug if needed
    console.log("🧾 Status:", response.status);
    console.log("🧾 Raw Response:", JSON.stringify(result));

    // Botpress returns array under `responses`
    const reply = result.responses?.[0]?.payload?.text || "⚠️ No response received from Aurora AI.";

    res.json({ reply });
  } catch (error) {
    console.error("❌ Error contacting Botpress:", error);
    res.status(500).json({ reply: "Error contacting Aurora AI." });
  }
});

// === SERVER START ===
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Aurora backend running on port ${PORT}`));
