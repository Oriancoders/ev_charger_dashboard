// src/components/GraphPanel.jsx
import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGlobalContext } from "../../../GlobalStates/GlobalState"; // adjust path if needed
import historyData from "../../../MockData/MockData.json"; // adjust path if needed

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

const GraphPanel = () => {
  const { sessions, activeSession } = useGlobalContext();

  const chartData = useMemo(() => {
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

    // API if present, otherwise mock
    const base = apiSessions.length > 0 ? apiSessions : mockSessions;

    // remove duplicate if same serial
    const baseNoDup = active?.serial ? base.filter((s) => s.serial !== active.serial) : base;

    const combined = active ? [active, ...baseNoDup] : baseNoDup;

    // Group by date (YYYY-MM-DD)
    const map = new Map();
    combined.forEach((s) => {
      if (!s?.startTime) return;
      const d = new Date(s.startTime);

      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;

      const prev = map.get(key) || { date: key, kWh: 0, cost: 0 };
      prev.kWh += Number(s.energyConsumed || 0);
      prev.cost += Number(s.cost || 0);
      map.set(key, prev);
    });

    // Sort by date ascending
    const sorted = Array.from(map.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Make X-axis pretty: "15 Jan"
    return sorted.map((row) => {
      const d = new Date(row.date);
      const label = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
      return {
        time: label,
        kWh: Number(row.kWh.toFixed(2)),
        cost: Math.round(row.cost),
      };
    });
  }, [sessions, activeSession]);

  const hasData = chartData && chartData.length > 0;

  return (
    <div className="bg-white sm:p-6 p-3 rounded-xl shadow-md">
      <h2 className="text-[24px] font-bold text-[#1E1E2F] mb-4">
        Graphical Representation
      </h2>

      {!hasData ? (
        <div className="text-black/50 italic">No sessions found for graph.</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => {
                if (name === "Cost (PKR)") return [formatMoney(value), name];
                return [value, name];
              }}
            />
            <Line
              type="monotone"
              dataKey="kWh"
              stroke="#0A86F0"
              strokeWidth={2}
              name="Power (kWh)"
            />
            <Line
              type="monotone"
              dataKey="cost"
              stroke="#00AA06"
              strokeWidth={2}
              name="Cost (PKR)"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default GraphPanel;
