# Code Updates Needed - Boss Battle → AP Exam Simulation

**Date:** 2026-03-22
**Status:** ⚠️ CRITICAL - Active code files still reference Boss Battle

---

## 🔴 CRITICAL - Active Code Files (Must Fix Before Deploy)

### 1. `app/student/week/4/battle/` - RENAME ENTIRE DIRECTORY

**Current:** `app/student/week/4/battle/`
**New:** `app/student/week/4/exam/`

**Files affected:**
- `app/student/week/4/battle/page.tsx` → `app/student/week/4/exam/page.tsx`
- `app/student/week/4/battle/instructions/page.tsx` → `app/student/week/4/exam/instructions/page.tsx`

---

### 2. `app/student/week/4/battle/page.tsx` - COMPLETE REWRITE NEEDED

**Issues:**
- Line 17: `import { bossBattles, week4Config } from "@/data/week-4-content";`
  - ❌ `bossBattles` no longer exists
  - ✅ Should import `apExamSimulations`

- Line 37: `export default function BossBattlePage() {`
  - ❌ Function name outdated
  - ✅ Should be `APExamPage()`

- Line 40: `const boss = bossBattles.find(...)`
  - ❌ Uses old data structure
  - ✅ Should use `apExamSimulations.find(...)`

- Lines 23-35: Old interface `BattleData` with 3 phases
  - ❌ `phase1`, `phase2`, `phase3` structure
  - ✅ Should be single `ExamData` with parts A/B/C/D

- Lines 42-59: Phase-based state management
  - ❌ `currentPhase`, `curveballRevealed`, `phase3Timer`
  - ✅ Should have `timeRemaining`, `currentPart`, `submitted`

- Line 63: `redirectToInstructions("boss-battle", "/student/week/4/battle")`
  - ❌ Old route
  - ✅ `redirectToInstructions("exam", "/student/week/4/exam")`

**RECOMMENDATION:** Rewrite entire file from scratch using new `APExamSimulation` interface

---

### 3. `app/student/week/4/battle/instructions/page.tsx` - REWRITE NEEDED

**Issues:**
- References old 3-phase structure
- Instructions for "Boss Battle" concept
- Links back to `/battle` route

**Should contain:**
- Exam format explanation (25-30 min, individual, multi-part)
- Time management tips
- No scaffolding warning
- Link to `/exam` route

---

### 4. `app/student/week/4/page.tsx` - UPDATE REFERENCES

**Current state:** Week 4 landing page
**Issues:**
- Line 23: `activeTab` likely references "phases"
- Contains Boss Battle terminology
- Links to `/battle` route

**Changes needed:**
- Update tab names: "phases" → "format", "strategy" → "tips", "pressure" → "timing"
- Update content: Remove phase descriptions, add exam structure
- Update CTA link: `/student/week/4/battle` → `/student/week/4/exam`
- Update breadcrumbs: "Final Challenge" → "AP Exam Simulation"

---

### 5. `app/student/intro/page.tsx` - UPDATE BADGES

**Lines to update:**

Line 74:
```typescript
// OLD:
Boss Battle mode. Collaborative AP FRQ synthesis under timed conditions.

// NEW:
AP Exam Simulation. Individual timed FRQ under real exam conditions.
```

Line 157:
```typescript
// OLD:
<li>⚔️ Boss Slayer - Complete Week 4 Boss Battle</li>

// NEW:
<li>🎓 Exam Ready - Complete Week 4 AP Exam Simulation</li>
```

---

### 6. `components/student/activity-instructions.tsx` - UPDATE TYPE

**Line 21:**
```typescript
// OLD:
activityType: "practice" | "problem" | "boss-battle";

// NEW:
activityType: "practice" | "problem" | "exam";
```

**Impact:** Any component passing `activityType` must update to `"exam"`

---

### 7. `components/animations/badge-unlock.tsx` - UPDATE BADGE DATA

**Lines 31-36:**
```typescript
// OLD:
"boss-slayer": {
  name: "Boss Slayer",
  icon: "⚔️",
  description: "Conquered the Week 4 Boss Battle",
  color: "from-red-500 to-orange-500",
},

// NEW:
"exam-ready": {
  name: "Exam Ready",
  icon: "🎓",
  description: "Completed Week 4 AP Exam Simulation",
  color: "from-red-500 to-orange-500",
},
```

**Also update:**
- Any references to `"boss-slayer"` badge ID → `"exam-ready"`
- The icon from ⚔️ → 🎓

---

### 8. `lib/prerequisites.ts` - UPDATE COMMENT

**Line 58:**
```typescript
// OLD:
* Check prerequisites for multiple weeks (for Week 4 Boss Battle)

// NEW:
* Check prerequisites for multiple weeks (for Week 4 AP Exam Simulation)
```

**Minor:** Just a comment, but should be updated for clarity

---

## 🟡 MEDIUM PRIORITY - Documentation Files

