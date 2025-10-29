import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Replace these with your actual Botpress credentials
const BOTPRESS_API_KEY = "bp_bak_N32vxOuMQ0ps2b6tbxuWg_kp2PiYtk3Nk2fj";
const BOTPRESS_BOT_ID = "72fae477-0056-4481-827d-ae436a468aab";

app.use(cors());
app.use(express.json());

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ Aurora AI backend is running successfully!");
});

// ✅ Chat route that connects frontend to Botpress
app.post("/api/botpress", async (req, res) => {
  try {
    const { message } = req.body;

    // 🔹 Send the message to Botpress Cloud
    const response = await fetch(
      `https://api.botpress.cloud/v1/bots/${BOTPRESS_BOT_ID}/converse`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${BOTPRESS_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "text",
          payload: { text: message },
        }),
      }
    );

    const text = await response.text();

    // Try to parse JSON safely
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("🪲 Botpress raw response (not JSON):", text);
      throw new Error("Invalid JSON received from Botpress.");
    }

    // Extract reply safely
    const reply =
      data.responses?.[0]?.payload?.text ||
      data.message ||
      "No reply received from Aurora AI.";

    res.json({ reply });
  } catch (error) {
    console.error("❌ Error contacting Botpress:", error);
    res
      .status(500)
      .json({ reply: "⚠️ Error contacting Aurora AI. Please try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Aurora AI backend running on port ${PORT}`);
});
