# 🚀 PLAN MAESTRO: Alpha AP Justification System

## 📊 VISIÓN GENERAL

```
┌────────────────────────────────────────────────────────────┐
│  OBJETIVO FINAL                                            │
│                                                            │
│  Sistema completo de entrenamiento CERC para 10           │
│  estudiantes de AP Math, con generación dinámica de       │
│  FRQs, PDFs profesionales, notificaciones Telegram,       │
│  y integración con TimeBack.                              │
└────────────────────────────────────────────────────────────┘

DURACIÓN ESTIMADA: 4-6 semanas
ESTUDIANTES: 10 (9 Calculus, 1 Statistics)
TECH STACK: Next.js, Claude API, LaTeX, Telegram, TimeBack
```

---

## 🎯 FASES DEL PROYECTO

| Fase | Nombre | Duración | Estado |
|------|--------|----------|--------|
| **0** | Setup Inicial | 1-2 días | 🟡 En progreso |
| **1** | FRQ Dinámico + PDF | 2-3 días | 📋 Planeado |
| **2** | Week 1 Training Completo | 3-4 días | 📋 Planeado |
| **3** | Gamificación (XP + Badges) | 2 días | 📋 Planeado |
| **4** | Admin Dashboard | 2-3 días | 📋 Planeado |
| **5** | TimeBack Integration | 3-4 días | 📋 Planeado |
| **6** | Week 2-4 Content | 4-5 días | 📋 Planeado |
| **7** | Testing + Deploy | 2 días | 📋 Planeado |

**TOTAL:** ~20-28 días de desarrollo

---

# 📋 FASE 0: SETUP INICIAL (1-2 días)

## Objetivo
Preparar infraestructura básica: Telegram, PDF compiler cloud, Firebase dev.

### ✅ Tareas

#### 0.1 Telegram Bot Setup (15 min)
- [ ] Crear bot con @BotFather
- [ ] Obtener Bot Token
- [ ] Obtener Chat ID con @userinfobot
- [ ] Agregar a `.env.local`
- [ ] Test: `/api/test-telegram?action=message`

#### 0.2 Docker PDF Compiler (2 horas)
- [ ] Crear `services/pdf-compiler/Dockerfile`
- [ ] Crear `services/pdf-compiler/server.ts`
- [ ] Implementar endpoint `/compile` con autenticación
- [ ] Deploy en Railway
- [ ] Configurar API keys
- [ ] Test: compilar PDF de prueba

**Archivos a crear:**
```
services/pdf-compiler/
├── Dockerfile
├── package.json
├── server.ts
└── .env.example
```

#### 0.3 Firebase Dev Setup (30 min)
- [ ] Crear proyecto Firebase
- [ ] Habilitar Auth (Email/Password)
- [ ] Crear Firestore database
- [ ] Agregar credenciales a `.env.local`
- [ ] Test: crear usuario de prueba

#### 0.4 NotebookLM Project Setup (1 hora)
- [ ] Crear proyecto NotebookLM
- [ ] Subir fuentes (ver sección NotebookLM abajo)
- [ ] Generar audio overview
- [ ] Crear study guide inicial
- [ ] Compartir link con estudiantes

### 📦 Entregables Fase 0
- ✅ Bot de Telegram funcionando
- ✅ PDF compiler en Railway (privado, seguro)
- ✅ Firebase configurado
- ✅ NotebookLM project con materiales

---

# 📋 FASE 1: FRQ DINÁMICO + PDF (2-3 días)

## Objetivo
Sistema completo de generación dinámica de FRQs con Claude, compilación de PDFs, y envío a Telegram.

### ✅ Tareas

#### 1.1 Claude Prompt Engineering (4 horas)
- [ ] Refinar prompt de generación FRQ
- [ ] Agregar ejemplos de output esperado
- [ ] Test: generar FRQ para score < 80%
- [ ] Test: generar FRQ para score ≥ 80%
- [ ] Validar JSON output structure

#### 1.2 PDF Generator con Docker (3 horas)
- [ ] Implementar `lib/pdf/cloud-generator.ts`
- [ ] Conectar con Railway PDF compiler
- [ ] Agregar autenticación API key
- [ ] Test: generar PDF completo (6 páginas)
- [ ] Validar LaTeX rendering

