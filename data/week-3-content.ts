/**
 * Week 3: Global Argumentation
 * Focus: Multi-concept synthesis + communication precision - no scaffolding
 * Scaffolding: Blank canvas (only CERC headers, no guidance)
 */

export interface WeekProblem {
  id: string;
  title: string;
  statement: string;
  course: "calculus-ab" | "calculus-bc" | "statistics";
  concepts: string[]; // Multiple concepts integrated
  trap: string;
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
    level1: string;
    level2: string;
    level3: string;
  };
}

export const week3Problems: WeekProblem[] = [
  // CALCULUS PROBLEMS
  {
    id: "w3-particle-motion",
    course: "calculus-bc",
    title: "Particle Motion: Integrated Analysis",
    concepts: ["position from velocity", "particle at rest", "total distance", "acceleration analysis"],
    statement: `A particle moves along a horizontal line with velocity given by $v(t) = t^3 - 6t^2 + 9t$ meters per second, where $0 \\le t \\le 5$ seconds. At time $t = 0$, the particle is at position $s(0) = 2$ meters.

**(a)** Find the position function $s(t)$ for the particle.

**(b)** At what times is the particle at rest? Justify your answer.

**(c)** Find the total distance traveled by the particle from $t = 0$ to $t = 5$ seconds. Show your work and explain why this differs from displacement.

**(d)** At $t = 4$ seconds, is the particle speeding up or slowing down? Justify your answer using both velocity and acceleration.`,
    trap: "Students often confuse displacement with total distance (must account for direction changes), and may incorrectly determine speeding up/slowing down without checking BOTH velocity and acceleration signs.",
    correctCERCResponse: {
      claim: "(a) s(t) = (t⁴/4) - 2t³ + (9t²/2) + 2. [AP Rubric: 1 point] (b) The particle is at rest at t = 0 and t = 3 seconds. [AP Rubric: 1 point] (c) Total distance is approximately 18.75 meters. [AP Rubric: 2 points - 1 for setup, 1 for correct answer] (d) At t = 4, the particle is speeding up because velocity and acceleration have the same sign. [AP Rubric: 1 point]",
      evidence: "(a) s(t) = ∫v(t)dt = ∫(t³-6t²+9t)dt = t⁴/4 - 2t³ + 9t²/2 + C. Using s(0)=2: C=2, so s(t) = t⁴/4 - 2t³ + 9t²/2 + 2. (b) v(t) = t³-6t²+9t = t(t²-6t+9) = t(t-3)² = 0 when t=0 or t=3. (c) Check direction changes: v(t) ≥ 0 for all t in [0,5] since t(t-3)² is always non-negative (t≥0 and squared term ≥0). Therefore no direction change. Distance = |s(5)-s(0)| = |156.25-2| = 154.25. Wait, let me recalculate s(5): (625/4) - 2(125) + 9(25)/2 + 2 = 156.25 - 250 + 112.5 + 2 = 20.75. Actually, since v(t) = t(t-3)² ≥ 0 for all t, particle never moves backward. Total distance = s(5) - s(0) = 20.75 - 2 = 18.75 meters. (d) v(4) = 4(4-3)² = 4(1) = 4 > 0 (moving right). a(t) = v'(t) = 3t² - 12t + 9. a(4) = 3(16) - 12(4) + 9 = 48 - 48 + 9 = 9 > 0 (acceleration to right). Since both positive, particle is speeding up. Wait, need to reconsider: if v and a have same sign, speeding up; opposite signs, slowing down.",
      reasoning: "(a) The position function is the antiderivative of velocity, using the initial condition to find the constant. (b) A particle is at rest when velocity equals zero. (c) Total distance requires integrating |v(t)|, which differs from net displacement s(5)-s(0) when the particle changes direction. (d) A particle speeds up when velocity and acceleration have the same sign (both forces acting in same direction), and slows down when they have opposite signs.",
      conditions: "(a) Fundamental Theorem of Calculus allows us to find position from velocity since v(t) is continuous on [0,5]. (b) v(t) is a polynomial, so we can factor and solve algebraically. (c) Must check where v(t) changes sign to determine direction changes. Since v(t) = t(t-3)² ≥ 0 for all t ≥ 0, the particle never moves backward. (d) Both v(4) and a(4) are computed and compared.",
    },
    theoremInfo: {
      name: "Fundamental Theorem of Calculus (Part 2)",
      statement: "If f is continuous on [a,b], then ∫[a to x] f(t)dt is differentiable on (a,b) and its derivative is f(x). Conversely, if F'(x) = f(x), then F(x) = ∫f(x)dx + C.",
      hypotheses: [
        "The velocity function v(t) must be continuous on the interval",
        "Initial position must be known to determine the constant of integration",
      ],
    },
    hints: {
      level1: "Part (c): Check if v(t) ever becomes negative on [0,5]. If it does, you need to split the integral at those points and use absolute value.",
      level2: "Part (d): You need BOTH v(4) and a(4). Compute a(t) = v'(t) first. The particle speeds up if v and a have the same sign.",
      level3: "Part (c): Factor v(t) = t(t-3)². Since this is always ≥ 0 on [0,5], the particle never moves backward. Total distance = s(5) - s(0). Part (d): v(4) = 4 > 0, a(4) = 9 > 0, so both positive = speeding up.",
    },
  },
  {
    id: "w3-optimization-justification",
    course: "calculus-bc",
    title: "Optimization with Rigorous Justification",
    statement: `A farmer has 200 meters of fencing and wants to enclose a rectangular field along a straight river. No fencing is needed along the river. Let $x$ represent the width of the field perpendicular to the river, and let $y$ represent the length parallel to the river.

**(a)** Express the area $A$ of the field as a function of $x$ alone.

**(b)** What dimensions maximize the area? Use calculus to find the critical points and justify that your answer is indeed a maximum.

**(c)** Use the Extreme Value Theorem to explain why a maximum area must exist for this problem.

**(d)** If the farmer decides to build a fence parallel to the river in the middle of the field (creating two separate enclosures), how do the optimal dimensions change? Justify your answer.`,
    concepts: ["optimization", "related variables", "critical points", "EVT", "second derivative test"],
    trap: "Students often forget to verify that critical points are actually maxima (not minima or saddle points), and may not address the EVT hypothesis about continuity and closed intervals.",
    correctCERCResponse: {
      claim: "(a) A(x) = x(200-2x) = 200x - 2x². [AP Rubric: 1 point] (b) The maximum area is 5000 m² with dimensions 50m × 100m. [AP Rubric: 2 points - 1 for finding critical point, 1 for justifying maximum] (c) EVT guarantees a maximum exists because A is continuous on [0,100] (closed and bounded). [AP Rubric: 1 point] (d) With the middle fence, optimal dimensions become 50m × 50m. [AP Rubric: 1 point]",
      evidence: "(a) Constraint: 2x + y = 200, so y = 200-2x. Area A = xy = x(200-2x) = 200x-2x². (b) A'(x) = 200-4x = 0, so x = 50. At x=50, y = 200-2(50) = 100. Area = 50(100) = 5000 m². To verify maximum: A''(x) = -4 < 0, confirming concave down at x=50 (local max). Alternatively, check endpoints: A(0)=0, A(100)=0, A(50)=5000, so x=50 gives maximum. (c) Domain is 0 ≤ x ≤ 100 (closed interval), A(x) is a polynomial (continuous), so EVT applies. (d) New constraint: 2x + 2y = 200 (extra fence parallel to river), so y = 100-x. A = xy = x(100-x) = 100x-x². A'(x) = 100-2x = 0, so x = 50. Then y = 100-50 = 50. Wait, that's wrong. With middle fence: 2x + y + y = 200? No, it's 2x + y = 200 (sides and back), plus one y in the middle. Total: 2x + 2y = 200, so x + y = 100, thus y = 100-x. A'(x) = 100-2x = 0 gives x=50, y=50. Hmm, but problem says 'parallel to river in the middle', meaning we add one more length of y. So: 2x + y (river side) + y (middle fence) = 2x + 2y = 200. Thus x+y=100, y=100-x. A=x(100-x), max at x=50, y=50.",
      reasoning: "(a) We express one variable in terms of the other using the constraint. (b) Critical points are found by setting A'(x)=0. We verify it's a maximum using the second derivative test (A''<0 means concave down). (c) EVT states that a continuous function on a closed interval attains both a max and min. (d) The constraint changes when a middle fence is added, altering the optimization.",
      conditions: "(b) A(x) is differentiable on (0,100), so we can use calculus to find critical points. We verify it's a maximum by checking A''(50) < 0 (second derivative test) or by comparing to endpoint values. (c) A(x) is a polynomial, so continuous everywhere. The domain [0,100] is closed and bounded. Therefore EVT applies and guarantees a maximum exists.",
    },
    theoremInfo: {
      name: "Extreme Value Theorem + Second Derivative Test",
      statement: "If f is continuous on [a,b], then f attains both a maximum and minimum on [a,b]. For optimization, if f'(c)=0 and f''(c)<0, then f has a local maximum at c.",
      hypotheses: [
        "The function must be continuous on a closed interval for EVT",
        "The function must be twice differentiable for the second derivative test",
      ],
    },
    hints: {
      level1: "Part (c): State why A(x) is continuous and why the domain is a closed interval. These are the two EVT conditions.",
      level2: "Part (b): After finding x=50, verify it's a maximum. Use either A''(50) < 0 or compare A(0), A(50), A(100).",
      level3: "Part (d): The new constraint is 2x + 2y = 200 (two widths, two lengths, no river side). So x + y = 100. Then A = x(100-x), and A'(x) = 100-2x = 0 gives x=50, y=50. Square enclosure.",
    },
  },
  {
    id: "w3-riemann-mvt",
    course: "calculus-ab",
    title: "Riemann Sums and Mean Value Theorem Integration",
    statement: `The rate at which water flows into a tank is modeled by $R(t) = 20\\sin\\left(\\frac{\\pi t}{6}\\right) + 30$ gallons per minute, where $t$ is measured in minutes for $0 \\le t \\le 12$.

**(a)** Write, but do not evaluate, an integral expression for the total amount of water that flows into the tank from $t = 0$ to $t = 12$ minutes.

**(b)** Use a left Riemann sum with 4 subintervals of equal width to approximate the integral from part (a). Show your work.

**(c)** Is your approximation from part (b) an overestimate or an underestimate? Justify your answer using properties of the function $R(t)$.

**(d)** Use the Mean Value Theorem for Integrals to find the time $c$ in $[0, 12]$ at which the instantaneous rate of water flow equals the average rate of water flow. Verify that the MVT conditions are satisfied.`,
    concepts: ["definite integrals", "Riemann sums", "over/underestimate", "MVT for integrals", "rate interpretation"],
    trap: "Students often skip verifying MVT conditions (continuity), and may incorrectly determine over/underestimate without analyzing whether the function is increasing/decreasing/concave on the interval.",
    correctCERCResponse: {
      claim: "(a) Total water = ∫₀¹² R(t) dt. (b) Left Riemann sum ≈ 366 gallons. (c) Cannot determine if over/underestimate without analyzing concavity. (d) By MVT for integrals, there exists c such that R(c) equals the average rate; c ≈ 6 minutes.",
      evidence: "(a) ∫₀¹² [20sin(πt/6) + 30] dt. (b) Δt = 12/4 = 3. Left endpoints: t = 0, 3, 6, 9. R(0) = 20sin(0)+30 = 30. R(3) = 20sin(π/2)+30 = 20(1)+30 = 50. R(6) = 20sin(π)+30 = 20(0)+30 = 30. R(9) = 20sin(3π/2)+30 = 20(-1)+30 = 10. Left sum = 3[30+50+30+10] = 3(120) = 360 gallons. (c) Need to check concavity. R'(t) = 20(π/6)cos(πt/6) = (10π/3)cos(πt/6). R''(t) = (10π/3)(-π/6)sin(πt/6) = -(5π²/9)sin(πt/6). R'' changes sign on [0,12], so function is not uniformly concave up or down. Cannot determine definitively if left sum is over or underestimate. (d) Average rate = (1/12)∫₀¹² R(t)dt. By calculator or exact: ∫ = 360. Avg = 360/12 = 30 gal/min. MVT for integrals: since R is continuous on [0,12], ∃c such that R(c) = 30. Solve: 20sin(πc/6)+30 = 30, so sin(πc/6) = 0. πc/6 = 0, π, 2π, ... giving c = 0, 6, 12. Since c ∈ (0,12), c = 6.",
      reasoning: "(a) The total amount is the definite integral of the rate function. (b) Left Riemann sum uses left endpoints of each subinterval. (c) Over/underestimate depends on whether function is increasing/decreasing or concave up/down over the interval. (d) MVT for integrals guarantees that a continuous function on [a,b] attains its average value at some point c in [a,b].",
      conditions: "(a) R(t) is continuous on [0,12] (composition of continuous functions), so the integral is well-defined. (c) To determine over/underestimate rigorously, we need to analyze R''(t) to check concavity. Since R'' changes sign, the function has inflection points. (d) MVT for integrals requires R to be continuous on [0,12], which is satisfied since R is a composition of sine and linear functions.",
    },
    theoremInfo: {
      name: "Mean Value Theorem for Integrals",
      statement: "If f is continuous on [a,b], then there exists a number c in [a,b] such that f(c) = (1/(b-a))∫[a to b] f(x)dx. In other words, f attains its average value at some point in the interval.",
      hypotheses: [
        "f must be continuous on the closed interval [a,b]",
      ],
    },
    hints: {
      level1: "Part (c): Determine if R(t) is increasing or decreasing, or check the concavity. If concave up, left sum underestimates; if concave down, it overestimates.",
      level2: "Part (d): First calculate the average rate using the integral. Then set R(c) equal to that average and solve for c.",
      level3: "Part (c): R''(t) = -(5π²/9)sin(πt/6) changes sign on [0,12], so we can't definitively say if it's an over or underestimate. Part (d): Average = 30 (if integral = 360). Solve 20sin(πc/6)+30=30 to get c=6.",
    },
  },

  // STATISTICS PROBLEMS
  {
    id: "w3-study-design-inference",
    course: "statistics",
    title: "Study Design and Statistical Inference Integration",
    statement: `A researcher wants to determine if a new teaching method improves student test scores. She randomly selects 80 students and randomly assigns 40 to the new method (treatment group) and 40 to the traditional method (control group). After 8 weeks, students take a standardized test.

**Results:**
- Treatment group: mean = 78.5, SD = 12.3
- Control group: mean = 72.8, SD = 14.1

**(a)** Is this an experiment or an observational study? Explain how you know, and state whether we can draw causal conclusions.

**(b)** State appropriate hypotheses for testing whether the new teaching method produces higher mean scores. Define your parameter clearly.

**(c)** Verify ALL conditions necessary for conducting a two-sample t-test. Show calculations where applicable.

**(d)** The test yields a p-value of 0.038. State an appropriate conclusion at α = 0.05 in the context of this study. Address the causation question from part (a).`,
    concepts: ["study design", "causation vs correlation", "two-sample t-test", "conditions verification", "conclusion in context"],
    trap: "Students often confuse experiments with observational studies, forget to address causation in the conclusion, or skip condition verification (especially normality checks for each group).",
    correctCERCResponse: {
      claim: "(a) This is an experiment because random assignment was used; we CAN draw causal conclusions. (b) H₀: μ_treatment = μ_control; Hₐ: μ_treatment > μ_control. (c) All conditions are satisfied. (d) Since p-value (0.038) < α (0.05), we reject H₀. We have convincing evidence that the new teaching method CAUSES higher mean test scores.",
      evidence: "(a) Random assignment of students to treatment/control groups makes this an experiment (not observational). Causation is possible due to random assignment controlling for confounding. (b) Let μ_treatment = true mean score for new method, μ_control = true mean score for traditional method. H₀: μ_treatment = μ_control (no difference). Hₐ: μ_treatment > μ_control (new method is better). (c) Conditions: (1) Random assignment: stated in problem ✓. (2) Independence: 80 students < 10% of all students ✓. (3) Normality: n₁ = 40 ≥ 30 ✓ and n₂ = 40 ≥ 30 ✓, so CLT applies to both groups. (d) p-value = 0.038 < α = 0.05, so we reject H₀. We have convincing evidence that the new teaching method produces higher mean test scores than the traditional method.",
      reasoning: "(a) The key distinction: experiments use random assignment (we impose treatments), while observational studies only observe (no treatment imposed). Random assignment allows causal inference. (b) One-sided test because we're asking if new method is BETTER. (c) Two-sample t-test requires independent samples, randomness, and normality (or large samples). (d) p-value < α means the data are unlikely under H₀, so we reject. Because this is an experiment with random assignment, we can conclude causation.",
      conditions: "(c) Verifying conditions rigorously: (1) Random assignment controls for confounding variables, satisfying randomness ✓. (2) Samples are independent (different students), and total sample (80) is much less than 10% of all students ✓. (3) Both sample sizes are ≥ 30 (n₁=40, n₂=40), so by CLT the sampling distributions are approximately normal even if populations aren't ✓. (d) The p-value interpretation requires us to address the study design: since random assignment was used (experiment), we can make a causal claim.",
    },
    theoremInfo: {
      name: "Two-Sample t-Test",
      statement: "A two-sample t-test compares means of two independent groups to determine if there is evidence of a difference between population means.",
      hypotheses: [
        "Independence: The two samples must be independent",
        "Randomness: Random sampling or random assignment",
        "Normality: Each population should be approximately normal OR each sample size ≥ 30",
      ],
    },
    hints: {
      level1: "Part (a): The key word is 'randomly assigns.' This distinguishes an experiment from an observational study.",
      level2: "Part (c): For normality, check if BOTH n₁ ≥ 30 AND n₂ ≥ 30. Don't just check the total sample size.",
      level3: "Part (d): Because this is an experiment with random assignment, you can use the word 'causes' in your conclusion. The p-value (0.038) < α (0.05), so reject H₀.",
    },
  },
  {
    id: "w3-regression-context",
    course: "statistics",
    title: "Regression Analysis with Contextual Interpretation",
    statement: `A marine biologist studying bullfrogs measures the body length (in mm) and mass (in grams) of 35 adult bullfrogs. A least-squares regression analysis yields:

**Regression equation:** $\\hat{\\text{mass}} = -18.6 + 6.086 \\times \\text{length}$
**Correlation coefficient:** $r = 0.894$
**Coefficient of determination:** $r^2 = 0.799$

**(a)** Interpret the slope of the regression line in the context of this study. Include correct units.

**(b)** Interpret the coefficient of determination ($r^2$) in context. Be precise with your language.

**(c)** The biologist measures a bullfrog with length 75 mm and predicts its mass using the regression equation. Explain why this prediction may not be reliable, even though the correlation is strong.

**(d)** Can we conclude that increased body length CAUSES increased mass? Explain why or why not, referencing the study design.`,
    concepts: ["regression interpretation", "slope meaning", "r² interpretation", "extrapolation", "causation in regression"],
    trap: "Students often forget units, use deterministic language ('the slope IS 6.086' instead of 'the predicted increase is 6.086'), or claim causation without considering the study design.",
    correctCERCResponse: {
      claim: "(a) For every 1-mm increase in body length, the predicted bullfrog mass increases by 6.086 grams. (b) Approximately 79.9% of the variation in bullfrog mass is explained by the linear relationship with body length. (c) Prediction may be unreliable if 75 mm is outside the range of observed lengths (extrapolation). (d) We cannot conclude causation because this is an observational study, not an experiment.",
      evidence: "(a) Slope = 6.086 grams per mm. (b) r² = 0.799 = 79.9%. (c) Need to know the range of lengths in the data. If 75 mm is far outside the observed range, the linear model may not hold. (d) Study design: biologist measured existing bullfrogs (observational), did not manipulate length experimentally.",
      reasoning: "(a) The slope represents the average change in the response variable (mass) for a one-unit increase in the explanatory variable (length). We use 'predicted' because regression predicts, not determines. (b) r² measures the proportion of variability in y explained by the linear relationship with x. Remaining 20.1% is due to other factors or random variation. (c) Extrapolation (predicting outside the data range) is risky because the relationship may not be linear beyond observed values. (d) Observational studies can show association but not causation, because confounding variables may exist.",
      conditions: "(c) We would need to check if 75 mm is within the range of observed lengths. Regression is only reliable within the scope of the data. (d) To establish causation, we would need an experiment with random assignment, which is not feasible for bullfrog body length (you can't randomly assign length).",
    },
    theoremInfo: {
      name: "Least-Squares Regression",
      statement: "Least-squares regression finds the line of best fit by minimizing the sum of squared residuals. The slope and intercept provide predictions, and r² measures how much variation is explained.",
      hypotheses: [
        "Linear relationship between variables (check scatterplot)",
        "Independent observations",
        "Normal residuals (for inference)",
        "Equal variance of residuals (homoscedasticity)",
      ],
    },
    hints: {
      level1: "Part (a): Include units (grams and mm) and use the word 'predicted' instead of 'is'.",
      level2: "Part (b): Don't say 'r² is 79.9%.' Say 'approximately 79.9% of the variation in [response variable] is explained by [explanatory variable].'",
      level3: "Part (c): The key issue is extrapolation - predicting outside the range of the data. Part (d): This is observational (not experimental), so no causation.",
    },
  },
  {
    id: "w3-sampling-bias",
    course: "statistics",
    title: "Sampling Methods and Bias Analysis",
    statement: `A high school principal wants to estimate the proportion of students who support extending the school day by 30 minutes. Three different sampling methods are proposed:

**Method A:** Survey all students in the first-period AP Statistics class.
**Method B:** Assign each student a number, use a random number generator to select 100 students, and survey them.
**Method C:** Survey every 10th student who enters the cafeteria during lunch.

**(a)** Identify the sampling method used in each approach (simple random sample, convenience sample, systematic sample, stratified sample, or cluster sample).

**(b)** For each method, explain whether it is likely to produce a representative sample. Identify any potential sources of bias.

**(c)** The principal uses Method B and finds that 62 out of 100 students support the extension. Construct a 95% confidence interval for the true proportion of students who support the extension. Verify all conditions.

**(d)** Interpret the confidence interval from part (c) in the context of this study. Use correct statistical language (do not say "95% of students" or "95% chance").`,
    concepts: ["sampling methods", "bias identification", "confidence intervals for proportions", "conditions verification", "CI interpretation"],
    trap: "Students often misidentify sampling methods, fail to identify subtle bias sources (e.g., AP Stats students may have different opinions), or misinterpret confidence intervals ('95% chance the true proportion is in this interval' is WRONG).",
    correctCERCResponse: {
      claim: "(a) Method A: convenience sample; Method B: simple random sample; Method C: systematic sample. (b) Only Method B is likely representative; A and C have bias. (c) 95% CI: (0.525, 0.715). (d) We are 95% confident that the true proportion of ALL students who support the extension is between 52.5% and 71.5%.",
      evidence: "(a) A: surveying one class (convenient/accessible); B: random number generator (SRS); C: every 10th (systematic pattern). (b) A: AP Stats students may not represent all students (academic rigor bias). C: students who go to cafeteria at specific time may differ (participation bias - some students leave campus, skip lunch, etc.). B: randomness eliminates bias. (c) p̂ = 62/100 = 0.62. Check conditions: (1) Random: Method B uses random selection ✓. (2) 10%: school likely has > 1000 students ✓. (3) Success-failure: np̂ = 100(0.62) = 62 ≥ 10 ✓, n(1-p̂) = 100(0.38) = 38 ≥ 10 ✓. SE = √(0.62·0.38/100) = √0.002356 = 0.04854. CI: 0.62 ± 1.96(0.04854) = 0.62 ± 0.0951 = (0.525, 0.715). (d) Interpretation: We are 95% confident the true proportion is in (0.525, 0.715).",
      reasoning: "(a) Different sampling methods have different properties. SRS gives every individual equal chance; convenience uses easily accessible groups; systematic uses a fixed pattern. (b) Bias occurs when the sample systematically differs from the population. (c) CI formula: p̂ ± z*SE, where SE = √(p̂(1-p̂)/n) and z*=1.96 for 95%. (d) Confidence interval interpretation: If we repeated this process many times, 95% of the intervals constructed would contain the true parameter.",
      conditions: "(c) Conditions for CI: (1) Random sample: Method B explicitly uses random selection ✓. (2) Independence: Population > 10n (school probably has > 1000 students, so 1000 > 10(100)=1000) ✓. (3) Success-failure: both np̂=62 and n(1-p̂)=38 are ≥ 10 ✓. All conditions satisfied.",
    },
    theoremInfo: {
      name: "Confidence Interval for Proportion",
      statement: "A confidence interval provides a range of plausible values for a population parameter based on sample data. The confidence level represents the proportion of times the method would capture the true parameter in repeated sampling.",
      hypotheses: [
        "Random sample from the population",
        "Independence (10% condition: n < 10% of population)",
        "Success-failure: np̂ ≥ 10 and n(1-p̂) ≥ 10",
      ],
    },
    hints: {
      level1: "Part (b): Think about how each sampling method might systematically exclude certain types of students.",
      level2: "Part (c): For the 10% condition, estimate the school size. Is it reasonable that the school has at least 1000 students?",
      level3: "Part (d): Don't say '95% chance' or '95% of students.' Say 'We are 95% confident that the true proportion of all students...'",
    },
  },
];

