"use client";

import { useState } from "react";
import { FRQAssignment, FRQSubmission, User } from "@/lib/types";
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight";
import {
  Home,
  ChevronLeft,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
  Save,
  Send,
  Clock,
  Download,
  ArrowRight,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface FRQSolverProps {
  assignment: FRQAssignment;
  submission: FRQSubmission | null;
  user: User;
}

type WorkflowStep = "upload" | "self-evaluate" | "complete";

export function FRQSolver({ assignment, submission, user }: FRQSolverProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WorkflowStep>(
    submission?.fileUrl ? (submission?.selfEvaluation ? "complete" : "self-evaluate") : "upload"
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(submission?.fileUrl || null);
  const [selfEvalScore, setSelfEvalScore] = useState<string>("");
  const [selfEvalNotes, setSelfEvalNotes] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPending = assignment.status === "pending";
  const isSubmitted = assignment.status === "submitted";
  const isGraded = assignment.status === "graded";
  const hasFeedback = assignment.status === "feedback_delivered";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleUploadFile = async () => {
    if (!uploadedFile) {
      alert("Please select a file first.");
      return;
    }

    setIsUploading(true);

    try {
      // In production, upload file to Firebase Storage/S3 first
      const mockFileUrl = `https://storage.example.com/${uploadedFile.name}`;
      setFileUrl(mockFileUrl);

      // Move to self-evaluation step
      setCurrentStep("self-evaluate");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitSelfEval = async () => {
    if (!fileUrl || !selfEvalScore) {
      alert("Please complete the self-evaluation.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/student/frqs/frq/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: assignment.id,
          fileUrl: fileUrl,
          selfEvaluation: {
            score: parseInt(selfEvalScore),
            notes: selfEvalNotes,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit FRQ");
      }

      router.refresh();
      router.push("/student/frqs");
    } catch (error) {
      console.error("Error submitting FRQ:", error);
      alert("Failed to submit FRQ. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    // In production, generate PDF from problem statement
    alert("PDF download functionality - to be implemented with PDF generation library");
  };

  const daysUntilDue = Math.ceil(
    (new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
      {/* Spotlight Effect */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#00D9FF" />

      {/* Geometric Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#2C4F5E1a_1px,transparent_1px),linear-gradient(to_bottom,#2C4F5E1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-primary-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="/student/frqs"
                className="group flex items-center gap-2 text-primary-200 hover:text-accent-400 transition-all duration-300"
              >
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-accent-500/10 transition-all duration-300">
                  <ChevronLeft className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Back to FRQs</span>
              </Link>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {assignment.type === "general" ? "General FRQ" : `Topic FRQ: ${assignment.topic}`}
                </h1>
                <p className="text-sm text-primary-300 mt-0.5">
                  {assignment.type === "general"
                    ? "Broad Argumentation Practice"
                    : "Topic-Specific Remediation"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Status Badge */}
              <div
                className={`px-5 py-2.5 rounded-xl backdrop-blur-sm flex items-center gap-2 border ${
                  isPending
                    ? "bg-amber-500/10 border-amber-500/30"
                    : isSubmitted
                    ? "bg-secondary-500/10 border-secondary-500/30"
                    : isGraded
                    ? "bg-accent-500/10 border-accent-500/30"
                    : "bg-green-500/10 border-green-500/30"
                }`}
              >
                {isPending && <Clock className="w-4 h-4 text-amber-400" />}
                {isSubmitted && <Upload className="w-4 h-4 text-secondary-400" />}
                {isGraded && <FileText className="w-4 h-4 text-accent-400" />}
                {hasFeedback && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                <span
                  className={`text-sm font-semibold capitalize ${
                    isPending
                      ? "text-amber-300"
                      : isSubmitted
                      ? "text-secondary-300"
                      : isGraded
                      ? "text-accent-300"
                      : "text-green-300"
                  }`}
                >
                  {assignment.status === "feedback_delivered" ? "Completed" : assignment.status}
                </span>
              </div>

              {/* Due Date */}
              <div className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-300" />
                <span className="text-sm text-white">
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Problem Statement */}
          <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-glass overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 via-transparent to-secondary-500/5 pointer-events-none" />

            <div className="relative p-8">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-accent-500/20 to-secondary-500/20 backdrop-blur-sm">
                    <FileText className="w-6 h-6 text-accent-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Problem Statement</h2>
                    <p className="text-sm text-primary-300">Read carefully before solving</p>
                  </div>
                </div>

                {daysUntilDue > 0 && daysUntilDue <= 3 && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-amber-300">
                      {daysUntilDue === 1 ? "Due tomorrow" : `${daysUntilDue} days remaining`}
                    </span>
                  </div>
                )}
              </div>

              {/* Problem Text */}
              <div className="prose prose-invert max-w-none">
                <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-white leading-relaxed">
                  {assignment.problemStatement}
                </div>
              </div>

              {/* Download PDF Button */}
              <button
                onClick={handleDownloadPDF}
                className="mt-4 w-full group relative px-6 py-3 rounded-xl bg-gradient-to-r from-secondary-500 to-purple-500 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-secondary-500/50 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span>Download Problem as PDF</span>
                <div className="absolute -inset-1 bg-gradient-to-r from-secondary-500 to-purple-500 opacity-20 blur-xl rounded-xl" />
              </button>

              {/* Instructions */}
              <div className="mt-6 p-4 rounded-xl bg-secondary-500/10 border border-secondary-500/30">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-secondary-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white mb-1">Instructions</div>
                    <ul className="text-sm text-primary-300 space-y-1">
                      <li>• Download the problem PDF if needed</li>
                      <li>• Solve this problem on paper</li>
                      <li>• Show all work and justify each step</li>
                      <li>• Take a clear photo of your solution</li>
                      <li>• Upload the photo</li>
                      <li>• Complete self-evaluation with AP rubric</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Week Reference */}
              {assignment.weekReference && (
                <div className="mt-4 p-4 rounded-xl bg-accent-500/10 border border-accent-500/30">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white mb-1">
                        Study Week {assignment.weekReference} First
                      </div>
                      <p className="text-sm text-primary-300 mb-3">
                        Before attempting this FRQ, review the relevant course content to strengthen your justification skills.
                      </p>
                      {assignment.contentLinks && assignment.contentLinks.length > 0 && (
                        <div className="space-y-2">
                          {assignment.contentLinks.map((link, index) => (
                            <div key={index} className="text-sm">
                              <span className="text-accent-400 font-medium">Week {link.weekNumber}, {link.section}:</span>
                              <span className="text-primary-200 ml-1">{link.concept}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* CERC Scaffolding */}
              {assignment.cercScaffolding && assignment.cercScaffolding.level !== "none" && (
                <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-white mb-1">
                        CERC Framework Guide
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">
                          {assignment.cercScaffolding.level === "full" ? "Full Support" :
                           assignment.cercScaffolding.level === "structural" ? "Structural Hints" :
                           "Minimal Hints"}
                        </span>
                      </div>

                      {/* Sentence Frames (Full scaffolding) */}
                      {assignment.cercScaffolding.sentenceFrames && assignment.cercScaffolding.sentenceFrames.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs text-primary-400 uppercase tracking-wide mb-2">Sentence Frames to Guide Your Response:</p>
                          {assignment.cercScaffolding.sentenceFrames.map((frame, index) => (
                            <div key={index} className="text-sm text-primary-200 pl-3 border-l-2 border-green-500/30">
                              {frame}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Theorem Hints */}
                      {assignment.cercScaffolding.theoremHints && assignment.cercScaffolding.theoremHints.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs text-primary-400 uppercase tracking-wide mb-2">
                            {assignment.cercScaffolding.level === "full" ? "Remember:" : "Key Points:"}
                          </p>
                          {assignment.cercScaffolding.theoremHints.map((hint, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm text-primary-200">
                              <span className="text-green-400 flex-shrink-0">•</span>
                              <span>{hint}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Submission Form */}
          <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-glass overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 via-transparent to-secondary-500/5 pointer-events-none" />

            <div className="relative p-8">
              {isPending ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-4">Submit Your Work</h2>
                    <p className="text-sm text-primary-300 mb-6">
                      Follow the steps to complete your submission
                    </p>
                  </div>

                  {/* Progress Steps */}
                  <div className="flex items-center gap-2 mb-8">
                    {/* Step 1: Upload */}
                    <div className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                      currentStep === "upload"
                        ? "bg-accent-500/20 border-accent-500/50"
                        : fileUrl
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-white/5 border-white/10"
                    }`}>
                      {fileUrl ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                          currentStep === "upload" ? "border-accent-400 text-accent-400" : "border-white/30 text-white/50"
                        }`}>
                          1
                        </div>
                      )}
                      <span className={`text-sm font-medium ${
                        currentStep === "upload" ? "text-white" : fileUrl ? "text-green-300" : "text-primary-400"
                      }`}>
                        Upload
                      </span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-primary-400" />

                    {/* Step 2: Self-Evaluate */}
                    <div className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                      currentStep === "self-evaluate"
                        ? "bg-accent-500/20 border-accent-500/50"
                        : currentStep === "complete"
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-white/5 border-white/10"
                    }`}>
                      {currentStep === "complete" ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                          currentStep === "self-evaluate" ? "border-accent-400 text-accent-400" : "border-white/30 text-white/50"
                        }`}>
                          2
                        </div>
                      )}
                      <span className={`text-sm font-medium ${
                        currentStep === "self-evaluate" ? "text-white" : currentStep === "complete" ? "text-green-300" : "text-primary-400"
                      }`}>
                        Self-Evaluate
                      </span>
                    </div>
                  </div>

                  {/* Step 1: File Upload */}
                  {currentStep === "upload" && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-white mb-3">
                          Your Solution (Photo or PDF)
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="hidden"
                            id="frq-file"
                          />
                          <label
                            htmlFor="frq-file"
                            className="flex flex-col items-center justify-center px-6 py-12 border-2 border-dashed border-white/20 rounded-xl bg-white/5 hover:bg-white/10 hover:border-accent-500/50 transition-all duration-300 cursor-pointer group"
                          >
                            <Upload className="w-12 h-12 text-primary-400 group-hover:text-accent-400 transition-colors mb-3" />
                            <div className="text-sm font-medium text-white mb-1">
                              {uploadedFile ? uploadedFile.name : "Click to upload photo"}
                            </div>
                            <div className="text-xs text-primary-400">
                              PDF, JPG, or PNG (max 10MB)
                            </div>
                          </label>
                        </div>
                      </div>

                      <button
                        onClick={handleUploadFile}
                        disabled={!uploadedFile || isUploading}
                        className="w-full group relative px-6 py-4 rounded-xl bg-gradient-to-r from-accent-500 to-secondary-500 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-accent-500/50 hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {isUploading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <ArrowRight className="w-5 h-5" />
                            <span>Continue to Self-Evaluation</span>
                          </>
                        )}
                        {!isUploading && (
                          <div className="absolute -inset-1 bg-gradient-to-r from-accent-500 to-secondary-500 opacity-20 blur-xl rounded-xl" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Step 2: Self-Evaluation */}
                  {currentStep === "self-evaluate" && (
                    <div className="space-y-6">
                      {/* File Uploaded Confirmation */}
                      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <div>
                          <div className="text-sm font-medium text-white">File uploaded successfully</div>
                          <div className="text-xs text-green-300">{uploadedFile?.name}</div>
                        </div>
                      </div>

                      <div className="p-6 rounded-xl bg-accent-500/10 border border-accent-500/30">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-accent-400" />
                          Self-Evaluation (AP Rubric)
                        </h3>

                        <div className="space-y-4">
                          {/* Score */}
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">
                              Your Score (0-9)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="9"
                              value={selfEvalScore}
                              onChange={(e) => setSelfEvalScore(e.target.value)}
                              placeholder="Enter 0-9"
                              className="w-full px-4 py-3 rounded-lg bg-primary-800/60 border border-white/10 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all"
                            />
                          </div>

                          {/* Notes */}
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">
                              Reflection Notes (Optional)
                            </label>
                            <textarea
                              value={selfEvalNotes}
                              onChange={(e) => setSelfEvalNotes(e.target.value)}
                              placeholder="What did you find challenging? What are you confident about?"
                              rows={4}
                              className="w-full px-4 py-3 rounded-lg bg-primary-800/60 border border-white/10 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all resize-none"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleSubmitSelfEval}
                        disabled={!selfEvalScore || isSubmitting}
                        className="w-full group relative px-6 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            <span>Submit FRQ</span>
                          </>
                        )}
                        {!isSubmitting && (
                          <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 opacity-20 blur-xl rounded-xl" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Submitted State */}
                  {isSubmitted && (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-secondary-500/20 to-secondary-600/20 border-2 border-secondary-500/30 flex items-center justify-center backdrop-blur-sm">
                        <Upload className="w-10 h-10 text-secondary-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Submission Received</h3>
                      <p className="text-primary-300 mb-6">
                        Your work has been submitted and is being reviewed by MathGrader.AI
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary-500/10 border border-secondary-500/30">
                        <Clock className="w-4 h-4 text-secondary-400" />
                        <span className="text-sm text-secondary-300">Review in progress</span>
                      </div>
                    </div>
                  )}

                  {/* Graded State */}
                  {(isGraded || hasFeedback) && submission && (
                    <div>
                      <h2 className="text-xl font-bold text-white mb-6">Your Results</h2>

                      {/* Self-Evaluation */}
                      <div className="p-6 rounded-xl bg-white/5 border border-white/10 mb-4">
                        <h3 className="font-semibold text-white mb-3">Your Self-Evaluation</h3>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="text-3xl font-bold text-accent-400">
                            {submission.selfEvaluation.score}/9
                          </div>
                          <div className="text-sm text-primary-300">AP Rubric Score</div>
                        </div>
                        {submission.selfEvaluation.notes && (
                          <p className="text-sm text-primary-300 italic">
                            "{submission.selfEvaluation.notes}"
                          </p>
                        )}
                      </div>

                      {/* MathGrader Output */}
                      {submission.mathGraderOutput && (
                        <div className="p-6 rounded-xl bg-accent-500/10 border border-accent-500/30 mb-4">
                          <h3 className="font-semibold text-white mb-3">MathGrader.AI Analysis</h3>
                          {submission.mathGraderScore !== null && (
                            <div className="flex items-center gap-4 mb-3">
                              <div className="text-3xl font-bold text-accent-400">
                                {submission.mathGraderScore}/9
                              </div>
                              <div className="text-sm text-primary-300">AI Score</div>
                            </div>
                          )}
                          <div className="text-sm text-primary-200 whitespace-pre-wrap">
                            {submission.mathGraderOutput}
                          </div>
                        </div>
                      )}

                      {/* Action Points */}
                      {submission.actionPoints && submission.actionPoints.length > 0 && (
                        <div className="p-6 rounded-xl bg-secondary-500/10 border border-secondary-500/30">
                          <h3 className="font-semibold text-white mb-3">Action Points from Sebastian</h3>
                          <ul className="space-y-2">
                            {submission.actionPoints.map((point, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-secondary-400 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-primary-200">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
