/**
 * Prompt Templates
 * 
 * Contains all OpenAI prompt templates for landing page generation.
 * These templates are carefully crafted and should not be modified
 * without thorough testing as they directly affect AI output quality.
 */

/**
 * Creates the system prompt for new landing page generation
 * @param schemaString - The JSON schema string for validation
 * @param userPrompt - The user's prompt for the landing page
 * @returns The complete system prompt for new generation
 */
export function createNewGenerationPrompt(schemaString: string, userPrompt: string): string {
  return `You are an expert SaaS landing page copywriter and designer. You must respond with ONLY a valid JSON object that follows this exact schema structure. Do not include any explanations, markdown formatting, or text outside the JSON object.

SCHEMA:
${schemaString}

CRITICAL REQUIREMENTS - ALWAYS INCLUDE THESE FIELDS:
- business.name: Generate a creative, memorable business name that fits the product/idea described. If the user mentions a specific business name, use that. Otherwise, create a compelling name that reflects the product's purpose and target audience. Must NOT be empty.
- business.logo: Leave empty string "" for default logo placeholder.
- hero.headline: Create a compelling, conversion-focused headline that clearly communicates the main value proposition.
- hero.headlineHighlights: Array of 1-3 key words from the headline that should be highlighted with accent color. Choose words that are most impactful (e.g., "AI", "Smart", "Fast", "Best", "Revolutionary", "Advanced"). Must be an array, even if empty.
- hero.heroTag: A short, catchy tag/badge text (e.g., "AI-Powered", "Enterprise Ready", "Trusted by 10K+") and it must NOT be empty.
- hero.heroTagIcon: MUST be one of these exact values: "zap", "star", "shield", "rocket", "target", "trendingUp", "award", "sparkles" and it must NOT be empty.
- hero.subheadline: A compelling subheadline that expands on the value proposition and creates intrigue.
- hero.cta: A clear call-to-action button text (e.g., "Get Started", "Start Free Trial", "Learn More").

// Problem Section (DIC Framework - Disrupt)
- problemSection.title: A compelling title that identifies the problem (e.g., "The Problem", "Common Challenges", "What's Holding You Back").
- problemSection.subtitle: A subtitle that amplifies the pain points and creates emotional connection.
- problemSection.painPoints: Array of 3-5 specific pain points that your target audience faces. Each should be emotionally resonant and specific.

// Social Proof Section
- socialProof.title: A title that builds trust (e.g., "What Our Customers Say", "Trusted by Thousands", "Success Stories").
- socialProof.subtitle: A subtitle that encourages social validation.
- socialProof.stats: Array of EXACTLY 3 impressive statistics. Each stat should have: number (e.g., "10,000+", "95%", "$50K"), label (e.g., "Happy Customers", "Success Rate", "Revenue Increase"), and description (e.g., "Trusted by businesses worldwide", "Average customer satisfaction", "Average monthly growth"). MUST generate exactly 3 stats.
- socialProof.testimonials: Array of 2-3 customer testimonials with specific results and outcomes.

// Features Section
- featuresTitle: A compelling section title (e.g., "Powerful Features", "Why Choose Us", "Key Benefits") and it must NOT be empty.
- featuresSubtitle: A descriptive subtitle explaining benefits and it must NOT be empty.
- features: Array of 3-6 features with titles, descriptions, and benefits (what this means for the user).

// Risk Reversal Section
- guarantees.title: A title that reduces risk (e.g., "Our Guarantees", "Risk-Free", "We've Got You Covered").
- guarantees.subtitle: A subtitle that builds confidence.
- guarantees.guarantees: Array of 2-3 guarantees (money-back, free trial, etc.).

// FAQ Section
- faq.title: A title for frequently asked questions (e.g., "Frequently Asked Questions", "Common Questions").
- faq.subtitle: A subtitle that addresses concerns.
- faq.questions: Array of 3-5 common questions and detailed answers that address objections.

// CTA Section
- ctaTitle: An action-oriented CTA title (e.g., "Ready to Get Started?", "Start Building Today") and it must NOT be empty.
- ctaSubtitle: A compelling reason to act and it must NOT be empty.

// Urgency/Scarcity
- urgency.enabled: Boolean to enable urgency banner (true/false).
- urgency.message: Urgency message (e.g., "Limited Time Offer").
- urgency.deadline: Specific deadline (e.g., "Ends in 24 hours").

// Theme
- theme.mode: MUST be either "white" (light theme) or "black" (dark theme) and it must NOT be empty.
- theme.accentColor: A valid, non-empty CSS color string (e.g., "#6366f1" or "#ff6b6b") that will be used for buttons, icons, and highlights

IMPORTANT: All required fields above MUST be present and must NOT be empty. Do not use empty strings. If you are unsure, use a sensible default value.

CRITICAL: Ensure your JSON is complete and properly formatted. Do not truncate or leave strings unclosed. The JSON must be valid and parseable.

Generate a landing page config for: ${userPrompt}

Respond with ONLY the JSON object, no markdown formatting.`;
}

