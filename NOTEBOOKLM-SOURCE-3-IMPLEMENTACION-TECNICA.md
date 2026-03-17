# Implementación Técnica Week 1 CERC - Fuente para NotebookLM

## Arquitectura del Sistema

### Component Hierarchy
```
/app/student/week/1/session/page.tsx (Session Container)
  ├── Split-Screen Layout
  │   ├── LEFT: Problem Display
  │   │   ├── Problem Statement (KaTeX rendered)
  │   │   ├── Theorem Tooltips (hover definitions)
  │   │   └── Visual Hints (optional, Week 1 only)
  │   │
  │   └── RIGHT: CERC Response Form
  │       ├── Claim Field (textarea + KaTeX preview)
  │       ├── Evidence Field (textarea + KaTeX preview)
  │       ├── Reasoning Field (textarea + KaTeX preview)
  │       ├── Conditions Field (textarea + KaTeX preview)
  │       ├── Submit Button (Shimmer effect)
  │       └── Feedback Display (inline, Socratic)
  │
  └── Progress Tracking
      ├── XP Counter (Number Ticker animation)
      ├── Reasoning Stage Indicator (Orbiting Circles)
      └── Attempt Counter
```

---

## Data Model (TypeScript)

### Core Types

```typescript
// Week 1 Problem
interface Week1Problem {
  id: string;
  weekNumber: 1;
  statement: string; // LaTeX formatted
  errorCategory: "CONDITION_BYPASS" | "LOCAL_ONLY_ARGUMENT" | "CER_BREAKDOWN";

  // Admin only (never exposed to student)
  trapDescription: string;
  cercSkeleton: {
    claim: string;
    evidence: string;
    reasoning: string;
    conditions: string;
  };

  // Week 1 specific: sentence frames for scaffolding
  sentenceFrame?: string;

  // Tooltips for theorem definitions
  theoremTooltips?: {
    [theoremName: string]: {
      definition: string;
      hypotheses: string[];
      conclusion: string;
    };
  };

  createdAt: Date;
}

// CERC Response
interface CERCResponse {
  id: string;
  problemId: string;
  studentId: string;

  // The 4 CERC fields
  claim: string;
  evidence: string;
  reasoning: string;
  conditions: string;

  // Submission metadata
  attemptNumber: number; // 1, 2, or 3
  timestamp: Date;
  timeSpent: number; // milliseconds

  // AI evaluation
  evaluation?: {
    overallScore: number; // 0-100
    breakdown: {
      claim: { score: number; feedback: string };
      evidence: { score: number; feedback: string };
      reasoning: { score: number; feedback: string };
      conditions: { score: number; feedback: string };
    };
    hintLevel: 1 | 2 | 3;
    socraticQuestion?: string;
    approved: boolean; // true if can move to next problem
  };

  // Progression
  xpEarned: number;
  badgesUnlocked: string[];
  reasoningStageProgression?: "empirical" | "generic" | "formal";
}

// Claude AI Evaluation Request
interface ClaudeEvaluationRequest {
  problemStatement: string;
  cercSkeleton: {
    claim: string;
    evidence: string;
    reasoning: string;
    conditions: string;
  };
  studentResponse: {
    claim: string;
    evidence: string;
    reasoning: string;
    conditions: string;
  };
  attemptNumber: number;
  studentReasoningStage: "empirical" | "generic" | "formal";
  errorCategory: string;
}

// Claude AI Evaluation Response
interface ClaudeEvaluationResponse {
  overallScore: number;
  breakdown: {
    claim: { score: number; feedback: string; missingElements?: string[] };
    evidence: { score: number; feedback: string; missingElements?: string[] };
    reasoning: { score: number; feedback: string; missingElements?: string[] };
    conditions: { score: number; feedback: string; missingElements?: string[] };
  };
  hintLevel: 1 | 2 | 3;
  socraticQuestion: string;
  approved: boolean;
  xpAwarded: number;
  reasoningStageUpdate?: "empirical" | "generic" | "formal";
}
```

---

## UI Components

### 1. Split-Screen Layout Component

