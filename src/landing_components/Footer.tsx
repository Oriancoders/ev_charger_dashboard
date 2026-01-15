import React from 'react';
import { Zap, Twitter, Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#00CFFF] rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-bold text-white">ChargePro</span>
            </div>
            
            <p className="text-gray-400 leading-relaxed max-w-md">
              Powering the future of electric mobility with the world's most 
              advanced charging network. Fast, reliable, and everywhere you need us.
            </p>

            <div className="flex gap-4">
              {[
                { icon: Twitter, href: '#' },
                { icon: Github, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Mail, href: '#' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="group w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#00CFFF]/20 transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-[#00CFFF] transition-colors duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {['Find Stations', 'Pricing', 'Dashboard', 'Support', 'About Us'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#00CFFF] transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-6">Resources</h3>
            <ul className="space-y-4">
              {['Help Center', 'API Docs', 'Privacy', 'Terms', 'Careers'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#00CFFF] transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 ChargePro. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span>Made with ⚡ for the future</span>
          </div>
        </div>
      </div>
    </footer>
  );
}