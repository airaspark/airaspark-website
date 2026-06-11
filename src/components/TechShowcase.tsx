import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Technology } from '../types';
import { 
  Database, 
  Terminal, 
  Cpu, 
  Code, 
  Cloud, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  CpuIcon,
  AtomIcon
} from 'lucide-react';

export default function TechShowcase() {
  const [activeTech, setActiveTech] = useState<number>(0);

  const technologiesData: Technology[] = [
    {
      name: 'React Ecosystem',
      category: 'frontend',
      description: 'Single-page client environments engineered with modular hook state containers, virtual dom reconciliations, and blazing fast edge deployments.',
      proficiencyGauge: 95,
    },
    {
      name: 'Artificial Intelligence',
      category: 'ai',
      description: 'Custom neural structures, fine-tuned transformer stacks, vector stores (RAG pipeline optimizations) and autonomous agent models.',
      proficiencyGauge: 90,
    },
    {
      name: 'Cloud Computing',
      category: 'cloud',
      description: 'Fully isolated multi-cloud architectures built with scale-to-zero compute nodes, automated cluster failovers, and multi-region CDN proxies.',
      proficiencyGauge: 88,
    },
    {
      name: 'IoT, Embedded Systems & Product Design',
      category: 'iot',
      description: 'From IoT device concepts and embedded hardware selection to product design, firmware bring-up, enclosure refinement, and launch-ready delivery.',
      proficiencyGauge: 85,
    },
    {
      name: 'DevOps & Pipeline Automation',
      category: 'devops',
      description: 'Uncompromising container isolated staging clusters, continuous artifact delivery models, and declarative server architectures.',
      proficiencyGauge: 92,
    },
    {
      name: 'Cybersecurity Mesh',
      category: 'security',
      description: 'Zero-trust authorization schemas, end-to-end token encryption, automated vulnerability parsers, and continuous server auditing.',
      proficiencyGauge: 89,
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'frontend': return <AtomIcon className="w-5 h-5" />;
      case 'ai': return <Database className="w-5 h-5" />;
      case 'cloud': return <Cloud className="w-5 h-5" />;
      case 'iot': return <Cpu className="w-5 h-5" />;
      case 'devops': return <Terminal className="w-5 h-5" />;
      case 'security': return <ShieldCheck className="w-5 h-5" />;
      default: return <Code className="w-5 h-5" />;
    }
  };

  return (
    <section id="technologies" className="relative py-28 bg-[#0B1220]">
      {/* Visual separators */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4C8DFF]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4C8DFF]/20 to-transparent" />
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      {/* Glow Orbs */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 rounded-full radial-glow-heavy opacity-25 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">
          
          {/* Left Column: List of Badges & Selector */}
          <div className="lg:col-span-5 max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-px bg-[#4C8DFF]" />
              <p className="text-xs font-mono uppercase tracking-widest text-[#4C8DFF] font-bold">Tech Stack Showcase</p>
            </div>

            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold font-display uppercase tracking-tight text-white leading-tight max-w-lg">
              Our Core Technologies
            </h2>
            
            <p className="mt-4 text-[#AAB7C4] text-base leading-relaxed tracking-wide font-light">
              Click on each technology badge to review our engineering blueprints, competency ratings, and integration use cases.
            </p>

            {/* Badges Container */}
            <div className="mt-8 flex flex-col gap-3">
              {technologiesData.map((tech, idx) => (
                <button
                  key={tech.name}
                  onClick={() => setActiveTech(idx)}
                  className={`w-full text-left px-5 py-3.5 rounded-xl flex items-center justify-between transition-all duration-300 border cursor-pointer ${
                    activeTech === idx
                      ? 'bg-[#15233A] border-[#4C8DFF]/40 text-white shadow-[0_0_15px_rgba(76,141,255,0.15)]'
                      : 'bg-[#09111D]/60 border-white/5 text-[#A7B0C0] hover:text-white hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2 rounded-lg transition-colors ${
                      activeTech === idx ? 'bg-[#4C8DFF]/20 text-[#4C8DFF]' : 'bg-white/5 text-[#A7B0C0]'
                    }`}>
                      {getCategoryIcon(tech.category)}
                    </div>
                    <span className="font-display font-medium text-sm sm:text-base tracking-wide">{tech.name}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                    activeTech === idx ? 'translate-x-1 text-[#4C8DFF]' : 'text-neutral-500'
                  }`} />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: High-fidelity specs display and gauges */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-2xl p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-[0_15px_40px_rgba(2,8,19,0.5)] cyber-border-tl cyber-border-br min-h-[480px] flex flex-col justify-between">
              
              {/* Graphic background details */}
              <div className="absolute top-0 right-0 w-44 h-44 rounded-full radial-glow opacity-25 pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTech}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Category Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="px-3 py-1 bg-[#4C8DFF]/10 border border-[#4C8DFF]/20 rounded-full text-[10px] font-mono text-[#4C8DFF] tracking-widest uppercase">
                      Category // {technologiesData[activeTech].category}
                    </span>
                    <span className="text-xs font-mono text-[#A7B0C0]/50">SECURE SHELL // SSH-V2</span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-display text-white uppercase tracking-tight max-w-2xl">
                      {technologiesData[activeTech].name}
                    </h3>
                    <p className="mt-4 text-[#A7B0C0] text-sm sm:text-base leading-relaxed tracking-wide font-light max-w-2xl">
                      {technologiesData[activeTech].description}
                    </p>
                  </div>

                  {/* Competency gauge bar */}
                  <div className="space-y-2 pt-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-white/60">ENGINEERING CAPACITY</span>
                      <span className="text-[#4C8DFF] font-bold">{technologiesData[activeTech].proficiencyGauge}% DEPLOYED</span>
                    </div>
                    {/* Gauge Visual Bar */}
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${technologiesData[activeTech].proficiencyGauge}%` }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="h-full bg-gradient-to-r from-[#4C8DFF]/40 to-[#4C8DFF] shadow-[0_0_10px_rgba(76,141,255,0.5)]"
                      />
                    </div>
                  </div>

                  {/* High Tech Dashboard Sub-stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/5">
                    <div className="p-3 bg-[#09111D]/60 rounded-xl border border-white/5">
                      <span className="text-[10px] font-mono text-[#A7B0C0]/60 block uppercase">Protocol Priority</span>
                      <span className="text-sm font-semibold font-display text-white mt-1 block">CRITICAL</span>
                    </div>
                    <div className="p-3 bg-[#09111D]/60 rounded-xl border border-white/5">
                      <span className="text-[10px] font-mono text-[#A7B0C0]/60 block uppercase">Compliance Range</span>
                      <span className="text-sm font-semibold font-display text-white mt-1 block">ENTERPRISE</span>
                    </div>
                    <div className="p-3 bg-[#09111D]/60 rounded-xl border border-white/5">
                      <span className="text-[10px] font-mono text-[#A7B0C0]/60 block uppercase">Telemetry Status</span>
                      <span className="text-sm font-semibold font-display text-green-400 mt-1 block flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping-slow shrink-0" />
                        STABLE
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Sandbox Mock Console Output to anchor the futuristic design */}
              <div className="mt-6 p-4 rounded-xl bg-[#09111D] border border-white/5 font-mono text-[10px] text-[#A7B0C0]/60 space-y-1 break-words">
                <span className="text-[#4C8DFF] block">&gt; shreyank@airaspark:~# inspect --stack {technologiesData[activeTech].category}</span>
                <span>STATUS: FETCHING CAPABILITY METRICS... OK</span>
                <span>COMPATIBILITY INDEX: 1.00 (SEAMLESS INTEGRATION)</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
