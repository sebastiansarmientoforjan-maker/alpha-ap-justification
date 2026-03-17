# TimeBack Integration — Compatibility Analysis

## 🎯 Executive Summary

**✅ SÍ, TODO LO QUE HEMOS IMPLEMENTADO ES COMPATIBLE CON TIMEBACK**

TimeBack implementa:
- **OneRoster 1.2** (Rostering + Gradebook APIs)
- **QTI 3.0** (Assessment Engine)
- **OAuth2** authentication via AWS Cognito
- **Extensiones propietarias** que facilitan nuestra integración

Nuestro sistema está diseñado con **service layer abstraction** desde el día 1, lo que permite intercambiar adapters sin romper la lógica de negocio.

---

## 📋 Análisis Detallado de Compatibilidad

### Phase A: Content Integration ✅

| Característica | Implementación Actual | Mapeo a TimeBack | Compatibilidad |
|----------------|----------------------|------------------|----------------|
| **FRQ Assignment** | FRQAssignment type | OneRoster `AssessmentLineItem` | ✅ 100% |
| **Week Reference** | `weekReference: number` | `AssessmentLineItem.metadata.weekReference` | ✅ Via metadata |
| **CERC Scaffolding** | `cercScaffolding` object | `AssessmentLineItem.metadata.cercScaffolding` | ✅ Via metadata |
| **Content Links** | `contentLinks[]` array | `AssessmentLineItem.metadata.contentLinks` | ✅ Via metadata |
| **Problem Statement** | `problemStatement: string` | `AssessmentLineItem.description` | ✅ Direct field |
| **Topic** | `topic: string` | `AssessmentLineItem.title` | ✅ Direct field |
| **Due Date** | `dueDate: Date` | `AssessmentLineItem.dueDate` | ✅ Direct field |

**Endpoint TimeBack:**
```
POST /ims/oneroster/gradebook/v1p2/assessmentLineItems/
```

**Ejemplo payload:**
```json
{
  "assessmentLineItem": {
    "sourcedId": "frq-assign-001",
    "title": "Mean Value Theorem",
    "description": "Analyze a problem involving MVT. Apply the relevant theorem...",
    "class": { "sourcedId": "class-calc-bc-001" },
    "resultValueMin": 0,
    "resultValueMax": 9,
    "metadata": {
      "frqType": "topic",
      "weekReference": 2,
      "cercScaffolding": {
        "level": "structural",
        "theoremHints": ["Recall: MVT requires continuity on [a,b]..."]
      },
      "contentLinks": [
        {
          "weekNumber": 2,
          "section": "Condition Verification",
          "concept": "MVT hypotheses"
        }
      ],
      "reasoningStage": "generic"
    }
  }
}
```

---

### Phase B: Dual Grading System ✅

| Característica | Implementación Actual | Mapeo a TimeBack | Compatibilidad |
|----------------|----------------------|------------------|----------------|
| **FRQ Submission** | FRQSubmission type | Linking table (local) + image storage | ✅ Hybrid approach |
| **Handwritten Image** | `fileUrl: string` | Firebase Storage (external) | ✅ Store URL in metadata |
| **Self-Evaluation** | `selfEvaluation` object | Local only (not synced) | ✅ Optional sync |
| **Dual Grading Result** | DualGradingResult type | `AssessmentResult.metadata` | ✅ Via metadata |
| **Claude Vision Output** | `grader1` object | `metadata.grader1` | ✅ Via metadata |
| **MathGrader Output** | `grader2` object | `metadata.grader2` | ✅ Via metadata |
| **Admin Consolidation** | `adminConsolidation` object | `metadata.adminConsolidation` | ✅ Via metadata |
| **Final Score** | `finalScore: number` | `AssessmentResult.score` | ✅ Direct field |
| **Action Points** | `actionPoints: string[]` | `AssessmentResult.comment` | ✅ Formatted string |

**Endpoint TimeBack:**
```
POST /ims/oneroster/gradebook/v1p2/assessmentResults/
```

