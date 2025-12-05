import React, { useState } from 'react';
import { QuizQuestion } from '../../types';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface QuizGameProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { t } = useLanguage();

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);
    if (index === currentQuestion.correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      onComplete(score);
    }
  };

  if (!currentQuestion) return <div>Loading questions...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8 flex justify-between items-center text-sm text-slate-400 font-medium">
        <span>{t.activities.question} {currentIndex + 1} / {questions.length}</span>
        <span>{t.activities.score}: {score}</span>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed font-serif">
          {currentQuestion.question}
        </h3>

        <div className="space-y-4">
          {currentQuestion.options.map((option, idx) => {
            let stateStyle = "border-slate-700 bg-slate-800 hover:bg-slate-700";
            
            if (showResult) {
              if (idx === currentQuestion.correctAnswerIndex) {
                stateStyle = "border-green-500 bg-green-500/10 text-green-200";
              } else if (idx === selectedOption) {
                stateStyle = "border-red-500 bg-red-500/10 text-red-200";
              } else {
                stateStyle = "border-slate-800 bg-slate-800/50 opacity-50";
              }
            } else if (selectedOption === idx) {
                 stateStyle = "border-indigo-500 bg-indigo-500/20";
            }

            return (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleOptionClick(idx)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all flex justify-between items-center group ${stateStyle}`}
                disabled={showResult}
              >
                <span className="text-lg text-slate-200 group-hover:text-white transition-colors">{option}</span>
                {showResult && idx === currentQuestion.correctAnswerIndex && <Check className="text-green-500 shrink-0 ml-4" />}
                {showResult && idx === selectedOption && idx !== currentQuestion.correctAnswerIndex && <X className="text-red-500 shrink-0 ml-4" />}
              </motion.button>
            );
          })}
        </div>
      </div>

      {showResult && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 mb-6 shadow-lg"
        >
          <p className="text-slate-300 leading-relaxed text-lg">
            <span className="font-bold text-indigo-400 block mb-2">{t.activities.insight}: </span> 
            {currentQuestion.explanation}
          </p>
        </motion.div>
      )}

      <div className="flex justify-end pt-4">
        <button
          onClick={nextQuestion}
          disabled={!showResult}
          className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
            showResult 
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transform hover:-translate-y-1' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          {currentIndex === questions.length - 1 ? t.activities.finish : t.activities.next}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};