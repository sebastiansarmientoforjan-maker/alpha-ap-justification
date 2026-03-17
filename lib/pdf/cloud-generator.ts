/**
 * Cloud PDF Generator using Railway PDF Compiler
 * Secure, FERPA-compliant PDF compilation
 */

interface FRQPDFData {
  frqId: string;
  studentName: string;
  course: "AP Calculus AB" | "AP Calculus BC" | "AP Statistics";
  quizScore: number;
  weakTopics: string[];
  frqType: "specific" | "general";

  // Problem
  problemStatement: string; // LaTeX formatted

  // Solution
  solution: {
    cercResponse: {
      claim: string;
      evidence: string;
      reasoning: string;
      conditions: string;
    };
    rubric: {
      totalPoints: number;
      breakdown: Array<{
        criterion: string;
        points: number;
        maxPoints: number;
        justification: string;
      }>;
    };
    unitNotes: string[];
  };

  // Pedagogical justification
  problemSelection: {
    rationale: string;
    mathAcademyConnection: string;
    apExamAlignment: string;
    skillsTargeted: string[];
  };

  // Week 1 problems
  week1Problems: Array<{
    title: string;
    statement: string;
    trap: string;
  }>;
}

/**
 * Generate PDF using cloud compiler (Railway)
 */
export async function generateFRQPDFCloud(data: FRQPDFData): Promise<Buffer> {
  console.log(`📄 Generating PDF for FRQ: ${data.frqId}`);

  // 1. Generate LaTeX content
  const latexContent = generateLatexContent(data);

  // 2. Call Railway PDF compiler
  const pdfCompilerURL = process.env.PDF_COMPILER_URL;
  const apiKey = process.env.PDF_COMPILER_API_KEY;

  if (!pdfCompilerURL || !apiKey) {
    throw new Error('PDF_COMPILER_URL or PDF_COMPILER_API_KEY not configured');
  }

  console.log(`☁️ Compiling PDF via ${pdfCompilerURL}`);

  const response = await fetch(`${pdfCompilerURL}/compile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({ latexContent })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    console.error('❌ PDF compilation failed:', error);
    throw new Error(`PDF compilation failed: ${error.message || 'Unknown error'}`);
  }

  // 3. Get PDF buffer
  const pdfBuffer = await response.arrayBuffer();
  console.log(`✅ PDF compiled successfully (${pdfBuffer.byteLength} bytes)`);

  return Buffer.from(pdfBuffer);
}

/**
 * Generate LaTeX content from FRQ data
 */
function generateLatexContent(data: FRQPDFData): string {
  const {
    frqId,
    studentName,
    course,
    quizScore,
    weakTopics,
    frqType,
    problemStatement,
    solution,
    problemSelection,
    week1Problems,
  } = data;

  // Escape special LaTeX characters
  const escape = (str: string) => str
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[&%$#_{}]/g, '\\$&')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');

  // But don't escape in math mode content (already has $ delimiters)
  const cleanMath = (str: string) => str; // Keep math as-is

  return `\\documentclass[11pt,letterpaper]{article}

% Packages
\\usepackage[margin=1in]{geometry}
\\usepackage{amsmath,amssymb,amsthm}
\\usepackage{xcolor}
\\usepackage{fancyhdr}
\\usepackage{tcolorbox}
\\usepackage{enumitem}
\\usepackage{tikz}

% Colors (Alpha branding)
\\definecolor{alphablue}{RGB}{44,79,94}
\\definecolor{alphacyan}{RGB}{0,217,255}

% Header/Footer
\\pagestyle{fancy}
\\fancyhf{}
\\lhead{\\textcolor{alphablue}{\\textbf{Alpha High School}}}
\\rhead{\\textcolor{gray}{FRQ: ${frqId}}}
\\cfoot{\\thepage}

\\begin{document}

% Alpha Logo
\\begin{center}
  \\begin{tikzpicture}
    \\node[draw=alphablue, circle, minimum size=1.5cm, line width=2pt] at (0,0) {\\Large\\textbf{\\textcolor{alphablue}{$\\alpha$}}};
  \\end{tikzpicture}
\\end{center}

% Title
\\begin{tcolorbox}[colback=alphablue!5!white, colframe=alphablue, width=\\textwidth, arc=3mm]
  \\begin{center}
    \\Large\\textbf{\\textcolor{alphablue}{${course}}} \\\\
    \\large Free-Response Question (FRQ) \\\\
    \\normalsize Personalized for ${escape(studentName)}
  \\end{center}
\\end{tcolorbox}

\\vspace{0.5cm}

% ============================================================================
% SECTION 1: PROBLEM STATEMENT
% ============================================================================

\\section*{\\textcolor{alphablue}{Problem Statement}}

\\begin{tcolorbox}[colback=white, colframe=alphablue!70, title=\\textbf{FRQ Problem}, arc=2mm]
  ${cleanMath(problemStatement)}
\\end{tcolorbox}

\\vspace{0.5cm}

% ============================================================================
% SECTION 2: MODEL SOLUTION
% ============================================================================

\\section*{\\textcolor{alphablue}{Model Solution with CERC Framework}}

\\subsection*{\\textcolor{alphacyan}{Claim}}
\\begin{tcolorbox}[colback=alphacyan!5!white, colframe=alphacyan!50, arc=2mm]
  ${cleanMath(solution.cercResponse.claim)}
\\end{tcolorbox}

\\subsection*{\\textcolor{alphacyan}{Evidence}}
\\begin{tcolorbox}[colback=alphacyan!5!white, colframe=alphacyan!50, arc=2mm]
  ${cleanMath(solution.cercResponse.evidence)}
\\end{tcolorbox}

\\subsection*{\\textcolor{alphacyan}{Reasoning}}
\\begin{tcolorbox}[colback=alphacyan!5!white, colframe=alphacyan!50, arc=2mm]
  ${cleanMath(solution.cercResponse.reasoning)}
\\end{tcolorbox}

\\subsection*{\\textcolor{alphacyan}{Conditions}}
\\begin{tcolorbox}[colback=alphacyan!5!white, colframe=alphacyan!50, arc=2mm]
  ${cleanMath(solution.cercResponse.conditions)}
\\end{tcolorbox}

\\vspace{0.5cm}

% ============================================================================
% SECTION 3: COLLEGE BOARD RUBRIC
% ============================================================================

\\section*{\\textcolor{alphablue}{College Board Rubric Application}}

\\begin{tcolorbox}[colback=green!5!white, colframe=green!70, title=\\textbf{Total Score: ${solution.rubric.totalPoints} / ${solution.rubric.breakdown.reduce((sum, item) => sum + item.maxPoints, 0)} points}, arc=2mm]
  \\begin{enumerate}[leftmargin=*]
    ${solution.rubric.breakdown.map(item => `
    \\item \\textbf{${escape(item.criterion)}} (${item.points}/${item.maxPoints} pts)

    ${escape(item.justification)}
    `).join('\n')}
  \\end{enumerate}
\\end{tcolorbox}

\\vspace{0.5cm}

% ============================================================================
% SECTION 4: UNIT NOTES
% ============================================================================

\\section*{\\textcolor{alphablue}{Associated Unit Notes}}

\\begin{itemize}[leftmargin=*]
  ${solution.unitNotes.map(note => `\\item ${escape(note)}`).join('\n  ')}
\\end{itemize}

\\newpage

% ============================================================================
% SECTION 5: PEDAGOGICAL JUSTIFICATION
% ============================================================================

\\section*{\\textcolor{alphablue}{Problem Selection Rationale}}

\\subsection*{Why This Problem?}
${escape(problemSelection.rationale)}

\\subsection*{Connection to MathAcademy Performance}
\\begin{tcolorbox}[colback=yellow!5!white, colframe=orange!70, title=\\textbf{Quiz Performance: ${quizScore}\\%}, arc=2mm]
  \\textbf{FRQ Type:} ${frqType === "specific" ? "SPECIFIC (targeting weak topics)" : "GENERAL (mixed topics)"} \\\\
  ${weakTopics.length > 0 ? `\\textbf{Weak Topics:} ${weakTopics.join(", ")}` : "\\textbf{Strong performance} - general review FRQ"} \\\\[0.3cm]

  ${escape(problemSelection.mathAcademyConnection)}
\\end{tcolorbox}

\\subsection*{AP Exam Alignment}
${escape(problemSelection.apExamAlignment)}

\\subsection*{Skills Targeted}
\\begin{itemize}[leftmargin=*]
  ${problemSelection.skillsTargeted.map(skill => `\\item ${escape(skill)}`).join('\n  ')}
\\end{itemize}

\\vspace{0.5cm}

% ============================================================================
% SECTION 6: WEEK 1 TRAINING PROBLEMS
% ============================================================================

\\section*{\\textcolor{alphablue}{Week 1 Training Problems}}

\\textit{These problems prepare the student for the FRQ through error-forcing pedagogy.}

\\vspace{0.3cm}

${week1Problems.map((problem, idx) => `
\\subsection*{Problem ${idx + 1}: ${escape(problem.title)}}

\\begin{tcolorbox}[colback=blue!5!white, colframe=blue!50, arc=2mm]
  ${cleanMath(problem.statement)}
\\end{tcolorbox}

\\textbf{The Trap:} ${escape(problem.trap)}

\\vspace{0.5cm}
`).join('\n')}

% ============================================================================
% FOOTER
% ============================================================================

\\vfill

\\begin{center}
  \\small
  \\textcolor{gray}{Generated by Alpha AP Justification Training System} \\\\
  \\textcolor{gray}{${new Date().toLocaleDateString()}} \\\\
  \\textcolor{gray}{FRQ ID: ${frqId}}
\\end{center}

\\end{document}
`;
}

/**
 * Test PDF compilation
 */
export async function testPDFCompilation(): Promise<Buffer> {
  const testLatex = `\\documentclass{article}
\\begin{document}
\\section*{Test Document}
This is a test PDF from Alpha AP Justification System.

Math test: $f(x) = x^2 + 3x - 5$

If you can read this, the PDF compiler is working correctly!
\\end{document}`;

  const response = await fetch(`${process.env.PDF_COMPILER_URL}/compile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.PDF_COMPILER_API_KEY}`
    },
    body: JSON.stringify({ latexContent: testLatex })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`Test compilation failed: ${error.message || error.error || response.statusText}`);
  }

  const pdfBuffer = await response.arrayBuffer();
  return Buffer.from(pdfBuffer);
}
