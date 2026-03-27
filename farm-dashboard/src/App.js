import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import AnalysisPanel from "./components/AnalysisPanel";
import SoilAnalysis from "./components/SoilAnalysis";
import History from "./components/History";

const socket = io("http://localhost:5000");

function App() {

  const [sensorData, setSensorData] = useState({});
  const [labels, setLabels] = useState([]);

  const [moistureHistory, setMoistureHistory] = useState([]);
  const [temperatureHistory, setTemperatureHistory] = useState([]);
  const [humidityHistory, setHumidityHistory] = useState([]);

  useEffect(() => {

    socket.on("sensorData", (data) => {

      const parsed = data; // already object

      const time = new Date().toLocaleTimeString();

      setSensorData(parsed);

      setLabels(prev => [...prev.slice(-9), time]);

      setMoistureHistory(prev => [...prev.slice(-9), parsed.gasValue]);
      setTemperatureHistory(prev => [...prev.slice(-9), parsed.temperature]);
      setHumidityHistory(prev => [...prev.slice(-9), parsed.humidity]);

    });

  }, []);

  return (

    <Router>

      <div style={{ display: "flex" }}>

        <Sidebar />

        <Routes>

          <Route
            path="/"
            element={
              <>
                <Dashboard
                  moisture={sensorData.gasValue || 0}
                  temperature={sensorData.temperature || 0}
                  humidity={sensorData.humidity || 0}
                  labels={labels}
                  moistureHistory={moistureHistory}
                  temperatureHistory={temperatureHistory}
                  humidityHistory={humidityHistory}
                />

                <div style={{ padding: "30px" }}>
                  <AnalysisPanel
                    moisture={sensorData.gasValue || 0}
                    temperature={sensorData.temperature || 0}
                    humidity={sensorData.humidity || 0}
                  />
                </div>
              </>
            }
          />

          <Route path="/soil-analysis" element={<SoilAnalysis />} />
          
          <Route path="/History" element={<History />} />

        </Routes>

      </div>

    </Router>
  );
}

export default App;