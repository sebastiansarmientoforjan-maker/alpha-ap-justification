"use client";

import { useState } from "react";
import { FRQAssignment, FRQSubmission } from "@/lib/types";
import { X, Save, Sparkles, FileText, Award, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface FRQWithSubmission {
  assignment: FRQAssignment;
  submission: FRQSubmission | null;
  studentName: string;
}

interface GradeFRQModalProps {
  frq: FRQWithSubmission;
  onClose: () => void;
}

export function GradeFRQModal({ frq, onClose }: GradeFRQModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    mathGraderOutput: "",
    mathGraderScore: "",
    actionPoint1: "",
    actionPoint2: "",
    actionPoint3: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAIGrading, setIsAIGrading] = useState(false);

  const handleAIGrade = async () => {
    if (!frq.submission?.fileUrl) {
      alert("No submission file found.");
      return;
    }

    setIsAIGrading(true);

    try {
      // Convert image URL to base64
      // In production, this would fetch from Firebase Storage
      // For now, we'll use a mock base64 string for testing
      const mockImageBase64 = await urlToBase64(frq.submission.fileUrl);

      // Call dual grading endpoint (runs Claude Vision + optional MathGrader)
      const response = await fetch("/api/admin/frq/dual-grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: frq.submission.id,
          imageBase64: mockImageBase64,
          // Optional: include MathGrader output if available
          mathGraderOutput: formData.mathGraderOutput || undefined,
          mathGraderScore: formData.mathGraderScore ? parseInt(formData.mathGraderScore) : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || "Failed to perform dual grading");
      }

      const result = await response.json();

      // Navigate to consolidation page
      router.push(`/admin/frq-review/consolidate/${result.result.id}`);
      onClose();
    } catch (error) {
      console.error("Error with dual grading:", error);
      alert(
        error instanceof Error
          ? `Dual grading failed: ${error.message}`
          : "Dual grading failed. Please try again."
      );
    } finally {
      setIsAIGrading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/frq/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: frq.submission?.id,
          mathGraderOutput: formData.mathGraderOutput,
          mathGraderScore: parseInt(formData.mathGraderScore),
          actionPoints: [
            formData.actionPoint1,
            formData.actionPoint2,
            formData.actionPoint3,
          ].filter(p => p.trim() !== ""),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to grade FRQ");
      }

      router.refresh();
      onClose();
    } catch (error) {
      console.error("Error grading FRQ:", error);
      alert("Failed to save grading data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to convert URL to base64
  // In production, this would fetch from Firebase Storage and convert
  async function urlToBase64(url: string): Promise<string> {
    // For mock URLs, return a placeholder
    // In production, use fetch() to get the image and convert to base64
    if (url.startsWith("/mock-uploads/") || url.startsWith("https://storage.example.com/")) {
      // Mock base64 string for testing - in reality would fetch actual image
      throw new Error("Image fetching not yet implemented. Please use manual grading for now.");
    }

    // Real implementation would be:
    // const response = await fetch(url);
    // const blob = await response.blob();
    // return new Promise((resolve) => {
    //   const reader = new FileReader();
    //   reader.onloadend = () => resolve(reader.result.split(',')[1]);
    //   reader.readAsDataURL(blob);
    // });

    throw new Error("Image URL conversion not implemented");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-primary-900 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-400" />
              Grade FRQ — Dual Grading System
            </h3>
            <p className="text-sm text-primary-400 mt-1">
              {frq.studentName} • {frq.assignment.type === "general" ? "General FRQ" : `Topic: ${frq.assignment.topic}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-primary-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student's Self-Evaluation */}
        {frq.submission && (
          <div className="p-6 border-b border-white/10 bg-white/5">
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-secondary-400" />
              Student's Self-Evaluation
            </h4>
            <div className="flex items-center gap-4 mb-3">
              <div className="text-2xl font-bold text-secondary-400">
                {frq.submission.selfEvaluation.score}/9
              </div>
              <div className="text-sm text-primary-300">Self-assessed score</div>
            </div>
            {frq.submission.selfEvaluation.notes && (
              <div className="p-3 rounded-lg bg-primary-800/40 border border-white/10">
                <p className="text-sm text-primary-200 italic">
                  "{frq.submission.selfEvaluation.notes}"
                </p>
              </div>
            )}
            {frq.submission.fileUrl && (
              <div className="mt-3">
                <a
                  href={frq.submission.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent-400 hover:text-accent-300 transition-colors"
                >
                  View submission file →
                </a>
              </div>
            )}
          </div>
        )}

        {/* AI Grade Button */}
        <div className="px-6 pt-6 pb-3 border-b border-white/10">
          <button
            type="button"
            onClick={handleAIGrade}
            disabled={isAIGrading || !frq.submission?.fileUrl}
            className="w-full group relative px-6 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isAIGrading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Running dual grading system...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Start Dual Grading (Claude Vision + Manual)</span>
                <span className="text-xs opacity-75">(Opens consolidation page)</span>
              </>
            )}
            {!isAIGrading && (
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 blur-xl rounded-xl" />
            )}
          </button>
          <p className="text-xs text-center text-primary-400 mt-3">
            Runs Claude Vision grading, then opens consolidation page where you can review both AI outputs side-by-side and create final feedback.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* AI Output */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              AI Grading Output
            </label>
            <textarea
              value={formData.mathGraderOutput}
              onChange={(e) => setFormData({ ...formData, mathGraderOutput: e.target.value })}
              placeholder="Use 'AI Grade' button above or paste output from external grader here..."
              rows={8}
              required
              className="w-full px-4 py-3 rounded-lg bg-primary-800/60 border border-white/10 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all resize-none font-mono text-sm"
            />
          </div>

          {/* AI Score */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              AI Score (0-9)
            </label>
            <input
              type="number"
              min="0"
              max="9"
              value={formData.mathGraderScore}
              onChange={(e) => setFormData({ ...formData, mathGraderScore: e.target.value })}
              placeholder="Enter AI score"
              required
              className="w-full px-4 py-3 rounded-lg bg-primary-800/60 border border-white/10 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all"
            />
          </div>

          {/* Action Points */}
          <div className="p-6 rounded-xl bg-accent-500/10 border border-accent-500/30">
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-accent-400" />
              Action Points (3 takeaways for the student)
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-primary-300 mb-1">Action Point 1</label>
                <input
                  type="text"
                  value={formData.actionPoint1}
                  onChange={(e) => setFormData({ ...formData, actionPoint1: e.target.value })}
                  placeholder="e.g., Review condition verification for MVT"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-primary-800/60 border border-white/10 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-primary-300 mb-1">Action Point 2</label>
                <input
                  type="text"
                  value={formData.actionPoint2}
                  onChange={(e) => setFormData({ ...formData, actionPoint2: e.target.value })}
                  placeholder="e.g., Practice stating assumptions explicitly"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-primary-800/60 border border-white/10 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-primary-300 mb-1">Action Point 3</label>
                <input
                  type="text"
                  value={formData.actionPoint3}
                  onChange={(e) => setFormData({ ...formData, actionPoint3: e.target.value })}
                  placeholder="e.g., Connect reasoning to evidence more clearly"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-primary-800/60 border border-white/10 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="p-4 rounded-lg bg-secondary-500/10 border border-secondary-500/30">
            <p className="text-xs text-secondary-300">
              <strong>Note:</strong> This will mark the FRQ as "graded" and move it to the "Ready to Deliver" queue.
              You'll deliver the feedback to the student in the next step.
            </p>
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
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-accent-500 to-secondary-500 text-white font-medium transition-colors flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-accent-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Grading</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
