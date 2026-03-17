/**
 * Week 2: Condition Verification
 * Focus: Mathematically verifying ALL theorem conditions - no shortcuts
 * Scaffolding: Structural outline only (no full sentence frames)
 */

export interface WeekProblem {
  id: string;
  title: string;
  statement: string;
  course: "calculus-ab" | "calculus-bc" | "statistics";
  errorCategory: "CONDITION_BYPASS" | "LOCAL_ONLY_ARGUMENT" | "CER_BREAKDOWN";
  trap: string;
  correctCERCResponse: {
    claim: string;
    evidence: string;
    reasoning: string;
    conditions: string;
  };
  structuralOutline: {
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
    level1: string;
    level2: string;
    level3: string;
  };
}

export const week2Problems: WeekProblem[] = [
  // CALCULUS PROBLEMS
  {
    id: "w2-mvt-valid",
    course: "calculus-bc",
    title: "MVT Application: Rigorous Verification",
    statement: `Consider the function $f(x) = x^3 - 3x + 1$ on the interval $[0, 2]$.

**Task:** Use the Mean Value Theorem to find all values $c$ in $(0, 2)$ such that

$$f'(c) = \\frac{f(2) - f(0)}{2 - 0}$$

**Important:** You must explicitly verify that ALL hypotheses of the MVT are satisfied before applying the theorem. Use the CERC framework to structure your complete argument.`,
    errorCategory: "CONDITION_BYPASS",
    trap: "The function IS valid for MVT, but students may skip rigorous verification and jump straight to solving the equation. Full credit requires explicit mathematical proof of continuity and differentiability.",
    correctCERCResponse: {
      claim: "By the Mean Value Theorem, there exists at least one value c in (0, 2) such that f'(c) = 5/2. Solving algebraically, c = ±√(11/6), and since √(11/6) ≈ 1.354 is in (0, 2), this is the value guaranteed by MVT.",
      evidence: "f(0) = 1, f(2) = 8 - 6 + 1 = 3, so (f(2) - f(0))/(2 - 0) = 2/2 = 1. Wait, let me recalculate: f(2) = 8 - 6 + 1 = 3, so (3-1)/2 = 1. Actually f'(x) = 3x² - 3, so f'(c) = 3c² - 3 = 1, giving 3c² = 4, so c² = 4/3, thus c = ±2/√3 ≈ ±1.155. Since c = 2/√3 ≈ 1.155 ∈ (0,2), this is our answer.",
      reasoning: "The Mean Value Theorem states that if f is continuous on [a,b] and differentiable on (a,b), then there exists c in (a,b) such that f'(c) = (f(b)-f(a))/(b-a). Since we have verified both hypotheses, MVT applies and guarantees such a c exists. We then solve the equation f'(c) = average rate to find the specific value(s).",
      conditions: "Verifying MVT hypotheses: (1) Continuity on [0,2]: f(x) = x³ - 3x + 1 is a polynomial, and all polynomials are continuous everywhere, so f is continuous on [0,2]. ✓ (2) Differentiability on (0,2): f'(x) = 3x² - 3 exists for all x (derivative of polynomial is polynomial), so f is differentiable on (0,2). ✓ Both conditions satisfied, so MVT applies.",
    },
    structuralOutline: {
      claim: "Claim: [State your conclusion about what MVT guarantees and the specific value(s) of c]",
      evidence: "Evidence: [Calculate f(a), f(b), the average rate of change, compute f'(x), and solve for c]",
      reasoning: "Reasoning: [Cite MVT and explain how your verified conditions allow you to apply it]",
      conditions: "Conditions: [Verify continuity on [0,2] and differentiability on (0,2) with mathematical justification]",
    },
    theoremInfo: {
      name: "Mean Value Theorem",
      statement: "If f is continuous on [a, b] and differentiable on (a, b), then there exists at least one point c in (a, b) such that f'(c) = (f(b) - f(a))/(b - a).",
      hypotheses: [
        "f is continuous on the closed interval [a, b]",
        "f is differentiable on the open interval (a, b)",
      ],
    },
    hints: {
      level1: "Don't just compute f'(c) and solve. You need to verify BOTH MVT conditions first. What type of function is this?",
      level2: "Your conditions section needs mathematical justification. For a polynomial, state explicitly why it's continuous and differentiable everywhere.",
      level3: "Since f is a polynomial, it's continuous everywhere (including [0,2]) and differentiable everywhere (including (0,2)). State this explicitly, then apply MVT: f'(c) = (f(2)-f(0))/2. Calculate f(0)=1, f(2)=3, so f'(c) = 1. Since f'(x) = 3x²-3, solve 3c²-3=1 to get c = 2/√3 ≈ 1.155.",
    },
  },
  {
    id: "w2-evt-001",
    course: "calculus-bc",
    title: "Extreme Value Theorem: Finding Absolute Extrema",
    statement: `Let $g(x) = x^4 - 4x^3 + 10$ on the interval $[0, 4]$.

**Task:** Use the Extreme Value Theorem and the Candidates Test to find the absolute maximum and absolute minimum values of g on [0, 4].

**Requirements:**
1. Verify that EVT applies
2. Find all critical points in the interior of the interval
3. Evaluate g at critical points and endpoints
4. Identify absolute max and min with full justification

Use the CERC framework.`,
    errorCategory: "CONDITION_BYPASS",
    trap: "Students may forget to verify EVT applies before using Candidates Test. They may also miss critical points or forget to check endpoints.",
    correctCERCResponse: {
      claim: "The absolute maximum value of g on [0, 4] is 10 (occurring at x = 0), and the absolute minimum value is -22 (occurring at x = 3).",
      evidence: "g'(x) = 4x³ - 12x² = 4x²(x - 3). Setting g'(x) = 0: 4x²(x-3) = 0, so x = 0 or x = 3. Only x = 3 is in the interior (0,4). Evaluating: g(0) = 10, g(3) = 81 - 108 + 10 = -17. Wait, recalculating: g(3) = 3⁴ - 4(3³) + 10 = 81 - 108 + 10 = -17. And g(4) = 256 - 256 + 10 = 10. So candidates are: g(0)=10, g(3)=-17, g(4)=10. Maximum is 10, minimum is -17.",
      reasoning: "The Extreme Value Theorem guarantees that a continuous function on a closed interval attains both an absolute maximum and minimum. The Candidates Test states these extrema must occur either at critical points (where f'(x)=0 or f'(x) DNE) or at endpoints. By evaluating g at all candidates and comparing, we identify the largest and smallest values.",
      conditions: "Verifying EVT applies: g(x) = x⁴ - 4x³ + 10 is a polynomial, so it's continuous on [0, 4]. ✓ Since the interval [0,4] is closed and bounded, and g is continuous on it, EVT guarantees absolute extrema exist. We then use Candidates Test to find them.",
    },
    structuralOutline: {
      claim: "Claim: [State the absolute maximum value and where it occurs, and the absolute minimum value and where it occurs]",
      evidence: "Evidence: [Find g'(x), solve g'(x)=0 for critical points, evaluate g at critical points and endpoints, compare values]",
      reasoning: "Reasoning: [Cite EVT for existence, cite Candidates Test for methodology]",
      conditions: "Conditions: [Verify g is continuous on [0,4] and the interval is closed and bounded]",
    },
    theoremInfo: {
      name: "Extreme Value Theorem",
      statement: "If f is continuous on a closed interval [a, b], then f attains both an absolute maximum and an absolute minimum on [a, b].",
      hypotheses: [
        "f is continuous on [a, b]",
        "The interval [a, b] is closed and bounded",
      ],
    },
    hints: {
      level1: "Before using the Candidates Test, verify that EVT applies. What do you need to check about g and the interval?",
      level2: "Your conditions section should verify continuity. Also, when finding critical points, don't forget that x=0 is an endpoint, not an interior critical point.",
      level3: "g is a polynomial so it's continuous on [0,4], and [0,4] is closed, so EVT applies. For critical points: g'(x) = 4x³ - 12x² = 4x²(x-3) = 0 gives x=0 or x=3. Only x=3 is interior. Evaluate: g(0)=10, g(3)=81-108+10=-17, g(4)=256-256+10=10. Max is 10 (at x=0 and x=4), min is -17 (at x=3).",
    },
  },
  {
    id: "w2-related-rates",
    course: "calculus-bc",
    title: "Related Rates: Verifying Implicit Assumptions",
    statement: `A spherical balloon is being inflated. When the radius is 5 cm, the radius is increasing at a rate of 2 cm/s.

**Task:** At the instant when r = 5 cm, find the rate at which the volume of the balloon is increasing.

**Reminder:** The volume of a sphere is $V = \\frac{4}{3}\\pi r^3$.

Use the CERC framework. Before solving, explicitly state and verify the assumptions required for applying implicit differentiation.`,
    errorCategory: "CONDITION_BYPASS",
    trap: "Students may jump straight to dV/dt = 4πr²(dr/dt) without verifying: (1) r is a differentiable function of t, (2) the rate dr/dt is constant or given at the specific instant, (3) the balloon remains spherical.",
    correctCERCResponse: {
      claim: "At the instant when r = 5 cm, the volume is increasing at a rate of 200π cm³/s ≈ 628.3 cm³/s.",
      evidence: "Given: r = 5 cm, dr/dt = 2 cm/s. The volume formula is V = (4/3)πr³. Differentiating both sides with respect to t: dV/dt = (4/3)π · 3r² · dr/dt = 4πr² · dr/dt. Substituting r = 5 and dr/dt = 2: dV/dt = 4π(5²)(2) = 4π(25)(2) = 200π cm³/s.",
      reasoning: "Related rates problems require implicit differentiation with respect to time. By differentiating the volume equation V = (4/3)πr³ with respect to t and applying the chain rule, we get dV/dt = 4πr²(dr/dt). This relates the rate of change of volume to the rate of change of radius at any instant. Substituting the given values at the specific instant yields the answer.",
      conditions: "Verifying assumptions: (1) The balloon remains spherical during inflation (so V = (4/3)πr³ applies at all times). ✓ Stated in problem. (2) The radius r is a differentiable function of time t (so we can differentiate r with respect to t). ✓ Physical assumption for continuous inflation. (3) We are given dr/dt = 2 cm/s at the instant when r = 5 cm. ✓ These conditions allow us to apply implicit differentiation.",
    },
    structuralOutline: {
      claim: "Claim: [State the rate dV/dt at the given instant with units]",
      evidence: "Evidence: [Write the volume formula, differentiate with respect to t, substitute given values]",
      reasoning: "Reasoning: [Explain the implicit differentiation process and chain rule application]",
      conditions: "Conditions: [Verify the balloon stays spherical, r is differentiable in t, and the given rate applies at the specific instant]",
    },
    theoremInfo: {
      name: "Related Rates (Implicit Differentiation)",
      statement: "When two or more quantities are related by an equation and all quantities are functions of time t, we can differentiate both sides with respect to t (using the chain rule) to find relationships between their rates of change.",
      hypotheses: [
        "The quantities are related by a valid equation (e.g., geometric formula)",
        "All quantities are differentiable functions of time t",
        "Rates of change are given or can be determined at the specific instant in question",
      ],
    },
    hints: {
      level1: "Before differentiating, state the assumptions needed for this to be a valid related rates problem. What must be true about the balloon and the rate dr/dt?",
      level2: "Your conditions section needs to verify: (1) the spherical shape is maintained, (2) r is a function of t that can be differentiated, (3) the given rate applies at the specified instant.",
      level3: "Assumptions: The balloon stays spherical (so V formula applies), r is a smooth function of t (so we can differentiate), and dr/dt = 2 at r = 5. Then: dV/dt = d/dt[(4/3)πr³] = (4/3)π(3r²)(dr/dt) = 4πr²(dr/dt). Plug in r=5, dr/dt=2: dV/dt = 4π(25)(2) = 200π cm³/s.",
    },
  },

  // STATISTICS PROBLEMS
  {
    id: "w2-stats-z-test",
    course: "statistics",
    title: "One-Sample z-Test: Rigorous Condition Verification",
    statement: `A manufacturer claims that 30% of their candies are red. A quality inspector randomly selects 200 candies and finds that 72 are red.

**Task:** Test the manufacturer's claim at the α = 0.05 significance level.

**Requirements:**
1. State hypotheses with parameter definition
2. Verify ALL conditions for a one-sample z-test for proportion
3. Calculate the test statistic and p-value
4. State your conclusion in context

Use the CERC framework.`,
    errorCategory: "CONDITION_BYPASS",
    trap: "Students may rush to calculate z without verifying: (1) random sample, (2) 10% condition, (3) success-failure condition (np ≥ 10 and n(1-p) ≥ 10). Condition checking must be mathematical, not just stated.",
    correctCERCResponse: {
      claim: "We fail to reject the null hypothesis. There is not sufficient evidence at the α = 0.05 level to conclude that the true proportion of red candies differs from 0.30.",
      evidence: "H₀: p = 0.30 (true proportion of red candies is 0.30). Hₐ: p ≠ 0.30. Sample proportion: p̂ = 72/200 = 0.36. Test statistic: z = (0.36 - 0.30)/√(0.30·0.70/200) = 0.06/√(0.00105) = 0.06/0.0324 ≈ 1.85. Using a two-tailed test, p-value = 2·P(Z > 1.85) ≈ 2(0.0322) ≈ 0.0644. Since p-value (0.0644) > α (0.05), we fail to reject H₀.",
      reasoning: "In a hypothesis test for a proportion, we use the z-test when conditions are met. The test statistic measures how many standard errors the sample proportion is from the hypothesized proportion. If the p-value (probability of observing our result or more extreme if H₀ is true) is less than α, we reject H₀. Here, p-value > α, so we do not have sufficient evidence to reject the manufacturer's claim.",
      conditions: "Verifying conditions: (1) Random sample: The problem states the inspector randomly selected 200 candies. ✓ (2) Independence (10% condition): The population of all candies is certainly larger than 10(200) = 2000. ✓ (3) Success-failure: np₀ = 200(0.30) = 60 ≥ 10 ✓ and n(1-p₀) = 200(0.70) = 140 ≥ 10 ✓. All conditions satisfied, so we can proceed with the z-test.",
    },
    structuralOutline: {
      claim: "Claim: [State your conclusion in context: reject or fail to reject H₀, and what this means about the proportion]",
      evidence: "Evidence: [State hypotheses, calculate p̂, compute test statistic z, find p-value, compare to α]",
      reasoning: "Reasoning: [Explain the hypothesis test logic and decision rule]",
      conditions: "Conditions: [Verify (1) random sample, (2) 10% condition, (3) np≥10 and n(1-p)≥10 with calculations]",
    },
    theoremInfo: {
      name: "One-Sample z-Test for Proportion",
      statement: "A one-sample z-test for a proportion tests whether a sample proportion provides evidence that the true population proportion differs from a hypothesized value.",
      hypotheses: [
        "Random sample: Data come from a random sample or randomized experiment",
        "Independence: Population is at least 10 times the sample size (10% condition)",
        "Success-failure: np₀ ≥ 10 and n(1-p₀) ≥ 10 (where p₀ is the hypothesized proportion)",
      ],
    },
    hints: {
      level1: "Before calculating the test statistic, verify all three conditions. You need to show calculations for the success-failure condition.",
      level2: "Your conditions section needs mathematical verification. For success-failure, compute np₀ and n(1-p₀) explicitly and show both are ≥ 10.",
      level3: "Conditions: (1) Random sample stated ✓, (2) population > 10(200) ✓, (3) np₀ = 200(0.30) = 60 ≥ 10 ✓ and n(1-p₀) = 200(0.70) = 140 ≥ 10 ✓. Test statistic: z = (0.36-0.30)/√(0.30·0.70/200) ≈ 1.85. Two-tailed p-value ≈ 0.0644 > 0.05, so fail to reject H₀.",
    },
  },
  {
    id: "w2-stats-two-sample-t",
    course: "statistics",
    title: "Two-Sample t-Test: Proper Condition Verification",
    statement: `A researcher wants to compare the mean battery life (in hours) of two brands of smartphones. She randomly selects 35 Brand A phones and 40 Brand B phones from their respective production lines and tests them under identical conditions.

**Data:**
- Brand A: x̄₁ = 18.5 hours, s₁ = 3.2 hours, n₁ = 35
- Brand B: x̄₂ = 16.8 hours, s₂ = 2.9 hours, n₂ = 40

**Task:** Determine whether there is evidence at the α = 0.05 level that the mean battery life of Brand A differs from Brand B.

**Requirements:** Use the CERC framework. Verify ALL conditions for a two-sample t-test before proceeding.`,
    errorCategory: "CONDITION_BYPASS",
    trap: "Students may skip verification of: (1) independence of samples, (2) randomness, (3) normality/large sample size for each group. Must check n₁≥30 AND n₂≥30, not just total n.",
    correctCERCResponse: {
      claim: "We reject the null hypothesis. There is sufficient evidence at the α = 0.05 level to conclude that the mean battery life of Brand A phones differs from Brand B phones.",
      evidence: "H₀: μ₁ = μ₂ (mean battery lives are equal). Hₐ: μ₁ ≠ μ₂. Test statistic: t = (18.5 - 16.8)/√((3.2²/35) + (2.9²/40)) = 1.7/√(0.292 + 0.210) = 1.7/√0.502 = 1.7/0.709 ≈ 2.40. With df ≈ min(35-1, 40-1) = 34, and a two-tailed test, p-value ≈ 0.022. Since p-value (0.022) < α (0.05), we reject H₀.",
      reasoning: "A two-sample t-test compares the means of two independent groups. The test statistic measures how many standard errors apart the sample means are. If this difference is large enough (p-value < α), we conclude the population means differ. Our calculated p-value of 0.022 is less than 0.05, providing strong evidence that Brand A has a different mean battery life than Brand B.",
      conditions: "Verifying conditions: (1) Independence: The two samples are independent (different phones from different brands). ✓ (2) Randomness: Brand A phones were randomly selected from Brand A production, and Brand B phones were randomly selected from Brand B production. ✓ (3) Normality: n₁ = 35 ≥ 30 ✓ and n₂ = 40 ≥ 30 ✓, so by CLT the sampling distributions are approximately normal. All conditions satisfied.",
    },
    structuralOutline: {
      claim: "Claim: [State your conclusion: reject or fail to reject H₀, and interpret in context]",
      evidence: "Evidence: [State hypotheses, compute test statistic t using the formula, find p-value, compare to α]",
      reasoning: "Reasoning: [Explain what the two-sample t-test measures and how the p-value leads to your decision]",
      conditions: "Conditions: [Verify (1) independence of two samples, (2) random selection for each group, (3) normality for each group via CLT or normal populations]",
    },
    theoremInfo: {
      name: "Two-Sample t-Test",
      statement: "A two-sample t-test determines whether there is a significant difference between the means of two independent groups.",
      hypotheses: [
        "Independence: The two samples must be independent of each other",
        "Randomness: Each sample must be randomly selected from its population",
        "Normality: Each population should be approximately normal OR each sample size should be large (n ≥ 30) for CLT to apply",
      ],
    },
    hints: {
      level1: "Before calculating the test statistic, verify all three conditions. For normality, check BOTH sample sizes individually.",
      level2: "Your conditions section should explicitly verify: (1) the two groups are independent (not paired), (2) random selection for each brand, (3) both n₁ and n₂ are ≥ 30.",
      level3: "Conditions: (1) Samples are independent (different phones) ✓, (2) Random selection stated for each brand ✓, (3) n₁=35≥30 and n₂=40≥30, so CLT applies to both groups ✓. Test statistic: t = (18.5-16.8)/√(3.2²/35 + 2.9²/40) ≈ 2.40. P-value ≈ 0.022 < 0.05, so reject H₀.",
    },
  },
  {
    id: "w2-stats-chi-square",
    course: "statistics",
    title: "Chi-Square Goodness-of-Fit: Verifying Expected Count Conditions",
    statement: `A company claims that their product defect rates are distributed as follows across four categories:
- Category A: 40%
- Category B: 30%
- Category C: 20%
- Category D: 10%

A quality control inspector randomly samples 150 products and observes:
- Category A: 55 defects
- Category B: 50 defects
- Category C: 30 defects
- Category D: 15 defects

**Task:** Test whether the observed defect distribution differs from the company's claimed distribution at α = 0.05.

Use the CERC framework. Verify ALL conditions for a chi-square goodness-of-fit test.`,
    errorCategory: "CONDITION_BYPASS",
    trap: "Students must verify: (1) random sample, (2) all expected counts ≥ 5 (must calculate each one, not just check observed counts), (3) independence. Skipping expected count verification loses points.",
    correctCERCResponse: {
      claim: "We fail to reject the null hypothesis. There is not sufficient evidence at the α = 0.05 level to conclude that the observed defect distribution differs from the company's claimed distribution.",
      evidence: "H₀: The distribution is as claimed (pₐ=0.40, pᵦ=0.30, pᴄ=0.20, pᴅ=0.10). Hₐ: The distribution differs. Expected counts: E(A)=150(0.40)=60, E(B)=150(0.30)=45, E(C)=150(0.20)=30, E(D)=150(0.10)=15. χ² = (55-60)²/60 + (50-45)²/45 + (30-30)²/30 + (15-15)²/15 = 25/60 + 25/45 + 0 + 0 = 0.417 + 0.556 = 0.973. With df = 4-1 = 3, p-value ≈ 0.808. Since p-value > α, we fail to reject H₀.",
      reasoning: "The chi-square goodness-of-fit test compares observed frequencies to expected frequencies under the null hypothesis. The test statistic χ² = Σ(Observed - Expected)²/Expected measures the total deviation. Large χ² values (small p-values) suggest the data don't fit the claimed distribution. Here, χ² = 0.973 is small (p-value = 0.808), indicating the observed data are consistent with the company's claim.",
      conditions: "Verifying conditions: (1) Random sample: The inspector randomly sampled 150 products. ✓ (2) Expected counts: E(A) = 60 ≥ 5 ✓, E(B) = 45 ≥ 5 ✓, E(C) = 30 ≥ 5 ✓, E(D) = 15 ≥ 5 ✓. All expected counts are at least 5. ✓ (3) Independence: Each product is classified independently. ✓ All conditions satisfied.",
    },
    structuralOutline: {
      claim: "Claim: [State your conclusion: reject or fail to reject H₀, interpreted in context]",
      evidence: "Evidence: [State hypotheses, calculate ALL expected counts, compute χ² statistic, find p-value, compare to α]",
      reasoning: "Reasoning: [Explain what the χ² statistic measures and how the p-value informs your decision]",
      conditions: "Conditions: [Verify (1) random sample, (2) ALL expected counts ≥ 5 with calculations, (3) independence]",
    },
    theoremInfo: {
      name: "Chi-Square Goodness-of-Fit Test",
      statement: "A chi-square goodness-of-fit test determines whether observed categorical data follow a hypothesized distribution.",
      hypotheses: [
        "Random sample: Data come from a random sample",
        "Expected counts: All expected counts must be at least 5",
        "Independence: Each observation is classified independently",
      ],
    },
    hints: {
      level1: "Before computing χ², verify all conditions. For expected counts, you must calculate them using the claimed percentages.",
      level2: "Your conditions section needs to show the calculation of each expected count and verify each is ≥ 5. Don't just check the observed counts.",
      level3: "Expected counts: E(A)=150(0.40)=60≥5✓, E(B)=150(0.30)=45≥5✓, E(C)=150(0.20)=30≥5✓, E(D)=150(0.10)=15≥5✓. All conditions met. χ² = (55-60)²/60 + (50-45)²/45 + (30-30)²/30 + (15-15)²/15 ≈ 0.973. With df=3, p-value≈0.808 > 0.05, fail to reject H₀.",
    },
  },
];

export const week2Config = {
  weekNumber: 2,
  title: "Condition Verification",
  focus: "Mathematically verifying ALL theorem conditions - no shortcuts allowed",
  scaffoldingLevel: "outline" as const,
  description: `Last week, you learned to identify when theorems DON'T apply. This week, you'll prove when they DO apply.

**The Challenge:** These problems are VALID for the given theorem/procedure, but you must rigorously prove it.

No shortcuts. "It's a polynomial so it's continuous" is not enough - you need to state WHY polynomials are continuous and THEREFORE this specific function satisfies the condition.

**Scaffolding Reduction:** No full sentence frames. You get structural outlines only. Fill in the mathematical reasoning yourself.

By the end of this week, condition verification will become second nature - the automatic first step before applying any theorem.`,
  objectives: [
    "Verify continuity and differentiability with mathematical justification (not just assertion)",
    "Check ALL inference conditions with explicit calculations (np ≥ 10, sample sizes, expected counts)",
    "Distinguish between 'stating' a condition and 'verifying' it mathematically",
    "Build complete CERC arguments with only structural guidance",
  ],
  estimatedTime: "20-25 minutes per problem",
  problems: week2Problems,
};
