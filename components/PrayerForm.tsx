'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Heart, Loader2, Check } from 'lucide-react';

export function PrayerForm() {
  const [form, setForm] = useState({ name: '', branch: '', request: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    const { error } = await supabase.from('prayers').insert({
      name: form.name.trim(),
      branch: form.branch.trim() || null,
      request: form.request.trim(),
    });
    if (error) {
      setStatus('error');
      setError('We could not submit your request. Please try again.');
      return;
    }
    setStatus('done');
  };

  const inputCls =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-brand/50 transition-colors';

  if (status === 'done') {
    return (
      <div className="text-center py-10">
        <div className="w-14 h-14 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center mx-auto mb-5">
          <Check className="w-7 h-7 text-brand" />
        </div>
        <h3 className="text-2xl font-heading font-bold text-white mb-2">Request received</h3>
        <p className="text-white/60 font-light">
          Our prayer team will stand with you in faith. Be blessed.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="block text-sm text-white/70 mb-2">Your name</label>
        <input required value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} placeholder="Full name" />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-2">Branch / location <span className="text-white/30">(optional)</span></label>
        <input value={form.branch} onChange={(e) => set('branch', e.target.value)} className={inputCls} placeholder="e.g. Nairobi" />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-2">Your prayer request</label>
        <textarea required rows={5} value={form.request} onChange={(e) => set('request', e.target.value)} className={inputCls} placeholder="Share what you would like us to pray for…" />
      </div>
      {status === 'error' && <p className="text-sm text-red-400">{error}</p>}
      <Button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-full h-14 bg-brand text-brand-charcoal hover:bg-brand-light text-base font-medium flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Heart className="w-5 h-5" />}
        Submit prayer request
      </Button>
      <p className="text-xs text-white/40 text-center">
        Your request is kept private and shared only with our prayer team.
      </p>
    </form>
  );
}
