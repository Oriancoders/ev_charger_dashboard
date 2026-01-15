import React, { useState, useEffect, useMemo } from "react";
import { format, parseISO, isWithinInterval, subDays } from "date-fns";
import historyData from "../../MockData/MockData.json";
import { FaHistory } from "react-icons/fa";
import { useGlobalContext } from "../../GlobalStates/GlobalState";
import ApiService from "../../ApiServices/ApiService";

const normalizeSession = (s, idx = 0) => {
  const startTime = s?.startTime || s?.startedAt || null;
  const endTime = s?.endTime || s?.endedAt || null;

  const energyConsumed =
    s?.energyConsumed ?? (s?.energy != null ? Number(s.energy) : 0);
  const cost = s?.cost != null ? Number(s.cost) : 0;

  const serial =
    s?.serial ||
    s?.id ||
    `EV${String(idx + 1).padStart(3, "0")}`;

  return {
    ...s,
    startTime,
    endTime,
    energyConsumed: Number(energyConsumed || 0),
    cost: Number(cost || 0),
    serial,
  };
};

const computeDuration = (startISO, endISO) => {
  if (!startISO) return { hr: 0, min: 0 };
  const start = new Date(startISO);
  const end = endISO ? new Date(endISO) : new Date();
  const diffMinutes = Math.max(0, (end - start) / 60000);
  const hr = Math.floor(diffMinutes / 60);
  const min = Math.floor(diffMinutes % 60);
  return { hr, min };
};

// ✅ Generate 10 mock sessions within last 10 days (so filters show data)
const generateMockSessions = (count = 10) => {
  const now = Date.now();

  const sessions = Array.from({ length: count }).map((_, i) => {
    // start within last 10 days
    const startOffsetMs = Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000);
    const start = new Date(now - startOffsetMs);

    // duration 10–70 minutes
    const durationMin = 10 + Math.random() * 60;
    const end = new Date(start.getTime() + durationMin * 60 * 1000);

    // energy 2–22 kWh
    const energyConsumed = +(2 + Math.random() * 20).toFixed(2);

    // cost based on energy with rate 55–80 + service fee
    const rate = 55 + Math.random() * 25;
    const serviceFee = 30 + Math.random() * 80;
    const cost = +(energyConsumed * rate + serviceFee).toFixed(0);

    return {
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      energyConsumed,
      cost,
      serial: `EV${String(i + 1).padStart(3, "0")}`,
    };
  });

  // latest first
  sessions.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
  return sessions;
};

