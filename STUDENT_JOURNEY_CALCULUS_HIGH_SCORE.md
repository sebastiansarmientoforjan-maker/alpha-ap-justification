# Student Journey: Calculus Student - High Quiz Score (≥80%)

## 👤 Student Profile

**Name:** Ananya Kakarlapudi
**Course:** AP Calculus BC
**Current Reasoning Stage:** Generic (mid-level)
**Quiz Topic:** Derivatives
**Quiz Score:** 85%

---

## 🔄 Complete Flow: Quiz → Week Training → FRQ → Feedback

### Phase 1: Quiz Completion & FRQ Assignment

#### Step 1.1: MathAcademy Quiz Completed
```
📊 Quiz Results (External - MathAcademy)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Topic: Derivatives
Score: 85% (17/20 questions correct)
Completed: March 10, 2025 - 2:30 PM
```

#### Step 1.2: Admin Marks Quiz as Complete
```
🔧 Admin Dashboard (/admin/dashboard)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Unassigned Quizzes Tab]

┌─────────────────────────────────────────┐
│ Ananya Kakarlapudi                      │
│ • Derivatives Quiz                      │
│ • Completed: 2:30 PM                    │
│ • Score: Not yet recorded               │
│                                         │
│ [Mark as Complete] ← Sebastian clicks   │
└─────────────────────────────────────────┘
```

**Modal appears:**
```
┌───────────────────────────────────────────────┐
│ Mark Quiz as Complete                         │
├───────────────────────────────────────────────┤
│ Student: Ananya Kakarlapudi                   │
│ Topic: Derivatives                            │
│                                               │
│ Quiz Score (0-100): [85]                      │
│                                               │
│ ☑ Assign FRQ automatically after marking     │
│                                               │
│         [Cancel]  [Mark Complete]             │
└───────────────────────────────────────────────┘
```

#### Step 1.3: System Auto-Generates FRQ
```
⚙️ Backend Logic (POST /api/admin/frq/assign)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Quiz score: 85%
2. Score >= 80% → GENERAL FRQ (broad argumentation)
3. Get student's reasoning stage: "generic"
4. Generate scaffolding:
   - Level: "structural" (theorem hints only)
   - Week reference: 3 (Global Argumentation)
5. Generate content links:
   - Week 1: Error-Forcing Problems
   - Week 3: Global Argumentation

✅ FRQ Assignment Created:
   - ID: frq-assign-005
   - Type: General
   - Due: March 17, 2025 (7 days)
   - Scaffolding: Structural hints
   - Status: Pending
```

**System generates this problem:**
```
Problem Statement:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Explain the relationship between differentiability
and continuity. Provide a rigorous proof using the
CERC framework.

Your response should:
• State a clear claim about the relationship
• Provide mathematical evidence
• Reference relevant theorems
• Explicitly verify all conditions

Use proper notation and justify each step.
```

---

### Phase 2: Student Sees FRQ Assignment

#### Step 2.1: Student Dashboard
```
🏠 Student Dashboard (/student)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Welcome back, Ananya
AP Math Justification Training

┌─────────────────────────────────────────────┐
│ 🎯 CERC Training - Week 1                   │
│ Error-Forcing Problems                      │
│                                             │
│ Breaking empirical illusions                │
│                                             │
│ • 3 Problems                                │
│ • 15-20 min each                           │
│ • Full Scaffolding                         │
│                                             │
│              [Start Training →]             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 📝 Your FRQ Assignments                     │
├─────────────────────────────────────────────┤
│                                             │
│ ⚡ NEW                                      │
│ General FRQ                                 │
│ [PENDING]                                   │
│                                             │
│ Assigned: March 10, 2025                    │
│ Due: March 17, 2025                         │
│                                             │
│ 📄 Study Week 3 First                       │
│                                             │
│ Before attempting this FRQ, review:         │
│ • Week 1: Error-Forcing Problems           │
│ • Week 3: Global Argumentation             │
│                                             │
│              [View Assignment →]            │
└─────────────────────────────────────────────┘
```

