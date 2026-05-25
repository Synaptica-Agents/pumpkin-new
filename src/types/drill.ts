export type TaskType = 
  | "all" 
  | "multiplication" 
  | "percentage" 
  | "division" 
  | "zeros" 
  | "growth";

export interface ShortcutInfo {
  name: string;
  description: string;
  steps: string[];
}

export interface Task {
  id: number;
  type: TaskType;
  question: string;
  answer: number;
  shortcut: ShortcutInfo;
  difficulty: number;
  tolerance?: number;
}

export interface FeedbackState {
  isCorrect: boolean;
  userAnswer: string | number;
  correctAnswer: number;
  shortcut: ShortcutInfo;
  errorHint?: string;
  reactionTime?: number;
}

// Sprint Mode Types
export type SprintDuration = 120 | 300 | 480 | 600; // 2, 5, 8, or 10 minutes in seconds

export interface SprintResult {
  task: Task;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // ms spent on this task
}

export interface SprintStats {
  totalAttempted: number;
  correctCount: number;
  accuracyPercent: number;
  tasksPerMinute: number;
  durationSeconds: number;
}

export type GamePhase = "config" | "sprint" | "debrief";
