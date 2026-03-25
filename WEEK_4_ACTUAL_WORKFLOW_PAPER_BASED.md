# Week 4 Actual Workflow - Paper-Based FRQ System

**Date:** March 25, 2026
**Status:** ✅ FULLY IMPLEMENTED

---

## Critical Clarification

**Week 4 is NOT a web-based timed exam.** Students do NOT complete FRQs in the web platform with a timer like Week 1-3 problems.

Instead, Week 4 uses a **paper-based FRQ workflow** triggered automatically by MathAcademy quiz completions.

---

## Complete System Flow

### 1. MathAcademy Quiz Completion (Automatic Trigger)

```
Student completes quiz in MathAcademy
    ↓
Score ≥ 80% + AP Math cohort + Assessment type = Quiz/Test
    ↓
TimeBack sends webhook to our system
```

**Webhook Endpoint:** `/api/webhooks/timeback` (POST)

**Implementation:** `app/api/webhooks/timeback/route.ts`

---

### 2. Automatic FRQ Generation (Claude API)

**What Happens:**
- Webhook receives quiz data (student, assessment, score)
- System detects student's course (AB, BC, or Statistics)
- System checks prerequisites (has student completed Week 1-3 training?)
- If prerequisites NOT met → FRQ marked as "blocked" with reason
- If prerequisites met → FRQ generation proceeds

**Claude API Call:**
```typescript
const systemPrompt = getSystemPromptForCourse(studentCourse); // Course-specific
const userPrompt = getUserPromptForCourse(studentCourse, topic, score, frqType);

const message = await claudeClient.createMessage({
  model: "claude-sonnet-4-5",
  max_tokens: 8192,
  temperature: 0.7,
  system: systemPrompt,
  messages: [{ role: "user", content: userPrompt }],
});
```

**FRQ Stored in Database:**
```typescript
{
  frqId: "frq-abc123",
  studentId: "571c432f-93f2-40af-9093-f6177e6d2dd7",
  quizId: "quiz-result-xyz",
  type: "general" | "topic",
  topic: "Mean Value Theorem Quiz",
  problemStatement: "...", // Full LaTeX with parts (a), (b), (c), (d)
  status: "pending", // pending → approved → assigned → submitted → graded
  blocked: false,
  course: "calculus-bc"
}
```

**Implementation:** Lines 129-248 in `app/api/webhooks/timeback/route.ts`

---

### 3. PDF Generation + Telegram Notification

**PDF Compiler Service:** Railway-hosted LaTeX compiler
- **URL:** `process.env.PDF_COMPILER_URL`
- **Format:** College Board style (AP Calculus AB/BC/Statistics header)
- **Content:** Student name, date, quiz context, problem statement with parts

**LaTeX Template:**
```latex
\documentclass[11pt, letterpaper]{article}
\usepackage{amsmath, amssymb, amsthm, geometry, fancyhdr, enumitem}

\lhead{\textbf{AP CALCULUS BC}}
\rhead{\textbf{FREE-RESPONSE QUESTION}}

% Student info
\textbf{Student:} Ananya Kakarlapudi
\textbf{Date:} March 25, 2026
\textbf{Context:} Mean Value Theorem Quiz (92%)

% Problem statement with parts (a), (b), (c), (d)
\begin{enumerate}[label=(\alph*), leftmargin=*, itemsep=0.4cm]
  \item Part A question...
  \item Part B question...
  \item Part C question...
\end{enumerate}
```

**Telegram Message Sent:**
- Sebastian receives notification in Telegram bot
- Includes FRQ preview, student name, quiz score
- If NOT blocked: PDF attached + Approval buttons (✅ Approve, ❌ Reject, 📄 Send PDF)
- If blocked: Shows reason (e.g., "Student must complete 3/3 Week 2 problems first")

**Implementation:**
- `lib/telegram/frq-approval.ts` (lines 1-261)
- Webhook lines 318-437

---

### 4. Sebastian Approves via Telegram

