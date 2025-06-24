// src/pages/MainDashboard.jsx

import Sidebar from "../../SideBar/SideBar";
import BatteryCard from "./components/BatteryCard";
import InfoCard from "./components/InfoCard";
import LiveDataPanel from "./components/LiveDataPanel";
import GraphPanel from "./components/GraphPanel";
import { useGlobalContext } from "../../GlobalStates/GlobalState";
import { FaTachometerAlt } from "react-icons/fa";
import { useEffect } from "react";
import useTelemetrySocket from "../../hook/useTelemetrySocket";

const MainDashboard = () => {
  const { mockLiveData, ROLE, authData} = useGlobalContext()
  const mockData = {
    battery: 100,
    current: 130,
    power: 130, // in kW
    earnings: 130 * 50, // ₹50/kWh

    graphData: [
      { time: "10:00", kWh: 20 },
      { time: "11:00", kWh: 35 },
      { time: "12:00", kWh: 50 },
    ],
  };
  
  const telemetryData = useTelemetrySocket("DEVICE123",authData.accessToken);
  console.log("Telemetry Data:", telemetryData);
  useEffect(() => {
    
  // const isOn = telemetryData.status === "ON";
  
  }, []);
  useEffect(() => {
    // This effect runs when telemetryData changes
    if (telemetryData) {
      console.log("Updated Telemetry Data:", telemetryData);
    }
  }, [telemetryData]);
  return (
    <></>
    
    // <main className=" sm:p-6 p-3 bg-[#F4F6F8] h-screen overflow-y-scroll">

    //   <div className="w-full flex justify-between items-center  font-bold mb-3  px-3">
    //     <FaTachometerAlt className="sm:text-4xl text-xl" />
    //     <h2 className="sm:text-[24px] text-lg font-bold  text-[#1E1E2F] italic">Main Dashboard</h2>

    //     <h1 className="bg-[#1E1E2F] rounded-sm px-3 py-2 text-white sm:text-lg text-xs">{ROLE == "ADMIN" ? "ADMIN" : authData.username}</h1>
    //   </div>

    //   <div className="grid  lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
    //     <BatteryCard level={mockData.battery} />
    //     {/* <InfoCard title="Current" value={`${mockData.current}A`} icon="A" /> */}
    //     <InfoCard title="Power" value={`${mockData.power}kW`} icon="⚡" />
    //     <InfoCard title="Earnings" value={`${mockData.earnings.toLocaleString()} PKR`} icon="₨" />
    //   </div>

    //   <div className="mt-6">
    //     {/* <LiveDataPanel data={telemetryData} isOn={isOn} /> */}

    //   </div>

    //   <div className="mt-6">
    //     <GraphPanel graphData={mockData.graphData} />
    //   </div>
    // </main>
  );
};

export default MainDashboard;
