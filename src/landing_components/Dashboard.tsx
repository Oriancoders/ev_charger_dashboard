import React, { useState } from 'react';
import { Smartphone, BarChart3, Zap, MapPin } from 'lucide-react';

export default function Dashboard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Your charging experience,
                <span className="block text-[#00CFFF]">in your pocket</span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Monitor, control, and optimize your charging sessions 
                with our intelligent mobile dashboard.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#00CFFF]/20 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-[#00CFFF]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Real-time Analytics</h3>
                  <p className="text-gray-400">Track your charging history, costs, and carbon savings.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#00CFFF]/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-[#00CFFF]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Smart Scheduling</h3>
                  <p className="text-gray-400">Schedule charging during off-peak hours for maximum savings.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#00CFFF]/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#00CFFF]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Route Planning</h3>
                  <p className="text-gray-400">Plan trips with optimal charging stops along your route.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Dashboard Mockup */}
          <div className="relative flex justify-center">
            <div
              className={`relative transform transition-all duration-700 ${
                isHovered ? 'rotate-y-12 scale-110' : ''
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Phone Frame */}
              <div className="relative w-72 h-[600px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-6 shadow-2xl border border-gray-700">
                {/* Screen */}
                <div className="w-full h-full bg-black rounded-[2rem] overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center px-6 py-4 text-white text-sm">
                    <span>9:41</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-6 pb-6">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <h3 className="text-white text-2xl font-bold mb-2">Dashboard</h3>
                      <p className="text-gray-400">Current Session</p>
                    </div>

                    {/* Charging Status */}
                    <div className="bg-gradient-to-r from-[#00CFFF]/10 to-transparent rounded-2xl p-6 mb-6 border border-[#00CFFF]/30">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-white font-semibold">Battery Level</span>
                        <span className="text-[#00CFFF] font-bold">78%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                        <div className="bg-gradient-to-r from-[#00CFFF] to-white h-3 rounded-full w-3/4 relative overflow-hidden">
                          <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">Time Remaining</div>
                          <div className="text-white font-semibold">22 min</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Charging Speed</div>
                          <div className="text-white font-semibold">150 kW</div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/5 rounded-xl p-4 text-center">
                        <div className="text-[#00CFFF] text-2xl font-bold">$12.45</div>
                        <div className="text-gray-400 text-sm">Current Cost</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 text-center">
                        <div className="text-[#00CFFF] text-2xl font-bold">45 kWh</div>
                        <div className="text-gray-400 text-sm">Energy Added</div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full bg-[#00CFFF] text-black font-semibold py-4 rounded-xl">
                      Stop Charging
                    </button>
                  </div>
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#00CFFF]/30 rounded-full blur-md animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-[#00CFFF]/20 rounded-full blur-lg animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}