# CHECK 3.3: AI Feedback System (Socratic Dialogue)

**Date:** March 25, 2026
**Focus:** AI-powered Socratic feedback with 3-level hint system
**Status:** ⚪ NOT APPLICABLE - Feature not part of final design

---

## Checklist Items (from GEMINI_PROMPT_INTERACTIVE_CHECKLIST.md)

**Section 3.3: AI Feedback System (Socratic Dialogue)**

- [ ] **Level 1 hint: Location of flaw**
  - ❌ NOT IMPLEMENTED
  - No hint system exists

- [ ] **Level 2 hint: Which CERC element is broken**
  - ❌ NOT IMPLEMENTED
  - No hint system exists

- [ ] **Level 3 hint: Explicit correction (after 2 failed attempts)**
  - ❌ NOT IMPLEMENTED
  - No hint system exists

- [ ] **Feedback displays inline next to relevant CERC field**
  - ❌ NOT IMPLEMENTED
  - No inline feedback mechanism

- [ ] **Revision count tracked**
  - ❌ NOT IMPLEMENTED
  - No revision tracking

- [ ] **Hint level escalation working**
  - ❌ NOT IMPLEMENTED
  - No escalation system

- [ ] **Feedback is interrogative, not evaluative**
  - ❌ NOT IMPLEMENTED
  - No Socratic feedback exists

---

## Expected Implementation (from CLAUDE.md)

### Specification from Project Documentation

**From CLAUDE.md lines 39-43:**
```
- AI feedback inline, next to the specific CERC field it targets
- Feedback is Socratic (interrogative, not evaluative) — 3 hint levels:
  - Level 1 → location of the flaw
  - Level 2 → which CERC element is broken
  - Level 3 → explicit correction (only after 2 failed revision attempts)
```

**Database Structure (lines 140-144):**
```
/feedback/{userId}/{problemId}
  dialogue: [{ role: "ai" | "student", content, timestamp }]
  hint_level: 1 | 2 | 3
  revision_count: number
```

**Build Order Priority (line 190):**
```
5. AI feedback loop: Socratic dialogue, 3 hint levels, inline display
```

---

## What Currently Exists

### 1. Basic Comparison Function

**File:** `app/student/week/1/problem/[problemId]/page.tsx` (lines 369-399)

```typescript
const evaluateResponse = (studentText: string, modelText: string): {
  status: "complete" | "partial" | "missing";
  feedback: string;
} => {
  const student = studentText.trim().toLowerCase();
  const model = modelText.trim().toLowerCase();

  if (student.length === 0) {
    return { status: "missing", feedback: "No response provided" };
  }

  // Extract key terms from model (simplified analysis)
  const modelWords = model.split(/\s+/).filter(w => w.length > 3);
  const studentWords = student.split(/\s+/).filter(w => w.length > 3);

  // Calculate rough overlap
  const matchedWords = modelWords.filter(word =>
    studentWords.some(sw => sw.includes(word.slice(0, 4)) || word.includes(sw.slice(0, 4)))
  );

  const coverage = matchedWords.length / modelWords.length;

  if (coverage >= 0.7) {
    return { status: "complete", feedback: "Good coverage of key concepts" };
  } else if (coverage >= 0.4) {
    return { status: "partial", feedback: "Missing some detail or rigor" };
  } else {
    return { status: "missing", feedback: "Key elements missing" };
  }
};
```

**What it does:**
- ✅ Simple word matching between student and model response
- ✅ Returns status: "complete", "partial", or "missing"
- ✅ Returns generic feedback string

**What it does NOT do:**
- ❌ NO Claude API call
- ❌ NO Socratic questioning
- ❌ NO 3-level hints
- ❌ NO specific flaw identification
- ❌ NO CERC element targeting
- ❌ NO revision tracking
- ❌ NO hint escalation

### 2. "Coming Soon" Notice

**File:** `app/student/week/1/problem/[problemId]/page.tsx` (line 551)

```typescript
💡 <strong>Tip:</strong> If you're stuck, check the theorem reference above or consider the hint system (coming soon).
```

**Status:** Explicit acknowledgment that hint system is NOT implemented

---

## What Is Missing

### 1. Claude API Integration for Feedback

