'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface Leader {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export function Leadership() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaders() {
      const { data, error } = await supabase
        .from('leadership')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) console.warn('Error fetching leadership:', error.message || error);
      setLeaders((data as Leader[]) ?? []);
      setLoading(false);
    }
    fetchLeaders();
  }, []);

  if (!loading && leaders.length === 0) return null;

  return (
    <section id="leadership" className="py-32 relative bg-brand-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-sm font-medium text-white/50 tracking-[0.2em] uppercase mb-4 block">
            Our Leadership
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white tracking-tight mb-6">
            Led by Grace
          </h2>
          <p className="text-lg text-white/60 font-light">
            Meet the dedicated men and women who carry the vision and serve our global family with excellence and love.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {leaders.map((leader, index) => (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 bg-white/5 border border-white/10">
                {leader.image ? (
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand/20 via-white/5 to-black">
                    <span className="font-heading text-4xl text-white/40">{leader.name.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                {leader.bio && (
                  <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white/80 text-sm font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {leader.bio}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-heading font-semibold text-white mb-1">
                  {leader.name}
                </h3>
                <p className="text-sm text-brand uppercase tracking-wider font-medium">
                  {leader.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
