/**
 * Dynamic Week 3 Problem Solver
 * Uses 5-phase workflow: Understand → Solve → Justify → Self-Check → Reflection
 */
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Lightbulb, Lock, Clock, Award, Trophy, ChevronDown, ChevronUp,
  FileText, PenTool, CheckCircle, Eye, BookOpen, AlertCircle, ArrowLeft
} from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import ShimmerButton from "@/components/ui/shimmer-button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { week3Problems } from "@/data/week-3-content";
import { MathContent } from "@/components/student/math-content";
import { getDataService } from "@/services/data";
import { redirectToInstructions } from "@/lib/utils/activity-instructions";
import { sanitizeInput } from "@/lib/utils/input-sanitizer";

type Phase = "understand" | "solve" | "justify" | "modelComparison" | "selfAssessment" | "reflection" | "complete";

interface SessionData {
  startTime: number;
  phases: {
    understand: { completed: boolean; timestamp?: number };
    solve: { completed: boolean; workLocation?: "paper" | "whiteboard" | "scratchpad"; timestamp?: number };
    justify: { completed: boolean; timestamp?: number };
    modelComparison: { completed?: boolean; timestamp?: number };
    selfAssessment: { completed?: boolean; rubricChecks: string[]; timestamp?: number };
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

  // Find the problem
  const problem = week3Problems.find((p) => p.id === problemId);

  const [currentPhase, setCurrentPhase] = useState<Phase>("understand");
  const [sessionData, setSessionData] = useState<SessionData>({
    startTime: Date.now(),
    phases: {
      understand: { completed: false },
      solve: { completed: false },
      justify: { completed: false },
      modelComparison: { completed: false },
      selfAssessment: { completed: false, rubricChecks: [] },
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
  const [reflectionChecks, setReflectionChecks] = useState<string[]>([]);
  const [customReflection, setCustomReflection] = useState("");
  const [showXPModal, setShowXPModal] = useState(false);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // 🔒 SECURITY: Verify instructions completed before allowing access
  useEffect(() => {
    redirectToInstructions(problemId, `/student/week/3/problem/${problemId}`);
  }, [problemId]);

  // Timer for session duration
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
        setCurrentPhase("modelComparison");
        break;
      case "modelComparison":
        updatedPhases.modelComparison = { completed: true, timestamp: Date.now() };
        setCurrentPhase("selfAssessment");
        break;
      case "selfAssessment":
        updatedPhases.selfAssessment = {
          completed: true,
          rubricChecks: sessionData.phases.selfAssessment?.rubricChecks || [],
          timestamp: Date.now()
        };
        setCurrentPhase("reflection");
        break;
    }

    setSessionData({ ...sessionData, phases: updatedPhases });
  };


  // Handle CERC input changes with sanitization
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

  // Character limits for CERC fields
  const CHAR_LIMITS = {
    claim: 500,
    evidence: 2000,
    reasoning: 1000,
    conditions: 1500
  };

  // Check if all CERC fields meet minimum requirements
  const allFieldsFilled = Object.values(sessionData.cercResponses)
    .every(v => v.trim().length >= 20);

  const calculateXP = () => {
    let xp = 50; // Base XP for Week 3 problems (blank canvas - harder)
    const bonuses: { name: string; amount: number }[] = [];

    const cercComplete = Object.values(sessionData.cercResponses).every(v => v.trim().length > 20);
    if (cercComplete) {
      bonuses.push({ name: "Complete CERC Response", amount: 10 });
      xp += 10;
    }

    if (reflectionChecks.length > 0) {
      bonuses.push({ name: "Self-Identified Learning", amount: 5 });
      xp += 5;
    }

    if (customReflection.trim().length > 20) {
      bonuses.push({ name: "Personalized Reflection", amount: 5 });
      xp += 5;
    }

    // Special bonus: "The Architect" - unassisted complete CERC proof (Week 3)
    if (cercComplete && sessionData.cercResponses.claim.length > 50 &&
        sessionData.cercResponses.evidence.length > 100 &&
        sessionData.cercResponses.reasoning.length > 50 &&
        sessionData.cercResponses.conditions.length > 50) {
      bonuses.push({ name: "🏛️ The Architect", amount: 100 });
      xp += 100;
    }

    return { base: 50, bonuses, total: xp };
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

    // Save to database
    try {
      const dataService = await getDataService();
      const xp = calculateXP();

      // TODO: Get actual userId from auth - using mock for now
      const userId = "ananya-001"; // Mock student ID

      await dataService.saveProblemAttempt({
        studentId: userId,
        problemId: problemId,
        weekNumber: 3,
        attemptNumber: 0, // Will be calculated by adapter
        cercResponse: finalSessionData.cercResponses,
        sessionData: {
          startTime: finalSessionData.startTime,
          endTime: Date.now(),
          timeSpentSeconds: elapsedSeconds,
          phases: {
            understand: finalSessionData.phases.understand,
            solve: finalSessionData.phases.solve,
            justify: finalSessionData.phases.justify,
            modelComparison: finalSessionData.phases.modelComparison,
            selfAssessment: finalSessionData.phases.selfAssessment,
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
      // Don't block the UI - just log the error
    }
  };

  const xpBreakdown = calculateXP();

  const phaseConfig = [
    { key: "understand", label: "Understand", icon: BookOpen },
    { key: "solve", label: "Solve", icon: PenTool },
    { key: "justify", label: "Justify", icon: FileText },
    { key: "modelComparison", label: "Compare Model", icon: Eye },
    { key: "selfAssessment", label: "Self-Assess", icon: Target },
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
              { label: "Week 1", href: "/student/week/1" },
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
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-accent-400" />
              <span className="text-sm text-primary-300">Week 1 - Error-Forcing Problem</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{problem.title}</h1>
            <div className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
              {problem.errorCategory.replace(/_/g, " ")}
            </div>
          </div>

          {/* Problem Statement */}
          <div className="mb-6 p-5 bg-primary-800/60 rounded-xl border border-primary-600/30">
            <h3 className="font-bold text-accent-300 mb-3">The Problem</h3>
            <div className="text-primary-200 leading-relaxed">
              <MathContent content={problem.statement} />
            </div>
          </div>

          {/* Theorem Reference */}
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

          {/* Phase Progress */}
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

          {/* Trap Warning */}
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-300 font-semibold mb-1">⚠️ Error-Forcing Warning</p>
                <p className="text-xs text-red-200">
                  This problem looks straightforward, but there's a trap. Check ALL theorem conditions before applying!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT WORKSPACE */}
        <div className="w-3/5 p-8 pb-16 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {/* Phase content continues in next part... */}
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
                      <span>Read the problem statement and identify which theorem is mentioned</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Review the theorem conditions (click to expand on the left)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Think: What could go wrong? This is an error-forcing problem!</span>
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
                  <div className="flex items-start gap-3 mb-4">
                    <FileText className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-purple-300 mb-2">Why Paper?</h3>
                      <p className="text-sm text-purple-200 leading-relaxed mb-3">
                        The AP exam requires you to write justifications by hand under timed conditions.
                        Training on paper builds the muscle memory and spatial reasoning you need for exam day.
                      </p>
                      <ul className="space-y-2 text-sm text-purple-200">
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span><strong>Mimics AP conditions:</strong> No calculators, no digital tools—just you, paper, and a pencil</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span><strong>Builds spatial reasoning:</strong> Organizing work on paper improves mathematical thinking</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span><strong>Reduces cognitive load:</strong> Handwriting helps encode mathematical relationships in memory</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-red-300 mb-2">Critical: Check Conditions FIRST</h4>
                      <p className="text-sm text-red-200 leading-relaxed">
                        Before calculating anything, verify ALL theorem hypotheses. This is an error-forcing problem—
                        the trap is designed to catch students who skip condition verification.
                        <span className="font-bold"> Don't fall for it.</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-primary-800/60 rounded-xl border border-primary-600/30">
                  <h4 className="font-semibold text-white mb-3">What to do:</h4>
                  <ol className="space-y-2 text-sm text-primary-200">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-500/20 text-accent-300 flex items-center justify-center text-xs font-bold">1</span>
                      <span>Get paper and pencil. Write down the problem statement.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-500/20 text-accent-300 flex items-center justify-center text-xs font-bold">2</span>
                      <span>List the theorem conditions that need verification (check the theorem info on the left).</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-500/20 text-accent-300 flex items-center justify-center text-xs font-bold">3</span>
                      <span>Check EACH condition explicitly. Does the function satisfy it?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-500/20 text-accent-300 flex items-center justify-center text-xs font-bold">4</span>
                      <span>Only after verifying conditions, proceed with calculations (if applicable).</span>
                    </li>
                  </ol>
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
                    <p className="text-primary-300">Build your mathematical argument step-by-step</p>
                  </div>
                </div>

                {/* Week 3: Blank Canvas - No Scaffolding */}
                <div className="p-5 bg-yellow-500/10 border-l-4 border-yellow-500 rounded-xl">
                  <p className="font-semibold text-yellow-300 mb-2 text-base">⚠️ Week 3: Blank Canvas Mode</p>
                  <p className="text-sm text-primary-200">
                    No scaffolding provided. Write your complete CERC argument from scratch using the empty fields below.
                    This is how the AP exam works - you see the problem, you write the complete mathematical justification.
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
                      onChange={(e) => handleCERCChange('claim', e.target.value)}
                      maxLength={CHAR_LIMITS.claim}
                      className="w-full bg-primary-800/60 border border-primary-600/30 rounded-xl p-4 text-white placeholder-primary-400 focus:border-accent-500 focus:outline-none resize-none"
                      rows={2}
                      placeholder="State your conclusion..."
                    />
                    <p className="text-xs text-primary-400 mt-1 text-right">
                      {sessionData.cercResponses.claim.length} / {CHAR_LIMITS.claim} characters
                    </p>
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
                      maxLength={CHAR_LIMITS.evidence}
                      className="w-full bg-primary-800/60 border border-primary-600/30 rounded-xl p-4 text-white placeholder-primary-400 focus:border-accent-500 focus:outline-none resize-none"
                      rows={3}
                      placeholder="What mathematical data supports your claim?"
                    />
                    <p className="text-xs text-primary-400 mt-1 text-right">
                      {sessionData.cercResponses.evidence.length} / {CHAR_LIMITS.evidence} characters
                    </p>
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
                      maxLength={CHAR_LIMITS.reasoning}
                      className="w-full bg-primary-800/60 border border-primary-600/30 rounded-xl p-4 text-white placeholder-primary-400 focus:border-accent-500 focus:outline-none resize-none"
                      rows={3}
                      placeholder="What theorem or principle connects your evidence to your claim?"
                    />
                    <p className="text-xs text-primary-400 mt-1 text-right">
                      {sessionData.cercResponses.reasoning.length} / {CHAR_LIMITS.reasoning} characters
                    </p>
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
                      maxLength={CHAR_LIMITS.conditions}
                      className="w-full bg-primary-800/60 border border-primary-600/30 rounded-xl p-4 text-white placeholder-primary-400 focus:border-accent-500 focus:outline-none resize-none"
                      rows={3}
                      placeholder="Verify all theorem hypotheses are satisfied..."
                    />
                    <p className="text-xs text-primary-400 mt-1 text-right">
                      {sessionData.cercResponses.conditions.length} / {CHAR_LIMITS.conditions} characters
                    </p>
                  </div>
                </div>

                {!allFieldsFilled && (
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-center">
                    <p className="text-sm text-yellow-300">
                      ⚠️ All CERC fields must have at least 20 characters to submit
                    </p>
                  </div>
                )}

                <ShimmerButton
                  onClick={() => completePhase("justify")}
                  disabled={!allFieldsFilled}
                  className="w-full py-4 text-lg"
                >
                  {allFieldsFilled ? "Submit for self-check →" : "Complete all fields to submit"}
                </ShimmerButton>
              </motion.div>
            )}

            {/* PHASE 4: MODEL COMPARISON */}
            {currentPhase === "modelComparison" && (
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
                    <h2 className="text-3xl font-bold">Phase 4: Compare with Model</h2>
                    <p className="text-primary-300">Review your response alongside the AP Exam quality answer</p>
                  </div>
                </div>

                <div className="p-5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center mb-6">
                  <p className="text-sm text-blue-300">
                    Compare each CERC component side-by-side. Notice the level of detail, mathematical rigor, and explicit condition checking in the model.
                  </p>
                </div>

                {/* Side-by-Side Comparison - Aligned Rows */}
                <div className="space-y-6">
                  {/* Headers */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <h3 className="text-xl font-bold text-primary-200 text-center">📝 Your Response</h3>
                    <h3 className="text-xl font-bold text-yellow-300 text-center">⭐ Model Solution</h3>
                  </div>

                  {/* CLAIM ROW */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Student Claim */}
                    <div className="p-4 bg-primary-800/40 rounded-xl border border-primary-600/30 h-full">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-lg">
                          <span className="text-sm font-bold">C</span>
                        </div>
                        <span className="text-sm font-bold text-primary-300">Claim</span>
                      </div>
                      <p className="text-sm text-primary-100 ml-10 leading-relaxed whitespace-pre-wrap">
                        {sessionData.cercResponses.claim || "(empty)"}
                      </p>
                    </div>
                    {/* Model Claim */}
                    <div className="p-4 bg-gradient-to-br from-accent-500/10 to-accent-600/10 border-2 border-accent-500/50 rounded-xl h-full">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-lg">
                          <span className="text-sm font-bold">C</span>
                        </div>
                        <span className="text-sm font-bold text-accent-300">Claim</span>
                      </div>
                      <div className="text-sm text-primary-100 ml-10 leading-relaxed">
                        <MathContent content={problem.correctCERCResponse.claim} />
                      </div>
                    </div>
                  </div>

                  {/* EVIDENCE ROW */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Student Evidence */}
                    <div className="p-4 bg-primary-800/40 rounded-xl border border-primary-600/30 h-full">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                          <span className="text-sm font-bold">E</span>
                        </div>
                        <span className="text-sm font-bold text-primary-300">Evidence</span>
                      </div>
                      <p className="text-sm text-primary-100 ml-10 leading-relaxed whitespace-pre-wrap">
                        {sessionData.cercResponses.evidence || "(empty)"}
                      </p>
                    </div>
                    {/* Model Evidence */}
                    <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-2 border-blue-500/50 rounded-xl h-full">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                          <span className="text-sm font-bold">E</span>
                        </div>
                        <span className="text-sm font-bold text-blue-300">Evidence</span>
                      </div>
                      <div className="text-sm text-primary-100 ml-10 leading-relaxed">
                        <MathContent content={problem.correctCERCResponse.evidence} />
                      </div>
                    </div>
                  </div>

                  {/* REASONING ROW */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Student Reasoning */}
                    <div className="p-4 bg-primary-800/40 rounded-xl border border-primary-600/30 h-full">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                          <span className="text-sm font-bold">R</span>
                        </div>
                        <span className="text-sm font-bold text-primary-300">Reasoning</span>
                      </div>
                      <p className="text-sm text-primary-100 ml-10 leading-relaxed whitespace-pre-wrap">
                        {sessionData.cercResponses.reasoning || "(empty)"}
                      </p>
                    </div>
                    {/* Model Reasoning */}
                    <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-2 border-purple-500/50 rounded-xl h-full">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                          <span className="text-sm font-bold">R</span>
                        </div>
                        <span className="text-sm font-bold text-purple-300">Reasoning</span>
                      </div>
                      <div className="text-sm text-primary-100 ml-10 leading-relaxed">
                        <MathContent content={problem.correctCERCResponse.reasoning} />
                      </div>
                    </div>
                  </div>

                  {/* CONDITIONS ROW */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Student Conditions */}
                    <div className="p-4 bg-primary-800/40 rounded-xl border border-primary-600/30 h-full">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                          <span className="text-sm font-bold">C</span>
                        </div>
                        <span className="text-sm font-bold text-primary-300">Conditions</span>
                      </div>
                      <p className="text-sm text-primary-100 ml-10 leading-relaxed whitespace-pre-wrap">
                        {sessionData.cercResponses.conditions || "(empty)"}
                      </p>
                    </div>
                    {/* Model Conditions */}
                    <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border-2 border-green-500/50 rounded-xl h-full">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                          <span className="text-sm font-bold">C</span>
                        </div>
                        <span className="text-sm font-bold text-green-300">Conditions</span>
                      </div>
                      <div className="text-sm text-primary-100 ml-10 leading-relaxed">
                        <MathContent content={problem.correctCERCResponse.conditions} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
                  <p className="text-sm text-green-300">
                    ✅ The model solution earns <strong className="text-green-200">full credit (4/4 points)</strong> on the AP exam
                  </p>
                </div>

                {/* Continue to Self-Assessment */}
                <ShimmerButton
                  onClick={() => completePhase("modelComparison")}
                  className="w-full px-6 py-8 text-lg mt-6"
                >
                  Continue to Self-Assessment →
                </ShimmerButton>
              </motion.div>
            )}

            {/* PHASE 5: SELF-ASSESSMENT */}
            {currentPhase === "selfAssessment" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Phase 5: Self-Assessment</h2>
                    <p className="text-primary-300">Apply the AP rubric to evaluate your response</p>
                  </div>
                </div>

                <div className="p-5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center">
                  <p className="text-sm text-blue-300">
                    Now that you've seen the model, which rubric points did <strong>YOU</strong> earn in your original response?
                  </p>
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
                          checked={sessionData.phases.selfAssessment?.rubricChecks.includes(criterion.text) || false}
                          onChange={(e) => {
                            const current = sessionData.phases.selfAssessment?.rubricChecks || [];
                            const updated = e.target.checked
                              ? [...current, criterion.text]
                              : current.filter(c => c !== criterion.text);
                            setSessionData({
                              ...sessionData,
                              phases: {
                                ...sessionData.phases,
                                selfAssessment: {
                                  ...sessionData.phases.selfAssessment,
                                  rubricChecks: updated
                                }
                              }
                            });
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
                      <strong>Your self-assessment:</strong> {sessionData.phases.selfAssessment?.rubricChecks.length || 0}/4 points
                    </p>
                  </div>
                </div>

                {/* Continue to Reflection */}
                <ShimmerButton
                  onClick={() => completePhase("selfAssessment")}
                  className="w-full px-6 py-8 text-lg mt-6"
                >
                  Continue to Reflection →
                </ShimmerButton>
              </motion.div>
            )}
            {/* PHASE 6: REFLECTION */}
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
                    <h2 className="text-3xl font-bold">Phase 6: Reflect</h2>
                    <p className="text-primary-300">What did you learn from this problem?</p>
                  </div>
                </div>

                <div className="p-6 bg-pink-500/10 border border-pink-500/30 rounded-xl">
                  <h3 className="font-bold text-pink-300 mb-4">Key Learnings (select all that apply):</h3>
                  <div className="space-y-3">
                    {[
                      "✅ I successfully identified where the theorem breaks down",
                      "✅ I learned to verify ALL conditions before applying a theorem",
                      "✅ I understand why explicit justification matters (not just assertion)",
                      "⚠️ I initially missed a condition but caught it during self-check",
                      "⚠️ I need more practice distinguishing conditions from conclusions"
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
                        <span><strong>Why did the theorem fail to apply?</strong> — Explain in your own words why this problem was a "trap."</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>What will you do differently on the AP exam?</strong> — A concrete action you'll take (e.g., "I will always check continuity before applying IVT").</span>
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
                {/* Base XP */}
                <div className="flex items-center justify-between p-3 bg-primary-800/60 rounded-lg">
                  <span className="text-primary-200">Base XP</span>
                  <span className="font-bold text-white">+{xpBreakdown.base}</span>
                </div>
                <div className="text-xs text-primary-400 text-center -mt-2">
                  Time: {formatTime(elapsedSeconds)}
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
