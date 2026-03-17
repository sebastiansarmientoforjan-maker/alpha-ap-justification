/**
 * Admin: Students Overview
 * Shows all students with progress summary
 */
import { getDataService } from "@/services/data";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default async function AdminStudentsPage() {
  const dataService = await getDataService();
  const studentOverviews = await dataService.getAllStudentOverviews();

  // Calculate overall stats
  const totalStudents = studentOverviews.length;
  const activeStudents = studentOverviews.filter(
    s => s.lastActiveAt && (Date.now() - s.lastActiveAt.getTime()) < 7 * 24 * 60 * 60 * 1000
  ).length;
  const studentsWithFlags = studentOverviews.filter(s => s.flags.length > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <Breadcrumbs
          items={[
            { label: "Admin", href: "/admin" },
            { label: "Students" },
          ]}
        />

        <div className="flex items-center justify-between mt-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Student Progress Overview</h1>
            <p className="text-primary-200">
              Track CERC practice attempts and identify students who need support
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-accent-400" />
            <span className="text-sm text-primary-300">Total Students</span>
          </div>
          <div className="text-3xl font-bold">{totalStudents}</div>
        </div>

        <div className="bg-green-500/10 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-sm text-green-300">Active (7 days)</span>
          </div>
          <div className="text-3xl font-bold text-green-400">{activeStudents}</div>
        </div>

        <div className="bg-yellow-500/10 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <span className="text-sm text-yellow-300">Need Attention</span>
          </div>
          <div className="text-3xl font-bold text-yellow-400">{studentsWithFlags}</div>
        </div>
      </div>

      {/* Students List */}
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4">
          {studentOverviews.map((student) => {
            const daysSinceActivity = student.lastActiveAt
              ? (Date.now() - student.lastActiveAt.getTime()) / (1000 * 60 * 60 * 24)
              : 999;

            const isActive = daysSinceActivity < 7;
            const hasFlags = student.flags.length > 0;

            // Calculate overall completion
            const totalProblems = Object.values(student.weekSummaries).reduce(
              (sum, week) => sum + week.totalProblems,
              0
            );
            const completedProblems = Object.values(student.weekSummaries).reduce(
              (sum, week) => sum + week.problemsCompleted,
              0
            );
            const completionPercentage = totalProblems > 0
              ? Math.round((completedProblems / totalProblems) * 100)
              : 0;

            return (
              <Link
                key={student.studentId}
                href={`/admin/students/${student.studentId}`}
                className="block"
              >
                <div
                  className={`group relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border transition-all hover:scale-[1.01] hover:bg-white/10 ${
                    hasFlags
                      ? "border-yellow-500/30 hover:border-yellow-500/50"
                      : "border-white/10 hover:border-accent-500/30"
                  }`}
                >
                  {/* Student Info Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{student.studentName}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            isActive
                              ? "bg-green-500/20 text-green-300 border border-green-500/30"
                              : "bg-primary-700/50 text-primary-400 border border-primary-600/30"
                          }`}
                        >
                          {isActive ? "Active" : `${Math.floor(daysSinceActivity)}d inactive`}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {student.course.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-primary-300">{student.studentEmail}</p>
                    </div>

                    <ArrowRight className="w-5 h-5 text-primary-500 group-hover:text-accent-400 transition-colors" />
                  </div>

                  {/* Progress Stats */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-primary-400 mb-1">Completion</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">{completionPercentage}%</span>
                        <span className="text-xs text-primary-400">
                          ({completedProblems}/{totalProblems})
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-primary-400 mb-1">Total XP</div>
                      <div className="text-2xl font-bold text-accent-400">{student.totalXP}</div>
                    </div>

                    <div>
                      <div className="text-xs text-primary-400 mb-1">Reasoning Stage</div>
                      <div
                        className={`text-sm font-semibold ${
                          student.currentReasoningStage === "formal"
                            ? "text-green-400"
                            : student.currentReasoningStage === "generic"
                            ? "text-blue-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {student.currentReasoningStage.charAt(0).toUpperCase() +
                          student.currentReasoningStage.slice(1)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-primary-400 mb-1">Recent Activity</div>
                      <div className="text-sm text-primary-200">
                        {student.recentAttempts.length} attempts
                      </div>
                    </div>
                  </div>

                  {/* Week Progress Bars */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[1, 2, 3, 4].map((week) => {
                      const weekData = student.weekSummaries[week];
                      const weekCompletion = weekData.totalProblems > 0
                        ? (weekData.problemsCompleted / weekData.totalProblems) * 100
                        : 0;

                      return (
                        <div key={week}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-primary-400">Week {week}</span>
                            <span className="text-xs text-primary-400">
                              {weekData.problemsCompleted}/{weekData.totalProblems}
                            </span>
                          </div>
                          <div className="h-2 bg-primary-800/60 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-accent-500 to-secondary-500 rounded-full transition-all"
                              style={{ width: `${weekCompletion}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Flags */}
                  {hasFlags && (
                    <div className="flex flex-wrap gap-2">
                      {student.flags.map((flag, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-xs text-yellow-300"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          <span>{flag.message}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {studentOverviews.length === 0 && (
          <div className="text-center py-12 text-primary-400">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No students enrolled yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
