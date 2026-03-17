/**
 * Week 1 Practice - Pre-FRQ Model Problem
 * Simulates complete FRQ workflow: Read → Solve → Justify → Self-Check → Reflect
 */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Lightbulb, Lock, Unlock, Clock, Award, Trophy, ChevronDown, ChevronUp,
  FileText, PenTool, CheckCircle, Eye, BookOpen, AlertCircle, ArrowLeft
} from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import ShimmerButton from "@/components/ui/shimmer-button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";

type Phase = "understand" | "solve" | "justify" | "selfCheck" | "reflection" | "complete";

interface ModelProblem {
  id: string;
  title: string;
  relatedFRQ: {
    year: number;
    exam: "AB" | "BC";
    number: number;
    topic: string;
  };
  statementLatex: string;
  contextText: string;
  theoremName: string;
  theoremStatement: string;
  theoremFormulaLatex: string;
  theoremConditions: string[];
  hints: string[];
  solution: {
    workShown: string;
    cercModel: {
      claim: string;
      evidence: string;
      reasoning: string;
      conditions: string;
    };
    commonMistakes: string[];
  };
  expectedMinutes: number;
}

const modelProblem: ModelProblem = {
  id: "mvt-discontinuous-practice",
  title: "MVT with Hidden Discontinuity",
  relatedFRQ: {
    year: 2024,
    exam: "AB",
    number: 4,
    topic: "MVT application with condition verification"
  },
  statementLatex: "f(x) = \\frac{1}{x^2}",
  contextText: "Apply the Mean Value Theorem to find c in (-1, 1) where f'(c) equals the average rate of change on [-1, 1].",
  theoremName: "Mean Value Theorem",
  theoremStatement: "If f is continuous on [a,b] and differentiable on (a,b), then there exists c in (a,b) such that:",
  theoremFormulaLatex: "f'(c) = \\frac{f(b) - f(a)}{b - a}",
  theoremConditions: [
    "f must be continuous on [a, b]",
    "f must be differentiable on (a, b)"
  ],
  hints: [
    "Before applying MVT, check ALL theorem conditions. Is f(x) continuous everywhere on [-1, 1]?",
    "Evaluate f(0). What happens when you try to compute 1/0²?",
    "f(x) is undefined at x=0, which lies inside [-1, 1]. This breaks continuity, so MVT does NOT apply."
  ],
  solution: {
    workShown: "f(x) = 1/x² is undefined at x=0. Since 0 ∈ [-1,1], the function has a discontinuity on the interval. MVT requires continuity on [a,b], so the theorem cannot be applied.",
    cercModel: {
      claim: "The Mean Value Theorem cannot be applied to f(x) = 1/x² on [-1, 1].",
      evidence: "f(x) is undefined at x = 0, creating a discontinuity in the interval [-1, 1].",
      reasoning: "The Mean Value Theorem requires the function to be continuous on the closed interval [a, b].",
      conditions: "The continuity condition is violated because f(0) does not exist, where 0 ∈ [-1, 1]."
    },
    commonMistakes: [
      "Jumping to compute f'(x) without checking continuity first",
      "Assuming the function is continuous because it looks smooth away from x=0",
      "Not explicitly stating which theorem condition fails"
    ]
  },
  expectedMinutes: 20
};

interface SessionData {
  startTime: number;
  phases: {
    understand: { completed: boolean; timestamp?: number };
    solve: { completed: boolean; workLocation?: "paper" | "whiteboard" | "scratchpad"; timestamp?: number };
    justify: { completed: boolean; timestamp?: number };
    selfCheck: { completed?: boolean; hintsViewed: number[]; solutionViewed: boolean; revised: boolean; timestamp?: number };
    reflection: { completed?: boolean; learnings: string[]; customNote?: string; timestamp?: number };
  };
  cercResponses: {
    claim: string;
    evidence: string;
    reasoning: string;
    conditions: string;
  };
}

