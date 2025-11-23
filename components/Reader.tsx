import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Book, ReaderMode } from '../types';
import { X, ChevronLeft, ChevronRight, Layers, FileText, ExternalLink, Moon, Sun, Loader2, ZoomIn, ZoomOut } from 'lucide-react';

// Declare PDF.js global
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

interface ReaderProps {
  book: Book;
  onExit: () => void;
  onUpdateProgress: (bookId: string, page: number) => void;
}

// Skeleton Loader Component mimicking a page structure
const SkeletonPage: React.FC = () => (
  <div className="w-full h-full p-8 md:p-12 flex flex-col gap-6 animate-pulse select-none">
    {/* Header Placeholder */}
    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
    
    {/* Text Lines */}
    <div className="space-y-4">
      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-11/12"></div>
      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
    </div>

    {/* Image/Content Block Placeholder */}
    <div className="flex-grow w-full bg-gray-100 rounded-lg my-4 border-2 border-dashed border-gray-200"></div>

    {/* Bottom Lines */}
    <div className="space-y-4 mt-auto">
       <div className="h-3 bg-gray-200 rounded w-full"></div>
       <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    </div>
    
    {/* Page Number Placeholder */}
    <div className="self-end h-4 w-8 bg-gray-200 rounded mt-2"></div>
  </div>
);

// Helper component to render a single PDF page to a canvas
const CanvasPage: React.FC<{ 
  pdfDoc: any; 
  pageNum: number; 
  width?: number; // Optional target width for responsive scaling
  scale?: number; // Base scale
  className?: string;
}> = ({ pdfDoc, pageNum, width, scale = 1.5, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    
    // reset
    setRendered(false);

    pdfDoc.getPage(pageNum).then((page: any) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const context = canvas.getContext('2d');
      if (!context) return;

      // Determine viewport
      let viewport = page.getViewport({ scale: scale });
      
      // If a specific width is requested (e.g. for container fit), adjust scale
      if (width) {
        const desiredScale = width / viewport.width;
        viewport = page.getViewport({ scale: desiredScale });
      }

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      
      const renderTask = page.render(renderContext);
      renderTask.promise.then(() => {
        setRendered(true);
      });
    });
  }, [pdfDoc, pageNum, width, scale]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`shadow-md transition-opacity duration-300 ${rendered ? 'opacity-100' : 'opacity-0'} ${className}`} 
    />
  );
};

