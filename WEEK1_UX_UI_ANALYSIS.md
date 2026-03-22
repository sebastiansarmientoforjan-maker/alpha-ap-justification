# Análisis Exhaustivo UX/UI — Week 1 Landing Page

**Fecha:** 2026-03-22
**Alcance:** Comparación de coherencia visual y flujo de navegación entre:
- Landing page (/)
- Student dashboard (/student)
- Week 1 page (/student/week/1)

---

## ❌ PROBLEMAS CRÍTICOS DETECTADOS

### 1. **INCOHERENCIA VISUAL BRUTAL**

#### Landing Page (/)
- **Estilo:** Marketing/brochure elegante y minimalista
- **Mensaje:** "Programa de 4 semanas, target AP 5"
- **Componentes:** Stats cards simples, roadmap limpio con 4 fases
- **Propósito:** Vender el programa, motivar inscripción
- **Tone:** Profesional, institucional, ambicioso

#### Student Dashboard (/student)
- **Estilo:** Dashboard operacional con stats/FRQs
- **Mensaje:** "Bienvenido [nombre], aquí está tu progreso"
- **Componentes:** XP/badges, stats numéricos, FRQ cards, video intro
- **Propósito:** Hub de progreso y asignaciones
- **Tone:** Funcional, gamificado, personal

#### Week 1 Landing (/student/week/1)
- **Estilo:** PÁGINA DE VENTAS COMPLETA (!!!)
- **Mensaje:** "Break Your Empirical Illusions" + storytelling largo
- **Componentes:** Hero dramático, 4 tabs interactivos, checkpoint indicators, progress bars, modals, keyboard shortcuts
- **Propósito:** Convencer al estudiante de que Week 1 es importante (????)
- **Tone:** Híper-motivacional, casi comercial, overwhelming

**PROBLEMA:** El estudiante YA está inscrito, YA está dentro del programa, YA hizo clic en Week 1 desde el roadmap. ¿Por qué le estás vendiendo Week 1 como si fuera un producto separado?

---

### 2. **NAVEGACIÓN FRAGMENTADA Y CONFUSA**

#### Flujo actual:
```
Landing (/)
   → Click en Week 1 del roadmap
   → Week 1 (/student/week/1) [PÁGINA DE VENTAS DE 2000+ LÍNEAS]
      → 4 tabs interactivos (Problem/Solution/Method/Path)
      → Ver video de 4 minutos
      → Completar "practice demo" (requirement bloqueado)
      → Finalmente: botón "View Problems" → /student/week/1/problems
```

**PROBLEMA:** El estudiante tiene que hacer 5+ clicks y scrolls para llegar a los problemas reales.

#### Flujo esperado:
```
Landing (/)
   → Click en Week 1 del roadmap
   → Directamente a /student/week/1/problems (lista de problemas disponibles)
      → Click en problema específico
      → /student/week/1/problem/[id]/instructions
```

**PROBLEMA:** Week 1 page es un cuello de botella innecesario.

---

### 3. **STUDENT DASHBOARD ES REDUNDANTE**

El `/student` dashboard actualmente muestra:
- Video de introducción (debería estar en `/student/intro` o landing)
- XP/badges (útil, pero podría ser un componente global en header)
- FRQ assignments (útil, pero es contenido MUY específico)

**PROBLEMA:** No sirve un propósito único. Es un híbrido confuso entre:
- Página de bienvenida (redundante con landing)
- Progress tracker (debería ser un sidebar global)
- FRQ hub (debería ser `/student/frqs`)

---

### 4. **WEEK 1 PAGE ES OVER-ENGINEERED**

Esta página tiene **2000+ líneas de código** con:

#### Features que NO deberían existir:
- Hero section dramático ("Break Your Empirical Illusions")
- 4 tabs interactivos con storytelling (The Problem/Solution/Method/Path)
- Video embed de 4 minutos sobre "The Solution" (CERC framework)
- Progress bars y checkpoint indicators en desktop Y mobile
- Keyboard shortcuts (1-4 para tabs, ? para help, Esc para cerrar modal)
- Modal de bienvenida con fade-in/fade-out
- Intersection observers para tracking view progress
- "Practice demo" requirement con localStorage validation
- Reduced motion preferences handling
- Focus trap en modals para a11y

