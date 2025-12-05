import { GoogleGenAI, Type } from "@google/genai";
import { Chapter, QuizQuestion, Flashcard, UserPreferences, StudyGuide, Language, ChapterGuide } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelFlash = 'gemini-2.5-flash';

const getLangInstruction = (lang: Language) => 
  lang === 'zh' 
    ? "IMPORTANT: Generate all display text (titles, descriptions, questions, answers, content) in Simplified Chinese (zh-CN). Keep JSON property keys in English." 
    : "IMPORTANT: Generate all content in English.";

// 1. Generate Learning Plan (Chapters) - Personalized
export const generateLearningPlan = async (bookTitle: string, content: string = "", preferences: UserPreferences, language: Language): Promise<Chapter[]> => {
  const prompt = `
    Create a personalized gamified learning path for the book "${bookTitle}".
    ${getLangInstruction(language)}
    
    User Preferences:
    - Goal: ${preferences.goal}
    - Interests: ${preferences.interests.join(", ")}
    - Prior Knowledge: ${preferences.priorKnowledge}

    Break the book down into 6-10 distinct levels or "Chapters" to ensure deep coverage.
    If the goal is "Exam Prep", emphasize key facts and summaries.
    If the goal is "Casual Reading", emphasize plot and roleplay.
    
    For each chapter, suggest 2-3 suitable activity types (QUIZ, FLASHCARDS, ROLEPLAY) that best fit the content and user preferences.
    
    File Content Snippet (first 1500 chars): ${content.substring(0, 1500)}...
  `;

  const response = await ai.models.generateContent({
    model: modelFlash,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            activities: {
              type: Type.ARRAY,
              items: { type: Type.STRING, enum: ["QUIZ", "FLASHCARDS", "ROLEPLAY"] }
            }
          },
          required: ["id", "title", "description", "activities"]
        }
      }
    }
  });

  const chapters = JSON.parse(response.text || "[]");
  
  // Transform to app state format
  return chapters.map((c: any, index: number) => ({
    ...c,
    id: index + 1, // Ensure sequential IDs
    isLocked: index !== 0,
    isCompleted: false
  }));
};

// 1.5 Generate Study Guide (Themes, Characters, Summary)
export const generateStudyGuide = async (bookTitle: string, content: string = "", language: Language): Promise<StudyGuide> => {
  const prompt = `
    Create a comprehensive, deep-dive study guide for the book "${bookTitle}".
    ${getLangInstruction(language)}
    
    Provide:
    1. A Global Summary: A detailed overview of the entire book (approx 400-600 words). Use Markdown for formatting.
    2. A list of 5-8 Key Characters with detailed analysis of their roles and evolution.
    3. A list of 5-8 Key Themes with deep analysis.
    
    File Content Snippet: ${content.substring(0, 1000)}...
  `;

  const response = await ai.models.generateContent({
    model: modelFlash,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          globalSummary: { type: Type.STRING },
          characters: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                role: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["name", "role", "description"]
            }
          },
          themes: {
             type: Type.ARRAY,
             items: {
                type: Type.OBJECT,
                properties: {
                   name: { type: Type.STRING },
                   description: { type: Type.STRING }
                },
                required: ["name", "description"]
             }
          }
        },
        required: ["globalSummary", "characters", "themes"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

// 1.8 Generate Chapter Guide (The "Lead-in" Reading)
export const generateChapterGuide = async (bookTitle: string, chapterTitle: string, preferences: UserPreferences, language: Language): Promise<ChapterGuide> => {
  const prompt = `
    You are an expert literature professor teaching a master class. The student is studying "${chapterTitle}" from "${bookTitle}".
    User Goal: ${preferences.goal}.
    User Interests: ${preferences.interests.join(", ")}.
    ${getLangInstruction(language)}
    
    Create an extensive "Guided Reading" module for this chapter.
    
    1. 'content': This is the main reading section. It must be VERY DETAILED (approx 800-1200 words). 
       - Do NOT just summarize. Retell the narrative in an engaging way.
       - Analyze user interests (e.g., if they like Symbolism, discuss symbols in this chapter).
       - Use Markdown heavily: Headers (##), Bold (**text**), Blockquotes (>), and Lists.
       - Make it immersive. The user should feel like they read the chapter.
    
    2. 'keyPoints': A list of 5-7 crucial takeaways or analysis points.

    Output pure JSON.
  `;

  const response = await ai.models.generateContent({
    model: modelFlash,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          chapterTitle: { type: Type.STRING },
          content: { type: Type.STRING },
          keyPoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["chapterTitle", "content", "keyPoints"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

// 2. Generate Quiz
export const generateQuiz = async (bookTitle: string, chapterTitle: string, language: Language): Promise<QuizQuestion[]> => {
  const prompt = `Generate 5 challenging multiple-choice questions for the chapter "${chapterTitle}" of the book "${bookTitle}". Questions should test deep understanding, not just surface facts. ${getLangInstruction(language)}`;

  const response = await ai.models.generateContent({
    model: modelFlash,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswerIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswerIndex", "explanation"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
};

// 3. Generate Flashcards
export const generateFlashcards = async (bookTitle: string, chapterTitle: string, language: Language): Promise<Flashcard[]> => {
  const prompt = `Create 8 flashcards for "${chapterTitle}" of "${bookTitle}". Include complex concepts, key quotes, or character motivations. ${getLangInstruction(language)}`;

  const response = await ai.models.generateContent({
    model: modelFlash,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            front: { type: Type.STRING },
            back: { type: Type.STRING }
          },
          required: ["front", "back"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
};

// 4. Roleplay Context Setup
export const getRoleplaySystemInstruction = (bookTitle: string, chapterTitle: string, language: Language): string => {
  const langText = language === 'zh' ? "Speak in Simplified Chinese." : "Speak in English.";
  return `You are an immersive roleplay character from the book "${bookTitle}", specifically relevant to the chapter "${chapterTitle}". 
  First, introduce yourself briefly and set the scene. Then engage the user in a deep discussion about the events. 
  Encourage the user to think critically.
  ${langText}
  Do not break character.`;
};

export const chatWithCharacter = async (history: any[], message: string, systemInstruction: string) => {
    const chat = ai.chats.create({
        model: modelFlash,
        config: { systemInstruction },
        history: history
    });
    
    const result = await chat.sendMessage(message);
    return result.text;
};

// 5. Generate Summary (Simple fallback)
export const generateSummary = async (bookTitle: string, chapterTitle: string, language: Language): Promise<string> => {
    const prompt = `Provide a concise, engaging summary of "${chapterTitle}" from "${bookTitle}". Use emojis. Focus on the emotional journey or key logic. ${getLangInstruction(language)}`;
    const response = await ai.models.generateContent({
        model: modelFlash,
        contents: prompt
    });
    return response.text || "Could not generate summary.";
}