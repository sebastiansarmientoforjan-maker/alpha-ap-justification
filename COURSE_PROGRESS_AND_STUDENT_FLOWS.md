# Course Progress & Student Flows

**Last Updated:** 2026-03-22
**Overall Progress:** 75% (9/12 build steps complete, 2 partial)

---

## 1. BUILD PROGRESS (CLAUDE.md Build Order)

### ✅ COMPLETED STEPS (9/12)

**Step 1: Project Setup**
- Next.js 14 App Router
- Tailwind CSS + KaTeX math rendering
- Aceternity UI + Magic UI components
- GSAP animations
- Service layer architecture (`services/data/index.ts`)
- Mock adapter for development
- **Status:** ✅ COMPLETE

**Step 2: Auth & Protected Routes**
- TimeBack integration (production auth)
- Role-based access (student/admin)
- Protected routes with middleware
- Login/logout flow
- **Status:** ✅ COMPLETE (Firebase auth REMOVED per architecture decision)

**Step 3: Student Session View**
- Split-screen layout (`components/student/split-screen-session.tsx`)
- CERC form with KaTeX rendering
- Problem display component
- Theorem tooltips with progressive disclosure
- **Status:** ✅ COMPLETE

**Step 6: WOW Components**
- Spotlight (Aceternity)
- Animated Beam (Magic UI)
- Orbiting Circles reasoning orb (Magic UI)
- Meteors for AP Exam Simulation (Aceternity)
- Text Reveal (Aceternity)
- Shimmer Button (Magic UI)
- Blur Fade (Magic UI)
- **Status:** ✅ COMPLETE

**Step 7: XP + Badge System**
- XP tracking per student
- Badge unlock animations (GSAP)
- Progress header component
- Reasoning stage tracker (empirical → generic → formal)
- **Status:** ✅ COMPLETE

**Step 8: Admin Dashboard**
- Student list with reasoning stage timeline
- XP history + badge log per student
- Manual quiz trigger
- MathGrader.AI paste input
- FRQ review dashboard
- **Status:** ✅ COMPLETE

**Step 10: AP Exam Simulation Mode**
- Week 4 multi-phase collaborative challenge
- 3-phase structure (Individual → Team → Curveball)
- Meteors + Text Reveal animations
- Timed Phase 3
- **Status:** ✅ COMPLETE

**Step 11: TimeBack Adapter Stubs**
- OneRoster 1.2 API shapes
- QTI 3.0 API shapes
- ENV switch (`DATA_ADAPTER=mock|timeback`)
- **Status:** ✅ COMPLETE (stub only, not implemented)

---

### 🟡 PARTIAL STEPS (2/12)

**Step 4: Claude API Integration**
- Problem generation system prompt template exists
- API endpoint structure defined
- **Missing:** Live Anthropic API integration
- **Status:** 🟡 50% COMPLETE

**Step 5: AI Feedback Loop**
- Socratic dialogue structure defined
- 3 hint levels designed
- **Missing:** Live Claude API calls for feedback generation
- **Status:** 🟡 40% COMPLETE

---

### ❌ PENDING STEPS (2/12)

**Step 9: Exit Ticket System**
- Student reflection after each week
- Data feed for next week's Claude prompt calibration
- **Status:** ❌ NOT STARTED

**Step 12: Deploy to Vercel**
- Production deployment
- Environment variables configured
- **Status:** ❌ NOT STARTED

---

## 2. COURSE MATERIALS INTEGRATION

### 📁 Materials Location
```
public/course-materials/
├── calculus-ab/week1-4/(infographics/, videos/)
├── calculus-bc/week1-4/(infographics/, videos/)
└── statistics/week1-4/(infographics/, videos/)
```

### 🔗 How Materials Are Used

**Current Implementation:**

Materials are referenced in student session pages via static paths:

```typescript
// Example from app/student/week/1/page.tsx
const infographicPath = `/course-materials/${course}/week1/infographics/mvt-ivt-evt-traps.png`;
const videoPath = `/course-materials/${course}/week1/videos/identifying-random-samples.mp4`;
```

**Where They Appear:**
1. **Week Landing Pages:** Infographic displayed as hero image with Spotlight effect
2. **Instructions Pages:** Video embedded via VideoPlayer component
3. **Problem Solving Sessions:** Infographic available as reference in sidebar

