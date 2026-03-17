"use client";

import { useState } from "react";
import { StudentProgressSummary, Quiz } from "@/lib/types";
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight";
import { CardBody, CardContainer, CardItem } from "@/components/ui/card-3d";
import {
  Home,
  Users,
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  FileText,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { StudentListTable } from "./student-list-table";
import { QuizManagementPanel } from "./quiz-management-panel";

interface AdminDashboardProps {
  studentSummaries: StudentProgressSummary[];
  unassignedQuizzes: Quiz[];
}

export function AdminDashboard({
  studentSummaries,
  unassignedQuizzes
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"students" | "quizzes">("students");

  // Calculate stats
  const totalStudents = studentSummaries.length;
  const totalQuizzes = studentSummaries.reduce((sum, s) => sum + s.recentQuizzes.length, 0);
  const pendingFRQs = studentSummaries.reduce((sum, s) => sum + s.pendingFRQs.length, 0);
  const unassignedCount = unassignedQuizzes.length;

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
                <h1 className="text-2xl font-bold text-white tracking-tight">Admin Dashboard</h1>
                <p className="text-sm text-primary-300 mt-0.5">FRQ Workflow Management</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/students"
                className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-500/20 to-secondary-500/20 border border-accent-500/40 hover:border-accent-500/60 backdrop-blur-sm transition-all"
              >
                <Users className="w-4 h-4 text-accent-300" />
                <span className="text-sm font-semibold text-accent-300">Student Progress</span>
                <ChevronRight className="w-4 h-4 text-accent-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-500/10 to-secondary-500/10 border border-accent-500/30 backdrop-blur-sm">
                <span className="text-sm font-semibold text-accent-300">Sebastian</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Stats Grid with 3D Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: Users,
              label: "Students",
              value: totalStudents,
              color: "accent",
              description: "Total enrolled",
            },
            {
              icon: ClipboardList,
              label: "Quizzes",
              value: totalQuizzes,
              color: "secondary",
              description: "Completed",
            },
            {
              icon: Clock,
              label: "Pending FRQs",
              value: pendingFRQs,
              color: "amber",
              description: "Awaiting submission",
            },
            {
              icon: AlertCircle,
              label: "Unassigned",
              value: unassignedCount,
              color: "red",
              description: "Action required",
              pulse: unassignedCount > 0,
            },
          ].map((stat, index) => (
            <CardContainer key={index} className="w-full">
              <CardBody className="relative group/card w-full h-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:shadow-2xl hover:shadow-accent-500/10 transition-all duration-500">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-500/5 to-secondary-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                <CardItem translateZ="50" className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${
                      stat.color === "accent" ? "from-accent-500/20 to-accent-600/10" :
                      stat.color === "secondary" ? "from-secondary-500/20 to-secondary-600/10" :
                      stat.color === "amber" ? "from-amber-500/20 to-amber-600/10" :
                      "from-red-500/20 to-red-600/10"
                    } backdrop-blur-sm`}>
                      <stat.icon className={`w-6 h-6 ${
                        stat.color === "accent" ? "text-accent-400" :
                        stat.color === "secondary" ? "text-secondary-400" :
                        stat.color === "amber" ? "text-amber-400" :
                        "text-red-400"
                      }`} strokeWidth={1.5} />
                    </div>
                    {stat.pulse && (
                      <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </div>
                    )}
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
                  <div className="text-xs text-primary-500">
                    {stat.description}
                  </div>
                </CardItem>

                {/* Glow Effect */}
                <div className={`absolute -inset-px rounded-2xl bg-gradient-to-r ${
                  stat.color === "accent" ? "from-accent-500/20 to-secondary-500/20" :
                  stat.color === "secondary" ? "from-secondary-500/20 to-accent-500/20" :
                  stat.color === "amber" ? "from-amber-500/20 to-orange-500/20" :
                  "from-red-500/20 to-pink-500/20"
                } opacity-0 group-hover/card:opacity-100 blur transition-opacity duration-500 -z-10`} />
              </CardBody>
            </CardContainer>
          ))}
        </div>

        {/* FRQ Review Center Link */}
        <Link
          href="/admin/frq-review"
          className="group block relative rounded-2xl border border-accent-500/30 bg-gradient-to-br from-accent-500/10 via-accent-500/5 to-secondary-500/5 backdrop-blur-xl p-6 hover:border-accent-500/50 hover:shadow-xl hover:shadow-accent-500/20 transition-all duration-500 mb-8"
        >
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-accent-500/20 to-secondary-500/20 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 -z-10" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-500/20 to-secondary-500/20 border border-accent-500/30 flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-7 h-7 text-accent-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-accent-300 transition-colors">
                  FRQ Review Center
                </h3>
                <p className="text-sm text-primary-300">
                  Grade submissions with MathGrader.AI and deliver feedback
                </p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-accent-400 group-hover:translate-x-2 transition-transform" />
          </div>
        </Link>

        {/* Tabs - Premium Style */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab("students")}
            className={`group relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
              activeTab === "students"
                ? "bg-gradient-to-r from-accent-500 to-secondary-500 text-white shadow-lg shadow-accent-500/50"
                : "bg-white/5 text-primary-300 hover:bg-white/10 backdrop-blur-sm border border-white/10"
            }`}
          >
            <div className="relative flex items-center gap-3">
              <Users className="w-5 h-5" />
              <span>Student Overview</span>
              {activeTab === "students" && (
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-500 to-secondary-500 opacity-20 blur-xl rounded-xl" />
              )}
            </div>
          </button>

          <button
            onClick={() => setActiveTab("quizzes")}
            className={`group relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
              activeTab === "quizzes"
                ? "bg-gradient-to-r from-accent-500 to-secondary-500 text-white shadow-lg shadow-accent-500/50"
                : "bg-white/5 text-primary-300 hover:bg-white/10 backdrop-blur-sm border border-white/10"
            }`}
          >
            <div className="relative flex items-center gap-3">
              <FileText className="w-5 h-5" />
              <span>Quiz Management</span>
              {unassignedCount > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[24px] h-6 px-2 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg shadow-red-500/50">
                  {unassignedCount}
                </div>
              )}
              {activeTab === "quizzes" && (
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-500 to-secondary-500 opacity-20 blur-xl rounded-xl" />
              )}
            </div>
          </button>
        </div>

        {/* Content with Glass Effect */}
        <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-glass overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 via-transparent to-secondary-500/5 pointer-events-none" />

          <div className="relative">
            {activeTab === "students" && (
              <StudentListTable studentSummaries={studentSummaries} />
            )}

            {activeTab === "quizzes" && (
              <QuizManagementPanel
                unassignedQuizzes={unassignedQuizzes}
                studentSummaries={studentSummaries}
              />
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
