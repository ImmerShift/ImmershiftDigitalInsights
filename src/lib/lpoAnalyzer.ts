import { analyzeMessageMatch } from './gemini';

/**
 * Utility for analyzing landing page optimization relative to ad creative.
 */
export const LpoAnalyzer = {
  /**
   * Evaluates the consistency between an ad hook and its destination URL.
   */
  async checkMessageMatch(adCopy: string, url: string, apiKey?: string) {
    try {
      const result = await analyzeMessageMatch(adCopy, url, apiKey);
      return result;
    } catch (error) {
      console.error('LPO Analysis Failed:', error);
      return {
        score: 0,
        critique: "Unable to reach the landing page for analysis.",
        suggestions: ["Manually verify that the ad headline exists on the lander above the fold."]
      };
    }
  }
};