#### Step 2.2: FRQ Detail View
```
📄 FRQ Assignment (/student/frq/frq-assign-005)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

General FRQ • Due March 17, 2025

┌─────────────────────────────────────────────┐
│ 📚 Study Week 3 First                       │
│                                             │
│ Before attempting this FRQ, review the      │
│ relevant course content to strengthen your  │
│ justification skills.                       │
│                                             │
│ Recommended Content:                        │
│ • Week 1, Error-Forcing Problems:          │
│   Identifying when theorems cannot be      │
│   applied                                   │
│                                             │
│ • Week 3, Global Argumentation:            │
│   Applying CERC framework to any problem   │
│                                             │
│              [Go to Week 1 →]               │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ ✓ CERC Framework Guide [Structural Hints]  │
│                                             │
│ Key Points:                                 │
│ • State the relationship clearly           │
│ • Provide a counterexample if needed       │
│ • Reference the definition of              │
│   differentiability                        │
│ • Use the limit definition explicitly      │
│                                             │
│ Remember: Differentiability implies        │
│ continuity, but NOT the reverse.           │
└─────────────────────────────────────────────┘

Problem Statement:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Explain the relationship between
differentiability and continuity...
```

---

### Phase 3: Student Studies Week 1 Content

#### Step 3.1: Week 1 Training
```
📖 Week 1: Error-Forcing Problems
   (/student/week/1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Progress: 1 / 3

┌───────────── LEFT: Problem ─────────────────┐
│                                             │
│ 📘 Mean Value Theorem: Discontinuity Trap  │
│                                             │
│ Consider the function f(x) = 1/x²          │
│ on the interval [-1, 1].                   │
│                                             │
│ Task: Apply the Mean Value Theorem...      │
│                                             │
├─────────────────────────────────────────────┤
│ 📚 Mean Value Theorem                      │
│                                             │
│ Statement: If f is continuous on [a,b]     │
│ and differentiable on (a,b)...             │
│                                             │
│ Hypotheses:                                 │
│ 1. f is continuous on [a,b]                │
│ 2. f is differentiable on (a,b)            │
├─────────────────────────────────────────────┤
│ ✓ CERC Sentence Frames                     │
│                                             │
│ Claim: The MVT [applies / does not        │
│        apply] because...                    │
│                                             │
│ Evidence: f(x) = 1/x² is [continuous /    │
│           discontinuous] on [-1,1]...       │
└─────────────────────────────────────────────┘

┌───────────── RIGHT: CERC Form ──────────────┐
│                                             │
│ Your CERC Response                          │
│                                             │
│ Claim: *                                    │
│ ┌─────────────────────────────────────┐   │
│ │ The Mean Value Theorem does not     │   │
│ │ apply to f(x) = 1/x² on [-1, 1]    │   │
│ │ because the function is              │   │
│ │ discontinuous at x = 0, which lies   │   │
│ │ in the interval.                     │   │
│ └─────────────────────────────────────┘   │
│                                             │
│ Evidence: *                                 │
│ ┌─────────────────────────────────────┐   │
│ │ f(x) = 1/x² is undefined at x=0.    │   │
│ │ lim(x→0) 1/x² = ∞, so the function  │   │
│ │ has a discontinuity at x=0.          │   │
│ │                                      │   │
│ │ The difference quotient:             │   │
│ │ (f(1) - f(-1))/(1-(-1)) = (1-1)/2   │   │
│ │ = 0                                  │   │
│ └─────────────────────────────────────┘   │
│                                             │
│ [Submit for Feedback]                       │
└─────────────────────────────────────────────┘
```

#### Step 3.2: Claude Socratic Feedback
```
┌─────────────────────────────────────────────┐
│ 🤖 Claude's Feedback                        │
├─────────────────────────────────────────────┤
│                                             │
│ <p><strong>Excellent work on your claim    │
│ and evidence!</strong> You correctly        │
│ identified that the MVT does not apply and  │
│ explained why f(x) = 1/x² is discontinuous  │
│ at x = 0.</p>                               │
│                                             │
│ <p>Your reasoning section is on the right   │
│ track, but I'd like you to be more          │
│ explicit:</p>                               │
│                                             │
│ <ul>                                        │
│   <li>Which specific hypothesis of MVT is   │
│      violated?</li>                         │
│   <li>State the hypothesis verbatim, then   │
│      show how it fails</li>                 │
│ </ul>                                       │
│                                             │
│ <p>Your conditions section should make it   │
│ crystal clear: "MVT requires continuity on  │
│ [a,b]. Since f is discontinuous at x=0 ∈    │
│ [-1,1], this hypothesis is NOT satisfied."  │
│ </p>                                        │
│                                             │
│         [Revise Response] [Next Problem →]  │
└─────────────────────────────────────────────┘
```

