import React, { useEffect, useState } from 'react';
import './App.css';
import Login from './Pages/Login';
import MainLayout from './Pages/MainLayout';
import { useGlobalContext } from './GlobalStates/GlobalState';
import { Route, Routes } from 'react-router-dom';

function App() {
  
  return (
      <div className="overflow-x-hidden scrollbar-hidden text-[#1E1E2F]">

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/main-dashboard" element={<MainLayout />} />
          {/* Add more routes as needed */}
        </Routes>
      
    </div>
  );
}

export default App;
