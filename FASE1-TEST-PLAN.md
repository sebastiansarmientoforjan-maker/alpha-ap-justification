# FASE 1: Flujo FRQ Completo - Plan de Prueba

## Objetivo
Validar el flujo end-to-end de FRQ desde creación hasta feedback, usando mock data.

## Pre-requisitos
- ✅ Servidor corriendo en http://localhost:3001
- ✅ DATA_ADAPTER=mock en .env.local
- ✅ ANTHROPIC_API_KEY configurada
- ✅ TELEGRAM_BOT_TOKEN configurada
- ✅ TELEGRAM_CHAT_ID configurada

## Flujo Completo

### 1. Admin: Ver Dashboard
**URL:** http://localhost:3001/admin

**Esperado:**
- Ver lista de estudiantes con mock data
- Ver estadísticas: 7 estudiantes, N quizzes
- Ver quizzes sin FRQ asignado

**Verificar:**
- [ ] Dashboard carga correctamente
- [ ] Muestra estudiantes mock
- [ ] Muestra quizzes sin asignar

---

### 2. Admin: Crear Quiz Mock (Manual)
**API:** `POST /api/admin/quiz/create`

**Payload:**
```json
{
  "studentId": "sloka-001",
  "studentName": "Sloka Vudumu",
  "topic": "Mean Value Theorem",
  "score": 68,
  "weakTopics": ["MVT", "continuity", "differentiability"]
}
```

**Esperado:**
- Quiz creado con ID
- Aparece en dashboard como "sin FRQ asignado"

**Verificar:**
- [ ] API responde 200
- [ ] Quiz aparece en dashboard

---

### 3. Admin: Generar FRQ con Claude
**API:** `POST /api/admin/generate-frq`

**Payload:**
```json
{
  "studentId": "sloka-001",
  "studentName": "Sloka Vudumu",
  "quizScore": 68,
  "weakTopics": ["MVT", "continuity", "differentiability"],
  "course": "calculus-ab",
  "reasoningStage": "empirical"
}
```

**Esperado:**
- Claude genera FRQ completo
- PDF generado en Railway
- Telegram envía notificación + PDF
- Sebastian recibe en Telegram:
  - Mensaje con detalles del FRQ
  - Botones: Aprobar / Rechazar / Regenerar
  - PDF adjunto

**Verificar:**
- [ ] API responde 200
- [ ] Respuesta incluye frqId
- [ ] Claude genera JSON válido
- [ ] PDF compilado exitosamente
- [ ] Notificación Telegram recibida
- [ ] PDF adjunto recibido
- [ ] Botones funcionan en Telegram

---

### 4. Admin: Aprobar FRQ (via Telegram o Dashboard)
**API:** `POST /api/admin/frq/assign`

**Payload:**
```json
{
  "frqId": "frq-generated-id",
  "studentId": "sloka-001",
  "assignedAt": "2025-03-11T20:00:00Z"
}
```

**Esperado:**
- FRQ asignado al estudiante
- Estado cambia a "assigned"
- Estudiante puede ver FRQ en su dashboard

**Verificar:**
- [ ] API responde 200
- [ ] FRQ aparece en student dashboard

---

### 5. Estudiante: Ver FRQ Asignado
**URL:** http://localhost:3001/student (como sloka-001)

**Esperado:**
- Dashboard muestra FRQ pendiente
- Link a /student/frq/[assignmentId]

**Verificar:**
- [ ] Dashboard carga
- [ ] FRQ aparece en "Pending FRQs"
- [ ] Link funcional

---

### 6. Estudiante: Resolver FRQ
**URL:** http://localhost:3001/student/frq/[assignmentId]

**Esperado:**
- Muestra problema statement (KaTeX rendered)
- Form para subir solución:
  - Foto/scan del trabajo en papel
  - Self-evaluation con CB rubric
  - Notes field

**Acción:**
- Subir foto mock
- Completar self-evaluation
- Submit

**API:** `POST /api/student/frq/submit`

**Payload:**
```json
{
  "assignmentId": "assignment-id",
  "studentId": "sloka-001",
  "imageUrl": "uploaded-image-url",
  "selfEvaluation": {
    "score": 4,
    "rubricNotes": "I think I got most of it but missed the condition check"
  },
  "notes": "I wasn't sure about verifying continuity"
}
```

