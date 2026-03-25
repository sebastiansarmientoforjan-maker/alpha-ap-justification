# CHECK 3.2: CERC Framework Validation

**Date:** March 25, 2026
**Focus:** CERC field validation, required logic, character limits
**Status:** ⚠️ AUDIT COMPLETE - VALIDATION MISSING

---

## Checklist Items (from GEMINI_PROMPT_INTERACTIVE_CHECKLIST.md)

**Section 3.2: CERC Framework**

- [x] **Claim field validates**
  - ❌ FAIL - No validation enforced
  - Field accepts any input (including empty)
  - Sanitization exists (XSS prevention) but no validation

- [x] **Evidence field validates**
  - ❌ FAIL - No validation enforced
  - Same as Claim

- [x] **Reasoning field validates**
  - ❌ FAIL - No validation enforced
  - Same as Claim

- [x] **Conditions field validates**
  - ❌ FAIL - No validation enforced
  - Same as Claim

- [x] **All fields required before submit**
  - ❌ FAIL - Fields NOT required
  - Submit button always enabled
  - Students can submit empty CERC responses
  - Function `validateCERCField()` exists but is NOT used

- [x] **KaTeX preview functional for student input**
  - ❌ FAIL - No preview exists
  - Students type plain text in textareas
  - Math rendering only shown AFTER submission (Phase 4 comparison)
  - **Note:** This may be intentional (mimics AP exam)

- [x] **Character limits enforced (if any)**
  - ❌ FAIL - No character limits
  - No `maxLength` attribute on textareas
  - Students can write unlimited text
  - **Note:** This may be intentional (no artificial constraints)

---

## 1. Current Implementation

### CERC Input Fields (Week 1-3)

**All weeks use identical structure:**

```typescript
<textarea
  value={sessionData.cercResponses.claim}
  onChange={(e) => handleCERCChange('claim', e.target.value)}
  className="w-full bg-primary-800/60 border border-primary-600/30 rounded-xl p-4 text-white placeholder-primary-400 focus:border-accent-500 focus:outline-none resize-none"
  rows={2}
  placeholder="State your conclusion..."
/>
```

**Key Observations:**
- ✅ Controlled component with state management
- ✅ onChange handler calls `handleCERCChange()`
- ✅ Styling with focus state (accent border)
- ✅ Placeholders guide students
- ❌ NO `required` attribute
- ❌ NO `minLength` attribute
- ❌ NO `maxLength` attribute
- ❌ NO validation before onChange

### handleCERCChange Function

**File:** `app/student/week/1/problem/[problemId]/page.tsx` (line 234)

```typescript
const handleCERCChange = (field: keyof typeof sessionData.cercResponses, value: string) => {
  const sanitized = sanitizeInput(value);
  setSessionData({
    ...sessionData,
    cercResponses: {
      ...sessionData.cercResponses,
      [field]: sanitized
    }
  });
};
```

**What it does:**
- ✅ Sanitizes input (removes HTML tags, script tags, XSS patterns)
- ✅ Updates state with sanitized value
- ❌ NO validation (length, required, format)
- ❌ NO error messages

### Submit Button (Phase 3)

**File:** `app/student/week/1/problem/[problemId]/page.tsx` (line 804)

```typescript
<ShimmerButton onClick={() => completePhase("justify")} className="w-full py-4 text-lg">
  Submit for self-check →
</ShimmerButton>
```

**Key Issues:**
- ❌ NO `disabled` prop
- ❌ NO validation before onClick
- ❌ Button always enabled (even with empty fields)

**Same pattern in Week 2 and Week 3** (verified)

### completePhase Function

**File:** `app/student/week/1/problem/[problemId]/page.tsx` (line 199)

```typescript
const completePhase = (phase: Phase) => {
  const updatedPhases = { ...sessionData.phases };

  switch (phase) {
    // ... other phases ...
    case "justify":
      updatedPhases.justify = { completed: true, timestamp: Date.now() };
      setCurrentPhase("modelComparison");
      break;
  }

  setSessionData({ ...sessionData, phases: updatedPhases });
};
```

