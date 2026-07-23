import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service | Born Of God Ministries',
  description: 'The terms governing your use of the Born Of God Ministries website.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black selection:bg-white/20 selection:text-white">
      <Navbar />
      <section className="pt-40 pb-24 bg-brand-black">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 prose prose-invert prose-headings:font-heading">
          <h1>Terms of Service</h1>
          <p className="text-white/50">Last updated: {new Date().getFullYear()}</p>

          <p>
            By accessing and using the Born Of God Ministries website, you agree to these terms.
            If you do not agree, please do not use the site.
          </p>

          <h2>Use of the site</h2>
          <p>
            You may use this website for lawful, personal, and non-commercial purposes. You agree
            not to misuse the site, attempt to gain unauthorised access, or disrupt its operation.
          </p>

          <h2>Content and resources</h2>
          <p>
            Books, sermons, and other resources are provided for personal spiritual growth. Unless
            stated otherwise, content remains the property of Born Of God Ministries and may not be
            resold or redistributed for commercial gain.
          </p>

          <h2>User submissions</h2>
          <p>
            Prayer requests, newsletter sign-ups, and other information you submit must be accurate
            and your own. We handle submissions in line with our{' '}
            <a href="/privacy">Privacy Policy</a>.
          </p>

          <h2>Disclaimer</h2>
          <p>
            The website is provided &ldquo;as is&rdquo; without warranties of any kind. We are not
            liable for any loss arising from your use of the site.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms? Email{' '}
            <a href="mailto:bornofgodministries@gmail.com">bornofgodministries@gmail.com</a>.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
