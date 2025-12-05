import React from 'react';
import { ChapterGuide, ActivityType, Chapter } from '../../types';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, BrainCircuit, MessagesSquare, Library, ArrowRight } from 'lucide-react';
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

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case ActivityType.QUIZ: return <CheckCircle size={20} className="text-emerald-400" />;
      case ActivityType.FLASHCARDS: return <Library size={20} className="text-yellow-400" />;
      case ActivityType.ROLEPLAY: return <MessagesSquare size={20} className="text-purple-400" />;
      default: return <BrainCircuit size={20} />;
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
    <div className="flex flex-col h-full bg-[#0f172a]">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Header Content */}
        <div className="relative mb-0 p-6 sm:p-10 bg-gradient-to-br from-slate-900 to-slate-900 border-b border-indigo-500/20">
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-8 border-b border-slate-700 pb-4">
              {guide.chapterTitle}
            </h2>
            
            <div className="flex flex-col xl:flex-row gap-10">
                {/* Main Reading Area - Typography Optimized for Long Reading */}
                <div className="flex-1 order-2 xl:order-1">
                    <div className="prose prose-invert prose-lg max-w-none 
                      prose-headings:font-serif prose-headings:text-indigo-200 
                      prose-p:leading-relaxed prose-p:text-slate-300 prose-p:mb-6
                      prose-blockquote:border-l-indigo-500 prose-blockquote:bg-slate-800/30 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
                      prose-strong:text-indigo-300
                      prose-li:text-slate-300
                      ">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {guide.content}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Sidebar / Sidebar Info */}
                <div className="xl:w-80 shrink-0 space-y-6 order-1 xl:order-2">
                     {/* Takeaways Card */}
                    <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700 sticky top-4">
                        <h4 className="text-yellow-400 font-bold mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                           <BrainCircuit size={16} /> {t.hub.takeaways}
                        </h4>
                        <ul className="space-y-4">
                            {guide.keyPoints.map((point, idx) => (
                                <li key={idx} className="flex gap-3 text-sm text-slate-300 leading-snug">
                                    <span className="text-yellow-500/50 mt-1 shrink-0">•</span>
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        {/* Activities Section Footer */}
        <div className="p-6 sm:p-10 bg-slate-900/80 border-t border-slate-800">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BrainCircuit size={24} className="text-indigo-400" />
                {t.hub.activities}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {chapter.activities.map((type) => (
                    <motion.button
                        key={type}
                        whileHover={{ scale: 1.02, backgroundColor: "rgba(30, 41, 59, 1)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onLaunchActivity(type)}
                        className="flex items-center justify-between p-5 bg-slate-800 border border-slate-700 hover:border-indigo-500/50 rounded-xl transition-all group shadow-lg"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-900 rounded-lg group-hover:bg-indigo-500/20 transition-colors shadow-inner">
                                {getActivityIcon(type)}
                            </div>
                            <div className="text-left">
                              <span className="block font-bold text-slate-200 text-lg">{getActivityName(type)}</span>
                              <span className="text-xs text-slate-500">{t.hub.startActivity}</span>
                            </div>
                        </div>
                        <ArrowRight size={20} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                    </motion.button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};