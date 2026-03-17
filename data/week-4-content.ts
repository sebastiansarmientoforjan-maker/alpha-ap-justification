/**
 * Week 4: Boss Battle
 * Focus: Multi-phase collaborative challenge with timed curveball
 * Structure: Individual → Team → Curveball (15 min timed)
 */

export interface BossBattle {
  id: string;
  title: string;
  course: "calculus-ab" | "calculus-bc" | "statistics";
  difficulty: "epic";
  phases: {
    phase1: {
      title: string;
      description: string;
      task: string;
      timeEstimate: string;
    };
    phase2: {
      title: string;
      description: string;
      task: string;
      timeEstimate: string;
    };
    phase3: {
      title: string;
      description: string;
      curveball: string;
      task: string;
      timeLimit: number; // minutes
    };
  };
  problemStatement: string;
  dataProvided: Record<string, any>;
  correctResponse: {
    phase1Solution: string;
    phase2CERC: {
      claim: string;
      evidence: string;
      reasoning: string;
      conditions: string;
    };
    phase3AdaptedConclusion: string;
  };
  theoremInfo: {
    name: string;
    statement: string;
    hypotheses: string[];
  };
  hints: {
    phase1: string[];
    phase2: string[];
    phase3: string[];
  };
}

export const bossBattles: BossBattle[] = [
  // CALCULUS BOSS BATTLE
  {
    id: "boss-calculus-water-tank",
    course: "calculus-bc",
    difficulty: "epic",
    title: "The Water Tank Crisis",
    phases: {
      phase1: {
        title: "Phase 1: Untangle the Evidence",
        description: "A cylindrical water tank is being filled and drained simultaneously. Your first task: decode the complex rate situation.",
        task: "Analyze the given rate functions and determine at what time(s) the instantaneous rate of water height change is at its maximum. Show all calculus work.",
        timeEstimate: "15 minutes (untimed)"
      },
      phase2: {
        title: "Phase 2: Construct the Team Argument",
        description: "Now collaborate as a team to build the complete CERC justification using the Mean Value Theorem.",
        task: "Set up an integral for total volume change from t=0 to t=10. Then use MVT to prove there exists a time when instantaneous rate equals average rate. Construct a complete CERC argument.",
        timeEstimate: "20 minutes (untimed)"
      },
      phase3: {
        title: "Phase 3: The Curveball",
        description: "ALERT: New information just arrived. The drain became clogged at t=7 minutes!",
        curveball: "At t = 7 minutes, the drain becomes completely clogged and R_out drops to ZERO. All water now flows IN with no drainage.",
        task: "Recalculate the average rate of height change from t=7 to t=10. Determine if the tank will overflow (given: initial height h(0)=2m, tank depth=8m, radius=3m). Adapt your conclusion under time pressure.",
        timeLimit: 15
      }
    },
    problemStatement: `A cylindrical water tank with radius 3 meters is being filled and drained simultaneously.

**Water flows IN** at a rate of:
$$R_{\\text{in}}(t) = 5 + 2\\sin\\left(\\frac{\\pi t}{6}\\right) \\text{ cubic meters per minute}$$

**Water flows OUT** at a rate of:
$$R_{\\text{out}}(t) = 3 + 0.5t \\text{ cubic meters per minute}$$

where $0 \\le t \\le 10$ minutes.

**Given:**
- Tank radius: $r = 3$ meters
- Initial water height: $h(0) = 2$ meters
- Maximum tank depth: $8$ meters
- Volume of water: $V = \\pi r^2 h$ (cylinder)`,
    dataProvided: {
      radius: 3,
      initialHeight: 2,
      maxDepth: 8,
      timeInterval: [0, 10]
    },
    correctResponse: {
      phase1Solution: "The net rate is R_net(t) = R_in(t) - R_out(t) = (5 + 2sin(πt/6)) - (3 + 0.5t) = 2 + 2sin(πt/6) - 0.5t. [AP Rubric: 1 point - Setting up net rate] To find maximum, take derivative: R_net'(t) = 2(π/6)cos(πt/6) - 0.5 = (π/3)cos(πt/6) - 0.5. Set equal to zero: (π/3)cos(πt/6) = 0.5, so cos(πt/6) = 1.5/π ≈ 0.477. Then πt/6 = arccos(0.477) ≈ 1.068 rad, giving t ≈ 2.04 minutes. [AP Rubric: 1 point - Finding critical point] To convert to height rate: dh/dt = R_net(t)/(πr²) = R_net(t)/(9π). Maximum height rate occurs at t ≈ 2.04 min. [AP Rubric: 1 point - Answering in correct context with units]",
      phase2CERC: {
        claim: "By the Mean Value Theorem for Integrals, there exists a time c in (0,10) at which the instantaneous net flow rate equals the average net flow rate over the interval. [AP Rubric: 1 point - Correct conclusion invoking theorem]",
        evidence: "Average rate = (1/10)∫₀¹⁰ R_net(t) dt. Compute: ∫₀¹⁰ [2 + 2sin(πt/6) - 0.5t] dt = [2t - 12(cos(πt/6))/(π) - 0.25t²]₀¹⁰ = 20 - 12cos(5π/3)/π - 25 - (-12/π) = -5 + 12(1-cos(5π/3))/π. Since cos(5π/3) = 0.5, this gives -5 + 12(0.5)/π ≈ -5 + 1.91 ≈ -3.09 m³. Average = -3.09/10 ≈ -0.309 m³/min. By MVT, ∃c such that R_net(c) = -0.309. [AP Rubric: 1 point - Correct integral setup and evaluation]",
        reasoning: "The MVT for integrals states that if f is continuous on [a,b], then there exists c in (a,b) such that f(c) equals the average value of f over [a,b]. Since R_net(t) is continuous (sum/difference of continuous trig and polynomial functions), MVT applies. [AP Rubric: 1 point - Connecting theorem to problem]",
        conditions: "Verifying MVT conditions: R_net(t) = 2 + 2sin(πt/6) - 0.5t is continuous on [0,10] because sine and polynomials are continuous everywhere. Therefore MVT for integrals applies, guaranteeing such a c exists. [AP Rubric: 1 point - Explicitly verifying hypothesis]"
      },
      phase3AdaptedConclusion: "With the clogged drain at t=7, only R_in flows for t∈[7,10]. Volume added = ∫₇¹⁰ (5+2sin(πt/6))dt ≈ 15.3 m³. [AP Rubric: 1 point - Adapting calculation to new constraint] Height increase = 15.3/(9π) ≈ 0.54 m. New height = 2 + (height change from 0 to 7) + 0.54. We need to calculate height at t=7 first. If h(7) was already near the limit, adding 0.54m could cause overflow. [AP Rubric: 1 point - Logical reasoning with changed conditions] CONCLUSION: We must check if h(7) + 0.54 > 8. If so, the tank WILL overflow. [AP Rubric: 1 point - Clear conclusion addressing the question]"
    },
    theoremInfo: {
      name: "Mean Value Theorem for Integrals",
      statement: "If f is continuous on [a,b], then there exists c in (a,b) such that f(c) = (1/(b-a))∫[a to b] f(x)dx. The function attains its average value at some point in the interval.",
      hypotheses: [
        "f must be continuous on [a,b]",
        "The interval [a,b] must be finite"
      ]
    },
    hints: {
      phase1: [
        "The net rate is R_in(t) - R_out(t). Find its derivative and set to zero.",
        "Don't forget to verify it's a maximum (check second derivative or endpoints).",
        "Convert volume rate to height rate using dh/dt = (dV/dt)/(πr²)."
      ],
      phase2: [
        "Set up the integral ∫₀¹⁰ [R_in(t) - R_out(t)] dt for total net volume change.",
        "MVT for integrals says the continuous function attains its average value somewhere.",
        "Your Conditions section must verify R_net is continuous on [0,10]."
      ],
      phase3: [
        "From t=7 to t=10, only R_in flows (R_out = 0 due to clog).",
        "Calculate ∫₇¹⁰ R_in(t) dt to find volume added in those 3 minutes.",
        "Check if h(7) + Δh > 8 meters. If yes, overflow occurs."
      ]
    }
  },

  // STATISTICS BOSS BATTLE
  {
    id: "boss-statistics-drug-trial",
    course: "statistics",
    difficulty: "epic",
    title: "The Pharmaceutical Trial Dilemma",
    phases: {
      phase1: {
        title: "Phase 1: Untangle the Evidence",
        description: "A pharmaceutical company tests a new drug. Your first task: identify the correct statistical procedure and verify conditions.",
        task: "Examine the study design. Determine whether this is an experiment or observational study. Identify the appropriate inference procedure (one-sample? two-sample? paired?) and verify ALL conditions.",
        timeEstimate: "15 minutes (untimed)"
      },
      phase2: {
        title: "Phase 2: Construct the Team Argument",
        description: "Collaborate to conduct the hypothesis test and interpret results.",
        task: "State hypotheses, calculate test statistic, find p-value, and draw a conclusion in context. Can you conclude the drug is EFFECTIVE? Build a complete CERC argument addressing causation.",
        timeEstimate: "20 minutes (untimed)"
      },
      phase3: {
        title: "Phase 3: The Curveball",
        description: "ALERT: Post-study analysis reveals a confounding variable!",
        curveball: "A follow-up reveals that 15 patients in the drug group had prior treatment with a similar medication (were NOT treatment-naive). This was not disclosed initially.",
        task: "Does this confounding issue invalidate your original conclusion? Explain the impact on causation. Adapt your conclusion to address this new information under time pressure.",
        timeLimit: 15
      }
    },
    problemStatement: `A pharmaceutical company tests a new drug designed to reduce chronic pain. They recruit 120 patients with chronic pain and randomly assign them:

**Treatment Group (Drug):** 60 patients receive the new drug for 8 weeks
**Control Group (Placebo):** 60 patients receive a placebo for 8 weeks

**Results after 8 weeks:**
- Drug group: 45 out of 60 reported significant pain reduction
- Placebo group: 30 out of 60 reported significant pain reduction

**Given:**
- Random assignment was used
- All patients gave informed consent
- Significance level: α = 0.05`,
    dataProvided: {
      drugSuccess: 45,
      drugTotal: 60,
      placeboSuccess: 30,
      placeboTotal: 60,
      alpha: 0.05
    },
    correctResponse: {
      phase1Solution: "This is an EXPERIMENT because random assignment was used. [AP Rubric: 1 point - Identifying study design] The appropriate procedure is a TWO-SAMPLE Z-TEST FOR PROPORTIONS (not paired, since different patients). [AP Rubric: 1 point - Naming correct procedure] Conditions: (1) Random assignment ✓ (stated). (2) Independence: samples are independent (different patients), and 120 patients < 10% of all chronic pain patients ✓. (3) Success-failure: Drug: np₁=45≥10✓, n(1-p₁)=15≥10✓. Placebo: np₂=30≥10✓, n(1-p₂)=30≥10✓. All conditions satisfied. [AP Rubric: 1 point - Verifying all conditions with calculations]",
      phase2CERC: {
        claim: "We reject the null hypothesis. There is convincing statistical evidence at α=0.05 that the new drug CAUSES a higher proportion of patients to experience pain reduction compared to placebo. [AP Rubric: 1 point - Correct conclusion with causal language justified by experiment]",
        evidence: "H₀: p_drug = p_placebo (no difference). Hₐ: p_drug > p_placebo. Sample proportions: p̂₁ = 45/60 = 0.75, p̂₂ = 30/60 = 0.50. Pooled proportion: p̂ = (45+30)/(60+60) = 75/120 = 0.625. Test statistic: z = (0.75-0.50)/√(0.625·0.375/60 + 0.625·0.375/60) = 0.25/√(0.00781) = 0.25/0.0884 ≈ 2.83. P-value = P(Z > 2.83) ≈ 0.0023. Since 0.0023 < 0.05, reject H₀. [AP Rubric: 1 point - Correct test statistic and p-value]",
        reasoning: "A two-sample z-test compares proportions from two independent groups. The p-value represents the probability of observing a difference as extreme as ours (or more) if the null hypothesis were true. Since p-value < α, the data provide strong evidence against H₀. Because RANDOM ASSIGNMENT was used (experiment), we can conclude causation. [AP Rubric: 1 point - Linking random assignment to causal conclusion]",
        conditions: "Conditions verified in Phase 1: random assignment, independence, and success-failure all satisfied. Additionally, because this is an experiment (not observational), we can make causal claims about the drug's effectiveness. [AP Rubric: 1 point - Explaining why causation is justified]"
      },
      phase3AdaptedConclusion: "The confounding variable (prior treatment) DOES affect our conclusion about causation. [AP Rubric: 1 point - Recognizing impact of confounder] If 15/60 drug patients had prior similar treatment, they may have been predisposed to respond better regardless of the new drug. This introduces selection bias despite random assignment (the groups were not truly equivalent at baseline). [AP Rubric: 1 point - Explaining mechanism of confounding] ADAPTED CONCLUSION: While we still have evidence of a difference in proportions, we cannot confidently claim the drug CAUSED the improvement. The prior treatment is a confounding factor that may explain part or all of the observed effect. The study design is compromised. [AP Rubric: 1 point - Clear revised conclusion addressing validity]"
    },
    theoremInfo: {
      name: "Two-Sample Z-Test for Proportions",
      statement: "A two-sample z-test for proportions tests whether there is a significant difference between the proportions of success in two independent groups.",
      hypotheses: [
        "Random sampling or random assignment",
        "Independence: samples are independent, and each sample size < 10% of population",
        "Success-failure: np ≥ 10 and n(1-p) ≥ 10 for BOTH groups"
      ]
    },
    hints: {
      phase1: [
        "Random assignment makes this an experiment, not observational.",
        "Two independent groups (not paired) → two-sample procedure.",
        "Check success-failure for BOTH drug and placebo groups separately."
      ],
      phase2: [
        "Use pooled proportion for test statistic: p̂ = (x₁+x₂)/(n₁+n₂).",
        "Because this is an experiment with random assignment, you CAN use 'causes' in conclusion.",
        "Address the causation question explicitly in your reasoning."
      ],
      phase3: [
        "Confounding occurs when a third variable influences both treatment and outcome.",
        "Prior treatment creates an imbalance between groups DESPITE random assignment.",
        "Your adapted conclusion should explain why causation is now uncertain."
      ]
    }
  }
];

