// src/app/api/research/route.ts

import { NextResponse } from "next/server";
import {
    fetchCompanyGrowth,
    fetchCompanyOverview,
    fetchFinancialAnalysis,
    fetchNewsSentiment,
    fetchStockAnalysis,
    resolveCompanySymbol
} from "../../../lib/api-workers";

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

    // Aggregate Research Node: Compile the payloads cleanly
    const aggregatedResearchPayload = {
      ticker: symbol,
      timestamp: new Date().toISOString(),
      overview,
      financials: financialData,
      marketPricing: stockData,
      growthAndRatios: growthData,
      recentNews: newsData
    };

    // Return the aggregated research data
    return NextResponse.json({ 
      success: true, 
      data: aggregatedResearchPayload 
    });

  } catch (error: any) {
    console.error("Aggregation node failure:", error);
    return NextResponse.json({ error: "Internal Server Processing Error during data aggregation." }, { status: 500 });
  }
}