import React, { useState } from 'react';
import { MapPin, Zap, Clock } from 'lucide-react';

export default function Stations() {
  const [selectedStation, setSelectedStation] = useState<number | null>(null);

  const stations = [
    { id: 1, name: 'Downtown Hub', speed: '350kW', available: 8, total: 12, x: 25, y: 40 },
    { id: 2, name: 'Mall Plaza', speed: '150kW', available: 15, total: 20, x: 60, y: 30 },
    { id: 3, name: 'Highway Rest', speed: '250kW', available: 6, total: 8, x: 80, y: 60 },
    { id: 4, name: 'City Center', speed: '200kW', available: 12, total: 16, x: 40, y: 70 },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find Your Perfect
            <span className="block text-[#00CFFF]">Charging Station</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Thousands of high-speed charging points across the country, 
            strategically located for your convenience.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Interactive Map */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Map"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              
              {/* Station Pins */}
              {stations.map((station) => (
                <div
                  key={station.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                    selectedStation === station.id ? 'scale-125' : 'hover:scale-110'
                  }`}
                  style={{ left: `${station.x}%`, top: `${station.y}%` }}
                  onMouseEnter={() => setSelectedStation(station.id)}
                  onMouseLeave={() => setSelectedStation(null)}
                >
                  <div className={`w-4 h-4 rounded-full bg-[#00CFFF] shadow-lg ${
                    selectedStation === station.id ? 'animate-pulse' : ''
                  }`}>
                    <div className="absolute inset-0 rounded-full bg-[#00CFFF] animate-ping opacity-75"></div>
                  </div>
                  
                  {/* Station Info Tooltip */}
                  {selectedStation === station.id && (
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-md border border-[#00CFFF]/30 rounded-xl p-4 min-w-48 z-10">
                      <h4 className="text-white font-semibold mb-2">{station.name}</h4>
                      <div className="space-y-1 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-[#00CFFF]" />
                          <span>Up to {station.speed}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#00CFFF]" />
                          <span>{station.available}/{station.total} available</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Station Stats */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-[#00CFFF] mb-2">5,000+</div>
                <div className="text-gray-300">Charging Points</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-[#00CFFF] mb-2">99.8%</div>
                <div className="text-gray-300">Uptime</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-[#00CFFF] mb-2">350kW</div>
                <div className="text-gray-300">Max Speed</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-[#00CFFF] mb-2">24/7</div>
                <div className="text-gray-300">Support</div>
              </div>
            </div>

            <div className="space-y-4">
              {stations.map((station) => (
                <div
                  key={station.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    selectedStation === station.id
                      ? 'bg-[#00CFFF]/10 border-[#00CFFF]/50'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                  onMouseEnter={() => setSelectedStation(station.id)}
                  onMouseLeave={() => setSelectedStation(null)}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#00CFFF]" />
                    <div>
                      <div className="text-white font-semibold">{station.name}</div>
                      <div className="text-sm text-gray-400">{station.speed} max</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">{station.available} free</div>
                    <div className="text-sm text-gray-400">of {station.total}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}