"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export interface AnimatedBeamProps {
  className?: string;
  containerRef: React.RefObject<HTMLElement>;
  fromRef: React.RefObject<HTMLElement>;
  toRef: React.RefObject<HTMLElement>;
  curvature?: number;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = Math.random() * 3 + 4,
  delay = 0,
  pathColor = "gray",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#ffaa40",
  gradientStopColor = "#9c40ff",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}) => {
  const id = React.useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const [pathD, setPathD] = React.useState("");
  const [svgDimensions, setSvgDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    if (containerRef.current && fromRef.current && toRef.current) {
      const calculatePath = () => {
        const containerRect = containerRef.current!.getBoundingClientRect();
        const fromRect = fromRef.current!.getBoundingClientRect();
        const toRect = toRef.current!.getBoundingClientRect();

        const startX = fromRect.left - containerRect.left + fromRect.width / 2 + startXOffset;
        const startY = fromRect.top - containerRect.top + fromRect.height / 2 + startYOffset;
        const endX = toRect.left - containerRect.left + toRect.width / 2 + endXOffset;
        const endY = toRect.top - containerRect.top + toRect.height / 2 + endYOffset;

        const controlPointX = startX + (endX - startX) / 2;
        const controlPointY = startY - curvature;

        const d = `M ${startX},${startY} Q ${controlPointX},${controlPointY} ${endX},${endY}`;
        setPathD(d);
        setSvgDimensions({
          width: containerRect.width,
          height: containerRect.height,
        });
      };

      calculatePath();

      const resizeObserver = new ResizeObserver(calculatePath);
      resizeObserver.observe(containerRef.current);

      return () => resizeObserver.disconnect();
    }
  }, [containerRef, fromRef, toRef, curvature, startXOffset, startYOffset, endXOffset, endYOffset]);

  return (
    <svg
      ref={svgRef}
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "pointer-events-none absolute left-0 top-0 transform-gpu stroke-2",
        className
      )}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
    >
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />
      <path
        d={pathD}
        strokeWidth={pathWidth}
        stroke={`url(#${id})`}
        strokeOpacity="1"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          className="transform-gpu"
          id={id}
          gradientUnits={"userSpaceOnUse"}
          x1="0%"
          x2="100%"
          y1="0"
          y2="0"
        >
          {reverse ? (
            <>
              <stop stopColor={gradientStartColor} stopOpacity="0" offset="0%" />
              <motion.stop
                stopColor={gradientStartColor}
                offset="5%"
                animate={{
                  stopOpacity: [0, 1, 0],
                  offset: ["0%", "95%", "105%"],
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  delay,
                }}
              />
              <stop stopColor={gradientStopColor} stopOpacity="0" offset="100%" />
            </>
          ) : (
            <>
              <stop stopColor={gradientStartColor} stopOpacity="0" offset="0%" />
              <motion.stop
                stopColor={gradientStartColor}
                offset="5%"
                animate={{
                  stopOpacity: [0, 1, 0],
                  offset: ["0%", "95%", "105%"],
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  delay,
                }}
              />
              <stop stopColor={gradientStopColor} stopOpacity="0" offset="100%" />
            </>
          )}
        </linearGradient>
      </defs>
    </svg>
  );
};
