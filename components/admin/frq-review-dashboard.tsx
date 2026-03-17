"use client";

import { useState } from "react";
import { FRQAssignment, FRQSubmission } from "@/lib/types";
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight";
import { CardBody, CardContainer, CardItem } from "@/components/ui/card-3d";
import {
  Home,
  FileText,
  Clock,
  CheckCircle2,
  Upload,
  Sparkles,
  Calendar,
  User,
  ChevronRight,
  Target,
  AlertCircle,
} from "lucide-react";
import { GradeFRQModal } from "./grade-frq-modal";

interface FRQWithSubmission {
  assignment: FRQAssignment;
  submission: FRQSubmission | null;
  studentName: string;
}

interface FRQReviewDashboardProps {
  submittedFRQs: FRQWithSubmission[];
  gradedFRQs: FRQWithSubmission[];
}

export function FRQReviewDashboard({ submittedFRQs, gradedFRQs }: FRQReviewDashboardProps) {
  const [selectedFRQ, setSelectedFRQ] = useState<FRQWithSubmission | null>(null);
  const [activeTab, setActiveTab] = useState<"submitted" | "graded">("submitted");

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
      {/* Spotlight Effect */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#00D9FF" />

      {/* Geometric Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#2C4F5E1a_1px,transparent_1px),linear-gradient(to_bottom,#2C4F5E1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-primary-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="/admin"
                className="group flex items-center gap-2 text-primary-200 hover:text-accent-400 transition-all duration-300"
              >
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-accent-500/10 transition-all duration-300">
                  <Home className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Back to Dashboard</span>
              </Link>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">FRQ Review Center</h1>
                <p className="text-sm text-primary-300 mt-0.5">Grade submissions and deliver feedback</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-500/10 to-secondary-500/10 border border-accent-500/30 backdrop-blur-sm">
                <span className="text-sm font-semibold text-accent-300">Sebastian</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            {
              icon: Upload,
              label: "Awaiting Grading",
              value: submittedFRQs.length,
              color: "amber",
              description: "Need MathGrader input",
              pulse: submittedFRQs.length > 0,
            },
            {
              icon: Target,
              label: "Ready to Deliver",
              value: gradedFRQs.length,
              color: "accent",
              description: "Graded, awaiting delivery",
            },
          ].map((stat, index) => (
            <CardContainer key={index} className="w-full">
              <CardBody className="relative group/card w-full h-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:shadow-2xl hover:shadow-accent-500/10 transition-all duration-500">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-500/5 to-secondary-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                <CardItem translateZ="50" className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br backdrop-blur-sm ${
                        stat.color === "amber"
                          ? "from-amber-500/20 to-amber-600/10"
                          : "from-accent-500/20 to-accent-600/10"
                      }`}
                    >
                      <stat.icon
                        className={`w-6 h-6 ${
                          stat.color === "amber" ? "text-amber-400" : "text-accent-400"
                        }`}
                        strokeWidth={1.5}
                      />
                    </div>
                    {stat.pulse && (
                      <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                      </div>
                    )}
                  </div>
                </CardItem>

                <CardItem translateZ="60" className="relative">
                  <div className="text-4xl font-bold text-white mb-1 tracking-tight">{stat.value}</div>
                </CardItem>

                <CardItem translateZ="40" className="relative">
                  <div className="text-xs uppercase tracking-wider text-primary-400 font-medium mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-primary-500">{stat.description}</div>
                </CardItem>

                <div
                  className={`absolute -inset-px rounded-2xl bg-gradient-to-r opacity-0 group-hover/card:opacity-100 blur transition-opacity duration-500 -z-10 ${
                    stat.color === "amber"
                      ? "from-amber-500/20 to-orange-500/20"
                      : "from-accent-500/20 to-secondary-500/20"
                  }`}
                />
              </CardBody>
            </CardContainer>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab("submitted")}
            className={`group relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
              activeTab === "submitted"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/50"
                : "bg-white/5 text-primary-300 hover:bg-white/10 backdrop-blur-sm border border-white/10"
            }`}
          >
            <div className="relative flex items-center gap-3">
              <Upload className="w-5 h-5" />
              <span>Awaiting Grading ({submittedFRQs.length})</span>
              {activeTab === "submitted" && (
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-20 blur-xl rounded-xl" />
              )}
            </div>
          </button>

          <button
            onClick={() => setActiveTab("graded")}
            className={`group relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
              activeTab === "graded"
                ? "bg-gradient-to-r from-accent-500 to-secondary-500 text-white shadow-lg shadow-accent-500/50"
                : "bg-white/5 text-primary-300 hover:bg-white/10 backdrop-blur-sm border border-white/10"
            }`}
          >
            <div className="relative flex items-center gap-3">
              <Target className="w-5 h-5" />
              <span>Ready to Deliver ({gradedFRQs.length})</span>
              {activeTab === "graded" && (
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-500 to-secondary-500 opacity-20 blur-xl rounded-xl" />
              )}
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-glass overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 via-transparent to-secondary-500/5 pointer-events-none" />

          <div className="relative p-8">
            {activeTab === "submitted" && (
              <>
                {submittedFRQs.length > 0 ? (
                  <div className="space-y-4">
                    {submittedFRQs.map((frq) => (
                      <div
                        key={frq.assignment.id}
                        className="group relative rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-orange-500/5 backdrop-blur-sm p-6 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-500"
                      >
                        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 -z-10" />

                        <div className="flex items-center justify-between gap-6">
                          {/* Student Info */}
                          <div className="flex items-center gap-6 flex-1">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500/40 flex items-center justify-center backdrop-blur-sm">
                              <User className="w-8 h-8 text-amber-300" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-white group-hover:text-amber-300 transition-colors">
                                  {frq.studentName}
                                </h3>
                                <div className="inline-flex px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                                  <span className="text-xs font-medium text-amber-300">Needs Grading</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-primary-300">
                                <div className="flex items-center gap-1.5">
                                  <FileText className="w-4 h-4" />
                                  <span>
                                    {frq.assignment.type === "general" ? "General FRQ" : `Topic: ${frq.assignment.topic}`}
                                  </span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-primary-400" />
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-4 h-4" />
                                  <span>Submitted: {frq.submission ? new Date(frq.submission.submittedAt).toLocaleDateString() : "N/A"}</span>
                                </div>
                              </div>

                              {frq.submission && (
                                <div className="mt-3 flex items-center gap-2">
                                  <span className="text-xs text-primary-400">Self-eval:</span>
                                  <div className="text-sm font-semibold text-amber-300">
                                    {frq.submission.selfEvaluation.score}/9
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            onClick={() => setSelectedFRQ(frq)}
                            className="group/btn relative px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/50 hover:scale-105 flex items-center gap-2"
                          >
                            <Sparkles className="w-5 h-5" />
                            <span>Grade with AI</span>
                            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-20 blur-xl rounded-xl" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-24 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/30 flex items-center justify-center backdrop-blur-sm">
                      <CheckCircle2 className="w-10 h-10 text-green-400" />
                    </div>
                    <div className="text-lg font-medium text-white mb-2">All Caught Up!</div>
                    <div className="text-sm text-primary-400">No FRQs awaiting grading</div>
                  </div>
                )}
              </>
            )}

            {activeTab === "graded" && (
              <>
                {gradedFRQs.length > 0 ? (
                  <div className="space-y-4">
                    {gradedFRQs.map((frq) => (
                      <div
                        key={frq.assignment.id}
                        className="group relative rounded-2xl border border-accent-500/30 bg-gradient-to-br from-accent-500/10 via-accent-500/5 to-secondary-500/5 backdrop-blur-sm p-6 hover:border-accent-500/50 hover:shadow-xl hover:shadow-accent-500/20 transition-all duration-500"
                      >
                        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-accent-500/20 to-secondary-500/20 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 -z-10" />

                        <div className="flex items-center justify-between gap-6">
                          <div className="flex items-center gap-6 flex-1">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-500/20 to-secondary-500/20 border-2 border-accent-500/40 flex items-center justify-center backdrop-blur-sm">
                              <User className="w-8 h-8 text-accent-300" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-white">{frq.studentName}</h3>
                                <div className="inline-flex px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/30">
                                  <span className="text-xs font-medium text-accent-300">Graded</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-primary-300">
                                <div className="flex items-center gap-1.5">
                                  <FileText className="w-4 h-4" />
                                  <span>
                                    {frq.assignment.type === "general" ? "General FRQ" : `Topic: ${frq.assignment.topic}`}
                                  </span>
                                </div>
                                {frq.submission?.mathGraderScore !== null && (
                                  <>
                                    <div className="w-1 h-1 rounded-full bg-primary-400" />
                                    <div className="text-sm font-semibold text-accent-300">
                                      AI Score: {frq.submission.mathGraderScore}/9
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <Link
                            href={`/admin/frq-review/${frq.assignment.id}`}
                            className="group/btn relative px-6 py-3 rounded-xl bg-gradient-to-r from-accent-500 to-secondary-500 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-accent-500/50 hover:scale-105 flex items-center gap-2"
                          >
                            <span>Deliver Feedback</span>
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
                      <AlertCircle className="w-10 h-10 text-accent-400 opacity-50" />
                    </div>
                    <div className="text-lg font-medium text-white mb-2">No Graded FRQs</div>
                    <div className="text-sm text-primary-400">FRQs ready for feedback delivery will appear here</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Grade Modal */}
      {selectedFRQ && (
        <GradeFRQModal
          frq={selectedFRQ}
          onClose={() => setSelectedFRQ(null)}
        />
      )}

      {/* Decorative Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
