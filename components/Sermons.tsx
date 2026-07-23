'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

interface Sermon {
  id: number;
  title: string;
  speaker: string;
  date: string;
  duration: string;
  youtubeId: string;
}

export function Sermons() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSermons() {
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      if (error) console.warn('Error fetching sermons:', error.message || error);
      setSermons((data as Sermon[]) ?? []);
      setLoading(false);
    }
    fetchSermons();
  }, []);

  return (
    <section id="sermons" className="py-32 relative bg-brand-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white tracking-tight mb-4">
              Latest Messages
            </h2>
            <p className="text-lg text-white/60 font-light">
              Catch up on recent teachings and be transformed by the Word of God.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <button className="text-sm font-medium text-white/80 hover:text-brand pb-1 border-b border-white/20 hover:border-brand transition-colors">
              View All Sermons
            </button>
          </motion.div>
        </div>

        <div className="flex flex-col gap-6">
          {loading ? (
             <div className="text-white/60 flex justify-center py-10">Loading sermons...</div>
          ) : sermons.length === 0 ? (
             <div className="text-white/60 flex justify-center py-10">No sermons available yet.</div>
          ) : sermons.map((sermon, index) => (
            <motion.div
              key={sermon.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group flex flex-col sm:flex-row items-center gap-6 p-4 rounded-3xl bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/[0.08] transition-colors overflow-hidden relative">
                {/* YouTube Iframe */}
                <div className="relative w-full sm:w-64 sm:h-40 aspect-video rounded-2xl overflow-hidden shrink-0 bg-black/50">
                  <iframe
                    className="absolute inset-0 w-full h-full border-0"
                    src={`https://www.youtube.com/embed/${sermon.youtubeId}`}
                    title={sermon.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                {/* Details */}
                <div className="flex-1 py-2 pr-4 w-full">
                  <h3 className="text-xl md:text-2xl font-heading font-semibold text-white mb-2 group-hover:text-brand-soft transition-colors">
                    {sermon.title}
                  </h3>
                  <p className="text-white/70 font-medium mb-4">
                    {sermon.speaker}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-white/50 font-light">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {sermon.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {sermon.duration}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
