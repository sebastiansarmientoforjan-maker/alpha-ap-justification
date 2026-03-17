"use client";

import Link from "next/link";
import { CheckCircle2, Circle, Lock, ArrowRight } from "lucide-react";

interface WeekPhase {
  week: number;
  title: string;
  focus: string;
  scaffolding: string;
  status: "completed" | "current" | "upcoming";
}

interface ProgramRoadmapProps {
  userProgress?: {
    currentWeek: number;
    completedWeeks: number[];
  };
}

const phases: WeekPhase[] = [
  {
    week: 1,
    title: "Foundation",
    focus: "Error-forcing problems — breaking empirical illusions",
    scaffolding: "Full CERC sentence frames provided",
    status: "upcoming",
  },
  {
    week: 2,
    title: "Verification",
    focus: "Condition verification — theorem hypothesis testing",
    scaffolding: "Structural outline only",
    status: "upcoming",
  },
  {
    week: 3,
    title: "Argumentation",
    focus: "Global reasoning and communication precision",
    scaffolding: "Independent construction",
    status: "upcoming",
  },
  {
    week: 4,
    title: "Synthesis",
    focus: "Integrated AP FRQ assessment",
    scaffolding: "Timed AP conditions",
    status: "upcoming",
  },
];

export function ProgramRoadmap({ userProgress }: ProgramRoadmapProps) {
  // Determine status for each week based on user progress
  const getWeekStatus = (weekNumber: number): "completed" | "current" | "upcoming" => {
    if (!userProgress) return "upcoming";

    if (userProgress.completedWeeks.includes(weekNumber)) {
      return "completed";
    }
    if (weekNumber === userProgress.currentWeek) {
      return "current";
    }
    return "upcoming";
  };

  // Check if week is accessible
  const isWeekAccessible = (weekNumber: number): boolean => {
    if (!userProgress) return false;
    return weekNumber <= userProgress.currentWeek;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-6">
        {phases.map((phase, index) => {
          const status = getWeekStatus(phase.week);
          const isAccessible = isWeekAccessible(phase.week);
          const CardWrapper = isAccessible ? Link : "div";

          return (
            <CardWrapper
              key={phase.week}
              href={isAccessible ? `/student/week/${phase.week}` : undefined}
              className={`relative group block ${
                isAccessible ? "cursor-pointer" : "cursor-not-allowed opacity-60"
              }`}
            >
              {/* Connection Line */}
              {index < phases.length - 1 && (
                <div className={`absolute left-6 top-16 w-0.5 h-[calc(100%+1.5rem)] bg-gradient-to-b ${
                  status === "completed"
                    ? "from-accent-400/60 to-accent-500/20"
                    : "from-accent-500/40 to-accent-500/10"
                }`} />
              )}

              {/* Week Card */}
              <div className="relative flex gap-6">
                {/* Week Number Circle */}
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
                    status === "completed"
                      ? "border-accent-400 bg-accent-500/20"
                      : status === "current"
                      ? "border-accent-400 bg-accent-500/10 animate-pulse"
                      : "border-accent-500/40 bg-primary-800"
                  } ${
                    isAccessible ? "group-hover:border-accent-400 group-hover:bg-accent-500/20" : ""
                  }`}>
                    {status === "completed" ? (
                      <CheckCircle2 className="w-6 h-6 text-accent-400" strokeWidth={2} />
                    ) : !isAccessible ? (
                      <Lock className="w-5 h-5 text-primary-400" strokeWidth={2} />
                    ) : (
                      <span className={`text-lg font-bold ${
                        status === "current" ? "text-accent-300" : "text-accent-400"
                      }`}>
                        {phase.week}
                      </span>
                    )}
                  </div>
                  {/* Glow Effect */}
                  {isAccessible && (
                    <div className="absolute inset-0 rounded-full bg-accent-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className={`relative rounded-xl border p-6 backdrop-blur-sm transition-all duration-300 ${
                    status === "current"
                      ? "border-accent-500/50 bg-accent-500/5 shadow-lg shadow-accent-500/10"
                      : status === "completed"
                      ? "border-accent-500/30 bg-primary-800/40"
                      : "border-white/10 bg-primary-800/40"
                  } ${
                    isAccessible
                      ? "group-hover:border-accent-500/40 group-hover:bg-primary-800/60 group-hover:shadow-lg group-hover:shadow-accent-500/10"
                      : ""
                  }`}>
                    {/* Status Badge */}
                    {status === "current" && (
                      <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-accent-500 text-primary-900 text-xs font-bold uppercase tracking-wider">
                        Active
                      </div>
                    )}

                    {/* Week Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.15em] text-accent-400 font-medium mb-2">
                          Week {phase.week}
                        </div>
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                          {phase.title}
                          {isAccessible && (
                            <ArrowRight className="w-5 h-5 text-accent-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                          )}
                        </h3>
                      </div>
                    </div>

                    {/* Focus */}
                    <div className="mb-4">
                      <div className="text-xs uppercase tracking-wider text-primary-400 mb-2">
                        Focus
                      </div>
                      <p className="text-primary-100 leading-relaxed">
                        {phase.focus}
                      </p>
                    </div>

                    {/* Scaffolding */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-primary-400 mb-2">
                          Scaffolding Level
                        </div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                          status === "completed"
                            ? "bg-accent-500/20 border-accent-500/40"
                            : "bg-accent-500/10 border-accent-500/20"
                        }`}>
                          <Circle className={`w-3 h-3 ${
                            status === "completed" ? "text-accent-300 fill-accent-300" : "text-accent-400 fill-accent-400"
                          }`} />
                          <span className={`text-sm ${
                            status === "completed" ? "text-accent-200" : "text-accent-300"
                          }`}>
                            {phase.scaffolding}
                          </span>
                        </div>
                      </div>

                      {/* Access Indicator */}
                      {isAccessible && status !== "completed" && (
                        <div className="text-xs uppercase tracking-wider text-accent-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to enter →
                        </div>
                      )}
                    </div>

                    {/* Hover Glow */}
                    {isAccessible && (
                      <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-accent-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 -z-10" />
                    )}
                  </div>
                </div>
              </div>
            </CardWrapper>
          );
        })}
      </div>
    </div>
  );
}
