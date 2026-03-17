/**
 * Unauthorized Access Page
 * Shown when user tries to access routes they don't have permission for
 */
"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear cookies
    document.cookie = "auth-token=; path=/; max-age=0";
    document.cookie = "user-role=; path=/; max-age=0";
    document.cookie = "user-id=; path=/; max-age=0";

    // Redirect to login
    router.push("/login");
  };

  const goBack = () => {
    router.back();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
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

          {/* Error Card */}
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 backdrop-blur-xl shadow-glass">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-red-500/20 p-4">
                <ShieldAlert className="h-12 w-12 text-red-400" />
              </div>
            </div>

            <h1 className="mb-3 text-3xl font-bold text-white">Access Denied</h1>
            <p className="mb-6 text-primary-200">
              You don't have permission to access this page.
            </p>

            <div className="space-y-3">
              <button
                onClick={goBack}
                className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3 font-semibold text-white transition-all hover:bg-white/20 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>

              <button
                onClick={handleLogout}
                className="w-full rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 font-semibold text-white transition-all hover:from-red-600 hover:to-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
            <p className="text-xs text-yellow-200">
              If you believe this is an error, please contact your administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
