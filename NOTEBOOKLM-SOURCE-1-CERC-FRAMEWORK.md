# CERC Framework - Fuente para NotebookLM

## ¿Qué es CERC?

CERC es un framework de justificación matemática que estructura el razonamiento deductivo formal en 4 componentes:

### C = Claim (Afirmación)
La conclusión que quieres probar. Debe ser:
- **Precisa**: No ambigua, matemáticamente específica
- **Completa**: Incluye todos los casos relevantes
- **Directa**: Responde exactamente la pregunta

**Ejemplo:**
- ❌ Mal: "La función es continua"
- ✅ Bien: "La función f es continua en x = 2"

### E = Evidence (Evidencia)
Los datos matemáticos que sustentan tu claim. Incluye:
- **Cálculos específicos**: Valores numéricos, límites, derivadas
- **Información dada**: Datos del problema
- **Resultados intermedios**: Pasos algebraicos verificables

**Ejemplo:**
```
lim(x→2⁻) f(x) = 5
lim(x→2⁺) f(x) = 5
f(2) = 5
```

### R = Reasoning (Razonamiento)
El teorema, principio o definición que conecta la evidencia con el claim. Debe:
- **Nombrar el teorema**: Explícitamente (ej: "Por el Teorema del Valor Intermedio...")
- **Explicar la conexión**: Cómo la evidencia implica el claim
- **Ser general**: No solo para este caso específico

**Ejemplo:**
"Por la definición de continuidad, una función es continua en x = c si y solo si lim(x→c) f(x) = f(c)"

### C = Conditions (Condiciones)
Verificación EXPLÍCITA de que se cumplen TODAS las hipótesis del teorema. Este es el paso que la mayoría de estudiantes omite.

**Ejemplo con MVT:**
```
Para aplicar el Teorema del Valor Medio, necesitamos:
✓ Condición 1: f es continua en [a,b]
  Verificación: f(x) = x² es un polinomio, los polinomios son continuos en todos los reales
✓ Condición 2: f es diferenciable en (a,b)
  Verificación: f'(x) = 2x existe para todo x en (a,b)
```

---

## ¿Por qué CERC funciona?

### Problema tradicional:
Los estudiantes de AP Calculus son proceduralmente fluidos pero fallan en justificación porque:
1. **Saltan a calcular** sin verificar condiciones
2. **Confían en la intuición empírica** ("se ve continuo")
3. **No conectan** evidencia con razonamiento formal

### Solución CERC:
- **Estructura forzada**: No puedes omitir pasos
- **Verificación explícita**: Las condiciones son un campo separado
- **Conexión visible**: El reasoning hace explícita la lógica

---

## Taxonomía Harel & Sowder

CERC mueve a los estudiantes a través de 3 etapas:

### 1. Empirical (Empírico)
- **Característica**: "Lo probé con números y funciona"
- **Error común**: Generalizar desde casos específicos
- **Ejemplo**: "f(1)=2 y f(3)=0, entonces debe cruzar el eje x"
- **Problema**: ¿Y si f no es continua?

### 2. Generic (Genérico)
- **Característica**: "Funciona para un caso representativo"
- **Error común**: No verificar que el caso ES representativo
- **Ejemplo**: "Lo demostré para x=2, entonces funciona para todos"
- **Problema**: ¿Qué hace especial a x=2?

### 3. Formal (Formal Deductivo)
- **Característica**: "Se cumplen TODAS las condiciones del teorema"
- **Éxito**: Verificación completa de hipótesis
- **Ejemplo**: "f continua en [a,b] Y diferenciable en (a,b), entonces MVT aplica"

**Meta del curso:** Mover TODOS los estudiantes a etapa Formal en 4 semanas.

---

## Error-Forcing Problems

Problemas diseñados para **colapsar** si no verificas condiciones.

### Ejemplo Clásico - MVT:
```
Aplica el Teorema del Valor Medio a f(x) = 1/x² en [-1, 1]
```

**La trampa:**
- Si NO verificas continuidad: Intentarás resolver algebraicamente y obtendrás confusión
- Si SÍ verificas continuidad: Descubres que f no es continua en x=0 ∈ [-1,1]
- **Conclusión correcta:** MVT NO aplica

**Por qué funciona:**
Los estudiantes empíricos/genéricos saltarán directo a:
```
f'(c) = [f(1) - f(-1)] / (1 - (-1))
-2/c³ = 0
No tiene solución... ¿por qué?
```

**Estudiante formal** verifica PRIMERO:
```
CERC - Conditions:
- ¿f continua en [-1,1]?
- lim(x→0) f(x) = ∞
- f no continua en x=0
- ❌ Hipótesis violada → MVT NO aplica
```

