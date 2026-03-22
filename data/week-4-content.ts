/**
 * Week 4: AP Exam Simulation
 * Focus: Individual timed FRQ under exam conditions
 * Structure: Single long-form FRQ, 25-30 minutes, individual work only
 */

export interface APExamSimulation {
  id: string;
  title: string;
  course: "calculus-ab" | "calculus-bc" | "statistics";
  difficulty: "exam-level";
  timeLimit: number; // minutes
  problemStatement: string;
  parts: {
    partA: string;
    partB: string;
    partC: string;
    partD?: string; // Optional fourth part
  };
  scoringRubric: {
    partA: string[];
    partB: string[];
    partC: string[];
    partD?: string[];
  };
  correctCERCResponse: {
    claim: string;
    evidence: string;
    reasoning: string;
    conditions: string;
  };
  theoremInfo: {
    name: string;
    statement: string;
    hypotheses: string[];
  };
  hints: {
    setup: string[];
    calculation: string[];
    justification: string[];
  };
}

export const apExamSimulations: APExamSimulation[] = [
  // CALCULUS AB EXAM SIMULATION
  {
    id: "exam-ab-related-rates",
    course: "calculus-ab",
    difficulty: "exam-level",
    title: "Related Rates with Optimization",
    timeLimit: 25,
    problemStatement: `A water tank has the shape of an inverted circular cone with base radius 2 meters and height 4 meters. Water is being pumped into the tank at a rate of 2 cubic meters per minute.

**Given:**
- Base radius: $r = 2$ meters
- Height: $h = 4$ meters
- Volume of cone: $V = \\frac{1}{3}\\pi r^2 h$
- Water flows in at: $\\frac{dV}{dt} = 2$ cubic meters per minute`,
    parts: {
      partA: "Find the rate at which the water level is rising when the water is 2 meters deep. Show all work and include units.",
      partB: "Use the Mean Value Theorem to prove that there exists a time when the instantaneous rate of height change equals the average rate over the first 5 minutes. Verify all conditions.",
      partC: "At what depth is the water rising most slowly? Justify your answer using calculus and verify that your answer represents a minimum rate."
    },
    scoringRubric: {
      partA: [
        "Sets up relationship between V and h using similar triangles: r/h = 2/4 = 1/2",
        "Expresses V in terms of h only: V = (1/3)π(h/2)²h = πh³/12",
        "Differentiates implicitly: dV/dt = (πh²/4)(dh/dt)",
        "Solves for dh/dt when h=2: 2 = (π·4/4)(dh/dt) → dh/dt = 2/π ≈ 0.637 m/min"
      ],
      partB: [
        "States MVT: If f is continuous on [a,b] and differentiable on (a,b), then ∃c such that f'(c) = [f(b)-f(a)]/(b-a)",
        "Verifies continuity: h(t) is continuous because volume accumulates continuously",
        "Verifies differentiability: h(t) is differentiable because dh/dt exists for all depths",
        "Calculates average rate over 5 minutes and concludes MVT applies"
      ],
      partC: [
        "Sets up rate equation: dh/dt = 8/(πh²)",
        "Takes derivative: d²h/dt² to analyze rate of change of rate",
        "Identifies that dh/dt is minimized as h increases (inverse square relationship)",
        "Concludes slowest rate occurs at maximum depth (h=4m) with justification"
      ]
    },
    correctCERCResponse: {
      claim: "By the Mean Value Theorem, there exists a time c in (0,5) minutes at which the instantaneous rate of water height change equals the average rate of height change over the interval [0,5]. Additionally, the water rises most slowly at the maximum depth of 4 meters.",
      evidence: "Part A: When h=2m, dh/dt = 2/π ≈ 0.637 m/min. Part B: Average rate = [h(5)-h(0)]/5 where h(0)=0. Using V=2t and V=πh³/12, we get h(t)=(24t/π)^(1/3). At t=5, h≈2.88m, so average = 2.88/5 ≈ 0.576 m/min. Part C: Rate equation dh/dt = 8/(πh²) shows rate decreases as h increases.",
      reasoning: "MVT requires continuity and differentiability of h(t). Since water accumulates continuously at constant rate, h(t) is both continuous and differentiable on any finite interval. Therefore MVT guarantees a time c where instantaneous rate equals average rate. For Part C, the rate dh/dt = 8/(πh²) is an inverse square function, meaning rate decreases as depth increases, making h=4m the point of slowest rise.",
      conditions: "Continuity: h(t) is continuous because volume V(t)=2t is continuous, and h(t)=(24t/π)^(1/3) is a continuous function of t. Differentiability: h(t) is differentiable for all t>0 because dh/dt = 8/(πh²) exists whenever h>0. Since both conditions hold on [0,5], MVT applies."
    },
    theoremInfo: {
      name: "Mean Value Theorem",
      statement: "If f is continuous on [a,b] and differentiable on (a,b), then there exists at least one c in (a,b) such that f'(c) = [f(b)-f(a)]/(b-a).",
      hypotheses: [
        "f must be continuous on the closed interval [a,b]",
        "f must be differentiable on the open interval (a,b)"
      ]
    },
    hints: {
      setup: [
        "Use similar triangles to relate r and h: r/h = 1/2",
        "Express volume V in terms of h only before differentiating",
        "Remember: dV/dt is given as constant 2 m³/min"
      ],
      calculation: [
        "For Part A: Use implicit differentiation with respect to time",
        "For Part B: Find h(t) by solving V=2t with V=πh³/12",
        "For Part C: Analyze how dh/dt changes as h changes"
      ],
      justification: [
        "Always verify MVT conditions explicitly",
        "Include units in all rate calculations",
        "Use calculus (derivatives) to justify 'slowest' claim in Part C"
      ]
    }
  },

  // CALCULUS BC EXAM SIMULATION
  {
    id: "exam-bc-polar-parametric",
    course: "calculus-bc",
    difficulty: "exam-level",
    title: "Polar Curves and Arc Length",
    timeLimit: 30,
    problemStatement: `Consider the polar curve $r = 2 + 2\\cos\\theta$ for $0 \\le \\theta \\le 2\\pi$ (a cardioid).

**Given:**
- Polar curve: $r = 2 + 2\\cos\\theta$
- Area in polar: $A = \\frac{1}{2}\\int_{\\alpha}^{\\beta} r^2 \\, d\\theta$
- Arc length in polar: $L = \\int_{\\alpha}^{\\beta} \\sqrt{r^2 + \\left(\\frac{dr}{d\\theta}\\right)^2} \\, d\\theta$`,
    parts: {
      partA: "Find the total area enclosed by the cardioid. Show all work and verify the curve is traced exactly once on [0, 2π].",
      partB: "Prove using the Mean Value Theorem that there exists an angle θ = c where the instantaneous radius r(c) equals the average radius over [0, 2π]. Verify all conditions.",
      partC: "Set up (do not evaluate) the integral for the arc length of the cardioid. Verify that the integrand is continuous on [0, 2π].",
      partD: "At what angle(s) θ is the curve farthest from the origin? Justify using calculus."
    },
    scoringRubric: {
      partA: [
        "Sets up integral: A = (1/2)∫₀^(2π) (2+2cosθ)² dθ",
        "Expands: (2+2cosθ)² = 4 + 8cosθ + 4cos²θ",
        "Uses identity: cos²θ = (1+cos2θ)/2",
        "Evaluates correctly: A = 6π square units"
      ],
      partB: [
        "States MVT for integrals or regular MVT",
        "Verifies r(θ) = 2+2cosθ is continuous on [0,2π]",
        "Calculates average: r_avg = (1/2π)∫₀^(2π) (2+2cosθ)dθ = 2",
        "Concludes ∃c where r(c) = 2, which occurs at θ = π/2 and 3π/2"
      ],
      partC: [
        "Finds dr/dθ = -2sinθ",
        "Sets up: L = ∫₀^(2π) √[(2+2cosθ)² + (-2sinθ)²] dθ",
        "Simplifies: √[4+8cosθ+4cos²θ+4sin²θ] = √[8+8cosθ] = 2√[2(1+cosθ)]",
        "Verifies integrand is continuous except possibly where 1+cosθ=0 (at θ=π)"
      ],
      partD: [
        "Takes derivative: dr/dθ = -2sinθ",
        "Sets equal to zero: -2sinθ = 0 → θ = 0, π, 2π",
        "Evaluates r at critical points: r(0)=4, r(π)=0, r(2π)=4",
        "Concludes maximum distance is 4 at θ=0 and θ=2π"
      ]
    },
    correctCERCResponse: {
      claim: "The total area enclosed by the cardioid is 6π square units. By the Mean Value Theorem, there exists an angle c in (0,2π) where r(c) equals the average radius of 2. The curve is farthest from the origin at θ=0 and θ=2π, where r=4.",
      evidence: "Part A: A = (1/2)∫₀^(2π) (4+8cosθ+4cos²θ)dθ = (1/2)[4θ+8sinθ+2θ+sin2θ]₀^(2π) = (1/2)(12π) = 6π. Part B: Average radius = (1/2π)∫₀^(2π)(2+2cosθ)dθ = (1/2π)[2θ+2sinθ]₀^(2π) = 2. Part D: Critical points at θ=0,π,2π give r=4,0,4 respectively.",
      reasoning: "For Part A, the area formula for polar curves integrates (1/2)r² over one complete trace. For Part B, MVT for integrals states that a continuous function attains its average value at some point in the interval. For Part D, the maximum distance from origin occurs at critical points of r(θ), found by setting dr/dθ=0.",
      conditions: "MVT conditions: r(θ)=2+2cosθ is continuous on [0,2π] because cosine is continuous everywhere. For arc length (Part C), the integrand √[r²+(dr/dθ)²] = 2√[2(1+cosθ)] is continuous on [0,2π] except at θ=π where 1+cosθ=0, creating a cusp (the integrand approaches 0, making the integral convergent but the curve non-smooth at that point)."
    },
    theoremInfo: {
      name: "Mean Value Theorem (for functions and integrals)",
      statement: "If f is continuous on [a,b] and differentiable on (a,b), then ∃c such that f'(c)=[f(b)-f(a)]/(b-a). Equivalently, for continuous f, ∃c where f(c) equals the average value of f over [a,b].",
      hypotheses: [
        "For regular MVT: continuity on [a,b] and differentiability on (a,b)",
        "For MVT for integrals: continuity on [a,b] only"
      ]
    },
    hints: {
      setup: [
        "Verify the curve completes one full loop by checking r(0) and r(2π)",
        "Use trig identities: cos²θ = (1+cos2θ)/2",
        "For arc length, simplify the radical before setting up the integral"
      ],
      calculation: [
        "For Part A: Expand (2+2cosθ)² before integrating",
        "For Part B: Average value = (1/length)∫ f(θ)dθ",
        "For Part D: Check endpoints and critical points"
      ],
      justification: [
        "Always verify MVT conditions with explicit statements",
        "Address the cusp at θ=π in Part C",
        "Use second derivative test or endpoint analysis for Part D"
      ]
    }
  },

  // STATISTICS EXAM SIMULATION
  {
    id: "exam-stats-study-design",
    course: "statistics",
    difficulty: "exam-level",
    title: "Study Design Critique and Inference",
    timeLimit: 25,
    problemStatement: `A researcher investigates whether a new teaching method improves test scores. She selects 100 students and randomly assigns 50 to the new method (treatment) and 50 to traditional method (control).

**Results:**
- Treatment group: mean = 78, standard deviation = 12
- Control group: mean = 72, standard deviation = 15
- Both groups' scores appear approximately normal

**Significance level:** α = 0.05`,
    parts: {
      partA: "Identify the appropriate inference procedure and verify ALL conditions for this test. Be explicit about each condition.",
      partB: "Conduct the hypothesis test. State hypotheses, calculate the test statistic, determine the p-value, and state your conclusion in context. Can you conclude the new method CAUSES higher scores?",
      partC: "The researcher later discovers that students in the treatment group had access to additional tutoring resources that the control group did not. How does this affect your conclusion from Part B? Explain the impact on causation."
    },
    scoringRubric: {
      partA: [
        "Identifies: Two-sample t-test for means",
        "Condition 1: Random assignment (stated in problem) ✓",
        "Condition 2: Independence - samples are independent, both n<10% of all students ✓",
        "Condition 3: Normality - both groups appear approximately normal (stated) ✓"
      ],
      partB: [
        "States hypotheses: H₀: μ_treatment = μ_control vs Hₐ: μ_treatment > μ_control",
        "Calculates pooled standard error or uses separate variances",
        "Finds test statistic: t ≈ 2.14 with appropriate df",
        "Determines p-value ≈ 0.017 < 0.05",
        "Conclusion: Reject H₀; evidence that new method causes higher scores (because random assignment)"
      ],
      partC: [
        "Identifies confounding variable: additional tutoring",
        "Explains impact: Treatment and control groups no longer equivalent",
        "Revised conclusion: Cannot conclude causation - confounding present",
        "Suggests improved design: Control access to tutoring in both groups"
      ]
    },
    correctCERCResponse: {
      claim: "Based on the original data with random assignment, there is convincing statistical evidence that the new teaching method causes higher test scores (p=0.017<0.05). However, the discovery of unequal tutoring access invalidates this causal conclusion.",
      evidence: "Two-sample t-test: H₀: μ₁=μ₂ vs Hₐ: μ₁>μ₂. Using x̄₁=78, s₁=12, n₁=50 and x̄₂=72, s₂=15, n₂=50. Standard error = √(144/50 + 225/50) = √7.38 ≈ 2.72. Test statistic: t = (78-72)/2.72 ≈ 2.21. With df≈98, p-value ≈ 0.015. Since 0.015<0.05, we reject H₀.",
      reasoning: "A two-sample t-test compares means from two independent groups. The p-value represents the probability of observing this difference (or more extreme) if the null hypothesis were true. Because random assignment was used, we can initially conclude causation. However, the confounding variable (tutoring access) compromises the study design. Random assignment alone does not guarantee equivalent groups if an uncontrolled variable differs between them.",
      conditions: "Part A conditions: (1) Random assignment ✓ allows causal inference if properly controlled. (2) Independence ✓: samples are independent groups, each n<10% of population. (3) Normality ✓: stated that distributions appear approximately normal. Part C revision: The tutoring access confounder violates the assumption that random assignment created equivalent groups. This confounding variable may explain part or all of the observed difference, making causation uncertain."
    },
    theoremInfo: {
      name: "Two-Sample t-Test for Means",
      statement: "A two-sample t-test compares the means of two independent groups to determine if there is statistical evidence of a difference.",
      hypotheses: [
        "Random sampling or random assignment",
        "Independence: both within groups and between groups, each n<10% of population",
        "Normality: approximately normal distributions (or large samples n≥30)"
      ]
    },
    hints: {
      setup: [
        "Random assignment makes this an experiment (not observational)",
        "Identify which conditions allow causal conclusions",
        "Note: equal vs unequal variances affects SE calculation"
      ],
      calculation: [
        "Use formula: SE = √(s₁²/n₁ + s₂²/n₂)",
        "Test statistic: t = (x̄₁-x̄₂)/SE",
        "Use t-distribution with appropriate degrees of freedom"
      ],
      justification: [
        "Part B: Link random assignment to causation explicitly",
        "Part C: Explain mechanism of confounding",
        "Part C: Propose how to improve the study design"
      ]
    }
  }
];