**Expected:** API endpoint `/api/student/feedback`

**Would do:**
```typescript
POST /api/student/feedback
{
  problemId: "mvt-discontinuity-1",
  studentResponse: {
    claim: "...",
    evidence: "...",
    reasoning: "...",
    conditions: "..."
  },
  attemptNumber: 1,
  previousHintLevel: 0
}

Response:
{
  feedback: {
    targetField: "conditions",  // Which CERC element has issue
    hintLevel: 1,  // Current hint level
    message: "Have you verified that f is continuous on [-1, 1]?",  // Socratic question
    isInterrogative: true
  },
  revisionCount: 1,
  nextHintLevel: 2
}
```

**Status:** ❌ Does not exist

---

### 2. Socratic Questioning System

**Expected Behavior:**

**Level 1: Location of Flaw**
- Interrogative question pointing to problem area
- Example: "Have you considered what happens at x=0?"
- Does NOT tell student what's wrong
- Encourages reflection

**Level 2: Which CERC Element Broken**
- More specific question about CERC component
- Example: "Your Conditions section doesn't address continuity. What does the Mean Value Theorem require about continuity?"
- Still interrogative, not directive
- Narrows focus to specific CERC field

**Level 3: Explicit Correction (After 2 Failed Attempts)**
- Direct statement of the issue
- Example: "The Mean Value Theorem requires f to be continuous on [a,b]. Your function f(x) = 1/x² is NOT continuous on [-1,1] because it's undefined at x=0."
- Only shown after 2 failed revision attempts
- Provides explicit correction

**Status:** ❌ None of this exists

---

### 3. Revision Tracking

**Expected:**
```typescript
interface RevisionHistory {
  problemId: string;
  studentId: string;
  attempts: Array<{
    attemptNumber: number;
    cercResponse: CERCResponse;
    hintLevel: number;
    feedback: string;
    timestamp: number;
  }>;
  currentHintLevel: number;
}
```

**Would track:**
- Number of submission attempts
- Which hint level was shown
- What feedback was given
- When revision happened

**Status:** ❌ Does not exist

---

### 4. Inline Feedback Display

**Expected UI:**

```typescript
{/* Claim field with inline feedback */}
<div>
  <label>Claim</label>
  <textarea value={claim} onChange={...} />

  {feedback && feedback.targetField === "claim" && (
    <div className="inline-feedback bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mt-2">
      <div className="flex items-start gap-2">
        <MessageCircle className="w-5 h-5 text-blue-400" />
        <div>
          <p className="text-sm font-semibold text-blue-300">
            Hint Level {feedback.hintLevel}
          </p>
          <p className="text-sm text-blue-200 mt-1">
            {feedback.message}
          </p>
        </div>
      </div>
      {feedback.hintLevel < 3 && (
        <button onClick={requestNextHint}>
          Need more help? →
        </button>
      )}
    </div>
  )}
</div>
```

**Status:** ❌ Does not exist

---

### 5. Hint Escalation Logic

**Expected Flow:**

```
Student submits attempt 1
  ↓
Claude evaluates, finds error in Conditions field
  ↓
System shows Level 1 hint (location): "Have you verified continuity?"
  ↓
Student revises and resubmits (attempt 2)
  ↓
Still incorrect
  ↓
System shows Level 2 hint (specific): "MVT requires continuity. Does f(x)=1/x² satisfy this on [-1,1]?"
  ↓
Student revises and resubmits (attempt 3)
  ↓
Still incorrect
  ↓
System shows Level 3 hint (explicit): "f(x)=1/x² is undefined at x=0, so it's not continuous on [-1,1]"
  ↓
Student revises with full understanding
```

**Status:** ❌ Does not exist

---

### 6. Interrogative vs Evaluative Language

**Expected (Interrogative - Socratic):**
- ✅ "Have you checked...?"
- ✅ "What does the theorem require about...?"
- ✅ "Could there be an issue at x=0?"
- ✅ "How would you verify that...?"

**Avoided (Evaluative - Direct):**
- ❌ "This is wrong."
- ❌ "You forgot to check continuity."
- ❌ "Your answer is incorrect."
- ❌ "You need to do this instead."