**Ananya completes all 3 problems:**
- Problem 1: MVT Discontinuity ✅
- Problem 2: IVT Jump Discontinuity ✅
- Problem 3: MVT Absolute Value ✅

**XP Earned:** +150 XP (50 per problem)
**Badge Unlocked:** 🔍 "The Skeptic" - Survived error-forcing problems

---

### Phase 4: Solving the FRQ

#### Step 4.1: Return to FRQ
```
📄 FRQ Assignment (/student/frq/frq-assign-005)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ananya now has:
• Practiced CERC framework (Week 1)
• Learned to verify conditions
• Understands structural hints

She solves the FRQ on paper...
```

#### Step 4.2: Handwritten Work (Paper)
```
Ananya's FRQ Solution (on paper):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLAIM: If a function is differentiable at a
point, then it is continuous at that point.

EVIDENCE: Let f be differentiable at x = a.
By definition of derivative:
f'(a) = lim(h→0) [f(a+h) - f(a)]/h exists.

We can write:
lim(h→0) [f(a+h) - f(a)] = lim(h→0) h · [f(a+h)-f(a)]/h
                         = lim(h→0) h · lim(h→0) [f(a+h)-f(a)]/h
                         = 0 · f'(a)
                         = 0

Therefore: lim(h→0) f(a+h) = f(a)
Which means f is continuous at a.

REASONING: I used the definition of
differentiability and limit properties. Since
the derivative exists, I can manipulate the
limit to show that lim(x→a) f(x) = f(a), which
is the definition of continuity.

CONDITIONS: For differentiability at a:
✓ f'(a) must exist (given)
✓ The limit lim(h→0) [f(a+h)-f(a)]/h must exist

I verified that the limit lim(h→0) h = 0 and
used the product rule for limits.

[Includes diagram showing h → 0]
```

#### Step 4.3: Upload & Self-Evaluation
```
📤 Upload Your Solution
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: Upload Work
┌─────────────────────────────────────────────┐
│  📷 Drag & drop or click to upload          │
│                                             │
│  ananya_frq_005.jpg ✓ Uploaded             │
│  (1.2 MB)                                   │
└─────────────────────────────────────────────┘

Step 2: Self-Evaluate (0-9 points)
┌─────────────────────────────────────────────┐
│ How would you score your response?          │
│                                             │
│ Score: [7] / 9                              │
│                                             │
│ Reflection Notes:                           │
│ ┌─────────────────────────────────────┐   │
│ │ I think my proof is solid, but I'm  │   │
│ │ not 100% sure if I needed to        │   │
│ │ explicitly state the limit product  │   │
│ │ rule as a "condition". I verified   │   │
│ │ differentiability exists but maybe  │   │
│ │ should have been more explicit about│   │
│ │ why I can split the limits.         │   │
│ └─────────────────────────────────────┘   │
│                                             │
│         [Submit for Grading →]              │
└─────────────────────────────────────────────┘
```

**Status changes:**
- Assignment: pending → submitted
- Appears in Admin "Awaiting Grading" tab

---

### Phase 5: Admin Dual Grading

#### Step 5.1: Admin Sees Submission
```
🔧 Admin FRQ Review (/admin/frq-review)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Awaiting Grading Tab]

┌─────────────────────────────────────────────┐
│ Ananya Kakarlapudi                          │
│ General FRQ                                 │
│                                             │
│ Submitted: March 10, 2025 - 5:45 PM        │
│ Self-Score: 7/9                             │
│                                             │
│ "I think my proof is solid, but I'm not     │
│  100% sure if I needed to explicitly        │
│  state the limit product rule..."           │
│                                             │
│ [View Submission] [Start Dual Grading]      │
└─────────────────────────────────────────────┘
```