### Files with "Boss Battle" references:

1. **`public/course-materials/MATERIALS_INVENTORY.md`**
   - Lines 21, 41, 61: "Week 4: Boss Battle" headers
   - Lines 22, 96-101: Infographic filenames with `boss-battle`
   - **Action:** Update headers to "AP Exam Simulation"

2. **`NOTEBOOKLM_PROMPTS_BY_COURSE_AND_WEEK.md`**
   - Multiple references to "Boss Battle" in Week 4 sections
   - **Action:** Update all Week 4 prompts to "AP Exam Simulation"

3. **`NOTEBOOKLM_INFOGRAPHIC_PROMPT.md`**
   - Lines 20, 132, 181, etc: Boss Battle branding
   - **Action:** Update visual design language for Week 4

4. **`CONSOLIDATED_JUSTIFICATION_PLAN.md`**
   - Multiple "Boss Battle" references in schedules
   - **Action:** Replace with "AP Exam Simulation"

5. **`NOTEBOOKLM-SOURCE-1-CERC-FRAMEWORK.md`**
   - Line 244: Badge reference
   - **Action:** Update to "Exam Ready" badge

---

## 🟢 LOW PRIORITY - Legacy/Script Files

These files are not actively used in production:

1. **`scripts/fix-boss-battle.js`** - Legacy script, can be deleted
2. **`scripts/generate-personalized-plan.js`** - Multiple references
3. **`scripts/generate-docx-data.js`** - Multiple references
4. Various `.md` planning docs (PLAN_V_FINAL, FASE2, WEEK1, etc.)

**Action:** Update if time permits, but not critical for deployment

---

## 📋 UPDATE CHECKLIST

### Phase 1: Critical Code Files (Required for functionality)

- [ ] Rename `app/student/week/4/battle/` → `app/student/week/4/exam/`
- [ ] Rewrite `app/student/week/4/exam/page.tsx` (was `battle/page.tsx`)
- [ ] Rewrite `app/student/week/4/exam/instructions/page.tsx`
- [ ] Update `app/student/week/4/page.tsx` (landing page)
- [ ] Update `app/student/intro/page.tsx` (2 lines)
- [ ] Update `components/student/activity-instructions.tsx` (1 line)
- [ ] Update `components/animations/badge-unlock.tsx` (badge data)
- [ ] Update `lib/prerequisites.ts` (1 comment)

### Phase 2: Active Documentation (User-facing)

- [ ] Update `public/course-materials/MATERIALS_INVENTORY.md`
- [ ] Update `NOTEBOOKLM_PROMPTS_BY_COURSE_AND_WEEK.md`
- [ ] Update `NOTEBOOKLM_INFOGRAPHIC_PROMPT.md`
- [ ] Update `CONSOLIDATED_JUSTIFICATION_PLAN.md`
- [ ] Update `NOTEBOOKLM-SOURCE-1-CERC-FRAMEWORK.md`

### Phase 3: Legacy Files (Low priority)

- [ ] Update or delete scripts in `scripts/`
- [ ] Update old planning documents

---

## 🔍 SEARCH PATTERNS USED

To find all references, I searched for:
- `Boss Battle|boss-battle|BossBattle|bossBattle`
- `Boss Slayer|boss-slayer|⚔️`
- `/battle` (route references)
- `bossBattles` (data structure)

**Total files found:** 31 files with references

---

## ⚠️ BREAKING CHANGES

These updates will break:

1. **Any existing user progress** stored with old route `/battle`
   - **Migration needed:** Update localStorage keys from `boss-battle` to `exam`

2. **Any links/bookmarks** to `/student/week/4/battle`
   - **Solution:** Add redirect in `middleware.ts` or Next.js config

3. **Badge unlock logic** checking for `"boss-slayer"` badge
   - **Migration needed:** Update existing user badges or check both IDs

---

## 🚀 RECOMMENDED APPROACH

**Option A: Gradual Update (Safer)**
1. Update `data/week-4-content.ts` ✅ DONE
2. Update docs (CLAUDE.md, COURSE_PROGRESS) ✅ DONE
3. Keep old `/battle` routes but update content
4. Add new `/exam` routes in parallel
5. Migrate users gradually
6. Remove old routes after migration

**Option B: Hard Cutover (Faster)**
1. Update all code files in one commit
2. Rename directories
3. Update all references
4. Deploy with breaking changes
5. Accept that old links will break

**RECOMMENDATION:** Option B (Hard Cutover) since this is pre-pilot and no users exist yet.

---

## 📝 NEXT STEPS

1. **User confirms approach** (Option A or B)
2. **I update all Phase 1 files** (critical code)
3. **User tests locally** before videos regenerate
4. **Update Phase 2 files** (documentation)
5. **Regenerate videos tomorrow** with correct concept

---

**STATUS:** Awaiting user decision on update approach before proceeding.
