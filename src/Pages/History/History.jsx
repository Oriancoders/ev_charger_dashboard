import React, { useState, useEffect } from 'react';
import { format, parseISO, isWithinInterval, subDays } from 'date-fns';
import historyData from '../../MockData/MockData.json'; // <-- Replace this with your actual import
import { FaHistory } from 'react-icons/fa';
import { useGlobalContext } from '../../GlobalStates/GlobalState';
import ApiService from '../../ApiServices/ApiService';

const History = () => {
  const today = new Date();
  const defaultFromDate = subDays(today, 2);
  const [fromDate, setFromDate] = useState(format(defaultFromDate, 'yyyy-MM-dd'));
  const [toDate, setToDate] = useState(format(today, 'yyyy-MM-dd'));
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const { ROLE, sessions, setSessions, authData, formatDate , formatTimeFromString } = useGlobalContext()
  // Fetch sessions from API

  const fetchSessions = async () => {
      try {
        const data = await ApiService.getAllSessions(authData.accessToken);

        // Add serials like EV001, EV002, etc.
        const dataWithSerials = data.map((session, index) => ({
          ...session,
          serial: `EV${(index + 1).toString().padStart(3, '0')}` // EV001, EV002...
        }));

        setSessions(dataWithSerials);
      } catch (error) {
        console.error("Error fetching device:", error);
      }
    };
  
    //api for fetching users session 
  const fetchUserSessions = async () => {
    try {
      const data = await ApiService.getUserSessions(authData.accessToken);

      // Add serials like EV001, EV002, etc.
      const dataWithSerials = data.map((session, index) => ({
        ...session,
        serial: `EV${(index + 1).toString().padStart(3, '0')}` // EV001, EV002...
      }));

      setSessions(dataWithSerials);
    } catch (error) {
      alert("Error fetching device:", error);
    }
  };
  useEffect(() => {
        if (authData.role == "USER") {
            fetchUserSessions()
        } else{
            fetchSessions();
        }
      }, []);



  useEffect(() => {
    if (!fromDate || !toDate) return;

    const filtered = sessions.filter(session => {
      const sessionStart = parseISO(session.startTime); // Use startTime
      return isWithinInterval(sessionStart, {
        start: parseISO(fromDate),
        end: parseISO(toDate)
      });
    });

    const searched = filtered.filter(session =>
      session.serial?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredData(searched);
  }, [fromDate, toDate, searchTerm]);



  // Summary calculations
  const totalSessions = filteredData.length;
  const totalEnergy = filteredData.reduce((acc, curr) => acc + curr.energyConsumed, 0).toFixed(2);
  const totalEarnings = filteredData.reduce((acc, curr) => acc + curr.cost, 0).toFixed(2);

  const totalTimeMinutes = filteredData.reduce((acc, curr) => {
    const start = new Date(curr.startTime);
    const end = new Date(curr.endTime);
    return acc + (end - start) / 60000;
  }, 0);
  const totalHours = Math.floor(totalTimeMinutes / 60);
  const totalMinutes = Math.floor(totalTimeMinutes % 60);

  return (
    <div className="sm:p-6 p-3 bg-[#F4F6F8] h-screen overflow-y-scroll">

      <div className="w-full flex justify-between items-center  font-bold mb-3  px-3">
        <FaHistory className="md:text-2xl text-xl" />
        <h2 className=" md:text-[24px] sm:text-lg text-sm font-bold  text-[#1E1E2F] italic">History</h2>
        <h1 className="bg-[#1E1E2F] rounded-sm px-3 py-2 text-white sm:text-sm text-xs">{ROLE == "ADMIN" ? "ADMIN" : authData.username}</h1>
      </div>


      {/* Filter bar */}
      <div className="bg-white shadow rounded p-2  flex lg:flex-row flex-col flex-wrap justify-between lg:items-center gap-4 mb-4">
        <h1 className="text-sm font-bold">Filters</h1>
        <div className='sm:text-sm text-xs'>
          <label className="mr-2 font-medium">From Date:</label>
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className="border rounded-2xl px-2 py-1 cursor-pointer"
          />
        </div>
        <div className='sm:text-sm text-xs'>
          <label className="mr-2 font-medium">To Date:</label>
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className="border rounded-2xl px-2 py-1 cursor-pointer"
          />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4 mb-4">
        <SummaryCard title="Total Sessions" value={totalSessions} />
        <SummaryCard title="Total Energy Supplied" value={`${totalEnergy}kw`} />
        <SummaryCard title="Total Earning (PKR)" value={totalEarnings.toLocaleString()} />
        <SummaryCard title="Total Charging Time" value={`${totalHours}hr ${totalMinutes}min`} />
      </div>

      {/* Search */}
      <div className="bg-white shadow sm:text-lg text-sm rounded-lg w-full mb-4">
        <input
          type="text"
          placeholder="Search By Session Id"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1  p-2 focus:border-blue-700 border-[1px] w-full border-transparent  rounded outline-none text-sm"
        />
      </div>

      {/* Table */}
      <div className=" bg-white ">
        <table className="w-full table-auto ">
          <thead className="bg-gray-200 sm:text-sm text-xs">
            <tr>
              <th className="p-2 border-[1px] border-gray-400">Date</th>
              <th className="p-2 border-[1px] border-gray-400">Session ID</th>
              <th className="p-2 border-[1px] border-gray-400">Energy (Kwh)</th>
              <th className="p-2 border-[1px] border-gray-400">Earnings (PKR)</th>
              <th className="p-2 border-[1px] border-gray-400">Time Taken</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((session, index) => {
              const start = new Date(session.startTime);
              const end = new Date(session.endTime);
              const diffMinutes = (end - start) / 60000;
              const hr = Math.floor(diffMinutes / 60);
              const min = Math.floor(diffMinutes % 60);

              return (
                <tr key={index} className=" sm:text-sm text-xs">
                  <td className="p-2 border-[1px] border-gray-300 flex flex-col">
                    <span>{session.startTime ? formatDate(session.startTime) : 'N/A'}</span>
                    <span className='text-xs font-bold'>{session.startTime ? formatTimeFromString(session.startTime) : 'N/A'}</span>

                  </td>
                  <td className="p-2 border-[1px] border-gray-300">{session.serial}</td>
                  <td className="p-2 border-[1px] border-gray-300">{session.energyConsumed.toFixed(2)}</td>
                  <td className="p-2 border-[1px] border-gray-300">{session.cost.toFixed(2)}</td>
                  <td className="p-2 border-[1px] border-gray-300">{`${hr}hr ${min}min`}</td>
                </tr>
              );
            })}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4">No data found for selected range</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value }) => (
  <div className="bg-white  shadow p-4 flex flex-col justify-between rounded-2xl gap-y-4 sm:min-h-36 min-h-20">
    <div className="text-sm font-bold italic">{title}</div>
    <div className="sm:text-xl text-xs font-bold text-blue-600">{value}</div>
  </div>
);

export default History;
