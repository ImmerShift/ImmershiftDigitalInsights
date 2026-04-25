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
  totalRevenue: string;
  totalSpend: string;
  blendedRoas: string;
  metaFunnelDropoff: boolean;
  topChannels: string[];
  keyHighlights: string[];
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
 * @param data The raw analytics data to feed into the prompt context.
 * @param apiKey The user's Gemini API key (defaults to VITE_GEMINI_API_KEY if not passed).
 */
export async function generateMonthlyNarrative(
  data: DashboardContextData, 
  apiKey?: string
): Promise<ReportDraft> {
  const key = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!key) {
    console.error('Gemini API key is missing.');
    return getFallbackDraft(data.month, 'No API key provided. Please configure your Gemini API Key environments variable.');
  }

  const prompt = `
You are an expert Chief Marketing Officer for Mari Beach Club, a premium beachfront venue in Bali.
Analyze the provided raw metrics and generate an executive brief for the executive team.

Here is the raw data for the month of ${data.month}:
- Total Revenue: ${data.totalRevenue}
- Total Ad Spend: ${data.totalSpend}
- Blended ROAS: ${data.blendedRoas}
- Top Channels: ${data.topChannels.join(', ')}
- Meta Funnel Issue: ${data.metaFunnelDropoff ? 'Yes, there is a massive drop-off at the Initiate Checkout step due to failed TableCheck pixel integration.' : 'No active funnel tracking issues.'}
- Key Highlights: ${data.keyHighlights.join(', ')}

You must return ONLY valid JSON matching this exact schema:
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

Instructions:
1. Provide a 'title' section first with a catchy but professional, context-aware heading. 
2. Follow up with a 'summary' section summarizing the overall blended ROAS and revenue against ad spend.
3. Add 1-2 'insight' sections digging into the channel highlights and specifically bringing attention to the Meta Funnel issue if present.
4. End with an 'action' section prescribing 3 concrete next steps.
5. Do not wrap the JSON in markdown blocks like \`\`\`json. Return raw JSON.
`;

  try {
    // Explicitly targeting gemini-1.5-flash which is much faster and reliable for structured/JSON output 
    // while still keeping the simple REST format.
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            responseMimeType: "application/json",
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    const rawText = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Received empty or malformed response from Gemini API.');
    }

    const cleanJsonString = stripMarkdownFormatting(rawText);
    const parsedObj = JSON.parse(cleanJsonString);

    if (!parsedObj || !Array.isArray(parsedObj.sections)) {
      throw new Error('Parsed successful but response did not contain a valid sections array.');
    }

    return {
      month: data.month,
      status: 'Draft Ready',
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sections: parsedObj.sections
    };

  } catch (error: any) {
    console.error('Failed to generate narrative with Gemini:', error);
    return getFallbackDraft(data.month, error.message || 'The AI engine encountered an error generating the narrative. Please try again or check your API key.');
  }
}

/**
 * Returns a graceful fallback draft when the AI generation fails.
 */
function getFallbackDraft(month: string, errorMessage: string): ReportDraft {
  return {
    month,
    status: 'Draft Ready',
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sections: [
      {
        id: 'error-1',
        type: 'title',
        heading: `${month} Performance Draft`,
        content: `Error state rendering for ${month}`
      },
      {
        id: 'error-2',
        type: 'summary',
        heading: 'Generation Failed',
        content: `The AI engine encountered an error generating the narrative. Details: ${errorMessage}`
      }
    ]
  };
}