**Status:**
- ✅ 12/12 Infographics uploaded and organized
- 🟡 5/12 Videos uploaded (7 generating now)
- ✅ File structure matches course/week hierarchy
- ⚠️ **TODO:** Dynamic loading based on student's course profile

---

## 3. STUDENT FLOWS BY COURSE

### 🎓 COURSE-SPECIFIC DIFFERENCES

All three courses follow the same 4-week progression but with **differentiated content:**

| Week | AB Focus | BC Focus | Statistics Focus |
|------|----------|----------|------------------|
| **1** | MVT/IVT/EVT traps | Series convergence traps + parametric | Randomness illusion + sampling |
| **2** | Rigorous theorem proofs | Series tests + polar derivatives | Inference conditions checklist |
| **3** | Multi-concept integration | Parametric arc length + polar area | Causation vs correlation |
| **4** | AP Exam Simulation (related rates) | AP Exam Simulation (polar curves) | AP Exam Simulation (study design critique) |

---

### 📊 DETAILED FLOW: AP CALCULUS AB STUDENT

**Student Profile:** Elle Liemandt (ID: 5437)
**Course:** AP Calculus AB
**Current XP:** 159 XP/week
**Accuracy:** 98.3%

#### **Phase 1: Week 1 - Error-Forcing Problems**

**1.1 Login & Dashboard**
```
URL: /student
Component: student-dashboard.tsx
Content:
  - Welcome message
  - Current reasoning stage: "empirical"
  - XP progress bar: 0/645 XP
  - Week 1 card (unlocked, glowing)
  - Weeks 2-4 cards (locked)
```

**1.2 Week 1 Landing Page**
```
URL: /student/week/1
Component: week/1/page.tsx
Materials:
  - Infographic: /course-materials/calculus-ab/week1/infographics/mvt-ivt-evt-traps.png
  - Video: (pending generation)

Content Tabs:
  - PROBLEM: "Why do students fail MVT/IVT problems?"
  - SOLUTION: "Verify conditions FIRST"
  - METHOD: "4-step CERC framework"
  - PATH: "This week's learning journey"

Actions:
  - [View Instructions] → /student/week/1/practice/instructions
  - [Start Practice] → /student/week/1/practice
```

**1.3 Instructions Page**
```
URL: /student/week/1/practice/instructions
Component: practice/instructions/page.tsx
Materials:
  - Video player with AB Week 1 content (when available)
  - PDF guide download

Content:
  - CERC framework explanation
  - Sentence frames preview
  - Example walkthrough

Actions:
  - [I'm Ready] → /student/week/1/problems
```

**1.4 Problem Selection**
```
URL: /student/week/1/problems
Component: problems/page.tsx
Data: week-1-content.ts (filtered by course="calculus-ab")

Problems Displayed:
  1. MVT: The Discontinuity Trap (w1-mvt-001)
  2. IVT: The Jump Discontinuity (w1-ivt-001)
  3. EVT: The Open Interval Trap (w1-evt-001)

Each card shows:
  - Problem title
  - Error category badge
  - Estimated time: 15-20 min
  - Scaffolding level: "Full sentence frames"
```

**1.5 Problem Solving Session**
```
URL: /student/week/1/problem/[problemId]
Component: problem/[problemId]/page.tsx
Layout: split-screen-session.tsx

LEFT PANEL:
  - Problem statement (KaTeX rendered)
  - Theorem info tooltip
  - Example button (shows sample CERC)

RIGHT PANEL:
  - CERC Form (cerc-form-new.tsx)
    - Claim field (sentence frame: "The MVT [applies/does not apply]...")
    - Evidence field (sentence frame: "We can verify that f(x) is [continuous/discontinuous]...")
    - Reasoning field (sentence frame: "Since MVT requires...")
    - Conditions field (sentence frame: "Checking hypotheses explicitly...")
  - [Submit Response] button (Shimmer Button)

AI FEEDBACK (when available):
  - Appears inline next to relevant CERC field
  - 3 hint levels:
    - Level 1: "Check the domain carefully..."
    - Level 2: "Your conditions section needs attention..."
    - Level 3: "The function is discontinuous at x=0..."
```

