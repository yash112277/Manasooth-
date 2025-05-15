
export const ASSESSMENT_TYPES = {
  WHO5: 'who5',
  GAD7: 'gad7',
  PHQ9: 'phq9',
} as const;

export type AssessmentTypeKey = keyof typeof ASSESSMENT_TYPES;
export type AssessmentTypeValue = typeof ASSESSMENT_TYPES[AssessmentTypeKey];

export const ASSESSMENT_NAMES: Record<AssessmentTypeValue, string> = {
  [ASSESSMENT_TYPES.WHO5]: "WHO-5 Well-being Index",
  [ASSESSMENT_TYPES.GAD7]: "GAD-7 Anxiety Assessment",
  [ASSESSMENT_TYPES.PHQ9]: "PHQ-9 Depression Screening",
};

// Defines the default order if multiple assessments are selected or for a full flow.
export const ASSESSMENT_FLOW: AssessmentTypeValue[] = [
  ASSESSMENT_TYPES.WHO5,
  ASSESSMENT_TYPES.GAD7,
  ASSESSMENT_TYPES.PHQ9,
];

export const LOCAL_STORAGE_KEYS = {
  CURRENT_ASSESSMENT_SCORES: 'manasooth_current_assessment_scores',
  PROGRESS_DATA: 'manasooth_progress_data',
  USER_GOALS: 'manasooth_user_goals',
  MOOD_ENTRIES: 'manasooth_mood_entries',
  SELECTED_ASSESSMENT_FLOW: 'manasooth_selected_assessment_flow', // New key
} as const;
