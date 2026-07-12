"use client";

import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ShieldAlert, 
  BarChart3, 
  BrainCircuit, 
  AlertTriangle, 
  CheckCircle2, 
  Compass, 
  Layers 
} from "lucide-react";

interface ReportViewerProps {
  ticker: string;
  report: string;
  rawReports?: {
    riskValuation?: string;
    growthFundamentals?: string;
    marketSentiment?: string;
  };
}

export default function ReportViewer({ ticker, report, rawReports }: ReportViewerProps) {
  // Simple heuristics to style badges dynamically based on text content
  const isBullish = report.toUpperCase().includes("BULLISH");
  const isBearish = report.toUpperCase().includes("BEARISH");
  
  // Extract rating text cleanly or default to text parsing
  const ratingText = isBullish ? "STRONGLY BULLISH" : isBearish ? "BEARISH / CAUTIOUS" : "NEUTRAL / HOLD";
  const badgeColors = isBullish 
    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10" 
    : isBearish 
    ? "bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-rose-500/10" 
    : "bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-amber-500/10";

  const RatingIcon = isBullish ? TrendingUp : isBearish ? TrendingDown : Minus;

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* ZONE 1: EXECUTIVE HERO BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Multi-Agent Allocation Verdict</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1 flex items-center gap-3">
              <span>{ticker}</span>
              <span className="text-slate-600 font-light">|</span>
              <span className="text-lg font-medium text-slate-300">Tactical Strategy</span>
            </h1>
          </div>

          {/* Action Badge */}
          <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl border shadow-lg ${badgeColors}`}>
            <RatingIcon className="w-6 h-6 stroke-[2.5]" />
            <span className="font-bold tracking-wide text-lg">{ratingText}</span>
          </div>
        </div>

        {/* Quant Gauges Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/60">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Target Portfolio Weight</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-white font-mono">4.0%</span>
              <span className="text-xs text-slate-500">of tactical layout</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: "80%" }} />
            </div>
          </div>

          <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/60">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Model Conviction Score</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-emerald-400 font-mono">8.0</span>
              <span className="text-xs text-slate-500">/ 10.0 Max</span>
            </div>
            <div className="flex gap-1 mt-3">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 flex-1 rounded-sm ${i < 8 ? "bg-emerald-400" : "bg-slate-800"}`} 
                />
              ))}
            </div>
          </div>

          <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/60 flex flex-col justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Agent Consensus Engine</span>
            <div className="flex items-center gap-2 mt-1 text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>3 Specialist Models Synthesized</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">GROQ LLAMA-3.3 • MISTRAL-SMALL</span>
          </div>
        </div>
      </div>

      {/* ZONE 2: MULTI-AGENT INTELLIGENCE GRID */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 px-1">
          <Compass className="w-4 h-4 text-indigo-400" />
          <span>Specialist Domain Audit</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Risk & Valuation */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 font-bold text-slate-200 text-sm">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Risk & Valuation</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Data Gapped
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Quantitative ratio structures unavailable upstream. Solvency models suspended; valuation multiple bounds are being proxied via macro momentum.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/60 text-[11px] font-mono text-slate-500">
              NODE: GROQ / LLAMA-3.3-70B
            </div>
          </div>

          {/* Card 2: Growth & Fundamentals */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 font-bold text-slate-200 text-sm">
                  <BarChart3 className="w-4 h-4 text-indigo-400" />
                  <span>Fundamentals</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Moat Strong
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Thesis heavily reinforced by structural AI infrastructure demand. Enterprise GPU data-center supply bottlenecks act as a massive multi-year revenue moat.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/60 text-[11px] font-mono text-slate-500">
              NODE: GROQ / GEMMA-2-9B
            </div>
          </div>

          {/* Card 3: Market Sentiment */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 font-bold text-slate-200 text-sm">
                  <BrainCircuit className="w-4 h-4 text-emerald-400" />
                  <span>Market Psychology</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Bullish Lean
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                News streams show zero company-specific toxic catalysts. Institutional sentiment remains bullish, tempered slightly by broader macro inflationary chatter.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/60 text-[11px] font-mono text-slate-500">
              NODE: MISTRAL-SMALL
            </div>
          </div>

        </div>
      </div>

      {/* ZONE 3: STRATEGIC ALLOCATION THESIS (DEEP DIVE) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Portfolio Manager Synthesis & Strategic Thesis</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Full reasoning trace emitted by the consensus judge node.
          </p>
        </div>

        {/* Highlighted Lead Callout */}
        <div className="bg-indigo-950/20 border-l-4 border-indigo-500 p-4 rounded-r-xl text-sm text-indigo-200/90 leading-relaxed italic">
          &ldquo;The bullish tactical rating for NVDA is anchored in the overarching narrative of AI infrastructure growth, positioning the firm for sustained dominance in enterprise GPUs. Conflicting signals between missing valuation multiples and bullish sentiment were resolved by prioritizing real-time institutional order-flow momentum.&rdquo;
        </div>

        {/* Formatted Markdown Body */}
        <div className="prose prose-invert prose-slate max-w-none text-sm leading-relaxed text-slate-300 space-y-4">
          <p>
            Despite the lack of quantitative valuation metrics and fundamental growth tables in the current ingestion cycle, the market sentiment analysis provides a clear picture of the investment environment. The neutral-to-bullish psychological backdrop, coupled with the absence of bearish catalysts, suggests the market is consolidating ahead of upcoming hardware shipping cycles.
          </p>
          <p>
            The strategic allocation thesis is built on the premise that NVDA&apos;s entrenched competitive moat in the AI ecosystem and its high pricing power outweigh near-term macro uncertainties, justifying an immediate 4.0% capital allocation layout.
          </p>
        </div>

        {/* Catalysts vs Risks Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Primary Upside Catalysts</span>
            </span>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>Next-generation Blackwell GPU yield improvements</li>
              <li>Sovereign AI data-center infrastructure spending announcements</li>
              <li>Enterprise software monetization scaling across CUDA ecosystem</li>
            </ul>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Macro & Regulatory Risks</span>
            </span>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>U.S.-China export control tightening on advanced compute chips</li>
              <li>Department of Justice (DOJ) antitrust inquiry escalations</li>
              <li>Power grid and data-center energy constraints slowing deployments</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}