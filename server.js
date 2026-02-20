const express = require("express");
const mqtt = require("mqtt");
const cors = require("cors");

const app = express();
app.use(cors());

let latestMessage = "No Data Yet";

// MQTT
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

client.on("connect", () => {
  console.log("Connected to MQTT");
  client.subscribe("esp32/data");
});

client.on("message", (topic, message) => {
  latestMessage = message.toString();
  console.log("Received:", latestMessage);
});

app.get("/", (req, res) => {
  res.send("Robot Backend Running");
});

app.get("/data", (req, res) => {
  res.json({ data: latestMessage });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});