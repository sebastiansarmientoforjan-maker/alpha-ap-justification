# AP Math Justification Training - Plan Completo Actualizado

## 🎯 OBJETIVO DEL SISTEMA

Entrenar a 10 estudiantes de AP Math en justificación rigurosa usando el framework CERC, evaluando su trabajo mediante FRQs generados por Claude y calificados por Sebastian.

---

## 📋 WORKFLOW COMPLETO (REAL)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. TRIGGER: MathAcademy Quiz Completed                      │
│    → API sends webhook to our system                        │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. AUTO-GENERATION: Claude Creates FRQ                      │
│    → Claude (via AWS Bedrock) generates:                    │
│      • Problem statement with LaTeX                         │
│      • CERC skeleton (correct answer - admin only)          │
│      • Error category (CONDITION_BYPASS, etc.)              │
│      • Rubric (College Board style)                         │
│    → Telegram notification to Sebastian                     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. ADMIN REVIEW: Sebastian Approves/Edits FRQ               │
│    → Dashboard shows generated FRQ                          │
│    → Sebastian can:                                         │
│      • Approve as-is                                        │
│      • Edit problem statement                               │
│      • Regenerate with Claude                               │
│      • Reject and create manually                           │
│    → Once approved → FRQ assigned to student                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. NOTIFICATION: Student Notified                           │
│    → Email/in-app notification                              │
│    → "Week X materials now available"                       │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. STUDENT: Access Study Materials                          │
│    → /student/materials/week/X                              │
│    → Content available:                                     │
│      • CERC Framework explanation                           │
│      • Worked examples (MVT, IVT, EVT, etc.)                │
│      • Common mistakes to avoid                             │
│      • Video tutorials (optional)                           │
│    → STATIC content - just reading/studying                 │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. STUDENT: Download FRQ + Rubric                           │
│    → /student/frq/[assignmentId]                            │
│    → Download buttons for:                                  │
│      • FRQ PDF (problem statement)                          │
│      • Rubric PDF (College Board style grading criteria)    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. STUDENT: Complete FRQ on Paper                           │
│    → Student works offline                                  │
│    → Uses CERC framework                                    │
│    → Takes photo/scan when done                             │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. STUDENT: Self-Assessment with Rubric                     │
│    → Student grades their OWN work                          │
│    → Uses rubric like they're the teacher                   │
│    → Writes self-assessment on paper/document               │
│    → Takes photo/scan of self-assessment                    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 9. STUDENT: Upload Both Files                               │
│    → Upload #1: Completed FRQ work                          │
│    → Upload #2: Self-assessment with rubric                 │
│    → Both required to submit                                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 10. SEBASTIAN: Receive Submissions                          │
│     → Dashboard shows:                                      │
│       • Student completed work (PDF/image)                  │
│       • Student self-assessment (PDF/image)                 │
│     → Sebastian grades (manual or with MathGrader.AI)       │
│     → Compares student's self-assessment to actual grade    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 11. SEBASTIAN: Deliver Feedback                             │
│     → 3 action points for improvement                       │
│     → Comparison: self-assessment vs actual grade           │
│     → Delivered via platform                                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 12. STUDENT: View Feedback                                  │
│     → Dashboard shows:                                      │
│       • Grade                                               │
│       • 3 action points                                     │
│       • Self-assessment accuracy note                       │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ LO QUE YA ESTÁ FUNCIONANDO

### 1. **Claude FRQ Generation** ✅
- **Archivo**: `/app/api/admin/generate-frq/route.ts`
- **Funciona**: Sebastian puede triggear generación manual
- **Usa**: AWS Bedrock Claude Sonnet 4.5
- **Genera**:
  - Problem statement con LaTeX
  - CERC skeleton (admin-only)
  - Error category
  - Sentence frames
- **Output**: JSON de 18.8KB en ~95 segundos
- **Falta**: Auto-trigger desde MathAcademy webhook

### 2. **Telegram Notifications** ✅
- **Archivo**: `/lib/telegram/bot.ts`
- **Funciona**: Notificaciones cuando FRQ es generado
- **Envía**: Mensaje con botones inline
- **Incluye**: Preview del problema + "Regenerate" button
- **Falta**: "View Details" button (necesita NEXT_PUBLIC_BASE_URL)

