"use client";

import { FRQAssignment, User } from "@/lib/types";
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight";
import { CardBody, CardContainer, CardItem } from "@/components/ui/card-3d";
import { BlockedFRQCard } from "./blocked-frq-card";
import {
  Home,
  FileText,
  Clock,
  CheckCircle2,
  Award,
  TrendingUp,
  Calendar,
  ChevronRight,
  Sparkles,
  Target,
  Zap,
  Lock,
} from "lucide-react";

interface StudentDashboardProps {
  user: User;
  pendingFRQs: FRQAssignment[];
  submittedFRQs: FRQAssignment[];
  gradedFRQs: FRQAssignment[];
  completedFRQs: FRQAssignment[];
  totalXP: number;
  badges: string[];
}

export function StudentDashboard({
  user,
  pendingFRQs,
  submittedFRQs,
  gradedFRQs,
  completedFRQs,
  totalXP,
  badges,
}: StudentDashboardProps) {
  // Separate blocked FRQs from active ones
  const blockedFRQs = pendingFRQs.filter(frq => frq.blocked);
  const activePendingFRQs = pendingFRQs.filter(frq => !frq.blocked);
  const allActiveFRQs = [...activePendingFRQs, ...submittedFRQs, ...gradedFRQs];

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
                href="/"
                className="group flex items-center gap-2 text-primary-200 hover:text-accent-400 transition-all duration-300"
              >
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-accent-500/10 transition-all duration-300">
                  <Home className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Welcome back, {user.name.split(" ")[0]}
                </h1>
                <p className="text-sm text-primary-300 mt-0.5">AP Math Justification Training</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* XP Display */}
              <div className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-500/10 to-secondary-500/10 border border-accent-500/30 backdrop-blur-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent-400" />
                <span className="text-sm font-semibold text-accent-300">{totalXP} XP</span>
              </div>

              {/* Badges */}
              {badges.length > 0 && (
                <div className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 backdrop-blur-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold text-amber-300">{badges.length} Badges</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: Clock,
              label: "Pending",
              value: pendingFRQs.length,
              color: "amber",
              description: "Awaiting submission",
            },
            {
              icon: FileText,
              label: "Submitted",
              value: submittedFRQs.length,
              color: "secondary",
              description: "Under review",
            },
            {
              icon: Target,
              label: "Graded",
              value: gradedFRQs.length,
              color: "accent",
              description: "Feedback ready",
            },
            {
              icon: CheckCircle2,
              label: "Completed",
              value: completedFRQs.length,
              color: "green",
              description: "Fully reviewed",
            },
          ].map((stat, index) => (
            <CardContainer key={index} className="w-full">
              <CardBody className="relative group/card w-full h-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:shadow-2xl hover:shadow-accent-500/10 transition-all duration-500">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-500/5 to-secondary-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                <CardItem translateZ="50" className="relative">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br mb-4 ${
                      stat.color === "accent"
                        ? "from-accent-500/20 to-accent-600/10"
                        : stat.color === "secondary"
                        ? "from-secondary-500/20 to-secondary-600/10"
                        : stat.color === "amber"
                        ? "from-amber-500/20 to-amber-600/10"
                        : "from-green-500/20 to-green-600/10"
                    } backdrop-blur-sm`}
                  >
                    <stat.icon
                      className={`w-6 h-6 ${
                        stat.color === "accent"
                          ? "text-accent-400"
                          : stat.color === "secondary"
                          ? "text-secondary-400"
                          : stat.color === "amber"
                          ? "text-amber-400"
                          : "text-green-400"
                      }`}
                      strokeWidth={1.5}
                    />
                  </div>
                </CardItem>

                <CardItem translateZ="60" className="relative">
                  <div className="text-4xl font-bold text-white mb-1 tracking-tight">
                    {stat.value}
                  </div>
                </CardItem>

                <CardItem translateZ="40" className="relative">
                  <div className="text-xs uppercase tracking-wider text-primary-400 font-medium mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-primary-500">{stat.description}</div>
                </CardItem>

                <div
                  className={`absolute -inset-px rounded-2xl bg-gradient-to-r ${
                    stat.color === "accent"
                      ? "from-accent-500/20 to-secondary-500/20"
                      : stat.color === "secondary"
                      ? "from-secondary-500/20 to-accent-500/20"
                      : stat.color === "amber"
                      ? "from-amber-500/20 to-orange-500/20"
                      : "from-green-500/20 to-emerald-500/20"
                  } opacity-0 group-hover/card:opacity-100 blur transition-opacity duration-500 -z-10`}
                />
              </CardBody>
            </CardContainer>
          ))}
        </div>

        {/* START HERE Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-full">
              <Sparkles className="w-5 h-5 text-cyan-300" />
              <span className="text-sm font-bold text-cyan-200 uppercase tracking-wider">Start Here</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 to-transparent" />
          </div>
          <p className="text-sm text-primary-400 ml-1">
            Complete this introduction before beginning the 4-week training program
          </p>
        </div>

        {/* Course Introduction Video Section */}
        <div className="relative rounded-3xl border-2 border-cyan-500/40 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-2xl shadow-glass overflow-hidden mb-16">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />

          <div className="relative p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Course Introduction</h2>
              </div>
              <p className="text-primary-300">
                Watch this 5-minute overview to understand the CERC Framework before starting Week 1
              </p>
            </div>

            <Link href="/student/intro">
              <div className="group relative rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm p-6 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-500 cursor-pointer">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 -z-10" />

                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center backdrop-blur-sm bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border-cyan-500/50">
                        <svg className="w-8 h-8 text-cyan-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-primary-900 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">NEW</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          The CERC Framework Introduction
                        </h3>
                        <div className="inline-flex px-3 py-1 rounded-full border bg-cyan-500/20 border-cyan-500/40">
                          <span className="text-xs font-medium text-cyan-300">Watch First</span>
                        </div>
                      </div>

                      <p className="text-sm text-primary-300 mb-3">
                        Learn the 4-step framework: Claim → Evidence → Reasoning → Conditions
                      </p>

                      <div className="flex items-center gap-6 text-xs text-primary-400">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>~5 minutes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          <span>Speed controls up to 2x</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          <span>Foundation for Week 1-4</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    <span className="text-sm font-medium">Watch Video</span>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* CERC Training Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <h2 className="text-3xl font-bold text-white">CERC Training Program</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-white/30 to-transparent" />
          </div>
          <p className="text-sm text-primary-400 ml-1">
            4-week progression from scaffolded practice to independent mastery
          </p>
        </div>

        {/* Week 1 Training */}
        <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-glass overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

          <div className="relative p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-white">Week 1</h3>
                <div className="text-sm text-primary-400">•</div>
                <div className="text-sm font-medium text-blue-300">Error-Forcing Problems</div>
              </div>
              <p className="text-primary-300">
                Master justification skills by learning when theorems cannot be applied
              </p>
            </div>

            <Link href="/student/week/1">
              <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-6 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 -z-10" />

                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center backdrop-blur-sm bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30">
                        <Sparkles className="w-8 h-8 text-blue-300" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                          Introduction to Error-Forcing
                        </h3>
                        <div className="inline-flex px-3 py-1 rounded-full border bg-green-500/10 border-green-500/30">
                          <span className="text-xs font-medium text-green-300">Available</span>
                        </div>
                        <div className="inline-flex px-3 py-1 rounded-full border bg-blue-500/10 border-blue-500/30">
                          <span className="text-xs font-medium text-blue-300">0 of 3 complete</span>
                        </div>
                      </div>

                      <p className="text-sm text-primary-300 mb-3">
                        Breaking empirical illusions - learn to identify when theorems cannot be applied
                      </p>

                      <div className="flex items-center gap-6 text-xs text-primary-400">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          <span>3 Problems</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>~50 min remaining</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          <span>0 XP earned</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors">
                    <span className="text-sm font-medium">Start Training</span>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Week 2 Training */}
        <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-glass overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none" />

          <div className="relative p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-white">Week 2</h3>
                <div className="text-sm text-primary-400">•</div>
                <div className="text-sm font-medium text-purple-300">Condition Verification</div>
              </div>
              <p className="text-primary-300">
                Verify theorem conditions explicitly with IVT, MVT, and EVT
              </p>
            </div>

            <Link href="/student/week/2">
              <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-6 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500 cursor-pointer">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 -z-10" />

                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-2xl font-bold text-purple-300">2</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                          Theorem Condition Mastery
                        </h3>
                        <div className="inline-flex px-3 py-1 rounded-full border bg-green-500/10 border-green-500/30">
                          <span className="text-xs font-medium text-green-300">Available</span>
                        </div>
                        <div className="inline-flex px-3 py-1 rounded-full border bg-purple-500/10 border-purple-500/30">
                          <span className="text-xs font-medium text-purple-300">0 of 4 complete</span>
                        </div>
                      </div>

                      <p className="text-sm text-primary-300 mb-3">
                        Master IVT, MVT, and EVT by explicitly verifying theorem conditions
                      </p>

                      <div className="flex items-center gap-6 text-xs text-primary-400">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          <span>4 Problems</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>~90 min remaining</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          <span>0 XP earned</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors">
                    <span className="text-sm font-medium">Continue Training</span>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Week 3 Training */}
        <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-glass overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-teal-500/5 pointer-events-none" />

          <div className="relative p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-white">Week 3</h3>
                <div className="text-sm text-primary-400">•</div>
                <div className="text-sm font-medium text-green-300">Global Argumentation</div>
              </div>
              <p className="text-primary-300">
                Complete CERC proofs from blank canvas with precision communication
              </p>
            </div>

            <Link href="/student/week/3">
              <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-6 hover:border-green-500/30 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-500 cursor-pointer">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-green-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 -z-10" />

                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 bg-gradient-to-br from-green-500/20 to-teal-500/20 border-green-500/30 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-2xl font-bold text-green-300">3</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white group-hover:text-green-300 transition-colors">
                          Independent Proof Construction
                        </h3>
                        <div className="inline-flex px-3 py-1 rounded-full border bg-green-500/10 border-green-500/30">
                          <span className="text-xs font-medium text-green-300">Available</span>
                        </div>
                        <div className="inline-flex px-3 py-1 rounded-full border bg-green-500/10 border-green-500/30">
                          <span className="text-xs font-medium text-green-300">0 of 5 complete</span>
                        </div>
                      </div>

                      <p className="text-sm text-primary-300 mb-3">
                        Complete CERC proofs from blank canvas with precision communication
                      </p>

                      <div className="flex items-center gap-6 text-xs text-primary-400">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          <span>5 Problems</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>~135 min remaining</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          <span>0 XP earned</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-green-400 group-hover:text-green-300 transition-colors">
                    <span className="text-sm font-medium">Continue Training</span>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Week 4 Boss Battle */}
        <div className="relative rounded-3xl border-2 border-red-500/40 bg-white/5 backdrop-blur-2xl shadow-glass overflow-hidden mb-16">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/10 pointer-events-none" />

          <div className="relative p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-white">Week 4</h3>
                <div className="text-sm text-primary-400">•</div>
                <div className="text-sm font-medium text-red-300">Boss Battle</div>
                <div className="inline-flex px-3 py-1 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50">
                  <span className="text-xs font-bold text-red-300 uppercase tracking-wider">Final Challenge</span>
                </div>
              </div>
              <p className="text-primary-300">
                Three-phase integrated challenge with timed curveball twist
              </p>
            </div>

            <Link href="/student/week/4">
              <div className="group relative rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-sm p-6 hover:border-red-500/40 hover:shadow-xl hover:shadow-red-500/20 transition-all duration-500 cursor-pointer">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 -z-10" />

                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 bg-gradient-to-br from-red-500/30 to-orange-500/30 border-red-500/40 flex items-center justify-center backdrop-blur-sm">
                        <Sparkles className="w-8 h-8 text-red-300" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white group-hover:text-red-300 transition-colors">
                          Ultimate Mastery Test
                        </h3>
                        <div className="inline-flex px-3 py-1 rounded-full border bg-green-500/10 border-green-500/30">
                          <span className="text-xs font-medium text-green-300">Available</span>
                        </div>
                        <div className="inline-flex px-3 py-1 rounded-full border bg-red-500/20 border-red-500/40">
                          <span className="text-xs font-medium text-red-300">Not Started</span>
                        </div>
                      </div>

                      <p className="text-sm text-primary-300 mb-3">
                        Three-phase integrated AP FRQ with timed curveball twist
                      </p>

                      <div className="flex items-center gap-6 text-xs text-primary-400">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          <span>3 Phases</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>~50 min total</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          <span>Up to 195 XP</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-red-400 group-hover:text-red-300 transition-colors">
                    <span className="text-sm font-medium">Enter Boss Battle</span>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* FRQ Section Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-primary-800 px-6 py-2 rounded-full border border-white/20">
              <span className="text-sm font-medium text-primary-300 uppercase tracking-wider">Applied Practice</span>
            </div>
          </div>
        </div>

        {/* FRQ Assignments Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <h2 className="text-3xl font-bold text-white">FRQ Assignments</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-white/30 to-transparent" />
          </div>
          <p className="text-sm text-primary-400 ml-1">
            Weekly free-response questions assigned after MathAcademy quiz completion
          </p>
        </div>

        {/* FRQ Cards */}
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
