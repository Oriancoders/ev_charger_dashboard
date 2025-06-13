import React, { useEffect, useState } from "react";
import { FaBell, FaBatteryHalf, FaExclamationTriangle, FaTimesCircle, FaExchangeAlt } from "react-icons/fa";
import { format } from "date-fns";
import notifications from "../../MockData/notifications.json";


const iconMap = {
    Warning: <FaExclamationTriangle className="text-red-500 sm:w-5 w-3 sm:h-3 h-3" />,
    Error: <FaTimesCircle className="text-red-600 sm:w-5 w-3 sm:h-3 h-3" />,
    "Session Started": <FaExchangeAlt className="text-green-600 sm:w-5 w-3 sm:h-3 h-3" />,
    Battery: <FaBatteryHalf className="text-green-500 sm:w-5 w-3 sm:h-3 h-3" />,
  };

const Notifications = () => {

    
    return (
        <div className="sm:p-6 p-3 bg-[#F4F6F8] h-screen overflow-y-scroll">
            <h2 className="sm:text-2xl text-xl font-semibold italic mb-4">Notifications</h2>
            <div className="space-y-4">
                {notifications.map((notification, idx) => (
                    <div
                        key={idx}
                        className="flex sm:text-lg text-sm justify-between gap-6 items-center bg-white shadow-md rounded-xl px-4 py-3 "
                    >
                        <div className="sm:w-40 w-20 italic font-semibold flex items-center justify-between gap-2  ">
                        <h1 className="">{notification.type}</h1> 
                        <span>{iconMap[notification.type]}</span> 
                        </div>
                        <h1 className="flex-1 ">
                            {notification.message}
                        </h1>
                        <div className="text-right  whitespace-nowrap">
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
