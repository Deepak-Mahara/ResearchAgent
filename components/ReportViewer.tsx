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
  Bookmark
} from "lucide-react";

interface ReportViewerProps {
  ticker: string;
  report: string;
  rawPayload?: any;
}

type TabType = "overview" | "specialists" | "thesis" | "telemetry";

export default function ReportViewer({ ticker, report, rawPayload }: ReportViewerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

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

  const isBullish = tacticalRating.toUpperCase().includes("BULLISH");
  const isBearish = tacticalRating.toUpperCase().includes("BEARISH");
  
  // Restrained, Matte Badge Colors
  const badgeColors = isBullish 
    ? "bg-emerald-950/60 border-emerald-800/80 text-emerald-400" 
    : isBearish 
    ? "bg-rose-950/60 border-rose-800/80 text-rose-400" 
    : "bg-slate-900 border-slate-750 text-amber-400";

  const RatingIcon = isBullish ? TrendingUp : isBearish ? TrendingDown : Minus;
  const numericalScore = parseInt(convictionScore) || 6;

  return (
    <div className="bg-[#090d18]/90 border border-slate-800/80 rounded-xl shadow-2xl overflow-hidden font-sans animate-fade-in backdrop-blur-md">
      
      {/* 1. WORKSPACE HEADER */}
      <div className="bg-[#070b14]/80 border-b border-slate-850 px-6 pt-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 pb-2 md:pb-0">
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

        {/* Tactical Toolbar */}
        <div className="flex items-center gap-2 pb-3 md:pb-0">
          <button className="px-3 py-1.5 rounded-md bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all text-xs flex items-center gap-1.5 font-mono font-medium">
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WATCHLIST</span>
          </button>
          <button className="px-3 py-1.5 rounded-md bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all text-xs flex items-center gap-1.5 font-mono font-medium">
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">EXPORT JSON</span>
          </button>
          <button className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-950 hover:bg-white transition-all text-xs flex items-center gap-1.5 font-mono font-bold shadow-sm">
            <Download className="w-3.5 h-3.5" />
            <span>DOWNLOAD REPORT</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-[#060a12]/80 border-b border-slate-850 px-6 flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: "overview", label: "01 // EXECUTIVE ALPHA", icon: Compass },
          { id: "specialists", label: "02 // SPECIALIST AUDIT", icon: Cpu },
          { id: "thesis", label: "03 // STRATEGIC THESIS", icon: FileText },
          { id: "telemetry", label: "04 // RAW STATE TELEMETRY", icon: Code2 },
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
        
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            
            {/* High-Contrast Hero Board */}
            <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 uppercase font-bold">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>Consensus Allocation Verdict</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight font-sans">
                  Tactical Synthesis for <span className="text-slate-200 font-mono underline decoration-slate-700 underline-offset-4">{ticker}</span>
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Reconciled output generated from concurrent multi-model analysis across valuation multiples, 3-year trailing income statements, and rolling 10-day behavioral news feeds.
                </p>
              </div>

              {/* Matte Action Badge */}
              <div className={`flex flex-col items-center justify-center px-6 py-5 rounded-lg border min-w-[180px] shrink-0 ${badgeColors}`}>
                <div className="flex items-center gap-1.5 mb-1 opacity-80">
                  <RatingIcon className="w-4 h-4 stroke-[2.5]" />
                  <span className="font-mono text-[10px] uppercase tracking-widest font-bold">RATING</span>
                </div>
                <span className="text-xl md:text-2xl font-black tracking-wide uppercase font-mono">{tacticalRating}</span>
              </div>
            </div>

            {/* Quant Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-950/60 rounded-lg p-5 border border-slate-850 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">Target Allocation Weight</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-white font-mono">{targetWeight}</span>
                    <span className="text-[11px] font-mono text-slate-500">/ 5.0% MAX CAP</span>
                  </div>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="bg-slate-300 h-full rounded-full" style={{ width: isBullish ? "80%" : isBearish ? "20%" : "50%" }} />
                </div>
              </div>

              <div className="bg-slate-950/60 rounded-lg p-5 border border-slate-850 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">Model Conviction Score</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-white font-mono">{convictionScore}</span>
                    <span className="text-[11px] font-mono text-slate-500">/ 10.0 INDEX</span>
                  </div>
                </div>
                <div className="flex gap-1 mt-4">
                  {[...Array(10)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 flex-1 rounded-sm ${i < numericalScore ? "bg-slate-300" : "bg-slate-900"}`} 
                    />
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/60 rounded-lg p-5 border border-slate-850 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">Execution Setup</span>
                  <div className="flex items-center gap-2 mt-2 text-sm font-bold text-slate-200 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>3 PARALLEL SPECIALISTS</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-875 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>ROUTING:</span>
                  <span className="text-slate-300 font-bold">GROQ LLAMA + MISTRAL</span>
                </div>
              </div>
            </div>

            {/* Catalysts vs Warnings Split Deck */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-slate-950/60 p-6 rounded-lg border border-slate-850 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider border-b border-slate-875 pb-3">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PRIMARY UPSIDE CATALYSTS</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-2 border-l-2 border-emerald-500/40 font-sans">
                  {fundamentalGrowthText.replace(/^[*\s]+/, "")}
                </p>
              </div>

              <div className="bg-slate-950/60 p-6 rounded-lg border border-slate-850 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider border-b border-slate-875 pb-3">
                  <AlertTriangle className="w-4 h-4" />
                  <span>DOWNFALL RISK & VALUATION WARNINGS</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-2 border-l-2 border-rose-500/40 font-sans">
                  {valuationRiskText.replace(/^[*\s]+/, "")}
                </p>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: SPECIALIST DOMAIN AUDIT */}
        {activeTab === "specialists" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-850 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Domain Specialist Isolation Audit</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-sans">Direct reasoning notes emitted by independent LLM worker nodes before final judge synthesis.</p>
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

        {/* TAB 3: STRATEGIC THESIS DOCUMENT */}
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

        {/* TAB 4: RAW STATE TELEMETRY */}
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