# Week 4 Update Summary - Boss Battle → AP Exam Simulation

**Date:** 2026-03-22
**Status:** ✅ Code updated, videos need regeneration

---

## 🔄 CHANGES MADE

### 1. `data/week-4-content.ts` - COMPLETE REWRITE

**OLD Structure:**
```typescript
interface BossBattle {
  phases: {
    phase1: "Individual: Untangle Evidence"
    phase2: "Team: Construct Argument" ← COLLABORATIVE
    phase3: "Curveball: Adapt Under Pressure" ← TIMED
  }
}
```

**NEW Structure:**
```typescript
interface APExamSimulation {
  timeLimit: 25-30 minutes (no phases)
  parts: { partA, partB, partC, partD? }
  scoringRubric: AP-style point breakdown
  // Individual work only, timed, no scaffolding
}
```

**Key Changes:**
- ❌ Removed: 3-phase structure (Individual → Team → Curveball)
- ❌ Removed: Collaborative Phase 2
- ❌ Removed: "Curveball" concept with mid-problem surprises
- ✅ Added: Single long-form FRQ with 3-4 parts
- ✅ Added: Official AP rubric scoring structure
- ✅ Added: Consistent 25-30 min time limit per course

**New Problems Created:**
1. **Calculus AB:** Related rates + MVT + optimization (25 min)
2. **Calculus BC:** Polar curves + arc length + MVT (30 min)
3. **Statistics:** Study design critique + hypothesis test (25 min)

---

### 2. `CLAUDE.md` - Updated References

**Changes:**
- Week 4 table entry: "Boss Battle — integrated AP FRQ synthesis" → "AP Exam Simulation — individual timed FRQ (25-30 min)"
- Scaffolding: "Timed (AP conditions)" → "None (exam conditions)"
- Detailed section rewritten:
  - OLD: "Multi-phase collaborative structure for the full cohort"
  - NEW: "Individual timed FRQ under real exam conditions"
- Build Order Step 10: "Boss Battle mode: Week 4 multi-phase collaborative challenge" → "AP Exam Simulation mode: Week 4 individual timed FRQ"

---

### 3. `COURSE_PROGRESS_AND_STUDENT_FLOWS.md` - Updated All References

**Changes:**
- Global replace: "Boss Battle" → "AP Exam Simulation" (11 occurrences)
- Detailed flow sections rewritten for all 3 courses
- Badge updated: ⚔️ "Boss Slayer" → 🎓 "Exam Ready"
- Component URL: `/student/week/4/battle` → `/student/week/4/exam`
- Removed all mentions of:
  - "Phase 1/2/3" structure
  - "Team collaboration"
  - "Curveball" constraints
  - "Cohort works as one team"

---

## 📹 VIDEOS AFFECTED

### ❌ Videos with INCORRECT concept (need regeneration)

These 3 videos are currently generating with the OLD collaborative Boss Battle concept:

**Video 5/7: AB Week 4**
- Current title: "Boss Battle Preparation Guide"
- Current content: 3 phases (Individual → Team → Curveball)
- ❌ WRONG: Mentions team collaboration, phases, curveball strategy

**Video 6/7: BC Week 4**
- Current title: "BC Boss Battle Polar Challenge"
- Current content: Team strategy for polar curves, collaborative approach
- ❌ WRONG: Mentions team discussion, phase transitions

**Video 7/7: Stats Week 4**
- Current title: "Study Design Critique Boss Battle"
- Current content: Team discussion, phases, curveball reveal
- ❌ WRONG: Mentions collaborative analysis, team argument building

### ✅ Correct NEW video prompts (for regeneration tomorrow)

**Video 5/7: AB Week 4 (NEW)**
```
Title: "AB Week 4: AP Exam Simulation - Timed FRQ Strategies"

Content Structure:
[0:00-2:00] What is Week 4 AP Exam Simulation
  - Individual timed FRQ (25 minutes)
  - No scaffolding, blank canvas
  - Multi-part problem (3-4 parts)
  - Scored using official AP rubric

[2:00-6:00] Time Management Strategies
  - Read all parts first (2 min)
  - Allocate time per part: Part A (8 min), Part B (10 min), Part C (5 min)
  - Leave buffer for review (2 min)
  - Don't get stuck on one part

[6:00-10:00] AB-Specific Skills Tested
  - Related rates with full condition verification
  - MVT application with rigorous justification
  - Optimization with calculus proof
  - All parts require CERC framework

[10:00-12:00] Final Tips
  - Verify theorem conditions explicitly
  - Show all work, even if time is short
  - Use proper mathematical notation
  - Practice exam breathing techniques
```

