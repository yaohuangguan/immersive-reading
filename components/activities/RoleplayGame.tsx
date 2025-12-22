import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../../types';
import { chatWithCharacter, getRoleplaySystemInstruction } from '../../services/geminiService';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface RoleplayGameProps {
  bookTitle: string;
  chapterTitle: string;
  onComplete: () => void;
}

export const RoleplayGame: React.FC<RoleplayGameProps> = ({ bookTitle, chapterTitle, onComplete }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      startChat();
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const startChat = async () => {
    setIsTyping(true);
    try {
      const systemInstruction = getRoleplaySystemInstruction(bookTitle, chapterTitle, language);
      const introPrompt = language === 'zh' ? "你好！你是谁？" : "Hello! Who are you?";
      
      const response = await chatWithCharacter([], introPrompt, systemInstruction);
      setMessages([{ id: '1', role: 'model', text: response || (language === 'zh' ? "你好！" : "Hello!") }]);
    } catch (e) {
      setMessages([{ id: '1', role: 'model', text: language === 'zh' ? "我暂时无法连接到故事世界。" : "I'm having trouble connecting to the story right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const systemInstruction = getRoleplaySystemInstruction(bookTitle, chapterTitle, language);
      const history = messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
      }));
      
      const response = await chatWithCharacter(history, userMsg.text, systemInstruction);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response || "..."
      }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 pb-4" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-purple-600'}`}>
               {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`p-3 sm:p-4 rounded-2xl max-w-[85%] text-sm sm:text-base ${msg.role === 'user' ? 'bg-indigo-600/20 text-indigo-100 rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
               <Bot size={16} />
             </div>
             <div className="p-3 rounded-2xl rounded-tl-none bg-slate-800">
               <Loader2 size={16} className="animate-spin text-slate-400" />
             </div>
           </div>
        )}
      </div>

      {/* Input Area - Fixed at bottom of container */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 pb-safe">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.activities.typePlaceholder}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-full px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-500 text-base"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};