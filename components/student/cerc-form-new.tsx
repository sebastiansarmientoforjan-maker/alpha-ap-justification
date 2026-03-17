"use client";

import { CERCResponse, EvaluationFeedback } from "@/lib/types";
import { CheckCircle2, Save, AlertTriangle, Sparkles } from "lucide-react";

interface CERCFormProps {
  response: Partial<CERCResponse>;
  onChange: (response: Partial<CERCResponse>) => void;
  onSubmit: (response: Partial<CERCResponse>) => void;
  feedback: EvaluationFeedback | null;
  attemptNumber: number;
  maxAttempts: number;
  isSubmitting: boolean;
  weekNumber: number;
}

const CERC_FIELDS = [
  {
    key: "claim" as const,
    label: "Claim",
    description: "What is your conclusion?",
    placeholder: "State your conclusion clearly and precisely...",
    icon: "🎯",
  },
  {
    key: "evidence" as const,
    label: "Evidence",
    description: "What mathematical data supports your claim?",
    placeholder: "Provide computations, observations, or data that support your claim...",
    icon: "📊",
  },
  {
    key: "reasoning" as const,
    label: "Reasoning",
    description: "Which theorem or principle connects evidence to claim?",
    placeholder: "Name the theorem and explain how it applies...",
    icon: "🧠",
  },
  {
    key: "conditions" as const,
    label: "Conditions",
    description: "Have you verified ALL theorem hypotheses?",
    placeholder: "Explicitly verify each condition required by the theorem...",
    icon: "✓",
  },
];

export function CERCForm({
  response,
  onChange,
  onSubmit,
  feedback,
  attemptNumber,
  maxAttempts,
  isSubmitting,
  weekNumber,
}: CERCFormProps) {
  const handleFieldChange = (field: keyof CERCResponse, value: string) => {
    onChange({ ...response, [field]: value });
  };

  const handleSubmit = () => {
    if (isComplete) {
      onSubmit(response);
    }
  };

  const isComplete = Object.values(response).every((value) => value && value.trim().length > 0);

  return (
    <div className="rounded-2xl border border-white/10 bg-white backdrop-blur-sm overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary-500/10 to-accent-500/10 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">CERC Framework</h3>
            <p className="text-xs text-gray-600">
              Structure your mathematical argument
            </p>
          </div>
          {feedback?.approved && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-medium">Approved!</span>
            </div>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {CERC_FIELDS.map((field) => (
          <div key={field.key} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{field.icon}</span>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-900">
                  {field.label}
                </label>
                <p className="text-xs text-gray-600">{field.description}</p>
              </div>
            </div>
            <textarea
              value={response[field.key] || ""}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              disabled={isSubmitting || feedback?.approved}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all resize-none text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            />
            {/* Field-specific feedback */}
            {feedback && feedback.breakdown[field.key] && (
              <div
                className={`mt-2 p-3 rounded-lg border ${
                  feedback.breakdown[field.key].score >= 80
                    ? "bg-green-50 border-green-200"
                    : feedback.breakdown[field.key].score >= 50
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-0.5">
                    {feedback.breakdown[field.key].score >= 80 ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-gray-900 mb-1">
                      Score: {feedback.breakdown[field.key].score}/100
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {feedback.breakdown[field.key].feedback}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 bg-gray-50 p-6">
        <div className="space-y-3">
          {/* Socratic Question (if feedback exists) */}
          {feedback && !feedback.approved && feedback.socraticQuestion && (
            <div className="mb-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-blue-900 mb-1">
                    Think about this:
                  </div>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {feedback.socraticQuestion}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">
              {Object.values(response).filter((v) => v && v.trim().length > 0).length} of 4 fields completed
            </span>
            <span className={`font-medium ${isComplete ? "text-accent-600" : "text-gray-500"}`}>
              {isComplete ? "Ready to submit" : "Fill all fields"}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-500 to-secondary-500 transition-all duration-300"
              style={{
                width: `${(Object.values(response).filter((v) => v && v.trim().length > 0).length / 4) * 100}%`,
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!isComplete || isSubmitting || feedback?.approved}
            className={`w-full py-3 px-6 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              isComplete && !isSubmitting && !feedback?.approved
                ? "bg-gradient-to-r from-accent-500 to-secondary-500 text-white hover:shadow-lg hover:shadow-accent-500/50 hover:scale-[1.02]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Evaluating with Claude...</span>
              </>
            ) : feedback?.approved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Response Approved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Submit for Evaluation (Attempt {attemptNumber}/{maxAttempts})</span>
              </>
            )}
          </button>

          {/* Overall Score (if feedback exists) */}
          {feedback && (
            <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-purple-700 font-medium mb-1">
                    Overall Score
                  </div>
                  <div className="text-2xl font-bold text-purple-900">
                    {feedback.overallScore}/100
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-wider text-purple-700 font-medium mb-1">
                    XP Earned
                  </div>
                  <div className="text-2xl font-bold text-accent-600">
                    +{feedback.xpAwarded} XP
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
