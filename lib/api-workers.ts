// src/lib/api-workers.ts

const FINNHUB_KEY = process.env.FINNHUB_API_KEY || "";
const FMP_KEY = process.env.FMP_API_KEY || "";

 


/**
 * WORKER 0: Symbol Resolver
 * Takes a messy company name string, searches Finnhub, and returns the top ticker match.
 */
export async function resolveCompanySymbol(query: string): Promise<string> {
  if (!query) throw new Error("Query string is empty");
  
  const res = await fetch(`https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${FINNHUB_KEY}`);
  if (!res.ok) throw new Error(`Finnhub search failed: ${res.statusText}`);
  
  const data = await res.json();
  if (!data.result || data.result.length === 0) {
    throw new Error(`No public listing found matching "${query}"`);
  }
  
  // Return the first, most relevant ticker match (e.g., "AAPL")
  return data.result[0].symbol;
}

/**
 * WORKER 1: Company Overview
 */
export async function fetchCompanyOverview(symbol: string) {
  const res = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`);
  if (!res.ok) return { error: "Failed to fetch overview metrics" };
  return res.json();
}

/**
 * WORKER 2: Financial Analysis (Income Statement)
 */
export async function fetchFinancialAnalysis(symbol: string) {
  const cleanSymbol = symbol.toUpperCase();
  const res = await fetch(`https://financialmodelingprep.com/api/v3/income-statement/${cleanSymbol}?limit=3&apikey=${FMP_KEY}`);
  if (!res.ok) return { error: "Failed to fetch income statement history" };
  return res.json();
}

export async function fetchStockAnalysis(symbol: string) {
  const cleanSymbol = symbol.toUpperCase();
  try {
    const [quoteRes, metricsRes] = await Promise.all([
      fetch(`https://finnhub.io/api/v1/quote?symbol=${cleanSymbol}&token=${FINNHUB_KEY}`),
      fetch(`https://financialmodelingprep.com/api/v3/key-metrics/${cleanSymbol}?limit=1&apikey=${FMP_KEY}`)
    ]);

    const quote = quoteRes.ok ? await quoteRes.json() : { error: "Failed quote fetch" };
    const metrics = metricsRes.ok ? await metricsRes.json() : { error: "Failed metrics fetch" };

    return { quote, keyMetrics: Array.isArray(metrics) ? metrics[0] : null };
  } catch (err) {
    return { error: "Stock analysis pipeline encountered an error" };
  }
}

export async function fetchCompanyGrowth(symbol: string) {
  const cleanSymbol = symbol.toUpperCase();
  try {
    const [growthRes, ratiosRes] = await Promise.all([
      fetch(`https://financialmodelingprep.com/api/v3/financial-growth/${cleanSymbol}?limit=1&apikey=${FMP_KEY}`),
      fetch(`https://financialmodelingprep.com/api/v3/ratios/${cleanSymbol}?limit=1&apikey=${FMP_KEY}`)
    ]);

    const growth = growthRes.ok ? await growthRes.json() : { error: "Failed growth fetch" };
    const ratios = ratiosRes.ok ? await ratiosRes.json() : { error: "Failed ratios fetch" };

    return { 
      growth: Array.isArray(growth) ? growth[0] : null, 
      ratios: Array.isArray(ratios) ? ratios[0] : null 
    };
  } catch (err) {
    return { error: "Growth metrics pipeline encountered an error" };
  }
}

/**
 * WORKER 5: News + Sentiment
 * Automatically generates a 10-day historical time frame window based on the current timeline.
 */
export async function fetchNewsSentiment(symbol: string) {
  const today = new Date();
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(today.getDate() - 10);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const fromStr = formatDate(tenDaysAgo);
  const toStr = formatDate(today);

  const res = await fetch(
    `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromStr}&to=${toStr}&token=${FINNHUB_KEY}`
  );
  if (!res.ok) return { error: "Failed to gather news streams" };
  
  const articles = await res.json();
  // Slice the top 8 most recent articles to prevent bloating the LLM context window later
  return articles.slice(0, 8);
}