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
  Globe, 
  Clock, 
  Terminal, 
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
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
  { id: "api_fetch", label: "Multi-Exchange Scraper", description: "Querying Finnhub & FMP endpoints for profile, news, and quotes.", icon: Layers, latency: "~450ms" },
  { id: "aggregation", label: "Data Normalization Engine", description: "Cross-referencing ratios, cleaning nulls, and building state schema.", icon: Cpu, latency: "~120ms" },
  { id: "llm_analysis", label: "Parallel AI Specialists", description: "Groq Llama 70B & Gemma 2 9B reasoning over valuation and moats.", icon: BrainCircuit, latency: "~1800ms" },
  { id: "final_decision", label: "Consensus Judge Node", description: "Synthesizing conflicting signals into tactical allocation weights.", icon: TrendingUp, latency: "~900ms" },
];

const MACRO_TICKERS = [
  { symbol: "NIFTY 50", price: "24,852.15", change: "+142.50", percent: "+0.58%", isUp: true },
  { symbol: "SENSEX", price: "81,343.46", change: "+480.20", percent: "+0.59%", isUp: true },
  { symbol: "NASDAQ", price: "18,352.76", change: "-32.10", percent: "-0.17%", isUp: false },
  { symbol: "S&P 500", price: "5,615.35", change: "+12.40", percent: "+0.22%", isUp: true },
  { symbol: "INDIA VIX", price: "13.42", change: "-0.85", percent: "-5.96%", isUp: false },
  { symbol: "GOLD / OUNCE", price: "$2,421.80", change: "+18.50", percent: "+0.77%", isUp: true },
];

