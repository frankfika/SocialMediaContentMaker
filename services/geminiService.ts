import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedContent, PlatformId } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert social media manager and copywriter, effectively bilingual in Chinese and English.
Your task is to take a raw video description and generate optimized titles, descriptions, tags, and visual assets for specific platforms.

GLOBAL RULES:
1. **SEPARATION**: You must generate distinct Chinese and English versions for Title, Content, and Tags.
2. **TAGS**: Do NOT include the hashtag symbol "#" in the tag strings. Return only the keyword (e.g. "vlog" not "#vlog").
3. **QUALITY**: Adapt to the culture of each platform.

Platform Guidelines:

1. **YouTube**: 
   - Title: SEO-friendly (max 100 chars).
   - Content: Detailed description with timecodes structure if applicable.
   - Tags: High volume search keywords.

2. **Bilibili (B站)**:
   - Culture: "Bullet comments" (Danmu), "Coin/Like/Fav" (Sanlian).
   - Title: Engaging, meme-friendly or highly professional (depending on tone). 
   - Content: Include interaction reminders (e.g., "求三连").
   - Tags: Bilibili specific categories and meme tags.

3. **TikTok/Douyin**: 
   - Title: Short hook.
   - Content: Very short caption, focus on visual hook.
   - Tags: Trending challenges/topics.

4. **Xiaohongshu (Red)**: 
   - Title: Clickbait/Emotional (e.g., "绝了!", "必看"). 
   - Content: "Emoji heavy", bullet points, "Sisters" vibe.
   - Tags: Specific topic tags.

5. **WeChat Channels (视频号)**: 
   - Content: Short, social, authentic, suitable for friends circle.

6. **Twitter/X**: 
   - Content: Under 280 chars, thread hook style.

7. **Zhihu**: 
   - Title: Question format or professional statement.
   - Content: Intellectual, analytical depth.

For each platform, return a structured object with separate Chinese (zh) and English (en) fields.
`;

export const generateSocialCopy = async (
  description: string,
  platforms: PlatformId[],
  tone: string
): Promise<GeneratedContent[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Video Description: "${description}"
    Desired Tone: ${tone}
    Target Platforms: ${platforms.join(', ')}
    
    Generate content for ONLY the requested platforms.
    Ensure 'zh' fields are in Simplified Chinese and 'en' fields are in English.
    Do NOT add hashtags (#) to the tags arrays.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              platformId: {
                type: Type.STRING,
                description: "The ID of the platform.",
              },
              title: {
                type: Type.OBJECT,
                properties: {
                  zh: { type: Type.STRING, description: "Chinese Title" },
                  en: { type: Type.STRING, description: "English Title" },
                },
                required: ["zh", "en"]
              },
              content: {
                type: Type.OBJECT,
                properties: {
                  zh: { type: Type.STRING, description: "Chinese Description/Caption" },
                  en: { type: Type.STRING, description: "English Description/Caption" },
                },
                required: ["zh", "en"]
              },
              tags: {
                type: Type.OBJECT,
                properties: {
                  zh: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Chinese tags (no #)" },
                  en: { type: Type.ARRAY, items: { type: Type.STRING }, description: "English tags (no #)" },
                },
                required: ["zh", "en"]
              },
              coverText: {
                type: Type.STRING,
                description: "Short text to be overlaid on the video thumbnail (Bilingual mix is okay here).",
              },
              visualPrompt: {
                type: Type.STRING,
                description: "A descriptive prompt in English for AI image generation.",
              },
              extraMetadata: {
                type: Type.STRING,
                description: "Extra platform advice.",
              },
            },
            required: ["platformId", "title", "content", "tags", "coverText", "visualPrompt"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) return [];

    const data = JSON.parse(text) as GeneratedContent[];
    
    // Normalize platform IDs
    return data.map(item => ({
      ...item,
      platformId: item.platformId.toLowerCase()
    }));

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateThumbnail = async (
  prompt: string,
  aspectRatio: "16:9" | "9:16" | "3:4" | "1:1"
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Add keywords to ensure high quality social media style
  const enhancedPrompt = `High quality, social media thumbnail, viral, 4k, text-free, ${prompt}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: enhancedPrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};