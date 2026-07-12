// src/app/page.tsx
"use client";

import { useState } from "react";
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
  Code2
} from "lucide-react";

type AgentStage = "idle" | "api_fetch" | "aggregation" | "llm_analysis" | "final_decision" | "completed" | "error";

interface StageStatus {
  id: Exclude<AgentStage, "idle" | "error">;
  label: string;
  description: string;
  icon: any;
}

const STAGES: StageStatus[] = [
  { id: "api_fetch", label: "Specialized API Workers", description: "Querying profiles, real-time quotes, and news feeds.", icon: Layers },
  { id: "aggregation", label: "Research Aggregator Node", description: "Normalizing, cross-referencing, and synthesizing data payloads.", icon: Cpu },
  { id: "llm_analysis", label: "Specialized LLM Specialists", description: "Executing parallel reasoning nodes on Risk and Ratios.", icon: BrainCircuit },
  { id: "final_decision", label: "Conclusion & Investment Engine", description: "Formulating allocation alpha weighting and tactical report.", icon: TrendingUp },
];

export default function ResearchDashboard() {
  const [company, setCompany] = useState("");
  const [currentStage, setCurrentStage] = useState<AgentStage>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // States to hold the output data
  const [aggregatedData, setAggregatedData] = useState<any | null>(null);
  const [report, setReport] = useState<string | null>(null);

  const handleStartResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;

    // Reset layout states
    setReport(null);
    setAggregatedData(null);
    setErrorMessage(null);
    
    try {
      // 1. Trigger API Worker Nodes
      setCurrentStage("api_fetch");
      
      // 2. Trigger Centralized Aggregator Node by hitting our Next.js backend route
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: company }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed inside data collection pipeline.");
      }

      setCurrentStage("aggregation");
      setAggregatedData(result.data);
      await new Promise((res) => setTimeout(res, 1200)); // Smooth UI transition delay

      // 3. Move to LLM Analysis (Simulated for this step until we install LangGraph models)
      setCurrentStage("llm_analysis");
      await new Promise((res) => setTimeout(res, 2000));
      
      // 4. Move to Final Decision Node
      setCurrentStage("final_decision");
      await new Promise((res) => setTimeout(res, 1800));
      
      // 5. Execution Complete
      setCurrentStage("completed");
      setReport(`# Autonomous Allocation Verdict: ${result.data.ticker}
      
## System Synthesis Summary
The structural components have successfully parsed metrics for **${result.data.ticker}**.

*   **API Ingestion Status:** Fully aggregated across 5 pipelines.
*   **Financial Profile Engine:** Checked market capitalizations, balance-sheet margins, and trailing metrics.
*   **Next Architecture Task:** Now that your frontend successfully pulls real market variables, we are completely ready to attach our LangGraph back-end execution structure and route this raw state map through our LLM specialists.`);

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An unhandled execution trace failure occurred.");
      setCurrentStage("error");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-2 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-indigo-400" />
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Autonomous Deep-Research Agent
            </h1>
          </div>
          <p className="text-slate-400 max-w-2xl">
            Orchestrating concurrent API pipelines and multi-agent LLM systems to deliver institutional-grade investment strategies.
          </p>
        </div>

        {/* Input Control Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <form onSubmit={handleStartResearch} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-2">
              <label className="text-sm font-semibold text-slate-300">Target Asset / Company Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g., Apple, NVIDIA, Tesla..."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  disabled={currentStage !== "idle" && currentStage !== "completed" && currentStage !== "error"}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-11 pr-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={!company.trim() || (currentStage !== "idle" && currentStage !== "completed" && currentStage !== "error")}
              className="w-full md:w-auto px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-600/20 whitespace-nowrap flex items-center justify-center gap-2"
            >
              {currentStage !== "idle" && currentStage !== "completed" && currentStage !== "error" ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running Pipeline...
                </>
              ) : (
                "Initialize Agent Engine"
              )}
            </button>
          </form>
        </div>

        {/* Error Notification */}
        {currentStage === "error" && errorMessage && (
          <div className="bg-red-950/40 border border-red-800 text-red-200 p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold">Pipeline Resolver Error</h4>
              <p className="text-sm text-red-300/90 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* LangGraph Traversal Trace UI */}
        {currentStage !== "idle" && currentStage !== "error" && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
            <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
              <span>LangGraph Live Execution Trace</span>
              {currentStage === "completed" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {STAGES.map((stage, idx) => {
                const Icon = stage.icon;
                const isCurrent = currentStage === stage.id;
                const isPast = 
                  currentStage === "completed" || 
                  STAGES.findIndex(s => s.id === currentStage) > idx;

                return (
                  <div
                    key={stage.id}
                    className={`relative p-4 rounded-xl border transition-all duration-300 ${
                      isCurrent 
                        ? "bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10" 
                        : isPast 
                        ? "bg-slate-900 border-emerald-800/60 opacity-90" 
                        : "bg-slate-950/40 border-slate-800 opacity-40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${
                        isCurrent ? "bg-indigo-500/20 text-indigo-400" : isPast ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {isPast && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {isCurrent && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
                    </div>
                    <h3 className={`text-sm font-bold ${isCurrent ? "text-indigo-300" : isPast ? "text-emerald-400" : "text-slate-400"}`}>
                      {stage.label}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{stage.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Split Layout: Live Aggregated JSON Data vs Final Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Aggregator Node Content Terminal Viewer */}
          {aggregatedData && (
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3 h-[500px] flex flex-col">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-sm tracking-wide uppercase border-b border-slate-800 pb-3">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>State Payload Context (Node Aggregation)</span>
              </div>
              <div className="flex-1 overflow-auto rounded-lg bg-slate-950 p-4 border border-slate-850 font-mono text-xs text-cyan-400 custom-scrollbar">
                <pre>{JSON.stringify(aggregatedData, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* Markdown Output Report Document */}
          {report && (
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4 min-h-[500px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-slate-200 font-bold text-xl">
                  <span>Report Output Panel</span>
                </div>
                <span className="text-xs font-mono uppercase px-2 py-1 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 tracking-wide font-bold">
                  Complete
                </span>
              </div>
              <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-line leading-relaxed text-sm">
                {report}
              </div>
            </div>
          )}
          
        </div>

      </div>
    </main>
  );
}