import React from 'react';
import { Chapter } from '../types';
import { Lock, CheckCircle2, PlayCircle, Star, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface LearningMapProps {
  chapters: Chapter[];
  currentChapterId: number;
  onSelectChapter: (chapterId: number) => void;
}

export const LearningMap: React.FC<LearningMapProps> = ({ chapters, currentChapterId, onSelectChapter }) => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 relative">
      {/* Connecting Line */}
      <div className="absolute left-8 top-12 bottom-12 w-1 bg-slate-800 rounded-full" />

      <div className="space-y-12">
        {chapters.map((chapter, index) => {
          const isActive = !chapter.isLocked && !chapter.isCompleted;
          
          return (
            <motion.div 
              key={chapter.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex items-start gap-6 group ${chapter.isLocked ? 'opacity-60 grayscale' : ''}`}
            >
              {/* Node Icon */}
              <button 
                disabled={chapter.isLocked}
                onClick={() => onSelectChapter(chapter.id)}
                className={`
                  relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border-4 transition-all duration-300 shadow-xl
                  ${chapter.isCompleted 
                    ? 'bg-green-500 border-green-600 text-white shadow-green-900/20' 
                    : isActive 
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-indigo-500/40 scale-110' 
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                  }
                `}
              >
                {chapter.isCompleted ? (
                  <CheckCircle2 size={32} />
                ) : chapter.isLocked ? (
                  <Lock size={24} />
                ) : (
                  <PlayCircle size={32} fill="currentColor" className="text-white" />
                )}
              </button>

              {/* Content Card */}
              <div 
                onClick={() => !chapter.isLocked && onSelectChapter(chapter.id)}
                className={`
                    flex-1 p-6 rounded-2xl border border-slate-800 bg-slate-800/40 backdrop-blur-sm transition-all
                    ${!chapter.isLocked ? 'cursor-pointer hover:bg-slate-800 hover:border-slate-700' : ''}
                    ${isActive ? 'ring-1 ring-indigo-500/50 bg-slate-800/80' : ''}
                `}
              >
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {t.map.chapter} {chapter.id}
                    </span>
                    {chapter.activities && (
                        <div className="flex gap-1">
                            {chapter.activities.length > 0 && <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-md">{chapter.activities.length} {t.map.activities}</span>}
                        </div>
                    )}
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-2 font-serif">{chapter.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-2">{chapter.description}</p>
                
                {!chapter.isLocked && isActive && (
                     <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
                        <span className="text-xs font-medium text-indigo-300 flex items-center gap-1">
                            <Star size={12} fill="currentColor" /> {t.map.earn} +150 XP
                        </span>
                        <div className="text-xs font-bold text-white bg-indigo-600 px-3 py-1 rounded-full flex items-center gap-1">
                            <BookOpen size={12} /> {t.map.start}
                        </div>
                     </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};