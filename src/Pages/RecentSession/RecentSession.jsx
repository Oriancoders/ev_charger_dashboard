import sessions from "../../MockData/MockData.json";
import { format, parseISO } from "date-fns";

const RecentSession = () => {
  const session = sessions[4]; // latest session at top

  return (
    <div className="p-6 bg-[#F4F6F8] h-screen overflow-y-scroll">
      <h2 className="text-2xl font-bold mb-4 text-[#1E1E2F]">Most Recent Charge</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Battery when plugged in */}
        <InfoBox label="Battery When Plug In" value={`${session.batteryIn}%`}>
          <ProgressBar percentage={session.batteryIn} color="bg-green-400" />
        </InfoBox>

        {/* Battery when plugged out */}
        <InfoBox label="Battery When Plug Out" value={`${session.batteryOut}%`}>
          <ProgressBar percentage={session.batteryOut} color="bg-yellow-400" />
        </InfoBox>

        {/* Start Time */}
        <InfoBox
          label="Start Time"
          value={format(parseISO(session.startTime), "h:mm a")}
          sub={format(parseISO(session.startTime), "dd/MMM/yyyy")}
          color="text-green-600"
        />

        {/* End Time */}
        <InfoBox
          label="End Time"
          value={format(parseISO(session.endTime), "h:mm a")}
          sub={format(parseISO(session.endTime), "dd/MMM/yyyy")}
          color="text-red-500"
        />

        {/* Power Supplied */}
        <InfoBox label="Total Power Supply" value={`${session.powerSupplied}kW`} color="text-blue-500" />

        {/* Total Cost */}
        <InfoBox label="Total Cost" value={`${session.cost} PKR`} color="text-blue-500" />

        {/* Serial */}
        <InfoBox label="About/Serial" value={session.serial} color="text-sky-600" />

      </div>
    </div>
  );
};

const InfoBox = ({ label, value, sub, color = "text-black", children }) => (
  <div className="bg-white p-4 rounded-lg shadow flex flex-col  justify-between gap-y-3">
    <p className="text-2xl font-bold italic">{label}</p>
    <p className={`text-xl font-bold ${color}`}>{value}</p>
    {sub && <p className="text-xs text-gray-400">{sub}</p>}
    {children}
  </div>
);

const ProgressBar = ({ percentage, color }) => (
  <div className="w-full h-2 bg-gray-200 rounded mt-2">
    <div
      className={`h-2 rounded ${color}`}
      style={{ width: `${percentage}%` }}
    />
  </div>
);

export default RecentSession;
