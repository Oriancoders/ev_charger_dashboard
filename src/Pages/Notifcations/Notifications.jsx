import React, { useEffect, useState } from "react";
import { FaBell, FaBatteryHalf, FaExclamationTriangle, FaTimesCircle, FaExchangeAlt } from "react-icons/fa";
import { format } from "date-fns";
import notifications from "../../MockData/notifications.json";


const iconMap = {
    Warning: <FaExclamationTriangle className="text-red-500 w-5 h-5" />,
    Error: <FaTimesCircle className="text-red-600 w-5 h-5" />,
    "Session Started": <FaExchangeAlt className="text-green-600 w-5 h-5" />,
    Battery: <FaBatteryHalf className="text-green-500 w-5 h-5" />,
  };

const Notifications = () => {

    
    return (
        <div className="p-6 bg-[#F4F6F8] h-screen overflow-y-scroll">
            <h2 className="text-2xl font-semibold italic mb-4">Notifications</h2>
            <div className="space-y-4">
                {notifications.map((notification, idx) => (
                    <div
                        key={idx}
                        className="flex justify-between gap-6 items-center bg-white shadow-md rounded-xl px-4 py-3 "
                    >
                        <div className="w-40 italic font-semibold flex items-center justify-between gap-2  ">
                        {notification.type} {iconMap[notification.type]} 
                        </div>
                        <h1 className="flex-1 ">
                            {notification.message}
                        </h1>
                        <div className="text-right  whitespace-nowrap">
                            <div className="text-md font-semibold">{format(new Date(notification.timestamp), "h:mm a")}</div>
                            <div className="text-sm">{format(new Date(notification.timestamp), "dd/MMM/yyyy")}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
