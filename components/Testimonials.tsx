'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Quote } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) console.warn('Error fetching testimonials:', error.message || error);
      setTestimonials((data as Testimonial[]) ?? []);
      setLoading(false);
    }
    fetchTestimonials();
  }, []);

  if (!loading && testimonials.length === 0) return null;

  // Double the array for the infinite-scroll effect (only if enough items)
  const repeatedTestimonials = testimonials.length > 2 ? [...testimonials, ...testimonials] : testimonials;

  return (
    <section className="py-32 relative bg-brand-black overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white tracking-tight mb-4">
            Stories of Transformation
          </h2>
          <p className="text-lg text-white/60 font-light max-w-2xl mx-auto">
            Hear from members and leaders whose lives have been impacted by our global family.
          </p>
        </motion.div>
      </div>

      <div className="relative flex overflow-x-hidden">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-brand-black to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-brand-black to-transparent z-10" />

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          className="flex gap-6 px-6"
        >
          {repeatedTestimonials.map((testimonial, index) => (
            <Card
              key={`${testimonial.id}-${index}`}
              className="w-[350px] md:w-[450px] shrink-0 p-8 rounded-3xl bg-white/5 border-white/10 backdrop-blur-xl relative"
            >
              <Quote className="w-8 h-8 text-brand/20 mb-6" />
              <p className="text-lg text-white/80 font-light leading-relaxed mb-8">
                &quot;{testimonial.quote}&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand/20 to-white/5 border border-brand/20 flex items-center justify-center text-brand font-semibold">
                  {testimonial.name[0]}
                </div>
                <div>
                  <div className="text-white font-medium">{testimonial.name}</div>
                  <div className="text-sm text-white/50">{testimonial.location}</div>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
