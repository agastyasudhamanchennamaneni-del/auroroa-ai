import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Botpress API proxy route
app.post("/api/botpress", async (req, res) => {
  const { botId, message } = req.body;

  if (!botId || !message) {
    return res.status(400).json({ error: "Missing botId or message" });
  }

  try {
    const response = await fetch(`https://api.botpress.cloud/v1/bots/${botId}/converse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer bp_bak_N32vxOuMQ0ps2b6tbxuWg_kp2PiYtk3Nk2fj`
      },
      body: JSON.stringify({ type: "text", text: message })
    });

    const data = await response.json();
    const reply = data.responses?.[0]?.payload?.text || "No response from Botpress.";

    res.json({ reply });
  } catch (error) {
    console.error("Error contacting Botpress:", error);
    res.status(500).json({ error: "Failed to contact Botpress." });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Aurora AI backend running on port ${PORT}`));