#### Step 5.2: Sebastian Clicks "Start Dual Grading"
```
⚙️ Backend Processing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Fetch image: ananya_frq_005.jpg
2. Convert to base64
3. Send to Claude Vision API:
   - Model: claude-opus-4-6
   - Prompt: CERC rubric grading
   - Image: base64 data
4. Claude analyzes handwritten work
5. Returns JSON with scores + feedback
6. Create DualGradingResult record
7. Redirect to consolidation page
```

**Claude Vision Response:**
```json
{
  "score": 8,
  "cerc": {
    "claim": {
      "score": 3,
      "feedback": "Excellent claim. States the relationship clearly and precisely: 'If differentiable, then continuous.'"
    },
    "evidence": {
      "score": 3,
      "feedback": "Strong evidence. Uses the formal definition of derivative and manipulates limits correctly. Shows lim(h→0) [f(a+h) - f(a)] = 0, which directly implies continuity."
    },
    "reasoning": {
      "score": 2,
      "feedback": "Good reasoning. Connects the derivative definition to the continuity definition using limit properties. Clear logical flow."
    },
    "conditions": {
      "score": 0,
      "feedback": "Conditions section is weak. You verified that f'(a) exists (given), but you should explicitly state why limit product rule applies (because both limits exist and are finite). This is a hypothesis of the product rule that needs verification."
    }
  },
  "reasoningStage": "generic",
  "missingElements": [
    "Did not explicitly verify hypotheses of limit product rule",
    "Could be more formal about why lim(h→0) h · lim(h→0) [...] = [lim(h→0) h] · [lim(h→0) ...]"
  ],
  "overallFeedback": "This is a strong proof with clear mathematical reasoning. The main weakness is the conditions section, where you need to be more explicit about verifying the hypotheses of every theorem/rule you use (including limit laws). Otherwise, excellent work!",
  "suggestedActionPoints": [
    "When using limit laws (product, sum, quotient), state the law explicitly and verify its hypotheses are met",
    "Your proof structure is excellent - continue using this level of rigor in future FRQs",
    "Consider adding a brief concluding sentence that restates the claim to close the argument"
  ]
}
```

#### Step 5.3: Consolidation Page
```
🔄 Consolidate Feedback
   (/admin/frq-review/consolidate/dual-grade-xxx)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Consolidate feedback for: Ananya Kakarlapudi
Assignment: General FRQ

┌──────────── Student Work ─────────────┐
│                                       │
│  [Image: ananya_frq_005.jpg]         │
│                                       │
│  Shows handwritten proof with         │
│  clear CERC structure...              │
└───────────────────────────────────────┘

┌──────── Claude Vision AI ────────┬──── MathGrader.AI ────┐
│                                   │                       │
│ Score: 8 / 9                     │ (Optional)            │
│                                   │                       │
│ CERC Breakdown:                   │ Sebastian can paste   │
│ • Claim: 3/3 ✓                   │ MathGrader output     │
│ • Evidence: 3/3 ✓                │ here for comparison   │
│ • Reasoning: 2/2 ✓               │                       │
│ • Conditions: 0/1 ✗              │ Or leave blank and    │
│                                   │ use only Claude       │
│ Reasoning Stage: Generic          │                       │
│                                   │                       │
│ Feedback:                         │                       │
│ "Strong proof with clear          │                       │
│  reasoning. Main weakness is      │                       │
│  conditions section - needs       │                       │
│  explicit verification of limit   │                       │
│  law hypotheses..."               │                       │
│                                   │                       │
│ Action Points:                    │                       │
│ 1. State limit laws explicitly    │                       │
│ 2. Excellent structure - continue │                       │
│ 3. Add concluding sentence        │                       │
└───────────────────────────────────┴───────────────────────┘

┌─────────────── Consolidation Form ──────────────────┐
│                                                      │
│ Final Score: [8] / 9                                │
│                                                      │
│ Consolidated Feedback:                              │
│ ┌────────────────────────────────────────────┐     │
│ │ Ananya, this is excellent work! Your proof │     │
│ │ demonstrates strong understanding of the    │     │
│ │ relationship between differentiability and  │     │
│ │ continuity.                                 │     │
│ │                                             │     │
│ │ **Strengths:**                              │     │
│ │ • Clear claim statement                     │     │
│ │ • Rigorous use of limit definitions         │     │
│ │ • Logical flow from derivative to           │     │
│ │   continuity                                │     │
│ │                                             │     │
│ │ **Area for Growth:**                        │     │
│ │ The conditions section needs more rigor.    │     │
│ │ When you used the limit product rule        │     │
│ │ (splitting lim of a product), you should    │     │
│ │ explicitly state: "By the limit product     │     │
│ │ rule, since both lim(h→0) h and            │     │
│ │ lim(h→0) [...] exist and are finite,       │     │
│ │ we can write..."                            │     │
│ │                                             │     │
│ │ This level of explicitness is what          │     │
│ │ distinguishes formal deductive reasoning    │     │
│ │ from generic reasoning.                     │     │
│ └────────────────────────────────────────────┘     │
│                                                      │
│ Action Point 1:                                      │
│ [When using limit laws, state them explicitly and   │
│  verify their hypotheses]                           │
│                                                      │
│ Action Point 2:                                      │
│ [Your proof structure is excellent - maintain this  │
│  level of organization in future FRQs]              │
│                                                      │
│ Action Point 3:                                      │
│ [Add a concluding sentence that restates the claim  │
│  to close the logical argument]                     │
│                                                      │
│ Admin Notes (internal):                             │
│ [Ananya is progressing well from generic to formal  │
│  reasoning. Next FRQ should focus on explicit       │
│  theorem hypothesis verification.]                  │
│                                                      │
│         [Save Consolidation →]                       │
└──────────────────────────────────────────────────────┘
```

