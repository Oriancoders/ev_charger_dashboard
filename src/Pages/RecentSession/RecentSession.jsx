import { FaClock } from "react-icons/fa";
import { useMemo } from "react";
import { useGlobalContext } from "../../GlobalStates/GlobalState";

const formatMoney = (n) => new Intl.NumberFormat("en-PK").format(Number(n || 0));

const makeMockSession = () => {
  const now = new Date();
  // start between 8 and 35 minutes ago
  const start = new Date(now.getTime() - (8 + Math.random() * 27) * 60 * 1000);

  // 70% ended, 30% ongoing
  const ended = Math.random() > 0.3;
  const end = ended
    ? new Date(start.getTime() + (6 + Math.random() * 25) * 60 * 1000)
    : null;

  // energy 4-28 kWh-ish
  const energyConsumed = +(4 + Math.random() * 24).toFixed(2);

  // cost roughly tied to energy (rate 55-75 + small fee)
  const rate = 55 + Math.random() * 20;
  const serviceFee = 30 + Math.random() * 70;
  const cost = +(energyConsumed * rate + serviceFee).toFixed(0);

  const serial = `EV-${String(Math.floor(100000 + Math.random() * 900000))}`;

  return {
    startTime: start.toISOString(),
    endTime: end ? end.toISOString() : null,
    energyConsumed,
    cost,
    serial,
  };
};

const RecentSession = () => {
  const {
    ROLE,
    authData,
    sessions,
    formatTimeFromString,
    activeSession, // ✅ from GlobalState
  } = useGlobalContext();

  const session = useMemo(() => {
    // 1) Prefer activeSession if exists (running OR ended)
    if (activeSession) {
      // activeSession schema from your GlobalState:
      // { id, startedAt, endedAt, energy, cost, ... }
      return {
        startTime: activeSession.startedAt,
        endTime: activeSession.endedAt || null,
        energyConsumed: Number(activeSession.energy || 0),
        cost: Number(activeSession.cost || 0),
        serial: activeSession.id || "EV-SESSION",
      };
    }

    // 2) else take last saved session
    if (Array.isArray(sessions) && sessions.length > 0) {
      return sessions[sessions.length - 1];
    }

    // 3) fallback mock
    return makeMockSession();
  }, [activeSession, sessions]);

  const isOngoing = !session?.endTime;

  return (
    <div className="sm:p-6 p-3 bg-[#F4F6F8] min-h-screen overflow-y-scroll">
      <div className="w-full flex justify-between items-center font-bold mb-3 px-3">
        <FaClock className="sm:text-2xl text-xl" />
        <h2 className="md:text-[24px] sm:text-lg text-sm font-bold text-[#1E1E2F] italic">
          Recent Session
        </h2>

        <h1 className="bg-[#1E1E2F] rounded-sm px-3 py-2 text-white sm:text-sm text-xs">
          {ROLE === "ADMIN" ? "ADMIN" : authData?.username || "USER"}
        </h1>
      </div>

      <hr />

      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 my-4">
        {/* Start Time */}
        <InfoBox
          label="Start Time"
          value={formatTimeFromString(session?.startTime) || "—"}
          sub={session?.startTime ? `Started: ${formatTimeFromString(session.startTime)}` : ""}
          color="text-green-600"
        />

        {/* End Time */}
        <InfoBox
          label="End Time"
          value={isOngoing ? "Ongoing" : formatTimeFromString(session?.endTime)}
          sub={
            isOngoing
              ? "Session is still running"
              : session?.endTime
              ? `Ended: ${formatTimeFromString(session.endTime)}`
              : ""
          }
          color={isOngoing ? "text-orange-500" : "text-red-500"}
        />

        {/* Power Supplied */}
        <InfoBox
          label="Total Energy"
          value={`${Number(session?.energyConsumed || 0).toFixed(2)} kWh`}
          sub={isOngoing ? "Live value (mock/active)" : "Final value"}
          color="text-blue-500"
        />

        {/* Total Cost */}
        <InfoBox
          label="Total Cost"
          value={`${formatMoney(session?.cost || 0)} PKR`}
          sub={isOngoing ? "Cost increasing during charging" : "Final billing"}
          color="text-blue-500"
        />

        {/* Serial */}
        <InfoBox
          label="About/Serial"
          value={session?.serial || "—"}
          sub={activeSession ? "Source: activeSession" : sessions?.length ? "Source: sessions[]" : "Source: mock"}
          color="text-sky-600"
        />
      </div>
    </div>
  );
};

const InfoBox = ({ label, value, sub, color = "text-black", children }) => (
  <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-between gap-y-3 min-h-36">
    <p className="text-lg font-bold italic">{label}</p>
    <p className={`text-[16px] font-bold ${color}`}>{value}</p>
    {sub ? <p className="text-xs text-gray-400">{sub}</p> : null}
    {children}
  </div>
);

export default RecentSession;
