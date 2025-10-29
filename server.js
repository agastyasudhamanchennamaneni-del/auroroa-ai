import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const BOT_ID = "72fae477-0056-4481-827d-ae436a468aab";
const BOT_API_KEY = "bp_bak_N32vxOuMQ0ps2b6tbxuWg_kp2PiYtk3Nk2fj";

app.post("/api/message", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch(
      `https://api.botpress.cloud/v1/bots/${BOT_ID}/converse`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${BOT_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "text",
          payload: { text: userMessage },
        }),
      }
    );

    // Check if the response is JSON before parsing
    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      console.error("Botpress returned non-JSON:", text);
      return res.status(500).json({ reply: "Error: Unexpected response from Aurora AI" });
    }

    // Extract the bot's reply
    const botReply =
      data.responses?.[0]?.payload?.text || "Aurora AI did not respond.";

    res.json({ reply: botReply });
  } catch (err) {
    console.error("Error contacting Botpress:", err);
    res.status(500).json({ reply: "Error contacting Aurora AI." });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Aurora AI Backend is running!");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
