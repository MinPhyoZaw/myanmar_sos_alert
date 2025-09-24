// server.js
import express from "express";
import cors from "cors";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Load Twilio credentials from .env
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const TWILIO_PHONE = process.env.TWILIO_PHONE;

app.post("/send-sos", async (req, res) => {
  try {
    const { contacts, location } = req.body;

    if (!contacts || contacts.length === 0) {
      return res.status(400).json({ error: "No contacts provided" });
    }

    const message = `🚨 SOS! I need help. My location: https://maps.google.com/?q=${location.lat},${location.lng}`;

    for (const contact of contacts) {
      console.log("Sending SMS to:", contact.number); // debug
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE,
        to: contact.number,
      });
    }

    res.json({ success: true, message: "SOS sent to all contacts" });
  } catch (error) {
    console.error("Twilio Error:", error); // log full Twilio error
    res.status(500).json({ error: error.message });
  }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
