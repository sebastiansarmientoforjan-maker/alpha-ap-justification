# 🧪 Testing Guide: Live Platform Walkthrough

## Prerequisites
```bash
npm run dev
# Server should start at http://localhost:3000
```

---

## 🎯 Full Journey Test: Calculus Student (High Score)

### Step 1: Admin Dashboard - Mark Quiz Complete
**URL:** `http://localhost:3000/admin/dashboard`

**What to do:**
1. Navigate to admin dashboard
2. Click on **"Unassigned Quizzes"** tab
3. Look for a quiz with score ≥ 80%
4. Click **"Mark as Complete"** button
5. Enter score: `85`
6. Check ☑ "Assign FRQ automatically"
7. Click **"Mark Complete"**

**Expected Result:**
- Success toast appears
- Quiz moves to assigned section
- FRQ auto-created (type: General)

---

### Step 2: Student Dashboard - See New FRQ
**URL:** `http://localhost:3000/student`

**What to see:**
```
┌─────────────────────────────┐
│ 🎯 CERC Training - Week 1   │
│ Error-Forcing Problems      │
│ [Start Training →]          │
└─────────────────────────────┘

┌─────────────────────────────┐
│ 📝 Your FRQ Assignments     │
│                             │
│ NEW: General FRQ            │
│ [PENDING]                   │
│ Due: March 17, 2025         │
│                             │
│ 📄 Study Week 3 First       │
│ [View Assignment →]         │
└─────────────────────────────┘
```

**What to do:**
- Click **"View Assignment"** on the FRQ card

---

### Step 3: FRQ Detail Page - See Scaffolding
**URL:** `http://localhost:3000/student/frq/[assignmentId]`

**What to see:**
```
┌─────────────────────────────┐
│ 📚 Study Week 3 First       │
│                             │
│ Recommended Content:        │
│ • Week 1: Error-Forcing     │
│ • Week 3: Global Argument   │
│                             │
│ [Go to Week 1 →]            │
└─────────────────────────────┘

┌─────────────────────────────┐
│ ✓ CERC Framework Guide      │
│ [Structural Hints]          │
│                             │
│ Key Points:                 │
│ • State relationship clearly│
│ • Reference definitions     │
│ • Use limit definition      │
└─────────────────────────────┘

Problem Statement:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Explain the relationship between
differentiability and continuity...
```

**What to do:**
- Read the scaffolding hints
- Click **"Go to Week 1"** button

---

### Step 4: Week 1 Training - Problem 1
**URL:** `http://localhost:3000/student/week/1`

**What to see (Split Screen):**

**LEFT PANEL:**
```
Progress: 1 / 3

┌─────────────────────────────┐
│ 📘 Mean Value Theorem:      │
│    The Discontinuity Trap   │
│                             │
│ Consider f(x) = 1/x²       │
│ on [-1, 1]...              │
└─────────────────────────────┘

┌─────────────────────────────┐
│ 📚 Mean Value Theorem       │
│                             │
│ Hypotheses:                 │
│ 1. Continuous on [a,b]      │
│ 2. Differentiable on (a,b)  │
└─────────────────────────────┘

┌─────────────────────────────┐
│ ✓ CERC Sentence Frames      │
│                             │
│ Claim: The MVT [applies /   │
│        does not apply]...   │
└─────────────────────────────┘
```

**RIGHT PANEL:**
```
┌─────────────────────────────┐
│ Your CERC Response          │
│                             │
│ Claim: *                    │
│ [Empty textarea]            │
│                             │
│ Evidence: *                 │
│ [Empty textarea]            │
│                             │
│ Reasoning: *                │
│ [Empty textarea]            │
│                             │
│ Conditions: *               │
│ [Empty textarea]            │
│                             │
│ [Submit for Feedback]       │
└─────────────────────────────┘
```

**What to do:**
1. Fill out CERC form:
   - **Claim:** "The Mean Value Theorem does not apply because the function is discontinuous at x=0"
   - **Evidence:** "f(x) = 1/x² is undefined at x=0. lim(x→0) 1/x² = ∞"
   - **Reasoning:** "MVT requires continuity on [a,b]. Since f has a discontinuity at x=0 ∈ [-1,1], the hypothesis is violated"
   - **Conditions:** "Checking continuity: f is discontinuous at x=0 because it's undefined there"

2. Click **"Submit for Feedback"**

**Expected Result:**
- Loading spinner appears
- Claude analyzes response (takes 3-5 seconds)
- Feedback appears below form

