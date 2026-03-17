"use client";

import { useState } from "react";
import { FRQAssignment, FRQSubmission, User } from "@/lib/types";
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight";
import {
  Home,
  ChevronLeft,
  FileText,
  Award,
  Send,
  CheckCircle2,
  User as UserIcon,
  Calendar,
  Sparkles,
  Target,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface DeliverFeedbackViewProps {
  assignment: FRQAssignment;
  submission: FRQSubmission;
  student: User;
}

export function DeliverFeedbackView({ assignment, submission, student }: DeliverFeedbackViewProps) {
  const router = useRouter();
  const [isDelivering, setIsDelivering] = useState(false);

  const handleDeliverFeedback = async () => {
    if (!confirm(`Deliver feedback to ${student.name}? They will be able to view it immediately.`)) {
      return;
    }

    setIsDelivering(true);

    try {
      const response = await fetch("/api/admin/frq/deliver-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: submission.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to deliver feedback");
      }

      router.push("/admin/frq-review");
      router.refresh();
    } catch (error) {
      console.error("Error delivering feedback:", error);
      alert("Failed to deliver feedback. Please try again.");
    } finally {
      setIsDelivering(false);
    }
  };

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
                href="/admin/frq-review"
                className="group flex items-center gap-2 text-primary-200 hover:text-accent-400 transition-all duration-300"
              >
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-accent-500/10 transition-all duration-300">
                  <ChevronLeft className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Back to Review Center</span>
              </Link>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Deliver Feedback</h1>
                <p className="text-sm text-primary-300 mt-0.5">Review and deliver to student</p>
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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Student Info Card */}
          <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-glass overflow-hidden p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 via-transparent to-secondary-500/5 pointer-events-none" />

            <div className="relative flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-500/20 to-secondary-500/20 border-2 border-accent-500/30 flex items-center justify-center backdrop-blur-sm">
                <UserIcon className="w-10 h-10 text-accent-300" />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{student.name}</h2>
                <div className="flex items-center gap-4 text-sm text-primary-300">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>
                      {assignment.type === "general" ? "General FRQ" : `Topic FRQ: ${assignment.topic}`}
                    </span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-primary-400" />
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3 rounded-xl bg-accent-500/10 border border-accent-500/30 backdrop-blur-sm">
                <div className="text-xs text-primary-400 mb-1">Status</div>
                <div className="text-sm font-semibold text-accent-300">Ready to Deliver</div>
              </div>
            </div>
          </div>

          {/* Self-Evaluation */}
          <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-glass overflow-hidden p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/5 via-transparent to-purple-500/5 pointer-events-none" />

            <div className="relative">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-secondary-400" />
                Student's Self-Evaluation
              </h3>

              <div className="flex items-center gap-6 mb-4">
                <div className="px-6 py-4 rounded-xl bg-secondary-500/10 border border-secondary-500/30 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-secondary-300">{submission.selfEvaluation.score}/9</div>
                  <div className="text-xs text-primary-400 mt-1">Self-assessed</div>
                </div>

                {submission.selfEvaluation.notes && (
                  <div className="flex-1 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-xs text-primary-400 mb-1">Reflection Notes:</div>
                    <p className="text-sm text-primary-200 italic">"{submission.selfEvaluation.notes}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MathGrader.AI Results */}
          <div className="relative rounded-2xl border border-accent-500/30 bg-gradient-to-br from-accent-500/10 via-accent-500/5 to-secondary-500/5 backdrop-blur-2xl shadow-glass overflow-hidden p-6">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-accent-500/20 to-secondary-500/20 opacity-50 blur -z-10" />

            <div className="relative">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent-400" />
                MathGrader.AI Analysis
              </h3>

              {submission.mathGraderScore !== null && (
                <div className="mb-4">
                  <div className="inline-flex px-6 py-4 rounded-xl bg-accent-500/20 border border-accent-500/40 backdrop-blur-sm">
                    <div className="text-3xl font-bold text-accent-300">{submission.mathGraderScore}/9</div>
                    <div className="ml-3 text-xs text-primary-400 self-center">AI Score</div>
                  </div>
                </div>
              )}

              {submission.mathGraderOutput && (
                <div className="p-4 rounded-xl bg-primary-800/40 border border-white/10">
                  <div className="text-xs text-primary-400 mb-2">Full Output:</div>
                  <div className="text-sm text-primary-200 whitespace-pre-wrap font-mono">
                    {submission.mathGraderOutput}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Points */}
          {submission.actionPoints && submission.actionPoints.length > 0 && (
            <div className="relative rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-orange-500/5 backdrop-blur-2xl shadow-glass overflow-hidden p-6">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 opacity-50 blur -z-10" />

              <div className="relative">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  Action Points for Student
                </h3>

                <div className="space-y-3">
                  {submission.actionPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                        <span className="text-xs font-bold text-amber-300">{index + 1}</span>
                      </div>
                      <p className="text-sm text-primary-200 flex-1">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Deliver Button */}
          <div className="relative rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/10 via-green-500/5 to-emerald-500/5 backdrop-blur-2xl shadow-glass overflow-hidden p-6">
            <div className="relative flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Ready to Deliver</h4>
                  <p className="text-sm text-primary-300">
                    This will make the feedback visible to {student.name.split(" ")[0]}
                  </p>
                </div>
              </div>

              <button
                onClick={handleDeliverFeedback}
                disabled={isDelivering}
                className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 hover:scale-105 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isDelivering ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Delivering...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Deliver Feedback</span>
                  </>
                )}
                {!isDelivering && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 opacity-20 blur-xl rounded-xl" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
