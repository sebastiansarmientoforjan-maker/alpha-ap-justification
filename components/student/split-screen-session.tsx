"use client";

import { useState } from "react";
import { Problem, CERCResponse } from "@/lib/types";
import { ProblemDisplay } from "./problem-display";
import { CERCForm } from "./cerc-form-new";
import { ProgressHeader } from "./progress-header";
import { BadgeUnlockAnimation } from "../animations/badge-unlock";

interface SplitScreenSessionProps {
  problem: Problem;
  studentId: string;
  initialProgress: {
    attemptNumber: number;
    lastResponse?: Partial<CERCResponse>;
    xpEarned: number;
    reasoningStage: "empirical" | "generic" | "formal";
  };
  weekNumber: number;
}

export function SplitScreenSession({
  problem,
  studentId,
  initialProgress,
  weekNumber,
}: SplitScreenSessionProps) {
  const [attemptNumber, setAttemptNumber] = useState(initialProgress.attemptNumber || 1);
  const [cercResponse, setCERCResponse] = useState<Partial<CERCResponse>>(
    initialProgress.lastResponse || {}
  );
  const [feedback, setFeedback] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [xp, setXP] = useState(initialProgress.xpEarned);
  const [unlockedBadge, setUnlockedBadge] = useState<any>(null);

  const handleSubmit = async (response: Partial<CERCResponse>) => {
    setIsSubmitting(true);

    try {
      // Call Claude API to evaluate CERC response
      const res = await fetch("/api/cerc/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: problem.id,
          studentId,
          cercResponse: response,
          attemptNumber,
          problemStatement: problem.statement,
          errorCategory: problem.errorCategory || "CONDITION_BYPASS",
          reasoningStage: initialProgress.reasoningStage,
        }),
      });

      const evaluation = await res.json();

      setFeedback(evaluation);

      // Update XP
      if (evaluation.xpAwarded > 0) {
        setXP(prev => prev + evaluation.xpAwarded);
      }

      // Check for badge unlock
      if (evaluation.badgesUnlocked && evaluation.badgesUnlocked.length > 0) {
        setUnlockedBadge(evaluation.badgesUnlocked[0]); // Show first badge
      }

      // If approved, can move to next problem
      if (evaluation.approved) {
        // Show success animation, then redirect
        setTimeout(() => {
          window.location.href = "/student/week/1/session"; // Next problem
        }, 3000);
      } else {
        // Increment attempt number for next submission
        setAttemptNumber(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error submitting CERC response:", error);
      alert("Error submitting response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
      {/* Progress Header */}
      <ProgressHeader
        xp={xp}
        reasoningStage={initialProgress.reasoningStage}
        attemptNumber={attemptNumber}
        maxAttempts={3}
      />

      {/* Split Screen Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* LEFT: Problem Display */}
        <div className="w-1/2 overflow-y-auto p-8">
          <ProblemDisplay
            problem={problem}
            weekNumber={weekNumber}
          />
        </div>

        {/* RIGHT: CERC Form */}
        <div className="w-1/2 bg-white overflow-y-auto p-8">
          <CERCForm
            response={cercResponse}
            onChange={setCERCResponse}
            onSubmit={handleSubmit}
            feedback={feedback}
            attemptNumber={attemptNumber}
            maxAttempts={3}
            isSubmitting={isSubmitting}
            weekNumber={weekNumber}
          />
        </div>
      </div>

      {/* Badge Unlock Animation */}
      {unlockedBadge && (
        <BadgeUnlockAnimation
          badge={unlockedBadge}
          onComplete={() => setUnlockedBadge(null)}
        />
      )}
    </div>
  );
}
