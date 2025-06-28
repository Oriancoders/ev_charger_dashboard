import { useState, useEffect } from "react";
import LiveDataPanel from "../mainDashboard/components/LiveDataPanel";
import { useGlobalContext } from "../../GlobalStates/GlobalState";
import ApiService from "../../ApiServices/ApiService";

//importing icons 
import { FaBolt } from 'react-icons/fa'; // For the lightning icon (top-left)
import { FaMapMarkerAlt } from 'react-icons/fa'; // For location
import { FaCircle } from 'react-icons/fa'; // For status dot
import { FaClock } from 'react-icons/fa'; // For "Last Updated" timestamp

import { FaServer } from 'react-icons/fa'; // For device info

const ChargerControlPanel = () => {
  const { authData, formatTimeFromString } = useGlobalContext();

  const [deviceData, setDeviceData] = useState(null);
  const [isOn, setIsOn] = useState(null);
  const [switching, setSwitching] = useState(false)
  const [isSessionRunning, setIsSessionRunning] = useState(false)


  // fech deviceId from URL params or context

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const data = await ApiService.getDevices('DEVICE123', authData.accessToken);
        setDeviceData(data);
      } catch (error) {
        console.error("Error fetching device:asdasda", error);
      }
    };

    fetchDevice();
  }, [isOn]);

  useEffect(() => {
    CheckDeviceInService();

  }, [])



  const toggleSwitch = async () => {
    if (!switching) {
      setSwitching(true)
      try {
        const data = await ApiService.setDeviceStatus(authData.accessToken, !isOn);
        setIsOn(data.available)
        console.log("switch chalra hai ", data, switching)
        setSwitching(false)
      } catch {
        alert("Switch nh  chalra !!!!!!!")
        setSwitching(false)
      }
    }else{
      alert("switching/.........")
    }


  }


  const CheckDeviceInService = async () => {
    try {
      const data = await ApiService.isInService(authData.accessToken);
      if (data.isAvailable) {
        setIsOn(data.isAvailable)

      }
    } catch (error) {
      alert("error in fetching status of device")
    }
  }

  const getRecommendation = () => {
    if (!isOn) return "Supply is OFF. No action needed.";
    return "System is operating normally.";
  };

  const handleStop = async () => {

    try {
      const data = await ApiService.stopSession(authData.accessToken)
      console.log("data jo stop honai kai baad session par ara : ", data)

    } catch (error) {
      console.log("nh hua stop", error)
    }

  };


  return (
    <div className="sm:px-6 p-3  rounded-xl shadow-lg space-y-3  h-screen overflow-y-scroll">

      <div className="w-full flex justify-between items-center  font-bold   px-3">
        <FaBolt className="md:text-2xl text-xl" />
        <h2 className="md:text-[24px] sm:text-lg text-sm font-bold  text-[#1E1E2F] italic">Control Panel</h2>
        <h1 className="bg-[#1E1E2F] rounded-sm px-3 py-2 text-white sm:text-sm text-xs">ADMIN</h1>
      </div>
      <hr />
      {/* details of device  */}


      <div className="w-full flex justify-between items-start mt-8 px-2">
        <div>
          <h1 className="text-[24px] font-bold mb-4">Station Details</h1>
          {
            deviceData ? (
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
                  <FaCircle className={deviceData.available ? 'text-green-500' : 'text-gray-400'} />
                  <strong>Status:</strong> {deviceData.available ? 'Available' : 'Unavailable'}
                </li>
                <li className="flex items-center gap-2">
                  <FaClock className="text-blue-500" />
                  <strong>Last Updated:</strong> {formatTimeFromString(deviceData.lastUpdated)}
                </li>
              </ul>
            ) : (
              <p className="text-[14px] text-gray-600">Loading device data...</p>
            )
          }
        </div>

        {/* Capsule Switch */}
        <button
          // disabled
          onClick={() => toggleSwitch()}
          className={`lg:w-20 lg:h-10 sm:w-14 sm:h-6 w-12 h-5 flex items-center rounded-full cursor-pointer p-1 transition-colors ${switching && 'bg-gray-500 disabled'} duration-300 ${isOn && !switching && 'bg-green-500'} ${!isOn && !switching && 'bg-red-500'}  `}
        >
          <div
            className={`lg:w-8 lg:h-8 sm:w-4 sm:h-4 w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isOn ? "lg:translate-x-10 sm:translate-x-8 translate-x-7" : "translate-x-0"
              }`}
          />
        </button>
      </div>


      {/* Live Data Display */}
      <LiveDataPanel />

      {/* Recommendations */}
      <div className="mt-4 p-4 bg-white shadow-md rounded-lg border border-gray-200">

        <h1 className="font-semibold   text-[18px] mt-4">Recommendations</h1>
        <p className="text-[14px] text-gray-600 italic">{getRecommendation()}</p>
      </div>


    </div>
  );
};

export default ChargerControlPanel;
