"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import { Meteors } from "@/components/ui/meteors";
import ShimmerButton from "@/components/ui/shimmer-button";
import BlurFade from "@/components/ui/blur-fade";
import {
  Target,
  Zap,
  TrendingUp,
  Play,
  X,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Trophy,
  Lock,
  ArrowDown,
  FileText,
  ListChecks,
} from "lucide-react";

export default function Week1Landing() {
  const [activeTab, setActiveTab] = useState<"problem" | "solution" | "method" | "path">("problem");
  const [showModal, setShowModal] = useState(false);
  const [viewedSections, setViewedSections] = useState<Set<string>>(new Set());
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showMobileProgress, setShowMobileProgress] = useState(false);
  const [modalViewed, setModalViewed] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // Ref declarations - MUST be before useEffects that use them
  const heroRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const tabPanelRef = useRef<HTMLDivElement>(null);
  const modalCloseButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check user motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Scroll to top on mount
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

  // Auto-scroll to center tabs section when it comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio < 0.8) {
            // Smooth scroll to center the tabs section
            tabsRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
        });
      },
      { threshold: [0.1, 0.8] }
    );

    if (tabsRef.current) {
      observer.observe(tabsRef.current);
    }

    return () => {
      if (tabsRef.current) {
        observer.unobserve(tabsRef.current);
      }
    };
  }, []);

  // Show mobile progress indicator on scroll
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      setShowMobileProgress(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setShowMobileProgress(false), 2000);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Modal focus trap and accessibility
  useEffect(() => {
    if (showModal) {
      // Save current focus
      lastFocusedElement.current = document.activeElement as HTMLElement;

      // Move focus to close button after modal opens
      setTimeout(() => {
        if (modalCloseButtonRef.current) {
          modalCloseButtonRef.current.focus();
        }
      }, 100);

      // Trap focus within modal
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setShowModal(false);
          setModalViewed(true);
        }

        if (e.key === 'Tab') {
          // Simple focus trap - keep focus on close button
          const closeButton = modalCloseButtonRef.current;
          if (closeButton && document.activeElement !== closeButton) {
            e.preventDefault();
            closeButton.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        // Restore focus when modal closes
        if (lastFocusedElement.current) {
          lastFocusedElement.current.focus();
        }
      };
    }
  }, [showModal]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyboard = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // ? key to show keyboard shortcuts help
      if (e.key === '?' && !showModal && !showKeyboardHelp) {
        e.preventDefault();
        setShowKeyboardHelp(true);
      }

      // Escape key to close help or modal
      if (e.key === 'Escape') {
        if (showKeyboardHelp) {
          setShowKeyboardHelp(false);
        } else if (showModal) {
          setShowModal(false);
          setModalViewed(true);
        }
      }

      // Number keys 1-4 to switch tabs (only when not in modal or help)
      if (!showModal && !showKeyboardHelp && ['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault();
        const tabIds = ["problem", "solution", "method", "path"] as const;
        const tabIndex = parseInt(e.key) - 1;
        if (tabIds[tabIndex]) {
          handleTabChange(tabIds[tabIndex]);
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyboard);
    return () => document.removeEventListener('keydown', handleGlobalKeyboard);
  }, [showModal, showKeyboardHelp]);

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
    { id: "method", label: "The Method", icon: Zap, time: "2 min" },
    { id: "path", label: "Your Path", icon: TrendingUp, time: "2 min" },
  ] as const;

  // Check if practice was completed (from localStorage with validation)
  useEffect(() => {
    try {
      const completedData = localStorage.getItem('week1_practice_completed');
      if (completedData) {
        const { completed, timestamp } = JSON.parse(completedData);
        // Validate completion is within last 30 days
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        if (completed === true && timestamp && timestamp > thirtyDaysAgo) {
          setPracticeCompleted(true);
        }
      }
    } catch (error) {
      // localStorage blocked or corrupted, fail silently
      console.warn('Could not read practice completion status:', error);
    }
  }, []);

  // Track section views with Intersection Observer (with debounce and dynamic threshold)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Dynamic threshold based on viewport height
    const calculateThreshold = () => {
      const viewportHeight = window.innerHeight;
      // For small viewports (mobile), use lower threshold
      // For large viewports, use higher threshold
      if (viewportHeight < 700) return 0.2; // Small mobile
      if (viewportHeight < 900) return 0.3; // Large mobile / small tablet
      return 0.4; // Desktop
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: calculateThreshold(),
    };

    const observer = new IntersectionObserver((entries) => {
      // Debounce to avoid excessive state updates
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section');
            if (sectionId) {
              setViewedSections((prev) => {
                if (prev.has(sectionId)) return prev; // Avoid unnecessary re-render
                return new Set(prev).add(sectionId);
              });
            }
          }
        });
      }, 300); // 300ms debounce
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [activeTab]); // Re-observe when tab changes

  // Calculate progress
  const totalSections = 5; // hero, 4 tabs
  const progress = (viewedSections.size / totalSections) * 100;
  const allSectionsViewed = viewedSections.size >= totalSections;
  const canAccessProblems = practiceCompleted && allSectionsViewed;

  // Handle tab change with loading state and focus management (NO scroll changes)
  const handleTabChange = (tabId: "problem" | "solution" | "method" | "path") => {
    if (isTransitioning) return; // Prevent clicks during transition

    // Clear any existing transition timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    setIsTransitioning(true);
    setActiveTab(tabId);

    // Move focus to tab panel after animation completes
    transitionTimeoutRef.current = setTimeout(() => {
      // Move focus to tab panel for keyboard users
      if (tabPanelRef.current) {
        tabPanelRef.current.focus();
      }

      setIsTransitioning(false);
      transitionTimeoutRef.current = null;
    }, 200); // Match animation duration
  };

  // Handle keyboard navigation for tabs (Arrow keys)
  const handleTabKeyDown = (e: React.KeyboardEvent, currentTab: string) => {
    const tabIds = ["problem", "solution", "method", "path"];
    const currentIndex = tabIds.indexOf(currentTab);

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % tabIds.length;
      handleTabChange(tabIds[nextIndex] as any);
      // Focus the next tab button
      setTimeout(() => {
        document.getElementById(`tab-${tabIds[nextIndex]}`)?.focus();
      }, 50);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + tabIds.length) % tabIds.length;
      handleTabChange(tabIds[prevIndex] as any);
      // Focus the previous tab button
      setTimeout(() => {
        document.getElementById(`tab-${tabIds[prevIndex]}`)?.focus();
      }, 50);
    } else if (e.key === "Home") {
      e.preventDefault();
      handleTabChange("problem");
      setTimeout(() => {
        document.getElementById(`tab-problem`)?.focus();
      }, 50);
    } else if (e.key === "End") {
      e.preventDefault();
      handleTabChange("path");
      setTimeout(() => {
        document.getElementById(`tab-path`)?.focus();
      }, 50);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 overflow-hidden">
      {/* Skip Navigation Links - Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-accent-500 focus:text-white focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>
      <a
        href="#tab-navigation"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-48 focus:z-[100] focus:px-6 focus:py-3 focus:bg-accent-500 focus:text-white focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to tabs
      </a>

      {/* Spotlight Effect */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#00D9FF" />

      {/* Meteors Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Meteors number={20} />
      </div>

      {/* Geometric Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#2C4F5E1a_1px,transparent_1px),linear-gradient(to_bottom,#2C4F5E1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Progress Bar - Fixed Top */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary-900/50 backdrop-blur-sm"
        role="progressbar"
        aria-label="Week 1 completion progress"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-accent-500 to-secondary-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Mobile Progress Indicator - Shows on scroll */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: showMobileProgress ? 1 : 0,
          y: showMobileProgress ? 0 : -20
        }}
        transition={{ duration: 0.2 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 lg:hidden"
      >
        <div className="px-6 py-3 rounded-full bg-primary-900/90 backdrop-blur-xl border border-accent-500/30 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-400" />
              <span className="text-sm font-semibold text-white">
                {viewedSections.size}/{totalSections}
              </span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <span className="text-xs text-primary-200">
              {allSectionsViewed ? 'Complete!' : 'Keep exploring'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Checkpoint Indicator - Fixed Right (Desktop) */}
      <nav
        className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4"
        aria-label="Section completion progress"
      >
        {[
          { id: "hero", label: "Intro", checked: viewedSections.has("hero") },
          { id: "problem", label: "Problem", checked: viewedSections.has("problem") },
          { id: "solution", label: "Solution", checked: viewedSections.has("solution") },
          { id: "method", label: "Method", checked: viewedSections.has("method") },
          { id: "path", label: "Path", checked: viewedSections.has("path") },
          { id: "practice", label: "Practice", checked: practiceCompleted, isPractice: true },
        ].map((checkpoint, index) => (
          <div
            key={checkpoint.id}
            className="group flex items-center gap-3"
            aria-label={`${checkpoint.label} section: ${checkpoint.checked ? 'completed' : checkpoint.isPractice ? 'locked - required' : 'not viewed'}`}
          >
            <div className="flex flex-col items-end gap-1">
              <span
                className={`text-xs font-medium transition-all duration-300 ${
                  checkpoint.checked
                    ? "text-accent-200 opacity-100"
                    : "text-primary-400 opacity-0 group-hover:opacity-100"
                }`}
              >
                {checkpoint.label}
              </span>
              {checkpoint.isPractice && !checkpoint.checked && (
                <span className="text-xs text-red-300 opacity-0 group-hover:opacity-100">
                  Required
                </span>
              )}
            </div>
            {checkpoint.checked ? (
              <CheckCircle className="w-5 h-5 text-accent-400" aria-hidden="true" />
            ) : checkpoint.isPractice ? (
              <Lock className="w-5 h-5 text-red-400" aria-hidden="true" />
            ) : (
              <div className="w-3 h-3 rounded-full border-2 border-primary-500/50" aria-hidden="true" />
            )}
          </div>
        ))}
      </nav>

      {/* Checkpoint Indicator - Bottom (Mobile/Tablet) */}
      <nav
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 lg:hidden"
        aria-label="Section completion progress"
      >
        <div className="px-4 py-2 rounded-full bg-primary-900/90 backdrop-blur-xl border border-accent-500/30 shadow-xl">
          <div className="flex items-center gap-3" role="list">
            {[
              { id: "hero", label: "Intro", checked: viewedSections.has("hero") },
              { id: "problem", label: "Problem", checked: viewedSections.has("problem") },
              { id: "solution", label: "Solution", checked: viewedSections.has("solution") },
              { id: "method", label: "Method", checked: viewedSections.has("method") },
              { id: "path", label: "Path", checked: viewedSections.has("path") },
              { id: "practice", label: "Practice", checked: practiceCompleted, isPractice: true },
            ].map((checkpoint, index) => (
              <div
                key={checkpoint.id}
                className="relative group"
                role="listitem"
                aria-label={`${checkpoint.label}: ${checkpoint.checked ? 'completed' : checkpoint.isPractice ? 'locked' : 'not viewed'}`}
              >
                {checkpoint.checked ? (
                  <CheckCircle className="w-4 h-4 text-accent-400" aria-hidden="true" />
                ) : checkpoint.isPractice ? (
                  <Lock className="w-4 h-4 text-red-400" aria-hidden="true" />
                ) : (
                  <div className="w-2 h-2 rounded-full border-2 border-primary-500/50" aria-hidden="true" />
                )}
                {/* Tooltip on touch/hover */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-primary-900 border border-accent-500/30 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity pointer-events-none">
                  {checkpoint.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>

      <div className="relative z-10">
        {/* Hero Section - Full Screen */}
        <section
          id="main-content"
          ref={heroRef}
          data-section="hero"
          className="flex flex-col items-center justify-center px-4 py-24 md:py-32 text-center"
        >
          <BlurFade delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-500/30 bg-accent-500/10 backdrop-blur-sm mb-8">
              <div className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
              <span className="text-sm font-medium text-accent-300 tracking-wide">
                Week 1 - Foundation Training
              </span>
            </div>
          </BlurFade>

          <BlurFade delay={0.2}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              Break Your
              <br />
              <span className="bg-gradient-to-r from-accent-400 via-secondary-400 to-accent-300 bg-clip-text text-transparent">
                Empirical Illusions
              </span>
            </h1>
          </BlurFade>

          <BlurFade delay={0.3}>
            <p className="text-lg md:text-xl text-primary-200 mb-6 max-w-2xl mx-auto leading-relaxed">
              Learn to verify conditions, not just calculate answers.
              <br />
              <span className="text-accent-400 font-semibold">480 XP</span> available this week.
            </p>
          </BlurFade>

          <BlurFade delay={0.35}>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="text-xs text-primary-300">4 Interactive Lessons</span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 backdrop-blur-sm">
                <span className="text-xs text-red-300">Practice Required</span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-secondary-500/10 border border-secondary-500/30 backdrop-blur-sm">
                <span className="text-xs text-secondary-300">6 Problems</span>
              </div>
            </div>
          </BlurFade>

          {/* Enhanced Scroll Indicator */}
          <BlurFade delay={0.4}>
            <div className="flex flex-col items-center gap-2 mt-8">
              <div className="text-xs text-accent-200 font-medium animate-pulse">
                Scroll to explore
              </div>
              <ArrowDown className="w-5 h-5 text-accent-400 animate-bounce" />
            </div>
          </BlurFade>
        </section>

        {/* Interactive Tabs Section */}
        <section
          ref={tabsRef}
          className="flex flex-col items-center justify-center px-4 py-12 md:py-16"
        >
          <div className="max-w-6xl w-full">
            {/* Section Header - Compact */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-secondary-500/30 bg-secondary-500/10 backdrop-blur-sm mb-3">
                <Target className="w-3.5 h-3.5 text-secondary-400" />
                <span className="text-xs font-medium text-secondary-300 tracking-wide">
                  Essential Context
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                Why This Training Exists
              </h2>
              <p className="text-base text-primary-300 max-w-2xl mx-auto">
                Explore each tab below to understand the challenge and solution
              </p>
            </div>

            {/* Tab Navigation + Content - Side by Side Layout with Vertical Centering */}
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
              {/* Left Sidebar - Tab Navigation */}
              <div
                ref={tabsRef}
                id="tab-navigation"
                className="lg:w-64 flex-shrink-0"
                role="tablist"
                aria-label="Week 1 content sections"
              >
                <div className="flex flex-col gap-3">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isViewed = viewedSections.has(tab.id);
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
                        disabled={isTransitioning}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`tabpanel-${tab.id}`}
                        id={`tab-${tab.id}`}
                        tabIndex={activeTab === tab.id ? 0 : -1}
                        className={`group relative px-4 py-4 rounded-xl border backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-500 text-left ${
                          activeTab === tab.id
                            ? "border-accent-500 bg-accent-500/20 shadow-lg shadow-accent-500/30"
                            : "border-white/10 bg-white/5 hover:border-accent-500/50 hover:bg-white/10"
                        } ${isTransitioning ? 'opacity-50 cursor-wait' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`w-5 h-5 flex-shrink-0 transition-colors ${
                              activeTab === tab.id ? "text-accent-300" : "text-primary-300 group-hover:text-accent-400"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-sm font-semibold transition-colors truncate ${
                                  activeTab === tab.id ? "text-white" : "text-primary-200 group-hover:text-white"
                                }`}
                              >
                                {tab.label}
                              </span>
                              {isViewed && (
                                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-primary-400 mt-1">
                              <div className="w-1 h-1 rounded-full bg-primary-400" />
                              <span>{tab.time}</span>
                            </div>
                          </div>
                        </div>
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
                    role="tabpanel"
                    id={`tabpanel-${activeTab}`}
                    aria-labelledby={`tab-${activeTab}`}
                    tabIndex={0}
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                    className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-2xl outline-none focus:ring-2 focus:ring-accent-500 max-w-5xl h-full overflow-y-auto"
                  >
                    {activeTab === "problem" && <ProblemTab onShowModal={() => setShowModal(true)} />}
                    {activeTab === "solution" && <SolutionTab />}
                    {activeTab === "method" && <MethodTab />}
                    {activeTab === "path" && <PathTab />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section - Gated */}
        <section
          ref={ctaRef}
          className="flex flex-col items-center justify-center px-4 py-12"
        >
          <div className="max-w-5xl w-full">
            {/* Compact Progress Check */}
            <div
              className={`mb-8 p-4 rounded-xl text-center backdrop-blur-sm transition-all duration-300 ${
                allSectionsViewed
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-yellow-500/10 border border-yellow-500/30'
              }`}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center justify-center gap-3">
                {allSectionsViewed ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-semibold text-white">
                      All sections completed · {!practiceCompleted ? 'Complete practice to unlock problems' : 'Ready for problems'}
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-semibold text-white">
                      {viewedSections.size}/{totalSections} sections viewed · Explore all tabs to continue
                    </span>
                  </>
                )}
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-3">
              Ready to Start?
            </h2>
            <p className="text-base text-primary-300 text-center mb-8 max-w-xl mx-auto">
              {!practiceCompleted
                ? "Complete the practice demo, then tackle error-forcing problems"
                : "Practice complete! Now master the real challenges."}
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {/* Practice Demo - Next Chapter Card */}
              <div className={`group relative ${!allSectionsViewed ? 'opacity-40' : ''}`}>
                {/* Animated gradient border */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl opacity-20 group-hover:opacity-40 blur-lg transition duration-500"></div>

                <div className="relative bg-gradient-to-br from-primary-800/90 to-primary-900/90 backdrop-blur-xl rounded-2xl border-2 border-secondary-500/50 hover:border-secondary-400/70 transition-all duration-300 overflow-hidden">
                  {/* Locked overlay */}
                  {!allSectionsViewed && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20">
                      <div className="text-center px-4">
                        <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                          <Lock className="w-8 h-8 text-yellow-400" />
                        </div>
                        <p className="text-base font-bold text-white mb-2">Complete All 4 Tabs First</p>
                        <p className="text-sm text-primary-300">Read all learning sections to unlock</p>
                      </div>
                    </div>
                  )}

                  {/* Status badge */}
                  {practiceCompleted && (
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-xs font-bold text-green-400 uppercase tracking-wide">Completed</span>
                    </div>
                  )}
                  {!practiceCompleted && allSectionsViewed && (
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-full animate-pulse">
                      <span className="text-xs font-bold text-red-400 uppercase tracking-wide">Required First</span>
                    </div>
                  )}

                  <div className="p-8 text-center">
                    {/* Icon */}
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-secondary-500/20 to-secondary-600/20 border border-secondary-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-10 h-10 text-secondary-300" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Practice Demo
                    </h3>

                    {/* Description */}
                    <p className="text-primary-200 mb-6 leading-relaxed">
                      Guided walkthrough of the 5-phase CERC workflow with a complete example problem
                    </p>

                    {/* Content Preview */}
                    <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs font-semibold text-secondary-300 mb-3 uppercase tracking-wide">What You'll Practice</div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {['Read', 'Analyze', 'Plan', 'Execute', 'Reflect'].map((phase, i) => (
                          <div key={i} className="px-3 py-1.5 rounded-full bg-secondary-500/10 border border-secondary-500/20 text-xs text-primary-200">
                            {i + 1}. {phase}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-center gap-4 mb-6 text-sm text-primary-300">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary-400" />
                        <span>~15 minutes</span>
                      </div>
                      <div className="w-px h-4 bg-white/20" />
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary-400" />
                        <span>No XP · Learning only</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link href="/student/week/1/practice/instructions">
                      <ShimmerButton
                        className="w-full py-4 text-lg"
                        disabled={!allSectionsViewed}
                        shimmerColor={allSectionsViewed ? "#9D4EDD" : "#1A303C"}
                      >
                        {practiceCompleted ? '↻ Review Demo' : 'Start Practice Demo →'}
                      </ShimmerButton>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Training Problems - Next Chapter Card */}
              <div className={`group relative ${!canAccessProblems ? 'opacity-40' : ''}`}>
                {/* Animated gradient border */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl opacity-20 group-hover:opacity-40 blur-lg transition duration-500"></div>

                <div className="relative bg-gradient-to-br from-primary-800/90 to-primary-900/90 backdrop-blur-xl rounded-2xl border-2 border-accent-500/50 hover:border-accent-400/70 transition-all duration-300 overflow-hidden">
                  {/* Locked overlay */}
                  {!canAccessProblems && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20">
                      <div className="text-center px-4">
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                          <Lock className="w-8 h-8 text-red-400" />
                        </div>
                        <p className="text-base font-bold text-white mb-2">
                          {!practiceCompleted ? 'Complete Practice Demo First' : 'Complete All 4 Tabs First'}
                        </p>
                        <p className="text-sm text-primary-300">
                          {!practiceCompleted ? 'Mandatory training required' : 'Read all learning sections to unlock'}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="p-8 text-center">
                    {/* Icon */}
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-accent-500/20 to-accent-600/20 border border-accent-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Trophy className="w-10 h-10 text-accent-300" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Training Problems
                    </h3>

                    {/* Description */}
                    <p className="text-primary-200 mb-6 leading-relaxed">
                      6 error-forcing problems designed to expose and eliminate reasoning gaps
                    </p>

                    {/* Content Preview */}
                    <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs font-semibold text-accent-300 mb-3 uppercase tracking-wide">Problem Topics</div>
                      <div className="grid grid-cols-2 gap-2">
                        {['MVT Conditions', 'IVT Continuity', 'EVT Endpoints', 'Differentiability', 'Inference Conditions', 'Test Validity'].map((topic, i) => (
                          <div key={i} className="px-2 py-1.5 rounded-lg bg-accent-500/10 border border-accent-500/20 text-xs text-primary-200 truncate">
                            {i + 1}. {topic}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* XP Badge */}
                    <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-xl bg-accent-500/10 border border-accent-500/30">
                      <Zap className="w-5 h-5 text-accent-400" />
                      <div className="text-left">
                        <div className="text-2xl font-bold text-accent-400">480 XP</div>
                        <div className="text-xs text-primary-400">Up to 80 XP per problem</div>
                      </div>
                    </div>

                    {/* CTA */}
                    {canAccessProblems ? (
                      <Link href="/student/week/1/problems">
                        <ShimmerButton className="w-full py-4 text-lg" shimmerColor="#00D9FF">
                          Start Training Problems →
                        </ShimmerButton>
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="w-full py-4 text-lg rounded-full bg-primary-700/50 text-primary-400 font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Lock className="w-5 h-5" />
                        Locked
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* CERC Infographic Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setShowModal(false);
              setModalViewed(true);
            }}
            onAnimationComplete={() => {
              // Track modal view after animation completes
              if (showModal && !modalViewed) {
                setModalViewed(true);
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-label="CERC comparison infographic: Traditional vs CERC response examples"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative max-w-7xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                ref={modalCloseButtonRef}
                onClick={() => {
                  setShowModal(false);
                  setModalViewed(true);
                }}
                className="absolute -top-4 -right-4 z-10 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg focus:ring-2 focus:ring-white focus:outline-none"
                aria-label="Close CERC comparison infographic"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="rounded-3xl overflow-hidden border-2 border-accent-500 shadow-2xl bg-white">
                <Image
                  src="/infographic-cerc-comparison.png"
                  alt="Traditional vs CERC Response Comparison"
                  width={2752}
                  height={1536}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Help Modal */}
      <AnimatePresence>
        {showKeyboardHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowKeyboardHelp(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts help"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative max-w-2xl w-full bg-gradient-to-br from-primary-800 to-primary-900 rounded-3xl border-2 border-accent-500 p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowKeyboardHelp(false)}
                className="absolute -top-4 -right-4 z-10 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg focus:ring-2 focus:ring-white focus:outline-none"
                aria-label="Close keyboard shortcuts help"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white mb-2">Keyboard Shortcuts</h2>
                  <p className="text-primary-300">Navigate faster with these keyboard commands</p>
                </div>

                <div className="space-y-4">
                  {/* Tab Navigation */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h3 className="text-lg font-semibold text-accent-400 mb-3">Tab Navigation</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-primary-200">Problem tab</span>
                        <kbd className="px-3 py-1 bg-primary-700 text-white rounded-lg border border-accent-500/30 font-mono text-sm">1</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-primary-200">Solution tab</span>
                        <kbd className="px-3 py-1 bg-primary-700 text-white rounded-lg border border-accent-500/30 font-mono text-sm">2</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-primary-200">Method tab</span>
                        <kbd className="px-3 py-1 bg-primary-700 text-white rounded-lg border border-accent-500/30 font-mono text-sm">3</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-primary-200">Path tab</span>
                        <kbd className="px-3 py-1 bg-primary-700 text-white rounded-lg border border-accent-500/30 font-mono text-sm">4</kbd>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Navigation */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h3 className="text-lg font-semibold text-accent-400 mb-3">Arrow Navigation (when tab focused)</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-primary-200">Next/Previous tab</span>
                        <div className="flex gap-2">
                          <kbd className="px-3 py-1 bg-primary-700 text-white rounded-lg border border-accent-500/30 font-mono text-sm">←</kbd>
                          <kbd className="px-3 py-1 bg-primary-700 text-white rounded-lg border border-accent-500/30 font-mono text-sm">→</kbd>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-primary-200">First tab</span>
                        <kbd className="px-3 py-1 bg-primary-700 text-white rounded-lg border border-accent-500/30 font-mono text-sm">Home</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-primary-200">Last tab</span>
                        <kbd className="px-3 py-1 bg-primary-700 text-white rounded-lg border border-accent-500/30 font-mono text-sm">End</kbd>
                      </div>
                    </div>
                  </div>

                  {/* General */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h3 className="text-lg font-semibold text-accent-400 mb-3">General</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-primary-200">Close modal/help</span>
                        <kbd className="px-3 py-1 bg-primary-700 text-white rounded-lg border border-accent-500/30 font-mono text-sm">Esc</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-primary-200">Show this help</span>
                        <kbd className="px-3 py-1 bg-primary-700 text-white rounded-lg border border-accent-500/30 font-mono text-sm">?</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-primary-200">Skip to content</span>
                        <kbd className="px-3 py-1 bg-primary-700 text-white rounded-lg border border-accent-500/30 font-mono text-sm">Tab</kbd>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4 border-t border-white/10">
                  <p className="text-sm text-primary-400">
                    Press <kbd className="px-2 py-1 bg-primary-700 text-white rounded border border-accent-500/30 font-mono text-xs">?</kbd> anytime to see these shortcuts
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Color class mappings for Tailwind purge safety
const COLOR_CLASSES = {
  red: {
    glow: 'from-red-500/20 to-red-600/20',
    iconBg: 'bg-red-500/10 border-red-500/30',
    iconColor: 'text-red-400',
    exampleBg: 'bg-red-500/5 border-red-500/20',
    exampleText: 'text-red-300',
  },
  accent: {
    glow: 'from-accent-500/20 to-accent-600/20',
    iconBg: 'bg-accent-500/10 border-accent-500/30',
    iconColor: 'text-accent-400',
    exampleBg: 'bg-accent-500/5 border-accent-500/20',
    exampleText: 'text-accent-300',
  },
  yellow: {
    glow: 'from-yellow-500/20 to-yellow-600/20',
    iconBg: 'bg-yellow-500/10 border-yellow-500/30',
    iconColor: 'text-yellow-400',
    exampleBg: 'bg-yellow-500/5 border-yellow-500/20',
    exampleText: 'text-yellow-300',
  },
  green: {
    glow: 'from-green-500/20 to-green-600/20',
    iconBg: 'bg-green-500/10 border-green-500/30',
    iconColor: 'text-green-400',
    exampleBg: 'bg-green-500/5 border-green-500/20',
    exampleText: 'text-green-300',
  },
} as const;

// Unified Card Component for ALL tabs
function UnifiedCard({
  icon: Icon,
  title,
  description,
  example,
  color = "accent",
  delay = 0
}: {
  icon: any;
  title: string;
  description: string;
  example?: string;
  color?: keyof typeof COLOR_CLASSES;
  delay?: number;
}) {
  const colors = COLOR_CLASSES[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="group relative"
    >
      {/* Unified glow */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${colors.glow} rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500`} />

      {/* Unified card structure */}
      <div className="relative h-full flex flex-col p-5 rounded-xl bg-gradient-to-br from-primary-800/90 to-primary-900/90 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-300 overflow-hidden">
        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          {/* Unified icon */}
          <div className="mb-3">
            <div className={`inline-flex p-2 rounded-lg ${colors.iconBg}`}>
              <Icon className={`w-6 h-6 ${colors.iconColor}`} />
            </div>
          </div>

          {/* Unified title */}
          <h4 className="text-base font-bold text-white mb-2">
            {title}
          </h4>

          {/* Unified description */}
          <p className="text-sm text-primary-200 mb-3 leading-relaxed flex-1">
            {description}
          </p>

          {/* Unified example box (optional) */}
          {example && (
            <div className={`p-2.5 rounded-lg ${colors.exampleBg}`}>
              <p className={`text-xs ${colors.exampleText} italic leading-relaxed`}>
                "{example}"
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Tab Content Components

function ProblemTab({ onShowModal }: { onShowModal: () => void }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent"
        >
          Why Students Fail AP Justification
        </motion.h3>
        <p className="text-base text-primary-300 max-w-2xl mx-auto leading-relaxed">
          You can solve the problem. You can get the right answer. But you lose 2-3 points anyway.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <UnifiedCard
          icon={AlertTriangle}
          title="Condition Bypass"
          description="Applying theorems without checking if hypotheses are satisfied"
          example="MVT on discontinuous functions"
          color="red"
          delay={0}
        />
        <UnifiedCard
          icon={Target}
          title="Empirical Reasoning"
          description="Relying on calculations without formal justification"
          example="I plugged in values and it works"
          color="red"
          delay={0.1}
        />
        <UnifiedCard
          icon={Lightbulb}
          title="CER Breakdown"
          description="Missing Conditions in Claim-Evidence-Reasoning chains"
          example="Stating conclusion without showing why theorem applies"
          color="red"
          delay={0.2}
        />
      </div>

      {/* CTA Button */}
      <div className="mt-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="inline-block relative group"
        >
          {/* Animated glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-accent-500 via-secondary-500 to-accent-500 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition duration-500" />

          {/* Button */}
          <button
            onClick={onShowModal}
            className="relative px-8 py-4 rounded-full bg-gradient-to-r from-accent-900/90 to-secondary-900/90 border-2 border-accent-500/50 backdrop-blur-xl text-white font-bold text-lg hover:scale-105 hover:border-accent-400 transition-all duration-300 shadow-2xl overflow-hidden group"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <span className="relative flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-accent-300 group-hover:text-accent-200 transition-colors" />
              <span className="bg-gradient-to-r from-white to-accent-100 bg-clip-text text-transparent">
                See CERC In Action: +2-3 Points
              </span>
              <Trophy className="w-6 h-6 text-accent-300 group-hover:text-accent-200 transition-colors" />
            </span>
          </button>
        </motion.div>

        <p className="text-xs text-primary-400 mt-4 font-medium">
          Visual comparison of failing vs. passing responses
        </p>
      </div>
    </div>
  );
}

function SolutionTab() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white via-accent-200 to-white bg-clip-text text-transparent"
        >
          The CERC Framework
        </motion.h3>
        <p className="text-base text-primary-300 max-w-2xl mx-auto leading-relaxed">
          Four components that transform partial credit into full credit on AP exams
        </p>
      </div>

      {/* Cards Grid - 3 cards like other tabs */}
      <div className="grid md:grid-cols-3 gap-4">
        <UnifiedCard
          icon={Target}
          title="C: Claim"
          description="State your conclusion explicitly. What are you proving?"
          example="The Mean Value Theorem does not apply to f(x) on [-1,1]"
          color="accent"
          delay={0}
        />
        <UnifiedCard
          icon={FileText}
          title="E: Evidence"
          description="Show calculations and data that support your claim"
          example="f(0) is undefined, creating discontinuity in the interval"
          color="accent"
          delay={0.1}
        />
        <UnifiedCard
          icon={Lightbulb}
          title="R: Reasoning"
          description="Name the theorem connecting evidence to claim"
          example="MVT requires continuity on [a,b]; since f violates this, MVT fails"
          color="accent"
          delay={0.2}
        />
      </div>

      {/* Second row with Conditions card centered */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-start-2">
          <UnifiedCard
            icon={ListChecks}
            title="C: Conditions"
            description="Verify ALL theorem hypotheses explicitly"
            example="Checking continuity: f(x)=1/x² is discontinuous at x=0 ✗"
            color="accent"
            delay={0.3}
          />
        </div>
      </div>
    </div>
  );
}

function MethodTab() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent"
        >
          Error-Forcing Problems
        </motion.h3>
        <p className="text-base text-primary-300 max-w-2xl mx-auto leading-relaxed">
          Problems designed to expose empirical reasoning gaps through strategic traps
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <UnifiedCard
          icon={AlertTriangle}
          title="The Trap"
          description="Problems where empirical approaches seem to work but violate theorem conditions"
          example="Apply MVT to f(x)=1/x² on [-1,1] (discontinuous at x=0)"
          color="yellow"
          delay={0}
        />
        <UnifiedCard
          icon={CheckCircle}
          title="The Exposure"
          description="Students realize calculations alone don't guarantee correctness without verification"
          example="Average rate exists, but MVT doesn't apply without continuity"
          color="yellow"
          delay={0.1}
        />
        <UnifiedCard
          icon={Lightbulb}
          title="The Learning"
          description="Force systematic CERC workflow: always verify conditions before applying theorems"
          example="Check continuity → Check differentiability → Apply theorem"
          color="yellow"
          delay={0.2}
        />
      </div>
    </div>
  );
}

function PathTab() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent"
        >
          Your Learning Path
        </motion.h3>
        <p className="text-base text-primary-300 max-w-2xl mx-auto leading-relaxed">
          Progress through three stages of mathematical reasoning maturity
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <UnifiedCard
          icon={AlertTriangle}
          title="Stage 1: Empirical"
          description="Relies on calculations and observations without formal justification"
          example="I plugged in x=2 and it works, so the theorem applies"
          color="green"
          delay={0}
        />
        <UnifiedCard
          icon={Target}
          title="Stage 2: Generic"
          description="Identifies patterns and applies theorems with awareness of conditions"
          example="The function looks continuous, so I can use IVT"
          color="green"
          delay={0.1}
        />
        <UnifiedCard
          icon={CheckCircle}
          title="Stage 3: Formal Deductive"
          description="Complete CERC proofs with explicit theorem verification"
          example="f is continuous on [a,b] because... therefore IVT applies"
          color="green"
          delay={0.2}
        />
      </div>
    </div>
  );
}