#### 1.3 API Endpoint `/api/admin/generate-frq` (2 horas)
- [ ] Actualizar endpoint para usar Docker compiler
- [ ] Agregar logging completo
- [ ] Implementar error handling
- [ ] Test: flow completo (Claude → PDF → Telegram)

#### 1.4 Telegram Document Sender (1 hora)
- [ ] Implementar `sendFRQPDFToTelegram`
- [ ] Agregar botones inline
- [ ] Test: recibir PDF en Telegram con botones

#### 1.5 Storage en Firebase (2 horas)
- [ ] Implementar `saveFRQ` en firebase.adapter
- [ ] Estructura de colecciones:
  ```
  /frqs/{frqId}
  /frq_pending_approval/{frqId}
  /frq_assigned/{studentId}/frqs/{frqId}
  ```
- [ ] Agregar timestamps y metadata
- [ ] Test: guardar FRQ generado

### 📦 Entregables Fase 1
- ✅ FRQ se genera dinámicamente con Claude
- ✅ PDF se compila en Railway (seguro)
- ✅ PDF llega a Telegram con botones
- ✅ FRQ se guarda en Firebase

### 🧪 Testing Fase 1
```bash
# Test completo
curl -X POST http://localhost:3000/api/admin/generate-frq \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "ananya-123",
    "studentName": "Ananya Kakarlapudi",
    "quizScore": 75,
    "weakTopics": ["derivatives", "MVT"],
    "course": "calculus-bc"
  }'

# Esperar 25 segundos
# Deberías recibir PDF en Telegram
```

---

# 📋 FASE 2: WEEK 1 TRAINING COMPLETO (3-4 días)

## Objetivo
Experiencia completa de Week 1: Intro → Pre-assessment → 3 problemas → Claude feedback.

### ✅ Tareas

#### 2.1 Week 1 Intro Page (3 horas)
- [ ] Implementar `/student/week/1/intro` (ya existe)
- [ ] Agregar animaciones (Aceternity UI)
- [ ] Integrar pre-assessment modal
- [ ] Test: flujo completo de intro

#### 2.2 Pre-Assessment System (2 horas)
- [ ] Crear componente `PreAssessmentModal`
- [ ] Implementar scoring algorithm
- [ ] Guardar resultado en Firebase
- [ ] Determinar scaffolding level (empirical/generic/formal)

#### 2.3 Week 1 Problems Display (4 horas)
- [ ] Implementar split-screen layout (ya existe)
- [ ] Cargar problemas dinámicos por estudiante
- [ ] Renderizar LaTeX con KaTeX
- [ ] Agregar theorem tooltips
- [ ] Agregar hint system (3 niveles)

#### 2.4 CERC Form Component (2 horas)
- [ ] Implementar formulario con 4 campos (ya existe)
- [ ] Validación de campos
- [ ] Character counters
- [ ] Auto-save drafts (localStorage)

#### 2.5 Claude Socratic Feedback (3 horas)
- [ ] Endpoint `/api/student/cerc/submit` (ya existe)
- [ ] Refinar prompt Socrático
- [ ] Implementar 3 hint levels
- [ ] Feedback inline display
- [ ] Test: enviar CERC → recibir feedback

#### 2.6 Progress Tracking (2 horas)
- [ ] Guardar CERC submissions en Firebase
- [ ] Track problem completion (1/3, 2/3, 3/3)
- [ ] Actualizar student progress
- [ ] "Complete Week 1" button logic

### 📦 Entregables Fase 2
- ✅ Intro page completa con pre-assessment
- ✅ 3 problemas dinámicos por estudiante
- ✅ Claude feedback Socrático funciona
- ✅ Progress tracking en Firebase

### 🧪 Testing Fase 2
```bash
# Como estudiante:
1. Ir a /student/week/1/intro
2. Completar pre-assessment
3. Click "Start Training"
4. Resolver Problema 1/3
5. Submit CERC → recibir feedback Claude
6. Next Problem → Problema 2/3
7. Repetir para 3/3
8. "Complete Week 1"
```

