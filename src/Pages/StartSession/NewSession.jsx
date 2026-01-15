import React, { useState, useEffect, useRef } from "react";
import {
    FaBolt,
    FaThermometerHalf,
    FaPlug,
    FaPlus,
    FaClock,
    FaMoneyBill,
} from "react-icons/fa";
import { useGlobalContext } from "../../GlobalStates/GlobalState";
import html2canvas from "html2canvas";
import { parse, formatRgb } from "culori";

const formatMoney = (n) => new Intl.NumberFormat("en-PK").format(Number(n || 0));

const formatDateTime = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const hh = String(h).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    const ss = String(s).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
};

const NewSession = () => {
    const {
        authData,
        isOn,
        carConnectd,
        setCarConnected,
        chargingStatus,
        setChargingStatus,

        // ✅ NEW (from GlobalState.jsx you pasted)
        activeSession,
        startChargingSession,
        stopChargingSession,
        clearActiveSession
    } = useGlobalContext();

    // user inputs (keep local, but we also sync them from activeSession if exists)
    const [sessionName, setSessionName] = useState("");
    const [vehicleName, setVehicleName] = useState("");
    const [portType, setPortType] = useState("");
    const [maxBudget, setMaxBudget] = useState("");

    // availability checks (still local)
    const [status, setstatus] = useState("supplyOff"); // supplyOff | checking | checkingStation | stationBusy | allChecked
    const [isDeviceAvailable, setIsDeviceAvailable] = useState(null);
    const [isStationAvailable, setIsStationAvailable] = useState(null);

    // derived session flags from global session
    const sessionStarted = !!activeSession && !activeSession.endedAt;
    const sessionEnded = !!activeSession && !!activeSession.endedAt;

    // derived metrics from global session
    const energy = activeSession?.energy ?? 0;
    const temperature = activeSession?.temperature ?? 30;
    const cost = activeSession?.cost ?? 0;
    const time = activeSession?.elapsedSeconds ?? 0;

    // invoice/session metadata from global session
    const invoiceId = activeSession?.id ?? "—";
    const sessionStartAt = activeSession?.startedAt ?? null;
    const sessionEndAt = activeSession?.endedAt ?? null;

    // prevents state updates if component unmounts mid-timeout
    const aliveRef = useRef(true);
    useEffect(() => {
        aliveRef.current = true;
        return () => {
            aliveRef.current = false;
        };
    }, []);

    // If a session exists (came back to tab), hydrate input fields (so UI feels consistent)
    useEffect(() => {
        if (!activeSession) return;

        if (activeSession.sessionName) setSessionName(activeSession.sessionName);
        if (activeSession.vehicleName) setVehicleName(activeSession.vehicleName);
        if (activeSession.portType) setPortType(activeSession.portType);
        if (activeSession.maxBudget !== undefined && activeSession.maxBudget !== null)
            setMaxBudget(String(activeSession.maxBudget));
    }, [activeSession]);

    // ----------------------------
    // ✅ MOCK FLOW: Device -> Station -> Ready (only when isOn = true)
    // ----------------------------
    const runMockAvailabilityChecks = async () => {
        if (!isOn) return; // 🔒 do nothing if supply is OFF

        setstatus("checking");
        setIsDeviceAvailable(null);
        setIsStationAvailable(null);

        setChargingStatus("Checking");
        setCarConnected(true);

        // Step 1: device in service (1s)
        await new Promise((r) => setTimeout(r, 1000));
        if (!aliveRef.current || !isOn) return;

        const deviceOk = Math.random() > 0.1; // 90%
        setIsDeviceAvailable(deviceOk);

        if (!deviceOk) {
            setChargingStatus("Maintenance");
            setstatus("checking");
            setIsStationAvailable(false);
            return;
        }

        // Step 2: station free (1s)
        setstatus("checkingStation");
        await new Promise((r) => setTimeout(r, 1000));
        if (!aliveRef.current || !isOn) return;

        const stationFree = Math.random() > 0.3; // 70%
        setIsStationAvailable(stationFree);

        if (!stationFree) {
            setChargingStatus("Busy");
            setstatus("stationBusy");
            return;
        }

        setChargingStatus("Ready");
        setstatus("allChecked");
    };

    // ✅ React to supply state.
    // IMPORTANT: Do NOT reset the running session here anymore.
    // Running session is handled in GlobalState (auto stop on supply OFF).
    useEffect(() => {
        if (isOn) {
            // when supply turns ON -> start checks (only if no active running session)
            if (!sessionStarted) runMockAvailabilityChecks();
        } else {
            // supply off -> just reflect UI state
            setstatus("supplyOff");
            setIsDeviceAvailable(null);
            setIsStationAvailable(null);
            setCarConnected(false);
            setChargingStatus("Idle");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOn]);

    // If session ended, re-check availability (only if supply ON)
    useEffect(() => {
        if (sessionEnded && isOn) {
            runMockAvailabilityChecks();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionEnded, isOn]);

    // If session is currently running, make UI show that charger is busy/locked
    useEffect(() => {
        if (sessionStarted) {
            setstatus("allChecked"); // keep the page "ready"
            setIsDeviceAvailable(true);
            setIsStationAvailable(true);
            setCarConnected(true);
            setChargingStatus("Charging");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionStarted]);

    // ----------------------------
    // ✅ Start/Stop (NOW GLOBAL)
    // ----------------------------

    const handleStart = async () => {
        if (!isOn) return alert("Supply is OFF. Turn ON supply first.");
        if (!carConnectd) return alert("Vehicle not connected!");
        if (!isDeviceAvailable || !isStationAvailable) return;

        setChargingStatus("Preparing");
        await new Promise((r) => setTimeout(r, 800));
        if (!aliveRef.current || !isOn) return;

        startChargingSession({
            maxBudget,
            vehicleName,
            portType,
            sessionName,
            stationName: "EV Station 01",
            deviceId: "DEVICE123",
        });

        // chargingStatus is also set in global, but keeping this makes UI instant
        setChargingStatus("Charging");
    };

    const handleStop = async () => {
        setChargingStatus("Stopping");
        await new Promise((r) => setTimeout(r, 600));
        if (!aliveRef.current) return;

        stopChargingSession();
        setChargingStatus("Ended");
    };
    const handleNewSession = () => {
        // clear the ended session so UI goes back to start screen
        clearActiveSession();

        // reset local form fields
        setSessionName("");
        setVehicleName("");
        setPortType("");
        setMaxBudget("");

        // reset availability UI
        if (isOn) {
            runMockAvailabilityChecks();
        } else {
            setstatus("supplyOff");
            setIsDeviceAvailable(null);
            setIsStationAvailable(null);
        }
    };

    // ----------------------------
    // ✅ BILL DOWNLOAD (PNG) - export invoice only
    // ----------------------------
    const downloadBill = async () => {
        const node = document.getElementById("invoice-export");
        if (!node) return alert("Invoice not found!");

        // Clone node so we can safely modify styles for export only
        const clone = node.cloneNode(true);
        clone.style.width = `${node.offsetWidth}px`;
        clone.style.background = "#ffffff";

        // Put clone off-screen
        const wrapper = document.createElement("div");
        wrapper.style.position = "fixed";
        wrapper.style.left = "-10000px";
        wrapper.style.top = "0px";
        wrapper.style.background = "#ffffff";
        wrapper.appendChild(clone);
        document.body.appendChild(wrapper);

        const fixOklch = (value) => {
            if (!value || typeof value !== "string") return value;
            if (!value.includes("oklch(")) return value;
            const c = parse(value);
            if (!c) return value;
            return formatRgb(c);
        };

        const COLOR_PROPS = [
            "color",
            "backgroundColor",
            "borderTopColor",
            "borderRightColor",
            "borderBottomColor",
            "borderLeftColor",
            "outlineColor",
            "textDecorationColor",
            "boxShadow",
        ];

        const all = wrapper.querySelectorAll("*");
        all.forEach((el) => {
            const cs = window.getComputedStyle(el);

            COLOR_PROPS.forEach((prop) => {
                const val = cs[prop];
                if (!val) return;

                if (prop === "boxShadow") {
                    el.style.boxShadow = val.replace(/oklch\([^)]+\)/g, (m) => fixOklch(m));
                    return;
                }

                const fixed = fixOklch(val);
                if (fixed !== val) el.style[prop] = fixed;
            });

            if (el.classList?.contains("no-export")) {
                el.style.display = "none";
            }
        });

        try {
            const canvas = await html2canvas(wrapper, {
                backgroundColor: "#ffffff",
                scale: 3,
                useCORS: true,
            });

            const link = document.createElement("a");
            link.download = `EV-Invoice-${invoiceId !== "—" ? invoiceId : Date.now()}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (e) {
            console.error(e);
            alert("Bill download failed. Check console.");
        } finally {
            document.body.removeChild(wrapper);
        }
    };

    return (
        <div className="sm:p-6 p-3 bg-[#F4F6F8] h-screen overflow-y-scroll">
            <div className="w-full flex justify-between items-center font-bold mb-3 px-3">
                <FaPlus className="sm:text-2xl text-xl" />
                <h2 className="md:text-[24px] sm:text-lg text-sm font-bold text-[#1E1E2F] italic">
                    Activate Session
                </h2>

                <h1 className="bg-[#1E1E2F] rounded-sm px-3 py-2 text-white sm:text-sm text-xs">
                    {authData?.username || "USER"}
                </h1>
            </div>
         <hr />
            {/* ===============================
          BEFORE SESSION (no running session)
         =============================== */}
            {!sessionStarted && !sessionEnded && (
                <>
                    <h1 className="text-3xl font-bold my-6 text-center">
                        Welcome to EV Station 01
                    </h1>

                    {status === "supplyOff" && (
                        <div className="sm:text-5xl text-2xl font-bold bg-red-500 text-white text-center p-20 rounded-2xl">
                            Supply is OFF <br />
                            Turn ON supply to check availability
                        </div>
                    )}

                    {isOn && status === "checking" && (
                        <div className="sm:text-5xl text-2xl font-bold bg-gray-500 text-white text-center p-20 rounded-2xl">
                            {isDeviceAvailable === null && " Checking if device is in service...."}
                            {isDeviceAvailable === true && " Device is Working "}
                            {isDeviceAvailable === false && " Device is under maintenance "}
                        </div>
                    )}

                    {isOn && status === "checkingStation" && isDeviceAvailable === true && (
                        <div className="sm:text-5xl text-2xl font-bold bg-gray-500 text-white text-center p-20 rounded-2xl">
                            Device Checked <br />
                            {isStationAvailable === null && " Checking if station is available ...."}
                            {isStationAvailable === true &&
                                " Device is Working and station is free to use "}
                            {isStationAvailable === false &&
                                " Device is working but station is not free "}
                        </div>
                    )}

                    {isOn &&
                        status === "stationBusy" &&
                        isDeviceAvailable === true &&
                        isStationAvailable === false && (
                            <div className="sm:text-5xl text-2xl font-bold bg-gray-500 text-white text-center p-20 rounded-2xl">
                                Device Checked <br />
                                But Station is used by another user. Please wait
                                <button
                                    type="button"
                                    onClick={runMockAvailabilityChecks}
                                    className="block mx-auto mt-6 text-lg bg-white text-gray-800 px-6 py-3 rounded-lg"
                                >
                                    Recheck
                                </button>
                            </div>
                        )}

                    {isOn && status === "allChecked" && (
                        <div className="sm:text-5xl text-2xl font-bold bg-green-500 text-white text-center p-20 rounded-2xl">
                            Device Checked <br />
                            Station is Free <br />
                            Now you can use it
                        </div>
                    )}

                    <form className="p-3 w-full">
                        <div className="grid grid-cols-1 w-full gap-4">
                            <div className="flex flex-col gap-y-2 col-span-1">
                                <label className="text-xl italic font-semibold">
                                    Enter Your Max Budget{" "}
                                    <span className="text-black/50 text-xs">
                                        (Session will automatically stop when budget reached)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Maximum Budget (eg : 40000)"
                                    value={maxBudget}
                                    onChange={(e) => setMaxBudget(e.target.value)}
                                    className="bg-white shadow text-sm p-2 focus:border-blue-700 border-[1px] w-full border-transparent rounded outline-none text-[16px]"
                                />
                            </div>
                        </div>

                        <div
                            className={`mt-4 p-4 text-white rounded flex items-center justify-between ${carConnectd ? "bg-green-500" : "bg-red-500"
                                }`}
                        >
                            <span className="text-xl font-semibold">
                                Vehicle {carConnectd ? "Connected" : "Not Connected"}
                            </span>
                            <span className="text-2xl mainBlue bg-white p-2 rounded-full fromBlue">
                                <FaPlug />
                            </span>
                        </div>

                        {isOn && isDeviceAvailable && isStationAvailable && (
                            <button
                                type="button"
                                onClick={handleStart}
                                disabled={!(isOn && isStationAvailable && isDeviceAvailable && carConnectd)}
                                className={`mt-6 w-full p-3 rounded text-white font-semibold transition ${isOn && isStationAvailable && isDeviceAvailable && carConnectd
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                Start Session
                            </button>
                        )}
                    </form>
                </>
            )}

            {/* ===============================
          RUNNING SESSION (GLOBAL)
         =============================== */}
            {sessionStarted && !sessionEnded && (
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold">Charging Session</h2>
                        <span className="text-sm px-3 py-2 rounded bg-white shadow">
                            Status: <strong>{chargingStatus}</strong>
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="shadow p-2 bg-white rounded">
                            Max Budget: <strong>{activeSession?.maxBudget ?? maxBudget}</strong> PKR
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center mb-6">
                        <div className="bg-white p-4 rounded min-h-36 flex flex-col justify-evenly items-center gap-y-4">
                            <FaBolt className="sm:text-5xl text-2xl bg-[#AFAFAF]/20 rounded-full p-2 text-blue-500" />
                            <h1 className="font-bold text-lg">Energy</h1>
                            <strong>{energy} kWh</strong>
                        </div>

                        <div className="bg-white p-4 rounded min-h-36 flex flex-col justify-evenly items-center gap-y-4">
                            <FaThermometerHalf className="sm:text-5xl text-2xl bg-[#AFAFAF]/20 rounded-full p-2 text-blue-500" />
                            <h1 className="font-bold text-lg">Temperature</h1>
                            <strong>{temperature}°C</strong>
                        </div>

                        <div className="bg-white p-4 rounded min-h-36 flex flex-col justify-evenly items-center gap-y-4">
                            <FaClock className="sm:text-5xl text-2xl bg-[#AFAFAF]/20 rounded-full p-2 text-blue-500" />
                            <h1 className="font-bold text-lg">Time Taken</h1>
                            <strong>{formatDuration(time)}</strong>
                        </div>

                        <div className="bg-white p-4 rounded min-h-36 flex flex-col justify-evenly items-center gap-y-4">
                            <FaMoneyBill className="sm:text-5xl text-2xl bg-[#AFAFAF]/20 rounded-full p-2 text-blue-500" />
                            <h1 className="font-bold text-lg">Amount</h1>
                            <strong>{cost} PKR</strong>
                        </div>
                    </div>

                    <button
                        onClick={handleStop}
                        className="w-full p-3 bg-red-600 text-white rounded font-semibold hover:bg-red-700"
                    >
                        Stop Session
                    </button>
                </div>
            )}

            {/* ===============================
          ENDED SESSION (INVOICE)
         =============================== */}
            {sessionEnded && (
                <div className="w-full flex flex-col items-center gap-4 mt-6">
                    <div
                        id="invoice-export"
                        className="bg-white w-[820px] max-w-full rounded-xl border border-gray-200 shadow-sm"
                        style={{ color: "#111827", backgroundColor: "#ffffff" }}
                    >
                        <div className="px-6 py-5 border-b border-gray-200 flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                                    EV Charging Invoice
                                </h2>
                                <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
                                    Payment Receipt & Session Summary
                                </p>
                            </div>

                            <div className="text-right">
                                <div
                                    className="inline-block px-3 py-1 rounded-md text-sm font-semibold"
                                    style={{ backgroundColor: "#dcfce7", color: "#166534" }}
                                >
                                    PAID
                                </div>
                                <p className="text-sm mt-2" style={{ color: "#374151" }}>
                                    Invoice ID: <strong>{invoiceId}</strong>
                                </p>
                                <p className="text-xs" style={{ color: "#6b7280" }}>
                                    Generated: {formatDateTime(new Date().toISOString())}
                                </p>
                            </div>
                        </div>

                        <div className="px-6 py-5 grid sm:grid-cols-2 grid-cols-1 gap-4">
                            <div className="rounded-lg border border-gray-200 p-4">
                                <h3 className="text-sm font-semibold mb-2" style={{ color: "#0f172a" }}>
                                    Customer
                                </h3>
                                <p className="text-sm" style={{ color: "#374151" }}>
                                    <strong>Name:</strong> {authData?.username || "Default User"}
                                </p>
                                <p className="text-sm" style={{ color: "#374151" }}>
                                    <strong>Vehicle:</strong> {activeSession?.vehicleName || vehicleName || "—"}
                                </p>
                                <p className="text-sm" style={{ color: "#374151" }}>
                                    <strong>Port Type:</strong> {activeSession?.portType || portType || "Type-2"}
                                </p>
                            </div>

                            <div className="rounded-lg border border-gray-200 p-4">
                                <h3 className="text-sm font-semibold mb-2" style={{ color: "#0f172a" }}>
                                    Station
                                </h3>
                                <p className="text-sm" style={{ color: "#374151" }}>
                                    <strong>Station:</strong> {activeSession?.stationName || "EV Station 01"}
                                </p>
                                <p className="text-sm" style={{ color: "#374151" }}>
                                    <strong>Device:</strong> {activeSession?.deviceId || "DEVICE123"}
                                </p>
                                <p className="text-sm" style={{ color: "#374151" }}>
                                    <strong>Supply:</strong> {isOn ? "ON" : "OFF"}
                                </p>
                            </div>
                        </div>

                        <div className="px-6 pb-2">
                            <div className="rounded-lg border border-gray-200 p-4 grid sm:grid-cols-2 grid-cols-1 gap-2">
                                <p className="text-sm" style={{ color: "#374151" }}>
                                    <strong>Start:</strong> {formatDateTime(sessionStartAt)}
                                </p>
                                <p className="text-sm sm:text-right" style={{ color: "#374151" }}>
                                    <strong>End:</strong> {formatDateTime(sessionEndAt)}
                                </p>
                                <p className="text-sm" style={{ color: "#374151" }}>
                                    <strong>Duration:</strong> {formatDuration(time)}
                                </p>
                                <p className="text-sm sm:text-right" style={{ color: "#374151" }}>
                                    <strong>Avg Temp:</strong> {temperature}°C
                                </p>
                            </div>
                        </div>

                        <div className="px-6 py-5">
                            <div className="rounded-lg border border-gray-200 overflow-hidden">
                                <div
                                    className="grid grid-cols-12 px-4 py-3 text-xs font-semibold"
                                    style={{ backgroundColor: "#f9fafb", color: "#374151" }}
                                >
                                    <div className="col-span-6">Description</div>
                                    <div className="col-span-2 text-right">Qty</div>
                                    <div className="col-span-2 text-right">Rate</div>
                                    <div className="col-span-2 text-right">Amount</div>
                                </div>

                                {(() => {
                                    const kwh = Number(energy || 0);
                                    const rate = 65; // PKR per kWh (mock)
                                    const subtotal = Math.round(kwh * rate);
                                    const serviceFee = 50;

                                    const total = Math.max(cost, subtotal + serviceFee);

                                    return (
                                        <>
                                            <div className="grid grid-cols-12 px-4 py-3 text-sm border-t border-gray-200">
                                                <div className="col-span-6">Energy Consumption</div>
                                                <div className="col-span-2 text-right">{kwh.toFixed(2)}</div>
                                                <div className="col-span-2 text-right">{formatMoney(rate)}</div>
                                                <div className="col-span-2 text-right">{formatMoney(subtotal)}</div>
                                            </div>

                                            <div className="grid grid-cols-12 px-4 py-3 text-sm border-t border-gray-200">
                                                <div className="col-span-6">Service Fee</div>
                                                <div className="col-span-2 text-right">1</div>
                                                <div className="col-span-2 text-right">{formatMoney(serviceFee)}</div>
                                                <div className="col-span-2 text-right">{formatMoney(serviceFee)}</div>
                                            </div>

                                            <div className="border-t border-gray-200 px-4 py-4">
                                                <div className="flex justify-between text-sm">
                                                    <span style={{ color: "#6b7280" }}>Subtotal</span>
                                                    <strong>{formatMoney(subtotal)} PKR</strong>
                                                </div>
                                                <div className="flex justify-between text-sm mt-1">
                                                    <span style={{ color: "#6b7280" }}>Service Fee</span>
                                                    <strong>{formatMoney(serviceFee)} PKR</strong>
                                                </div>

                                                <div className="flex justify-between text-lg mt-4">
                                                    <span className="font-semibold">Total</span>
                                                    <span className="font-bold" style={{ color: "#0f172a" }}>
                                                        {formatMoney(total)} PKR
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>

                            <div className="pt-4 text-xs" style={{ color: "#6b7280" }}>
                                * Mock invoice for UI testing. Replace values with API billing response.
                            </div>
                        </div>
                    </div>

                    <div className="w-[820px] max-w-full no-export grid sm:grid-cols-2 grid-cols-1 gap-3">
                        <button
                            onClick={downloadBill}
                            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded w-full"
                        >
                            📥 Download Bill
                        </button>

                        <button
                            onClick={handleNewSession}
                            className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded w-full"
                        >
                            🔁 Start New Session
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewSession;
