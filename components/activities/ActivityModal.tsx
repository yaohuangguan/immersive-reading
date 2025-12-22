import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-[#0f172a] sm:border border-slate-700 w-full sm:max-w-4xl h-[100dvh] sm:h-[90vh] sm:rounded-3xl shadow-2xl relative flex flex-col overflow-hidden"
          >
            {/* Header - Fixed Height */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-800 bg-slate-900/50 shrink-0 pt-safe sm:pt-6">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-indigo-100 truncate pr-4">{title}</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors active:scale-95 bg-slate-800/50"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content Area - Scrollable */}
            <div className="flex-1 overflow-y-auto relative no-scrollbar bg-[#0f172a]">
                {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};