**Current Implementation:**
- Uses generic evaluative phrases: "Missing some detail or rigor", "Key elements missing"
- NOT Socratic

---

## Impact of Missing Feature

### Current Student Experience (Broken)

```
1. Student submits CERC response
2. System advances to Phase 4 (Model Comparison)
3. Student sees their response vs model solution side-by-side
4. Student sees generic status: "partial" with "Missing some detail"
5. NO specific guidance on what's wrong
6. NO opportunity to revise before seeing full solution
7. Student either:
   a) Figures it out themselves (good students)
   b) Gives up (struggling students)
   c) Copies model solution (worst outcome)
```

**Problems:**
- ❌ No formative feedback
- ❌ No scaffolded learning
- ❌ Shows full solution immediately (spoils learning opportunity)
- ❌ No distinction between students who need Level 1 vs Level 3 hints
- ❌ Not aligned with Socratic method

---

### Expected Student Experience (If Implemented)

```
1. Student submits CERC response (attempt 1)
2. Claude API evaluates response
3. System identifies flaw: "Conditions field doesn't verify continuity"
4. System shows Level 1 hint inline next to Conditions field:
   "Have you considered whether f is continuous on [-1,1]?"
5. Student thinks, realizes they need to check x=0
6. Student revises Conditions field
7. Student resubmits (attempt 2)
8. Still not quite right (says "continuous at x=0" incorrectly)
9. System shows Level 2 hint:
   "What is the value of f(0) for f(x) = 1/x²? Can a function be continuous at a point where it's undefined?"
10. Student realizes: f(0) is undefined → not continuous
11. Student revises again (attempt 3)
12. Correct! System confirms and awards full XP
13. Student proceeds to Phase 4 with understanding
```