const QUICK_ASSETS = ["RELIANCE.NS", "TCS.NS", "INFY.NS", "AAPL", "NVDA", "TSLA", "DELL"];

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
      await new Promise((res) => setTimeout(res, 500));

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
    <main className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black pb-16">
      
      {/* 1. NSE-STYLE LIVE MACRO TICKER TAPE */}
      <div className="bg-[#0b1120] border-b border-slate-800/80 overflow-hidden py-2 px-4 text-xs font-mono">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-cyan-400 font-bold tracking-wider shrink-0 pr-4 border-r border-slate-800">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>GLOBAL INDICES</span>
          </div>
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-0.5 pl-4">
            {MACRO_TICKERS.map((ticker, idx) => (
              <div key={idx} className="flex items-center gap-2 shrink-0">
                <span className="text-slate-300 font-semibold">{ticker.symbol}</span>
                <span className="text-white">{ticker.price}</span>
                <span className={`flex items-center text-[11px] font-bold ${ticker.isUp ? "text-emerald-400" : "text-rose-400"}`}>
                  {ticker.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {ticker.percent}
                </span>
              </div>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2 text-slate-400 shrink-0 pl-4 border-l border-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{currentTime || "SYSTEM ONLINE"}</span>
          </div>
        </div>
      </div>

      {/* 2. INSTITUTIONAL HEADER */}
      <div className="border-b border-slate-800/80 bg-[#0a0f1d]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white uppercase font-mono">
                  APEX <span className="text-cyan-400 font-light">//</span> RESEARCH TERMINAL
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300">
                  v2.4 LANGGRAPH
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-Agent Autonomous Equity Valuation & Quantitative Alpha Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>WEBSOCKET: CONNECTED</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>FEED: FINNHUB + FMP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        
        {/* 3. EXECUTION SEARCH DECK WITH QUICK-SELECT CHIPS */}
        <div className="bg-[#0b1120] border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <form onSubmit={handleStartResearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Target Asset / Equity Ticker</span>
                  <span className="text-cyan-400/80">Supports Global Exchanges & NSE India (.NS)</span>
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Enter ticker or brand (e.g., RELIANCE.NS, TCS.NS, AAPL, NVDA)..."
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    disabled={currentStage !== "idle" && currentStage !== "completed" && currentStage !== "error"}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all disabled:opacity-50 text-base"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={!company.trim() || (currentStage !== "idle" && currentStage !== "completed" && currentStage !== "error")}
                className="w-full md:w-auto px-8 py-3.5 font-bold font-mono text-sm tracking-wider uppercase text-black bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-xl hover:from-cyan-300 hover:to-emerald-300 disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/10 flex items-center justify-center gap-2 shrink-0"
              >
                {currentStage !== "idle" && currentStage !== "completed" && currentStage !== "error" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>EXECUTE PIPELINE...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black fill-black" />
                    <span>RUN ANALYSIS</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Assets Bar */}
            <div className="flex items-center gap-2 pt-2 overflow-x-auto no-scrollbar">
              <span className="text-xs font-mono text-slate-500 shrink-0 mr-1">INSTITUTIONAL QUICK SELECT:</span>
              {QUICK_ASSETS.map((ticker) => (
                <button
                  key={ticker}
                  type="button"
                  onClick={() => runResearch(ticker)}
                  disabled={currentStage !== "idle" && currentStage !== "completed" && currentStage !== "error"}
                  className="px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/50 text-xs font-mono text-slate-300 hover:text-cyan-300 transition-all shrink-0 disabled:opacity-40"
                >
                  {ticker}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* 4. ERROR TELEMETRY BANNER */}
        {currentStage === "error" && errorMessage && (
          <div className="bg-rose-950/30 border border-rose-800/80 text-rose-200 p-5 rounded-2xl flex items-start gap-4 shadow-xl">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono text-xs text-rose-400 uppercase tracking-wider font-bold">
                <Terminal className="w-3.5 h-3.5" />
                <span>PIPELINE EXECUTION FAULT // ERROR CODE 500</span>
              </div>
              <h4 className="font-bold text-white text-base">Upstream Node Scrape Failure</h4>
              <p className="text-sm text-rose-300/80 font-mono leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* 5. FUTURISTIC TELEMETRY EXECUTION STEPPER */}
        {currentStage !== "idle" && currentStage !== "error" && (
          <div className="bg-[#0b1120] border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-white uppercase tracking-wider">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>LANGGRAPH AUTONOMOUS ROUTING TRACE</span>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 px-3 py-1 rounded-full flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                ACTIVE ENGINE TRACE
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
                    className={`relative p-5 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                      isCurrent 
                        ? "bg-cyan-950/20 border-cyan-500/80 shadow-lg shadow-cyan-500/10 scale-[1.02]" 
                        : isPast 
                        ? "bg-[#070b14]/80 border-emerald-800/60 opacity-90" 
                        : "bg-[#070b14]/30 border-slate-850 opacity-40"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2.5 rounded-xl border ${
                          isCurrent 
                            ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" 
                            : isPast 
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                            : "bg-slate-900 border-slate-800 text-slate-500"
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {stage.latency}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-xs uppercase text-slate-400 font-semibold">
                        <span>STEP 0{idx + 1}</span>
                        {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />}
                        {isCurrent && <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin inline" />}
                      </div>
                      <h3 className={`text-sm font-bold mt-1 font-mono ${
                        isCurrent ? "text-cyan-300" : isPast ? "text-emerald-300" : "text-slate-400"
                      }`}>
                        {stage.label}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{stage.description}</p>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-500">STATUS:</span>
                      <span className={isCurrent ? "text-cyan-400 font-bold" : isPast ? "text-emerald-400" : "text-slate-600"}>
                        {isCurrent ? "PROCESSING..." : isPast ? "RESOLVED" : "QUEUED"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. TABBED INSTITUTIONAL TERMINAL VIEW (NSE STYLE) */}
        {report && (
          <ReportViewer 
            ticker={aggregatedData?.ticker || company.toUpperCase()} 
            report={report} 
            rawPayload={aggregatedData}
          />
        )}

      </div>
    </main>
  );
}