import type { AssessmentTypeValue } from './constants';

export interface QuestionOption {
  text: string;
  value: number;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

export interface Assessment {
  type: AssessmentTypeValue;
  name: string;
  questions: Question[];
  scoringNote?: string;
  interpretation?: Record<string, string>; // e.g. "0-4": "Minimal anxiety"
}

export interface IndividualScore {
  type: AssessmentTypeValue;
  score: number;
}

export interface CompletedAssessmentSet {
  date: string; // ISO string
  who5Score?: number;
  gad7Score?: number;
  phq9Score?: number;
  aiFeedback?: string;
  aiRecommendations?: string;
  requiresConsultation?: boolean; // Added field
}

export interface CurrentScores {
  [ASSESSMENT_TYPES.WHO5]?: number;
  [ASSESSMENT_TYPES.GAD7]?: number;
  [ASSESSMENT_TYPES.PHQ9]?: number;
}

export const GOAL_DEFINITION_TYPES = {
  REACH_SPECIFIC_SCORE: 'reach_specific_score',
  IMPROVE_CURRENT_SCORE: 'improve_current_score',
} as const;

export type GoalDefinitionType = typeof GOAL_DEFINITION_TYPES[keyof typeof GOAL_DEFINITION_TYPES];

export interface UserGoal {
  id: string; // UUID
  assessmentType: AssessmentTypeValue;
  goalDefinitionType: GoalDefinitionType;
  targetValue: number; // For 'REACH_SPECIFIC_SCORE', this is the score. For 'IMPROVE_CURRENT_SCORE', this is the point change.
  targetDate?: string; // Optional deadline ISO string
  startDate: string; // ISO string, Date goal was set
  status: 'active' | 'achieved' | 'missed' | 'archived';
  startScore: number; // Score at the time goal was set
  currentScore?: number; // Most recent score for this assessment type since goal was set
  notes?: string; // User's personal notes about the goal
  description?: string; // Auto-generated or user-defined description for display
}

export const MOOD_LEVELS = {
  GREAT: 5,
  GOOD: 4,
  OKAY: 3,
  BAD: 2,
  AWFUL: 1,
} as const;

export type MoodLevelValue = typeof MOOD_LEVELS[keyof typeof MOOD_LEVELS];

export const MOOD_LABELS: Record<MoodLevelValue, string> = {
  [MOOD_LEVELS.GREAT]: "Great",
  [MOOD_LEVELS.GOOD]: "Good",
  [MOOD_LEVELS.OKAY]: "Okay",
  [MOOD_LEVELS.BAD]: "Bad",
  [MOOD_LEVELS.AWFUL]: "Awful",
};

export interface MoodEntry {
  id: string; // UUID
  date: string; // ISO string
  moodLevel: MoodLevelValue;
  notes?: string;
  activities?: string[]; // e.g., ['work', 'exercise', 'social']
}
