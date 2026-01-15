import React, { useEffect, useState } from 'react';
import { MapPin, Plug, Zap, CreditCard } from 'lucide-react';

export default function HowItWorks() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);

  const steps = [
    {
      id: 1,
      icon: MapPin,
      title: 'Locate Station',
      description: 'Find the nearest charging station using our app'
    },
    {
      id: 2,
      icon: Plug,
      title: 'Plug In',
      description: 'Connect your vehicle to the charging port'
    },
    {
      id: 3,
      icon: Zap,
      title: 'Start Charging',
      description: 'Tap to start and monitor your charging progress'
    },
    {
      id: 4,
      icon: CreditCard,
      title: 'Pay & Go',
      description: 'Automatic payment when charging is complete'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepId = parseInt(entry.target.getAttribute('data-step') || '0');
            setVisibleSteps(prev => [...new Set([...prev, stepId])]);
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll('[data-step]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            How It
            <span className="block text-[#00CFFF]">Works</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Charging your EV has never been this simple. 
            Four easy steps to get you back on the road.
          </p>
        </div>

        <div className="relative">
          {/* Progress Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-white/10 transform -translate-y-1/2">
            <div 
              className="h-full bg-gradient-to-r from-[#00CFFF] to-[#00CFFF]/50 transition-all duration-2000 ease-out"
              style={{ 
                width: `${(visibleSteps.length / steps.length) * 100}%` 
              }}
            ></div>
          </div>

          {/* Steps */}
          <div className="grid lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                data-step={step.id}
                className={`relative text-center transform transition-all duration-700 delay-${index * 200} ${
                  visibleSteps.includes(step.id)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                {/* Step Circle */}
                <div className="relative mx-auto mb-6">
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-all duration-500 ${
                    visibleSteps.includes(step.id)
                      ? 'bg-[#00CFFF] text-black shadow-[0_0_30px_rgba(0,207,255,0.5)]'
                      : 'bg-white/10 text-white'
                  }`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                  
                  {/* Step Number */}
                  <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                    visibleSteps.includes(step.id)
                      ? 'bg-white text-black'
                      : 'bg-[#00CFFF] text-black'
                  }`}>
                    {step.id}
                  </div>

                  {/* Connecting Line (Mobile) */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden absolute top-20 left-1/2 w-0.5 h-8 bg-white/20 transform -translate-x-1/2"></div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="group bg-[#00CFFF] hover:bg-[#00B8E6] text-black font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[0_0_30px_rgba(0,207,255,0.5)]">
            Try It Now
            <div className="absolute inset-0 rounded-full bg-[#00CFFF] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </section>
  );
}