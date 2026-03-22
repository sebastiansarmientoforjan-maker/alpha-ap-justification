# UX/UI Analysis - Navigation & Course Routing

**Date:** 2026-03-22
**Status:** 🔴 CRITICAL ISSUES FOUND

---

## 📊 Executive Summary

**PROBLEM IDENTIFIED:** El CourseSwitcher agregado NO está conectado al contenido real. Los estudiantes ven el selector pero no cambia el contenido porque:

1. Las páginas de problemas usan `useState` local en lugar de leer del usuario autenticado
2. El CourseSwitcher solo cambia el parámetro URL pero las páginas no lo leen
3. Falta propagación del curso a través de toda la app

---

## 🗺️ Route Map

### ✅ Rutas Existentes (27 páginas)

#### Landing & Auth
- `/` - Home page ✅
- `/login` - Login page ✅
- `/unauthorized` - Access denied ✅

#### Student Routes (19 páginas)
```
/student
  ├── /intro                           # Course intro video ✅
  ├── /frq/[assignmentId]              # FRQ submission ✅
  └── /week/
      ├── /1
      │   ├── page                     # Week 1 landing ✅
      │   ├── /practice                # Practice problem ✅
      │   ├── /practice/instructions   # Practice instructions ✅
      │   ├── /problems                # Problem selection 🔴 BROKEN
      │   └── /problem/[id]            # Problem solving ✅
      │       └── /instructions        # Problem instructions ✅
      ├── /2
      │   ├── page                     # Week 2 landing ✅
      │   ├── /problems                # Problem selection 🔴 BROKEN
      │   └── /problem/[id]            # Problem solving ✅
      │       └── /instructions        # Problem instructions ✅
      ├── /3
      │   ├── page                     # Week 3 landing ✅
      │   ├── /problems                # Problem selection 🔴 BROKEN
      │   └── /problem/[id]            # Problem solving ✅
      │       └── /instructions        # Problem instructions ✅
      └── /4
          ├── page                     # Week 4 landing ✅
          └── /exam                    # AP Exam Simulation ✅
              └── /instructions        # Exam instructions ✅
```

#### Admin Routes (5 páginas)
```
/admin
  ├── page                             # Admin dashboard ✅
  ├── /students                        # Student list ✅
  ├── /students/[id]                   # Student detail ✅
  ├── /frq-review                      # FRQ review queue ✅
  └── /frq-review/[id]                 # Review assignment ✅
```

---

## 🔴 CRITICAL ISSUES

### Issue #1: Course Context Disconnected

**Location:** `/student/week/[1-3]/problems/page.tsx`

**Problem:**
```typescript
// Line 17 - Hardcoded, not reading from auth/context
const [studentCourse, setStudentCourse] = useState<...>("calculus-bc");
```

**Impact:**
- CourseSwitcher changes URL param but pages ignore it
- All students see BC content regardless of selection
- Temporary dropdown selector (lines 89-98) doesn't persist

**Expected Behavior:**
```typescript
// Should read from:
const user = await getAuthUser();
const course = user.course; // or from URL param
```

---

### Issue #2: CourseSwitcher Not Connected

**Location:** `components/student/course-switcher.tsx`

**Problem:**
- Changes URL: `/student?student=sloka-001`
- But `app/student/page.tsx` reads it correctly
- **However:** Child pages (week/X/problems) don't inherit the course

**Root Cause:**
- Week pages are client components with isolated state
- No course context provider
- No prop drilling from parent

---

### Issue #3: Week Landing Pages

**Location:** `/student/week/[1-4]/page.tsx`

**Problem:**
- Week 2 page (line 268): Hardcoded `calculus-bc`
```typescript
{studentCourse === 'calculus-bc' && (
  // BC-specific content
)}
```

- Week 3 and Week 4 pages have similar issues
- No dynamic course detection

---

### Issue #4: Data Filtering Inconsistency

