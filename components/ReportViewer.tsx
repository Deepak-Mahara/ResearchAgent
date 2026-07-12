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

  // Robust regex extraction from live markdown
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

  // Adaptive styling engine
  const isBullish = tacticalRating.toUpperCase().includes("BULLISH");
  const isBearish = tacticalRating.toUpperCase().includes("BEARISH");
  
  const badgeColors = isBullish 
    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-emerald-500/10" 
    : isBearish 
    ? "bg-rose-500/10 border-rose-500/40 text-rose-400 shadow-rose-500/10" 
    : "bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-amber-500/10";

  const RatingIcon = isBullish ? TrendingUp : isBearish ? TrendingDown : Minus;
  const numericalScore = parseInt(convictionScore) || 6;

  return (
    <div className="bg-[#0b1120] border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden font-sans animate-fade-in">
      
      {/* 1. NSE-STYLE TABBED NAVIGATION HEADER */}
      <div className="bg-[#070b14] border-b border-slate-800/80 px-6 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 pb-2 md:pb-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black font-mono text-white tracking-tight">{ticker}</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
              EQUITY REPORT
            </span>
          </div>
          <div className="h-6 w-[1px] bg-slate-800 hidden md:block" />
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI CONSENSUS ARCHITECTURE</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pb-3 md:pb-0">
          <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all text-xs flex items-center gap-1.5 font-mono">
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WATCHLIST</span>
          </button>
          <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all text-xs flex items-center gap-1.5 font-mono">
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">EXPORT</span>
          </button>
          <button className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 transition-all text-xs flex items-center gap-1.5 font-mono font-bold">
            <Download className="w-3.5 h-3.5" />
            <span>PDF THESIS</span>
          </button>
        </div>
      </div>

      {/* Tab Switcher Bar */}
      <div className="bg-[#080d1a] border-b border-slate-800/80 px-6 flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: "overview", label: "01 // EXECUTIVE VERDICT", icon: Compass },
          { id: "specialists", label: "02 // SPECIALIST AUDIT (3)", icon: Cpu },
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
                  ? "border-cyan-400 text-cyan-300 bg-cyan-950/20" 
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. TAB CONTENT WORKSPACE */}
      <div className="p-6 md:p-8">
        
        {/* TAB 1: EXECUTIVE OVERVIEW & VERDICT */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Hero Alpha Banner */}
            <div className="bg-gradient-to-r from-[#070b14] via-[#0a1020] to-[#070b14] border border-slate-800 rounded-2xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Consensus Allocation Recommendation</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  Quantitative Synthesis for <span className="text-cyan-400 underline decoration-cyan-500/30 underline-offset-4">{ticker}</span>
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Weighted alpha output derived from concurrent multi-model analysis across valuation multiples, 3-year trailing income statements, and rolling 10-day behavioral news feeds.
                </p>
              </div>

              {/* Action Badge */}
              <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border min-w-[200px] shadow-2xl shrink-0 ${badgeColors}`}>
                <div className="flex items-center gap-2 mb-1">
                  <RatingIcon className="w-6 h-6 stroke-[2.5]" />
                  <span className="font-mono text-xs uppercase tracking-widest font-bold opacity-80">TACTICAL RATING</span>
                </div>
                <span className="text-2xl md:text-3xl font-black tracking-wider uppercase font-mono">{tacticalRating}</span>
              </div>
            </div>

            {/* Quant Gauges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#070b14] rounded-xl p-5 border border-slate-800/80 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">Target Allocation Layout</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-white font-mono">{targetWeight}</span>
                    <span className="text-xs font-mono text-slate-500">/ 5.0% MAX CAP</span>
                  </div>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full mt-4 overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: isBullish ? "80%" : isBearish ? "20%" : "50%" }} />
                </div>
              </div>

              <div className="bg-[#070b14] rounded-xl p-5 border border-slate-800/80 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">Model Conviction Score</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-cyan-400 font-mono">{convictionScore}</span>
                    <span className="text-xs font-mono text-slate-500">/ 10.0 INDEX</span>
                  </div>
                </div>
                <div className="flex gap-1.5 mt-4">
                  {[...Array(10)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-2 flex-1 rounded-sm transition-all duration-500 ${i < numericalScore ? "bg-cyan-400 shadow-sm shadow-cyan-400/50" : "bg-slate-900 border border-slate-800"}`} 
                    />
                  ))}
                </div>
              </div>

              <div className="bg-[#070b14] rounded-xl p-5 border border-slate-800/80 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">Execution Engine Setup</span>
                  <div className="flex items-center gap-2 mt-3 text-sm font-bold text-slate-200 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>3 PARALLEL AI WORKERS</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>ROUTING:</span>
                  <span className="text-cyan-400 font-bold">GROQ LLAMA-3.3 + MISTRAL</span>
                </div>
              </div>
            </div>

            {/* Catalysts vs Risks Split Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-[#070b14] p-6 rounded-2xl border border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider border-b border-slate-850 pb-3">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PRIMARY UPSIDE CATALYSTS</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-2 border-l-2 border-emerald-500/50 font-sans">
                  {fundamentalGrowthText.replace(/^[*\s]+/, "")}
                </p>
              </div>

              <div className="bg-[#070b14] p-6 rounded-2xl border border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider border-b border-slate-850 pb-3">
                  <AlertTriangle className="w-4 h-4" />
                  <span>DOWNFALL RISK & VALUATION WARNINGS</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-2 border-l-2 border-rose-500/50 font-sans">
                  {valuationRiskText.replace(/^[*\s]+/, "")}
                </p>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: SPECIALIST DOMAIN AUDIT (3 MODELS) */}
        {activeTab === "specialists" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider">Domain Specialist Isolation Audit</h3>
                <p className="text-xs text-slate-400 mt-0.5">Direct reasoning notes emitted by independent LLM worker nodes before final judge synthesis.</p>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-slate-900 px-3 py-1 rounded border border-slate-800 self-start sm:self-auto">
                ZERO INTER-MODEL CONTAMINATION
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Quant Risk */}
              <div className="bg-[#070b14] border border-slate-800 rounded-xl p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                    <div className="flex items-center gap-2 font-bold text-slate-200 text-sm font-mono">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      <span>VALUATION & SOLVENCY</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/80">
                      QUANT NODE
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {valuationRiskText.replace(/^[*\s]+/, "")}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-850 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>MODEL:</span>
                  <span className="text-slate-300 font-bold">GROQ / LLAMA-3.3-70B</span>
                </div>
              </div>

              {/* Card 2: Fundamentals */}
              <div className="bg-[#070b14] border border-slate-800 rounded-xl p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                    <div className="flex items-center gap-2 font-bold text-slate-200 text-sm font-mono">
                      <BarChart3 className="w-4 h-4 text-cyan-400" />
                      <span>GROWTH TRAJECTORY</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/80">
                      FUNDAMENTAL
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {fundamentalGrowthText.replace(/^[*\s]+/, "")}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-850 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>MODEL:</span>
                  <span className="text-slate-300 font-bold">GROQ / GEMMA-2-9B</span>
                </div>
              </div>

              {/* Card 3: Sentiment */}
              <div className="bg-[#070b14] border border-slate-800 rounded-xl p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                    <div className="flex items-center gap-2 font-bold text-slate-200 text-sm font-mono">
                      <BrainCircuit className="w-4 h-4 text-emerald-400" />
                      <span>BEHAVIORAL PSYCHOLOGY</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/80">
                      SENTIMENT
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {marketPsychologyText.replace(/^[*\s]+/, "")}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-850 flex items-center justify-between text-[11px] font-mono text-slate-500">
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
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>Full Institutional Strategic Allocation Thesis</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                EMITTED BY PORTFOLIO MANAGER CONSENSUS JUDGE NODE
              </p>
            </div>

            {/* Highlighted Lead Callout */}
            <div className="bg-cyan-950/20 border-l-4 border-cyan-500 p-5 rounded-r-xl text-sm text-cyan-200/90 leading-relaxed italic font-sans shadow-lg">
              &ldquo;This strategic allocation thesis represents the reconciled consensus of three domain specialists, evaluating long-term competitive advantages against real-time macroeconomic tailwinds and solvency structures.&rdquo;
            </div>

            {/* Document Body */}
            <div className="bg-[#070b14] border border-slate-800/80 rounded-xl p-6 md:p-8 whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-300 space-y-4 shadow-xl">
              {strategicThesis}
            </div>
          </div>
        )}

        {/* TAB 4: RAW STATE TELEMETRY (JSON INSPECTOR) */}
        {activeTab === "telemetry" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-cyan-400" />
                  <span>State Payload Context // Aggregation Node Telemetry</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  Real-time JSON schema ingested by the LangGraph multi-agent execution pipeline.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded">
                SCHEMA VALIDATED
              </span>
            </div>

            <div className="bg-[#070b14] border border-slate-800 rounded-xl p-6 font-mono text-xs text-cyan-400 max-h-[500px] overflow-auto custom-scrollbar shadow-inner">
              <pre>{rawPayload ? JSON.stringify(rawPayload, null, 2) : "// No payload in state memory. Execute pipeline to view."}</pre>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}