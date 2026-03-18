"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import ShimmerButton from "@/components/ui/shimmer-button";
import BlurFade from "@/components/ui/blur-fade";
import {
  Target,
  CheckCircle,
  AlertTriangle,
  FileText,
  Award,
} from "lucide-react";

export default function Week3Landing() {
  const [activeTab, setActiveTab] = useState<"challenge" | "skills" | "exam" | "path">("challenge");
  const [viewedSections, setViewedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof window !== 'undefined') {
      const viewed = localStorage.getItem('week3-viewed-sections');
      if (viewed) {
        setViewedSections(new Set(JSON.parse(viewed)));
      } else {
        setViewedSections(new Set([activeTab]));
      }
    }
  }, []);

  const markSectionViewed = (section: string) => {
    const updated = new Set(viewedSections);
    updated.add(section);
    setViewedSections(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('week3-viewed-sections', JSON.stringify(Array.from(updated)));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-x-hidden">
      <Spotlight className="absolute -top-40 left-0 md:left-60 md:-top-20" fill="rgba(0, 217, 255, 0.5)" />

      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex flex-col items-center justify-center px-6 pt-20 pb-16">
        <BlurFade delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-500/20 to-secondary-500/20 border border-accent-500/50 rounded-full mb-6">
            <Target className="w-5 h-5 text-accent-300" />
            <span className="text-sm font-semibold text-accent-200">Week 3 of 4 - No Training Wheels</span>
          </div>
        </BlurFade>

        <BlurFade delay={0.2}>
          <h1 className="text-6xl md:text-7xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-accent-200 to-secondary-200">
            Global Argumentation
          </h1>
        </BlurFade>

        <BlurFade delay={0.3}>
          <p className="text-xl md:text-2xl text-center text-primary-200 max-w-3xl mb-8">
            Multi-concept synthesis + professional communication - blank canvas
          </p>
        </BlurFade>

        <BlurFade delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
            <Link href="/student/week/3/problems">
              <ShimmerButton className="px-8 py-4 text-lg">
                Start Week 3 Problems →
              </ShimmerButton>
            </Link>
            <Link
              href="/student"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </BlurFade>

        <BlurFade delay={0.5}>
          <div className="flex items-center gap-2 text-primary-300">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm">Estimated time: 25-30 minutes per problem</span>
          </div>
        </BlurFade>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* The Milestone */}
        <BlurFade delay={0.6}>
          <div className="mb-12 p-8 bg-gradient-to-br from-secondary-500/10 to-accent-500/10 border border-secondary-500/30 rounded-2xl">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <Award className="w-8 h-8 text-accent-400" />
              You've Reached Week 3
            </h2>
            <div className="space-y-4 text-lg text-primary-200">
              <p>
                <strong className="text-white">Week 1:</strong> You learned when theorems DON'T apply (error-forcing).
              </p>
              <p>
                <strong className="text-white">Week 2:</strong> You proved when theorems DO apply (rigorous verification).
              </p>
              <p className="text-accent-200 font-semibold">
                <strong className="text-white">Week 3:</strong> Now you synthesize multiple concepts and communicate like a professional mathematician.
              </p>
              <p className="text-sm text-primary-300 italic">
                No sentence frames. No structural outlines. Just you and the problem - exactly like the AP exam.
              </p>
            </div>
          </div>
        </BlurFade>

        {/* Sidebar + Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="flex flex-col gap-3 lg:sticky lg:top-24">
                {[
                  { id: "challenge", label: "The Challenge", icon: AlertTriangle },
                  { id: "skills", label: "Synthesis", icon: Target },
                  { id: "exam", label: "AP Prep", icon: FileText },
                  { id: "path", label: "Your Path", icon: CheckCircle },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const isViewed = viewedSections.has(tab.id);

                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        markSectionViewed(tab.id);
                      }}
                      className={`flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition-all text-left ${
                        isActive
                          ? "bg-accent-500 text-white shadow-lg shadow-accent-500/50"
                          : "text-primary-300 hover:bg-white/10 border border-primary-600/30"
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{tab.label}</span>
                      {isViewed && !isActive && (
                        <CheckCircle className="w-4 h-4 ml-auto text-green-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-5xl"
              >
                {activeTab === "challenge" && (
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-6">
                    <h3 className="text-3xl font-bold mb-6">The Challenge: Blank Canvas</h3>
                    <div className="space-y-4 text-base text-primary-200">
                  <p>
                    Week 3 removes all scaffolding. You see a problem statement, and you write a complete CERC argument from scratch.
                  </p>
                  <div className="p-6 bg-red-500/10 border-l-4 border-red-500 rounded-lg my-6">
                    <p className="font-semibold text-red-300 mb-2">What You WON'T See:</p>
                    <ul className="space-y-1 text-sm">
                      <li>❌ No sentence frames like "The theorem [applies / does not apply] because..."</li>
                      <li>❌ No structural outlines like "[State your conclusion]"</li>
                      <li>❌ No hints about which conditions to check</li>
                    </ul>
                  </div>
                  <div className="p-6 bg-green-500/10 border-l-4 border-green-500 rounded-lg">
                    <p className="font-semibold text-green-300 mb-2">What You WILL See:</p>
                    <ul className="space-y-1 text-sm">
                      <li>✅ Real-world scenario with context</li>
                      <li>✅ Multiple parts (a), (b), (c), (d)</li>
                      <li>✅ CERC field headers (Claim, Evidence, Reasoning, Conditions)</li>
                      <li>✅ Blank text boxes for YOUR complete argument</li>
                    </ul>
                  </div>
                  <p className="text-accent-200 font-semibold mt-6">
                      If you've done Weeks 1-2 properly, you DON'T NEED scaffolding anymore. You already know the pattern.
                    </p>
                  </div>
                  </div>
                )}

                {activeTab === "skills" && (
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-6">
                    <h3 className="text-3xl font-bold mb-6">Multi-Concept Synthesis</h3>
                    <div className="space-y-6 text-base text-primary-200">
                  <p>
                    Week 3 problems integrate MULTIPLE AP concepts in a single scenario. You can't just "apply MVT" - you need to navigate a complex problem.
                  </p>

                  <div className="p-6 bg-accent-500/10 border border-accent-500/30 rounded-xl">
                    <p className="font-bold text-accent-200 mb-3">Example: Particle Motion Problem</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-accent-400 mt-1">•</span>
                        <span><strong>Part (a):</strong> Find position from velocity (FTC + integration)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent-400 mt-1">•</span>
                        <span><strong>Part (b):</strong> When is particle at rest? (solving equations)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent-400 mt-1">•</span>
                        <span><strong>Part (c):</strong> Total distance traveled (checking direction changes)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent-400 mt-1">•</span>
                        <span><strong>Part (d):</strong> Speeding up or slowing down? (velocity AND acceleration)</span>
                      </li>
                    </ul>
                    <p className="mt-4 text-accent-200 font-semibold">
                      Four different skills. One coherent problem. That's synthesis.
                    </p>
                  </div>

                  <div className="p-6 bg-secondary-500/10 border border-secondary-500/30 rounded-xl">
                    <p className="font-bold text-secondary-200 mb-3">Example: Study Design + Inference</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-secondary-400 mt-1">•</span>
                        <span><strong>Part (a):</strong> Experiment vs observational study (study design)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-secondary-400 mt-1">•</span>
                        <span><strong>Part (b):</strong> State hypotheses (parameter definition)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-secondary-400 mt-1">•</span>
                        <span><strong>Part (c):</strong> Verify conditions (inference procedure)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-secondary-400 mt-1">•</span>
                        <span><strong>Part (d):</strong> Interpret conclusion + address causation (synthesis)</span>
                      </li>
                    </ul>
                    <p className="mt-4 text-secondary-200 font-semibold">
                      You need to think globally about the entire scenario, not just calculate the test statistic.
                      </p>
                    </div>
                  </div>
                  </div>
                )}

                {activeTab === "exam" && (
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-6">
                    <h3 className="text-3xl font-bold mb-6">Week 3 = AP Exam Preparation</h3>
                    <div className="space-y-6 text-base text-primary-200">
                  <p>
                    The AP exam is in a few weeks. Week 3 is your dress rehearsal.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                      <p className="font-semibold text-green-300 mb-2">✅ What Week 3 Prepares You For:</p>
                      <ul className="space-y-1 text-sm">
                        <li>• Multi-part FRQ structure</li>
                        <li>• Real-world contexts with units</li>
                        <li>• "Justify" and "Explain" prompts</li>
                        <li>• Interpreting results in context</li>
                        <li>• Writing without scaffolding</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-accent-500/10 border border-accent-500/30 rounded-xl">
                      <p className="font-semibold text-accent-300 mb-2">🎯 What the AP Exam Tests:</p>
                      <ul className="space-y-1 text-sm">
                        <li>• Can you DO the math? (calculation)</li>
                        <li>• Can you JUSTIFY it? (reasoning)</li>
                        <li>• Can you COMMUNICATE it? (clarity)</li>
                        <li>• Can you INTERPRET it? (context)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 bg-yellow-500/10 border-l-4 border-yellow-500 rounded-lg">
                    <p className="font-semibold text-yellow-300 mb-2">Communication Precision (Critical for AP):</p>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-yellow-400 font-semibold">Calculus:</p>
                        <p className="text-red-300">❌ "The rate is positive"</p>
                        <p className="text-green-300">✅ "Since f'(2) = 3 &gt; 0, the water level is rising at t=2 minutes at a rate of 3 gallons per minute"</p>
                      </div>
                      <div>
                        <p className="text-yellow-400 font-semibold">Statistics:</p>
                        <p className="text-red-300">❌ "The test is significant"</p>
                        <p className="text-green-300">✅ "Since p-value (0.032) &lt; α (0.05), we have convincing evidence that the true proportion differs from 0.60"</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-accent-200 font-semibold">
                    By the end of Week 3, AP FRQs will feel familiar. You've been doing AP-level problems with AP-level rigor.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "path" && (
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-6">
                <h3 className="text-3xl font-bold mb-6">Your Path Through Week 3</h3>
                <div className="space-y-6 text-base text-primary-200">
                  {[
                    {
                      step: 1,
                      title: "Read the ENTIRE problem",
                      description:
                        "Don't jump to part (a). Read all parts first. Understand the big picture before diving into details.",
                    },
                    {
                      step: 2,
                      title: "Identify which concepts are being integrated",
                      description:
                        "Is this particle motion + MVT? Study design + inference? Regression + causation? Recognize the synthesis.",
                    },
                    {
                      step: 3,
                      title: "For each part, determine what's REALLY being asked",
                      description:
                        "Look for action verbs: 'Justify' = prove with theorem. 'Interpret' = explain in context with units. 'Explain' = address the underlying concept.",
                    },
                    {
                      step: 4,
                      title: "Write your CERC argument without scaffolding",
                      description:
                        "You have blank text boxes. Fill them with complete, professional mathematical arguments. Include context, units, and theorem citations.",
                    },
                    {
                      step: 5,
                      title: "Self-check with extreme rigor",
                      description:
                        "Did you verify ALL conditions? Did you use precise language? Did you interpret in context? Did you address causation if applicable?",
                    },
                  ].map((item, index) => (
                    <BlurFade key={item.step} delay={0.8 + index * 0.1}>
                      <div className="flex gap-4 items-start">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-accent-500 to-secondary-500 flex items-center justify-center text-xl font-bold shadow-lg shadow-accent-500/30">
                          {item.step}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                          <p className="text-primary-200">{item.description}</p>
                        </div>
                      </div>
                    </BlurFade>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Learning Objectives */}
        <div className="max-w-5xl">
          <BlurFade delay={1.0}>
            <div className="mt-12 p-8 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="text-2xl font-bold mb-6">Week 3 Learning Objectives</h3>
            <ul className="space-y-3">
              {[
                "Synthesize multiple AP concepts in a single problem",
                "Write complete mathematical arguments without scaffolding",
                "Communicate with professional precision (context, units, non-deterministic language)",
                "Interpret results and address deeper questions (causation, study design, reliability)",
              ].map((objective, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-primary-200">{objective}</span>
                </li>
              ))}
            </ul>
            </div>
          </BlurFade>

          {/* Badge Callout */}
          <BlurFade delay={1.1}>
            <div className="mt-12 p-8 bg-gradient-to-br from-accent-500/10 to-secondary-500/10 border-2 border-accent-500/50 rounded-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-500 to-secondary-500 flex items-center justify-center text-4xl shadow-lg shadow-accent-500/50">
                🏛️
              </div>
              <div>
                <h3 className="text-2xl font-bold text-accent-200">The Architect Badge</h3>
                <p className="text-primary-300">Week 3 Ultimate Achievement</p>
              </div>
            </div>
            <p className="text-primary-200 mb-4">
              Earn "The Architect" badge by submitting a <strong className="text-white">flawless CERC proof</strong> without using ANY hints or viewing the solution.
            </p>
            <p className="text-sm text-primary-300">
              This badge proves you can construct AP-level mathematical arguments completely independently. It's the mark of mastery.
            </p>
            </div>
          </BlurFade>

          {/* CTA */}
          <BlurFade delay={1.2}>
            <div className="mt-12 text-center">
            <Link href="/student/week/3/problems">
              <ShimmerButton className="px-10 py-5 text-xl">
                Begin Week 3 Problems →
              </ShimmerButton>
            </Link>
            <p className="mt-6 text-primary-300 text-sm">
              3-4 problems • 25-30 minutes each • No scaffolding - blank canvas
            </p>
            </div>
          </BlurFade>
        </div>
      </div>
      </div>
    </div>
  );
}
