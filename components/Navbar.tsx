'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const links = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Sermons', href: '/#sermons' },
  { name: 'Ministries', href: '/#ministries' },
  { name: 'Events', href: '/#events' },
  { name: 'Leadership', href: '/about#leadership' },
  { name: 'Library', href: '/library' },
];

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-out border-b border-transparent',
        isScrolled
          ? 'py-3 bg-black/40 backdrop-blur-2xl border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]'
          : 'py-6 bg-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-brand/20 flex items-center justify-center backdrop-blur-md shadow-[0_4px_15px_rgba(244,196,0,0.2)] group-hover:shadow-[0_4px_25px_rgba(244,196,0,0.3)] group-hover:scale-105 transition-all duration-300 relative">
            <Image
              src="/logo.jpeg"
              alt="Born Of God Ministries Logo"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative text-sm font-medium transition-colors hover:text-brand",
                  isActive ? "text-brand" : "text-white/70"
                )}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/give" className="text-sm font-medium text-white/70 hover:text-brand transition-colors">
            Give
          </Link>
          <Button className="rounded-full bg-brand text-brand-charcoal hover:bg-brand-light font-medium px-6 shadow-[0_4px_20px_rgba(244,196,0,0.3)]">
            Watch Live
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-3xl border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl"
        >
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-lg font-medium text-white/80 hover:text-white p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-white/10 my-2" />
          <Link href="/give" className="text-lg font-medium text-white/80 hover:text-brand p-2">
            Give
          </Link>
          <Button className="w-full mt-2 rounded-full bg-brand text-brand-charcoal hover:bg-brand-light">
            Watch Live
          </Button>
        </motion.div>
      )}
    </motion.header>
  );
}
