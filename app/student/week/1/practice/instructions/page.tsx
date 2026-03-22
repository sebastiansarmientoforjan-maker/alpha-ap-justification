"use client";

import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ActivityInstructions } from "@/components/student/activity-instructions";

export default function DiagnosticInstructionsPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push("/student/week/1/practice");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs
          items={[
            { label: "Week 1", href: "/student/week/1" },
            { label: "Diagnostic Assessment", href: "/student/week/1/practice" },
            { label: "Instructions" },
          ]}
        />

        <div className="mt-8">
          <ActivityInstructions
            activityType="practice"
            activityId="diagnostic-assessment"
            activityTitle="Diagnostic Assessment"
            onComplete={handleComplete}
          />
        </div>
      </div>
    </div>
  );
}
