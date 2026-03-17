"use client";

import { Trophy, Zap, Target } from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";

interface ProgressHeaderProps {
  xp: number;
  reasoningStage: "empirical" | "generic" | "formal";
  attemptNumber: number;
  maxAttempts: number;
}

const REASONING_STAGE_CONFIG = {
  empirical: {
    label: "Empirical Reasoning",
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    textColor: "text-yellow-400",
    description: "Building intuition through examples",
  },
  generic: {
    label: "Generic Reasoning",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-400",
    description: "Recognizing patterns and structure",
  },
  formal: {
    label: "Formal Reasoning",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    textColor: "text-purple-400",
    description: "Rigorous deductive argumentation",
  },
};

export function ProgressHeader({
  xp,
  reasoningStage,
  attemptNumber,
  maxAttempts,
}: ProgressHeaderProps) {
  const stageConfig = REASONING_STAGE_CONFIG[reasoningStage];

  return (
    <div className="h-20 border-b border-white/10 bg-primary-900/95 backdrop-blur-sm px-8">
      <div className="h-full flex items-center justify-between">
        {/* Left: XP Counter */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-500 to-secondary-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-primary-400 font-medium">
                Total XP
              </div>
              <div className="text-2xl font-bold text-white flex items-center gap-1">
                <NumberTicker value={xp} />
                <span className="text-sm text-accent-400">XP</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-10 w-px bg-white/10" />

          {/* Reasoning Stage Indicator */}
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full ${stageConfig.bgColor} border ${stageConfig.borderColor} flex items-center justify-center`}
            >
              <Trophy className={`w-5 h-5 ${stageConfig.textColor}`} />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-primary-400 font-medium">
                Reasoning Stage
              </div>
              <div className={`text-sm font-semibold ${stageConfig.textColor}`}>
                {stageConfig.label}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Attempt Counter */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-primary-400 font-medium">
              Current Attempt
            </div>
            <div className="text-lg font-bold text-white">
              {attemptNumber} / {maxAttempts}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-800/60 border border-white/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-accent-400" />
          </div>
        </div>
      </div>

      {/* Attempt Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-800/60">
        <div
          className={`h-full bg-gradient-to-r transition-all duration-500 ${
            attemptNumber === maxAttempts
              ? "from-red-500 to-orange-500"
              : "from-accent-500 to-secondary-500"
          }`}
          style={{ width: `${(attemptNumber / maxAttempts) * 100}%` }}
        />
      </div>
    </div>
  );
}
