"use client";

import { useRouter, useParams } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ActivityInstructions } from "@/components/student/activity-instructions";

export default function ProblemInstructionsPage() {
  const router = useRouter();
  const params = useParams();
  const problemId = params.problemId as string;

  const handleComplete = () => {
    router.push(`/student/week/1/problem/${problemId}`);
  };

  // Get problem title based on ID (you can expand this mapping)
  const problemTitles: Record<string, string> = {
    "w1-mvt-001": "Mean Value Theorem: The Discontinuity Trap",
    "w1-ivt-001": "Intermediate Value Theorem: The Jump Discontinuity",
    "w1-mvt-002": "MVT: The Absolute Value Function",
    "w1-stats-001": "Two-Sample t-Test: The Independence Trap",
    "w1-stats-002": "Hypothesis Test: The Sample Size Trap",
    "w1-stats-003": "Confidence Interval: The Random Sampling Trap",
  };

  const activityTitle = problemTitles[problemId] || "Week 1 Problem";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs
          items={[
            { label: "Week 1", href: "/student/week/1" },
            { label: "Problems", href: "/student/week/1/problems" },
            { label: activityTitle, href: `/student/week/1/problem/${problemId}` },
            { label: "Instructions" },
          ]}
        />

        <div className="mt-8">
          <ActivityInstructions
            activityType="problem"
            activityId={problemId}
            activityTitle={activityTitle}
            onComplete={handleComplete}
          />
        </div>
      </div>
    </div>
  );
}
