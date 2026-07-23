'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { SearchBar } from './SearchBar';
import { ArrowDown } from 'lucide-react';

export function LibraryHero() {
  const scrollToBooks = () => {
    document.getElementById('library-books')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[85vh] w-full flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-[#141008] to-black" />
        {/* Soft Glass Overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[4px] bg-gradient-to-b from-black/80 via-black/50 to-black" />
      </div>

      {/* Floating Lights */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-soft/10 rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-8 flex flex-col items-center text-center mt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <span className="text-xs font-medium text-white/80 uppercase tracking-widest">Free Digital Resources</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white tracking-tighter leading-[1.1]"
        >
          Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">Library</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 text-lg md:text-xl text-white/70 max-w-2xl font-light leading-relaxed"
        >
          Grow in your faith through our collection of free books, discipleship resources, leadership manuals, devotionals, and biblical teachings.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
        >
          <Button onClick={scrollToBooks} size="lg" className="rounded-full h-14 px-8 bg-brand text-brand-charcoal hover:bg-brand-light text-base font-medium shadow-[0_4px_20px_rgba(244,196,0,0.3)] transition-all hover:scale-105">
            Browse Library
          </Button>
          <Button size="lg" variant="outline" className="rounded-full h-14 px-8 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-brand/50 hover:text-white backdrop-blur-md text-base font-medium transition-all hover:scale-105">
            Newest Books
          </Button>
        </motion.div>
      </div>

      {/* Search Bar positioned to overlap the next section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 w-full max-w-4xl px-6 mt-16 lg:mt-24"
      >
        <SearchBar />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <button onClick={scrollToBooks} className="text-brand/40 hover:text-brand transition-colors animate-bounce">
          <ArrowDown className="w-5 h-5" />
        </button>
      </motion.div>
    </section>
  );
}
