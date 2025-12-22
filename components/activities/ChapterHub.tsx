import React, { useState } from 'react';
import { ChapterGuide, ActivityType, Chapter } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, BrainCircuit, MessagesSquare, Library, ArrowRight, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChapterHubProps {
  guide: ChapterGuide;
  chapter: Chapter;
  onLaunchActivity: (type: ActivityType) => void;
}

export const ChapterHub: React.FC<ChapterHubProps> = ({ guide, chapter, onLaunchActivity }) => {
  const { t } = useLanguage();
  const [showTakeaways, setShowTakeaways] = useState(false);

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case ActivityType.QUIZ: return <CheckCircle size={24} className="text-emerald-400" />;
      case ActivityType.FLASHCARDS: return <Library size={24} className="text-yellow-400" />;
      case ActivityType.ROLEPLAY: return <MessagesSquare size={24} className="text-purple-400" />;
      default: return <BrainCircuit size={24} />;
    }
  };

  const getActivityName = (type: ActivityType) => {
    switch (type) {
      case ActivityType.QUIZ: return t.activities.quiz;
      case ActivityType.FLASHCARDS: return t.activities.flashcards;
      case ActivityType.ROLEPLAY: return t.activities.roleplay;
      default: return type;
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#0f172a]">
      {/* Content Container */}
      <div className="flex-1 p-4 sm:p-10 pb-32">
        
        <div className="max-w-3xl mx-auto">
            {/* Title */}
            <div className="mb-6 sm:mb-10 text-center sm:text-left">
                <span className="text-xs font-bold text-indigo-400 tracking-widest uppercase mb-2 block">{t.hub.readFirst}</span>
                <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
                {guide.chapterTitle}
                </h2>
            </div>

            {/* Mobile/Desktop Takeaways - Collapsible on Mobile, Sidebar on Desktop logic simplified to top card */}
            <div className="mb-8 rounded-xl bg-slate-800/60 border border-slate-700 overflow-hidden">
                <button 
                    onClick={() => setShowTakeaways(!showTakeaways)}
                    className="w-full flex items-center justify-between p-4 text-left"
                >
                    <h4 className="text-yellow-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                        <BrainCircuit size={16} /> {t.hub.takeaways}
                    </h4>
                    {showTakeaways ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                </button>
                
                <AnimatePresence initial={false}>
                    {(showTakeaways || window.innerWidth >= 768) && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 pb-4 sm:block"
                        >
                             <ul className="space-y-3 pt-2 border-t border-slate-700/50">
                                {guide.keyPoints.map((point, idx) => (
                                    <li key={idx} className="flex gap-3 text-sm sm:text-base text-slate-300 leading-snug">
                                        <span className="text-yellow-500/50 mt-1 shrink-0">•</span>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Main Reading Content */}
            <div className="prose prose-base sm:prose-lg max-w-none prose-invert
                prose-headings:font-serif prose-headings:text-indigo-200 
                prose-p:leading-relaxed prose-p:text-slate-300 prose-p:mb-6 prose-p:text-[17px] sm:prose-p:text-lg
                prose-blockquote:border-l-indigo-500 prose-blockquote:bg-slate-800/30 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                prose-strong:text-indigo-300
                prose-li:text-slate-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {guide.content}
                </ReactMarkdown>
            </div>
        </div>
      </div>

      {/* Footer Activities - Sticky/Fixed bottom for easy access */}
      <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-[#0f172a]/95 backdrop-blur-md border-t border-slate-800 z-20 pb-safe">
        <div className="max-w-4xl mx-auto">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                {t.hub.activities}
            </h3>
            <div className="grid grid-cols-3 gap-3">
                {chapter.activities.map((type) => (
                    <motion.button
                        key={type}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onLaunchActivity(type)}
                        className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-4 p-3 sm:p-4 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-all shadow-lg active:border-indigo-500"
                    >
                        <div className="p-2 bg-slate-900 rounded-lg text-slate-200">
                            {getActivityIcon(type)}
                        </div>
                        <div className="text-center sm:text-left">
                            <span className="block font-bold text-slate-200 text-xs sm:text-base leading-tight">{getActivityName(type)}</span>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};