**1.6 Problem Completion**
```
After submission:
  - XP earned: +50 XP for identifying broken condition
  - Badge check: 🔍 "The Skeptic" (if survived trap)
  - Reasoning stage updated: "empirical" → "generic" (if threshold met)
  - Redirect to /student/week/1/problems (next problem)
```

**1.7 Week 1 Completion**
```
After completing 2-3 problems:
  - Total XP: 120 XP
  - Badge earned: 🔍 "The Skeptic"
  - Week 2 unlocked
  - Exit ticket (TODO - Step 9)
```

---

#### **Phase 2: Week 2 - Rigorous Verification**

**Structure identical to Week 1, but:**
- **Scaffolding:** Structural outline only (no sentence frames)
- **Problems:** IVT/MVT/EVT where theorems DO apply
- **Materials:**
  - Infographic: rigorous-proof-guide.png
  - Video: complete-ivt-proofs.mp4 (available)
- **XP Available:** 150 XP
- **Badge:** 🏛️ "The Architect"

**Example AB Week 2 Problem:**
```
"Prove that f(x) = x³ - 2x + 1 has a root in [0,1] using IVT."

Required in CERC response:
  - Claim: "By IVT, there exists c in (0,1) such that f(c) = 0"
  - Evidence: "f(0) = 1, f(1) = 0, and 0 is between f(0) and f(1)"
  - Reasoning: "IVT states that if f is continuous on [a,b] and N is between f(a) and f(b)..."
  - Conditions: "f(x) = x³ - 2x + 1 is continuous on [0,1] because it is a polynomial"
```

---

#### **Phase 3: Week 3 - Synthesis Without Scaffolding**

**Structure:**
- **Scaffolding:** NONE (blank canvas)
- **Problems:** Multi-concept integration (MVT + related rates + implicit differentiation)
- **Materials:**
  - Infographic: multi-concept-integration.png
  - Video: multi-concept-synthesis.mp4 (available)
- **XP Available:** 180 XP
- **Badge:** 🎯 "The Synthesizer"

**Example AB Week 3 Problem:**
```
"A particle moves along a curve with position x(t) = t³ - 3t + 2.
At t=1, the velocity is 0. Use calculus to justify whether the
particle is at a local maximum or minimum position."

Student must:
  - Use derivative to find velocity
  - Apply second derivative test
  - Verify all conditions (differentiability, critical point)
  - Communicate with context and units
```

---

#### **Phase 4: Week 4 - AP Exam Simulation**

**Structure:**
```
URL: /student/week/4/exam
Component: exam/page.tsx
Materials:
  - Infographic: exam-simulation-guide.png
  - Video: (pending - AB Week 4 exam prep)

INDIVIDUAL TIMED FRQ (25 minutes):

Single Problem (Multi-Part):
  - Part A: Related rates calculation with full justification
  - Part B: MVT application with condition verification
  - Part C: Optimization with rigorous reasoning

Format:
  - No scaffolding (blank canvas)
  - Timer displayed prominently
  - Individual work only (no collaboration)
  - Scored using official AP rubric
  - Submit before time expires or lose points

Example AB FRQ:
  "Water tank problem with related rates + MVT + optimization"
  - 3 parts, each requiring CERC justification
  - Must verify all theorem conditions
  - Real AP exam difficulty
```

**XP Available:** 195 XP
**Badge:** 🎓 "Exam Ready"

---

### 📊 DETAILED FLOW: AP CALCULUS BC STUDENT

**Student Profile:** Ananya Kakarlapudi (ID: 29185)
**Course:** AP Calculus BC
**Current XP:** 367 XP/week
**Accuracy:** 82.8% (needs coaching)

#### **Key Differences from AB:**

**Week 1:**
- **BC-Specific Problems:**
  - Series convergence with condition traps (ratio test fails, alternating series)
  - Parametric equations with discontinuities
- **Materials:** series-parametric-traps.png infographic
- **Trap Example:** "Apply ratio test to Σ(1/n²). What goes wrong?"
  - Trap: Ratio test is inconclusive for p-series
  - Correct: Must use integral test or direct comparison

**Week 2:**
- **BC-Specific Problems:**
  - Rigorous series convergence proofs (comparison test, limit comparison, integral test)
  - Polar derivatives and continuity