---

# 📋 FASE 3: GAMIFICACIÓN (2 días)

## Objetivo
Sistema de XP, badges, y reasoning stage progression.

### ✅ Tareas

#### 3.1 XP System (3 horas)
- [ ] Implementar XP awards:
  - +50 XP: identifica condición rota
  - +100 XP: identifica falla lógica
  - +150 XP: CERC completo sin asistencia
- [ ] Crear `lib/gamification/xp.ts`
- [ ] Guardar XP en Firestore
- [ ] Display XP counter en header (Magic UI Number Ticker)

#### 3.2 Badge System (3 horas)
- [ ] Definir badges:
  - 🔍 "The Skeptic" (sobrevive error-forcing)
  - 🏛️ "The Architect" (CERC impecable)
  - ⚔️ "Boss Slayer" (completa Week 4)
- [ ] Implementar badge unlock logic
- [ ] Animación de unlock (GSAP)
- [ ] Display badges en dashboard

#### 3.3 Reasoning Stage Tracker (2 horas)
- [ ] Crear `ReasoningStageOrb` component (Magic UI Orbiting Circles)
- [ ] Lógica de progresión: Empirical → Generic → Formal
- [ ] Visualización en student dashboard
- [ ] Timeline view en admin dashboard

#### 3.4 Student Dashboard Update (2 horas)
- [ ] Agregar XP counter
- [ ] Agregar badge display
- [ ] Agregar reasoning stage orb
- [ ] Stats cards (problems completed, XP earned, etc.)

### 📦 Entregables Fase 3
- ✅ Sistema de XP funcional
- ✅ Badges con animaciones
- ✅ Reasoning stage tracker
- ✅ Dashboard actualizado

---

# 📋 FASE 4: ADMIN DASHBOARD (2-3 días)

## Objetivo
Panel completo para Sebastian: aprobar FRQs, ver progreso de estudiantes, gestionar contenido.

### ✅ Tareas

#### 4.1 FRQ Approval Dashboard (4 horas)
- [ ] Página `/admin/frq-approvals`
- [ ] Tabs: Pending / Approved / Rejected
- [ ] Card view con preview de FRQ
- [ ] Botones: Approve / Reject / Regenerate / Edit
- [ ] Integración con Telegram webhook

#### 4.2 Student Progress Dashboard (3 horas)
- [ ] Página `/admin/dashboard`
- [ ] Lista de 10 estudiantes
- [ ] Por estudiante:
  - Reasoning stage (visual timeline)
  - XP history
  - Badges earned
  - Week completion status
  - Recent CERC submissions
- [ ] Filtros: por curso, por reasoning stage

#### 4.3 Manual Quiz Trigger (2 horas)
- [ ] UI para marcar quiz como completo
- [ ] Input: quiz score
- [ ] Checkbox: "Assign FRQ automatically"
- [ ] Trigger FRQ generation
- [ ] Mostrar confirmación

#### 4.4 MathGrader.AI Integration (2 hours)
- [ ] Input área para pegar output de MathGrader
- [ ] Parser de output
- [ ] Link a student + quiz
- [ ] Display en student detail page

#### 4.5 Telegram Webhook Handler (2 horas)
- [ ] Endpoint `/api/telegram/webhook` (ya existe)
- [ ] Implementar approve handler
- [ ] Implementar reject handler
- [ ] Implementar regenerate handler
- [ ] Configurar webhook en Telegram

### 📦 Entregables Fase 4
- ✅ Admin puede aprobar FRQs desde Telegram
- ✅ Dashboard muestra progreso de todos los estudiantes
- ✅ Sebastian puede trigger FRQ manualmente
- ✅ MathGrader output se integra

---

# 📋 FASE 5: TIMEBACK INTEGRATION (3-4 días)

## Objetivo
Migrar de Firebase a TimeBack para producción.

### ✅ Tareas

#### 5.1 TimeBack Adapter Implementation (6 horas)
- [ ] Implementar `services/data/timeback.adapter.ts`:
  - `authenticateWithTimeBack()` (OAuth2)
  - `getStudent()` (OneRoster API)
  - `saveFRQ()` (QTI 3.0 Items)
  - `assignFRQ()` (OneRoster LineItems)
  - `saveGrade()` (Gradebook API)