**Ejemplo payload:**
```json
{
  "assessmentResult": {
    "sourcedId": "frq-result-001",
    "assessmentLineItem": { "sourcedId": "frq-assign-001" },
    "student": { "sourcedId": "ananya-001" },
    "score": 7,
    "scoreStatus": "fully graded",
    "comment": "Action Points:\n1. Explicitly state theorem hypotheses...\n2. Strong work on evidence...\n3. Consider adding conclusion sentence...",
    "metadata": {
      "submissionFileUrl": "https://storage.firebase.com/uploads/ananya-frq-001.jpg",
      "selfEvaluation": {
        "score": 7,
        "notes": "I think I covered all conditions..."
      },
      "dualGrading": {
        "grader1": {
          "name": "Claude Vision",
          "score": 7,
          "cerc": {
            "claim": { "score": 2, "feedback": "..." },
            "evidence": { "score": 3, "feedback": "..." },
            "reasoning": { "score": 2, "feedback": "..." },
            "conditions": { "score": 0, "feedback": "..." }
          },
          "reasoningStage": "generic",
          "timestamp": "2025-03-10T14:30:00Z"
        },
        "grader2": {
          "name": "MathGrader.AI",
          "score": 8,
          "output": "Strong application of FTC...",
          "timestamp": "2025-03-10T15:00:00Z"
        },
        "adminConsolidation": {
          "finalScore": 7,
          "consolidatedFeedback": "Good reasoning but needs explicit condition verification...",
          "reviewedBy": "sebastian-admin",
          "reviewedAt": "2025-03-10T15:30:00Z"
        }
      }
    }
  }
}
```

---

## 🗄️ Data Storage Strategy: Hybrid Approach

### ✅ Recomendación: TimeBack + Firebase

**TimeBack (OneRoster):**
- Users (students, teachers)
- Classes, Courses, Enrollments
- AssessmentLineItems (FRQ assignments)
- AssessmentResults (scores + metadata summary)
- Academic Sessions, Grading Periods

**Firebase (Application-Specific):**
- Handwritten submission images (Firebase Storage)
- Full DualGradingResult records (detailed CERC analysis)
- Week 1-4 course content
- CERC responses durante training sessions
- XP, badges, reasoning stage progression
- Exit tickets
- Boss Battle progress

**Ventajas de este enfoque:**
1. ✅ **TimeBack = Source of Truth** para datos académicos oficiales
2. ✅ **Firebase = Rich application data** que no cabe en OneRoster
3. ✅ **Sync unidireccional**: App → TimeBack (scores finales)
4. ✅ **Metadata linking**: `AssessmentResult.metadata.firebaseSubmissionId`
5. ✅ **Compliance**: Datos oficiales en LMS, datos de entrenamiento en Firebase

---

## 🔄 Integration Workflows

### Workflow 1: Quiz Completion → FRQ Assignment

```
MathAcademy Quiz Completed
  ↓
TimeBack Webhook → /api/webhooks/timeback/quiz-completed
  ↓
Our API:
  1. Fetch quiz data via OneRoster API
  2. Determine FRQ type (general vs topic)
  3. Get student's reasoning stage (Firebase)
  4. Generate scaffolding (internal logic)
  5. Create AssessmentLineItem in TimeBack
     POST /ims/oneroster/gradebook/v1p2/assessmentLineItems/
  ↓
Student sees FRQ assignment in dashboard
  (fetched via GET /ims/oneroster/gradebook/v1p2/assessmentLineItems/)
```

### Workflow 2: FRQ Submission → Dual Grading → Sync

```
Student uploads handwritten work
  ↓
1. Upload image to Firebase Storage
   fileUrl = gs://alpha-ap/uploads/ananya-frq-001.jpg
  ↓
2. Create FRQSubmission record (Firebase)
  ↓
3. Admin triggers dual grading
  ↓
4. Claude Vision + MathGrader.AI
  ↓
5. Admin consolidates feedback (Firebase)
  ↓
6. Sync final result to TimeBack:
   POST /ims/oneroster/gradebook/v1p2/assessmentResults/
   {
     score: 7,
     comment: "Action Points: 1. ... 2. ... 3. ...",
     metadata: {
       submissionFileUrl: "...",
       dualGrading: { ... }
     }
   }
  ↓
TimeBack Gradebook updated ✅
```

