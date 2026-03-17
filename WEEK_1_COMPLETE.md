# Week 1: Error-Forcing Problems — COMPLETE ✅

## 🎯 Implementation Summary

Successfully implemented **Week 1: Error-Forcing Problems** - a complete interactive CERC training system with Claude Socratic feedback.

---

## 📦 Deliverables

### 1. Week 1 Content Data (`data/week-1-content.ts`)

**3 Error-Forcing Problems:**

#### Problem 1: MVT Discontinuity Trap
- Function: f(x) = 1/x² on [-1, 1]
- Trap: Discontinuity at x=0 inside interval
- Key Learning: MVT requires continuity on [a,b]

#### Problem 2: IVT Jump Discontinuity
- Function: Piecewise with jump at x=1
- Trap: IVT needs continuity, but function jumps
- Key Learning: IVT fails when continuity breaks

#### Problem 3: MVT Non-Differentiable Point
- Function: h(x) = |x| on [-2, 2]
- Trap: Continuous but not differentiable at x=0
- Key Learning: MVT needs BOTH continuity AND differentiability

**Each problem includes:**
- Problem statement (LaTeX formatted)
- Error category (CONDITION_BYPASS)
- The trap explanation
- Correct CERC response (for Claude reference)
- Sentence frames (full scaffolding)
- Theorem info (name, statement, hypotheses)
- 3-level Socratic hints

---

### 2. Week Page Component (`app/student/week/[weekNumber]/page.tsx`)

**Split-Screen Layout:**

**LEFT Panel:**
- Problem statement card
- Theorem info card (name, statement, hypotheses)
- CERC sentence frames card
- Hint system (3 levels)
- "Need a Hint?" button

**RIGHT Panel:**
- CERC response form
- Claude feedback display
- Next problem button
- Complete week button

**Features:**
- Problem progression (1/3, 2/3, 3/3)
- Dynamic hint levels
- Loading states
- Feedback persistence

---

### 3. CERC Form Component (`components/student/week-cerc-form.tsx`)

**4 CERC Fields:**
- Claim (required)
- Evidence (required, monospace for math)
- Reasoning (required)
- Conditions (required)

**Features:**
- Character counters
- Sentence frame display (for full scaffolding)
- Submit validation
- Loading state with spinner
- Disabled state during submission

---

### 4. Theorem Tooltip Component (`components/student/theorem-tooltip.tsx`)

**Displays:**
- Theorem name (e.g., "Mean Value Theorem")
- Theorem statement
- Numbered hypotheses list
- Critical reminder about verifying ALL conditions

**Design:**
- Indigo/blue gradient theme
- Glassmorphic card
- Icons for visual hierarchy
- Warning box for emphasis

---

### 5. Claude Socratic Feedback API (`app/api/student/cerc/submit/route.ts`)

**Workflow:**
1. Receives student's CERC response
2. Fetches problem data from week-1-content.ts
3. Sends to Claude Opus 4.6 with Socratic prompt
4. Returns HTML-formatted feedback
5. Saves CERC response to database

**Claude Prompt Structure:**
- Problem context
- Correct answer (for reference)
- The trap explanation
- Student's response
- Socratic principles:
  - Interrogative, not evaluative
  - Specific, not generic
  - Constructive guidance
  - Adaptive to student level

**Feedback Levels:**
- Got it right → Praise specificity
- Verified conditions but missed trap → Ask about specific condition
- Skipped conditions → Ask what must be verified
- Incorrect application → Point to critical point

---

### 6. Student Dashboard Integration (`components/student/student-dashboard.tsx`)

**New Section: "CERC Training - Week 1"**

Located above FRQ cards, displays:
- Week title: "Week 1: Error-Forcing Problems"
- Description: "Breaking empirical illusions..."
- Stats:
  - 3 Problems
  - 15-20 min each
  - Full Scaffolding
- "Start Training" button → `/student/week/1`
- Green "Available Now" badge

**Design:**
- Blue/purple gradient theme
- 3D card hover effect
- Glassmorphic design
- Sparkles icon

---

## 🎬 User Journey

```
Student Dashboard
  ↓
Click "Start Training" on Week 1 card
  ↓
Week 1 Page loads (Problem 1/3: MVT Discontinuity Trap)
  ↓
LEFT: Reads problem statement
LEFT: Reviews theorem info (MVT hypotheses)
LEFT: Sees sentence frames
  ↓
RIGHT: Fills out CERC form (Claim, Evidence, Reasoning, Conditions)
  ↓
Clicks "Submit for Feedback"
  ↓
Claude analyzes response using Socratic method
  ↓
Feedback appears in RIGHT panel (HTML formatted)
  ↓
Student reads feedback, understands flaw
  ↓
Optional: Clicks "Need a Hint?" for additional guidance
  ↓
Clicks "Next Problem" → Problem 2/3
  ↓
Repeats for problems 2 and 3
  ↓
After Problem 3: Clicks "Complete Week 1"
  ↓
Returns to dashboard with XP earned
```

