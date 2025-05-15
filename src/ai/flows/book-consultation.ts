'use server';
/**
 * @fileOverview A flow for booking a consultation.
 *
 * - bookConsultation - A function that handles the consultation booking process.
 * - BookConsultationInput - The input type for the bookConsultation function.
 * - BookConsultationOutput - The return type for the bookConsultation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BookConsultationInputSchema = z.object({
  date: z.string().describe('The selected date for the consultation (e.g., YYYY-MM-DD).'),
  time: z.string().describe('The selected time slot for the consultation (e.g., HH:mm AM/PM).'),
  userName: z.string().optional().describe('Name of the user booking the consultation.'),
});
export type BookConsultationInput = z.infer<typeof BookConsultationInputSchema>;

const BookConsultationOutputSchema = z.object({
  success: z.boolean().describe('Whether the booking was successful.'),
  message: z.string().describe('A confirmation or error message.'),
  bookingId: z.string().optional().describe('A unique ID for the booking if successful.'),
});
export type BookConsultationOutput = z.infer<typeof BookConsultationOutputSchema>;

export async function bookConsultation(input: BookConsultationInput): Promise<BookConsultationOutput> {
  return bookConsultationFlow(input);
}

// This is a simulated flow. In a real application, this would interact with a calendar API or database.
const bookConsultationFlow = ai.defineFlow(
  {
    name: 'bookConsultationFlow',
    inputSchema: BookConsultationInputSchema,
    outputSchema: BookConsultationOutputSchema,
  },
  async (input) => {
    console.log(`Attempting to book consultation for ${input.userName || 'Anonymous User'} on ${input.date} at ${input.time}`);
    
    // Simulate booking logic with a slight chance of failure
    const isSuccess = Math.random() > 0.1; // 90% success rate

    if (isSuccess) {
      const bookingId = `MANA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      return {
        success: true,
        message: `Consultation successfully booked for ${input.date} at ${input.time}. Your Booking ID is ${bookingId}. Please check your email for confirmation (simulated).`,
        bookingId: bookingId,
      };
    } else {
      return {
        success: false,
        message: 'Sorry, we were unable to book the consultation at this time due to high demand. Please try selecting a different slot or try again later.',
      };
    }
  }
);
