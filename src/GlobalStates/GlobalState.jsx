import React, { createContext, useState, useContext, useEffect } from "react";
// import useTelemetrySocket from '../hook/useTelemetrySocket'; // keep if you need it elsewhere

// Create a new context
const GlobalContext = createContext();

// Custom hook to use the GlobalContext easily
export const useGlobalContext = () => {
    return useContext(GlobalContext);
};




// Create a provider component
export const GlobalProvider = ({ children }) => {
    const [scrwidth, setWidth] = useState(window.innerWidth);
    const [activeItem, setActiveItem] = useState("Main Dashboard");
    const [isLoginPage, setIsLoginPage] = useState(false);

    // Supply switch
    const [isOn, setIsOn] = useState(true);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authType, setAuthType] = useState("Login");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Device / Session globals
    const [carConnectd, setCarConnected] = useState(false);
    const [chargingStatus, setChargingStatus] = useState("Idle");
    const [isSideBarOpen, setIsSideBarOpen] = useState(true)


    const [ROLE, setROLE] = useState("USER");

    const [authData, setAuthData] = useState({
        id: "2132323",
        username: "Fatima",
        email: "fatima@slackerIOT.com",
        role: "ADMIN",
        accessToken: "213123123123123",
    });

    const [sessions, setSessions] = useState([]); // For storing session history data
    const [filteredSessionsData, setFilteredSessionsData] = useState([]);

    // ----------------------------
    // ✅ ACTIVE SESSION (PERSISTS + RUNS IN BACKGROUND)
    // ----------------------------
    const [activeSession, setActiveSession] = useState(() => {
        try {
            const raw = localStorage.getItem("ev_active_session");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });

    const handleActiveItem = (item) => {
        setActiveItem(item);
        if (scrwidth < 765) {
            setIsSideBarOpen(false)
        }
    }

    // Persist active session
    useEffect(() => {
        try {
            if (activeSession) {
                localStorage.setItem("ev_active_session", JSON.stringify(activeSession));
            } else {
                localStorage.removeItem("ev_active_session");
            }
        } catch { }
    }, [activeSession]);

    // Background engine: update every 1s while session active
    useEffect(() => {
        if (!activeSession || activeSession.endedAt) return;

        const interval = setInterval(() => {
            setActiveSession((prev) => {
                if (!prev || prev.endedAt) return prev;

                const startedAtMs = new Date(prev.startedAt).getTime();
                const elapsedSeconds = Math.max(
                    0,
                    Math.floor((Date.now() - startedAtMs) / 1000)
                );

                // mock progression (same feel as your NewSession)
                const nextEnergy = +(
                    Number(prev.energy || 0) +
                    Math.random() * 0.08
                ).toFixed(2);

                const nextTemp = +(
                    Number(prev.temperature || 30) +
                    (Math.random() * 0.6 - 0.2)
                ).toFixed(1);

                const add = Math.floor(Math.random() * 50) + 10; // 10-60 PKR
                const nextCost = Number(prev.cost || 0) + add;

                // auto-stop if budget reached
                if (Number(prev.maxBudget) > 0 && nextCost >= Number(prev.maxBudget)) {
                    const endedAt = new Date().toISOString();
                    setChargingStatus("Ended");
                    return {
                        ...prev,
                        energy: nextEnergy,
                        temperature: nextTemp,
                        cost: nextCost,
                        elapsedSeconds,
                        endedAt,
                        status: "Ended",
                    };
                }

                return {
                    ...prev,
                    energy: nextEnergy,
                    temperature: nextTemp,
                    cost: nextCost,
                    elapsedSeconds,
                };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [activeSession]);

    const startChargingSession = ({
        maxBudget = "",
        vehicleName = "",
        portType = "",
        sessionName = "",
        stationName = "EV Station 01",
        deviceId = "DEVICE123",
    } = {}) => {
        const startedAt = new Date().toISOString();

        setActiveSession({
            id: `EV-${Date.now().toString().slice(-8)}`,
            startedAt,
            endedAt: null,
            status: "Charging",

            // meta
            stationName,
            deviceId,

            // user inputs
            maxBudget,
            vehicleName,
            portType,
            sessionName,

            // metrics
            energy: 0,
            temperature: 30,
            cost: 0,
            elapsedSeconds: 0,
        });

        setChargingStatus("Charging");
    };

    const stopChargingSession = () => {
        setActiveSession((prev) => {
            if (!prev || prev.endedAt) return prev;

            return {
                ...prev,
                endedAt: new Date().toISOString(),
                status: "Ended",
            };
        });

        setChargingStatus("Ended");
    };

    // If supply turns OFF while session active -> stop it (realistic)
    useEffect(() => {
        if (!isOn && activeSession && !activeSession.endedAt) {
            stopChargingSession();
            setCarConnected(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOn]);

    //saved auth
    useEffect(() => {
        const savedAuth = localStorage.getItem("ev-auth");
        if (savedAuth) {
            const parsed = JSON.parse(savedAuth);
            setAuthData(parsed);
            setIsAuthenticated(true);
        }
    }, []);


    const loginMock = (email, password) => {
        if (email === "slacker@gmail.com" && password === "slacker321") {
            const user = {
                id: "EV-ADMIN-01",
                username: "Slacker",
                email,
                role: "ADMIN",
                accessToken: "mock-token-123",
            };

            localStorage.setItem("ev-auth", JSON.stringify(user));
            setAuthData(user);
            setIsAuthenticated(true);
            return { success: true };
        }

        return { success: false, message: "Invalid credentials" };
    };

    const logout = () => {
        localStorage.removeItem("ev-auth");
        setAuthData(null);
        setIsAuthenticated(false);
    };



    // ----------------------------
    // Helpers
    // ----------------------------
    const formatTimeFromTotalSeconds = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const padded = (num) => num.toString().padStart(2, "0");
        return `${hours}:${padded(minutes)}:${padded(seconds)}`;
    };

    const formatTimeFromString = (isoString) => {
        if (!isoString) return "";

        const date = new Date(isoString);
        const now = new Date();

        const isSameDay = (a, b) =>
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate();

        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);

        let hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;

        const paddedMinutes = String(minutes).padStart(2, "0");
        const paddedSeconds = String(seconds).padStart(2, "0");

        const timeStr = `${hours}:${paddedMinutes}:${paddedSeconds} ${ampm}`;

        if (isSameDay(date, now)) return `Today ${timeStr}`;
        if (isSameDay(date, yesterday)) return `Yesterday ${timeStr}`;

        const day = String(date.getDate()).padStart(2, "0");
        const month = date.toLocaleString("en-US", { month: "short" });
        const year = date.getFullYear();

        return `${day} ${month} ${year}, ${timeStr}`;
    };

    const formatDate = (isoString) => {
        if (!isoString) return "";

        const date = new Date(isoString);
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    // Resize handler
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const clearActiveSession = () => {
        setActiveSession(null);
        setChargingStatus("Idle");
    };

    return (
        <GlobalContext.Provider
            value={{
                scrwidth,

                activeItem,
                handleActiveItem,

                isOn,
                setIsOn,

                isLoggedIn,
                setIsLoggedIn,

                authType,
                setAuthType,

                isAuthenticated,
                setIsAuthenticated,

                ROLE,
                setROLE,

                formatTimeFromTotalSeconds,
                formatDate,
                formatTimeFromString,

                authData,
                setAuthData,

                sessions,
                setSessions,

                filteredSessionsData,
                setFilteredSessionsData,

                carConnectd,
                setCarConnected,

                chargingStatus,
                setChargingStatus,

                // ✅ Active session API (for NewSession + other tabs)
                activeSession,
                setActiveSession,
                startChargingSession,
                stopChargingSession,

                clearActiveSession,
                loginMock,
                logout,
                isLoginPage, setIsLoginPage,
                isSideBarOpen, setIsSideBarOpen

            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
