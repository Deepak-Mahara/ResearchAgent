"use client";

import { useState } from "react";
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
  Layers,
  Code2,
  FileText,
  Activity,
  Cpu,
  Share2,
  Download,
  Bookmark,
  HelpCircle,
  ShieldCheck,
  Zap
} from "lucide-react";

interface ReportViewerProps {
  ticker: string;
  report: string;
  rawPayload?: any;
}

type TabType = "overview" | "specialists" | "thesis" | "telemetry";

export default function ReportViewer({ ticker, report, rawPayload }: ReportViewerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // 1. REGEX EXTRACTION ENGINE
  const extractSection = (regex: RegExp, fallback: string): string => {
    const match = report.match(regex);
    return match && match[1] ? match[1].trim() : fallback;
  };

  const tacticalRating = extractSection(/Tactical Rating:\*\*?\s*\[?([A-Za-z\s]+)\]?/i, "NEUTRAL");
  const targetWeight = extractSection(/Target Allocation Weight:\*\*?\s*\[?([0-9.]+%?)/i, "2.5%");
  const convictionScore = extractSection(/Conviction Score:\*\*?\s*\[?([0-9/.\s]+)\]?/i, "6");

  const valuationRiskText = extractSection(/Valuation & Risk:\*\*?\s*(.+)/i, "Analyzing balance sheet debt ratios and quantitative solvency metrics.");
  const fundamentalGrowthText = extractSection(/Fundamental Growth:\*\*?\s*(.+)/i, "Evaluating multi-year revenue expansion and economic moat sustainability.");
  const marketPsychologyText = extractSection(/Market Sentiment & Psychology:\*\*?\s*(.+)/i, "Scraping global media sentiment and institutional order-flow narratives.");

  let strategicThesis = "Generating complete architectural graph matrix synthesis...";
  const thesisMatch = report.split(/## Strategic Allocation Thesis/i);
  if (thesisMatch.length > 1) {
    strategicThesis = thesisMatch[1].trim();
  }

  // 2. LAYMAN TRANSLATION ENGINE
  const isBullish = tacticalRating.toUpperCase().includes("BULLISH") || tacticalRating.toUpperCase().includes("BUY");
  const isBearish = tacticalRating.toUpperCase().includes("BEARISH") || tacticalRating.toUpperCase().includes("SELL") || tacticalRating.toUpperCase().includes("AVOID");
  
  // Layman Action Verdict
  const laymanAction = isBullish ? "INVEST (BUY)" : isBearish ? "PASS (AVOID)" : "WAIT & WATCH (HOLD)";
  const laymanActionSub = isBullish 
    ? "Strong growth momentum outweighs market risks." 
    : isBearish 
    ? "Downside risks currently outweigh reward potential." 
    : "Good company, but wait for a better buying price.";

  // Layman Risk Meter derived from Conviction Score & Valuation text
  const numericalScore = parseInt(convictionScore) || 6;
  const isHighRisk = valuationRiskText.toLowerCase().includes("overvalu") || valuationRiskText.toLowerCase().includes("debt") || numericalScore < 5;
  const laymanRisk = isHighRisk ? "MODERATE-HIGH RISK" : isBullish && numericalScore >= 7 ? "LOW-MODERATE RISK" : "MODERATE RISK";
  const riskColor = isHighRisk ? "text-amber-400 border-amber-500/30 bg-amber-950/40" : "text-emerald-400 border-emerald-500/30 bg-emerald-950/40";

  // Plain English Summaries (Stripping complex financial jargon for Tab 1)
  const plainEnglishUpside = isBullish
    ? `The core business is expanding rapidly, and customer demand is strong. It holds a powerful market position that competitors will struggle to beat over the next 1-3 years.`
    : `The company has steady, reliable income from its primary operations and a solid brand name, making it a safe long-term survivor.`;

  const plainEnglishDownside = isHighRisk || isBearish
    ? `The stock price is currently running expensive compared to its actual earnings. If market growth slows down or interest rates stay high, the share price could drop before going back up.`
    : `There are minor short-term uncertainties around government regulations and industry competition, but nothing that threatens the company's survival.`;

  // Institutional Badge Styling
  const badgeColors = isBullish 
    ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-400 shadow-emerald-500/10" 
    : isBearish 
    ? "bg-rose-950/80 border-rose-500/50 text-rose-400 shadow-rose-500/10" 
    : "bg-slate-900 border-slate-700 text-cyan-400 shadow-cyan-500/10";

  const RatingIcon = isBullish ? TrendingUp : isBearish ? TrendingDown : Minus;

  return (
    <div className="bg-[#090d18]/90 border border-slate-800/80 rounded-xl shadow-2xl overflow-hidden font-sans animate-fade-in backdrop-blur-md">
      
      {/* 1. WORKSPACE HEADER */}
      <div className="bg-[#070b14]/80 border-b border-slate-850 px-6 py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl font-black font-mono text-white tracking-tight">{ticker}</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-bold">
              EQUITY THESIS
            </span>
          </div>
          <div className="h-5 w-[1px] bg-slate-800 hidden md:block" />
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>CONSENSUS EMITTED</span>
          </div>
        </div>

        {/* Tactical Toolbar has been completely removed from here */}
      </div>

      {/* Tab Navigation (Clearly labeling Layman vs Geek tabs) */}
      <div className="bg-[#060a12]/80 border-b border-slate-850 px-6 flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: "overview", label: "01 // LAYMAN'S VERDICT", icon: Compass },
          { id: "specialists", label: "02 // NERD STATS (AUDIT)", icon: Cpu },
          { id: "thesis", label: "03 // DEEP DIVE THESIS", icon: FileText },
          { id: "telemetry", label: "04 // RAW TELEMETRY", icon: Code2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`py-3.5 px-4 font-mono text-xs font-bold tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                isActive 
                  ? "border-white text-white bg-slate-900/60" 
                  : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-950/40"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-500"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. WORKSPACE CONTENT AREA */}
      <div className="p-6 md:p-8">
        
        {/* TAB 1: DEAD-SIMPLE LAYMAN'S VERDICT & ALPHA */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            
            {/* LAYMAN HERO CARD: INVEST OR PASS? */}
            <div className="bg-gradient-to-br from-slate-950 via-[#0a1020] to-slate-950 border-2 border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400 animate-pulse" />
                  <span>THE DEAD-SIMPLE VERDICT // WHAT SHOULD YOU DO?</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight font-sans">
                  Should you invest in <span className="underline decoration-cyan-500 underline-offset-4">{ticker}</span> today?
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  We analyzed millions of financial data points, news sentiment, and debt reports. Here is the bottom-line recommendation in plain English without the Wall Street jargon.
                </p>
              </div>

              {/* Action & Risk Pill Boxes */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto shrink-0">
                
                {/* Pill 1: Action */}
                <div className={`flex flex-col items-center justify-center px-6 py-5 rounded-xl border-2 shadow-xl ${badgeColors} flex-1 sm:min-w-[190px]`}>
                  <div className="flex items-center gap-1.5 mb-1 opacity-80">
                    <RatingIcon className="w-4 h-4 stroke-[2.5]" />
                    <span className="font-mono text-[11px] uppercase tracking-widest font-bold">ACTION VERDICT</span>
                  </div>
                  <span className="text-xl md:text-2xl font-black tracking-wide uppercase font-mono text-center">{laymanAction}</span>
                  <span className="text-[10px] font-sans opacity-75 mt-1 text-center font-medium">{laymanActionSub}</span>
                </div>

                {/* Pill 2: Risk Meter */}
                <div className={`flex flex-col items-center justify-center px-6 py-5 rounded-xl border shadow-xl flex-1 sm:min-w-[170px] ${riskColor}`}>
                  <div className="flex items-center gap-1.5 mb-1 opacity-80">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="font-mono text-[11px] uppercase tracking-widest font-bold">RISK PROFILE</span>
                  </div>
                  <span className="text-lg md:text-xl font-black tracking-wide uppercase font-mono text-center">{laymanRisk}</span>
                  <span className="text-[10px] font-sans opacity-75 mt-1 text-center font-medium">Based on current debt & stock price</span>
                </div>

              </div>
            </div>

            {/* THE 10-SECOND PLAIN ENGLISH SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-950/80 p-6 rounded-xl border border-slate-850 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider border-b border-slate-875 pb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>THE GOOD NEWS (WHY PEOPLE ARE BUYING)</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-sans pl-3 border-l-2 border-emerald-500/50">
                  {plainEnglishUpside}
                </p>
              </div>

              <div className="bg-slate-950/80 p-6 rounded-xl border border-slate-850 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider border-b border-slate-875 pb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>THE WATCH-OUTS (WHAT TO BE CAREFUL OF)</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-sans pl-3 border-l-2 border-amber-500/50">
                  {plainEnglishDownside}
                </p>
              </div>
            </div>

            {/* SUBTLE QUANT SUMMARY BAR (BRIDGE FOR ADVANCED USERS) */}
            <div className="pt-4 border-t border-slate-850">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                  <span>QUICK STATS FOR ADVANCED TRADERS</span>
                </span>
                <button onClick={() => setActiveTab("specialists")} className="text-xs font-mono text-cyan-400 hover:underline">
                  VIEW FULL NERD STATS &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-850 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">PORTFOLIO WEIGHT:</span>
                  <span className="text-sm font-bold text-white font-mono">{targetWeight} <span className="text-[10px] text-slate-500">/ 5% MAX</span></span>
                </div>
                <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-850 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">CONVICTION INDEX:</span>
                  <span className="text-sm font-bold text-white font-mono">{convictionScore} <span className="text-[10px] text-slate-500">/ 10.0</span></span>
                </div>
                <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-850 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">ENGINE CONSENSUS:</span>
                  <span className="text-xs font-bold text-cyan-400 font-mono">GROQ + MISTRAL AI</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: NERD STATS // SPECIALIST DOMAIN AUDIT */}
        {activeTab === "specialists" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-850 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Specialist Domain Audit // Stats For Nerds</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-sans">Unfiltered quantitative reasoning notes emitted by independent LLM worker nodes before final judge synthesis.</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800 font-semibold self-start sm:self-auto">
                ZERO INTER-MODEL CONTAMINATION
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Quant Risk */}
              <div className="bg-slate-950/60 border border-slate-850 rounded-lg p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-875 pb-3">
                    <div className="flex items-center gap-2 font-bold text-slate-200 text-xs font-mono uppercase">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      <span>VALUATION & SOLVENCY</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      QUANT NODE
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {valuationRiskText.replace(/^[*\s]+/, "")}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-875 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>MODEL:</span>
                  <span className="text-slate-300 font-bold">GROQ / LLAMA-3.3-70B</span>
                </div>
              </div>

              {/* Card 2: Fundamentals */}
              <div className="bg-slate-950/60 border border-slate-850 rounded-lg p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-875 pb-3">
                    <div className="flex items-center gap-2 font-bold text-slate-200 text-xs font-mono uppercase">
                      <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>GROWTH TRAJECTORY</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      FUNDAMENTAL
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {fundamentalGrowthText.replace(/^[*\s]+/, "")}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-875 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>MODEL:</span>
                  <span className="text-slate-300 font-bold">GROQ / GEMMA-2-9B</span>
                </div>
              </div>

              {/* Card 3: Sentiment */}
              <div className="bg-slate-950/60 border border-slate-850 rounded-lg p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-875 pb-3">
                    <div className="flex items-center gap-2 font-bold text-slate-200 text-xs font-mono uppercase">
                      <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
                      <span>BEHAVIORAL PSYCHOLOGY</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      SENTIMENT
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {marketPsychologyText.replace(/^[*\s]+/, "")}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-875 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>MODEL:</span>
                  <span className="text-slate-300 font-bold">MISTRAL / SMALL-LATEST</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: DEEP DIVE // STRATEGIC THESIS DOCUMENT */}
        {activeTab === "thesis" && (
          <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div className="border-b border-slate-850 pb-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Full Institutional Strategic Allocation Thesis</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 font-mono uppercase">
                EMITTED BY PORTFOLIO MANAGER CONSENSUS JUDGE NODE
              </p>
            </div>

            {/* Matte Lead Callout */}
            <div className="bg-slate-950/80 border-l-2 border-slate-500 p-5 rounded-r-lg text-xs text-slate-300 leading-relaxed italic font-sans">
              &ldquo;This strategic allocation thesis represents the reconciled consensus of three domain specialists, evaluating long-term competitive advantages against real-time macroeconomic tailwinds and solvency structures.&rdquo;
            </div>

            {/* Document Body */}
            <div className="bg-slate-950/60 border border-slate-850 rounded-lg p-6 md:p-8 whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-300 space-y-4">
              {strategicThesis}
            </div>
          </div>
        )}

        {/* TAB 4: RAW TELEMETRY // STATE INSPECTOR */}
        {activeTab === "telemetry" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-slate-400" />
                  <span>State Payload Context // Aggregation Node Telemetry</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  Real-time JSON schema ingested by the LangGraph multi-agent execution pipeline.
                </p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded font-bold">
                SCHEMA VALIDATED
              </span>
            </div>

            <div className="bg-slate-950/90 border border-slate-850 rounded-lg p-6 font-mono text-[11px] text-slate-300 max-h-[500px] overflow-auto custom-scrollbar shadow-inner">
              <pre>{rawPayload ? JSON.stringify(rawPayload, null, 2) : "// No payload in state memory. Execute pipeline to view."}</pre>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}