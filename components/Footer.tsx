'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="bg-brand-black border-t border-brand/10 pt-20 pb-10 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-brand/5 rounded-t-full blur-[100px] pointer-events-none opacity-50" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-brand/20 flex items-center justify-center backdrop-blur-md relative">
                <Image
                  src="/logo.jpeg"
                  alt="Born Of God Ministries Logo"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </Link>
            <p className="text-sm text-white/60 font-light mb-8 max-w-sm leading-relaxed">
              Equipping pastors globally and transforming lives through the love and power of Christ. A generation Born of God.
            </p>
            
            <form suppressHydrationWarning className="flex flex-col sm:flex-row gap-2 max-w-sm" onSubmit={(e) => e.preventDefault()}>
              <input 
                suppressHydrationWarning
                type="email" 
                placeholder="Join our newsletter" 
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-brand/50 transition-colors backdrop-blur-md"
                required
              />
              <Button type="submit" className="rounded-full bg-brand text-brand-charcoal hover:bg-brand-light h-[46px] px-6 font-medium">
                Subscribe
              </Button>
            </form>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link href="/about" className="hover:text-brand transition-colors">About Us</Link></li>
              <li><Link href="/#sermons" className="hover:text-brand transition-colors">Sermons</Link></li>
              <li><Link href="/#ministries" className="hover:text-brand transition-colors">Ministries</Link></li>
              <li><Link href="/#events" className="hover:text-brand transition-colors">Events</Link></li>
              <li><Link href="/#give" className="hover:text-brand transition-colors">Give</Link></li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-white font-medium mb-6">Locations</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link href="#" className="hover:text-brand transition-colors">Kenya (HQ)</Link></li>
              <li><Link href="#" className="hover:text-brand transition-colors">United States</Link></li>
              <li><Link href="#" className="hover:text-brand transition-colors">United Kingdom</Link></li>
              <li><Link href="#" className="hover:text-brand transition-colors">South Africa</Link></li>
              <li><Link href="#" className="hover:text-brand transition-colors">View All 100+</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li>
                <a href="mailto:bornofgodministries@gmail.com" className="hover:text-brand transition-colors">
                  bornofgodministries@gmail.com
                </a>
              </li>
              <li>+254 700 000 000</li>
              <li className="pt-4 flex items-center gap-4">
                {/* Social Placeholders */}
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand/10 hover:border-brand/50 hover:text-brand group transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-4 h-4 text-white/70 group-hover:text-brand transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand/10 hover:border-brand/50 hover:text-brand group transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-4 h-4 text-white/70 group-hover:text-brand transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2.16c3.2,0,3.58,0,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85s0,3.58-.07,4.85c-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.64.07-4.85.07s-3.58,0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s0-3.58.07-4.85C2.38,3.92,3.9,2.38,7.15,2.23,8.42,2.18,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33,0,7.05.07c-4.27.2-6.78,2.71-7,7C0,8.33,0,8.74,0,12s0,3.67.07,4.95c.2,4.27,2.71,6.78,7,7C8.33,24,8.74,24,12,24s3.67,0,4.95-.07c4.27-.2,6.78-2.71,7-7C24,15.67,24,15.26,24,12s0-3.67-.07-4.95c-.2-4.27-2.71-6.78-7-7C15.67,0,15.26,0,12,0Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM18.4,4.16a1.44,1.44,0,1,0,1.44,1.44A1.44,1.44,0,0,0,18.4,4.16Z"/></svg>
                </a>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Born Of God Ministries. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-brand transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-brand transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
