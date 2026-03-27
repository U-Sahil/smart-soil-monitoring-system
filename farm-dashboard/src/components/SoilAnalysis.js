import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import io from "socket.io-client";
import GaugeChart from "react-gauge-chart";

const socket = io("http://localhost:5000");

const SoilAnalysis = () => {

  // 🔥 AI Prediction
  const [prediction, setPrediction] = useState("");

  // 🔥 Backend Data
  const [data, setData] = useState({
    avgTemp: 0,
    avgHum: 0,
    avgGas: 0,
    condition: "",
    crops: [],
  });

  // 🔥 RECEIVE DATA FROM BACKEND
  useEffect(() => {
    socket.on("soilAnalysis", (incoming) => {
      setData(incoming);
    });
  }, []);

  // 🔥 CALL AI MODEL (DYNAMIC)
  useEffect(() => {

  if (data.avgTemp !== 0 && data.avgHum !== 0 && data.avgGas !== 0) {

    fetch(`http://localhost:5000/predict?temp=${data.avgTemp}&hum=${data.avgHum}&gas=${data.avgGas}`)
      .then(res => res.json())
      .then(res => setPrediction(res.crop));

  }

}, [data]);


  // 🎯 Soil Health %
  const health = data.avgHum > 60 ? 80 : data.avgHum > 40 ? 60 : 30;

  const cropInfo = {
    Rice: "Needs high water and humidity. Best for wet soil.",
    Wheat: "Grows in moderate temperature and medium moisture.",
    Sugarcane: "Requires rich soil and consistent watering.",
    Maize: "Suitable for moderate soil and temperature.",
    Pulses: "Best for dry soil and improves fertility.",
    Millet: "Thrives in low water conditions.",
  };

  return (
    <div
      style={{
        marginLeft: "300px",
        padding: "30px",
        background: "#F7F5F2",
        minHeight: "100vh",
        width: "calc(100% - 300px)",
        boxSizing: "border-box"
      }}
    >

      {/* TITLE */}
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        Soil Analysis & Intelligence
      </Typography>

      {/* 🔥 HEALTH + AI SECTION */}
      <div style={{
        display: "flex",
        gap: "30px",
        marginTop: "20px",
        alignItems: "center",
        background: "#fff",
        padding: "25px",
        borderRadius: "20px"
      }}>

        {/* GAUGE */}
        <div style={{ width: "300px" }}>
          <GaugeChart
            id="soil-gauge"
            nrOfLevels={20}
            percent={health / 100}
            colors={["#E74C3C", "#FFC107", "#4CAF50"]}
            arcWidth={0.3}
            textColor="#000"
          />
          <p style={{ textAlign: "center" }}>
            Soil Health: {health}%
          </p>
          <p style={{ textAlign: "center", color: "#888" }}>
            Condition: {data.condition}
          </p>
        </div>

        {/* AI PREDICTION */}
        <div style={{ flex: 1 }}>
          <h3>🤖 AI Recommendation</h3>

          {prediction ? (
            <h2 style={{ color: "#4CAF50" }}>
              🌾 {prediction}
            </h2>
          ) : (
            <p>Loading AI...</p>
          )}

          <p style={{ marginTop: "10px", color: "#777" }}>
            Based on real-time soil conditions and AI model prediction.
          </p>
        </div>

      </div>

      {/* 📊 ANALYSIS CARDS */}
      <div style={{
        display: "flex",
        gap: "20px",
        marginTop: "25px"
      }}>

        <Card style={cardStyle}>
          <CardContent>
            <Typography>Avg Temp</Typography>
            <Typography variant="h5">
              {data.avgTemp?.toFixed(2)} °C
            </Typography>
          </CardContent>
        </Card>

        <Card style={cardStyle}>
          <CardContent>
            <Typography>Avg Humidity</Typography>
            <Typography variant="h5">
              {data.avgHum?.toFixed(2)} %
            </Typography>
          </CardContent>
        </Card>

        <Card style={cardStyle}>
          <CardContent>
            <Typography>Avg Gas</Typography>
            <Typography variant="h5">
              {data.avgGas?.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>

      </div>

      {/* 🌾 RECOMMENDED CROPS */}
      <div style={{ marginTop: "30px" }}>
        <Typography variant="h5">Recommended Crops</Typography>

        <Grid container spacing={3} style={{ marginTop: "10px" }}>
          {data.crops?.map((crop, index) => (
            <Grid item xs={4} key={index}>
              <Card style={{ borderRadius: "15px" }}>
                <CardContent>
                  <Typography variant="h6">{crop}</Typography>
                  <Typography style={{ color: "#777" }}>
                    {cropInfo[crop] || "Suitable crop"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>

      {/* 📘 INSIGHTS */}
      <div style={{ marginTop: "30px" }}>
        <Typography variant="h5">Insights</Typography>

        <Card style={{
          marginTop: "10px",
          padding: "15px",
          borderRadius: "15px"
        }}>
          <Typography>
            Your soil shows <b>{data.condition}</b> condition.
            Based on AI and sensor data, crops like <b>{data.crops?.join(", ")}</b> are recommended.
          </Typography>
        </Card>
      </div>

    </div>
  );
};

// 🔥 CARD STYLE
const cardStyle = {
  flex: 1,
  borderRadius: "15px",
  background: "#fff"
};

export default SoilAnalysis;