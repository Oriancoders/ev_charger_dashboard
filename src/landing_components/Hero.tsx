import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useGlobalContext } from '../GlobalStates/GlobalState';

export default function Hero() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  const {isLoginPage, setIsLoginPage} = useGlobalContext()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src="https://www.pexels.com/video/a-person-charging-an-electric-car-4817955/" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>
      </div>

      {/* Content */}
      <div className={`relative z-10 text-center px-6 transform transition-all duration-2000 ${
        fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
          Charge Your Journey.
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00CFFF]">
            Anywhere. Anytime.
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-12 max-w-3xl mx-auto font-light">
          Fast. Secure. Sustainable.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button onClick={() => setIsLoginPage(true)} className="group relative bg-[#00CFFF] cursor-pointer hover:bg-[#00B8E6] text-black font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[0_0_30px_rgba(0,207,255,0.5)]">
            <span  className=" relative z-10">Start Charging</span>
            <div className="absolute inset-0 rounded-full bg-[#00CFFF] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
          </button>
          
          <button className="group border-2 border-white hover:border-[#00CFFF] text-white hover:text-[#00CFFF] font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(0,207,255,0.3)]">
            Find a Station
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white/70" />
      </div>

      {/* Abstract Cable Outlines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1920 1080" fill="none">
          <path
            d="M100,500 Q400,200 800,400 T1400,600 Q1600,700 1800,500"
            stroke="url(#gradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00CFFF" stopOpacity="0" />
              <stop offset="50%" stopColor="#00CFFF" stopOpacity="1" />
              <stop offset="100%" stopColor="#00CFFF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
}