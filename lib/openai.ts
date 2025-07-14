import OpenAI from "openai";
import { getSchemaString, LandingPageConfig } from "./landingPageSchema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function to repair common JSON issues
function repairJson(jsonString: string): string {
  let repaired = jsonString;
  
  // Fix unterminated strings by finding the last complete object/array and truncating
  const lastCompleteBrace = repaired.lastIndexOf('}');
  const lastCompleteBracket = repaired.lastIndexOf(']');
  const lastComplete = Math.max(lastCompleteBrace, lastCompleteBracket);
  
  if (lastComplete > 0) {
    // Find the position where the JSON becomes incomplete
    let truncatePosition = lastComplete + 1;
    
    // Look for incomplete objects/arrays after the last complete one
    const remainingText = repaired.substring(lastComplete + 1);
    const incompleteMatch = remainingText.match(/[{\[]/);
    if (incompleteMatch && incompleteMatch.index !== undefined) {
      truncatePosition = lastComplete + 1 + incompleteMatch.index;
    }
    
    repaired = repaired.substring(0, truncatePosition);
  }
  
  // Fix the specific issue we saw: missing commas after property values in objects
  // Pattern: "description": "text" "icon": "value" -> "description": "text", "icon": "value"
  repaired = repaired.replace(/"([^"]+)"\s*"([^"]+)"/g, '"$1", "$2"');
  
  // Fix missing commas between objects in arrays
  // Pattern: } { -> }, {
  repaired = repaired.replace(/\}\s*\{/g, '}, {');
  
  // Fix missing commas after property values before closing braces/brackets
  // Pattern: "value" } -> "value", }
  repaired = repaired.replace(/"([^"]+)"\s*(\}|\])/g, '"$1", $2');
  
  // Fix trailing commas (remove them)
  repaired = repaired.replace(/,(\s*[}\]])/g, '$1');
  
  // Fix missing quotes around property names
  repaired = repaired.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
  
  // Fix empty string values that might be causing issues
  repaired = repaired.replace(/"\s*,\s*"/g, '", "');
  
  // Ensure the JSON ends properly
  if (!repaired.trim().endsWith('}')) {
    // Count braces to see if we need to close objects
    const openBraces = (repaired.match(/\{/g) || []).length;
    const closeBraces = (repaired.match(/\}/g) || []).length;
    const openBrackets = (repaired.match(/\[/g) || []).length;
    const closeBrackets = (repaired.match(/\]/g) || []).length;
    
    // Add missing closing braces/brackets
    for (let i = 0; i < openBraces - closeBraces; i++) {
      repaired += '}';
    }
    for (let i = 0; i < openBrackets - closeBrackets; i++) {
      repaired += ']';
    }
  }
  
  return repaired;
}

