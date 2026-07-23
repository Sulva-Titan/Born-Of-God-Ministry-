'use client';

import { motion } from 'motion/react';

export function AboutHero() {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-[#141008] to-black" />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-brand-black/60 bg-gradient-to-t from-brand-black via-brand-black/40 to-brand-black/80" />
      </div>

      {/* Floating Light */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand/20 rounded-full blur-[150px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-8 flex flex-col items-center text-center mt-20">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white tracking-tighter leading-[1.1]"
        >
          Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">Story</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 text-lg md:text-xl text-white/70 max-w-2xl font-light leading-relaxed"
        >
          We are a global family with a divine mandate to raise believers who understand their identity in Christ and transform nations through the Gospel.
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-brand/40 uppercase tracking-widest font-medium">Discover</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-8 h-12 rounded-full border border-brand/20 flex items-start justify-center p-2 backdrop-blur-sm"
        >
          <motion.div
            animate={{ height: ["20%", "40%", "20%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 rounded-full bg-brand/60"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
