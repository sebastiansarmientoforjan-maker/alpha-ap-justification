"use client";

import { motion } from "framer-motion";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { CheckCircle, Target, Database, Brain, ShieldCheck } from "lucide-react";

interface EnhancedCERCSolutionProps {
  claim: string;
  evidence: string;
  reasoning: string;
  conditions: string;
}

/**
 * Enhanced CERC Solution Display with:
 * - Professional step-by-step layout
 * - Prominent LaTeX rendering
 * - Color-coded CERC components
 * - Visual hierarchy and geometric precision
 * - AP rubric annotations highlighted
 */
export function EnhancedCERCSolution({
  claim,
  evidence,
  reasoning,
  conditions,
}: EnhancedCERCSolutionProps) {

  // Parse content into steps and LaTeX
  const parseContentWithSteps = (text: string) => {
    const segments: { type: 'text' | 'math' | 'rubric'; content: string }[] = [];

    // Extract AP Rubric annotations
    const rubricRegex = /\[AP Rubric:([^\]]+)\]/g;
    let lastIndex = 0;
    let match;

    const textSegments: string[] = [];
    const rubrics: { index: number; content: string }[] = [];

    while ((match = rubricRegex.exec(text)) !== null) {
      textSegments.push(text.slice(lastIndex, match.index));
      rubrics.push({
        index: textSegments.length - 1,
        content: match[1].trim(),
      });
      lastIndex = match.index + match[0].length;
    }
    textSegments.push(text.slice(lastIndex));

    // Parse each segment for math
    textSegments.forEach((segment, idx) => {
      // Block math $$...$$
      const blockMathRegex = /\$\$([\s\S]*?)\$\$/g;
      const parts = segment.split(blockMathRegex);

      parts.forEach((part, partIdx) => {
        if (partIdx % 2 === 1) {
          // This is block math
          segments.push({ type: 'math', content: part.trim() });
        } else {
          // Check for inline math $...$
          const inlineMathRegex = /\$([^$]+)\$/g;
          const inlineParts = part.split(inlineMathRegex);

          inlineParts.forEach((inlinePart, inlineIdx) => {
            if (inlineIdx % 2 === 1) {
              segments.push({ type: 'math', content: inlinePart.trim() });
            } else if (inlinePart.trim()) {
              segments.push({ type: 'text', content: inlinePart });
            }
          });
        }
      });

      // Add rubric if exists after this segment
      const rubric = rubrics.find(r => r.index === idx);
      if (rubric) {
        segments.push({ type: 'rubric', content: rubric.content });
      }
    });

    return segments;
  };

  // Split text into logical steps (sentences or calculations)
  const getSteps = (text: string) => {
    // Split by sentences but keep LaTeX blocks together
    const steps: string[] = [];
    let currentStep = '';
    let inMath = false;
    let mathDepth = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      // Track math mode
      if (char === '$') {
        if (nextChar === '$') {
          mathDepth = mathDepth === 0 ? 2 : 0;
          inMath = mathDepth > 0;
          currentStep += char + nextChar;
          i++;
          continue;
        } else {
          mathDepth = mathDepth === 0 ? 1 : 0;
          inMath = mathDepth > 0;
        }
      }

      currentStep += char;

      // End step on period, but not if in math or in abbreviation
      if (char === '.' && !inMath && nextChar === ' ' && text[i - 1] !== 'x') {
        steps.push(currentStep.trim());
        currentStep = '';
        i++; // Skip the space
      }
    }

    if (currentStep.trim()) {
      steps.push(currentStep.trim());
    }

    return steps.filter(s => s.length > 0);
  };

  const cercSections = [
    {
      id: 'claim',
      title: 'Claim',
      subtitle: 'The conclusion statement',
      content: claim,
      icon: Target,
      color: {
        border: 'border-accent-500/60',
        bg: 'bg-gradient-to-br from-accent-500/10 to-accent-600/5',
        iconBg: 'bg-accent-500/20',
        iconColor: 'text-accent-300',
        textPrimary: 'text-accent-100',
        textSecondary: 'text-accent-300',
        glow: 'shadow-accent-500/20',
      },
    },
    {
      id: 'evidence',
      title: 'Evidence',
      subtitle: 'Mathematical calculations & data',
      content: evidence,
      icon: Database,
      color: {
        border: 'border-blue-500/60',
        bg: 'bg-gradient-to-br from-blue-500/10 to-blue-600/5',
        iconBg: 'bg-blue-500/20',
        iconColor: 'text-blue-300',
        textPrimary: 'text-blue-100',
        textSecondary: 'text-blue-300',
        glow: 'shadow-blue-500/20',
      },
    },
    {
      id: 'reasoning',
      title: 'Reasoning',
      subtitle: 'Theorem connection & logical bridge',
      content: reasoning,
      icon: Brain,
      color: {
        border: 'border-purple-500/60',
        bg: 'bg-gradient-to-br from-purple-500/10 to-purple-600/5',
        iconBg: 'bg-purple-500/20',
        iconColor: 'text-purple-300',
        textPrimary: 'text-purple-100',
        textSecondary: 'text-purple-300',
        glow: 'shadow-purple-500/20',
      },
    },
    {
      id: 'conditions',
      title: 'Conditions',
      subtitle: 'Hypothesis verification',
      content: conditions,
      icon: ShieldCheck,
      color: {
        border: 'border-green-500/60',
        bg: 'bg-gradient-to-br from-green-500/10 to-green-600/5',
        iconBg: 'bg-green-500/20',
        iconColor: 'text-green-300',
        textPrimary: 'text-green-100',
        textSecondary: 'text-green-300',
        glow: 'shadow-green-500/20',
      },
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 pb-6 border-b border-primary-700/50"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 rounded-full">
          <CheckCircle className="w-5 h-5 text-yellow-300" />
          <span className="text-lg font-bold text-yellow-300">Complete CERC Solution</span>
        </div>
        <p className="text-sm text-primary-400 max-w-2xl mx-auto">
          AP Exam-quality justification with step-by-step breakdown. Each CERC component is color-coded for clarity.
        </p>
      </motion.div>

      {/* CERC Sections */}
      <div className="space-y-8">
        {cercSections.map((section, sectionIdx) => {
          const Icon = section.icon;
          const steps = getSteps(section.content);

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: sectionIdx * 0.15 }}
              className={`relative border-2 ${section.color.border} ${section.color.bg} rounded-2xl overflow-hidden shadow-2xl ${section.color.glow}`}
            >
              {/* Section Header */}
              <div className="flex items-center gap-4 p-6 border-b border-primary-700/30">
                <div className={`flex-shrink-0 w-14 h-14 ${section.color.iconBg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${section.color.iconColor}`} />
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${section.color.textSecondary}`}>
                    {section.title}
                  </h3>
                  <p className="text-sm text-primary-400">{section.subtitle}</p>
                </div>
                <div className="ml-auto">
                  <span className="px-3 py-1 bg-primary-800/50 border border-primary-700/50 rounded-full text-xs font-mono text-primary-300">
                    Step {sectionIdx + 1}/4
                  </span>
                </div>
              </div>

              {/* Content - Step by Step */}
              <div className="p-8 space-y-6">
                {steps.map((step, stepIdx) => {
                  const segments = parseContentWithSteps(step);

                  return (
                    <motion.div
                      key={stepIdx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: sectionIdx * 0.15 + stepIdx * 0.1 }}
                      className="flex gap-4"
                    >
                      {/* Step number */}
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full ${section.color.iconBg} border-2 ${section.color.border} flex items-center justify-center`}>
                          <span className={`text-sm font-bold ${section.color.iconColor}`}>
                            {stepIdx + 1}
                          </span>
                        </div>
                      </div>

                      {/* Step content */}
                      <div className="flex-1 space-y-4">
                        <div className={`text-base leading-relaxed ${section.color.textPrimary}`}>
                          {segments.map((segment, segIdx) => {
                            if (segment.type === 'math') {
                              // Check if it's a long expression (block math)
                              const isBlockMath = segment.content.length > 30 || segment.content.includes('=');

                              if (isBlockMath) {
                                return (
                                  <div
                                    key={segIdx}
                                    className="my-6 p-6 bg-primary-900/60 border-2 border-primary-700/40 rounded-xl overflow-x-auto"
                                  >
                                    <BlockMath math={segment.content} />
                                  </div>
                                );
                              } else {
                                return (
                                  <span
                                    key={segIdx}
                                    className="inline-flex items-center px-2 py-1 bg-primary-800/50 border border-primary-700/50 rounded mx-1"
                                  >
                                    <InlineMath math={segment.content} />
                                  </span>
                                );
                              }
                            } else if (segment.type === 'rubric') {
                              return (
                                <div
                                  key={segIdx}
                                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                                >
                                  <CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                                  <span className="text-xs text-yellow-300 font-medium">
                                    AP Rubric: {segment.content}
                                  </span>
                                </div>
                              );
                            } else {
                              // Regular text
                              return (
                                <span key={segIdx} className="text-primary-100">
                                  {segment.content}
                                </span>
                              );
                            }
                          })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Section footer with decorative element */}
              <div className={`h-1 ${section.color.bg} opacity-50`}></div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center p-6 bg-primary-900/30 border border-primary-700/30 rounded-xl"
      >
        <p className="text-sm text-primary-400">
          <span className="font-semibold text-primary-300">Study Strategy:</span> Focus on the logical flow between sections.
          Notice how <span className="text-blue-300">Evidence</span> supports the <span className="text-accent-300">Claim</span>,
          <span className="text-purple-300"> Reasoning</span> connects them via theorems, and <span className="text-green-300">Conditions</span> verify all hypotheses.
        </p>
      </motion.div>
    </div>
  );
}
