// src/lib/graph/state.ts
import { Annotation } from "@langchain/langgraph";

export interface ResearchDataPayload {
  ticker: string;
  timestamp: string;
  overview: any;
  financials: any;
  marketPricing: any;
  growthAndRatios: any;
  recentNews: any[];
}

/**
 * The Graph State tracks the raw data from our API workers,
 * the specialized markdown reports from each LLM node,
 * and the final synthesis from our Portfolio Manager judge.
 */
export const ResearchStateAnnotation = Annotation.Root({
  rawPayload: Annotation<ResearchDataPayload>(),
  
  // Specialist Node Outputs
  riskValuationReport: Annotation<string>(),
  growthFundamentalsReport: Annotation<string>(),
  marketSentimentReport: Annotation<string>(),
  
  // Final Output
  finalInvestmentDecision: Annotation<string>(),
});

export type ResearchState = typeof ResearchStateAnnotation.State;