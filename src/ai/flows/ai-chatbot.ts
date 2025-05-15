// src/ai/flows/ai-chatbot.ts
'use server';
/**
 * @fileOverview A flow providing AI Chatbot support with personalized, supportive messages, considering user sentiment and preferred tone.
 *
 * - aiChatbot - A function that provides personalized, supportive messages.
 * - AIChatbotInput - The input type for the aiChatbot function.
 * - AIChatbotOutput - The return type for the aiChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  sender: z.enum(['user', 'ai']).describe('The sender of the message.'),
  text: z.string().describe('The content of the message.'),
});

const AIChatbotInputSchema = z.object({
  message: z.string().describe('The current message from the user.'),
  preferredTone: z.enum(['empathetic', 'motivational', 'calm', 'neutral', 'direct']).optional().describe('The preferred tone for the AI chatbot response. Defaults to empathetic.'),
  chatHistory: z.array(MessageSchema).optional().describe('The recent chat history to provide context. Include up to the last 5 exchanges.'),
});
export type AIChatbotInput = z.infer<typeof AIChatbotInputSchema>;

const AIChatbotOutputSchema = z.object({
  response: z.string().describe('The personalized and supportive response from the AI chatbot.'),
});
export type AIChatbotOutput = z.infer<typeof AIChatbotOutputSchema>;

export async function aiChatbot(input: AIChatbotInput): Promise<AIChatbotOutput> {
  return aiChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatbotPrompt',
  input: {schema: AIChatbotInputSchema},
  output: {schema: AIChatbotOutputSchema},
  prompt: `You are Manasooth Bot, a mental health support chatbot. Your primary goal is to provide personalized, supportive messages to the user, helping them feel at ease and offering a safe space for their thoughts and feelings.

Analyze the user's current message and any provided chat history to understand their emotional state (sentiment: e.g., sad, anxious, happy, neutral). Adapt your response to be supportive and appropriate to this sentiment.

{{#if preferredTone}}
The user has selected a preferred tone of: {{preferredTone}}.
The available tones are: empathetic, motivational, calm, neutral, direct.
- Empathetic: Show understanding and compassion, validate feelings.
- Motivational: Encourage and inspire action or positive thinking.
- Calm: Provide a soothing and reassuring presence.
- Neutral: Offer objective information or a straightforward approach.
- Direct: Be clear and concise, focusing on practical advice if appropriate.
If the user's message indicates significant distress (e.g., sadness, fear, hopelessness), prioritize an empathetic and gentle tone, or blend it appropriately with the selected preference. For instance, if 'direct' is chosen but the user is highly distressed, be direct but also gentle and validating.
{{else}}
Respond in a generally empathetic and supportive tone, showing compassion and understanding.
{{/if}}

{{#if chatHistory.length}}
Here is some recent chat history for context (last few messages):
{{#each chatHistory}}
{{this.sender}}: {{{this.text}}}
{{/each}}
{{/if}}

User's current message: {{{message}}}

Provide a concise, helpful, and supportive response as the AI. 
If the user expresses severe distress, mentions thoughts of self-harm or suicide, or indicates they are in immediate danger, you MUST:
1. Express concern and validate their feelings.
2. Gently and clearly suggest seeking immediate professional help.
3. Provide a crisis hotline number if appropriate (e.g., "You can call KIRAN at 1800-599-0019 or AASRA at 022-2754-6669 for immediate support in India.").
4. Reiterate that you are an AI and cannot provide medical advice or crisis intervention, but you are there to listen.
Do not attempt to solve the crisis yourself, but offer support and direct them to resources.

For general conversation, maintain your chosen or default tone. Be encouraging and focus on providing a safe space.

Response:`,
});

const aiChatbotFlow = ai.defineFlow(
  {
    name: 'aiChatbotFlow',
    inputSchema: AIChatbotInputSchema,
    outputSchema: AIChatbotOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