**Sebastian saves consolidation:**
- DualGradingResult updated with adminConsolidation
- Assignment status: submitted → graded
- Ready for delivery

---

### Phase 6: Feedback Delivery

#### Step 6.1: Admin Delivers Feedback
```
📤 Deliver Feedback (/admin/frq-review)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Ready for Delivery Tab]

┌─────────────────────────────────────────────┐
│ Ananya Kakarlapudi                          │
│ General FRQ                                 │
│ Graded: 8/9                                 │
│                                             │
│ Consolidation complete ✓                    │
│                                             │
│         [Deliver Feedback →]                │
└─────────────────────────────────────────────┘

Click → Status: graded → feedback_delivered
Email notification sent to Ananya (optional)
```

#### Step 6.2: Student Receives Feedback
```
🏠 Student Dashboard (/student)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────┐
│ ⚡ NEW FEEDBACK AVAILABLE                    │
│                                             │
│ General FRQ - Graded: 8/9                  │
│                                             │
│         [View Feedback →]                   │
└─────────────────────────────────────────────┘
```

#### Step 6.3: Feedback Detail View
```
📊 FRQ Feedback (/student/frq/frq-assign-005)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

General FRQ • Final Score: 8 / 9

┌─────────────────────────────────────────────┐
│ 🎉 Excellent Work, Ananya!                  │
├─────────────────────────────────────────────┤
│                                             │
│ Ananya, this is excellent work! Your proof  │
│ demonstrates strong understanding of the     │
│ relationship between differentiability and   │
│ continuity.                                  │
│                                             │
│ **Strengths:**                              │
│ • Clear claim statement                     │
│ • Rigorous use of limit definitions         │
│ • Logical flow from derivative to continuity│
│                                             │
│ **Area for Growth:**                        │
│ The conditions section needs more rigor.    │
│ When you used the limit product rule        │
│ (splitting lim of a product), you should    │
│ explicitly state: "By the limit product     │
│ rule, since both lim(h→0) h and            │
│ lim(h→0) [...] exist and are finite, we    │
│ can write..."                               │
│                                             │
│ This level of explicitness is what          │
│ distinguishes formal deductive reasoning    │
│ from generic reasoning.                     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 🎯 Action Points for Next FRQ               │
├─────────────────────────────────────────────┤
│                                             │
│ 1. When using limit laws, state them        │
│    explicitly and verify their hypotheses   │
│                                             │
│ 2. Your proof structure is excellent -      │
│    maintain this level of organization in   │
│    future FRQs                              │
│                                             │
│ 3. Add a concluding sentence that restates  │
│    the claim to close the logical argument  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 📈 Your Progress                            │
├─────────────────────────────────────────────┤
│                                             │
│ Reasoning Stage: Generic → Progressing      │
│ XP Earned: +200 XP (Score 8/9)             │
│ Total XP: 350 XP                           │
│                                             │
│ Keep up the excellent work! You're on track│
│ to advance to Formal reasoning.            │
└─────────────────────────────────────────────┘
```

