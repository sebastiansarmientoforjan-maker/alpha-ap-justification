# Phase A: Content Integration — COMPLETADA ✅

## 🎯 Objetivo Alcanzado

FRQs ahora están **conectados con el contenido del curso**. Los estudiantes reciben scaffolding contextual basado en su reasoning stage y links directos a las semanas relevantes que deben estudiar antes de intentar el problema.

---

## 📦 Deliverables Implementados

### 1. Extended FRQ Types (`lib/types/index.ts`)

```typescript
export type ScaffoldingLevel = "full" | "structural" | "minimal" | "none";

export interface CERCScaffolding {
  level: ScaffoldingLevel;
  sentenceFrames?: string[];  // Full support para empirical
  theoremHints?: string[];    // Hints para todos
}

export interface ContentLink {
  weekNumber: number;
  section: string;
  concept: string;
}

export interface FRQAssignment {
  // ... campos existentes

  // NEW:
  weekReference?: number;        // Week 1-4 recomendado
  cercScaffolding?: CERCScaffolding;
  contentLinks?: ContentLink[];
}
```

### 2. Scaffolding Generator (`services/content/scaffolding-generator.ts`)

**Funciones principales:**

#### `generateCERCScaffolding(reasoningStage, topic)`
Genera scaffolding adaptado al nivel del estudiante:

| Reasoning Stage | Scaffolding Level | Contenido |
|----------------|-------------------|-----------|
| **Empirical** | Full | Sentence frames completos + theorem hints |
| **Generic** | Structural | Solo theorem hints (sin frames) |
| **Formal** | Minimal | 1 hint general |

**Ejemplo de output para Empirical + MVT:**
```javascript
{
  level: "full",
  sentenceFrames: [
    "**Claim**: The Mean Value Theorem [applies / does not apply]...",
    "**Evidence**: We can verify that f(x) = ___ is [continuous / discontinuous]...",
    "**Reasoning**: Since the MVT requires (1) continuity on [a,b]...",
    "**Conditions**: Checking the hypotheses explicitly: (1) Continuity..."
  ],
  theoremHints: [
    "Recall: MVT requires continuity on [a,b] AND differentiability on (a,b)",
    "Check for discontinuities (division by zero, jumps, asymptotes)",
    "Verify differentiability at all points in the open interval"
  ]
}
```

#### `determineRelevantWeek(topic)`
Mapea topics a weeks:
- Week 1: MVT/IVT condition traps
- Week 2: Condition verification (FTC, MVT, IVT)
- Week 3: Justification & communication
- Week 4: Integrated synthesis (default)

#### `generateContentLinks(topic)`
Crea links específicos al contenido del curso:
```javascript
[
  {
    weekNumber: 1,
    section: "Error-Forcing Problems",
    concept: "MVT condition trap: What happens when continuity fails"
  },
  {
    weekNumber: 2,
    section: "Condition Verification",
    concept: "Explicitly checking MVT hypotheses (continuity + differentiability)"
  }
]
```

**Topic coverage:**
- ✅ Mean Value Theorem (MVT)
- ✅ Intermediate Value Theorem (IVT)
- ✅ Fundamental Theorem of Calculus (FTC)
- ✅ Related Rates / Chain Rule
- ✅ Derivatives / Integrals (general)
- ✅ Limits

### 3. Enhanced FRQ Assignment API (`app/api/admin/frq/assign/route.ts`)

**Flujo actualizado:**

```typescript
1. Get student's current reasoning stage from progress
   ↓
2. Generate scaffolding based on stage + topic
   ↓
3. Determine relevant week reference
   ↓
4. Generate content links
   ↓
5. Create FRQ assignment with all context
   ↓
6. Return enriched assignment data
```

