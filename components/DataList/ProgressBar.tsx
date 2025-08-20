import React from "react";
export default function ProgressBar({
  percentage = 0,
  comeFrom
}: {
  percentage?: number;
  comeFrom?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: comeFrom === "app-sidebar" ? "48px" : "12px", marginTop: comeFrom === "app-sidebar" ? "14px" : "0px" }}>
      <div
        style={{
          width: "70%",
          height: "8px",
          backgroundColor: "whitesmoke",   
          borderRadius: "9999px",
          overflow: "hidden",
          border: "1px solid black"
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percentage}%`,
            backgroundColor: "black", 
            borderRadius: "9999px",
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <span style={{ fontSize: "14px", color: "#000" }}>
        {percentage.toFixed(2)}%
      </span>
    </div>
  );
}