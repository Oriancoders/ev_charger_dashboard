import { useState, useEffect } from "react";
import LiveDataPanel from "../mainDashboard/components/LiveDataPanel";
import { useGlobalContext } from "../../GlobalStates/GlobalState";
import { FaBolt } from "react-icons/fa";
import ApiService from "../../ApiServices/ApiService";

const ChargerControlPanel = () => {
  const { isOn, setIsOn, mockLiveData, authData } = useGlobalContext();

  const [deviceData, setDeviceData] = useState(null);
  // fech deviceId from URL params or context
  useEffect(() => {
    const fetchDevice = async () => {
      console.log(authData.accessToken)
      try {
        const data = await ApiService.getDevices('DEVICE123', authData.accessToken);
        setDeviceData(data);
      } catch (error) {
        console.error("Error fetching device:", error);
      }
    };

    fetchDevice();
  }, []);


  const toggleSwitch = () => setIsOn(!isOn);

  const getRecommendation = () => {
    if (!isOn) return "Supply is OFF. No action needed.";
    if (mockLiveData.battery < 20) return "Battery is low. Consider turning off the supply.";
    if (mockLiveData.current < 50) return "Current is low. Check charger or turn off.";
    if (mockLiveData.temperature > 40) return "Temperature too high. Turn off immediately.";
    return "System is operating normally.";
  };

  return (
    <div className="sm:p-6 p-3  rounded-xl shadow-lg space-y-6  h-screen overflow-y-scroll">

      <div className="w-full flex justify-between items-center  font-bold mb-3  px-3">
        <FaBolt className="sm:text-4xl text-xl" />
        <h2 className="sm:text-[24px] text-lg font-bold  text-[#1E1E2F] italic">Controm Panel</h2>
        <h1 className="bg-[#1E1E2F] rounded-sm px-3 py-2 text-white sm:text-lg text-xs">ADMIN</h1>
      </div>

      <div className="w-full flex justify-between items-end mt-8 px-2">
        <h2 className="text-[24px] font-bold text-[#1E1E2F] italic">Station #1</h2>

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
      </div>


      {/* Live Data Display */}
      <LiveDataPanel data={mockLiveData} isOn={isOn} />

      {/* Recommendations */}
      <div className="mt-4 p-4 bg-white shadow-md rounded-lg border border-gray-200">
        <h1 className="text-[18px] font-bold">Station Details</h1>
        {
          deviceData ? (
            <ul className="text-[14px] mb-4">
              <li><strong>Device ID : </strong>{deviceData.deviceId}</li>
              <li><strong>Name Of Station : </strong>{deviceData.name}</li>
              <li><strong>Location : </strong>{deviceData.location}</li>
              <li><strong>Status : </strong>{deviceData.status}</li>
              <li><strong>Last Updated : </strong>{deviceData.lastUpdated}</li>

            </ul>
          ) : (
            <p className="text-[14px] text-gray-600">Loading device data...</p>
          )
        }
        <hr />
        <h1 className="font-semibold   text-[18px] mt-4">Recommendations</h1>
        <p className="text-[14px] text-gray-600 italic">{getRecommendation()}</p>
      </div>
    </div>
  );
};

export default ChargerControlPanel;