### Workflow 3: Week 1-4 Content Progress

```
Student works on Week 2 CERC training
  ↓
Submits CERC response (Firebase only)
  ↓
Claude Socratic feedback (Firebase only)
  ↓
Earns XP + badges (Firebase only)
  ↓
Reasoning stage advances: empirical → generic
  (stored in Firebase, referenced in future FRQ scaffolding)
  ↓
NO SYNC TO TIMEBACK
(Week content is training, not graded assessment)
```

---

## 📊 TimeBack API Endpoints — Mapping

| Our Operation | TimeBack Endpoint | Method | Purpose |
|---------------|-------------------|--------|---------|
| Get student data | `/ims/oneroster/rostering/v1p2/users/{sourcedId}` | GET | Fetch student profile |
| Get student classes | `/ims/oneroster/rostering/v1p2/enrollments?filter=user.sourcedId='{userId}'` | GET | Find student's classes |
| Get quiz data | `/ims/oneroster/gradebook/v1p2/results/{sourcedId}` | GET | Fetch quiz score/details |
| Create FRQ assignment | `/ims/oneroster/gradebook/v1p2/assessmentLineItems/` | POST | Assign FRQ to student |
| Get FRQ assignments | `/ims/oneroster/gradebook/v1p2/classes/{classId}/assessmentLineItems` | GET | List FRQs for class |
| Submit FRQ score | `/ims/oneroster/gradebook/v1p2/assessmentResults/` | POST | Send final grade to LMS |
| Update FRQ score | `/ims/oneroster/gradebook/v1p2/assessmentResults/{sourcedId}` | PUT | Update existing grade |

**Authentication:**
```bash
curl -X POST https://prod-beyond-timeback-api-2-idp.auth.us-east-1.amazoncognito.com/oauth2/token \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "grant_type=client_credentials&client_id=<CLIENT_ID>&client_secret=<CLIENT_SECRET>"
```

---

## 🛠️ Implementation: timeback.adapter.ts

