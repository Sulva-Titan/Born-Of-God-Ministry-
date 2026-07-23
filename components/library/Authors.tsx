'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { BookMarked } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Author {
  name: string;
  books: number;
}

export function Authors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('books')
      .select('author')
      .then(({ data }) => {
        const counts = new Map<string, number>();
        (data ?? []).forEach((r: any) => {
          if (r.author) counts.set(r.author, (counts.get(r.author) ?? 0) + 1);
        });
        setAuthors(
          Array.from(counts, ([name, books]) => ({ name, books })).sort((a, b) => b.books - a.books)
        );
        setLoading(false);
      });
  }, []);

  if (!loading && authors.length === 0) return null;

  return (
    <section className="py-24 relative bg-black overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-white rounded-full blur-[150px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-medium text-white/50 tracking-[0.2em] uppercase mb-2 block">
            The Voices
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-tight">
            Featured Authors
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {authors.map((author, index) => (
            <motion.div
              key={author.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group p-8 rounded-[2.5rem] bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/[0.08] transition-all duration-500 text-center flex flex-col items-center">
                <div className="w-24 h-24 rounded-full mb-6 border-2 border-white/10 flex items-center justify-center bg-gradient-to-br from-brand/20 to-white/5">
                  <span className="font-heading text-3xl text-white/70">{author.name.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-heading font-semibold text-white mb-4">{author.name}</h3>
                <div className="mt-auto w-full pt-6 border-t border-white/10 flex items-center justify-center">
                  <span className="text-sm text-white/70 flex items-center gap-1.5 font-medium">
                    <BookMarked className="w-4 h-4 text-white/40" />
                    {author.books} {author.books === 1 ? 'Book' : 'Books'}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
