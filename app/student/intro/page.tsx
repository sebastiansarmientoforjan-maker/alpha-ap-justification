import { VideoPlayer } from "@/components/student/VideoPlayer";
import Link from "next/link";
import { ArrowRight, BookOpen, Target, Trophy } from "lucide-react";

export default function CourseIntroPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-white">
            Welcome to AP Math Justification Training
          </h1>
          <p className="text-white/60 mt-2">
            4-week course • CERC Framework • Alpha High School
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Video Section */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Course Introduction
            </h2>
            <p className="text-white/70">
              Watch this 5-minute overview to understand the CERC Framework and what you'll accomplish in the next 4 weeks.
            </p>
          </div>

          <VideoPlayer
            src="/videos/cerc-intro.mp4"
            title="The CERC Framework"
            className="shadow-2xl shadow-cyan-500/20"
          />

          <div className="mt-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
            <p className="text-cyan-300 text-sm">
              💡 <strong>Tip:</strong> Use the speed control (⚙️) in the bottom right to watch at 1.5x or 2x speed.
            </p>
          </div>
        </div>

        {/* Course Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="text-cyan-400" size={24} />
            </div>
            <h3 className="text-white font-semibold mb-2">Week 1-2</h3>
            <p className="text-white/60 text-sm">
              Error-forcing problems with full CERC scaffolding. Learn to identify broken theorem conditions.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <Target className="text-purple-400" size={24} />
            </div>
            <h3 className="text-white font-semibold mb-2">Week 3</h3>
            <p className="text-white/60 text-sm">
              Global argumentation and communication precision. Build unassisted complete proofs.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
              <Trophy className="text-amber-400" size={24} />
            </div>
            <h3 className="text-white font-semibold mb-2">Week 4</h3>
            <p className="text-white/60 text-sm">
              Boss Battle mode. Collaborative AP FRQ synthesis under timed conditions.
            </p>
          </div>
        </div>

        {/* CERC Framework Breakdown */}
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">
            The CERC Framework
          </h3>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center font-bold text-white">
                C
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Claim</h4>
                <p className="text-white/70 text-sm">
                  The conclusion you're making (e.g., "The function has a maximum at x = 2")
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center font-bold text-white">
                E
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Evidence</h4>
                <p className="text-white/70 text-sm">
                  Mathematical data or computation supporting your claim (calculations, derivatives, etc.)
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center font-bold text-white">
                R
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Reasoning</h4>
                <p className="text-white/70 text-sm">
                  The theorem or principle connecting evidence to claim (e.g., "By the First Derivative Test...")
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-white">
                C
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Conditions</h4>
                <p className="text-white/70 text-sm">
                  Explicit verification that theorem hypotheses are satisfied (continuity, differentiability, etc.)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What You'll Earn */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">
            What You'll Earn
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-cyan-400 font-semibold mb-3">XP System</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>• +50 XP - Identify broken theorem condition</li>
                <li>• +100 XP - Spot logical flaw in peer argument</li>
                <li>• +150 XP - Unassisted complete CERC proof</li>
              </ul>
            </div>

            <div>
              <h4 className="text-purple-400 font-semibold mb-3">Achievement Badges</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>🔍 The Skeptic - Survive error-forcing problem</li>
                <li>🏛️ The Architect - Flawless CERC proof</li>
                <li>⚔️ Boss Slayer - Complete Week 4 Boss Battle</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/student/week/1"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105"
          >
            Start Week 1
            <ArrowRight size={24} />
          </Link>

          <p className="text-white/50 text-sm mt-4">
            First session: Error-Forcing Problems
          </p>
        </div>
      </div>
    </div>
  );
}
