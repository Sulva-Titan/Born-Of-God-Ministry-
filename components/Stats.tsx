'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Globe2, Users, Heart, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

export function GlobalImpact() {
  const [statsData, setStatsData] = useState({
    churches: '100+',
    pastors: '100+',
    lives: '10k+',
    countries: '12+',
  });

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase.from('homepage_content').select('*').eq('id', 1).maybeSingle();
      if (data && !error) {
        setStatsData({
          churches: data.stats_churches || '100+',
          pastors: data.stats_pastors || '100+',
          lives: data.stats_lives || '10k+',
          countries: data.stats_countries || '12+'
        });
      }
    }
    fetchStats();
  }, []);

  const stats = [
    {
      id: 1,
      name: 'Churches Worldwide',
      value: statsData.churches,
      icon: MapPin,
      description: 'A growing global family.',
    },
    {
      id: 2,
      name: 'Pastors Trained',
      value: statsData.pastors,
      icon: Users,
      description: 'Equipping leaders globally.',
    },
    {
      id: 3,
      name: 'Lives Impacted',
      value: statsData.lives,
      icon: Heart,
      description: 'Transforming communities.',
    },
    {
      id: 4,
      name: 'Countries Reached',
      value: statsData.countries,
      icon: Globe2,
      description: 'Spreading across borders.',
    },
  ];

  return (
    <section className="py-32 relative overflow-hidden bg-brand-black">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white tracking-tight mb-6">
            Global Impact
          </h2>
          <p className="text-lg text-white/60 font-light">
            Through the grace of God, our ministry continues to expand, reaching new nations and transforming lives through dedicated service and faith.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="relative group overflow-hidden bg-white/5 border-white/10 backdrop-blur-xl p-8 hover:bg-white/[0.07] transition-colors duration-500 rounded-3xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center mb-6 shadow-inner">
                    <stat.icon className="w-6 h-6 text-brand" />
                  </div>
                  
                  <div className="text-4xl font-heading font-bold text-white mb-2 tracking-tight">
                    {stat.value}
                  </div>
                  
                  <div className="text-sm font-medium text-white/80 uppercase tracking-wider mb-2">
                    {stat.name}
                  </div>
                  
                  <div className="text-sm text-white/50 font-light">
                    {stat.description}
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
