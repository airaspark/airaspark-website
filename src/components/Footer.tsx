import React from 'react';
import { motion } from 'motion/react';
import { Zap, ArrowUp, Github, Linkedin, Twitter, Globe, Cpu } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  };

  return (
    <footer className="relative bg-[#0B1220] border-t border-white/5 pt-20 pb-10">
      {/* Side background grid overlay */}
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16">
          
          {/* Column 1: Brand details */}
          <div className="md:col-span-5 space-y-6">
            <a href="#hero" className="flex items-center gap-3 group" onClick={(e) => handleLinkClick(e, 'hero')}>
              <div className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-tr from-[#0B1220] to-[#15233A] border border-[#4C8DFF]/30 overflow-hidden shadow-inner group-hover:border-[#4C8DFF] transition-all">
                <span className="text-[#4C8DFF] font-bold text-lg font-display">A</span>
                <div className="absolute bottom-1 right-1">
                  <Zap className="w-3.5 h-3.5 text-[#4C8DFF]" />
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-white font-bold leading-none text-lg tracking-wider font-display uppercase">
                  AiraSpark
                </span>
                <span className="text-[9px] text-[#A7B0C0] tracking-widest font-mono uppercase mt-0.5">
                  Technologies
                </span>
              </div>
            </a>

            <p className="text-sm text-[#A7B0C0] leading-relaxed tracking-wide font-light max-w-sm">
              Igniting Innovation. Powering The Future. We develop custom software integrations, autonomous artificial intelligence models, smart IoT protocols, and modular cloud architectures.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#A7B0C0] hover:text-[#4C8DFF] hover:border-[#4C8DFF]/50 hover:bg-[#4C8DFF]/10 transition-all cursor-pointer"
                aria-label="AiraSpark on LinkedIn"
              >
                <Linkedin className="w-4.5 h-4.5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#A7B0C0] hover:text-[#4C8DFF] hover:border-[#4C8DFF]/50 hover:bg-[#4C8DFF]/10 transition-all cursor-pointer"
                aria-label="AiraSpark on Twitter"
              >
                <Twitter className="w-4.5 h-4.5" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#A7B0C0] hover:text-[#4C8DFF] hover:border-[#4C8DFF]/50 hover:bg-[#4C8DFF]/10 transition-all cursor-pointer"
                aria-label="AiraSpark on GitHub"
              >
                <Github className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-mono text-white uppercase tracking-widest font-semibold">NAVIGATION MESH</h4>
            <div className="grid grid-cols-1 gap-2.5">
              <a href="#hero" onClick={(e) => handleLinkClick(e, 'hero')} className="text-sm text-[#AAB7C4] hover:text-white transition-colors">
                Home Base
              </a>
              <a href="#about" onClick={(e) => handleLinkClick(e, 'about')} className="text-sm text-[#AAB7C4] hover:text-white transition-colors">
                Company Story
              </a>
              <a href="#solutions" onClick={(e) => handleLinkClick(e, 'solutions')} className="text-sm text-[#AAB7C4] hover:text-white transition-colors">
                Active Solutions
              </a>
              <a href="#technologies" onClick={(e) => handleLinkClick(e, 'technologies')} className="text-sm text-[#AAB7C4] hover:text-white transition-colors">
                Core Technologies
              </a>
            </div>
          </div>

          {/* Column 3: Corporate links */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-mono text-white uppercase tracking-widest font-semibold">ENTERPRISE CLUSTERS</h4>
            <div className="grid grid-cols-1 gap-2.5">
              <a href="#leadership" onClick={(e) => handleLinkClick(e, 'leadership')} className="text-sm text-[#AAB7C4] hover:text-white transition-colors">
                Leadership Team
              </a>
              <a href="#vision" onClick={(e) => handleLinkClick(e, 'vision')} className="text-sm text-[#AAB7C4] hover:text-white transition-colors">
                Future Products
              </a>
              <a href="#contact" onClick={(e) => handleLinkClick(e, 'contact')} className="text-sm text-[#AAB7C4] hover:text-white transition-colors">
                Join Collaboration
              </a>
              <div className="pt-2 text-xs text-[#4C8DFF] font-mono flex items-center gap-2">
                <Cpu className="w-4 h-4 animate-pulse" />
                <span>SERVER ENGINE LOCATED IN IN_CO_01</span>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic bottom information and top-scroll */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs text-[#A7B0C0]/60 font-mono text-center sm:text-left">
            &copy; {currentYear} AIRASPARK TECHNOLOGIES. ALL RIGHTS RESERVED. SECURED VIA END-TO-END VERIFIED PIPELINES.
          </p>

          <button
            onClick={handleScrollTop}
            className="group w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#A7B0C0] hover:text-white hover:border-[#4C8DFF]/50 hover:bg-[#4C8DFF]/10 transition-all cursor-pointer"
            aria-label="Scroll back to top"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
