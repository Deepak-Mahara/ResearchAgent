// lib/api-workers.ts

const FINNHUB_KEY = process.env.FINNHUB_API_KEY || "";
const FMP_KEY = process.env.FMP_API_KEY || "";

export async function resolveCompanySymbol(query: string): Promise<string> {
  if (!query) throw new Error("Query string is empty");
  const res = await fetch(`https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${FINNHUB_KEY}`);
  if (!res.ok) throw new Error(`Finnhub search failed: ${res.statusText}`);
  const data = await res.json();
  if (!data.result || data.result.length === 0) {
    throw new Error(`No public listing found matching "${query}"`);
  }
  return data.result[0].symbol;
}

export async function fetchCompanyOverview(symbol: string) {
  const cleanSymbol = symbol.toUpperCase();
  const res = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${cleanSymbol}&token=${FINNHUB_KEY}`);
  if (!res.ok) return { error: "Failed to fetch overview metrics" };
  return res.json();
}

/**
 * WORKER 2: Financial Analysis (With Finnhub Metric Fallback)
 * If FMP's 3-year income statement fails or is rate-limited, we pull Finnhub's basic financial series.
 */
export async function fetchFinancialAnalysis(symbol: string) {
  const cleanSymbol = symbol.toUpperCase();
  try {
    const fmpRes = await fetch(`https://financialmodelingprep.com/api/v3/income-statement/${cleanSymbol}?limit=3&apikey=${FMP_KEY}`);
    if (fmpRes.ok) {
      const fmpData = await fmpRes.json();
      if (Array.isArray(fmpData) && fmpData.length > 0) return fmpData;
    }
    
    // Fallback: Finnhub Basic Financials
    const fhRes = await fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${cleanSymbol}&metric=all&token=${FINNHUB_KEY}`);
    if (fhRes.ok) {
      const fhData = await fhRes.json();
      return { source: "Finnhub Fallback", series: fhData.series?.annual || null, summary: fhData.metric || null };
    }
    return { error: "Failed to fetch income statement history from all providers" };
  } catch (err) {
    return { error: "Financial analysis pipeline encountered a network error" };
  }
}

/**
 * WORKER 3: Stock Analysis & Multiples (With Finnhub Fallback)
 */
export async function fetchStockAnalysis(symbol: string) {
  const cleanSymbol = symbol.toUpperCase();
  try {
    const [quoteRes, metricsRes, fhMetricsRes] = await Promise.all([
      fetch(`https://finnhub.io/api/v1/quote?symbol=${cleanSymbol}&token=${FINNHUB_KEY}`),
      fetch(`https://financialmodelingprep.com/api/v3/key-metrics/${cleanSymbol}?limit=1&apikey=${FMP_KEY}`),
      fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${cleanSymbol}&metric=all&token=${FINNHUB_KEY}`)
    ]);

    const quote = quoteRes.ok ? await quoteRes.json() : { error: "Failed quote fetch" };
    let keyMetrics = null;

    if (metricsRes.ok) {
      const fmpMetrics = await metricsRes.json();
      if (Array.isArray(fmpMetrics) && fmpMetrics.length > 0) keyMetrics = fmpMetrics[0];
    }

    // If FMP failed or returned an error object, extract P/E, PB, and Debt metrics from Finnhub
    if (!keyMetrics && fhMetricsRes.ok) {
      const fhData = await fhMetricsRes.json();
      if (fhData?.metric) {
        keyMetrics = {
          peRatio: fhData.metric["peTTM"] || fhData.metric["peExclExtraTTM"] || "N/A",
          priceToBookRatio: fhData.metric["pbAnnual"] || fhData.metric["pbQuarterly"] || "N/A",
          evToEbitda: fhData.metric["evEbitdaTTM"] || "N/A",
          debtToEquity: fhData.metric["totalDebt/totalEquityAnnual"] || fhData.metric["totalDebt/totalEquityQuarterly"] || "N/A",
          source: "Finnhub Basic Financials"
        };
      }
    }

    return { quote, keyMetrics };
  } catch (err) {
    return { error: "Stock analysis pipeline encountered an error" };
  }
}

/**
 * WORKER 4: Company Growth & Ratios (With Finnhub Fallback)
 */
export async function fetchCompanyGrowth(symbol: string) {
  const cleanSymbol = symbol.toUpperCase();
  try {
    const [growthRes, ratiosRes, fhMetricsRes] = await Promise.all([
      fetch(`https://financialmodelingprep.com/api/v3/financial-growth/${cleanSymbol}?limit=1&apikey=${FMP_KEY}`),
      fetch(`https://financialmodelingprep.com/api/v3/ratios/${cleanSymbol}?limit=1&apikey=${FMP_KEY}`),
      fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${cleanSymbol}&metric=all&token=${FINNHUB_KEY}`)
    ]);

    let growth = null;
    let ratios = null;

    if (growthRes.ok) {
      const fmpGrowth = await growthRes.json();
      if (Array.isArray(fmpGrowth) && fmpGrowth.length > 0) growth = fmpGrowth[0];
    }
    if (ratiosRes.ok) {
      const fmpRatios = await ratiosRes.json();
      if (Array.isArray(fmpRatios) && fmpRatios.length > 0) ratios = fmpRatios[0];
    }

    // If FMP growth/ratios failed, extract ROE, ROA, Margins, and Growth YoY from Finnhub
    if ((!growth || !ratios) && fhMetricsRes.ok) {
      const fhData = await fhMetricsRes.json();
      if (fhData?.metric) {
        growth = growth || {
          revenueGrowthYoY: fhData.metric["revenueGrowthTTPYoy"] || fhData.metric["revenueGrowth5Y"] || "N/A",
          epsGrowthYoY: fhData.metric["epsGrowthTTPYoy"] || fhData.metric["epsGrowth3Y"] || "N/A",
          source: "Finnhub Basic Financials"
        };
        ratios = ratios || {
          returnOnEquity: fhData.metric["roeTTM"] || fhData.metric["roeRFAny"] || "N/A",
          returnOnAssets: fhData.metric["roaTTM"] || fhData.metric["roaRFAny"] || "N/A",
          grossProfitMargin: fhData.metric["grossMarginTTM"] || fhData.metric["grossMargin5Y"] || "N/A",
          operatingProfitMargin: fhData.metric["operatingMarginTTM"] || fhData.metric["operatingMargin5Y"] || "N/A",
          source: "Finnhub Basic Financials"
        };
      }
    }

    return { growth, ratios };
  } catch (err) {
    return { error: "Growth metrics pipeline encountered an error" };
  }
}

export async function fetchNewsSentiment(symbol: string) {
  const cleanSymbol = symbol.toUpperCase();
  const today = new Date();
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(today.getDate() - 10);
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const res = await fetch(
    `https://finnhub.io/api/v1/company-news?symbol=${cleanSymbol}&from=${formatDate(tenDaysAgo)}&to=${formatDate(today)}&token=${FINNHUB_KEY}`
  );
  if (!res.ok) return { error: "Failed to gather news streams" };
  const articles = await res.json();
  return Array.isArray(articles) ? articles.slice(0, 8) : [];
}