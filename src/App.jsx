import React, { useState } from 'react';
import './App.css';
import Login from './Pages/Login';
import MainLayout from './Pages/MainLayout';
import { useGlobalContext } from './GlobalStates/GlobalState';

function App() {
  const {isLoggedIn} = useGlobalContext()
  return (
      <div className="overflow-x-hidden scrollbar-hidden text-[#1E1E2F]">
      {isLoggedIn ? (
        <MainLayout />
      ) : (
        <>
        <Login  />
        
        </>
      )}
    </div>
  );
}

export default App;
