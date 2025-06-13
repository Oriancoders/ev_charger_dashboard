// src/components/BatteryCard.jsx

import { FaBatteryThreeQuarters } from "react-icons/fa";

const BatteryCard = ({ level }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="sm:text-3xl text-xl font-bold  text-[#1E1E2F] italic">Battery</h1>
          <p className="text-sm text-[#AFAFAF]">Battery of the charger</p>
        </div>
        <FaBatteryThreeQuarters className="text-green-500 text-2xl" />
      </div>

      <div className="mt-4">
        <p className="sm:text-xl  text-sm font-bold text-[#1E1E2F]">{level}%</p>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div
            className="h-3 rounded-full"
            style={{
              width: `${level}%`,
              background: "linear-gradient(to right, #7AFF55, #00AA06)",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BatteryCard;
