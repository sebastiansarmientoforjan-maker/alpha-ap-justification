# NotebookLM Infographic Prompt - AP Math Justification Training

## Context & Purpose

Create an infographic for a **4-week web-based justification training program** for 10 AP Math students (9 AP Calculus AB/BC, 1 AP Statistics) at Alpha High School.

**Core Problem:** Students are procedurally fluent but fail AP exam justification requirements. They calculate correctly but cannot prove their answers rigorously.

**Core Solution:** Move students through the Harel & Sowder reasoning taxonomy: empirical → generic → formal deductive reasoning.

---

## Visual Design Language

### Color Palette (CRITICAL - Match Website)
- **Background:** Dark gradient (navy/indigo: #0F172A → #1E293B → #334155)
- **Primary Accent:** Cyan/Electric Blue (#06B6D4, #22D3EE) - used for highlights, active states
- **Secondary Accent:** Purple/Violet (#A855F7, #C084FC) - used for special elements
- **Success/Progress:** Green (#10B981) for checkmarks, completed states
- **Boss Battle (Week 4):** Red/Orange gradient (#EF4444 → #F97316) - distinct from other weeks
- **Text:** White primary, light gray secondary (#E2E8F0, #94A3B8)

### Design Style
- **Modern, sleek, tech-forward** (NOT academic/traditional)
- **Dark theme with glowing accents** (like a high-end SaaS product)
- **Subtle gradients and shadows** for depth
- **Clean typography** - sans-serif, bold headers
- **Icons over illustrations** - use lucide-react style icons (geometric, minimal)
- **NO clipart, NO stock photos** - pure digital design

### Visual Hierarchy
1. **Week numbers** - Large, bold, with accent color
2. **Framework (CERC)** - Highlighted as central concept
3. **Progression arrows** - Show clear path Week 1 → 2 → 3 → 4
4. **Gamification elements** - XP badges as secondary visual layer

---

## Content Structure

### Header Section
**Title:** "AP Math Justification Training: 4-Week Intensive"
**Subtitle:** "From Empirical Guessing to Formal Deductive Proof"
**Tagline:** "Target the skill gap: Calculate correctly ✓ | Justify rigorously ✗ → ✓"

### The Problem (Top Section - Use Red/Warning Color)
"80% of AP Math students lose points NOT on calculations, but on incomplete justifications."

**Examples of What Students Miss:**
- ❌ "f is continuous" (without proving it)
- ❌ "Therefore, by MVT..." (without verifying conditions)
- ❌ "The sample is representative" (without checking independence/randomness)

### The Solution: CERC Framework (Center - Prominent Box)

Display as a **4-column grid** with icons:

| **C** | **E** | **R** | **C** |
|-------|-------|-------|-------|
| **Claim** | **Evidence** | **Reasoning** | **Conditions** |
| The conclusion | Mathematical data/computation | Theorem connecting E to C | Explicit verification of theorem hypotheses |

**Visual:** Each letter in a circle with accent color glow. Arrows connecting C → E → R → C to show flow.

---

## 4-Week Progression (Main Content - Vertical Flow)

### Week 1: Break Empirical Illusions 🔍
**Color:** Cyan accent (#06B6D4)
**Icon:** AlertTriangle (⚠️)
**Focus:** Error-forcing problems

**What Students Do:**
- Face problems where theorems DON'T apply (e.g., MVT on f(x)=1/x² over [-1,1])
- Learn to verify conditions FIRST before applying theorems
- **Scaffolding:** Full CERC sentence frames provided

**Example Problem:**
> "Apply MVT to f(x) = 1/x² on [-1,1]. What goes wrong?"
>
> **Trap:** Function not continuous at x=0 → MVT invalid → no solution exists

**Badge:** 🔍 "The Skeptic" - Survived error-forcing without falling for empirical trap
**XP Available:** 120 XP

---

### Week 2: Rigorous Condition Verification ✓
**Color:** Cyan accent (#06B6D4)
**Icon:** CheckCircle (✓)
**Focus:** When theorems DO apply

**What Students Do:**
- Prove ALL conditions satisfied before applying IVT/MVT/EVT (Calc) or inference conditions (Stats)
- Write complete arguments with explicit condition checks
- **Scaffolding:** Structural outline only (no sentence frames)

**Example Problem:**
> "Prove that f(x) = x³ - 2x + 1 has a root in [0, 1] using IVT."
>
> **Required:**
> - Prove f is continuous on [0,1]
> - Show f(0) and f(1) have opposite signs
> - State IVT explicitly
> - Conclude root exists

**Badge:** 🏛️ "The Architect" - Flawless CERC proof without hints
**XP Available:** 150 XP

---

### Week 3: Synthesis Without Scaffolding 🎯
**Color:** Purple accent (#A855F7)
**Icon:** Target (🎯)
**Focus:** Multi-concept integration + professional communication

**What Students Do:**
- Synthesize multiple AP concepts in one problem
- Write arguments with context, units, precise language
- Address causation, study design, reliability (Stats)
- **Scaffolding:** NONE - blank canvas like AP exam

**Example Problem:**
> "Particle motion problem requiring MVT + related rates + implicit differentiation. Justify ALL steps."

**Badge:** 🏆 "The Synthesizer" - Multi-concept mastery
**XP Available:** 180 XP

---

### Week 4: Boss Battle ⚔️
**Color:** Red/Orange gradient (#EF4444 → #F97316) - DISTINCT from other weeks
**Icon:** Trophy (🏆)
**Focus:** Timed, collaborative, curveball challenge

**What Students Do:**
- **Phase 1 (Individual, untimed ~15 min):** Untangle complex problem setup
- **Phase 2 (Team, untimed ~20 min):** Construct unified CERC argument as cohort
- **Phase 3 (Team, TIMED 15 min):** Adapt to curveball - new constraint introduced mid-battle

**Example Curveball:**
> Phase 2: "The tank drains at constant rate..."
>
> Phase 3: "ALERT: The drain clogged at t=7 minutes. Recalculate."

**Badge:** ⚔️ "Boss Slayer" - Completed all 3 phases with rigorous justification under pressure
**XP Available:** 195 XP (highest reward)

---

## Gamification Layer (Side Panel or Bottom)

### XP System
**Total Available:** 645 XP across 4 weeks

**How to Earn XP:**
- +50 XP - Correctly identify broken theorem condition
- +100 XP - Identify logical flaw in peer argument
- +150 XP - Submit unassisted complete CERC proof (Week 3+)

**Visual:** Progress bar showing XP accumulation

### Badge System
Display badges as **circular icons with glow effects:**
- 🔍 The Skeptic (Week 1)
- 🏛️ The Architect (Week 2)
- 🎯 The Synthesizer (Week 3)
- ⚔️ Boss Slayer (Week 4 - largest, most prominent)

**NO leaderboards** - badges are personal achievements, not competitive

---

## Key Differentiators (Callout Box)

**What Makes This Different from Traditional AP Prep:**

✅ **Targets ONE specific skill gap** - justification, not content review
✅ **Error-forcing pedagogy** - learn by breaking things first
✅ **Gamified progression** - XP, badges, Boss Battle (not dry drills)
✅ **Collaborative finale** - Week 4 is team-based, not individual
✅ **Real-time AI feedback** - Socratic hints, not just right/wrong
✅ **Timed pressure training** - Phase 3 simulates AP exam time constraints

---

## Success Metrics (Bottom Section)

**Individual Goal:** Complete all 4 weeks, earn 4 badges, demonstrate formal reasoning on Boss Battle

**Cohort Goal:** 60%+ completion rate, 80%+ students show reasoning advancement

**AP Impact:** 10%+ improvement on FRQ justification scores vs baseline

---

## Technical Stack (Footer - Small Text)
Built with Next.js 14, Claude API (Anthropic), Firebase, Tailwind CSS, Framer Motion, KaTeX math rendering

---

## Tone & Voice

- **Professional but engaging** (NOT stuffy academic)
- **Challenge-focused** ("Can you survive Week 1's traps?")
- **Skill-building language** (NOT "learn" but "master", "unlock", "conquer")
- **Direct address** ("You will face problems where...")
- **Urgency without panic** ("3 weeks until AP exam - train now")

---

## DO NOT Include

❌ Generic study tips
❌ Content review checklists (derivatives, integrals, etc.)
❌ Practice problem sets (this is about justification method, not content)
❌ "Tips and tricks" language (feels gimmicky)
❌ Stock photos of students studying
❌ Traditional school imagery (chalkboards, textbooks)

---

## Layout Recommendations

### Option 1: Vertical Flow Infographic
```
┌─────────────────────────┐
│  HEADER + PROBLEM       │ ← Red warning banner
├─────────────────────────┤
│  CERC FRAMEWORK         │ ← Large, centered, 4-column
├─────────────────────────┤
│  WEEK 1 (Cyan)         │ ← Each week = colored section
│  WEEK 2 (Cyan)         │
│  WEEK 3 (Purple)       │
│  WEEK 4 (Red/Orange)   │ ← Boss Battle stands out
├─────────────────────────┤
│  GAMIFICATION (XP/Badges)│
├─────────────────────────┤
│  SUCCESS METRICS        │
└─────────────────────────┘
```

### Option 2: Circular Journey Map
```
       Week 1 (Start)
            ↓
       Week 2
            ↓
       Week 3
            ↓
    Week 4 (Boss Battle)
            ↓
      AP EXAM READY ✓
```
With CERC framework in the center, radiating outward.

---

## Key Message (Emphasize This)

**"This isn't about learning more calculus. This is about proving you know it."**

The program targets the #1 reason AP Math students lose points: **incomplete justifications**.

- You know the derivative of x² is 2x ✓
- But can you prove f is differentiable at x=c? ✗
- Can you verify MVT conditions before applying it? ✗
- Can you justify your statistical inference assumptions? ✗

**4 weeks. 4 badges. 1 skill gap closed.**

---

## Technical Notes for NotebookLM

1. **Maintain dark theme throughout** - this is a modern tech product, not a school worksheet
2. **Use geometric shapes** - circles, rounded rectangles, arrows (NOT hand-drawn style)
3. **Emphasize the progression** - Week 1 → 2 → 3 → 4 with clear visual flow
4. **Make Boss Battle visually distinct** - it's the culminating challenge
5. **CERC framework is the hero** - it should be the most prominent visual element
6. **Include code-like aesthetic** - subtle monospace fonts for examples, terminal-style boxes

---

## Example Visual Hierarchy (Priority Order)

1. **CERC Framework** (largest visual element)
2. **Week 4 Boss Battle** (most colorful, dramatic)
3. **4-Week Progression** (clear path)
4. **Problem vs Solution** (before/after contrast)
5. **Gamification layer** (engaging but secondary)
6. **Success metrics** (data-driven validation)

---

## Final Instruction

Create an infographic that looks like it belongs to a **premium SaaS educational platform**, NOT a traditional school handout. Think Duolingo meets Notion meets AP Exam prep. Dark, sleek, modern, with just enough gamification to be engaging but professional enough for high-achieving students.

The infographic should make a student think: *"This looks way more interesting than my AP review book."*
