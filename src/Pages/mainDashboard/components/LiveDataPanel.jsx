import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaBolt,
  FaThermometerHalf,
  FaPlug,
  FaCar,
  FaChargingStation,
} from "react-icons/fa";
import { useGlobalContext } from "../../../GlobalStates/GlobalState";

// helpers
const rand = (min, max) => Math.random() * (max - min) + min;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const RANGES = {
  voltage: { min: 210, max: 245 }, // V
  current: { min: 0, max: 32 }, // A
  temperature: { min: 25, max: 70 }, // °C
};

// realistic-ish status transitions (only used when vehicle connected)
const NEXT_STATUS = {
  Preparing: ["Charging", "Preparing"],
  Charging: ["Charging", "Charging", "Paused"], // mostly charging
  Paused: ["Charging", "Preparing", "Paused"],
};

const makeNextTelemetry = (prev, vehicleConnected, status) => {
  const prevV = prev?.voltage ?? rand(RANGES.voltage.min, RANGES.voltage.max);
  const prevI = prev?.current ?? rand(RANGES.current.min, RANGES.current.max);
  const prevT =
    prev?.temperature ?? rand(RANGES.temperature.min, RANGES.temperature.max);

  // voltage: small drift
  const voltage = clamp(
    prevV + rand(-2.5, 2.5),
    RANGES.voltage.min,
    RANGES.voltage.max
  );

  // current: if not connected -> near 0, if connected -> depends on status
  let targetCurrent = 0;
  if (vehicleConnected) {
    if (status === "Charging") targetCurrent = rand(10, RANGES.current.max);
    else if (status === "Preparing") targetCurrent = rand(0, 6);
    else if (status === "Paused") targetCurrent = rand(0, 2);
  } else {
    targetCurrent = rand(0, 0.8);
  }

  // smooth current changes
  const current = clamp(
    prevI + (targetCurrent - prevI) * 0.25 + rand(-0.5, 0.5),
    RANGES.current.min,
    RANGES.current.max
  );

  // temperature: rises slowly when charging, cools slowly otherwise
  const tempDrift =
    vehicleConnected && status === "Charging"
      ? rand(0.0, 0.25)
      : rand(-0.2, 0.1);
  const temperature = clamp(
    prevT + tempDrift,
    RANGES.temperature.min,
    RANGES.temperature.max
  );

  return {
    voltage: Number(voltage.toFixed(1)),
    current: Number(current.toFixed(1)),
    temperature: Number(temperature.toFixed(1)),
    status,
    vehicle: vehicleConnected,
  };
};

