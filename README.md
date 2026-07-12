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

## How The Pipeline Works

1. The frontend sends a request to `/api/research`.
2. The API resolves the target symbol and fetches market data from multiple providers in parallel.
3. The aggregated payload is passed into the LangGraph workflow.
4. Specialist models generate separate reports for risk, fundamentals, and sentiment.
5. The frontend renders the final verdict and supporting analysis.

## Environment Variables

- `FINNHUB_API_KEY` - Finnhub search, profile, and quote data
- `FMP_API_KEY` - Financial Modeling Prep financial statements and ratios
- `GROQ_API_KEY` - Groq-hosted LLM reasoning nodes
- `MISTRAL_API_KEY` - Mistral sentiment and analysis node

## Scripts

- `npm run dev` - start the development server
- `npm run build` - build the production app
- `npm run start` - run the production server
- `npm run lint` - run ESLint

## Notes

- The app depends on live third-party APIs, so missing or invalid keys will cause parts of the pipeline to fail.
- Some ticker formats, especially India-listed symbols with `.NS`, are normalized automatically by the backend.
- If the report looks incomplete, check the browser console and server logs for provider or rate-limit errors.

## License

No license file is included in this repository.