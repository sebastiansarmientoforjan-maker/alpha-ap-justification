"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Shield, Home } from "lucide-react";

export function RoleSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");
  const isStudent = pathname.startsWith("/student");

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-accent-500 to-secondary-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        {isAdmin ? (
          <>
            <Shield className="w-5 h-5" />
            <span>Admin View</span>
          </>
        ) : isStudent ? (
          <>
            <Users className="w-5 h-5" />
            <span>Student View</span>
          </>
        ) : (
          <>
            <Home className="w-5 h-5" />
            <span>Home</span>
          </>
        )}
        <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-3 w-64 rounded-2xl border border-white/10 bg-primary-900/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-fade-in-up">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-sm font-semibold text-white mb-1">
              🔓 Development Mode
            </h3>
            <p className="text-xs text-primary-300">
              Switch between views (auth disabled)
            </p>
          </div>

          <div className="p-2">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                !isAdmin && !isStudent
                  ? "bg-accent-500/20 text-accent-300 border border-accent-500/30"
                  : "text-primary-200 hover:bg-white/5"
              }`}
            >
              <Home className="w-5 h-5" />
              <div>
                <div className="text-sm font-medium">Home</div>
                <div className="text-xs opacity-70">Landing page</div>
              </div>
            </Link>

            <Link
              href="/student/week/1"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mt-1 ${
                isStudent
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "text-primary-200 hover:bg-white/5"
              }`}
            >
              <Users className="w-5 h-5" />
              <div>
                <div className="text-sm font-medium">Student View</div>
                <div className="text-xs opacity-70">Week 1 - 4 content</div>
              </div>
            </Link>

            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mt-1 ${
                isAdmin
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "text-primary-200 hover:bg-white/5"
              }`}
            >
              <Shield className="w-5 h-5" />
              <div>
                <div className="text-sm font-medium">Admin Dashboard</div>
                <div className="text-xs opacity-70">Progress tracking</div>
              </div>
            </Link>
          </div>

          <div className="p-3 bg-yellow-500/10 border-t border-yellow-500/20 text-xs text-yellow-300">
            <div className="flex items-start gap-2">
              <span>⚠️</span>
              <span>
                Auth is disabled. Re-enable in <code className="text-yellow-200">middleware.ts</code> before production.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
