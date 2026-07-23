import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LibraryHero } from '@/components/library/LibraryHero';
import { FeaturedBooks } from '@/components/library/FeaturedBooks';
import { BookGrid } from '@/components/library/BookGrid';
import { Collections } from '@/components/library/Collections';
import { Authors } from '@/components/library/Authors';
import { LibraryNewsletter } from '@/components/library/Newsletter';

export const metadata: Metadata = {
  title: 'Digital Library | Born Of God Ministries',
  description: 'Download free Christian books, study materials, devotionals, and leadership resources from Born Of God Ministries.',
  openGraph: {
    title: 'Digital Library | Born Of God Ministries',
    description: 'Grow in your faith with our collection of free books and resources.',
    url: 'https://bornofgodministries.org/library',
    siteName: 'Born Of God Ministries',
    images: [
      {
        url: '/logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'Born Of God Ministries Digital Library',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Library | Born Of God Ministries',
    description: 'Download free Christian books and resources.',
    images: ['/logo.jpeg'],
  },
  alternates: {
    canonical: 'https://bornofgodministries.org/library',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://bornofgodministries.org/library'
  },
  headline: 'Digital Library - Born Of God Ministries',
  description: 'Download free Christian books, study materials, devotionals, and leadership resources.',
  publisher: {
    '@type': 'Organization',
    name: 'Born Of God Ministries',
    logo: {
      '@type': 'ImageObject',
      url: 'https://bornofgodministries.org/logo.jpeg'
    }
  }
};

export default function LibraryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-black selection:bg-white/20 selection:text-white">
        <Navbar />
        <LibraryHero />
        <FeaturedBooks />
        <Collections />
        <BookGrid />
        <Authors />
        <LibraryNewsletter />
        <Footer />
      </main>
    </>
  );
}