#### Features que SÍ deberían existir (pero NO están):
- Lista simple de problemas disponibles
- Descripción corta de cada problema (1-2 líneas)
- Botones "Start Problem" directos
- Indicadores de progreso (0/6 completados)

**REALIDAD:** Esta página es una landing page DENTRO de una landing page. Es como si Netflix te mostrara un trailer de 5 minutos cada vez que haces clic en una serie.

---

### 5. **TABS INNECESARIOS Y CONFUSOS**

Los 4 tabs (Problem/Solution/Method/Path) contienen:

**Tab 1: "The Problem"**
- Texto largo explicando que los estudiantes fallan en justificación
- "93% de estudiantes pueden calcular pero no justificar"
- Botón para abrir modal con ejemplos de errores comunes

**Tab 2: "The Solution"**
- Video embed explicando el framework CERC
- Texto: "Watch this 4-minute overview..."
- Tracking de si el estudiante completó el video

**Tab 3: "The Method"**
- Explicación de error-forcing problems
- "We deliberately design problems that collapse if you skip conditions"
- Cards con ejemplos de MVT/IVT/EVT

**Tab 4: "Your Path"**
- Roadmap visual de Week 1
- 3 stages: Learn → Practice → Master
- "480 XP available this week"

**PROBLEMA:** TODO este contenido debería estar en:
- El video intro del dashboard (`/student/intro`)
- O en la landing page como marketing
- O directamente eliminado (repetitivo con CLAUDE.md y docs)

---

## 🔍 ANÁLISIS DETALLADO: WEEK 1 PAGE

### Estructura actual:
```
/student/week/1 (2000+ líneas)
├── Hero Section
│   ├── "Break Your Empirical Illusions"
│   ├── "480 XP available"
│   └── Scroll indicator
├── Interactive Tabs Section
│   ├── Left sidebar: 4 tab buttons
│   └── Right content: TabPanel con AnimatePresence
├── Final CTA Section
│   ├── Progress check (all sections viewed?)
│   ├── "Practice Demo" card (locked until sections viewed)
│   └── "View Problems" card (locked until practice completed)
└── Keyboard Shortcuts Modal
```

### Complejidad técnica:
- **State management:** 11 useState hooks
- **Refs:** 7 useRef hooks
- **Effects:** 10 useEffect hooks
- **Event listeners:** Scroll, keyboard, intersection observers
- **Animations:** Framer Motion con reduced motion support
- **Accessibility:** Focus traps, ARIA labels, skip links, keyboard nav

**PROBLEMA:** Esta complejidad es apropiada para una landing page de producto SaaS ($50M ARR), NO para una página interna de un curso de 7 estudiantes.

---

## 🎯 PROPUESTAS DE SOLUCIÓN

### Opción A: SIMPLIFICACIÓN RADICAL (RECOMENDADA)

**Eliminar completamente `/student/week/1` landing page.**

#### Nuevo flujo:
```
Landing (/)
   → Click en Week 1 del roadmap
   → /student/week/1/problems (lista directa de problemas)
```

#### Contenido de `/student/week/1/problems`:
```tsx
<div className="min-h-screen bg-gradient-to-br from-primary-900">
  <Header>
    <Breadcrumbs: Dashboard → Week 1 → Problems />
    <Back to Roadmap>
  </Header>

  <Container>
    {/* Week header */}
    <div className="mb-12">
      <h1>Week 1: Error-Forcing Problems</h1>
      <p>Master justification by learning when theorems cannot be applied.</p>
      <div className="flex gap-4">
        <Badge>480 XP available</Badge>
        <Badge>Full CERC sentence frames</Badge>
        <Badge>0 of 6 complete</Badge>
      </div>
    </div>

    {/* Optional: Week objectives (collapsible) */}
    <Accordion>
      <AccordionItem title="Week 1 Objectives">
        <ul>
          <li>Identify when theorem conditions are violated</li>
          <li>Construct CERC proofs with full scaffolding</li>
          <li>Distinguish empirical vs. formal reasoning</li>
        </ul>
      </AccordionItem>
    </Accordion>

    {/* Problems list */}
    <div className="space-y-6 mt-8">
      {problems.map(problem => (
        <ProblemCard
          key={problem.id}
          title={problem.title}
          description={problem.trap} // 1-2 líneas
          concepts={problem.concepts}
          xp={problem.xp}
          status={problem.status} // not-started | in-progress | completed
          href={`/student/week/1/problem/${problem.id}/instructions`}
        />
      ))}
    </div>
  </Container>
</div>
```

