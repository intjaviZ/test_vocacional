import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#e48a32", "#541b78", "#8537bc", "#b75d0d", "#913d13"];

// Componente personalizado para el tooltip
const CustomTooltip = ({ active, payload, data }) => {
  if (active && payload && payload.length) {
    const color = COLORS[data.findIndex(d => d.name === payload[0].name) % COLORS.length];
    return (
      <div
        style={{
          fontSize: "12px",
          background: "#fff",
          border: "1px solid #ccc",
          borderRadius: "7px",
          padding: "7px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "space-around",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              width: "14px",
              height: "14px",
              backgroundColor: color,
              margin: "auto",
              marginRight: "10px",
              borderRadius: "20%",
            }}
          ></div>
          <span style={{ textTransform: "capitalize", marginRight: "5px", color: "black"}}>
            {payload[0].name}
          </span>
          <span style={{color: "black" }}>{payload[0].value}</span>
        </div>
      </div>
    );
  }

  return null;
};

const CustomLabel = ({ x, y, name }) => (
  <text
    x={x}
    y={y}
    
    style={{
      fontSize: "11px",
      fill: "white",
      textTransform: "capitalize",
    }}
  >
    {name}
  </text>
);

const Grafica = ({ datos }) => {

  return (
    <PieChart width={500} height={450}>
      <Pie
        data={datos}
        cx="50%"
        cy="50%"
        label={({ x, y, name }) => <CustomLabel x={x} y={y} name={name} />}
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
        nameKey="name"
        stroke="none" // Elimina líneas entre segmentos
      >
        {datos.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip data={datos}/>} />
    </PieChart>
  );
};

export default Grafica;
