"use client";

import { useState } from "react";
import { User, Problem, WeekProgress } from "@/lib/types";
import { ChevronLeft, BookOpen, Target } from "lucide-react";
import Link from "next/link";
import { ProblemDisplay } from "./problem-display";
import { CERCForm } from "./cerc-form";

interface WeekSessionViewProps {
  student: User;
  weekNumber: number;
  problems: Problem[];
  weekProgress: WeekProgress | null;
}

export function WeekSessionView({
  student,
  weekNumber,
  problems,
  weekProgress,
}: WeekSessionViewProps) {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const currentProblem = problems[currentProblemIndex];

  // Get phase info
  const phases = [
    { week: 1, title: "Foundation", focus: "Error-forcing problems" },
    { week: 2, title: "Verification", focus: "Condition verification" },
    { week: 3, title: "Argumentation", focus: "Global reasoning" },
    { week: 4, title: "Synthesis", focus: "Integrated assessment" },
  ];
  const phaseInfo = phases.find((p) => p.week === weekNumber);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
      {/* Header */}
      <header className="border-b border-white/10 bg-primary-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-primary-200 hover:text-accent-400 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/30">
                  <Target className="w-4 h-4 text-accent-400" />
                  <span className="text-sm font-medium text-accent-300">
                    Week {weekNumber}: {phaseInfo?.title}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-primary-400">Student</div>
                <div className="text-sm font-medium text-white">{student.name}</div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-800/60 border border-white/10">
                <BookOpen className="w-4 h-4 text-accent-400" />
                <span className="text-sm font-medium text-white">
                  Problem {currentProblemIndex + 1} of {problems.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Split Screen */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
          {/* LEFT: Problem Display */}
          <div className="overflow-y-auto">
            <ProblemDisplay
              problem={currentProblem}
              weekNumber={weekNumber}
              problemNumber={currentProblemIndex + 1}
              totalProblems={problems.length}
            />
          </div>

          {/* RIGHT: CERC Form */}
          <div className="overflow-y-auto">
            <CERCForm
              problem={currentProblem}
              weekNumber={weekNumber}
              studentId={student.id}
              existingResponse={
                weekProgress?.cercResponses.find(
                  (r) => r.problemId === currentProblem?.id
                ) || null
              }
              onSubmitSuccess={() => {
                // Move to next problem or show completion
                if (currentProblemIndex < problems.length - 1) {
                  setCurrentProblemIndex(currentProblemIndex + 1);
                }
              }}
            />
          </div>
        </div>

        {/* Problem Navigation */}
        {problems.length > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {problems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentProblemIndex(index)}
                className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  index === currentProblemIndex
                    ? "border-accent-400 bg-accent-500/20 text-accent-300"
                    : "border-white/20 bg-white/5 text-white/60 hover:border-accent-500/50"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