- [ ] Test cada método individualmente

#### 5.2 QTI 3.0 Format (3 horas)
- [ ] Implementar `lib/timeback/qti-generator.ts`
- [ ] Convertir FRQ a QTI XML
- [ ] CERC fields como extended-text-interaction
- [ ] Rubric data en qti-rubric-block
- [ ] Test: crear Item en TimeBack

#### 5.3 OAuth2 Authentication (2 horas)
- [ ] Implementar flow de OAuth2
- [ ] Token refresh logic
- [ ] Guardar tokens en .env
- [ ] Test: autenticación exitosa

#### 5.4 Webhook Receiver (2 horas)
- [ ] Endpoint `/api/timeback/quiz-complete`
- [ ] Validar webhook signature
- [ ] Parsear OneRoster data
- [ ] Trigger FRQ generation
- [ ] Test con datos mock

#### 5.5 Environment Switch (1 hora)
- [ ] Configurar `DATA_ADAPTER=timeback` en env
- [ ] Test: sistema funciona con TimeBack
- [ ] Validar que NO se rompe nada

### 📦 Entregables Fase 5
- ✅ TimeBack adapter completamente funcional
- ✅ FRQs se guardan como QTI 3.0 Items
- ✅ Assignments via OneRoster
- ✅ Webhook desde TimeBack funciona
- ✅ Switch Firebase ↔ TimeBack sin código

---

# 📋 FASE 6: WEEK 2-4 CONTENT (4-5 días)

## Objetivo
Expandir contenido de training para semanas 2, 3, y 4.

### ✅ Tareas

#### 6.1 Week 2: Condition Verification (2 días)
- [ ] Crear `data/week-2-content.ts`
- [ ] 3 problemas con structural scaffolding
- [ ] Focus: MVT/IVT/FTC condition checking
- [ ] Intro page para Week 2
- [ ] Test: completar Week 2

#### 6.2 Week 3: Global Argumentation (2 días)
- [ ] Crear `data/week-3-content.ts`
- [ ] 3 problemas con minimal scaffolding
- [ ] Focus: cross-topic justification
- [ ] Intro page para Week 3
- [ ] Test: completar Week 3

#### 6.3 Week 4: Boss Battle (2 días)
- [ ] Crear `data/week-4-content.ts`
- [ ] Multi-phase collaborative problem
- [ ] Timed mode
- [ ] Curveball mechanics
- [ ] Meteors + Text Reveal (Aceternity UI)
- [ ] Test: Boss Battle flow

### 📦 Entregables Fase 6
- ✅ Week 2-4 content completo
- ✅ Progresión de scaffolding clara
- ✅ Boss Battle funcional

---

# 📋 FASE 7: TESTING + DEPLOY (2 días)

## Objetivo
Testing exhaustivo y deploy a producción.

### ✅ Tareas

#### 7.1 End-to-End Testing (1 día)
- [ ] Test como estudiante (full journey)
- [ ] Test como admin (full workflow)
- [ ] Test edge cases
- [ ] Test error handling
- [ ] Performance testing

#### 7.2 Deploy Production (4 horas)
- [ ] Deploy Next.js en Vercel
- [ ] Deploy PDF compiler en Railway (prod)
- [ ] Configurar env vars en Vercel
- [ ] Configurar Telegram webhook URL
- [ ] Test: producción funciona

#### 7.3 Student Onboarding (2 horas)
- [ ] Crear cuentas para 10 estudiantes
- [ ] Enviar emails de bienvenida
- [ ] Compartir NotebookLM link
- [ ] Tutorial video (opcional)

#### 7.4 Documentation (2 horas)
- [ ] User manual para estudiantes
- [ ] Admin manual para Sebastian
- [ ] Troubleshooting guide
- [ ] Video walkthrough

### 📦 Entregables Fase 7
- ✅ Sistema en producción (Vercel)
- ✅ 10 estudiantes con acceso
- ✅ Documentación completa

---

# 📚 NOTEBOOKLM: QUÉ CREAR

