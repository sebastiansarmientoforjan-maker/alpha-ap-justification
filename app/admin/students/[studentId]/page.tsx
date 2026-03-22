/**
 * Admin: Student Detail View
 * Shows complete progress timeline and CERC responses
 */
import { getDataService } from "@/services/data";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Trophy,
  Eye,
  Lightbulb,
  CheckCircle,
  TrendingUp,
  Target,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminStudentDetailPage({
  params,
}: {
  params: { studentId: string };
}) {
  const dataService = await getDataService();

  let studentOverview;
  try {
    studentOverview = await dataService.getStudentOverview(params.studentId);
  } catch (error) {
    notFound();
  }

  const allAttempts = await dataService.getStudentAllAttempts(params.studentId);

  // Format date helper
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Breadcrumbs
          items={[
            { label: "Admin", href: "/admin" },
            { label: "Students", href: "/admin/students" },
            { label: studentOverview.studentName },
          ]}
        />

        <div className="flex items-center justify-between mt-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{studentOverview.studentName}</h1>
            <p className="text-primary-200">{studentOverview.studentEmail}</p>
          </div>

          <Link
            href="/admin/students"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Students
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-accent-400" />
              <span className="text-sm text-primary-300">Total XP</span>
            </div>
            <div className="text-3xl font-bold text-accent-400">{studentOverview.totalXP}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-primary-300">Reasoning Stage</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {studentOverview.currentReasoningStage.charAt(0).toUpperCase() +
                studentOverview.currentReasoningStage.slice(1)}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm text-primary-300">Problems Completed</span>
            </div>
            <div className="text-3xl font-bold text-green-400">
              {Object.values(studentOverview.weekSummaries).reduce(
                (sum, week) => sum + week.problemsCompleted,
                0
              )}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-primary-300">Total Attempts</span>
            </div>
            <div className="text-3xl font-bold text-purple-400">{allAttempts.length}</div>
          </div>
        </div>

        {/* Week Summaries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[1, 2, 3, 4].map((weekNum) => {
            const weekData = studentOverview.weekSummaries[weekNum];
            const completion = weekData.totalProblems > 0
              ? Math.round((weekData.problemsCompleted / weekData.totalProblems) * 100)
              : 0;

            return (
              <Link
                key={weekNum}
                href={`/admin/students/${params.studentId}/week/${weekNum}`}
                className="block group"
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 hover:border-accent-500/30 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Week {weekNum}</h3>
                    <span className="text-sm text-primary-400">
                      {weekData.problemsCompleted}/{weekData.totalProblems} problems
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="h-3 bg-primary-800/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent-500 to-secondary-500 rounded-full transition-all"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                    <div className="text-right text-xs text-primary-400 mt-1">{completion}%</div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="text-primary-300">
                      <span className="font-semibold">{weekData.totalAttempts}</span> attempts
                    </div>
                    <div className="text-accent-400">
                      <span className="font-semibold">{weekData.xpEarned}</span> XP
                    </div>
                  </div>

                  {weekData.lastActivity && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-primary-400">
                      <Calendar className="w-3 h-3" />
                      Last: {formatDate(weekData.lastActivity)}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Attempts Timeline */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold mb-6">Recent Attempts</h2>

          {allAttempts.length === 0 && (
            <div className="text-center py-8 text-primary-400">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No practice attempts yet</p>
            </div>
          )}

          <div className="space-y-4">
            {allAttempts.slice(0, 10).map((attempt) => {
              const problem = attempt.problemId;
              const trapIdentified =
                attempt.cercResponse.claim.toLowerCase().includes("does not apply") ||
                attempt.cercResponse.claim.toLowerCase().includes("cannot be used");

              return (
                <div
                  key={attempt.id}
                  className="bg-primary-800/40 rounded-lg p-5 border border-primary-600/30"
                >
                  {/* Attempt Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 rounded bg-accent-500/20 text-accent-300 text-xs font-semibold">
                          Week {attempt.weekNumber}
                        </span>
                        <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 text-xs font-semibold">
                          Attempt #{attempt.attemptNumber}
                        </span>
                        {trapIdentified && (
                          <span className="px-2 py-1 rounded bg-green-500/20 text-green-300 text-xs font-semibold">
                            🎯 Trap Identified
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-semibold text-white">{problem}</h4>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-accent-400 mb-1">
                        +{attempt.xpEarned} XP
                      </div>
                      {attempt.sessionData?.timeSpentSeconds && (
                        <div className="flex items-center gap-2 text-xs text-primary-400">
                          <Clock className="w-3 h-3" />
                          {formatTime(attempt.sessionData.timeSpentSeconds)}
                        </div>
                      )}
                      <div className="text-xs text-primary-400 mt-1">
                        {formatDate(attempt.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* CERC Response */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div className="bg-primary-900/40 rounded p-3 border border-accent-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-accent-500/20 text-accent-300 font-bold text-xs">
                          C
                        </span>
                        <span className="text-xs text-primary-400">Claim</span>
                      </div>
                      <p className="text-sm text-primary-100 line-clamp-2">
                        {attempt.cercResponse.claim || "(empty)"}
                      </p>
                    </div>

                    <div className="bg-primary-900/40 rounded p-3 border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-xs">
                          E
                        </span>
                        <span className="text-xs text-primary-400">Evidence</span>
                      </div>
                      <p className="text-sm text-primary-100 line-clamp-2">
                        {attempt.cercResponse.evidence || "(empty)"}
                      </p>
                    </div>

                    <div className="bg-primary-900/40 rounded p-3 border border-purple-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-xs">
                          R
                        </span>
                        <span className="text-xs text-primary-400">Reasoning</span>
                      </div>
                      <p className="text-sm text-primary-100 line-clamp-2">
                        {attempt.cercResponse.reasoning || "(empty)"}
                      </p>
                    </div>

                    <div className="bg-primary-900/40 rounded p-3 border border-green-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-300 font-bold text-xs">
                          C
                        </span>
                        <span className="text-xs text-primary-400">Conditions</span>
                      </div>
                      <p className="text-sm text-primary-100 line-clamp-2">
                        {attempt.cercResponse.conditions || "(empty)"}
                      </p>
                    </div>
                  </div>

                  {/* Session Stats */}
                  {attempt.sessionData?.phases?.selfCheck && (
                    <div className="flex items-center gap-4 text-xs text-primary-400">
                      {attempt.sessionData.phases.selfCheck.hintsViewed?.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Lightbulb className="w-3 h-3" />
                          <span>
                            Hints: {attempt.sessionData.phases.selfCheck.hintsViewed.join(", ")}
                          </span>
                        </div>
                      )}
                      {attempt.sessionData.phases.selfCheck.solutionViewed && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>Viewed solution</span>
                        </div>
                      )}
                      {attempt.sessionData.phases.selfCheck.revised && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          <span>Revised after self-check</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
