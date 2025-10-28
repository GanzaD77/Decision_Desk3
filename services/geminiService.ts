import { GoogleGenAI, Type } from "@google/genai";

const getHistoricalData = (): string => {
  try {
    const history = JSON.parse(localStorage.getItem('decisionDeskHistory') || '[]');
    if (history.length === 0) {
      return 'No historical data available.';
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentData = history
      .filter((entry: { date: string; data: string }) => new Date(entry.date) > sevenDaysAgo)
      .reverse() // Oldest first for trend analysis
      .map((entry: { date: string; data: string }) => `Date: ${new Date(entry.date).toLocaleDateString()}\nData: ${entry.data}`)
      .join('\n\n');

    return recentData.trim() === '' ? 'No data from the last 7 days.' : recentData;
  } catch (error) {
    console.error("Failed to read data from localStorage:", error);
    return 'Could not retrieve historical data.';
  }
};

const getToneInstruction = (tone: string): string => {
  switch (tone) {
    case 'Strategic':
      return 'Write like a high-level business strategist. Use clear, concise language focused on long-term goals, market positioning, and competitive advantages. The tone should be sharp, insightful, and forward-looking.';
    case 'Tough Love':
      return 'Write like a direct, no-nonsense coach who wants to see the user win. Be brutally honest about weaknesses and risks. Use strong, motivating language. Challenge the user to confront hard truths and take decisive action.';
    case 'Chill':
    default:
      return 'Write like a calm, experienced mentor. Use a relaxed, easygoing, and positive tone. Sprinkle in some casual language but keep it insightful.';
  }
};

const createPrompt = (userData: string, tone: string, historicalData: string): string => {
  const finalUserData = userData.trim() === '' ? 'No data provided today.' : userData;
  return `
    You are DecisionDesk, an AI business strategist and daily advisor for busy entrepreneurs.
    Your job is to turn the user’s input data into a concise, insight-rich morning business briefing that helps them decide what to focus on today.

    First, review the historical data from the last 7 days to identify any trends, patterns, or recurring issues. Mention these trends briefly in the "Daily Overview" section if they are significant.

    Then, using today's data and the context of the historical trends, produce a clear, confident, and human report in the following markdown-style format. Use the exact emoji prefixes and heading format. Each section must be on a new line.

    🧭 **Daily Overview** — One short paragraph summarizing key performance highlights and what they mean for the business today. Weave in any notable trends from the past week here. Focus on insight, not restating data.

    ⚠️ **What Needs Attention** — Identify one issue, risk area, or weak signal that could impact progress. Explain it briefly.

    💡 **Smart Moves for Today** — Give 2–3 specific, actionable recommendations to grow revenue, improve efficiency, or strengthen the brand. Each recommendation should be a new bullet point.

    🔥 **Decision of the Day** — One single prioritized decision the entrepreneur should make today. Be decisive and persuasive.

    💭 **CEO Thought** — End with a short motivational quote or personalized encouragement line that fits the tone of the report.

    Writing Style Guidelines:
    - Max 300 words total.
    - Tone: ${getToneInstruction(tone)}
    - Be clear, confident, and human. Sound like a helpful strategist, not a corporate report.
    - Always interpret what the data *means*, not just what it says.
    - Keep tone consistent.
    - DO NOT output explanations of your reasoning — just give the formatted briefing.

    If the user provides "No data provided today.", give a short default productivity tip and encouragement in the same format. For "Smart Moves", suggest a generic productivity tip. For "Decision of the Day", suggest a small, manageable task.

    Historical Data (last 7 days):
    ${historicalData}

    Today's Business Data:
    ${finalUserData}
  `;
};

const businessCategories = [
  'Coffee', 'Restaurant', 'Gym', 'Fashion', 'Tech', 
  'Marketing', 'Real Estate', 'Education', 'Travel', 'Music', 'Other'
];

const classifyBusinessType = async (userData: string, ai: GoogleGenAI): Promise<string> => {
  if (!userData.trim()) {
    return 'Other'; // Default if no data
  }

  const prompt = `
    Analyze the following business data and classify the business into one of these categories:
    ${businessCategories.join(', ')}.
    
    - For a cafe, coffee roaster, or similar, use "Coffee".
    - For a gym or fitness studio, use "Gym".
    - For clothing, apparel, boutiques, or fashion brands, use "Fashion".
    - For startups, software, hardware, or tech companies, use "Tech".
    - For advertising or digital agencies, use "Marketing".
    - For education, online courses, or coaching, use "Education".
    
    If the business doesn't fit any category, classify it as "Other".
    Return ONLY the category name in the specified JSON format.

    Business Data:
    ${userData}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            businessType: {
              type: Type.STRING,
              description: 'The classified business category.',
              enum: businessCategories
            },
          },
          required: ['businessType'],
        },
      },
    });
    
    const jsonStr = response.text.trim();
    const jsonResponse = JSON.parse(jsonStr);
    return jsonResponse.businessType || 'Other';
  } catch (error) {
    console.error("Error classifying business type:", error);
    return 'Other'; // Fallback
  }
};


export const generateBriefing = async (userData: string, tone: string): Promise<{ briefing: string, businessType: string }> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const businessType = await classifyBusinessType(userData, ai);
  const historicalData = getHistoricalData();
  const prompt = createPrompt(userData, tone, historicalData);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const briefing = response.text;
    const footer = "\n\n☕💼 DecisionDesk AI — Your morning coffee for smarter decisions.";
    
    return {
      briefing: briefing.trim() + footer,
      businessType: businessType
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("The AI service is currently unavailable. Please try again later.");
  }
};