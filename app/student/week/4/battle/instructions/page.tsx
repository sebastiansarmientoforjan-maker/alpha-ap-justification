"use client";

import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ActivityInstructions } from "@/components/student/activity-instructions";
import { AlertCircle, Clock, Users, Zap } from "lucide-react";

export default function BossBattleInstructionsPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push("/student/week/4/battle");
  };

  // Custom instructions for Boss Battle (more intense)
  const bossBattleInstructions = [
    {
      id: 1,
      text: "I have paper, pencil, and calculator ready. This is a multi-part problem requiring full calculations.",
      icon: <AlertCircle className="w-5 h-5" />,
      colorClasses: {
        checked: "bg-red-500/10 border-red-500/30",
        unchecked: "bg-primary-800/40 border-primary-600/30 hover:bg-primary-800/60",
        iconChecked: "text-red-400",
        iconUnchecked: "text-primary-400",
      }
    },
    {
      id: 2,
      text: "I understand this is a 3-phase Boss Battle: Phase 1 (Individual) → Phase 2 (Team CERC) → Phase 3 (Curveball - TIMED 15 min).",
      icon: <Zap className="w-5 h-5" />,
      colorClasses: {
        checked: "bg-yellow-500/10 border-yellow-500/30",
        unchecked: "bg-primary-800/40 border-primary-600/30 hover:bg-primary-800/60",
        iconChecked: "text-yellow-400",
        iconUnchecked: "text-primary-400",
      }
    },
    {
      id: 3,
      text: "I will verify ALL theorem conditions rigorously. This is the final synthesis of all Week 1-3 skills.",
      icon: <AlertCircle className="w-5 h-5" />,
      colorClasses: {
        checked: "bg-purple-500/10 border-purple-500/30",
        unchecked: "bg-primary-800/40 border-primary-600/30 hover:bg-primary-800/60",
        iconChecked: "text-purple-400",
        iconUnchecked: "text-primary-400",
      }
    },
    {
      id: 4,
      text: "Phase 3 has a 15-MINUTE TIMER. I understand I must adapt my work quickly when the curveball is revealed.",
      icon: <Clock className="w-5 h-5" />,
      colorClasses: {
        checked: "bg-orange-500/10 border-orange-500/30",
        unchecked: "bg-primary-800/40 border-primary-600/30 hover:bg-primary-800/60",
        iconChecked: "text-orange-400",
        iconUnchecked: "text-primary-400",
      }
    },
    {
      id: 5,
      text: "This is the ULTIMATE AP exam simulation. I am ready to demonstrate mastery of CERC justification.",
      icon: <Users className="w-5 h-5" />,
      colorClasses: {
        checked: "bg-accent-500/10 border-accent-500/30",
        unchecked: "bg-primary-800/40 border-primary-600/30 hover:bg-primary-800/60",
        iconChecked: "text-accent-400",
        iconUnchecked: "text-primary-400",
      }
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs
          items={[
            { label: "Week 4", href: "/student/week/4" },
            { label: "Boss Battle", href: "/student/week/4/battle" },
            { label: "Instructions" },
          ]}
        />

        <div className="mt-8">
          <ActivityInstructions
            activityType="boss-battle"
            activityId="boss-battle"
            activityTitle="Week 4: Boss Battle"
            onComplete={handleComplete}
            customInstructions={bossBattleInstructions}
          />
        </div>
      </div>
    </div>
  );
}
