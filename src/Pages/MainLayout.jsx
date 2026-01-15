// src/components/Layout.jsx
import { useEffect, useState } from "react";
import Sidebar from "../SideBar/SideBar";
import { useGlobalContext } from "../GlobalStates/GlobalState";
import MainDashboard from "./mainDashboard/MainDashboard";
import ChargerControlPanel from "./control/ChargerControlPanel";
import RecentSession from "./RecentSession/RecentSession";
import History from "./History/History";
import Notifications from "./Notifcations/Notifications";
import { RxDoubleArrowLeft } from "react-icons/rx";
import NewSession from "./StartSession/NewSession";
import ApiService from "../ApiServices/ApiService";
import useTelemetrySocket from "../hook/useTelemetrySocket";

const MainLayout = () => {
    const { activeItem, scrwidth , authData , setSessions } = useGlobalContext()
    // const [isSideBarOpen , setIsSideBarOpen] = useState(false)
    
    // const telemetryData = useTelemetrySocket("DEVICE123", authData.accessToken);
    // console.log("Telemetry Data:", telemetryData);
    // const fetchSessions = async () => {
    //       try {
    //         const data = await ApiService.getAllSessions(authData.accessToken);
    
    //         // Add serials like EV001, EV002, etc.
    //         const dataWithSerials = data.map((session, index) => ({
    //           ...session,
    //           serial: `EV${(index + 1).toString().padStart(3, '0')}` // EV001, EV002...
    //         }));
    
    //         setSessions(dataWithSerials);
    //       } catch (error) {
    //         console.error("Error fetching device:", error);
    //       }
    //     };
    
    //     const fetchUserSessions = async () => {
    //       try {
    //         const data = await ApiService.getUserSessions(authData.accessToken);
    
    //         // Add serials like EV001, EV002, etc.
    //         const dataWithSerials = data.map((session, index) => ({
    //           ...session,
    //           serial: `EV${(index + 1).toString().padStart(3, '0')}` // EV001, EV002...
    //         }));
    
    //         setSessions(dataWithSerials);
    //       } catch (error) {
    //         alert("Error fetching device:", error);
    //       }
    //     };

    // useEffect(() => {
    //     if (authData.role == "USER") {
    //         fetchUserSessions()
    //     } else{
    //         fetchSessions();
    //     }
    //   }, []);
    return (
        <div className="flex overflow-hidden">

                <Sidebar />

            <main className="flex-1  bg-[#F4F6F8] min-h-screen overflow-auto">
                {activeItem == "Main Dashboard" && (
                    <MainDashboard />
                )}

                {activeItem == "Control Supply" && (
                    <ChargerControlPanel />
                )}

                {activeItem == "Recent Session" && (
                    <RecentSession />
                )}

                {activeItem == "History" && (
                    <History />
                )}

                {activeItem == "Notifications" && (
                    <Notifications />
                )}

                {activeItem == "Start Session" && (
                    <NewSession />
                )}
            </main>
        </div>
    );
};

export default MainLayout;