**Files with course filtering:**
- `week-1-content.ts` ✅ Has `course` field per problem
- `week-2-content.ts` ✅ Has `course` field per problem
- `week-3-content.ts` ✅ Has `course` field per problem
- `week-4-content.ts` ✅ Has `APExamSimulation` per course

**Problem:**
- Data structure is correct
- Pages don't use the course field properly
- Filter logic exists but uses wrong state source

---

## 🔄 Current User Flow (BROKEN)

```
1. User lands on /student
   └─> CourseSwitcher shows in header ✅

2. User clicks "Ananya (BC)" in switcher
   └─> URL changes to /student?student=ananya-001 ✅
   └─> Dashboard reloads with Ananya's data ✅

3. User clicks "Week 1" card
   └─> Goes to /student/week/1 ✅
   └─> BUT: Course context is lost ❌

4. User clicks "Start Training"
   └─> Goes to /student/week/1/problems ❌
   └─> Shows BC content (hardcoded) regardless of selection ❌
   └─> Temporary dropdown allows manual switch (not persisted) ⚠️
```

---

## ✅ RECOMMENDED FIXES

### Priority 1: Add Course Context Provider

**Create:** `app/providers/course-provider.tsx`

```typescript
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type Course = "calculus-ab" | "calculus-bc" | "statistics";

const CourseContext = createContext<{
  course: Course;
  setCourse: (course: Course) => void;
}>({ course: "calculus-bc", setCourse: () => {} });

export function CourseProvider({ children, initialCourse }) {
  const [course, setCourse] = useState<Course>(initialCourse);
  const searchParams = useSearchParams();

  useEffect(() => {
    const studentId = searchParams.get("student");
    // Fetch course from student ID or use prop
    if (studentId) {
      // TODO: Get course from mock data based on studentId
    }
  }, [searchParams]);

  return (
    <CourseContext.Provider value={{ course, setCourse }}>
      {children}
    </CourseContext.Provider>
  );
}

export const useCourse = () => useContext(CourseContext);
```

### Priority 2: Update Problem Pages

**File:** `app/student/week/[1-3]/problems/page.tsx`

```typescript
// BEFORE (line 17):
const [studentCourse, setStudentCourse] = useState<...>("calculus-bc");

// AFTER:
const { course: studentCourse } = useCourse();
```

### Priority 3: Update Week Landing Pages

**Files:** `app/student/week/[2-4]/page.tsx`

Replace all hardcoded course checks with:
```typescript
const { course: studentCourse } = useCourse();
```

### Priority 4: Persist Course Selection

**Option A:** Use URL params everywhere
```typescript
/student/week/1?student=ananya-001
/student/week/1/problems?student=ananya-001
```

**Option B:** Use localStorage + Context
```typescript
localStorage.setItem("demo-student-course", course);
```

**Option C (RECOMMENDED):** Server-side session
```typescript
// Store in cookie/session on CourseSwitcher change
// Read in all pages via getAuthUser()
```

---

## 📊 Navigation Components Inventory

### 1. RoleSwitcher (Fixed Button - Bottom Right)
- **Location:** Fixed bottom-right corner
- **Purpose:** Switch between Home/Student/Admin views
- **Status:** ✅ Working
- **Scope:** Global navigation

### 2. CourseSwitcher (Header - Dashboard Only)
- **Location:** Header right side (before XP/Badges)
- **Purpose:** Switch between demo students (AB/BC/Stats)
- **Status:** 🔴 Not connected to content
- **Scope:** Student view only

### 3. Breadcrumbs
- **Location:** Top of each page
- **Purpose:** Show current location + back navigation
- **Status:** ✅ Working
- **Files:** All week pages

### 4. Temporary Course Dropdowns (TO REMOVE)
- **Location:** Week 1-3 problems pages (line ~90)
- **Purpose:** Testing only
- **Status:** ⚠️ Should be removed after fix
- **Comment:** "Course switcher for testing - remove in production"

---

## 🎯 User Journey Analysis

