# 📄 PDF Generation Setup

## Requisitos

Para generar PDFs con LaTeX, necesitas instalar pdflatex en tu sistema.

---

## Instalación de LaTeX

### Windows

**Opción 1: MiKTeX (Recomendado - más ligero)**

1. Descarga MiKTeX: https://miktex.org/download
2. Ejecuta el instalador
3. Durante instalación, selecciona "Install missing packages on-the-fly: Yes"
4. Verifica instalación:
   ```bash
   pdflatex --version
   ```

**Opción 2: TeX Live (Completo pero pesado - 4GB)**

1. Descarga: https://tug.org/texlive/windows.html
2. Ejecuta `install-tl-windows.exe`
3. Espera instalación completa (~1 hora)
4. Verifica:
   ```bash
   pdflatex --version
   ```

### macOS

```bash
# Opción 1: MacTeX (recomendado)
brew install --cask mactex

# Opción 2: BasicTeX (más ligero)
brew install --cask basictex
sudo tlmgr update --self
sudo tlmgr install collection-fontsrecommended

# Verifica
pdflatex --version
```

### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install texlive-latex-base texlive-latex-extra texlive-fonts-recommended

# Verifica
pdflatex --version
```

---

## Dependencias de Node.js

Instala las dependencias necesarias:

```bash
npm install form-data node-fetch
```

---

## Estructura de Carpetas

El sistema creará automáticamente:

```
alpha-ap-justification/
├── temp/
│   └── pdfs/
│       ├── frq-abc123.tex       # Archivo LaTeX fuente
│       ├── frq-abc123.pdf       # PDF generado
│       ├── frq-abc123.aux       # Archivos auxiliares
│       └── frq-abc123.log       # Logs de compilación
```

**Nota:** Los archivos temporales se limpian automáticamente después de enviar el PDF.

---

## Probar Generación de PDF

### Test Manual

1. **Crea un archivo de prueba:**

`test-pdf.ts`:
```typescript
import { generateFRQPDF } from "./lib/pdf/frq-generator";

const testData = {
  frqId: "test-001",
  studentName: "Test Student",
  course: "AP Calculus BC",
  quizScore: 75,
  weakTopics: ["derivatives", "MVT"],
  frqType: "specific" as const,
  problemStatement: `Consider the function $f(x) = x^3 - 3x$ on the interval $[-2, 2]$.

(a) Find all values of $x$ where $f'(x) = 0$.

(b) Use the Mean Value Theorem to show that there exists a value $c$ in $(-2, 2)$ such that
$$f'(c) = \\frac{f(2) - f(-2)}{2 - (-2)}$$

(c) Verify all conditions of the MVT before applying it.`,
  solution: {
    cercResponse: {
      claim: "By the Mean Value Theorem, there exists at least one value $c \\in (-2, 2)$ where $f'(c) = 0$.",
      evidence: "Computing the average rate of change: $\\frac{f(2) - f(-2)}{4} = \\frac{(2^3 - 6) - ((-2)^3 + 6)}{4} = \\frac{2 - (-2)}{4} = 0$. Finding where $f'(x) = 3x^2 - 3 = 0$ gives $x = \\pm 1$.",
      reasoning: "The Mean Value Theorem states that if $f$ is continuous on $[a,b]$ and differentiable on $(a,b)$, then there exists $c \\in (a,b)$ such that $f'(c) = \\frac{f(b) - f(a)}{b - a}$.",
      conditions: "Checking conditions: (1) $f(x) = x^3 - 3x$ is a polynomial, so it is continuous on $[-2,2]$ ✓ (2) $f'(x) = 3x^2 - 3$ exists for all $x$, so $f$ is differentiable on $(-2,2)$ ✓. Both conditions are satisfied, so MVT applies."
    },
    rubric: {
      totalPoints: 8,
      breakdown: [
        {
          criterion: "Computes average rate of change correctly",
          points: 1,
          maxPoints: 1,
          justification: "Student correctly computes (f(2) - f(-2))/4 = 0"
        },
        {
          criterion: "Finds derivative f'(x)",
          points: 1,
          maxPoints: 1,
          justification: "Student correctly finds f'(x) = 3x² - 3"
        },
        {
          criterion: "Solves f'(x) = 0",
          points: 1,
          maxPoints: 1,
          justification: "Student finds x = ±1 correctly"
        },
        {
          criterion: "States MVT correctly",
          points: 2,
          maxPoints: 2,
          justification: "Student states both hypotheses and conclusion of MVT"
        },
        {
          criterion: "Verifies continuity condition",
          points: 1,
          maxPoints: 1,
          justification: "Student explicitly verifies f is continuous on [-2,2]"
        },
        {
          criterion: "Verifies differentiability condition",
          points: 1,
          maxPoints: 1,
          justification: "Student explicitly verifies f is differentiable on (-2,2)"
        },
        {
          criterion: "Concludes MVT applies",
          points: 1,
          maxPoints: 1,
          justification: "Student concludes that since conditions are met, MVT guarantees existence of c"
        }
      ]
    },
    unitNotes: [
      "Unit 5: Analytical Applications of Differentiation (AP Calculus AB/BC)",
      "Topic 5.2: Mean Value Theorem",
      "Common misconception: Students often forget to verify continuity and differentiability before applying MVT",
      "AP Exam frequency: MVT appears in 40% of AB/BC exams, usually worth 6-9 points"
    ]
  },
  problemSelection: {
    rationale: "This problem targets the student's weak performance (75%) in derivatives and MVT. It requires explicit verification of theorem conditions, which is the core skill gap identified.",
    mathAcademyConnection: "The student struggled with derivative rules and theorem application in MathAcademy Unit 12 (score: 72%). This FRQ directly addresses both weaknesses: computing derivatives AND verifying conditions before applying theorems.",
    apExamAlignment: "This problem mirrors 2019 AP Calculus BC FRQ #4 (MVT application) and 2021 AB FRQ #5 (condition verification). The structure matches College Board's emphasis on justification - worth 30% of total FRQ points.",
    skillsTargeted: [
      "Computing derivatives of polynomial functions",
      "Verifying continuity on closed intervals",
      "Verifying differentiability on open intervals",
      "Applying Mean Value Theorem with full justification",
      "Constructing complete CERC arguments"
    ]
  },
  week1Problems: [
    {
      title: "MVT: The Discontinuity Trap",
      statement: "Consider $f(x) = \\frac{1}{x^2}$ on $[-1, 1]$. Can you apply MVT?",
      trap: "Function is discontinuous at x=0, which is inside the interval. Students who skip continuity check will incorrectly attempt to apply MVT."
    },
    {
      title: "MVT: The Sharp Corner",
      statement: "Consider $f(x) = |x|$ on $[-2, 2]$. Apply MVT if possible.",
      trap: "Function is continuous but NOT differentiable at x=0. Students must verify BOTH conditions."
    },
    {
      title: "MVT: Complete Verification",
      statement: "For $f(x) = x^3 - 3x$, verify MVT applies on [-1, 1] before finding c.",
      trap: "This one DOES satisfy conditions - students must build confidence in systematic verification."
    }
  ]
};

