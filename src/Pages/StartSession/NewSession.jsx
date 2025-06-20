import React, { useState, useEffect } from 'react';

import {
    FaBolt,
    FaThermometerHalf,
    FaPlug,
    FaCar,
    FaChargingStation,
    FaPlus,
    FaClock,
    FaMoneyBill
} from "react-icons/fa";
import { useGlobalContext } from '../../GlobalStates/GlobalState';

const NewSession = () => {
    const { formatTime } = useGlobalContext()
    const [sessionName, setSessionName] = useState('');
    const [vehicleName, setVehicleName] = useState('');
    const [portType, setPortType] = useState('');
    const [maxBudget, setMaxBudget] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isDeviceConnected, setIsDeviceConnected] = useState(true); // true by default
    const [sessionStarted, setSessionStarted] = useState(false);
    const [sessionEnded, setSessionEnded] = useState(false);

    const [energy, setEnergy] = useState(0);
    const [temperature, setTemperature] = useState(30);
    const [cost, setCost] = useState(0);
    const [time, setTime] = useState(0);

    const isFormValid = sessionName && vehicleName && portType && maxBudget && paymentMethod && isDeviceConnected;

    useEffect(() => {
        let interval;
        if (sessionStarted && !sessionEnded) {
            interval = setInterval(() => {
                setEnergy((prev) => +(prev + Math.random() * 0.5).toFixed(2));
                setTemperature((prev) => +(prev + (Math.random() * 2 - 1)).toFixed(1));
                setCost((prevCost) => {
                    const newCost = +(prevCost + Math.random() * 100).toFixed(0);

                    // Auto-stop session if budget reached
                    if (Number(maxBudget) > 0 && newCost >= Number(maxBudget)) {
                        setSessionEnded(true);
                        setSessionStarted(false);
                    }

                    return newCost;
                });
                setTime((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [sessionStarted, sessionEnded, maxBudget]);


    const handleStart = () => {
        if (isFormValid) {
            setSessionStarted(true);
        }
    };

    const handleStop = () => {
        setSessionEnded(true);
        setSessionStarted(false);
    };

    return (
        <div className="sm:p-6 p-3 bg-[#F4F6F8] h-screen overflow-y-scroll">
            <div className="w-full flex justify-between items-center  font-bold mb-3  px-3">
                <FaPlus className="text-4xl" />
                <h2 className="text-[24px] font-bold  text-[#1E1E2F] italic">Activate Session</h2>

                <h1 className="bg-[#1E1E2F] rounded-sm px-3 py-2 text-white">USER NAME</h1>
            </div>
            {!sessionStarted && !sessionEnded && (
                <form className=" p-4  ">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-y-2">
                            <label className='text-xl italic font-semibold' >Session Name</label>
                            <input
                                type="text"
                                placeholder="Enter Session Name"
                                value={sessionName}
                                onChange={(e) => setSessionName(e.target.value)}
                                className=" bg-white shadow text-sm p-2 focus:border-blue-700 border-[1px] w-full border-transparent  rounded outline-none text-[16px]"
                            />
                        </div>

                        <div className="flex flex-col gap-y-2">
                            <label className='text-xl italic font-semibold' >Vehicle Name</label>
                            <input
                                type="text"
                                placeholder="Enter Vehicle Name"
                                value={vehicleName}
                                onChange={(e) => setVehicleName(e.target.value)}
                                className=" bg-white shadow text-sm  p-2 focus:border-blue-700 border-[1px] w-full border-transparent  rounded outline-none text-[16px]"
                            />
                        </div>

                        <div className="flex flex-col gap-y-2">
                            <label className='text-xl italic font-semibold' >Port Type</label>
                            <select
                                value={portType}
                                onChange={(e) => setPortType(e.target.value)}
                                className="bg-white shadow text-sm p-2 focus:border-blue-700 border-[1px] w-full border-transparent  rounded outline-none text-[16px]"
                            >
                                <option value="">Select Port Type</option>
                                <option value="Type 2">Type 2</option>
                                <option value="CS2">CS2</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-y-2">
                            <label className='text-xl italic font-semibold' >Max Budget <span className='text-black/20 text-xs'>(Session will automatically stop when budget reached)</span></label>
                            <input
                                type="number"
                                placeholder="Enter Vehicle Name"
                                value={maxBudget}
                                onChange={(e) => setMaxBudget(e.target.value)}
                                className=" bg-white shadow text-sm p-2 focus:border-blue-700 border-[1px] w-full border-transparent  rounded outline-none text-[16px]"
                            />
                        </div>

                        <div className="flex flex-col gap-y-2 col-span-2">
                            <label className='text-xl italic font-semibold' >Payment Method</label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className=" bg-white shadow text-sm   p-2 focus:border-blue-700 border-[1px] w-full border-transparent  rounded outline-none text-[16px]"
                            >
                                <option value="">Select Payment Method</option>
                                <option value="Card">Card</option>
                                <option value="Paypal">Paypal</option>
                            </select>
                        </div>
                    </div>

                    <div
                        className={`mt-4 p-4 text-white rounded flex items-center justify-between ${isDeviceConnected ? 'bg-green-500' : 'bg-red-500'
                            }`}
                    >
                        <span className='text-xl font-semibold'>Vehicle {isDeviceConnected ? 'Connected' : 'Not Connected'}</span>
                        <span className={`text-2xl mainBlue bg-white p-2 rounded-full fromBlue`}><FaPlug /></span>
                    </div>

                    <button
                        type="button"
                        disabled={!isFormValid}
                        onClick={handleStart}
                        className={`mt-6 w-full p-3 rounded text-white font-semibold transition ${isFormValid ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'
                            }`}
                    >
                        Start Session
                    </button>
                </form>
            )}

            {sessionStarted && !sessionEnded && (
                <div className=" p-4  ">
                    <h2 className="text-2xl font-semibold mb-4">Charging Session</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="shadow p-2 bg-white rounded">Session name: <strong>{sessionName}</strong></div>
                        <div className="shadow p-2 bg-white rounded">Vehicle name: <strong>{vehicleName}</strong></div>
                        <div className="shadow p-2 bg-white rounded">Port Type: <strong>{portType}</strong></div>
                        <div className="shadow p-2 bg-white rounded">Max Budget: <strong>{maxBudget}</strong> PKR</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center mb-6">
                        <div className="bg-white p-4 rounded min-h-36 flex flex-col justify-evenly items-center gap-y-4">
                            <FaBolt className='text-5xl bg-[#AFAFAF]/20 rounded-full p-2 text-blue-500' />
                            <h1 className='font-bold text-lg'>Energy</h1>
                            <strong>{energy} kWh</strong>

                        </div>
                        <div className="bg-white p-4 rounded min-h-36 flex flex-col justify-evenly items-center gap-y-4">
                            <FaThermometerHalf className='text-5xl  bg-[#AFAFAF]/20 rounded-full p-2 text-blue-500' />
                            <h1 className='font-bold text-lg'>Temprature</h1>
                            <strong>{temperature}°C</strong>
                        </div>

                        <div className="bg-white p-4 rounded min-h-36 flex flex-col justify-evenly items-center gap-y-4">
                            <FaClock className='text-5xl  bg-[#AFAFAF]/20 rounded-full p-2 text-blue-500' />
                            <h1 className='font-bold text-lg'>Time Taken</h1>
                            <strong>{formatTime(time)}</strong>

                        </div>

                        <div className="bg-white p-4 rounded min-h-36 flex flex-col justify-evenly items-center gap-y-4">
                            <FaMoneyBill className='text-5xl  bg-[#AFAFAF]/20 rounded-full p-2 text-blue-500' />
                            <h1 className='font-bold text-lg'>Amount</h1>
                            <strong >{cost} PKR</strong>
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

            {sessionEnded && (
                <div className="bg-white p-6 rounded shadow max-w-xl mx-auto text-center">
                    <h2 className="text-xl font-semibold text-green-700">✅ Session Ended Successfully</h2>
                    <p className="mt-2 text-gray-600">Billing details will appear here once UI is completed.</p>
                </div>
            )}
        </div>
    );
};

export default NewSession;
