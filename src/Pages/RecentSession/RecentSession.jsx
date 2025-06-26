import { FaClock } from "react-icons/fa";
import { useGlobalContext } from "../../GlobalStates/GlobalState";
// import sessions from "../../MockData/MockData.json";
import { format, parseISO } from "date-fns";

const RecentSession = () => {
  const {ROLE, authData , sessions , formatTimeFromString} = useGlobalContext()

  const session = sessions[sessions.length - 1]; // latest session at top

  return (
    <div className="sm:p-6 p-3 bg-[#F4F6F8] min-h-screen overflow-y-scroll">

        <div className="w-full flex justify-between items-center  font-bold mb-3  px-3">
          <FaClock className="sm:text-2xl text-xl" />
          <h2 className="md:text-[24px] sm:text-lg text-sm font-bold text-[#1E1E2F] italic">Recent Session</h2>

          <h1 className="bg-[#1E1E2F] rounded-sm px-3 py-2 text-white sm:text-sm text-xs">{ROLE == "ADMIN" ? "ADMIN" : authData.username }</h1>
        </div>

        <hr />

      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-4 my-4">

        

        {/* Start Time */}
        <InfoBox
          label="Start Time"
          value={formatTimeFromString(session.startTime)}
          sub={formatTimeFromString(session.startTime)}
          color="text-green-600"
        />

        {/* End Time */}
        <InfoBox
          label="End Time"
          value={formatTimeFromString(session.endTime) || "Ongoing"}
          sub={formatTimeFromString(session.endTime) || 0}
          color="text-red-500"
        />

        {/* Power Supplied */}
        <InfoBox label="Total Power Supply" value={`${session.energyConsumed.toFixed(2)}kW`} color="text-blue-500" />

        {/* Total Cost */}
        <InfoBox label="Total Cost" value={`${session.cost.toFixed(2)} PKR`} color="text-blue-500" />

        {/* Serial */}
        <InfoBox label="About/Serial" value={session.serial} color="text-sky-600" />

      </div>
    </div>
  );
};

const InfoBox = ({ label, value, sub, color = "text- ", children }) => (
  <div className="bg-white p-4 rounded-lg shadow flex flex-col  justify-between gap-y-3 min-h-36">
    <p className="text-lg font-bold italic">{label}</p>
    <p className={`text-[16px] font-bold ${color}`}>{value}</p>
    {sub && <p className="text-xs text-gray-400">{sub}</p>}
    {children}
  </div>
);

const ProgressBar = ({ percentage, color }) => (
  <div className="w-full sm:h-2 h-0.5 bg-gray-200 rounded mt-2">
    <div
      className={`h-2 rounded ${color}`}
      style={{ width: `${percentage}%` }}
    />
  </div>
);

export default RecentSession;
