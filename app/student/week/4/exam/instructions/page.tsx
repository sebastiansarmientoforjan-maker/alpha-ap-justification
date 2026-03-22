/**
 * Week 4 AP Exam Simulation - Instructions
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock, FileText, AlertTriangle, CheckCircle, Award,
  ArrowRight, ArrowLeft, Target, Trophy, Timer
} from "lucide-react";
import ShimmerButton from "@/components/ui/shimmer-button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ActivityInstructions } from "@/components/student/activity-instructions";

export default function ExamInstructionsPage() {
  const [instructionsComplete, setInstructionsComplete] = useState(false);

  const handleComplete = () => {
    setInstructionsComplete(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
      {/* Back Button */}
      <Link
        href="/student/week/4"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-primary-900/90 hover:bg-primary-800/90 border border-primary-700/50 hover:border-accent-500/50 rounded-lg backdrop-blur-xl transition-all duration-300 group shadow-lg"
      >
        <ArrowLeft className="w-4 h-4 text-primary-300 group-hover:text-accent-400 transition-colors" />
        <span className="text-sm font-medium text-primary-200 group-hover:text-white transition-colors">
          Back
        </span>
      </Link>

      <div className="container mx-auto px-6 pt-24 pb-12 max-w-5xl">
        <Breadcrumbs
          items={[
            { label: "Week 4", href: "/student/week/4" },
            { label: "AP Exam Simulation", href: "/student/week/4/exam" },
            { label: "Instructions" },
          ]}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">Week 4: AP Exam Simulation</h1>
          <p className="text-xl text-primary-200 max-w-3xl mx-auto">
            Individual timed FRQ under real AP exam conditions
          </p>
        </motion.div>

        {/* What to Expect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-primary-800/50 border border-primary-700/50 rounded-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Target className="w-6 h-6 text-accent-400" />
            What to Expect
          </h2>

          <div className="space-y-4 text-primary-200">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-accent-400 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-white mb-1">Multi-Part FRQ</p>
                <p>One long-form problem with 3-4 parts (A, B, C, and possibly D)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-accent-400 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-white mb-1">Timed: 25-30 Minutes</p>
                <p>Calculus AB: 25 min | Calculus BC: 30 min | Statistics: 25 min</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-white mb-1">No Scaffolding</p>
                <p>Blank canvas - just like the real AP exam. No sentence frames, no hints, no structure provided.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-accent-400 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-white mb-1">AP Rubric Scoring</p>
                <p>Your responses will be scored using the official AP rubric point system</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Time Management Strategy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-primary-800/50 border border-primary-700/50 rounded-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Timer className="w-6 h-6 text-accent-400" />
            Time Management Strategy
          </h2>

          <div className="space-y-6">
            <div className="bg-primary-900/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Recommended Time Allocation</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-primary-200">Read all parts carefully</span>
                  <span className="font-bold text-accent-400">2 minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-200">Part A (calculation + justification)</span>
                  <span className="font-bold text-accent-400">7-8 minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-200">Part B (theorem application)</span>
                  <span className="font-bold text-accent-400">8-10 minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-200">Part C (analysis/interpretation)</span>
                  <span className="font-bold text-accent-400">6-8 minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-200">Review & final check</span>
                  <span className="font-bold text-accent-400">2-3 minutes</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-primary-200">
              <p className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span><strong>DO:</strong> Read all parts before starting. This helps you allocate time wisely.</span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span><strong>DO:</strong> Move on if stuck. You can return to a part later.</span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span><strong>DO:</strong> Show all work even if time is short. Partial credit matters.</span>
              </p>
              <p className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span><strong>DON'T:</strong> Spend more than 10 minutes on any single part.</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* CERC Reminder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">CERC Framework Reminder</h2>

          <p className="text-primary-200 mb-6">
            Even without scaffolding, structure your responses using CERC:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-primary-900/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                  C
                </div>
                <h3 className="font-semibold text-white">Claim</h3>
              </div>
              <p className="text-sm text-primary-300">State your conclusion clearly</p>
            </div>

            <div className="bg-primary-900/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                  E
                </div>
                <h3 className="font-semibold text-white">Evidence</h3>
              </div>
              <p className="text-sm text-primary-300">Show calculations and data</p>
            </div>

            <div className="bg-primary-900/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                  R
                </div>
                <h3 className="font-semibold text-white">Reasoning</h3>
              </div>
              <p className="text-sm text-primary-300">Connect evidence to claim with theorems</p>
            </div>

            <div className="bg-primary-900/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                  C
                </div>
                <h3 className="font-semibold text-white">Conditions</h3>
              </div>
              <p className="text-sm text-primary-300">Verify all theorem hypotheses</p>
            </div>
          </div>
        </motion.div>

        {/* Ready Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <ActivityInstructions
            activityType="exam"
            activityId="week-4-exam"
            activityTitle="AP Exam Simulation"
            onComplete={handleComplete}
            customInstructions={[
              {
                id: 1,
                text: "I understand this is a TIMED exam (25-30 minutes) and the timer starts when I begin.",
                icon: <Clock className="w-5 h-5" />,
                colorClasses: {
                  checked: "bg-red-500/10 border-red-500/30",
                  unchecked: "bg-primary-800/40 border-primary-600/30 hover:bg-primary-800/60",
                  iconChecked: "text-red-400",
                  iconUnchecked: "text-primary-400"
                }
              },
              {
                id: 2,
                text: "I have paper and pencil ready for scratch work. I will NOT use digital tools or calculators unless explicitly permitted.",
                icon: <FileText className="w-5 h-5" />,
                colorClasses: {
                  checked: "bg-purple-500/10 border-purple-500/30",
                  unchecked: "bg-primary-800/40 border-primary-600/30 hover:bg-primary-800/60",
                  iconChecked: "text-purple-400",
                  iconUnchecked: "text-primary-400"
                }
              },
              {
                id: 3,
                text: "I understand there is NO scaffolding - I must structure my own CERC responses from scratch.",
                icon: <AlertTriangle className="w-5 h-5" />,
                colorClasses: {
                  checked: "bg-amber-500/10 border-amber-500/30",
                  unchecked: "bg-primary-800/40 border-primary-600/30 hover:bg-primary-800/60",
                  iconChecked: "text-amber-400",
                  iconUnchecked: "text-primary-400"
                }
              },
              {
                id: 4,
                text: "I am ready to demonstrate everything I learned in Weeks 1-3 under exam pressure.",
                icon: <Trophy className="w-5 h-5" />,
                colorClasses: {
                  checked: "bg-green-500/10 border-green-500/30",
                  unchecked: "bg-primary-800/40 border-primary-600/30 hover:bg-primary-800/60",
                  iconChecked: "text-green-400",
                  iconUnchecked: "text-primary-400"
                }
              }
            ]}
          />
        </motion.div>

        {/* CTA */}
        {instructionsComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Link href="/student/week/4/exam">
              <ShimmerButton>
                <Trophy className="w-5 h-5 mr-2" />
                Begin Exam
                <ArrowRight className="w-5 h-5 ml-2" />
              </ShimmerButton>
            </Link>

            <p className="text-primary-300 text-sm mt-4">
              Good luck! Remember: verify conditions, show all work, manage your time.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
