import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CTA } from '@/components/CTA';
import { AboutHero } from '@/components/about/AboutHero';
import { WhoWeAre } from '@/components/about/WhoWeAre';
import { JourneyTimeline } from '@/components/about/JourneyTimeline';
import { Mission } from '@/components/about/Mission';
import { Vision } from '@/components/about/Vision';
import { CoreValues } from '@/components/about/CoreValues';
import { AboutStats } from '@/components/about/AboutStats';
import { Leadership } from '@/components/about/Leadership';
import { WhyChooseUs } from '@/components/about/WhyChooseUs';

export const metadata: Metadata = {
  title: 'About Us | Born Of God Ministries',
  description: 'Learn about Born Of God Ministries. We are a legally registered Christian ministry in Kenya, Africa, with over 100 churches across the world.',
  openGraph: {
    title: 'About Born Of God Ministries',
    description: 'Learn about Born Of God Ministries. We are a legally registered Christian ministry in Kenya, Africa, with over 100 churches across the world.',
    url: 'https://bornofgodministries.org/about',
    siteName: 'Born Of God Ministries',
    images: [
      {
        url: '/logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'About Born Of God Ministries',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Born Of God Ministries',
    description: 'Our Story, Mission, and Global Impact.',
    images: ['/logo.jpeg'],
  },
  alternates: {
    canonical: 'https://bornofgodministries.org/about',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://bornofgodministries.org/about'
  },
  headline: 'Our Story - Born Of God Ministries',
  description: 'Born Of God Ministries is a legally registered Christian ministry in Kenya, Africa, with over 100 churches across the world.',
  publisher: {
    '@type': 'Organization',
    name: 'Born Of God Ministries',
    logo: {
      '@type': 'ImageObject',
      url: 'https://bornofgodministries.org/logo.jpeg'
    }
  }
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-black selection:bg-white/20 selection:text-white">
        <Navbar />
        <AboutHero />
        <WhoWeAre />
        <JourneyTimeline />
        <Mission />
        <Vision />
        <CoreValues />
        <AboutStats />
        <Leadership />
        <WhyChooseUs />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
