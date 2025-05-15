'use server';
/**
 * @fileOverview Provides personalized feedback and recommendations based on assessment results, and advises on need for consultation.
 *
 * - analyzeAssessment - A function that handles the analysis of mental health assessment results.
 * - AnalyzeAssessmentInput - The input type for the analyzeAssessment function.
 * - AnalyzeAssessmentOutput - The return type for the analyzeAssessment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ActiveGoalForAISchema = z.object({
  description: z.string().describe('The user-defined or system-generated description of the goal.'),
  assessmentName: z.string().describe('The name of the assessment this goal is related to (e.g., "GAD-7 Anxiety Assessment").'),
});

const AnalyzeAssessmentInputSchema = z.object({
  who5Score: z.number().describe('The score from the WHO-5 Wellbeing Index assessment (0-100).'),
  gad7Score: z.number().describe('The score from the GAD-7 Anxiety Assessment (0-21).'),
  phq9Score: z.number().describe('The score from the PHQ-9 Depression Screening (0-27).'),
  userContext: z.string().optional().describe('Optional additional context from the user about their current situation or feelings (e.g., "I have been feeling very stressed at work lately which might explain my anxiety scores.").'),
  preferredRecommendationTypes: z.array(z.string()).optional().describe('Optional list of preferred types of recommendations (e.g., "mindfulness exercises", "physical activity suggestions", "sleep hygiene tips", "professional support options", "creative outlets", "social connection ideas").'),
  activeGoals: z.array(ActiveGoalForAISchema).optional().describe('An optional list of the user\'s active wellbeing goals. The AI should consider these when crafting recommendations and feedback.'),
});
export type AnalyzeAssessmentInput = z.infer<typeof AnalyzeAssessmentInputSchema>;

const AnalyzeAssessmentOutputSchema = z.object({
  feedback: z.string().describe('Personalized feedback based on the assessment scores, taking into account user context and goals. This should be empathetic and constructive.'),
  recommendations: z.string().describe('Actionable and personalized recommendations based on the assessment scores, user context, preferred recommendation types, and active goals. These can range from lifestyle changes to seeking professional help. Provide specific examples where possible.'),
  requiresConsultation: z.boolean().describe('Whether the AI recommends a professional video consultation based on the scores (true/false).'),
});
export type AnalyzeAssessmentOutput = z.infer<typeof AnalyzeAssessmentOutputSchema>;

export async function analyzeAssessment(input: AnalyzeAssessmentInput): Promise<AnalyzeAssessmentOutput> {
  return analyzeAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeAssessmentPrompt',
  input: {schema: AnalyzeAssessmentInputSchema},
  output: {schema: AnalyzeAssessmentOutputSchema},
  prompt: `You are a mental health expert providing insightful feedback, personalized recommendations, and advice on whether to seek professional consultation based on mental health assessment scores. Your tone should be supportive, empathetic, and encouraging.

Consider the following information to tailor your response:
Scores:
- WHO-5 Wellbeing Index Score: {{{who5Score}}} (Range: 0-100. Higher scores indicate better well-being. A score below 50 suggests poor well-being.)
- GAD-7 Anxiety Assessment Score: {{{gad7Score}}} (Range: 0-21. Higher scores indicate more severe anxiety. 0-4: Minimal, 5-9: Mild, 10-14: Moderate, 15-21: Severe.)
- PHQ-9 Depression Screening Score: {{{phq9Score}}} (Range: 0-27. Higher scores indicate more severe depression. 0-4: Minimal, 5-9: Mild, 10-14: Moderate, 15-19: Moderately Severe, 20-27: Severe.)

{{#if userContext}}
User's additional context: "{{{userContext}}}"
This context is crucial for understanding the user's situation. Integrate this into your feedback and recommendations.
{{/if}}

{{#if preferredRecommendationTypes.length}}
User's preferred recommendation types: {{#each preferredRecommendationTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
Prioritize suggestions aligned with these preferences if clinically appropriate.
{{/if}}

{{#if activeGoals.length}}
User's active wellbeing goals:
{{#each activeGoals}}
- Goal for {{this.assessmentName}}: "{{this.description}}"
{{/each}}
Please provide feedback and recommendations that acknowledge and support achieving these goals.
{{/if}}

Based on all the above information, provide:
1.  **Personalized Feedback:** 
    *   Interpret the scores in a clear and understandable way.
    *   Connect the scores to the user's context if provided.
    *   Acknowledge any active goals related to the assessment areas.
    *   Maintain an empathetic and supportive tone.
2.  **Personalized Recommendations:**
    *   Offer specific, actionable steps the user can take.
    *   Align recommendations with the user's assessment scores, context, preferred types, and active goals.
    *   Suggest a range of options, from self-help strategies (e.g., mindfulness, exercise, journaling, sleep hygiene) to seeking support from friends/family or professionals.
    *   If scores are high or well-being is low, gently encourage considering professional support.
    *   Examples:
        *   If GAD-7 is high and user mentioned work stress: "Given your GAD-7 score and the work stress you mentioned, exploring stress-management techniques like daily mindfulness practice for 10 minutes or scheduling short breaks throughout your workday could be beneficial..."
        *   If user prefers 'physical activity' and PHQ-9 is moderate: "Your PHQ-9 score suggests moderate depressive symptoms. Since you prefer physical activity, incorporating regular walks or a type of exercise you enjoy could positively impact your mood..."
        *   If a goal is to "reduce anxiety score": "To support your goal of reducing your anxiety score, consistent practice of grounding techniques or deep breathing exercises when you feel overwhelmed can be very effective."
3.  **Determination for 'requiresConsultation' (true/false):**
    *   Set 'requiresConsultation' to true if:
        *   PHQ-9 score is 10 or higher (Moderate to Severe depression).
        *   GAD-7 score is 10 or higher (Moderate to Severe anxiety).
        *   WHO-5 score is below 50 (Poor well-being).
    *   Also consider setting 'requiresConsultation' to true if the user's context (e.g., mentioning extreme distress or thoughts of self-harm not captured by PHQ-9 question 9 directly) indicates a need for professional help, even if scores are slightly below these thresholds.
    *   Otherwise, set 'requiresConsultation' to false.

If 'requiresConsultation' is true, subtly weave this into the feedback or recommendations section. For example: "Given your scores, particularly [mention specific score like PHQ-9 or GAD-7], it might be helpful to discuss these feelings with a healthcare professional. They can offer further guidance and support tailored to your situation." or "Your results suggest that speaking with a mental health professional could provide valuable support in managing these symptoms and working towards your wellbeing goals."

Ensure your entire response is supportive, non-judgmental, and empowers the user to take positive steps.
  `,
});

const analyzeAssessmentFlow = ai.defineFlow(
  {
    name: 'analyzeAssessmentFlow',
    inputSchema: AnalyzeAssessmentInputSchema,
    outputSchema: AnalyzeAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

