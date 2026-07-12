// src/app/api/research/route.ts
import { NextResponse } from "next/server";
import { 
  resolveCompanySymbol, 
  fetchCompanyOverview, 
  fetchFinancialAnalysis, 
  fetchStockAnalysis, 
  fetchCompanyGrowth, 
  fetchNewsSentiment 
} from "../../../lib/api-workers";
import { researchGraph } from "../../../lib/graph/workflow";

export async function POST(request: Request) {
  try {
    const { companyName } = await request.json();

    if (!companyName) {
      return NextResponse.json({ error: "Company name parameter is mandatory." }, { status: 400 });
    }

    // Node 0: Resolve User String to clean Equity Ticker Symbol
    let symbol: string;
    try {
      symbol = await resolveCompanySymbol(companyName);
    } catch (err: any) {
      return NextResponse.json({ error: err.message || "Failed to resolve company listing." }, { status: 404 });
    }

    // Node 1: Execute concurrent Specialized Workers in parallel
    const [overview, financialData, stockData, growthData, newsData] = await Promise.all([
      fetchCompanyOverview(symbol),
      fetchFinancialAnalysis(symbol),
      fetchStockAnalysis(symbol),
      fetchCompanyGrowth(symbol),
      fetchNewsSentiment(symbol)
    ]);

    // Compile aggregated payload
    const aggregatedResearchPayload = {
      ticker: symbol,
      timestamp: new Date().toISOString(),
      overview,
      financials: financialData,
      marketPricing: stockData,
      growthAndRatios: growthData,
      recentNews: newsData
    };

    // Node 2: Execute the LangGraph Multi-Agent Reasoning Workflow!
    // We pass the raw API data in as the initial state
    const finalState = await researchGraph.invoke({
      rawPayload: aggregatedResearchPayload
    });

    // Return both the raw aggregated data AND the AI-generated reports to the frontend
    return NextResponse.json({ 
      success: true, 
      data: aggregatedResearchPayload,
      reports: {
        riskValuation: finalState.riskValuationReport,
        growthFundamentals: finalState.growthFundamentalsReport,
        marketSentiment: finalState.marketSentimentReport,
        finalDecision: finalState.finalInvestmentDecision
      }
    });

  } catch (error: any) {
    console.error("LangGraph execution failure:", error);
    return NextResponse.json({ error: error.message || "Internal Server Processing Error during AI execution." }, { status: 500 });
  }
}