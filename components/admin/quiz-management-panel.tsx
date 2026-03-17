"use client";

import { useState } from "react";
import { Quiz, StudentProgressSummary } from "@/lib/types";
import { Clock, CheckCircle2, Plus, FileText, Sparkles, TrendingUp, Calendar } from "lucide-react";
import { CreateQuizModal } from "./create-quiz-modal";
import { AssignFRQModal } from "./assign-frq-modal";

interface QuizManagementPanelProps {
  unassignedQuizzes: Quiz[];
  studentSummaries: StudentProgressSummary[];
}

export function QuizManagementPanel({
  unassignedQuizzes,
  studentSummaries,
}: QuizManagementPanelProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  // Get student name
  const getStudentName = (studentId: string) => {
    const student = studentSummaries.find(s => s.userId === studentId);
    return student?.userName || studentId;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Quiz Management</h2>
          <p className="text-primary-300">
            Mark quizzes as completed and assign FRQs based on performance
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="group relative px-6 py-3 rounded-xl bg-gradient-to-r from-accent-500 to-secondary-500 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-accent-500/50 hover:scale-105 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Mark Quiz Completed</span>
          <div className="absolute -inset-1 bg-gradient-to-r from-accent-500 to-secondary-500 opacity-20 blur-xl rounded-xl" />
        </button>
      </div>

      {/* Unassigned Quizzes */}
      {unassignedQuizzes.length > 0 ? (
        <div className="space-y-4">
          {unassignedQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="group relative rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-orange-500/5 backdrop-blur-sm p-6 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-500"
            >
              {/* Glow effect on hover */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 -z-10" />

              {/* Pulse indicator */}
              <div className="absolute -top-2 -right-2">
                <div className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-primary-900"></span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6">
                {/* Student Info */}
                <div className="flex items-center gap-6 flex-1">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500/40 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-xl font-bold text-amber-300">
                        {getStudentName(quiz.studentId).split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary-900 border-2 border-primary-900 flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-amber-300 transition-colors">
                        {getStudentName(quiz.studentId)}
                      </h3>
                      <div className="inline-flex px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                        <span className="text-xs font-medium text-amber-300">Awaiting Assignment</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-primary-300">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4" />
                        <span>{quiz.topic}</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-primary-400" />
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(quiz.completedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-primary-400" />
                      <span className="text-xs text-primary-400">
                        {new Date(quiz.completedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Display */}
                <div className="relative">
                  <div
                    className={`px-6 py-4 rounded-xl backdrop-blur-sm border-2 ${
                      quiz.score >= 80
                        ? "bg-gradient-to-br from-green-500/20 to-emerald-500/10 border-green-500/40"
                        : "bg-gradient-to-br from-red-500/20 to-pink-500/10 border-red-500/40"
                    }`}
                  >
                    <div className="text-xs text-primary-300 mb-1 text-center uppercase tracking-wider">Score</div>
                    <div
                      className={`text-3xl font-bold text-center ${
                        quiz.score >= 80 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {quiz.score}%
                    </div>
                  </div>
                  {quiz.score >= 80 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center animate-bounce">
                      <TrendingUp className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>

                {/* Assign Button */}
                <button
                  onClick={() => setSelectedQuiz(quiz)}
                  className="group/btn relative px-6 py-3 rounded-xl bg-gradient-to-r from-accent-500 to-secondary-500 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-accent-500/50 hover:scale-105 flex items-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>Assign FRQ</span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent-500 to-secondary-500 opacity-20 blur-xl rounded-xl" />
                </button>
              </div>

              {/* FRQ Preview */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-primary-300">
                    <Sparkles className="w-4 h-4 text-accent-400" />
                    <span>Will assign 1 FRQ this week:</span>
                  </div>
                  <div>
                    {quiz.score >= 80 ? (
                      <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-accent-500/20 to-accent-600/10 border border-accent-500/40 backdrop-blur-sm">
                        <div className="text-xs font-medium text-accent-300">General FRQ</div>
                        <div className="text-xs text-accent-400/70">Broad Argumentation</div>
                      </div>
                    ) : (
                      <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-secondary-500/20 to-secondary-600/10 border border-secondary-500/40 backdrop-blur-sm">
                        <div className="text-xs font-medium text-secondary-300">Topic-Specific FRQ</div>
                        <div className="text-xs text-secondary-400/70">{quiz.topic}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-16 text-center">
          {/* Subtle glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 rounded-2xl pointer-events-none" />

          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/30 flex items-center justify-center backdrop-blur-sm">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>
            <div className="text-xl font-bold text-white mb-2">All Caught Up!</div>
            <div className="text-primary-300">
              All completed quizzes have been assigned FRQs
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateQuizModal
          students={studentSummaries}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {selectedQuiz && (
        <AssignFRQModal
          quiz={selectedQuiz}
          studentName={getStudentName(selectedQuiz.studentId)}
          onClose={() => setSelectedQuiz(null)}
        />
      )}
    </div>
  );
}