**API Response ahora incluye:**
```json
{
  "success": true,
  "message": "FRQ assigned successfully with content-aware scaffolding",
  "assignment": {
    "id": "frq-assign-004",
    "weekReference": 2,
    "scaffoldingLevel": "structural"
  },
  "logic": {
    "scaffolding": {
      "studentReasoningStage": "generic",
      "scaffoldingLevel": "structural",
      "weekReference": "Student should study Week 2 content before attempting",
      "contentLinks": 2
    }
  }
}
```

### 4. Enhanced FRQ Solver Display (`components/student/frq-solver.tsx`)

**Nuevas secciones visibles para el estudiante:**

#### A. Week Reference Card (Accent blue)
```
📄 Study Week 2 First

Before attempting this FRQ, review the relevant course
content to strengthen your justification skills.

Week 2, Chain Rule Application: Implicit differentiation with respect to time
Week 3, Communication Precision: Stating assumptions and defining variables clearly
```

#### B. CERC Framework Guide (Green)
**Full Scaffolding (Empirical students):**
```
✓ CERC Framework Guide [Full Support]

Sentence Frames to Guide Your Response:
  **Claim**: [State your conclusion clearly]
  **Evidence**: [Show the relevant calculations and data]
  ...

Remember:
  • Check if direct substitution works
  • Identify indeterminate forms
  • Apply appropriate technique (factoring, L'Hôpital, etc.)
```

**Structural Scaffolding (Generic students):**
```
✓ CERC Framework Guide [Structural Hints]

Key Points:
  • Set up the equation relating all variables
  • Differentiate both sides with respect to time
  • Plug in known values and solve for the unknown rate
```

**Minimal Scaffolding (Formal students):**
```
✓ CERC Framework Guide [Minimal Hints]

Key Points:
  • Apply the CERC framework: state hypotheses, verify conditions, then conclude.
```

### 5. Mock Data Examples (`services/data/mock.adapter.ts`)

**Updated FRQ assignments con scaffolding:**

#### Ananya (Generic stage):
```typescript
{
  id: "frq-assign-004",
  topic: "Chain Rule & Related Rates",
  weekReference: 2,
  cercScaffolding: {
    level: "structural",
    theoremHints: [
      "Set up the equation relating all variables",
      "Differentiate both sides with respect to time (implicit differentiation)",
      "Plug in known values and solve for the unknown rate"
    ]
  },
  contentLinks: [
    { weekNumber: 2, section: "Chain Rule Application", concept: "..." },
    { weekNumber: 3, section: "Communication Precision", concept: "..." }
  ]
}
```

#### Emily (Empirical stage):
```typescript
{
  id: "frq-assign-003",
  topic: "Limits",
  weekReference: 1,
  cercScaffolding: {
    level: "full",
    sentenceFrames: [
      "**Claim**: [State your conclusion clearly]",
      "**Evidence**: [Show the relevant calculations...]",
      ...
    ],
    theoremHints: [
      "Check if direct substitution works",
      "Identify indeterminate forms",
      ...
    ]
  }
}
```

---

## 🎬 User Journey — Before vs After

### ❌ Before Phase A:
```
Student receives FRQ
  ↓
Generic problem statement only
  ↓
No guidance on what to study
  ↓
No context about CERC application
  ↓
Student guesses approach
```

### ✅ After Phase A:
```
Student receives FRQ
  ↓
Sees: "Study Week 2 first"
  ↓
Sees: Specific content links (Chain Rule Application, etc.)
  ↓
Sees: CERC scaffolding tailored to their level
  ↓
Full frames (empirical) OR structural hints (generic) OR minimal (formal)
  ↓
Student studies relevant content
  ↓
Student attempts FRQ with contextual support
```

---

## 🧪 Testing the Implementation

