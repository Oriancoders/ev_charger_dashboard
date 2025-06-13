// src/pages/MainDashboard.jsx

import Sidebar from "../../SideBar/SideBar";
import BatteryCard from "./components/BatteryCard";
import InfoCard from "./components/InfoCard";
import LiveDataPanel from "./components/LiveDataPanel";
import GraphPanel from "./components/GraphPanel";
import { useGlobalContext } from "../../GlobalStates/GlobalState";

const MainDashboard = () => {
    const {mockLiveData , isOn,} = useGlobalContext()
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

  return (

      <main className=" sm:p-6 p-3 bg-[#F4F6F8] h-screen overflow-y-scroll">
        <div className="grid  lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          <BatteryCard level={mockData.battery} />
          {/* <InfoCard title="Current" value={`${mockData.current}A`} icon="A" /> */}
          <InfoCard title="Power" value={`${mockData.power}kW`} icon="⚡" />
          <InfoCard title="Earnings" value={`${mockData.earnings.toLocaleString()} PKR`} icon="₨" />
        </div>

        <div className="mt-6">
        <LiveDataPanel data={mockLiveData} isOn={isOn} />

        </div>

        <div className="mt-6">
          <GraphPanel graphData={mockData.graphData} />
        </div>
      </main>
  );
};

export default MainDashboard;