export async function generatePageConfig(userPrompt: string): Promise<LandingPageConfig> {
  const schemaString = getSchemaString();
  const systemPrompt = `You are an expert SaaS landing page copywriter and designer. You must respond with ONLY a valid JSON object that follows this exact schema structure. Do not include any explanations, markdown formatting, or text outside the JSON object.

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

// Solution Section (NESB Framework)
- solutionSection.title: A title that introduces the solution (e.g., "The Solution", "How We Help", "Your Path Forward").
- solutionSection.subtitle: A subtitle that explains how you solve the problems.
- solutionSection.benefits: Array of 4 benefits following the NESB framework:
  * NEW: What's unique/novel about your solution
  * EASY: How simple it is to use/implement
  * SAFE: Trust signals, guarantees, security
  * BIG: Transformational results or outcomes

// Social Proof Section
- socialProof.title: A title that builds trust (e.g., "What Our Customers Say", "Trusted by Thousands", "Success Stories").
- socialProof.subtitle: A subtitle that encourages social validation.
- socialProof.stats: Array of 3-4 impressive statistics (e.g., "10,000+", "Happy Customers").
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

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 2000
  });

  // Extract JSON from markdown code block if present
  const content = completion.choices[0].message.content;
  if (!content) throw new Error("No content returned from OpenAI");
  
  console.log("Raw OpenAI response:", content);
  
  let jsonString = content.trim();
  
  // Try to extract JSON from markdown code blocks
  const codeBlockMatch = content.match(/```json([\s\S]*?)```/i) || content.match(/```([\s\S]*?)```/i);
  if (codeBlockMatch) {
    jsonString = codeBlockMatch[1].trim();
  }
  
  // Clean up the JSON string
  jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  
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
      
      // Create a minimal valid config as fallback
      console.log("Creating fallback config...");
      config = {
        business: { name: "LaunchGen", logo: "" },
        hero: {
          headline: "AI-Powered Landing Page Generator",
          headlineHighlights: ["AI-Powered"],
          subheadline: "Create high-converting landing pages in minutes with AI.",
          cta: "Get Started",
          heroTag: "AI-Powered",
          heroTagIcon: "sparkles",
          backgroundImage: ""
        },
        problemSection: {
          title: "The Problem",
          subtitle: "Are you struggling with these common challenges?",
          painPoints: []
        },
        solutionSection: {
          title: "The Solution",
          subtitle: "Here's how we solve your problems",
          benefits: []
        },
        socialProof: {
          title: "What Our Customers Say",
          subtitle: "Join thousands of satisfied customers",
          testimonials: [],
          stats: []
        },
        features: [
          { title: "AI-Powered Generation", description: "Generate landing pages with AI.", icon: "", benefit: "Save time and effort." }
        ],
        featuresTitle: "Powerful Features",
        featuresSubtitle: "Everything you need to build, deploy, and scale your applications with confidence.",
        guarantees: {
          title: "Our Guarantees",
          subtitle: "We're confident you'll love our solution",
          guarantees: []
        },
        faq: {
          title: "Frequently Asked Questions",
          subtitle: "Everything you need to know",
          questions: []
        },
        ctaTitle: "Ready to Get Started?",
        ctaSubtitle: "Join thousands of users who are already building amazing things with our platform.",
        urgency: {
          enabled: false,
          message: "Limited Time Offer",
          deadline: "Ends in 24 hours"
        },
        theme: {
          mode: "white",
          accentColor: "#6366f1"
        }
      };
      console.log("Fallback config created successfully");
    }
  }

  // --- Validation ---
  console.log("Parsed config:", config);
  
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

  // Fallbacks for empty or missing fields
  if (!config.business || !config.business.name || config.business.name.trim() === "") {
    if (!config.business) config.business = {};
    config.business.name = "LaunchGen";
  }
  if (!config.business.logo) {
    config.business.logo = "";
  }
  if (!config.hero.headlineHighlights || !Array.isArray(config.hero.headlineHighlights)) {
    config.hero.headlineHighlights = [];
  }
  if (!config.hero.heroTag || config.hero.heroTag.trim() === "") {
    config.hero.heroTag = "AI-Powered Solution";
  }
  const validIcons = ["zap", "star", "shield", "rocket", "target", "trendingUp", "award", "sparkles"];
  if (!config.hero.heroTagIcon || !validIcons.includes(config.hero.heroTagIcon) || config.hero.heroTagIcon.trim() === "") {
    config.hero.heroTagIcon = "sparkles";
  }
  if (!config.hero.cta && config.hero.ctaText) {
    config.hero.cta = config.hero.ctaText;
  }

  // Problem Section fallbacks
  if (!config.problemSection) {
    config.problemSection = {
      title: "The Problem",
      subtitle: "Are you struggling with these common challenges?",
      painPoints: []
    };
  }
  if (!config.problemSection.painPoints || !Array.isArray(config.problemSection.painPoints)) {
    config.problemSection.painPoints = [];
  }

  // Solution Section fallbacks
  if (!config.solutionSection) {
    config.solutionSection = {
      title: "The Solution",
      subtitle: "Here's how we solve your problems",
      benefits: []
    };
  }
  if (!config.solutionSection.benefits || !Array.isArray(config.solutionSection.benefits)) {
    config.solutionSection.benefits = [];
  }

  // Social Proof fallbacks
  if (!config.socialProof) {
    config.socialProof = {
      title: "What Our Customers Say",
      subtitle: "Join thousands of satisfied customers",
      testimonials: [],
      stats: []
    };
  }
  if (!config.socialProof.testimonials || !Array.isArray(config.socialProof.testimonials)) {
    config.socialProof.testimonials = [];
  }
  if (!config.socialProof.stats || !Array.isArray(config.socialProof.stats)) {
    config.socialProof.stats = [];
  }

  // Features fallbacks
  if (!config.featuresTitle || config.featuresTitle.trim() === "") {
    config.featuresTitle = "Powerful Features";
  }
  if (!config.featuresSubtitle || config.featuresSubtitle.trim() === "") {
    config.featuresSubtitle = "Everything you need to build, deploy, and scale your applications with confidence.";
  }
  if (!config.features || !Array.isArray(config.features)) {
    config.features = [];
  }

  // Guarantees fallbacks
  if (!config.guarantees) {
    config.guarantees = {
      title: "Our Guarantees",
      subtitle: "We're confident you'll love our solution",
      guarantees: []
    };
  }
  if (!config.guarantees.guarantees || !Array.isArray(config.guarantees.guarantees)) {
    config.guarantees.guarantees = [];
  }

  // FAQ fallbacks
  if (!config.faq) {
    config.faq = {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know",
      questions: []
    };
  }
  if (!config.faq.questions || !Array.isArray(config.faq.questions)) {
    config.faq.questions = [];
  }

  // CTA fallbacks
  if (!config.ctaTitle || config.ctaTitle.trim() === "") {
    config.ctaTitle = "Ready to Get Started?";
  }
  if (!config.ctaSubtitle || config.ctaSubtitle.trim() === "") {
    config.ctaSubtitle = "Join thousands of users who are already building amazing things with our platform.";
  }

  // Urgency fallbacks
  if (!config.urgency) {
    config.urgency = {
      enabled: false,
      message: "Limited Time Offer",
      deadline: "Ends in 24 hours"
    };
  }

  // Theme fallbacks
  if (!config.theme) {
    config.theme = {
      mode: "white",
      accentColor: "#6366f1"
    };
  }
  if (!config.theme.mode || config.theme.mode.trim() === "") {
    config.theme.mode = "white";
  }
  if (!config.theme.accentColor || config.theme.accentColor.trim() === "") {
    config.theme.accentColor = "#6366f1";
  }

  return config;
} 