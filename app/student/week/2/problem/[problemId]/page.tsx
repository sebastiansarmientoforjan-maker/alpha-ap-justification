/**
 * Dynamic Week 2 Problem Solver
 * Uses 5-phase workflow: Understand → Solve → Justify → Self-Check → Reflection
 * Week 2 change: Structural outline instead of full sentence frames
 */
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Lightbulb, Lock, Clock, Award, Trophy, ChevronDown, ChevronUp,
  FileText, PenTool, CheckCircle, Eye, BookOpen, AlertCircle, ArrowLeft
} from "lucide-react";
import ShimmerButton from "@/components/ui/shimmer-button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { week2Problems } from "@/data/week-2-content";
import { MathContent } from "@/components/student/math-content";
import { getDataService } from "@/services/data";
import { redirectToInstructions } from "@/lib/utils/activity-instructions";
import { sanitizeInput } from "@/lib/utils/input-sanitizer";

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

export default function Week2ProblemSolver() {
  const params = useParams();
  const problemId = params.problemId as string;

  const problem = week2Problems.find((p) => p.id === problemId);

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
  const [selfEvaluationComplete, setSelfEvaluationComplete] = useState(false);
  const [selfEvaluationChecks, setSelfEvaluationChecks] = useState<string[]>([]);
  const [reflectionChecks, setReflectionChecks] = useState<string[]>([]);
  const [customReflection, setCustomReflection] = useState("");
  const [showXPModal, setShowXPModal] = useState(false);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Redirect to instructions if not completed
  useEffect(() => {
    redirectToInstructions(problemId, `/student/week/2/problem/${problemId}`);
  }, [problemId]);

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

  const handleCERCChange = (field: keyof typeof sessionData.cercResponses, value: string) => {
    const sanitized = sanitizeInput(value);
    setSessionData({
      ...sessionData,
      cercResponses: {
        ...sessionData.cercResponses,
        [field]: sanitized
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
    let xp = 25; // Base XP for Week 2 problems (higher than Week 1)
    const bonuses: { name: string; amount: number }[] = [];

    const cercComplete = Object.values(sessionData.cercResponses).every(v => v.trim().length > 30);
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
      bonuses.push({ name: "Solved Independently", amount: 15 });
      xp += 15;
    }

    if (sessionData.phases.selfCheck.hintsViewed.length === 0) {
      bonuses.push({ name: "No Hints Used", amount: 10 });
      xp += 10;
    }

    if (customReflection.trim().length > 20) {
      bonuses.push({ name: "Personalized Reflection", amount: 5 });
      xp += 5;
    }

    // Week 2 specific bonus: Rigorous verification
    if (
      sessionData.cercResponses.conditions.toLowerCase().includes("polynomial") ||
      sessionData.cercResponses.conditions.toLowerCase().includes("continuous everywhere") ||
      sessionData.cercResponses.conditions.toLowerCase().includes("differentiable everywhere") ||
      (sessionData.cercResponses.conditions.match(/≥/g) || []).length >= 2 // Statistics: checking multiple conditions
    ) {
      bonuses.push({ name: "✅ Rigorous Condition Verification!", amount: 20 });
      xp += 20;
    }

    return { base: 25, bonuses, total: xp };
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
        weekNumber: 2, // Week 2
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

      console.log("[Week 2 Problem Solver] Successfully saved attempt to database");
    } catch (error) {
      console.error("[Week 2 Problem Solver] Failed to save attempt:", error);
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
          <Link href="/student/week/2/problems">
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
              { label: "Week 2", href: "/student/week/2" },
              { label: "Problems", href: "/student/week/2/problems" },
              { label: problem.title }
            ]}
          />
          <Link
            href="/student/week/2/problems"
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
              <span className="text-sm text-primary-300">Week 2 - Condition Verification</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{problem.title}</h1>
            <div className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-accent-500/20 text-accent-300 border border-accent-500/30">
              {problem.errorCategory.replace(/_/g, " ")}
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
              <AlertCircle className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-accent-300 font-semibold mb-1">✅ Week 2 Challenge</p>
                <p className="text-xs text-accent-200">
                  This problem IS valid for the theorem - but you must PROVE it with mathematical rigor.
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
                    <p className="text-primary-300">Read carefully and identify what's being asked</p>
                  </div>
                </div>

                <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <h3 className="font-bold text-blue-300 mb-3">Before you begin:</h3>
                  <ul className="space-y-2 text-primary-200">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Read the problem statement and identify which theorem/procedure is needed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Review ALL conditions required (click to expand on the left)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Remember: The theorem applies, but you must PROVE every condition mathematically</span>
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
                    <p className="text-primary-300">Work through the mathematics by hand</p>
                  </div>
                </div>

                <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                  <h3 className="font-bold text-purple-300 mb-3">Week 2 Workflow:</h3>
                  <ol className="space-y-3 text-sm text-purple-200">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-500/20 text-accent-300 flex items-center justify-center text-xs font-bold">1</span>
                      <span>List ALL theorem conditions (don't skip any)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-500/20 text-accent-300 flex items-center justify-center text-xs font-bold">2</span>
                      <span>For EACH condition, write mathematical justification (e.g., "f is a polynomial, so...")</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-500/20 text-accent-300 flex items-center justify-center text-xs font-bold">3</span>
                      <span>Once all conditions are verified, proceed with calculations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-500/20 text-accent-300 flex items-center justify-center text-xs font-bold">4</span>
                      <span>State your conclusion clearly</span>
                    </li>
                  </ol>
                </div>

                <div className="p-6 bg-accent-500/10 border border-accent-500/30 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-accent-300 mb-2">Remember:</h4>
                      <p className="text-sm text-accent-200 leading-relaxed">
                        "It's a polynomial so it's continuous" is NOT enough. You must state WHY polynomials are continuous
                        (general principle) and THEREFORE this specific function satisfies the condition.
                      </p>
                    </div>
                  </div>
                </div>

                <ShimmerButton onClick={() => completePhase("solve")} className="w-full py-4 text-lg">
                  Done with paper work →
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

                {/* Structural Outline Helper (Week 2 - reduced scaffolding) */}
                <div className="p-4 bg-secondary-500/10 border border-secondary-500/30 rounded-xl text-sm">
                  <p className="font-semibold text-secondary-300 mb-2">📐 Structural Outline (Week 2 - Less Scaffolding):</p>
                  <div className="space-y-1 text-primary-200 text-xs">
                    <p><span className="font-bold text-accent-400">Claim:</span> {problem.structuralOutline.claim}</p>
                    <p><span className="font-bold text-blue-400">Evidence:</span> {problem.structuralOutline.evidence}</p>
                    <p><span className="font-bold text-purple-400">Reasoning:</span> {problem.structuralOutline.reasoning}</p>
                    <p><span className="font-bold text-green-400">Conditions:</span> {problem.structuralOutline.conditions}</p>
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
                      onChange={(e) => handleCERCChange('claim', e.target.value)}
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
                      onChange={(e) => handleCERCChange('evidence', e.target.value)}
                      className="w-full bg-primary-800/60 border border-primary-600/30 rounded-xl p-4 text-white placeholder-primary-400 focus:border-accent-500 focus:outline-none resize-none"
                      rows={4}
                      placeholder="Show all calculations..."
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
                      onChange={(e) => handleCERCChange('reasoning', e.target.value)}
                      className="w-full bg-primary-800/60 border border-primary-600/30 rounded-xl p-4 text-white placeholder-primary-400 focus:border-accent-500 focus:outline-none resize-none"
                      rows={3}
                      placeholder="Cite the theorem and explain how it applies..."
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
                      onChange={(e) => handleCERCChange('conditions', e.target.value)}
                      className="w-full bg-primary-800/60 border border-primary-600/30 rounded-xl p-4 text-white placeholder-primary-400 focus:border-accent-500 focus:outline-none resize-none"
                      rows={4}
                      placeholder="Verify each hypothesis with mathematical justification..."
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
                    <p className="text-primary-300">Evaluate your work, then compare with the model solution</p>
                  </div>
                </div>

                {/* Step 1: Intro to Self-Evaluation */}
                {!selfEvaluationComplete && !showSolution ? (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <CheckCircle className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-3xl font-bold text-blue-300 mb-2">Self-Evaluation Process</h3>
                      <p className="text-blue-400 mb-6">Learn to assess your mathematical justifications</p>
                    </div>

                    <div className="p-6 bg-blue-500/10 border-2 border-blue-500/30 rounded-xl">
                      <h4 className="font-bold text-blue-300 mb-3 text-lg">📝 What You'll Do:</h4>
                      <ul className="space-y-3 text-primary-200 text-sm">
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
                          <span><strong className="text-blue-200">Review your CERC response</strong> — Read what you wrote for each component</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-xs font-bold">2</span>
                          <span><strong className="text-blue-200">Apply the AP rubric</strong> — Check which rubric points you think you earned (be honest!)</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-xs font-bold">3</span>
                          <span><strong className="text-blue-200">Compare with model solution</strong> — See the AP Exam quality answer and learn from differences</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                      <p className="text-sm text-yellow-300">
                        <strong>💡 Why this matters:</strong> On the AP Exam, YOU are your own quality checker. Learning to self-evaluate helps you catch errors before submitting.
                      </p>
                    </div>

                    <button
                      onClick={() => setSelfEvaluationComplete(true)}
                      className="w-full p-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-4 border-blue-500/60 rounded-3xl hover:from-blue-500/30 hover:to-purple-500/30 transition-all shadow-2xl shadow-blue-500/30 group"
                    >
                      <span className="block text-3xl font-bold text-blue-300 mb-3 group-hover:scale-105 transition-transform">Begin Self-Evaluation →</span>
                      <span className="block text-base text-blue-400">Review your response with the AP rubric</span>
                    </button>
                  </motion.div>
                ) : !showSolution && selfEvaluationComplete ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <CheckCircle className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                      <h3 className="text-2xl font-bold text-blue-300 mb-2">Step 1: Review Your Work</h3>
                      <p className="text-sm text-blue-400">Read your response and check it against the AP rubric</p>
                    </div>

                    {/* Your CERC Response - Full Display */}
                    <div className="p-6 bg-primary-800/40 rounded-xl border border-primary-600/30">
                      <h4 className="font-bold text-primary-200 mb-4 text-lg">📝 Your CERC Response:</h4>
                      <div className="space-y-4">
                        {[
                          { key: "claim", label: "C", title: "Claim", color: "from-accent-500 to-accent-600" },
                          { key: "evidence", label: "E", title: "Evidence", color: "from-blue-500 to-blue-600" },
                          { key: "reasoning", label: "R", title: "Reasoning", color: "from-purple-500 to-purple-600" },
                          { key: "conditions", label: "C", title: "Conditions", color: "from-green-500 to-green-600" }
                        ].map(field => (
                          <div key={field.key} className="p-4 bg-primary-900/40 rounded-lg border border-primary-600/20">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${field.color} flex items-center justify-center shadow-lg`}>
                                <span className="text-sm font-bold">{field.label}</span>
                              </div>
                              <span className="text-sm font-bold text-primary-300">{field.title}</span>
                            </div>
                            <p className="text-sm text-primary-100 ml-10 leading-relaxed whitespace-pre-wrap">
                              {sessionData.cercResponses[field.key as keyof typeof sessionData.cercResponses] || "(empty)"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AP Rubric Self-Evaluation */}
                    <div className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/40 rounded-xl">
                      <h4 className="font-bold text-yellow-300 mb-4 flex items-center gap-2">
                        <span className="text-2xl">📋</span>
                        AP Exam Rubric - Check what you earned:
                      </h4>
                      <div className="space-y-3">
                        {[
                          { id: 1, text: "✓ Correct conclusion/claim stated clearly", points: "1 point" },
                          { id: 2, text: "✓ Evidence: Calculations shown with correct setup", points: "1 point" },
                          { id: 3, text: "✓ Reasoning: Theorem cited and connected to evidence", points: "1 point" },
                          { id: 4, text: "✓ Conditions: ALL hypotheses verified with mathematical justification", points: "1 point" }
                        ].map((criterion) => (
                          <label
                            key={criterion.id}
                            className="flex items-start gap-3 p-4 bg-primary-800/60 rounded-lg cursor-pointer hover:bg-primary-800/80 transition-colors border border-yellow-500/20"
                          >
                            <input
                              type="checkbox"
                              checked={selfEvaluationChecks.includes(criterion.text)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelfEvaluationChecks([...selfEvaluationChecks, criterion.text]);
                                } else {
                                  setSelfEvaluationChecks(selfEvaluationChecks.filter(c => c !== criterion.text));
                                }
                              }}
                              className="mt-1 w-5 h-5"
                            />
                            <div className="flex-1">
                              <p className="text-primary-100 font-medium">{criterion.text}</p>
                              <p className="text-xs text-yellow-400 mt-1">{criterion.points}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                      <div className="mt-4 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                        <p className="text-sm text-yellow-300">
                          <strong>Your self-assessment:</strong> {selfEvaluationChecks.length}/4 points
                        </p>
                        <p className="text-xs text-yellow-400 mt-1">
                          Now compare with the model solution to see how you did!
                        </p>
                      </div>
                    </div>

                    {/* Hints Section - Available BEFORE viewing solution */}
                    <div className="p-6 bg-secondary-500/10 border border-secondary-500/30 rounded-xl">
                      <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-secondary-300" />
                        <h4 className="font-bold text-secondary-300 text-base">Need Help? Use Hints</h4>
                      </div>
                      <p className="text-sm text-primary-300 mb-4">
                        If your self-assessment shows missing points, these hints can help you improve <strong>before</strong> viewing the model solution:
                      </p>
                      <div className="space-y-3">
                        {([1, 2, 3] as const).map((level) => (
                          <div key={level}>
                            {sessionData.phases.selfCheck.hintsViewed.includes(level) ? (
                              <div className="p-4 bg-secondary-500/10 border border-secondary-500/30 rounded-lg">
                                <span className="font-bold text-secondary-300">💡 Hint {level}: </span>
                                <span className="text-primary-200">{problem.hints[`level${level}` as keyof typeof problem.hints]}</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => viewHint(level)}
                                className="w-full p-4 bg-primary-800/40 border border-primary-600/30 rounded-lg hover:bg-secondary-500/10 hover:border-secondary-500/30 transition-colors text-left group"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-primary-200 group-hover:text-secondary-300">
                                    <Lock className="w-4 h-4 inline mr-2" />
                                    Hint {level} - Click to reveal
                                  </span>
                                  <span className="text-xs text-primary-400">No penalty for using hints</span>
                                </div>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-xs text-blue-300">
                          ⚡ <strong>Tip:</strong> Try to identify what's missing first, then use hints strategically. You can also revise your CERC before viewing the solution.
                        </p>
                      </div>
                    </div>

                    {/* Revise Option */}
                    <div className="flex justify-center">
                      <button
                        onClick={reviseResponse}
                        className="px-6 py-3 bg-secondary-500/20 hover:bg-secondary-500/30 border border-secondary-500/40 rounded-lg text-secondary-300 transition-colors text-sm font-medium"
                      >
                        ← Revise Your CERC Before Viewing Solution
                      </button>
                    </div>

                    <button
                      onClick={viewSolution}
                      className="w-full p-10 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-4 border-yellow-500/60 rounded-3xl hover:from-yellow-500/30 hover:to-orange-500/30 transition-all shadow-2xl shadow-yellow-500/30 group"
                    >
                      <span className="block text-3xl font-bold text-yellow-300 mb-3 group-hover:scale-105 transition-transform">View Model Solution →</span>
                      <span className="block text-base text-yellow-400">Compare with the AP Exam quality answer</span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-yellow-300 mb-2">📖 Model Solution</h3>
                      <p className="text-sm text-yellow-400">AP Exam Quality • Full Justification</p>
                    </div>

                    {/* CLAIM */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="p-6 bg-gradient-to-br from-accent-500/10 to-accent-600/10 border-2 border-accent-500/50 rounded-2xl"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-lg">
                          <span className="text-xl font-bold">C</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-accent-300">Claim</h4>
                          <p className="text-xs text-accent-400">Your conclusion statement</p>
                        </div>
                      </div>
                      <div className="pl-13 text-primary-100 leading-relaxed">
                        <MathContent content={problem.correctCERCResponse.claim} />
                      </div>
                    </motion.div>

                    {/* EVIDENCE */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-2 border-blue-500/50 rounded-2xl"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                          <span className="text-xl font-bold">E</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-blue-300">Evidence</h4>
                          <p className="text-xs text-blue-400">Mathematical calculations & data</p>
                        </div>
                      </div>
                      <div className="pl-13 text-primary-100 leading-relaxed">
                        <MathContent content={problem.correctCERCResponse.evidence} />
                      </div>
                    </motion.div>

                    {/* REASONING */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-2 border-purple-500/50 rounded-2xl"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                          <span className="text-xl font-bold">R</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-purple-300">Reasoning</h4>
                          <p className="text-xs text-purple-400">Theorem connection & logic</p>
                        </div>
                      </div>
                      <div className="pl-13 text-primary-100 leading-relaxed">
                        <MathContent content={problem.correctCERCResponse.reasoning} />
                      </div>
                    </motion.div>

                    {/* CONDITIONS */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 border-2 border-green-500/50 rounded-2xl"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                          <span className="text-xl font-bold">C</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-green-300">Conditions</h4>
                          <p className="text-xs text-green-400">Hypothesis verification</p>
                        </div>
                      </div>
                      <div className="pl-13 text-primary-100 leading-relaxed">
                        <MathContent content={problem.correctCERCResponse.conditions} />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center"
                    >
                      <p className="text-sm text-green-300">
                        ✅ This solution earns <strong className="text-green-200">full credit</strong> on the AP exam
                      </p>
                    </motion.div>
                  </motion.div>
                )}

                {/* Bottom Actions */}
                {showSolution && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-6"
                  >
                    {/* Comparison Callout */}
                    <div className="p-5 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                      <h4 className="font-bold text-blue-300 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Step 2: Compare with the Model
                      </h4>
                      <p className="text-sm text-primary-300">
                        Review how the model solution addresses each CERC component. Notice the level of detail, mathematical rigor, and explicit condition checking.
                      </p>
                    </div>

                    {/* Main CTA */}
                    <ShimmerButton
                      onClick={() => completePhase("selfCheck")}
                      className="w-full px-6 py-6 text-lg"
                    >
                      Continue to Reflection →
                    </ShimmerButton>
                  </motion.div>
                )}
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
                      "✅ I verified ALL conditions with mathematical justification (not just assertion)",
                      "✅ I successfully used general principles (e.g., 'polynomials are continuous everywhere')",
                      "✅ I checked conditions rigorously BEFORE applying the theorem",
                      "⚠️ I initially stated a condition but didn't justify WHY it holds",
                      "⚠️ I need to practice showing more explicit calculations"
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
                  <label className="block font-semibold mb-3 text-lg">
                    Personal Reflection <span className="text-red-400">*required</span>
                  </label>

                  <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <p className="text-sm font-semibold text-blue-300 mb-3">💭 Guided Prompts (answer 2-3):</p>
                    <ul className="space-y-2 text-sm text-primary-200">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>What specific mistake did you make (or almost make)?</strong> — Be specific about the condition you missed or the reasoning flaw.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>Which condition did you verify incompletely?</strong> — Explain what additional detail or proof was needed.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>What will you do differently on the AP exam?</strong> — A concrete action you'll take (e.g., "I will write out all condition checks explicitly").</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>How did the model solution differ from yours?</strong> — What level of detail or explicitness was missing?</span>
                      </li>
                    </ul>
                  </div>

                  <textarea
                    value={customReflection}
                    onChange={(e) => setCustomReflection(e.target.value)}
                    className="w-full bg-primary-800/60 border border-primary-600/30 rounded-xl p-4 text-white placeholder-primary-400 focus:border-accent-500 focus:outline-none resize-none"
                    rows={6}
                    placeholder="Choose 2-3 prompts above and write your reflection. Be specific and honest about what you learned."
                  />
                  {customReflection.trim().length < 20 && (
                    <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Please write at least 20 characters (a few sentences) reflecting on your learning.
                    </p>
                  )}
                  <p className="text-xs text-primary-400 mt-2">
                    {customReflection.trim().length} / 20 characters minimum
                  </p>
                </div>

                <ShimmerButton
                  onClick={completeReflection}
                  disabled={customReflection.trim().length < 20}
                  className="w-full py-4 text-lg"
                >
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
                  <span className="text-primary-200">Base XP (Week 2)</span>
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
                  onClick={() => window.location.href = "/student/week/2/problems"}
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
