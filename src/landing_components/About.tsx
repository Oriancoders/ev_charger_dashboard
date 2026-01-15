import React from 'react';
import { Zap, Shield, Leaf } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Ultra-rapid charging up to 350kW gets you back on the road in minutes, not hours.'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Military-grade encryption ensures your payment data is always protected.'
    },
    {
      icon: Leaf,
      title: '100% Renewable',
      description: 'Every charge is powered by clean, renewable energy sources.'
    }
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                The Future of
                <span className="block text-[#00CFFF]">Electric Mobility</span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                We're building the world's most advanced charging network, 
                designed for the electric future that's already here.
              </p>
            </div>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-6 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#00CFFF]/50 transition-all duration-500 hover:bg-[#00CFFF]/10"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#00CFFF]/20 flex items-center justify-center group-hover:bg-[#00CFFF]/30 transition-colors duration-300">
                      <feature.icon className="w-6 h-6 text-[#00CFFF]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative group">
            <div className="relative overflow-hidden rounded-3xl">
              <img
                src="https://images.unsplash.com/photo-1615829386703-e2bb66a7cb7d?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="EV Charging Station"
                className="w-full h-[600px] object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-[#00CFFF]/10"></div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#00CFFF]/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#00CFFF]/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
}