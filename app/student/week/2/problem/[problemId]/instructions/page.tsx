"use client";

import { useRouter, useParams } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ActivityInstructions } from "@/components/student/activity-instructions";

export default function Week2ProblemInstructionsPage() {
  const router = useRouter();
  const params = useParams();
  const problemId = params.problemId as string;

  const handleComplete = () => {
    router.push(`/student/week/2/problem/${problemId}`);
  };

  const activityTitle = `Week 2: ${problemId}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs
          items={[
            { label: "Week 2", href: "/student/week/2" },
            { label: "Problems", href: "/student/week/2/problems" },
            { label: activityTitle, href: `/student/week/2/problem/${problemId}` },
            { label: "Instructions" },
          ]}
        />

        <div className="mt-8">
          <ActivityInstructions
            activityType="problem"
            activityId={`w2-${problemId}`}
            activityTitle={activityTitle}
            onComplete={handleComplete}
          />
        </div>
      </div>
    </div>
  );
}