---

## 🧪 Testing

### Test Case 1: Correct Response (MVT Problem)

**Student writes:**
- Claim: "MVT does not apply"
- Conditions: "f(x) = 1/x² is discontinuous at x=0..."

**Expected:**
- Claude praises correct identification
- Suggests minor improvements to evidence notation
- Encourages similar rigor in future problems

### Test Case 2: Missing Conditions

**Student writes:**
- Claim: "By MVT, there exists c where f'(c) = 0"
- Conditions: (empty or vague)

**Expected:**
- Claude asks: "What conditions must be verified before applying MVT?"
- Points to continuity hypothesis
- Guides toward checking x=0

### Test Case 3: Hint System

**Student clicks "Need a Hint?"**

**Level 1:** "Check the domain of the function carefully. Is there any value in [-1, 1] where f(x) is not defined?"

**Level 2:** "Your conditions section needs attention. You need to verify continuity on [a,b] before applying MVT. What happens at x = 0?"

**Level 3:** "The function f(x) = 1/x² is discontinuous at x = 0... MVT does not apply."

---

## 🔗 Integration Points

### ✅ Completed
- Week 1 content data with 3 problems
- Split-screen UI with problem + form
- CERC form with sentence frames
- Claude Socratic feedback integration
- Hint system (3 levels)
- Student dashboard link

### 🔄 Ready for Future Phases

**Phase D (XP & Gamification):**
- Award XP on problem completion
- Track reasoning stage progression
- Unlock "The Skeptic" badge (survives error-forcing trap)

**Phase F (Firebase):**
- Store CERC responses in Firestore
- Track problem completion status
- Save hint usage data

**Phase C Expansion:**
- Week 2: Condition Verification (structural scaffolding)
- Week 3: Global Argumentation (minimal scaffolding)
- Week 4: Boss Battle (timed, no scaffolding)

---

## 📊 Week 1 Problem Coverage

| Problem | Theorem | Trap Type | Learning Objective |
|---------|---------|-----------|-------------------|
| w1-mvt-001 | Mean Value Theorem | Discontinuity at x=0 | Check continuity on [a,b] |
| w1-ivt-001 | Intermediate Value Theorem | Jump discontinuity | Continuity requirement |
| w1-mvt-002 | Mean Value Theorem | Non-differentiable at x=0 | Check differentiability on (a,b) |

**Common Error:** Students verify one condition but forget the other (e.g., verify continuity but not differentiability)

**Learning Outcome:** Students learn to systematically verify ALL theorem hypotheses before applying conclusions.

---

## 🎨 Design Highlights

### Color Scheme
- **Problem cards:** Blue gradient
- **Theorem info:** Indigo gradient
- **Sentence frames:** Green gradient
- **Hints:** Amber/orange gradient
- **Feedback:** Purple/pink gradient

### UI Components
- Glassmorphic cards with backdrop blur
- Gradient borders on hover
- Smooth transitions (500ms)
- Lucide icons throughout
- Scrollable panels with custom scrollbars

### Typography
- Headers: 2xl-4xl font-bold
- Body: sm-base
- Math: font-mono
- Emphasis: font-semibold

---

## 🚀 Next Steps

### Week 1 Enhancements (Optional)
1. **Add KaTeX rendering** for LaTeX math in problem statements
2. **Save progress** mid-problem (auto-save draft)
3. **Show hint usage** in final report
4. **Peer comparison** (anonymized difficulty ratings)

### Critical Path (Week 2-4)
**Week 2: Condition Verification**
- Structural scaffolding (theorem hints only)
- Problems: MVT/IVT/FTC with complete condition verification
- Focus: Systematic hypothesis checking

**Week 3: Global Argumentation**
- Minimal scaffolding (one general hint)
- Problems: Cross-topic justification
- Focus: Communication precision

**Week 4: Boss Battle**
- No scaffolding, timed
- Multi-phase collaborative challenge
- Full cohort working together

---

## 📝 Summary

**Week 1 Status:** ✅ **COMPLETE**

**What we achieved:**
- ✅ 3 error-forcing problems with full content
- ✅ Split-screen interactive UI
- ✅ CERC form with sentence frames
- ✅ Claude Socratic feedback (interrogative, adaptive)
- ✅ 3-level hint system
- ✅ Theorem info cards
- ✅ Student dashboard integration
- ✅ Problem progression tracking
- ✅ Premium glassmorphic design

**Impact:**
- Students learn to identify theorem condition traps
- Develops habit of verifying hypotheses before applying theorems
- Socratic feedback guides discovery, not just correction
- Foundation for reasoning stage progression (empirical → generic → formal)

**Time to complete:** ~4 hours

---

*Week 1 completed: 2025-03-10*
*Next: Week 2 (Condition Verification) or Phase D (XP & Gamification)*