**Approval Actions:**
- ✅ **Approve & Send PDF** → Changes FRQ status to "assigned", student sees in dashboard
- ❌ **Reject** → FRQ marked as rejected, student doesn't see it
- 📄 **Send PDF Only** → Sends PDF without changing status

**Telegram Webhook Handler:** `app/api/telegram/webhook/route.ts`
- Handles button clicks (callback queries)
- Calls internal API: `/api/admin/frq-approvals/{frqId}/approve`
- Updates message with status: "✅ APPROVED"

---

### 5. Student Downloads PDF & Solves on Paper

**Student Dashboard:**
- "Week 4 - FRQ Assignments" tab shows assigned FRQs
- Student clicks "Download PDF" button
- Opens PDF on device/prints it

**Student Workflow:**
1. Read problem carefully (3-4 parts: a, b, c, d)
2. Solve on blank paper with complete CERC justification
3. Time spent: 25-30 minutes (self-timed, not enforced)
4. Take photo of work with phone camera
5. Upload photo to platform

**Upload Component:** `components/student/frq-solver.tsx`
- Photo upload field
- Self-evaluation (0-9 scale)
- Submit button

**Implementation:** Student sees "Blocked FRQ" card if prerequisites not met
- Component: `components/student/blocked-frq-card.tsx`

---

### 6. Sebastian Grades (Option A or B)

**Option A: Claude Vision AI (Automatic)**
```typescript
// Admin opens "Grade FRQ" modal
// Clicks "AI Grade with Claude Vision"
// System calls: /api/admin/frq/ai-grade

const response = await claudeVisionClient.gradeHandwrittenFRQ({
  imageUrl: submissionPhotoUrl,
  problemStatement: frq.problemStatement,
  rubric: CERC_RUBRIC, // 9 points: Claim (3), Evidence (3), Reasoning (2), Conditions (1)
});

// Claude returns:
{
  score: 7,
  claimScore: 3,
  evidenceScore: 2,
  reasoningScore: 2,
  conditionsScore: 0,
  aiOutput: "Detailed CERC analysis...",
  actionPoints: [
    "Verify MVT conditions explicitly",
    "Show intermediate calculation steps",
    "State final answer with units"
  ],
  reasoningStage: "generic" // empirical | generic | formal
}
```

**Option B: External Grader (MathGrader.AI)**
```
Admin downloads student photo
    ↓
Uploads to MathGrader.AI manually
    ↓
Copies AI output text
    ↓
Pastes into admin dashboard
    ↓
Manually enters score (0-9)
    ↓
Writes 3 action points
```

**Admin Components:**
- `components/admin/frq-review-dashboard.tsx` - Lists all submissions
- `components/admin/grade-frq-modal.tsx` - Grading interface with AI button

**Implementation:**
- `services/ai/claude-grader.ts` - Claude Vision service
- `CLAUDE_VISION_GRADING.md` - Full documentation

---

### 7. Feedback Delivered to Student

**Student Sees:**
- Score: 7/9
- AI Output: Detailed CERC analysis
- 3 Action Points:
  1. "Verify MVT conditions explicitly before applying"
  2. "Show intermediate calculation steps in Evidence"
  3. "State final answer with units in Claim"
- Reasoning Stage: "Generic" (moved from Empirical)

**XP Awarded:**
- Base: +50 XP
- Part A complete: +20 XP
- Part B complete: +20 XP
- Part C complete: +25 XP
- Part D complete: +30 XP (if applicable)
- Perfect CERC: +40 XP
- Exam Ready Badge: +50 XP
- **Total possible:** 235 XP

---

## What About the 3 Mocks in `week-4-content.ts`?

**File:** `data/week-4-content.ts`

**Contains:**
1. `exam-ab-related-rates` - Calculus AB mock (25 min)
2. `exam-bc-polar` - Calculus BC mock (30 min)
3. `exam-stats-study-design` - Statistics mock (25 min)

