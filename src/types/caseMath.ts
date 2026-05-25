export type CaseMathCategory = 
  | "profitability" 
  | "investment" 
  | "breakeven";

export interface CaseMathShortcut {
  name: string;
  formula: string;
  tip: string;
}

export interface CaseMathTask {
  id: number;
  category: CaseMathCategory;
  question: string;
  highlightedQuestion: React.ReactNode;
  answer: number;
  tolerance: number;
  shortcut: CaseMathShortcut;
  difficulty: number;
  dbTaskType?: string;
  dbDifficulty?: string;
}

export interface CaseMathResult {
  task: CaseMathTask;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  explanation?: string;
}

export interface CaseMathStats {
  totalAttempted: number;
  correctCount: number;
  accuracyPercent: number;
  tasksPerMinute: number;
  durationSeconds: number;
}

export type CaseMathPhase = "config" | "sprint" | "debrief";
