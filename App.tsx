import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { LearningMap } from './components/LearningMap';
import { ActivityModal } from './components/activities/ActivityModal';
import { QuizGame } from './components/activities/QuizGame';
import { FlashcardsGame } from './components/activities/FlashcardsGame';
import { RoleplayGame } from './components/activities/RoleplayGame';
import { ChapterHub } from './components/activities/ChapterHub';
import { PreferencesForm } from './components/PreferencesForm';
import { StudyGuideModal } from './components/StudyGuideModal';
import { generateLearningPlan, generateQuiz, generateFlashcards, generateStudyGuide, generateChapterGuide } from './services/geminiService';
import { AppState, ActivityType, QuizQuestion, Flashcard, UserPreferences, ChapterGuide } from './types';
import { Award, BookOpenText, Library, Globe, ArrowLeft, X } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';

const App: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  
  const [state, setState] = useState<AppState>({
    currentBook: null,
    chapters: [],
    studyGuide: null,
    xp: 0,
    level: 1,
    isLoading: false,
    loadingMessage: ''
  });

  const [pendingBookData, setPendingBookData] = useState<{ title: string; content?: string } | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showStudyGuide, setShowStudyGuide] = useState(false);

  // Tracks which Chapter Hub is open
  const [currentChapterId, setCurrentChapterId] = useState<number | null>(null);
  const [chapterGuideData, setChapterGuideData] = useState<ChapterGuide | null>(null);

  // Tracks the sub-activity (Quiz/Game) running on top of the hub
  const [activeActivity, setActiveActivity] = useState<{
    type: ActivityType;
    data: any;
    title: string;
  } | null>(null);

  // 1. Initial File Drop / Title Enter
  const handleUploadInit = (title: string, content?: string) => {
    setPendingBookData({ title, content });
    setShowPreferences(true);
  };

  // 2. Preferences Confirmed - Start Generation
  const handleGenerateCourse = async (preferences: UserPreferences) => {
    if (!pendingBookData) return;
    setUserPreferences(preferences);
    setShowPreferences(false);
    setState(prev => ({ ...prev, isLoading: true, loadingMessage: `${t.app.creating} & ${t.hero.analyzing}` }));

    try {
      // Run Study Guide and Learning Plan generation in parallel for speed
      const [chapters, studyGuide] = await Promise.all([
        generateLearningPlan(pendingBookData.title, pendingBookData.content, preferences, language),
        generateStudyGuide(pendingBookData.title, pendingBookData.content, language)
      ]);
      
      setState({
        currentBook: {
          title: pendingBookData.title,
          author: "AI Detected", 
          coverColor: "indigo",
          totalChapters: chapters.length
        },
        chapters: chapters,
        studyGuide: studyGuide,
        xp: 0,
        level: 1,
        isLoading: false,
        loadingMessage: ''
      });
    } catch (error) {
      console.error("Failed to generate plan:", error);
      alert("Something went wrong generating the course. Please try again.");
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // 3. User Clicks a Chapter Node -> Generates Guide -> Opens Hub
  const handleChapterSelect = async (chapterId: number) => {
    const chapter = state.chapters.find(c => c.id === chapterId);
    if (!chapter || !userPreferences || !state.currentBook) return;

    setState(prev => ({ ...prev, isLoading: true, loadingMessage: `${t.app.preparing} ${chapter.title}...` }));

    try {
      // Fetch the Guided Reading content
      const guide = await generateChapterGuide(state.currentBook.title, chapter.title, userPreferences, language);
      
      setChapterGuideData(guide);
      setCurrentChapterId(chapterId);
      setActiveActivity(null); // Ensure no game is running initially

    } catch (e) {
      console.error(e);
      alert("Failed to load chapter content.");
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // 4. User clicks an activity button inside ChapterHub
  const handleLaunchActivity = async (type: ActivityType) => {
      const chapter = state.chapters.find(c => c.id === currentChapterId);
      if (!chapter || !state.currentBook) return;

      setState(prev => ({ ...prev, isLoading: true, loadingMessage: `${t.app.preparing} Activity...` }));
      
      try {
        if (type === ActivityType.QUIZ) {
            const questions = await generateQuiz(state.currentBook.title, chapter.title, language);
            setActiveActivity({ type: ActivityType.QUIZ, data: questions, title: `${t.activities.quiz}: ${chapter.title}` });
        } else if (type === ActivityType.FLASHCARDS) {
            const cards = await generateFlashcards(state.currentBook.title, chapter.title, language);
            setActiveActivity({ type: ActivityType.FLASHCARDS, data: cards, title: `${t.activities.flashcards}: ${chapter.title}` });
        } else if (type === ActivityType.ROLEPLAY) {
            setActiveActivity({ type: ActivityType.ROLEPLAY, data: {}, title: `${t.activities.roleplay}: ${chapter.title}` });
        }
      } catch (e) {
          console.error(e);
      } finally {
          setState(prev => ({ ...prev, isLoading: false }));
      }
  };

  const handleActivityComplete = (xpEarned: number = 100) => {
    const chapterId = currentChapterId;
    
    setState(prev => {
        const nextChapters = prev.chapters.map(c => {
            if (c.id === chapterId) return { ...c, isCompleted: true };
            if (c.id === chapterId! + 1) return { ...c, isLocked: false };
            return c;
        });
        return {
            ...prev,
            chapters: nextChapters,
            xp: prev.xp + xpEarned
        };
    });
    
    // Return to hub, but keep hub open
    setActiveActivity(null);
  };

  const closeHub = () => {
    setCurrentChapterId(null);
    setChapterGuideData(null);
    setActiveActivity(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-indigo-500/30 flex flex-col">
      
      {/* 1. Hero / Landing */}
      {!state.currentBook && !state.isLoading && (
        <Hero onStart={handleUploadInit} isLoading={false} />
      )}

      {/* 1.5 Loading State */}
      {state.isLoading && (
          <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#0f172a]/90 backdrop-blur-sm p-6 text-center">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
              <h2 className="text-2xl font-serif font-bold text-white mb-2">{t.app.creating}</h2>
              <p className="text-indigo-300 animate-pulse">{state.loadingMessage}</p>
          </div>
      )}

      {/* 2. Preferences Modal */}
      {showPreferences && pendingBookData && (
        <PreferencesForm 
            bookTitle={pendingBookData.title} 
            onConfirm={handleGenerateCourse} 
        />
      )}

      {/* 3. Main Dashboard */}
      {state.currentBook && !state.isLoading && (
        <div className="flex-1 flex flex-col pb-safe">
          <header className="sticky top-0 z-30 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 pt-safe transition-all">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                    <BookOpenText size={18} className="text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="font-bold text-base font-serif leading-none truncate">{state.currentBook.title}</h1>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">{t.app.subtitle}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button 
                    onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
                    className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                    <Globe size={18} />
                </button>

                <button 
                    onClick={() => setShowStudyGuide(true)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-indigo-400 transition-colors"
                    aria-label={t.app.studyGuide}
                >
                    <Library size={18} />
                </button>
                
                <div className="flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1 rounded-full border border-slate-700">
                    <Award size={14} className="text-yellow-500" />
                    <span className="font-mono font-bold text-xs text-yellow-100">{state.xp}</span>
                </div>

                <button 
                  onClick={() => setState(prev => ({ ...prev, currentBook: null }))}
                  className="p-2 hover:bg-red-900/20 text-slate-500 hover:text-red-400 rounded-full transition-colors"
                  aria-label={t.app.exit}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1">
             <div className="text-center py-8 px-4">
                 <h2 className="text-2xl md:text-3xl font-bold font-serif mb-2">{t.app.journey}</h2>
                 <p className="text-sm md:text-base text-slate-400">{t.app.journeySub}</p>
             </div>
             
             <LearningMap 
                chapters={state.chapters} 
                currentChapterId={state.chapters.find(c => !c.isCompleted && !c.isLocked)?.id || 1}
                onSelectChapter={handleChapterSelect}
             />
          </main>
        </div>
      )}

      {/* 4. CHAPTER HUB & ACTIVITIES */}
      <ActivityModal
        isOpen={!!currentChapterId}
        onClose={closeHub}
        title={activeActivity ? activeActivity.title : (chapterGuideData?.chapterTitle || "")}
      >
        {/* If an activity is active, show that activity. Otherwise show Hub. */}
        {activeActivity ? (
            <div className="relative h-full flex flex-col">
                <div className="absolute top-0 left-0 w-full z-10 p-4 bg-gradient-to-b from-slate-900 to-transparent">
                  <button 
                      onClick={() => setActiveActivity(null)}
                      className="flex items-center gap-1 text-sm text-slate-200 bg-slate-800/80 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-slate-700"
                  >
                      <ArrowLeft size={16} /> {t.hub.back}
                  </button>
                </div>
                
                <div className="h-full pt-16">
                    {activeActivity.type === ActivityType.QUIZ && (
                        <QuizGame 
                            questions={activeActivity.data as QuizQuestion[]}
                            onComplete={(score) => handleActivityComplete(score * 20)}
                        />
                    )}
                    {activeActivity.type === ActivityType.FLASHCARDS && (
                        <FlashcardsGame 
                            cards={activeActivity.data as Flashcard[]}
                            onComplete={() => handleActivityComplete(50)}
                        />
                    )}
                    {activeActivity.type === ActivityType.ROLEPLAY && state.currentBook && (
                        <RoleplayGame 
                            bookTitle={state.currentBook.title}
                            chapterTitle={state.chapters.find(c => c.id === currentChapterId)?.title || ''}
                            onComplete={() => handleActivityComplete(100)}
                        />
                    )}
                </div>
            </div>
        ) : (
            chapterGuideData && state.chapters.find(c => c.id === currentChapterId) && (
                <ChapterHub 
                    guide={chapterGuideData}
                    chapter={state.chapters.find(c => c.id === currentChapterId)!}
                    onLaunchActivity={handleLaunchActivity}
                />
            )
        )}
      </ActivityModal>
      
      {/* Study Guide Modal */}
      <StudyGuideModal 
        isOpen={showStudyGuide}
        onClose={() => setShowStudyGuide(false)}
        guide={state.studyGuide}
        bookTitle={state.currentBook?.title || ""}
      />

    </div>
  );
};

export default App;