**Resultado:**
- Reducción de 2000 líneas → 150 líneas
- Click en roadmap → directamente a problemas (1 click)
- Contenido educativo movido a `/student/intro` (video central)
- Eliminación de toda la "venta" innecesaria

---

### Opción B: MANTENER LANDING PERO SIMPLIFICADA (COMPROMISO)

Si realmente quieres conservar una landing page por semana:

#### Estructura simplificada (500 líneas máximo):
```tsx
<div className="min-h-screen">
  <Header />

  {/* Hero compacto */}
  <section className="py-12 text-center">
    <Badge>Week 1 - Foundation</Badge>
    <h1>Error-Forcing Problems</h1>
    <p>Master condition verification in 6 targeted problems.</p>
    <div className="flex gap-3 justify-center">
      <Stat>480 XP</Stat>
      <Stat>6 Problems</Stat>
      <Stat>Full Scaffolding</Stat>
    </div>
  </section>

  {/* Objectives + Method (single section, NO tabs) */}
  <section className="py-8 max-w-4xl mx-auto">
    <h2>What You'll Learn</h2>
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <h3>Objectives</h3>
        <ul>
          <li>Verify IVT/MVT/EVT conditions</li>
          <li>Construct CERC proofs</li>
          <li>Break empirical illusions</li>
        </ul>
      </Card>
      <Card>
        <h3>Method</h3>
        <p>Error-forcing: problems collapse if conditions bypassed.</p>
        <p>Scaffolding: Full sentence frames provided.</p>
      </Card>
    </div>
  </section>

  {/* Direct CTA */}
  <section className="py-8 text-center">
    <ShimmerButton href="/student/week/1/problems">
      View Problems (0/6 complete)
    </ShimmerButton>
  </section>
</div>
```

**Resultado:**
- Reducción de 2000 líneas → 500 líneas
- Eliminación de tabs, modals, keyboard shortcuts, videos embeddeados
- Información directa y clara
- 1 click adicional pero con contexto útil

---

### Opción C: ELIMINAR STUDENT DASHBOARD (MÁS RADICAL)

**Problema identificado:** `/student` no sirve un propósito claro.

#### Propuesta:
1. **Eliminar `/student` completamente**
2. **Mover video intro a landing page** (/) como sección adicional
3. **Mover FRQs a `/student/frqs`** (ruta dedicada)
4. **Mover XP/badges a header global** (componente persistente)

#### Nuevo flujo:
```
Landing (/)
   ├── Hero + Roadmap
   ├── Course Introduction Video (collapsible)
   └── "What You'll Master" (4 cards)

Click en Week 1 del roadmap
   → /student/week/1/problems (directamente)

Header global (siempre visible):
   ├── CourseSwitcher
   ├── XP counter
   └── Badges dropdown
```

**Resultado:**
- Navegación ultra clara: Landing → Weeks → Problems → Problem
- Dashboard eliminado = 1 archivo menos que mantener
- Info persistente en header (XP/badges siempre visibles)

---

## 📊 COMPARACIÓN DE OPCIONES

| Aspecto | Opción A (Radical) | Opción B (Compromiso) | Opción C (Ultra-radical) |
|---------|-------------------|----------------------|--------------------------|
| **Líneas eliminadas** | ~2000 | ~1500 | ~2800 |
| **Clicks hasta problemas** | 1 | 2 | 1 |
| **Complejidad mantenimiento** | Muy baja | Media | Muy baja |
| **UX clarity** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Preserva storytelling** | No | Sí (reducido) | No |
| **Riesgo de romper algo** | Bajo | Medio | Alto |

---

## 🚨 RECOMENDACIÓN FINAL

**Implementar OPCIÓN A (Simplificación Radical) en dos fases:**

### Fase 1: Week 1 únicamente (piloto)
1. Eliminar `/student/week/1/page.tsx` (2000 líneas)
2. Hacer que roadmap apunte directamente a `/student/week/1/problems`
3. Mover objectives/method a un `<Accordion>` opcional en la página de problems
4. Observar feedback de estudiantes (1 semana)

### Fase 2: Weeks 2-4 + Dashboard (después del piloto)
1. Si Fase 1 es exitosa, replicar en Weeks 2, 3, 4
2. Evaluar si `/student` dashboard sigue teniendo sentido
3. Si no, implementar Opción C (eliminar dashboard)

