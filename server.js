import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const BOTPRESS_API_KEY = process.env.BOTPRESS_API_KEY;
const BOTPRESS_BOT_ID = "72fae477-0056-4481-827d-ae436a468aab";

app.get("/", (req, res) => {
  res.send("Aurora AI Backend is Running ✅");
});

app.post("/api/botpress", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch(
      `https://api.botpress.cloud/v1/chat/${BOTPRESS_BOT_ID}/conversations/12345/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${BOTPRESS_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "text",
          text: message,
        }),
      }
    );

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Botpress raw response:", text);
      throw new Error("Invalid JSON from Botpress");
    }

    const reply =
      data.responses?.[0]?.payload?.text || "No reply received from Aurora AI.";

    res.json({ reply });
  } catch (error) {
    console.error("Error contacting Botpress:", error);
    res
      .status(500)
      .json({ reply: "⚠️ Error contacting Aurora AI. Please try again later." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log(`✅ Aurora AI Backend live on port ${PORT}`)
);
