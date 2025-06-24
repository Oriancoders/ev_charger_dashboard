import React, { Suspense, lazy, useEffect } from 'react';
import './App.css';
import { useGlobalContext } from './GlobalStates/GlobalState';
import { Route, Routes } from 'react-router-dom';
import DashboardSkeleton from './Skeletons/DahboardSkeleton';

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
  const { isAuthenticated } = useGlobalContext();

  useEffect(() => {

  } , [isAuthenticated])
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
