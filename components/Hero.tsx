import React, { useEffect, useState } from 'react';

interface HeroProps {
  onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  const [loaded, setLoaded] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeEmote, setActiveEmote] = useState<string | null>(null);

  const emotes = ['❤️', '✨', '📚', '💡', '😮', '🔥', '👀'];

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleCharacterClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent bubbling issues
    if (isJumping) return;
    
    setIsJumping(true);
    const randomEmote = emotes[Math.floor(Math.random() * emotes.length)];
    setActiveEmote(randomEmote);

    setTimeout(() => {
      setIsJumping(false);
      setActiveEmote(null);
    }, 1200);
  };

  const handleDanglerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpinning) return;
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 1000);
  }

  return (
    <div className="relative bg-[#1a1a1a] pt-12 pb-24 overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-1deg); }
        }
        @keyframes stack-idle {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.02); }
        }
        @keyframes blink {
          0%, 45%, 55%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.1); }
        }
        @keyframes bounce-gentle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        @keyframes wave {
            0%, 100% { transform: rotate(-5deg); }
            50% { transform: rotate(15deg); }
        }
        @keyframes swing {
            0%, 100% { transform: rotate(-25deg); }
            50% { transform: rotate(25deg); }
        }
        @keyframes eyes-move {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(3px); }
            80% { transform: translateX(-3px); }
        }
        @keyframes jump-active {
            0% { transform: translateY(0) scale(1) rotate(0); }
            10% { transform: translateY(5px) scale(1.1, 0.9); }
            40% { transform: translateY(-60px) scale(0.9, 1.1) rotate(-5deg); }
            60% { transform: translateY(-30px) scale(0.95, 1.05) rotate(5deg); }
            100% { transform: translateY(0) scale(1) rotate(0); }
        }
        @keyframes emote-pop {
            0% { opacity: 0; transform: scale(0) translateY(10px); }
            50% { opacity: 1; transform: scale(1.2) translateY(-5px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes spin-fast {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes peek {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(-10px) rotate(-5deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite; }
        .animate-stack-idle { animation: stack-idle 5s ease-in-out infinite; }
        .animate-blink { animation: blink 4s infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 3s ease-in-out infinite; }
        .animate-wave { animation: wave 2s ease-in-out infinite; }
        .animate-swing { animation: swing 2.5s ease-in-out infinite; }
        .animate-eyes { animation: eyes-move 4s ease-in-out infinite; }
        .animate-jump-active { animation: jump-active 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .animate-emote-pop { animation: emote-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-spin-fast { animation: spin-fast 0.5s linear; }
        .animate-peek { animation: peek 3s ease-in-out infinite; }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
        {/* Massive Headline Section */}
        <div className={`relative transition-all duration-1000 transform mb-16 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative inline-block w-full">
            <h1 className="text-[13vw] sm:text-[12vw] leading-[0.85] font-black text-white tracking-tighter uppercase select-none relative z-10">
              <span className="relative">
                Storytelling
                
                {/* NEW CHARACTER 1: The Dangler (Blue) */}
                <div 
                  onClick={handleDanglerClick}
                  className={`absolute top-full right-4 sm:right-12 w-12 h-16 sm:w-16 sm:h-20 cursor-pointer origin-top z-20 hover:scale-110 transition-transform ${isSpinning ? 'animate-spin-fast' : 'animate-swing'}`}
                  style={{ animationDuration: isSpinning ? '0.5s' : '2.5s' }}
                >
                   {/* String */}
                   <div className="absolute top-[-10px] left-1/2 w-1 h-4 bg-white/20"></div>
                   {/* Body */}
                   <div className="w-full h-full bg-[#A6D8F0] rounded-b-3xl rounded-t-lg border-4 border-black shadow-lg relative overflow-hidden">
                      {/* Eyes Upside down */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                         <div className="w-3 h-3 bg-white rounded-full border-2 border-black flex items-center justify-center">
                            <div className="w-1 h-1 bg-black rounded-full animate-blink"></div>
                         </div>
                         <div className="w-3 h-3 bg-white rounded-full border-2 border-black flex items-center justify-center">
                            <div className="w-1 h-1 bg-black rounded-full animate-blink" style={{ animationDelay: '0.3s' }}></div>
                         </div>
                      </div>
                      {/* Mouth */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-2 border-t-2 border-black rounded-t-full"></div>
                   </div>
                </div>
              </span>
              <br />
              <span className="text-white relative inline-block">
                Sanctuary
                {/* Original Character Mascot sitting on the "Y" */}
                <div 
                  onClick={handleCharacterClick}
                  className={`absolute -top-14 -right-2 sm:-top-20 sm:-right-4 md:-top-24 md:-right-6 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 cursor-pointer z-20 transition-transform ${isJumping ? 'animate-jump-active' : 'animate-float-delayed hover:scale-110'}`}
                  title="Click me!"
                >
                   {/* Emote Bubble */}
                   {activeEmote && (
                     <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white text-2xl p-2 rounded-xl shadow-xl border-2 border-black animate-emote-pop z-30 whitespace-nowrap">
                       {activeEmote}
                       <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-black rotate-45"></div>
                     </div>
                   )}

                   {/* Character Body */}
                   <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
                      {/* Legs swinging */}
                      <g className="animate-swing origin-top" style={{ animationDuration: '3s', animationDelay: '1s' }}>
                        <path d="M35 75 Q 35 90 25 90" stroke="black" strokeWidth="6" fill="none" strokeLinecap="round" />
                        <path d="M65 75 Q 65 90 75 90" stroke="black" strokeWidth="6" fill="none" strokeLinecap="round" />
                      </g>
                      
                      {/* Body Blob */}
                      <path 
                        d="M15 50 Q 15 20 50 20 Q 85 20 85 50 Q 85 80 50 80 Q 15 80 15 50 Z" 
                        fill="#F0A6CA" 
                        stroke="black" 
                        strokeWidth="4" 
                      />
                      
                      {/* Face */}
                      <g className="animate-eyes">
                         {/* Glasses/Eyes */}
                         <circle cx="35" cy="45" r="10" fill="white" stroke="black" strokeWidth="2" />
                         <circle cx="65" cy="45" r="10" fill="white" stroke="black" strokeWidth="2" />
                         
                         {/* Pupils */}
                         <g className="animate-blink origin-center">
                           <circle cx="35" cy="45" r="3" fill="black" />
                           <circle cx="65" cy="45" r="3" fill="black" />
                         </g>
                         
                         {/* Bridge of glasses */}
                         <path d="M45 45 L 55 45" stroke="black" strokeWidth="2" />
                      </g>
                      
                      {/* Smile */}
                      <path d="M40 60 Q 50 65 60 60" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
                   </svg>
                </div>
              </span>
            </h1>
          </div>
        </div>

        {/* Lower Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
           
           {/* Left: Description */}
           <div className={`transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Discover a world of <br/>
                <span className="text-[#F0A6CA]">stories, genres, and authors</span> <br/>
                curated just for you
              </h2>
              <p className="text-gray-400 text-lg max-w-xl mb-8 leading-relaxed">
                Through our innovative recommendation system, we ensure that each visit is a delightful discovery of new literary gems tailored to your unique tastes.
              </p>
              
              <div className="relative inline-block">
                {/* NEW CHARACTER 2: The Button Lurker */}
                <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 -translate-x-2 animate-peek z-0">
                    <div className="w-12 h-12 bg-[#D4F0A6] rounded-full border-4 border-black flex items-center justify-center">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-black rounded-full"></div>
                            <div className="w-2 h-2 bg-black rounded-full"></div>
                        </div>
                    </div>
                </div>

                <button 
                  onClick={onExplore}
                  className="relative z-10 group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-[#F0A6CA] transition-all"
                >
                  Start Exploring
                  <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-45 transition-transform">
                    →
                  </span>
                </button>
              </div>
           </div>

           {/* Right: Book Stack Illustration */}
           <div className={`relative hidden lg:flex justify-end pr-12 transition-all duration-1000 delay-500 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              
              {/* Stack Container */}
              <div className="relative w-80 animate-stack-idle">
                 
                 {/* Book 1 (Bottom) */}
                 <div className="h-16 w-80 bg-[#FEF9E7] border-4 border-[#1a1a1a] rounded-r-lg mb-[-8px] relative z-10 transform -rotate-1 shadow-lg flex items-center justify-between px-4">
                    <div className="h-full w-4 border-r-4 border-[#1a1a1a] bg-[#1a1a1a]/5"></div>
                    <div className="w-full h-2 bg-[#1a1a1a]/10 rounded-full mx-4"></div>
                 </div>

                 {/* Book 2 */}
                 <div className="h-14 w-72 bg-[#F0A6CA] border-4 border-[#1a1a1a] rounded-r-lg mb-[-8px] relative z-20 ml-4 transform rotate-2 shadow-lg flex items-center justify-between px-4">
                    <div className="h-full w-4 border-r-4 border-[#1a1a1a] bg-[#1a1a1a]/5"></div>
                    <span className="font-bold text-[#1a1a1a] text-xs uppercase tracking-widest">Adventure</span>
                 </div>

                 {/* Book 3 */}
                 <div className="h-16 w-76 bg-[#333] border-4 border-[#1a1a1a] rounded-r-lg mb-[-8px] relative z-30 ml-2 transform -rotate-1 shadow-lg flex items-center px-4">
                     <div className="h-full w-4 border-r-4 border-[#555] bg-white/5"></div>
                     <div className="flex gap-2 ml-4">
                        <div className="w-8 h-8 rounded-full border-2 border-[#555] flex items-center justify-center text-[#555] font-bold text-xs">A</div>
                        <div className="w-8 h-8 rounded-full border-2 border-[#555] flex items-center justify-center text-[#555] font-bold text-xs">Z</div>
                     </div>
                 </div>

                 {/* Book 4 (Top) */}
                 <div className="h-20 w-64 bg-[#FEF9E7] border-4 border-[#1a1a1a] rounded-r-lg relative z-40 ml-8 transform rotate-3 shadow-xl flex items-center justify-center">
                    <div className="w-24 h-10 border-2 border-[#1a1a1a] bg-white flex items-center justify-center">
                       <div className="w-16 h-1 bg-[#1a1a1a]"></div>
                    </div>
                 </div>

                 {/* Top Decor - Mini Character */}
                 <div className="absolute top-[-50px] left-20 z-50 animate-bounce-gentle">
                    <div className="w-16 h-16 bg-[#F0A6CA] rounded-full border-4 border-[#1a1a1a] flex items-center justify-center">
                       <div className="flex gap-2">
                          <div className="w-2 h-2 bg-[#1a1a1a] rounded-full animate-blink"></div>
                          <div className="w-2 h-2 bg-[#1a1a1a] rounded-full animate-blink" style={{ animationDelay: '0.2s' }}></div>
                       </div>
                    </div>
                 </div>

              </div>
           </div>

        </div>
      </div>
    </div>
  );
};