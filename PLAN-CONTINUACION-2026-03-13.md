# Plan de Continuación - Alpha AP Justification Training
**Fecha de Creación:** 13 de Marzo, 2026
**Basado en:** Auditoría UX/UI y Seguridad completa

---

## RESUMEN EJECUTIVO

**Estado Actual:** 30% completo (3 de 12 steps)
**Bloqueador Principal:** Seguridad insuficiente para producción
**Tiempo Estimado a MVP:** 6-8 semanas (1 developer full-time)

**Prioridades:**
1. 🔴 **P0-CRÍTICO:** Seguridad (Firebase Auth, API protection)
2. 🟡 **P1-ALTO:** Features core (AI feedback, error-forcing problems)
3. 🟢 **P2-MEDIO:** Polish y gamificación

---

## FASE 1: SEGURIDAD Y PRODUCCIÓN (Semanas 1-3)

### Sprint 1: Firebase Authentication (Semana 1)

#### Día 1: Setup de Firebase
```bash
# 1. Crear proyecto en Firebase Console
# https://console.firebase.google.com

# 2. Enable Authentication
# Console → Authentication → Sign-in method
# Activar: Email/Password + Google

# 3. Instalar dependencias
npm install firebase-admin

# 4. Generar service account key
# Console → Project Settings → Service Accounts
# Descargar JSON key → Agregar a .env.local como:
# FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

**Archivos a modificar:**
- `lib/firebase/admin.ts` (crear)
- `.env.local` (agregar credentials)

**Código necesario:**
```typescript
// lib/firebase/admin.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const adminAuth = getAuth();
```

#### Día 2: Implementar Login con Firebase
**Archivo:** `app/login/page.tsx`

```typescript
// Reemplazar mock login con:
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();

    // Send token to server to set HTTP-only cookie
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    router.push('/student');
  } catch (error) {
    setError('Invalid credentials');
  }
};
```

**Nuevo archivo:** `app/api/auth/session/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  try {
    // Verify the token
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Create session cookie (5 days)
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // Set HTTP-only cookie
    (await cookies()).set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
```

#### Día 3: Actualizar Middleware
**Archivo:** `middleware.ts`

```typescript
import { adminAuth } from '@/lib/firebase/admin';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes
  if (PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Verify session cookie
  const session = request.cookies.get('session');
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(session.value, true);

    // Check role-based access
    if (PROTECTED_ROUTES.admin.test(pathname) && decodedClaims.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    const response = NextResponse.next();
    // Add security headers (keep existing)
    response.headers.set('X-Frame-Options', 'DENY');
    // ...
    return response;
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

#### Día 4: Actualizar lib/auth.ts
**Archivo:** `lib/auth.ts`

```typescript
import { adminAuth } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';

export async function getAuthUser(): Promise<AuthUser | null> {
  const session = (await cookies()).get('session');
  if (!session) return null;

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(session.value);
    return {
      id: decodedClaims.uid,
      role: decodedClaims.role as 'student' | 'admin',
    };
  } catch (error) {
    return null;
  }
}

// requireAuth y requireRole permanecen igual
```

#### Día 5: Crear usuarios en Firebase
```bash
# Opción 1: Firebase Console
# Console → Authentication → Users → Add user

# Opción 2: Script de seed
# Crear: scripts/seed-users.ts
```

```typescript
// scripts/seed-users.ts
import { adminAuth } from '../lib/firebase/admin';

const STUDENTS = [
  { email: 'ananya@alpha.edu', password: 'secure_password', name: 'Ananya Kakarlapudi' },
  { email: 'emily@alpha.edu', password: 'secure_password', name: 'Emily Smith' },
];

async function seedUsers() {
  for (const student of STUDENTS) {
    const user = await adminAuth.createUser({
      email: student.email,
      password: student.password,
      displayName: student.name,
    });

    // Set custom claims for role
    await adminAuth.setCustomUserClaims(user.uid, { role: 'student' });
    console.log(`Created: ${student.email}`);
  }
}

seedUsers();
```

**Ejecutar:**
```bash
npx tsx scripts/seed-users.ts
```

---

### Sprint 2: API Authentication (Semana 2)

#### Día 1: Crear API Auth Helper
**Archivo:** `lib/api-auth.ts` (nuevo)

```typescript
import { NextRequest } from 'next/server';
import { adminAuth } from './firebase/admin';

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export async function authenticateRequest(request: NextRequest) {
  const session = request.cookies.get('session');

  if (!session) {
    throw new UnauthorizedError('No session cookie');
  }

  try {
    const decodedToken = await adminAuth.verifySessionCookie(session.value, true);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role as 'student' | 'admin',
    };
  } catch (error) {
    throw new UnauthorizedError('Invalid session');
  }
}

export function requireAdmin(user: { role: string }) {
  if (user.role !== 'admin') {
    throw new UnauthorizedError('Admin access required');
  }
}
```

#### Día 2: Proteger API Routes de Student
**Archivos a modificar:**
- `app/api/cerc/submit/route.ts`
- `app/api/student/cerc/submit/route.ts`
- `app/api/student/frq/submit/route.ts`

**Ejemplo:**
```typescript
// app/api/cerc/submit/route.ts
import { authenticateRequest } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  try {
    // Authenticate first
    const user = await authenticateRequest(request);

    const body = await request.json();
    const { weekNumber, problemId, claim, evidence, reasoning, conditions } = body;

    // Use authenticated user.uid instead of trusting body.studentId
    const studentId = user.uid;

    // Rest of logic...
    const cercResponse: CERCResponse = {
      problemId,
      claim,
      evidence,
      reasoning,
      conditions,
      timestamp: new Date(),
    };

    const dataService = await getDataService();
    await dataService.saveCERCResponse(studentId, weekNumber, cercResponse);
    await dataService.addXP(studentId, weekNumber, 50);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

#### Día 3: Proteger API Routes de Admin
**Archivos a modificar:**
- `app/api/admin/frq/assign/route.ts`
- `app/api/admin/quiz/create/route.ts`
- `app/api/admin/generate-frq/route.ts`

**Ejemplo:**
```typescript
// app/api/admin/frq/assign/route.ts
import { authenticateRequest, requireAdmin } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    requireAdmin(user); // Throws if not admin

    const body = await request.json();
    const { quizId } = body;

    // Rest of logic...
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    // ...
  }
}
```

#### Día 4: Input Validation con Zod
```bash
npm install zod
```

**Archivo:** `lib/validation.ts` (nuevo)

```typescript
import { z } from 'zod';

export const CERCSubmissionSchema = z.object({
  weekNumber: z.number().int().min(1).max(4),
  problemId: z.string().min(1),
  claim: z.string().min(50, 'Claim must be at least 50 characters').max(2000),
  evidence: z.string().min(50, 'Evidence must be at least 50 characters').max(2000),
  reasoning: z.string().min(50, 'Reasoning must be at least 50 characters').max(2000),
  conditions: z.string().min(50, 'Conditions must be at least 50 characters').max(2000),
});

export const FRQAssignmentSchema = z.object({
  quizId: z.string().uuid(),
});

export const QuizCreationSchema = z.object({
  studentId: z.string(),
  topic: z.string().min(1),
  score: z.number().min(0).max(100),
  manuallyTriggered: z.boolean(),
});
```

**Uso en API routes:**
```typescript
import { CERCSubmissionSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  const user = await authenticateRequest(request);
  const body = await request.json();

  // Validate input
  const validated = CERCSubmissionSchema.parse(body);
  // If invalid, throws ZodError with detailed messages

  // Use validated data
  await dataService.saveCERCResponse(user.uid, validated.weekNumber, {
    problemId: validated.problemId,
    claim: validated.claim,
    // ...
  });
}
```

#### Día 5: Error Handling Global
**Archivo:** `lib/api-error-handler.ts` (nuevo)

```typescript
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { UnauthorizedError } from './api-auth';

export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof UnauthorizedError) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
      { status: 400 }
    );
  }

  // Generic error
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

