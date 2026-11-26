// lib/graph/nodes.ts
import { ChatGroq } from "@langchain/groq";
import { ResearchState } from "./state";

const GROQ_MODEL = "openai/gpt-oss-20b";
const MAX_PROMPT_CHARS = 1400;
const TRUNCATION_MARKER = "\n[Research data truncated]";

function buildPrompt(instructions: string, researchData: unknown): string {
  const dataLabel = "\n\nResearch data (JSON):\n";
  const suffix =
    "\n\nUse only the supplied evidence. Explicitly note when data is missing or truncated.";
  const serializedData = JSON.stringify(researchData) ?? "null";
  const availableDataChars =
    MAX_PROMPT_CHARS - instructions.length - dataLabel.length - suffix.length;

  if (availableDataChars < TRUNCATION_MARKER.length) {
    throw new Error("Prompt instructions exceed the configured Groq input budget.");
  }

  const boundedData =
    serializedData.length > availableDataChars
      ? `${serializedData.slice(0, availableDataChars - TRUNCATION_MARKER.length)}${TRUNCATION_MARKER}`
      : serializedData;

  return `${instructions}${dataLabel}${boundedData}${suffix}`;
}

function pickFields(value: unknown, fields: string[]): unknown {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;

  const record = value as Record<string, unknown>;
  return Object.fromEntries(
    fields.filter((field) => field in record).map((field) => [field, record[field]])
  );
}

function compactFinancials(value: unknown): unknown {
  if (!Array.isArray(value)) return value;

  const financialFields = [
    "date",
    "calendarYear",
    "year",
    "revenue",
    "netIncome",
    "operatingIncome",
    "ebitda",
    "grossProfit",
    "eps",
    "operatingIncomeRatio",
    "netIncomeRatio",
  ];

  return value.slice(0, 3).map((statement) =>
    pickFields(statement, financialFields)
  );
}

// 1. Quantitative Risk & Valuation Specialist (GPT-OSS 20B via Groq)
const groqQuant = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: GROQ_MODEL,
  temperature: 0.1,
  maxTokens: 300,
  reasoningEffort: "low",
});

// 2. Growth & Fundamentals Specialist (GPT-OSS 20B via Groq)
const growthSpecialist = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: GROQ_MODEL,
  temperature: 0.2,
  maxTokens: 300,
  reasoningEffort: "low",
});

// 3. Market & Sentiment Specialist (GPT-OSS 20B via Groq)
const sentimentSpecialist = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: GROQ_MODEL,
  temperature: 0.3,
  maxTokens: 300,
  reasoningEffort: "low",
});

// 4. Portfolio Manager Judge (GPT-OSS 20B via Groq)
const portfolioJudge = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: GROQ_MODEL,
  temperature: 0.2,
  maxTokens: 1200,
  reasoningEffort: "low",
});

export async function analyzeRiskAndValuationNode(state: ResearchState) {
  const { ticker, marketPricing, growthAndRatios } = state.rawPayload;

  if (!growthAndRatios?.ratios && !marketPricing?.keyMetrics) {
    return { riskValuationReport: `⚠️ RISK ANALYST WARNING: Quantitative valuation metrics for ${ticker} could not be retrieved from the financial provider endpoints. Solvency and multiple analyses are suspended due to missing upstream ratio structures.` };
  }

  const prompt = buildPrompt(`You are a strict Quantitative Risk & Valuation Analyst at an institutional hedge fund.
Analyze the following market pricing and ratio data for ${ticker}.
Provide a concise, highly analytical 3-bullet evaluation focusing strictly on:
1. Valuation multiples (P/E, EV/EBITDA, Price-to-Book) compared to standard benchmarks.
2. Debt load and solvency risk (Debt-to-Equity, current ratios).
3. Margin of safety and quantitative downside risk.
Do not use generic fluff. Provide hard mathematical reasoning.`, {
    marketPricing: {
      quote: marketPricing?.quote,
      keyMetrics: marketPricing?.keyMetrics,
    },
    growth: growthAndRatios?.growth,
    ratios: growthAndRatios?.ratios,
  });

  const response = await groqQuant.invoke(prompt);
  return { riskValuationReport: response.content.toString() };
}