### 3. **Admin FRQ Review Dashboard** ✅
- **Archivo**: `/app/admin/frq-review/page.tsx`
- **Funciona**: Lista de FRQs pendientes de aprobación
- **Features**:
  - Ver FRQ generado por Claude
  - Ver datos del estudiante
  - Aprobar/rechazar
- **Falta**: Edición inline del FRQ

### 4. **Data Service Layer** ✅
- **Archivo**: `/services/data/index.ts` + `mock.adapter.ts`
- **Funciona**: Abstracción completa de datos
- **Implementado**: Mock adapter con datos hardcoded
- **Incluye**:
  - 7 estudiantes mock
  - Problemas de Week 1-4
  - Quizzes y FRQ assignments
- **Falta**: Firebase adapter, TimeBack adapter

### 5. **Basic File Upload** ✅
- **Archivo**: `/components/admin/grade-frq-modal.tsx`
- **Funciona**: Upload de archivos
- **Usa**: FormData API
- **Falta**: Dual upload (work + self-assessment)

### 6. **AWS Bedrock Integration** ✅
- **Archivo**: `/lib/claude/bedrock-client.ts`
- **Funciona**: Wrapper completo para Claude API
- **Credenciales**: Configuradas en `.env.local`
- **Modelo**: `us.anthropic.claude-sonnet-4-5-20250929-v1:0`
- **Features**: Streaming, error handling, retry logic

### 7. **TypeScript Types System** ✅
- **Archivo**: `/lib/types.ts`
- **Incluye**: Problem, CERCResponse, Student, etc.
- **Completo**: Todas las interfaces necesarias

---

## 🔨 LO QUE FALTA POR DESARROLLAR

### **FASE 3: TimeBack Integration** ✅ **COMPLETADO**

#### 3.1 **Webhook Endpoint** ✅
- **Archivo creado**: `/app/api/webhooks/timeback/route.ts`
- **Funcionalidad**:
  - ✅ Recibe POST de TimeBack cuando assessment completado
  - ✅ Verifica Authorization Bearer token
  - ✅ Verifica firma HMAC-SHA256 (opcional)
  - ✅ Valida payload structure
  - ✅ Extrae: studentId, assessmentTitle, score, status
  - ✅ Verifica criterios: cohort AP Math, score >= 80%, fully graded
  - ✅ Auto-triggea Claude FRQ generation
  - ✅ Envía notificación Telegram a Sebastian
  - ✅ Logging completo
- **Tecnología**: Next.js API route, crypto for HMAC, AWS Bedrock Claude

#### 3.2 **Types & Validation** ✅
- **Archivo creado**: `/lib/types/timeback.ts`
- **Interfaces**:
  - ✅ TimeBackWebhookPayload
  - ✅ WebhookValidationResult
  - ✅ AssessmentTriggerResult

