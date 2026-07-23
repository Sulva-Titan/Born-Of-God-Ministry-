import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { GlobalImpact } from '@/components/Stats';
import { Welcome } from '@/components/Welcome';
import { Sermons } from '@/components/Sermons';
import { Ministries } from '@/components/Ministries';
import { Events } from '@/components/Events';
import { Testimonials } from '@/components/Testimonials';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Born Of God Ministries | Raising a Generation',
  description: 'Born Of God Ministries is a global family teaching hundreds of Pastors and transforming lives. Over 100 churches worldwide.',
  openGraph: {
    title: 'Born Of God Ministries',
    description: 'Raising a Generation Born of God. Equipping pastors globally and transforming lives through Christ.',
    url: 'https://bornofgodministries.org',
    siteName: 'Born Of God Ministries',
    images: [
      {
        url: '/logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'Born Of God Ministries Global Impact',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Born Of God Ministries',
    description: 'Raising a Generation Born of God.',
    images: ['/logo.jpeg'],
  },
  alternates: {
    canonical: 'https://bornofgodministries.org',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Church',
  name: 'Born Of God Ministries',
  url: 'https://bornofgodministries.org',
  logo: 'https://bornofgodministries.org/logo.jpeg',
  description: 'Raising a Generation Born of God. Over 100 churches worldwide teaching hundreds of Pastors globally.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nairobi',
    addressCountry: 'KE',
  },
  email: 'bornofgodministries@gmail.com',
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-black selection:bg-white/20 selection:text-white">
        <Navbar />
        <Hero />
        <GlobalImpact />
        <Welcome />
        <Sermons />
        <Ministries />
        <Events />
        <Testimonials />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