---

## 🎨 DISEÑO PROPUESTO: WEEK 1 PROBLEMS PAGE

### Wireframe conceptual:
```
┌─────────────────────────────────────────────────────┐
│ [← Back to Roadmap]    [Course Switcher] [XP] [🏆] │ ← Header
├─────────────────────────────────────────────────────┤
│                                                     │
│  Week 1: Error-Forcing Problems                     │
│  Master justification by learning when theorems     │
│  cannot be applied.                                 │
│                                                     │
│  [480 XP] [Full Scaffolding] [0/6 complete]        │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ ▼ Week 1 Objectives (click to expand)       │   │ ← Accordion
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 1  MVT Violation on Discontinuous Function  │   │
│  │    Trap: MVT requires continuity on [a,b]   │   │
│  │    [Continuity] [MVT] [Error-forcing]       │   │
│  │    [Start Problem →]              [80 XP]   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 2  IVT with Non-continuous Intermediate     │   │
│  │    Trap: IVT requires continuity everywhere │   │
│  │    [IVT] [Continuity] [Piecewise]           │   │
│  │    [Start Problem →]              [80 XP]   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [... 4 more problems ...]                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Características visuales:
- **Header global:** Breadcrumbs + Course Switcher + XP + Badges (siempre visible)
- **Week info:** Título + descripción + badges en una sola sección compacta
- **Accordion opcional:** Objectives + Method (colapsado por default)
- **Problem cards:** Info directa sin dramatismo, botón claro "Start Problem"
- **Sin modals, sin tabs, sin videos embeddeados, sin keyboard shortcuts**

---

## 💡 INSIGHTS CLAVE

### 1. El estudiante YA está comprometido
No necesitas venderle Week 1. Ya hizo clic en el roadmap. Ya está dentro del programa. Solo muéstrale los problemas.

### 2. La información educativa va en el intro
El video del framework CERC debería estar en `/student/intro` (que ya existe pero está solo en el dashboard). Ese es el lugar correcto para "onboarding" educativo.

### 3. Las landing pages son para AFUERA, no ADENTRO
Una landing page dramática con hero, tabs, storytelling, etc. es para convencer a alguien de inscribirse. No para alguien que ya está dentro.

### 4. Más código ≠ mejor UX
Week 1 tiene 2000 líneas, pero la UX es confusa. Week 1 problems page tiene 300 líneas y la UX sería clara. La simplicidad gana.

### 5. Coherencia visual > wow factor
Es mejor tener 4 páginas simples y coherentes que 4 páginas cada una con su propio estilo visual/interactivo.

---

## 📋 PLAN DE IMPLEMENTACIÓN

### 1. Crear nueva page: `/student/week/1/problems/page.tsx`
- Copy existing problems page structure
- Add week header with objectives accordion
- Keep simple problem cards

### 2. Modificar roadmap: `components/ui/program-roadmap.tsx`
```diff
- href={`/student/week/${phase.week}`}
+ href={`/student/week/${phase.week}/problems`}
```

### 3. Opcional: Preservar old page como `/student/week/1/intro`
- Rename current page to `intro/page.tsx`
- Add link from problems page: "Need context? View Week 1 Introduction"
- But DON'T make it required

### 4. Testing checklist:
- [ ] Roadmap click goes directly to problems
- [ ] Back button goes to landing (roadmap)
- [ ] Course switcher works correctly
- [ ] Problem cards link to instructions
- [ ] Objectives accordion expands/collapses
- [ ] XP/badges visible in header

---

## 🏁 CONCLUSIÓN

**El problema NO es técnico, es conceptual.**

Tienes 3 tipos de páginas mezcladas:
1. **Marketing landing** (landing page /) ✅ Correcto
2. **Operational dashboard** (/student) ⚠️ Redundante
3. **Internal landing pages** (/student/week/1-4) ❌ Innecesarias

**Solución:** Simplifica Week 1 a una lista directa de problemas. Si funciona, replica en Weeks 2-4. Después evalúa si el dashboard sigue siendo necesario.

**Impacto esperado:**
- Reducción de 2000+ líneas de código
- UX clara: Roadmap → Problems → Problem
- Mantenimiento más fácil
- Coherencia visual entre todas las páginas
- Estudiantes llegan a problemas en 1 click, no 5

**Next step:** ¿Quieres que implemente Opción A para Week 1 como piloto?