## Proyecto NotebookLM: "AP Justification Training - Week 1-4"

### 📁 FUENTES A SUBIR (15-20 documentos)

#### Categoría 1: Content Documents
1. **`week-1-content-overview.md`**
   - Descripción de Week 1
   - 3 problemas con statements completos
   - Trampas explicadas
   - Objectives

2. **`cerc-framework-guide.md`**
   - Qué es CERC
   - Cómo usar cada campo
   - Ejemplos buenos vs malos
   - Template para aplicar

3. **`theorem-reference-sheet.md`**
   - MVT: statement, hypotheses, common traps
   - IVT: statement, hypotheses, common traps
   - FTC: statement, hypotheses, common traps
   - EVT: statement, hypotheses

4. **`inference-conditions-checklist.md`** (Statistics)
   - Two-sample t-test conditions
   - One-sample t-test conditions
   - Confidence interval conditions
   - Common violations

#### Categoría 2: Ejemplos Resueltos
5. **`example-cerc-mvt-correct.md`**
   - Problema MVT completo
   - Solución CERC impecable
   - Annotated con explicaciones

6. **`example-cerc-ivt-correct.md`**
   - Problema IVT completo
   - Solución CERC impecable

7. **`example-cerc-does-not-apply.md`**
   - Problema donde teorema NO aplica
   - Cómo estructurar respuesta
   - Justificación completa

8. **`common-errors-analysis.md`**
   - 10 errores comunes de estudiantes
   - Por qué están mal
   - Cómo corregirlos

#### Categoría 3: College Board Materials
9. **`ap-calculus-frq-rubrics-2019-2024.pdf`**
   - Descargar de College Board
   - Rubrics de FRQs recientes
   - Enfoque en justification points

10. **`ap-statistics-frq-rubrics-2019-2024.pdf`**
    - Rubrics de FRQs de Stats
    - Enfoque en condition verification

11. **`scoring-guidelines-justification-emphasis.md`**
    - Extractos de scoring guidelines
    - Qué buscan los graders
    - Palabras clave importantes

#### Categoría 4: Pedagogía
12. **`error-forcing-pedagogy-explained.md`**
    - Qué es error-forcing
    - Por qué funciona
    - Cómo aprovecharla

13. **`reasoning-stages-harel-sowder.md`**
    - Empirical → Generic → Formal
    - Cómo progresar
    - Self-assessment

14. **`socratic-method-in-math.md`**
    - Cómo Claude usa método Socrático
    - Cómo responder a preguntas guiadas
    - Ejemplos de diálogo

#### Categoría 5: Estrategias de Estudio
15. **`study-strategies-week-1.md`**
    - Cómo prepararse para cada problema
    - Tiempo recomendado por problema
    - Cuándo pedir hints

16. **`self-check-questions.md`**
    - Preguntas para hacerse antes de submit
    - "¿Verifiqué todas las condiciones?"
    - "¿Mi evidencia apoya mi claim?"

### 📊 OUTPUTS DE NOTEBOOKLM A GENERAR

#### 1. Audio Overview (Auto-generado)
- [ ] Generar "Audio Overview" (2 podcasters)
- [ ] ~15-20 minutos
- [ ] Explica Week 1 concepts
- [ ] Compartir con estudiantes para escuchar

#### 2. Study Guide (Auto-generado)
- [ ] Generar "Study Guide"
- [ ] NotebookLM crea resumen estructurado
- [ ] Descargar y compartir PDF

#### 3. FAQ Document (Generado con prompts)
Prompts a usar:

```
1. "Create a comprehensive FAQ for students starting Week 1
   error-forcing problems. Include questions about CERC
   framework, theorem conditions, and how to use hints."

2. "Generate a checklist students should use before
   submitting each CERC response. Include verification
   steps for each of the four components."

3. "Create a troubleshooting guide for common mistakes
   in MVT/IVT problems, with specific examples and corrections."

4. "Generate a comparison table showing 'What students
   typically write' vs 'What AP graders want to see'
   for justification questions."

5. "Create a quick reference card (1 page) with theorem
   statements, hypotheses, and verification steps for
   MVT, IVT, and FTC."
```