export async function analyzeGrowthAndFundamentalsNode(state: ResearchState) {
  const { ticker, overview, financials, growthAndRatios } = state.rawPayload;

  if (financials?.error || (Array.isArray(financials) && financials.length === 0)) {
    return { growthFundamentalsReport: `⚠️ FUNDAMENTAL ANALYST WARNING: Multi-year income statements are unavailable for ${ticker}. Moat evaluation and long-term margin trajectory analysis are offline due to historical database ingestion failure.` };
  }

  const prompt = buildPrompt(`You are a Fundamental Equity Research Analyst specializing in corporate growth trajectories.
Analyze the multi-year income statements and growth rates for ${ticker}.
Provide a structured 3-bullet analysis evaluating:
1. Revenue and net income trajectory over the last 3 reporting periods.
2. Operating margin expansion or compression trends.
3. Long-term structural growth sustainability and competitive moat.`, {
    companyProfile: pickFields(overview, [
      "name",
      "country",
      "finnhubIndustry",
      "marketCapitalization",
    ]),
    incomeStatements: compactFinancials(financials),
    growth: growthAndRatios?.growth,
    ratios: growthAndRatios?.ratios,
  });

  const response = await growthSpecialist.invoke(prompt);
  return { growthFundamentalsReport: response.content.toString() };
}

export async function analyzeMarketSentimentNode(state: ResearchState) {
  const { ticker, recentNews } = state.rawPayload;

  const prompt = buildPrompt(`You are a Financial Behavioral & Sentiment Analyst. Avoid hype and focus on realistic, grounded market psychology.
Analyze the latest news headlines and sentiment feeds for ${ticker} from the past 10 days.
Provide an objective 3-bullet analysis covering:
1. Primary narrative catalysts currently driving institutional and retail sentiment.
2. Realistic assessment of regulatory, geopolitical, or PR risks mentioned in the press.
3. Overall sentiment scoring (Bullish / Neutral / Bearish) with explicit justification.`, {
    recentNews: recentNews.slice(0, 5).map((article) =>
      pickFields(article, ["headline", "source", "datetime"])
    ),
  });

  try {
    const response = await sentimentSpecialist.invoke(prompt);
    return { marketSentimentReport: response.content.toString() };
  } catch (error) {
    console.error("Groq market sentiment analysis failed:", error);
    return {
      marketSentimentReport:
        `⚠️ SENTIMENT ANALYST WARNING: Live news sentiment analysis for ${ticker} is temporarily unavailable because the Groq provider request failed. Base the market sentiment section on the supplied recent-news context and clearly mark this limitation.`,
    };
  }
}

export async function portfolioManagerJudgeNode(state: ResearchState) {
  const { ticker } = state.rawPayload;
  const { riskValuationReport, growthFundamentalsReport, marketSentimentReport } = state;

  const prompt = buildPrompt(`Synthesize three analyst reports for ${ticker}; balance conflicting evidence and never invent facts. Return concise Markdown:
# Tactical Investment Report: ${ticker}
## Executive Verdict & Rating
* **Tactical Rating:** [STRONGLY BULLISH / BULLISH / NEUTRAL / BEARISH / STRONGLY BEARISH]
* **Target Allocation Weight:** [0.0% to 5.0%]
* **Conviction Score:** [1 to 10]
## Core Analyst Synthesis
* **Valuation & Risk:** [key takeaway]
* **Fundamental Growth:** [key takeaway]
* **Market Sentiment & Psychology:** [key takeaway]
## Strategic Allocation Thesis
[One paragraph: rationale, key catalysts, and risks over the next 12 months.]`, {
    riskValuationReport: riskValuationReport.slice(0, 180),
    growthFundamentalsReport: growthFundamentalsReport.slice(0, 180),
    marketSentimentReport: marketSentimentReport.slice(0, 180),
  });

  const response = await portfolioJudge.invoke(prompt);
  const finalInvestmentDecision = response.content.toString().trim();
  if (!finalInvestmentDecision) {
    throw new Error("Groq portfolio judge returned an empty final report.");
  }

  return { finalInvestmentDecision };
}