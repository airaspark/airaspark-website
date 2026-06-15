import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Globe, MapPin, Send, CheckCircle2, ShieldCheck, Terminal, AlertCircle } from 'lucide-react';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'transmitting' | 'success' | 'error'>('idle');
  const [progressLog, setProgressLog] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const simulateHandshake = async () => {
    setProgressLog([]);
    const logs = [
      'Establishing TLS tunnel...',
      'Validating form inputs...',
      'Establishing GCM AES-256 cipher pipeline...',
      'Syncing with database partition...',
      'Transmitting client message packet...',
      'Handshake complete. Message saved!'
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgressLog(prev => [...prev, logs[i]]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      setStatus('error');
      return;
    }

    setStatus('transmitting');
    await simulateHandshake();
    setStatus('success');
    setFormState({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="relative py-28 bg-[#020813]">
      {/* Background artifacts */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00AEEF]/20 to-transparent" />
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full radial-glow-heavy opacity-15 blur-3xl pointer-events-none animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00AEEF]/5 border border-[#00AEEF]/20 text-xs font-mono uppercase tracking-widest text-[#00AEEF] mb-4">
            <Send className="w-3.5 h-3.5" />
            Connect Pipeline
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold font-display uppercase tracking-tight text-white leading-none">
            Enlist Your Project
          </h2>
          <p className="mt-4 text-[#AAB7C4] text-base font-light tracking-wide max-w-xl mx-auto">
            Ignite our collaborative engineering processes. Submit your specifications to establish a cloud development portal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Location & Contact Cards */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-center">
            
            {/* Location Card */}
            <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group border border-white/5 cyber-border-tl">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full radial-glow opacity-30 pointer-events-none" />
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-[#00AEEF]/10 border border-[#00AEEF]/20 flex items-center justify-center shrink-0 text-[#00AEEF]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#00AEEF]/60 block uppercase">HEADQUARTERS</span>
                  <h3 className="text-xl font-bold font-display text-white uppercase tracking-wide mt-0.5">India</h3>
                  <p className="text-xs text-[#AAB7C4] mt-2 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00AEEF] animate-ping" />
                    LATENCY RATE: 12ms // ASIA-EAST
                  </p>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group border border-white/5">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full radial-glow opacity-30 pointer-events-none" />
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-[#00AEEF]/10 border border-[#00AEEF]/20 flex items-center justify-center shrink-0 text-[#00AEEF]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#00AEEF]/60 block uppercase">DIRECT EMAIL</span>
                  <a href="mailto:contact@airaspark.com" className="text-lg font-bold font-display text-white hover:text-[#00AEEF] transition-colors uppercase tracking-wide mt-0.5 block">
                    contact@airaspark.com
                  </a>
                  <p className="text-xs text-[#AAB7C4] mt-2 font-mono">
                    TYPICAL HANDSHAKE TIME: &lt; 2 HOURS
                  </p>
                </div>
              </div>
            </div>

            {/* Website Card */}
            <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group border border-white/5 cyber-border-br">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full radial-glow opacity-30 pointer-events-none" />
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-[#00AEEF]/10 border border-[#00AEEF]/20 flex items-center justify-center shrink-0 text-[#00AEEF]">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#00AEEF]/60 block uppercase">SATELLITE DOMAIN</span>
                  <a href="https://www.airaspark.com" target="_blank" rel="noopener noreferrer" className="text-lg font-bold font-display text-white hover:text-[#00AEEF] transition-colors uppercase tracking-wide mt-0.5 block">
                    www.airaspark.com
                  </a>
                  <p className="text-xs text-[#AAB7C4] mt-2 font-mono">
                    SECURED UNDER SSL-V3 CERTIFICATES
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Form Block */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-2xl p-8 sm:p-10 relative overflow-hidden shadow-[0_15px_40px_rgba(2,8,19,0.5)] border border-white/5 cyber-border-tl cyber-border-br">
              
              <AnimatePresence mode="wait">
                {status === 'idle' || status === 'error' ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    {status === 'error' && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-sm font-light">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>Please complete all fields prior to sending packet request.</span>
                      </div>
                    )}

                    {/* Form Fields */}
                    <div className="space-y-4">
                      {/* Name Field */}
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="text-xs font-mono text-white/50 uppercase tracking-widest block font-medium">
                          Identity / Full Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          value={formState.name}
                          onChange={handleInputChange}
                          placeholder="Your Name"
                          className="w-full px-5 py-3.5 rounded-xl bg-[#020813] border border-white/10 hover:border-white/20 focus:border-[#00AEEF] text-white text-sm tracking-wide font-light placeholder:text-neutral-500 outline-none transition-all"
                          required
                        />
                      </div>

                      {/* Email Field */}
                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-xs font-mono text-white/50 uppercase tracking-widest block font-medium">
                          Communication Mesh / Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={formState.email}
                          onChange={handleInputChange}
                          placeholder="your.email@domain.com"
                          className="w-full px-5 py-3.5 rounded-xl bg-[#020813] border border-white/10 hover:border-white/20 focus:border-[#00AEEF] text-white text-sm tracking-wide font-light placeholder:text-neutral-500 outline-none transition-all"
                          required
                        />
                      </div>

                      {/* Message Field */}
                      <div className="space-y-1.5">
                        <label htmlFor="message" className="text-xs font-mono text-white/50 uppercase tracking-widest block font-medium">
                          Specifications / Body Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formState.message}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Tell us about your project..."
                          className="w-full px-5 py-3.5 rounded-xl bg-[#020813] border border-white/10 hover:border-white/20 focus:border-[#00AEEF] text-white text-sm tracking-wide font-light placeholder:text-neutral-500 outline-none transition-all resize-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-[#00AEEF] text-[#07111F] font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,174,239,0.2)] hover:shadow-[0_0_30px_rgba(0,174,239,0.5)] transform hover:-translate-y-0.5 hover:scale-[1.01] transition-all duration-300 font-display cursor-pointer"
                    >
                      Transmit Packet
                      <Send className="w-4 h-4" />
                    </button>
                  </motion.form>
                ) : status === 'transmitting' ? (
                  <motion.div
                    key="transmitting"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6 flex flex-col justify-between min-h-[350px] font-mono"
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <Terminal className="w-5 h-5 text-[#00AEEF] animate-pulse" />
                      <span className="text-xs font-bold text-[#00AEEF] uppercase tracking-widest">
                        AIRASPARK TRANSPORTER TERMINAL v1.02
                      </span>
                    </div>

                    {/* Loader Graphic */}
                    <div className="flex flex-col items-center justify-center py-6 space-y-4 select-none">
                      <div className="relative w-16 h-16 rounded-full flex items-center justify-center border border-[#00AEEF]/20">
                        <div className="absolute inset-0 rounded-full border-t-2 border-[#00AEEF] animate-spin" />
                        <Send className="w-6 h-6 text-[#00AEEF] animate-pulse" />
                      </div>
                      <span className="text-xs text-white uppercase tracking-wider animate-pulse pt-2">Transmitting Core Packets</span>
                    </div>

                    {/* Log Terminal readout lines */}
                    <div className="p-4 rounded-xl bg-[#020813] border border-white/5 flex flex-col gap-1.5 text-[10px] text-[#AAB7C4]/70">
                      {progressLog.map((log, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="text-neutral-600">[{i+1}]</span>
                          <span className={i === progressLog.length - 1 ? 'text-[#00AEEF] font-bold' : ''}>
                            {log}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10 space-y-6 flex flex-col items-center justify-center min-h-[350px]"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#00AEEF]/10 border border-[#00AEEF]/40 flex items-center justify-center shadow-[0_0_20px_rgba(0,174,239,0.2)]">
                      <ShieldCheck className="w-8 h-8 text-[#00AEEF]" />
                    </div>

                    <div className="space-y-2 max-w-sm">
                      <h3 className="text-2xl font-bold font-display text-white uppercase tracking-tight">Packet Connected</h3>
                      <p className="text-sm text-[#AAB7C4] leading-relaxed font-light">
                        Handshake validated! Your project specifications have been parsed and securely aligned with our communications cluster.
                      </p>
                    </div>

                    <button
                      onClick={() => setStatus('idle')}
                      className="px-6 py-2.5 rounded-full border border-[#00AEEF]/30 text-xs font-mono uppercase tracking-widest text-[#00AEEF] hover:bg-[#00AEEF]/10 transition-colors cursor-pointer"
                    >
                      &lt; Back To Form / Initiate New Connection &gt;
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
