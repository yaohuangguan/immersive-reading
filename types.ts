export enum ActivityType {
  QUIZ = 'QUIZ',
  FLASHCARDS = 'FLASHCARDS',
  ROLEPLAY = 'ROLEPLAY',
  SUMMARY = 'SUMMARY',
  CHAPTER_HUB = 'CHAPTER_HUB'
}

export type Language = 'en' | 'zh';

export interface Book {
  title: string;
  author: string;
  coverColor: string;
  totalChapters: number;
}

export interface Chapter {
  id: number;
  title: string;
  description: string;
  isLocked: boolean;
  isCompleted: boolean;
  activities: ActivityType[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isTyping?: boolean;
}

export interface UserPreferences {
  goal: string;     // e.g., 'Exam Prep', 'Casual Reading', 'Deep Analysis'
  interests: string[]; // e.g., ['Plot', 'Characters', 'Symbolism']
  priorKnowledge: string; // e.g., 'None', 'Basic', 'Expert'
}

export interface Character {
  name: string;
  role: string;
  description: string;
}

export interface Theme {
  name: string;
  description: string;
}

export interface StudyGuide {
  globalSummary: string;
  characters: Character[];
  themes: Theme[];
}

export interface ChapterGuide {
  chapterTitle: string;
  content: string;
  keyPoints: string[];
}

export interface AppState {
  currentBook: Book | null;
  chapters: Chapter[];
  studyGuide: StudyGuide | null;
  xp: number;
  level: number;
  isLoading: boolean;
  loadingMessage: string;
}