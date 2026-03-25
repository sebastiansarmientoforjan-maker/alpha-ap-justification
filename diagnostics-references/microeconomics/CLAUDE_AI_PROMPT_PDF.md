# PROMPT PARA CLAUDE AI - GENERAR PDF ESTILO AP EXAM

**Usar en:** claude.ai (web interface)

---

## ARCHIVOS A SUBIR

1. **`DIAGNOSTIC_ASSESSMENT.md`** - Examen del estudiante (SIN respuestas)
2. **`DIAGNOSTIC_RUBRIC_V2.md`** - Answer key del profesor (CON respuestas)
3. **Uno de los PDFs oficiales de `released-frqs/`** (como referencia de formato)

---

## PROMPT PARA CLAUDE AI

```
You are an AP Microeconomics exam designer. I need you to convert this diagnostic assessment into a professional PDF that matches the official College Board AP Microeconomics exam format.

ATTACHED FILES:
1. DIAGNOSTIC_ASSESSMENT.md - The student exam (10 MCQ + 1 graph-based short response)
2. DIAGNOSTIC_RUBRIC_V2.md - The scoring guide (for reference only, DO NOT include in student PDF)
3. [AP Official FRQ PDF] - Use this as a visual reference for formatting

YOUR TASK:
Generate complete LaTeX code for TWO separate documents:

---

DOCUMENT 1: STUDENT EXAM (NO ANSWERS)
File name: AP-Microeconomics-Diagnostic-STUDENT.tex

REQUIRED FORMAT (match official AP exams):

**HEADER:**
```
AP® MICROECONOMICS
DIAGNOSTIC ASSESSMENT

Time—25 minutes
Number of questions—11

Percent of total score—100%
```

**SECTION I: MULTIPLE CHOICE**
- Title: "SECTION I: Multiple Choice"
- Subtitle: "Time—12 minutes | Number of questions—10"
- Instructions box (bordered):
  ```
  Directions: Each of the questions or incomplete statements below is followed
  by four suggested answers or completions. Select the one that is best in each
  case and mark your answer sheet accordingly.
  ```
- Questions numbered 1-10
- Four answer choices per question (A, B, C, D)
- Use \textbf{} for emphasis where needed
- Math expressions in LaTeX (e.g., $P = MC$)

**SECTION II: FREE-RESPONSE**
- Title: "SECTION II: Free-Response"
- Subtitle: "Time—13 minutes | Number of questions—1"
- Instructions box (bordered):
  ```
  Directions: Read the scenario carefully and answer all parts of the question.
  Show your work and clearly label all graphs, calculations, and explanations.
  Use economic terminology where appropriate.
  ```
- Graph rendered in TikZ or as clear ASCII art
- Parts labeled (a), (b), (c) in bold
- Include lined space indicators: "[10 lines for response]"

**FOOTER:**
```
END OF EXAM

© 2026 Alpha School. AP is a trademark of the College Board.
This assessment is for educational use only.
```

**FORMATTING REQUIREMENTS:**
- Document class: article, 11pt
- Margins: 1 inch all sides
- Font: Times New Roman or similar serif
- Line spacing: 1.15
- Section headers: bold, 14pt
- Question numbers: bold
- Answer choices: indented, lettered (A) through (D)
- Page numbers: bottom center
- NO colors (black and white only)
- Professional spacing (not cramped)

---

DOCUMENT 2: ANSWER KEY (WITH SOLUTIONS)
File name: AP-Microeconomics-Diagnostic-ANSWERKEY.tex

REQUIRED FORMAT:

**HEADER:**
```
AP® MICROECONOMICS
DIAGNOSTIC ASSESSMENT - ANSWER KEY

SCORING GUIDE

Total Points: 20
Section I: 10 points (1 point each)
Section II: 10 points (Part A: 3 pts, Part B: 4 pts, Part C: 3 pts)
```

**SECTION I ANSWERS:**
- Question-by-question answer key
- Format:
  ```
  Question 1: Answer C
  Explanation: [Brief explanation from rubric]
  CED Reference: Unit 2 (MKT-2.F)

  Question 2: Answer B
  ...
  ```

**SECTION II RUBRIC:**
- Part (a) - 3 points
  - Scoring criteria table from DIAGNOSTIC_RUBRIC_V2.md
  - Common errors list
- Part (b) - 4 points
  - Scoring criteria table
  - Sample correct answer with work shown
  - Common errors list
- Part (c) - 3 points
  - Scoring criteria table
  - Sample correct answer
  - Common errors list

**SCORING INTERPRETATION TABLE:**
Include the table from DIAGNOSTIC_RUBRIC_V2.md showing:
- Score ranges (18-20, 14-17, 10-13, 0-9)
- Performance levels
- Interpretation

---

SPECIAL INSTRUCTIONS:

1. **Graph Rendering:**
   - Convert the ASCII graph in DIAGNOSTIC_ASSESSMENT.md to TikZ or high-quality ASCII
   - Maintain all labels (D, MR, MC, ATC)
   - Keep coordinates (Q=40, P=$20, ATC=$15)
   - Make it clean and professional

2. **Math Formatting:**
   - Use proper LaTeX math mode: $P = MC$, $\pi = (P - ATC) \times Q$
   - Fractions: \frac{numerator}{denominator}
   - Greek letters where appropriate

3. **Tables:**
   - Use professional LaTeX tables (\begin{tabular})
   - Border all scoring rubric tables
   - Align columns properly

4. **Spacing:**
   - Add generous whitespace between questions
   - Use \vspace{} where needed
   - Ensure no cramped layouts

5. **Professional Polish:**
   - Check spelling and grammar
   - Consistent formatting throughout
   - Page breaks in logical places (don't split questions)

---

OUTPUT FORMAT:

Provide COMPLETE, COMPILABLE LaTeX code for both documents.

Start with:
```latex
% DOCUMENT 1: STUDENT EXAM
% File: AP-Microeconomics-Diagnostic-STUDENT.tex

