import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Compass, Sparkles, AlertCircle } from 'lucide-react';

type TabId = 'story' | 'vision' | 'mission';

export default function About() {
  const [activeTab, setActiveTab] = useState<TabId>('story');

  const tabsContent = {
    story: {
      title: 'Our Genesis & Journey',
      subtitle: 'Where curiosity meets deep engineering.',
      icon: <Sparkles className="w-6 h-6 text-[#4C8DFF]" />,
      body: 'AiraSpark Technologies was forged by a collective of elite developers, architects, and product strategists who realized that standard corporate solutions were failing to adapt to the warp-speed progress of modern AI and decentralized edge computing. Deeply rooted in an aesthetic of absolute functional precision, we design frameworks that don’t only handle today’s workloads, but dynamically anticipate tomorrow’s scaling vectors. We treat software not simply as a codebase, but as custom infrastructure built to withstand evolution.',
    },
    vision: {
      title: 'The Blueprint of Tomorrow',
      subtitle: 'Mapping out a resilient digital universe.',
      icon: <Compass className="w-6 h-6 text-[#4C8DFF]" />,
      body: 'We envision a fully integrated world where corporate workflows are autonomously orchestrated by intelligent agentic meshes, edge machines communicate in secure, zero-latency feedback loops, and data pipelines automatically self-heal and hyper-scale. AiraSpark is paving the foundation for client organizations to integrate artificial intelligence, cloud-native meshes, and smart internet of things (IoT) devices in absolute harmony, removing human friction points and elevating collective capabilities.',
    },
    mission: {
      title: 'Our Absolute Directive',
      subtitle: 'To empower organizations around the globe to scale.',
      icon: <Target className="w-6 h-6 text-[#4C8DFF]" />,
      body: 'Our daily mission is simple but uncompromising: AiraSpark Technologies develops innovative software, artificial intelligence, IoT, cloud, and digital solutions that help businesses transform and grow. We take products from scratch by moving through discovery, architecture, prototyping, validation, iteration, and release, so ideas become reliable systems that can ship, scale, and evolve in the real world. We dedicate our engineering horsepower to transforming the world’s most intricate computational problems into streamlined, robust, high-performance engines, ensuring our clients achieve long-term technological preeminence.',
    },
  };

  return (
    <section id="about" className="relative py-28 bg-[#0B1220]">
      {/* Visual background divider or grid */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4C8DFF]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4C8DFF]/20 to-transparent" />

      {/* Cyber Grid element */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      {/* Side Glow Orbs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 rounded-full radial-glow opacity-30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Vision Header & Interactive Tabs Control */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Top Tagline */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-px bg-[#4C8DFF]" />
              <p className="text-xs font-mono uppercase tracking-widest text-[#4C8DFF] font-bold">Behind AiraSpark</p>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-5xl font-bold font-display uppercase tracking-tight text-white leading-tight">
              Igniting Ideation.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4C8DFF] to-white">
                Shattering Boundaries.
              </span>
            </h2>

            <p className="mt-6 text-[#AAB7C4] text-base leading-relaxed tracking-wide font-light">
              We are not just a technological partner. We are an advanced engineering workspace that crafts robust, production-validated solutions from abstract enterprise complexities.
            </p>

            {/* Tab Selectors */}
            <div className="mt-10 flex flex-col gap-3">
              {(Object.keys(tabsContent) as TabId[]).map((tabId) => (
                <button
                  key={tabId}
                  onClick={() => setActiveTab(tabId)}
                  className={`w-full text-left px-6 py-4 rounded-xl flex items-center justify-between border transition-all duration-300 relative group cursor-pointer ${
                    activeTab === tabId
                      ? 'bg-[#15233A] border-[#4C8DFF]/40 text-white shadow-[0_0_20px_rgba(76,141,255,0.1)]'
                      : 'bg-transparent border-white/5 text-[#A7B0C0] hover:text-white hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      activeTab === tabId ? 'bg-[#4C8DFF] scale-125' : 'bg-[#A7B0C0]/30'
                    }`} />
                    <span className="font-display font-medium text-sm sm:text-base capitalize tracking-wide">{tabId} Statement</span>
                  </div>
                  {activeTab === tabId && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="text-[#4C8DFF]"
                    >
                      {tabsContent[tabId].icon}
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Sliding Content Panel & Abstract Logo Representation */}
          <div className="lg:col-span-7">
            <div className="glass-panel cyber-border-tl cyber-border-br rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-[0_15px_40px_rgba(2,8,19,0.5)]">
              {/* Overlay visual accent */}
              <div className="absolute top-0 right-0 w-44 h-44 rounded-full radial-glow opacity-30 select-none pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col h-full min-h-[300px] justify-between"
                >
                  <div>
                    {/* Header Details */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-[#4C8DFF]/10 border border-[#4C8DFF]/30 flex items-center justify-center shrink-0">
                        {tabsContent[activeTab].icon}
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-wide uppercase">
                          {tabsContent[activeTab].title}
                        </h3>
                        <p className="text-xs font-mono text-[#4C8DFF] tracking-widest uppercase mt-0.5">
                          {tabsContent[activeTab].subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Main Description */}
                    <div className="text-base text-[#AAB7C4] leading-relaxed tracking-wide font-light">
                      <p className="whitespace-pre-line">{tabsContent[activeTab].body}</p>
                    </div>
                  </div>

                  {/* Micro Metric Banner */}
                  <div className="mt-8 pt-8 border-t border-white/5 flex flex-wrap gap-x-8 gap-y-4">
                    <div>
                      <span className="text-[#4C8DFF] font-mono text-xs block font-bold">ACCELERATOR</span>
                      <span className="text-white text-sm font-semibold">Dynamic Growth Model</span>
                    </div>
                    <div>
                      <span className="text-[#4C8DFF] font-mono text-xs block font-bold">COMPLIANCE</span>
                      <span className="text-white text-sm font-semibold">ISO Grade Standards</span>
                    </div>
                    <div>
                      <span className="text-[#4C8DFF] font-mono text-xs block font-bold">INTEGRATIONS</span>
                      <span className="text-white text-sm font-semibold">Multi-Protocol Ecosystem</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
