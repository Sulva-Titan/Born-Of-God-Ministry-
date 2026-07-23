'use client';

import { motion } from 'motion/react';

export function Vision() {
  return (
    <section className="relative py-40 flex items-center justify-center overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#141008] via-brand-black to-black" />
        {/* Soft Glass Overlay */}
        <div className="absolute inset-0 bg-brand-black/60 backdrop-blur-[2px]" />
        {/* Gradient fades for seamless integration */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-black to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-brand-black to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-sm font-medium text-white/70 tracking-[0.2em] uppercase mb-8 block drop-shadow-sm">
            Our Vision
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold text-white tracking-tight leading-[1.1] drop-shadow-lg">
            A world saturated with the knowledge of God&apos;s glory, where every soul reflects the love and excellence of Christ.
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
