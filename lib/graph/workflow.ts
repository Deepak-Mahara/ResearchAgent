// src/lib/graph/workflow.ts
import { StateGraph, START, END } from "@langchain/langgraph";
import { ResearchStateAnnotation } from "./state";
import { 
  analyzeRiskAndValuationNode, 
  analyzeGrowthAndFundamentalsNode, 
  analyzeMarketSentimentNode, 
  portfolioManagerJudgeNode 
} from "./nodes";

// Initialize the StateGraph with our annotation schema
const builder = new StateGraph(ResearchStateAnnotation)
  // 1. Register all four reasoning nodes
  .addNode("risk_valuation", analyzeRiskAndValuationNode)
  .addNode("growth_fundamentals", analyzeGrowthAndFundamentalsNode)
  .addNode("market_sentiment", analyzeMarketSentimentNode)
  .addNode("portfolio_judge", portfolioManagerJudgeNode)

  // 2. Fan-out topology: Route START to all 3 specialists simultaneously
  .addEdge(START, "risk_valuation")
  .addEdge(START, "growth_fundamentals")
  .addEdge(START, "market_sentiment")

  // 3. Fan-in topology: Wait for all 3 specialists to complete, then route to Judge
  .addEdge("risk_valuation", "portfolio_judge")
  .addEdge("growth_fundamentals", "portfolio_judge")
  .addEdge("market_sentiment", "portfolio_judge")

  // 4. Terminate execution after the Judge emits the final report
  .addEdge("portfolio_judge", END);

// Compile into an executable LangGraph instance
export const researchGraph = builder.compile();