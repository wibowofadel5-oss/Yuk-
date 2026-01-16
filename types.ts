
export type Level = 'SD' | 'SMP' | 'SMA';

export type Subject = 
  | 'Bahasa Indonesia' 
  | 'PKN' 
  | 'IPS' 
  | 'IPA' 
  | 'Kemuhammadiyahan' 
  | 'Ke-NU-an' 
  | 'Fikih' 
  | 'Aqidah Akhlak';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export type AppState = 'HOME' | 'SELECTOR' | 'QUIZ' | 'RESULT';

export interface QuizSession {
  level: Level;
  subject: Subject;
  questions: Question[];
  currentIdx: number;
  score: number;
  answers: number[];
}
