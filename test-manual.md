# Manual Test Checklist - Week 1 Flow

## Pre-requisites
- Dev server running: `npm run dev`
- Browser at: http://localhost:3000

## Test Flow

### 1. Authentication & Dashboard Access
- [ ] Navigate to `/student`
- [ ] Login redirects properly
- [ ] Dashboard loads without errors
- [ ] Student info displays correctly (name, course, XP)

### 2. Week 1 Landing Page (`/student/week/1`)
**Expected:**
- [ ] Hero section with Spotlight effect
- [ ] Week 1 title and description
- [ ] Tabbed interface (Problem, Solution, Method, Path)
- [ ] "Start Training" CTA button
- [ ] All animations work (BlurFade, motion)
- [ ] LaTeX formulas render correctly

**Test:**
1. Click through all 4 tabs
2. Check that content loads in each tab
3. Verify no console errors
4. Test keyboard navigation (if implemented)

### 3. Problems List (`/student/week/1/problems`)
**Expected:**
- [ ] Breadcrumbs navigation works
- [ ] Course filter displays (Calc AB/BC or Stats)
- [ ] Week 1 objectives section
- [ ] Problem cards display correctly

**Critical Tests:**
1. **Course Filtering:**
   - [ ] Switch to Calc AB → see 3 Calculus problems
   - [ ] Switch to Calc BC → see 3 Calculus problems
   - [ ] Switch to Statistics → see 3 Statistics problems

2. **Problem Cards:**
   - [ ] Problem 1 (w1-mvt-001) displays with correct title
   - [ ] Problem 2 (w1-ivt-001) displays with correct title
   - [ ] Problem 3 varies by course
   - [ ] Error category badges show correctly
   - [ ] Trap description displays
   - [ ] "Start Problem" button works
   - [ ] Locked problems show lock icon (if sequential)

3. **Problem IDs Match:**
   - [ ] Calculus: w1-mvt-001, w1-ivt-001, w1-mvt-002
   - [ ] Statistics: w1-stats-001, w1-stats-002, w1-stats-003

### 4. Problem Solver - Phase by Phase (`/student/week/1/problem/w1-mvt-001`)

**Phase 1: Read Problem**
- [ ] Problem statement displays with LaTeX
- [ ] LaTeX renders correctly (fractions, integrals, etc.)
- [ ] "Start Analysis" button works
- [ ] Timer starts

**Phase 2: Solve on Paper**
- [ ] Paper icon displays
- [ ] Instructions clear about paper-only
- [ ] Pedagogical explanation visible
- [ ] "Done with Paper Work" button enabled

**Phase 3: Enter CERC Response**
- [ ] All 4 fields visible (Claim, Evidence, Reasoning, Conditions)
- [ ] Sentence frames display correctly
- [ ] Theorem info panel shows (name, statement, hypotheses)
- [ ] Hint system:
  - [ ] Level 1 hint button works
  - [ ] Level 2 hint shows after Level 1
  - [ ] Level 3 hint shows after Level 2
- [ ] LaTeX input parses correctly
- [ ] "Submit Response" button works

**Phase 4: Self-Check**
- [ ] Correct CERC skeleton displays
- [ ] Student's response shows side-by-side
- [ ] Comparison is clear
- [ ] "View Solution" button works
- [ ] Solution reveals correct answer

**Phase 5: Reflection**
- [ ] Reflection textarea displays
- [ ] Character count shows (minimum 20)
- [ ] Validation works:
  - [ ] <20 chars → error message
  - [ ] ≥20 chars → submit enabled
- [ ] "Complete Problem" button works
- [ ] XP breakdown displays correctly

**Phase 6: Completion**
- [ ] Success animation plays
- [ ] XP total shows
- [ ] Badge unlock (if earned)
- [ ] "Back to Problems" and "Next Problem" buttons work

### 5. Data Persistence Test
**After completing Problem 1:**
1. [ ] Go back to `/student/week/1/problems`
2. [ ] Problem 1 shows "Completed" badge
3. [ ] Navigate to `/student`
4. [ ] Dashboard shows Week 1 progress (1/3)
5. [ ] XP updated correctly

**Complete Problem 2:**
1. [ ] Repeat full flow for w1-mvt-002 or w1-ivt-001
2. [ ] Check dashboard shows 2/3 completed

### 6. Prerequisite System Test
**Initial State (0/3 completed):**
1. [ ] Go to `/student`
2. [ ] Check for blocked FRQ section
3. [ ] Blocked FRQ card shows progress bar (0/2)
4. [ ] "Locked Assignments" section displays
5. [ ] Click link → redirects to `/student/week/1/problems`

**After 1 problem (1/3 completed):**
1. [ ] Refresh `/student`
2. [ ] Progress bar updates (1/2)
3. [ ] FRQ still locked

**After 2 problems (2/3 completed):**
1. [ ] Refresh `/student`
2. [ ] FRQ unlocks and moves to "Active Assignments"
3. [ ] No longer in "Locked Assignments"
4. [ ] Can access FRQ solver

### 7. Admin Dashboard Test
**Navigate to `/admin/students`:**
- [ ] All students display in table
- [ ] Stats cards show correct totals
- [ ] Week progress bars accurate
- [ ] Flags display (inactive, struggling, no_progress)
- [ ] Click student → goes to detail view

**Student Detail (`/admin/students/ananya-001`):**
- [ ] Student name and course display
- [ ] Week 1 summary card shows
- [ ] Problem attempts listed
- [ ] CERC responses display correctly
- [ ] Session stats accurate (hints, time, revised)
- [ ] XP breakdown visible
- [ ] Reasoning stage badge shows

### 8. Edge Cases & Error Handling
- [ ] Invalid problem ID → 404 or redirect
- [ ] Navigate away mid-problem → data not lost (if autosave)
- [ ] Reload during CERC entry → session preserved
- [ ] Console has no errors
- [ ] Network tab shows no failed requests

### 9. LaTeX Rendering Stress Test
**Check these specific formulas render correctly:**
- [ ] `$f(x) = \frac{1}{x^2}$` (fraction)
- [ ] `$\lim_{x \to 0} f(x)$` (limit)
- [ ] `$$f'(c) = \frac{f(1) - f(-1)}{1 - (-1)}$$` (display math)
- [ ] `$\begin{cases}...\end{cases}$` (piecewise functions)
- [ ] `$\mathbb{R}$` (special symbols)

### 10. Mobile Responsiveness (if time)
- [ ] Test on narrow viewport (<768px)
- [ ] Navigation works
- [ ] CERC form usable
- [ ] No horizontal scroll

## Bugs Found

| # | Page | Description | Severity | Status |
|---|------|-------------|----------|--------|
| | | | | |

## Notes
- Document any unexpected behavior
- Screenshot any UI issues
- Check browser console for errors
- Note performance issues
