import React, { useState } from 'react';
import { Flashcard } from '../../types';
import { motion } from 'framer-motion';
import { RotateCw, ChevronRight, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface FlashcardsGameProps {
  cards: Flashcard[];
  onComplete: () => void;
}

export const FlashcardsGame: React.FC<FlashcardsGameProps> = ({ cards, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { t } = useLanguage();

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(c => c - 1);
    }
  };

  const currentCard = cards[currentIndex];

  if (!currentCard) return <div>Loading cards...</div>;

  return (
    <div className="flex flex-col items-center justify-center h-full py-10 px-4">
      {/* 
        3D Flip Container 
        Note: To avoid "mirrored" text on the back, we rotate the back card 180deg initially.
        When parent rotates 180deg, the back card becomes 360deg (0deg visual), fixing the mirror effect.
      */}
      <div 
        className="perspective-1000 w-full max-w-2xl h-96 cursor-pointer group" 
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="relative w-full h-full text-center transition-all duration-500 transform-style-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* Front Card */}
          <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 border border-white/10 z-20">
            <span className="text-sm font-medium text-white/60 mb-6 uppercase tracking-widest">{t.activities.term}</span>
            <h3 className="text-4xl font-serif font-bold text-white leading-tight">{currentCard.front}</h3>
            <div className="absolute bottom-6 text-white/40 text-sm flex items-center gap-2">
                <RotateCw size={14} /> {t.activities.flip}
            </div>
          </div>

          {/* Back Card */}
          <div 
            className="absolute inset-0 backface-hidden bg-slate-800 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-10 border border-slate-600 z-10 rotate-y-180"
          >
             <span className="text-sm font-medium text-indigo-400 mb-6 uppercase tracking-widest">{t.activities.definition}</span>
             <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-light">{currentCard.back}</p>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-8 mt-12">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-4 rounded-full bg-slate-800 text-white disabled:opacity-30 hover:bg-slate-700 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="text-slate-400 font-mono text-lg">
            {currentIndex + 1} / {cards.length}
        </span>
        <button 
          onClick={handleNext}
          className="p-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30"
        >
          {currentIndex === cards.length - 1 ? <CheckCompleteIcon /> : <ChevronRight size={24} />}
        </button>
      </div>
    </div>
  );
};

const CheckCompleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
)