---

## 📊 Summary of Journey

### Timeline
```
2:30 PM  - Quiz completed (MathAcademy)
2:35 PM  - Admin marks quiz complete
2:35 PM  - FRQ auto-assigned (General, 7-day deadline)
3:00 PM  - Student sees FRQ + Week 1 recommendation
3:15 PM  - Student starts Week 1 training
4:30 PM  - Completes Week 1 (3 problems, +150 XP, badge)
5:00 PM  - Solves FRQ on paper
5:30 PM  - Uploads work + self-evaluates (7/9)
5:45 PM  - Submission appears in Admin dashboard
6:00 PM  - Admin triggers dual grading (Claude Vision)
6:05 PM  - Admin reviews consolidation page
6:15 PM  - Admin saves final feedback (8/9)
6:20 PM  - Admin delivers feedback
6:21 PM  - Student receives notification
6:25 PM  - Student reads feedback + action points
```

### Key Metrics
- **Quiz Score:** 85% (high performer)
- **FRQ Type:** General (broad argumentation)
- **Scaffolding Level:** Structural (hints only, no frames)
- **Self-Evaluation:** 7/9
- **Claude Vision Score:** 8/9
- **Final Score:** 8/9
- **XP Earned:** +200 XP (FRQ) + 150 XP (Week 1) = 350 XP
- **Badge Unlocked:** 🔍 "The Skeptic"
- **Reasoning Stage:** Generic (on track to Formal)

### What Worked Well
✅ **Course-specific scaffolding:** Calculus student got calculus content
✅ **Week 1 training first:** Practiced CERC before real FRQ
✅ **Adaptive scaffolding:** Generic stage → structural hints (not full frames)
✅ **Dual grading:** Claude Vision + admin consolidation
✅ **Actionable feedback:** 3 specific next steps
✅ **Progress tracking:** XP, badges, reasoning stage advancement

### Next FRQ for Ananya
When she completes another quiz:
- If score >= 80%: Another General FRQ (continuing broad skill development)
- If score < 80%: Topic-specific FRQ (targeted remediation)
- Scaffolding will adapt if she advances to Formal stage

---

## 🔄 Flow Diagram

```
MathAcademy Quiz (85%)
         ↓
Admin Marks Complete
         ↓
System Auto-Generates FRQ
  • Type: General (score >= 80%)
  • Scaffolding: Structural (stage: generic)
  • Week Ref: 1 & 3
         ↓
Student Dashboard
  • Sees new FRQ (pending)
  • Recommendation: Study Week 1 first
         ↓
Week 1 Training
  • 3 error-forcing problems
  • CERC practice with Claude feedback
  • Earns 150 XP + badge
         ↓
Return to FRQ
  • Reads problem + hints
  • Solves on paper
         ↓
Upload + Self-Evaluate
  • Photo upload
  • Score 7/9
  • Reflection notes
         ↓
Admin Dual Grading
  • Claude Vision: 8/9 (automatic)
  • MathGrader.AI: (optional manual)
         ↓
Admin Consolidation
  • Side-by-side comparison
  • Final score: 8/9
  • 3 action points
  • Internal admin notes
         ↓
Deliver Feedback
  • Student sees: Score + feedback + action points
  • Earns 200 XP
  • Reasoning stage progresses
         ↓
Next Quiz Cycle Begins...
```

---

*This document demonstrates the complete end-to-end flow for a high-performing calculus student from quiz completion to feedback delivery.*
