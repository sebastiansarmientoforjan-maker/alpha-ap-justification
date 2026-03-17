/**
 * FRQ PDF Generator with LaTeX
 * Generates professional PDFs with Alpha branding
 */

import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

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
    unitNotes: string[]; // Associated unit notes
  };

  // Pedagogical justification
  problemSelection: {
    rationale: string; // Why this problem?
    mathAcademyConnection: string; // How it connects to quiz performance
    apExamAlignment: string; // How it maps to real AP exam
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
 * Generate FRQ PDF with LaTeX
 */
export async function generateFRQPDF(data: FRQPDFData): Promise<string> {
  const tempDir = path.join(process.cwd(), "temp", "pdfs");
  await fs.mkdir(tempDir, { recursive: true });

  const texFile = path.join(tempDir, `${data.frqId}.tex`);
  const pdfFile = path.join(tempDir, `${data.frqId}.pdf`);

  // Generate LaTeX content
  const latexContent = generateLatexContent(data);

  // Write .tex file
  await fs.writeFile(texFile, latexContent, "utf-8");

  // Compile with pdflatex
  try {
    // Run pdflatex twice (for references)
    await execAsync(`pdflatex -output-directory="${tempDir}" "${texFile}"`, {
      cwd: tempDir,
    });
    await execAsync(`pdflatex -output-directory="${tempDir}" "${texFile}"`, {
      cwd: tempDir,
    });

    // Check if PDF was created
    await fs.access(pdfFile);

    return pdfFile;
  } catch (error) {
    console.error("Error compiling LaTeX:", error);
    throw new Error("Failed to compile PDF");
  }
}

/**
 * Generate LaTeX content
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

  return `\\documentclass[11pt,letterpaper]{article}

% Packages
\\usepackage[margin=1in]{geometry}
\\usepackage{amsmath,amssymb,amsthm}
\\usepackage{graphicx}
\\usepackage{xcolor}
\\usepackage{fancyhdr}
\\usepackage{tcolorbox}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{tikz}

% Colors (Alpha branding)
\\definecolor{alphablue}{RGB}{44,79,94}
\\definecolor{alphacyan}{RGB}{0,217,255}
\\definecolor{alphadark}{RGB}{15,23,42}

% Header/Footer
\\pagestyle{fancy}
\\fancyhf{}
\\lhead{\\textcolor{alphablue}{\\textbf{Alpha High School}}}
\\rhead{\\textcolor{gray}{FRQ: ${frqId}}}
\\cfoot{\\thepage}

% Title styling
\\title{\\vspace{-2cm}
  \\begin{tcolorbox}[colback=alphablue!5!white, colframe=alphablue, width=\\textwidth, arc=3mm]
    \\begin{center}
      \\Large\\textbf{\\textcolor{alphablue}{${course}}} \\\\
      \\large Free-Response Question (FRQ) \\\\
      \\normalsize Personalized for ${studentName}
    \\end{center}
  \\end{tcolorbox}
  \\vspace{-0.5cm}
}
\\date{}

\\begin{document}

% Alpha Logo (placeholder - add actual logo)
\\begin{center}
  \\begin{tikzpicture}
    \\node[draw=alphablue, circle, minimum size=1.5cm, line width=2pt] at (0,0) {\\Large\\textbf{\\textcolor{alphablue}{α}}};
  \\end{tikzpicture}
\\end{center}

\\maketitle

% ============================================================================
% SECTION 1: PROBLEM STATEMENT
% ============================================================================

\\section*{\\textcolor{alphablue}{Problem Statement}}

\\begin{tcolorbox}[colback=white, colframe=alphablue!70, title=\\textbf{FRQ Problem}, arc=2mm]
  ${problemStatement}
\\end{tcolorbox}

\\vspace{0.5cm}

% ============================================================================
% SECTION 2: MODEL SOLUTION
% ============================================================================

\\section*{\\textcolor{alphablue}{Model Solution with CERC Framework}}

\\subsection*{\\textcolor{alphacyan}{Claim}}
\\begin{tcolorbox}[colback=alphacyan!5!white, colframe=alphacyan!50, arc=2mm]
  ${solution.cercResponse.claim}
\\end{tcolorbox}

\\subsection*{\\textcolor{alphacyan}{Evidence}}
\\begin{tcolorbox}[colback=alphacyan!5!white, colframe=alphacyan!50, arc=2mm]
  ${solution.cercResponse.evidence}
\\end{tcolorbox}

\\subsection*{\\textcolor{alphacyan}{Reasoning}}
\\begin{tcolorbox}[colback=alphacyan!5!white, colframe=alphacyan!50, arc=2mm]
  ${solution.cercResponse.reasoning}
\\end{tcolorbox}

\\subsection*{\\textcolor{alphacyan}{Conditions}}
\\begin{tcolorbox}[colback=alphacyan!5!white, colframe=alphacyan!50, arc=2mm]
  ${solution.cercResponse.conditions}
\\end{tcolorbox}

\\vspace{0.5cm}

% ============================================================================
% SECTION 3: COLLEGE BOARD RUBRIC
% ============================================================================

\\section*{\\textcolor{alphablue}{College Board Rubric Application}}

\\begin{tcolorbox}[colback=green!5!white, colframe=green!70, title=\\textbf{Total Score: ${solution.rubric.totalPoints} / ${solution.rubric.breakdown.reduce((sum, item) => sum + item.maxPoints, 0)} points}, arc=2mm]
  \\begin{enumerate}[leftmargin=*]
    ${solution.rubric.breakdown.map(item => `
    \\item \\textbf{${item.criterion}} (${item.points}/${item.maxPoints} pts)

    ${item.justification}
    `).join('\n')}
  \\end{enumerate}
\\end{tcolorbox}

\\vspace{0.5cm}

% ============================================================================
% SECTION 4: UNIT NOTES
% ============================================================================

\\section*{\\textcolor{alphablue}{Associated Unit Notes}}

\\begin{itemize}[leftmargin=*]
  ${solution.unitNotes.map(note => `\\item ${note}`).join('\n  ')}
\\end{itemize}

\\vspace{0.5cm}

% ============================================================================
% SECTION 5: PEDAGOGICAL JUSTIFICATION
% ============================================================================

\\newpage

\\section*{\\textcolor{alphablue}{Problem Selection Rationale}}

\\subsection*{Why This Problem?}
${problemSelection.rationale}

\\subsection*{Connection to MathAcademy Performance}
\\begin{tcolorbox}[colback=yellow!5!white, colframe=orange!70, title=\\textbf{Quiz Performance: ${quizScore}\\%}, arc=2mm]
  \\textbf{FRQ Type:} ${frqType === "specific" ? "SPECIFIC (targeting weak topics)" : "GENERAL (mixed topics)"} \\\\
  ${weakTopics.length > 0 ? `\\textbf{Weak Topics Identified:} ${weakTopics.join(", ")}` : "\\textbf{Strong performance} - general review FRQ"} \\\\[0.3cm]

  ${problemSelection.mathAcademyConnection}
\\end{tcolorbox}

\\subsection*{AP Exam Alignment}
${problemSelection.apExamAlignment}

\\subsection*{Skills Targeted}
\\begin{itemize}[leftmargin=*]
  ${problemSelection.skillsTargeted.map(skill => `\\item ${skill}`).join('\n  ')}
\\end{itemize}

\\vspace{0.5cm}

% ============================================================================
% SECTION 6: WEEK 1 TRAINING PROBLEMS
% ============================================================================

\\section*{\\textcolor{alphablue}{Week 1 Training Problems}}

\\textit{These problems prepare the student for the FRQ through error-forcing pedagogy.}

\\vspace{0.3cm}

${week1Problems.map((problem, idx) => `
\\subsection*{Problem ${idx + 1}: ${problem.title}}

\\begin{tcolorbox}[colback=blue!5!white, colframe=blue!50, arc=2mm]
  ${problem.statement}
\\end{tcolorbox}

\\textbf{The Trap:} ${problem.trap}

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
 * Clean up temporary files
 */
export async function cleanupPDFFiles(frqId: string) {
  const tempDir = path.join(process.cwd(), "temp", "pdfs");
  const extensions = [".tex", ".pdf", ".aux", ".log", ".out"];

  for (const ext of extensions) {
    try {
      await fs.unlink(path.join(tempDir, `${frqId}${ext}`));
    } catch (error) {
      // Ignore if file doesn't exist
    }
  }
}