#### 3.3 **Test Suite** ✅
- **Archivo creado**: `/scripts/test-timeback-webhook.js`
- **Tests**:
  - ✅ Health check endpoint
  - ✅ Valid quiz completion (triggers)
  - ✅ Low score (doesn't trigger)
  - ✅ Non-cohort student (doesn't trigger)
  - ✅ Partially graded (doesn't trigger)
  - ✅ Invalid auth (rejected)

#### 3.4 **Documentation** ✅
- **Archivos creados**:
  - ✅ `TIMEBACK-WEBHOOK-REQUIREMENT.md` - Para enviar a TimeBack team
  - ✅ `TIMEBACK-WEBHOOK-SETUP.md` - Guía de configuración y testing

#### 3.5 **Pending: TimeBack Team Configuration** ⏳
- **Acción requerida**: Enviar `TIMEBACK-WEBHOOK-REQUIREMENT.md` al equipo de TimeBack
- **Esperar**: Que configuren el webhook en su plataforma
- **Alternativa**: Implementar polling si no tienen webhooks (ver Opción B en documento)

---

### **FASE 4: Study Materials Pages** ⏳

#### 4.1 **Week Materials Page**
- **Archivo a crear**: `/app/student/materials/week/[weekNumber]/page.tsx`
- **Contenido**:
  - CERC Framework explanation (del NotebookLM source 1)
  - Worked examples (del NotebookLM source 2)
  - Common mistakes
  - Video embeds (YouTube, opcional)
- **Formato**: Static content, markdown-to-HTML
- **Features**:
  - KaTeX rendering para math
  - Collapsible sections
  - Print-friendly version

#### 4.2 **Content Management**
- **Archivos a crear**:
  - `/content/week-1.md`
  - `/content/week-2.md`
  - `/content/week-3.md`
  - `/content/week-4.md`
- **O usar**: Database-driven content (Firebase)
- **Incluir**: Todas las secciones del NotebookLM

---

### **FASE 5: Enhanced Student FRQ Page** ⏳

#### 5.1 **Student FRQ Page Redesign**
- **Archivo a modificar**: `/app/student/frq/[assignmentId]/page.tsx`
- **Nuevo Layout**:

```tsx
┌──────────────────────────────────────────────┐
│ FRQ Assignment: [Topic]                      │
│ Due: [Date]                                  │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ Step 1: Study Materials                      │
│ ├─ CERC Framework                            │
│ ├─ Worked Examples                           │
│ └─ [Link to /student/materials/week/X]       │
│                                              │
│ Status: ✓ Available                          │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ Step 2: Download FRQ & Rubric                │
│ ├─ [Download FRQ PDF]                        │
│ └─ [Download Rubric PDF]                     │
│                                              │
│ Status: ✓ Downloaded (timestamp)             │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ Step 3: Upload Your Completed Work           │
│ ├─ Drag & drop or click to upload           │
│ └─ Accepted: PDF, JPG, PNG                   │
│                                              │
│ Status: ✓ Uploaded (filename, timestamp)     │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ Step 4: Upload Self-Assessment                │
│ ├─ Grade your own work using the rubric     │
│ ├─ Upload your self-assessment              │
│ └─ Accepted: PDF, JPG, PNG                   │
│                                              │
│ Status: ✓ Uploaded (filename, timestamp)     │
└──────────────────────────────────────────────┘

[Submit Both Files] ← Enabled only when both uploaded
```

#### 5.2 **Dual Upload Component**
- **Archivo a crear**: `/components/student/dual-upload.tsx`
- **Features**:
  - Two separate upload zones
  - Preview thumbnails
  - File validation (size, type)
  - Progress bars
  - "Replace file" option
  - Both required to submit

#### 5.3 **FRQ PDF Generation**
- **Archivo a crear**: `/app/api/frq/generate-pdf/route.ts`
- **Funcionalidad**:
  - Convierte FRQ (LaTeX + text) a PDF limpio
  - Header con: Student name, date, topic
  - Footer con: Page numbers
  - LaTeX rendering con KaTeX o MathJax
- **Opciones**:
  - Railway PDF compiler (si vuelve)
  - Puppeteer headless Chrome
  - LaTeX cloud service

#### 5.4 **Rubric PDF Generation**
- **Archivo a crear**: `/app/api/rubric/generate-pdf/route.ts`
- **Funcionalidad**:
  - College Board style rubric
  - Checkboxes para cada criterio
  - Espacio para comentarios
  - Scoring guide

---

### **FASE 6: Sebastian Grading Interface** ⏳

#### 6.1 **Enhanced Grading Dashboard**
- **Archivo a modificar**: `/app/admin/frq-review/[assignmentId]/page.tsx`
- **Nuevo Layout**:

```tsx
┌────────────────────────────────────────────────────┐
│ Grading: [Student Name] - [Topic]                  │
└────────────────────────────────────────────────────┘

┌─────────────────────┬──────────────────────────────┐
│ Student's Work      │ Student's Self-Assessment    │
│ [PDF Viewer]        │ [PDF Viewer]                 │
│                     │                              │
│ [Download]          │ [Download]                   │
└─────────────────────┴──────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ Your Grade                                         │
│ ├─ Score: [___] / 9                                │
│ ├─ Rubric breakdown:                               │
│ │   • Claim: [___] / 2                             │
│ │   • Evidence: [___] / 3                          │
│ │   • Reasoning: [___] / 2                         │
│ │   • Conditions: [___] / 2                        │
│ └─ Self-assessment accuracy: [Good/Fair/Poor]      │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ 3 Action Points for Student                        │
│ 1. [text area]                                     │
│ 2. [text area]                                     │
│ 3. [text area]                                     │
└────────────────────────────────────────────────────┘

[Save Draft] [Deliver Feedback to Student]
```

#### 6.2 **MathGrader.AI Integration** (Optional)
- **Archivo a crear**: `/lib/mathgrader/client.ts`
- **Funcionalidad**:
  - Upload PDF to MathGrader API
  - Receive AI-generated feedback
  - Pre-fill action points
- **Nota**: Sebastian puede still edit/override

#### 6.3 **PDF Viewer Component**
- **Archivo a crear**: `/components/admin/pdf-viewer.tsx`
- **Librería**: react-pdf or pdf.js
- **Features**:
  - Zoom in/out
  - Page navigation
  - Annotations (optional)

---

### **FASE 7: Feedback Delivery** ⏳

#### 7.1 **Feedback Delivery API**
- **Archivo a crear**: `/app/api/frq/deliver-feedback/route.ts`
- **Funcionalidad**:
  - Save grade + action points
  - Update assignment status to "graded"
  - Send notification to student
  - Email with feedback summary

#### 7.2 **Student Feedback View**
- **Archivo a modificar**: `/app/student/frq/[assignmentId]/page.tsx`
- **Show when graded**:
  - Grade (X/9)
  - Rubric breakdown
  - 3 action points
  - Note about self-assessment accuracy
  - Link to download graded work

---

### **FASE 8: NotebookLM Content Integration** ⏳

#### 8.1 **Convert NotebookLM Sources to Web Content**
- Ya creamos 3 sources:
  - `NOTEBOOKLM-SOURCE-1-CERC-FRAMEWORK.md`
  - `NOTEBOOKLM-SOURCE-2-EJEMPLOS-COMPLETOS.md`
  - `NOTEBOOKLM-SOURCE-3-IMPLEMENTACION-TECNICA.md`
- **Tarea**: Convertir a páginas web con buen design
- **Formato**: Markdown → React components
- **Features**:
  - KaTeX math rendering
  - Syntax highlighting para code
  - Collapsible sections
  - Print/export options

---

## 🗂️ RESUMEN DE ESTADO

### ✅ **COMPLETO Y FUNCIONANDO**
1. Claude FRQ generation (manual trigger)
2. Telegram notifications
3. Admin FRQ review (básico)
4. Data service layer (mock)
5. AWS Bedrock integration
6. Basic file upload
7. Types system

### ⏳ **EN DESARROLLO** (Lo que acabamos de construir)
- Week 1 CERC Training Session (interactive)
  - **NOTA**: Esto NO era parte del plan original
  - Lo construimos por confusión
  - Puede ser útil como "bonus practice mode" en el futuro

### 🔨 **PENDIENTE** (Crítico para MVP)
1. **MathAcademy webhook** (FASE 3)
2. **Study materials pages** (FASE 4)
3. **Enhanced student FRQ page con dual upload** (FASE 5)
4. **Sebastian grading interface** (FASE 6)
5. **Feedback delivery system** (FASE 7)
6. **NotebookLM content integration** (FASE 8)

### 🎁 **NICE TO HAVE** (Futuro)
- Interactive CERC training (lo que acabamos de construir)
- Badge system
- XP/gamification
- Boss Battle mode (Week 4)
- Analytics dashboard
- Mobile app

---

## 📊 PRIORIDADES

### **SPRINT 1** (Ahora mismo) - MVP Core
1. MathAcademy webhook
2. Study materials pages (static)
3. FRQ PDF generation
4. Rubric PDF generation
5. Dual upload (work + self-assessment)

### **SPRINT 2** - Grading Flow
1. Sebastian grading interface
2. PDF viewer component
3. Feedback delivery API
4. Student feedback view

### **SPRINT 3** - Polish
1. NotebookLM content beautification
2. Email notifications
3. File storage optimization
4. Error handling improvements

---

## 🚀 NEXT IMMEDIATE STEPS

¿Qué quieres que construya primero?

**Opción A:** MathAcademy webhook + auto-trigger flow
**Opción B:** Study materials pages + content integration
**Opción C:** Enhanced student FRQ page con dual upload
**Opción D:** Sebastian grading interface

Dime cuál es la prioridad y arranco.
