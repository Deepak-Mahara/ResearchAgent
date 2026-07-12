"use client";

import { useState, useEffect } from "react";
import { 
  Building2, 
  Search, 
  Cpu, 
  Layers, 
  BrainCircuit, 
  TrendingUp, 
  CheckCircle2, 
  Loader2, 
  AlertTriangle, 
  Activity, 
  Clock, 
  Terminal, 
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  BarChart2
} from "lucide-react";
import ReportViewer from "@/components/ReportViewer";

type AgentStage = "idle" | "api_fetch" | "aggregation" | "llm_analysis" | "final_decision" | "completed" | "error";

interface StageStatus {
  id: Exclude<AgentStage, "idle" | "error">;
  label: string;
  description: string;
  icon: any;
  latency: string;
}

const STAGES: StageStatus[] = [
  { id: "api_fetch", label: "Multi-Exchange Scraper", description: "Querying Finnhub & FMP endpoints for profiles, news, and quotes.", icon: Layers, latency: "450ms" },
  { id: "aggregation", label: "Data Normalization Engine", description: "Cross-referencing ratios, cleaning nulls, and structuring state schema.", icon: Cpu, latency: "120ms" },
  { id: "llm_analysis", label: "Parallel AI Specialists", description: "Groq Llama 70B & Gemma 2 9B reasoning over valuation and moats.", icon: BrainCircuit, latency: "1800ms" },
  { id: "final_decision", label: "Consensus Judge Node", description: "Synthesizing conflicting signals into tactical allocation weights.", icon: TrendingUp, latency: "900ms" },
];

const MACRO_TICKERS = [
  { symbol: "NIFTY 50", price: "24,852.15", change: "+142.50", percent: "+0.58%", isUp: true },
  { symbol: "SENSEX", price: "81,343.46", change: "+480.20", percent: "+0.59%", isUp: true },
  { symbol: "S&P 500", price: "5,615.35", change: "+12.40", percent: "+0.22%", isUp: true },
  { symbol: "NASDAQ", price: "18,352.76", change: "-32.10", percent: "-0.17%", isUp: false },
  { symbol: "INDIA VIX", price: "13.42", change: "-0.85", percent: "-5.96%", isUp: false },
  { symbol: "US 10Y YIELD", price: "4.21%", change: "+0.03", percent: "+0.71%", isUp: true },
  { symbol: "GOLD / OUNCE", price: "$2,421.80", change: "+18.50", percent: "+0.77%", isUp: true },
];

