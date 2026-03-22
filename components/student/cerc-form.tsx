"use client";

import { useState } from "react";
import { Problem, CERCResponse } from "@/lib/types";
import { CheckCircle2, Save, Sparkles, Target, Database, Brain, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface CERCFormProps {
  problem: Problem;
  weekNumber: number;
  studentId: string;
  existingResponse: CERCResponse | null;
  onSubmitSuccess: () => void;
  showFeedbackTeaser?: boolean;
}

const CERC_FIELDS = [
  {
    key: "claim" as const,
    label: "Claim",
    description: "What is your conclusion?",
    placeholder: "State your conclusion clearly and precisely...",
    icon: Target,
  },
  {
    key: "evidence" as const,
    label: "Evidence",
    description: "What mathematical data supports your claim?",
    placeholder: "Provide computations, observations, or data that support your claim...",
    icon: Database,
  },
  {
    key: "reasoning" as const,
    label: "Reasoning",
    description: "Which theorem or principle connects evidence to claim?",
    placeholder: "Name the theorem and explain how it applies...",
    icon: Brain,
  },
  {
    key: "conditions" as const,
    label: "Conditions",
    description: "Have you verified ALL theorem hypotheses?",
    placeholder: "Explicitly verify each condition required by the theorem...",
    icon: ShieldCheck,
  },
];

export function CERCForm({
  problem,
  weekNumber,
  studentId,
  existingResponse,
  onSubmitSuccess,
  showFeedbackTeaser = true,
}: CERCFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<CERCResponse, "problemId" | "timestamp">>({
    claim: existingResponse?.claim || "",
    evidence: existingResponse?.evidence || "",
    reasoning: existingResponse?.reasoning || "",
    conditions: existingResponse?.conditions || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(!!existingResponse);
  const [startTime] = useState<number>(() => Date.now());

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Calculate time spent in seconds
    const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);

    try {
      const response = await fetch("/api/cerc/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          weekNumber,
          problemId: problem.id,
          expectedMinutes: problem.expectedMinutes,
          timeSpentSeconds,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit CERC response");
      }

      setIsSaved(true);
      router.refresh();

      // Wait a moment then trigger success callback
      setTimeout(() => {
        onSubmitSuccess();
      }, 1500);
    } catch (error) {
      console.error("Error submitting CERC:", error);
      alert("Failed to submit response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isComplete = Object.values(formData).every((value) => value.trim().length > 0);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary-500/10 to-accent-500/10 border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">CERC Framework</h3>
            <p className="text-xs text-primary-300">
              Structure your mathematical argument
            </p>
          </div>
          {isSaved && (
            <div className="flex items-center gap-2 text-accent-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-medium">Saved</span>
            </div>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {CERC_FIELDS.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.key} className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-accent-400 flex-shrink-0" />
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-white">
                    {field.label}
                  </label>
                  <p className="text-xs text-primary-400">{field.description}</p>
                </div>
              </div>
              <textarea
                value={formData[field.key]}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-primary-800/40 border border-white/10 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all resize-none text-sm"
              />
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="border-t border-white/10 p-6">
        <div className="space-y-3">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-primary-400">
              {Object.values(formData).filter((v) => v.trim().length > 0).length} of 4 fields completed
            </span>
            <span className={`font-medium ${isComplete ? "text-accent-400" : "text-primary-400"}`}>
              {isComplete ? "Ready to submit" : "Fill all fields"}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 bg-primary-800/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-500 to-secondary-500 transition-all duration-300"
              style={{
                width: `${(Object.values(formData).filter((v) => v.trim().length > 0).length / 4) * 100}%`,
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!isComplete || isSubmitting}
            className={`w-full py-3 px-6 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              isComplete && !isSubmitting
                ? "bg-gradient-to-r from-accent-500 to-secondary-500 text-white hover:shadow-lg hover:shadow-accent-500/50 hover:scale-[1.02]"
                : "bg-primary-800/60 text-primary-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Response Saved</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Submit CERC Response</span>
              </>
            )}
          </button>

          {/* Feedback Teaser (optional) */}
          {showFeedbackTeaser && (
            <div className="mt-4 p-3 rounded-lg bg-accent-500/5 border border-accent-500/20">
              <div className="flex items-center gap-2 text-xs text-accent-300">
                <Sparkles className="w-4 h-4" />
                <span>Feedback will appear here after submission</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
