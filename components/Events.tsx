'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar as CalendarIcon, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  is_major: boolean;
}

export function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
      if (error) console.warn('Error fetching events:', error.message || error);
      setEvents((data as Event[]) ?? []);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  return (
    <section id="events" className="py-32 relative bg-brand-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white tracking-tight mb-4">
              Upcoming Events
            </h2>
            <p className="text-lg text-white/60 font-light">
              Mark your calendars and join us as we gather for fellowship, equipping, and divine encounters.
            </p>
          </motion.div>
        </div>

        <div className="relative border-l border-white/10 ml-4 md:ml-8 space-y-12 pb-8">
          {loading ? (
             <div className="text-white/60 pl-8 md:pl-16">Loading events...</div>
          ) : events.length === 0 ? (
             <div className="text-white/60 pl-8 md:pl-16">No upcoming events found.</div>
          ) : events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative pl-8 md:pl-16"
            >
              {/* Timeline Dot */}
              <div className="absolute top-0 -left-[5px] w-2.5 h-2.5 rounded-full bg-brand shadow-[0_0_10px_rgba(244,196,0,0.8)]" />
              
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl hover:bg-white/[0.08] transition-colors relative overflow-hidden group">
                {event.is_major && (
                  <div className="absolute top-0 right-0 bg-brand text-brand-charcoal text-xs font-bold px-4 py-1 rounded-bl-2xl uppercase tracking-wider">
                    Major Event
                  </div>
                )}
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-heading font-semibold text-white mb-4">
                      {event.title}
                    </h3>
                    <p className="text-white/60 font-light mb-6 leading-relaxed max-w-2xl">
                      {event.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm text-white/70">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-white/50" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-white/50" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-white/50" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="shrink-0 flex flex-col items-start lg:items-end gap-4">
                    <Button className="rounded-full bg-brand text-brand-charcoal hover:bg-brand-light px-8 h-12 text-base font-medium transition-all group-hover:scale-105 shadow-[0_4px_20px_rgba(244,196,0,0.2)]">
                      Register Now
                    </Button>
                    <button className="text-sm text-white/50 hover:text-brand flex items-center gap-1 transition-colors">
                      View details <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
