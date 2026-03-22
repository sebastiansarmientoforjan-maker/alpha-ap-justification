/**
 * Week 1 Practice Demo
 * Practice problem using the same format as training problems
 */
"use client";

import { useState } from "react";
import { Problem } from "@/lib/types";
import { ArrowLeft, Target, BookOpen } from "lucide-react";
import Link from "next/link";
import { ProblemDisplay } from "@/components/student/problem-display";
import { CERCForm } from "@/components/student/cerc-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useRouter } from "next/navigation";

// Practice problem - Same format as training problems
const practiceProblem: Problem = {
  id: "practice-mvt-discontinuous",
  weekNumber: 1,
  statement: `Consider the function $f(x) = \\frac{1}{x^{2}}$ on the interval $[-1, 1]$.

**Task:** Apply the Mean Value Theorem to determine whether there exists a value $c$ in the interval $(-1, 1)$ that satisfies the conclusion of the theorem.

Use the CERC framework to structure your argument. Explicitly verify all theorem conditions before drawing your conclusion.

**Reference - Mean Value Theorem:**
If $f$ is continuous on $[a, b]$ and differentiable on $(a, b)$, then there exists at least one point $c$ in $(a, b)$ such that:

$$f'(c) = \\frac{f(b) - f(a)}{b - a}$$`,
  errorCategory: "CONDITION_BYPASS",
  trapDescription: "The function is discontinuous at x=0, so MVT does not apply.",
  cercSkeleton: {
    claim: "The Mean Value Theorem cannot be applied to f(x) = 1/x² on [-1, 1].",
    evidence: "f(x) is undefined at x = 0, creating a discontinuity in the interval [-1, 1]. Evaluating: f(1) = 1, f(-1) = 1, so (f(1) - f(-1))/2 = 0.",
    reasoning: "The Mean Value Theorem requires the function to be continuous on the closed interval [a, b] and differentiable on the open interval (a, b).",
    conditions: "Checking continuity: f(x) = 1/x² is discontinuous at x = 0 because lim(x→0) f(x) = ∞ (the function is not defined at x=0). Since 0 ∈ [-1,1], the continuity condition fails."
  },
  sentenceFrame: null // Diagnostic assessment - no hints
};

export default function PracticeDemoPage() {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);

  // Mock student data
  const studentId = "practice-student";

  const handleSubmitSuccess = () => {
    setIsCompleted(true);

    // Mark practice as completed in localStorage
    try {
      localStorage.setItem('week1_practice_completed', JSON.stringify({
        completed: true,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Could not save practice completion:', error);
    }

    // Redirect to Week 1 landing after short delay
    setTimeout(() => {
      router.push('/student/week/1');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
      {/* Header */}
      <header className="border-b border-white/10 bg-primary-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/student/week/1"
                className="flex items-center gap-2 text-primary-200 hover:text-accent-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Back to Week 1</span>
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <Breadcrumbs
                items={[
                  { label: "Week 1", href: "/student/week/1" },
                  { label: "Practice Demo" },
                ]}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-500/10 border border-secondary-500/30">
                <Target className="w-4 h-4 text-secondary-400" />
                <span className="text-sm font-medium text-secondary-300">
                  Practice Demo
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Split Screen */}
      <div className="container mx-auto px-4 py-8">
        {/* Info Banner */}
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-blue-300 mb-1">
                Diagnostic Assessment
              </div>
              <div className="text-xs text-primary-300 leading-relaxed">
                This practice problem prepares you for the 6 training problems. Your response will be reviewed by your instructor to assess your baseline reasoning skills. Use the same split-screen format: read the problem on the left, fill in your CERC response on the right, then submit.
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-280px)]">
          {/* LEFT: Problem Display */}
          <div className="overflow-y-auto">
            <ProblemDisplay
              problem={practiceProblem}
              weekNumber={1}
              problemNumber={1}
              totalProblems={1}
            />
          </div>

          {/* RIGHT: CERC Form */}
          <div className="overflow-y-auto">
            {isCompleted ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                  <Target className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Practice Complete!</h3>
                <p className="text-primary-300 mb-4">
                  You've completed the practice demo. Redirecting to Week 1...
                </p>
                <div className="w-12 h-12 border-4 border-accent-500/30 border-t-accent-500 rounded-full animate-spin mx-auto" />
              </div>
            ) : (
              <CERCForm
                problem={practiceProblem}
                weekNumber={1}
                studentId={studentId}
                existingResponse={null}
                onSubmitSuccess={handleSubmitSuccess}
                showFeedbackTeaser={false}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