**Uso:**
```typescript
export async function POST(request: NextRequest) {
  try {
    // ... logic
  } catch (error) {
    return handleApiError(error);
  }
}
```

---

### Sprint 3: Hardening & Deploy Prep (Semana 3)

#### Día 1: Rate Limiting
```bash
npm install @upstash/ratelimit @upstash/redis
```

**Setup Upstash:**
1. Crear cuenta en https://upstash.com
2. Crear Redis database
3. Copiar `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` a `.env.local`

**Archivo:** `lib/rate-limit.ts` (nuevo)

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const ratelimit = {
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '10 s'),
    analytics: true,
  }),
  login: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    analytics: true,
  }),
};
```

**Uso en API routes:**
```typescript
import { ratelimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Rate limit by IP
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const { success } = await ratelimit.api.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  // ... rest of logic
}
```

#### Día 2: Content Security Policy
**Archivo:** `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com",
              "frame-src 'none'",
            ].join('; '),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

#### Día 3: Firestore Security Rules
**Archivo:** `firestore.rules` (crear en root)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function
    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return isAuthenticated() && request.auth.token.role == 'admin';
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Users collection
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow write: if isAdmin();
    }

    // Progress collection
    match /progress/{userId}/weeks/{weekId} {
      allow read: if isOwner(userId) || isAdmin();
      allow write: if isOwner(userId);
    }

    // Problems collection
    match /problems/{problemId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // Feedback collection
    match /feedback/{feedbackId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }

    // Quizzes collection
    match /quizzes/{quizId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // FRQ Assignments
    match /frqAssignments/{assignmentId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // FRQ Submissions
    match /frqSubmissions/{submissionId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAdmin();
    }
  }
}
```

**Deploy rules:**
```bash
firebase deploy --only firestore:rules
```

#### Día 4: Logging y Monitoring
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**Configurar Sentry:**
- Crear proyecto en https://sentry.io
- Seguir wizard para setup
- Agregar `SENTRY_DSN` a `.env.local`

**Archivo:** `lib/logger.ts` (nuevo)

```typescript
import * as Sentry from '@sentry/nextjs';

export function logError(error: Error, context?: Record<string, any>) {
  console.error('Error:', error, context);
  Sentry.captureException(error, { extra: context });
}

export function logAdminAction(action: {
  adminId: string;
  action: string;
  targetUserId?: string;
  metadata?: Record<string, any>;
}) {
  console.log('Admin Action:', action);
  // Could also save to Firestore audit_logs collection
}
```

#### Día 5: Deploy a Vercel Staging
```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Link project
vercel link

# 4. Add environment variables
vercel env add FIREBASE_ADMIN_PROJECT_ID
vercel env add FIREBASE_ADMIN_PRIVATE_KEY
vercel env add FIREBASE_ADMIN_CLIENT_EMAIL
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# ... all other env vars

# 5. Deploy to preview
vercel

# 6. Test staging URL
# https://alpha-ap-justification-xyz.vercel.app
```

**Smoke tests:**
- [ ] Login works with real Firebase users
- [ ] CERC submission saves to Firestore
- [ ] Admin dashboard loads
- [ ] API authentication blocks unauthorized requests
- [ ] Rate limiting triggers after 10 requests

---

## FASE 2: FEATURES CORE (Semanas 4-6)

### Sprint 4: AI Socratic Feedback (Semana 4)

#### Step 1: Claude API Integration
**Archivo:** `services/ai/socratic-tutor.ts` (nuevo)

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateSocraticFeedback(params: {
  cercResponse: CERCResponse;
  problem: Problem;
  hintLevel: 1 | 2 | 3;
  previousDialogue?: Array<{ role: 'ai' | 'student'; content: string }>;
}): Promise<string> {
  const { cercResponse, problem, hintLevel, previousDialogue = [] } = params;

  const systemPrompt = `You are a Socratic tutor for AP Calculus/Statistics.
Your role is to guide students to discover errors in their mathematical reasoning.
Never give direct answers - ask guiding questions.

Hint levels:
- Level 1: Ask which CERC element might need more detail
- Level 2: Point to the specific theorem condition that may not be verified
- Level 3: Provide explicit correction (only after 2 failed attempts)

Current hint level: ${hintLevel}`;

  const userMessage = `Student's CERC response:

Claim: ${cercResponse.claim}
Evidence: ${cercResponse.evidence}
Reasoning: ${cercResponse.reasoning}
Conditions: ${cercResponse.conditions}

Problem: ${problem.statement}

Previous dialogue:
${previousDialogue.map(m => `${m.role}: ${m.content}`).join('\n')}

Provide a Socratic hint at level ${hintLevel}.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  return message.content[0].text;
}
```

#### Step 2: API Route para Feedback
**Archivo:** `app/api/cerc/evaluate/route.ts` (nuevo)

```typescript
import { authenticateRequest } from '@/lib/api-auth';
import { getDataService } from '@/services/data';
import { generateSocraticFeedback } from '@/services/ai/socratic-tutor';

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    const body = await request.json();
    const { problemId, weekNumber } = body;

    const dataService = await getDataService();

    // Get student's latest CERC response
    const progress = await dataService.getWeekProgress(user.uid, weekNumber);
    if (!progress) {
      return NextResponse.json({ error: 'No progress found' }, { status: 404 });
    }

    const latestResponse = progress.cercResponses[progress.cercResponses.length - 1];
    if (!latestResponse) {
      return NextResponse.json({ error: 'No CERC response found' }, { status: 404 });
    }

    // Get problem details
    const problem = await dataService.getProblem(problemId);
    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    // Get existing feedback dialogue
    const feedback = await dataService.getFeedback(user.uid, problemId);
    const hintLevel = feedback?.hintLevel || 1;
    const previousDialogue = feedback?.dialogue || [];

    // Generate Socratic feedback
    const aiFeedback = await generateSocraticFeedback({
      cercResponse: latestResponse,
      problem,
      hintLevel: Math.min(hintLevel, 3) as 1 | 2 | 3,
      previousDialogue,
    });

    // Save feedback to database
    await dataService.saveFeedbackMessage(user.uid, problemId, 'ai', aiFeedback);

    return NextResponse.json({
      success: true,
      feedback: aiFeedback,
      hintLevel,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
```

#### Step 3: UI Component para Feedback
**Archivo:** `components/student/ai-feedback-panel.tsx` (nuevo)

```tsx
'use client';

import { useState } from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';
import { BlurFade } from '@/components/ui/blur-fade';

interface AIFeedbackPanelProps {
  problemId: string;
  weekNumber: number;
}

export function AIFeedbackPanel({ problemId, weekNumber }: AIFeedbackPanelProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestFeedback = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cerc/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId, weekNumber }),
      });

      const data = await res.json();
      setFeedback(data.feedback);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 rounded-xl border border-accent-500/20 bg-accent-500/5 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-5 h-5 text-accent-400" />
        <h3 className="text-lg font-semibold text-white">AI Tutor</h3>
      </div>

      {!feedback ? (
        <button
          onClick={requestFeedback}
          disabled={loading}
          className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-accent-500 to-secondary-500 text-white font-medium hover:shadow-lg transition-all"
        >
          {loading ? 'Analyzing...' : 'Request Socratic Guidance'}
        </button>
      ) : (
        <BlurFade>
          <div className="flex gap-3">
            <MessageCircle className="w-5 h-5 text-accent-400 flex-shrink-0 mt-1" />
            <p className="text-sm text-primary-100 leading-relaxed">{feedback}</p>
          </div>
        </BlurFade>
      )}
    </div>
  );
}
```

#### Step 4: Integrar en CERC Form
**Archivo:** `components/student/cerc-form.tsx`

```typescript
// Agregar después del botón de submit:
import { AIFeedbackPanel } from './ai-feedback-panel';

