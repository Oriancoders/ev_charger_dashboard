import React, { useState } from 'react';
import { Check, Zap } from 'lucide-react';

export default function Pricing() {
  const [batteryLevel, setBatteryLevel] = useState(75);

  const plans = [
    {
      name: 'Pay Per Use',
      price: '$0.35',
      unit: 'per kWh',
      description: 'Perfect for occasional charging',
      features: [
        'Access to all stations',
        'Standard charging speed',
        'Mobile app support',
        'Customer support'
      ],
      popular: false
    },
    {
      name: 'PowerPlan',
      price: '$29',
      unit: 'per month',
      description: 'Best value for regular drivers',
      features: [
        'Unlimited charging',
        'Priority access',
        'Fast charging included',
        '24/7 premium support',
        'Route planning'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      unit: 'pricing',
      description: 'For fleets and businesses',
      features: [
        'Dedicated stations',
        'Fleet management',
        'Custom billing',
        'Analytics dashboard',
        'Priority support'
      ],
      popular: false
    }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => {
        if (prev >= 100) return 20;
        return prev + 1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Simple, Transparent
            <span className="block text-[#00CFFF]">Pricing</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the plan that fits your driving needs. 
            No hidden fees, no surprises.
          </p>
        </div>

        {/* Battery Animation */}
        <div className="flex justify-center mb-16">
          <div className="relative">
            <div className="w-32 h-16 border-4 border-white rounded-lg relative overflow-hidden bg-black">
              <div 
                className="absolute inset-1 bg-gradient-to-r from-[#00CFFF] to-white transition-all duration-1000 ease-out rounded"
                style={{ width: `${batteryLevel}%` }}
              >
                <div className="absolute inset-0 bg-[#00CFFF] opacity-50 animate-pulse"></div>
              </div>
              <div className="absolute right-[-8px] top-1/2 w-2 h-6 bg-white rounded-r transform -translate-y-1/2"></div>
            </div>
            <div className="text-center mt-4">
              <div className="text-2xl font-bold text-white">{batteryLevel}%</div>
              <div className="text-sm text-gray-400">Charging...</div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl p-8 transition-all duration-500 hover:scale-105 ${
                plan.popular
                  ? 'bg-gradient-to-b from-[#00CFFF]/10 to-black border-2 border-[#00CFFF]/50'
                  : 'bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#00CFFF]/30'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#00CFFF] text-black px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-2">{plan.unit}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#00CFFF] flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-full font-semibold transition-all duration-300 ${
                plan.popular
                  ? 'bg-[#00CFFF] text-black hover:bg-[#00B8E6] hover:shadow-[0_0_20px_rgba(0,207,255,0.5)]'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-[#00CFFF]/50'
              }`}>
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        {/* Savings Comparison */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">
              Save Money, Save the Planet
            </h3>
            <p className="text-gray-300">
              See how much you could save by switching to electric
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">⛽</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Gasoline</h4>
              <div className="text-3xl font-bold text-red-400 mb-2">$4.50</div>
              <div className="text-gray-400">per gallon equivalent</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#00CFFF]/20 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-[#00CFFF]" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Electric</h4>
              <div className="text-3xl font-bold text-[#00CFFF] mb-2">$1.20</div>
              <div className="text-gray-400">per equivalent charge</div>
            </div>
          </div>

          <div className="text-center mt-8">
            <div className="text-2xl font-bold text-[#00CFFF] mb-2">
              Save up to $2,000 per year
            </div>
            <div className="text-gray-400">
              Based on average driving of 12,000 miles per year
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}