import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const BOTPRESS_API_KEY = process.env.BOTPRESS_API_KEY;
const BOT_ID = process.env.BOT_ID; // you’ll get this from Botpress dashboard

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch(`https://api.botpress.cloud/v1/bots/${BOT_ID}/converse`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${BOTPRESS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "text",
        payload: message,
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error contacting Botpress API" });
  }
});

app.get("/", (req, res) => {
  res.send("Aurora Medical AI backend is live!");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
