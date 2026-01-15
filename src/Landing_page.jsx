import React, { useEffect } from "react";
import Hero from "./landing_components/Hero";
import About from "./landing_components/About";
import Stations from "./landing_components/Stations";
import HowItWorks from "./landing_components/HowItWorks";
import Pricing from "./landing_components/Pricing";
import Dashboard from "./landing_components/Dashboard";
import FinalCTA from "./landing_components/FinalCTA";
import Footer from "./landing_components/Footer";
import { useGlobalContext } from "./GlobalStates/GlobalState";
import Login from "./Pages/Login";

import { AnimatePresence, motion } from "framer-motion";

function Landing_page() {
  const { isLoginPage } = useGlobalContext();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* ✅ Landing content always mounted */}
      <div className={`${isLoginPage ? "blur-[2px]" : ""} transition-all duration-300`}>
        <Hero />
        <About />
        <Stations />
        <HowItWorks />
        <Pricing />
        <Dashboard />
        <FinalCTA />
        <Footer />
      </div>

      {/* ✅ Login overlay with slide animation */}
      <AnimatePresence>
        {isLoginPage && (
          <motion.div
            key="login-overlay"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="fixed inset-0 z-50 bg-white"
          >
            <Login />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Landing_page;
