import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, Zap } from 'lucide-react';
import logo from '../assets/airaspark-logo.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { name: 'Home', href: '#hero', id: 'hero' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Solutions', href: '#solutions', id: 'solutions' },
    { name: 'Tech', href: '#technologies', id: 'technologies' },
    { name: 'Leadership', href: '#leadership', id: 'leadership' },
    { name: 'Vision', href: '#vision', id: 'vision' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Simple intersection observer behavior on-scroll
      const scrollPosition = window.scrollY + 100;
      for (const link of navLinks) {
        const el = document.getElementById(link.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(link.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 112,
        behavior: 'smooth',
      });
      setActiveSection(targetId);
      setIsOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#07111F]/80 backdrop-blur-md border-b border-[#00AEEF]/20 py-2.5 shadow-lg'
          : 'bg-transparent py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2.5 group" onClick={(e) => handleLinkClick(e, '#hero')}>
          <div className="relative flex items-center justify-center">
            <img
              src={logo}
              alt="AiraSpark Logo"
              className="w-10 h-10 sm:w-11 sm:h-11 relative z-12 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold leading-none text-base sm:text-lg tracking-wider font-display uppercase group-hover:text-[#00AEEF] transition-colors duration-300">
              AiraSpark
            </span>
            <span className="text-[8px] sm:text-[9px] text-[#AAB7C4] tracking-widest font-mono uppercase mt-0.5">
              Technologies
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 relative ${
                activeSection === link.id
                  ? 'text-white font-semibold'
                  : 'text-[#AAB7C4] hover:text-white'
              }`}
            >
              {activeSection === link.id && (
                <motion.span
                  layoutId="activeNavBackground"
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00AEEF]/10 to-transparent border-b border-[#00AEEF] rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{link.name}</span>
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center">
          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, '#contact')}
            className="group flex items-center gap-2 bg-[#00AEEF]/10 hover:bg-[#00AEEF] text-white hover:text-[#07111F] px-[18px] py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase border border-[#00AEEF]/40 hover:border-transparent transition-all duration-300 font-display"
          >
            Connect Portal
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white p-1 hover:text-[#00AEEF] transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#07111F]/95 backdrop-blur-lg border-b border-[#00AEEF]/20"
          >
            <div className="px-6 py-8 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-lg font-medium py-2 border-b border-white/5 transition-all ${
                    activeSection === link.id
                      ? 'text-[#00AEEF] font-bold pl-2'
                      : 'text-[#AAB7C4] hover:text-white'
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => handleLinkClick(e, '#contact')}
                className="mt-4 flex items-center justify-center gap-2 bg-[#00AEEF] text-[#07111F] py-3 rounded-full text-sm font-semibold tracking-wider uppercase shadow-[0_0_15px_rgba(0,174,239,0.3)]"
              >
                Connect Portal
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
