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
  Lightbulb,
  TrendingUp,
} from "lucide-react";

export default function Week2Landing() {
  const [activeTab, setActiveTab] = useState<"problem" | "solution" | "method" | "path">("problem");
  const [viewedSections, setViewedSections] = useState<Set<string>>(new Set(["hero"]));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const tabPanelRef = useRef<HTMLDivElement>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mark active tab as viewed when tab panel comes into view
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

  // Cleanup transition timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const tabs = [
    { id: "problem", label: "The Problem", icon: AlertTriangle, time: "3 min" },
    { id: "solution", label: "The Solution", icon: Target, time: "4 min" },
    { id: "method", label: "The Method", icon: FileText, time: "2 min" },
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
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(0, 217, 255, 0.4)" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#2C4F5E1a_1px,transparent_1px),linear-gradient(to_bottom,#2C4F5E1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Back to Roadmap Button */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-primary-900/90 hover:bg-primary-800/90 border border-primary-700/50 hover:border-accent-500/50 rounded-lg backdrop-blur-xl transition-all duration-300 group shadow-lg"
      >
        <ArrowLeft className="w-4 h-4 text-primary-300 group-hover:text-accent-400 transition-colors" />
        <span className="text-sm font-medium text-primary-200 group-hover:text-white transition-colors">
          Roadmap
        </span>
      </Link>

      <div className="relative z-10">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-6 pt-24 pb-6">
          <Breadcrumbs
            items={[
              { label: "Week 2", href: "/student/week/2" },
              { label: "Condition Verification" },
            ]}
          />
        </div>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center px-4 py-16 md:py-24 text-center">
          <BlurFade delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-500/30 bg-accent-500/10 backdrop-blur-sm mb-8">
              <div className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
              <span className="text-sm font-medium text-accent-300 tracking-wide">
                Week 2 - Condition Verification
              </span>
            </div>
          </BlurFade>

          <BlurFade delay={0.2}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              Verify{" "}
              <span className="bg-gradient-to-r from-accent-400 via-secondary-400 to-accent-300 bg-clip-text text-transparent">
                Every Condition
              </span>
            </h1>
          </BlurFade>

          <BlurFade delay={0.3}>
            <p className="text-lg md:text-xl text-primary-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              Mathematically verify ALL theorem conditions - no shortcuts allowed
            </p>
          </BlurFade>

          <BlurFade delay={0.4}>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="text-xs text-primary-300">4 Problems</span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/30 backdrop-blur-sm">
                <span className="text-xs text-accent-300">20-25 min each</span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-secondary-500/10 border border-secondary-500/30 backdrop-blur-sm">
                <span className="text-xs text-secondary-300">Structural Outline</span>
              </div>
            </div>
          </BlurFade>
        </section>

        {/* Interactive Tabs Section */}
        <section className="flex flex-col items-center justify-center px-4 py-12 md:py-16">
          <div className="max-w-7xl w-full">
            {/* Section Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-secondary-500/30 bg-secondary-500/10 backdrop-blur-sm mb-3">
                <Target className="w-3.5 h-3.5 text-secondary-400" />
                <span className="text-xs font-medium text-secondary-300 tracking-wide">
                  Essential Context
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                The Evolution from Week 1
              </h2>
              <p className="text-base text-primary-300 max-w-2xl mx-auto">
                From breaking conditions to proving they hold
              </p>
            </div>

            {/* Sidebar + Content Layout */}
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
              {/* Left Sidebar - Tab Navigation */}
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
                            ? "bg-accent-500 text-white shadow-lg shadow-accent-500/50"
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

              {/* Right Content Area */}
              <div data-section={activeTab} className="flex-1 min-w-0 relative h-[650px]">
                {/* Loading Overlay */}
                {isTransitioning && (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary-900/50 backdrop-blur-sm rounded-3xl z-20">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-4 border-accent-500/30 border-t-accent-500 rounded-full animate-spin" />
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
                    {activeTab === "problem" && (
                      <div className="space-y-6">
                        <h3 className="text-3xl font-bold mb-6 text-white">
                          The Problem with "Obviously True"
                        </h3>
                        <div className="space-y-6 text-base text-primary-200">
                          <p>
                            Last week, you saw functions where MVT <strong className="text-white">doesn't apply</strong>{" "}
                            (discontinuities, sharp corners).
                          </p>
                          <p>
                            This week, you'll see functions where MVT <strong className="text-white">does apply</strong>{" "}
                            - but you can't just say "it's a polynomial so obviously it works."
                          </p>

                          <div className="p-6 bg-red-500/10 border-l-4 border-red-500 rounded-xl">
                            <p className="font-semibold text-red-300 mb-2">Common Mistake:</p>
                            <p className="italic mb-3">
                              "f(x) = x³ - 3x + 1 is continuous and differentiable, so MVT applies."
                            </p>
                            <p className="text-sm">
                              <strong>Why this loses points:</strong> You stated the conclusion without mathematical
                              justification. WHY is it continuous? WHY is it differentiable?
                            </p>
                          </div>

                          <div className="p-6 bg-green-500/10 border-l-4 border-green-500 rounded-xl">
                            <p className="font-semibold text-green-300 mb-2">Correct Approach:</p>
                            <p className="italic mb-2">
                              "f(x) = x³ - 3x + 1 is a polynomial. All polynomials are continuous everywhere because
                              they are sums and products of continuous functions (x and constants). Therefore f is
                              continuous on [0,2]. ✓"
                            </p>
                            <p className="italic">
                              "Similarly, the derivative f'(x) = 3x² - 3 exists for all x (derivative of a polynomial
                              is a polynomial). Therefore f is differentiable on (0,2). ✓"
                            </p>
                          </div>

                          <div className="p-6 bg-accent-500/10 border border-accent-500/30 rounded-xl">
                            <p className="font-bold text-accent-200 mb-3">Key Insight:</p>
                            <p>
                              Week 1 was about identifying BROKEN conditions. Week 2 is about PROVING conditions hold.
                              Both require mathematical rigor - one finds violations, the other provides justification.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "solution" && (
                      <div className="space-y-6">
                        <h3 className="text-3xl font-bold mb-6 text-white">The Solution: Mathematical Rigor</h3>
                        <div className="space-y-6 text-base text-primary-200">
                          <p>
                            Week 2 is about <strong className="text-white">verification</strong>, not just{" "}
                            <strong className="text-white">assertion</strong>.
                          </p>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                              <p className="font-semibold text-red-300 mb-2">❌ Assertion (Week 1 level)</p>
                              <p className="text-sm">"The function is continuous on [a,b]."</p>
                            </div>
                            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                              <p className="font-semibold text-green-300 mb-2">✅ Verification (Week 2 level)</p>
                              <p className="text-sm">
                                "f is a polynomial, and all polynomials are continuous everywhere. Therefore f is
                                continuous on [a,b]."
                              </p>
                            </div>
                          </div>

                          <div className="p-6 bg-accent-500/10 border border-accent-500/30 rounded-xl">
                            <p className="font-bold text-accent-200 mb-3">Calculus Students - Common Functions:</p>
                            <ul className="space-y-2 text-sm list-disc list-inside">
                              <li>
                                <strong>Polynomials:</strong> Continuous and differentiable everywhere
                              </li>
                              <li>
                                <strong>Rational functions:</strong> Continuous and differentiable except where
                                denominator = 0
                              </li>
                              <li>
                                <strong>Absolute value:</strong> Continuous everywhere, not differentiable at corners
                              </li>
                              <li>
                                <strong>Piecewise functions:</strong> Check limits at transition points
                              </li>
                            </ul>
                          </div>

                          <div className="p-6 bg-secondary-500/10 border border-secondary-500/30 rounded-xl">
                            <p className="font-bold text-secondary-200 mb-3">Statistics Students - Condition Checks:</p>
                            <ul className="space-y-2 text-sm list-disc list-inside">
                              <li>
                                <strong>Random sample:</strong> State how randomization occurred
                              </li>
                              <li>
                                <strong>10% condition:</strong> "Population &gt; 10n" with actual numbers
                              </li>
                              <li>
                                <strong>Success-failure:</strong> Calculate np and n(1-p), show both ≥ 10
                              </li>
                              <li>
                                <strong>Expected counts (χ²):</strong> Calculate each one, verify all ≥ 5
                              </li>
                              <li>
                                <strong>Normality:</strong> Either n ≥ 30 OR population stated as normal
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "method" && (
                      <div className="space-y-6">
                        <h3 className="text-3xl font-bold mb-6 text-white">The Method: CERC with Structural Outlines</h3>
                        <div className="space-y-6 text-base text-primary-200">
                          <p>
                            Week 2 reduces scaffolding. You still use CERC, but no more full sentence frames.
                          </p>

                          <div className="grid gap-4">
                            <div className="p-6 bg-primary-800/60 border border-primary-600/30 rounded-xl">
                              <p className="font-bold text-accent-200 mb-2">Claim:</p>
                              <p className="text-sm text-primary-300 italic">
                                [State your conclusion about what the theorem guarantees]
                              </p>
                            </div>
                            <div className="p-6 bg-primary-800/60 border border-primary-600/30 rounded-xl">
                              <p className="font-bold text-accent-200 mb-2">Evidence:</p>
                              <p className="text-sm text-primary-300 italic">
                                [Show all calculations: function values, derivatives, test statistics, etc.]
                              </p>
                            </div>
                            <div className="p-6 bg-primary-800/60 border border-primary-600/30 rounded-xl">
                              <p className="font-bold text-accent-200 mb-2">Reasoning:</p>
                              <p className="text-sm text-primary-300 italic">
                                [Cite the theorem and explain how it connects your evidence to your claim]
                              </p>
                            </div>
                            <div className="p-6 bg-primary-800/60 border border-primary-600/30 rounded-xl">
                              <p className="font-bold text-accent-200 mb-2">Conditions:</p>
                              <p className="text-sm text-primary-300 italic">
                                [Verify EACH hypothesis with mathematical justification]
                              </p>
                            </div>
                          </div>

                          <div className="p-6 bg-yellow-500/10 border-l-4 border-yellow-500 rounded-xl">
                            <div className="flex items-center gap-3 mb-3">
                              <Lightbulb className="w-5 h-5 text-yellow-300" />
                              <p className="font-semibold text-yellow-300">Key Difference from Week 1:</p>
                            </div>
                            <p>
                              Week 1 gave you sentences to fill in blanks. Week 2 gives you structure only. You write
                              the complete mathematical reasoning yourself.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "path" && (
                      <div className="space-y-6">
                        <h3 className="text-3xl font-bold mb-6 text-white">Your Path Through Week 2</h3>
                        <div className="space-y-6">
                          {[
                            {
                              step: 1,
                              title: "Identify the theorem",
                              description:
                                "What theorem or procedure is the problem asking you to use? MVT? IVT? z-test? Chi-square?",
                            },
                            {
                              step: 2,
                              title: "List ALL hypotheses",
                              description:
                                "Write down every single condition required. Don't skip any, even the 'obvious' ones.",
                            },
                            {
                              step: 3,
                              title: "Verify EACH hypothesis mathematically",
                              description:
                                "For each condition, provide mathematical justification. Use general principles (e.g., 'polynomials are continuous') applied to your specific function/data.",
                            },
                            {
                              step: 4,
                              title: "Only then, apply the theorem",
                              description:
                                "Once all conditions are verified, you can use the theorem to draw your conclusion.",
                            },
                            {
                              step: 5,
                              title: "Complete the calculation",
                              description:
                                "Show all work. Solve equations, compute test statistics, find p-values, etc.",
                            },
                          ].map((item) => (
                            <div key={item.step} className="flex gap-4 items-start">
                              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-accent-500 to-secondary-500 flex items-center justify-center text-xl font-bold shadow-lg shadow-accent-500/30">
                                {item.step}
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                                <p className="text-primary-200">{item.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Learning Objectives - INSIDE scroll area */}
                        <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
                          <h4 className="text-2xl font-bold text-white mb-4">Week 2 Learning Objectives</h4>
                          <ul className="space-y-3">
                            {[
                              "Verify continuity and differentiability with mathematical justification (not just assertion)",
                              "Check ALL inference conditions with explicit calculations (np ≥ 10, sample sizes, expected counts)",
                              "Distinguish between 'stating' a condition and 'verifying' it mathematically",
                              "Build complete CERC arguments with only structural guidance",
                            ].map((objective, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                <span className="text-base text-primary-200">{objective}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* CTA - INSIDE scroll area */}
                        <div className="mt-8 text-center">
                          <Link href="/student/week/2/problems">
                            <ShimmerButton className="px-10 py-5 text-xl">
                              Begin Week 2 Problems →
                            </ShimmerButton>
                          </Link>
                          <p className="mt-4 text-primary-300 text-sm">
                            4 problems • 20-25 minutes each • Structural outline scaffolding
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

      {/* Decorative Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