**What it does:**
- ✅ Marks phase as completed
- ✅ Advances to next phase (modelComparison)
- ❌ NO validation of CERC fields
- ❌ NO check if fields are empty
- ❌ Always allows progression

---

## 2. Input Sanitization (Security)

### sanitizeInput Function

**File:** `lib/utils/input-sanitizer.ts` (line 11)

```typescript
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/<[^>]*>/g, '')                    // Remove HTML tags
    .replace(/javascript:/gi, '')               // Remove javascript: URLs
    .replace(/data:text\/html/gi, '')          // Remove data: URLs
    .replace(/on\w+\s*=/gi, '')                // Remove event handlers
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .trim();
}
```

**✅ Security Protections:**
- Prevents XSS attacks (script injection)
- Removes HTML tags
- Removes event handlers (onclick, onload, etc.)
- Removes dangerous URLs (javascript:, data:)

**❌ What it DOESN'T do:**
- NO validation of content
- NO length checks
- NO format validation

---

## 3. Unused Validation Function

### validateCERCField Function

**File:** `lib/utils/input-sanitizer.ts` (line 37)

```typescript
export function validateCERCField(
  input: string,
  minLength: number = 20
): { isValid: boolean; error?: string } {
  const sanitized = sanitizeInput(input);

  if (sanitized.length === 0) {
    return { isValid: false, error: 'This field cannot be empty' };
  }

  if (sanitized.length < minLength) {
    return {
      isValid: false,
      error: `Please provide at least ${minLength} characters`,
    };
  }

  return { isValid: true };
}
```

**Features:**
- ✅ Checks for empty fields
- ✅ Enforces minimum length (default 20 characters)
- ✅ Returns clear error messages
- ✅ Properly designed validation logic

**❌ Critical Issue:**
- **NOT USED ANYWHERE IN THE CODEBASE**
- Function exists but is never imported or called
- Week 1, 2, 3 do NOT use this function

---

## 4. XP Calculation Logic

### calculateXP Function

**File:** `app/student/week/1/problem/[problemId]/page.tsx` (line 245)

```typescript
const calculateXP = () => {
  let xp = 20; // Base XP for Week 1 problems
  const bonuses: { name: string; amount: number }[] = [];

  const cercComplete = Object.values(sessionData.cercResponses).every(v => v.trim().length > 20);
  if (cercComplete) {
    bonuses.push({ name: "Complete CERC Response", amount: 10 });
    xp += 10;
  }

  // ... other bonuses ...

  return { base: 20, bonuses, total: xp };
};
```

**Key Observation:**
- ✅ Checks if ALL fields have > 20 characters
- ✅ Awards bonus +10 XP for "Complete CERC Response"
- ⚠️ Validation happens AFTER submission (during XP calculation)
- ⚠️ Students can submit with empty fields and NOT get the bonus

**This is NOT field validation - it's post-submission reward logic**

---

## 5. Phase 4: Model Comparison (When Math Renders)

### Student Response Display

**File:** `app/student/week/1/problem/[problemId]/page.tsx` (line 892)

```typescript
<p className="text-sm text-primary-100 ml-10 leading-relaxed whitespace-pre-wrap">
  {sessionData.cercResponses.claim || "(empty)"}
</p>
```

**Behavior:**
- If field is empty: Shows "(empty)"
- If field has content: Shows raw text (no KaTeX rendering for student input)
- Model solution shows rendered KaTeX

**Students see their plain text compared to rendered model solution**

---

## 6. Issues Found

### ❌ Critical Issue 1: No Required Field Validation

**Description:** Students can submit empty CERC responses

**Current Behavior:**
```
1. Student opens problem
2. Student clicks "Submit for self-check" without typing anything
3. System accepts empty submission
4. System advances to Phase 4 (Model Comparison)
5. System shows "(empty)" in comparison view
6. Student does NOT get +10 XP bonus but otherwise completes problem
```

**Expected Behavior:**
```
1. Student opens problem
2. Student clicks "Submit for self-check" with empty fields
3. System shows error: "Please complete all CERC fields"
4. Button disabled or shows validation errors
5. Student must fill fields before advancing
```

**Impact:** Students can skip justification entirely and still "complete" the problem

