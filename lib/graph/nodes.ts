// lib/graph/nodes.ts
import { ChatGroq } from "@langchain/groq";
import { ChatMistralAI } from "@langchain/mistralai";
import { ResearchState } from "./state";

// 1. Quantitative Risk & Valuation Specialist (Llama 3.3 70B via Groq)
const groqLlama = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.1,
});

// 2. Growth & Fundamentals Specialist (Gemma 2 9B via Groq)
// Using Google's open Gemma model hosted on Groq's high-speed infrastructure
const growthSpecialist = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile", 
  temperature: 0.2,
});

// 3. Market & Sentiment Specialist (Mistral Small via Mistral AI)
const mistralSmall = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY,
  model: "mistral-small-latest",
  temperature: 0.3,
});

// 4. Portfolio Manager Judge (Llama 3.3 70B via Groq)
// Using Llama 70B here gives you flagship-level reasoning without Google's Pro quota limits
const portfolioJudge = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile", 
  temperature: 0.2,
});

export async function analyzeRiskAndValuationNode(state: ResearchState) {
  const { ticker, marketPricing, growthAndRatios } = state.rawPayload;

  if (!growthAndRatios?.ratios && !marketPricing?.keyMetrics) {
    return { riskValuationReport: `⚠️ RISK ANALYST WARNING: Quantitative valuation metrics for ${ticker} could not be retrieved from the financial provider endpoints. Solvency and multiple analyses are suspended due to missing upstream ratio structures.` };
  }

  const prompt = `You are a strict Quantitative Risk & Valuation Valuation Analyst at an institutional hedge fund.
Analyze the following market pricing and ratio data for ${ticker}:
Market Pricing: ${JSON.stringify(marketPricing)}
Financial Ratios: ${JSON.stringify(growthAndRatios)}

Provide a concise, highly analytical 3-bullet evaluation focusing strictly on:
1. Valuation multiples (P/E, EV/EBITDA, Price-to-Book) compared to standard benchmarks.
2. Debt load and solvency risk (Debt-to-Equity, current ratios).
3. Margin of safety and quantitative downside risk.
Do not use generic fluff. Provide hard mathematical reasoning.`;

  const response = await groqLlama.invoke(prompt);
  return { riskValuationReport: response.content.toString() };
}

export async function analyzeGrowthAndFundamentalsNode(state: ResearchState) {
  const { ticker, overview, financials, growthAndRatios } = state.rawPayload;

  if (financials?.error || (Array.isArray(financials) && financials.length === 0)) {
    return { growthFundamentalsReport: `⚠️ FUNDAMENTAL ANALYST WARNING: Multi-year income statements are unavailable for ${ticker}. Moat evaluation and long-term margin trajectory analysis are offline due to historical database ingestion failure.` };
  }

  const prompt = `You are a Fundamental Equity Research Analyst specializing in corporate growth trajectories.
Analyze the multi-year income statements and growth rates for ${ticker}:
Company Profile: ${JSON.stringify(overview)}
3-Year Income Statements: ${JSON.stringify(financials)}
Growth Metrics: ${JSON.stringify(growthAndRatios)}

Provide a structured 3-bullet analysis evaluating:
1. Revenue and net income trajectory over the last 3 reporting periods.
2. Operating margin expansion or compression trends.
3. Long-term structural growth sustainability and competitive moat.`;

  const response = await growthSpecialist.invoke(prompt);
  return { growthFundamentalsReport: response.content.toString() };
}

export async function analyzeMarketSentimentNode(state: ResearchState) {
  const { ticker, recentNews } = state.rawPayload;

  const prompt = `You are a Financial Behavioral & Sentiment Analyst. You avoid hype and toxic positivity, focusing on realistic, grounded market psychology.
Analyze the latest news headlines and sentiment feeds for ${ticker} from the past 10 days:
Recent News Stream: ${JSON.stringify(recentNews)}

Provide an objective 3-bullet analysis covering:
1. Primary narrative catalysts currently driving institutional and retail sentiment.
2. Realistic assessment of regulatory, geopolitical, or PR risks mentioned in the press.
3. Overall sentiment scoring (Bullish / Neutral / Bearish) with explicit justification.`;

  const response = await mistralSmall.invoke(prompt);
  return { marketSentimentReport: response.content.toString() };
}

export async function portfolioManagerJudgeNode(state: ResearchState) {
  const { ticker } = state.rawPayload;
  const { riskValuationReport, growthFundamentalsReport, marketSentimentReport } = state;

  const prompt = `You are the Chief Investment Officer (CIO) and Portfolio Manager at an elite quantitative hedge fund.
You have received three specialized reports from your domain analysts regarding ${ticker}:

---
1. QUANTITATIVE RISK & VALUATION REPORT:
${riskValuationReport}

---
2. GROWTH & FUNDAMENTALS REPORT:
${growthFundamentalsReport}

---
3. MARKET & NEWS SENTIMENT REPORT:
${marketSentimentReport}

---
YOUR TASK:
Synthesize these three distinct viewpoints into a definitive, institutional-grade Markdown Investment Report. 
Weigh conflicting signals (e.g., strong fundamental growth vs. compressed valuation multiples or bearish news sentiment).

Your output MUST be formatted in clean Markdown and follow this exact structure:
# Tactical Investment Report: ${ticker}

## Executive Verdict & Rating
* **Tactical Rating:** [STRONGLY BULLISH / BULLISH / NEUTRAL / BEARISH / STRONGLY BEARISH]
* **Target Allocation Weight:** [0.0% to 5.0% of tactical portfolio]
* **Conviction Score:** [1 to 10]

## Core Analyst Synthesis
* **Valuation & Risk:** [1-2 sentences summarizing key takeaways]
* **Fundamental Growth:** [1-2 sentences summarizing key takeaways]
* **Market Sentiment & Psychology:** [1-2 sentences summarizing key takeaways]

## Strategic Allocation Thesis
[Write 2-3 paragraphs detailing why this specific tactical rating was chosen, how you resolved any conflicting signals between the analysts, and what primary catalysts or macro risks to monitor over the next 12 months.]`;

  const response = await portfolioJudge.invoke(prompt);
  return { finalInvestmentDecision: response.content.toString() };
}