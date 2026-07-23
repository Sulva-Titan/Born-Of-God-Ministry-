import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Heart, Gift, Globe2, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Give | Born Of God Ministries',
  description: 'Partner with Born Of God Ministries through your generous giving and help transform lives across the nations.',
  alternates: { canonical: '/give' },
};

const ways = [
  { icon: Heart, title: 'Tithes & Offerings', desc: 'Honour God and support the ongoing work of the local church family.' },
  { icon: Globe2, title: 'Missions & Church Planting', desc: 'Help us equip pastors and plant churches across the nations.' },
  { icon: Gift, title: 'Partnership', desc: 'Become a monthly partner and sow consistently into the vision.' },
];

export default function GivePage() {
  return (
    <main className="min-h-screen bg-black selection:bg-white/20 selection:text-white">
      <Navbar />
      <section className="pt-40 pb-24 relative bg-brand-black">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white tracking-tight mb-6">
              Give
            </h1>
            <p className="text-lg text-white/60 font-light max-w-2xl mx-auto">
              &ldquo;Each of you should give what you have decided in your heart to give, for God
              loves a cheerful giver.&rdquo; Your generosity helps us reach and equip a generation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {ways.map((w) => (
              <div key={w.title} className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-6">
                  <w.icon className="w-6 h-6 text-brand" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-white mb-2">{w.title}</h3>
                <p className="text-sm text-white/60 font-light">{w.desc}</p>
              </div>
            ))}
          </div>

          {/*
            TODO (church admin): add your real giving methods here — e.g. an
            embedded giving platform link (Tithe.ly, Givelify, PayPal, M-Pesa
            Paybill/Till, or bank transfer details). Do not commit real account
            numbers to source control if this repo is public.
          */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-heading font-bold text-white mb-3">Ready to give?</h2>
            <p className="text-white/60 font-light mb-8">
              Contact us for our current giving channels and partnership details.
            </p>
            <a
              href="mailto:bornofgodministries@gmail.com?subject=Giving%20%26%20Partnership"
              className="inline-flex items-center gap-2 rounded-full h-14 px-8 bg-brand text-brand-charcoal hover:bg-brand-light text-base font-medium transition-colors"
            >
              <Mail className="w-5 h-5" />
              bornofgodministries@gmail.com
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
