import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code, 
  Brain, 
  Cpu, 
  Globe, 
  Cloud, 
  Zap, 
  Check, 
  X, 
  ArrowRight,
  Terminal,
  Activity
} from 'lucide-react';
import { Solution } from '../landing-types';

export default function Solutions() {
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);

  useEffect(() => {
    if (selectedSolution) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedSolution]);

  const solutionsData: Solution[] = [
    {
      id: 'software-dev',
      title: 'Software Development',
      badge: 'CORE ENGINEERING',
      description: 'End-to-end engineered corporate platforms and backend architectures structured with rigorous object modularity and horizontal scaling capabilities.',
      icon: 'Code',
      metrics: 'Zero-Leak Core Architecture',
      features: [
        'Robust multi-threaded custom backends',
        'Service-Oriented and Microservice frameworks',
        'Custom desktop, enterprise, and mobile platforms',
        'Rigorous automated coverage testing (100% CI/CD integration)',
        'Resilient API pipeline designs & OpenAPI schemas'
      ]
    },
    {
      id: 'ai-solutions',
      title: 'Artificial Intelligence',
      badge: 'COGNITIVE COMPUTING',
      description: 'Custom neural architectures, machine learning models, autonomous workflow agents, and deep analytical predictive modeling.',
      icon: 'Brain',
      metrics: 'Autonomous Model Orchestration',
      features: [
        'Large Language Model (LLM) fine-tuning & RAG systems',
        'Computer vision: real-time objection & motion analysis',
        'Automated decisioning pipelines & intelligent classifiers',
        'Speech synthesis, semantic text translation, and TTS models',
        'Predictive risk metrics & market signal classifiers'
      ]
    },
    {
      id: 'iot-frameworks',
      title: 'IoT, Embedded Systems & Product Design',
      badge: 'CONNECTED PRODUCT DESIGN',
      description: 'Full-cycle product development from concept sketches and requirements through hardware selection, firmware architecture, prototyping, enclosure refinement, validation, and production release.',
      icon: 'Cpu',
      metrics: 'Concept to Production Delivery',
      features: [
        'Discovery workshops, requirements definition, and use-case mapping',
        'Hardware architecture selection for MCUs, sensors, and embedded Linux',
        'Firmware bring-up, peripheral drivers, RTOS integration, and testing',
        'Industrial design coordination, enclosure iteration, and DFM handoff',
        'Pilot builds, OTA pipelines, telemetry, diagnostics, and launch support'
      ]
    },
    {
      id: 'web-engineering',
      title: 'Web Development',
      badge: 'IMMERSIVE FLUID UI',
      description: 'Elite single page and server-rendered web applications leveraging modern frameworks, blazing static delivery routes, and premium UX aesthetics.',
      icon: 'Globe',
      metrics: 'Perfect 100/100 Lighthouse Ratings',
      features: [
        'Next-generation React, Vite, and server-side render stacks',
        'Fully customized design languages & atomic components',
        'Ultra-fast asset delivery models (Varnish & edge proxies)',
        'Complex interactive canvases & WebGL visual modules',
        'Accessibility (WCAG AA/AAA) standard-compliant designs'
      ]
    },
    {
      id: 'cloud-devops',
      title: 'Cloud & DevOps',
      badge: 'INFINITE COMPUTE',
      description: 'Secure, cost-optimized cloud environments (AWS, Azure, GCP) that automatically scale with your traffic, ensuring you only pay for what you use.',
      icon: 'Cloud',
      metrics: '99.999% Uptime Guarantee',
      features: [
        'Terraform & CloudFormation automated orchestrations',
        'Multi-region failover configurations (Active/Active, Active/Passive)',
        'Containerization: Docker, Podman, Kubernetes clusters',
        'Security automation with continuous code vulnerability scanning',
        'Advanced visual metrics (Prometheus, Grafana, OpenSearch)'
      ]
    },
    {
      id: 'digital-transform',
      title: 'Digital Transformation',
      badge: 'LEGACY MODERNIZATION',
      description: 'Modernizing legacy architectures into clean, accessible, high-performance web and database micro-services.',
      icon: 'Zap',
      metrics: 'Up to 3x Core Velocity Gain',
      features: [
        'Detailed monolithic-to-microservice audit blueprints',
        'Data lake house migrations (Hadoop/S3 to live warehouses)',
        'Cross-training & team workflow automation designs',
        'AI assistance integration for internal processes',
        'Omnichannel secure data stream aggregation'
      ]
    }
  ];

  // Helper matching icon string component
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code': return <Code className="w-6 h-6 text-[#4C8DFF]" />;
      case 'Brain': return <Brain className="w-6 h-6 text-[#4C8DFF]" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-[#4C8DFF]" />;
      case 'Globe': return <Globe className="w-6 h-6 text-[#4C8DFF]" />;
      case 'Cloud': return <Cloud className="w-6 h-6 text-[#4C8DFF]" />;
      case 'Zap': return <Zap className="w-6 h-6 text-[#4C8DFF]" />;
      default: return <Code className="w-6 h-6 text-[#4C8DFF]" />;
    }
  };

  return (
    <section id="solutions" className="relative py-28 bg-[#09111D] overflow-hidden">
      {/* Background design elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full radial-glow opacity-30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full radial-glow-heavy opacity-20 blur-3xl pointer-events-none" />
      
      {/* Grid */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4C8DFF]/5 border border-[#4C8DFF]/20 text-xs font-mono uppercase tracking-widest text-[#4C8DFF] mb-4">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            Active Capabilities
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold font-display uppercase tracking-tight text-white leading-none">
            Elite Digital Solutions
          </h2>
          <p className="mt-4 text-[#AAB7C4] text-base sm:text-lg font-light tracking-wide max-w-xl mx-auto leading-relaxed">
            Engineered with flawless logical isolation, architectural safety, and responsive high-velocity scaling vectors.
          </p>
        </div>

        {/* solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutionsData.map((sol) => (
            <motion.div
              key={sol.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              onClick={() => setSelectedSolution(sol)}
              className="glass-panel glass-panel-hover rounded-2xl p-8 cursor-pointer flex flex-col justify-between group relative cyber-border-tl cyber-border-br"
            >
              {/* Top Row with card Header info */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-xl bg-[#4C8DFF]/10 border border-[#4C8DFF]/20 flex items-center justify-center group-hover:bg-[#4C8DFF]/20 group-hover:border-[#4C8DFF] transition-all duration-300">
                    {getIcon(sol.icon)}
                  </div>
                  <span className="text-[10px] font-mono text-[#4C8DFF]/60 group-hover:text-[#4C8DFF] tracking-widest uppercase transition-colors duration-300">
                    {sol.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-display text-white tracking-wide uppercase group-hover:text-[#4C8DFF] transition-colors duration-300">
                  {sol.title}
                </h3>
                
                <p className="mt-4 text-[#AAB7C4] text-sm leading-relaxed tracking-wide font-light line-clamp-3">
                  {sol.description}
                </p>
              </div>

              {/* Bottom interaction details */}
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-[#4C8DFF] tracking-wider uppercase font-semibold">
                  {sol.metrics}
                </span>
                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#A7B0C0] group-hover:text-white group-hover:bg-[#4C8DFF]/10 transition-all duration-300">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Expandable Dialog Modals */}
        <AnimatePresence>
          {selectedSolution && (
            <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24 pb-4 sm:pt-28">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedSolution(null)}
                className="absolute inset-0 bg-[#09111D]/90 backdrop-blur-md cursor-zoom-out"
              />

              {/* Dialog Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 15 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="glass-panel w-full max-w-2xl max-h-[calc(100vh-7rem)] rounded-2xl p-6 sm:p-8 relative overflow-y-auto overflow-x-hidden shadow-[0_0_50px_rgba(76,141,255,0.25)] cyber-border-tl cyber-border-br"
              >
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setSelectedSolution(null)}
                    className="p-2 rounded-full hover:bg-white/5 text-[#AAB7C4] hover:text-white transition-colors cursor-pointer"
                    aria-label="Close details"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Accent glows */}
                <div className="absolute top-0 left-0 w-36 h-36 rounded-full radial-glow opacity-30 select-none pointer-events-none" />

                {/* Modal Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-[#4C8DFF]/10 border border-[#4C8DFF]/20 flex items-center justify-center shrink-0">
                    {getIcon(selectedSolution.icon)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#4C8DFF] tracking-widest uppercase block mb-1">
                      {selectedSolution.badge}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold font-display text-white uppercase tracking-tight">
                      {selectedSolution.title}
                    </h3>
                  </div>
                </div>

                <div className="text-base text-[#AAB7C4] leading-relaxed tracking-wide font-light mb-8">
                  {selectedSolution.description}
                </div>

                {/* Features Section */}
                <div>
                  <h4 className="text-xs font-mono text-[#4C8DFF] tracking-widest uppercase mb-4 flex items-center gap-2">
                    <Terminal className="w-4 h-4" /> Architectural Specifications
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedSolution.features.map((feature, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start text-sm text-[#AAB7C4] leading-relaxed">
                        <Check className="w-4 h-4 text-[#4C8DFF] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Metric details */}
                <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4C8DFF] animate-pulse" />
                    <span className="text-xs font-mono text-white/50 lowercase">active verification</span>
                  </div>
                  <span className="text-sm font-semibold text-white bg-[#4C8DFF]/10 px-4 py-1.5 rounded-full border border-[#4C8DFF]/20">
                    Metrics: {selectedSolution.metrics}
                  </span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