// Dentro del return, después del submit button:
{isSaved && (
  <AIFeedbackPanel problemId={problem.id} weekNumber={weekNumber} />
)}
```

### Sprint 5: Error-Forcing Problems (Semana 5)

#### Crear banco de problemas
**Archivo:** `data/error-forcing-problems.json` (nuevo)

```json
{
  "calculus": [
    {
      "id": "calc-mvt-discontinuity",
      "statement": "Apply the Mean Value Theorem to f(x) = 1/x² on the interval [-1, 1] to find a value c where f'(c) = (f(1) - f(-1)) / 2.",
      "trap": "Function is discontinuous at x = 0, violating MVT hypothesis of continuity on [a,b]",
      "theorem": "Mean Value Theorem",
      "conditions": ["f continuous on [a,b]", "f differentiable on (a,b)"],
      "errorCategory": "CONDITION_BYPASS",
      "week": 1
    },
    {
      "id": "calc-ivt-not-continuous",
      "statement": "Use the Intermediate Value Theorem to prove that g(x) = |x| has a zero on [-2, 2].",
      "trap": "g(x) = |x| has a zero at x=0 but IVT is not needed since g(0)=0 directly. Students may try to apply IVT but g(-2)=2 and g(2)=2 (same sign).",
      "theorem": "Intermediate Value Theorem",
      "conditions": ["f continuous on [a,b]", "f(a) and f(b) have opposite signs"],
      "errorCategory": "MISAPPLICATION",
      "week": 1
    }
  ],
  "statistics": [
    {
      "id": "stats-ttest-paired",
      "statement": "Two samples: Before treatment [10, 12, 14] and After treatment [12, 14, 16] (same subjects). Apply 2-sample t-test to test if treatment increased scores.",
      "trap": "Data is paired (same subjects before/after), violates independence assumption. Should use paired t-test instead.",
      "theorem": "Two-sample t-test",
      "conditions": ["Independence", "Normality", "Equal variances"],
      "errorCategory": "CONDITION_BYPASS",
      "week": 1
    }
  ]
}
```

#### Motor de generación
**Archivo:** `services/content/problem-generator.ts` (nuevo)

```typescript
import problemsData from '@/data/error-forcing-problems.json';

