import React from 'react';
import { StudyGuide } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Users, Lightbulb } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface StudyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  guide: StudyGuide | null;
  bookTitle: string;
}

export const StudyGuideModal: React.FC<StudyGuideModalProps> = ({ isOpen, onClose, guide, bookTitle }) => {
  const { t } = useLanguage();

  if (!guide) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-slate-900 border border-slate-700 w-full max-w-6xl h-[95vh] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center shrink-0">
              <div>
                <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase">{t.guide.title}</span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100">{bookTitle}</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-10 bg-[#0f172a]">
              
              {/* Summary Section */}
              <section className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6 text-emerald-400 border-b border-slate-700/50 pb-4">
                    <BookOpen size={28} />
                    <h3 className="text-2xl font-bold font-serif">{t.guide.summary}</h3>
                </div>
                <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {guide.globalSummary}
                    </ReactMarkdown>
                </div>
              </section>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Characters Section */}
                <section>
                    <div className="flex items-center gap-3 mb-6 text-purple-400">
                        <Users size={24} />
                        <h3 className="text-2xl font-bold font-serif">{t.guide.characters}</h3>
                    </div>
                    <div className="space-y-4">
                        {guide.characters.map((char, idx) => (
                            <div key={idx} className="bg-slate-800/60 p-6 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-colors shadow-md">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-bold text-slate-100 text-xl">{char.name}</h4>
                                    <span className="text-xs bg-purple-900/40 text-purple-300 px-3 py-1 rounded-full border border-purple-500/20">{char.role}</span>
                                </div>
                                <p className="text-base text-slate-400 leading-relaxed">{char.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Themes Section */}
                <section>
                    <div className="flex items-center gap-3 mb-6 text-yellow-400">
                        <Lightbulb size={24} />
                        <h3 className="text-2xl font-bold font-serif">{t.guide.themes}</h3>
                    </div>
                    <div className="space-y-4">
                        {guide.themes.map((theme, idx) => (
                            <div key={idx} className="bg-slate-800/60 p-6 rounded-xl border border-slate-700 hover:border-yellow-500/50 transition-colors shadow-md">
                                <h4 className="font-bold text-slate-100 text-xl mb-3 text-yellow-100/90">{theme.name}</h4>
                                <p className="text-base text-slate-400 leading-relaxed">{theme.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};