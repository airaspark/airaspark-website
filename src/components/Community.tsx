import { motion } from 'motion/react';
import { Users, Zap, Terminal, Sparkles } from 'lucide-react';

export default function Community() {
  return (
    <section id="community" className="relative py-20 sm:py-28 bg-[#0B1220] overflow-hidden border-t border-white/5">
       {/* Background Glow */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4C8DFF]/10 rounded-full blur-[120px] pointer-events-none" />
       
       <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
         <motion.div 
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: '-100px' }}
           transition={{ duration: 0.6, ease: 'easeOut' }}
           className="glass-panel rounded-3xl p-8 sm:p-14 border border-[#4C8DFF]/20 bg-[#0B1E36]/40 text-center relative overflow-hidden backdrop-blur-xl"
         >
           {/* Cyber Grid Overlay */}
           <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none mix-blend-overlay" />

           <div className="relative z-10 flex flex-col items-center">
             {/* Icon */}
             <div className="w-20 h-20 rounded-2xl bg-[#4C8DFF]/10 border border-[#4C8DFF]/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(76,141,255,0.15)] group-hover:shadow-[0_0_40px_rgba(76,141,255,0.3)] transition-shadow">
               <Sparkles className="w-10 h-10 text-[#4C8DFF]" />
             </div>

             <h2 className="text-3xl sm:text-5xl font-bold font-display uppercase tracking-tight text-white mb-4">
               Join the Core <span className="text-[#4C8DFF]">Network</span>
             </h2>
             <p className="text-[#AAB7C4] text-base sm:text-lg max-w-2xl font-light tracking-wide mb-10">
               Connect directly with the AiraSpark engineering team. Discuss agentic architectures, get early access to beta protocols, and collaborate with forward-thinking developers in our exclusive community.
             </p>

             {/* Features/Stats */}
             <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-10">
               <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1220]/50 border border-[#4C8DFF]/20">
                 <Terminal className="w-4 h-4 text-[#4C8DFF]" />
                 <span className="text-xs sm:text-sm font-mono text-[#AAB7C4]">Dev Support</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1220]/50 border border-[#4C8DFF]/20">
                 <Zap className="w-4 h-4 text-[#4C8DFF]" />
                 <span className="text-xs sm:text-sm font-mono text-[#AAB7C4]">Beta Access</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1220]/50 border border-[#4C8DFF]/20">
                 <Users className="w-4 h-4 text-[#4C8DFF]" />
                 <span className="text-xs sm:text-sm font-mono text-[#AAB7C4]">Global Comm</span>
               </div>
             </div>
           </div>
         </motion.div>
       </div>
    </section>
  );
}
