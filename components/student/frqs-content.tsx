"use client";

import { FRQAssignment } from "@/lib/types";
import Link from "next/link";
import { BlockedFRQCard } from "./blocked-frq-card";
import {
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Sparkles,
  Target,
  Lock,
} from "lucide-react";

interface FRQsContentProps {
  pendingFRQs: FRQAssignment[];
  submittedFRQs: FRQAssignment[];
  gradedFRQs: FRQAssignment[];
  completedFRQs: FRQAssignment[];
}

export function FRQsContent({
  pendingFRQs,
  submittedFRQs,
  gradedFRQs,
  completedFRQs,
}: FRQsContentProps) {
  // Separate blocked FRQs from active ones
  const blockedFRQs = pendingFRQs.filter(frq => frq.blocked);
  const activePendingFRQs = pendingFRQs.filter(frq => !frq.blocked);
  const allActiveFRQs = [...activePendingFRQs, ...submittedFRQs, ...gradedFRQs];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
      {/* Geometric Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#2C4F5E1a_1px,transparent_1px),linear-gradient(to_bottom,#2C4F5E1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">FRQ Assignments</h1>
          <p className="text-lg text-primary-200">
            Weekly free-response questions assigned after MathAcademy quiz completion
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Pending", value: activePendingFRQs.length, color: "amber" },
            { label: "Submitted", value: submittedFRQs.length, color: "secondary" },
            { label: "Graded", value: gradedFRQs.length, color: "accent" },
            { label: "Completed", value: completedFRQs.length, color: "green" },
          ].map((stat, index) => (
            <div
              key={index}
              className="relative p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300"
            >
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs uppercase tracking-wider text-primary-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* FRQ Cards Container */}
        <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-glass overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 via-transparent to-secondary-500/5 pointer-events-none" />

          <div className="relative p-8">
            {/* Blocked FRQs Section */}
            {blockedFRQs.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-yellow-300">
                    Locked Assignments ({blockedFRQs.length})
                  </h3>
                </div>
                <p className="text-sm text-yellow-200 mb-4">
                  Complete training problems to unlock these FRQ assignments
                </p>
                <div className="grid grid-cols-1 gap-4">
                  {blockedFRQs.map((frq) => (
                    <BlockedFRQCard key={frq.id} frq={frq} />
                  ))}
                </div>
              </div>
            )}

            {/* Active FRQs Section */}
            {allActiveFRQs.length > 0 && blockedFRQs.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Available Assignments ({allActiveFRQs.length})
                </h3>
              </div>
            )}

            {allActiveFRQs.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {allActiveFRQs.map((frq) => (
                  <div
                    key={frq.id}
                    className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-6 hover:border-accent-500/30 hover:shadow-xl hover:shadow-accent-500/10 transition-all duration-500"
                  >
                    <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-accent-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 -z-10" />

                    <div className="flex items-center justify-between gap-6">
                      {/* FRQ Info */}
                      <div className="flex items-center gap-6 flex-1">
                        {/* Type Icon */}
                        <div className="relative">
                          <div
                            className={`w-16 h-16 rounded-full border-2 flex items-center justify-center backdrop-blur-sm ${
                              frq.type === "general"
                                ? "bg-gradient-to-br from-accent-500/20 to-secondary-500/20 border-accent-500/30"
                                : "bg-gradient-to-br from-secondary-500/20 to-purple-500/20 border-secondary-500/30"
                            }`}
                          >
                            <FileText
                              className={`w-8 h-8 ${
                                frq.type === "general" ? "text-accent-300" : "text-secondary-300"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white group-hover:text-accent-300 transition-colors">
                              {frq.type === "general" ? "General FRQ" : `Topic FRQ: ${frq.topic}`}
                            </h3>
                            <div
                              className={`inline-flex px-3 py-1 rounded-full border ${
                                frq.status === "pending"
                                  ? "bg-amber-500/10 border-amber-500/30"
                                  : frq.status === "submitted"
                                  ? "bg-secondary-500/10 border-secondary-500/30"
                                  : "bg-accent-500/10 border-accent-500/30"
                              }`}
                            >
                              <span
                                className={`text-xs font-medium capitalize ${
                                  frq.status === "pending"
                                    ? "text-amber-300"
                                    : frq.status === "submitted"
                                    ? "text-secondary-300"
                                    : "text-accent-300"
                                }`}
                              >
                                {frq.status === "pending"
                                  ? "Pending"
                                  : frq.status === "submitted"
                                  ? "Submitted"
                                  : "Graded"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-primary-300">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              <span>Due: {new Date(frq.dueDate).toLocaleDateString()}</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-primary-400" />
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4" />
                              <span className="capitalize">
                                {frq.type === "general" ? "Broad Argumentation" : "Topic-Specific"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link
                        href={`/student/frq/${frq.id}`}
                        className="group/btn relative px-6 py-3 rounded-xl bg-gradient-to-r from-accent-500 to-secondary-500 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-accent-500/50 hover:scale-105 flex items-center gap-2"
                      >
                        <span>
                          {frq.status === "pending"
                            ? "Start FRQ"
                            : frq.status === "submitted"
                            ? "View Status"
                            : "View Feedback"}
                        </span>
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        <div className="absolute -inset-1 bg-gradient-to-r from-accent-500 to-secondary-500 opacity-20 blur-xl rounded-xl" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent-500/20 to-secondary-500/20 border border-accent-500/30 flex items-center justify-center backdrop-blur-sm">
                  <FileText className="w-10 h-10 text-accent-400 opacity-50" />
                </div>
                <div className="text-lg font-medium text-white mb-2">No Active FRQs</div>
                <div className="text-sm text-primary-400">
                  Your FRQ assignments will appear here after quiz completions
                </div>
              </div>
            )}

            {/* Completed FRQs Section */}
            {completedFRQs.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/10">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  Completed FRQs ({completedFRQs.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedFRQs.map((frq) => (
                    <div
                      key={frq.id}
                      className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 hover:bg-green-500/10 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white mb-1">
                            {frq.type === "general" ? "General FRQ" : frq.topic}
                          </div>
                          <div className="text-xs text-primary-400">
                            Completed {new Date(frq.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
