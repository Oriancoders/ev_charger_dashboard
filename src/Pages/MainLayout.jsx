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


const MainLayout = () => {
    const { activeItem, scrwidth } = useGlobalContext()
    const [isSideBarOpen , setIsSideBarOpen] = useState(false)

    useEffect(() => {

        console.log("item is ", activeItem)
    }, [])
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
            </main>
        </div>
    );
};

export default MainLayout;