export const week4Config = {
  weekNumber: 4,
  title: "Boss Battle",
  focus: "Multi-phase collaborative challenge with timed curveball - AP exam simulation",
  scaffoldingLevel: "boss" as const,
  description: `This is it. The final week. Everything you've learned converges into ONE epic collaborative challenge.

**Three Phases:**

**Phase 1 - Individual: Untangle the Evidence**
Work alone to decode the complex problem setup. This tests your ability to identify the right approach and verify conditions.

**Phase 2 - Team: Construct the Argument**
Collaborate with your cohort to build a unified CERC justification. Pool your insights. Debate the approach. Learn from each other.

**Phase 3 - Curveball: Adapt Under Pressure**
Just when you think you've solved it, new information arrives. The problem changes. You have 15 MINUTES (timed) to adapt your conclusion.

**This simulates the AP exam:** unexpected constraints, time pressure, and the need to think critically under stress.

The Boss Battle is the ultimate test. Beat it, and you're ready for the AP exam.`,
  objectives: [
    "Synthesize ALL skills from Weeks 1-3 under challenging conditions",
    "Collaborate effectively to construct complex arguments",
    "Adapt mathematical reasoning when constraints change",
    "Perform under timed pressure (Phase 3: 15 minutes)",
  ],
  estimatedTime: "Phase 1: ~15 min | Phase 2: ~20 min | Phase 3: 15 min (TIMED)",
  bossBattles: bossBattles,
};