const LiveDataPanel = () => {
  const {
    // ✅ these are already backed by localStorage via activeSession
    activeSession,
    chargingStatus,
    carConnectd,
    isOn,
  } = useGlobalContext();

  const [telemetryData, setTelemetryData] = useState(null);

  // ---- Refs for mock-only behavior (smooth telemetry)
  const lastStatusChangeAtRef = useRef(0);
  const statusRef = useRef("Idle");

  // Decide if we should use "real" state (localstorage/global) or pure mock.
  // If session exists (running OR ended), we prefer global/local storage truth.
  const hasSession = !!activeSession;

  const derivedVehicle = useMemo(() => {
    // if supply is OFF, vehicle should be false
    if (!isOn) return false;

    // if we have an active session, vehicle must be connected (realistic)
    if (activeSession && !activeSession.endedAt) return true;

    // otherwise use global carConnectd
    return !!carConnectd;
  }, [isOn, activeSession, carConnectd]);

  const derivedStatus = useMemo(() => {
    // supply off => idle
    if (!isOn) return "Idle";

    // If session is running, always "Charging"
    if (activeSession && !activeSession.endedAt) return "Charging";

    // If ended, show ended
    if (activeSession && activeSession.endedAt) return "Ended";

    // fallback to global chargingStatus
    return chargingStatus || "Idle";
  }, [isOn, activeSession, chargingStatus]);

  // 0.5s telemetry update loop
  useEffect(() => {
    const now = Date.now();
    lastStatusChangeAtRef.current = now;
    statusRef.current = derivedStatus;

    // initial
    setTelemetryData((prev) => makeNextTelemetry(prev, derivedVehicle, statusRef.current));

    const interval = setInterval(() => {
      const t = Date.now();

      // If we're not in a real session, we can gently "animate" between Preparing/Charging/Paused
      // BUT: charging only when vehicle connected, and do NOT change too fast
      const canAnimateStatus = !activeSession || (activeSession && activeSession.endedAt);

      if (canAnimateStatus) {
        const statusChangeMin = 8_000;
        const statusChangeMax = 20_000;
        const statusDue =
          t - lastStatusChangeAtRef.current >= rand(statusChangeMin, statusChangeMax);

        if (statusDue) {
          if (!derivedVehicle) {
            statusRef.current = "Idle";
          } else {
            const currentStatus = statusRef.current;

            // "Ended" should stay ended if activeSession ended
            if (activeSession?.endedAt) {
              statusRef.current = "Ended";
            } else if (currentStatus === "Idle") {
              statusRef.current = "Preparing";
            } else {
              statusRef.current = pick(NEXT_STATUS[currentStatus] || ["Preparing", "Charging"]);
            }
          }
          lastStatusChangeAtRef.current = t;
        }
      } else {
        // Real session running => lock status to Charging
        statusRef.current = derivedStatus;
      }

      // Update telemetry numbers (always)
      setTelemetryData((prev) => makeNextTelemetry(prev, derivedVehicle, statusRef.current));
    }, 500);

    return () => clearInterval(interval);
  }, [derivedVehicle, derivedStatus, activeSession]);

  // compute kW properly: (V*A)/1000
  const powerKw = useMemo(() => {
    if (!telemetryData) return 0;
    const watts = (telemetryData.voltage ?? 0) * (telemetryData.current ?? 0);
    return watts / 1000;
  }, [telemetryData]);

  // "Charging" visual highlight only if vehicle connected AND status is Charging
  const isChargingNow = telemetryData?.vehicle && telemetryData?.status === "Charging";

  return (
    <div className="bg-white p-3 rounded-xl shadow-md">
      <h2 className="text-lg font-bold text-[#1E1E2F] mb-4 italic">
        Current Live Data Supply
      </h2>

      {telemetryData ? (
        <div className="grid xl:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-4">
          <LiveCard
            label="Voltage"
            value={`${telemetryData.voltage || 0} V`}
            icon={<FaChargingStation />}
          />
          <LiveCard
            label="Current"
            value={`${telemetryData.current || 0} A`}
            icon={<FaBolt />}
          />
          <LiveCard
            label="Power"
            value={`${powerKw.toFixed(2) || 0} kW`}
            icon={<FaBolt />}
          />
          <LiveCard
            label="Temp"
            value={`${telemetryData.temperature || 0} °C`}
            icon={<FaThermometerHalf />}
          />

          <LiveCard
            label="Status"
            value={telemetryData.status || "Idle"}
            icon={<FaPlug />}
            bg={isChargingNow ? "bg-[#C1F9AA]" : "bg-[#F4BFBF]"}
            text={isChargingNow ? "text-green-700" : "text-red-600"}
          />

          <LiveCard
            label="Vehicle"
            value={telemetryData.vehicle ? "Connected" : "None"}
            icon={<FaCar />}
            bg={telemetryData.vehicle ? "bg-[#C1F9AA]" : "bg-[#F4BFBF]"}
            text={telemetryData.vehicle ? "text-green-700" : "text-red-600"}
          />
        </div>
      ) : (
        <h1 className="text-xl font-semibold text-black/50">
          fetching live data .........
        </h1>
      )}
    </div>
  );
};

const LiveCard = ({
  label,
  value,
  icon,
  bg = "bg-white",
  text = "text-[#1E1E2F]",
}) => (
  <div className={`p-4 group rounded-xl shadow ${bg}`}>
    <div className="flex items-center flex-col text-center gap-y-3">
      <span className={`text-2xl mainBlue bg-[#AFAFAF]/20 p-2 rounded-full fromBlue ${text}`}>
        {icon}
      </span>
      <p className="text-lg text-[#5a5a5a] italic">{label}</p>
      <h4 className={`text-[16px] font-semibold ${text}`}>
        <i>{value}</i>
      </h4>
    </div>
  </div>
);

export default LiveDataPanel;
