const express = require("express");
const mqtt = require("mqtt");
const cors = require("cors");

const app = express();
app.use(cors());

let latestMessage = "No Data Yet";

// MQTT Connection
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

client.on("connect", () => {
    console.log("✅ Connected to MQTT Broker");
    client.subscribe("esp32/data");
});

client.on("message", (topic, message) => {
    latestMessage = message.toString();
    console.log("📥 Received:", latestMessage);
});

// Routes
app.get("/", (req, res) => {
    res.send("🚀 Robot Backend Running on Render");
});

app.get("/data", (req, res) => {
    res.json({ data: latestMessage });
});

// Render requires dynamic port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🌐 Server running on port ${PORT}`);
});