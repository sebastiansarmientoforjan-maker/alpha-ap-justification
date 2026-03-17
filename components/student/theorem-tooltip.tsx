"use client";

import { BookOpen, CheckSquare } from "lucide-react";

interface TheoremTooltipProps {
  theorem: {
    name: string;
    statement: string;
    hypotheses: string[];
  };
}

export function TheoremTooltip({ theorem }: TheoremTooltipProps) {
  return (
    <div className="bg-gradient-to-br from-indigo-900/20 to-blue-900/20 backdrop-blur-xl border border-indigo-500/30 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-indigo-400" />
        </div>
        <h3 className="text-xl font-bold text-indigo-400">{theorem.name}</h3>
      </div>

      <div className="space-y-4">
        {/* Theorem Statement */}
        <div>
          <div className="text-sm font-semibold text-slate-300 mb-2">Statement:</div>
          <div className="text-sm text-slate-400 bg-slate-900/50 rounded-lg p-4 border border-slate-700">
            {theorem.statement}
          </div>
        </div>

        {/* Hypotheses */}
        <div>
          <div className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-indigo-400" />
            Hypotheses (Conditions to Verify):
          </div>
          <ul className="space-y-2">
            {theorem.hypotheses.map((hypothesis, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm text-slate-400 bg-slate-900/50 rounded-lg p-3 border border-slate-700"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-xs font-semibold text-indigo-400">
                  {index + 1}
                </span>
                <span className="flex-1 pt-0.5">{hypothesis}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Reminder */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
          <div className="text-xs font-semibold text-amber-400 mb-1">Critical Reminder:</div>
          <div className="text-xs text-slate-400">
            A theorem can only be applied when ALL hypotheses are satisfied. If even one hypothesis fails, the theorem's conclusion cannot be guaranteed.
          </div>
        </div>
      </div>
    </div>
  );
}