export const week4Config = {
  weekNumber: 4,
  title: "AP Exam Simulation",
  focus: "Individual timed FRQ under exam conditions - no scaffolding, real test pressure",
  scaffoldingLevel: "none" as const,
  description: `This is it. Week 4. The AP Exam Simulation.

**What to Expect:**

You will face ONE long-form FRQ modeled after actual AP exam questions. This is individual work under timed conditions—just like the real AP exam in May.

**Time Limit:** 25-30 minutes (varies by course)

**No Scaffolding:** No sentence frames, no structural outlines, no hints until after time expires. Just you, the problem, and everything you've learned in Weeks 1-3.

**Scoring:** Your response will be scored using the official AP rubric. Every point matters.

**Skills Tested:**
- Theorem verification (Week 1)
- Rigorous condition checking (Week 2)
- Multi-concept synthesis (Week 3)
- Working under time pressure (Week 4)

**This IS the exam.** The only difference is you'll see it 3 weeks early. Use this to identify gaps, practice time management, and build confidence.

Beat this simulation, and you're ready for the real thing in May.`,
  objectives: [
    "Complete a full AP-style FRQ individually under timed conditions",
    "Synthesize ALL justification skills from Weeks 1-3 without scaffolding",
    "Demonstrate theorem verification, condition checking, and rigorous reasoning",
    "Work effectively under exam time pressure (25-30 minutes)"
  ],
  estimatedTime: "25-30 minutes (TIMED - individual work only)",
  apExamSimulations: apExamSimulations,
};
