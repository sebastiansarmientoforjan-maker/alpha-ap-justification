# AP Math Justification Training — Claude Code Context

## Project Overview
4-week web-based justification training course for 10 AP Math students at Alpha High School (9 AP Calculus AB/BC, 1 AP Statistics). Targets one specific skill gap: students are procedurally fluent but fail AP justification requirements. Moves students through the Harel & Sowder taxonomy: empirical → generic → formal deductive reasoning.

## Tech Stack
- Next.js 14 (App Router)
- Firebase (Firestore + Auth)
- Claude API (Anthropic) — problem generation + Socratic feedback
- Tailwind CSS
- KaTeX — math rendering
- Aceternity UI — wow visual effects
- Magic UI — animated components
- GSAP — transitions and badge animations

## Critical Architecture Decision
Build with an abstracted data service layer from day 1. All data operations go through `/services/data/index.ts` which exports a unified interface. Implement `firebase.adapter.ts` for local dev. Leave `timeback.adapter.ts` as a stub with the correct OneRoster 1.2 and QTI 3.0 API shapes — this is the future production path for Alpha School's TimeBack platform.

### TimeBack API endpoints (stub only — do not implement yet)
- OneRoster base: `https://api.alpha-1edtech.ai`
- QTI base: `https://qti.alpha-1edtech.ai/api`
- Auth: OAuth2 client credentials via AWS Cognito (`prod-beyond-timeback-api-2-idp.auth.us-east-1.amazoncognito.com`)
- Key endpoints:
  - `GET /ims/oneroster/rostering/v1p2/users`
  - `GET /ims/oneroster/rostering/v1p2/classes`
  - `POST /ims/oneroster/gradebook/v1p2/assessmentResults`
  - `POST /api/items` (QTI)

## User Roles
- `student` — accesses weekly sessions, submits CERC responses, views XP and badges
- `admin` (Sebastian) — views all student progress, reasoning stage per student, adjusts Claude prompts, reviews MathGrader flags

## Core Session Structure
- Split-screen layout: problem LEFT, CERC response form RIGHT
- CERC fields: Claim / Evidence / Reasoning / Conditions
- Plain-text math input with KaTeX rendering — NO equation editors
- 2–3 problems max per session, 15–20 min per problem
- Interactive tooltips for theorem definitions (progressive disclosure)
- AI feedback inline, next to the specific CERC field it targets
- Feedback is Socratic (interrogative, not evaluative) — 3 hint levels:
  - Level 1 → location of the flaw
  - Level 2 → which CERC element is broken
  - Level 3 → explicit correction (only after 2 failed revision attempts)

## 4-Week Progression

| Week | Focus | Scaffolding |
|------|-------|-------------|
| 1 | Error-forcing problems — breaking empirical illusions | Full CERC sentence frames |
| 2 | Condition verification — IVT/MVT/EVT (Calc), inference conditions (Stats) | Structural outline only |
| 3 | Global argumentation + communication precision | Blank canvas |
| 4 | AP Exam Simulation — individual timed FRQ (25-30 min) | None (exam conditions) |

## CERC Framework
Every student response uses 4 structured fields:
- **Claim** — the conclusion
- **Evidence** — mathematical data/computation supporting the claim
- **Reasoning** — the theorem or principle connecting evidence to claim
- **Conditions** — explicit verification that theorem hypotheses are satisfied

## Error-Forcing Problem Examples
- Calculus: Apply MVT to f(x) = 1/x² on [-1,1] — no solution exists because continuity is violated at x=0
- Statistics: Apply 2-sample t-test to data that violates the independence assumption

## Claude API — Problem Generation System Prompt Template
```
You are an AP Mathematics justification training system. Generate ONE error-forcing problem for AP [Calculus|Statistics].

CONSTRAINTS:
- The problem must produce a contradiction or collapse if theorem hypotheses are bypassed
- Target error category: [CONDITION_BYPASS | LOCAL_ONLY_ARGUMENT | CER_BREAKDOWN]
- Week: [1|2|3|4] — scaffold level: [full frames | structural outline | blank canvas | timed FRQ]
- Student's last reasoning stage: [empirical | generic | formal]

OUTPUT FORMAT:
- Problem statement (LaTeX where needed)
- The specific trap: what happens if conditions are not verified
- Correct CERC skeleton (admin review only — never shown to student)
- Sentence frame (weeks 1–2 only)
```

## Gamification — Deep, Not Shallow
- XP system starts at 0, earns on reasoning milestones — NOT speed
  - +50 XP — correctly identifies a broken theorem condition
  - +100 XP — identifies logical flaw in a peer's argument
  - +150 XP — submits unassisted complete CERC proof (Week 3+)
- Badges tied to reasoning milestones:
  - 🔍 "The Skeptic" — survives error-forcing problem without falling for the empirical trap
  - 🏛️ "The Architect" — unassisted flawless CERC proof
  - ⚔️ "Boss Slayer" — completes Week 4 Boss Battle with full condition verification