#### 4. Briefing Doc (Auto-generado)
- [ ] NotebookLM crea "Briefing Doc"
- [ ] Resumen ejecutivo de todo el contenido
- [ ] Ideal para repaso rápido

### 🎯 CÓMO ORGANIZAR EN NOTEBOOKLM

```
Proyecto: "AP Justification Training"

Notebooks:
├── Week 1: Error-Forcing Problems
│   ├── Sources: docs 1-7, 12-13
│   ├── Audio Overview ✅
│   └── Study Guide ✅
│
├── CERC Framework Deep Dive
│   ├── Sources: docs 2, 5-8
│   ├── FAQ Document (generated)
│   └── Checklist (generated)
│
├── Theorem Reference
│   ├── Sources: docs 3-4
│   ├── Quick Reference Card (generated)
│   └── Common Traps (generated)
│
└── AP Exam Strategies
    ├── Sources: docs 9-11, 16
    ├── Scoring Guide Analysis
    └── Comparison Table (generated)
```

### 📱 SHARE CON ESTUDIANTES

Una vez creado:
1. Share link del Notebook principal
2. Enviar Audio Overview (para escuchar mientras estudian)
3. PDF del Study Guide (para imprimir)
4. Link a FAQ + Checklist

---

# 📊 CRONOGRAMA SUGERIDO

```
SEMANA 1:
- Lun-Mar: Fase 0 (Setup Inicial)
- Mié-Vie: Fase 1 (FRQ Dinámico)

SEMANA 2:
- Lun-Jue: Fase 2 (Week 1 Training)
- Vie: Fase 3 inicio (XP System)

SEMANA 3:
- Lun: Fase 3 fin (Badges)
- Mar-Jue: Fase 4 (Admin Dashboard)
- Vie: Testing Fase 4

SEMANA 4:
- Lun-Mié: Fase 5 (TimeBack)
- Jue-Vie: Testing end-to-end

SEMANA 5-6:
- Fase 6 (Week 2-4 Content)
- Fase 7 (Deploy + Onboarding)

LAUNCH: Final de Semana 6
```

---

# ✅ CHECKLIST MAESTRO

## Fase 0: Setup Inicial
- [ ] Telegram bot configurado
- [ ] Docker PDF compiler en Railway
- [ ] Firebase dev setup
- [ ] NotebookLM project creado

## Fase 1: FRQ Dinámico
- [ ] Claude genera FRQ correctamente
- [ ] PDF se compila en Railway
- [ ] PDF llega a Telegram
- [ ] FRQ se guarda en Firebase

## Fase 2: Week 1 Training
- [ ] Intro page funcional
- [ ] Pre-assessment implementado
- [ ] 3 problemas cargan correctamente
- [ ] Claude feedback funciona
- [ ] Progress tracking activo

## Fase 3: Gamificación
- [ ] XP system funcional
- [ ] Badges con animaciones
- [ ] Reasoning stage tracker
- [ ] Dashboard actualizado

## Fase 4: Admin Dashboard
- [ ] FRQ approval workflow
- [ ] Student progress view
- [ ] Manual quiz trigger
- [ ] Telegram webhook activo

## Fase 5: TimeBack
- [ ] Adapter implementado
- [ ] QTI 3.0 format correcto
- [ ] OAuth2 funciona
- [ ] Webhook receiver activo

## Fase 6: Week 2-4
- [ ] Week 2 content completo
- [ ] Week 3 content completo
- [ ] Week 4 Boss Battle listo

## Fase 7: Deploy
- [ ] Deployed en Vercel
- [ ] 10 estudiantes con acceso
- [ ] Documentación completa
- [ ] ✅ LAUNCH

---

# 🚀 SIGUIENTE PASO INMEDIATO

**EMPEZAR CON FASE 0, TAREA 0.2:**

## Docker PDF Compiler Setup (2 horas)

¿Quiero que implemente esto AHORA?

Incluye:
1. Crear Dockerfile con LaTeX
2. Crear server.ts con endpoint `/compile`
3. Deploy en Railway
4. Test: compilar PDF de prueba
5. Integrar con Next.js

**¿Comenzamos?** 🚀
