"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Circle, AlertCircle, ArrowRight, FileText, PenTool, Clock, Target, Lightbulb } from "lucide-react";
import ShimmerButton from "@/components/ui/shimmer-button";

interface Instruction {
  id: number;
  text: string;
  icon: React.ReactNode;
  colorClasses: {
    checked: string;
    unchecked: string;
    iconChecked: string;
    iconUnchecked: string;
  };
}

interface ActivityInstructionsProps {
  activityType: "practice" | "problem" | "boss-battle";
  activityId: string;
  activityTitle: string;
  onComplete: () => void;
  customInstructions?: Instruction[];
}

export function ActivityInstructions({
  activityType,
  activityId,
  activityTitle,
  onComplete,
  customInstructions
}: ActivityInstructionsProps) {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [mounted, setMounted] = useState(false);

  const storageKey = `activity-instructions-${activityId}`;
  const completedKey = `activity-instructions-completed-${activityId}`;
  const timestampKey = `activity-instructions-timestamp-${activityId}`;

  // Default instructions for problems
  const defaultInstructions: Instruction[] = [
    {
      id: 1,
      text: "I have paper and pencil ready. I will NOT use digital tools or calculators during this problem.",
      icon: <PenTool className="w-5 h-5" />,
      colorClasses: {
        checked: "bg-purple-500/10 border-purple-500/30",
        unchecked: "bg-primary-800/40 border-primary-600/30 hover:bg-primary-800/60",
        iconChecked: "text-purple-400",
        iconUnchecked: "text-primary-400",
      }
    },
    {
      id: 2,
      text: "I understand this is a 5-phase workflow: Understand → Solve on Paper → Justify (CERC) → Self-Check → Reflection.",
      icon: <FileText className="w-5 h-5" />,
      colorClasses: {
        checked: "bg-blue-500/10 border-blue-500/30",
        unchecked: "bg-primary-800/40 border-primary-600/30 hover:bg-primary-800/60",
        iconChecked: "text-blue-400",
        iconUnchecked: "text-primary-400",
      }
    },
    {
      id: 3,
      text: "I will verify ALL theorem conditions BEFORE applying the theorem. This is an error-forcing problem.",
      icon: <AlertCircle className="w-5 h-5" />,
      colorClasses: {
        checked: "bg-yellow-500/10 border-yellow-500/30",
        unchecked: "bg-primary-800/40 border-primary-600/30 hover:bg-primary-800/60",
        iconChecked: "text-yellow-400",
        iconUnchecked: "text-primary-400",
      }
    },
    {
      id: 4,
      text: "I will write my complete CERC justification (Claim, Evidence, Reasoning, Conditions) on paper first, then type it in.",
      icon: <CheckCircle className="w-5 h-5" />,
      colorClasses: {
        checked: "bg-green-500/10 border-green-500/30",
        unchecked: "bg-primary-800/40 border-primary-600/30 hover:bg-primary-800/60",
        iconChecked: "text-green-400",
        iconUnchecked: "text-primary-400",
      }
    },
    {
      id: 5,
      text: "I understand there is NO time limit. I will take the time needed to write a rigorous justification.",
      icon: <Clock className="w-5 h-5" />,
      colorClasses: {
        checked: "bg-accent-500/10 border-accent-500/30",
        unchecked: "bg-primary-800/40 border-primary-600/30 hover:bg-primary-800/60",
        iconChecked: "text-accent-400",
        iconUnchecked: "text-primary-400",
      }
    },
  ];

  const instructions = customInstructions || defaultInstructions;

  // Load saved state from localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved instructions state", e);
      }
    }
  }, [storageKey]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(storageKey, JSON.stringify(checkedItems));
    }
  }, [checkedItems, mounted, storageKey]);

  const toggleCheck = (id: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const allChecked = instructions.every(item => checkedItems[item.id]);

  const handleStart = () => {
    if (allChecked) {
      // Mark that user completed instructions
      localStorage.setItem(completedKey, "true");
      localStorage.setItem(timestampKey, new Date().toISOString());
      onComplete();
    }
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const progress = (checkedCount / instructions.length) * 100;

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-accent-500 to-secondary-500 mb-6 shadow-lg"
          >
            <Target className="w-10 h-10" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Before You Start
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-primary-200 max-w-2xl mx-auto"
          >
            Read and confirm each instruction below for <span className="text-accent-400 font-semibold">{activityTitle}</span>
          </motion.p>
        </div>

        {/* Instructions Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="text-accent-400">✓</span> Required Setup
          </h2>

          <div className="space-y-4">
            {instructions.map((item, index) => {
              const isChecked = checkedItems[item.id];

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                >
                  <button
                    onClick={() => toggleCheck(item.id)}
                    className={`w-full text-left p-5 rounded-xl border transition-all duration-300 ${
                      isChecked
                        ? item.colorClasses.checked
                        : item.colorClasses.unchecked
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <motion.div
                        className="flex-shrink-0 mt-0.5"
                        animate={{
                          scale: isChecked ? [1, 1.2, 1] : 1
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {isChecked ? (
                          <CheckCircle className={`w-6 h-6 ${item.colorClasses.iconChecked}`} />
                        ) : (
                          <Circle className="w-6 h-6 text-primary-400" />
                        )}
                      </motion.div>

                      {/* Icon */}
                      <div className={`flex-shrink-0 mt-0.5 transition-colors duration-300 ${
                        isChecked ? item.colorClasses.iconChecked : item.colorClasses.iconUnchecked
                      }`}>
                        {item.icon}
                      </div>

                      {/* Text */}
                      <div className="flex-grow">
                        <p className={`text-sm md:text-base leading-relaxed transition-all duration-300 ${
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
        </motion.div>

        {/* Warning/Success Message with AnimatePresence */}
        <AnimatePresence mode="wait">
          {!allChecked && (
            <motion.div
              key="warning"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 overflow-hidden"
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

          {allChecked && (
            <motion.div
              key="success"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 overflow-hidden"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-green-300 mb-2">All set! You're ready to begin</h3>
                  <p className="text-sm text-green-200">
                    You've confirmed all requirements. Click below to start the activity.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start Button */}
        <div className="flex justify-center">
          <ShimmerButton
            onClick={handleStart}
            disabled={!allChecked}
            className={`px-12 py-4 text-lg transition-all duration-300 ${
              !allChecked ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            }`}
          >
            <span className="flex items-center gap-3">
              Start Activity
              <ArrowRight className="w-5 h-5" />
            </span>
          </ShimmerButton>
        </div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-primary-300 mb-3">
            {checkedCount} of {instructions.length} confirmed
          </p>
          <div className="max-w-xs mx-auto h-2 bg-primary-800/60 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-accent-500 to-secondary-500 rounded-full"
            />
          </div>

          {allChecked && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-green-400 mt-2 font-medium"
            >
              ✓ All requirements confirmed
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
