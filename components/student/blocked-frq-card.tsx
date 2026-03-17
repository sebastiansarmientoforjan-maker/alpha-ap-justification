"use client";

import { FRQAssignment } from "@/lib/types/index";
import { Lock, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

interface BlockedFRQCardProps {
  frq: FRQAssignment;
}

export function BlockedFRQCard({ frq }: BlockedFRQCardProps) {
  if (!frq.blocked || !frq.prerequisiteCheck) {
    return null;
  }

  const { problemsCompleted, problemsRequired, weekNumber } = frq.prerequisiteCheck;
  const remaining = problemsRequired - problemsCompleted;
  const progress = (problemsCompleted / problemsRequired) * 100;

  return (
    <div className="relative group rounded-2xl border-2 border-yellow-500/30 bg-yellow-500/5 p-6 backdrop-blur-sm hover:border-yellow-500/50 transition-all">
      {/* Lock Icon Badge */}
      <div className="absolute -top-3 -right-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/50">
          <Lock className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{frq.topic}</h3>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
              {frq.type === "general" ? "General FRQ" : "Topic FRQ"}
            </span>
          </div>
        </div>
      </div>

      {/* Blocked Message */}
      <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-yellow-300 mb-1">
              FRQ Locked
            </p>
            <p className="text-xs text-yellow-200">
              {frq.blockedReason}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary-200">Training Progress</span>
          <span className="text-sm font-semibold text-yellow-400">
            {problemsCompleted} / {problemsRequired} completed
          </span>
        </div>
        <div className="h-3 bg-primary-800/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Call to Action */}
      <Link
        href={`/student/week/${weekNumber}/problems`}
        className="block"
      >
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 rounded-xl font-semibold text-white transition-all shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40">
          <TrendingUp className="w-4 h-4" />
          Complete {remaining} more problem{remaining > 1 ? 's' : ''} to unlock
        </button>
      </Link>

      {/* Info Footer */}
      <div className="mt-4 flex items-center gap-4 text-xs text-primary-400">
        <div className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          <span>Week {weekNumber} Training Required</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Assigned {new Date(frq.assignedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
