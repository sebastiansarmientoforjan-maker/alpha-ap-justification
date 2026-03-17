/**
 * Logout Button Component
 * Client-side logout functionality
 */
"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  variant?: "default" | "ghost" | "danger";
  className?: string;
  showIcon?: boolean;
}

export function LogoutButton({
  variant = "default",
  className = "",
  showIcon = true
}: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Clear auth cookies
    document.cookie = "auth-token=; path=/; max-age=0";
    document.cookie = "user-role=; path=/; max-age=0";
    document.cookie = "user-id=; path=/; max-age=0";

    // Redirect to login
    router.push("/login");
  };

  const baseStyles = "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors";

  const variantStyles = {
    default: "bg-white/10 text-white hover:bg-white/20 border border-white/20",
    ghost: "text-primary-300 hover:text-white hover:bg-white/10",
    danger: "bg-red-500/10 text-red-300 hover:bg-red-500/20 border border-red-500/30"
  };

  return (
    <button
      onClick={handleLogout}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {showIcon && <LogOut className="h-4 w-4" />}
      <span>Sign Out</span>
    </button>
  );
}
