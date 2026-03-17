/**
 * Login Page
 * Temporary development login - will be replaced with Firebase Auth + TimeBack OAuth
 */
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Spotlight } from "@/components/ui/spotlight";
import { AlertCircle } from "lucide-react";
import Image from "next/image";

// Mock users for development (TODO: Replace with Firebase Auth)
const MOCK_USERS = [
  { id: "ananya-001", name: "Ananya Kakarlapudi", role: "student", password: "demo" },
  { id: "emily-001", name: "Emily Smith", role: "student", password: "demo" },
  { id: "sebastian-admin", name: "Sebastian (Admin)", role: "admin", password: "admin" },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock authentication (TODO: Replace with Firebase)
    const user = MOCK_USERS.find(
      (u) => u.id === email || u.name.toLowerCase() === email.toLowerCase()
    );

    if (!user || user.password !== password) {
      setError("Invalid credentials. Try: ananya-001 / demo");
      setLoading(false);
      return;
    }

    // Set mock cookies (TODO: Replace with Firebase Auth tokens)
    document.cookie = `auth-token=${user.id}; path=/; max-age=86400`; // 24h
    document.cookie = `user-role=${user.role}; path=/; max-age=86400`;
    document.cookie = `user-id=${user.id}; path=/; max-age=86400`;

    // Redirect based on role
    if (user.role === "admin") {
      router.push("/admin");
    } else if (user.role === "student") {
      router.push(from.startsWith("/student") ? from : "/student");
    } else {
      router.push("/");
    }

    setLoading(false);
  };

  const quickLogin = (userId: string) => {
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (user) {
      setEmail(user.id);
      setPassword(user.password);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#00D9FF" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/assets/alpha-logo.png"
              alt="Alpha High School"
              width={200}
              height={67}
              className="object-contain drop-shadow-glow"
              priority
            />
          </div>

          {/* Login Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-glass">
            <h1 className="mb-2 text-center text-3xl font-bold text-white">Welcome Back</h1>
            <p className="mb-8 text-center text-primary-200">
              Sign in to continue to AP Math Justification
            </p>

            {/* Development Notice */}
            <div className="mb-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-yellow-300">Development Mode</p>
                  <p className="text-xs text-yellow-200 mt-1">
                    Using mock authentication. Production will use Firebase Auth + TimeBack OAuth.
                  </p>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-primary-200">
                  User ID or Email
                </label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-primary-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/50"
                  placeholder="ananya-001"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-primary-200">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-primary-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/50"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-accent-500 to-secondary-500 px-4 py-3 font-semibold text-white transition-all hover:from-accent-600 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Quick Login (Development Only) */}
            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="mb-3 text-xs text-primary-300 text-center">Quick Login (Dev)</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => quickLogin("ananya-001")}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-primary-200 hover:bg-white/10 transition-colors"
                >
                  Ananya (Student)
                </button>
                <button
                  type="button"
                  onClick={() => quickLogin("emily-001")}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-primary-200 hover:bg-white/10 transition-colors"
                >
                  Emily (Student)
                </button>
                <button
                  type="button"
                  onClick={() => quickLogin("sebastian-admin")}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-primary-200 hover:bg-white/10 transition-colors"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-primary-300">
            Alpha High School © 2026
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700" />}>
      <LoginForm />
    </Suspense>
  );
}
