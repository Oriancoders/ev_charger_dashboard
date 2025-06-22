import React, { useEffect, useState } from 'react';
import './App.css';
import Login from './Pages/Login';
import MainLayout from './Pages/MainLayout';
import { useGlobalContext } from './GlobalStates/GlobalState';
import { Navigate, Route, Routes } from 'react-router-dom';

function App() {
    const {isAuthenticated , setIsAuthenticated} = useGlobalContext();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
  
    } , [isAuthenticated])
  return (
    <div className="overflow-x-hidden scrollbar-hidden text-[#1E1E2F]">

      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/main-dashboard" element={ isAuthenticated ? <MainLayout /> : <Navigate to="/" replace />} />
      </Routes>

    </div>
  );
}

export default App;
