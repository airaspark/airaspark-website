import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowRight } from "lucide-react";
import logo from "../assets/airaspark-logo.png";

const NAV_SECTIONS = [
  { label: "Home", id: "hero" },
  { label: "About", id: "about" },
  { label: "Solutions", id: "solutions" },
  { label: "Tech", id: "technologies" },
  { label: "Vision", id: "vision" },
  { label: "Contact", id: "contact" },
] as const;

const ROUTE_NAV_LINKS = [
  { label: "Reviews", path: "/review" },
  
] as const;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const scrollPosition = window.scrollY + 100;
      for (const { id } of NAV_SECTIONS) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const scrollToElement = (id: string) => {
  const element = document.getElementById(id);

  if (!element) return false;

  const y =
    element.getBoundingClientRect().top +
    window.pageYOffset -
    80;

  if (/Android/i.test(navigator.userAgent)) {
    window.scrollTo(0, y);
  } else {
    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  }

  setActiveSection(id);

  return true;
};

 const scrollToSection = (id: string) => {
  setIsOpen(false);

  const performScroll = () => {
    const element = document.getElementById(id);

    if (!element) return;

    const y =
      element.getBoundingClientRect().top +
      window.pageYOffset -
      80;

    // Android Chrome compatible
    if (
      /Android/i.test(navigator.userAgent)
    ) {
      window.scrollTo(0, y);
    } else {
      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }

    setActiveSection(id);
  };

  if (location.pathname !== "/") {
    navigate("/");

    setTimeout(() => {
      performScroll();
    }, 250);
  } else {
    setTimeout(() => {
      performScroll();
    }, 100);
  }
};

  const navigateTo = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const desktopLinkClass = (id: string) =>
    `px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative whitespace-nowrap ${
      activeSection === id
        ? "text-white font-semibold"
        : "text-[#AAB7C4] hover:text-white"
    }`;

  const desktopRouteLinkClass = (path: string) =>
    `px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative whitespace-nowrap ${
      location.pathname === path
        ? "text-white font-semibold"
        : "text-[#AAB7C4] hover:text-white"
    }`;

  const mobileLinkClass = (id: string) =>
    `text-left text-lg font-medium py-2 border-b border-white/5 transition-all w-full ${
      activeSection === id
        ? "text-[#4C8DFF] font-bold pl-2"
        : "text-[#AAB7C4] hover:text-white"
    }`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || isOpen
            ? "bg-[#07111F]/80 backdrop-blur-xl border-b border-[#4C8DFF]/20 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.25)]"
            : "bg-transparent py-4 sm:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0 group"
            aria-label="Scroll to hero section"
          >
            <img
              src={logo}
              alt="AiraSpark Logo"
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain shrink-0"
            />
            <div className="flex flex-col items-start min-w-0">
              <span className="text-white font-display font-bold uppercase tracking-wide text-lg sm:text-xl leading-none group-hover:text-[#4C8DFF] transition-colors duration-300">
                AIRASPARK
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[#AAB7C4] font-mono">
                INDUSTRIES
              </span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 flex-1 justify-center">
            {NAV_SECTIONS.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={desktopLinkClass(id)}
              >
                {activeSection === id && (
                  <motion.span
                    layoutId="activeNavBackground"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4C8DFF]/10 to-transparent border-b border-[#4C8DFF] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            ))}
            {ROUTE_NAV_LINKS.map(({ label, path }) => (
              <button
                key={path}
                onClick={() => navigateTo(path)}
                className={desktopRouteLinkClass(path)}
              >
                {location.pathname === path && (
                  <motion.span
                    layoutId="activeNavBackground"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4C8DFF]/10 to-transparent border-b border-[#4C8DFF] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => navigate("/login")}
              className="hidden md:inline-flex items-center justify-center gap-2 bg-[#4C8DFF]/10 hover:bg-[#4C8DFF] backdrop-blur-sm text-white hover:text-[#07111F] px-4 lg:px-5 py-2 lg:py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase border border-[#4C8DFF]/40 hover:border-transparent transition-all duration-300 font-display shadow-[0_0_20px_rgba(76,141,255,0.15)] hover:shadow-[0_0_28px_rgba(76,141,255,0.35)] whitespace-nowrap"
            >
              Login / Signup
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="md:hidden text-white p-1.5 rounded-lg hover:bg-white/10 hover:text-[#4C8DFF] transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-[60px] sm:top-[68px] z-40 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-[60px] sm:top-[68px] left-0 right-0 z-50 md:hidden bg-[#07111F]/95 backdrop-blur-xl border-b border-[#4C8DFF]/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-6 flex flex-col gap-1 max-h-[calc(100svh-60px)] sm:max-h-[calc(100svh-68px)] overflow-y-auto">
                {NAV_SECTIONS.map(({ label, id }) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className={mobileLinkClass(id)}
                  >
                    {label}
                  </button>
                ))}

                {ROUTE_NAV_LINKS.map(({ label, path }) => (
                  <button
                    key={path}
                    onClick={() => navigateTo(path)}
                    className={`text-left text-lg font-medium py-2 border-b border-white/5 transition-all w-full ${
                      location.pathname === path
                        ? "text-[#4C8DFF] font-bold pl-2"
                        : "text-[#AAB7C4] hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}

                <button
                  onClick={() => navigateTo("/login")}
                  className="mt-4 flex items-center justify-center gap-2 bg-[#4C8DFF] text-[#07111F] py-3 rounded-full text-sm font-semibold tracking-wider uppercase shadow-[0_0_15px_rgba(76,141,255,0.3)] hover:bg-[#4C8DFF]/90 transition-colors"
                >
                  Login / Signup
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
