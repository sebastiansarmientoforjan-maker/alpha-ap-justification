# Prompts Directos para NotebookLM - AP Justification

Copia y pega estos prompts en NotebookLM después de subir los 3 documentos fuente anteriores.

---

## PROMPT 1: Generar Guía de Estudio para Estudiantes

```
Usando el framework CERC y los ejemplos proporcionados, genera una guía de estudio de 2 páginas para estudiantes de AP Calculus que están comenzando Week 1.

La guía debe incluir:
1. Explicación simple de qué es CERC (lenguaje de estudiante de 11th grade)
2. Por qué CERC es importante para AP exams
3. Los 4 componentes con ejemplos visuales
4. Checklist paso a paso para escribir una respuesta CERC
5. Errores comunes a evitar (con ejemplos)
6. Tip sheet: "Antes de presionar Submit, verifica que..."

Formato: PDF-ready markdown con headings claros y bullet points.
Tono: Motivador pero directo. Usa analogías relacionables.
```

---

## PROMPT 2: Generar 10 Problemas Error-Forcing para Week 1

```
Basándote en los ejemplos de problemas error-forcing proporcionados, genera 10 nuevos problemas para AP Calculus AB Week 1 que:

1. Cubran estos teoremas:
   - Mean Value Theorem (3 problemas)
   - Intermediate Value Theorem (3 problemas)
   - Extreme Value Theorem (2 problemas)
   - Continuity definition (2 problemas)

2. Cada problema debe:
   - Tener una "trampa" específica (condición violada)
   - Colapsar si el estudiante no verifica condiciones
   - Incluir el CERC skeleton correcto (para grading)
   - Tener sentence frames para Week 1

3. Variar dificultad:
   - 4 problemas: Basic (obviamente discontinuo)
   - 4 problemas: Intermediate (trampa sutil)
   - 2 problemas: Advanced (múltiples condiciones)

Output format: JSON array con estructura:
{
  "id": "prob-w1-mvt-001",
  "statement": "LaTeX formatted problem",
  "errorCategory": "CONDITION_BYPASS",
  "trapDescription": "What collapses if conditions not checked",
  "difficulty": "intermediate",
  "cercSkeleton": {...},
  "sentenceFrame": "..."
}
```

---

## PROMPT 3: Generar Script de Video Explicativo (5 min)

```
Crea un script para video YouTube de 5 minutos explicando CERC framework a estudiantes de AP Calculus.

Estructura del video:
[00:00-00:30] Hook: "Por qué pierdes puntos en AP FRQs (y cómo arreglarlo)"
[00:30-01:30] Problema común: Mostrar ejemplo de respuesta que pierde puntos
[01:30-03:30] Solución CERC: Explicar los 4 componentes con animaciones visuales
[03:30-04:30] Ejemplo completo: MVT problem resuelto con CERC
[04:30-05:00] Call to action: "Try CERC in your next practice FRQ"

Para cada sección, incluye:
- Texto del narrador
- Sugerencias de B-roll/animaciones
- Transiciones
- On-screen text overlays

Tono: Énfasis en "esto es lo que los graders de AP buscan" - muy práctico.
```

---

## PROMPT 4: Generar Rúbrica de Evaluación para Profesores

```
Usando el framework CERC y los ejemplos de respuestas correctas/incorrectas, genera una rúbrica detallada que un profesor puede usar para evaluar respuestas CERC estudiantiles.

La rúbrica debe:
1. Tener 4 secciones (una por cada componente CERC)
2. Para cada sección, definir:
   - Nivel 4 (Excepcional): Qué incluye
   - Nivel 3 (Competente): Qué incluye
   - Nivel 2 (Emergente): Qué le falta
   - Nivel 1 (Incipiente): Errores críticos
3. Incluir ejemplos específicos de cada nivel
4. Proveer "look-fors" (qué buscar específicamente)
5. Common mistakes para cada sección

Formato: Tabla con columnas claras, ready to print.
Incluye al final: "Conversion to AP-style scoring (9-point scale)"
```

---

## PROMPT 5: Generar Preguntas de Práctica Socrática

```
Genera 30 preguntas Socrática que Claude AI puede hacer a estudiantes cuando cometen errores en respuestas CERC.

Categorizar por:
1. Error Category (10 preguntas cada una):
   - CONDITION_BYPASS
   - LOCAL_ONLY_ARGUMENT
   - CER_BREAKDOWN

2. Por Hint Level:
   - Level 1: Location hints (general)
   - Level 2: Element-specific hints (más específico)
   - Level 3: Direct corrections (último recurso)

Cada pregunta debe:
- Ser genuinamente Socrática (hacer pensar, no dar respuesta)
- Guiar hacia el razonamiento correcto
- Ser específica al tipo de error
- Escalar en especificidad según hint level

Output format: JSON array con:
{
  "question": "...",
  "errorCategory": "...",
  "hintLevel": 1,
  "targetedThinking": "What cognitive process this triggers",
  "followUpIfStillWrong": "..."
}
```

---

## PROMPT 6: Generar Comparación CERC vs Traditional Approach

```
Crea una infografía (described in markdown/text) comparando side-by-side:

LEFT: Traditional student response (sin CERC)
RIGHT: CERC-structured response (mismo problema)

Usar el MVT error-forcing problem como ejemplo.

Para cada lado mostrar:
1. La respuesta del estudiante
2. Qué funciona / qué falta
3. Score probable en AP exam
4. Por qué el grader lo califica así

Incluir callouts visuales:
- ✓ Good practices
- ✗ Missing elements
- ⚠️ Partial credit areas

Terminar con: "The CERC difference: +2-3 points on average"

Target audience: Parents y administrators (explicar el value prop)
```