**Purpose:** These are NOT used for actual student exams. They are:
- **Examples for Week 4 landing page** (`app/student/week/4/page.tsx`)
- **Template structure** showing what multi-part FRQs look like
- **Reference data** for course-specific time limits and format

**Students do NOT complete these 3 mocks.** Instead, they receive dynamically generated FRQs triggered by their MathAcademy quiz performance.

---

## Week 4 Landing Page (`/student/week/4/page.tsx`)

**What Students See:**
- Hero section: "AP Exam Simulation"
- 4 tabs: Format, Strategy, Time Pressure, Victory
- Explains the paper-based workflow
- CTA button: "Enter AP Exam Simulation →" links to `/student/week/4/exam`

**Route:** `/student/week/4/exam`

**What This Page Shows:**
- Student's assigned FRQ list
- Download PDF buttons
- Upload photo forms
- Submission history

**NOT a timed exam interface** - just an assignment dashboard

---

## Unlimited Mocks (Future Requests)

**Current:** 1 FRQ auto-generated per quiz completion (≥80%)

**Future:** Student can request additional practice FRQs
- Button: "Request Another FRQ" in dashboard
- Triggers same Claude API flow without quiz requirement
- Sebastian approves via Telegram
- Same paper-based workflow

**Not yet implemented**, but architecture supports it (just needs UI button + API endpoint)

---

## Key Files Reference

### Webhook & FRQ Generation
- `app/api/webhooks/timeback/route.ts` - Main webhook handler
- `lib/claude/bedrock-client.ts` - Claude API client
- `lib/prompts/index.ts` - Course-specific prompts
- `lib/prerequisites.ts` - Prerequisite checking logic

### Telegram Integration
- `lib/telegram/frq-approval.ts` - Send notifications + PDFs
- `app/api/telegram/webhook/route.ts` - Handle button clicks
- `scripts/setup-telegram-webhook.js` - Setup script

### PDF Generation
- Inline in webhook handler (lines 342-416)
- Uses Railway LaTeX compiler service
- College Board style formatting

### Student UI
- `app/student/week/4/page.tsx` - Landing page
- `app/student/week/4/exam/page.tsx` - Assignment dashboard
- `components/student/frq-solver.tsx` - Upload interface
- `components/student/blocked-frq-card.tsx` - Blocked state

### Admin UI
- `components/admin/frq-review-dashboard.tsx` - Review queue
- `components/admin/grade-frq-modal.tsx` - Grading interface
- `components/admin/assign-frq-modal.tsx` - Manual assignment

### AI Grading
- `services/ai/claude-grader.ts` - Claude Vision service
- `CLAUDE_VISION_GRADING.md` - Documentation
- CERC rubric: 9 points (Claim 3, Evidence 3, Reasoning 2, Conditions 1)

---

## Environment Variables

```bash
# Webhook authentication
TIMEBACK_WEBHOOK_SECRET=<secret>

# Claude API (Bedrock)
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
AWS_REGION=us-west-2

# Or direct Anthropic API
ANTHROPIC_API_KEY=sk-ant-api03-...

# Telegram bot
TELEGRAM_BOT_TOKEN=<token>
TELEGRAM_CHAT_ID=<chat_id>

# PDF compiler
PDF_COMPILER_URL=https://latex-compiler.railway.app
PDF_COMPILER_API_KEY=<key>
```

---

## Summary: Web-Based vs Paper-Based

### Weeks 1-3: Web-Based Problems
- Students solve in browser
- CERC text inputs
- Instant AI feedback
- Sequential locking
- Scaffolding progression (sentence frames → outline → blank canvas)

### Week 4: Paper-Based FRQs
- Students solve on physical paper
- Photo upload for grading
- No scaffolding (real exam conditions)
- No sequential locking (1 FRQ at a time)
- No instant feedback (Sebastian grades manually/AI)

**The platform shift from web to paper simulates the actual AP exam experience.**

---

**Status:** ✅ FULLY IMPLEMENTED AND PRODUCTION READY

**Last Updated:** March 25, 2026