export const week3Config = {
  weekNumber: 3,
  title: "Global Argumentation",
  focus: "Multi-concept synthesis + communication precision - no scaffolding",
  scaffoldingLevel: "none" as const,
  description: `The training wheels are off. Week 3 gives you blank canvas problems - just like the AP exam.

You see the problem, you write the complete mathematical argument. No sentence frames, no structural outlines.

**What's different:**

Week 3 problems integrate MULTIPLE concepts. A Calculus problem might require FTC, particle motion, AND MVT. A Statistics problem might combine study design, inference procedures, AND bias analysis.

**Communication Precision:**

By now, you know the math. Week 3 focuses on ARTICULATING it clearly:
- Use context and units in every statement
- Non-deterministic language for Statistics ("we estimate," not "it is")
- Cite theorems explicitly
- Interpret results, don't just calculate

**You're Ready:**

If you've completed Weeks 1-2, you already know how to check conditions and verify rigorously. Week 3 is about applying those skills to complex, real-world scenarios - just like the AP exam.`,
  objectives: [
    "Synthesize multiple AP concepts in a single problem",
    "Write complete mathematical arguments without scaffolding",
    "Communicate with professional precision (context, units, non-deterministic language)",
    "Interpret results and address deeper questions (causation, study design, reliability)",
  ],
  estimatedTime: "25-30 minutes per problem",
  problems: week3Problems,
};
