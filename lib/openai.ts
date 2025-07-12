import OpenAI from "openai";
import { getSchemaString, LandingPageConfig } from "./landingPageSchema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generatePageConfig(userPrompt: string): Promise<LandingPageConfig> {
  const schemaString = getSchemaString();
  const systemPrompt = `You are an expert SaaS landing page copywriter and designer. Respond ONLY with a JSON object inside a markdown code block (\`\`\`json ... \`\`\`). Do not include any explanation or text outside the code block. Follow this exact schema (replace placeholder values, do not add or remove keys):\n${schemaString}\nGenerate a landing page config for: ${userPrompt}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 800
  });

  // Extract JSON from markdown code block if present
  const content = completion.choices[0].message.content;
  if (!content) throw new Error("No content returned from OpenAI");
  let jsonString = content;
  const codeBlockMatch = content.match(/```json([\s\S]*?)```/i) || content.match(/```([\s\S]*?)```/i);
  if (codeBlockMatch) {
    jsonString = codeBlockMatch[1].trim();
  }
  let config: any;
  try {
    config = JSON.parse(jsonString);
  } catch (e) {
    throw new Error("Failed to parse OpenAI response as JSON");
  }

  // --- Validation ---
  if (!config.hero || typeof config.hero !== 'object') {
    throw new Error("Config missing 'hero' section");
  }
  if (!config.features || !Array.isArray(config.features) || config.features.length === 0) {
    throw new Error("Config missing 'features' array");
  }
  const theme = config.theme || config.themeColors || config.theme_colors;
  if (!theme || typeof theme !== 'object') {
    throw new Error("Config missing 'theme' or 'themeColors' section");
  }
  if (!config.hero.headline || !config.hero.subheadline || !(config.hero.cta || config.hero.ctaText)) {
    throw new Error("Config 'hero' section missing required fields");
  }
  if (!theme.primaryColor || !theme.secondaryColor) {
    throw new Error("Config 'theme' section missing required colors");
  }

  config.themeColors = theme;
  if (!config.hero.cta && config.hero.ctaText) {
    config.hero.cta = config.hero.ctaText;
  }

  return config;
} 