\documentclass[11pt]{article}
\usepackage{...}

\begin{document}
...
\end{document}
```

Then:
```latex
% DOCUMENT 2: ANSWER KEY
% File: AP-Microeconomics-Diagnostic-ANSWERKEY.tex

\documentclass[11pt]{article}
\usepackage{...}

\begin{document}
...
\end{document}
```

After providing the LaTeX, give compilation instructions and any notes about required packages.
```

---

## CÓMO USAR

### Paso 1: Subir Archivos a Claude AI
1. Ve a https://claude.ai
2. Inicia nueva conversación
3. Arrastra estos archivos:
   - `DIAGNOSTIC_ASSESSMENT.md`
   - `DIAGNOSTIC_RUBRIC_V2.md`
   - `released-frqs/2023-set-1-frq-microeconomics.pdf` (como referencia visual)

### Paso 2: Pegar el Prompt
Copia todo el prompt de arriba (desde "You are an AP Microeconomics exam designer..." hasta el final)

### Paso 3: Revisar Output
Claude generará dos archivos LaTeX completos:
- `AP-Microeconomics-Diagnostic-STUDENT.tex`
- `AP-Microeconomics-Diagnostic-ANSWERKEY.tex`

### Paso 4: Compilar a PDF
Opción A - Overleaf (recomendado):
1. Ve a https://overleaf.com
2. New Project → Blank Project
3. Copia/pega el código LaTeX
4. Click "Recompile"
5. Download PDF

Opción B - Local (si tienes LaTeX instalado):
```bash
pdflatex AP-Microeconomics-Diagnostic-STUDENT.tex
pdflatex AP-Microeconomics-Diagnostic-ANSWERKEY.tex
```

---

## PAQUETES LATEX NECESARIOS

Claude incluirá estos en el preámbulo:
```latex
\usepackage[margin=1in]{geometry}
\usepackage{amsmath,amssymb}
\usepackage{enumitem}
\usepackage{fancyhdr}
\usepackage{tikz}
\usepackage{graphicx}
\usepackage{tabularx}
```

Si algún paquete falla en compilación, dile a Claude:
"Package X is missing, please use alternative or remove it"

---

## VERIFICACIÓN DE CALIDAD

Antes de usar los PDFs, verifica:

**✓ STUDENT EXAM:**
- [ ] NO tiene respuestas visibles
- [ ] Graph es legible y claro
- [ ] Instrucciones completas en cada sección
- [ ] Answer sheet incluida
- [ ] Formato profesional (no se ve "casero")

**✓ ANSWER KEY:**
- [ ] Todas las respuestas correctas incluidas
- [ ] Explicaciones claras para cada MCQ
- [ ] Rubric completa para Short Response (Parts A, B, C)
- [ ] Common errors documentados
- [ ] Scoring interpretation table incluida

**✓ AMBOS DOCUMENTOS:**
- [ ] Headers profesionales (AP® Microeconomics)
- [ ] Page numbers presentes
- [ ] Sin errores de LaTeX (símbolos raros, texto cortado)
- [ ] Math formulas renderizadas correctamente
- [ ] Espaciado generoso (no cramped)

---

## TROUBLESHOOTING

**Problema:** Graph no se ve bien en PDF
**Solución:** Dile a Claude "Convert the graph to a cleaner ASCII art format, avoid TikZ"

**Problema:** Math symbols se ven mal
**Solución:** Asegúrate que Claude use `$...$` para inline math y `$$...$$` para display math

**Problema:** PDF tiene demasiadas páginas
**Solución:** Dile a Claude "Reduce whitespace but keep readability, target 4-5 pages for student exam"

**Problema:** Formato no se parece a AP oficial
**Solución:** Dile a Claude "Follow the exact format from the attached official AP FRQ PDF more closely"

---

## ALTERNATIVA: Markdown a PDF Directo

Si LaTeX falla, usa Pandoc:

```bash
# Instalar Pandoc (si no lo tienes)
# Windows: choco install pandoc
# Mac: brew install pandoc

# Convertir directo
pandoc DIAGNOSTIC_ASSESSMENT.md -o student-exam.pdf --pdf-engine=xelatex

pandoc DIAGNOSTIC_RUBRIC_V2.md -o answer-key.pdf --pdf-engine=xelatex
```

Pero LaTeX da mejor control de formato para match AP style.

---

*Última actualización: 2026-03-24*
