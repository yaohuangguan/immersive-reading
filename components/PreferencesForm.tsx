import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPreferences } from '../types';
import { Target, Lightbulb, GraduationCap, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PreferencesFormProps {
  onConfirm: (prefs: UserPreferences) => void;
  bookTitle: string;
}

export const PreferencesForm: React.FC<PreferencesFormProps> = ({ onConfirm, bookTitle }) => {
  const { t } = useLanguage();
  
  // We store the localized string as the value to send to Gemini, as Gemini can handle multilingual inputs.
  const goals = [
    t.preferences.goals.casual, 
    t.preferences.goals.exam, 
    t.preferences.goals.deep, 
    t.preferences.goals.quick
  ];
  const availableInterests = [
    t.preferences.interestOptions.plot,
    t.preferences.interestOptions.char,
    t.preferences.interestOptions.themes,
    t.preferences.interestOptions.history,
    t.preferences.interestOptions.quotes,
    t.preferences.interestOptions.vocab
  ];
  const knowledgeLevels = [
    t.preferences.levels.none,
    t.preferences.levels.basic,
    t.preferences.levels.inter,
    t.preferences.levels.expert
  ];

  const [goal, setGoal] = useState<string>(goals[0]);
  const [interests, setInterests] = useState<string[]>([]);
  const [priorKnowledge, setPriorKnowledge] = useState<string>(knowledgeLevels[1]);

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ goal, interests, priorKnowledge });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-2xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-white mb-2">{t.preferences.title}</h2>
          <p className="text-slate-400">{t.preferences.subtitle} <span className="text-indigo-400 italic">{bookTitle}</span>.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Goal Section */}
          <div>
            <label className="flex items-center gap-2 text-indigo-300 font-bold mb-4">
              <Target size={20} /> {t.preferences.goal}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {goals.map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGoal(g)}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    goal === g 
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/20' 
                      : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Interests Section */}
          <div>
            <label className="flex items-center gap-2 text-indigo-300 font-bold mb-4">
              <Lightbulb size={20} /> {t.preferences.interests}
            </label>
            <div className="flex flex-wrap gap-2">
              {availableInterests.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                    interests.includes(interest)
                      ? 'bg-purple-600 border-purple-400 text-white'
                      : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Knowledge Section */}
          <div>
            <label className="flex items-center gap-2 text-indigo-300 font-bold mb-4">
              <GraduationCap size={20} /> {t.preferences.knowledge}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {knowledgeLevels.map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setPriorKnowledge(level)}
                  className={`py-3 px-2 rounded-xl text-center text-sm border transition-all ${
                    priorKnowledge === level
                      ? 'bg-emerald-600 border-emerald-400 text-white'
                      : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            {t.preferences.start} <Check size={20} />
          </button>

        </form>
      </motion.div>
    </div>
  );
};