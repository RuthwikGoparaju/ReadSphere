import React, { useState } from 'react';
import { Book } from '../types';
import { BookOpen, ArrowRight, Search } from 'lucide-react';

interface BookGridProps {
  books: Book[];
  onRead: (book: Book) => void;
}

export const BookGrid: React.FC<BookGridProps> = ({ books, onRead }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Search Filter */}
      <div className="mb-12 flex justify-center">
        <div className="relative w-full max-w-md group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500 group-focus-within:text-[#F0A6CA] transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-full leading-5 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-[#F0A6CA] transition-all duration-300"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map((book) => (
            <div 
              key={book.id} 
              className="group relative bg-[#FEF9E7] rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
            >
              {/* Card Body */}
              <div className="p-4 flex flex-col h-full">
                
                {/* Image Container with organic border radius */}
                <div className="relative aspect-[3/4] w-full bg-[#1a1a1a] rounded-2xl overflow-hidden mb-5 border-2 border-[#1a1a1a]/10">
                  <img 
                    src={book.coverUrl} 
                    alt={book.title} 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  
                  {/* Overlay Button */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => onRead(book)}
                      className="bg-white text-[#1a1a1a] px-8 py-3 rounded-full font-bold text-sm hover:bg-[#F0A6CA] transition-colors flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 duration-300"
                    >
                      <BookOpen className="w-4 h-4" />
                      Read Now
                    </button>
                  </div>
                </div>

                {/* Text Content */}
                <div className="px-2 pb-4 flex-grow flex flex-col">
                  <div className="mb-auto">
                    <h3 className="text-2xl font-bold text-[#1a1a1a] mb-1 leading-tight font-sans tracking-tight">
                      {book.title}
                    </h3>
                    <p className="text-[#1a1a1a]/60 font-medium text-sm mb-4">{book.author}</p>
                    <p className="text-[#1a1a1a]/80 text-sm leading-relaxed line-clamp-3">
                      {book.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#1a1a1a]/10 flex justify-between items-center">
                     <span className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]/40">Ebook Format</span>
                     <button 
                       onClick={() => onRead(book)}
                       className="w-10 h-10 rounded-full border border-[#1a1a1a]/20 flex items-center justify-center text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors"
                     >
                       <ArrowRight className="w-4 h-4" />
                     </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
             <Search className="w-6 h-6 text-gray-500" />
          </div>
          <p className="text-gray-400 text-lg font-medium">No stories found matching "{searchTerm}"</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-4 text-[#F0A6CA] hover:text-white transition-colors font-bold text-sm uppercase tracking-wider"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};