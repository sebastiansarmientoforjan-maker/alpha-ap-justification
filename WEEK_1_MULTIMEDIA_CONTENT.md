# Week 1: Multimedia Content & Production Guide

## Video Scripts

### Video 1: "The Discontinuity Trap" (3-5 minutes)

**Target:** Introduce error-forcing pedagogy with a concrete example

**Script:**

---

**[OPEN: Split screen - LEFT: f(x) = 1/x² graph, RIGHT: Instructor]**

**Instructor:**
"Let me show you a problem that trips up 70% of AP Calculus students."

**[ANIMATE: Problem statement appears]**

**Text on screen:**
> Consider f(x) = 1/x² on [-1, 1].
> Apply the Mean Value Theorem.

**Instructor:**
"Looks straightforward, right? You know MVT. You've done dozens of these. Let's try it."

**[ANIMATE: Calculations appear]**

**Text:**
```
f(-1) = 1
f(1) = 1
Average rate: (1-1)/(1-(-1)) = 0

By MVT, ∃c where f'(c) = 0
```

**Instructor:**
"So we need to find where the derivative equals zero. Let's take the derivative:"

**[ANIMATE: Derivative calculation]**

**Text:**
```
f(x) = 1/x² = x^(-2)
f'(x) = -2x^(-3) = -2/x³
```

**Instructor:**
"Wait... -2/x³ can never equal zero. No matter what x we choose, we get a non-zero value. So where's the c that MVT guarantees?"

**[PAUSE - Red question marks appear on screen]**

**Instructor:**
"Here's the trap: **MVT doesn't apply here at all.**"

**[ANIMATE: Graph highlights discontinuity at x=0]**

**Instructor:**
"Look at x = 0. The function is undefined there. It has a vertical asymptote—a discontinuity. And that discontinuity is INSIDE the interval [-1, 1]."

**[HIGHLIGHT: MVT hypotheses box]**

**Text:**
```
Mean Value Theorem requires:
1. f is continuous on [a,b] ✗ VIOLATED
2. f is differentiable on (a,b)
```

**Instructor:**
"The FIRST hypothesis is violated. When conditions aren't met, the theorem doesn't guarantee anything. No c exists—not because the math broke, but because we tried to use a theorem that doesn't apply."

**[ANIMATE: Side-by-side comparison]**

**LEFT:** "What most students write"
```
By MVT, ∃c where f'(c) = 0
Solving: -2/x³ = 0... no solution?
```

**RIGHT:** "What you should write"
```
Checking MVT conditions:
1. Continuity on [-1,1]?
   f(x) = 1/x² is undefined at x=0 ∈ [-1,1]
   → NOT continuous ✗

Since the first hypothesis fails, MVT does not apply.
```

**Instructor:**
"This is error-forcing pedagogy. The problem is designed to break if you skip condition verification. And this is exactly what Week 1 trains you to do: **identify the trap before falling into it.**"

**[ANIMATE: Key takeaway text]**

**Text:**
> **Key Lesson:**
> Verify ALL theorem conditions BEFORE applying conclusions.
> If conditions fail, the theorem doesn't guarantee anything—even if the problem looks solvable.

**[CLOSE: Week 1 logo with CTA]**

**Instructor:**
"Ready to train your radar for these traps? Let's begin Week 1."

**[END: 3:42]**

---

### Video 2: "Why Conditions Matter" (2-3 minutes)

**Target:** Explain the WHY behind condition verification

**Script:**

---

**[OPEN: Animated theorem as a bridge]**

**Narrator (voiceover):**
"Imagine a theorem as a bridge."

**[ANIMATE: Bridge appears with labeled supports]**

**Narrator:**
"The bridge—the conclusion—only stands if the supports—the hypotheses—are solid."

**[ANIMATE: One support crumbles, bridge collapses]**

**Narrator:**
"Remove ONE support, and the whole structure fails. The theorem makes NO guarantees when conditions aren't met."

**[CUT TO: Three examples in rapid succession]**

**Example 1: MVT**
- Visual: Function with discontinuity
- Text: "No continuity? No MVT guarantee."

**Example 2: IVT**
- Visual: Piecewise function with jump
- Text: "Jump discontinuity? IVT doesn't apply."