- **Materials:**
  - Infographic: series-convergence-proofs.png
  - Video: series-convergence-system.mp4 (available)

**Week 3:**
- **BC-Specific Problems:**
  - Parametric arc length with condition verification
  - Polar area with self-intersection checks
- **Materials:**
  - Infographic: synthesis-without-scaffolding.png
  - Video: parametric-arc-length.mp4 (available)

**Week 4: BC AP Exam Simulation**
- **Problem Type:** Polar curve analysis (30 min timed FRQ)
- **Materials:** exam-simulation-guide.png infographic
- **Format:** Individual multi-part FRQ (Parts A-D)
- **Requires:** Polar area, arc length, MVT application, condition verification

---

### 📊 DETAILED FLOW: AP STATISTICS STUDENT

**Student Profile:** (Hypothetical - Emily Smith transitioning from Precalc)
**Course:** AP Statistics
**XP Target:** 232 XP/week

#### **Key Differences from Calculus:**

**Week 1: Inference Assumptions**
- **Stats-Specific Problems:**
  - Identifying non-random sampling methods
  - Detecting independence violations
- **Materials:**
  - Infographic: randomness-illusion-guide.png
  - Video: identifying-random-samples.mp4 (available)
- **Example Problem:**
  ```
  "A researcher surveys students in the cafeteria about homework time.
  She claims the sample is random. Use CERC to evaluate this claim."

  Correct CERC:
    - Claim: This is NOT a random sample
    - Evidence: Only students who eat in the cafeteria were surveyed
    - Reasoning: Random sampling requires every member of the population to have an equal chance
    - Conditions: Convenience sampling introduces bias (students who skip cafeteria are excluded)
  ```

**Week 2: Condition Verification**
- **Stats-Specific Problems:**
  - Verifying all 4 conditions for 2-sample t-test
  - Checking normality assumptions (CLT vs sample size)
- **Materials:** inference-conditions-checklist.png infographic
- **4-Condition Framework:**
  1. Random samples (state sampling method)
  2. Independence within groups (10% rule)
  3. Independence between groups
  4. Normality (n ≥ 30 OR CLT OR no strong skew)

**Week 3: Causation vs Correlation**
- **Stats-Specific Problems:**
  - Distinguishing observational studies from experiments
  - Identifying confounding variables
- **Materials:** causation-vs-correlation.png infographic
- **Example:**
  ```
  "Study shows breakfast eaters have higher SAT scores (p=0.03).
  Does breakfast cause higher scores? Use CERC to analyze."

  Correct CERC:
    - Claim: We cannot conclude causation from this study
    - Evidence: p=0.03 shows association, but study is observational
    - Reasoning: Observational studies cannot prove causation due to potential confounders
    - Conditions: Confounders: sleep quality, SES, motivation, study habits
  ```

**Week 4: Stats AP Exam Simulation**
- **Problem Type:** Study design critique + inference (25 min timed FRQ)
- **Materials:** exam-simulation-guide.png infographic
- **Format:** Individual multi-part FRQ (Parts A-C)
- **Requires:** Hypothesis testing, condition verification, confounding analysis, study design critique

---

## 4. COURSE DIFFERENTIATION SUMMARY

### Content Adaptation by Course

| Element | Calculus AB | Calculus BC | Statistics |
|---------|-------------|-------------|------------|
| **Week 1 Theorems** | MVT, IVT, EVT | Series tests, parametric | Random sampling, independence |
| **Week 2 Rigor** | Polynomial continuity | Series convergence | 4-condition checklist |
| **Week 3 Integration** | Related rates + MVT | Arc length + polar | Causation + confounders |
| **Week 4 AP Exam Simulation** | Optimization | Polar curves | Study critique |
| **Total Problems** | 8-10 per week | 10-12 per week | 6-8 per week |
| **Math Depth** | Moderate | High | Conceptual |
| **Key Skill** | Theorem verification | Advanced integration | Statistical reasoning |

### Shared Infrastructure

All three courses use:
- Same CERC framework (4 fields)
- Same scaffolding progression (frames → outline → blank)
- Same XP/badge system
- Same admin dashboard for Sebastian
- Same AI feedback structure (when Step 5 completed)

---

## 5. NEXT STEPS TO COMPLETION

### Critical Path (25% Remaining)

