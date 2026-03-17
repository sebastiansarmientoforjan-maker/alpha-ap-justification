"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Circle, AlertCircle, ArrowRight, FileText, PenTool, Clock } from "lucide-react";
import ShimmerButton from "@/components/ui/shimmer-button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useRouter } from "next/navigation";

export default function PracticeDemoInstructionsPage() {
  const router = useRouter();
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const instructions = [
    {
      id: 1,
      text: "I have paper and pencil ready. I will NOT use digital tools or calculators during this practice.",
      icon: <PenTool className="w-5 h-5" />,
      color: "purple"
    },
    {
      id: 2,
      text: "I understand this is a 5-phase workflow: Understand → Solve on Paper → Justify (CERC) → Self-Check → Reflection.",
      icon: <FileText className="w-5 h-5" />,
      color: "blue"
    },
    {
      id: 3,
      text: "I will verify ALL theorem conditions BEFORE applying the theorem. This is an error-forcing problem.",
      icon: <AlertCircle className="w-5 h-5" />,
      color: "yellow"
    },
    {
      id: 4,
      text: "I will write my complete CERC justification (Claim, Evidence, Reasoning, Conditions) on paper first, then type it in.",
      icon: <CheckCircle className="w-5 h-5" />,
      color: "green"
    },
    {
      id: 5,
      text: "I understand there is NO time limit. I will take the time needed to write a rigorous justification.",
      icon: <Clock className="w-5 h-5" />,
      color: "accent"
    },
  ];

  const toggleCheck = (id: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const allChecked = instructions.every(item => checkedItems[item.id]);

  const handleStart = () => {
    if (allChecked) {
      router.push("/student/week/1/practice");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs
          items={[
            { label: "Week 1", href: "/student/week/1" },
            { label: "Practice Demo", href: "/student/week/1/practice" },
            { label: "Instructions" },
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-accent-500 to-secondary-500 mb-6 shadow-lg">
              <FileText className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Before You Start
            </h1>
            <p className="text-xl text-primary-200 max-w-2xl mx-auto">
              Read and confirm each instruction below. This ensures you're ready for the AP-style practice workflow.
            </p>
          </div>

          {/* Instructions Checklist */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="text-accent-400">✓</span> Required Setup
            </h2>

            <div className="space-y-4">
              {instructions.map((item, index) => {
                const isChecked = checkedItems[item.id];
                const colorClasses = {
                  purple: "from-purple-500 to-purple-600 border-purple-500/30 bg-purple-500/10",
                  blue: "from-blue-500 to-blue-600 border-blue-500/30 bg-blue-500/10",
                  yellow: "from-yellow-500 to-yellow-600 border-yellow-500/30 bg-yellow-500/10",
                  green: "from-green-500 to-green-600 border-green-500/30 bg-green-500/10",
                  accent: "from-accent-500 to-secondary-500 border-accent-500/30 bg-accent-500/10",
                };

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => toggleCheck(item.id)}
                      className={`w-full text-left p-5 rounded-xl border transition-all duration-300 ${
                        isChecked
                          ? `${colorClasses[item.color as keyof typeof colorClasses]} border-opacity-100`
                          : "bg-primary-800/40 border-primary-600/30 hover:bg-primary-800/60"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <div className="flex-shrink-0 mt-0.5">
                          {isChecked ? (
                            <CheckCircle className={`w-6 h-6 text-${item.color}-400`} />
                          ) : (
                            <Circle className="w-6 h-6 text-primary-400" />
                          )}
                        </div>

                        {/* Icon */}
                        <div className={`flex-shrink-0 mt-0.5 ${isChecked ? `text-${item.color}-400` : "text-primary-400"}`}>
                          {item.icon}
                        </div>

                        {/* Text */}
                        <div className="flex-grow">
                          <p className={`text-sm md:text-base leading-relaxed ${
                            isChecked ? "text-white font-medium" : "text-primary-200"
                          }`}>
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Warning Message */}
          {!allChecked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-8"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-yellow-300 mb-2">Please confirm all instructions</h3>
                  <p className="text-sm text-yellow-200">
                    You must check all boxes above to proceed. These are essential requirements for AP exam preparation.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Start Button */}
          <div className="flex justify-center">
            <ShimmerButton
              onClick={handleStart}
              disabled={!allChecked}
              className={`px-12 py-4 text-lg ${
                !allChecked ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <span className="flex items-center gap-3">
                Start Practice Demo
                <ArrowRight className="w-5 h-5" />
              </span>
            </ShimmerButton>
          </div>

          {/* Progress Indicator */}
          <div className="mt-8 text-center">
            <p className="text-sm text-primary-300">
              {Object.values(checkedItems).filter(Boolean).length} of {instructions.length} confirmed
            </p>
            <div className="mt-3 max-w-xs mx-auto h-2 bg-primary-800/60 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(Object.values(checkedItems).filter(Boolean).length / instructions.length) * 100}%`
                }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-accent-500 to-secondary-500 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
