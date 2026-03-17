# AP Math Justification Training — Plan de Implementación FINAL

## 🎯 Arquitectura Integrada: Sistema A + Sistema B

### Flujo Completo End-to-End

```
MathAcademy Quiz Completed (external)
    ↓
TimeBack lee resultado via API
    ↓
Sistema auto-genera FRQ assignment:
  • Score <80% → Topic FRQ (remediation específica del quiz)
  • Score ≥80% → General FRQ (practice amplia de justificación)
    ↓
FRQ incluye SCAFFOLDING del curso:
  • Referencias a Week 1-4 content
  • Sentence frames basados en reasoning stage del estudiante
  • Hints sobre teoremas relevantes (MVT, IVT, FTC, etc.)
    ↓
Estudiante ESTUDIA contenido del curso (/student/week/[1-4])
  • Error-forcing problems interactivos
  • CERC framework training
  • Claude Socratic feedback (3 hint levels)
  • XP + badges por milestones de razonamiento
    ↓
Estudiante responde FRQ en papel (aplicando CERC aprendido)
    ↓
Sube foto al sistema
    ↓
DUAL GRADING (paralelo):
  1. Claude Vision AI → CERC analysis automático
  2. MathGrader.AI (manual por Sebastian) → Segundo opinion
    ↓
Admin (Sebastian) recibe AMBOS feedbacks lado a lado
    ↓
Admin consolida en UI de comparación:
  • Review Claude output (automático)
  • Review MathGrader output (pegado manualmente)
  • Agrega sus propias observaciones
  • Genera feedback final integrado
  • Define 3 action points personalizados
    ↓
Sistema genera reporte final y lo envía al estudiante
    ↓
Estudiante ve feedback consolidado en dashboard
    ↓
Score final se sincroniza con TimeBack Gradebook
```

---

## 🏗️ Fases de Implementación

### ✅ COMPLETADO (Sprints 1-3.5)

#### Sprint 1: Admin Dashboard — FRQ Workflow
- Student list con progress summary
- Quiz management panel (mark quiz completed)
- Auto FRQ assignment (1 FRQ/week, type based on score)
- Unassigned quizzes queue
- Premium glassmorphic design

#### Sprint 2: Student Dashboard — FRQ Workflow
- Student FRQ list (pending/submitted/graded/completed)
- FRQ Solver view (split-screen)
- 2-step upload workflow (Upload → Self-evaluate → Submit)
- Self-evaluation form (0-9 AP rubric + reflection notes)
- Feedback view display

#### Sprint 3: AI Grading Integration
- FRQ Review Dashboard (tabs: Awaiting / Ready to deliver)
- Grade FRQ Modal
- Deliver Feedback View
- API endpoints para grading y delivery

#### Sprint 3.5: Claude Vision Enhancement
- Claude Opus 4.6 Vision integration
- CERC rubric automation (Claim/Evidence/Reasoning/Conditions)
- Reasoning stage detection (Empirical/Generic/Formal)
- Auto action point generation
- Image utilities (base64 conversion, validation)

#### Infrastructure Base
- ✅ Service layer abstraction (mock/firebase/timeback adapters)
- ✅ Premium UI components (Aceternity + Magic UI)
- ✅ Type system completo
- ⚠️ Firebase setup (pending implementation)

---

### 🚧 EN PROGRESO

### Phase A: Content Integration (1-2 días) — **CURRENT**

**Objetivo:** FRQs deben referenciar el contenido del curso y proveer scaffolding contextual

#### A.1 Extend FRQ Types
```typescript
export interface FRQAssignment {
  // ... existing fields

  // NEW: Course content integration
  weekReference?: number;  // Week 1-4 que debe estudiar
  cercScaffolding?: {
    level: "full" | "structural" | "minimal";
    sentenceFrames?: string[];
    theoremHints?: string[];
  };
  contentLinks?: {
    weekNumber: number;
    section: string;
    concept: string;
  }[];
}
```

#### A.2 Scaffolding Generator
- Basado en reasoning stage del estudiante
- Full frames para empirical
- Structural hints para generic
- Minimal para formal

#### A.3 Update FRQ Assignment API
- Generate problems con referencias al curso
- Include sentence frames y theorem hints
- Link a secciones específicas de Week 1-4