async function testPDF() {
  try {
    const pdfPath = await generateFRQPDF(testData);
    console.log(`✅ PDF generated successfully: ${pdfPath}`);
    console.log("📄 Check the file to verify formatting");
  } catch (error) {
    console.error("❌ PDF generation failed:", error);
  }
}

testPDF();
```

2. **Ejecuta el test:**
```bash
npx ts-node test-pdf.ts
```

3. **Verifica el PDF:**
   - Busca en `temp/pdfs/test-001.pdf`
   - Debería mostrar el problema con formato LaTeX hermoso

---

## Troubleshooting

### Error: "pdflatex: command not found"

**Solución:** LaTeX no está instalado o no está en el PATH.

```bash
# Windows: Reinicia la terminal después de instalar MiKTeX
# macOS: Agrega a PATH
export PATH="/Library/TeX/texbin:$PATH"

# Linux: Verifica instalación
which pdflatex
```

### Error: "Package X not found"

**Solución (MiKTeX):** Configura instalación automática

1. Abre MiKTeX Console
2. Settings → General
3. "Install missing packages on-the-fly: Yes"

**Solución (TeX Live/MacTeX):**
```bash
sudo tlmgr install <package-name>

# Paquetes comunes:
sudo tlmgr install tcolorbox
sudo tlmgr install enumitem
sudo tlmgr install tikz
```

### Error: "Permission denied" al escribir PDF

**Solución:** Crea la carpeta manualmente

```bash
mkdir -p temp/pdfs
chmod 755 temp/pdfs
```

### PDF se genera pero no se envía a Telegram

**Solución:** Verifica dependencias de Node

```bash
npm install form-data node-fetch

# Si usas Node 18+, usa native fetch:
# No necesitas node-fetch, solo form-data
```

---

## Flujo Completo de Prueba

```bash
# 1. Verifica LaTeX instalado
pdflatex --version

# 2. Instala dependencias Node
npm install form-data node-fetch

# 3. Reinicia servidor
npm run dev

# 4. Genera FRQ de prueba
curl -X POST http://localhost:3000/api/admin/generate-frq \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "test-123",
    "studentName": "Test Student",
    "quizScore": 75,
    "weakTopics": ["derivatives", "MVT"],
    "course": "calculus-bc"
  }'

# 5. Espera 15-30 segundos (Claude genera + PDF compila)

# 6. Revisa Telegram - deberías recibir PDF adjunto
```

---

## Ejemplo de PDF Generado

El PDF incluirá:

### Página 1: Problema
- Logo de Alpha
- Header con nombre del curso
- Problema en formato LaTeX profesional

### Página 2: Solución
- CERC completo con colores
- Boxes para cada sección

### Página 3: Rúbrica
- Desglose de puntos College Board
- Justificación de cada criterio

### Página 4: Justificación Pedagógica
- Por qué este problema
- Conexión con MathAcademy
- Alineación con AP exam

### Página 5: Week 1 Problems
- 3 problemas con trampas
- Preparación para el FRQ

---

## Personalización del Logo

Para agregar el logo real de Alpha:

1. **Coloca el logo en:**
   ```
   public/assets/alpha-logo.png
   ```

2. **Actualiza el LaTeX en `lib/pdf/frq-generator.ts`:**
   ```latex
   % Reemplaza el TikZ circle con:
   \\includegraphics[width=3cm]{../../public/assets/alpha-logo.png}
   ```

3. **O mantén el logo generado con TikZ** (letra α en círculo)

---

## Checklist de Setup

- [ ] Instalar pdflatex (MiKTeX/MacTeX/TeX Live)
- [ ] Verificar comando: `pdflatex --version`
- [ ] Instalar dependencias: `npm install form-data node-fetch`
- [ ] Crear carpeta: `mkdir -p temp/pdfs`
- [ ] Configurar Telegram (si no lo has hecho)
- [ ] Probar generación con test manual
- [ ] Probar endpoint completo
- [ ] Verificar PDF en Telegram
- [ ] (Opcional) Agregar logo real de Alpha

---

**Una vez instalado, el sistema generará PDFs automáticamente cada vez que se genere un FRQ!** 📄✨