**Claude Feedback Should Say Something Like:**
```
┌─────────────────────────────┐
│ 🤖 Claude's Feedback        │
│                             │
│ Excellent work! You         │
│ correctly identified that   │
│ MVT does not apply because  │
│ of the discontinuity at     │
│ x = 0.                      │
│                             │
│ Your conditions section is  │
│ particularly strong...      │
│                             │
│ [Next Problem →]            │
└─────────────────────────────┘
```

3. Click **"Next Problem"** to go to Problem 2/3
4. Repeat for Problem 3/3
5. After Problem 3, click **"Complete Week 1"**

---

### Step 5: Return to FRQ - Upload Work
**URL:** `http://localhost:3000/student/frq/[assignmentId]`

**What to see:**
```
┌─────────────────────────────┐
│ 📤 Upload Your Solution     │
│                             │
│ Step 1: Upload Work         │
│ [Drag & drop or click]      │
│                             │
│ Step 2: Self-Evaluate       │
│ Score: [___] / 9            │
│                             │
│ Reflection Notes:           │
│ [textarea]                  │
│                             │
│ [Submit for Grading →]      │
└─────────────────────────────┘
```

**What to do:**
1. Upload any image file (even a test image)
2. Enter self-score: `7`
3. Enter notes: "I think my proof is solid but unsure about conditions"
4. Click **"Submit for Grading"**

**Expected Result:**
- Upload success message
- Status changes to "Submitted"
- Assignment appears in admin "Awaiting Grading"

---

### Step 6: Admin Grading - Dual Grade
**URL:** `http://localhost:3000/admin/frq-review`

**What to see:**
```
[Awaiting Grading Tab]

┌─────────────────────────────┐
│ Ananya Kakarlapudi          │
│ General FRQ                 │
│                             │
│ Submitted: Just now         │
│ Self-Score: 7/9             │
│                             │
│ "I think my proof is solid  │
│  but unsure about..."       │
│                             │
│ [Start Dual Grading]        │
└─────────────────────────────┘
```

**What to do:**
1. Click **"Start Dual Grading"**

**Expected Result:**
- System calls Claude Vision API (takes 5-10 seconds)
- Redirects to consolidation page

---

### Step 7: Consolidation Page
**URL:** `http://localhost:3000/admin/frq-review/consolidate/[dualGradingId]`

**What to see (Side-by-Side):**

**LEFT: Claude Vision**
```
┌─────────────────────────────┐
│ Claude Vision AI            │
│ Score: 8 / 9                │
│                             │
│ CERC Breakdown:             │
│ • Claim: 3/3                │
│ • Evidence: 3/3             │
│ • Reasoning: 2/2            │
│ • Conditions: 0/1           │
│                             │
│ Reasoning Stage: Generic    │
│                             │
│ Feedback:                   │
│ "Strong proof with clear    │
│  reasoning. Main weakness   │
│  is conditions section..."  │
│                             │
│ Action Points:              │
│ 1. State limit laws         │
│ 2. Excellent structure      │
│ 3. Add concluding sentence  │
└─────────────────────────────┘
```

**RIGHT: MathGrader.AI**
```
┌─────────────────────────────┐
│ MathGrader.AI (Optional)    │
│                             │
│ Not yet added               │
│                             │
│ You can paste output here   │
│ for comparison              │
└─────────────────────────────┘
```

**BOTTOM: Consolidation Form**
```
┌─────────────────────────────┐
│ Create Final Feedback       │
│                             │
│ Final Score: [8] / 9        │
│                             │
│ Consolidated Feedback:      │
│ [Pre-filled with Claude's   │
│  feedback - editable]       │
│                             │
│ Action Point 1:             │
│ [Pre-filled - editable]     │
│                             │
│ Action Point 2:             │
│ [Pre-filled - editable]     │
│                             │
│ Action Point 3:             │
│ [Pre-filled - editable]     │
│                             │
│ Admin Notes:                │
│ [Optional internal notes]   │
│                             │
│ [Save Consolidation →]      │
└─────────────────────────────┘
```

**What to do:**
1. Review Claude's analysis
2. Edit feedback if needed
3. Adjust action points if needed
4. Add admin notes (optional)
5. Click **"Save Consolidation"**

**Expected Result:**
- Success message
- Returns to FRQ Review dashboard
- Assignment moves to "Ready for Delivery" tab

---

### Step 8: Deliver Feedback
**URL:** `http://localhost:3000/admin/frq-review`

**What to see:**
```
[Ready for Delivery Tab]

┌─────────────────────────────┐
│ Ananya Kakarlapudi          │
│ General FRQ                 │
│ Graded: 8/9                 │
│                             │
│ Consolidation complete ✓    │
│                             │
│ [Deliver Feedback →]        │
└─────────────────────────────┘
```