```typescript
// /components/student/split-screen-session.tsx
export function SplitScreenSession({
  problem,
  weekNumber,
  onSubmit,
  onExit
}: SplitScreenSessionProps) {
  const [cercResponse, setCERCResponse] = useState<Partial<CERCResponse>>({});
  const [feedback, setFeedback] = useState<ClaudeEvaluationResponse | null>(null);
  const [attemptNumber, setAttemptNumber] = useState(1);

  return (
    <div className="h-screen flex">
      {/* LEFT: Problem */}
      <div className="w-1/2 p-8 bg-gradient-to-br from-primary-900 to-primary-800">
        <ProblemDisplay problem={problem} weekNumber={weekNumber} />
      </div>

      {/* RIGHT: CERC Form */}
      <div className="w-1/2 p-8 bg-white overflow-y-auto">
        <CERCForm
          response={cercResponse}
          onChange={setCERCResponse}
          onSubmit={handleSubmit}
          feedback={feedback}
          attemptNumber={attemptNumber}
          maxAttempts={3}
        />
      </div>
    </div>
  );
}
```

### 2. Problem Display Component

```typescript
// /components/student/problem-display.tsx
export function ProblemDisplay({ problem, weekNumber }: ProblemDisplayProps) {
  return (
    <div className="relative">
      {/* Spotlight Effect */}
      <Spotlight className="absolute top-0 left-0" fill="#00D9FF" />

      {/* Problem Header */}
      <div className="mb-8">
        <Badge>Week {weekNumber}</Badge>
        <h2 className="text-3xl font-bold text-white mt-4">
          Problem {problem.id}
        </h2>
      </div>

      {/* Problem Statement with KaTeX */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
        <KaTeXRenderer content={problem.statement} />
      </div>

      {/* Theorem Tooltips */}
      {problem.theoremTooltips && (
        <TheoremTooltips tooltips={problem.theoremTooltips} />
      )}

      {/* Sentence Frame (Week 1 only) */}
      {weekNumber === 1 && problem.sentenceFrame && (
        <div className="mt-6 p-4 bg-accent-500/20 rounded-lg border border-accent-500/50">
          <p className="text-sm text-accent-200">Sentence Frame:</p>
          <p className="text-white mt-2">{problem.sentenceFrame}</p>
        </div>
      )}
    </div>
  );
}
```

### 3. CERC Form Component

```typescript
// /components/student/cerc-form.tsx
export function CERCForm({
  response,
  onChange,
  onSubmit,
  feedback,
  attemptNumber,
  maxAttempts
}: CERCFormProps) {
  const fields: Array<keyof CERCResponse> = ['claim', 'evidence', 'reasoning', 'conditions'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-2xl font-bold text-primary-900">Your CERC Response</h3>

      {fields.map((field) => (
        <CERCField
          key={field}
          label={field.charAt(0).toUpperCase() + field.slice(1)}
          value={response[field] || ''}
          onChange={(value) => onChange({ ...response, [field]: value })}
          feedback={feedback?.breakdown[field]}
          placeholder={getPlaceholder(field, attemptNumber)}
        />
      ))}

      {/* Animated Beam connecting fields */}
      <AnimatedBeam from="claim" to="evidence" />
      <AnimatedBeam from="evidence" to="reasoning" />
      <AnimatedBeam from="reasoning" to="conditions" />

      {/* Submit Button */}
      <ShimmerButton
        type="submit"
        disabled={!isComplete(response) || attemptNumber > maxAttempts}
      >
        Submit Response (Attempt {attemptNumber}/{maxAttempts})
      </ShimmerButton>

      {/* Feedback Display */}
      {feedback && (
        <FeedbackDisplay feedback={feedback} attemptNumber={attemptNumber} />
      )}
    </form>
  );
}
```

### 4. CERC Field Component

