import React, { useEffect } from 'react';
import Lenis from 'lenis';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Solutions from './components/Solutions';
import TechShowcase from './components/TechShowcase';
import FutureVision from './components/FutureVision';
import Leadership from './components/Leadership';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <div className="bg-[#0B1220] text-white min-h-screen font-sans selection:bg-[#4C8DFF] selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Solutions />
        <TechShowcase />
        <FutureVision />
        <Leadership />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;