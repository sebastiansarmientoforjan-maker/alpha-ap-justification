"use client";

import { Problem } from "@/lib/types";
import { AlertCircle, Lightbulb } from "lucide-react";
import "katex/dist/katex.min.css";
import { MathContent } from "./math-content";

interface ProblemDisplayProps {
  problem: Problem;
  weekNumber: number;
  problemNumber?: number;
  totalProblems?: number;
}

export function ProblemDisplay({
  problem,
  weekNumber,
  problemNumber,
  totalProblems,
}: ProblemDisplayProps) {
  if (!problem) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
        <div className="text-center text-primary-300">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-accent-400" />
          <p>No problem available for this week.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent-500/10 to-secondary-500/10 border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-accent-400 font-medium mb-1">
              Week {weekNumber} Problem
            </div>
            {problemNumber && totalProblems && (
              <div className="text-sm text-primary-200">
                Problem {problemNumber} of {totalProblems}
              </div>
            )}
          </div>
          <div className="px-3 py-1.5 rounded-full bg-accent-500/20 border border-accent-500/40">
            <span className="text-xs font-medium text-accent-300">
              {problem.errorCategory.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* Problem Statement */}
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-accent-400" />
            <h3 className="text-lg font-semibold text-white">Problem Statement</h3>
          </div>
          <div className="text-base leading-relaxed text-primary-100">
            <MathContent content={problem.statement} />
          </div>
        </div>

        {/* Sentence Frame (if available) */}
        {problem.sentenceFrame && (
          <div className="mt-6 p-4 rounded-xl bg-accent-500/5 border border-accent-500/20">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-accent-400" />
              </div>
              <div className="flex-1">
                <div className="text-xs uppercase tracking-wider text-accent-400 font-medium mb-2">
                  Sentence Frame (Optional Guide)
                </div>
                <p className="text-sm text-primary-200 italic leading-relaxed">
                  {problem.sentenceFrame}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 p-4 rounded-xl bg-primary-800/40 border border-white/10">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-white mb-1">
                Remember: Check ALL Conditions
              </div>
              <div className="text-xs text-primary-300 leading-relaxed">
                Before applying any theorem, explicitly verify that all hypotheses are satisfied.
                This is where most errors occur!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