```typescript
// /components/student/cerc-field.tsx
export function CERCField({
  label,
  value,
  onChange,
  feedback,
  placeholder
}: CERCFieldProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="space-y-2">
      <label className="flex items-center justify-between">
        <span className="font-semibold text-primary-900">{label}</span>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="text-sm text-primary-600 hover:text-primary-800"
        >
          {showPreview ? 'Hide' : 'Show'} Preview
        </button>
      </label>

      {/* Input Area */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-4 border-2 border-primary-200 rounded-lg focus:border-accent-500 transition-colors min-h-[120px]"
      />

      {/* KaTeX Preview */}
      {showPreview && value && (
        <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
          <p className="text-xs text-primary-600 mb-2">Preview:</p>
          <KaTeXRenderer content={value} />
        </div>
      )}

      {/* Inline Feedback (Socratic) */}
      {feedback && (
        <BlurFade>
          <div className={`p-4 rounded-lg border-2 ${
            feedback.score >= 80
              ? 'bg-green-50 border-green-500'
              : 'bg-amber-50 border-amber-500'
          }`}>
            <p className="text-sm font-medium mb-2">
              {feedback.score >= 80 ? '✓ Great!' : '🤔 Think about this:'}
            </p>
            <p className="text-sm">{feedback.feedback}</p>
            {feedback.missingElements && feedback.missingElements.length > 0 && (
              <ul className="mt-2 text-sm list-disc list-inside">
                {feedback.missingElements.map((element, idx) => (
                  <li key={idx}>{element}</li>
                ))}
              </ul>
            )}
          </div>
        </BlurFade>
      )}
    </div>
  );
}
```

---

## Claude API Integration

### Evaluation Endpoint

```typescript
// /app/api/cerc/evaluate/route.ts
export async function POST(req: Request) {
  const body: ClaudeEvaluationRequest = await req.json();

  const evaluationPrompt = buildEvaluationPrompt(body);

  const claudeResponse = await claudeClient.createMessage({
    model: "claude-sonnet-4-5",
    max_tokens: 4096,
    temperature: 0.3, // Lower for more consistent evaluation
    system: CERC_EVALUATION_SYSTEM_PROMPT,
    messages: [{
      role: "user",
      content: evaluationPrompt
    }]
  });

  const evaluation = parseEvaluation(claudeResponse);

  // Store evaluation in database
  await dataService.storeCERCEvaluation(body.studentId, evaluation);

  // Update XP and badges
  if (evaluation.xpAwarded > 0) {
    await dataService.updateStudentXP(body.studentId, evaluation.xpAwarded);
  }

  return NextResponse.json(evaluation);
}
```

### Evaluation System Prompt

```typescript
const CERC_EVALUATION_SYSTEM_PROMPT = `You are an AP Calculus/Statistics justification evaluator using the CERC framework.

Your role: Provide Socratic feedback that guides students to discover their own errors, NOT to tell them the answer.

CERC Framework:
- C (Claim): The conclusion to be proven
- E (Evidence): Mathematical data supporting the claim
- R (Reasoning): The theorem/principle connecting evidence to claim
- C (Conditions): EXPLICIT verification that ALL theorem hypotheses are satisfied

Feedback Levels:
1. Level 1 (Attempt 1): Location hint - "Check your [section]"
2. Level 2 (Attempt 2): Element hint - "You verified X, but what about Y?"
3. Level 3 (Attempt 3): Direct correction - "You need to verify that..."

Scoring:
- Each CERC section: 0-100
- Overall: average of 4 sections
- Approved if overall >= 80 AND conditions >= 70

Error Categories to Flag:
- CONDITION_BYPASS: Student didn't verify theorem hypotheses
- LOCAL_ONLY_ARGUMENT: Student checked one condition, missed others
- CER_BREAKDOWN: Student stated theorem but didn't connect evidence

Output JSON format:
{
  "overallScore": number,
  "breakdown": {
    "claim": { "score": number, "feedback": string, "missingElements": string[] },
    "evidence": { "score": number, "feedback": string, "missingElements": string[] },
    "reasoning": { "score": number, "feedback": string, "missingElements": string[] },
    "conditions": { "score": number, "feedback": string, "missingElements": string[] }
  },
  "hintLevel": 1 | 2 | 3,
  "socraticQuestion": string,
  "approved": boolean,
  "xpAwarded": number,
  "reasoningStageUpdate": "empirical" | "generic" | "formal"
}`;
```