---

## Scaffolding por Semana

### Week 1: Full CERC Frames
```
Claim: [Completa esta frase] "Por el MVT, existe c en (a,b) tal que..."
Evidence: Lista todos los valores necesarios:
  - f(a) = _____
  - f(b) = _____
  - Intervalo: [____, ____]
Reasoning: "El Teorema del Valor Medio establece que..."
Conditions:
  ☐ Verificar continuidad en [a,b]
  ☐ Verificar diferenciabilidad en (a,b)
```

### Week 2: Structural Outline
```
Claim: _____________________
Evidence: _____________________
Reasoning: _____________________
Conditions: _____________________
```

### Week 3: Blank Canvas
```
[Espacio en blanco - escribe tu justificación completa]
```

### Week 4: Timed AP Conditions
```
FRQ real de AP Exam
Tiempo: 25 minutos
Sin notas
```

---

## Diferencia con Rubrics de College Board

### College Board Rubric (típico):
- Setup: 1 punto
- Execution: 2 puntos
- Justification: 3 puntos

**Problema:** "Justification" es vago. ¿Qué incluir?

### CERC hace explícito "Justification":
- **R (Reasoning)** = Nombrar el teorema correcto
- **C (Conditions)** = Verificar TODAS las hipótesis

**Resultado:** Los estudiantes saben EXACTAMENTE qué escribir para los 3 puntos de justification.

---

## Retroalimentación Socrática con Claude

### NO evaluativa (mal):
❌ "Esto está mal. Olvidaste verificar continuidad."

### SÍ Socrática (bien):
Nivel 1 - Location hint:
"Revisa tu sección de Conditions. ¿Has verificado TODAS las hipótesis del MVT?"

Nivel 2 - Which element:
"El MVT requiere dos condiciones. Verificaste diferenciabilidad correctamente. ¿Qué otra condición necesita el MVT?"

Nivel 3 - Explicit correction (solo después de 2 intentos fallidos):
"El MVT requiere que f sea continua en [a,b]. Necesitas verificar que lim(x→c) f(x) = f(c) para todo c en [a,b]."

**Por qué funciona:**
- Nivel 1: Metacognición - "¿dónde está mi error?"
- Nivel 2: Diagnóstico - "¿cuál componente CERC falta?"
- Nivel 3: Corrección directa solo como último recurso

---

## Implementación en la Plataforma

### Split-Screen Layout
```
┌─────────────────┬─────────────────┐
│                 │                 │
│   PROBLEMA      │   CERC FORM     │
│   (LEFT)        │   (RIGHT)       │
│                 │                 │
│  - LaTeX        │  - 4 fields     │
│  - KaTeX        │  - Tooltips     │
│    rendered     │  - Live hints   │
│  - Tooltips     │  - Submit       │
│    on theorems  │                 │
│                 │                 │
└─────────────────┴─────────────────┘
```

### Interaction Flow:
1. Student reads problem (LEFT)
2. Clicks "Start CERC Response"
3. CERC form appears (RIGHT)
4. Student fills each field
5. Real-time KaTeX preview
6. Tooltips on theorem names
7. Submit → Claude evaluates
8. Socratic feedback appears inline
9. Revision loop (max 3 attempts)
10. Success → XP + badges

---

## Progresión XP/Badges

### XP Milestones:
- +50 XP: Identifica correctly a broken condition
- +100 XP: Complete CERC with no hints (Week 1-2)
- +150 XP: Unassisted formal proof (Week 3+)

### Badges:
- 🔍 "The Skeptic": Survive error-forcing problem
- 🏛️ "The Architect": Flawless CERC proof unassisted
- ⚔️ "Boss Slayer": Complete Week 4 Boss Battle

**Crucialmente:** NO leaderboards. NO speed bonuses. Solo reasoning quality.

---

## Common Student Mistakes (to Force)

### 1. Condition Bypass
Student writes: "By MVT, there exists c such that f'(c) = ..."
**Missing:** Verification that f is continuous AND differentiable

### 2. Local-Only Argument
Student writes: "f(2) is defined, so f is continuous at x=2"
**Missing:** Need to check lim(x→2) f(x) = f(2)

### 3. CER Breakdown (no Conditions)
Student writes: "By IVT, there exists c in (a,b) such that f(c)=k because f(a) < k < f(b)"
**Missing:** Verification that f is continuous on [a,b]

---

**Use este documento como fuente en NotebookLM para generar:**
- Guías de estudio para estudiantes
- Scripts de video explicativos
- Preguntas de práctica
- Rúbricas de evaluación