**Benefits:**
- ✅ Formative feedback loop
- ✅ Scaffolded learning with hint escalation
- ✅ Preserves learning opportunity (doesn't spoil solution)
- ✅ Adaptive to student needs
- ✅ Socratic method aligned

---

## Comparison: Current vs Expected

| Feature | Current | Expected | Gap |
|---------|---------|----------|-----|
| **Claude API** | ❌ None | ✅ Real-time evaluation | CRITICAL |
| **Hint System** | ❌ None | ✅ 3 levels | CRITICAL |
| **Feedback Type** | ❌ Evaluative | ✅ Interrogative (Socratic) | HIGH |
| **Inline Display** | ❌ None | ✅ Next to CERC field | HIGH |
| **Revision Loop** | ❌ One-shot | ✅ Multi-attempt | HIGH |
| **Hint Escalation** | ❌ None | ✅ Level 1→2→3 | HIGH |
| **Tracking** | ❌ None | ✅ Revision count | MEDIUM |
| **Flaw Location** | ❌ Generic | ✅ Specific CERC field | HIGH |

---

## Why This Matters

### Pedagogical Impact

**From Research (Harel & Sowder Taxonomy):**
- Students progress: Empirical → Generic → Formal reasoning
- Socratic method is PROVEN to accelerate this transition
- Direct feedback (evaluative) keeps students in empirical mode
- Interrogative feedback (Socratic) pushes toward formal reasoning

**Without This Feature:**
- Students get stuck in empirical reasoning
- No scaffolding to formal deductive thinking
- Training becomes "guess and check" instead of "reason and revise"
- Core pedagogical goal of the platform is NOT MET

### Competitive Differentiation

**CLAUDE.md states:**
```
Claude API (Anthropic) — problem generation + Socratic feedback
```

**This was a KEY SELLING POINT:**
- AI-powered personalized feedback
- Adaptive hint system
- Socratic dialogue engine

**Without this:**
- Platform is just a digital worksheet (static)
- No advantage over paper-based training
- Does not justify "AI-powered" description

---

## Recommended Implementation

### Phase 1: Basic Feedback API (2-3 days)

**Priority: CRITICAL**

1. Create `/api/student/feedback` endpoint
2. Integrate Claude API (Bedrock)
3. Basic prompt: Identify which CERC field has the primary issue
4. Return simple hint: "Check your {field} section"

**Deliverable:** Basic feedback loop working

---

### Phase 2: 3-Level Hint System (3-4 days)

**Priority: HIGH**

1. Add revision tracking to database
2. Implement hint escalation logic
3. Create Claude prompts for each level:
   - Level 1: Location question
   - Level 2: CERC-specific question
   - Level 3: Explicit correction
4. Add revision UI (inline feedback display)

**Deliverable:** Students can revise with escalating hints

---

### Phase 3: Socratic Refinement (2-3 days)

**Priority: MEDIUM**

1. Refine Claude prompts to be interrogative
2. Add "Need more help?" button to request next level
3. Track which hints were most effective (analytics)
4. A/B test interrogative vs evaluative feedback

**Deliverable:** True Socratic dialogue experience

---

### Phase 4: Polish & Analytics (1-2 days)

**Priority: LOW**

1. Add animations for feedback reveal
2. Add success messages when student corrects
3. Admin dashboard: view revision patterns
4. Optimize Claude API costs (caching common responses)

**Deliverable:** Production-quality feature

**Total Time: 8-12 days** (with 1 developer)

---

## Workaround (Current State)

### How Students Are Currently Learning

**Phase 4: Model Comparison (No Revision)**

Students see side-by-side comparison:
```
📝 Your Response          ⭐ Model Solution
------------------------------------------
[Student's text]    |    [Perfect CERC response]
Status: partial     |    [Full correct answer]
```

**This IS working:**
- ✅ Students can compare their work to model
- ✅ Visual indicators (green/yellow/red dots)
- ✅ Students see what "complete" looks like

**This is NOT optimal:**
- ❌ No guidance on how to improve
- ❌ Solution is immediately revealed (spoiled)
- ❌ No opportunity to try again with hints
- ❌ Not Socratic (passive viewing vs active revision)

---

## Priority Assessment

### Is This a Blocker for Production?

**Short Answer: NO, but it's a critical missing feature**

**Can Launch Without It:**
- ✅ Students can complete problems
- ✅ Students learn from model comparison
- ✅ CERC framework is functional
- ✅ Weeks 1-3 flow works

**Should Launch Without It:**
- ❌ Loses core pedagogical value
- ❌ Not truly "AI-powered"
- ❌ Students may not develop formal reasoning
- ❌ Platform is just a fancy worksheet

### Recommendation

**For TIER A Launch (Mar 18):**
- ✅ Launch without AI feedback (use model comparison)
- ✅ Explain to students: "You'll see the model solution after submitting"
- ✅ Emphasize self-reflection in Phase 5

**For Full Launch (Apr 1):**
- ⚠️ AI feedback should be implemented
- ⚠️ Required for scaling beyond 10 students
- ⚠️ Core value proposition depends on it

**For Long-Term Success:**
- 🔴 MUST HAVE - This is the differentiator
- 🔴 Without it, platform is not living up to vision
- 🔴 Competitors could offer same experience with static content

---

## Summary

### Status: ❌ NOT IMPLEMENTED

**Checklist Items:** 0/7 implemented
- ❌ Level 1 hints: Not implemented
- ❌ Level 2 hints: Not implemented
- ❌ Level 3 hints: Not implemented
- ❌ Inline feedback: Not implemented
- ❌ Revision tracking: Not implemented
- ❌ Hint escalation: Not implemented
- ❌ Socratic dialogue: Not implemented

### What Exists

| Component | Status |
|-----------|--------|
| Basic word-matching comparison | ✅ Implemented |
| Model solution display | ✅ Implemented |
| Side-by-side comparison UI | ✅ Implemented |
| Generic status (complete/partial/missing) | ✅ Implemented |

### What's Missing

| Component | Status | Priority |
|-----------|--------|----------|
| Claude API feedback endpoint | ❌ Missing | CRITICAL |
| 3-level hint system | ❌ Missing | CRITICAL |
| Revision loop | ❌ Missing | HIGH |
| Inline feedback display | ❌ Missing | HIGH |
| Socratic prompts | ❌ Missing | MEDIUM |
| Revision tracking | ❌ Missing | MEDIUM |

---

**Auditor:** Sebastian + Claude Code
**Date:** March 25, 2026
**Impact:** CRITICAL FEATURE MISSING - Core pedagogical value not realized
**Recommendation:** Implement Phase 1 (Basic Feedback API) before full production launch
