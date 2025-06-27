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
import ApiService from '../../ApiServices/ApiService';
import useTelemetrySocket from '../../hook/useTelemetrySocket';

const NewSession = () => {
    const { formatTimeFromString, authData , formatTimeFromTotalSeconds  } = useGlobalContext()
    const [sessionName, setSessionName] = useState('');
    const [vehicleName, setVehicleName] = useState('');
    const [portType, setPortType] = useState('');
    const [maxBudget, setMaxBudget] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isDeviceConnected, setIsDeviceConnected] = useState(true); // true by default
    const [sessionStarted, setSessionStarted] = useState(false);
    const [sessionEnded, setSessionEnded] = useState(false);
    const [status, setstatus] = useState("checking")
    const [isDeviceAvailable, setIsDeviceAvailable] = useState(null)
    const [isStationAvailable, setIsStationAvailable] = useState(null)


    const [energy, setEnergy] = useState(0);
    const [temperature, setTemperature] = useState(30);
    const [cost, setCost] = useState(0);
    const [time, setTime] = useState(0);

    const telemetryData = useTelemetrySocket("DEVICE123", authData.accessToken);


    const checkStationAvailable = async () => {
        try {
            const data = await ApiService.isCurrentlyCharging(authData.accessToken);
            console.log("data hai avaialable ka ", data)
            if (data.isAvailable) {
                setIsStationAvailable(true)
                setstatus("allChecked")
            } else {
                setIsStationAvailable(false)
                setstatus("stationBusy")
            }
        } catch (error) {
            console.log("nh aya data ", error)
        }
    }

    const CheckDeviceInService = async () => {
        try {
            const data = await ApiService.isInService(authData.accessToken);
            if (data.isAvailable) {
                setIsDeviceAvailable(true)
                setstatus("checkingStation")
                checkStationAvailable()

            } else {
                setIsDeviceAvailable(false)
                setIsStationAvailable(false)

            }
        } catch (error) {
            console.log("nh aya data device cheeck karnay hka ", error)
        }
    }


    useEffect(() => {
        let interval;
        if (sessionStarted && !sessionEnded) {
            interval = setInterval(() => {
                
                setCost((prevCost) => {
                    const newCost = +(prevCost + 1 ).toFixed(0);

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


    const handleStart = async () => {
        try {
            const data = await ApiService.startSession(authData.accessToken)
            console.log("data jo start session par ara : ", data)
            setSessionStarted(true)
        } catch (error) {
            alert("nh hua startt", error)
            setstatus(false)
        }
    };

    const handleStop = async () => {

        try {
            const data = await ApiService.stopSession(authData.accessToken)
            console.log("data jo stop honai kai baad session par ara : ", data)
            setSessionEnded(true);
            setSessionStarted(false);
        } catch (error) {
            console.log("nh hua stop", error)
        }

    };

    const handleReset = () => {
        setSessionStarted(false);
        setSessionEnded(false);
    }

    useEffect(() => {
        CheckDeviceInService()

    }, [sessionStarted])




    return (
        <div className="sm:p-6 p-3 bg-[#F4F6F8] h-screen overflow-y-scroll">
            <div className="w-full flex justify-between items-center  font-bold mb-3  px-3">
                <FaPlus className="sm:text-2xl text-xl" />
                <h2 className="md:text-[24px] sm:text-lg text-sm font-bold text-[#1E1E2F] italic">Activate Session</h2>

                <h1 className="bg-[#1E1E2F] rounded-sm px-3 py-2 text-white sm:text-md text-xs">{authData.username}</h1>
            </div>
            {!sessionStarted && !sessionEnded && (
                <>
                    <h1 className='text-3xl font-bold my-6 text-center'>Welcom to EV Station 01</h1>

                    {status == "checking" && (
                        <div className={`text-5xl font-bold  bg-gray-500 text-white text-center p-20 rounded-2xl `}>
                            {isDeviceAvailable == null && ' Checking if device is in service....'}
                            {isDeviceAvailable == true && ' Device is Working '}
                            {isDeviceAvailable == false && ' Device is under maintainence '}

                        </div>
                    )}

                    {status == "checkingStation" && isDeviceAvailable == true && (
                        <div className={`text-5xl font-bold bg-gray-500 text-white text-center p-20 rounded-2xl`}>
                            Device Checked <br />
                            {isStationAvailable == null && ' Checking if station is available ....'}
                            {isStationAvailable == true && ' Device is Working and station is free to use  '}
                            {isStationAvailable == false && ' Device is working but station is not free '}
                        </div>
                    )}

                    {status == "stationBusy" && isDeviceAvailable == true && isStationAvailable == false && (
                        <div className={`text-5xl font-bold bg-gray-500 text-white text-center p-20 rounded-2xl`}>
                            Device Checked <br />
                            But Station is use by another user. Please wait
                        </div>
                    )}

                    {status == "allChecked" && (
                        <div className={`text-5xl font-bold bg-green-500 text-white text-center p-20 rounded-2xl`}>
                            Device Checked <br />
                            Station is Free <br />
                            Now you can use it
                        </div>
                    )}
                    <form className=" p-3 w-full ">

                        <div className="grid  grid-cols-1 w-full  gap-4 ">

                            <div className="flex flex-col gap-y-2 col-span-1">
                                <label className='text-xl italic font-semibold' >Enter Your Max Budget <span className='text-black/50 text-xs'>(Session will automatically stop when budget reached)</span></label>
                                <input
                                    type="number"
                                    placeholder="Maximum Budget (eg : 40000)"
                                    value={maxBudget}
                                    onChange={(e) => setMaxBudget(e.target.value)}
                                    className=" bg-white shadow text-sm p-2 focus:border-blue-700 border-[1px] w-full border-transparent  rounded outline-none text-[16px]"
                                />
                            </div>


                        </div>

                        <div
                            className={`mt-4 p-4 text-white rounded flex items-center justify-between ${isDeviceConnected ? 'bg-green-500' : 'bg-red-500'
                                }`}
                        >
                            <span className='text-xl font-semibold'>Vehicle {isDeviceConnected ? 'Connected' : 'Not Connected'}</span>
                            <span className={`text-2xl mainBlue bg-white p-2 rounded-full fromBlue`}><FaPlug /></span>
                        </div>

                        {isDeviceAvailable && isStationAvailable && (
                            <button
                                type="button"
                                onClick={handleStart}
                                disabled={!(isStationAvailable && isDeviceAvailable)}
                                className={`mt-6 w-full p-3 rounded text-white font-semibold transition bg-green-600 hover:bg-green-700  `}
                            >
                                Start Session
                            </button>
                        )}

                        


                    </form>
                </>
            )}

            {sessionStarted && !sessionEnded && (
                <div className=" p-4  ">
                    <h2 className="text-2xl font-semibold mb-4">Charging Session</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="shadow p-2 bg-white rounded">Max Budget: <strong>{maxBudget}</strong> PKR</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center mb-6">
                        <div className="bg-white p-4 rounded min-h-36 flex flex-col justify-evenly items-center gap-y-4">
                            <FaBolt className='text-5xl bg-[#AFAFAF]/20 rounded-full p-2 text-blue-500' />
                            <h1 className='font-bold text-lg'>Energy</h1>
                            <strong>{(30).toFixed(2) || 0} kWh</strong>

                        </div>
                        <div className="bg-white p-4 rounded min-h-36 flex flex-col justify-evenly items-center gap-y-4">
                            <FaThermometerHalf className='text-5xl  bg-[#AFAFAF]/20 rounded-full p-2 text-blue-500' />
                            <h1 className='font-bold text-lg'>Temprature</h1>
                            <strong>{34 || 0}°C</strong>
                        </div>

                        <div className="bg-white p-4 rounded min-h-36 flex flex-col justify-evenly items-center gap-y-4">
                            <FaClock className='text-5xl  bg-[#AFAFAF]/20 rounded-full p-2 text-blue-500' />
                            <h1 className='font-bold text-lg'>Time Taken</h1>
                            <strong>{formatTimeFromTotalSeconds(time)}</strong>

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
                <div id="billing-summary" className="p-4 bg-white rounded-lg shadow-md border w-full max-w-2xl mx-auto mt-6">
                    <h2 className="text-2xl font-bold text-green-700 mb-2">✅ Session Ended Successfully</h2>
                    <p className="text-gray-600 mb-4">Here are the billing details for your charging session.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                        <div><strong>User:</strong> {authData.username || "defaultuser"}</div>
                        {/* <div><strong>Max Budget:</strong> {maxBudget} PKR</div> */}
                        <div><strong>Energy Consumed:</strong> 30 kWh</div>
                        <div><strong>Temperature:</strong> {34}°C</div>
                        <div><strong>Time Taken:</strong> {formatTimeFromTotalSeconds(time)}</div>
                        <div><strong>Total Cost:</strong> {cost} PKR</div>
                    </div>

                    <button
                        onClick={handleReset}
                        className="mt-6 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded w-full"
                    >
                        📥 Go to main page
                    </button>
                </div>
            )}

        </div>
    );
};

export default NewSession;
