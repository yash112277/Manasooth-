
import type { AssessmentTypeValue } from './constants';
import { ASSESSMENT_TYPES } from './constants'; // Ensure ASSESSMENT_TYPES is imported if used directly here

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
  requiresConsultation?: boolean;
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
  targetValue: number; 
  targetDate?: string; 
  startDate: string; 
  status: 'active' | 'achieved' | 'missed' | 'archived';
  startScore: number; 
  currentScore?: number; 
  notes?: string; 
  description?: string; 
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
