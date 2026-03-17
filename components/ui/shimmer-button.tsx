"use client";

import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "linear-gradient(135deg, #00D9FF 0%, #7B61FF 100%)",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            "--shimmer-color": shimmerColor,
            "--shimmer-size": shimmerSize,
            "--shimmer-duration": shimmerDuration,
            "--border-radius": borderRadius,
            "--background": background,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white [background:var(--background)] [border-radius:var(--border-radius)] transition-all duration-300 hover:scale-105",
          "transform-gpu transition-transform active:scale-95",
          className
        )}
        ref={ref}
        {...props}
      >
        <div
          className={cn(
            "absolute inset-0 overflow-visible [container-type:size]"
          )}
        >
          <div className="absolute inset-0 h-[100cqh] animate-shimmer [aspect-ratio:1] [border-radius:0] [mask:none]">
            <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--shimmer-size)*0.5)),transparent_0,var(--shimmer-color)_var(--shimmer-size),transparent_var(--shimmer-size))] [translate:0_0]" />
          </div>
        </div>

        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 top-0 z-0 [background:var(--background)] [border-radius:var(--border-radius)] [inset:calc(var(--shimmer-size)*1)]"
          )}
        ></div>

        <div className="relative z-10 font-semibold">{children}</div>
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";

export default ShimmerButton;
