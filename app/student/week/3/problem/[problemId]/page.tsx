/**
 * Dynamic Week 3 Problem Solver
 * Uses 5-phase workflow: Understand → Solve → Justify → Self-Check → Reflection
 * Week 3 change: NO SCAFFOLDING - blank canvas with only CERC headers
 */
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Lightbulb, Lock, Clock, Award, Trophy, ChevronDown, ChevronUp,
  FileText, PenTool, CheckCircle, Eye, BookOpen, AlertCircle, ArrowLeft, Zap
} from "lucide-react";
import ShimmerButton from "@/components/ui/shimmer-button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { week3Problems } from "@/data/week-3-content";
import { MathContent } from "@/components/student/math-content";
import { getDataService } from "@/services/data";

type Phase = "understand" | "solve" | "justify" | "selfCheck" | "reflection" | "complete";

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

export default function Week3ProblemSolver() {
  const params = useParams();
  const problemId = params.problemId as string;

  const problem = week3Problems.find((p) => p.id === problemId);

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
  const [reflectionChecks, setReflectionChecks] = useState<string[]>([]);
  const [customReflection, setCustomReflection] = useState("");
  const [showXPModal, setShowXPModal] = useState(false);

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
        updatedPhases.solve = { completed: true, workLocation: "paper", timestamp: Date.now() };
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

  const viewHint = (hintLevel: 1 | 2 | 3) => {
    const updatedHints = [...sessionData.phases.selfCheck.hintsViewed, hintLevel];
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
    let xp = 30; // Base XP for Week 3 (highest base)
    const bonuses: { name: string; amount: number }[] = [];

    const cercComplete = Object.values(sessionData.cercResponses).every(v => v.trim().length > 40);
    if (cercComplete) {
      bonuses.push({ name: "Complete CERC Response", amount: 10 });
      xp += 10;
    }

    if (sessionData.phases.selfCheck.revised) {
      bonuses.push({ name: "Revised After Self-Check", amount: 5 });
      xp += 5;
    }

    if (reflectionChecks.length > 0) {
      bonuses.push({ name: "Self-Identified Learning", amount: 5 });
      xp += 5;
    }

    if (!sessionData.phases.selfCheck.solutionViewed) {
      bonuses.push({ name: "Solved Independently", amount: 20 });
      xp += 20;
    }

    if (sessionData.phases.selfCheck.hintsViewed.length === 0) {
      bonuses.push({ name: "No Hints Used", amount: 20 });
      xp += 20;
    }

    if (customReflection.trim().length > 20) {
      bonuses.push({ name: "Personalized Reflection", amount: 5 });
      xp += 5;
    }

    // Week 3 specific bonuses: Synthesis and Communication
    const responseLower = sessionData.cercResponses.claim.toLowerCase() +
                          sessionData.cercResponses.evidence.toLowerCase() +
                          sessionData.cercResponses.reasoning.toLowerCase();

    // Check for context and units
    if (responseLower.includes("meter") || responseLower.includes("second") ||
        responseLower.includes("gallon") || responseLower.includes("gram") ||
        responseLower.includes("%") || responseLower.includes("proportion")) {
      bonuses.push({ name: "✅ Context & Units Included", amount: 15 });
      xp += 15;
    }

    // Check for proper statistical language (non-deterministic)
    if (responseLower.includes("convincing evidence") || responseLower.includes("we estimate") ||
        responseLower.includes("predicted") || responseLower.includes("approximately")) {
      bonuses.push({ name: "📊 Precise Statistical Language", amount: 15 });
      xp += 15;
    }

    // The Architect Badge: flawless without hints/solution
    if (!sessionData.phases.selfCheck.solutionViewed &&
        sessionData.phases.selfCheck.hintsViewed.length === 0 &&
        cercComplete) {
      bonuses.push({ name: "🏛️ THE ARCHITECT - Flawless Unassisted!", amount: 25 });
      xp += 25;
    }

    return { base: 30, bonuses, total: xp };
  };

  const completeReflection = async () => {
    const updatedPhases = { ...sessionData.phases };
    updatedPhases.reflection = {
      learnings: reflectionChecks,
      customNote: customReflection,
      timestamp: Date.now()
    };

    const finalSessionData = { ...sessionData, phases: updatedPhases };
    setSessionData(finalSessionData);
    setCurrentPhase("complete");
    setShowXPModal(true);

    try {
      const dataService = await getDataService();
      const xp = calculateXP();

      const userId = "ananya-001";

      await dataService.saveProblemAttempt({
        studentId: userId,
        problemId: problemId,
        weekNumber: 3, // Week 3
        attemptNumber: 0,
        cercResponse: finalSessionData.cercResponses,
        sessionData: {
          startTime: finalSessionData.startTime,
          endTime: Date.now(),
          timeSpentSeconds: elapsedSeconds,
          phases: {
            understand: finalSessionData.phases.understand,
            solve: finalSessionData.phases.solve,
            justify: finalSessionData.phases.justify,
            selfCheck: {
              completed: finalSessionData.phases.selfCheck.completed || false,
              timestamp: finalSessionData.phases.selfCheck.timestamp,
              hintsViewed: finalSessionData.phases.selfCheck.hintsViewed,
              solutionViewed: finalSessionData.phases.selfCheck.solutionViewed,
              revised: finalSessionData.phases.selfCheck.revised,
            },
            reflection: {
              completed: true,
              timestamp: Date.now(),
              learnings: reflectionChecks,
              customNote: customReflection,
            },
          },
        },
        xpEarned: xp.total,
        xpBreakdown: xp,
      });

      console.log("[Week 3 Problem Solver] Successfully saved attempt to database");
    } catch (error) {
      console.error("[Week 3 Problem Solver] Failed to save attempt:", error);
    }
  };

  const xpBreakdown = calculateXP();

  const phaseConfig = [
    { key: "understand", label: "Understand", icon: BookOpen },
    { key: "solve", label: "Solve", icon: PenTool },
    { key: "justify", label: "Justify", icon: FileText },
    { key: "selfCheck", label: "Self-Check", icon: Eye },
    { key: "reflection", label: "Reflect", icon: CheckCircle }
  ];

  const getPhaseIndex = (phase: Phase) => phaseConfig.findIndex(p => p.key === phase);
  const currentPhaseIndex = getPhaseIndex(currentPhase);

  if (!problem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Problem Not Found</h1>
          <p className="text-primary-300 mb-6">The problem ID "{problemId}" doesn't exist.</p>
          <Link href="/student/week/3/problems">
            <ShimmerButton>← Back to Problems</ShimmerButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
      {/* Navigation Bar */}
      <div className="border-b border-primary-600/30 bg-primary-900/60 backdrop-blur-sm">
        <div className="max-w-full px-6 py-4 flex items-center justify-between">
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/student" },
              { label: "Week 3", href: "/student/week/3" },
              { label: "Problems", href: "/student/week/3/problems" },
              { label: problem.title }
            ]}
          />
          <Link
            href="/student/week/3/problems"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Problems
          </Link>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* LEFT SIDEBAR - Problem Context */}
        <div className="w-2/5 border-r border-primary-600/30 bg-primary-900/40 backdrop-blur-sm p-8 overflow-y-auto">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-accent-400" />
              <span className="text-sm text-primary-300">Week 3 - Global Argumentation</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{problem.title}</h1>
            <div className="flex flex-wrap gap-2 mt-3">
              {problem.concepts.map((concept, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-lg text-xs font-semibold bg-secondary-500/20 text-secondary-300 border border-secondary-500/30"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6 p-5 bg-primary-800/60 rounded-xl border border-primary-600/30">
            <h3 className="font-bold text-accent-300 mb-3">The Problem</h3>
            <div className="text-primary-200 leading-relaxed">
              <MathContent content={problem.statement} />
            </div>
          </div>

          <div className="mb-6">
            <button
              onClick={() => setShowTheorem(!showTheorem)}
              className="w-full flex items-center justify-between p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl hover:bg-purple-500/20 transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span className="font-semibold text-purple-300">{problem.theoremInfo.name}</span>
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
                    <p className="text-sm text-primary-200 mb-4 leading-relaxed">
                      {problem.theoremInfo.statement}
                    </p>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-purple-300 uppercase">Conditions:</p>
                      {problem.theoremInfo.hypotheses.map((hypothesis, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-primary-200">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{hypothesis}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-primary-300">
                {currentPhase === "complete" ? "Session Complete" : `Phase: ${phaseConfig[currentPhaseIndex]?.label}`}
              </span>
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
                  {sessionData.phases[phase.key as keyof typeof sessionData.phases].completed ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : index === currentPhaseIndex ? (
                    <div className="w-4 h-4 rounded-full border-2 border-accent-400 animate-pulse" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-primary-600" />
                  )}
                  <span className={`text-sm ${
                    sessionData.phases[phase.key as keyof typeof sessionData.phases].completed
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

          <div className="p-4 bg-accent-500/10 border border-accent-500/30 rounded-xl">
            <div className="flex items-start gap-2">
              <Zap className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-accent-300 font-semibold mb-1">🏛️ Week 3: Blank Canvas</p>
                <p className="text-xs text-accent-200">
                  No scaffolding. You write the complete argument yourself. This is AP exam level.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT WORKSPACE */}
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
                    <p className="text-primary-300">Read the entire problem - all parts</p>
                  </div>
                </div>

                <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <h3 className="font-bold text-blue-300 mb-3">Before you begin:</h3>
                  <ul className="space-y-2 text-primary-200">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Read ALL parts of the problem, not just part (a). Understand the big picture.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Identify which multiple concepts are being integrated (look at the tags on the left)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Week 3 has NO scaffolding - you'll write complete arguments yourself</span>
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
                    <h2 className="text-3xl font-bold">Phase 2: Solve on Paper</h2>
                    <p className="text-primary-300">Tackle the multi-concept synthesis</p>
                  </div>
                </div>

                <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                  <h3 className="font-bold text-purple-300 mb-3">Week 3 Approach:</h3>
                  <ol className="space-y-3 text-sm text-purple-200">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-500/20 text-accent-300 flex items-center justify-center text-xs font-bold">1</span>
                      <span>For EACH part (a), (b), (c), (d): identify the action verb (Justify, Interpret, Explain, Find)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-500/20 text-accent-300 flex items-center justify-center text-xs font-bold">2</span>
                      <span>Work through calculations on paper, checking theorem conditions as needed</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-500/20 text-accent-300 flex items-center justify-center text-xs font-bold">3</span>
                      <span>Think about how parts connect - Week 3 problems build across multiple parts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-500/20 text-accent-300 flex items-center justify-center text-xs font-bold">4</span>
                      <span>Include context and units in your answers - communication precision matters</span>
                    </li>
                  </ol>
                </div>

                <ShimmerButton onClick={() => completePhase("solve")} className="w-full py-4 text-lg">
                  Done with paper work →
                </ShimmerButton>
              </motion.div>
            )}

            {/* PHASE 3: JUSTIFY (CERC - NO SCAFFOLDING) */}
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
                    <p className="text-primary-300">Write your complete mathematical argument</p>
                  </div>
                </div>

                {/* Week 3 Warning: No Scaffolding */}
                <div className="p-4 bg-accent-500/10 border border-accent-500/30 rounded-xl text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-accent-400" />
                    <p className="font-semibold text-accent-300">Week 3: Blank Canvas</p>
                  </div>
                  <p className="text-primary-200 text-xs">
                    You see only CERC headers below. No sentence frames, no structural outlines.
                    Write your complete argument from scratch - just like the AP exam.
                  </p>
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
                      rows={3}
                      placeholder="Write your complete claim here..."
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
                      rows={5}
                      placeholder="Show all calculations and mathematical work..."
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
                      rows={4}
                      placeholder="Explain how your evidence supports your claim using theorems..."
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
                      rows={4}
                      placeholder="Verify all theorem conditions with mathematical justification..."
                    />
                  </div>
                </div>

                <ShimmerButton onClick={() => completePhase("justify")} className="w-full py-4 text-lg">
                  Submit for self-check →
                </ShimmerButton>
              </motion.div>
            )}

            {/* PHASE 4: SELF-CHECK (same as Week 2) */}
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
                    <p className="text-primary-300">Compare your work with hints and solution</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Your Work */}
                  <div>
                    <h3 className="font-bold text-accent-300 mb-4">Your CERC Response</h3>
                    <div className="space-y-3">
                      {[
                        { key: "claim", label: "C", title: "Claim" },
                        { key: "evidence", label: "E", title: "Evidence" },
                        { key: "reasoning", label: "R", title: "Reasoning" },
                        { key: "conditions", label: "C", title: "Conditions" }
                      ].map(field => (
                        <div key={field.key} className="p-3 bg-primary-800/60 rounded-lg border border-primary-600/30">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded bg-accent-500/20 text-accent-300 font-bold text-xs">
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

                    {/* 3-Level Hints */}
                    <div className="space-y-3 mb-4">
                      {([1, 2, 3] as const).map((level) => (
                        <div key={level}>
                          {sessionData.phases.selfCheck.hintsViewed.includes(level) ? (
                            <div className="p-3 bg-secondary-500/10 border border-secondary-500/30 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="w-4 h-4 text-secondary-400" />
                                <span className="text-xs font-semibold text-secondary-300">Hint Level {level}</span>
                              </div>
                              <p className="text-sm text-primary-200">{problem.hints[`level${level}` as keyof typeof problem.hints]}</p>
                            </div>
                          ) : (
                            <button
                              onClick={() => viewHint(level)}
                              className="w-full p-3 bg-primary-800/40 border border-primary-600/20 rounded-lg hover:bg-secondary-500/10 hover:border-secondary-500/30 transition-colors flex items-center gap-2"
                            >
                              <Lock className="w-4 h-4 text-primary-500" />
                              <span className="text-sm text-primary-400">View Hint Level {level}</span>
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
                        <div className="space-y-2">
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
                                {problem.correctCERCResponse[field.key as keyof typeof problem.correctCERCResponse]}
                              </p>
                            </div>
                          ))}
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
                    <p className="text-primary-300">What did you learn from this synthesis problem?</p>
                  </div>
                </div>

                <div className="p-6 bg-pink-500/10 border border-pink-500/30 rounded-xl">
                  <h3 className="font-bold text-pink-300 mb-4">Key Learnings (select all that apply):</h3>
                  <div className="space-y-3">
                    {[
                      "I successfully synthesized multiple concepts",
                      "I included context and units in my interpretations",
                      "I used precise non-deterministic language (Statistics)",
                      "I wrote a complete argument without scaffolding",
                      "I addressed causation/study design questions thoughtfully"
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
                    placeholder="How did this multi-concept problem challenge you? What will you remember for the AP exam?"
                  />
                </div>

                <ShimmerButton onClick={completeReflection} className="w-full py-4 text-lg">
                  <Trophy className="w-5 h-5 mr-2" />
                  Complete Problem
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
                <h2 className="text-3xl font-bold mb-2">Problem Complete!</h2>
                <p className="text-primary-300">XP Breakdown</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-primary-800/60 rounded-lg">
                  <span className="text-primary-200">Base XP (Week 3)</span>
                  <span className="font-bold text-white">+{xpBreakdown.base}</span>
                </div>
                <div className="text-xs text-primary-400 text-center -mt-2">
                  Time: {formatTime(elapsedSeconds)}
                </div>

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

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-accent-900/40 to-secondary-900/40 rounded-lg border-2 border-accent-500/50 mt-4">
                  <span className="text-xl font-bold">Total XP</span>
                  <span className="text-3xl font-bold text-accent-400">
                    +{xpBreakdown.total}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = "/student/week/3/problems"}
                  className="w-full py-4 bg-gradient-to-r from-accent-500 to-secondary-500 hover:from-accent-600 hover:to-secondary-600 rounded-xl font-bold text-lg transition-all"
                >
                  Back to Problems
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
