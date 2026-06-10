import { useState } from 'react';
import { motion } from 'motion/react';
import { ProductVision } from '../types';
import { 
  Rocket, 
  Map, 
  Brain, 
  Cpu, 
  Cloud, 
  Activity, 
  Settings, 
  ShieldCheck, 
  Zap, 
  Calendar 
} from 'lucide-react';

export default function FutureVision() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const visions: ProductVision[] = [
    {
      title: 'AiraSpark AI Agentic Mesh',
      tagline: 'Self-orchestrating task clusters for enterprise optimization.',
      description: 'An advanced agent mesh framework capable of taking arbitrary natural-language enterprise goals, breaking them down into isolated docker tasks, executing them recursively, and updating workflows autonomously.',
      techStack: ['PyTorch', 'Vector Databases', 'gRPC API Modularity', 'Docker Sandbox'],
      timeline: 'Q3 2026',
      status: 'Alpha',
      icon: 'Brain'
    },
    {
      title: 'Smart tracking & Geo-Locators',
      tagline: 'High-frequency telemetry mapping protocols.',
      description: 'An enterprise-grade smart physical-object monitoring protocol integrating physical geo-position tags with robust satellite time-series streams and high-precision predictive ETA maps.',
      techStack: ['RTOS Embedded', 'GNSS / Beidou Mesh', 'TimescaleDB', 'MQTT Socket Engine'],
      timeline: 'Q4 2026',
      status: 'Prototype',
      icon: 'Map'
    },
    {
      title: 'AiraSpark IoT Command Center',
      tagline: 'Zero-latency orchestration dashboard for hardware meshes.',
      description: 'A cloud-native portal permitting real-time over-the-air firmware deployments, real-time diagnostic stream views, hardware key rotating, and device lifecycle triggers.',
      techStack: ['Rust Firmware', 'WebAssembly Core', 'Apache Kafka Streams', 'React Dashboard'],
      timeline: 'Q1 2027',
      status: 'Conceptual',
      icon: 'Cpu'
    },
    {
      title: 'Sovereign Cloud Orchestration',
      tagline: 'On-premise hardware transformation tools.',
      description: 'An orchestration stack turning standard bare-metal corporate servers into isolated high-availability cloud cluster nodes with automated, physical disk volume backups.',
      techStack: ['K3s Micro-kubernetes', 'eBPF Isolation Network', 'Ceph S3 Database', 'Linux Kernel Hooks'],
      timeline: 'Q2 2027',
      status: 'Alpha',
      icon: 'Cloud'
    },
    {
      title: 'Autonomous Business Engine',
      tagline: 'Fully automated cross-platform backoffice automation.',
      description: 'A cloud service tracking corporate invoices, team performance telemetry, financial pipelines, and legal document pipelines, outputting real-time efficiency dashboards with zero manual work.',
      techStack: ['Autonomous Graph Execution', 'OCR Vision Parser', 'OAuth Secure Scopes', 'Next-Gen Analytics'],
      timeline: 'Q4 2026',
      status: 'Beta',
      icon: 'Settings'
    }
  ];

  const getIconElement = (iconName: string) => {
    switch (iconName) {
      case 'Brain': return <Brain className="w-5 h-5 text-[#00AEEF]" />;
      case 'Map': return <Map className="w-5 h-5 text-[#00AEEF]" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-[#00AEEF]" />;
      case 'Cloud': return <Cloud className="w-5 h-5 text-[#00AEEF]" />;
      case 'Settings': return <Settings className="w-5 h-5 text-[#00AEEF]" />;
      default: return <Rocket className="w-5 h-5 text-[#00AEEF]" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Conceptual': return 'border-amber-500/30 text-amber-400 bg-amber-500/5';
      case 'Prototype': return 'border-purple-500/30 text-purple-400 bg-purple-500/5';
      case 'Alpha': return 'border-[#00AEEF]/30 text-[#00AEEF] bg-[#00AEEF]/5';
      case 'Beta': return 'border-green-500/30 text-green-400 bg-green-500/5';
      default: return 'border-neutral-500/30 text-neutral-400 bg-neutral-500/5';
    }
  };

  return (
    <section id="vision" className="relative py-28 bg-[#07111F]">
      {/* Visual background lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00AEEF]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00AEEF]/20 to-transparent" />
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full radial-glow opacity-25 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00AEEF]/5 border border-[#00AEEF]/20 text-xs font-mono uppercase tracking-widest text-[#00AEEF] mb-4">
            <Rocket className="w-3.5 h-3.5 animate-bounce" />
            Horizon Milestones
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold font-display uppercase tracking-tight text-white leading-none">
            Future Initiatives
          </h2>
          <p className="mt-4 text-[#AAB7C4] text-base font-light tracking-wide max-w-xl mx-auto">
            Review AiraSpark’s research and development roadmap as we materialize innovative solutions on the computational horizon.
          </p>
        </div>

        {/* Bento-style Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {visions.map((vision, idx) => {
            // Setup custom widths representing visual size rhythm (e.g. 1st card takes 3 units, 2nd card takes 3 units, next cards 2 units each, etc.)
            const isMediumGrid = idx === 0 || idx === 1;
            const gridClass = isMediumGrid 
              ? 'md:col-span-3' 
              : 'md:col-span-2';

            return (
              <motion.div
                key={vision.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: 'easeOut' }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`glass-panel rounded-2xl p-8 cursor-default border border-white/5 relative overflow-hidden transition-all duration-300 ${gridClass} ${
                  hoveredIdx === idx ? 'border-[#00AEEF]/30 bg-[#0B1E36]/30 shadow-md translate-y-[-2px]' : ''
                }`}
              >
                {/* Visual card header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#00AEEF]/10 border border-[#00AEEF]/20 flex items-center justify-center shrink-0">
                    {getIconElement(vision.icon)}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono tracking-widest uppercase border ${getStatusColor(vision.status)}`}>
                    {vision.status} Project
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white uppercase tracking-tight">
                    {vision.title}
                  </h3>
                  <p className="text-xs text-[#00AEEF] font-mono uppercase tracking-wide">
                    {vision.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-[#AAB7C4] leading-relaxed tracking-wide font-light">
                    {vision.description}
                  </p>
                </div>

                {/* Tech Badges inside Card */}
                <div className="flex flex-wrap gap-1.5 mt-6 mb-8">
                  {vision.techStack.map((tech) => (
                    <span 
                      key={tech} 
                      className="px-2 py-0.5 rounded bg-[#020813] border border-white/5 text-[10px] font-mono text-[#AAB7C4]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Absolute Card Footer with Target Timeline */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#AAB7C4]/60">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Target Delivery: {vision.timeline}
                  </span>
                  {hoveredIdx === idx && (
                    <motion.span 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[#00AEEF] font-medium uppercase tracking-widest text-[9px]"
                    >
                      SPEC_ANALYSIS &gt;&gt;
                    </motion.span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
