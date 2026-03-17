"use client";

import { StudentProgressSummary } from "@/lib/types";
import Link from "next/link";
import { TrendingUp, Award, Clock, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";

interface StudentListTableProps {
  studentSummaries: StudentProgressSummary[];
}

export function StudentListTable({ studentSummaries }: StudentListTableProps) {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Student Roster</h2>
        <p className="text-primary-300">
          Monitor student progress and FRQ workflow status
        </p>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {studentSummaries.map((summary) => (
          <div
            key={summary.userId}
            className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-6 hover:border-accent-500/30 hover:shadow-xl hover:shadow-accent-500/10 transition-all duration-500"
          >
            {/* Glow effect on hover */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-accent-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 -z-10" />

            <div className="flex items-center justify-between gap-6">
              {/* Student Info */}
              <div className="flex items-center gap-6 flex-1">
                {/* Avatar Circle */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-500/20 to-secondary-500/20 border-2 border-accent-500/30 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-xl font-bold text-accent-300">
                      {summary.userName.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  {/* Status dot */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary-900 border-2 border-primary-900 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                  </div>
                </div>

                {/* Name and Course */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-accent-300 transition-colors">
                    {summary.userName}
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="inline-flex px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/30">
                      <span className="text-xs font-medium text-accent-300">
                        {summary.course === "calculus-ab"
                          ? "AP Calculus AB"
                          : summary.course === "calculus-bc"
                          ? "AP Calculus BC"
                          : summary.course === "statistics"
                          ? "AP Statistics"
                          : "Precalculus"}
                      </span>
                    </div>
                    <div className="inline-flex px-3 py-1 rounded-full bg-secondary-500/10 border border-secondary-500/30">
                      <span className="text-xs font-medium text-secondary-300 capitalize flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        {summary.currentReasoningStage}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6">
                {/* Recent Quizzes */}
                <div className="text-center px-4">
                  <div className="text-2xl font-bold text-white mb-1">
                    {summary.recentQuizzes.length}
                  </div>
                  <div className="text-xs text-primary-400 uppercase tracking-wider">
                    Quizzes
                  </div>
                </div>

                {/* Divider */}
                <div className="h-12 w-px bg-white/10" />

                {/* Pending FRQs */}
                <div className="text-center px-4">
                  {summary.pendingFRQs.length > 0 ? (
                    <>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span className="text-2xl font-bold text-amber-400">
                          {summary.pendingFRQs.length}
                        </span>
                      </div>
                      <div className="text-xs text-amber-400 uppercase tracking-wider">
                        Pending
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-primary-400 mb-1">0</div>
                      <div className="text-xs text-primary-400 uppercase tracking-wider">
                        Pending
                      </div>
                    </>
                  )}
                </div>

                {/* Divider */}
                <div className="h-12 w-px bg-white/10" />

                {/* Completed FRQs */}
                <div className="text-center px-4">
                  {summary.completedFRQs.length > 0 ? (
                    <>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-2xl font-bold text-green-400">
                          {summary.completedFRQs.length}
                        </span>
                      </div>
                      <div className="text-xs text-green-400 uppercase tracking-wider">
                        Complete
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-primary-400 mb-1">0</div>
                      <div className="text-xs text-primary-400 uppercase tracking-wider">
                        Complete
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/admin/student/${summary.userId}`}
                className="group/btn relative px-6 py-3 rounded-xl bg-gradient-to-r from-accent-500 to-secondary-500 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-accent-500/50 hover:scale-105 flex items-center gap-2"
              >
                <span>View Details</span>
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-500 to-secondary-500 opacity-20 blur-xl rounded-xl" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {studentSummaries.length === 0 && (
        <div className="py-24 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent-500/20 to-secondary-500/20 border border-accent-500/30 flex items-center justify-center backdrop-blur-sm">
            <Award className="w-10 h-10 text-accent-400 opacity-50" />
          </div>
          <div className="text-lg font-medium text-white mb-2">No Students Found</div>
          <div className="text-sm text-primary-400">
            Students will appear here once enrolled in the program
          </div>
        </div>
      )}
    </div>
  );
}
