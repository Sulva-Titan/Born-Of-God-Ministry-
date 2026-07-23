'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export function NewsletterForm({
  className = '',
  inputClassName = '',
  buttonClassName = '',
  placeholder = 'Join our newsletter',
}: {
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  placeholder?: string;
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const { error } = await supabase.from('subscribers').insert({ email: email.trim().toLowerCase() });
    if (error) {
      // 23505 = unique violation → already subscribed
      if (error.code === '23505') {
        setStatus('done');
        setMessage("You're already subscribed. Thank you!");
      } else {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
      return;
    }
    setStatus('done');
    setMessage('Thank you for subscribing!');
    setEmail('');
  };

  if (status === 'done') {
    return <p className={`text-sm text-brand ${className}`}>{message}</p>;
  }

  return (
    <form onSubmit={submit} className={className}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className={inputClassName}
      />
      <Button type="submit" disabled={status === 'loading'} className={buttonClassName}>
        {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
      </Button>
      {status === 'error' && <span className="text-xs text-red-400 mt-1 block w-full">{message}</span>}
    </form>
  );
}