**Fix Required:**
```typescript
// Option A: Disable button when fields empty
const allFieldsFilled = Object.values(sessionData.cercResponses).every(v => v.trim().length > 0);

<ShimmerButton
  onClick={() => completePhase("justify")}
  disabled={!allFieldsFilled}
  className="w-full py-4 text-lg"
>
  Submit for self-check →
</ShimmerButton>

// Option B: Add validation in completePhase
case "justify":
  const validation = Object.entries(sessionData.cercResponses).map(([field, value]) =>
    validateCERCField(value, 20)
  );

  if (validation.some(v => !v.isValid)) {
    alert("Please complete all CERC fields with at least 20 characters each");
    return;
  }

  updatedPhases.justify = { completed: true, timestamp: Date.now() };
  setCurrentPhase("modelComparison");
  break;
```

**Priority:** HIGH - Core feature should require meaningful responses

---

### ⚠️ Issue 2: No Character Limit Enforcement

**Description:** Students can write unlimited text (potential database issues)

**Current Behavior:**
- No maxLength on textareas
- Students can write 10,000+ characters
- May cause database storage issues
- May cause UI rendering issues

**Recommendation:**
```typescript
<textarea
  value={sessionData.cercResponses.claim}
  onChange={(e) => handleCERCChange('claim', e.target.value)}
  maxLength={2000} // Reasonable limit for AP-style response
  className="..."
  rows={2}
  placeholder="State your conclusion..."
/>
```

**Reasonable Limits:**
- Claim: 500 characters (1-2 sentences)
- Evidence: 2000 characters (calculations + explanation)
- Reasoning: 1000 characters (theorem application)
- Conditions: 1500 characters (hypothesis verification)

**Priority:** MEDIUM - Prevents extreme edge cases

---

### ⚠️ Issue 3: No Real-Time Validation Feedback

**Description:** Students don't know if their input is valid until after submission

**Current Behavior:**
- No visual indicators (red border, error text)
- No character count shown
- No "Field required" messages

**Enhancement:**
```typescript
const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

const handleCERCChange = (field: keyof typeof sessionData.cercResponses, value: string) => {
  const sanitized = sanitizeInput(value);

  // Validate field
  const validation = validateCERCField(sanitized, 20);
  setFieldErrors({
    ...fieldErrors,
    [field]: validation.isValid ? '' : validation.error!
  });

  setSessionData({...});
};

// In JSX:
<textarea ... />
{fieldErrors.claim && (
  <p className="text-red-400 text-sm mt-1">{fieldErrors.claim}</p>
)}
```

**Priority:** LOW - Current system allows reflection first, then guidance

---

### ℹ️ Non-Issue: No KaTeX Preview

**Description:** Students don't see rendered math while typing

**Current Behavior:**
- Students type: `$f(x) = x^2$`
- Display: Raw text in textarea
- Preview: Only after submission in Phase 4

**AP Exam Alignment:**
- ✅ This is CORRECT behavior
- Real AP exam has no math preview
- Students write LaTeX on paper without visual feedback
- Training with plain text mimics exam conditions

**Recommendation:** Keep as-is (intentional design)

---

## 7. Comparison with Week 2 and Week 3

### Week 2 Verification

**File:** `app/student/week/2/problem/[problemId]/page.tsx`

**Findings:**
- ✅ Same CERC input structure
- ❌ Same lack of validation
- ❌ Submit button not disabled
- ❌ No required field checks
- ✅ Uses structural outline scaffolding (not sentence frames)

**Identical issues to Week 1**

### Week 3 Verification

**File:** `app/student/week/3/problem/[problemId]/page.tsx`

**Findings:**
- ✅ Same CERC input structure
- ❌ Same lack of validation
- ❌ Submit button not disabled
- ❌ No required field checks
- ✅ Blank canvas mode (no scaffolding)

**Identical issues to Week 1**

### Reflection Phase (Has Validation!)

**File:** `app/student/week/2/problem/[problemId]/page.tsx` (line 988)

```typescript
<ShimmerButton
  onClick={completeReflection}
  disabled={customReflection.trim().length < 20}
  className="w-full py-4 text-lg"
>
  Complete & Continue to Roadmap
</ShimmerButton>
```

