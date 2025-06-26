import { useState } from "react";
import {
  FaBolt,
  FaThermometerHalf,
  FaPlug,
  FaCar,
  FaChargingStation,
} from "react-icons/fa";
import { useGlobalContext } from "../../../GlobalStates/GlobalState";
import useTelemetrySocket from "../../../hook/useTelemetrySocket";
import { h1 } from "framer-motion/client";

const LiveDataPanel = ({ data}) => {
  const {authData} = useGlobalContext()
  const telemetryData = useTelemetrySocket("DEVICE123", authData.accessToken);
  const [isOn , setIsOn] = useState(false)
  console.log("Telemetry Data: main kai ander", telemetryData);



  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-bold text-[#1E1E2F] mb-4 italic">
        Current Live Data Supply
      </h2>
      {telemetryData ? ( 
        <div className="grid xl:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-4">
        <LiveCard
          label="Voltage"
          value={`${telemetryData.voltage || 0} V`}
          icon={<FaChargingStation />}
        />
        <LiveCard
          label="Current"
          value={`${telemetryData.current || 0} A`}
          icon={<FaBolt />}
        />
        <LiveCard
          label="Power"
          value={`${(telemetryData.voltage *  telemetryData.current).toFixed(2) || 0} kW`}
          icon={<FaBolt />}
        />
        <LiveCard
          label="Temp"
          value={`${telemetryData.temperature || 0} °C`}
          icon={<FaThermometerHalf />}
        />
        <LiveCard
          label="Status"
          value={telemetryData.status || 0}
          icon={<FaPlug />}
          bg={isOn ? "bg-[#C1F9AA]" : "bg-[#F4BFBF]"}
          text={isOn ? "text-green-700" : "text-red-600"}
        />
        <LiveCard
          label="Vehicle"
          value={telemetryData.vehicle ? "Connected" : "None"}
          icon={<FaCar />}
          bg={telemetryData.vehicle ? "bg-[#C1F9AA]" : "bg-[#F4BFBF]"}
          text={telemetryData.vehicle ? "text-green-700" : "text-red-600"}
        />
      </div>
       ) : ( 
        <h1 className="text-3xl font-bold">fetching live data ......... </h1>
       )}
    </div>
  );
};

const LiveCard = ({
  label,
  value,
  icon,
  bg = "bg-white",
  text = "text-[#1E1E2F]",
}) => (
  <div className={`p-4 group rounded-xl shadow ${bg}`}>
    <div className="flex  items-center flex-col text-center gap-y-3">
      <span className={`text-2xl mainBlue bg-[#AFAFAF]/20 p-2 rounded-full fromBlue ${text}`}>{icon}</span>
      <p className="text-lg text-[#5a5a5a] italic">
        {label}
      </p>
      <h4 className={`text-[16px] font-semibold ${text}`}> <i>{value}</i> </h4>
    </div>
  </div>
);

export default LiveDataPanel;