export function getErrorForcingProblem(params: {
  course: 'calculus' | 'statistics';
  week: number;
  errorCategory?: string;
}) {
  const { course, week, errorCategory } = params;

  let problems = problemsData[course].filter(p => p.week === week);

  if (errorCategory) {
    problems = problems.filter(p => p.errorCategory === errorCategory);
  }

  // Random selection
  return problems[Math.floor(Math.random() * problems.length)];
}
```

### Sprint 6: Gamificación y Badges (Semana 6)

#### Badge Logic
**Archivo:** `services/gamification/badge-engine.ts` (nuevo)

```typescript
import { CERCResponse, Badge } from '@/lib/types';
import { getDataService } from '@/services/data';

export async function checkBadgeEarned(params: {
  userId: string;
  weekNumber: number;
  cercResponse: CERCResponse;
  problem: Problem;
}): Promise<Badge | null> {
  const { userId, weekNumber, cercResponse, problem } = params;

  // Badge: "The Skeptic" - identifies broken condition
  if (problem.errorCategory === 'CONDITION_BYPASS') {
    const mentionsCondition = cercResponse.conditions.toLowerCase().includes('not satisfied')
      || cercResponse.conditions.toLowerCase().includes('violated');

    if (mentionsCondition) {
      return {
        id: 'skeptic',
        name: 'The Skeptic',
        description: 'Identified a broken theorem condition',
        icon: '🔍',
        earnedAt: new Date(),
      };
    }
  }

  // Badge: "The Architect" - flawless CERC proof unassisted
  if (weekNumber >= 3) {
    const dataService = await getDataService();
    const feedback = await dataService.getFeedback(userId, problem.id);

    // No AI hints used
    if (!feedback || feedback.dialogue.length === 0) {
      const allFieldsComplete = Object.values(cercResponse).every(
        v => typeof v === 'string' && v.length > 100
      );

      if (allFieldsComplete) {
        return {
          id: 'architect',
          name: 'The Architect',
          description: 'Unassisted flawless CERC proof',
          icon: '🏛️',
          earnedAt: new Date(),
        };
      }
    }
  }

  return null;
}
```

#### Badge Animation
**Archivo:** `components/animations/badge-unlock.tsx`

```tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Badge } from '@/lib/types';

