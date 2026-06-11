import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Shield, Zap, RefreshCw } from 'lucide-react';

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.size = Math.random() * 2.2 + 0.8;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.color = '#4C8DFF';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw(context: CanvasRenderingContext2D) {
        context.save();
        context.globalAlpha = this.alpha;
        context.fillStyle = this.color;
        context.shadowColor = '#4C8DFF';
        context.shadowBlur = 8;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    }

    const particles: Particle[] = Array.from({ length: 85 }, () => new Particle());

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Radial background effect
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      gradient.addColorStop(0, '#0a1d35');
      gradient.addColorStop(0.5, '#0B1220');
      gradient.addColorStop(1, '#09111D');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw connections
      ctx.strokeStyle = 'rgba(0, 174, 239, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="hero" className="relative min-h-[100svh] flex items-center justify-center pt-20 sm:pt-24 overflow-hidden select-none">
      {/* Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Grid Layer */}
      <div className="absolute inset-0 cyber-grid opacity-30 z-1 pointer-events-none" />
      <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />

      {/* High-tech Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full radial-glow opacity-50 blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full radial-glow-heavy opacity-30 blur-3xl pointer-events-none animate-pulse-slow" />

      {/* Decorative High-Tech Side Indicator Frames */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-6 z-10 text-[10px] tracking-widest font-mono text-[#A7B0C0]/40 uppercase rotate-180 [writing-mode:vertical-lr]">
        <span>AIRASPARK TECHNOLOGIES</span>
        <div className="w-px h-16 bg-gradient-to-t from-[#4C8DFF]/40 to-transparent" />
      </div>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-6 z-10 text-[10px] tracking-widest font-mono text-[#A7B0C0]/40 uppercase [writing-mode:vertical-lr]">
        <span>INNOVATION • AI • IoT</span>
        <div className="w-px h-16 bg-gradient-to-b from-[#4C8DFF]/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center mt-4 sm:mt-6">
        {/* Futuristic Top Badge Styled from Sleek Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] sm:text-[10px] text-[#4C8DFF] font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] mb-6 sm:mb-10 w-fit"
        >
          <span className="flex h-2 w-2 rounded-full bg-[#4C8DFF] animate-pulse"></span>
          Igniting Innovation. Powering The Future.
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white font-display uppercase leading-none drop-shadow-[0_2px_15px_rgba(0,0,0,0.4)]"
        >
          AiraSpark<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4C8DFF] via-[#A7B0C0] to-white relative">
            Technologies
            {/* Visual Underline Pulse */}
            <span className="absolute bottom-1 sm:bottom-3 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#4C8DFF] to-transparent shadow-[0_1px_10px_rgba(76,141,255,0.6)]" />
          </span>
        </motion.h1>

        {/* Short Mission Hook */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-6 sm:mt-8 text-sm sm:text-xl text-[#AAB7C4] max-w-2xl mx-auto font-light leading-relaxed tracking-wide"
        >
          We engineer enterprise software, artificial intelligence, IoT frameworks, cloud systems, and elite digital ecosystems that help forward-thinking businesses redefine their vertical bounds.
        </motion.p>

        {/* CTA Actions and Theme Avatars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 sm:mt-12 flex flex-col md:flex-row items-center justify-center gap-5 sm:gap-8"
        >
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 w-full sm:w-auto">
            <button
              onClick={(e) => handleScrollTo(e, 'solutions')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white hover:bg-[#4C8DFF] text-[#0B1220] hover:text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all duration-300 font-display text-sm cursor-pointer shadow-lg hover:shadow-[#4C8DFF]/20"
            >
              Explore Solutions
              <ArrowRight className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={(e) => handleScrollTo(e, 'contact')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl glass-panel text-white hover:text-[#4C8DFF] border border-white/10 hover:border-[#4C8DFF]/50 transform hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-300 font-display text-sm uppercase tracking-wider font-semibold cursor-pointer"
            >
              Contact Us
            </button>
          </div>

          {/* Signature Avatar Overlaps */}
          <div className="flex flex-wrap justify-center -space-x-2 sm:-space-x-3 items-center gap-y-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#0B1220] bg-[#15233A] flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-white shadow-md">AI</div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#0B1220] bg-[#1A2740] flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-white shadow-md">IoT</div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#0B1220] bg-[#4C8DFF] text-[#0B1220] flex items-center justify-center text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-md">5K+</div>
            <span className="w-full sm:w-auto text-[10px] sm:text-xs text-[#A7B0C0] font-mono sm:ml-3 font-medium uppercase tracking-wider text-center sm:text-left">Trusted Nodes</span>
          </div>
        </motion.div>

        {/* Micro Tech Specs / Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="mt-14 sm:mt-20 pt-8 sm:pt-10 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto text-left"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-[#4C8DFF]/10 border border-[#4C8DFF]/20 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-[#4C8DFF]" />
            </div>
            <div>
              <p className="text-xs font-mono text-[#A7B0C0] uppercase">Operations speed</p>
              <h4 className="text-base sm:text-lg font-bold font-display text-white mt-0.5">Ultra-Low Latency</h4>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-[#4C8DFF]/10 border border-[#4C8DFF]/20 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-[#4C8DFF]" />
            </div>
            <div>
              <p className="text-xs font-mono text-[#A7B0C0] uppercase">Corporate safety</p>
              <h4 className="text-base sm:text-lg font-bold font-display text-white mt-0.5">Military Security</h4>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-[#4C8DFF]/10 border border-[#4C8DFF]/20 flex items-center justify-center shrink-0">
              <RefreshCw className="w-4 h-4 text-[#4C8DFF] animate-spin-slow" />
            </div>
            <div>
              <p className="text-xs font-mono text-[#A7B0C0] uppercase">Global scalability</p>
              <h4 className="text-base sm:text-lg font-bold font-display text-white mt-0.5">Cloud Scalable</h4>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-[#4C8DFF]/10 border border-[#4C8DFF]/20 flex items-center justify-center shrink-0">
              <span className="text-[#4C8DFF] font-mono text-xs font-bold">AI</span>
            </div>
            <div>
              <p className="text-xs font-mono text-[#A7B0C0] uppercase">Integration model</p>
              <h4 className="text-base sm:text-lg font-bold font-display text-white mt-0.5">Custom AI Models</h4>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
