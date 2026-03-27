import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import io from "socket.io-client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const socket = io("http://localhost:5000");

const Dashboard = () => {

  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [moisture, setMoisture] = useState(0);

  const [labels, setLabels] = useState([]);
  const [temperatureHistory, setTemperatureHistory] = useState([]);
  const [humidityHistory, setHumidityHistory] = useState([]);
  const [moistureHistory, setMoistureHistory] = useState([]);

  useEffect(() => {

    socket.on("sensorData", (data) => {

      const time = new Date().toLocaleTimeString();

      setTemperature(data.temperature);
      setHumidity(data.humidity);
      setMoisture(data.gasValue);

      setLabels(prev => [...prev.slice(-9), time]);

      setTemperatureHistory(prev => [...prev.slice(-9), data.temperature]);
      setHumidityHistory(prev => [...prev.slice(-9), data.humidity]);
      setMoistureHistory(prev => [...prev.slice(-9), data.gasValue]);

    });

  }, []);

  const chartData = (label, data, color) => ({
    labels: labels,
    datasets: [
      {
        label: label,
        data: data,
        borderColor: color,
        backgroundColor: color + "33",
        tension: 0.4
      }
    ]
  });

  const cardStyle = {
    background: "#fff",
    borderRadius: "15px",
    padding: "20px",
    flex: 1,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
  };

  const cardBig = {
    background: "#fff",
    borderRadius: "15px",
    padding: "20px",
    flex: 1,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
  };

  return (
    <div style={{
      marginLeft: "300px",
      padding: "30px",
      background: "#F7F5F2",
      minHeight: "100vh"
    }}>

      {/* TOP */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "25px"
      }}>
        <h1>Smart Farm Dashboard</h1>

        <div style={{ display: "flex", gap: "20px" }}>
          <div>
            <p style={{ fontSize: "14px", color: "#888" }}>Date</p>
            <b>{new Date().toLocaleDateString()}</b>
          </div>

          <div>
            <p style={{ fontSize: "14px", color: "#888" }}>Area</p>
            <b>78.2 ha</b>
          </div>

          <div>
            <p style={{ fontSize: "14px", color: "#888" }}>Fields</p>
            <b> 1 fields</b>
          </div>
        </div>
      </div>

      {/* CARDS */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={cardStyle}><p>Moisture</p><h2>{moisture}</h2></div>
        <div style={cardStyle}><p>Temperature</p><h2>{temperature}°C</h2></div>
        <div style={cardStyle}><p>Humidity</p><h2>{humidity}%</h2></div>
      </div>

      {/* MAIN GRAPH */}
      <div style={cardBig}>
        <h3>Live Sensor Data</h3>
        <Line data={chartData("Moisture", moistureHistory, "#4A90E2")} />
      </div>

      {/* SECOND ROW */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={cardBig}>
          <h4>Temperature</h4>
          <Line data={chartData("Temp", temperatureHistory, "#E74C3C")} />
        </div>

        <div style={cardBig}>
          <h4>Humidity</h4>
          <Line data={chartData("Humidity", humidityHistory, "#27AE60")} />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;