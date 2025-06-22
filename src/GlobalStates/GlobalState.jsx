import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a new context
const GlobalContext = createContext();

// Custom hook to use the GlobalContext easily
export const useGlobalContext = () => {
    return useContext(GlobalContext);
};

// Create a provider component
export const GlobalProvider = ({ children }) => {
    // Example of global state (You can add more states as needed)

    
    const [scrwidth, setWidth] = useState(window.innerWidth); 
    const [activeItem, setActiveItem] = useState("Main Dashboard")
    const [isOn, setIsOn] = useState(true);
    const [isLoggedIn , setIsLoggedIn] = useState(false)
    const [authType , setAuthType] = useState("Login")
    const [isAuthenticated ,setIsAuthenticated] = useState(false);
    const [ROLE , setROLE] = useState("USER")
    const [authData, setAuthData] = useState({
        id: '',
        username: '',
        email: '',
        role: '',
        accessToken: ''
    });


    const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const padded = (num) => num.toString().padStart(2, '0');
    return `${hours}:${padded(minutes)}:${padded(seconds)}`;
    };


  
    
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        // Add event listener
        window.addEventListener('resize', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize)
        };
        
        }, []);

        const mockLiveData = {
          voltage: 240,
          current: 80,
          power: 2.1,
          temperature: 32,
          status: "Charging",
          vehicle: false,
          battery: 18,
        };


    return (
        <GlobalContext.Provider value={{ 
            
            scrwidth,
            activeItem, setActiveItem,
            isOn, setIsOn,
            mockLiveData,
            isLoggedIn , setIsLoggedIn,
            authType , setAuthType,
            isAuthenticated ,setIsAuthenticated,
            ROLE , setROLE,
            formatTime,
            authData, setAuthData

            }}>
            {children}
        </GlobalContext.Provider>
    );
};
