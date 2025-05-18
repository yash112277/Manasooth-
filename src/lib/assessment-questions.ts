
import type { Assessment } from './types';
import { ASSESSMENT_TYPES, ASSESSMENT_NAMES, type AssessmentTypeValue } from './constants';

export const ASSESSMENTS_DATA: Record<AssessmentTypeValue, Assessment> = {
  [ASSESSMENT_TYPES.WHO5]: {
    type: ASSESSMENT_TYPES.WHO5,
    name: ASSESSMENT_NAMES.who5,
    scoringNote: "Each question is scored from 0 (Not present) to 5 (Constantly present). The raw score is multiplied by 4 to get the final score (0-100). A score below 50 suggests poor well-being.",
    questions: [
      {
        id: 'who5_1',
        text: 'Over the last two weeks, I have felt cheerful and in good spirits.',
        options: [
          { text: 'At no time', value: 0 },
          { text: 'Some of the time', value: 1 },
          { text: 'Less than half of the time', value: 2 },
          { text: 'More than half of the time', value: 3 },
          { text: 'Most of the time', value: 4 },
          { text: 'All of the time', value: 5 },
        ],
      },
      {
        id: 'who5_2',
        text: 'Over the last two weeks, I have felt calm and relaxed.',
        options: [
          { text: 'At no time', value: 0 },
          { text: 'Some of the time', value: 1 },
          { text: 'Less than half of the time', value: 2 },
          { text: 'More than half of the time', value: 3 },
          { text: 'Most of the time', value: 4 },
          { text: 'All of the time', value: 5 },
        ],
      },
      {
        id: 'who5_3',
        text: 'Over the last two weeks, I have felt active and vigorous.',
        options: [
          { text: 'At no time', value: 0 },
          { text: 'Some of the time', value: 1 },
          { text: 'Less than half of the time', value: 2 },
          { text: 'More than half of the time', value: 3 },
          { text: 'Most of the time', value: 4 },
          { text: 'All of the time', value: 5 },
        ],
      },
      {
        id: 'who5_4',
        text: 'Over the last two weeks, I woke up feeling fresh and rested.',
        options: [
          { text: 'At no time', value: 0 },
          { text: 'Some of the time', value: 1 },
          { text: 'Less than half of the time', value: 2 },
          { text: 'More than half of the time', value: 3 },
          { text: 'Most of the time', value: 4 },
          { text: 'All of the time', value: 5 },
        ],
      },
      {
        id: 'who5_5',
        text: 'Over the last two weeks, my daily life has been filled with things that interest me.',
        options: [
          { text: 'At no time', value: 0 },
          { text: 'Some of the time', value: 1 },
          { text: 'Less than half of the time', value: 2 },
          { text: 'More than half of the time', value: 3 },
          { text: 'Most of the time', value: 4 },
          { text: 'All of the time', value: 5 },
        ],
      },
    ],
    interpretation: {
      "70-100": "Excellent well-being",
      "50-69": "Moderate well-being",
      "0-49": "Poor well-being, consider seeking support",
    }
  },
  [ASSESSMENT_TYPES.GAD7]: {
    type: ASSESSMENT_TYPES.GAD7,
    name: ASSESSMENT_NAMES.gad7,
    scoringNote: "Scores for each item range from 0 (Not at all) to 3 (Nearly every day). Total score ranges from 0 to 21.",
    questions: [
      {
        id: 'gad7_1',
        text: 'Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'gad7_2',
        text: 'Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'gad7_3',
        text: 'Over the last 2 weeks, how often have you been bothered by worrying too much about different things?',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'gad7_4',
        text: 'Over the last 2 weeks, how often have you been bothered by trouble relaxing?',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'gad7_5',
        text: 'Over the last 2 weeks, how often have you been bothered by being so restless that it is hard to sit still?',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'gad7_6',
        text: 'Over the last 2 weeks, how often have you been bothered by becoming easily annoyed or irritable?',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'gad7_7',
        text: 'Over the last 2 weeks, how often have you been bothered by feeling afraid as if something awful might happen?',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
    ],
    interpretation: {
      "0-4": "Minimal anxiety",
      "5-9": "Mild anxiety",
      "10-14": "Moderate anxiety",
      "15-21": "Severe anxiety",
    }
  },
  [ASSESSMENT_TYPES.PHQ9]: {
    type: ASSESSMENT_TYPES.PHQ9,
    name: ASSESSMENT_NAMES.phq9,
    scoringNote: "Scores for each item range from 0 (Not at all) to 3 (Nearly every day). Total score ranges from 0 to 27.",
    questions: [
      {
        id: 'phq9_1',
        text: 'Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'phq9_2',
        text: 'Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'phq9_3',
        text: 'Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'phq9_4',
        text: 'Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'phq9_5',
        text: 'Over the last 2 weeks, how often have you been bothered by poor appetite or overeating?',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'phq9_6',
        text: 'Over the last 2 weeks, how often have you been bothered by feeling bad about yourself - or that you are a failure or have let yourself or your family down?',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'phq9_7',
        text: 'Over the last 2 weeks, how often have you been bothered by trouble concentrating on things, such as reading the newspaper or watching television?',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'phq9_8',
        text: 'Over the last 2 weeks, how often have you been bothered by moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'phq9_9',
        text: 'Over the last 2 weeks, how often have you been bothered by thoughts that you would be better off dead, or of hurting yourself in some way?',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
    ],
    interpretation: {
      "0-4": "Minimal depression",
      "5-9": "Mild depression",
      "10-14": "Moderate depression",
      "15-19": "Moderately severe depression",
      "20-27": "Severe depression",
    }
  },
};
