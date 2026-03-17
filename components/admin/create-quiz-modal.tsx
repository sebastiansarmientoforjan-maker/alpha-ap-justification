"use client";

import { useState } from "react";
import { StudentProgressSummary } from "@/lib/types";
import { X, Save } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateQuizModalProps {
  students: StudentProgressSummary[];
  onClose: () => void;
}

export function CreateQuizModal({ students, onClose }: CreateQuizModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    studentId: "",
    topic: "",
    score: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/quiz/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: formData.studentId,
          topic: formData.topic,
          score: parseInt(formData.score),
          manuallyTriggered: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create quiz");
      }

      router.refresh();
      onClose();
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-primary-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div>
            <h3 className="text-lg font-bold text-white">Mark Quiz Completed</h3>
            <p className="text-sm text-primary-400">
              Manually add a completed quiz for a student
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-primary-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Student Select */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Student
            </label>
            <select
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg bg-primary-800/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all"
            >
              <option value="">Select a student...</option>
              {students.map((student) => (
                <option key={student.userId} value={student.userId}>
                  {student.userName} ({student.course})
                </option>
              ))}
            </select>
          </div>

          {/* Topic Input */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Quiz Topic
            </label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              placeholder="e.g., Derivatives, Integrals, Limits"
              required
              className="w-full px-4 py-3 rounded-lg bg-primary-800/60 border border-white/10 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all"
            />
          </div>

          {/* Score Input */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Score (%)
            </label>
            <input
              type="number"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: e.target.value })}
              placeholder="0-100"
              min="0"
              max="100"
              required
              className="w-full px-4 py-3 rounded-lg bg-primary-800/60 border border-white/10 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all"
            />
          </div>

          {/* FRQ Assignment Preview */}
          {formData.score && (
            <div className="p-4 rounded-lg bg-accent-500/10 border border-accent-500/30">
              <div className="text-xs text-accent-400 font-medium mb-2">
                Will automatically assign 1 FRQ:
              </div>
              <div className="flex flex-wrap gap-2">
                {parseInt(formData.score) >= 80 ? (
                  <div className="px-3 py-1.5 rounded bg-accent-500/20 border border-accent-500/40 text-xs font-medium text-accent-300">
                    General FRQ (Broad Argumentation)
                  </div>
                ) : (
                  <div className="px-3 py-1.5 rounded bg-secondary-500/20 border border-secondary-500/40 text-xs font-medium text-secondary-300">
                    Topic FRQ: {formData.topic || "specific topic"}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-lg bg-accent-500 hover:bg-accent-600 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Create Quiz</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
