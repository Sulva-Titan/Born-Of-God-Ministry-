'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-heading font-bold mb-3">Something went wrong</h1>
        <p className="text-white/60 mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="rounded-full h-12 px-8 bg-brand text-brand-charcoal hover:bg-brand-light font-medium transition-colors"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
