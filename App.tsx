import React, { useState, useEffect } from 'react';
import { Book, ViewMode } from './types';
import { Hero } from './components/Hero';
import { BookGrid } from './components/BookGrid';
import { UploadForm } from './components/UploadForm';
import { Footer } from './components/Footer';
import { Reader } from './components/Reader';
import { BookOpen, ShoppingBag, Search, Smile } from 'lucide-react';

export default function App() {
  // Initialize books from localStorage if available
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const savedBooks = localStorage.getItem('readSphere_books');
      return savedBooks ? JSON.parse(savedBooks) : [];
    } catch (e) {
      console.error("Failed to load books from storage", e);
      return [];
    }
  });
  
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [currentBook, setCurrentBook] = useState<Book | null>(null);

  const handleReadBook = (book: Book) => {
    setCurrentBook(book);
    setViewMode('reader');
    window.scrollTo(0, 0);
  };

  const handleExitReader = () => {
    setViewMode('home');
    setCurrentBook(null);
  };

  // Autosave reading progress
  const handleBookProgress = (bookId: string, page: number) => {
    setBooks(prevBooks => {
      const updatedBooks = prevBooks.map(b => 
        b.id === bookId ? { ...b, lastReadPage: page } : b
      );
      
      // Save to local storage silently
      try {
        localStorage.setItem('readSphere_books', JSON.stringify(updatedBooks));
      } catch (e) {
        console.error("Failed to save progress", e);
      }
      
      return updatedBooks;
    });
  };

  const handleBookUpload = (newBook: Book) => {
    const updatedBooks = [newBook, ...books];
    setBooks(updatedBooks);
    
    // Persist to localStorage
    try {
      localStorage.setItem('readSphere_books', JSON.stringify(updatedBooks));
    } catch (e) {
      alert("Storage warning: Your browser's local storage is full. This book will not be saved permanently. Try uploading a smaller file or using an external link.");
      console.error("Storage quota exceeded:", e);
    }

    // Optionally scroll to library
    const libraryEl = document.getElementById('library');
    if (libraryEl) libraryEl.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    handleExitReader();
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col font-sans text-white selection:bg-[#F0A6CA] selection:text-[#1a1a1a]">
      <style>{`
        @keyframes search {
          0%, 100% { transform: rotate(0deg) translateX(0); }
          25% { transform: rotate(-5deg) translateX(-2px); }
          75% { transform: rotate(5deg) translateX(2px); }
        }
        @keyframes write {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          50% { transform: rotate(-10deg) translateY(-5px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes blink {
          0%, 45%, 55%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.1); }
        }
        .animate-search { animation: search 3s ease-in-out infinite; }
        .animate-write { animation: write 2s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
        .animate-blink { animation: blink 4s infinite; }
      `}</style>

      {/* Navbar - Minimal Reference Style */}
      <nav className="sticky top-0 z-50 bg-[#1a1a1a]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleExitReader()}>
            <Smile className="w-6 h-6 text-white" />
            <span className="text-xl font-bold tracking-tight text-white">ReadSphere</span>
          </div>
          
          {/* Main Menu - Centered */}
          <div className="hidden md:flex items-center space-x-12">
            <button onClick={handleExitReader} className="text-sm font-medium text-white hover:text-[#F0A6CA] transition-colors">Shop All</button>
            <button 
              onClick={() => scrollToSection('library')}
              className="text-sm font-medium text-white hover:text-[#F0A6CA] transition-colors"
            >
              Library
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-sm font-medium text-white hover:text-[#F0A6CA] transition-colors"
            >
              About
            </button>
            <button className="text-sm font-medium text-white hover:text-[#F0A6CA] transition-colors">Contact</button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
             <button className="flex items-center gap-2 text-sm font-medium text-white hover:text-[#F0A6CA] transition-colors">
               <ShoppingBag className="w-5 h-5" />
               <span>Log In</span>
             </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col">
        {viewMode === 'home' && (
          <>
            <Hero onExplore={() => scrollToSection('library')} />
            
            <section id="library" className="py-32 px-6 max-w-[1400px] mx-auto w-full relative">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 relative">
                <div>
                  <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-none relative z-10">
                    Curated <br/> Collection
                  </h2>
                  <p className="text-gray-400 max-w-md text-lg relative z-10">
                    Hand-picked digital stories tailored to your unique tastes.
                  </p>
                </div>
                
                {/* NEW CHARACTER: The Scout */}
                <div className="hidden md:block absolute bottom-[-10px] left-[350px] z-0">
                  <div className="relative animate-float-slow">
                     {/* Binoculars */}
                     <div className="absolute -top-6 left-2 flex gap-1 z-20 animate-search origin-bottom">
                        <div className="w-6 h-6 rounded-full border-4 border-black bg-black">
                           <div className="w-2 h-2 bg-white/50 rounded-full absolute top-1 left-1"></div>
                        </div>
                        <div className="w-6 h-6 rounded-full border-4 border-black bg-black">
                           <div className="w-2 h-2 bg-white/50 rounded-full absolute top-1 left-1"></div>
                        </div>
                     </div>
                     {/* Body */}
                     <div className="w-20 h-20 bg-[#D4F0A6] rounded-full border-4 border-white/20 flex items-center justify-center">
                        <div className="w-12 h-6 border-b-4 border-black rounded-b-full mt-4"></div>
                     </div>
                  </div>
                </div>

                <div className="hidden md:block pb-2 relative">
                   <div className="h-px w-64 bg-white/20"></div>
                </div>
              </div>
              
              {books.length > 0 ? (
                <BookGrid books={books} onRead={handleReadBook} />
              ) : (
                <div className="py-24 border border-dashed border-white/20 rounded-3xl bg-white/5 text-center relative overflow-hidden">
                  
                  {/* NEW CHARACTER: The Confused Traveler (Empty State) */}
                  <div className="mb-8 relative inline-block animate-float-slow">
                    {/* Question Marks */}
                    <div className="absolute -top-8 -right-8 text-4xl font-black text-[#F0A6CA] animate-bounce delay-75">?</div>
                    <div className="absolute -top-4 -left-6 text-3xl font-black text-[#A6D8F0] animate-bounce delay-150">?</div>
                    
                    {/* Body */}
                    <div className="w-24 h-24 bg-[#A6D8F0] rounded-t-full rounded-b-3xl border-4 border-white/80 flex flex-col items-center justify-center relative">
                        {/* Eyes looking around */}
                        <div className="flex gap-4 animate-search">
                           <div className="w-4 h-4 bg-black rounded-full"></div>
                           <div className="w-4 h-4 bg-black rounded-full"></div>
                        </div>
                        {/* Mouth */}
                        <div className="w-4 h-4 rounded-full border-4 border-black mt-2"></div>
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold text-white mb-4">The shelves are empty</h3>
                  <p className="text-gray-400 mb-8 text-lg max-w-md mx-auto">
                    Be the first to contribute to our storytelling sanctuary.
                  </p>
                  <button 
                    onClick={() => scrollToSection('upload')}
                    className="px-8 py-4 bg-white text-[#1a1a1a] rounded-full font-bold hover:bg-[#F0A6CA] transition-colors"
                  >
                    Upload a Book
                  </button>
                </div>
              )}
            </section>

            {/* ABOUT SECTION - FOUNDER */}
            <section id="about" className="py-32 px-6 max-w-[1400px] mx-auto text-center relative border-t border-white/5">
              
              {/* NEW CHARACTER: The Architect (Founder) */}
              <div className="hidden md:block absolute top-10 left-[10%] xl:left-[20%] animate-float-slow">
                 <div className="relative">
                    {/* Character Body */}
                    <div className="w-24 h-24 bg-[#A6D8F0] rounded-xl border-4 border-white/80 flex flex-col items-center justify-center relative z-10 rotate-3">
                       {/* Glasses */}
                       <div className="flex gap-2 items-center mb-2">
                          <div className="w-6 h-6 rounded-full border-2 border-black bg-white/20"></div>
                          <div className="w-2 h-1 bg-black"></div>
                          <div className="w-6 h-6 rounded-full border-2 border-black bg-white/20"></div>
                       </div>
                       {/* Smile */}
                       <div className="w-6 h-3 border-b-2 border-black rounded-b-full"></div>
                    </div>
                    {/* Holding a tablet/plan */}
                    <div className="absolute -bottom-4 -right-4 w-12 h-16 bg-white border-2 border-black rounded-md rotate-[-10deg] z-20 flex flex-col gap-1 p-1">
                       <div className="w-full h-1 bg-gray-200"></div>
                       <div className="w-full h-1 bg-gray-200"></div>
                       <div className="w-2/3 h-1 bg-gray-200"></div>
                    </div>
                 </div>
              </div>

              <div className="inline-block mb-6 px-4 py-1 rounded-full border border-white/20 text-xs font-bold tracking-widest uppercase text-[#F0A6CA] animate-bounce-gentle">
                The Vision
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-10 leading-tight">
                Crafted by <br/> <span className="text-[#A6D8F0]">Ruthwik Goparaju</span>
              </h2>
              <div className="max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed space-y-6">
                <p>
                  ReadSphere began as a spark, a simple idea that stories should have a home where walls don't exist and hours don't matter.
                </p>
                <p>
                  As the founder, <span className="text-white font-medium">Ruthwik</span> envisioned a digital sanctuary where the only barrier between you and your next adventure is a single click. Every pixel of this platform is built with a passion for code and a love for the written word.
                </p>
                <div className="pt-8">
                   <div className="w-16 h-1 bg-[#F0A6CA] mx-auto rounded-full"></div>
                </div>
              </div>
            </section>

            <section id="upload" className="py-32 bg-[#FEF9E7] text-[#1a1a1a] relative overflow-hidden">
               {/* Decorative elements */}
               <div className="absolute top-0 left-0 w-full h-12 bg-[#1a1a1a] rounded-br-[40px] rounded-bl-[40px]"></div>

              <div className="max-w-5xl mx-auto px-6 relative z-10 pt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                  <div className="relative">
                    
                    {/* NEW CHARACTER: The Story Weaver (Upload) */}
                    <div className="absolute -top-24 right-0 md:-right-10 animate-float-slow hidden sm:block">
                        <div className="relative">
                           {/* Pencil */}
                           <div className="absolute top-4 -left-12 w-24 h-4 bg-orange-400 border-2 border-black rotate-[-45deg] origin-right animate-write z-20 rounded-l-md">
                              <div className="absolute left-0 top-0 h-full w-4 bg-black rounded-l-sm"></div>
                           </div>
                           
                           {/* Body */}
                           <div className="w-24 h-24 bg-[#F0A6CA] rounded-full border-4 border-black relative z-10 flex items-center justify-center">
                              {/* Face */}
                              <div className="flex flex-col items-center gap-1">
                                 <div className="flex gap-3">
                                    <div className="w-3 h-3 bg-black rounded-full animate-blink"></div>
                                    <div className="w-3 h-3 bg-black rounded-full animate-blink" style={{animationDelay: '0.2s'}}></div>
                                 </div>
                                 <div className="w-6 h-3 border-b-2 border-black rounded-b-full"></div>
                              </div>
                           </div>
                           {/* Hands */}
                           <div className="absolute top-14 -left-4 w-6 h-6 bg-[#F0A6CA] border-2 border-black rounded-full"></div>
                        </div>
                    </div>

                    <h2 className="text-5xl md:text-7xl font-bold text-[#1a1a1a] mb-8 leading-[0.9] tracking-tight uppercase relative z-10">
                      Share <br/> Your <br/> Story
                    </h2>
                    <p className="text-lg text-[#1a1a1a]/70 mb-8 font-medium max-w-md">
                      Join our community of storytellers. Upload your PDF works and let the world discover your imagination.
                    </p>
                    <div className="w-24 h-24 bg-[#1a1a1a] rounded-full flex items-center justify-center animate-bounce group cursor-pointer hover:scale-110 transition-transform">
                       <Smile className="w-12 h-12 text-[#FEF9E7] group-hover:rotate-180 transition-transform duration-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-2 rounded-3xl shadow-2xl shadow-black/10 rotate-2 hover:rotate-0 transition-transform duration-500 relative z-10">
                     <div className="bg-[#1a1a1a] rounded-2xl p-1">
                        <UploadForm onSubmit={handleBookUpload} />
                     </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {viewMode === 'reader' && currentBook && (
          <Reader 
            book={currentBook} 
            onExit={handleExitReader} 
            onUpdateProgress={handleBookProgress}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}