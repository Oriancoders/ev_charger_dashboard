import React, { useContext, useEffect, useState } from "react";
import { FaBell, FaBatteryHalf, FaExclamationTriangle, FaTimesCircle, FaExchangeAlt } from "react-icons/fa";
import { format } from "date-fns";
import notifications from "../../MockData/notifications.json";
import { useGlobalContext } from "../../GlobalStates/GlobalState";
import './notification.css'

const iconMap = {
    Warning: <FaExclamationTriangle className="text-red-500 sm:w-5 w-3 sm:h-3 h-3" />,
    Error: <FaTimesCircle className="text-red-600 sm:w-5 w-3 sm:h-3 h-3" />,
    "Session Started": <FaExchangeAlt className="text-green-600 sm:w-5 w-3 sm:h-3 h-3" />,
    Battery: <FaBatteryHalf className="text-green-500 sm:w-5 w-3 sm:h-3 h-3" />,
  };

const Notifications = () => {

    const {ROLE , authData} = useGlobalContext()
    
    return (
        <div className="sm:p-6 p-3 bg-[#F4F6F8] h-screen overflow-y-scroll">
            
                    <div className="w-full flex justify-between items-center  font-bold mb-3  px-3">
                      <FaBell className="sm:text-2xl text-xl" />
                      <h2 className="md:text-[24px] sm:text-lg text-sm font-bold text-[#1E1E2F] italic">Notifications</h2>
            
                      <h1 className="bg-[#1E1E2F] rounded-sm px-3 py-2 text-white sm:text-md text-xs">{ROLE == "ADMIN" ? "ADMIN" : authData.username }</h1>
                    </div>
                 
            <div className="space-y-4">
                {notifications.map((notification, idx) => (
                    <div
                        key={idx}
                        className="flex sm:flex-row flex-col  text-sm justify-between sm:gap-6 gap-3 sm:items-center bg-white notification rounded-xl sm:px-4 sm:py-2 p-2 transition-all "
                    >
                        <div className="sm:w-40 w-full  italic font-semibold flex items-center justify-between gap-2  ">
                        <h1 className="">{notification.type}</h1> 
                        <div className="flex-1 ">{iconMap[notification.type]}</div>
                        </div>
                        <h1 className="flex-1 sm:text-sm text-xs">
                            {notification.message}
                        </h1>
                        <div className="sm:text-right  whitespace-nowrap">
                            <div className="text-md font-semibold">{format(new Date(notification.timestamp), "h:mm a")}</div>
                            <div className="sm:text-sm text-xs">{format(new Date(notification.timestamp), "dd/MMM/yyyy")}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
