import Image from "next/image";
import { Spotlight } from "@/components/ui/spotlight";
import { Meteors } from "@/components/ui/meteors";
import { ProgramRoadmap } from "@/components/ui/program-roadmap";
import { Target, Lightbulb, MessageSquare, Trophy } from "lucide-react";
import { getDataService } from "@/services/data";

export default async function Home() {
  // Fetch student progress from MockAdapter
  const dataService = await getDataService();
  const studentId = "ananya-001"; // Mock student for development

  let currentWeek = 1;
  let completedWeeks: number[] = [];

  try {
    const progress = await dataService.getAllProgress(studentId);
    if (progress.length > 0) {
      completedWeeks = progress
        .filter(p => p.cercResponses.length > 0)
        .map(p => p.weekNumber);
      currentWeek = Math.max(...progress.map(p => p.weekNumber), 1);

      // If current week has responses, move to next week
      const currentWeekProgress = progress.find(p => p.weekNumber === currentWeek);
      if (currentWeekProgress && currentWeekProgress.cercResponses.length > 0) {
        currentWeek = Math.min(currentWeek + 1, 4);
      }
    }
  } catch (error) {
    console.error("Error fetching student progress:", error);
  }
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
      {/* Spotlight Effect */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#00D9FF" />

      {/* Meteors Background */}
      <div className="absolute inset-0 overflow-hidden">
        <Meteors number={30} />
      </div>

      {/* Geometric Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#2C4F5E1a_1px,transparent_1px),linear-gradient(to_bottom,#2C4F5E1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="mx-auto max-w-5xl">
          {/* Glass Container */}
          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-12 backdrop-blur-xl shadow-glass">
            {/* Logo */}
            <div className="mb-8 flex justify-center animate-fade-in-up">
              <div className="relative">
                <Image
                  src="/assets/alpha-logo.png"
                  alt="Alpha High School"
                  width={300}
                  height={100}
                  className="object-contain drop-shadow-glow"
                  priority
                />
                {/* Glow effect behind logo */}
                <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-accent-500" />
              </div>
            </div>

            {/* Program Badge */}
            <div className="flex justify-center mb-6 animate-fade-in-up [animation-delay:0.05s]">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-500/30 bg-accent-500/10 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
                <span className="text-sm font-medium text-accent-300 tracking-wide">
                  HS Math Programme - Academic Team
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-center font-display text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight animate-fade-in-up [animation-delay:0.1s]">
              AP Math Justification
              <br />
              <span className="bg-gradient-to-r from-accent-400 to-secondary-400 bg-clip-text text-transparent">
                Training Program
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-center text-xl md:text-2xl text-primary-100 mb-4 animate-fade-in-up [animation-delay:0.2s]">
              4-Week Intensive Course
            </p>

            <p className="text-center text-lg text-primary-200 mb-8 max-w-2xl mx-auto animate-fade-in-up [animation-delay:0.3s]">
              Designed to achieve a 5 on the AP exam. Transform your mathematical reasoning from procedural to proof-based.
            </p>

            <div className="flex items-center justify-center gap-3 mb-12 animate-fade-in-up [animation-delay:0.35s]">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent-500/50" />
              <p className="text-sm uppercase tracking-[0.2em] text-accent-400 font-medium">
                Master the CERC Framework
              </p>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-accent-500/50" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 animate-fade-in-up [animation-delay:0.4s]">
              {[
                { label: "Program Duration", value: "4", unit: "weeks" },
                { label: "Target Score", value: "5", unit: "AP Exam" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-secondary-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                  <div className="relative rounded-2xl border border-white/10 bg-primary-800/40 px-6 py-8 text-center backdrop-blur-sm hover:border-accent-500/30 transition-all duration-300">
                    <div className="flex items-baseline justify-center gap-1 mb-3">
                      <div className="text-5xl font-bold bg-gradient-to-br from-accent-300 to-secondary-300 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      {stat.unit && (
                        <div className="text-lg font-medium text-accent-400/60">
                          {stat.unit}
                        </div>
                      )}
                    </div>
                    <div className="text-xs uppercase tracking-[0.15em] text-primary-300 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>


            {/* Decorative Elements */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary-500/20 rounded-full blur-3xl" />
          </div>

          {/* Program Roadmap */}
          <div className="mt-20 animate-fade-in-up [animation-delay:0.6s]">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Your Progress
              </h2>
              <p className="text-primary-200 max-w-2xl mx-auto">
                Click on an active week to access sessions and activities
              </p>
            </div>
            <ProgramRoadmap
              userProgress={{
                currentWeek,
                completedWeeks,
              }}
            />
          </div>

          {/* Core Capabilities */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up [animation-delay:0.7s]">
            <div className="md:col-span-2 text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                What You&apos;ll Master
              </h2>
              <p className="text-primary-200">
                Skills and tools for AP Math excellence
              </p>
            </div>
            {[
              {
                title: "CERC Framework",
                description: "Master Claim, Evidence, Reasoning, and Conditions",
                Icon: Target,
              },
              {
                title: "Error-Forcing Problems",
                description: "Break empirical illusions with targeted challenges",
                Icon: Lightbulb,
              },
              {
                title: "Progressive Scaffolding",
                description: "Week-by-week reduction of support as you master justification",
                Icon: MessageSquare,
              },
              {
                title: "Final Synthesis",
                description: "Week 4 collaborative capstone assessment",
                Icon: Trophy,
              },
            ].map((highlight, index) => (
              <div
                key={index}
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:border-accent-500/30"
              >
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-accent-500/20 to-secondary-500/20 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
                <div className="relative">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-primary-700 to-primary-800 mb-4 group-hover:from-accent-500/20 group-hover:to-secondary-500/20 transition-all duration-300">
                    <highlight.Icon className="w-7 h-7 text-accent-400 group-hover:text-accent-300 transition-colors" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-300 transition-colors">{highlight.title}</h3>
                  <p className="text-primary-200 text-sm leading-relaxed">{highlight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Particle Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent-400 rounded-full animate-particle-float opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
