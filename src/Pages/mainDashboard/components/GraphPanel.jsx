// src/components/GraphPanel.jsx

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  
  const GraphPanel = ({ graphData }) => {
    const processedData = graphData.map((entry) => ({
      ...entry,
      cost: entry.kWh * 50,
    }));
  
    return (
      <div className="bg-white sm:p-6 p-3 rounded-xl shadow-md">
        <h2 className="text-[24px] font-bold text-[#1E1E2F] mb-4">Graphical Representation</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3 3 " />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="kWh"
              stroke="#0A86F0"
              strokeWidth={2}
              name="Power (kWh)"
            />
            <Line
              type="monotone"
              dataKey="cost"
              stroke="#00AA06"
              strokeWidth={2}
              name="Cost (PKR)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  export default GraphPanel;
  