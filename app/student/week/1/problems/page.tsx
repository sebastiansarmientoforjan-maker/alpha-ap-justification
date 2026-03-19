/**
 * Week 1 Problems Selection Page
 * Shows available error-forcing problems based on student's course
 */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Target, AlertTriangle, TrendingUp, CheckCircle, Lock, ChevronDown, ChevronUp } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import BlurFade from "@/components/ui/blur-fade";
import ShimmerButton from "@/components/ui/shimmer-button";
import { week1Problems, week1Config } from "@/data/week-1-content";

export default function Week1ProblemsPage() {
  const [studentCourse, setStudentCourse] = useState<"calculus-ab" | "calculus-bc" | "statistics">("calculus-bc");
  const [completedProblems, setCompletedProblems] = useState<string[]>([]);
  const [expandedProblems, setExpandedProblems] = useState<string[]>([]);

  // Filter problems by student's course
  const availableProblems = week1Problems.filter(
    (problem) =>
      problem.course === studentCourse ||
      problem.course === "calculus-ab" // AB problems are suitable for BC too
  );

  const toggleExpanded = (problemId: string) => {
    setExpandedProblems((prev) =>
      prev.includes(problemId)
        ? prev.filter((id) => id !== problemId)
        : [...prev, problemId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
      {/* Navigation */}
      <div className="border-b border-primary-600/30 bg-primary-900/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/student" },
              { label: "Week 1", href: "/student/week/1" },
              { label: "Problems" },
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

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <BlurFade delay={0.1}>
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">{week1Config.title}</h1>
            <p className="text-xl text-primary-200 max-w-3xl mx-auto mb-6">
              {week1Config.focus}
            </p>
            <div className="flex items-center justify-center gap-2 text-accent-300">
              <Target className="w-5 h-5" />
              <span className="text-sm font-medium">
                {completedProblems.length} of {availableProblems.length} completed
              </span>
            </div>
          </div>
        </BlurFade>

        {/* Course Indicator */}
        <BlurFade delay={0.2}>
          <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300 font-semibold mb-1">Your Course</p>
                <p className="text-lg text-white">
                  {studentCourse === "calculus-ab"
                    ? "AP Calculus AB"
                    : studentCourse === "calculus-bc"
                    ? "AP Calculus BC"
                    : "AP Statistics"}
                </p>
              </div>
              {/* Course switcher for testing - remove in production */}
              <select
                value={studentCourse}
                onChange={(e) => setStudentCourse(e.target.value as any)}
                className="px-4 py-2 bg-primary-800/60 border border-primary-600/30 rounded-lg text-white"
              >
                <option value="calculus-ab">AP Calculus AB</option>
                <option value="calculus-bc">AP Calculus BC</option>
                <option value="statistics">AP Statistics</option>
              </select>
            </div>
          </div>
        </BlurFade>

        {/* Objectives */}
        <BlurFade delay={0.3}>
          <div className="mb-12 p-6 bg-white/5 rounded-xl border border-white/10">
            <h2 className="text-2xl font-bold mb-4">Week 1 Objectives</h2>
            <ul className="space-y-3">
              {week1Config.objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-primary-200">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        </BlurFade>

        {/* Problems Grid */}
        <div className="space-y-6">
          {availableProblems.map((problem, index) => {
            const isCompleted = completedProblems.includes(problem.id);
            const isLocked = false; // Temporarily unlock all problems for review
            const isExpanded = expandedProblems.includes(problem.id);

            return (
              <BlurFade key={problem.id} delay={0.4 + index * 0.1}>
                <motion.div
                  whileHover={!isLocked ? { scale: 1.01 } : {}}
                  className={`relative p-6 rounded-2xl border-2 transition-all ${
                    isCompleted
                      ? "bg-green-500/10 border-green-500/50"
                      : isLocked
                      ? "bg-primary-800/20 border-primary-600/20 opacity-60"
                      : "bg-white/5 border-accent-500/30 hover:border-accent-500/60"
                  }`}
                >
                  {/* Completion Badge */}
                  {isCompleted && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-xs font-semibold text-green-300">Completed</span>
                    </div>
                  )}

                  {/* Lock Badge */}
                  {isLocked && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-primary-700/50 border border-primary-600/50 rounded-full">
                      <Lock className="w-4 h-4 text-primary-400" />
                      <span className="text-xs font-semibold text-primary-300">Locked</span>
                    </div>
                  )}

                  <div className="flex items-start gap-6">
                    {/* Number Badge */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-secondary-500 flex items-center justify-center text-2xl font-bold shadow-lg shadow-accent-500/50">
                      {index + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      {/* Header - Always Visible */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <h3 className="text-xl font-bold">{problem.title}</h3>
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              problem.errorCategory === "CONDITION_BYPASS"
                                ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                : problem.errorCategory === "LOCAL_ONLY_ARGUMENT"
                                ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                                : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            }`}
                          >
                            {problem.errorCategory.replace(/_/g, " ")}
                          </span>
                        </div>
                      </div>

                      {/* Metadata - Always Visible */}
                      <div className="flex items-center gap-4 text-sm text-primary-300 mb-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{problem.theoremInfo.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          <span>~{week1Config.estimatedTime}</span>
                        </div>
                      </div>

                      {/* Expandable Details */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mb-4"
                        >
                          <p className="text-primary-200 leading-relaxed p-4 bg-primary-900/30 rounded-xl border border-red-500/20">
                            <span className="font-semibold text-red-400">The Trap:</span> {problem.trap}
                          </p>
                        </motion.div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        {!isLocked ? (
                          <>
                            <Link href={`/student/week/1/problem/${problem.id}/instructions`}>
                              <ShimmerButton className="px-6 py-2.5">
                                {isCompleted ? "Review Problem" : "Start Problem"} →
                              </ShimmerButton>
                            </Link>
                            <button
                              onClick={() => toggleExpanded(problem.id)}
                              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl font-medium transition-all text-sm"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-4 h-4" />
                                  Hide Details
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4" />
                                  Show Details
                                </>
                              )}
                            </button>
                          </>
                        ) : (
                          <button
                            disabled
                            className="px-6 py-2.5 bg-primary-700/50 text-primary-400 rounded-xl font-semibold cursor-not-allowed"
                          >
                            Complete previous problem first
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </BlurFade>
            );
          })}
        </div>

        {/* Info Box */}
        <BlurFade delay={0.8}>
          <div className="mt-12 p-6 bg-accent-500/10 border border-accent-500/30 rounded-xl">
            <h3 className="text-xl font-bold mb-3">💡 How to Approach These Problems</h3>
            <ul className="space-y-2 text-primary-200">
              <li className="flex items-start gap-2">
                <span className="text-accent-400 mt-1">1.</span>
                <span>Read the problem carefully and identify which theorem is mentioned</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400 mt-1">2.</span>
                <span>Before calculating anything, check ALL theorem conditions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400 mt-1">3.</span>
                <span>Use the CERC framework with full sentence frames (provided)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400 mt-1">4.</span>
                <span>If a condition fails, your claim should state that the theorem doesn't apply</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400 mt-1">5.</span>
                <span>Use hints if needed - there's no penalty in practice mode!</span>
              </li>
            </ul>
          </div>
        </BlurFade>
      </div>
    </div>
  );
}
