import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface DreamInsight {
  summary: string;
  emotionalTone: string;
  symbolicInterpretation: string;
  fullAnalysis: string;
}

export async function analyzeDream(
  dreamContent: string,
  metadata?: { user_mood?: string | null; tags?: string[] | null }
): Promise<DreamInsight> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-09-2025' });

  const mood = metadata?.user_mood;
  const tags = metadata?.tags;

  const prompt = `You are a thoughtful, supportive dream analyst. Analyze this dream with empathy and insight.

Dream: ${dreamContent}
${mood ? `Mood: ${mood}` : ''}
${tags && tags.length > 0 ? `Tags: ${tags.join(', ')}` : ''}

Provide your analysis in the following JSON format:
{
  "summary": "A brief, high-level summary of the dream (2-3 sentences)",
  "emotionalTone": "Identification and exploration of the emotional tone and feelings present in the dream",
  "symbolicInterpretation": "Thoughtful exploration of symbols, metaphors, and their potential meanings (framed as reflection prompts, not definitive answers)",
  "fullAnalysis": "A comprehensive analysis combining all aspects with gentle suggestions for how the dream might relate to waking life"
}

Guidelines:
- Be supportive, calm, and introspective in tone
- Avoid clinical, diagnostic, or deterministic language
- Frame interpretations as possibilities and reflection prompts, not facts
- Be respectful of the deeply personal nature of dreams
- Focus on self-discovery and personal growth
- Acknowledge that dreams are subjective and open to multiple interpretations`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response (removing markdown code blocks if present)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from Gemini response');
    }
    
    const insight: DreamInsight = JSON.parse(jsonMatch[0]);
    return insight;
  } catch (error) {
    console.error('Error generating dream insight:', error);
    throw new Error('Failed to generate insight. Please try again later.');
  }
}