#### A.4 Enhanced FRQ Solver Display
- Show week references prominently
- Display scaffolding contextual
- Links to relevant course sections

**Deliverables:**
- Updated types con scaffolding fields
- Scaffolding generation logic
- Enhanced FRQ assignment creation
- Improved student FRQ view con referencias

---

### Phase B: Dual Grading System (2-3 días)

**Objetivo:** Admin puede comparar Claude Vision vs MathGrader.AI lado a lado y consolidar

#### B.1 Dual Grading Types
```typescript
export interface DualGradingResult {
  grader1: {
    name: "Claude Vision";
    output: string;
    score: number;
    cerc: CERCAnalysis;
    timestamp: Date;
  };
  grader2?: {
    name: "MathGrader.AI" | "Manual Review";
    output: string;
    score: number;
    timestamp: Date;
  };
  adminConsolidation?: {
    finalScore: number;
    consolidatedFeedback: string;
    actionPoints: string[];
    reviewedAt: Date;
  };
}
```

#### B.2 Dual Grade Trigger
- Botón "Grade with Both" en admin
- Claude Vision (automático)
- Slot para paste MathGrader output

#### B.3 Consolidation View
- Side-by-side comparison UI
- Rich text editor para feedback final
- Action points form (3 required)
- Generate final report button

#### B.4 Delivery with Consolidated Feedback
- Update deliver feedback flow
- Show consolidated result to student
- Archive both grading outputs

**Deliverables:**
- DualGradingResult type implementation
- Consolidation UI page
- API endpoint for consolidation
- Updated delivery flow

---

### Phase C: Week 1-4 Course Content (2-3 semanas)

**Objetivo:** Sistema de entrenamiento semanal interactivo con error-forcing problems

#### C.1 Content Structure
```typescript
export interface WeekContent {
  weekNumber: 1 | 2 | 3 | 4;
  title: string;
  focus: string;
  scaffolding: "full" | "structural" | "minimal" | "none";

  sections: {
    id: string;
    title: string;
    theorem: {
      name: string;
      statement: string;
      hypotheses: string[];
    };
    errorForcingProblem: {
      statement: string;
      trap: string;
      correctResponse: string;
    };
    cercFrames: {
      claim: string;
      evidence: string;
      reasoning: string;
      conditions: string;
    };
  }[];
}
```

#### C.2 Week Pages (`/student/week/[1-4]`)
- Split-screen layout (problem LEFT, CERC form RIGHT)
- Interactive CERC form con validation
- KaTeX math rendering
- Progressive disclosure tooltips

#### C.3 Claude Socratic Feedback System
- 3-level hint progression
- Hint Level 1: Location of flaw
- Hint Level 2: Which CERC element broken
- Hint Level 3: Explicit correction (after 2 failed attempts)
- Inline feedback next to specific CERC fields

#### C.4 Problem Database
- Week 1: Error-forcing problems (MVT trap, etc.)
- Week 2: Condition verification practice
- Week 3: Global argumentation
- Week 4: Boss Battle prep problems

**Deliverables:**
- 4 week content files (week-1.ts through week-4.ts)
- Week page components
- CERC form with validation
- Socratic feedback API integration
- Problem progression logic

---

### Phase D: XP & Gamification (1 semana)

**Objetivo:** Sistema de progresión profunda, no superficial

#### D.1 XP Calculation Engine
```typescript
export const XP_EVENTS = {
  IDENTIFIES_BROKEN_CONDITION: 50,
  IDENTIFIES_PEER_FLAW: 100,
  UNASSISTED_CERC_PROOF: 150,
  REASONING_STAGE_ADVANCE: 200,
  BOSS_BATTLE_COMPLETE: 500,
};
```

#### D.2 Badge System
- "The Skeptic" — Survives error-forcing without falling for trap
- "The Architect" — Flawless CERC proof unassisted
- "Boss Slayer" — Week 4 Boss Battle complete
- GSAP animations on unlock

#### D.3 Reasoning Stage Tracker
- Empirical → Generic → Formal progression
- Timeline visualization per student
- Admin view of stage transitions

#### D.4 Exit Ticket System
- Post-week reflection form
- Calibrates next week's difficulty
- Feeds into Claude prompt adaptation

