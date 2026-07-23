import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | Born Of God Ministries',
  description: 'How Born Of God Ministries collects, uses, and protects your personal information.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black selection:bg-white/20 selection:text-white">
      <Navbar />
      <section className="pt-40 pb-24 bg-brand-black">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 prose prose-invert prose-headings:font-heading">
          <h1>Privacy Policy</h1>
          <p className="text-white/50">Last updated: {new Date().getFullYear()}</p>

          <p>
            Born Of God Ministries (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is committed to protecting
            your privacy. This policy explains what information we collect and how we use it.
          </p>

          <h2>Information we collect</h2>
          <ul>
            <li>Contact details you provide when subscribing to our newsletter (email address).</li>
            <li>Information you share when submitting a prayer request (name and request details).</li>
            <li>Basic, anonymous usage data to help us improve the website.</li>
          </ul>

          <h2>How we use your information</h2>
          <ul>
            <li>To send you updates, resources, and newsletters you have requested.</li>
            <li>To respond to prayer requests through our prayer team.</li>
            <li>To maintain and improve our services.</li>
          </ul>

          <h2>Sharing</h2>
          <p>
            We do not sell your personal information. Prayer requests are shared only with our
            prayer team. We may share data with service providers who help us operate the website,
            under appropriate confidentiality obligations.
          </p>

          <h2>Your choices</h2>
          <p>
            You can unsubscribe from our newsletter at any time. To request access to, correction
            of, or deletion of your personal data, contact us at{' '}
            <a href="mailto:bornofgodministries@gmail.com">bornofgodministries@gmail.com</a>.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy? Email{' '}
            <a href="mailto:bornofgodministries@gmail.com">bornofgodministries@gmail.com</a>.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
