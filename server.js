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
    client.subscribe("esp32/data", (err) => {
        if (!err) {
            console.log("📡 Subscribed to esp32/data");
        }
    });
});

client.on("message", (topic, message) => {
    latestMessage = message.toString();
    console.log("📥 Received:", latestMessage);
});

client.on("error", (err) => {
    console.error("❌ MQTT Error:", err);
});

client.on("reconnect", () => {
    console.log("🔄 Reconnecting to MQTT...");
});

// Routes
app.get("/", (req, res) => {
    res.send("🚀 Node Backend Running");
});

app.get("/data", (req, res) => {
    res.json({ data: latestMessage });
});

// Start Server
app.listen(5000, () => {
    console.log("🌐 Server running on http://localhost:5000");
});