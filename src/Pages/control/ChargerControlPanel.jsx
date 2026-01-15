import { useState, useEffect } from "react";
import LiveDataPanel from "../mainDashboard/components/LiveDataPanel";
import { useGlobalContext } from "../../GlobalStates/GlobalState";

// importing icons
import { FaBolt } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaServer } from "react-icons/fa";

const ChargerControlPanel = () => {
  const { isOn, setIsOn, authData, formatTimeFromString, supplyON, setSupplyON } =
    useGlobalContext();

  const [deviceData, setDeviceData] = useState(null);

  // ✅ Mock device data (simulate API delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDeviceData({
        deviceId: "DEVICE123",
        name: "EV Station - Karachi Central",
        location: "Karachi, Pakistan",
        available: true,
        lastUpdated: new Date().toISOString(),
      });
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // ✅ Toggle local UI switch
  const toggleSwitch = () => {
    setIsOn((prev) => !prev);

    // optional: keep lastUpdated feeling real
    setDeviceData((prev) =>
      prev
        ? { ...prev, lastUpdated: new Date().toISOString() }
        : prev
    );
  };

  const getRecommendation = () => {
    if (!isOn) return "Supply is OFF. No action needed.";
    if (deviceData?.available === false) return "Station unavailable. Check device connectivity.";
    return "System is operating normally.";
  };

  return (
    <div className="sm:px-6 p-3 rounded-xl shadow-lg space-y-3 h-screen overflow-y-scroll">

      <div className="w-full flex justify-between items-center font-bold mb-3 px-3">
        <FaBolt className="sm:text-2xl text-xl" />
        <h2 className="md:text-[24px] sm:text-lg text-sm font-bold text-[#1E1E2F] italic">
          Control Panel
        </h2>

        <h1 className="bg-[#1E1E2F] rounded-sm px-3 py-2 text-white sm:text-sm text-xs">
          Slacker
        </h1>
      </div>
      <hr />

      {/* details of device */}
      <div className="w-full flex justify-between items-start mt-8 px-2">
        <div>
          <h1 className="text-[24px] font-bold mb-4">Station Details</h1>

          {deviceData ? (
            <ul className="text-[16px] mb-4 space-y-3">
              <li className="flex items-center gap-2">
                <FaServer className="text-indigo-600" />
                <strong>Device ID:</strong> {deviceData.deviceId}
              </li>

              <li className="flex items-center gap-2">
                <FaBolt className="text-yellow-500" />
                <strong>Name Of Station:</strong> {deviceData.name}
              </li>

              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" />
                <strong>Location:</strong> {deviceData.location}
              </li>

              <li className="flex items-center gap-2">
                <FaCircle
                  className={
                    deviceData.available ? "text-green-500" : "text-gray-400"
                  }
                />
                <strong>Status:</strong>{" "}
                {deviceData.available ? "Available" : "Unavailable"}
              </li>

              <li className="flex items-center gap-2">
                <FaClock className="text-blue-500" />
                <strong>Last Updated:</strong>{" "}
                {formatTimeFromString(deviceData.lastUpdated)}
              </li>
            </ul>
          ) : (
            <p className="text-[14px] text-gray-600">Loading device data...</p>
          )}
        </div>

        {/* ✅ Capsule Switch */}
        <button
          type="button"
          onClick={toggleSwitch}
          aria-pressed={isOn}
          className={`lg:w-20 lg:h-10 sm:w-14 sm:h-6 w-12 h-5 flex items-center rounded-full cursor-pointer p-1 transition-colors duration-300 ${isOn ? "bg-green-500" : "bg-red-500"
            }`}
        >
          <div
            className={`lg:w-8 lg:h-8 sm:w-4 sm:h-4 w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isOn
                ? "lg:translate-x-10 sm:translate-x-8 translate-x-7"
                : "translate-x-0"
              }`}
          />
        </button>
      </div>

      {/* ✅ Live Data Display - conditional */}
      {isOn ? (
        <LiveDataPanel />
      ) : (
        <div className="mt-2 p-4 bg-white shadow-md rounded-lg border border-gray-200">
          <h1 className="text-[18px] font-semibold text-[#1E1E2F] italic">
            Live Data
          </h1>
          <p className="text-[14px] text-gray-600 italic mt-1">
            Supply is OFF — turn ON to start live telemetry.
          </p>
        </div>
      )}

      {/* Recommendations */}
      <div className="mt-4 p-4 bg-white shadow-md rounded-lg border border-gray-200">
        <h1 className="font-semibold text-[18px] mt-1">Recommendations</h1>
        <p className="text-[14px] text-gray-600 italic">{getRecommendation()}</p>
      </div>
    </div>
  );
};

export default ChargerControlPanel;
