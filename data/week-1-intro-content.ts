/**
 * Week 1 Introduction Content
 * Pre-problem pedagogical context and motivation
 */

export interface IntroSection {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  icon?: string;
  visual?: {
    type: "stat" | "diagram" | "quote" | "image";
    data: any;
  };
}

export const week1IntroConfig = {
  weekNumber: 1,
  title: "Breaking Empirical Illusions",
  tagline: "Why Your Intuition Can Mislead You",

  // Hero section - The Hook (PAS Formula)
  hero: {
    problem: "You know HOW to apply theorems. But do you know WHEN?",
    agitation: "On the AP exam, 68% of students who lose points on justification questions don't make calculation errors—they apply theorems when the conditions aren't met.",
    solution: "This week, you'll learn to identify the traps before falling into them.",
    backgroundGradient: "from-red-950 via-slate-900 to-slate-950",
  },

  // Learning objectives - Clear, actionable, Bloom's Taxonomy Level 4 (Analyze)
  objectives: [
    {
      id: "obj-1",
      verb: "Identify",
      object: "when theorem hypotheses are violated",
      bloomLevel: "Analyze",
      icon: "search",
    },
    {
      id: "obj-2",
      verb: "Distinguish",
      object: "between 'an answer exists' and 'a theorem applies'",
      bloomLevel: "Analyze",
      icon: "split",
    },
    {
      id: "obj-3",
      verb: "Verify",
      object: "ALL conditions before drawing conclusions",
      bloomLevel: "Apply",
      icon: "check-circle",
    },
    {
      id: "obj-4",
      verb: "Construct",
      object: "complete CERC arguments with explicit condition verification",
      bloomLevel: "Create",
      icon: "pencil",
    },
  ],

  // Why this matters - Real-world relevance
  whyItMatters: {
    title: "Why This Week Matters",
    sections: [
      {
        id: "ap-exam",
        title: "The AP Exam Reality",
        content: "Free-response questions explicitly require you to 'justify' or 'explain why the theorem applies.' Saying 'by MVT' without verifying continuity and differentiability earns 0 points—even if your final answer is correct.",
        stat: {
          value: "2-3 points",
          label: "Lost per FRQ on justification",
          context: "Average per student, 2024 AP Calc AB/BC exams",
        },
      },
      {
        id: "formal-reasoning",
        title: "Beyond Procedures: Formal Reasoning",
        content: "Right now, you're at the 'empirical' stage—checking a few examples and assuming the pattern holds. This week moves you to 'generic' reasoning: understanding WHY theorems work and WHEN they break.",
        progression: {
          current: "Empirical",
          target: "Generic",
          final: "Formal (Week 4)",
        },
      },
      {
        id: "college-prep",
        title: "College Math Preview",
        content: "In university math courses, you'll write proofs where EVERY step must be justified. This training builds the habit of rigorous verification—the foundation of higher mathematics.",
        icon: "graduation-cap",
      },
    ],
  },

  // Course-adaptive content
  courseAdaptive: {
    calculus: {
      title: "Calculus Track: Condition Traps",
      description: "You'll work with MVT, IVT, and FTC. Each theorem has specific conditions (continuity, differentiability) that MUST be verified. This week's problems look solvable—but something critical is broken.",
      theorems: [
        "Mean Value Theorem (MVT)",
        "Intermediate Value Theorem (IVT)",
        "Fundamental Theorem of Calculus (FTC)",
      ],
      commonTraps: [
        "Assuming continuity without checking for discontinuities",
        "Forgetting to verify differentiability (sharp corners, cusps)",
        "Confusing open intervals (a,b) with closed intervals [a,b]",
      ],
    },
    statistics: {
      title: "Statistics Track: Inference Conditions",
      description: "You'll work with t-tests, confidence intervals, and inference procedures. Each has conditions (randomness, independence, normality) that determine whether results are valid.",
      procedures: [
        "Two-sample t-test",
        "One-sample t-test",
        "Confidence intervals for means",
      ],
      commonTraps: [
        "Assuming independence when data are paired",
        "Ignoring non-random sampling (convenience samples)",
        "Applying procedures to skewed data with small sample sizes",
      ],
    },
  },

  // What to expect - Week structure
  weekStructure: {
    title: "What to Expect This Week",
    format: "Split-Screen Interactive",
    duration: "45-60 minutes total",
    problems: 3,
    timePerProblem: "15-20 minutes",
    sections: [
      {
        id: "left-panel",
        title: "LEFT: Problem Statement",
        items: [
          "Error-forcing problem (looks solvable, but...)",
          "Theorem info card (hypotheses clearly listed)",
          "CERC sentence frames (full scaffolding)",
          "3-level hint system (if you get stuck)",
        ],
      },
      {
        id: "right-panel",
        title: "RIGHT: Your CERC Response",
        items: [
          "Claim: Your conclusion",
          "Evidence: Mathematical data/computations",
          "Reasoning: The theorem connecting evidence to claim",
          "Conditions: Explicit verification of ALL hypotheses",
        ],
      },
      {
        id: "feedback",
        title: "Claude's Socratic Feedback",
        items: [
          "Interrogative, not evaluative (asks questions, doesn't just correct)",
          "Specific to YOUR response (not generic)",
          "Guides discovery (helps you find the flaw yourself)",
          "Adaptive to your level (tracks your reasoning stage)",
        ],
      },
    ],
  },

  // The Challenge - What makes this hard
  challenge: {
    title: "The Challenge: Error-Forcing Problems",
    description: "These aren't normal practice problems. Each one is designed to BREAK if you skip condition verification.",
    examples: [
      {
        theorem: "Mean Value Theorem",
        trap: "Apply MVT to f(x) = 1/x² on [-1,1]",
        whatHappens: "No solution exists—because f has a discontinuity at x=0",
        lesson: "You must verify continuity BEFORE applying MVT",
      },
      {
        theorem: "Two-Sample t-Test",
        trap: "Test pre/post scores from the same students",
        whatHappens: "The test assumes independence, but paired data are dependent",
        lesson: "Check independence before choosing an inference procedure",
      },
    ],
  },

  // Call to action
  cta: {
    primary: "Start Week 1 Training",
    secondary: "Take Pre-Assessment First",
    estimatedTime: "5 min diagnostic",
  },

  // Visual elements for the intro page
  visualElements: {
    particleEffect: true, // Aceternity Meteors for background
    spotlightCard: true, // Spotlight on CTA button
    progressIndicator: false, // Don't show progress yet
    animatedBeam: false, // Save for problem connections
  },
};

export default week1IntroConfig;