**Deliverables:**
- XP calculation service
- Badge unlock system with animations
- Reasoning stage progression logic
- Admin analytics dashboard
- Exit ticket implementation

---

### Phase E: WOW Components & Polish (1 semana)

**Objetivo:** 21st century premium experience

#### E.1 Aceternity UI Components
- Spotlight (illuminates problems)
- Meteors (Boss Battle background)
- Text Reveal (dramatic Boss Battle intro)
- 3D Card Hover (progress cards)

#### E.2 Magic UI Components
- Animated Beam (connects CERC fields)
- Orbiting Circles (reasoning stage orb)
- Shimmer Button (submit CERC CTA)
- Blur Fade (progressive feedback reveal)
- Number Ticker (XP counter)

#### E.3 Boss Battle Mode (Week 4)
- Multi-phase structure
- Phase 1: Individual algebra
- Phase 2: Collaborative CERC
- Phase 3: Curveball constraint
- Cohort works as team

**Deliverables:**
- All WOW components integrated
- Boss Battle mode implementation
- Animations and transitions
- Final polish pass

---

### Phase F: Firebase Implementation (3-5 días)

**Objetivo:** Replace mock adapter con Firebase real

#### F.1 Firebase Setup
- Firebase project creation
- Auth (Google SSO for Alpha students)
- Firestore database
- Storage (image uploads)

#### F.2 Firebase Adapter Implementation
```typescript
// services/data/firebase.adapter.ts
export class FirebaseAdapter implements DataService {
  // Implement all interface methods
  // Map to Firestore collections
  // Handle real-time updates
}
```

#### F.3 Firestore Schema
```
/users/{userId}
/progress/{userId}/weeks/{weekNumber}
/problems/{weekNumber}/{problemId}
/feedback/{userId}/{problemId}
/quizzes/{quizId}
/frq-assignments/{assignmentId}
/frq-submissions/{submissionId}
```

#### F.4 Firebase Storage
- Image upload from student FRQ solver
- Signed URLs for secure access
- Integration with Claude Vision (base64 conversion)

**Deliverables:**
- Firebase project configured
- firebase.adapter.ts fully implemented
- Storage upload/download working
- Auth flow with Google SSO
- Migration from mock to firebase

---

### Phase G: TimeBack Integration (1-2 semanas)

**Objetivo:** Production deployment con Alpha School's TimeBack platform

#### G.1 TimeBack Adapter Skeleton
```typescript
// services/data/timeback.adapter.ts
export class TimeBackAdapter implements DataService {
  private oneRosterAPI: OneRosterClient;
  private qtiAPI: QTIClient;
  private gradebookAPI: GradebookClient;

  // OAuth2 token management
  // OneRoster sync (users, classes)
  // QTI item creation (FRQs)
  // Gradebook result posting
}
```

#### G.2 OneRoster 1.2 Integration
- Sync users from TimeBack
- Sync class enrollments
- Map to internal user structure

#### G.3 QTI 3.0 Item Format
- Represent FRQ assignments as QTI items
- Include CERC metadata
- Store scaffolding in custom fields

#### G.4 Gradebook API
- Post FRQ scores back to TimeBack
- Include consolidated feedback
- Sync submission timestamps

#### G.5 Quiz Webhook
- TimeBack triggers on MathAcademy quiz completion
- Auto-create FRQ assignment
- Generate content-aware problem

#### G.6 LTI 1.3 Launch (Optional)
- Deep link to specific weeks/FRQs
- SSO via LTI

**Deliverables:**
- timeback.adapter.ts implementation
- OAuth2 token management
- OneRoster sync working
- QTI item creation
- Gradebook posting
- Webhook handler for quiz completion
- ENV switch (DATA_ADAPTER=timeback)

---

### Phase H: Hybrid Architecture (Final)

**Objetivo:** TimeBack + Firebase working together

```
┌─────────────────────────────────────────┐
│         Alpha School TimeBack           │
│  (LMS, Gradebook, Rosters, OAuth)      │
└───────────────┬─────────────────────────┘
                │
        OneRoster 1.2 + QTI 3.0 + OAuth2
                │
┌───────────────▼─────────────────────────┐
│     Our App (Next.js + Claude AI)       │
│                                         │
│  ┌─────────────┐    ┌─────────────┐   │
│  │  TimeBack   │    │  Firebase   │   │
│  │  Adapter    │    │  Adapter    │   │
│  └──────┬──────┘    └──────┬──────┘   │
│         │                  │           │
│    (Standard LMS)    (App-specific)    │
│    • Users           • CERC dialogue   │
│    • Grades          • XP/Badges       │
│    • Rosters         • Reasoning       │
│                      • AI feedback     │
└─────────────────────────────────────────┘
```

