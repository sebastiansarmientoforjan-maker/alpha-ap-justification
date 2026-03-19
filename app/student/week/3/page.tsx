"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import ShimmerButton from "@/components/ui/shimmer-button";
import BlurFade from "@/components/ui/blur-fade";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  Target,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  FileText,
  Award,
  TrendingUp,
  Lightbulb,
} from "lucide-react";

export default function Week3Landing() {
  const [activeTab, setActiveTab] = useState<"challenge" | "skills" | "exam" | "path">("challenge");
  const [viewedSections, setViewedSections] = useState<Set<string>>(new Set(["hero"]));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const tabPanelRef = useRef<HTMLDivElement>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setViewedSections((prev) => {
              if (prev.has(activeTab)) return prev;
              return new Set(prev).add(activeTab);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (tabPanelRef.current) {
      observer.observe(tabPanelRef.current);
    }

    return () => {
      if (tabPanelRef.current) {
        observer.unobserve(tabPanelRef.current);
      }
    };
  }, [activeTab]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const tabs = [
    { id: "challenge", label: "The Challenge", icon: AlertTriangle, time: "3 min" },
    { id: "skills", label: "Synthesis", icon: Target, time: "4 min" },
    { id: "exam", label: "AP Prep", icon: FileText, time: "3 min" },
    { id: "path", label: "Your Path", icon: TrendingUp, time: "2 min" },
  ] as const;

  const handleTabChange = (tabId: typeof activeTab) => {
    if (isTransitioning) return;

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    setIsTransitioning(true);
    setActiveTab(tabId);

    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const markSectionViewed = (section: string) => {
    setViewedSections((prev) => {
      if (prev.has(section)) return prev;
      return new Set(prev).add(section);
    });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(0, 217, 255, 0.5)" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#2C4F5E1a_1px,transparent_1px),linear-gradient(to_bottom,#2C4F5E1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <Link
        href="/student"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-primary-900/90 hover:bg-primary-800/90 border border-primary-700/50 hover:border-accent-500/50 rounded-lg backdrop-blur-xl transition-all duration-300 group shadow-lg"
      >
        <ArrowLeft className="w-4 h-4 text-primary-300 group-hover:text-accent-400 transition-colors" />
        <span className="text-sm font-medium text-primary-200 group-hover:text-white transition-colors">
          Dashboard
        </span>
      </Link>

      <div className="relative z-10">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-6 pt-24 pb-6">
          <Breadcrumbs
            items={[
              { label: "Week 3", href: "/student/week/3" },
              { label: "Global Argumentation" },
            ]}
          />
        </div>

        <section className="flex flex-col items-center justify-center px-4 py-16 md:py-24 text-center">
          <BlurFade delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-500/30 bg-accent-500/10 backdrop-blur-sm mb-8">
              <div className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
              <span className="text-sm font-medium text-accent-300 tracking-wide">
                Week 3 - Global Argumentation
              </span>
            </div>
          </BlurFade>

          <BlurFade delay={0.2}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              No{" "}
              <span className="bg-gradient-to-r from-green-400 via-teal-400 to-green-300 bg-clip-text text-transparent">
                Training Wheels
              </span>
            </h1>
          </BlurFade>

          <BlurFade delay={0.3}>
            <p className="text-lg md:text-xl text-primary-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              Multi-concept synthesis + professional communication - blank canvas
            </p>
          </BlurFade>

          <BlurFade delay={0.4}>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="text-xs text-primary-300">5 Problems</span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 backdrop-blur-sm">
                <span className="text-xs text-green-300">25-30 min each</span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-secondary-500/10 border border-secondary-500/30 backdrop-blur-sm">
                <span className="text-xs text-secondary-300">Blank Canvas</span>
              </div>
            </div>
          </BlurFade>
        </section>

        <section className="flex flex-col items-center justify-center px-4 py-12 md:py-16">
          <div className="max-w-7xl w-full">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 backdrop-blur-sm mb-3">
                <Award className="w-3.5 h-3.5 text-green-400" />
                <span className="text-xs font-medium text-green-300 tracking-wide">
                  The Milestone
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                You've Reached Week 3
              </h2>
              <p className="text-base text-primary-300 max-w-2xl mx-auto">
                Ready for professional-level mathematical communication
              </p>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
              <div className="lg:w-64 flex-shrink-0">
                <div className="flex flex-col gap-3 lg:sticky lg:top-24">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    const isViewed = viewedSections.has(tab.id);

                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          handleTabChange(tab.id);
                          markSectionViewed(tab.id);
                        }}
                        disabled={isTransitioning}
                        className={`flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition-all text-left ${
                          isActive
                            ? "bg-green-500 text-white shadow-lg shadow-green-500/50"
                            : "text-primary-300 hover:bg-white/10 border border-primary-600/30"
                        } ${isTransitioning ? "opacity-50 cursor-wait" : ""}`}
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

              <div data-section={activeTab} className="flex-1 min-w-0 relative h-[650px]">
                {isTransitioning && (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary-900/50 backdrop-blur-sm rounded-3xl z-20">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
                      <span className="text-sm text-primary-200">Loading...</span>
                    </div>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    ref={tabPanelRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-2xl max-w-5xl h-full overflow-y-auto"
                  >
                    {activeTab === "challenge" && (
                      <div className="space-y-6">
                        <h3 className="text-3xl font-bold mb-6 text-white">The Challenge: Blank Canvas</h3>
                        <div className="space-y-6 text-base text-primary-200">
                          <p>
                            Week 3 removes all scaffolding. You see a problem statement, and you write a complete CERC
                            argument from scratch.
                          </p>

                          <div className="p-6 bg-red-500/10 border-l-4 border-red-500 rounded-xl">
                            <p className="font-semibold text-red-300 mb-3">What You WON'T See:</p>
                            <ul className="space-y-2 text-sm">
                              <li>❌ No sentence frames like "The theorem [applies / does not apply] because..."</li>
                              <li>❌ No structural outlines like "[State your conclusion]"</li>
                              <li>❌ No hints about which conditions to check</li>
                            </ul>
                          </div>

                          <div className="p-6 bg-green-500/10 border-l-4 border-green-500 rounded-xl">
                            <p className="font-semibold text-green-300 mb-3">What You WILL See:</p>
                            <ul className="space-y-2 text-sm">
                              <li>✅ Real-world scenario with context</li>
                              <li>✅ Multiple parts (a), (b), (c), (d)</li>
                              <li>✅ Synthesis across multiple concepts</li>
                              <li>✅ Communication precision matters</li>
                            </ul>
                          </div>

                          <div className="p-6 bg-accent-500/10 border border-accent-500/30 rounded-xl">
                            <p className="font-bold text-accent-200 mb-3">Why This Matters:</p>
                            <p>
                              The AP exam gives you NO scaffolding. Week 3 trains you to structure complete arguments
                              independently - exactly like you'll need to do in May.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "skills" && (
                      <div className="space-y-6">
                        <h3 className="text-3xl font-bold mb-6 text-white">Synthesis: Connecting Multiple Concepts</h3>
                        <div className="space-y-6 text-base text-primary-200">
                          <p>
                            Week 3 problems require you to synthesize concepts that you previously practiced in
                            isolation.
                          </p>

                          <div className="grid gap-4">
                            <div className="p-6 bg-primary-800/60 border border-primary-600/30 rounded-xl">
                              <p className="font-bold text-green-300 mb-2">Calculus Example:</p>
                              <p className="text-sm">
                                Use IVT to prove a root exists, then use MVT to analyze the function's behavior between
                                two points, then interpret the derivative in context.
                              </p>
                            </div>
                            <div className="p-6 bg-primary-800/60 border border-primary-600/30 rounded-xl">
                              <p className="font-bold text-green-300 mb-2">Statistics Example:</p>
                              <p className="text-sm">
                                Conduct a hypothesis test, then construct a confidence interval, then explain what
                                practical conclusions can be drawn from both procedures together.
                              </p>
                            </div>
                          </div>

                          <div className="p-6 bg-secondary-500/10 border border-secondary-500/30 rounded-xl">
                            <p className="font-bold text-secondary-200 mb-3">Communication Standards:</p>
                            <ul className="space-y-2 text-sm list-disc list-inside">
                              <li>Define all variables explicitly</li>
                              <li>Use precise mathematical language (not informal descriptions)</li>
                              <li>Show ALL steps - no "it's obvious" jumps</li>
                              <li>Connect parts logically (use "therefore", "because", "since")</li>
                              <li>State conclusions in context of the original problem</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "exam" && (
                      <div className="space-y-6">
                        <h3 className="text-3xl font-bold mb-6 text-white">AP Exam Preparation</h3>
                        <div className="space-y-6 text-base text-primary-200">
                          <p>
                            Week 3 mimics AP exam conditions: multi-part questions requiring complete written
                            justifications.
                          </p>

                          <div className="p-6 bg-yellow-500/10 border-l-4 border-yellow-500 rounded-xl">
                            <div className="flex items-center gap-3 mb-3">
                              <Lightbulb className="w-5 h-5 text-yellow-300" />
                              <p className="font-semibold text-yellow-300">AP Grading Reality:</p>
                            </div>
                            <p className="mb-3">
                              Graders spend ~2 minutes per FRQ. They can't read your mind - you MUST write it down.
                            </p>
                            <ul className="space-y-1 text-sm">
                              <li>• No credit for "obviously true" statements</li>
                              <li>• No credit for correct answers without justification</li>
                              <li>• Partial credit only if reasoning is explicit</li>
                            </ul>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                              <p className="font-semibold text-red-300 mb-2">❌ Loses Points</p>
                              <p className="text-sm">"The function is continuous so IVT applies."</p>
                            </div>
                            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                              <p className="font-semibold text-green-300 mb-2">✅ Full Credit</p>
                              <p className="text-sm">
                                "f is continuous on [0,3] because it's a polynomial. Therefore by IVT..."
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "path" && (
                      <div className="space-y-6">
                        <h3 className="text-3xl font-bold mb-6 text-white">Your Week 3 Workflow</h3>
                        <div className="space-y-6">
                          {[
                            {
                              step: 1,
                              title: "Read the entire problem first",
                              description:
                                "Understand context, what's given, what's asked. Don't jump into calculations yet.",
                            },
                            {
                              step: 2,
                              title: "Identify what theorems/procedures apply",
                              description:
                                "Which mathematical tools do you need? What conditions must be verified?",
                            },
                            {
                              step: 3,
                              title: "Plan your CERC structure",
                              description:
                                "Before writing, outline: What's your claim? What evidence do you need? Which theorem? What conditions?",
                            },
                            {
                              step: 4,
                              title: "Write complete, explicit justification",
                              description:
                                "Don't skip steps. Define variables. Verify conditions. Show calculations. State conclusions.",
                            },
                            {
                              step: 5,
                              title: "Read your answer as if you're the grader",
                              description:
                                "Is everything justified? Did you explain WHY, not just WHAT? Is it clear and complete?",
                            },
                          ].map((item) => (
                            <div key={item.step} className="flex gap-4 items-start">
                              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-xl font-bold shadow-lg shadow-green-500/30">
                                {item.step}
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                                <p className="text-primary-200">{item.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
                          <h4 className="text-2xl font-bold text-white mb-4">Week 3 Learning Objectives</h4>
                          <ul className="space-y-3">
                            {[
                              "Write complete CERC arguments without any scaffolding or prompts",
                              "Synthesize multiple mathematical concepts in a single problem",
                              "Communicate with AP exam-level precision and clarity",
                              "Self-evaluate completeness and rigor of your own work",
                            ].map((objective, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                <span className="text-base text-primary-200">{objective}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-8 text-center">
                          <Link href="/student/week/3/problems">
                            <ShimmerButton className="px-10 py-5 text-xl">
                              Begin Week 3 Problems →
                            </ShimmerButton>
                          </Link>
                          <p className="mt-4 text-primary-300 text-sm">
                            5 problems • 25-30 minutes each • Blank canvas - no scaffolding
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