export function BadgeUnlockAnimation({ badge, onComplete }: {
  badge: Badge;
  onComplete: () => void;
}) {
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!badgeRef.current) return;

    const timeline = gsap.timeline({
      onComplete,
    });

    timeline
      .from(badgeRef.current, {
        scale: 0,
        rotation: -180,
        duration: 0.6,
        ease: 'back.out(1.7)',
      })
      .to(badgeRef.current, {
        scale: 1.2,
        duration: 0.3,
      })
      .to(badgeRef.current, {
        scale: 1,
        duration: 0.2,
      });
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div ref={badgeRef} className="text-center">
        <div className="text-8xl mb-4">{badge.icon}</div>
        <h2 className="text-3xl font-bold text-white mb-2">{badge.name}</h2>
        <p className="text-lg text-primary-200">{badge.description}</p>
      </div>
    </div>
  );
}
```

---

## FASE 3: POLISH Y TESTING (Semanas 7-8)

### Semana 7: UX Refinement

#### LaTeX Editor con Preview
```bash
npm install @monaco-editor/react
```

**Archivo:** `components/student/latex-editor.tsx`

```tsx
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export function LatexEditor({ value, onChange, label }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-white">{label}</label>
      <div className="grid grid-cols-2 gap-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="..."
          placeholder="Type LaTeX: f'(x) = \lim_{h \to 0} ..."
        />
        <div className="rounded-xl bg-primary-800/40 p-4 border border-white/10">
          <div className="text-sm text-primary-300 mb-2">Preview:</div>
          <div className="text-white">
            <InlineMath math={value} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### Onboarding Tour
```bash
npm install react-joyride
```

**Archivo:** `components/onboarding/cerc-tour.tsx`

```tsx
import Joyride from 'react-joyride';

const steps = [
  {
    target: '.cerc-claim',
    content: 'Start with your conclusion - what are you proving?',
  },
  {
    target: '.cerc-evidence',
    content: 'Show your mathematical work: calculations, data, observations.',
  },
  {
    target: '.cerc-reasoning',
    content: 'Name the theorem or principle that connects evidence to claim.',
  },
  {
    target: '.cerc-conditions',
    content: 'CRITICAL: Verify ALL conditions required by your theorem.',
  },
];

export function CERCTour({ run, onComplete }) {
  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      callback={(data) => {
        if (data.status === 'finished') onComplete();
      }}
    />
  );
}
```

### Semana 8: Testing y Launch

#### Unit Tests
```bash
npm install -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

**Archivo:** `components/student/__tests__/cerc-form.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { CERCForm } from '../cerc-form';

describe('CERCForm', () => {
  it('disables submit until all fields filled', () => {
    render(<CERCForm problem={mockProblem} weekNumber={1} />);

    const submitButton = screen.getByText(/submit/i);
    expect(submitButton).toBeDisabled();

    // Fill all fields
    fireEvent.change(screen.getByPlaceholderText(/claim/i), {
      target: { value: 'Test claim...' },
    });
    // ... fill other fields

    expect(submitButton).toBeEnabled();
  });
});
```

#### E2E Tests con Playwright
```bash
npm install -D @playwright/test
npx playwright install
```

**Archivo:** `tests/e2e/student-workflow.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test('student can submit CERC response', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  // Login
  await page.fill('input[type="email"]', 'ananya@alpha.edu');
  await page.fill('input[type="password"]', 'test_password');
  await page.click('button[type="submit"]');

  // Navigate to Week 1
  await page.click('text=Week 1');
  await page.click('text=Practice');

  // Fill CERC form
  await page.fill('textarea[name="claim"]', 'The limit exists because...');
  await page.fill('textarea[name="evidence"]', 'Evaluating at x=2...');
  await page.fill('textarea[name="reasoning"]', 'By the definition of limit...');
  await page.fill('textarea[name="conditions"]', 'All conditions verified...');

  // Submit
  await page.click('button:has-text("Submit CERC Response")');

  // Verify success
  await expect(page.locator('text=Response Saved')).toBeVisible();
});
```

---

## CHECKLIST FINAL ANTES DE LAUNCH

### Seguridad
- [ ] Firebase Authentication implementado y testeado
- [ ] Todas las API routes protegidas con authentication
- [ ] Input validation con Zod en todos los endpoints
- [ ] Rate limiting activo en Upstash Redis
- [ ] Firestore security rules deployed
- [ ] CSP y security headers configurados
- [ ] HTTPS enforcement en producción (Vercel)
- [ ] Secrets en environment variables (no en código)
- [ ] npm audit sin vulnerabilidades high/critical

### Funcionalidad
- [ ] Login/logout funciona
- [ ] CERC form guarda respuestas en Firestore
- [ ] AI Socratic feedback genera hints correctos
- [ ] Error-forcing problems cargados en BD
- [ ] Badge system asigna badges automáticamente
- [ ] XP se otorga correctamente
- [ ] Admin puede crear quizzes y asignar FRQs
- [ ] Student dashboard muestra progreso

### UX/UI
- [ ] Responsive en mobile, tablet, desktop
- [ ] LaTeX rendering funciona correctamente
- [ ] Animaciones suaves (no janky)
- [ ] Error messages claros y útiles
- [ ] Loading states en todas las acciones async
- [ ] Onboarding tour para nuevos usuarios

### Performance
- [ ] Lighthouse Performance > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Bundle size < 300KB gzipped

### Testing
- [ ] Unit tests con coverage > 70%
- [ ] E2E tests para flujos críticos
- [ ] Manual UAT con 2-3 estudiantes
- [ ] Cross-browser testing (Chrome, Safari, Firefox)

### Deployment
- [ ] Environment variables configuradas en Vercel
- [ ] Firebase project en producción mode
- [ ] Monitoring activo (Sentry)
- [ ] Backup strategy documentada
- [ ] Incident response plan

---

## RECURSOS Y CONTACTOS

**Documentación:**
- Firebase Auth: https://firebase.google.com/docs/auth
- Next.js Security: https://nextjs.org/docs/app/building-your-application/authentication
- Anthropic Claude API: https://docs.anthropic.com/claude/reference/getting-started-with-the-api
- Vercel Deploy: https://vercel.com/docs/deployments/overview

**Herramientas:**
- Firebase Console: https://console.firebase.google.com
- Anthropic Console: https://console.anthropic.com
- Vercel Dashboard: https://vercel.com/dashboard
- Upstash Dashboard: https://console.upstash.com
- Sentry Dashboard: https://sentry.io

**Auditoría completa:** `C:/Users/sebas/.claude/projects/C--Users-sebas/memory/auditoria-alpha-ap-justification-2026-03-13.md`

---

**Última actualización:** 2026-03-13
**Próxima revisión:** Después de completar Fase 1 (Seguridad)
