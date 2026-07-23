'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export function WhoWeAre() {
  return (
    <section className="py-32 relative bg-brand-black overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="aspect-[4/5] relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-brand/25 via-white/5 to-black flex items-center justify-center">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-brand/20 relative">
                <Image src="/logo.jpeg" alt="Born Of God Ministries" fill className="object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-black/60 via-transparent to-white/10" />
            </div>
            
            <div className="absolute -inset-4 bg-white/5 rounded-[3rem] blur-2xl -z-10" />
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center"
          >
            <span className="text-sm font-medium text-white/50 tracking-[0.2em] uppercase mb-6">
              Who We Are
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight leading-tight mb-8">
              A Legally Registered <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
                Christian Ministry
              </span>
            </h2>
            
            <div className="space-y-6 text-lg text-white/60 font-light leading-relaxed">
              <p>
                Born Of God Ministries is deeply rooted in Kenya, Africa, but our branches span across the globe. We believe in the unadulterated teaching of God&apos;s Word, demonstrating His power, and living out His love.
              </p>
              <p>
                Our existence is fueled by a singular passion: to see lives totally transformed and awakened to the reality of their inheritance in Christ. We are more than an organization; we are a vibrant, breathing family of believers.
              </p>
              <p>
                From humble beginnings, our global vision has compelled us to establish over 40 thriving churches and equip hundreds of pastors to carry this torch of revival to the ends of the earth.
              </p>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
