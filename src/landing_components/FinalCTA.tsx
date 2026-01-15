import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00CFFF]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00CFFF]/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
        <h2 className="text-4xl md:text-7xl font-bold text-white mb-8 leading-tight">
          Ready to Go
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00CFFF] to-white">
            Electric?
          </span>
        </h2>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          Join thousands of drivers already experiencing the future of mobility. 
          Start your electric journey today.
        </p>

        <div className="space-y-6">
          <button className="group relative bg-[#00CFFF] hover:bg-[#00B8E6] text-black font-bold px-12 py-6 rounded-full text-xl transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-[0_0_40px_rgba(0,207,255,0.6)] animate-pulse">
            <span className="relative z-10 flex items-center gap-3">
              Go to Dashboard
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            
            {/* Pulsing Background */}
            <div className="absolute inset-0 rounded-full bg-[#00CFFF] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 animate-pulse"></div>
            
            {/* Ripple Effect */}
            <div className="absolute inset-0 rounded-full border-2 border-[#00CFFF] opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700"></div>
          </button>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00CFFF] rounded-full"></div>
              <span>Free to download</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00CFFF] rounded-full"></div>
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00CFFF] rounded-full"></div>
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Electric Current Animation */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00CFFF] to-transparent opacity-50">
        <div className="h-full bg-[#00CFFF] animate-pulse"></div>
      </div>
    </section>
  );
}