### Test Case 1: Empirical Student (Emily)
**Navigate to:** `/student/frq/frq-assign-003` (Emily's Limits FRQ)

**Expected Display:**
- ✅ "Study Week 1 First" card
- ✅ Content link: "Week 3, Global Argumentation"
- ✅ Full sentence frames visible
- ✅ Theorem hints for limits
- ✅ Badge: "Full Support"

### Test Case 2: Generic Student (Ananya)
**Navigate to:** `/student/frq/frq-assign-004` (Ananya's Related Rates FRQ)

**Expected Display:**
- ✅ "Study Week 2 First" card
- ✅ Content links: Week 2 (Chain Rule), Week 3 (Communication)
- ✅ NO sentence frames (only structural hints)
- ✅ Theorem hints for related rates
- ✅ Badge: "Structural Hints"

### Test Case 3: New Assignment via API
**POST to:** `/api/admin/frq/assign`
```json
{ "quizId": "quiz-001" }
```

**Expected Response:**
```json
{
  "scaffolding": {
    "studentReasoningStage": "empirical|generic|formal",
    "scaffoldingLevel": "full|structural|minimal",
    "weekReference": "Student should study Week X...",
    "contentLinks": 2
  }
}
```

---

## 🔗 Integration Points

### ✅ Completed
- FRQ assignment creation includes scaffolding
- Student FRQ solver displays scaffolding
- Mock data demonstrates all scaffolding levels
- API returns scaffolding metadata

### 🔄 Connected to Future Phases
**Phase B (Dual Grading):**
- Claude can reference scaffolding level when grading
- "Did student use the provided sentence frames?"

**Phase C (Week 1-4 Content):**
- contentLinks will become clickable routes
- `/student/week/2` will exist and be linkable
- Students can study before attempting FRQ

**Phase F (Firebase):**
- Firebase adapter will store scaffolding data
- Reasoning stage updates will trigger re-scaffolding

**Phase G (TimeBack):**
- TimeBack adapter will fetch student reasoning stage
- Auto-generate content-aware FRQs on quiz completion

---

## 📊 Scaffolding Coverage by Topic

| Topic | Week Ref | Scaffolding Quality | Status |
|-------|----------|-------------------|--------|
| Mean Value Theorem | 1-2 | ✅ Full frames + hints | Complete |
| Intermediate Value Theorem | 1-2 | ✅ Full frames + hints | Complete |
| Fundamental Theorem of Calculus | 2 | ✅ Full frames + hints | Complete |
| Related Rates / Chain Rule | 2-3 | ✅ Full frames + hints | Complete |
| Derivatives (general) | Varies | ✅ Hints available | Complete |
| Integrals (general) | Varies | ✅ Hints available | Complete |
| Limits | 1-3 | ✅ Full frames + hints | Complete |
| Statistics (AP Stats) | TBD | ⚠️ Needs expansion | Future |

---

## 🚀 Next Steps

### Immediate (Optional Enhancements):
1. **Add More Topics**
   - Expand `getFullSentenceFrames()` for AP Stats topics
   - Add series/sequences (AP Calc BC)
   - Add parametric equations

2. **Clickable Week Links**
   - Make `contentLinks` clickable once Week 1-4 pages exist
   - Preview tooltip on hover showing week content

3. **Admin Preview**
   - Show scaffolding in admin FRQ assignment modal
   - Preview what student will see before assigning

### Critical Path (Phase B):
**Dual Grading System** — Compare Claude Vision vs MathGrader.AI

Ready to proceed to Phase B when you are.

---

## 📝 Summary

**Phase A Status:** ✅ **COMPLETE**

**What we achieved:**
- ✅ FRQ assignments are now content-aware
- ✅ Scaffolding adapts to reasoning stage (empirical → generic → formal)
- ✅ Students see clear guidance on what to study before attempting
- ✅ CERC framework support scales with student progression
- ✅ 7 major calculus topics covered with tailored hints
- ✅ Clean integration with existing systems (backward compatible)

**Impact:**
- Students no longer receive "generic" FRQs
- Clear path: Study Week X → Apply CERC → Solve FRQ
- Supports learning progression (full → structural → minimal scaffolding)
- Foundation ready for Phase C (actual Week 1-4 content pages)

**Time to complete:** ~2 hours

---

*Phase A completed: 2025-03-10*
*Next: Phase B - Dual Grading System*
