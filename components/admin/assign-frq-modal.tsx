"use client";

import { useState } from "react";
import { Quiz } from "@/lib/types";
import { X, Send, CheckCircle2, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

interface AssignFRQModalProps {
  quiz: Quiz;
  studentName: string;
  onClose: () => void;
}

export function AssignFRQModal({ quiz, studentName, onClose }: AssignFRQModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const willAssignGeneralFRQ = quiz.score >= 80;
  const willAssignTopicFRQ = quiz.score < 80;

  const handleAssign = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/frq/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quiz.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign FRQ");
      }

      const result = await response.json();
      console.log("FRQ assigned:", result);

      router.refresh();
      onClose();
    } catch (error) {
      console.error("Error assigning FRQ:", error);
      alert("Failed to assign FRQ. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-primary-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div>
            <h3 className="text-lg font-bold text-white">Assign FRQ</h3>
            <p className="text-sm text-primary-400">
              Based on quiz performance
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-primary-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Student Info */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm text-primary-400 mb-1">Student</div>
                <div className="font-semibold text-white">{studentName}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-primary-400 mb-1">Topic</div>
                <div className="font-semibold text-white">{quiz.topic}</div>
              </div>
            </div>

            {/* Score Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                quiz.score >= 80
                  ? "bg-green-500/20 border border-green-500/40"
                  : "bg-red-500/20 border border-red-500/40"
              }`}
            >
              <div className="text-xs text-primary-300">Quiz Score:</div>
              <div
                className={`text-xl font-bold ${
                  quiz.score >= 80 ? "text-green-400" : "text-red-400"
                }`}
              >
                {quiz.score}%
              </div>
            </div>
          </div>

          {/* Assignment Logic */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-white mb-3">
              FRQ Assignment Logic (1 FRQ per week):
            </div>

            {/* General FRQ */}
            <div
              className={`p-4 rounded-lg ${
                willAssignGeneralFRQ
                  ? "bg-accent-500/10 border border-accent-500/30"
                  : "bg-white/5 border border-white/10 opacity-50"
              }`}
            >
              <div className="flex items-start gap-3">
                {willAssignGeneralFRQ ? (
                  <CheckCircle2 className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <X className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="font-medium text-white mb-1">General FRQ</div>
                  <div className="text-xs text-primary-300">
                    Assigned when score ≥ 80%. Focuses on broad written argumentation and justification skills across topics.
                  </div>
                  <div className="mt-2 px-2 py-1 rounded bg-accent-500/20 inline-block">
                    <span className="text-xs font-medium text-accent-300">
                      {willAssignGeneralFRQ ? "Will Assign" : "Not Assigned (Score < 80%)"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Topic FRQ */}
            <div
              className={`p-4 rounded-lg ${
                willAssignTopicFRQ
                  ? "bg-secondary-500/10 border border-secondary-500/30"
                  : "bg-white/5 border border-white/10 opacity-50"
              }`}
            >
              <div className="flex items-start gap-3">
                {willAssignTopicFRQ ? (
                  <CheckCircle2 className="w-5 h-5 text-secondary-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <X className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="font-medium text-white mb-1">Topic-Specific FRQ</div>
                  <div className="text-xs text-primary-300">
                    Assigned when score {"<"} 80%. Targets the specific topic from the quiz for focused remediation.
                  </div>
                  <div className="mt-2 px-2 py-1 rounded bg-secondary-500/20 inline-block">
                    <span className="text-xs font-medium text-secondary-300">
                      {willAssignTopicFRQ
                        ? `Will Assign (${quiz.topic})`
                        : "Not Assigned (Score ≥ 80%)"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary-300">
                <FileText className="w-4 h-4" />
                <span className="text-sm">FRQ to assign this week:</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">1</div>
                <div className="text-xs text-primary-400">
                  {willAssignGeneralFRQ ? "General" : `Topic: ${quiz.topic}`}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-lg bg-accent-500 hover:bg-accent-600 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Assigning...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Assign FRQ</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
