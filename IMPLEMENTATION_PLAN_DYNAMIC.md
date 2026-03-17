# Plan de Implementación: Sistema Dinámico Week 1

## ✅ Archivos Creados

### 1. Contenido de Introducción
- `data/week-1-intro-content.ts` - Configuración de intro GENERAL
- `data/week-1-pre-assessment.ts` - Pre-assessment diagnóstico
- `WEEK_1_MULTIMEDIA_CONTENT.md` - Scripts de video, infografías, NotebookLM

### 2. Componentes de UI
- `app/student/week/1/intro/page.tsx` - Página de introducción GENERAL
  - Hero section con PAS formula
  - Learning objectives
  - Why it matters
  - Week structure
  - CTAs (Start Training / Pre-Assessment)

### 3. API Endpoints
- `app/api/admin/generate-frq/route.ts` - Genera FRQ + Week 1 problems dinámicamente
  - Llama Claude Opus 4.6
  - Decide FRQ type (< 80% vs ≥ 80%)
  - Notifica bot (Discord/Slack)
  - Guarda en DB pending approval

### 4. Documentación
- `WEEK_1_DYNAMIC_SYSTEM.md` - Flujo completo del sistema dinámico

---

## 🔧 Pasos de Implementación

### Paso 1: Variables de Entorno

Agregar a `.env.local`:

```bash
# Existing
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_FIREBASE_API_KEY=...
# ... resto de Firebase vars

# NEW: Bot Notifications
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK
# O alternativamente:
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR_WEBHOOK

# Base URL for links in notifications
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Paso 2: Actualizar Rutas de Navegación

**Modificar: `app/student/week/[weekNumber]/page.tsx`**

Cambiar línea 14-15:
```typescript
// ANTES:
if (weekNumber !== 1) {
  return <div>Week {weekNumber} coming soon</div>;
}

// DESPUÉS:
if (weekNumber !== 1) {
  return <div>Week {weekNumber} coming soon</div>;
}

// Redirect to intro if first time visiting Week 1
const hasSeenIntro = await checkIfUserSeenIntro(studentId, weekNumber);
if (!hasSeenIntro && weekNumber === 1) {
  redirect("/student/week/1/intro");
}
```

### Paso 3: Conectar Quiz Completion → FRQ Generation

**Crear: `app/api/quiz/complete/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { studentId, quizId, score, topics, weakTopics } = await req.json();

  // Step 1: Mark quiz as complete
  await markQuizComplete(studentId, quizId, score);

  // Step 2: Trigger FRQ generation
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/generate-frq`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      studentId,
      studentName: await getStudentName(studentId),
      quizScore: score,
      weakTopics,
      course: await getStudentCourse(studentId),
    }),
  });

  const result = await response.json();

  return NextResponse.json({
    success: true,
    message: "Quiz completed, FRQ generated and sent for approval",
    frqId: result.frqId,
  });
}
```

### Paso 4: Panel de Aprobación Admin

**Crear: `app/admin/frq-approvals/page.tsx`**