const QUICK_ASSETS = ["RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "AAPL", "NVDA", "TSLA", "DELL"];

export default function ResearchDashboard() {
  const [company, setCompany] = useState("");
  const [currentStage, setCurrentStage] = useState<AgentStage>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [aggregatedData, setAggregatedData] = useState<any | null>(null);
  const [report, setReport] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour12: false }) + " IST");
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const runResearch = async (targetTicker: string) => {
    if (!targetTicker.trim()) return;
    setCompany(targetTicker);
    setReport(null);
    setAggregatedData(null);
    setErrorMessage(null);
    
    try {
      setCurrentStage("api_fetch");
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: targetTicker }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed inside data collection pipeline.");
      }

      setCurrentStage("aggregation");
      setAggregatedData(result.data);
      await new Promise((res) => setTimeout(res, 400));

      setCurrentStage("llm_analysis");
      await new Promise((res) => setTimeout(res, 800));
      
      setCurrentStage("final_decision");
      await new Promise((res) => setTimeout(res, 600));
      
      setCurrentStage("completed");
      setReport(result.reports.finalDecision);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An unhandled execution trace failure occurred.");
      setCurrentStage("error");
    }
  };

  const handleStartResearch = (e: React.FormEvent) => {
    e.preventDefault();
    runResearch(company);
  };

  return (
    <main className="min-h-screen bg-[#05080f] text-slate-100 font-sans selection:bg-slate-800 selection:text-white relative pb-20">
      
      {/* 1. ATMOSPHERIC WALL STREET ARCHITECTURAL BACKDROP */}
      {/* 1. ATMOSPHERIC WALL STREET ARCHITECTURAL BACKDROP */}
<div 
  className="fixed inset-0 z-0 opacity-40 bg-cover bg-center bg-no-repeat pointer-events-none filter contrast-110 saturate-50"
  style={{ 
    backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')` 
  }}
/>
{/* Lightened Gradient Overlay */}
<div className="fixed inset-0 z-0 bg-gradient-to-b from-[#05080f]/60 via-[#070b14]/80 to-[#05080f] pointer-events-none" />
      
      {/* ALL CONTENT LAYERED ABOVE BACKDROP */}
      <div className="relative z-10">
        
        {/* 2. NSE-STYLE REAL-TIME MACRO TICKER TAPE */}
        <div className="bg-[#070b14]/90 border-b border-slate-850 backdrop-blur-md py-2 px-6 text-xs font-mono">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-slate-400 font-bold tracking-wider shrink-0 pr-4 border-r border-slate-800">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>MACRO FEED</span>
            </div>
            <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-0.5 pl-4">
              {MACRO_TICKERS.map((ticker, idx) => (
                <div key={idx} className="flex items-center gap-2 shrink-0">
                  <span className="text-slate-400 font-medium">{ticker.symbol}</span>
                  <span className="text-slate-100 font-semibold">{ticker.price}</span>
                  <span className={`flex items-center text-[11px] font-bold ${ticker.isUp ? "text-emerald-400" : "text-rose-400"}`}>
                    {ticker.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {ticker.percent}
                  </span>
                </div>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-2 text-slate-400 shrink-0 pl-4 border-l border-slate-800 font-mono text-[11px]">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentTime || "SYSTEM ONLINE"}</span>
            </div>
          </div>
        </div>

        {/* 3. INSTITUTIONAL HEADER */}
        <header className="border-b border-slate-850 bg-[#070b14]/60 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-750 flex items-center justify-center shadow-inner">
                <Building2 className="w-4 h-4 text-slate-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-black tracking-tight text-white font-mono uppercase">
                    APEX <span className="text-slate-600 font-light">//</span> INSTITUTIONAL TERMINAL
                  </h1>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-bold">
                    PRO v2.4
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Multi-Agent Autonomous Equity Valuation & Quantitative Alpha Engine
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>WS: CONNECTED</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>LANGGRAPH ENGINE</span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
          
          {/* 4. TACTILE EXECUTION SEARCH DECK */}
          <div className="bg-[#090d18]/80 border border-slate-800/80 rounded-xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <form onSubmit={handleStartResearch} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3 items-end">
                <div className="flex-1 w-full space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="uppercase tracking-wider font-semibold">Target Asset / Ticker Symbol</span>
                    <span className="text-slate-500">Global Exchanges & NSE India (.NS) Supported</span>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Enter symbol or asset name (e.g., RELIANCE.NS, TCS.NS, AAPL, NVDA)..."
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      disabled={currentStage !== "idle" && currentStage !== "completed" && currentStage !== "error"}
                      className="w-full bg-[#05080f]/90 border border-slate-800 rounded-lg py-3 pl-11 pr-4 text-slate-100 font-mono placeholder-slate-600 focus:outline-none focus:border-slate-600 transition-all disabled:opacity-50 text-sm shadow-inner"
                    />
                  </div>
                </div>
                
                {/* Brushed Silver Tactile Trigger */}
                <button
                  type="submit"
                  disabled={!company.trim() || (currentStage !== "idle" && currentStage !== "completed" && currentStage !== "error")}
                  className="w-full md:w-auto px-6 py-3 font-mono text-xs font-bold tracking-wider uppercase text-slate-950 bg-slate-100 hover:bg-white rounded-lg transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 shrink-0 border border-white/20 active:scale-[0.99]"
                >
                  {currentStage !== "idle" && currentStage !== "completed" && currentStage !== "error" ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                      <span>EXECUTING...</span>
                    </>
                  ) : (
                    <>
                      <BarChart2 className="w-3.5 h-3.5 text-slate-950" />
                      <span>INITIALIZE AUDIT</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Select Chips */}
              <div className="flex items-center gap-1.5 pt-2 overflow-x-auto no-scrollbar">
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider shrink-0 mr-1">QUICK SELECT:</span>
                {QUICK_ASSETS.map((ticker) => (
                  <button
                    key={ticker}
                    type="button"
                    onClick={() => runResearch(ticker)}
                    disabled={currentStage !== "idle" && currentStage !== "completed" && currentStage !== "error"}
                    className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 hover:border-slate-600 text-[11px] font-mono text-slate-300 hover:text-white transition-all shrink-0 disabled:opacity-40"
                  >
                    {ticker}
                  </button>
                ))}
              </div>
            </form>
          </div>

          {/* 5. ERROR TELEMETRY BANNER */}
          {currentStage === "error" && errorMessage && (
            <div className="bg-rose-950/20 border border-rose-900/60 text-rose-200 p-5 rounded-xl flex items-start gap-4 backdrop-blur-md">
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-[11px] text-rose-400 uppercase tracking-wider font-bold">
                  <Terminal className="w-3 h-3" />
                  <span>SYSTEM FAULT // UPSTREAM EXCEPTION</span>
                </div>
                <h4 className="font-bold text-white text-sm">Pipeline Execution Interrupted</h4>
                <p className="text-xs text-rose-300/80 font-mono leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* 6. MATTE TELEMETRY EXECUTION STEPPER */}
          {currentStage !== "idle" && currentStage !== "error" && (
            <div className="bg-[#090d18]/80 border border-slate-800/80 rounded-xl p-6 shadow-2xl space-y-6 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-850 pb-4">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
                  <Terminal className="w-3.5 h-3.5 text-slate-400" />
                  <span>AUTONOMOUS NODE TRAVERSAL TRACE</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded flex items-center gap-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ACTIVE PIPELINE
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {STAGES.map((stage, idx) => {
                  const Icon = stage.icon;
                  const isCurrent = currentStage === stage.id;
                  const isPast = currentStage === "completed" || STAGES.findIndex(s => s.id === currentStage) > idx;

                  return (
                    <div
                      key={stage.id}
                      className={`relative p-4 rounded-lg border transition-all duration-300 flex flex-col justify-between ${
                        isCurrent 
                          ? "bg-slate-900/90 border-slate-600 shadow-md scale-[1.01]" 
                          : isPast 
                          ? "bg-slate-950/60 border-slate-800/80 opacity-90" 
                          : "bg-slate-950/20 border-slate-900 opacity-40"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className={`p-2 rounded-md border ${
                            isCurrent 
                              ? "bg-slate-800 border-slate-700 text-white" 
                              : isPast 
                              ? "bg-slate-900 border-slate-800 text-emerald-400" 
                              : "bg-slate-950 border-slate-900 text-slate-600"
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950 text-slate-500 border border-slate-850">
                            {stage.latency}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-slate-500 font-bold">
                          <span>NODE 0{idx + 1}</span>
                          {isPast && <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />}
                          {isCurrent && <Loader2 className="w-3 h-3 text-white animate-spin inline" />}
                        </div>
                        <h3 className={`text-xs font-bold mt-1 font-mono uppercase ${
                          isCurrent ? "text-white" : isPast ? "text-slate-300" : "text-slate-500"
                        }`}>
                          {stage.label}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed font-sans">{stage.description}</p>
                      </div>
                      
                      <div className="mt-4 pt-2.5 border-t border-slate-850 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-500">STATE:</span>
                        <span className={isCurrent ? "text-white font-bold" : isPast ? "text-emerald-400" : "text-slate-600"}>
                          {isCurrent ? "PROCESSING..." : isPast ? "RESOLVED" : "QUEUED"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 7. TABBED WORKSPACE VIEW */}
          {report && (
            <ReportViewer 
              ticker={aggregatedData?.ticker || company.toUpperCase()} 
              report={report} 
              rawPayload={aggregatedData}
            />
          )}

        </div>
      </div>
    </main>
  );
}