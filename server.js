import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const BOT_ID = "72fae477-0056-4481-827d-ae436a468aab";
const API_KEY = "bp_bak_N32vxOuMQ0ps2b6tbxuWg_kp2PiYtk3Nk2fj";

app.post("/api/message", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch(
      `https://api.botpress.cloud/v1/bots/${BOT_ID}/converse/latest`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "text",
          payload: userMessage,
        }),
      }
    );

    const text = await response.text(); // 👈 Read as plain text first
    let data;

    try {
      data = JSON.parse(text); // Try parsing JSON
    } catch (e) {
      console.error("❌ Failed to parse JSON:", e);
      console.log("🧾 Raw Response:", text);
      return res.status(500).json({ reply: "Unexpected response from Aurora AI." });
    }

    // Extract bot reply safely
    const reply =
      data?.responses?.[0]?.payload?.text ||
      data?.payload?.text ||
      data?.text ||
      "No response from Aurora AI.";

    res.json({ reply });
  } catch (error) {
    console.error("❌ Error contacting Botpress:", error);
    res.status(500).json({ reply: "Error contacting Aurora AI." });
  }
});

app.get("/", (req, res) => {
  res.send("🚀 Aurora backend running successfully!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
