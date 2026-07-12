# Research Agent

An institutional-style research dashboard for equity analysis. The app collects market data from multiple providers, normalizes it through a server-side research pipeline, and generates an AI-assisted investment report with a simple verdict plus a deeper analyst audit.

## What It Does

- Resolves ticker symbols and company names into tradable listings.
- Pulls company profile, financial, pricing, growth, and news data in parallel.
- Runs the aggregated payload through a LangGraph workflow with multiple specialist LLM nodes.
- Presents the output in a dashboard UI with a plain-English verdict and a multi-tab research report.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- LangGraph
- Groq, Mistral, Finnhub, and Financial Modeling Prep APIs

## Project Structure

- `app/page.tsx` - main dashboard UI
- `app/api/research/route.ts` - research API endpoint
- `components/ReportViewer.tsx` - tabbed report renderer
- `lib/api-workers.ts` - data fetch and symbol resolution helpers
- `lib/graph/` - LangGraph state, nodes, and workflow

## Prerequisites

- Node.js 18 or newer
- npm
- API keys for the external data and LLM providers

## Setup

1. Install dependencies.

```bash
cd research-app
npm install
```

2. Create a `.env.local` file in the `research-app` directory and add your API keys.

```bash
FINNHUB_API_KEY=your_finnhub_api_key_here
FMP_API_KEY=your_financial_modeling_prep_key_here

GROQ_API_KEY=your_groq_api_key_here
MISTRAL_API_KEY=your_mistral_api_key_here
```

3. Start the development server.

```bash
npm run dev
```

4. Open `http://localhost:3000` in your browser.

## Usage

Enter a ticker symbol or company name such as `RELIANCE.NS`, `TCS.NS`, `AAPL`, or `NVDA`, then run the research pipeline. You can also use the quick-select asset chips in the UI.

## Live Demo

The app is deployed on Vercel and can be accessed here:

