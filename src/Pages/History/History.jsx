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
  const { ROLE,  sessions, setSessions, authData} = useGlobalContext()

  useEffect(() => {
    const filtered = historyData.filter(session => {
      const sessionDate = parseISO(session.date);
      return isWithinInterval(sessionDate, {
        start: parseISO(fromDate),
        end: parseISO(toDate)
      });
    });
    

    const searched = filtered.filter(session =>
      session.serial.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredData(searched);
  }, [fromDate, toDate, searchTerm]);

  // Fetch sessions from API
    useEffect(() => {
        const fetchSessions = async () => {
          try {
            const data = await ApiService.getAllSessions(authData.accessToken);
            setSessions(data);
            console.log("Fetched sessions:", data);
          } catch (error) {
            console.error("Error fetching device:", error);
          }
        };
    
        fetchSessions();
      }, []);

  // Summary calculations
  const totalSessions = filteredData.length;
  const totalEnergy = filteredData.reduce((acc, curr) => acc + curr.powerSupplied, 0);
  const totalEarnings = filteredData.reduce((acc, curr) => acc + curr.cost, 0);

  const totalTimeMinutes = filteredData.reduce((acc, curr) => {
    const start = new Date(curr.startTime);
    const end = new Date(curr.endTime);
    return acc + (end - start) / 60000;
  }, 0);
  const totalHours = Math.floor(totalTimeMinutes / 60);
  const totalMinutes = Math.floor(totalTimeMinutes % 60);

  return (
    <div className="p-6 bg-[#F4F6F8] h-screen overflow-y-scroll">

      <div className="w-full flex justify-between items-center  font-bold mb-3  px-3">
        <FaHistory className="text-4xl" />
        <h2 className="text-[24px] font-bold  text-[#1E1E2F] italic">History</h2>
        <h1 className="bg-[#1E1E2F] rounded-sm px-3 py-2 text-white">{ROLE == "ADMIN" ? "ADMIN" : "USERNAME"}</h1>
      </div>


      {/* Filter bar */}
      <div className="bg-white shadow rounded-2xl p-3 flex sm:flex-row flex-col flex-wrap justify-between sm:items-center gap-4 mb-4">
        <h1 className="text-lg font-semibold">Filters</h1>
        <div className='text-[16px]'>
          <label className="mr-2 font-medium">From Date:</label>
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className="border rounded-2xl px-2 py-1"
          />
        </div>
        <div className='text-[16px]'>
          <label className="mr-2 font-medium">To Date:</label>
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className="border rounded-2xl px-2 py-1"
          />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
          className="flex-1 px-3 py-2 focus:border-blue-700 border-[1px] w-full border-transparent  rounded outline-none text-[16px]"
        />
      </div>

      {/* Table */}
      <div className=" bg-white ">
        <table className="w-full table-auto ">
          <thead className="bg-gray-200 text-lg">
            <tr>
              <th className="p-2 border-[1px] border-gray-400">Date</th>
              <th className="p-2 border-[1px] border-gray-400">Vehicle (Session ID)</th>
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
                <tr key={index} className=" text-sm ">
                  <td className="p-2 border-[1px] border-gray-300">{format(parseISO(session.date), 'dd/MM/yyyy')}</td>
                  <td className="p-2 border-[1px] border-gray-300">{session.serial}</td>
                  <td className="p-2 border-[1px] border-gray-300">{session.powerSupplied}</td>
                  <td className="p-2 border-[1px] border-gray-300">{session.cost}</td>
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
  <div className="bg-white  shadow p-4 flex flex-col justify-between rounded-2xl gap-y-4 min-h-36">
    <div className="text-lg font-bold italic">{title}</div>
    <div className="sm:text-xl text-xs font-bold text-blue-600">{value}</div>
  </div>
);

export default History;