---

## PROMPT 7: Generar Training Dataset para Claude AI

```
Usando los ejemplos CERC proporcionados, genera un training dataset de 50 pares (student response → evaluation feedback) que podemos usar para fine-tuning Claude.

Para cada par incluir:
1. Problem statement
2. Student CERC response (variando quality)
3. Correct CERC skeleton
4. Ideal evaluation feedback (Socratic, 3 levels)
5. Score breakdown (por sección)
6. XP awarded
7. Reasoning stage assessment

Variar:
- Quality of responses (20 excellent, 20 medium, 10 poor)
- Error types (distribuido entre las 3 categorías)
- Theorem types (MVT, IVT, EVT, continuity, etc.)
- Week progression (más scaffolding en Week 1, menos en Week 3)

Output: JSONL format (one JSON object per line)
```

---

## PROMPT 8: Generar Exit Ticket Questions para Week 1

```
Crea 5 exit ticket questions que se pueden hacer después de Week 1 Session 1 para:
1. Gauge student understanding de CERC
2. Identificar misconceptions persistentes
3. Ajustar Week 2 content basado en respuestas
4. Recoger feedback sobre la experiencia

Cada exit ticket debe:
- Tomar máximo 2-3 minutos responder
- Tener formato mixto: 2-3 multiple choice + 1-2 short answer
- Preguntar específicamente sobre:
  - Qué fue más difícil de CERC
  - Qué theorem hypotheses olvidan más
  - Confidence level en cada componente
  - Feedback sobre el Socratic hints

Incluir:
- Las preguntas exactas
- Purpose de cada pregunta (qué insight genera)
- Cómo interpretar las respuestas
- Signals to adjust instruction
```

---

## PROMPT 9: Generar Parent Communication Template

```
Crea un email template que Sebastian puede enviar a padres explicando:
1. Qué es este programa (AP Justification Training)
2. Por qué su hijo/hija está participando
3. Qué es CERC y por qué es diferente
4. Qué resultados esperar
5. Cómo los padres pueden apoyar en casa
6. Timeline del programa (4 semanas)

Incluir:
- Subject line options (3 variantes)
- Opening que explique the problem (skill gap)
- Explanation de CERC sin ser muy técnico
- Ejemplo visual simple
- Expected outcomes con data (si disponible)
- Call to action: "How you can help"
- Link a recursos para padres

Tono: Professional pero accesible. Énfasis en: "this directly improves AP exam scores"
```

---

## PROMPT 10: Generar Onboarding Checklist para Nuevos Estudiantes

```
Crea una checklist interactiva para el primer login del estudiante:

Week 1 - Day 1 Onboarding:
☐ Watch intro video (2 min)
☐ Read CERC framework guide
☐ Complete diagnostic problem (sin CERC)
☐ Review same problem WITH CERC structure
☐ "Aha moment" reflection
☐ Set personal goal for Week 1
☐ Start Session 1

Para cada item incluir:
- Tiempo estimado
- Por qué es importante
- Qué aprenderán
- Link/asset needed

Plus: Success criteria
"You're ready to start when you can:"
- Name all 4 CERC components
- Explain why Conditions is most important
- Identify 1 theorem you've used before

Output: Interactive checklist format (markdown with checkboxes)
```

---

## CÓMO USAR ESTOS PROMPTS EN NOTEBOOKLM:

### Paso 1: Subir Sources
En NotebookLM, crea un nuevo notebook y sube:
1. `NOTEBOOKLM-SOURCE-1-CERC-FRAMEWORK.md`
2. `NOTEBOOKLM-SOURCE-2-EJEMPLOS-COMPLETOS.md`
3. `NOTEBOOKLM-SOURCE-3-IMPLEMENTACION-TECNICA.md`

### Paso 2: Ejecutar Prompts
Copia cualquiera de los prompts de arriba y pégalos en el chat de NotebookLM.

### Paso 3: Iterar
Si el output no es perfecto:
- Pide "Hazlo más [específico/simple/técnico]"
- "Agrega ejemplos de [tema específico]"
- "Expande la sección de [X]"

### Paso 4: Exportar
NotebookLM te permite:
- Copiar como markdown
- Exportar como document
- Generar study guide automáticamente
- Crear audio overview (podcast-style)

---

## BONUS: Prompt para Generar MÁS Prompts

```
Basándote en los 10 prompts anteriores y los 3 source documents, genera 10 prompts ADICIONALES que serían útiles para:
1. Crear material educativo complementario
2. Entrenar a profesores en CERC
3. Generar analytics/dashboards
4. Automatizar grading
5. Personalizar learning paths

Para cada nuevo prompt, especifica:
- Objetivo
- Input esperado (qué sources usar)
- Output deseado (formato y contenido)
- Use case (quién lo usaría y cuándo)
```

---

**TIPS GENERALES:**

1. **Combina sources**: "Usando SOURCE-1 para framework y SOURCE-2 para ejemplos..."
2. **Especifica formato**: "Output as JSON" / "as markdown" / "as presentation slides"
3. **Pide variaciones**: "Dame 3 versiones: simple, medium, advanced"
4. **Itera**: Pide refinements basados en el primer output
5. **Exporta**: Guarda los outputs como nuevos sources para builds más complejos
