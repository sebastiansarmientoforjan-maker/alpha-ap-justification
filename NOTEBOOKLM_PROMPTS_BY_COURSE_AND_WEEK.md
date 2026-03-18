# NotebookLM Prompts - Course-Specific Infographics & Videos

**Structure:** 3 courses × 4 weeks × 2 formats = 24 prompts total

**Courses:**
- AP Calculus AB (derivatives, integrals, FTC)
- AP Calculus BC (AB + series, parametric, polar, advanced integration)
- AP Statistics (inference, study design, probability)

**Visual Style (ALL prompts):**
- Dark theme (#0F172A → #1E293B gradient background)
- Week 1-2: Cyan accent (#06B6D4)
- Week 3: Purple accent (#A855F7)
- Week 4: Red/Orange gradient (#EF4444 → #F97316)
- Modern, sleek, tech-forward design (NOT academic)

---

# INFOGRAPHICS

## Week 1: Break Empirical Illusions 🔍

### AP CALCULUS AB - Week 1 Infographic

**Title:** "Week 1: When Theorems DON'T Apply (AP Calc AB)"

**Visual Design:**
- Cyan accent color (#06B6D4)
- Icon: AlertTriangle (⚠️)
- Dark gradient background with subtle grid lines

**Content Structure:**

**1. The Problem (Top Banner - Red Warning)**
"75% of AB students apply MVT/IVT without checking if the function is actually continuous or differentiable."

**2. Core Concept Box (Center, Highlighted)**
**Error-Forcing Problems:** Theorems BREAK when conditions aren't met.

**3. Week 1 Focus (3-Column Layout)**

| **IVT Traps** | **MVT Traps** | **EVT Traps** |
|---------------|---------------|---------------|
| Function not continuous | Not differentiable on (a,b) | Not continuous on [a,b] |
| Discontinuity in interval | Discontinuity at endpoint | Open interval (no max/min guaranteed) |

**4. Example Problem (Large Box, Code-Style)**
```
Problem: Apply MVT to f(x) = |x| on [-1, 1]. Find c where f'(c) = [f(1)-f(-1)]/2.

The Trap:
- Students calculate: [f(1)-f(-1)]/2 = 0
- Then solve f'(c) = 0
- But f'(0) doesn't exist! ❌

Correct Answer:
- f is NOT differentiable at x=0
- MVT does NOT apply
- No such c exists ✓
```

**5. CERC Framework (4 Circles Connected by Arrows)**
**C** (Claim) → **E** (Evidence) → **R** (Reasoning) → **C** (Conditions)

Highlight: "Week 1 teaches you to CHECK CONDITIONS FIRST."

**6. Common AB Conditions Checklist (Right Side Panel)**
✓ Continuous on [a, b]?
✓ Differentiable on (a, b)?
✓ f(a) and f(b) opposite signs (IVT)?
✓ Closed interval (EVT)?

**7. Scaffolding Provided This Week**
"Full CERC sentence frames provided. Example:
- 'The function f is continuous on [a, b] because...'
- 'Therefore, by IVT, there exists c in (a, b) such that...'"

**8. Badge & XP (Bottom)**
🔍 **"The Skeptic" Badge** - Survive error-forcing problems
**120 XP Available**

**9. Week 1 AB Problems**
- Problem 1: IVT with discontinuity
- Problem 2: MVT with non-differentiable point
- Problem 3: EVT on open interval
- Problem 4: Composite failure (multiple conditions broken)

**Visual Style Notes:**
- Use f(x) graphs showing discontinuities/cusps
- Highlight x=0 discontinuity with red marker
- Show "condition violated" callouts on graphs

---

### AP CALCULUS BC - Week 1 Infographic

**Title:** "Week 1: When Advanced Theorems BREAK (AP Calc BC)"

**Visual Design:** Same as AB (cyan accent, dark theme)

**Content Structure:**

**1. The Problem (Top Banner - Red Warning)**
"BC students rush to apply series convergence tests without checking alternating series conditions or Taylor series applicability."

**2. Core Concept Box**
**Error-Forcing Problems:** BC theorems break in subtle ways.

**3. Week 1 Focus (3-Column Layout)**

| **Series Traps** | **Parametric/Polar Traps** | **Advanced Integration Traps** |
|------------------|----------------------------|-------------------------------|
| Alternating series test when terms don't decrease | Arc length when curve not smooth | Integration by parts with divergence |
| Taylor series when function not infinitely differentiable | Polar area with self-intersecting curves | Improper integrals with infinite discontinuities |

**4. Example Problem (Large Box)**
```
Problem: Use Alternating Series Test on Σ(-1)ⁿ·sin(1/n) from n=1 to ∞.

The Trap:
- Students see (-1)ⁿ and assume AST applies
- Check lim(n→∞) sin(1/n) = 0 ✓
- But they forget: terms must be DECREASING
- sin(1/n) is NOT monotonically decreasing ❌

Correct Answer:
- AST conditions not fully satisfied
- Need different convergence test (comparison, limit comparison)
```

**5. BC-Specific Conditions Checklist**
✓ Series: Terms decrease monotonically?
✓ Series: Alternating with lim aₙ = 0?
✓ Parametric: dx/dt and dy/dt continuous?
✓ Polar: No self-intersections in region?
✓ Taylor: Function infinitely differentiable at center?

**6. Week 1 BC Problems**
- Problem 1: Alternating series with non-monotonic terms
- Problem 2: Parametric curve with cusp (arc length undefined)
- Problem 3: Polar area with self-intersection
- Problem 4: Taylor series at non-analytic point

**Badge:** 🔍 "The BC Skeptic"
**XP:** 150 XP (higher than AB due to complexity)

**Visual Style Notes:**
- Graph of sin(1/n) showing oscillatory behavior
- Polar curve with self-intersection highlighted in red
- Series terms plotted showing non-monotonic decrease

---

### AP STATISTICS - Week 1 Infographic

**Title:** "Week 1: When Inference Assumptions FAIL (AP Stats)"

**Visual Design:** Same cyan accent, dark theme

**Content Structure:**

**1. The Problem (Top Banner - Red Warning)**
"80% of Stats students state 'the sample is random' without verifying HOW the sample was collected."

**2. Core Concept Box**
**Error-Forcing Problems:** Statistical inference breaks when assumptions fail.

**3. Week 1 Focus (3-Column Layout)**

| **Randomness Traps** | **Independence Traps** | **Normality Traps** |
|----------------------|------------------------|---------------------|
| Convenience sample claimed as random | Sampling with replacement assumed incorrectly | Small n with skewed population |
| Voluntary response bias | Time-series data treated as independent | Outliers invalidating t-procedures |

**4. Example Problem (Large Box)**
```
Problem: A researcher surveys the first 50 students entering the library and conducts a 1-sample t-test on study hours.

The Trap:
- Students see n=50 and say "random sample" ❌
- Apply t-test without questioning sampling method
- Conclude results are generalizable

Correct Answer:
- Sample is CONVENIENCE (first 50 to enter)
- NOT random → selection bias
- Students who enter library early may study more
- Inference conditions NOT met → cannot generalize ✓
```

**5. Stats Conditions Checklist**
✓ Random sample or random assignment?
✓ Independence: n < 10% of population (10% rule)?
✓ Normality: n ≥ 30 OR population normal OR no strong skew?
✓ Expected counts ≥ 5 (for chi-square)?
✓ No confounding variables?

**6. Week 1 Stats Problems**
- Problem 1: Convenience sample claimed as random
- Problem 2: Paired data analyzed as independent samples
- Problem 3: t-test with n=12 and strong skew
- Problem 4: Chi-square with expected count < 5

**Badge:** 🔍 "The Stats Skeptic"
**XP:** 120 XP

**Visual Style Notes:**
- Diagram showing biased sampling method (library entrance)
- Graph with outliers violating normality
- Table showing expected counts < 5 (chi-square failure)

---

## Week 2: Rigorous Verification ✓

### AP CALCULUS AB - Week 2 Infographic

**Title:** "Week 2: PROVE the Conditions (AP Calc AB)"

**Visual Design:**
- Cyan accent (#06B6D4)
- Icon: CheckCircle (✓)
- Checklist aesthetic

**Content Structure:**

**1. The Shift (Top Banner - Green Success)**
"Week 1: You learned when theorems DON'T work.
Week 2: Now PROVE when they DO work."

**2. Core Concept Box**
**Rigorous Verification:** Every condition must be explicitly proven.

**3. Week 2 Focus: IVT/MVT/EVT Proofs**

**IVT Proof Template:**
1. **Prove continuity:** "f is continuous on [a,b] because [polynomial/rational/composition rules]"
2. **Show sign change:** "f(a) = ___ < 0 and f(b) = ___ > 0"
3. **Apply theorem:** "By IVT, ∃c ∈ (a,b) such that f(c) = 0"
4. **Conclude:** "Therefore, f has a root in (a,b)"

**4. Example Problem (Large Box)**
```
Problem: Prove that f(x) = x³ - 2x + 1 has a root in [0, 1] using IVT.

Complete CERC Proof:

Claim: f has a root in (0, 1).

Evidence:
- f(0) = 0³ - 2(0) + 1 = 1 > 0
- f(1) = 1³ - 2(1) + 1 = 0

Reasoning:
- f is continuous on [0,1] because it is a polynomial
- f(0) > 0 and f(1) = 0, so f changes sign on [0,1]

Conditions Verified:
✓ f continuous on [0,1]: polynomial functions are continuous everywhere
✓ f(0) and f(1) have different signs: 1 > 0, 0 = 0 (includes zero)

By the Intermediate Value Theorem, there exists c in (0,1) such that f(c) = 0.
```

**5. Scaffolding Provided**
"Structural outline only (no sentence frames):
- Prove continuity: ___
- Show sign change: ___
- Apply theorem: ___
- Conclude: ___"

**6. Week 2 AB Problems**
- Problem 1: IVT root existence proof
- Problem 2: MVT finding c where f'(c) = average rate
- Problem 3: EVT finding absolute max/min
- Problem 4: Composite theorem application

**Badge:** 🏛️ "The Architect"
**XP:** 150 XP

**Visual Style:**
- Checklist with green checkmarks
- Graph showing f(0) and f(1) with sign change
- Theorem box highlighted

---

### AP CALCULUS BC - Week 2 Infographic

**Title:** "Week 2: Prove Series Convergence Rigorously (AP Calc BC)"

**Content:** Same structure as AB, but with series-specific examples.

**Example Problem:**
```
Problem: Prove Σ((-1)ⁿ⁺¹)/n from n=1 to ∞ converges using AST.

Complete CERC Proof:

Claim: The series converges.

Evidence:
Let aₙ = 1/n

Reasoning:
We apply the Alternating Series Test.

Conditions Verified:
✓ Alternating: (-1)ⁿ⁺¹ alternates sign
✓ Terms decrease: aₙ₊₁ = 1/(n+1) < 1/n = aₙ for all n ≥ 1
✓ Limit is zero: lim(n→∞) 1/n = 0

By AST, the series Σ((-1)ⁿ⁺¹)/n converges.
```

**Week 2 BC Problems:**
- Problem 1: AST convergence proof
- Problem 2: Ratio test with factorial
- Problem 3: Taylor series radius of convergence
- Problem 4: Parametric arc length with complete justification

**XP:** 180 XP (BC complexity)

---

### AP STATISTICS - Week 2 Infographic

**Title:** "Week 2: Prove Inference Conditions (AP Stats)"

**Example Problem:**
```
Problem: Test if μ₁ ≠ μ₂ using 2-sample t-test. n₁=35, n₂=40, random samples from populations.

Complete CERC Proof:

Claim: We can use a 2-sample t-test.

Evidence:
- Sample 1: n₁ = 35, random sample from population 1
- Sample 2: n₂ = 40, random sample from population 2

Reasoning:
The 2-sample t-test requires:
1. Random samples
2. Independence
3. Normality

Conditions Verified:
✓ Random: Both samples stated as random
✓ Independence within groups:
  - n₁ = 35 < 10% of population 1 (assume pop > 350)
  - n₂ = 40 < 10% of population 2 (assume pop > 400)
✓ Independence between groups: Different populations
✓ Normality:
  - n₁ = 35 ≥ 30 → CLT applies
  - n₂ = 40 ≥ 30 → CLT applies

Therefore, we can proceed with 2-sample t-test.
```

**Week 2 Stats Problems:**
- Problem 1: 1-sample t-test conditions
- Problem 2: 2-proportion z-test conditions
- Problem 3: Chi-square goodness of fit conditions
- Problem 4: Linear regression conditions (LINE)

**XP:** 150 XP

---

## Week 3: Synthesis Without Scaffolding 🎯

### AP CALCULUS AB - Week 3 Infographic

**Title:** "Week 3: Multi-Concept Integration (AP Calc AB)"

**Visual Design:**
- Purple accent (#A855F7)
- Icon: Target (🎯)
- Blank canvas aesthetic

**Content:**

**1. The Challenge (Top)**
"NO scaffolding. NO sentence frames. Just you and the problem."

**2. Week 3 Skills**
- Synthesize multiple theorems (MVT + FTC + related rates)
- Write with professional precision (context, units, complete sentences)
- Justify EVERY step

**3. Example Multi-Concept Problem**
```
Problem: A particle moves along a line with velocity v(t) = t² - 4t + 3 for 0 ≤ t ≤ 4.

(a) Find when the particle changes direction. Justify using calculus.
(b) Find the total distance traveled. Show all work.
(c) Use MVT to prove there exists a time c where the particle's velocity equals its average velocity.

Expected Response (Blank Canvas):
Students must:
- Find v(t) = 0 for direction changes
- Use velocity sign analysis
- Apply ∫|v(t)|dt for distance (not displacement)
- Verify MVT conditions before applying
- Write in complete sentences with units
```

**4. Week 3 AB Problem Types**
- Particle motion + MVT
- Related rates + implicit differentiation
- Optimization + FTC
- Area between curves + EVT

**Badge:** 🎯 "The Synthesizer"
**XP:** 180 XP

**Visual:** Blank CERC template showing student must fill everything from scratch.

---

### AP CALCULUS BC - Week 3 Infographic

**Title:** "Week 3: BC Synthesis Without Training Wheels"

**Example Problem:**
```
Problem: A curve is defined parametrically by x(t) = t³ - 3t, y(t) = t² for -2 ≤ t ≤ 2.

(a) Find dy/dx at t=1. Show all work.
(b) Find the arc length of the curve from t=0 to t=2.
(c) Write the equation of the tangent line at t=1 in rectangular form.

Synthesis Required:
- Parametric derivatives (chain rule)
- Arc length formula with √[(dx/dt)² + (dy/dt)²]
- Point-slope form conversion
- Verify all formulas are applicable (smooth curve?)
```

**Week 3 BC Problem Types:**
- Parametric + polar integration
- Series + Taylor polynomial error bound
- Vector-valued functions + arc length
- Euler's method + differential equations

**XP:** 210 XP (BC advanced synthesis)

---

### AP STATISTICS - Week 3 Infographic

**Title:** "Week 3: Stats Communication + Study Design (AP Stats)"

**Example Problem:**
```
Problem: A study finds that students who eat breakfast score 15 points higher on SATs (p = 0.03).

(a) Interpret the p-value in context.
(b) Can we conclude breakfast CAUSES higher SAT scores? Explain.
(c) What confounding variables might exist?
(d) Design an experiment to test causation.

Synthesis Required:
- Interpret p-value with context + probability language
- Address causation vs correlation
- Identify confounders (sleep, SES, motivation)
- Design experiment with random assignment + control
- Use non-deterministic language ("suggests", "evidence for")
```

**Week 3 Stats Problem Types:**
- Study design critique + confounders
- Causation vs correlation analysis
- Regression interpretation (slope, r², residuals)
- Inference + practical significance

**Badge:** 🎯 "The Stats Communicator"
**XP:** 180 XP

---

## Week 4: Boss Battle ⚔️

### AP CALCULUS AB - Week 4 Infographic

**Title:** "Week 4: AB Boss Battle - 3-Phase Challenge"

**Visual Design:**
- Red/Orange gradient (#EF4444 → #F97316)
- Icon: Trophy (⚔️)
- Meteor background effect

**Content:**

**1. Boss Battle Structure (3 Panels)**

**Phase 1: Untangle the Evidence (Individual, ~15 min)**
```
Problem Setup:
A cylindrical water tank (radius 5 ft, height 10 ft) is being filled at a constant rate of 20 ft³/min.

Question: How fast is the water level rising when h = 4 ft?

Your Task:
- Identify which theorems/concepts apply
- Set up the problem (volume formula, related rates)
- Verify conditions (differentiability, continuity)
- Show all setup work
```

**Phase 2: Team CERC Construction (Collaborative, ~20 min)**
```
The Cohort Works Together:
- Pool individual Phase 1 work
- Debate the approach (is related rates correct?)
- Build unified CERC argument
- One team solution with everyone's input

Example Debate Points:
- "Do we need MVT here or just related rates?"
- "Is the tank actually cylindrical? Check problem."
- "What units should the final answer have?"
```

**Phase 3: THE CURVEBALL (TIMED: 15 min)**
```
ALERT: New Information!

"At t = 3 minutes, the inlet valve was partially closed, reducing the fill rate to 15 ft³/min. Recalculate how fast the water level is rising at h = 4 ft given this new information."

Your Task (Under Pressure):
- Identify what changed (dV/dt now varies with time)
- Recalculate with new rate
- Explain impact of change
- Adapt your Phase 2 conclusion

Time Constraint: You have 15 minutes starting NOW.
```

**2. Success Criteria (Checklist)**
✓ Phase 1: Complete setup with justified steps
✓ Phase 2: Team CERC with all conditions verified
✓ Phase 3: Adapted conclusion under time pressure
✓ All work shows rigorous justification

**3. Badge & XP**
⚔️ **"Boss Slayer" Badge**
**195 XP Total**

**4. Why Team-Based?**
- Simulates real mathematical collaboration
- Learn from peers' approaches
- Build confidence under pressure
- No one student has all the answers

**Visual:** 3 connected circles showing Phase 1 → 2 → 3 with time indicators.

---

### AP CALCULUS BC - Week 4 Infographic

**Title:** "Week 4: BC Boss Battle - Ultimate Challenge"

**Phase 1 (Individual):**
```
Problem: A bug travels along a curve defined by polar equation r = 2sin(3θ) for 0 ≤ θ ≤ π/3.

Calculate:
- The area enclosed by one petal
- The arc length of the bug's path
- The speed of the bug when θ = π/6 (if dθ/dt = 2 rad/s)

Your Task:
- Set up polar area integral: A = (1/2)∫r²dθ
- Set up arc length: L = ∫√(r² + (dr/dθ)²)dθ
- Set up speed using polar derivatives
- Verify all formulas applicable (no self-intersection?)
```

**Phase 3 Curveball:**
```
ALERT: The bug's angular velocity is NOT constant!

"The bug slows down: dθ/dt = 2cos(θ) rad/s. Recalculate the speed at θ = π/6."

Adaptation Required:
- Original assumption: dθ/dt = 2 (constant)
- New: dθ/dt = 2cos(θ) (variable)
- Must recalculate speed formula
- Show how conclusion changes
```

**XP:** 225 XP (BC max difficulty)

---

### AP STATISTICS - Week 4 Infographic

**Title:** "Week 4: Stats Boss Battle - Real Study Critique"

**Phase 1 (Individual):**
```
Problem: A pharmaceutical company tests a new drug on 200 volunteers (100 treatment, 100 control). After 6 months, 65% of treatment group shows improvement vs 45% of control.

Your Task:
- Identify the study design (experiment or observational?)
- Set up appropriate hypothesis test (2-proportion z-test?)
- Check all inference conditions
- Calculate test statistic (you have calculator)
```

**Phase 2 (Team):**
```
Team Discussion:
- Was random assignment used?
- Is this a randomized controlled trial or observational study?
- What confounders might exist?
- How do we interpret "improvement" (subjective vs objective)?
- Build CERC argument for whether drug is effective
```

**Phase 3 Curveball:**
```
ALERT: New Information Discovered!

"It turns out 80% of the treatment group knew they were receiving the drug (not double-blind). Reassess your conclusion about the drug's effectiveness."

Your Task:
- Identify the bias: placebo effect
- Explain why original conclusion is weakened
- Discuss how study design flaw affects validity
- Make recommendation for better study design

Time: 15 minutes
```

**XP:** 195 XP

**Visual:** Study design diagram showing treatment/control with bias callout for Phase 3.

---

# VIDEOS

## General Video Structure (All Courses)

**Length:** 8-12 minutes per video
**Format:** Screen recording with voiceover + on-screen text/graphics
**Visual Style:** Dark theme, code editor aesthetic, dynamic text animations

**Video Sections:**
1. Hook (0:00-0:30) - Dramatic opening question
2. Problem Setup (0:30-2:00) - What students get wrong
3. Core Teaching (2:00-7:00) - The method/framework
4. Example Walkthrough (7:00-10:00) - Complete problem solution
5. Call to Action (10:00-end) - Try the problems, earn the badge

---

## Week 1 Videos

### AP CALCULUS AB - Week 1 Video

**Title:** "Week 1: The MVT Problem Most Students Get WRONG"

**Hook (0:00-0:30):**
[Screen shows: f(x) = |x| on [-1, 1]]
**Voiceover:** "Can you apply Mean Value Theorem to this function? Most AB students say yes. But there's a trap."

**Problem Setup (0:30-2:00):**
- Show typical student response: calculates average rate of change, solves f'(c) = 0
- Highlight: "But what if f'(c) doesn't exist?"
- Reveal: The function isn't differentiable at x=0

**Core Teaching (2:00-7:00):**
**On-screen text appears:**

**MVT Conditions (Non-Negotiable):**
1. f continuous on [a, b] ✓
2. f differentiable on (a, b) ✗ ← FAILS HERE

[Animated graph of f(x) = |x| with cusp at origin highlighted in red]

**Voiceover:** "Before you write 'by MVT...' you MUST verify differentiability. Here's how:"

[Screen shows step-by-step condition check:]
1. Check continuity: |x| is continuous everywhere ✓
2. Check differentiability: f'(0) = lim (h→0) |h|/h = DNE ✗
3. Conclusion: MVT does NOT apply

**Example Walkthrough (7:00-10:00):**
[Split screen: Problem on left, solution on right]

**Problem:** "Does MVT apply to f(x) = x^(2/3) on [-1, 1]?"

**Solution (animated step by step):**
```
Step 1: Check continuity
- f(x) = x^(2/3) is continuous on [-1, 1] ✓

Step 2: Check differentiability
- f'(x) = (2/3)x^(-1/3) = 2/(3∛x)
- At x=0: f'(0) = 2/(3∛0) = undefined ✗

Conclusion: MVT does NOT apply because f is not differentiable at x=0.
```

**Call to Action (10:00-end):**
**On-screen:** "Try Week 1 Problems. Earn the 🔍 Skeptic Badge. 120 XP Available."

**Visual Style:**
- Dark background with cyan highlights
- Code editor font (JetBrains Mono)
- Animated graphs using Desmos-style rendering
- Checklist animations (items appear with checkmarks)

---

### AP CALCULUS BC - Week 1 Video

**Title:** "Week 1: The Alternating Series Trap NO ONE Sees Coming"

**Hook (0:00-0:30):**
[Screen shows: Σ(-1)ⁿ·sin(1/n) from n=1 to ∞]
**Voiceover:** "Alternating? Check. Limit goes to zero? Check. Converges? WRONG."

**Problem Setup (0:30-2:00):**
- Show student applying AST immediately
- Student checks: alternating ✓, lim = 0 ✓
- Student concludes: converges ✓
- **Reveal:** "But you forgot ONE condition..."

**Core Teaching (2:00-7:00):**
**On-screen:**

**Alternating Series Test Requirements:**
1. Series alternates sign ✓
2. lim (n→∞) aₙ = 0 ✓
3. aₙ₊₁ < aₙ for all n (DECREASING) ✗ ← Often Forgotten

[Animated plot of sin(1/n) showing oscillations]

**Voiceover:** "sin(1/n) approaches zero, but it's NOT monotonically decreasing. Watch:"

[Graph shows sin(1/1), sin(1/2), sin(1/3)... with values oscillating]

**Example Walkthrough (7:00-10:00):**
**Problem:** "Does Σ(-1)ⁿ⁺¹·n/(n²+1) converge?"

**Solution:**
```
Check AST:
1. Alternating: (-1)ⁿ⁺¹ ✓
2. Limit: lim (n→∞) n/(n²+1) = 0 ✓
3. Decreasing?
   Let f(x) = x/(x²+1)
   f'(x) = (1-x²)/(x²+1)²
   For x > 1: f'(x) < 0 → decreasing ✓

Conclusion: ALL conditions met → series converges by AST.
```

**Call to Action:**
"Master BC Week 1. Earn 🔍 BC Skeptic Badge. 150 XP."

---

### AP STATISTICS - Week 1 Video

**Title:** "Week 1: The Inference Condition 80% of Students Miss"

**Hook (0:00-0:30):**
[Screen shows survey scenario]
**Voiceover:** "A researcher surveys the first 50 students entering the library. Is this a random sample? Most students say yes. But..."

**Problem Setup (0:30-2:00):**
- Show typical student response: "n=50, so it's random"
- Highlight the flaw: sampling METHOD matters, not just size
- Reveal: This is a CONVENIENCE sample, not random

**Core Teaching (2:00-7:00):**
**On-screen:**

**3 Types of Sampling (Know the Difference):**
1. **Random Sample** - Every individual has equal chance (lottery, random number generator)
2. **Convenience Sample** - First 50 students, volunteers (BIASED)
3. **Stratified Sample** - Random within groups

[Animated diagram showing biased vs unbiased sampling]

**Voiceover:** "If the sampling method introduces bias, you CANNOT generalize to the population."

**Example Walkthrough (7:00-10:00):**
**Problem:** "Can we use 1-sample t-test on this data?"

**Scenario:** Survey of 60 students at football game about school spirit.

**Solution:**
```
Check Conditions:
1. Random sample?
   - Students at football game ≠ random sample
   - Selection bias: students with high school spirit more likely to attend ✗

2. Independence?
   - Assume school > 600 students (10% rule) ✓

3. Normality?
   - n = 60 ≥ 30 (CLT applies) ✓

Conclusion: CANNOT use t-test because random condition fails.
```

**Call to Action:**
"Catch sampling bias. Earn 🔍 Stats Skeptic Badge. 120 XP."

---

## Week 2 Videos

### AP CALCULUS AB - Week 2 Video

**Title:** "Week 2: Write a COMPLETE IVT Proof (AP Style)"

**Hook (0:00-0:30):**
[Split screen: Student proof vs AP Rubric]
**Voiceover:** "This student lost 2 points on the AP exam. Can you spot what's missing?"

**Student Proof Shown:**
"f is continuous. f(0) = 1 > 0, f(1) = -1 < 0. By IVT, there's a root."

**Problem Setup (0:30-2:00):**
**Rubric Feedback (appearing on screen):**
- ✗ No explicit justification of continuity (lost 1 point)
- ✗ No statement of IVT conditions (lost 1 point)
- ✓ Conclusion correct

**Core Teaching (2:00-7:00):**
**On-screen: The 4-Step IVT Proof Template**

```
1. Claim: State what you're proving
2. Evidence: Calculate f(a) and f(b)
3. Reasoning:
   - PROVE f is continuous (polynomial/rational/composition)
   - STATE IVT explicitly
4. Conditions:
   - ✓ f continuous on [a,b] because...
   - ✓ f(a) and f(b) opposite signs
```

**Example Walkthrough (7:00-10:00):**
**Problem:** "Prove f(x) = x³ - 2x + 1 has a root in [0, 1]."

**Complete Proof (typing animation):**
```
Claim: f has a root in (0, 1).

Evidence:
f(0) = 0³ - 2(0) + 1 = 1
f(1) = 1³ - 2(1) + 1 = 0

Reasoning:
f is continuous on [0, 1] because it is a polynomial, and polynomial functions are continuous on their entire domain.

Since f(0) = 1 > 0 and f(1) = 0, the function changes sign on the interval [0, 1].

Conditions Verified:
✓ f continuous on [0, 1]: polynomial
✓ f(0) > 0 and f(1) = 0: opposite signs

By the Intermediate Value Theorem, there exists c in (0, 1) such that f(c) = 0.

Therefore, f has a root in (0, 1).
```

**Call to Action:**
"Write AP-style proofs. Earn 🏛️ Architect Badge. 150 XP."

---

### AP CALCULUS BC - Week 2 Video

**Title:** "Week 2: Prove Series Convergence Like a Pro"

**Hook:** "Most BC students write 'by Ratio Test' without showing the limit calculation. Here's what AP graders want to see."

**Core Teaching:**
**Complete AST Proof Template**
1. State the test
2. Define aₙ
3. Check alternating
4. Prove decreasing (show derivative if needed)
5. Prove limit is zero
6. Conclude

**Example:** Σ(-1)ⁿ⁺¹/n convergence proof with FULL justification

**XP:** 180 XP

---

### AP STATISTICS - Week 2 Video

**Title:** "Week 2: How to Verify ALL Inference Conditions"

**Hook:** "This 2-sample t-test lost points for 'forgetting' independence. Here's the checklist."

**Core Teaching:**
**2-Sample T-Test Condition Checklist**
1. Random samples (state HOW randomized)
2. Independence within groups (10% rule with calculation)
3. Independence between groups (state why)
4. Normality (check n ≥ 30 OR use CLT OR check for outliers)

**Example:** Complete 2-sample t-test setup with all conditions explicitly verified

**XP:** 150 XP

---

## Week 3 Videos

### AP CALCULUS AB - Week 3 Video

**Title:** "Week 3: Particle Motion + MVT Synthesis"

**Hook:** "No scaffolding. No hints. Just you vs a multi-step problem. Welcome to Week 3."

**Core Teaching:**
- Show blank CERC template
- Demonstrate thinking process out loud
- Combine particle motion (finding when v(t) = 0) + MVT (finding average velocity)

**Example:** 4-part particle motion problem with MVT application, complete solution

**XP:** 180 XP

---

### AP CALCULUS BC - Week 3 Video

**Title:** "Week 3: Parametric Arc Length from Scratch"

**Hook:** "Parametric curves. Arc length. No formula sheet. Can you remember AND apply it correctly?"

**Example:** Find arc length of x(t) = t³, y(t) = t² from t=0 to t=2, with complete justification

**XP:** 210 XP

---

### AP STATISTICS - Week 3 Video

**Title:** "Week 3: Correlation vs Causation + Study Design"

**Hook:** "Students who eat breakfast score higher on SATs. Did breakfast CAUSE higher scores? Here's how to answer like a statistician."

**Core Teaching:**
- Observational study vs experiment
- Identifying confounders
- Designing RCT to test causation
- Using non-deterministic language

**Example:** Critique observational study + design proper experiment

**XP:** 180 XP

---

## Week 4 Videos

### AP CALCULUS AB - Week 4 Video

**Title:** "Week 4: Boss Battle Preview - What to Expect"

**Hook:** "3 phases. 1 team. 15-minute timed curveball. Are you ready?"

**Content:**
- Walk through Boss Battle structure
- Show Phase 1 example (individual setup)
- Explain Phase 2 collaboration strategy
- Preview Phase 3 curveball scenario
- Time management tips

**Visual:** Dramatic meteor background, timer animations, team collaboration graphics

**Call to Action:** "Beat the Boss. Earn ⚔️ Boss Slayer Badge. 195 XP."

---

### AP CALCULUS BC - Week 4 Video

**Title:** "Week 4: BC Boss Battle - Polar Curve Challenge"

**Hook:** "Polar area + arc length + speed calculation. Under pressure. With a curveball. This is BC Week 4."

**Content:** Same structure as AB but with BC-specific polar problem

**XP:** 225 XP

---

### AP STATISTICS - Week 4 Video

**Title:** "Week 4: Critique a Real Drug Study (Boss Battle)"

**Hook:** "A pharmaceutical company claims their drug works. Your job: find the flaws in their study."

**Content:** Walk through study critique Boss Battle with placebo effect curveball

**XP:** 195 XP

---

# VISUAL STYLE CONSISTENCY (All Prompts)

**Typography:**
- Headers: Inter Bold, 32-48pt
- Body: Inter Regular, 16-18pt
- Code/Math: JetBrains Mono, 14-16pt

**Colors (Hex Codes):**
- Background: #0F172A (dark navy)
- Week 1-2 Accent: #06B6D4 (cyan)
- Week 3 Accent: #A855F7 (purple)
- Week 4 Accent: #EF4444 → #F97316 (red-orange gradient)
- Success: #10B981 (green)
- Warning: #EF4444 (red)
- Text Primary: #FFFFFF (white)
- Text Secondary: #94A3B8 (light gray)

**Icons (Lucide React Style):**
- Week 1: AlertTriangle ⚠️
- Week 2: CheckCircle ✓
- Week 3: Target 🎯
- Week 4: Trophy ⚔️

**Layout:**
- Max width: 1200px (infographics)
- Padding: 40px
- Card radius: 16px
- Shadow: 0 8px 32px rgba(0, 0, 0, 0.4)

---

**END OF PROMPTS**

Total: 12 Infographic Prompts + 12 Video Scripts = 24 Complete Prompts
