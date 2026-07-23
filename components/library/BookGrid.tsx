'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Download, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { BookModal } from './BookModal';
import { supabase } from '@/lib/supabase';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  cover: string;
  category: string;
  pages: number;
  language: string;
  size: string;
  downloads: string;
  date: string;
  format: string;
  file_url?: string;
}

export function BookGrid() {
  const [libraryBooks, setLibraryBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) console.warn('Error fetching books:', error.message || error);
      setLibraryBooks((data as Book[]) ?? []);
      setLoading(false);
    }
    fetchBooks();
  }, []);

  return (
    <section id="library-books" className="py-24 relative bg-brand-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4 border-b border-white/10 pb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight">
              All Resources
            </h2>
            <p className="text-white/50 text-sm mt-2">Showing {libraryBooks.length} books</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Sort Dropdown placeholder */}
            <select className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-white/30 backdrop-blur-md appearance-none cursor-pointer pr-8">
              <option value="newest" className="bg-brand-black text-white">Newest Additions</option>
              <option value="popular" className="bg-brand-black text-white">Most Downloaded</option>
              <option value="alpha" className="bg-brand-black text-white">Alphabetical (A-Z)</option>
            </select>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {loading ? (
             <div className="col-span-full text-white/60 flex justify-center py-10">Loading books...</div>
          ) : libraryBooks.length === 0 ? (
             <div className="col-span-full text-white/60 flex justify-center py-10">No books available yet.</div>
          ) : libraryBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
            >
              <Dialog>
                <DialogTrigger className="text-left">
                  <div className="group cursor-pointer flex flex-col h-full">
                    <Card className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-white/5 border-white/10 mb-4 shadow-lg group-hover:shadow-[0_15px_30px_rgba(255,255,255,0.1)] transition-all duration-500">
                      {book.cover ? (
                        <Image
                          src={book.cover}
                          alt={book.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand/20 via-white/5 to-black p-4 text-center">
                          <span className="font-heading font-semibold text-white/80 text-sm line-clamp-4">{book.title}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                      
                      {/* Hover Actions */}
                      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-between items-center bg-gradient-to-t from-black to-transparent">
                        <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md px-2 py-0.5 text-[10px] font-medium tracking-wide">
                          {book.category}
                        </Badge>
                        <div className="w-8 h-8 rounded-full bg-brand text-brand-charcoal flex items-center justify-center hover:scale-110 hover:bg-brand-light transition-all">
                          <Download className="w-4 h-4" />
                        </div>
                      </div>
                      
                      {/* Quick Favorite */}
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-brand hover:border-brand/50 hover:bg-brand/10 transition-colors opacity-0 group-hover:opacity-100">
                        <Heart className="w-4 h-4" />
                      </div>
                    </Card>
                    
                    <div className="flex flex-col flex-1">
                      <h3 className="text-base md:text-lg font-heading font-semibold text-white leading-tight mb-1 group-hover:text-brand-soft transition-colors line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-sm text-white/50 font-light mb-2">{book.author}</p>
                      <div className="mt-auto flex items-center gap-3 text-xs text-white/40">
                        <span className="flex items-center gap-1">
                          <Download className="w-3 h-3" /> {book.downloads}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span>{book.format}</span>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                
                <BookModal book={{
                  ...book,
                  cover: book.cover || '',
                  language: book.language || 'English',
                  size: book.size || '—',
                  date: book.date || '',
                  file_url: book.file_url || '',
                }} />
              </Dialog>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 text-center flex justify-center"
        >
          <Button variant="outline" className="rounded-full bg-transparent border-white/20 text-white hover:bg-brand/10 hover:border-brand hover:text-brand h-12 px-8 transition-colors">
            Load More Resources
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