const History = () => {
  const today = new Date();

  // ✅ better default: last 10 days
  const defaultFromDate = subDays(today, 10);

  const [fromDate, setFromDate] = useState(format(defaultFromDate, "yyyy-MM-dd"));
  const [toDate, setToDate] = useState(format(today, "yyyy-MM-dd"));
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const {
    ROLE,
    sessions,
    setSessions,
    authData,
    formatDate,
    formatTimeFromString,
    activeSession, // localStorage-backed
  } = useGlobalContext();

  // -----------------------------
  // API Fetch (optional)
  // -----------------------------
  const fetchSessions = async () => {
    try {
      const data = await ApiService.getAllSessions(authData.accessToken);
      const dataWithSerials = (data || []).map((session, index) =>
        normalizeSession(
          { ...session, serial: `EV${String(index + 1).padStart(3, "0")}` },
          index
        )
      );
      setSessions(dataWithSerials);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const fetchUserSessions = async () => {
    try {
      const data = await ApiService.getUserSessions(authData.accessToken);
      const dataWithSerials = (data || []).map((session, index) =>
        normalizeSession(
          { ...session, serial: `EV${String(index + 1).padStart(3, "0")}` },
          index
        )
      );
      setSessions(dataWithSerials);
    } catch (error) {
      console.error("Error fetching user sessions:", error);
    }
  };

  useEffect(() => {
    if (!authData?.accessToken) return;
    if (authData.role === "USER") fetchUserSessions();
    else fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------
  // ✅ Build unified list:
  // 1) activeSession (top)
  // 2) API sessions (if any) else mock sessions (7–10)
  // -----------------------------
  const allSessions = useMemo(() => {
    // ✅ API sessions if available
    const apiSessions = Array.isArray(sessions) ? sessions.map(normalizeSession) : [];

    // ✅ stable mock sessions from JSON
    const mockSessions = Array.isArray(historyData)
      ? historyData.map((s, i) => normalizeSession(s, i))
      : [];

    // ✅ activeSession from localStorage should be on TOP
    const active = activeSession
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

    // if API empty -> use mock
    const base = apiSessions.length > 0 ? apiSessions : mockSessions;

    // remove dup if same serial
    const baseNoDup = active?.serial ? base.filter((s) => s.serial !== active.serial) : base;

    const combined = active ? [active, ...baseNoDup] : baseNoDup;

    combined.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    return combined;
  }, [sessions, activeSession]);


  // -----------------------------
  // Filter + Search
  // -----------------------------
  useEffect(() => {
    if (!fromDate || !toDate) return;

    const startRange = parseISO(fromDate);
    const endRange = new Date(parseISO(toDate));
    endRange.setHours(23, 59, 59, 999);

    const filtered = allSessions.filter((session) => {
      if (!session?.startTime) return false;
      const sessionStart = parseISO(session.startTime);
      return isWithinInterval(sessionStart, { start: startRange, end: endRange });
    });

    const searched = filtered.filter((session) =>
      (session.serial || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredData(searched);
  }, [fromDate, toDate, searchTerm, allSessions]);

  // -----------------------------
  // Summary
  // -----------------------------
  const totalSessions = filteredData.length;

  const totalEnergy = filteredData
    .reduce((acc, curr) => acc + Number(curr.energyConsumed || 0), 0)
    .toFixed(2);

  const totalEarnings = filteredData
    .reduce((acc, curr) => acc + Number(curr.cost || 0), 0)
    .toFixed(2);

  const totalTimeMinutes = filteredData.reduce((acc, curr) => {
    if (!curr?.startTime) return acc;
    const start = new Date(curr.startTime);
    const end = curr.endTime ? new Date(curr.endTime) : new Date();
    return acc + Math.max(0, (end - start) / 60000);
  }, 0);

  const totalHours = Math.floor(totalTimeMinutes / 60);
  const totalMinutes = Math.floor(totalTimeMinutes % 60);

  return (
    <div className="sm:p-6 p-3 bg-[#F4F6F8] h-screen overflow-y-scroll">
      <div className="w-full flex justify-between items-center font-bold mb-3 px-3">
        <FaHistory className="md:text-2xl text-xl" />
        <h2 className="md:text-[24px] sm:text-lg text-sm font-bold text-[#1E1E2F] italic">
          History
        </h2>
        <h1 className="bg-[#1E1E2F] rounded-sm px-3 py-2 text-white sm:text-sm text-xs">
          {ROLE === "ADMIN" ? "ADMIN" : authData?.username || "USER"}
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded p-2 flex lg:flex-row flex-col flex-wrap justify-between lg:items-center gap-4 mb-4">
        <h1 className="text-sm font-bold">Filters</h1>

        <div className="sm:text-sm text-xs">
          <label className="mr-2 font-medium">From Date:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded-2xl px-2 py-1 cursor-pointer"
          />
        </div>

        <div className="sm:text-sm text-xs">
          <label className="mr-2 font-medium">To Date:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded-2xl px-2 py-1 cursor-pointer"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4 mb-4">
        <SummaryCard title="Total Sessions" value={totalSessions} />
        <SummaryCard title="Total Energy Supplied" value={`${totalEnergy} kWh`} />
        <SummaryCard title="Total Earning (PKR)" value={Number(totalEarnings).toLocaleString()} />
        <SummaryCard title="Total Charging Time" value={`${totalHours}hr ${totalMinutes}min`} />
      </div>

      {/* Search */}
      <div className="bg-white shadow sm:text-lg text-sm rounded-lg w-full mb-4">
        <input
          type="text"
          placeholder="Search By Session Id"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 focus:border-blue-700 border-[1px] w-full border-transparent rounded outline-none text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white">
        <table className="w-full table-auto">
          <thead className="bg-gray-200 sm:text-sm text-xs">
            <tr>
              <th className="p-2 border-[1px] border-gray-400">Date</th>
              <th className="p-2 border-[1px] border-gray-400">Session ID</th>
              <th className="p-2 border-[1px] border-gray-400">Energy (kWh)</th>
              <th className="p-2 border-[1px] border-gray-400">Earnings (PKR)</th>
              <th className="p-2 border-[1px] border-gray-400">Time Taken</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((session, index) => {
              const { hr, min } = computeDuration(session.startTime, session.endTime);
              const isOngoing = !session?.endTime;

              return (
                <tr
                  key={`${session.serial}-${index}`}
                  className={`sm:text-sm text-xs ${isOngoing ? "bg-orange-50" : ""}`}
                  title={isOngoing ? "Ongoing session (from localStorage)" : ""}
                >
                  <td className="p-2 border-[1px] border-gray-300">
                    <div className="flex flex-col">
                      <span>{session.startTime ? formatDate(session.startTime) : "N/A"}</span>
                      <span className="text-xs font-bold">
                        {session.startTime ? formatTimeFromString(session.startTime) : "N/A"}
                      </span>
                      {isOngoing && (
                        <span className="text-[10px] font-semibold text-orange-600">
                          Ongoing
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-2 border-[1px] border-gray-300">{session.serial}</td>
                  <td className="p-2 border-[1px] border-gray-300">
                    {Number(session.energyConsumed || 0).toFixed(2)}
                  </td>
                  <td className="p-2 border-[1px] border-gray-300">
                    {Number(session.cost || 0).toFixed(2)}
                  </td>
                  <td className="p-2 border-[1px] border-gray-300">{`${hr}hr ${min}min`}</td>
                </tr>
              );
            })}

            {filteredData.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No data found for selected range — try widening the date range.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value }) => (
  <div className="bg-white shadow p-4 flex flex-col justify-between rounded-2xl gap-y-4 sm:min-h-36 min-h-20">
    <div className="text-sm font-bold italic">{title}</div>
    <div className="sm:text-xl text-xs font-bold text-blue-600">{value}</div>
  </div>
);

export default History;
