'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Collection {
  title: string;
  count: number;
}

const GRADIENTS = [
  'from-brand/40 to-brand-black/80',
  'from-brand-soft/40 to-brand-charcoal/80',
  'from-brand-light/40 to-brand-black/80',
  'from-brand/50 to-brand-charcoal/90',
];

export function Collections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('books')
      .select('category')
      .then(({ data }) => {
        const counts = new Map<string, number>();
        (data ?? []).forEach((r: any) => {
          const c = r.category || 'Uncategorised';
          counts.set(c, (counts.get(c) ?? 0) + 1);
        });
        setCollections(
          Array.from(counts, ([title, count]) => ({ title, count })).sort((a, b) => b.count - a.count)
        );
        setLoading(false);
      });
  }, []);

  if (!loading && collections.length === 0) return null;

  return (
    <section className="py-24 relative bg-brand-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <span className="text-sm font-medium text-white/50 tracking-[0.2em] uppercase mb-2 block">
            Curated Series
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-tight">
            Browse by Category
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group relative h-56 rounded-[2rem] overflow-hidden border-white/10 cursor-pointer block transform hover:-translate-y-2 transition-all duration-500">
                <div className={`absolute inset-0 bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="mb-auto">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white/90 font-medium">
                      <BookOpen className="w-3.5 h-3.5" />
                      {collection.count} {collection.count === 1 ? 'Book' : 'Books'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-white leading-tight">
                    {collection.title}
                  </h3>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