**What to do:**
1. Click **"Deliver Feedback"**

**Expected Result:**
- Success message
- Status changes to "Delivered"
- Assignment moves to "Completed" tab

---

### Step 9: Student Sees Feedback
**URL:** `http://localhost:3000/student`

**What to see:**
```
┌─────────────────────────────┐
│ ⚡ NEW FEEDBACK AVAILABLE    │
│                             │
│ General FRQ - Graded: 8/9   │
│                             │
│ [View Feedback →]           │
└─────────────────────────────┘
```

**What to do:**
1. Click **"View Feedback"**

**Expected Result:**
Navigate to feedback detail page

---

### Step 10: Feedback Detail
**URL:** `http://localhost:3000/student/frq/[assignmentId]`

**What to see:**
```
┌─────────────────────────────┐
│ 🎉 Excellent Work, Ananya!  │
│                             │
│ Final Score: 8 / 9          │
├─────────────────────────────┤
│                             │
│ [Consolidated feedback text]│
│                             │
│ **Strengths:**              │
│ • Clear claim               │
│ • Rigorous limits           │
│                             │
│ **Area for Growth:**        │
│ • Conditions section needs  │
│   more rigor                │
└─────────────────────────────┘

┌─────────────────────────────┐
│ 🎯 Action Points            │
│                             │
│ 1. State limit laws         │
│    explicitly               │
│                             │
│ 2. Maintain excellent       │
│    structure                │
│                             │
│ 3. Add concluding sentence  │
└─────────────────────────────┘

┌─────────────────────────────┐
│ 📈 Your Progress            │
│                             │
│ Reasoning Stage: Generic    │
│ XP Earned: +200 XP          │
│ Total XP: 350 XP            │
└─────────────────────────────┘
```

---

## ✅ Complete Journey Checklist

- [ ] Admin marks quiz complete (score 85%)
- [ ] FRQ auto-assigned (General type)
- [ ] Student sees FRQ with week reference
- [ ] Student sees scaffolding (structural hints)
- [ ] Student completes Week 1 Problem 1/3
- [ ] Claude provides Socratic feedback
- [ ] Student completes Week 1 Problem 2/3
- [ ] Student completes Week 1 Problem 3/3
- [ ] Student returns to FRQ
- [ ] Student uploads work + self-evaluates
- [ ] Admin triggers dual grading
- [ ] Claude Vision analyzes work
- [ ] Admin sees consolidation page
- [ ] Admin edits and saves final feedback
- [ ] Admin delivers feedback
- [ ] Student sees feedback notification
- [ ] Student reads feedback + action points

---

## 🐛 Troubleshooting

### Issue: "Week not implemented yet"
**Solution:** Check that Week 1 content data is loaded properly
```bash
# Verify file exists
ls data/week-1-content.ts
```

### Issue: "No problems available"
**Solution:** Check student course filtering
```typescript
// In week/[weekNumber]/page.tsx
console.log("Student course:", studentCourse);
console.log("Filtered problems:", courseProblems);
```

### Issue: Claude API error
**Solution:** Check ANTHROPIC_API_KEY in .env
```bash
echo $ANTHROPIC_API_KEY
```

### Issue: Image upload fails
**Solution:** For now, any image file works (we're using mock data)
- Just upload any JPG/PNG
- Real Firebase Storage will come in Phase F

---

## 📊 What to Look For

### Design Quality
- ✅ Glassmorphic cards with backdrop blur
- ✅ Gradient borders on hover
- ✅ Smooth transitions
- ✅ KaTeX math rendering
- ✅ Color-coded sections

### Functionality
- ✅ Course filtering (calculus vs statistics)
- ✅ Scaffolding adaptation (full/structural/minimal)
- ✅ Claude Socratic feedback
- ✅ Hint system (3 levels)
- ✅ Dual grading workflow
- ✅ Side-by-side comparison

### Data Flow
- ✅ Quiz score → FRQ type decision
- ✅ Reasoning stage → scaffolding level
- ✅ Week content → CERC practice
- ✅ Upload → dual grade → consolidate → deliver
- ✅ Feedback → student dashboard

---

## 🎥 Recording the Demo

If you want to record:
1. Use OBS Studio or Loom
2. Start at admin dashboard
3. Follow all 10 steps
4. Show both admin and student views
5. Highlight key features:
   - Auto FRQ assignment
   - Course-specific problems
   - Claude feedback
   - Dual grading consolidation

---

*Happy testing! 🚀*
