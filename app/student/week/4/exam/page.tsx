/**
 * Week 4: AP Exam Simulation
 * Individual timed FRQ under real exam conditions
 */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, Trophy, AlertCircle, ArrowLeft, CheckCircle,
  Target, FileText, AlertTriangle, Award, Timer
} from "lucide-react";
import ShimmerButton from "@/components/ui/shimmer-button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { apExamSimulations, week4Config } from "@/data/week-4-content";
import { MathContent } from "@/components/student/math-content";
import { getDataService } from "@/services/data";
import { redirectToInstructions } from "@/lib/utils/activity-instructions";
import { sanitizeInput } from "@/lib/utils/input-sanitizer";

type PartId = "partA" | "partB" | "partC" | "partD";

interface ExamData {
  startTime: number;
  timeRemaining: number; // seconds
  responses: {
    partA: string;
    partB: string;
    partC: string;
    partD?: string;
  };
  submitted: boolean;
  currentPart: PartId;
  hintsViewed: number;
  solutionViewed: boolean;
}

export default function APExamPage() {
  // Get student course (mock: calculus-ab for now)
  const [studentCourse] = useState<"calculus-ab" | "calculus-bc" | "statistics">("calculus-ab");
  const exam = apExamSimulations.find(e => e.course === studentCourse) || apExamSimulations[0];

  const [examData, setExamData] = useState<ExamData>({
    startTime: Date.now(),
    timeRemaining: exam.timeLimit * 60, // convert minutes to seconds
    responses: {
      partA: "",
      partB: "",
      partC: "",
      partD: exam.parts.partD ? "" : undefined
    },
    submitted: false,
    currentPart: "partA",
    hintsViewed: 0,
    solutionViewed: false
  });

  const [timerActive, setTimerActive] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [showHints, setShowHints] = useState(false);

  // Redirect to instructions if not completed
  useEffect(() => {
    redirectToInstructions("exam", "/student/week/4/exam");
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timerActive && examData.timeRemaining > 0 && !examData.submitted) {
      const interval = setInterval(() => {
        setExamData(prev => {
          const newTime = prev.timeRemaining - 1;
          if (newTime <= 0) {
            setTimerActive(false);
            setShowTimeUpModal(true);
            return { ...prev, timeRemaining: 0 };
          }
          return { ...prev, timeRemaining: newTime };
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerActive, examData.timeRemaining, examData.submitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartExam = () => {
    setTimerActive(true);
    setExamData(prev => ({
      ...prev,
      startTime: Date.now()
    }));
  };

  const handleResponseChange = (part: PartId, value: string) => {
    setExamData(prev => ({
      ...prev,
      responses: {
        ...prev.responses,
        [part]: sanitizeInput(value)
      }
    }));
  };

  const handleSubmit = async () => {
    setShowSubmitModal(false);
    setTimerActive(false);

    const dataService = getDataService();

    try {
      // Calculate time taken
      const timeTaken = Math.floor((Date.now() - examData.startTime) / 1000);

      // Submit exam responses
      await dataService.submitCERCResponse(
        "student-mock-id",
        exam.id,
        4, // week 4
        {
          claim: "Exam completed",
          evidence: JSON.stringify(examData.responses),
          reasoning: `Time taken: ${formatTime(timeTaken)}`,
          conditions: `Time limit: ${exam.timeLimit} minutes`
        }
      );

      setExamData(prev => ({ ...prev, submitted: true }));
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert("Error submitting exam. Please try again.");
    }
  };

  const parts: { id: PartId; label: string; text: string }[] = [
    { id: "partA", label: "Part A", text: exam.parts.partA },
    { id: "partB", label: "Part B", text: exam.parts.partB },
    { id: "partC", label: "Part C", text: exam.parts.partC },
  ];

  if (exam.parts.partD) {
    parts.push({ id: "partD", label: "Part D", text: exam.parts.partD });
  }

  // Time warning colors
  const getTimerColor = () => {
    if (examData.timeRemaining > 300) return "text-green-400"; // > 5 min
    if (examData.timeRemaining > 120) return "text-yellow-400"; // > 2 min
    return "text-red-400"; // < 2 min
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
      {/* Back Button */}
      <Link
        href="/student/week/4"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-primary-900/90 hover:bg-primary-800/90 border border-primary-700/50 hover:border-accent-500/50 rounded-lg backdrop-blur-xl transition-all duration-300 group shadow-lg"
      >
        <ArrowLeft className="w-4 h-4 text-primary-300 group-hover:text-accent-400 transition-colors" />
        <span className="text-sm font-medium text-primary-200 group-hover:text-white transition-colors">
          Back
        </span>
      </Link>

      {/* Timer Display - Fixed Top Right */}
      {timerActive && !examData.submitted && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 right-6 z-50"
        >
          <div className={`flex items-center gap-3 px-6 py-3 bg-primary-900/95 border-2 rounded-lg backdrop-blur-xl shadow-2xl ${
            examData.timeRemaining < 120 ? "border-red-500/50 animate-pulse" : "border-primary-700/50"
          }`}>
            <Timer className={`w-5 h-5 ${getTimerColor()}`} />
            <span className={`text-2xl font-bold font-mono ${getTimerColor()}`}>
              {formatTime(examData.timeRemaining)}
            </span>
          </div>
        </motion.div>
      )}

      <div className="container mx-auto px-6 pt-24 pb-12">
        <Breadcrumbs
          items={[
            { label: "Week 4", href: "/student/week/4" },
            { label: "AP Exam Simulation" },
          ]}
        />

        {/* Header */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <Trophy className="w-12 h-12 text-amber-400" />
            <h1 className="text-5xl font-bold">{exam.title}</h1>
          </motion.div>

          <p className="text-xl text-primary-200 max-w-3xl mx-auto mb-4">
            {week4Config.focus}
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-primary-300">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{exam.timeLimit} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>{parts.length} parts</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>Individual work</span>
            </div>
          </div>
        </div>

        {/* Pre-Start Screen */}
        {!timerActive && !examData.submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-primary-800/50 border border-primary-700/50 rounded-xl p-8 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Before You Begin</h3>
                  <ul className="space-y-2 text-primary-200">
                    <li>• You have <strong>{exam.timeLimit} minutes</strong> to complete all parts</li>
                    <li>• <strong>No scaffolding</strong> - write your complete CERC justification for each part</li>
                    <li>• The timer starts when you click "Start Exam"</li>
                    <li>• You can submit early or wait until time expires</li>
                    <li>• This simulates real AP exam conditions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Problem Statement */}
            <div className="bg-primary-800/50 border border-primary-700/50 rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">Problem Statement</h3>
              <div className="prose prose-invert max-w-none">
                <MathContent content={exam.problemStatement} />
              </div>

              <div className="mt-8 pt-6 border-t border-primary-700/30">
                <h4 className="text-lg font-semibold text-white mb-4">Parts:</h4>
                <div className="space-y-3">
                  {parts.map((part) => (
                    <div key={part.id} className="flex gap-3">
                      <span className="font-bold text-accent-400">{part.label}:</span>
                      <MathContent content={part.text} className="text-primary-200" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center">
              <ShimmerButton onClick={handleStartExam}>
                <Trophy className="w-5 h-5 mr-2" />
                Start Exam
              </ShimmerButton>
            </div>
          </motion.div>
        )}

        {/* Exam In Progress */}
        {timerActive && !examData.submitted && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Problem Display */}
            <div className="space-y-6">
              <div className="bg-primary-800/50 border border-primary-700/50 rounded-xl p-6 sticky top-24">
                <h3 className="text-xl font-bold text-white mb-4">Problem</h3>
                <div className="prose prose-invert prose-sm max-w-none mb-6">
                  <MathContent content={exam.problemStatement} />
                </div>

                <div className="pt-4 border-t border-primary-700/30">
                  <h4 className="text-sm font-semibold text-white mb-3">Parts:</h4>
                  <div className="space-y-2 text-sm">
                    {parts.map((part) => (
                      <div key={part.id} className="flex gap-2">
                        <span className="font-bold text-accent-400">{part.label}:</span>
                        <MathContent content={part.text} className="text-primary-200 text-xs" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Response Areas */}
            <div className="space-y-6">
              {parts.map((part) => (
                <div key={part.id} className="bg-primary-800/50 border border-primary-700/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">{part.label}</h3>
                    {examData.responses[part.id] && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>

                  <div className="mb-4 text-sm text-primary-200 bg-primary-900/30 rounded p-3">
                    <MathContent content={part.text} />
                  </div>

                  <textarea
                    value={examData.responses[part.id] || ""}
                    onChange={(e) => handleResponseChange(part.id, e.target.value)}
                    placeholder="Write your complete CERC justification here..."
                    className="w-full h-48 bg-primary-900/50 border border-primary-700/50 rounded-lg p-4 text-white placeholder-primary-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all resize-none"
                  />
                </div>
              ))}

              {/* Submit Button */}
              <div className="text-center pt-4">
                <ShimmerButton
                  onClick={() => setShowSubmitModal(true)}
                  className="w-full"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  Submit Exam
                </ShimmerButton>
              </div>
            </div>
          </div>
        )}

        {/* Submitted Screen */}
        {examData.submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-12">
              <Trophy className="w-20 h-20 text-amber-400 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-white mb-4">Exam Submitted!</h2>
              <p className="text-xl text-primary-200 mb-8">
                Congratulations on completing the Week 4 AP Exam Simulation.
              </p>

              <div className="bg-primary-900/50 rounded-lg p-6 mb-8">
                <div className="grid grid-cols-2 gap-6 text-left">
                  <div>
                    <p className="text-sm text-primary-400 mb-1">Time Taken</p>
                    <p className="text-2xl font-bold text-white">
                      {formatTime((exam.timeLimit * 60) - examData.timeRemaining)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-primary-400 mb-1">Badge Earned</p>
                    <p className="text-2xl font-bold text-amber-400">🎓 Exam Ready</p>
                  </div>
                </div>
              </div>

              <Link href="/">
                <ShimmerButton>
                  Return to Roadmap
                </ShimmerButton>
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowSubmitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-primary-800 border border-primary-700 rounded-xl p-8 max-w-md w-full"
            >
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Submit Exam?</h3>
              <p className="text-primary-200 mb-2 text-center">
                Time remaining: <strong className={getTimerColor()}>{formatTime(examData.timeRemaining)}</strong>
              </p>
              <p className="text-primary-300 text-sm mb-6 text-center">
                Once submitted, you cannot make changes.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 px-6 py-3 bg-primary-700 hover:bg-primary-600 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg font-semibold transition-all"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time Up Modal */}
      <AnimatePresence>
        {showTimeUpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-primary-800 border border-red-500/50 rounded-xl p-8 max-w-md w-full"
            >
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Time's Up!</h3>
              <p className="text-primary-200 mb-6 text-center">
                The {exam.timeLimit}-minute time limit has been reached. Your exam will be submitted automatically.
              </p>

              <button
                onClick={handleSubmit}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-lg font-semibold transition-all"
              >
                Submit Exam
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
