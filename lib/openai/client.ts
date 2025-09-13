/**
 * OpenAI Client Utilities
 * 
 * Handles OpenAI client initialization and API calls.
 * This module centralizes OpenAI configuration and request handling.
 */

import OpenAI from "openai";

/**
 * Initialize OpenAI client only when API key is available
 * @returns Configured OpenAI client instance
 * @throws Error if API key is missing
 */
export function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is missing");
  }
  return new OpenAI({ apiKey });
}

/**
 * Makes a request to OpenAI's chat completions API
 * @param messages - Array of messages for the conversation
 * @param isRegeneration - Whether this is a regeneration request (affects token limit)
 * @returns The completion response
 */
export async function makeOpenAIRequest(messages: any[], isRegeneration: boolean = false) {
  const openai = getOpenAI();
  
  return await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.7,
    max_tokens: isRegeneration ? 3000 : 2000 // More tokens for regeneration
  });
}