**Example 3: Two-Sample t-Test**
- Visual: Same students tested twice
- Text: "Paired data? Can't use two-sample test."

**[ANIMATE: Text appears]**

**Text:**
> **On the AP Exam:**
> "Justify your answer" = "Verify the conditions"
>
> Saying "by MVT" without checking conditions = 0 points
> Even if your final answer is correct.

**[CLOSE: CTA]**

**Narrator:**
"Week 1 teaches you to check the supports before crossing the bridge. Let's build that habit."

**[END: 2:15]**

---

## Infographic Designs

### Infographic 1: "Common Theorem Traps" (Calculus)

**Format:** Vertical infographic (800x2400px)

**Sections:**

1. **Header**
   - Title: "3 Theorem Traps That Cost You AP Points"
   - Subtitle: "Learn to spot these before applying theorems"

2. **Trap 1: The Discontinuity Trap**
   - Icon: Function graph with break
   - Theorem: Mean Value Theorem
   - The Trap: "Discontinuity at x=0 inside [a,b]"
   - What Happens: "MVT doesn't guarantee c exists"
   - Red Flag: "Always check continuity on [a,b] first"

3. **Trap 2: The Non-Differentiable Trap**
   - Icon: Absolute value function |x|
   - Theorem: Mean Value Theorem
   - The Trap: "Sharp corner at x=0"
   - What Happens: "f is continuous but not differentiable"
   - Red Flag: "MVT needs BOTH continuity AND differentiability"

4. **Trap 3: The Jump Discontinuity Trap**
   - Icon: Piecewise function with jump
   - Theorem: Intermediate Value Theorem
   - The Trap: "Function jumps at x=1"
   - What Happens: "IVT can't guarantee intermediate value"
   - Red Flag: "Check for jumps, holes, or asymptotes"

5. **Footer: The CERC Defense**
   - "Use the CERC framework to avoid these traps"
   - Quick CERC breakdown:
     - Claim: State conclusion
     - Evidence: Show your work
     - Reasoning: Name the theorem
     - **Conditions: Verify ALL hypotheses ← This stops the traps**

**Color Scheme:** Dark background with red/orange warnings, green checkmarks for correct approach

---

### Infographic 2: "Statistics Inference Traps"

**Format:** Horizontal infographic (2400x800px)

**Sections:**

1. **Trap 1: Independence Violation**
   - Visual: Same students, before/after
   - Test Used: Two-sample t-test
   - The Problem: "Data are paired, not independent"
   - Correct Procedure: "Use paired t-test instead"

2. **Trap 2: Non-Random Sample**
   - Visual: AP Statistics class (convenience sample)
   - Inference Goal: "Generalize to all students"
   - The Problem: "Sample is not random → biased"
   - Red Flag: "Can't use confidence intervals for population inference"

3. **Trap 3: Small Sample + Skewed Data**
   - Visual: n=8, left-skewed histogram
   - Test Used: One-sample t-test
   - The Problem: "Can't rely on CLT (n<30), data not normal"
   - Red Flag: "Check normality condition before proceeding"

**Color Scheme:** Blue/teal theme with yellow warning icons

---

## NotebookLM Content Recommendations

### Sources to Upload for Week 1 Study Materials

1. **Primary Sources (Upload to NotebookLM):**
   - Week 1 problem statements (all 3 Calculus problems)
   - Week 1 problem statements (all 3 Statistics problems)
   - CERC framework explanation document
   - Theorem hypothesis reference sheet (MVT, IVT, FTC)
   - Inference condition checklist (t-tests, confidence intervals)

2. **Supplementary Sources:**
   - AP Calculus scoring guidelines (FRQ rubrics with justification examples)
   - AP Statistics scoring guidelines (inference condition emphasis)
   - Common student errors document from College Board
   - Harel & Sowder reasoning stages research paper (excerpt)

### NotebookLM Prompts for Students

**After uploading sources, students can ask:**

1. **Understanding Conditions:**
   - "What conditions must be verified before applying the Mean Value Theorem?"
   - "Why does the IVT require continuity on a closed interval?"
   - "What's the difference between independence in two-sample tests vs paired tests?"

2. **Problem-Specific Guidance:**
   - "In the MVT discontinuity problem, why doesn't the theorem apply?"
   - "What should I check first when applying the IVT to a piecewise function?"
   - "How do I verify the random sampling condition for a confidence interval?"