---

## XP and Badge System

### XP Calculation Logic

```typescript
// /lib/gamification/xp-calculator.ts
export function calculateXP(evaluation: ClaudeEvaluationResponse, context: {
  attemptNumber: number;
  weekNumber: number;
  problemDifficulty: number;
}): number {
  let baseXP = 0;

  // Base XP by overall score
  if (evaluation.overallScore >= 90) baseXP = 150;
  else if (evaluation.overallScore >= 80) baseXP = 100;
  else if (evaluation.overallScore >= 70) baseXP = 50;
  else baseXP = 25; // Participation XP

  // Multipliers
  const attemptMultiplier = context.attemptNumber === 1 ? 1.5 : 1.0;
  const weekMultiplier = context.weekNumber >= 3 ? 1.2 : 1.0; // Harder weeks
  const difficultyMultiplier = context.problemDifficulty;

  // Bonus XP
  let bonusXP = 0;
  if (evaluation.breakdown.conditions.score >= 90) {
    bonusXP += 50; // Correctly identified broken condition
  }
  if (evaluation.reasoningStageUpdate === "formal") {
    bonusXP += 100; // Progressed to formal reasoning
  }

  return Math.round(
    (baseXP * attemptMultiplier * weekMultiplier * difficultyMultiplier) + bonusXP
  );
}
```

### Badge Unlock Logic

```typescript
// /lib/gamification/badge-manager.ts
export async function checkBadgeUnlocks(
  studentId: string,
  evaluation: ClaudeEvaluationResponse,
  context: SessionContext
): Promise<string[]> {
  const unlockedBadges: string[] = [];

  // 🔍 "The Skeptic" - Survive error-forcing problem
  if (context.problem.errorCategory === "CONDITION_BYPASS" &&
      evaluation.breakdown.conditions.score >= 90) {
    unlockedBadges.push("the-skeptic");
  }

  // 🏛️ "The Architect" - Flawless CERC proof unassisted
  if (evaluation.overallScore === 100 &&
      context.attemptNumber === 1 &&
      context.weekNumber >= 3) {
    unlockedBadges.push("the-architect");
  }

  // 🎯 "Condition Master" - 5 perfect condition verifications
  const conditionHistory = await dataService.getConditionScores(studentId);
  const perfectConditions = conditionHistory.filter(s => s >= 90).length;
  if (perfectConditions >= 5) {
    unlockedBadges.push("condition-master");
  }

  // Store badges
  for (const badge of unlockedBadges) {
    await dataService.unlockBadge(studentId, badge);
  }

  return unlockedBadges;
}
```

---

## Animation Integration

### Badge Unlock Animation

```typescript
// /components/animations/badge-unlock.tsx
import gsap from "gsap";

export function BadgeUnlockAnimation({ badge, onComplete }: BadgeUnlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const tl = gsap.timeline({ onComplete });

    tl.from(ref.current, {
      scale: 0,
      rotation: -180,
      duration: 0.6,
      ease: "back.out(1.7)"
    })
    .to(ref.current, {
      scale: 1.1,
      duration: 0.2,
      yoyo: true,
      repeat: 1
    })
    .to(ref.current, {
      y: -20,
      opacity: 0,
      duration: 1,
      delay: 2,
      ease: "power2.in"
    });

    return () => {tl.kill()};
  }, [onComplete]);

  return (
    <div ref={ref} className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-gradient-to-br from-accent-500 to-secondary-500 rounded-full p-12 shadow-2xl">
        <span className="text-6xl">{badge.emoji}</span>
      </div>
      <div className="absolute bottom-1/3 text-center">
        <h3 className="text-3xl font-bold text-white mb-2">Badge Unlocked!</h3>
        <p className="text-xl text-accent-200">{badge.name}</p>
      </div>
    </div>
  );
}
```

---

**Use este documento en NotebookLM para:**
- Generar código de componentes similares
- Diseñar la arquitectura de datos
- Crear scripts de testing
- Implementar features similares en otros módulos