```typescript
// services/data/timeback.adapter.ts

import { DataService } from "./index";
import { FRQAssignment, FRQSubmission, DualGradingResult, User } from "@/lib/types";

export class TimeBackAdapter implements DataService {
  private baseUrl = "https://api.alpha-1edtech.ai";
  private token: string | null = null;

  // OAuth2 authentication
  private async authenticate() {
    const response = await fetch(
      "https://prod-beyond-timeback-api-2-idp.auth.us-east-1.amazoncognito.com/oauth2/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: process.env.TIMEBACK_CLIENT_ID!,
          client_secret: process.env.TIMEBACK_CLIENT_SECRET!,
        }),
      }
    );
    const data = await response.json();
    this.token = data.access_token;
  }

  // Create FRQ Assignment → AssessmentLineItem
  async createFRQAssignment(
    assignment: Omit<FRQAssignment, "id" | "assignedAt" | "status">
  ): Promise<FRQAssignment> {
    if (!this.token) await this.authenticate();

    const response = await fetch(
      `${this.baseUrl}/ims/oneroster/gradebook/v1p2/assessmentLineItems/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assessmentLineItem: {
            sourcedId: `frq-${Date.now()}`,
            title: assignment.topic,
            description: assignment.problemStatement,
            class: { sourcedId: "class-calc-bc-001" }, // TODO: Dynamic class mapping
            resultValueMin: 0,
            resultValueMax: 9,
            dueDate: assignment.dueDate,
            metadata: {
              frqType: assignment.type,
              weekReference: assignment.weekReference,
              cercScaffolding: assignment.cercScaffolding,
              contentLinks: assignment.contentLinks,
            },
          },
        }),
      }
    );

    const data = await response.json();

    // Map TimeBack response to our FRQAssignment type
    return {
      id: data.sourcedIdPairs.allocatedSourcedId,
      studentId: assignment.studentId,
      quizId: assignment.quizId,
      type: assignment.type,
      topic: assignment.topic,
      problemStatement: assignment.problemStatement,
      assignedAt: new Date(),
      dueDate: assignment.dueDate,
      status: "pending",
      weekReference: assignment.weekReference,
      cercScaffolding: assignment.cercScaffolding,
      contentLinks: assignment.contentLinks,
    };
  }

  // Sync final score to TimeBack
  async syncFinalScoreToTimeBack(
    dualGradingResult: DualGradingResult,
    submission: FRQSubmission,
    assignment: FRQAssignment
  ): Promise<void> {
    if (!this.token) await this.authenticate();

    const consolidation = dualGradingResult.adminConsolidation;
    if (!consolidation) {
      throw new Error("Cannot sync: no admin consolidation");
    }

    await fetch(
      `${this.baseUrl}/ims/oneroster/gradebook/v1p2/assessmentResults/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assessmentResult: {
            sourcedId: `result-${Date.now()}`,
            assessmentLineItem: { sourcedId: assignment.id },
            student: { sourcedId: submission.studentId },
            score: consolidation.finalScore,
            scoreStatus: "fully graded",
            comment: `Action Points:\n${consolidation.actionPoints.join("\n")}`,
            metadata: {
              submissionFileUrl: submission.fileUrl,
              dualGradingId: dualGradingResult.id,
              selfEvaluation: submission.selfEvaluation,
              claudeVisionScore: dualGradingResult.grader1.score,
              mathGraderScore: dualGradingResult.grader2?.score,
            },
          },
        }),
      }
    );
  }

  // ... implement other DataService methods
  // NOTE: Some operations (like Week progress, XP, badges) stay in Firebase
}
```

---

## ✅ Compatibility Checklist

| Feature | TimeBack Support | Implementation Status |
|---------|------------------|----------------------|
| Store FRQ assignments | ✅ AssessmentLineItems | ✅ Ready |
| Store problem statements | ✅ description field | ✅ Ready |
| Store week references | ✅ metadata field | ✅ Ready |
| Store CERC scaffolding | ✅ metadata field | ✅ Ready |
| Store content links | ✅ metadata field | ✅ Ready |
| Store final scores | ✅ AssessmentResults | ✅ Ready |
| Store action points | ✅ comment field | ✅ Ready |
| Store Claude analysis | ✅ metadata field | ✅ Ready |
| Store MathGrader output | ✅ metadata field | ✅ Ready |
| Store images | ⚠️ External (Firebase Storage) | ✅ Ready (hybrid) |
| Store Week 1-4 progress | ⚠️ Not necessary (training) | ✅ Firebase only |
| OAuth2 authentication | ✅ AWS Cognito | ⏳ Pending implementation |
| Webhook triggers | ✅ QTI API supports | ⏳ Pending Phase G |

---

## 🚀 Migration Path

### Phase F: Firebase Implementation (Current)
- Implement Firebase adapter
- Store all application data
- Test full workflow with Firebase only

### Phase G: TimeBack Integration (Future)
1. **Implement TimeBackAdapter**
   - OAuth2 authentication
   - AssessmentLineItem CRUD
   - AssessmentResult CRUD

2. **Hybrid Storage Strategy**
   - FRQ assignments → TimeBack + Firebase
   - FRQ scores → TimeBack (official) + Firebase (detailed)
   - Week progress → Firebase only
   - Images → Firebase Storage

3. **Webhook Handler**
   - `/api/webhooks/timeback/quiz-completed`
   - Triggers FRQ assignment automatically

4. **Sync Service**
   - Background job to sync scores
   - Retry logic for failed syncs
   - Conflict resolution

---

## 📝 Conclusión

✅ **TODO ES COMPATIBLE CON TIMEBACK**

La arquitectura con service layer abstraction que construimos desde el principio permite **intercambiar el mock adapter por timeback adapter** sin cambiar una sola línea de lógica de negocio.

**Estrategia recomendada:**
1. **Ahora**: Continuar con Firebase para desarrollo/testing completo
2. **Fase G**: Implementar TimeBackAdapter con estrategia híbrida
3. **Producción**: TimeBack + Firebase trabajando juntos

El campo `metadata` en OneRoster con `additionalProperties: true` es **oro puro** — nos permite almacenar CERC scaffolding, dual grading results, y cualquier dato propietario sin romper el estándar.

**Next steps:** ¿Continuamos con Phase C (Week 1-4 Content) o prefieres implementar TimeBackAdapter ahora?
