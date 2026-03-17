/**
 * Week 2 Problems Selection Page
 * Shows available condition-verification problems based on student's course
 */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Target, AlertTriangle, TrendingUp, CheckCircle, Lock } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import BlurFade from "@/components/ui/blur-fade";
import ShimmerButton from "@/components/ui/shimmer-button";
import { week2Problems, week2Config } from "@/data/week-2-content";

export default function Week2ProblemsPage() {
  const [studentCourse, setStudentCourse] = useState<"calculus-ab" | "calculus-bc" | "statistics">("calculus-bc");
  const [completedProblems, setCompletedProblems] = useState<string[]>([]);

  // Filter problems by student's course
  const availableProblems = week2Problems.filter(
    (problem) =>
      problem.course === studentCourse ||
      problem.course === "calculus-ab" // AB problems are suitable for BC too
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
      {/* Navigation */}
      <div className="border-b border-primary-600/30 bg-primary-900/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/student" },
              { label: "Week 2", href: "/student/week/2" },
              { label: "Problems" },
            ]}
          />
          <Link
            href="/student/week/2"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Week 2
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <BlurFade delay={0.1}>
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">{week2Config.title}</h1>
            <p className="text-xl text-primary-200 max-w-3xl mx-auto mb-6">
              {week2Config.focus}
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
            <h2 className="text-2xl font-bold mb-4">Week 2 Objectives</h2>
            <ul className="space-y-3">
              {week2Config.objectives.map((objective, index) => (
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
            const isLocked = index > 0 && !completedProblems.includes(availableProblems[index - 1].id);

            return (
              <BlurFade key={problem.id} delay={0.4 + index * 0.1}>
                <motion.div
                  whileHover={!isLocked ? { scale: 1.02, y: -5 } : {}}
                  className={`relative p-8 rounded-2xl border-2 transition-all ${
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
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-secondary-500 flex items-center justify-center text-3xl font-bold shadow-lg shadow-accent-500/50">
                      {index + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold">{problem.title}</h3>
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-semibold ${
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

                      <div className="flex items-center gap-4 text-sm text-primary-300 mb-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{problem.theoremInfo.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          <span>~{week2Config.estimatedTime}</span>
                        </div>
                      </div>

                      <p className="text-primary-200 mb-4 leading-relaxed">
                        <span className="font-semibold text-accent-400">The Challenge:</span> {problem.trap}
                      </p>

                      <div className="flex items-center gap-4">
                        {!isLocked ? (
                          <Link href={`/student/week/2/problem/${problem.id}`}>
                            <ShimmerButton className="px-6 py-3">
                              {isCompleted ? "Review Problem" : "Start Problem"} →
                            </ShimmerButton>
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="px-6 py-3 bg-primary-700/50 text-primary-400 rounded-xl font-semibold cursor-not-allowed"
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
            <h3 className="text-xl font-bold mb-3">How to Approach Week 2 Problems</h3>
            <ul className="space-y-2 text-primary-200">
              <li className="flex items-start gap-2">
                <span className="text-accent-400 mt-1">1.</span>
                <span>Identify which theorem or procedure you need to apply</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400 mt-1">2.</span>
                <span>List ALL hypotheses/conditions required for that theorem/procedure</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400 mt-1">3.</span>
                <span>For EACH condition, provide mathematical justification (not just assertion)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400 mt-1">4.</span>
                <span>Only after all conditions are verified, apply the theorem</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400 mt-1">5.</span>
                <span>Use the structural outline to organize your CERC response</span>
              </li>
            </ul>
          </div>
        </BlurFade>
      </div>
    </div>
  );
}