### Admin Journey ✅ COMPLETE
```
/ → /admin → /admin/students → /admin/students/[id]
                            → /admin/frq-review → /admin/frq-review/[id]
```
**Status:** All routes connected, no issues

### Student Journey 🔴 INCOMPLETE

#### Path 1: Course Introduction ✅
```
/ → /student → /student/intro → /student (back to dashboard)
```

#### Path 2: Weekly Training 🔴 BROKEN
```
/ → /student → /student/week/1 → /student/week/1/problems
                                  ↓
                           Course context lost here ❌
                                  ↓
                         Shows BC content for everyone
```

#### Path 3: FRQ Assignment ✅
```
/ → /student → /student/frq/[id]
```

#### Path 4: Week 4 Exam ✅
```
/ → /student → /student/week/4 → /student/week/4/exam
```

---

## 🔍 Content Differentiation Check

### Data Layer ✅
- ✅ Week 1: 3 problems per course (AB, BC, Stats) defined
- ✅ Week 2: 4 problems per course defined
- ✅ Week 3: 5 problems per course defined
- ✅ Week 4: 3 exam simulations (one per course) defined

### Presentation Layer 🔴
- ❌ Week 1 problems: Shows BC content only
- ❌ Week 2 problems: Shows BC content only
- ❌ Week 3 problems: Shows BC content only
- ✅ Week 4 exam: Correctly filters by course (data structure allows it)

---

## 🚨 IMMEDIATE ACTION REQUIRED

### Quick Fix (1 hour)
1. Add course context provider
2. Update 3 problems pages to use context
3. Remove temporary dropdowns
4. Test all 3 courses

### Complete Fix (3 hours)
1. Implement server-side course persistence
2. Update all week landing pages
3. Add course indicators throughout
4. Add E2E tests for each course path

---

## 📝 Testing Checklist

### Test as Calculus AB Student
- [ ] Dashboard shows AB materials
- [ ] Week 1 problems show AB content
- [ ] Week 2 problems show AB content
- [ ] Week 3 problems show AB content
- [ ] Week 4 exam shows AB simulation (25 min)

### Test as Calculus BC Student
- [ ] Dashboard shows BC materials
- [ ] Week 1 problems show BC content
- [ ] Week 2 problems show BC content
- [ ] Week 3 problems show BC content
- [ ] Week 4 exam shows BC simulation (30 min)

### Test as Statistics Student
- [ ] Dashboard shows Stats materials
- [ ] Week 1 problems show Stats content
- [ ] Week 2 problems show Stats content
- [ ] Week 3 problems show Stats content
- [ ] Week 4 exam shows Stats simulation (25 min)

---

## 🎨 UI Consistency Issues

### Observed Issues:
1. **Two course selectors visible simultaneously**
   - Header: New CourseSwitcher (purple)
   - Problems page: Temporary dropdown (blue box)
   - **Fix:** Remove temporary dropdown after context fix

2. **Course indicator redundancy**
   - Week pages show course in blue box
   - Header shows course in switcher
   - **Fix:** Keep one primary indicator

3. **Navigation confusion**
   - RoleSwitcher (bottom-right) vs CourseSwitcher (header)
   - Users might confuse them
   - **Fix:** Add tooltips/labels to clarify purpose

---

## ✅ Conclusion

### What Works:
- ✅ All routes exist and are accessible
- ✅ Admin dashboard fully functional
- ✅ Student dashboard shows correct initial view
- ✅ Content data is properly structured by course
- ✅ Week 4 exam structure is correct

### What's Broken:
- 🔴 Course selection doesn't propagate to content pages
- 🔴 Students see BC content regardless of course
- 🔴 CourseSwitcher is cosmetic only

### Root Cause:
**Missing course context propagation** from dashboard → week pages → problem pages

### Solution:
Implement Course Context Provider + update 6 files

---

**Estimated Fix Time:** 1-2 hours
**Files to Modify:** 7 files
**Testing Required:** 3 user journeys × 3 courses = 9 test scenarios