**Esperado:**
- Submission guardada
- Estado cambia a "submitted"
- Admin ve submission en dashboard

**Verificar:**
- [ ] Form carga correctamente
- [ ] Puede subir imagen
- [ ] Submit exitoso
- [ ] Aparece en admin dashboard

---

### 7. Admin: Ver Submission
**URL:** http://localhost:3001/admin/frq-review/[assignmentId]

**Esperado:**
- Muestra FRQ original
- Muestra student submission
- Muestra self-evaluation
- Opciones:
  - Manual grading
  - AI grading (MathGrader.AI)
  - Dual grading

**Verificar:**
- [ ] Página carga
- [ ] Muestra todo el contexto
- [ ] Botones de grading visibles

---

### 8. Admin: Calificar (Dual: Manual + AI)
**API:** `POST /api/admin/frq/dual-grade`

**Payload:**
```json
{
  "assignmentId": "assignment-id",
  "manualGrade": {
    "score": 5,
    "maxScore": 9,
    "rubricBreakdown": [
      {"criterion": "Setup", "points": 2, "maxPoints": 2},
      {"criterion": "Execution", "points": 2, "maxPoints": 3},
      {"criterion": "Justification", "points": 1, "maxPoints": 4}
    ],
    "comments": "Good work on setup but weak justification"
  },
  "aiGrade": {
    "score": 4,
    "maxScore": 9,
    "feedback": "Missing explicit condition verification...",
    "flagged": true,
    "flagReason": "Student skipped MVT hypothesis check"
  }
}
```

**Esperado:**
- Ambas calificaciones guardadas
- Consolida en score final
- Estado cambia a "graded"

**Verificar:**
- [ ] API responde 200
- [ ] Grades guardadas
- [ ] Estado actualizado

---

### 9. Admin: Consolidar y Generar 3 Action Points
**API:** `POST /api/admin/frq/consolidate`

**Payload:**
```json
{
  "assignmentId": "assignment-id",
  "manualScore": 5,
  "aiScore": 4,
  "finalScore": 5,
  "actionPoints": [
    "Always verify ALL theorem hypotheses before applying",
    "Practice: 3 more MVT problems focusing on continuity check",
    "Review: AP FRQ scoring guidelines for justification section"
  ]
}
```

**Esperado:**
- Consolidation guardada
- Action points listos para entregar

**Verificar:**
- [ ] API responde 200
- [ ] Consolidation guardada
- [ ] Action points generados

---

### 10. Admin: Entregar Feedback al Estudiante
**API:** `POST /api/admin/frq/deliver-feedback`

**Payload:**
```json
{
  "assignmentId": "assignment-id",
  "studentId": "sloka-001",
  "feedback": {
    "finalScore": 5,
    "maxScore": 9,
    "actionPoints": [...],
    "nextSteps": "Complete Week 1 Training Session focusing on MVT"
  }
}
```

**Esperado:**
- Feedback entregado
- Estado cambia a "feedback_delivered"
- Estudiante puede ver feedback
- Opcional: Notificación Telegram al estudiante

**Verificar:**
- [ ] API responde 200
- [ ] Feedback guardado
- [ ] Estado actualizado

---

### 11. Estudiante: Ver Feedback
**URL:** http://localhost:3001/student/frq/[assignmentId]

**Esperado:**
- Muestra score final
- Muestra 3 action points
- Muestra next steps
- Link a Week 1 training

**Verificar:**
- [ ] Página carga
- [ ] Muestra feedback completo
- [ ] Action points claros
- [ ] Link a training funcional

---

## Script de Prueba Automatizado

Ver `test-fase1.sh` para ejecutar todas las pruebas automáticamente.

## Métricas de Éxito

- [ ] Flujo completo sin errores
- [ ] Telegram recibe notificaciones
- [ ] PDF genera correctamente
- [ ] Claude API responde bien
- [ ] Mock data funciona end-to-end
- [ ] UI/UX fluida en cada paso

## Próximo Paso: FASE 2

Una vez validado FASE 1, continuar con Week 1 Training Session (CERC).
