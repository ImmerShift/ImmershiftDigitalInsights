import { BusinessProfile } from '../types/business';

export interface ReportSection {
  id: string;
  type: 'title' | 'summary' | 'insight' | 'action';
  heading: string;
  content: string;
}

export interface ReportDraft {
  month: string;
  status: 'Draft Ready' | 'Generating' | 'Approved';
  lastUpdated: string;
  sections: ReportSection[];
}

export interface DashboardContextData {
  month: string;
  metrics: Record<string, string>;
  topChannels: string[];
  keyHighlights: string[];
  issues?: string[];
}

/**
 * Strips markdown code blocks (e.g., ```json ... ```) from a string.
 */
function stripMarkdownFormatting(text: string): string {
  return text.replace(/^```json\s*/m, '').replace(/```\s*$/m, '').trim();
}

/**
 * Generates an executive narrative draft using the Gemini API based on marketing context data.
 * 
 * @param business The business profile (name, industry, goals, persona).
 * @param data The raw analytics data to feed into the prompt context.
 * @param apiKey The user's Gemini API key.
 */
export async function generateMonthlyNarrative(
  business: BusinessProfile,
  data: DashboardContextData, 
  apiKey?: string
): Promise<ReportDraft> {
  const key = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!key) {
    console.error('Gemini API key is missing.');
    return getFallbackDraft(data.month, 'No API key provided.');
  }

  const metricSummary = Object.entries(data.metrics)
    .map(([key, val]) => `- ${key}: ${val}`)
    .join('\n');

  const prompt = `
You are a fractional CMO for ${business.name}, operating in the ${business.industry} industry. 
Their primary business goal is: ${business.primaryGoal}.
Your executive persona is: ${business.persona} (maintain this tone throughout).

Analyze the provided raw marketing metrics and generate a high-level executive report for ${data.month}.
Match your tone to a professional C-suite advisor who is ${business.persona}.

Raw Context:
${metricSummary}

Market Performance:
- Top Channels: ${data.topChannels.join(', ')}
- Strategic Insights: ${data.keyHighlights.join(', ')}
- Barriers: ${data.issues?.join(', ') || 'None reported'}

Return valid JSON:
{
  "sections": [
    {
      "id": "string",
      "type": "title" | "summary" | "insight" | "action",
      "heading": "string",
      "content": "string"
    }
  ]
}

Guidelines:
1. 'title': Contextually aware heading reflecting the ${business.industry} landscape.
2. 'summary': Performance vs goals using the ${business.persona} tone.
3. 'insight': Actionable "Why" behind the data.
4. 'action': 3-4 tactical next steps for their team.
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json",
          }
        }),
      }
    );

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const responseData = await response.json();
    const rawText = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleanJsonString = stripMarkdownFormatting(rawText);
    const parsedObj = JSON.parse(cleanJsonString);

    return {
      month: data.month,
      status: 'Draft Ready',
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sections: parsedObj.sections
    };

  } catch (error: any) {
    return getFallbackDraft(data.month, error.message);
  }
}

function getFallbackDraft(month: string, errorMessage: string): ReportDraft {
  return {
    month,
    status: 'Draft Ready',
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sections: [
      { id: '1', type: 'title', heading: 'Performance Update', content: '' },
      { id: '2', type: 'summary', heading: 'Insight Retrieval Error', content: errorMessage }
    ]
  };
}

/**
 * Analyzes a user's natural language query against the current dashboard context.
 */
export async function analyzeDashboardQuery(
  userQuery: string,
  dashboardContext: any,
  apiKey?: string
): Promise<string> {
  const key = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!key) {
    return "AI Analyst is currently offline. Please configure your API key.";
  }

  const prompt = `
You are a Senior SaaS Data Analyst. Your goal is to help users understand their marketing performance data.
You have access to the following JSON context representing the current dashboard view:
${JSON.stringify(dashboardContext, null, 2)}

User Question: "${userQuery}"

Instructions:
1. Base your answer ONLY on the provided JSON data.
2. If the data required to answer the question is missing, state that clearly.
3. Use professional, clinical, and data-driven language.
4. Format your response with Markdown (use bolding for emphasis, bullet points for lists, and tables where appropriate).
5. Be concise but insightful.
6. The user is an executive; focus on ROI, efficiency, and scale.
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2, // Low temperature for factual analysis
            topK: 40,
            topP: 0.95,
          }
        }),
      }
    );

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "I was unable to analyze this data point.";
  } catch (error) {
    console.error('AI Analyst Error:', error);
    return "The analyst encountered an engine error while processing your request.";
  }
}

/**
 * Scans the provided data for performance anomalies or red flags.
 */
export async function detectAnomalies(
  dashboardContext: any,
  apiKey?: string
): Promise<string[]> {
  const key = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) return [];

  const prompt = `
Scan the following marketing data for performance anomalies, cost spikes, or efficiency drops:
${JSON.stringify(dashboardContext, null, 2)}

Identify any "Red Flags" (e.g., spend up while conversions down) or "Golden Opportunities" (e.g., channel X peaking with high ROAS).

Return ONLY a JSON array of strings, where each string is a concise alert.
Format: ["Alert 1", "Alert 2"]
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          }
        }),
      }
    );

    if (!response.ok) return [];
    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return [];
    
    return JSON.parse(rawText);
  } catch (error) {
    return [];
  }
}

