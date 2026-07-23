import type {Metadata} from 'next';
import './globals.css';
import { Inter, Space_Grotesk } from 'next/font/google';
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});
const spaceGrotesk = Space_Grotesk({subsets:['latin'],variable:'--font-heading'});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bornofgodministries.org';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Born Of God Ministries',
    template: '%s | Born Of God Ministries',
  },
  description: 'Raising a Generation Born of God. Over 100 churches worldwide teaching hundreds of Pastors globally and transforming lives through Christ.',
  icons: {
    icon: '/logo.jpeg',
    apple: '/logo.jpeg',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={cn("dark font-sans", inter.variable, spaceGrotesk.variable)} suppressHydrationWarning>
      <body className="bg-brand-black text-white antialiased selection:bg-brand/20 min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
