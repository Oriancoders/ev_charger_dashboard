import {
    FaBolt,
    FaThermometerHalf,
    FaPlug,
    FaCar,
    FaChargingStation,
  } from "react-icons/fa";
  
  const LiveDataPanel = ({ data, isOn }) => {
    const safeData = {
      voltage: isOn ? data.voltage : 0,
      current: isOn ? data.current : 0,
      power: isOn ? (data.voltage * data.current ): 0,
      temperature: data.temperature,
      status: isOn ? data.status : "OFF",
      vehicle: data.vehicle,
    };
  
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-[24px] font-bold text-[#1E1E2F] mb-4 italic">
          Current Live Data Supply
        </h2>
        <div className="grid xl:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-4">
          <LiveCard
            label="Voltage"
            value={`${safeData.voltage}V`}
            icon={<FaChargingStation />}
          />
          <LiveCard
            label="Current"
            value={`${safeData.current}A`}
            icon={<FaBolt />}
          />
          <LiveCard
            label="Power"
            value={`${safeData.power.toFixed(2)}kW`}
            icon={<FaBolt />}
          />
          <LiveCard
            label="Temp"
            value={`${safeData.temperature}°C`}
            icon={<FaThermometerHalf />}
          />
          <LiveCard
            label="Status"
            value={safeData.status}
            icon={<FaPlug />}
            bg={isOn ? "bg-[#C1F9AA]" : "bg-[#F4BFBF]"}
            text={isOn ? "text-green-700" : "text-red-600"}
          />
          <LiveCard
            label="Vehicle"
            value={safeData.vehicle ? "Connected" : "None"}
            icon={<FaCar />}
            bg={safeData.vehicle ? "bg-[#C1F9AA]" : "bg-[#F4BFBF]"}
            text={safeData.vehicle ? "text-green-700" : "text-red-600"}
          />
        </div>
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
  