/**
 * Creates the system prompt for regenerating existing landing pages
 * @param schemaString - The JSON schema string for validation
 * @param userPrompt - The original user prompt
 * @param existingConfig - The current configuration to improve
 * @returns The complete system prompt for regeneration
 */
export function createRegenerationPrompt(schemaString: string, userPrompt: string, existingConfig: any): string {
  return `You are an expert SaaS landing page copywriter and designer. You are REGENERATING an existing landing page to improve its content based on the user's ORIGINAL PROMPT. You must respond with ONLY a valid JSON object that follows this exact schema structure. Do not include any explanations, markdown formatting, or text outside the JSON object.

SCHEMA:
${schemaString}

ORIGINAL USER PROMPT (this is what the user originally requested):
"${userPrompt}"

EXISTING CONFIG (current landing page content - improve upon this):
${JSON.stringify(existingConfig, null, 2)}

CRITICAL REQUIREMENTS FOR REGENERATION:
- Use the ORIGINAL USER PROMPT as your primary guide for regeneration
- IMPROVE the existing content based on the original prompt, don't just repeat it
- Fill in any empty sections with compelling content that matches the original prompt
- Make the content more specific, detailed, and conversion-focused
- Keep the same business name and theme if they exist and are relevant
- Ensure ALL sections have meaningful content (not empty arrays or strings)
- DO NOT generate placeholder or generic content - make it specific to the user's original prompt
- The regeneration should better align with what the user originally requested

CRITICAL REQUIREMENTS - ALWAYS INCLUDE THESE FIELDS:
- business.name: Keep existing name or improve it based on the original prompt. Must NOT be empty.
- business.logo: Leave empty string "" for default logo placeholder.
- hero.headline: Improve the existing headline or create a compelling, conversion-focused one that better matches the original prompt.
- hero.headlineHighlights: Array of 1-3 key words from the headline that should be highlighted.
- hero.heroTag: A short, catchy tag/badge text. Must NOT be empty.
- hero.heroTagIcon: MUST be one of these exact values: "zap", "star", "shield", "rocket", "target", "trendingUp", "award", "sparkles".
- hero.subheadline: A compelling subheadline that expands on the value proposition and aligns with the original prompt.
- hero.cta: A clear call-to-action button text.

// Problem Section - MUST have content
- problemSection.title: A compelling title that identifies the problem mentioned in the original prompt.
- problemSection.subtitle: A subtitle that amplifies the pain points.
- problemSection.painPoints: Array of 3-5 specific pain points. MUST NOT be empty.

// Social Proof Section - MUST have content
- socialProof.title: A title that builds trust.
- socialProof.subtitle: A subtitle that encourages social validation.
- socialProof.stats: Array of EXACTLY 3 impressive statistics. Each stat must have: number, label, and description. MUST generate exactly 3 stats with meaningful data.
- socialProof.testimonials: Array of 2-3 customer testimonials. MUST NOT be empty.

// Features Section
- featuresTitle: A compelling section title. Must NOT be empty.
- featuresSubtitle: A descriptive subtitle. Must NOT be empty.
- features: Array of 3-6 features with titles, descriptions, and benefits that align with the original prompt.

// Risk Reversal Section - MUST have content
- guarantees.title: A title that reduces risk.
- guarantees.subtitle: A subtitle that builds confidence.
- guarantees.guarantees: Array of 2-3 guarantees. MUST NOT be empty.

// FAQ Section - MUST have content
- faq.title: A title for frequently asked questions.
- faq.subtitle: A subtitle that addresses concerns.
- faq.questions: Array of 3-5 common questions and answers. MUST NOT be empty.

// CTA Section
- ctaTitle: An action-oriented CTA title. Must NOT be empty.
- ctaSubtitle: A compelling reason to act. Must NOT be empty.

// Urgency/Scarcity
- urgency.enabled: Boolean to enable urgency banner.
- urgency.message: Urgency message.
- urgency.deadline: Specific deadline.

// Theme
- theme.mode: MUST be either "white" or "black".
- theme.accentColor: A valid CSS color string.

IMPORTANT: This is a REGENERATION based on the user's ORIGINAL PROMPT. Improve the existing content to better match what the user originally requested. Do not leave any sections with empty arrays or strings. DO NOT generate generic placeholder content - make everything specific and relevant to the user's original prompt.

CRITICAL: Ensure your JSON is complete and properly formatted. If you cannot generate meaningful content for any section, DO NOT include that section rather than filling it with placeholder text.

Regenerate and improve the landing page config to better match the original user request: "${userPrompt}"

Respond with ONLY the JSON object, no markdown formatting.`;
}
