"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Sparkles, X } from "lucide-react";

interface BadgeUnlockAnimationProps {
  badge: {
    id: string;
    name?: string;
    icon?: string;
    description?: string;
  } | string;
  onComplete: () => void;
}

// Badge metadata
const BADGE_DATA: Record<string, { name: string; icon: string; description: string; color: string }> = {
  "the-skeptic": {
    name: "The Skeptic",
    icon: "🔍",
    description: "Caught the error-forcing trap by verifying all conditions",
    color: "from-blue-500 to-cyan-500",
  },
  "the-architect": {
    name: "The Architect",
    icon: "🏛️",
    description: "Perfect CERC proof on first attempt",
    color: "from-purple-500 to-pink-500",
  },
  "boss-slayer": {
    name: "Boss Slayer",
    icon: "⚔️",
    description: "Conquered the Week 4 Boss Battle",
    color: "from-red-500 to-orange-500",
  },
  "condition-master": {
    name: "Condition Master",
    icon: "✓",
    description: "Verified conditions in 10 consecutive problems",
    color: "from-green-500 to-emerald-500",
  },
};

export function BadgeUnlockAnimation({ badge, onComplete }: BadgeUnlockAnimationProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);

  // Get badge data
  const badgeId = typeof badge === "string" ? badge : badge.id;
  const badgeInfo = BADGE_DATA[badgeId] || {
    name: typeof badge === "object" && badge.name ? badge.name : "Achievement Unlocked",
    icon: typeof badge === "object" && badge.icon ? badge.icon : "🏆",
    description: typeof badge === "object" && badge.description ? badge.description : "You earned a badge!",
    color: "from-accent-500 to-secondary-500",
  };

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Auto-dismiss after 4 seconds
        setTimeout(() => {
          handleClose();
        }, 4000);
      },
    });

    // Animate overlay fade in
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    );

    // Animate card entrance
    tl.fromTo(
      cardRef.current,
      { scale: 0.5, opacity: 0, y: 50 },
      { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" },
      "-=0.1"
    );

    // Animate icon pop
    tl.fromTo(
      iconRef.current,
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" },
      "-=0.3"
    );

    // Animate sparkles
    tl.fromTo(
      sparklesRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" },
      "-=0.4"
    );

    // Pulse animation for icon
    gsap.to(iconRef.current, {
      scale: 1.1,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.8,
    });

    return () => {
      tl.kill();
    };
  }, []);

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete,
    });

    tl.to(cardRef.current, {
      scale: 0.9,
      opacity: 0,
      y: -30,
      duration: 0.3,
      ease: "power2.in",
    });

    tl.to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      },
      "-=0.2"
    );
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        ref={cardRef}
        className="relative max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sparkles Background */}
        <div
          ref={sparklesRef}
          className="absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)`,
          }}
        >
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Card */}
        <div className="relative rounded-3xl border border-white/20 bg-gradient-to-br from-primary-800/95 to-primary-900/95 backdrop-blur-xl p-8 shadow-2xl">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* Content */}
          <div className="text-center">
            {/* "Achievement Unlocked" Label */}
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/20 border border-accent-500/30">
                <Sparkles className="w-4 h-4 text-accent-400" />
                <span className="text-sm font-semibold text-accent-400 uppercase tracking-wider">
                  Achievement Unlocked
                </span>
              </div>
            </div>

            {/* Badge Icon */}
            <div className="mb-6 flex justify-center">
              <div
                ref={iconRef}
                className={`w-32 h-32 rounded-full bg-gradient-to-br ${badgeInfo.color} flex items-center justify-center text-6xl shadow-2xl border-4 border-white/20`}
              >
                {badgeInfo.icon}
              </div>
            </div>

            {/* Badge Name */}
            <h2 className="text-3xl font-bold text-white mb-3">
              {badgeInfo.name}
            </h2>

            {/* Badge Description */}
            <p className="text-primary-200 text-sm leading-relaxed max-w-sm mx-auto">
              {badgeInfo.description}
            </p>

            {/* Decorative Line */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent-500/50" />
              <div className="w-2 h-2 rounded-full bg-accent-500" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-accent-500/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
