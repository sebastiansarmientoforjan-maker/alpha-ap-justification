"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import ShimmerButton from "@/components/ui/shimmer-button";
import BlurFade from "@/components/ui/blur-fade";
import {
  Target,
  CheckCircle,
  AlertTriangle,
  ArrowDown,
  FileText,
} from "lucide-react";

export default function Week2Landing() {
  const [activeTab, setActiveTab] = useState<"problem" | "solution" | "method" | "path">("problem");
  const [viewedSections, setViewedSections] = useState<Set<string>>(new Set());
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof window !== 'undefined') {
      const viewed = localStorage.getItem('week2-viewed-sections');
      if (viewed) {
        setViewedSections(new Set(JSON.parse(viewed)));
      }
    }
  }, []);

  // Mark active tab as viewed when tabs container comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            markSectionViewed(activeTab);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (tabsContainerRef.current) {
      observer.observe(tabsContainerRef.current);
    }

    return () => {
      if (tabsContainerRef.current) {
        observer.unobserve(tabsContainerRef.current);
      }
    };
  }, [activeTab]);

  const markSectionViewed = (section: string) => {
    const updated = new Set(viewedSections);
    updated.add(section);
    setViewedSections(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('week2-viewed-sections', JSON.stringify(Array.from(updated)));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-x-hidden">
      <Spotlight className="absolute -top-40 left-0 md:left-60 md:-top-20" fill="rgba(0, 217, 255, 0.4)" />

      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex flex-col items-center justify-center px-6 pt-20 pb-16">
        <BlurFade delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500/20 border border-accent-500/50 rounded-full mb-6">
            <Target className="w-5 h-5 text-accent-300" />
            <span className="text-sm font-semibold text-accent-200">Week 2 of 4</span>
          </div>
        </BlurFade>

        <BlurFade delay={0.2}>
          <h1 className="text-6xl md:text-7xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-accent-200 to-secondary-200">
            Condition Verification
          </h1>
        </BlurFade>

        <BlurFade delay={0.3}>
          <p className="text-xl md:text-2xl text-center text-primary-200 max-w-3xl mb-8">
            Mathematically verifying ALL theorem conditions - no shortcuts allowed
          </p>
        </BlurFade>

        <BlurFade delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
            <Link href="/student/week/2/problems">
              <ShimmerButton className="px-8 py-4 text-lg">
                Start Week 2 Problems →
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
            <span className="text-sm">Estimated time: 20-25 minutes per problem</span>
          </div>
        </BlurFade>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* The Evolution */}
        <BlurFade delay={0.6}>
          <div className="mb-12 p-8 bg-gradient-to-br from-accent-500/10 to-secondary-500/10 border border-accent-500/30 rounded-2xl">
            <h2 className="text-3xl font-bold mb-4">The Evolution</h2>
            <div className="space-y-4 text-lg text-primary-200">
              <p>
                <strong className="text-white">Week 1:</strong> You learned to identify when theorems DON'T apply
                (broken conditions = no theorem).
              </p>
              <p>
                <strong className="text-white">Week 2:</strong> Now you'll prove when theorems DO apply.
              </p>
              <p className="text-accent-200 font-semibold">
                These problems are VALID for the given theorem - but you must rigorously prove it.
              </p>
            </div>
          </div>
        </BlurFade>

        {/* Sidebar + Content Layout */}
        <div ref={tabsContainerRef} className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Navigation */}
          <BlurFade delay={0.7}>
            <div className="lg:w-64 flex-shrink-0">
              <div className="flex flex-col gap-3 lg:sticky lg:top-24">
                {[
                  { id: "problem", label: "The Problem", icon: AlertTriangle },
                  { id: "solution", label: "The Solution", icon: Target },
                  { id: "method", label: "The Method", icon: FileText },
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
          </BlurFade>

          {/* Content Area */}
          <div className="flex-1 min-w-0 h-[650px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-5xl h-full overflow-y-auto"
              >
                {activeTab === "problem" && (
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-6">
                    <h3 className="text-3xl font-bold mb-6">The Problem with "Obviously True"</h3>
                    <div className="space-y-4 text-base text-primary-200">
                  <p>
                    Last week, you saw functions where MVT <strong>doesn't apply</strong> (discontinuities, sharp corners).
                  </p>
                  <p>
                    This week, you'll see functions where MVT <strong>does apply</strong> - but you can't just say
                    "it's a polynomial so obviously it works."
                  </p>
                  <div className="p-6 bg-red-500/10 border-l-4 border-red-500 rounded-lg my-6">
                    <p className="font-semibold text-red-300 mb-2">Common Mistake:</p>
                    <p className="italic">"f(x) = x³ - 3x + 1 is continuous and differentiable, so MVT applies."</p>
                    <p className="mt-2 text-sm">
                      <strong>Why this loses points:</strong> You stated the conclusion without mathematical justification.
                      WHY is it continuous? WHY is it differentiable?
                    </p>
                  </div>
                  <div className="p-6 bg-green-500/10 border-l-4 border-green-500 rounded-lg">
                    <p className="font-semibold text-green-300 mb-2">Correct Approach:</p>
                    <p className="italic">
                      "f(x) = x³ - 3x + 1 is a polynomial. All polynomials are continuous everywhere because they are
                      sums and products of continuous functions (x and constants). Therefore f is continuous on [0,2]. ✓
                    </p>
                    <p className="italic mt-2">
                      Similarly, the derivative f'(x) = 3x² - 3 exists for all x (derivative of a polynomial is a
                      polynomial). Therefore f is differentiable on (0,2). ✓"
                      </p>
                    </div>
                  </div>
                  </div>
                )}

                {activeTab === "solution" && (
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-6">
                    <h3 className="text-3xl font-bold mb-6">The Solution: Mathematical Rigor</h3>
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
                        "f is a polynomial, and all polynomials are continuous everywhere. Therefore f is continuous on
                        [a,b]."
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-accent-500/10 border border-accent-500/30 rounded-xl">
                    <p className="font-bold text-accent-200 mb-3">Calculus Students:</p>
                    <ul className="space-y-2 text-sm list-disc list-inside">
                      <li>
                        <strong>Polynomials:</strong> Continuous and differentiable everywhere
                      </li>
                      <li>
                        <strong>Rational functions:</strong> Continuous and differentiable except at points where denominator = 0
                      </li>
                      <li>
                        <strong>Absolute value:</strong> Continuous everywhere, but not differentiable at corners
                      </li>
                      <li>
                        <strong>Piecewise functions:</strong> Check limits at transition points
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 bg-secondary-500/10 border border-secondary-500/30 rounded-xl">
                    <p className="font-bold text-secondary-200 mb-3">Statistics Students:</p>
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
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-6">
                    <h3 className="text-3xl font-bold mb-6">The Method: CERC with Structural Outlines</h3>
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

                  <div className="p-6 bg-yellow-500/10 border-l-4 border-yellow-500 rounded-lg">
                    <p className="font-semibold text-yellow-300 mb-2">Key Difference from Week 1:</p>
                    <p>
                      Week 1 gave you sentences to fill in blanks. Week 2 gives you structure only. You write the
                      complete mathematical reasoning yourself.
                      </p>
                    </div>
                  </div>
                  </div>
                )}

                {activeTab === "path" && (
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-6">
                    <h3 className="text-3xl font-bold mb-6">Your Path Through Week 2</h3>
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
            <BlurFade delay={1.0}>
              <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10 max-w-5xl">
                <h3 className="text-3xl font-bold mb-6">Week 2 Learning Objectives</h3>
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
            </BlurFade>

            {/* CTA */}
            <BlurFade delay={1.1}>
              <div className="mt-12 text-center max-w-5xl">
            <Link href="/student/week/2/problems">
              <ShimmerButton className="px-10 py-5 text-xl">
                Begin Week 2 Problems →
              </ShimmerButton>
            </Link>
                <p className="mt-6 text-primary-300 text-sm">
                  3 problems • 20-25 minutes each • Structural outline scaffolding
                </p>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>
    </div>
  );
}
