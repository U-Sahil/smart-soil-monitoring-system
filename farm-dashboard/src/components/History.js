import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";

const History = () => {
  
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);



  const exportPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Smart Farm Report", 70, 15);

  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 25);

  let y = 40;

  doc.setFontSize(13);
  doc.text("No", 20, y);
  doc.text("Temp (°C)", 40, y);
  doc.text("Humidity (%)", 80, y);
  doc.text("Gas", 130, y);

  y += 10;
  doc.line(20, y - 5, 190, y - 5);

  doc.setFontSize(11);

  history.slice(0, 10).forEach((item, i) => {
    doc.text(`${i + 1}`, 20, y);
    doc.text(`${item.temperature}`, 40, y);
    doc.text(`${item.humidity}`, 90, y);
    doc.text(`${item.gas}`, 140, y);
    y += 10;
  });

  doc.text("Smart Farming IoT System", 70, y + 10);

  doc.save("SmartFarm_Report.pdf");
};

  // 🔥 FETCH DATA
  useEffect(() => {
    fetch("http://localhost:5000/history")
      .then(res => res.json())
      .then(data => setHistory(data.reverse()));
  }, []);

  return (
    <div style={{
      marginLeft: "300px",
      padding: "30px",
      background: "#F7F5F2",
      minHeight: "100vh",
      width: "calc(100% - 250px)",
      boxSizing: "border-box"
    }}>

      {/* TITLE */}
      <h1 style={{ marginBottom: "30px" }}>Farm History</h1>
      <button
        onClick={exportPDF}
        style={{
        padding: "10px 15px",
        borderRadius: "10px",
        border: "none",
        background: "#4CAF50",
       color: "#fff",
       marginBottom: "20px",
       cursor: "pointer"
  }}
>
  📄 Export PDF
</button>

      {/* SEARCH + FILTER */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>

        <input
          type="text"
          placeholder="🔍 Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "12px",
            width: "250px",
            borderRadius: "10px",
            border: "1px solid #ddd"
          }}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "10px"
          }}
        >
          <option value="all">All</option>
          <option value="today">Today</option>
        </select>

      </div>

      {/* GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "25px"
      }}>

        {history
          .filter(item =>
            (
              item.temperature.toString().includes(search) ||
              item.humidity.toString().includes(search) ||
              item.gas.toString().includes(search) ||
              item.time.toLowerCase().includes(search.toLowerCase())
            ) &&
            (
              filter === "all" ||
              (filter === "today" &&
                item.time.includes(new Date().toLocaleDateString()))
            )
          )
          .map((item, index) => (

            <div
              key={index}
              style={{
                background: "#fff",
                borderRadius: "15px",
                padding: "20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                transition: "0.3s",
                cursor: "pointer"
              }}

              onClick={() => setSelected(item)}

              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >

              <p style={{ fontSize: "12px", color: "#888" }}>
                📅 {item.time}
              </p>

              <hr style={{ margin: "10px 0", opacity: 0.2 }} />

              <h3>🌡 {item.temperature}°C</h3>
              <p>💧 Humidity: {item.humidity}%</p>
              <p>🌫 Gas: {item.gas}</p>

            </div>

          ))}

      </div>

      {/* 🔥 POPUP */}
      {selected && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>

          <div style={{
            background: "#fff",
            padding: "30px",
            borderRadius: "15px",
            width: "300px"
          }}>
            <h3>Details</h3>
            <p>🌡 Temp: {selected.temperature}°C</p>
            <p>💧 Humidity: {selected.humidity}%</p>
            <p>🌫 Gas: {selected.gas}</p>
            <p>📅 {selected.time}</p>

            <button
              onClick={() => setSelected(null)}
              style={{
                marginTop: "10px",
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                background: "#4CAF50",
                color: "#fff"
              }}
            >
              Close
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default History;