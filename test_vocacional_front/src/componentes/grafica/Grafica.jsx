import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Text } from "recharts";

const COLORS = ["#e48a32", "#8537bc", "#541b78", "#b75d0d", "#913d13"];

// Componente personalizado para el tooltip
const CustomTooltip = ({ active, payload, data }) => {

  if (active && payload && payload.length) {
    const color = COLORS[data.findIndex(d => d.name === payload[0].name) % COLORS.length];
    return (
      <div className=" hidden lg:block lg:text-sm 
      lg:bg-primary border lg:border-gray-100 lg:rounded-md lg:p-2 lg:shadow
        2xl:text-2xl">
        <div className=" flex items-center justify-around">
          <div
            className="w-3.5 h-3.5 m-auto mr-2.5 rounded 2xl:w-7 2xl:h-7 2xl:rounded-md"
            style={{ backgroundColor: color }}
          ></div>
          <span className="capitalize mr-1.5 text-black">
            {payload[0].name}
          </span>
          <span className="text-black font-semibold">{payload[0].value}</span>
        </div>
      </div>
    );
  }

  return null;
};

const CustomLabel = ({ x, y, cx, cy, midAngle, outerRadius, name }) => {
  const [widthText, setWidthText] = useState(240);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 470px)");
    const handleResize = () => { if (mediaQuery.matches) setWidthText(80) };
  
    mediaQuery.addEventListener("change", handleResize); // Actualización dinámica
    handleResize(); // Verifica al cargar
  
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);
  

  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20; // Ajusta para mover el texto hacia afuera
  const xPos = cx + radius * Math.cos(-midAngle * RADIAN);
  const yPos = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <Text
      x={xPos}
      y={yPos}
      width={widthText}
      fill="#ffffff"
      textAnchor={xPos > cx ? "start" : "end"}
      verticalAnchor="end"
      className="text-xs w-20 sm:text-base lg:text-lg 2xl:text-3xl"
    >
      {name}
    </Text>
  );
};

const Grafica = ({ datos }) => {

  // return (
  //   <PieChart width={600} height={450}>
  //     <Pie
  //       data={datos}
  //       cx="50%"
  //       cy="50%"
  //       outerRadius={100}
  //       fill="#8884d8"
  //       dataKey="value"
  //       nameKey="name"
  //       stroke="none" // Elimina líneas entre segmentos
  //       label={({ x, y, cx, cy, midAngle, outerRadius, name }) => (
  //         <CustomLabel
  //           x={x}
  //           y={y}
  //           cx={cx}
  //           cy={cy}
  //           midAngle={midAngle}
  //           outerRadius={outerRadius}
  //           name={name}
  //         />
  //       )}
  //     >
  //       {datos.map((entry, index) => (
  //         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
  //       ))}
  //     </Pie>
  //     <Tooltip content={<CustomTooltip data={datos}/>} />
  //   </PieChart>
  // );
  return (
    <ResponsiveContainer width="100%" height="100%">
        <PieChart className="focus:outline-none">
        <Pie
          className="focus:outline-none"
          data={datos}
          isAnimationActive={true}
          cx="50%"
          cy="50%"
          label={({ x, y, cx, cy, midAngle, outerRadius, name }) =>
            <CustomLabel x={x} y={y} cx={cx} cy={cy} midAngle={midAngle} outerRadius={outerRadius} name={name} />
          }
          outerRadius="60%"
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          stroke="none"
          startAngle={180} // Cambia el inicio de la gráfica a las 12 en punto
          endAngle={540} // Termina en 450 grados (360 + 90, un ciclo completo)
        >
          {datos.map((entry, index) => (
            <Cell className="focus:outline-none" key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip data={datos} />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default Grafica;