export default function ModelProblemPractice() {
  const [currentPhase, setCurrentPhase] = useState<Phase>("understand");
  const [sessionData, setSessionData] = useState<SessionData>({
    startTime: Date.now(),
    phases: {
      understand: { completed: false },
      solve: { completed: false },
      justify: { completed: false },
      selfCheck: { hintsViewed: [], solutionViewed: false, revised: false },
      reflection: { learnings: [] }
    },
    cercResponses: {
      claim: "",
      evidence: "",
      reasoning: "",
      conditions: ""
    }
  });

  const [showTheorem, setShowTheorem] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [workLocation, setWorkLocation] = useState<"paper" | "whiteboard" | "scratchpad">("paper");
  const [reflectionChecks, setReflectionChecks] = useState<string[]>([]);
  const [customReflection, setCustomReflection] = useState("");
  const [showXPModal, setShowXPModal] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - sessionData.startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionData.startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const completePhase = (phase: Phase) => {
    const updatedPhases = { ...sessionData.phases };

    switch (phase) {
      case "understand":
        updatedPhases.understand = { completed: true, timestamp: Date.now() };
        setCurrentPhase("solve");
        break;
      case "solve":
        updatedPhases.solve = { completed: true, workLocation, timestamp: Date.now() };
        setCurrentPhase("justify");
        break;
      case "justify":
        updatedPhases.justify = { completed: true, timestamp: Date.now() };
        setCurrentPhase("selfCheck");
        break;
      case "selfCheck":
        updatedPhases.selfCheck = { ...sessionData.phases.selfCheck, timestamp: Date.now() };
        setCurrentPhase("reflection");
        break;
    }

    setSessionData({ ...sessionData, phases: updatedPhases });
  };

  const viewHint = (hintIndex: number) => {
    const updatedHints = [...sessionData.phases.selfCheck.hintsViewed, hintIndex];
    setSessionData({
      ...sessionData,
      phases: {
        ...sessionData.phases,
        selfCheck: { ...sessionData.phases.selfCheck, hintsViewed: updatedHints }
      }
    });
  };

  const viewSolution = () => {
    setShowSolution(true);
    setSessionData({
      ...sessionData,
      phases: {
        ...sessionData.phases,
        selfCheck: { ...sessionData.phases.selfCheck, solutionViewed: true }
      }
    });
  };

  const reviseResponse = () => {
    setSessionData({
      ...sessionData,
      phases: {
        ...sessionData.phases,
        selfCheck: { ...sessionData.phases.selfCheck, revised: true }
      }
    });
    setCurrentPhase("justify");
  };

  const calculateXP = () => {
    let xp = 15; // Base XP
    const bonuses: { name: string; amount: number }[] = [];

    // Quality of CERC (check if all fields have substantial content)
    const cercComplete = Object.values(sessionData.cercResponses).every(v => v.trim().length > 20);
    if (cercComplete) {
      bonuses.push({ name: "Complete CERC Response", amount: 5 });
      xp += 5;
    }

    // Revised after hints
    if (sessionData.phases.selfCheck.revised) {
      bonuses.push({ name: "Revised After Self-Check", amount: 3 });
      xp += 3;
    }

    // Self-identified errors
    if (reflectionChecks.length > 0) {
      bonuses.push({ name: "Self-Identified Learning", amount: 2 });
      xp += 2;
    }

    // Completed without viewing solution
    if (!sessionData.phases.selfCheck.solutionViewed) {
      bonuses.push({ name: "Solved Independently", amount: 5 });
      xp += 5;
    }

    // Multiple learnings selected
    if (reflectionChecks.length >= 2) {
      bonuses.push({ name: "Deep Reflection", amount: 2 });
      xp += 2;
    }

    // Custom reflection written
    if (customReflection.trim().length > 20) {
      bonuses.push({ name: "Personalized Reflection", amount: 3 });
      xp += 3;
    }

    return { base: 15, bonuses, total: xp };
  };

  const completeReflection = () => {
    const updatedPhases = { ...sessionData.phases };
    updatedPhases.reflection = {
      learnings: reflectionChecks,
      customNote: customReflection,
      timestamp: Date.now()
    };
    setSessionData({ ...sessionData, phases: updatedPhases });
    setCurrentPhase("complete");
    setShowXPModal(true);
  };

  const xpBreakdown = calculateXP();

  const phaseConfig = [
    { key: "understand", label: "Understand", icon: BookOpen, color: "blue" },
    { key: "solve", label: "Solve", icon: PenTool, color: "purple" },
    { key: "justify", label: "Justify", icon: FileText, color: "green" },
    { key: "selfCheck", label: "Self-Check", icon: Eye, color: "yellow" },
    { key: "reflection", label: "Reflect", icon: CheckCircle, color: "pink" }
  ];

  const getPhaseIndex = (phase: Phase) => {
    return phaseConfig.findIndex(p => p.key === phase);
  };

  const currentPhaseIndex = getPhaseIndex(currentPhase);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
      {/* Navigation Bar */}
      <div className="border-b border-primary-600/30 bg-primary-900/60 backdrop-blur-sm">
        <div className="max-w-full px-6 py-4 flex items-center justify-between">
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/student" },
              { label: "Week 1", href: "/student/week/1" },
              { label: "Practice" }
            ]}
          />
          <Link
            href="/student/week/1"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Week 1
          </Link>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* LEFT SIDEBAR - Problem Context (Always Visible) */}
        <div className="w-2/5 border-r border-primary-600/30 bg-primary-900/40 backdrop-blur-sm p-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-accent-400" />
              <span className="text-sm text-primary-300">Pre-FRQ Practice</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{modelProblem.title}</h1>
            <div className="flex items-center gap-2 text-sm text-accent-300">
              <FileText className="w-4 h-4" />
              <span>Related to FRQ {modelProblem.relatedFRQ.year}-{modelProblem.relatedFRQ.exam}-{modelProblem.relatedFRQ.number}</span>
            </div>
          </div>

          {/* Problem Statement */}
          <div className="mb-6 p-5 bg-primary-800/60 rounded-xl border border-primary-600/30">
            <h3 className="font-bold text-accent-300 mb-3">The Problem</h3>
            <p className="text-primary-200 mb-4">{modelProblem.contextText}</p>
            <div className="bg-primary-900/60 rounded-lg p-4">
              <BlockMath math={modelProblem.statementLatex} />
            </div>
            <p className="text-primary-200 mt-4">on the interval <InlineMath math="[-1, 1]" /></p>
          </div>

          {/* Theorem Reference */}
          <div className="mb-6">
            <button
              onClick={() => setShowTheorem(!showTheorem)}
              className="w-full flex items-center justify-between p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl hover:bg-purple-500/20 transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span className="font-semibold text-purple-300">{modelProblem.theoremName}</span>
              </div>
              {showTheorem ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <AnimatePresence>
              {showTheorem && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 p-4 bg-purple-900/20 border border-purple-500/30 rounded-xl">
                    <p className="text-sm text-primary-200 mb-3 leading-relaxed">
                      {modelProblem.theoremStatement}
                    </p>
                    <div className="p-3 bg-black/30 rounded-lg mb-4">
                      <BlockMath math={modelProblem.theoremFormulaLatex} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-purple-300 uppercase">Conditions:</p>
                      {modelProblem.theoremConditions.map((condition, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-primary-200">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{condition}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Phase Progress */}
          <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-primary-300">
                {currentPhase === "complete" ? "Session Complete" : `Current Phase: ${phaseConfig[currentPhaseIndex]?.label}`}
              </span>
              {/* Timer - Only show after starting (not in understand phase) */}
              {currentPhase !== "understand" && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent-400" />
                  <span className="text-accent-400 font-mono text-sm">{formatTime(elapsedSeconds)}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              {phaseConfig.map((phase, index) => (
                <div key={phase.key} className="flex items-center gap-2">
                  {"completed" in sessionData.phases[phase.key as keyof typeof sessionData.phases] && sessionData.phases[phase.key as keyof typeof sessionData.phases].completed ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : index === currentPhaseIndex ? (
                    <div className="w-4 h-4 rounded-full border-2 border-accent-400 animate-pulse" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-primary-600" />
                  )}
                  <span className={`text-sm ${
                    "completed" in sessionData.phases[phase.key as keyof typeof sessionData.phases] && sessionData.phases[phase.key as keyof typeof sessionData.phases].completed
                      ? "text-green-400"
                      : index === currentPhaseIndex
                      ? "text-accent-400 font-semibold"
                      : "text-primary-500"
                  }`}>
                    {phase.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Expected Info */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-300 font-semibold mb-1">Practice Mode</p>
                <p className="text-xs text-blue-200">
                  No time pressure. Use hints freely. Focus on understanding the CERC framework.
                  Expected duration: ~{modelProblem.expectedMinutes} minutes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT WORKSPACE - Current Phase (Scrollable) */}
        <div className="w-3/5 p-8 pb-16 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {/* PHASE 1: UNDERSTAND */}
            {currentPhase === "understand" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Phase 1: Understand</h2>
                    <p className="text-primary-300">Read carefully and identify what's being asked</p>
                  </div>
                </div>

                <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <h3 className="font-bold text-blue-300 mb-3">Before you begin:</h3>
                  <ul className="space-y-2 text-primary-200">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Read the problem statement and identify the theorem mentioned</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Review the theorem conditions (click to expand on the left)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Think: What could go wrong? What should I check first?</span>
                    </li>
                  </ul>
                </div>

                <ShimmerButton onClick={() => completePhase("understand")} className="w-full py-4 text-lg">
                  I understand the problem →
                </ShimmerButton>
              </motion.div>
            )}

            {/* PHASE 2: SOLVE */}
            {currentPhase === "solve" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <PenTool className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Phase 2: Solve</h2>
                    <p className="text-primary-300">Work through the mathematics</p>
                  </div>
                </div>

                <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                  <h3 className="font-bold text-purple-300 mb-4">Where are you working?</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 bg-primary-800/60 rounded-lg cursor-pointer hover:bg-primary-800/80 transition-colors">
                      <input
                        type="radio"
                        name="workLocation"
                        value="paper"
                        checked={workLocation === "paper"}
                        onChange={(e) => setWorkLocation(e.target.value as any)}
                        className="w-4 h-4"
                      />
                      <span className="text-primary-100">On paper (recommended for FRQ practice)</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 bg-primary-800/60 rounded-lg cursor-pointer hover:bg-primary-800/80 transition-colors">
                      <input
                        type="radio"
                        name="workLocation"
                        value="whiteboard"
                        checked={workLocation === "whiteboard"}
                        onChange={(e) => setWorkLocation(e.target.value as any)}
                        className="w-4 h-4"
                      />
                      <span className="text-primary-100">On whiteboard</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 bg-primary-800/60 rounded-lg cursor-pointer hover:bg-primary-800/80 transition-colors">
                      <input
                        type="radio"
                        name="workLocation"
                        value="scratchpad"
                        checked={workLocation === "scratchpad"}
                        onChange={(e) => setWorkLocation(e.target.value as any)}
                        className="w-4 h-4"
                      />
                      <span className="text-primary-100">Digital scratchpad (coming soon)</span>
                    </label>
                  </div>
                </div>

                <div className="p-6 bg-primary-800/60 rounded-xl border border-primary-600/30">
                  <p className="text-primary-200 leading-relaxed">
                    Work through the problem step by step. Check theorem conditions before applying it.
                    When you're ready to write your justification, click below.
                  </p>
                </div>

                <ShimmerButton onClick={() => completePhase("solve")} className="w-full py-4 text-lg">
                  Done with calculations →
                </ShimmerButton>
              </motion.div>
            )}

            {/* PHASE 3: JUSTIFY (CERC) */}
            {currentPhase === "justify" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Phase 3: Justify (CERC)</h2>
                    <p className="text-primary-300">Write your structured mathematical justification</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Claim */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-accent-500 to-accent-600 font-bold text-sm">C</span>
                      <label className="font-semibold">Claim</label>
                    </div>
                    <textarea
                      value={sessionData.cercResponses.claim}
                      onChange={(e) => setSessionData({
                        ...sessionData,
                        cercResponses: { ...sessionData.cercResponses, claim: e.target.value }
                      })}
                      className="w-full bg-primary-800/60 border border-primary-600/30 rounded-xl p-4 text-white placeholder-primary-400 focus:border-accent-500 focus:outline-none resize-none"
                      rows={2}
                      placeholder="State your conclusion..."
                    />
                  </div>

                  {/* Evidence */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 font-bold text-sm">E</span>
                      <label className="font-semibold">Evidence</label>
                    </div>
                    <textarea
                      value={sessionData.cercResponses.evidence}
                      onChange={(e) => setSessionData({
                        ...sessionData,
                        cercResponses: { ...sessionData.cercResponses, evidence: e.target.value }
                      })}
                      className="w-full bg-primary-800/60 border border-primary-600/30 rounded-xl p-4 text-white placeholder-primary-400 focus:border-accent-500 focus:outline-none resize-none"
                      rows={3}
                      placeholder="What mathematical data supports your claim?"
                    />
                  </div>

                  {/* Reasoning */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 font-bold text-sm">R</span>
                      <label className="font-semibold">Reasoning</label>
                    </div>
                    <textarea
                      value={sessionData.cercResponses.reasoning}
                      onChange={(e) => setSessionData({
                        ...sessionData,
                        cercResponses: { ...sessionData.cercResponses, reasoning: e.target.value }
                      })}
                      className="w-full bg-primary-800/60 border border-primary-600/30 rounded-xl p-4 text-white placeholder-primary-400 focus:border-accent-500 focus:outline-none resize-none"
                      rows={3}
                      placeholder="What theorem or principle connects your evidence to your claim?"
                    />
                  </div>

                  {/* Conditions */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-green-500 to-green-600 font-bold text-sm">C</span>
                      <label className="font-semibold">Conditions</label>
                    </div>
                    <textarea
                      value={sessionData.cercResponses.conditions}
                      onChange={(e) => setSessionData({
                        ...sessionData,
                        cercResponses: { ...sessionData.cercResponses, conditions: e.target.value }
                      })}
                      className="w-full bg-primary-800/60 border border-primary-600/30 rounded-xl p-4 text-white placeholder-primary-400 focus:border-accent-500 focus:outline-none resize-none"
                      rows={3}
                      placeholder="Verify all theorem hypotheses are satisfied..."
                    />
                  </div>
                </div>

                <ShimmerButton onClick={() => completePhase("justify")} className="w-full py-4 text-lg">
                  Submit for self-check →
                </ShimmerButton>
              </motion.div>
            )}

            {/* PHASE 4: SELF-CHECK */}
            {currentPhase === "selfCheck" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Phase 4: Self-Check</h2>
                    <p className="text-primary-300">Compare your work with resources (no penalties)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Your Work */}
                  <div>
                    <h3 className="font-bold text-accent-300 mb-4">Your CERC Response</h3>
                    <div className="space-y-3">
                      {[
                        { key: "claim", label: "C", title: "Claim", color: "accent" },
                        { key: "evidence", label: "E", title: "Evidence", color: "blue" },
                        { key: "reasoning", label: "R", title: "Reasoning", color: "purple" },
                        { key: "conditions", label: "C", title: "Conditions", color: "green" }
                      ].map(field => (
                        <div key={field.key} className="p-3 bg-primary-800/60 rounded-lg border border-primary-600/30">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded bg-${field.color}-500/20 text-${field.color}-300 font-bold text-xs`}>
                              {field.label}
                            </span>
                            <span className="text-xs text-primary-400">{field.title}</span>
                          </div>
                          <p className="text-sm text-primary-100">
                            {sessionData.cercResponses[field.key as keyof typeof sessionData.cercResponses] || "(empty)"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Resources */}
                  <div>
                    <h3 className="font-bold text-secondary-300 mb-4">Resources</h3>

                    {/* Hints */}
                    <div className="space-y-3 mb-4">
                      {modelProblem.hints.map((hint, index) => (
                        <div key={index}>
                          {sessionData.phases.selfCheck.hintsViewed.includes(index) ? (
                            <div className="p-3 bg-secondary-500/10 border border-secondary-500/30 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="w-4 h-4 text-secondary-400" />
                                <span className="text-xs font-semibold text-secondary-300">Hint {index + 1}</span>
                              </div>
                              <p className="text-sm text-primary-200">{hint}</p>
                            </div>
                          ) : (
                            <button
                              onClick={() => viewHint(index)}
                              className="w-full p-3 bg-primary-800/40 border border-primary-600/20 rounded-lg hover:bg-secondary-500/10 hover:border-secondary-500/30 transition-colors flex items-center gap-2"
                            >
                              <Lock className="w-4 h-4 text-primary-500" />
                              <span className="text-sm text-primary-400">View Hint {index + 1}</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Solution */}
                    {!showSolution ? (
                      <button
                        onClick={viewSolution}
                        className="w-full p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/20 transition-colors flex items-center gap-2 justify-center"
                      >
                        <Eye className="w-5 h-5 text-yellow-400" />
                        <span className="font-semibold text-yellow-300">View Full Solution</span>
                      </button>
                    ) : (
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <h4 className="font-bold text-yellow-300 mb-3">Model Solution</h4>
                        <div className="space-y-2 mb-4">
                          {[
                            { key: "claim", label: "C", title: "Claim" },
                            { key: "evidence", label: "E", title: "Evidence" },
                            { key: "reasoning", label: "R", title: "Reasoning" },
                            { key: "conditions", label: "C", title: "Conditions" }
                          ].map(field => (
                            <div key={field.key}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 font-bold text-xs">
                                  {field.label}
                                </span>
                                <span className="text-xs text-yellow-400">{field.title}</span>
                              </div>
                              <p className="text-xs text-primary-200 ml-6">
                                {modelProblem.solution.cercModel[field.key as keyof typeof modelProblem.solution.cercModel]}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="pt-3 border-t border-yellow-500/30">
                          <p className="text-xs font-semibold text-yellow-400 mb-2">Common Mistakes:</p>
                          <ul className="space-y-1">
                            {modelProblem.solution.commonMistakes.map((mistake, i) => (
                              <li key={i} className="text-xs text-primary-300 flex items-start gap-2">
                                <span className="text-yellow-400 mt-0.5">•</span>
                                <span>{mistake}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button
                    onClick={reviseResponse}
                    className="flex-1 px-6 py-4 bg-secondary-500 hover:bg-secondary-600 rounded-xl font-semibold transition-colors text-center"
                  >
                    ← Revise my CERC
                  </button>
                  <ShimmerButton
                    onClick={() => completePhase("selfCheck")}
                    className="flex-1 px-6 py-4 text-center"
                  >
                    Continue to Reflection →
                  </ShimmerButton>
                </div>
              </motion.div>
            )}

            {/* PHASE 5: REFLECTION */}
            {currentPhase === "reflection" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Phase 5: Reflect</h2>
                    <p className="text-primary-300">What did you learn from this problem?</p>
                  </div>
                </div>

                <div className="p-6 bg-pink-500/10 border border-pink-500/30 rounded-xl">
                  <h3 className="font-bold text-pink-300 mb-4">Key Learnings (select all that apply):</h3>
                  <div className="space-y-3">
                    {[
                      "I missed checking a theorem condition",
                      "I forgot to verify hypotheses explicitly",
                      "My evidence was incomplete",
                      "I didn't state which condition failed",
                      "I jumped to calculations without checking continuity"
                    ].map((learning, index) => (
                      <label key={index} className="flex items-start gap-3 p-3 bg-primary-800/60 rounded-lg cursor-pointer hover:bg-primary-800/80 transition-colors">
                        <input
                          type="checkbox"
                          checked={reflectionChecks.includes(learning)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setReflectionChecks([...reflectionChecks, learning]);
                            } else {
                              setReflectionChecks(reflectionChecks.filter(l => l !== learning));
                            }
                          }}
                          className="mt-1"
                        />
                        <span className="text-primary-100">{learning}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Personal reflection (optional):</label>
                  <textarea
                    value={customReflection}
                    onChange={(e) => setCustomReflection(e.target.value)}
                    className="w-full bg-primary-800/60 border border-primary-600/30 rounded-xl p-4 text-white placeholder-primary-400 focus:border-accent-500 focus:outline-none resize-none"
                    rows={4}
                    placeholder="What will you do differently next time? What surprised you about this problem?"
                  />
                </div>

                <ShimmerButton onClick={completeReflection} className="w-full py-4 text-lg">
                  <Trophy className="w-5 h-5 mr-2" />
                  Complete Practice Session
                </ShimmerButton>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* XP Modal */}
      <AnimatePresence>
        {showXPModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-8 max-w-lg w-full border-2 border-accent-500/50 shadow-2xl"
            >
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent-500 to-secondary-500 flex items-center justify-center"
                >
                  <Trophy className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-2">Practice Complete!</h2>
                <p className="text-primary-300">XP Breakdown</p>
              </div>

              <div className="space-y-3 mb-6">
                {/* Base XP */}
                <div className="flex items-center justify-between p-3 bg-primary-800/60 rounded-lg">
                  <span className="text-primary-200">Base XP (Practice Complete)</span>
                  <span className="font-bold text-white">+{xpBreakdown.base}</span>
                </div>
                <div className="text-xs text-primary-400 text-center -mt-2">
                  Time taken: {formatTime(elapsedSeconds)}
                </div>

                {/* Bonuses */}
                {xpBreakdown.bonuses.map((bonus, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-500/30"
                  >
                    <span className="text-green-300">{bonus.name}</span>
                    <span className="font-bold text-green-400">+{bonus.amount}</span>
                  </motion.div>
                ))}

                {/* Total */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-accent-900/40 to-secondary-900/40 rounded-lg border-2 border-accent-500/50 mt-4">
                  <span className="text-xl font-bold">Total XP</span>
                  <span className="text-3xl font-bold text-accent-400">
                    +{xpBreakdown.total}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-200 text-center">
                    You're now ready for FRQ {modelProblem.relatedFRQ.year}-{modelProblem.relatedFRQ.exam}-{modelProblem.relatedFRQ.number}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCompleting(true);
                    // Mark practice as completed with timestamp
                    try {
                      const completionData = {
                        completed: true,
                        timestamp: Date.now()
                      };
                      localStorage.setItem('week1_practice_completed', JSON.stringify(completionData));
                    } catch (error) {
                      console.warn('Could not save practice completion:', error);
                    }
                    // Small delay to show loading state
                    setTimeout(() => {
                      window.location.href = "/student/week/1";
                    }, 500);
                  }}
                  disabled={isCompleting}
                  className="w-full py-4 bg-gradient-to-r from-accent-500 to-secondary-500 hover:from-accent-600 hover:to-secondary-600 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
                >
                  {isCompleting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Complete Practice & Return →'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
