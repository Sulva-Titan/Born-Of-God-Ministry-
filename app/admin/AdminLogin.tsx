'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Lock, ShieldAlert, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function AdminLogin({ notAdmin, email }: { notAdmin?: boolean; email?: string }) {
  const router = useRouter();
  const [loginEmail, setLoginEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(
    notAdmin
      ? `${email ?? 'This account'} is not authorised for the admin portal.`
      : null
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    // Re-run the server component so it can verify admin membership.
    router.refresh();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-11 h-11 rounded-xl overflow-hidden border border-brand/30 relative shrink-0">
            <Image src="/logo.jpeg" alt="Born Of God Ministries" fill className="object-cover" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg leading-none">Born Of God</h1>
            <span className="text-[10px] text-brand font-semibold uppercase tracking-widest">
              Admin Portal
            </span>
          </div>
        </div>

        <div className="bg-[#16161A] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-heading font-bold mb-1">Sign in</h2>
          <p className="text-sm text-gray-400 mb-6">Authorised administrators only.</p>

          {error && (
            <div className="mb-5 flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2.5 text-sm text-red-300">
              <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {notAdmin ? (
            <button
              onClick={handleSignOut}
              className="w-full rounded-xl h-12 bg-white/10 hover:bg-white/15 font-semibold text-sm transition-colors"
            >
              Sign out and use a different account
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full bg-[#202026] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  placeholder="you@yourchurch.org"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="w-full bg-[#202026] border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl h-12 bg-brand text-black font-bold text-sm hover:bg-brand-light transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Sign in
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
