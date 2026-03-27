import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {

  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Insights", path: "/soil-analysis" },
    { name: "Field Details", path: "/history" },
    { name: "Customization", path: "/settings" }
  ];

  return (
    <div style={{
      width: "250px",
      height: "100vh",
      background: "#F7F5F2",
      padding: "20px",
      position: "fixed",
      left: 0,
      top: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      borderRight: "1px solid #eee"
    }}>

      {/* TOP */}
      <div>

        {/* Farmer Profile */}
        <div style={{
          background: "#fff",
          borderRadius: "15px",
          padding: "15px",
          textAlign: "center",
          marginBottom: "30px"
        }}>
          <img
            src="/farmer.png"
            alt="farmer"
            style={{
              width: "100px",
              borderRadius: "50%",
              marginBottom: "10px"
            }}
          />
          <h3 style={{ margin: "5px 0" }}>Sahil</h3>
          <p style={{ fontSize: "12px", color: "#888" }}>
            sahil@gmail.com
          </p>
        </div>

        {/* MENU */}
        {menu.map((item, index) => (
          <Link key={index} to={item.path} style={{ textDecoration: "none" }}>
            <div style={{
              padding: "12px 15px",
              borderRadius: "10px",
              marginBottom: "10px",
              background:
                location.pathname === item.path
                  ? "#E7D7C9"
                  : "transparent",
              color: "#333",
              fontWeight: "500"
            }}>
              {item.name}
            </div>
          </Link>
        ))}

      </div>

      {/* BOTTOM */}
      <div style={{
        background: "#E7D7C9",
        borderRadius: "15px",
        padding: "15px",
        textAlign: "center"
      }}>
        <p style={{ fontSize: "12px" }}>
          Need any help? Our experts will help you
        </p>
        <button style={{
          background: "#4CAF50",
          border: "none",
          color: "#fff",
          padding: "8px 15px",
          borderRadius: "20px",
          cursor: "pointer"
        }}>
          Contact us
        </button>
      </div>

    </div>
  );
};

export default Sidebar;