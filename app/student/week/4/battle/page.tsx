/**
 * Boss Battle Interface
 * Three-phase collaborative challenge with timed curveball
 */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Users, Clock, Zap, Trophy, AlertCircle, ArrowLeft, CheckCircle,
  Lightbulb, Eye, Lock, AlertTriangle
} from "lucide-react";
import { Meteors } from "@/components/ui/meteors";
import ShimmerButton from "@/components/ui/shimmer-button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { bossBattles, week4Config } from "@/data/week-4-content";
import { MathContent } from "@/components/student/math-content";
import { getDataService } from "@/services/data";
import { redirectToInstructions } from "@/lib/utils/activity-instructions";

type Phase = "phase1" | "phase2" | "phase3" | "complete";

interface BattleData {
  startTime: number;
  phases: {
    phase1: { completed: boolean; response: string; timestamp?: number };
    phase2: { completed: boolean; cercResponse: { claim: string; evidence: string; reasoning: string; conditions: string }; timestamp?: number };
    phase3: { completed: boolean; adaptedConclusion: string; timestamp?: number; timeRemaining?: number };
  };
  curveballRevealed: boolean;
  hintsViewed: number[];
  solutionViewed: boolean;
}

export default function BossBattlePage() {
  // Select boss based on student course (mock: calculus-bc)
  const [studentCourse] = useState<"calculus-bc" | "statistics">("calculus-bc");
  const boss = bossBattles.find(b => b.course === studentCourse) || bossBattles[0];

  const [currentPhase, setCurrentPhase] = useState<Phase>("phase1");
  const [battleData, setBattleData] = useState<BattleData>({
    startTime: Date.now(),
    phases: {
      phase1: { completed: false, response: "" },
      phase2: { completed: false, cercResponse: { claim: "", evidence: "", reasoning: "", conditions: "" } },
      phase3: { completed: false, adaptedConclusion: "" }
    },
    curveballRevealed: false,
    hintsViewed: [],
    solutionViewed: false
  });

  const [phase3Timer, setPhase3Timer] = useState(boss.phases.phase3.timeLimit * 60); // seconds
  const [timerActive, setTimerActive] = useState(false);
  const [showCurveballModal, setShowCurveballModal] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showHints, setShowHints] = useState(false);

  // Redirect to instructions if not completed
  useEffect(() => {
    redirectToInstructions("boss-battle", "/student/week/4/battle");
  }, []);

  // Phase 3 timer countdown
  useEffect(() => {
    if (timerActive && phase3Timer > 0) {
      const interval = setInterval(() => {
        setPhase3Timer(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerActive, phase3Timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const completePhase = (phase: Phase) => {
    const updated = { ...battleData };

    switch (phase) {
      case "phase1":
        updated.phases.phase1 = { ...updated.phases.phase1, completed: true, timestamp: Date.now() };
        setBattleData(updated);
        setCurrentPhase("phase2");
        break;
      case "phase2":
        updated.phases.phase2 = { ...updated.phases.phase2, completed: true, timestamp: Date.now() };
        setBattleData(updated);
        // Show curveball modal before Phase 3
        setShowCurveballModal(true);
        break;
      case "phase3":
        updated.phases.phase3 = { ...updated.phases.phase3, completed: true, timestamp: Date.now(), timeRemaining: phase3Timer };
        setBattleData(updated);
        setTimerActive(false);
        setCurrentPhase("complete");
        setShowVictoryModal(true);
        break;
    }
  };

  const startPhase3 = () => {
    setShowCurveballModal(false);
    setCurrentPhase("phase3");
    setBattleData({ ...battleData, curveballRevealed: true });
    setTimerActive(true);
  };

  const viewHint = (phase: "phase1" | "phase2" | "phase3", hintIndex: number) => {
    const updated = [...battleData.hintsViewed, hintIndex];
    setBattleData({ ...battleData, hintsViewed: updated });
  };

  const calculateXP = () => {
    let xp = 50; // Base XP for Boss Battle
    const bonuses: { name: string; amount: number }[] = [];

    // Phase completion bonuses
    if (battleData.phases.phase1.completed) {
      bonuses.push({ name: "Phase 1: Evidence Untangled", amount: 15 });
      xp += 15;
    }

    if (battleData.phases.phase2.completed) {
      const cercComplete = Object.values(battleData.phases.phase2.cercResponse).every(v => v.trim().length > 50);
      if (cercComplete) {
        bonuses.push({ name: "Phase 2: Team Argument Complete", amount: 20 });
        xp += 20;
      }
    }

    if (battleData.phases.phase3.completed) {
      bonuses.push({ name: "Phase 3: Curveball Adapted", amount: 25 });
      xp += 25;

      // Time bonus
      if (battleData.phases.phase3.timeRemaining && battleData.phases.phase3.timeRemaining > 300) {
        bonuses.push({ name: "⏱️ Time Bonus (>5 min remaining)", amount: 15 });
        xp += 15;
      }
    }

    // Team collaboration bonus (always awarded in Boss Battle)
    bonuses.push({ name: "👥 Team Collaboration", amount: 30 });
    xp += 30;

    // No hints/solution bonus
    if (battleData.hintsViewed.length === 0 && !battleData.solutionViewed) {
      bonuses.push({ name: "💪 Unassisted Victory", amount: 20 });
      xp += 20;
    }

    // Boss Slayer badge (all phases complete with good quality)
    if (battleData.phases.phase1.completed &&
        battleData.phases.phase2.completed &&
        battleData.phases.phase3.completed) {
      bonuses.push({ name: "⚔️ BOSS SLAYER BADGE", amount: 50 });
      xp += 50;
    }

    return { base: 50, bonuses, total: xp };
  };

  const xpBreakdown = calculateXP();

  const phaseConfig = [
    { key: "phase1", label: "Phase 1", icon: Target, color: "blue" },
    { key: "phase2", label: "Phase 2", icon: Users, color: "purple" },
    { key: "phase3", label: "Phase 3", icon: Clock, color: "red" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white relative overflow-hidden">
      {/* Meteors Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <Meteors number={20} />
      </div>

      {/* Navigation Bar */}
      <div className="relative z-10 border-b border-primary-600/30 bg-primary-900/60 backdrop-blur-sm">
        <div className="max-w-full px-6 py-4 flex items-center justify-between">
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/student" },
              { label: "Week 4", href: "/student/week/4" },
              { label: "Boss Battle" },
            ]}
          />
          <Link
            href="/student/week/4"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit Battle
          </Link>
        </div>
      </div>

      <div className="relative z-10 flex h-[calc(100vh-73px)]">
        {/* LEFT SIDEBAR - Battle Info */}
        <div className="w-2/5 border-r border-primary-600/30 bg-primary-900/40 backdrop-blur-sm p-8 overflow-y-auto">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-red-400" />
              <span className="text-sm text-red-300 font-semibold">BOSS BATTLE</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{boss.title}</h1>
            <div className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
              EPIC DIFFICULTY
            </div>
          </div>

          {/* Problem Statement */}
          <div className="mb-6 p-5 bg-primary-800/60 rounded-xl border border-primary-600/30">
            <h3 className="font-bold text-accent-300 mb-3">Problem Setup</h3>
            <div className="text-primary-200 leading-relaxed text-sm">
              <MathContent content={boss.problemStatement} />
            </div>
          </div>

          {/* Phase Progress */}
          <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <h3 className="font-semibold mb-3">Battle Progress</h3>
            <div className="space-y-2">
              {phaseConfig.map((phase, index) => {
                const phaseKey = phase.key as keyof typeof battleData.phases;
                const isCompleted = battleData.phases[phaseKey].completed;
                const isCurrent = currentPhase === phase.key;
                const Icon = phase.icon;

                return (
                  <div key={phase.key} className="flex items-center gap-2">
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : isCurrent ? (
                      <div className={`w-5 h-5 rounded-full border-2 border-${phase.color}-400 animate-pulse`} />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-primary-600" />
                    )}
                    <Icon className={`w-4 h-4 ${isCompleted ? 'text-green-400' : isCurrent ? `text-${phase.color}-400` : 'text-primary-500'}`} />
                    <span className={`text-sm ${
                      isCompleted ? "text-green-400" : isCurrent ? `text-${phase.color}-400 font-semibold` : "text-primary-500"
                    }`}>
                      {phase.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phase 3 Timer */}
          {currentPhase === "phase3" && (
            <div className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/50 rounded-xl animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-red-300">TIME REMAINING</span>
                <Clock className="w-5 h-5 text-red-400" />
              </div>
              <div className={`text-4xl font-bold ${phase3Timer < 120 ? 'text-red-400' : 'text-red-300'}`}>
                {formatTime(phase3Timer)}
              </div>
              {phase3Timer < 120 && (
                <p className="text-xs text-red-300 mt-2">⚠️ Less than 2 minutes left!</p>
              )}
            </div>
          )}

          {/* Current Phase Info */}
          {currentPhase !== "complete" && (
            <div className="p-4 bg-accent-500/10 border border-accent-500/30 rounded-xl">
              <h4 className="font-semibold text-accent-300 mb-2">
                {boss.phases[currentPhase as keyof typeof boss.phases].title}
              </h4>
              <p className="text-sm text-primary-200">
                {boss.phases[currentPhase as keyof typeof boss.phases].description}
              </p>
            </div>
          )}

          {/* Hints Button */}
          {currentPhase !== "complete" && (
            <button
              onClick={() => setShowHints(!showHints)}
              className="mt-6 w-full px-4 py-3 bg-secondary-500/20 border border-secondary-500/30 rounded-xl hover:bg-secondary-500/30 transition-colors flex items-center justify-center gap-2"
            >
              <Lightbulb className="w-5 h-5 text-secondary-400" />
              <span className="font-semibold text-secondary-300">View Hints</span>
            </button>
          )}
        </div>

        {/* RIGHT WORKSPACE */}
        <div className="w-3/5 p-8 pb-16 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {/* PHASE 1: Untangle Evidence */}
            {currentPhase === "phase1" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Phase 1: Untangle the Evidence</h2>
                    <p className="text-primary-300">Individual work • Untimed</p>
                  </div>
                </div>

                <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <h3 className="font-bold text-blue-300 mb-3">Your Task:</h3>
                  <p className="text-primary-200 text-sm leading-relaxed">
                    {boss.phases.phase1.task}
                  </p>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Your Phase 1 Analysis:</label>
                  <textarea
                    value={battleData.phases.phase1.response}
                    onChange={(e) => setBattleData({
                      ...battleData,
                      phases: {
                        ...battleData.phases,
                        phase1: { ...battleData.phases.phase1, response: e.target.value }
                      }
                    })}
                    className="w-full bg-primary-800/60 border border-primary-600/30 rounded-xl p-4 text-white placeholder-primary-400 focus:border-accent-500 focus:outline-none resize-none"
                    rows={12}
                    placeholder="Write your complete Phase 1 analysis here..."
                  />
                </div>

                <ShimmerButton
                  onClick={() => completePhase("phase1")}
                  disabled={battleData.phases.phase1.response.trim().length < 50}
                  className="w-full py-4 text-lg"
                >
                  Complete Phase 1 →
                </ShimmerButton>
              </motion.div>
            )}

            {/* PHASE 2: Team Argument */}
            {currentPhase === "phase2" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Phase 2: Construct Team Argument</h2>
                    <p className="text-primary-300">Team collaboration • Untimed</p>
                  </div>
                </div>

                <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                  <h3 className="font-bold text-purple-300 mb-3">Your Task:</h3>
                  <p className="text-primary-200 text-sm leading-relaxed">
                    {boss.phases.phase2.task}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-accent-500 to-accent-600 font-bold text-sm">C</span>
                      <label className="font-semibold">Claim</label>
                    </div>
                    <textarea
                      value={battleData.phases.phase2.cercResponse.claim}
                      onChange={(e) => setBattleData({
                        ...battleData,
                        phases: {
                          ...battleData.phases,
                          phase2: {
                            ...battleData.phases.phase2,
                            cercResponse: { ...battleData.phases.phase2.cercResponse, claim: e.target.value }
                          }
                        }
                      })}
                      className="w-full bg-primary-800/60 border border-primary-600/30 rounded-xl p-4 text-white placeholder-primary-400 focus:border-accent-500 focus:outline-none resize-none"
                      rows={3}
                      placeholder="State your team's claim..."
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 font-bold text-sm">E</span>
                      <label className="font-semibold">Evidence</label>
                    </div>
                    <textarea
                      value={battleData.phases.phase2.cercResponse.evidence}
                      onChange={(e) => setBattleData({
                        ...battleData,
                        phases: {
                          ...battleData.phases,
                          phase2: {
                            ...battleData.phases.phase2,
                            cercResponse: { ...battleData.phases.phase2.cercResponse, evidence: e.target.value }
                          }
                        }
                      })}
                      className="w-full bg-primary-800/60 border border-primary-600/30 rounded-xl p-4 text-white placeholder-primary-400 focus:border-accent-500 focus:outline-none resize-none"
                      rows={5}
                      placeholder="Show all calculations..."
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 font-bold text-sm">R</span>
                      <label className="font-semibold">Reasoning</label>
                    </div>
                    <textarea
                      value={battleData.phases.phase2.cercResponse.reasoning}
                      onChange={(e) => setBattleData({
                        ...battleData,
                        phases: {
                          ...battleData.phases,
                          phase2: {
                            ...battleData.phases.phase2,
                            cercResponse: { ...battleData.phases.phase2.cercResponse, reasoning: e.target.value }
                          }
                        }
                      })}
                      className="w-full bg-primary-800/60 border border-primary-600/30 rounded-xl p-4 text-white placeholder-primary-400 focus:border-accent-500 focus:outline-none resize-none"
                      rows={4}
                      placeholder="Cite theorems and connect evidence to claim..."
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-green-500 to-green-600 font-bold text-sm">C</span>
                      <label className="font-semibold">Conditions</label>
                    </div>
                    <textarea
                      value={battleData.phases.phase2.cercResponse.conditions}
                      onChange={(e) => setBattleData({
                        ...battleData,
                        phases: {
                          ...battleData.phases,
                          phase2: {
                            ...battleData.phases.phase2,
                            cercResponse: { ...battleData.phases.phase2.cercResponse, conditions: e.target.value }
                          }
                        }
                      })}
                      className="w-full bg-primary-800/60 border border-primary-600/30 rounded-xl p-4 text-white placeholder-primary-400 focus:border-accent-500 focus:outline-none resize-none"
                      rows={4}
                      placeholder="Verify all theorem conditions..."
                    />
                  </div>
                </div>

                <ShimmerButton
                  onClick={() => completePhase("phase2")}
                  disabled={Object.values(battleData.phases.phase2.cercResponse).some(v => v.trim().length < 30)}
                  className="w-full py-4 text-lg"
                >
                  Complete Phase 2 → (Proceed to Curveball)
                </ShimmerButton>
              </motion.div>
            )}

            {/* PHASE 3: Curveball Adaptation */}
            {currentPhase === "phase3" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center animate-pulse">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Phase 3: The Curveball</h2>
                    <p className="text-primary-300">Team adaptation • TIMED: {formatTime(phase3Timer)}</p>
                  </div>
                </div>

                <div className="p-6 bg-red-500/10 border-2 border-red-500/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                    <h3 className="font-bold text-red-300">CURVEBALL REVEALED:</h3>
                  </div>
                  <p className="text-red-200 text-lg font-semibold leading-relaxed">
                    {boss.phases.phase3.curveball}
                  </p>
                </div>

                <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <h3 className="font-bold text-red-300 mb-3">Your Task:</h3>
                  <p className="text-primary-200 text-sm leading-relaxed">
                    {boss.phases.phase3.task}
                  </p>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Adapted Conclusion:</label>
                  <textarea
                    value={battleData.phases.phase3.adaptedConclusion}
                    onChange={(e) => setBattleData({
                      ...battleData,
                      phases: {
                        ...battleData.phases,
                        phase3: { ...battleData.phases.phase3, adaptedConclusion: e.target.value }
                      }
                    })}
                    className="w-full bg-primary-800/60 border border-primary-600/30 rounded-xl p-4 text-white placeholder-primary-400 focus:border-accent-500 focus:outline-none resize-none"
                    rows={10}
                    placeholder="Write your adapted conclusion addressing the curveball..."
                  />
                </div>

                <ShimmerButton
                  onClick={() => completePhase("phase3")}
                  disabled={battleData.phases.phase3.adaptedConclusion.trim().length < 50 || phase3Timer === 0}
                  className="w-full py-4 text-lg bg-gradient-to-r from-red-600 to-orange-600"
                >
                  {phase3Timer === 0 ? "Time's Up!" : "Complete Boss Battle ⚔️"}
                </ShimmerButton>

                {phase3Timer === 0 && (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                    <p className="text-yellow-300 text-sm">
                      Time's up! Submit your current answer. You'll still earn XP based on what you completed.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Curveball Reveal Modal */}
      <AnimatePresence>
        {showCurveballModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-red-900/90 to-orange-900/90 rounded-2xl p-8 max-w-2xl w-full border-4 border-red-500/50 shadow-2xl"
            >
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center animate-pulse"
                >
                  <AlertTriangle className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-4xl font-bold mb-2 text-red-200">⚠️ CURVEBALL INCOMING ⚠️</h2>
                <p className="text-red-300">New information has just been revealed...</p>
              </div>

              <div className="p-6 bg-black/30 rounded-xl border border-red-500/30 mb-6">
                <p className="text-red-100 text-lg leading-relaxed">
                  {boss.phases.phase3.curveball}
                </p>
              </div>

              <div className="p-4 bg-yellow-500/20 border-l-4 border-yellow-500 rounded-lg mb-6">
                <p className="text-yellow-200 text-sm">
                  <strong>Phase 3 is TIMED:</strong> You have {boss.phases.phase3.timeLimit} minutes to adapt your conclusion.
                  The timer starts as soon as you click "Start Phase 3".
                </p>
              </div>

              <ShimmerButton
                onClick={startPhase3}
                className="w-full py-4 text-xl bg-gradient-to-r from-red-600 to-orange-600"
              >
                Start Phase 3 (Timer Begins) ⏱️
              </ShimmerButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Victory Modal */}
      <AnimatePresence>
        {showVictoryModal && (
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
              className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-8 max-w-lg w-full border-2 border-yellow-500/50 shadow-2xl"
            >
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: "spring", duration: 1.2 }}
                  className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center"
                >
                  <Trophy className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-4xl font-bold mb-2">BOSS DEFEATED!</h2>
                <div className="text-6xl mb-4">⚔️</div>
                <p className="text-yellow-300 text-xl font-bold">You've earned: BOSS SLAYER</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-primary-800/60 rounded-lg">
                  <span className="text-primary-200">Base XP (Boss Battle)</span>
                  <span className="font-bold text-white">+{xpBreakdown.base}</span>
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

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-900/40 to-orange-900/40 rounded-lg border-2 border-yellow-500/50 mt-4">
                  <span className="text-xl font-bold">Total XP</span>
                  <span className="text-3xl font-bold text-yellow-400">
                    +{xpBreakdown.total}
                  </span>
                </div>
              </div>

              <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl mb-6">
                <p className="text-green-300 text-center font-semibold">
                  🎉 You've completed all 4 weeks of AP Justification Training!
                </p>
                <p className="text-primary-200 text-center text-sm mt-2">
                  You're ready for the AP exam. You've mastered condition verification, rigorous justification,
                  multi-concept synthesis, and high-pressure problem solving.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = "/student"}
                  className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-xl font-bold text-lg transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hints Panel */}
      <AnimatePresence>
        {showHints && currentPhase !== "complete" && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 h-full w-96 bg-primary-900/95 backdrop-blur-sm border-l border-primary-600/30 p-6 overflow-y-auto z-40"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Hints</h3>
              <button onClick={() => setShowHints(false)} className="text-primary-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {boss.hints[currentPhase as keyof typeof boss.hints].map((hint, index) => (
                <div key={index}>
                  {battleData.hintsViewed.includes(index) ? (
                    <div className="p-3 bg-secondary-500/10 border border-secondary-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-secondary-400" />
                        <span className="text-xs font-semibold text-secondary-300">Hint {index + 1}</span>
                      </div>
                      <p className="text-sm text-primary-200">{hint}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => viewHint(currentPhase as any, index)}
                      className="w-full p-3 bg-primary-800/40 border border-primary-600/20 rounded-lg hover:bg-secondary-500/10 hover:border-secondary-500/30 transition-colors flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4 text-primary-500" />
                      <span className="text-sm text-primary-400">View Hint {index + 1}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
