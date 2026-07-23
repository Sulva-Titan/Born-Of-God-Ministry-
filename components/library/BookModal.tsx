'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, BookOpen, Clock, Globe2, FileText, Share2, Heart, ShieldCheck } from 'lucide-react';
import { DialogContent, DialogTitle } from '@/components/ui/dialog';

// Define the type for the book prop
export type Book = {
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
};

export function BookModal({ book }: { book: Book }) {
  return (
    <DialogContent className="max-w-4xl bg-brand-black/95 border-white/10 p-0 overflow-hidden backdrop-blur-3xl rounded-[2rem] gap-0 border shadow-2xl">
      <DialogTitle className="sr-only">{book.title}</DialogTitle>
      
      <div className="flex flex-col md:flex-row h-full max-h-[85vh] overflow-y-auto custom-scrollbar">
        
        {/* Left Side: Cover Image */}
        <div className="relative w-full md:w-2/5 p-8 md:p-12 bg-white/5 flex flex-col items-center justify-center shrink-0 border-r border-white/10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />
          
          <div className="relative w-full aspect-[2/3] max-w-[280px] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20">
            {book.cover ? (
              <Image
                src={book.cover}
                alt={book.title}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand/20 via-white/5 to-black p-6 text-center">
                <span className="font-heading font-semibold text-white/80">{book.title}</span>
              </div>
            )}
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-4 w-full px-4">
            <Button variant="outline" size="icon" className="rounded-full bg-transparent border-white/20 text-white hover:bg-brand/10 hover:text-brand hover:border-brand/50 w-12 h-12 transition-colors">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full bg-transparent border-white/20 text-white hover:bg-brand/10 hover:text-brand hover:border-brand/50 w-12 h-12 transition-colors">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="flex-1 p-8 md:p-12 flex flex-col">
          <Badge variant="outline" className="w-fit bg-white/5 border-white/20 text-white/80 mb-6 px-4 py-1.5 font-normal tracking-wide">
            {book.category}
          </Badge>
          
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2 leading-tight">
            {book.title}
          </h2>
          <p className="text-xl text-white/70 font-medium mb-8">
            by {book.author}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-white/10 mb-8">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-white/40 uppercase tracking-wider">Format</span>
              <span className="text-sm text-white/90 font-medium flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-white/50" /> {book.format}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-white/40 uppercase tracking-wider">Pages</span>
              <span className="text-sm text-white/90 font-medium flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-white/50" /> {book.pages}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-white/40 uppercase tracking-wider">Language</span>
              <span className="text-sm text-white/90 font-medium flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-white/50" /> {book.language}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-white/40 uppercase tracking-wider">Published</span>
              <span className="text-sm text-white/90 font-medium flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-white/50" /> {book.date}
              </span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none mb-10">
            <h3 className="text-lg font-heading font-semibold text-white mb-4">About this resource</h3>
            <p className="text-white/60 font-light leading-relaxed">
              {book.description}
            </p>
          </div>

          <div className="mt-auto pt-6 flex flex-col sm:flex-row items-center gap-4">
            {book.file_url ? (
              <a
                href={book.file_url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="w-full sm:w-auto rounded-full bg-brand text-brand-charcoal hover:bg-brand-light h-14 px-10 text-base font-semibold shadow-[0_4px_20px_rgba(244,196,0,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
              >
                <Download className="w-5 h-5" />
                Download {book.format || 'file'}
              </a>
            ) : (
              <Button disabled className="w-full sm:w-auto rounded-full h-14 px-10 text-base font-semibold flex items-center gap-3 opacity-60 cursor-not-allowed">
                <Download className="w-5 h-5" />
                Download unavailable
              </Button>
            )}
            {book.file_url && (
              <p className="text-xs text-white/40 font-light flex items-center gap-1.5 mt-2 sm:mt-0">
                <ShieldCheck className="w-4 h-4 text-green-400/70" /> {book.size}
              </p>
            )}
          </div>

        </div>
      </div>
    </DialogContent>
  );
}