**✅ Validation exists here:**
- Button disabled if reflection < 20 characters
- Shows proper validation pattern
- **Proves validation IS possible and IS used elsewhere**

**Inconsistency:** Why is reflection validated but CERC is not?

---

## 8. Recommendations

### Priority 1: HIGH - Add Required Field Validation

**Implementation:**
```typescript
// 1. Add validation check
const canSubmitCERC = Object.values(sessionData.cercResponses)
  .every(v => v.trim().length >= 20);

// 2. Disable button conditionally
<ShimmerButton
  onClick={() => completePhase("justify")}
  disabled={!canSubmitCERC}
  className="w-full py-4 text-lg"
>
  {canSubmitCERC
    ? "Submit for self-check →"
    : "Complete all fields to submit (min. 20 chars each)"}
</ShimmerButton>

// 3. Add visual feedback
{!canSubmitCERC && (
  <p className="text-yellow-400 text-sm text-center mt-2">
    ⚠️ All CERC fields must have at least 20 characters
  </p>
)}
```

**Apply to:** Week 1, 2, 3 (all problem solvers)

### Priority 2: MEDIUM - Add Character Limits

**Implementation:**
```typescript
const CHAR_LIMITS = {
  claim: 500,
  evidence: 2000,
  reasoning: 1000,
  conditions: 1500
};

<textarea
  value={sessionData.cercResponses.claim}
  onChange={(e) => handleCERCChange('claim', e.target.value)}
  maxLength={CHAR_LIMITS.claim}
  className="..."
  rows={2}
  placeholder="State your conclusion..."
/>

<p className="text-xs text-primary-400 mt-1 text-right">
  {sessionData.cercResponses.claim.length} / {CHAR_LIMITS.claim}
</p>
```

### Priority 3: LOW - Use Existing validateCERCField

**Implementation:**
```typescript
import { validateCERCField } from "@/lib/utils/input-sanitizer";

const handleCERCChange = (field: keyof typeof sessionData.cercResponses, value: string) => {
  const sanitized = sanitizeInput(value);

  // Validate (but don't block input, just show feedback)
  const validation = validateCERCField(sanitized, 20);

  setSessionData({
    ...sessionData,
    cercResponses: {
      ...sessionData.cercResponses,
      [field]: sanitized
    }
  });
};
```

---

## Summary

### ✅ What Works

| Feature | Status | Notes |
|---------|--------|-------|
| Input sanitization | ✅ Perfect | XSS protection implemented |
| State management | ✅ Perfect | Controlled components work correctly |
| handleCERCChange | ✅ Perfect | Updates state properly |
| Security | ✅ Perfect | HTML/script injection prevented |

### ❌ What's Missing

| Feature | Status | Impact | Priority |
|---------|--------|--------|----------|
| Required field validation | ❌ Missing | Students can submit empty | HIGH |
| Minimum length check | ❌ Missing | No quality threshold | HIGH |
| Character limits | ❌ Missing | Unlimited input allowed | MEDIUM |
| Real-time feedback | ❌ Missing | No validation errors shown | LOW |
| Use of validateCERCField | ❌ Unused | Function exists but not called | MEDIUM |

### ℹ️ Intentional Design

| Feature | Status | Reasoning |
|---------|--------|-----------|
| No KaTeX preview | ✅ Correct | Mimics AP exam conditions |
| Plain text input | ✅ Correct | Aligns with paper-based exam |
| Post-submission validation | ⚠️ Debatable | XP bonus system checks later |

### 📊 Checklist Completion

**Section 3.2 CERC Framework:**
- ❌ 0/7 items fully implemented
- ⚠️ 4/7 items partially work (sanitization but no validation)
- ℹ️ 1/7 items intentionally missing (KaTeX preview)

**Overall Status:** ⚠️ NEEDS VALIDATION IMPLEMENTATION

---

**Auditor:** Sebastian + Claude Code
**Date:** March 25, 2026
**Next Check:** 3.3 - AI Feedback System (Socratic Dialogue)
**Critical Action Required:** Add required field validation before production deployment