- NO leaderboards
- NO countdown timers until Week 4

## AP Exam Simulation — Week 4
Individual timed FRQ under real exam conditions:
- Single long-form FRQ (3-4 parts) modeled after actual AP exam questions
- 25-30 minutes timed (varies by course: AB=25min, BC=30min, Stats=25min)
- No scaffolding: blank canvas like the real AP exam
- Individual work only (no collaboration)
- Scored using official AP rubric
- Simulates May exam pressure and time constraints

## WOW Components — Install and Use These

| Component | Library | Use |
|-----------|---------|-----|
| Spotlight | Aceternity UI | Illuminates the weekly problem on screen |
| Meteors | Aceternity UI | Boss Battle entry screen background |
| Text Reveal | Aceternity UI | Dramatic reveal of Boss Battle problem |
| 3D Card Hover | Aceternity UI | Weekly progress cards in dashboard |
| Animated Beam | Magic UI | Connects CERC fields visually as student writes |
| Orbiting Circles | Magic UI | Reasoning stage orb: empirical → generic → formal |
| Shimmer Button | Magic UI | Submit CERC response CTA |
| Blur Fade | Magic UI | Progressive reveal of Claude feedback |
| Number Ticker | Magic UI | XP counter that increments in real time |
| Badge Unlock | GSAP + CSS | Satisfying animation on badge earn |
| Phase Transition | GSAP | Boss Battle phase transitions |

## Firebase Structure
```
/users/{userId}
  role: "student" | "admin"
  name: string
  course: "calculus" | "statistics"

/progress/{userId}/weeks/{weekNumber}
  cerc_responses: [{ claim, evidence, reasoning, conditions, timestamp }]
  reasoning_stage: "empirical" | "generic" | "formal"
  xp_earned: number
  badges: string[]
  exit_ticket: { response, timestamp }

/problems/{weekNumber}/{problemId}
  statement: string
  error_category: string
  trap_description: string        ← admin only
  cerc_skeleton: string           ← admin only
  sentence_frame: string | null

/feedback/{userId}/{problemId}
  dialogue: [{ role: "ai" | "student", content, timestamp }]
  hint_level: 1 | 2 | 3
  revision_count: number
```

## Admin Dashboard Features
- Per-student reasoning stage tracker (empirical / generic / formal) — timeline visualization
- XP history + badge log per student
- Manual quiz trigger: Sebastian marks "quiz completed" → system assigns FRQ
- MathGrader.AI input: Sebastian pastes or uploads AI output → system links to student + quiz
- Exit ticket data feed for next week's Claude prompt calibration
- Flag queue for reviewing AI feedback before delivery to student

## Current Student Roster (AP Calculus)
- Ananya Kakarlapudi — AP Calc BC — Active
- Emily Smith — Precalculus — Active
- Alex Mathew — AP Calc BC — Verify status (6-week gap)
- Sloka Vudumu — AP Calc AB — Paused, reactivate first
- Elle Liemandt — AP Calc BC — Active
- Maddie Price — AP Calc AB — Intervention before workflow
- Sloane Price — AP Calc AB — Intervention before workflow

## FRQ Workflow (Manual — MathGrader.AI API pending)
1. Student completes MathAcademy quiz
2. Sebastian manually triggers FRQ assignment in admin dashboard
3. Student solves FRQ on paper, self-evaluates with CB rubric
4. Sebastian uploads result to MathGrader.AI manually, pastes output into dashboard
5. Dashboard links AI output to student + quiz
6. Sebastian delivers 3 action points to student

## ENV Variables
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
ANTHROPIC_API_KEY=
DATA_ADAPTER=firebase
TIMEBACK_CLIENT_ID=
TIMEBACK_CLIENT_SECRET=
```

## Build Order — Await Approval at Each Step
1. Project setup: Next.js 14, Firebase, Tailwind, KaTeX, Aceternity UI, Magic UI, GSAP, service layer scaffold
2. Auth: Firebase student/admin roles + protected routes
3. Student session view: split-screen layout + CERC form + KaTeX rendering
4. Claude API integration: problem generation endpoint
5. AI feedback loop: Socratic dialogue, 3 hint levels, inline display
6. WOW components: Spotlight, Animated Beam, Orbiting Circles reasoning orb
7. XP + badge system with GSAP animations
8. Admin dashboard: reasoning stage tracker + manual quiz trigger + MathGrader paste input
9. Exit ticket system
10. AP Exam Simulation mode: Week 4 individual timed FRQ + timer component + exam-style UI
11. TimeBack adapter stubs: OneRoster + QTI shapes, ENV switch
12. Deploy: Vercel

## Instructions for Claude Code
- Always await approval before moving to the next build step
- Never use generic placeholder names — this is a real production project
- Keep components modular — one responsibility per file
- All data calls go through the service layer, never directly to Firebase
- Admin-only data (trap_description, cerc_skeleton) must never be exposed to student routes
- Use TypeScript throughout
- Start with Step 1 and confirm before proceeding