**Priority 1: Complete Step 4 (Claude API Integration)**
- Implement Anthropic API calls for problem generation
- Dynamic difficulty adjustment based on student performance
- Estimated time: 2-3 hours

**Priority 2: Complete Step 5 (AI Feedback Loop)**
- Implement Socratic dialogue with Claude API
- 3-level hint system based on revision count
- Inline feedback display
- Estimated time: 3-4 hours

**Priority 3: Implement Step 9 (Exit Ticket System)**
- Post-week reflection form
- Store responses in TimeBack/mock adapter
- Feed data into next week's Claude prompts
- Estimated time: 2 hours

**Priority 4: Deploy (Step 12)**
- Vercel deployment
- Configure environment variables
- Domain setup (if needed)
- Estimated time: 1 hour

**Total Estimated Time to 100%:** 8-10 hours

---

## 6. MATERIAL DOWNLOAD STATUS

### Videos Currently Processing (7/7)

As of 2026-03-22 14:35:
- Video 1/7: AB Week 1 (MVT verification) - **in_progress**
- Video 2/7: BC Week 1 (Series convergence) - **pending**
- Video 3/7: Stats Week 2 (Inference conditions) - **pending**
- Video 4/7: Stats Week 3 (Causation analysis) - **pending**
- Video 5/7: AB Week 4 (AP Exam Simulation prep) - **pending**
- Video 6/7: BC Week 4 (Polar challenge) - **pending**
- Video 7/7: Stats Week 4 (Study critique) - **pending**

**Expected completion:** 30-45 min per video = all done in ~3-5 hours

Once complete, total course materials:
- **12/12 Infographics** ✅
- **12/12 Videos** (5 done, 7 in progress)
- **Total size:** ~430MB (12 videos × ~35MB avg)

---

## 7. TECHNICAL ARCHITECTURE

### Data Flow

```
Student Login (TimeBack)
  → Middleware checks role
  → /student dashboard
  → Select Week
  → Load course-specific content from data/week-X-content.ts
  → Filter problems by course field
  → Render split-screen session
  → Submit CERC response
  → API route: /api/cerc/submit
  → Store in mock adapter / TimeBack
  → Return XP + badge check
  → Update progress header
```

### Key Files by Function

**Student Experience:**
- `app/student/week/[1-4]/page.tsx` - Week landing pages
- `components/student/split-screen-session.tsx` - Main problem-solving UI
- `components/student/cerc-form-new.tsx` - CERC input form
- `data/week-[1-4]-content.ts` - Course-specific problems

**Admin Experience:**
- `app/admin/page.tsx` - Main dashboard
- `app/admin/students/[studentId]/page.tsx` - Individual student tracking
- `components/admin/admin-dashboard.tsx` - Dashboard UI

**Materials:**
- `public/course-materials/[course]/week[1-4]/(infographics|videos)/` - All generated content

**API Endpoints:**
- `app/api/cerc/submit/route.ts` - CERC response processing
- `app/api/admin/frq/assign/route.ts` - FRQ workflow
- `app/api/webhooks/timeback/route.ts` - TimeBack integration

---

## 8. TESTING STATUS

### Manual Testing Completed
- ✅ Week 1-4 landing pages render correctly
- ✅ Split-screen layout responsive on mobile/desktop
- ✅ KaTeX math rendering works
- ✅ CERC form validation
- ✅ Admin dashboard displays student data
- ✅ Breadcrumbs navigation
- ✅ WOW component animations

### Pending Testing
- ⚠️ Claude API integration (Step 4)
- ⚠️ AI feedback loop (Step 5)
- ⚠️ Exit ticket submission (Step 9)
- ⚠️ Production deploy (Step 12)

---

## 9. STUDENT PILOT TIMELINE

**TIER A (Start Mar 18):**
- Elle Liemandt → AP Calc BC flow
- Emily Smith → Statistics flow (after Precalc completion)

**TIER B (Start Apr 1):**
- Ananya Kakarlapudi → AP Calc BC flow (after accuracy coaching)

**TIER C (Start Apr 8-15):**
- Maddie Price → AP Calc AB flow
- Sloka Vudumu → AP Calc AB flow

**All students follow the same 4-week structure, differentiated by course.**

---

**END OF REPORT**
