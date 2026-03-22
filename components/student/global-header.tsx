"use client";

import Link from "next/link";
import { Home, Award, Zap, FileText } from "lucide-react";
import { CourseSwitcher } from "./course-switcher";

interface GlobalHeaderProps {
  userName: string;
  userCourse: string;
  totalXP: number;
  badges: string[];
  pendingFRQsCount: number;
}

export function GlobalHeader({
  userName,
  userCourse,
  totalXP,
  badges,
  pendingFRQsCount,
}: GlobalHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-primary-900/95 backdrop-blur-xl shadow-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Back to Roadmap */}
          <Link
            href="/"
            className="group flex items-center gap-2 text-primary-200 hover:text-accent-400 transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-accent-500/10 transition-all duration-300">
              <Home className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Back to Roadmap</span>
          </Link>

          {/* Right: Course Switcher + XP + Badges + FRQs */}
          <div className="flex items-center gap-3">
            {/* Course Switcher */}
            <CourseSwitcher
              currentCourse={userCourse || "calculus-bc"}
              currentStudentName={userName}
            />

            {/* XP Display */}
            <div className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-500/10 to-secondary-500/10 border border-accent-500/30 backdrop-blur-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-semibold text-accent-300">{totalXP} XP</span>
            </div>

            {/* Badges */}
            {badges.length > 0 && (
              <div className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 backdrop-blur-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-amber-300">{badges.length} Badges</span>
              </div>
            )}

            {/* FRQs Link with Badge */}
            <Link
              href="/student/frqs"
              className="relative group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent-500/50 transition-all duration-300"
            >
              <FileText className="w-4 h-4 text-primary-300 group-hover:text-accent-400 transition-colors" />
              <span className="text-sm font-medium text-primary-200 group-hover:text-white transition-colors">
                FRQs
              </span>
              {pendingFRQsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                  {pendingFRQsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
