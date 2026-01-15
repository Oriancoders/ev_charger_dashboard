import React, { Suspense, lazy, useEffect, useState } from "react";
import "./App.css";
import { useGlobalContext } from "./GlobalStates/GlobalState";
import { Route, Routes, Navigate } from "react-router-dom";
import DashboardSkeleton from "./Skeletons/DahboardSkeleton";
import Landing_page from "./Landing_page";

// Lazy-loaded pages
const Login = lazy(() => import("./Pages/Login"));
const MainLayout = lazy(() => import("./Pages/MainLayout"));

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
  const [authLoading, setAuthLoading] = useState(true);

  // ✅ GlobalState already restores auth from localStorage.
  // Just wait one tick so UI doesn't flicker.
  useEffect(() => {
    const t = setTimeout(() => setAuthLoading(false), 100);
    return () => clearTimeout(t);
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
        {/* Root */}
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <Suspense fallback={<GenericSkeleton />}>
                <Landing_page/>
              </Suspense>
            ) : (
              <Suspense fallback={<DashboardSkeleton />}>
                <MainLayout />
              </Suspense>
            )
          }
        />

        {/* Protected routes */}
        <Route
          path="/main-dashboard"
          element={
            isAuthenticated ? (
              <Suspense fallback={<DashboardSkeleton />}>
                <MainLayout />
              </Suspense>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Optional: catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
