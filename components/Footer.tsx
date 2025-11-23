import React from 'react';
import { Instagram, Heart, Smile } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#111] text-white pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      <style>{`
        @keyframes snore {
            0% { transform: scale(0) translateY(0); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: scale(1.5) translateY(-20px) translateX(10px); opacity: 0; }
        }
        .animate-snore { animation: snore 2.5s ease-out infinite; }
      `}</style>

      {/* NEW CHARACTER: The Napper */}
      <div className="absolute top-0 right-12 md:right-32 transform -translate-y-1/2">
         <div className="relative">
            {/* Zzz bubbles */}
            <div className="absolute -top-8 right-0 text-white font-bold text-lg animate-snore">Z</div>
            <div className="absolute -top-12 right-4 text-white font-bold text-sm animate-snore" style={{ animationDelay: '0.8s' }}>Z</div>
            
            {/* Body */}
            <div className="w-20 h-12 bg-[#FEF9E7] rounded-t-full border-4 border-[#1a1a1a] relative z-10">
               {/* Closed Eyes */}
               <div className="absolute top-4 left-4 w-3 h-3 border-b-2 border-black rounded-full"></div>
               <div className="absolute top-4 right-4 w-3 h-3 border-b-2 border-black rounded-full"></div>
               {/* Mouth */}
               <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-pink-300 rounded-full"></div>
            </div>
         </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 relative z-10">
        
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Smile className="w-8 h-8 text-[#F0A6CA]" />
            <h4 className="text-2xl font-bold">ReadSphere</h4>
          </div>
          <h2 className="text-4xl font-bold mb-6 max-w-md leading-tight">
            A sanctuary for stories in a digital world.
          </h2>
        </div>

        <div>
           <h5 className="font-bold text-[#F0A6CA] uppercase tracking-wider mb-6 text-xs">Explore</h5>
           <ul className="space-y-4">
              <li><button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-400 hover:text-white transition-colors text-left">Our Story</button></li>
              <li><button onClick={() => document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-400 hover:text-white transition-colors text-left">Library</button></li>
              <li><button onClick={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-400 hover:text-white transition-colors text-left">Community</button></li>
           </ul>
        </div>

        <div>
           <h5 className="font-bold text-[#F0A6CA] uppercase tracking-wider mb-6 text-xs">Connect</h5>
           <div className="flex flex-col gap-4 mb-6">
              <a 
                href="https://instagram.com/ruthwik_008" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#F0A6CA] transition-colors group"
              >
                <div className="p-2 bg-white/5 rounded-full group-hover:bg-[#F0A6CA] group-hover:text-black transition-colors">
                  <Instagram className="w-5 h-5" />
                </div>
                <span className="font-medium">@ruthwik_008</span>
              </a>
           </div>
           <p className="text-gray-500 text-sm">hello@readsphere.com</p>
        </div>

      </div>

      <div className="max-w-[1400px] mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 relative z-10">
        <span>&copy; {new Date().getFullYear()} ReadSphere Sanctuary.</span>
        <div className="flex items-center gap-1 mt-4 md:mt-0">
          <span>Crafted with</span>
          <Heart className="w-3 h-3 text-[#F0A6CA] fill-current" />
          <span>by Ruthwik Goparaju.</span>
        </div>
      </div>
    </footer>
  );
};