export const Reader: React.FC<ReaderProps> = ({ book, onExit, onUpdateProgress }) => {
  const [mode, setMode] = useState<ReaderMode>('flip');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(book.lastReadPage || 1);
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  
  // Zoom State
  const [zoom, setZoom] = useState(1);
  // Touch Pinch State
  const touchStartDist = useRef<number>(0);
  const startZoom = useRef<number>(1);

  // Debounce saving progress to avoid too many writes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage > 0) {
        onUpdateProgress(book.id, currentPage);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentPage, book.id, onUpdateProgress]);

  // Initial Load of PDF
  useEffect(() => {
    const loadPdf = async () => {
      setIsLoading(true);
      setError(null);

      // Check for PDF.js
      if (!window.pdfjsLib) {
        setError("PDF Reader library not loaded. Please refresh.");
        setIsLoading(false);
        return;
      }

      try {
        let loadingTask;
        if (book.pdfUrl && book.pdfUrl.startsWith('data:')) {
           // Base64 data
           const pdfData = atob(book.pdfUrl.split(',')[1]);
           loadingTask = window.pdfjsLib.getDocument({ data: pdfData });
        } else if (book.pdfUrl && book.pdfUrl.startsWith('http')) {
           // Remote URL
           loadingTask = window.pdfjsLib.getDocument(book.pdfUrl);
        } else {
           // Fallback demo or error
           if (!book.pdfUrl) {
              if (book.isExternal) {
                 setIsLoading(false);
                 return;
              }
              throw new Error("No PDF content found.");
           }
           loadingTask = window.pdfjsLib.getDocument(book.pdfUrl);
        }

        const doc = await loadingTask.promise;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        
        // Ensure current page is valid
        if (currentPage > doc.numPages) setCurrentPage(1);

        setIsLoading(false);
      } catch (err: any) {
        console.error("PDF Load Error", err);
        setError("Unable to load PDF. It might be blocked or invalid.");
        setIsLoading(false);
      }
    };

    loadPdf();
  }, [book]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode === 'flip') {
        if (e.key === 'ArrowRight') nextPage();
        if (e.key === 'ArrowLeft') prevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, numPages, currentPage]);

  const nextPage = () => {
    if (currentPage < numPages) {
      setFlipDirection('next');
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setFlipDirection('prev');
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    setFlipDirection(page > currentPage ? 'next' : 'prev');
    setCurrentPage(page);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));

  // Touch Pinch Zoom Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
        const dist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        touchStartDist.current = dist;
        startZoom.current = zoom;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
        const dist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        if (touchStartDist.current > 0) {
            const scaleFactor = dist / touchStartDist.current;
            const newZoom = Math.min(Math.max(startZoom.current * scaleFactor, 0.5), 3);
            setZoom(newZoom);
        }
    }
  };

  // Theme Classes
  const themeBg = isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#FEF9E7]';
  const themeText = isDarkMode ? 'text-zinc-200' : 'text-[#1a1a1a]';
  const themeBorder = isDarkMode ? 'border-white/10' : 'border-[#1a1a1a]/10';
  const controlBg = isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-white hover:bg-[#F0A6CA]';

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col ${themeBg} ${themeText} transition-colors duration-500`}
      role="dialog"
      aria-modal="true"
      aria-label={`Reading ${book.title}`}
    >
      <style>{`
        @keyframes pageFlipNext {
          0% { transform: rotateY(0deg); transform-origin: left center; }
          100% { transform: rotateY(-10deg); transform-origin: left center; }
        }
        @keyframes pageFlipPrev {
          0% { transform: rotateY(0deg); transform-origin: right center; }
          100% { transform: rotateY(10deg); transform-origin: right center; }
        }
        @keyframes viewFadeIn {
          0% { opacity: 0; transform: translateY(12px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-flip-next { animation: pageFlipNext 0.4s ease-out; }
        .animate-flip-prev { animation: pageFlipPrev 0.4s ease-out; }
        .animate-view-enter { animation: viewFadeIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; will-change: transform, opacity; }
      `}</style>

      {/* Header */}
      <header className={`h-16 px-6 flex items-center justify-between border-b ${themeBorder} relative z-20 flex-shrink-0`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={onExit}
            aria-label="Exit reader"
            className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="hidden sm:block">
            <h3 className="font-bold text-lg leading-none truncate max-w-[200px] sm:max-w-md">{book.title}</h3>
            <span className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-stone-500'}`}>{book.author}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
           {/* Zoom Controls */}
           <div className={`hidden md:flex items-center gap-1 rounded-lg border ${themeBorder} p-1 mr-2`}>
              <button 
                onClick={handleZoomOut}
                className={`p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-medium w-10 text-center select-none">{Math.round(zoom * 100)}%</span>
              <button 
                onClick={handleZoomIn}
                className={`p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
           </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-yellow-400' : 'hover:bg-black/5 text-gray-600'}`}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* External Link */}
          {(book.pdfUrl?.startsWith('http') || book.isExternal) && (
             <a 
               href={book.pdfUrl || '#'} 
               target="_blank" 
               rel="noopener noreferrer"
               className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
               aria-label="Open original file"
             >
               <ExternalLink className="w-5 h-5" />
             </a>
          )}

          {/* View Mode Toggle */}
          <div className={`hidden sm:flex rounded-lg p-1 border ${themeBorder}`} role="radiogroup" aria-label="View Mode">
            <button 
              onClick={() => setMode('flip')}
              role="radio"
              aria-checked={mode === 'flip'}
              aria-label="Flipbook view"
              className={`p-2 rounded-md transition-all ${mode === 'flip' ? (isDarkMode ? 'bg-zinc-700 shadow-sm' : 'bg-white shadow-sm') : 'opacity-50 hover:opacity-100'}`}
            >
              <Layers className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setMode('scroll')}
              role="radio"
              aria-checked={mode === 'scroll'}
              aria-label="Scroll view"
              className={`p-2 rounded-md transition-all ${mode === 'scroll' ? (isDarkMode ? 'bg-zinc-700 shadow-sm' : 'bg-white shadow-sm') : 'opacity-50 hover:opacity-100'}`}
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      {/* Changed to overflow-auto to allow panning when zoomed */}
      <div 
        className="flex-grow relative overflow-auto flex flex-col items-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        
        {/* Centered Scroll Wrapper */}
        <div className={`flex-grow w-full flex flex-col items-center ${mode === 'flip' ? 'justify-center min-h-full py-8' : 'py-8'}`}>

            {error && !isLoading && (
            <div className="text-center max-w-md my-auto" role="alert">
                <div className="mb-4 text-red-400 mx-auto w-12 h-12 flex items-center justify-center bg-red-400/10 rounded-full">
                <ExternalLink className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Unable to Load PDF</h3>
                <p className="opacity-70 mb-6">{error}</p>
                {book.pdfUrl && (
                <a 
                    href={book.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 bg-[#F0A6CA] text-[#1a1a1a] rounded-full font-bold hover:brightness-110 transition-all inline-flex items-center gap-2"
                >
                    Open in New Tab <ExternalLink className="w-4 h-4" />
                </a>
                )}
            </div>
            )}

            {/* Content Viewer */}
            {!error && (
            <>
                {/* Mode: Flipbook */}
                {mode === 'flip' && (
                <div key="flip" className="relative animate-view-enter flex flex-col items-center">
                    
                    {/* Page Container */}
                    <div 
                        className={`relative bg-white shadow-2xl rounded-l-md rounded-r-2xl overflow-hidden transition-all duration-300 ease-out ${flipDirection === 'next' ? 'animate-flip-next' : flipDirection === 'prev' ? 'animate-flip-prev' : ''}`}
                        style={{ 
                            aspectRatio: '3/4', 
                            height: `${80 * zoom}vh`, 
                            maxHeight: zoom === 1 ? '80vh' : 'none',
                            maxWidth: zoom === 1 ? '95vw' : 'none',
                            filter: isDarkMode ? 'brightness(0.9)' : 'none' 
                        }}
                    >
                        {isLoading ? (
                           <SkeletonPage />
                        ) : (
                           pdfDoc && (
                             <CanvasPage 
                                pdfDoc={pdfDoc} 
                                pageNum={currentPage} 
                                width={800 * zoom}
                                className="w-full h-full object-contain"
                             />
                           )
                        )}
                    </div>

                    {/* Controls - Only show when loaded */}
                    {!isLoading && (
                      <>
                        <button 
                            onClick={prevPage}
                            disabled={currentPage <= 1}
                            className={`fixed left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all z-40 ${controlBg} ${currentPage <= 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button 
                            onClick={nextPage}
                            disabled={currentPage >= numPages}
                            className={`fixed right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all z-40 ${controlBg} ${currentPage >= numPages ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                            aria-label="Next page"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>

                        {/* Bottom Controls */}
                        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 px-6 py-3 rounded-full flex items-center gap-4 shadow-xl border ${themeBorder} ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
                            <button 
                            onClick={prevPage} 
                            disabled={currentPage <= 1}
                            className="text-xs font-bold uppercase tracking-wider opacity-60 hover:opacity-100 disabled:opacity-30"
                            >
                            Previous
                            </button>
                            
                            <div className="flex items-center gap-3">
                            <span className="text-sm font-medium w-8 text-right">{currentPage}</span>
                            <input 
                                type="range" 
                                min="1" 
                                max={numPages} 
                                value={currentPage} 
                                onChange={handleSliderChange}
                                className={`w-32 sm:w-48 h-1 rounded-full appearance-none cursor-pointer ${isDarkMode ? 'bg-zinc-700 accent-zinc-200' : 'bg-gray-200 accent-[#F0A6CA]'}`}
                                aria-label="Page scrubber"
                                aria-valuenow={currentPage}
                                aria-valuemin={1}
                                aria-valuemax={numPages}
                                aria-valuetext={`Page ${currentPage} of ${numPages}`}
                            />
                            <span className="text-sm font-medium w-8 opacity-50 text-left">{numPages}</span>
                            </div>

                            <button 
                            onClick={nextPage} 
                            disabled={currentPage >= numPages}
                            className="text-xs font-bold uppercase tracking-wider opacity-60 hover:opacity-100 disabled:opacity-30"
                            >
                            Next
                            </button>
                        </div>
                      </>
                    )}
                </div>
                )}

                {/* Mode: Scroll */}
                {mode === 'scroll' && (
                <div key="scroll" className="w-full animate-view-enter px-4">
                    <div className="flex flex-col items-center space-y-8">
                    
                    {isLoading ? (
                      // Scroll Mode Skeletons
                      <>
                        <div 
                          className="bg-white shadow-lg relative rounded-lg overflow-hidden max-w-full" 
                          style={{ width: 800 * zoom, aspectRatio: '3/4', filter: isDarkMode ? 'brightness(0.9)' : 'none' }}
                        >
                          <SkeletonPage />
                        </div>
                        <div 
                          className="bg-white shadow-lg relative rounded-lg overflow-hidden max-w-full opacity-60" 
                          style={{ width: 800 * zoom, aspectRatio: '3/4', filter: isDarkMode ? 'brightness(0.9)' : 'none' }}
                        >
                          <SkeletonPage />
                        </div>
                      </>
                    ) : (
                      // Real Pages
                      Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
                        <div 
                            key={pageNum} 
                            className={`bg-white shadow-lg relative min-h-[500px] ${pageNum === currentPage ? 'ring-4 ring-[#F0A6CA]/50' : ''}`}
                            style={{ 
                                filter: isDarkMode ? 'brightness(0.9)' : 'none',
                                width: 'fit-content'
                            }}
                            onMouseEnter={() => {
                                if (pageNum !== currentPage) setCurrentPage(pageNum);
                            }}
                        >
                        <CanvasPage 
                            pdfDoc={pdfDoc} 
                            pageNum={pageNum} 
                            width={800 * zoom}
                            className="block"
                        />
                        <div className="absolute bottom-2 right-4 text-xs text-gray-400 font-mono">
                            Page {pageNum}
                        </div>
                        </div>
                      ))
                    )}
                    </div>
                </div>
                )}
            </>
            )}
        </div>
      </div>
    </div>
  );
};