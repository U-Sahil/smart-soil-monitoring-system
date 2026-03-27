const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mqtt = require("mqtt");
const cors = require("cors");
const axios = require("axios");
const { PythonShell } = require("python-shell");

let history = [];

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});


// 🔥 MQTT CONNECTION
const client = mqtt.connect(
  "mqtts://1aab189914b34e798bac9686db26d91d.s1.eu.hivemq.cloud:8883",
  {
    username: "ESP_FARM",
    password: "Sahil@1234"
  }
);


// ✅ CONNECT
client.on("connect", () => {
  console.log("Connected to HiveMQ");

  client.subscribe("farm/sensor", () => {
    console.log("Subscribed to farm/sensor");
  });
});


// ✅ RECEIVE DATA FROM NODEMCU
client.on("message", (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    console.log("Live Sensor:", data);

    // STORE HISTORY
    history.push({
      temperature: data.temperature,
      humidity: data.humidity,
      gas: data.gasValue,
      time: new Date().toLocaleString()
    });

    if (history.length > 50) history.shift();

    // SEND TO FRONTEND
    io.emit("sensorData", data);

  } catch (err) {
    console.log("❌ Error parsing MQTT data");
  }
});


// ✅ HISTORY API
app.get("/history", (req, res) => {
  res.json(history);
});


// 🔥 THINGSPEAK ANALYSIS FUNCTION
async function getThingSpeakData() {
  try {
    const response = await axios.get(
      "https://api.thingspeak.com/channels/3305648/feeds.json?api_key=NQQFJRXMR6KDWAR0&results=20"
    );

    const feeds = response.data.feeds;

    const validData = feeds.filter(f =>
      f.field1 !== "0.00" &&
      f.field2 !== "0.00" &&
      f.field3 !== "0"
    );

    if (validData.length === 0) {
      console.log("⚠ No valid data");
      return;
    }

    const temp = validData.map(f => parseFloat(f.field1));
    const hum = validData.map(f => parseFloat(f.field2));
    const gas = validData.map(f => parseFloat(f.field3));

    const avgTemp = temp.reduce((a, b) => a + b, 0) / temp.length;
    const avgHum = hum.reduce((a, b) => a + b, 0) / hum.length;
    const avgGas = gas.reduce((a, b) => a + b, 0) / gas.length;

    let condition = "";
    let crops = [];

    if (avgHum > 60 && avgTemp < 35) {
      condition = "GOOD";
      crops = ["Rice", "Wheat", "Sugarcane"];
    } else if (avgHum < 40) {
      condition = "DRY";
      crops = ["Millet", "Maize"];
    } else if (avgGas > 300) {
      condition = "POOR";
      crops = ["No suitable crops"];
    } else {
      condition = "MODERATE";
      crops = ["Maize", "Pulses"];
    }

    console.log("📊 Averages:", avgTemp, avgHum, avgGas);
    console.log("🌱 Condition:", condition);
    console.log("🌾 Crops:", crops);

    return {
      avgTemp,
      avgHum,
      avgGas,
      condition,
      crops
    };

  } catch (error) {
    console.log("❌ Error fetching ThingSpeak data");
  }
}


// 🔁 RUN ANALYSIS EVERY 20s
setInterval(async () => {
  const result = await getThingSpeakData();

  if (result) {
    io.emit("soilAnalysis", result);
  }

}, 20000);


// 🤖 ML PREDICTION API (FINAL FIXED)
app.get("/predict", (req, res) => {

  const temp = req.query.temp;
  const hum = req.query.hum;
  const gas = req.query.gas;

  console.log("👉 Calling ML:", temp, hum, gas);

  let options = {
    scriptPath: __dirname,   // ✅ FIXED PATH
    args: [temp, hum, gas]
  };

  PythonShell.run("ml_model.py", options, (err, result) => {

    if (err) {
      console.log("❌ ML ERROR:", err);
      return res.status(500).send("ML Error");
    }

    console.log("✅ ML RESULT:", result);

    res.json({
      crop: result[0]
    });

  });

});


// ✅ START SERVER
server.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});