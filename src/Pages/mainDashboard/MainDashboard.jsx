// src/pages/MainDashboard.jsx
import BatteryCard from "./components/BatteryCard";
import InfoCard from "./components/InfoCard";
import LiveDataPanel from "./components/LiveDataPanel";
import GraphPanel from "./components/GraphPanel";
import { useGlobalContext } from "../../GlobalStates/GlobalState";
import { FaTachometerAlt } from "react-icons/fa";
import { useMemo } from "react";
import historyData from "../../MockData/MockData.json"; // ✅ same mock used in History

const normalizeSession = (s, idx = 0) => {
  const startTime = s?.startTime || s?.startedAt || null;
  const endTime = s?.endTime || s?.endedAt || null;

  const energyConsumed =
    s?.energyConsumed ?? (s?.energy != null ? Number(s.energy) : 0);

  const cost = s?.cost != null ? Number(s.cost) : 0;

  const serial = s?.serial || s?.id || `EV${String(idx + 1).padStart(3, "0")}`;

  return {
    ...s,
    startTime,
    endTime,
    energyConsumed: Number(energyConsumed || 0),
    cost: Number(cost || 0),
    serial,
  };
};

const formatMoney = (n) =>
  new Intl.NumberFormat("en-PK").format(Number(n || 0));

const MainDashboard = () => {
  const { ROLE, authData, sessions, activeSession } = useGlobalContext();

  // Keep your existing mock visuals for battery/graph
  const mockUI = {
    battery: 100,
    graphData: [
      { time: "10:00", kWh: 20 },
      { time: "11:00", kWh: 35 },
      { time: "12:00", kWh: 50 },
    ],
  };

  // ✅ EXACT same logic as History: activeSession + (API sessions OR mock JSON)
  const { totalEnergyKwh, totalEarningsPkr } = useMemo(() => {
    const apiSessions = Array.isArray(sessions) ? sessions.map(normalizeSession) : [];

    const mockSessions = Array.isArray(historyData)
      ? historyData.map((s, i) => normalizeSession(s, i))
      : [];

    const active = activeSession?.startedAt
      ? normalizeSession(
        {
          startTime: activeSession.startedAt,
          endTime: activeSession.endedAt || null,
          energyConsumed: activeSession.energy,
          cost: activeSession.cost,
          serial: activeSession.id,
        },
        0
      )
      : null;

    // If API empty -> use mock
    const base = apiSessions.length > 0 ? apiSessions : mockSessions;

    // Remove duplicate if base already contains same serial
    const baseNoDup = active?.serial ? base.filter((s) => s.serial !== active.serial) : base;

    // Combined list
    const combined = active ? [active, ...baseNoDup] : baseNoDup;

    // ✅ total = sum everything (same as History when its filter includes all)
    const totalEnergy = combined.reduce((acc, s) => acc + Number(s.energyConsumed || 0), 0);
    const totalEarnings = combined.reduce((acc, s) => acc + Number(s.cost || 0), 0);

    return {
      totalEnergyKwh: totalEnergy,
      totalEarningsPkr: totalEarnings,
    };
  }, [sessions, activeSession]);

  return (
    <main className="sm:p-6 p-3 bg-[#F4F6F8] h-screen overflow-y-scroll">
      

      <div className="w-full flex justify-between items-center font-bold mb-3 px-3">
        <FaTachometerAlt className="sm:text-2xl text-xl" />
        <h2 className="md:text-[24px] sm:text-lg text-sm font-bold text-[#1E1E2F] italic">
          Main Dashboard
        </h2>

        <h1 className="bg-[#1E1E2F] rounded-sm px-3 py-2 text-white sm:text-sm text-xs">
          ADMIN
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        <BatteryCard level={mockUI.battery} />

        <InfoCard
          title="Power Supplied"
          value={`${totalEnergyKwh.toFixed(2)} kWh`}
          icon="⚡"
        />

        <InfoCard
          title="Earnings"
          value={`${formatMoney(totalEarningsPkr)} PKR`}
          icon="₨"
        />
      </div>

      <div className="mt-6">
        <LiveDataPanel />
      </div>

      <div className="mt-6">
        <GraphPanel />
      </div>
    </main>
  );
};

export default MainDashboard;
