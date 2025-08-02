// src/ai/flows/generate-motivational-message.ts
'use server';

/**
 * @fileOverview An AI agent that generates motivational messages based on a goal description.
 *
 * - generateMotivationalMessage - A function that generates a motivational message.
 * - GenerateMotivationalMessageInput - The input type for the generateMotivationalMessage function.
 * - GenerateMotivationalMessageOutput - The return type for the generateMotivationalMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMotivationalMessageInputSchema = z.object({
  goalDescription: z
    .string()
    .describe('The description of the goal for which a motivational message is to be generated.'),
});
export type GenerateMotivationalMessageInput = z.infer<
  typeof GenerateMotivationalMessageInputSchema
>;

const GenerateMotivationalMessageOutputSchema = z.object({
  motivationalMessage: z
    .string()
    .describe('The AI-generated motivational message.'),
});
export type GenerateMotivationalMessageOutput = z.infer<
  typeof GenerateMotivationalMessageOutputSchema
>;

export async function generateMotivationalMessage(
  input: GenerateMotivationalMessageInput
): Promise<GenerateMotivationalMessageOutput> {
  return generateMotivationalMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMotivationalMessagePrompt',
  input: {schema: GenerateMotivationalMessageInputSchema},
  output: {schema: GenerateMotivationalMessageOutputSchema},
  prompt: `You are a motivational coach. Generate a short, punchy, and encouraging message for the user's goal. Keep it to one or two sentences.

Goal Description: {{{goalDescription}}}

Motivational Message:`,
});

const generateMotivationalMessageFlow = ai.defineFlow(
  {
    name: 'generateMotivationalMessageFlow',
    inputSchema: GenerateMotivationalMessageInputSchema,
    outputSchema: GenerateMotivationalMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
