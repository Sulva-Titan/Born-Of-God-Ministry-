'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, FileText } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { BookModal, Book } from './BookModal';
import { supabase } from '@/lib/supabase';

function toBook(row: any): Book {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    description: row.description || '',
    cover: row.cover || '',
    category: row.category || 'Resource',
    pages: row.pages || 0,
    language: 'English',
    size: '—',
    downloads: row.downloads || '',
    date: '',
    format: row.format || 'PDF',
    file_url: row.file_url || '',
  };
}

export function FeaturedBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(2)
      .then(({ data }) => {
        setBooks((data ?? []).map(toBook));
        setLoading(false);
      });
  }, []);

  if (!loading && books.length === 0) return null;

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
            Editor&apos;s Choice
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-tight">
            Featured Resources
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Dialog>
                <DialogTrigger className="text-left w-full h-full block">
                  <Card className="group h-full p-6 md:p-8 rounded-[2rem] bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/[0.08] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,255,255,0.05)] cursor-pointer overflow-hidden relative text-left">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-brand/5 rounded-full blur-[80px] group-hover:bg-brand/10 transition-colors duration-500" />

                    <div className="flex flex-col sm:flex-row gap-8 relative z-10">
                      <div className="relative w-full sm:w-48 aspect-[2/3] shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-2xl group-hover:scale-105 transition-transform duration-700 ease-out">
                        {book.cover ? (
                          <Image src={book.cover} alt={book.title} fill className="object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand/20 via-white/5 to-black p-4 text-center">
                            <span className="font-heading font-semibold text-white/80 text-sm">{book.title}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10" />
                      </div>

                      <div className="flex-1 flex flex-col">
                        <Badge variant="outline" className="w-fit bg-white/5 border-white/10 text-white/70 mb-4 px-3 py-1 font-normal">
                          {book.category}
                        </Badge>
                        <h3 className="text-2xl font-heading font-bold text-white mb-2">
                          {book.title}
                        </h3>
                        <p className="text-white/60 font-medium mb-4">{book.author}</p>
                        <p className="text-white/50 font-light text-sm line-clamp-3 mb-6 leading-relaxed">
                          {book.description}
                        </p>

                        <div className="mt-auto grid grid-cols-2 gap-4 text-xs text-white/40 mb-6">
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5" />
                            {book.pages} pages
                          </div>
                          {book.downloads && (
                            <div className="flex items-center gap-2">
                              <Download className="w-3.5 h-3.5" />
                              {book.downloads}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex-1 rounded-full bg-brand text-brand-charcoal flex items-center justify-center hover:bg-brand-light h-10 text-sm font-medium">
                            Read Overview
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </DialogTrigger>
                <BookModal book={book} />
              </Dialog>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
