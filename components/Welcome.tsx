'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function Welcome() {
  return (
    <section id="about" className="py-32 relative bg-brand-black overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="aspect-[4/5] relative rounded-[2rem] overflow-hidden border border-white/10 bg-gradient-to-br from-brand/25 via-white/5 to-black flex items-center justify-center">
              <div className="w-28 h-28 rounded-2xl overflow-hidden border border-brand/20 relative">
                <Image src="/logo.jpeg" alt="Born Of God Ministries" fill className="object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            
            {/* Decorative Glass Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute -bottom-8 -right-8 md:-right-12 p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl max-w-[240px]"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-3 h-3 rounded-full bg-brand" />
                <span className="text-sm font-medium text-white">Sunday Service</span>
              </div>
              <p className="text-sm text-white/70 font-light">Join us this weekend for an encounter with God&apos;s presence.</p>
            </motion.div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center"
          >
            <span className="text-sm font-medium text-white/50 tracking-[0.2em] uppercase mb-4">
              Welcome to our family
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white tracking-tight leading-tight mb-8">
              A House of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/90 to-white/40">
                Faith & Love.
              </span>
            </h2>
            
            <div className="space-y-6 text-lg text-white/60 font-light">
              <p>
                Born Of God Ministries was founded with a divine mandate to raise a generation that truly knows their identity in Christ. We are more than just a church; we are a global family committed to excellence, love, and spiritual maturity.
              </p>
              <p>
                Legally registered as a Ministry in Kenya, Africa, our roots are deep, but our branches reach across the world. From teaching hundreds of Pastors to establishing over 100 churches globally, our mission is unwavering.
              </p>
            </div>

            <div className="mt-12">
              <Button variant="outline" className="rounded-full h-12 px-6 bg-white/5 border-white/10 text-white hover:bg-brand/10 hover:border-brand/50 hover:text-brand backdrop-blur-md text-base transition-all group">
                Learn More About Our Mission
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