3. **CERC Framework Help:**
   - "What's the difference between Evidence and Reasoning in CERC?"
   - "How detailed should my Conditions section be?"
   - "Show me an example of a complete CERC response for an MVT problem."

4. **Exam Strategy:**
   - "What justification errors cost the most points on AP FRQs?"
   - "How should I structure my response when a theorem doesn't apply?"
   - "What keywords do AP graders look for in justification questions?"

### Auto-Generated Study Guide (via NotebookLM)

**Request from NotebookLM:**
> "Create a study guide for Week 1: Error-Forcing Problems. Include:
> 1. A condition verification checklist for each theorem
> 2. Common traps and how to spot them
> 3. CERC examples for both 'theorem applies' and 'theorem does not apply' scenarios
> 4. Practice self-check questions with explanations"

**Expected Output:**
- 5-7 page PDF study guide
- Organized by theorem/procedure
- Visual checklist format
- Example problems with full CERC responses
- Self-assessment questions

---

## Interactive Web Components (Bonus)

### 1. Condition Verification Checklist Widget

**Component:** Interactive checklist that appears in left panel during problems

**Features:**
```
☐ Continuity on [a,b]
  ├─ Check for discontinuities
  ├─ Verify domain includes [a,b]
  └─ Check limits at endpoints

☐ Differentiability on (a,b)
  ├─ Check for sharp corners
  ├─ Check for cusps
  └─ Verify f'(x) exists everywhere
```

**Behavior:**
- Students can check items as they verify
- Grays out items that don't apply to current problem
- Shows green checkmark when all required items verified

### 2. Theorem Hypothesis Flashcards

**Component:** Flip cards in the introduction page

**Content:**
- Front: Theorem name (e.g., "Mean Value Theorem")
- Back: Hypotheses list with visual examples
- Interaction: Click to flip, swipe for next card

**Theorems to include:**
- Mean Value Theorem (2 hypotheses)
- Intermediate Value Theorem (2 hypotheses)
- Fundamental Theorem of Calculus (2 hypotheses)
- Two-Sample t-Test (3 conditions)
- Confidence Intervals (3 conditions)

### 3. "Spot the Trap" Mini-Game

**Component:** Interactive quiz in pre-assessment section

**Format:**
- Show graph or problem setup
- Student clicks where they think the issue is
- Instant feedback with explanation

**Example:**
- Show graph of f(x) = |x| on [-2, 2]
- Question: "Can you apply MVT here? Click the issue."
- Student clicks x=0
- Feedback: "Correct! Sharp corner means not differentiable at x=0."

---

## Production Checklist

### Videos
- [ ] Script review by Sebastian
- [ ] Record Video 1 (3-5 min)
- [ ] Record Video 2 (2-3 min)
- [ ] Add captions/subtitles
- [ ] Upload to platform (YouTube unlisted or Vimeo)
- [ ] Embed in introduction page

### Infographics
- [ ] Design Infographic 1 (Calculus traps)
- [ ] Design Infographic 2 (Statistics traps)
- [ ] Export high-res PNG (300dpi)
- [ ] Create thumbnail versions for web
- [ ] Add to /public/assets/week-1/

### NotebookLM Setup
- [ ] Compile all source documents
- [ ] Upload to NotebookLM project
- [ ] Generate initial study guide
- [ ] Create prompt library for students
- [ ] Share NotebookLM link in student dashboard

### Interactive Components
- [ ] Build condition checklist widget
- [ ] Create theorem flashcard component
- [ ] Develop "Spot the Trap" mini-game
- [ ] Test all interactive elements
- [ ] Integrate into Week 1 intro page

---

## Accessibility Notes

- All videos MUST have captions
- Infographics MUST have alt text descriptions
- Interactive components MUST be keyboard-navigable
- Color coding MUST not be the only indicator (use icons + text)
- Font sizes MUST meet WCAG 2.1 AA standards (18pt+ body text)

---

**Next Steps:**
1. Review scripts with Sebastian
2. Determine production timeline
3. Assign video recording/editing
4. Design infographics (Figma or Canva)
5. Set up NotebookLM project
6. Integrate multimedia into intro page component
