import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const { headline, subheadline, businessName } = await req.json();
    
    if (!headline) {
      return NextResponse.json({ error: "Headline is required." }, { status: 400 });
    }

    // Create a concept-driven prompt for DALL-E based on the hero content
    const imagePrompt = `Create a professional, realistic background image for a landing page about: "${headline}". ${subheadline ? `The subheadline is: "${subheadline}".` : ''} ${businessName ? `Business name: ${businessName}.` : ''}

CONCEPT: Think about what this product/service actually does and create a realistic scene that represents it. For example:
- If it's about productivity software: Show a clean desk with a laptop, coffee, and organized workspace
- If it's about fitness: Show gym equipment, healthy food, or people exercising
- If it's about finance: Show modern office, charts, or financial documents
- If it's about education: Show books, classroom, or learning materials
- If it's about design: Show design tools, creative workspace, or finished projects
- If it's about communication: Show people collaborating, meeting rooms, or communication devices

REQUIREMENTS:
- Use realistic objects and scenes, not abstract patterns
- Create a concept that directly relates to the product/service
- Professional and business-appropriate
- Subtle enough to not distract from text content
- Good contrast for text readability
- High quality, modern photography style
- No text, logos, or people's faces in the image
- Soft, slightly blurred background effect for hero section use
- Warm, inviting lighting that feels professional`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural",
    });

    const imageUrl = response.data?.[0]?.url;
    
    if (!imageUrl) {
      throw new Error("Failed to generate image");
    }

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      prompt: imagePrompt 
    });

  } catch (error: any) {
    console.error("Image generation error:", error);
    return NextResponse.json({
      error: "Failed to generate image. Please try again.",
      details: error.message
    }, { status: 500 });
  }
} 