```typescript
"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, RefreshCw, Edit } from "lucide-react";

interface PendingFRQ {
  id: string;
  studentName: string;
  quizScore: number;
  frqType: "specific" | "general";
  weakTopics: string[];
  frq: {
    statement: string;
    type: string;
  };
  week1Problems: Array<{
    title: string;
    statement: string;
  }>;
  generatedAt: string;
}

export default function FRQApprovalsPage() {
  const [pendingFRQs, setPendingFRQs] = useState<PendingFRQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingFRQs();
  }, []);

  const fetchPendingFRQs = async () => {
    // TODO: Fetch from Firebase
    // const snapshot = await db.collection("frq_pending_approval")
    //   .where("status", "==", "pending")
    //   .orderBy("generatedAt", "desc")
    //   .get();

    // Mock data for now
    setPendingFRQs([]);
    setLoading(false);
  };

  const handleApprove = async (frqId: string) => {
    try {
      await fetch(`/api/admin/frq-approvals/${frqId}/approve`, {
        method: "POST",
      });
      alert("FRQ approved and assigned to student!");
      fetchPendingFRQs();
    } catch (error) {
      alert("Failed to approve FRQ");
    }
  };

  const handleReject = async (frqId: string) => {
    const reason = prompt("Reason for rejection:");
    if (!reason) return;

    await fetch(`/api/admin/frq-approvals/${frqId}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
    alert("FRQ rejected");
    fetchPendingFRQs();
  };

  const handleRegenerate = async (frqId: string) => {
    const feedback = prompt("Feedback for regeneration (optional):");

    await fetch(`/api/admin/frq-approvals/${frqId}/regenerate`, {
      method: "POST",
      body: JSON.stringify({ feedback }),
    });
    alert("Regenerating FRQ...");
    fetchPendingFRQs();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">FRQ Approvals</h1>

        {pendingFRQs.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            No pending FRQs
          </div>
        ) : (
          <div className="space-y-6">
            {pendingFRQs.map((frq) => (
              <div
                key={frq.id}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-8"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{frq.studentName}</h2>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-slate-400">
                        Score: <span className={frq.quizScore < 80 ? "text-red-400" : "text-green-400"}>
                          {frq.quizScore}%
                        </span>
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        frq.frqType === "specific"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-green-500/20 text-green-400"
                      }`}>
                        {frq.frqType.toUpperCase()}
                      </span>
                      {frq.weakTopics.length > 0 && (
                        <span className="text-slate-500">
                          Topics: {frq.weakTopics.join(", ")}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(frq.generatedAt).toLocaleString()}
                  </span>
                </div>

                {/* FRQ Preview */}
                <div className="bg-slate-900/50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-bold mb-3 text-blue-400">Generated FRQ:</h3>
                  <p className="text-slate-300 whitespace-pre-wrap">
                    {frq.frq.statement}
                  </p>
                </div>

                {/* Week 1 Problems */}
                <div className="bg-slate-900/50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-bold mb-3 text-purple-400">Week 1 Problems:</h3>
                  <ol className="space-y-3">
                    {frq.week1Problems.map((problem, idx) => (
                      <li key={idx} className="text-slate-300">
                        <span className="font-semibold text-purple-300">{idx + 1}. {problem.title}</span>
                        <p className="text-sm text-slate-400 mt-1 ml-4">
                          {problem.statement.slice(0, 150)}...
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(frq.id)}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Approve & Assign
                  </button>
                  <button
                    onClick={() => handleRegenerate(frq.id)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Regenerate
                  </button>
                  <button
                    onClick={() => handleReject(frq.id)}
                    className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### Paso 5: Crear Endpoints de Aprobación

**Crear: `app/api/admin/frq-approvals/[frqId]/approve/route.ts`**

```typescript
export async function POST(
  req: Request,
  { params }: { params: { frqId: string } }
) {
  const { frqId } = params;

  // Update status to approved
  await db.collection("frq_pending_approval")
    .doc(frqId)
    .update({ status: "approved", approvedAt: new Date() });

  // Assign to student
  const frqData = await getFRQData(frqId);
  await assignFRQToStudent(frqData.studentId, frqData);

  return Response.json({ success: true });
}
```

---

## 📊 Diagrama de Flujo Final

```
┌─────────────────────────────────────┐
│   Student completes MathAcademy     │
│          Quiz (score)               │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│   System evaluates score            │
│   < 80% → specific                  │
│   ≥ 80% → general                   │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│   POST /api/admin/generate-frq      │
│   - Calls Claude Opus 4.6           │
│   - Generates FRQ + 3 problems      │
│   - Saves to DB (pending)           │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│   📢 Bot Notification               │
│   (Discord/Slack webhook)           │
│   "New FRQ needs approval"          │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│   Sebastian reviews in              │
│   /admin/frq-approvals              │
│   - View FRQ + problems             │
│   - Approve / Edit / Regenerate     │
└────────────────┬────────────────────┘
                 │
                 ▼ (if approved)
┌─────────────────────────────────────┐
│   FRQ assigned to student           │
│   Status: "assigned"                │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│   Student sees Week 1 card          │
│   in dashboard with FRQ             │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│   Student clicks "Start Training"   │
│   → /student/week/1/intro           │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│   Intro page (GENERAL)              │
│   - PAS hook                        │
│   - Learning objectives             │
│   - Why it matters                  │
│   - CTA: Begin Training             │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│   /student/week/1                   │
│   Loads STUDENT-SPECIFIC problems   │
│   (generated by Claude)             │
└─────────────────────────────────────┘
```

---

## 🎬 URLs Clave

| URL | Propósito |
|-----|-----------|
| `/student/week/1/intro` | Introducción GENERAL de Week 1 |
| `/student/week/1` | Problemas dinámicos del estudiante |
| `/admin/frq-approvals` | Panel de aprobación para Sebastian |
| `/api/admin/generate-frq` | Endpoint de generación Claude |
| `/api/quiz/complete` | Trigger desde MathAcademy |

---

## ✅ Checklist de Implementación

### Setup
- [ ] Agregar variables de entorno (Discord/Slack webhook)
- [ ] Configurar NEXT_PUBLIC_BASE_URL
- [ ] Verificar ANTHROPIC_API_KEY está presente

### Backend
- [ ] Implementar `app/api/quiz/complete/route.ts`
- [ ] Implementar `app/api/admin/frq-approvals/[frqId]/approve/route.ts`
- [ ] Implementar `app/api/admin/frq-approvals/[frqId]/reject/route.ts`
- [ ] Implementar `app/api/admin/frq-approvals/[frqId]/regenerate/route.ts`

### Frontend
- [ ] Crear página de intro: `app/student/week/1/intro/page.tsx` ✅ (ya creada)
- [ ] Crear panel de aprobación: `app/admin/frq-approvals/page.tsx`
- [ ] Modificar `app/student/week/[weekNumber]/page.tsx` para cargar problemas dinámicos
- [ ] Agregar redirect a intro si es primera vez

### Firebase
- [ ] Crear colección `frq_pending_approval`
- [ ] Crear colección `frq_assigned`
- [ ] Agregar índices para queries eficientes

### Testing
- [ ] Test: Quiz score < 80% → FRQ específico generado
- [ ] Test: Quiz score ≥ 80% → FRQ general generado
- [ ] Test: Bot notification enviada
- [ ] Test: Sebastian aprueba → FRQ asignado
- [ ] Test: Estudiante ve intro → problemas personalizados

---

## 🎯 Próximos Pasos

**Ahora mismo:**
1. Configurar webhook (Discord o Slack)
2. Agregar variables de entorno
3. Probar endpoint `/api/admin/generate-frq` manualmente

**Después:**
4. Conectar MathAcademy quiz completion
5. Implementar panel de aprobación completo
6. Testear flujo end-to-end

**¿Qué prefieres hacer primero?**
