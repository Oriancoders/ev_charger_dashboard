import { useState } from "react";
import LiveDataPanel from "../mainDashboard/components/LiveDataPanel";
import { useGlobalContext } from "../../GlobalStates/GlobalState";
import { FaBolt } from "react-icons/fa";

const ChargerControlPanel = () => {
  const { isOn, setIsOn, mockLiveData } = useGlobalContext();



  const toggleSwitch = () => setIsOn(!isOn);

  const getRecommendation = () => {
    if (!isOn) return "Supply is OFF. No action needed.";
    if (mockLiveData.battery < 20) return "Battery is low. Consider turning off the supply.";
    if (mockLiveData.current < 50) return "Current is low. Check charger or turn off.";
    if (mockLiveData.temperature > 40) return "Temperature too high. Turn off immediately.";
    return "System is operating normally.";
  };

  return (
    <div className="sm:p-6 p-3  rounded-xl shadow-lg space-y-6  min-h-screen">

      <div className="w-full flex justify-between items-center  font-bold mb-3  px-3">
        <FaBolt className="text-4xl" />
        <h2 className="text-[24px] font-bold  text-[#1E1E2F] italic">Controm Panel</h2>
        <h1 className="bg-[#1E1E2F] rounded-sm px-3 py-2 text-white">ADMIN</h1>
      </div>

      <h2 className="text-[24px] font-bold text-[#1E1E2F] mb-4 italic">Charger Control Panel</h2>

      {/* Capsule Switch */}
      <div
        onClick={() => toggleSwitch()}
        className={`w-20 h-10 flex items-center rounded-full cursor-pointer p-1 transition-colors duration-300 ${isOn ? "bg-green-500" : "bg-red-500"
          }`}
      >
        <div
          className={`w-8 h-8 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isOn ? "translate-x-10" : "translate-x-0"
            }`}
        />
      </div>


      {/* Live Data Display */}
      <LiveDataPanel data={mockLiveData} isOn={isOn} />

      {/* Recommendations */}
      <div className="mt-4 p-4 bg-[#f9f9f9] rounded-lg border border-gray-200">
        <h1 className="font-semibold text-gray-800 mb-2 text-[18px]">Recommendations</h1>
        <p className="text-[16px] text-gray-600 italic">{getRecommendation()}</p>
      </div>
    </div>
  );
};

export default ChargerControlPanel;
