import React, { useState } from 'react';
import { Upload, BookOpen, Sparkles, Search, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
  onStart: (title: string, content?: string) => void;
  isLoading: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onStart, isLoading }) => {
  const [title, setTitle] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const { t, language, setLanguage } = useLanguage();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    let content = "";
    if (file.type === "text/plain") {
        content = await file.text();
    }
    const guessTitle = file.name.replace(/\.[^/.]+$/, "");
    onStart(guessTitle, content);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) onStart(title);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden pt-safe">
      {/* Language Toggle */}
      <div className="absolute top-6 right-6 z-20 mt-safe">
        <button 
          onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-all active:scale-95"
        >
          <Globe size={16} />
          <span className="text-sm font-medium">{language === 'en' ? 'English' : '中文'}</span>
        </button>
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} 
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-80 h-80 md:w-96 md:h-96 bg-purple-600 rounded-full blur-[100px]" 
        />
        <motion.div 
           animate={{ scale: [1, 1.5, 1], rotate: [0, -45, 0] }} 
           transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-40 -left-20 w-60 h-60 md:w-72 md:h-72 bg-blue-600 rounded-full blur-[80px]" 
        />
      </div>

      <div className="max-w-3xl w-full text-center space-y-6 md:space-y-8 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl shadow-indigo-500/30">
              <BookOpen size={40} className="text-white md:w-12 md:h-12" />
            </div>
          </div>
          <h1 className="text-4xl md:text-7xl font-bold font-serif mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 leading-tight">
            ImmerseRead
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto px-4">
            {t.hero.subtitle}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl mx-2"
        >
            {isLoading ? (
                <div className="flex flex-col items-center py-12 space-y-4">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-indigo-300 animate-pulse">{t.hero.analyzing}</p>
                    <p className="text-sm text-slate-500">{t.hero.generating}</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Drag Drop Zone */}
                    <div 
                        className={`border-2 border-dashed rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center transition-all cursor-pointer h-full min-h-[180px] md:min-h-[250px]
                        ${dragActive ? "border-indigo-400 bg-indigo-500/10" : "border-slate-600 hover:border-indigo-400/50 hover:bg-slate-700/30 active:bg-slate-700/50"}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('file-upload')?.click()}
                    >
                        <Upload size={32} className="text-indigo-400 mb-3 md:mb-4" />
                        <p className="font-medium text-slate-200 mb-2">{t.hero.drag}</p>
                        <p className="text-xs md:text-sm text-slate-500">{t.hero.formats}</p>
                        <input 
                            id="file-upload" 
                            type="file" 
                            className="hidden" 
                            onChange={handleChange}
                            accept=".pdf,.epub,.txt"
                        />
                    </div>

                    {/* Manual Input */}
                    <div className="flex flex-col h-full justify-center space-y-6">
                        <div className="relative md:block hidden">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-700"></span>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-slate-800/0 px-2 text-slate-500 bg-slate-900">{t.hero.or}</span>
                            </div>
                        </div>
                        <div className="md:hidden flex items-center gap-4">
                            <span className="h-px bg-slate-700 flex-1"></span>
                            <span className="text-slate-500 text-sm">{t.hero.or}</span>
                            <span className="h-px bg-slate-700 flex-1"></span>
                        </div>
                        
                        <form onSubmit={handleManualSubmit} className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                                <input 
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder={t.hero.placeholder}
                                    className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={!title.trim()}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                            >
                                <Sparkles size={20} />
                                {t.hero.button}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </motion.div>
      </div>
    </div>
  );
};