**Video 6/7: BC Week 4 (NEW)**
```
Title: "BC Week 4: AP Exam Simulation - Advanced FRQ Under Pressure"

Content Structure:
[0:00-2:00] BC Exam Simulation Overview
  - 30 minutes (5 more than AB due to complexity)
  - Polar curves + parametric + series convergence
  - 4 parts (A-D) with progressive difficulty

[2:00-7:00] BC Time Allocation
  - Part A: Polar area calculation (7 min)
  - Part B: MVT application (8 min)
  - Part C: Arc length setup (7 min)
  - Part D: Optimization analysis (8 min)

[7:00-11:00] BC-Specific Advanced Techniques
  - Polar coordinate condition checking
  - Parametric differentiation justification
  - Series convergence test selection
  - Integration with theorem verification

[11:00-12:00] Exam Day Mindset
  - BC problems are harder, that's expected
  - Partial credit strategy
  - Skip and return if stuck
```

**Video 7/7: Stats Week 4 (NEW)**
```
Title: "Stats Week 4: AP Exam Simulation - Inference and Study Design FRQ"

Content Structure:
[0:00-2:00] Stats Exam Simulation Format
  - 25 minutes individual work
  - Study design critique + hypothesis test
  - 3 parts focusing on inference and causation

[2:00-6:00] Time Management for Stats FRQ
  - Part A: Identify procedure + verify conditions (8 min)
  - Part B: Conduct hypothesis test (10 min)
  - Part C: Analyze confounding/validity (7 min)

[6:00-10:00] Stats-Specific Exam Skills
  - Complete condition verification checklist
  - Probability language in conclusions
  - Distinguish causation vs correlation
  - Identify confounding variables

[10:00-12:00] Common Stats FRQ Mistakes
  - Forgetting to check ALL 4 conditions
  - Using causal language in observational studies
  - Not stating conclusion in context
  - Skipping units or sample size justification
```

---

## 🖼️ INFOGRAPHICS STATUS

Current infographic filenames still reference "boss-battle":
- `calculus-ab/week4/infographics/boss-battle-challenge.png`
- `calculus-bc/week4/infographics/polar-curve-challenge.png`
- `statistics/week4/infographics/study-critique-challenge.png`

**Options:**
1. **Leave as-is:** File names don't affect functionality (just rename references in code)
2. **Regenerate:** Create new infographics with "AP Exam Simulation" branding

**Decision needed:** User to decide if infographics need visual updates or just filename changes.

---

## 📝 NEXT STEPS

### TODAY (while videos 1-7 finish generating)
- [x] Update `week-4-content.ts` - DONE
- [x] Update `CLAUDE.md` - DONE
- [x] Update `COURSE_PROGRESS_AND_STUDENT_FLOWS.md` - DONE
- [ ] Decide on infographic regeneration

### TOMORROW (after 7 videos complete)
1. Download Videos 1-4 + Video 2 (Stats Week 2) - these are CORRECT
2. Delete Videos 5-7 (AB/BC/Stats Week 4) - these are WRONG
3. Regenerate Videos 5-7 with correct "AP Exam Simulation" prompts
4. Space regeneration: 30-60 min apart to avoid rate limits
5. Update `MATERIALS_INVENTORY.md` when all complete

---

## 🔍 VERIFICATION CHECKLIST

**Code Files:**
- [x] `data/week-4-content.ts` - No "Boss Battle" or "Team" or "Curveball"
- [x] `CLAUDE.md` - No collaborative language in Week 4 section
- [x] `COURSE_PROGRESS_AND_STUDENT_FLOWS.md` - All flows show individual timed work

**UI Components (to verify later):**
- [ ] `app/student/week/4/` routes - Need to update from `/battle` to `/exam`
- [ ] Timer component exists or needs creation
- [ ] Exam-style submission (no hints, no scaffolding)

**Data References:**
- [x] Export name: `apExamSimulations` (was `bossBattles`)
- [x] Config: `week4Config` updated with correct description
- [ ] Check if any components import the old `BossBattle` interface

---

## ✅ CONCEPT CONFIRMATION

**Week 4 is NOW:**
- ✅ Individual work only (no team, no collaboration)
- ✅ Single timed FRQ per course (25-30 min)
- ✅ Multi-part structure (A, B, C, optionally D)
- ✅ No scaffolding (blank canvas like real AP exam)
- ✅ Scored with official AP rubric
- ✅ Simulates May exam pressure and time constraints

**Week 4 is NOT:**
- ❌ Collaborative/team-based
- ❌ Multi-phase with curveball surprises
- ❌ Untimed then timed
- ❌ "Epic battle" or "challenge" framing
- ❌ Gamified beyond normal XP/badges

---

**IMPLEMENTATION STATUS:** Code updates complete. Awaiting video regeneration tomorrow.
