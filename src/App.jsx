import React, { Suspense, lazy, useEffect, useState } from 'react';
import './App.css';
import { useGlobalContext } from './GlobalStates/GlobalState';
import { Route, Routes } from 'react-router-dom';
import DashboardSkeleton from './Skeletons/DahboardSkeleton';
import ApiService from './ApiServices/ApiService';

// Lazy-loaded pages
const Login = lazy(() => import('./Pages/Login'));
const MainLayout = lazy(() => import('./Pages/MainLayout'));

// General fallback for login
const GenericSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-96 p-6 bg-gray-200 rounded-lg shadow-md animate-pulse space-y-4">
      <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto" />
      <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto" />
      <div className="h-10 bg-gray-300 rounded" />
      <div className="h-10 bg-gray-300 rounded" />
    </div>
  </div>
);

function App() {
  const { isAuthenticated, authData, setAuthData, setIsAuthenticated } = useGlobalContext();
  const [authLoading, setAuthLoading] = useState(true); // 🆕

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await ApiService.accessTokenFromRefreshToken();
        if (response.statusCodeValue === 200) {
        setAuthData({
            id: response.body.id,
            username: response.body.username,
            email: response.body.email,
            role: response.body.role,
            accessToken: response.body.accessToken
          });
        console.log( "ye agaya data refresh kai baad " ,authData )
        console.log ("reponse ..." , response)

        setIsAuthenticated(true);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false); // ✅ auth check done
      }
    };

    getToken();
  }, []);

  if (authLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <p className="text-gray-500 text-xl">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden scrollbar-hidden text-[#1E1E2F]">
      <Routes>
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <Suspense fallback={<GenericSkeleton />}>
                <Login />
              </Suspense>
            ) : (
              <Suspense fallback={<DashboardSkeleton />}>
                <MainLayout />
              </Suspense>
            )
          }
        />
        <Route
          path="/main-dashboard"
          element={
            isAuthenticated ? (
              <Suspense fallback={<DashboardSkeleton />}>
                <MainLayout />
              </Suspense>
            ) : (
              <Suspense fallback={<GenericSkeleton />}>
                <Login />
              </Suspense>
            )
          }
        />
      </Routes>
    </div>
  );
}


export default App;
