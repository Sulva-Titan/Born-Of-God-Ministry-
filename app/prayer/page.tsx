import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PrayerForm } from '@/components/PrayerForm';

export const metadata: Metadata = {
  title: 'Prayer Requests | Born Of God Ministries',
  description: 'Submit a prayer request and let our global prayer team stand with you in faith.',
  alternates: { canonical: '/prayer' },
};

export default function PrayerPage() {
  return (
    <main className="min-h-screen bg-black selection:bg-white/20 selection:text-white">
      <Navbar />
      <section className="pt-40 pb-24 relative bg-brand-black">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight mb-4">
              Request Prayer
            </h1>
            <p className="text-lg text-white/60 font-light">
              &ldquo;The prayer of a righteous person is powerful and effective.&rdquo; Share your
              need and our team will pray with you.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-xl">
            <PrayerForm />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
