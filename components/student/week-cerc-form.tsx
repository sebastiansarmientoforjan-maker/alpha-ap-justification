"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface WeekCERCFormProps {
  onSubmit: (data: {
    claim: string;
    evidence: string;
    reasoning: string;
    conditions: string;
  }) => void;
  submitting: boolean;
  sentenceFrames?: {
    claim: string;
    evidence: string;
    reasoning: string;
    conditions: string;
  };
  scaffoldingLevel: "full" | "structural" | "minimal" | "none";
}

export function WeekCERCForm({
  onSubmit,
  submitting,
  sentenceFrames,
  scaffoldingLevel,
}: WeekCERCFormProps) {
  const [claim, setClaim] = useState("");
  const [evidence, setEvidence] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [conditions, setConditions] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!claim.trim() || !evidence.trim() || !reasoning.trim() || !conditions.trim()) {
      alert("Please complete all four CERC fields before submitting.");
      return;
    }

    onSubmit({ claim, evidence, reasoning, conditions });
  };

  const showSentenceFrames = scaffoldingLevel === "full" && sentenceFrames;

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-8">
      <h2 className="text-2xl font-bold mb-6">Your CERC Response</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Claim */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Claim
            <span className="text-red-400 ml-1">*</span>
          </label>
          {showSentenceFrames && (
            <div className="mb-2 text-xs text-slate-500 bg-slate-900/50 rounded px-3 py-2 border border-slate-700">
              Frame: {sentenceFrames.claim}
            </div>
          )}
          <textarea
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
            placeholder="State your conclusion clearly..."
            disabled={submitting}
          />
          <div className="mt-1 text-xs text-slate-500">
            {claim.length} characters
          </div>
        </div>

        {/* Evidence */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Evidence
            <span className="text-red-400 ml-1">*</span>
          </label>
          {showSentenceFrames && (
            <div className="mb-2 text-xs text-slate-500 bg-slate-900/50 rounded px-3 py-2 border border-slate-700">
              Frame: {sentenceFrames.evidence}
            </div>
          )}
          <textarea
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none font-mono text-sm"
            placeholder="Show your calculations and mathematical data..."
            disabled={submitting}
          />
          <div className="mt-1 text-xs text-slate-500">
            {evidence.length} characters • Use plain text for math (e.g., f(x) = 1/x^2)
          </div>
        </div>

        {/* Reasoning */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Reasoning
            <span className="text-red-400 ml-1">*</span>
          </label>
          {showSentenceFrames && (
            <div className="mb-2 text-xs text-slate-500 bg-slate-900/50 rounded px-3 py-2 border border-slate-700">
              Frame: {sentenceFrames.reasoning}
            </div>
          )}
          <textarea
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
            placeholder="Explain which theorem or principle connects your evidence to your claim..."
            disabled={submitting}
          />
          <div className="mt-1 text-xs text-slate-500">
            {reasoning.length} characters
          </div>
        </div>

        {/* Conditions */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Conditions
            <span className="text-red-400 ml-1">*</span>
          </label>
          {showSentenceFrames && (
            <div className="mb-2 text-xs text-slate-500 bg-slate-900/50 rounded px-3 py-2 border border-slate-700">
              Frame: {sentenceFrames.conditions}
            </div>
          )}
          <textarea
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
            placeholder="Explicitly verify that all theorem hypotheses are satisfied..."
            disabled={submitting}
          />
          <div className="mt-1 text-xs text-slate-500">
            {conditions.length} characters
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-600 rounded-lg font-semibold transition-all flex items-center justify-center gap-3 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Submitting to Claude...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Submit for Feedback</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
