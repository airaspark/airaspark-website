/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Solutions from './components/Solutions';
import TechShowcase from './components/TechShowcase';
import FutureVision from './components/FutureVision';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#07111F] text-white selection:bg-[#00AEEF]/30 selection:text-[#00AEEF] overflow-x-hidden">
      {/* Background Glow Effects from Sleek Interface Theme */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00AEEF] opacity-10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00AEEF] opacity-5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Absolute top glowing orb shared background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1000px] rounded-full radial-glow opacity-30 blur-3xl pointer-events-none z-0" />

      {/* Global Navbar */}
      <Navbar />

      {/* Section Blocks */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Solutions />
        <TechShowcase />
        <FutureVision />
        <Contact />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
