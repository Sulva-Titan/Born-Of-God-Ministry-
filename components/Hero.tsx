'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronDown, Play } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function Hero() {
  const [content, setContent] = useState({
    headline: 'Raising a Generation Born of God.',
    subheadline: 'Equipping pastors globally and transforming lives through the love and power of Christ.',
    imageUrl: ''
  });

  useEffect(() => {
    async function fetchHero() {
      const { data, error } = await supabase.from('homepage_content').select('*').eq('id', 1).maybeSingle();
      if (data && !error) {
        setContent({
          headline: data.hero_headline || 'Raising a Generation Born of God.',
          subheadline: data.hero_subheadline || 'Equipping pastors globally and transforming lives through the love and power of Christ.',
          imageUrl: data.hero_image_url || ''
        });
      }
    }
    fetchHero();
  }, []);

  // Split headline for styling
  const splitHeadline = content.headline.split('Born of God.');
  const firstPart = splitHeadline[0];

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {content.imageUrl ? (
          <Image
            src={content.imageUrl}
            alt="Worship background"
            fill
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-[#141008] to-black" />
        )}
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black via-black/40 to-black/80" />
      </div>

      {/* Floating Particles (Simplified via CSS/divs) */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-light/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand/20 rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center text-center pt-28 pb-36 lg:pt-24 lg:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
        >
          <span className="flex w-2 h-2 rounded-full bg-brand animate-pulse" />
          <span className="text-sm font-medium text-white/90 tracking-wide uppercase">Over 100 Churches Worldwide</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white tracking-tighter max-w-5xl leading-[1.1]"
        >
          {firstPart} <br className="hidden md:block" />
          {splitHeadline.length > 1 && (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
              Born of God.
            </span>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 text-lg md:text-xl text-white/70 max-w-2xl font-light"
        >
          {content.subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <Button size="lg" className="rounded-full h-14 px-8 bg-brand text-brand-charcoal hover:bg-brand-light text-base font-medium shadow-[0_4px_20px_rgba(244,196,0,0.3)] transition-all hover:scale-105 active:scale-95">
            Visit a Church
          </Button>
          <Button size="lg" variant="outline" className="rounded-full h-14 px-8 bg-white/5 border-white/10 text-white hover:bg-brand/10 hover:border-brand/50 hover:text-brand backdrop-blur-md text-base font-medium transition-all hover:scale-105 active:scale-95">
            <Play className="w-4 h-4 mr-2" />
            Watch Sermons
          </Button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-brand/40 uppercase tracking-widest font-medium">Scroll to explore</span>
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
