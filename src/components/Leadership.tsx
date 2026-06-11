import { motion } from 'motion/react';
import { Leader } from '../types';
import { Users, Mail, Compass, Star, Code, Shield, Network, Megaphone } from 'lucide-react';
import ceoImg from '../assets/ceo.jpg';
import cooImg from '../assets/coo.jpg';
import ctoImg from '../assets/cto.jpg';
import cioImg from '../assets/cio.jpg';
import cmoImg from '../assets/cmo.jpg';

export default function Leadership() {
  const leaders: Leader[] = [
   
    {
      id: 'Shreyank',
      name: 'Shreyank Minchu P',
      role: 'Chief Executive Officer (CEO)',
       image: ceoImg,
      bio: 'Mastermind of global enterprise vision, aligning sovereign technology development with international growth vectors.',
      avatarSeed: 'CEO',
      socials: { linkedin: '#', twitter: '#' }
    },
     {
      id: 'syed',
      name: 'Syed Mahtab M',
      role: 'Chief Marketing Officer (CMO)',
      image: cmoImg,
      bio: 'Directing worldwide product outreach, strategic brand positioning, and enterprise solution discovery.',
      avatarSeed: 'CMO',
      socials: { linkedin: '#', twitter: '#' }
    },
    {
      id: 'veeresh',
      name: 'Veeresh',
      role: 'Chief Operating Officer (COO)',
      image: cooImg,
      bio: 'Streamlining cross-functional operations, global client relationships, and high-velocity project execution pipelines.',
      avatarSeed: 'COO',
      socials: { linkedin: '#', twitter: '#' }
    },
    {
      id: 'naveen',
      name: 'Naveen L D',
      role: 'Chief Technology Officer (CTO)',
      image: ctoImg,
      bio: 'Chief engineer of high-end cloud systems, custom deep learning models, and complex firmware kernels.',
      avatarSeed: 'CTO',
      socials: { linkedin: '#', github: '#' }
    },
    {
      id: 'shrinath',
      name: 'Shrinath Pol',
      role: 'Chief Information Officer (CIO)',
      image: cioImg,
      bio: 'Leading enterprise information systems, infrastructure governance, and digital transformation initiatives.',
      avatarSeed: 'CIO',
      socials: { linkedin: '#', github: '#' }
    },
    
  ];

  // Helper to generate abstract profile SVGs matching the leadership positions
  const renderAvatarPlaceholder = (seed: string) => {
    let accentGradient = 'from-[#00AEEF] to-white';
    let centerIcon = <Star className="w-6 h-6 text-[#00AEEF] relative z-10" />;

    if (seed === 'CEO') {
      accentGradient = 'from-[#00AEEF] via-white to-[#00AEEF]';
      centerIcon = <Compass className="w-6 h-6 text-[#00AEEF] relative z-10" />;
    } else if (seed === 'COO') {
      accentGradient = 'from-[#00AEEF] to-[#AAB7C4]';
      centerIcon = <Network className="w-6 h-6 text-[#00AEEF] relative z-10" />;
    } else if (seed === 'CTO') {
      accentGradient = 'from-[#00AEEF] to-blue-300';
      centerIcon = <Code className="w-6 h-6 text-[#00AEEF] relative z-10" />;
    } else if (seed === 'CIO') {
      accentGradient = 'from-emerald-400 to-[#00AEEF]';
      centerIcon = <Shield className="w-6 h-6 text-[#00AEEF] relative z-10" />;
    } else if (seed === 'CMO') {
      accentGradient = 'from-[#00AEEF] to-pink-400';
      centerIcon = <Megaphone className="w-6 h-6 text-[#00AEEF] relative z-10" />;
    }

    return (
      <div className="relative w-32 h-32 mx-auto rounded-full flex items-center justify-center p-[2px] bg-gradient-to-tr from-[#00AEEF]/20 via-white/5 to-[#00AEEF]/20 group-hover:from-[#00AEEF]/60 group-hover:to-white/40 transition-all duration-300 overflow-hidden shadow-inner">
        {/* Decorative Radar Spinning Circle */}
        <div className="absolute inset-0 border border-[#00AEEF]/10 rounded-full animate-spin-slow pointer-events-none" />
        <div className="absolute inset-2 border border-dashed border-[#00AEEF]/15 rounded-full pointer-events-none" />
        
        {/* Gradient backing */}
        <div className="absolute inset-1 rounded-full bg-[#020813] flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0B1E36] to-[#07111F] flex items-center justify-center shadow-lg relative group-hover:scale-95 transition-transform duration-300">
            {centerIcon}
            
            {/* Soft inner blur ring */}
            <div className="absolute inset-0 rounded-full radial-glow opacity-60 pointer-events-none" />
            
            {/* Initials badge overlay */}
            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-[#020813] border border-[#00AEEF]/30 text-[8px] font-mono font-bold text-[#00AEEF]">
              {seed}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="leadership" className="relative py-28 bg-[#020813]">
      {/* Background visual artifacts */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full radial-glow-heavy opacity-15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full radial-glow opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00AEEF]/5 border border-[#00AEEF]/20 text-xs font-mono uppercase tracking-widest text-[#00AEEF] mb-4">
            <Users className="w-3.5 h-3.5" />
            Leadership Council
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold font-display uppercase tracking-tight text-white leading-none">
            The Executive Team
          </h2>
          <p className="mt-4 text-[#AAB7C4] text-base font-light tracking-wide max-w-xl mx-auto">
            Our visionary directors combining years of high-performance technical execution and global trade operations.
          </p>
        </div>

        {/* Leaders Grid (Centered & Balanced Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {leaders.map((leader, index) => {
            // Give CMO or the fifth card a centered grid position for desktop layouts if needed
            const isLastOnLarge = index === 4;
            return (
              <motion.div
                key={leader.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
                className={`glass-panel rounded-2xl p-8 flex flex-col justify-between text-center group border border-white/5 relative hover:border-[#00AEEF]/30 transition-all duration-300 shadow-md ${
                  isLastOnLarge ? 'lg:col-span-1 lg:col-start-2' : ''
                }`}
              >
                {/* Visual card glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#00AEEF]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />

                <div>
                  {/* Leader Photo */}
                  <div className="mb-6">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-[#00AEEF] shadow-lg"
                    />
                  </div>

                  {/* Name and Role */}
                  <h3 className="text-lg font-bold font-display text-white group-hover:text-[#00AEEF] transition-colors uppercase tracking-wide">
                    {leader.name}
                  </h3>
                  <p className="text-xs font-mono text-[#00AEEF] uppercase mt-1 tracking-widest font-semibold">
                    {leader.role}
                  </p>

                  {/* Biography */}
                  <p className="mt-4 text-[#AAB7C4] text-xs sm:text-sm leading-relaxed tracking-wide font-light max-w-xs mx-auto">
                    {leader.bio}
                  </p>
                </div>

                {/* Secure Communication Indicator */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                    SYSTEM INTEGRATED
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
