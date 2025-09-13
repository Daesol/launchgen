/**
 * OpenAI Landing Page Generation
 * 
 * Main module for generating landing page configurations using OpenAI.
 * This module orchestrates the generation process using specialized utilities.
 */

import { getSchemaString, LandingPageConfig } from "./landingPageSchema";
import { repairJson, extractJsonFromContent } from "./openai/jsonRepair";
import { createNewGenerationPrompt, createRegenerationPrompt } from "./openai/promptTemplates";
import { validateConfigStructure, createFallbackConfig, applyFallbacks } from "./openai/validationAndFallbacks";
import { makeOpenAIRequest } from "./openai/client";

/**
 * Generates a landing page configuration using OpenAI
 * @param userPrompt - The user's prompt describing the desired landing page
 * @param existingConfig - Optional existing configuration for regeneration
 * @returns A complete landing page configuration
 */
export async function generatePageConfig(userPrompt: string, existingConfig?: any): Promise<LandingPageConfig> {
  const schemaString = getSchemaString();
  
  // Create appropriate prompt based on whether this is regeneration or new generation
  const systemPrompt = existingConfig 
    ? createRegenerationPrompt(schemaString, userPrompt, existingConfig)
    : createNewGenerationPrompt(schemaString, userPrompt);

  // Make OpenAI request
  const completion = await makeOpenAIRequest([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
  ], !!existingConfig);

  // Extract and process the response
  const content = completion.choices[0].message.content;
  if (!content) throw new Error("No content returned from OpenAI");
  
  console.log("Raw OpenAI response:", content);
  
  const jsonString = extractJsonFromContent(content);
  console.log("Attempting to parse JSON:", jsonString);
  
  let config: any;
  try {
    config = JSON.parse(jsonString);
  } catch (e: any) {
    console.error("JSON parse error:", e);
    console.error("Failed JSON string:", jsonString);
    
    // Try to repair common JSON issues
    try {
      console.log("Attempting to repair JSON...");
      const repairedJson = repairJson(jsonString);
      console.log("Repaired JSON:", repairedJson);
      config = JSON.parse(repairedJson);
      console.log("Successfully parsed repaired JSON");
    } catch (repairError: any) {
      console.error("JSON repair failed:", repairError);
      
      // For regeneration, throw error instead of creating fallback
      if (existingConfig) {
        throw new Error("Failed to parse regenerated content. The AI response was malformed.");
      }
      
      // Only create fallback for new generations, not regenerations
      console.log("Creating fallback config for new generation...");
      config = createFallbackConfig();
      console.log("Fallback config created successfully");
    }
  }

  // Validate and apply fallbacks
  console.log("Parsed config:", config);
  validateConfigStructure(config);
  const finalConfig = applyFallbacks(config);

  return finalConfig;
} 