- [knowyourcompany.vercel.app](https://knowyourcompany.vercel.app)


## Environment Variables

- `FINNHUB_API_KEY` - Finnhub search, profile, and quote data
- `FMP_API_KEY` - Financial Modeling Prep financial statements and ratios
- `GROQ_API_KEY` - Groq-hosted LLM reasoning nodes
- `MISTRAL_API_KEY` - Mistral sentiment and analysis node


## How It Works — Approach & Architecture

### System Flow Diagram
Plaintext

```
[User Input: Ticker / Brand Name]
			   │
			   ▼
┌────────────────────────────────────────────────────────┐
│ Decoupled API Workers (src/lib/api-workers.ts)         │
│  ├─ Worker 0: Symbol Resolver (.NS -> .NSE Normalizer) │
│  ├─ Worker 1: Company Profile Scraper                  │
│  ├─ Worker 2: Financial Analysis (FMP / Finnhub Fall)  │
│  ├─ Worker 3: Real-Time Pricing & Valuation Multiples  │
│  ├─ Worker 4: Growth CAGRs & Trailing Ratios           │
│  └─ Worker 5: Rolling 10-Day News & Sentiment Stream   │
└────────────────────────────────────────────────────────┘
			   │ (Promise.all Concurrent Execution ~1.2s)
			   ▼
┌────────────────────────────────────────────────────────┐
│ Aggregator Node Route (src/app/api/research/route.ts)  │
│  └─ Compiles raw JSON into unified ResearchState       │
└────────────────────────────────────────────────────────┘ 
			   │
			   ▼
┌────────────────────────────────────────────────────────┐
│ LangGraph State Machine (src/lib/graph/workflow.ts)    │
│                                                        │
│       ┌───────────────┬───────────────┐ (Fan-Out)      │
│       ▼               ▼               ▼                │
│  [Quant Risk]    [Growth Moat]  [Market Sentiment]     │
│  Groq Llama 70B  Groq Gemma 9B    Mistral Small        │
│       │               │               │                │
│       └───────────────┼───────────────┘ (Fan-In)       │
│                       ▼                                │
│         [Portfolio Manager Judge Node]                 │
│         Groq Llama 3.3 70B Consensus                   │
└────────────────────────────────────────────────────────┘
			   │
			   ▼
┌────────────────────────────────────────────────────────┐
│ Frontend Command Center (src/app/page.tsx)             │
│  ├─ Collapses Traversal Trace Ribbon                   │
│  └─ Renders 4-Tab Institutional Workspace              │
└────────────────────────────────────────────────────────┘
```


### Key Architectural Concepts

- **Domain-Specific Data Slicing:** To prevent LLM hallucination and context-window bloat, each specialist node only receives the exact JSON slice relevant to its domain. The Quant Risk model receives valuation ratios and debt structures; the Sentiment model receives only the 8 most recent news headlines.
- **Strict Temperature Tuning:** Mathematical valuation nodes run at `temperature: 0.1` for maximum analytical precision, while behavioral sentiment nodes run at `temperature: 0.3` to capture nuanced market psychology.



## 📊 Example Runs — Agent Output

### 1. Reliance Industries (`RELIANCE.NS`)

- **Execution Trace:** Resolved via smart `.NSE` normalization and Layer 3 institutional fallback (3,270ms total latency).
- **Layman Action Verdict:** `WAIT & WATCH (HOLD)` // **Risk Profile:** `MODERATE RISK`
- **Target Allocation Weight:** `2.5% of tactical portfolio` // **Conviction Score:** `6.0 / 10`
- **Specialist Synthesis:***Quant Risk:* Flagged trailing P/E of 28.42 as a slight premium compared to historical sector averages, but validated strong solvency with a low 0.45 debt-to-equity ratio.
- *Fundamentals:* Highlighted steady 11.5% revenue CAGR driven by omnichannel retail resilience and ongoing petrochemical refining margin stabilization.
- *Consensus Thesis:* Recommended holding current allocation. Upside catalysts in Jio Platforms' 5G enterprise cloud monetization are currently balanced by capital expenditure requirements for the new green energy solar gigafactory.


### 2. NVIDIA Corporation (`NVDA`)

- **Execution Trace:** Scraped concurrently across US Finnhub and FMP real-time endpoints (2,840ms total latency).
- **Layman Action Verdict:** `INVEST (BUY)` // **Risk Profile:** `LOW-MODERATE RISK`
- **Target Allocation Weight:** `4.0% of tactical portfolio` // **Conviction Score:** `8.0 / 10`
- **Specialist Synthesis:***Quant Risk:* Noted high valuation multiples (P/E ~47x), but confirmed that exceptional cash flow generation justifies the premium.
- *Fundamentals:* Identified the global data-center AI infrastructure bottleneck as an unassailable multi-year competitive moat with pricing power.
- *Consensus Thesis:* Strongly bullish tactical layout. Conflicting signals between compressed multiples and growth were resolved by prioritizing real-time institutional order-flow momentum and next-generation Blackwell GPU shipping cycles.


### 3. Dell Technologies (`DELL`)

- **Execution Trace:** Full live pipeline execution across 5 workers (3,110ms total latency).
- **Layman Action Verdict:** `WAIT & WATCH (HOLD)` // **Risk Profile:** `MODERATE-HIGH RISK`
- **Target Allocation Weight:** `2.5% of tactical portfolio` // **Conviction Score:** `6.0 / 10`
- **Specialist Synthesis:***Quant Risk:* Uncovered a critical tension: exceptional Return on Equity (`130.7%`) paired with an elevated debt-to-equity ratio (`13.29`), leaving the firm sensitive to interest rate fluctuations.
- *Fundamentals:* Verified strong operational efficiency driving a `38.8%` EPS surge despite single-digit top-line revenue growth (`5.55%`).
- *Consensus Thesis:* Neutral stance. While Dell is capturing premium AI server demand, potential memory supply constraints and high debt leverage warrant a disciplined, capped portfolio weight.



## Notes

- The app depends on live third-party APIs, so missing or invalid keys will cause parts of the pipeline to fail.
- Some ticker formats, especially India-listed symbols with `.NS`, are normalized automatically by the backend.
- If the report looks incomplete, check the browser console and server logs for provider or rate-limit errors.

## License

No license file is included in this repository.