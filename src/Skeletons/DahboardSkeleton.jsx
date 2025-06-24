// src/Components/Skeletons/DashboardSkeleton.js
import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div className="p-4 space-y-6 animate-pulse bg-[#F8F9FC] min-h-screen">
      {/* Top cards: Battery, Power, Earnings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="h-28 bg-gray-300 rounded-lg" />
        ))}
      </div>

      {/* Current Live Data Supply */}
      <div className="space-y-4">
        <div className="h-6 w-64 bg-gray-300 rounded" />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((_, i) => (
            <div key={i} className="h-24 bg-gray-300 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Graphical Representation */}
      <div className="space-y-4">
        <div className="h-6 w-64 bg-gray-300 rounded" />
        <div className="h-64 bg-gray-300 rounded-lg" />
      </div>
    </div>
  );
};

export default DashboardSkeleton;
