"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Meteors } from "@/components/ui/meteors";
import ShimmerButton from "@/components/ui/shimmer-button";
import BlurFade from "@/components/ui/blur-fade";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  Target,
  CheckCircle,
  Users,
  Clock,
  Zap,
  Award,
  Trophy,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";

export default function Week4Landing() {
  const [activeTab, setActiveTab] = useState<"format" | "strategy" | "pressure" | "victory">("format");
  const [viewedSections, setViewedSections] = useState<Set<string>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const tabPanelRef = useRef<HTMLDivElement>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof window !== 'undefined') {
      const viewed = localStorage.getItem('week4-viewed-sections');
      if (viewed) {
        setViewedSections(new Set(JSON.parse(viewed)));
      }
    }
  }, []);

  useEffect(() => {
    markSectionViewed(activeTab);
  }, [activeTab]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const markSectionViewed = (section: string) => {
    const updated = new Set(viewedSections);
    updated.add(section);
    setViewedSections(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('week4-viewed-sections', JSON.stringify(Array.from(updated)));
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-x-hidden relative">
      {/* Meteors Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Meteors number={30} />
      </div>

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

      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 pt-24 pb-6 relative z-10">
        <Breadcrumbs
          items={[
            { label: "Week 4", href: "/student/week/4" },
            { label: "AP Exam Simulation" },
          ]}
        />
      </div>

      {/* Hero Section */}
      <div className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 pt-12 pb-16 z-10">
        <BlurFade delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50 rounded-full mb-6 shadow-lg shadow-red-500/20">
            <Trophy className="w-5 h-5 text-red-300" />
            <span className="text-sm font-semibold text-red-200">Week 4 of 4 - FINAL CHALLENGE</span>
          </div>
        </BlurFade>

        <BlurFade delay={0.2}>
          <h1 className="text-7xl md:text-8xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-orange-300 to-yellow-200">
            AP Exam Simulation
          </h1>
        </BlurFade>

        <BlurFade delay={0.3}>
          <p className="text-xl md:text-2xl text-center text-primary-200 max-w-3xl mb-4">
            Individual timed FRQ • 25-30 minutes • Real exam conditions
          </p>
        </BlurFade>

        <BlurFade delay={0.4}>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
              <Target className="w-5 h-5 text-red-400" />
              <span className="text-sm text-red-300 font-semibold">Individual Work</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <Clock className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-orange-300 font-semibold">25-30 Min Timed</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-yellow-300 font-semibold">Exam Conditions</span>
            </div>
          </div>
        </BlurFade>

        <BlurFade delay={0.5}>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
            <Link href="/student/week/4/exam">
              <ShimmerButton className="px-10 py-5 text-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
                Enter AP Exam Simulation →
              </ShimmerButton>
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-colors"
            >
              ← Back to Roadmap
            </Link>
          </div>
        </BlurFade>

        <BlurFade delay={0.6}>
          <div className="flex items-center gap-2 text-primary-300">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm">Timed exam: 25-30 minutes (varies by course) | Timer visible throughout</span>
          </div>
        </BlurFade>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        {/* The Journey */}
        <BlurFade delay={0.7}>
          <div className="mb-12 p-8 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <Award className="w-8 h-8 text-red-400" />
              The Final Test
            </h2>
            <div className="space-y-4 text-lg text-primary-200">
              <p>
                <strong className="text-white">Week 1:</strong> You learned when theorems don't apply.
              </p>
              <p>
                <strong className="text-white">Week 2:</strong> You proved when theorems do apply.
              </p>
              <p>
                <strong className="text-white">Week 3:</strong> You synthesized multiple concepts without scaffolding.
              </p>
              <p className="text-red-200 font-semibold text-xl mt-6">
                <strong className="text-red-300">Week 4:</strong> Now you take the AP Exam Simulation - a timed individual exam that tests EVERYTHING under real AP conditions.
              </p>
            </div>
          </div>
        </BlurFade>

        {/* Sidebar + Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Sidebar - Tab Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="flex flex-col gap-3 lg:sticky lg:top-24">
              {[
                { id: "format", label: "Exam Format", icon: Target },
                { id: "strategy", label: "Strategy", icon: Zap },
                { id: "pressure", label: "Time Pressure", icon: Clock },
                { id: "victory", label: "Victory", icon: Trophy },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const isViewed = viewedSections.has(tab.id);

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id as any)}
                    disabled={isTransitioning}
                    className={`flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition-all text-left ${
                      isActive
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/50"
                        : "text-primary-300 hover:bg-white/10 border border-primary-600/30"
                    } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            {isTransitioning && (
              <div className="absolute inset-0 bg-primary-900/50 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="text-primary-300">Loading...</div>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                ref={tabPanelRef}
                className="max-w-5xl h-full overflow-y-auto pr-4"
              >
                {activeTab === "format" && (
                  <div className="space-y-6 text-base text-primary-200">
                    <h3 className="text-3xl font-bold mb-6">Exam Format</h3>

                    {/* Overview */}
                    <div className="p-6 bg-blue-500/10 border-l-4 border-blue-500 rounded-xl">
                      <h4 className="text-2xl font-bold text-blue-300 mb-3">Individual Timed FRQ</h4>
                      <p className="text-primary-200 mb-3">
                        <strong className="text-white">This is a solo exam experience.</strong> You'll work independently on a multi-part free-response question under real AP exam conditions.
                      </p>
                      <p className="text-primary-200 mb-3">
                        The problem will have 3-4 parts (A, B, C, and sometimes D) that build on each other, just like actual AP exam questions.
                      </p>
                      <p className="text-blue-300 text-sm font-semibold">⏱️ Time Limit: 25-30 minutes (varies by course)</p>
                    </div>

                    {/* What to Expect */}
                    <div className="p-6 bg-purple-500/10 border-l-4 border-purple-500 rounded-xl">
                      <h4 className="text-2xl font-bold text-purple-300 mb-3">What to Expect</h4>
                      <ul className="space-y-3 text-primary-200">
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span><strong className="text-white">Multi-part structure:</strong> Parts A, B, C (and sometimes D) that integrate multiple concepts</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span><strong className="text-white">Timer visible:</strong> Countdown clock shows remaining time</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span><strong className="text-white">No scaffolding:</strong> You must determine which theorems apply and verify all conditions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span><strong className="text-white">Complete justification required:</strong> Use the full CERC framework for each part</span>
                        </li>
                      </ul>
                    </div>

                    {/* Course-Specific */}
                    <div className="p-6 bg-red-500/10 border-l-4 border-red-500 rounded-xl">
                      <h4 className="text-2xl font-bold text-red-300 mb-3">By Course</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-white font-semibold mb-1">Calculus AB: 25 minutes</p>
                          <p className="text-sm text-primary-300">Related rates problem with MVT/IVT applications</p>
                        </div>
                        <div>
                          <p className="text-white font-semibold mb-1">Calculus BC: 30 minutes</p>
                          <p className="text-sm text-primary-300">Polar curves with arc length and area integration</p>
                        </div>
                        <div>
                          <p className="text-white font-semibold mb-1">AP Statistics: 25 minutes</p>
                          <p className="text-sm text-primary-300">Study design critique with inference conditions</p>
                        </div>
                      </div>
                    </div>

                    {/* Learning Objectives */}
                    <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
                      <h3 className="text-2xl font-bold mb-6">Week 4 Learning Objectives</h3>
                      <ul className="space-y-3">
                        {[
                          "Synthesize ALL skills from Weeks 1-3 under exam conditions",
                          "Work independently to construct complete CERC arguments",
                          "Manage time effectively across multi-part FRQ",
                          "Perform rigorous justification under timed pressure (25-30 min)",
                        ].map((objective, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-primary-200">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Final CTA */}
                    <div className="mt-12 text-center p-12 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/50 rounded-2xl">
                      <h3 className="text-4xl font-bold mb-4">Are You Ready?</h3>
                      <p className="text-xl text-primary-200 mb-8 max-w-2xl mx-auto">
                        This is the culmination of everything you've learned. One timed exam. Multiple parts. Prove your mastery.
                      </p>
                      <Link href="/student/week/4/exam">
                        <ShimmerButton className="px-12 py-6 text-2xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
                          Enter AP Exam Simulation →
                        </ShimmerButton>
                      </Link>
                      <p className="mt-6 text-primary-300 text-sm">
                        1 exam • 25-30 minutes total • Timed throughout
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "strategy" && (
                  <div className="space-y-6 text-base text-primary-200">
                    <h3 className="text-3xl font-bold mb-6">Approaching the AP Exam Simulation</h3>

                    <p>
                      Week 4 is YOUR ultimate test - an individual timed exam that integrates everything you've learned across Weeks 1-3.
                    </p>

                    <div className="p-6 bg-accent-500/10 border border-accent-500/30 rounded-xl">
                      <p className="font-bold text-accent-200 mb-3">Key Skills You'll Apply:</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-accent-400 mt-1">•</span>
                          <span><strong>Condition Verification:</strong> Check all theorem requirements before applying</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent-400 mt-1">•</span>
                          <span><strong>Multi-Concept Integration:</strong> Combine multiple theorems across parts A-D</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent-400 mt-1">•</span>
                          <span><strong>Time Management:</strong> Allocate time wisely across multiple parts</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent-400 mt-1">•</span>
                          <span><strong>Complete Justification:</strong> Write rigorous CERC proofs under pressure</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-6 bg-secondary-500/10 border border-secondary-500/30 rounded-xl">
                      <p className="font-bold text-secondary-200 mb-3">How to Succeed:</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-secondary-400 mt-1">1.</span>
                          <span>Read all parts first (2-3 min): Understand the full problem before starting</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-secondary-400 mt-1">2.</span>
                          <span>Budget time per part: 6-8 min each, save 2 min for review</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-secondary-400 mt-1">3.</span>
                          <span>Write complete CERC for each part: Don't skip conditions even under pressure</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-secondary-400 mt-1">4.</span>
                          <span>Watch the timer: Stay aware but don't panic. Quality over speed.</span>
                        </li>
                      </ul>
                    </div>

                    <p className="text-accent-200 font-semibold">
                      This is your chance to prove you've mastered AP-level justification. You've got this.
                    </p>

                    {/* Learning Objectives */}
                    <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
                      <h3 className="text-2xl font-bold mb-6">Week 4 Learning Objectives</h3>
                      <ul className="space-y-3">
                        {[
                          "Synthesize ALL skills from Weeks 1-3 under exam conditions",
                          "Work independently to construct complete CERC arguments",
                          "Manage time effectively across multi-part FRQ",
                          "Perform rigorous justification under timed pressure (25-30 min)",
                        ].map((objective, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-primary-200">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Final CTA */}
                    <div className="mt-12 text-center p-12 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/50 rounded-2xl">
                      <h3 className="text-4xl font-bold mb-4">Are You Ready?</h3>
                      <p className="text-xl text-primary-200 mb-8 max-w-2xl mx-auto">
                        This is the culmination of everything you've learned. One timed exam. Multiple parts. Prove your mastery.
                      </p>
                      <Link href="/student/week/4/exam">
                        <ShimmerButton className="px-12 py-6 text-2xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
                          Enter AP Exam Simulation →
                        </ShimmerButton>
                      </Link>
                      <p className="mt-6 text-primary-300 text-sm">
                        1 exam • 25-30 minutes total • Timed throughout
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "pressure" && (
                  <div className="space-y-6 text-base text-primary-200">
                    <h3 className="text-3xl font-bold mb-6">Why Timed Pressure?</h3>

                    <p>
                      The AP exam is TIMED. You have 25-30 minutes per FRQ. Week 4 prepares you for that reality.
                    </p>

                    <div className="p-6 bg-red-500/10 border-l-4 border-red-500 rounded-lg">
                      <p className="font-semibold text-red-300 mb-2">What This Simulates:</p>
                      <p className="text-sm mb-3">
                        On the real AP exam, you face multi-part FRQs with a strict time limit. You must work efficiently while maintaining rigorous justification.
                      </p>
                      <p className="text-sm">
                        Can you complete all parts with full CERC framework under pressure? This exam trains that skill.
                      </p>
                    </div>

                    <div className="p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                      <p className="font-bold text-yellow-300 mb-3">Time Management Strategy:</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-yellow-400 mt-1">•</span>
                          <span><strong>Minutes 0-3:</strong> Read all parts. Plan your approach. Identify theorems needed.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-yellow-400 mt-1">•</span>
                          <span><strong>Minutes 3-22:</strong> Work through parts A-D. 6-8 min per part. Complete CERC for each.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-yellow-400 mt-1">•</span>
                          <span><strong>Minutes 22-25:</strong> Review. Check conditions. Fix notation. Verify calculations.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
                      <p className="font-bold text-green-300 mb-3">What NOT to Do:</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-red-400 mt-1">❌</span>
                          <span>Don't panic when you see the timer. Breathe. You've trained for this.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-400 mt-1">❌</span>
                          <span>Don't skip condition verification to save time. That's where points are lost.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-400 mt-1">❌</span>
                          <span>Don't spend 20 minutes on Part A. Budget time equally across parts.</span>
                        </li>
                      </ul>
                    </div>

                    <p className="text-red-200 font-semibold">
                      This exam is intentionally challenging. That's the point. You learn to perform under real AP conditions.
                    </p>

                    {/* Learning Objectives */}
                    <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
                      <h3 className="text-2xl font-bold mb-6">Week 4 Learning Objectives</h3>
                      <ul className="space-y-3">
                        {[
                          "Synthesize ALL skills from Weeks 1-3 under exam conditions",
                          "Work independently to construct complete CERC arguments",
                          "Manage time effectively across multi-part FRQ",
                          "Perform rigorous justification under timed pressure (25-30 min)",
                        ].map((objective, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-primary-200">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Final CTA */}
                    <div className="mt-12 text-center p-12 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/50 rounded-2xl">
                      <h3 className="text-4xl font-bold mb-4">Are You Ready?</h3>
                      <p className="text-xl text-primary-200 mb-8 max-w-2xl mx-auto">
                        This is the culmination of everything you've learned. One timed exam. Multiple parts. Prove your mastery.
                      </p>
                      <Link href="/student/week/4/exam">
                        <ShimmerButton className="px-12 py-6 text-2xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
                          Enter AP Exam Simulation →
                        </ShimmerButton>
                      </Link>
                      <p className="mt-6 text-primary-300 text-sm">
                        1 exam • 25-30 minutes total • Timed throughout
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "victory" && (
                  <div className="space-y-6 text-base text-primary-200">
                    <h3 className="text-3xl font-bold mb-6">Victory: The Exam Ready Badge</h3>

                    <div className="text-center p-8 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/50 rounded-2xl">
                      <div className="text-7xl mb-4">🎓</div>
                      <h4 className="text-3xl font-bold text-yellow-300 mb-2">EXAM READY</h4>
                      <p className="text-yellow-200">Ultimate Week 4 Achievement</p>
                    </div>

                    <p>
                      Earning the <strong className="text-yellow-300">Exam Ready</strong> badge means you:
                    </p>

                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 p-4 bg-primary-800/60 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Completed all parts (A-D) with rigorous CERC arguments</span>
                      </li>
                      <li className="flex items-start gap-3 p-4 bg-primary-800/60 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Worked independently under 25-30 minute time constraint</span>
                      </li>
                      <li className="flex items-start gap-3 p-4 bg-primary-800/60 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Maintained rigorous condition verification even under pressure</span>
                      </li>
                      <li className="flex items-start gap-3 p-4 bg-primary-800/60 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Demonstrated AP exam readiness with multi-part integration</span>
                      </li>
                    </ul>

                    <div className="p-6 bg-accent-500/10 border border-accent-500/30 rounded-xl">
                      <p className="font-bold text-accent-200 mb-3">XP Rewards:</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center justify-between">
                          <span>Base XP (Week 4)</span>
                          <span className="font-bold text-accent-400">+50 XP</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Complete Part A</span>
                          <span className="font-bold text-accent-400">+20 XP</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Complete Part B</span>
                          <span className="font-bold text-accent-400">+20 XP</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Complete Part C</span>
                          <span className="font-bold text-accent-400">+25 XP</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Complete Part D (if applicable)</span>
                          <span className="font-bold text-accent-400">+30 XP</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Perfect CERC Under Timed Conditions</span>
                          <span className="font-bold text-accent-400">+40 XP</span>
                        </li>
                        <li className="flex items-center justify-between border-t border-accent-500/30 pt-2 mt-2">
                          <span className="font-bold">Exam Ready Badge</span>
                          <span className="font-bold text-yellow-400">+50 XP</span>
                        </li>
                        <li className="flex items-center justify-between text-lg font-bold border-t-2 border-accent-500/50 pt-3 mt-3">
                          <span>TOTAL POSSIBLE</span>
                          <span className="text-yellow-400">235 XP</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-6 bg-green-500/10 border-l-4 border-green-500 rounded-lg">
                      <p className="font-semibold text-green-300 mb-2">After AP Exam Simulation:</p>
                      <p className="text-sm">
                        Once you complete the AP Exam Simulation, you've finished all 4 weeks of training.
                        You're ready for the real AP exam. You know how to verify conditions, justify rigorously,
                        synthesize concepts, and perform under timed pressure.
                        <span className="text-green-400 font-bold"> You've got this.</span>
                      </p>
                    </div>

                    {/* Learning Objectives */}
                    <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
                      <h3 className="text-2xl font-bold mb-6">Week 4 Learning Objectives</h3>
                      <ul className="space-y-3">
                        {[
                          "Synthesize ALL skills from Weeks 1-3 under exam conditions",
                          "Work independently to construct complete CERC arguments",
                          "Manage time effectively across multi-part FRQ",
                          "Perform rigorous justification under timed pressure (25-30 min)",
                        ].map((objective, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-primary-200">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Final CTA */}
                    <div className="mt-12 text-center p-12 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/50 rounded-2xl">
                      <h3 className="text-4xl font-bold mb-4">Are You Ready?</h3>
                      <p className="text-xl text-primary-200 mb-8 max-w-2xl mx-auto">
                        This is the culmination of everything you've learned. One timed exam. Multiple parts. Prove your mastery.
                      </p>
                      <Link href="/student/week/4/exam">
                        <ShimmerButton className="px-12 py-6 text-2xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
                          Enter AP Exam Simulation →
                        </ShimmerButton>
                      </Link>
                      <p className="mt-6 text-primary-300 text-sm">
                        1 exam • 25-30 minutes total • Timed throughout
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