**Strategy:**
- TimeBack = Source of truth for users, grades, enrollments
- Firebase = Application data (CERC, XP, AI interactions)
- Sync bidirectionally
- Hybrid adapter routes calls appropriately

---

## 📊 Milestones & Timeline

| Phase | Duration | Deliverables | Status |
|-------|----------|-------------|--------|
| Sprints 1-3.5 | ✅ DONE | FRQ workflow + Claude Vision | Complete |
| **Phase A** | **1-2 días** | **Content-aware FRQs** | **IN PROGRESS** |
| Phase B | 2-3 días | Dual grading UI | Pending |
| Phase C | 2-3 semanas | Week 1-4 course content | Pending |
| Phase D | 1 semana | XP/Gamification | Pending |
| Phase E | 1 semana | WOW components + Boss Battle | Pending |
| Phase F | 3-5 días | Firebase implementation | Pending |
| Phase G | 1-2 semanas | TimeBack integration | Pending |
| Phase H | 2-3 días | Hybrid architecture testing | Pending |

**Total MVP Timeline:** 6-8 weeks from current state

---

## 🎯 Success Criteria

### Technical
- ✅ Service layer abstraction works with 3 adapters
- ✅ Claude Vision grades handwritten math accurately
- ⚠️ Dual grading provides comparison value
- ⚠️ Week 1-4 content drives reasoning progression
- ⚠️ Firebase handles real-time updates smoothly
- ⚠️ TimeBack sync bidirectional without data loss

### Educational
- Students progress through reasoning stages (empirical → formal)
- XP system correlates with actual reasoning improvement
- Exit tickets provide actionable calibration data
- Error-forcing problems successfully break empirical intuition
- Boss Battle demonstrates collaborative problem-solving

### Operational
- Sebastian can review 10 students' FRQs in <30 min
- Dual grading saves time vs pure manual review
- System scales to 20-30 students without degradation
- TimeBack integration requires <5 min manual intervention/week

---

## 🔐 Security & Compliance

### Data Privacy
- Student work stored encrypted (Firebase/TimeBack)
- Claude API: no data retention (contractual)
- MathGrader.AI: check data retention policy
- FERPA compliance via TimeBack institutional agreement

### Authentication
- Google SSO via Firebase Auth (Phase F)
- LTI 1.3 launch from TimeBack (Phase G)
- OAuth2 token management for TimeBack API
- Role-based access (student/admin)

### Backup & Recovery
- Firebase automatic backups
- TimeBack is source of truth for grades
- Weekly exports of CERC dialogue data
- Version control for course content

---

## 📝 Notes for Future

### Potential Enhancements (Post-MVP)
- Peer review system (students review each other)
- Multi-teacher support (not just Sebastian)
- Parent portal (view student progress)
- Mobile app (iOS/Android native)
- Video explanations integrated with problems
- Adaptive difficulty (AI adjusts based on performance)
- Integration with other math platforms (Khan Academy, etc.)

### Known Limitations
- Claude Vision accuracy depends on handwriting quality
- MathGrader.AI requires manual paste (no API)
- TimeBack API may have rate limits
- Boss Battle requires synchronous participation

### Research Questions
- Does CERC framework actually improve AP scores?
- What's optimal scaffolding reduction rate?
- Do error-forcing problems create lasting conceptual change?
- Is dual grading worth the extra effort vs single AI?

---

## 🎬 Current Status: Starting Phase A

**Next Immediate Steps:**
1. Extend FRQAssignment type with scaffolding fields
2. Create scaffolding generator based on reasoning stage
3. Update FRQ assignment API to include content references
4. Enhance FRQ solver to display course links and hints

**Goal:** Student sees contextualized FRQ with clear links to what they should study in Week 1-4 before attempting.

---

*Last Updated: 2025-03-10*
*Version: FINAL*
*Author: Sebastian (with Claude Code assistance)*
