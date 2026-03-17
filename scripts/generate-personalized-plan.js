/**
 * Generate Complete Personalized Plan for DOCX
 * Week 1 = Kickoff calls (personalized)
 * Week 2+ = Course live on TimeBack
 */

require('dotenv').config({ path: '../Documents/alpha-tracker/.env.local' });
const fs = require('fs');

// Load the existing 12-week data
const existingData = fs.readFileSync('./CLAUDE_AI_DOCX_INPUT.txt', 'utf-8');

// Generate personalized coaching calls
const personalizedPlan = `

---

## Part 3: WEEK 1 KICKOFF - Personalized Coaching Sessions (Mar 18-24)

**IMPORTANT:** Course is NOT live this week. This week is for explanation, preparation, and assessment only. No coursework assigned.

**Course Go-Live:** Monday, March 25 (Week 2)

---

### TIER A: Elle Liemandt & Emily Smith
**Goal:** Explain program, show CERC framework, prepare for Week 1 content (goes live Mar 25)

---

#### Elle Liemandt - Kickoff Coaching Session

**Scheduled:** Tuesday, March 18, 9:00 AM (45 min)

**Pre-Session Prep:**
- Review her 12-week data:
  - Recent performance: 163 XP/week (130% of target)
  - Accuracy: 97.6% (EXCEPTIONAL - 2nd best in cohort)
  - Focus: 88.7% (strong concentration)
  - Trend: Improving (was 103 avg → now 163 recent)
- Key strength: Precision + consistency
- Potential challenge: May be too careful (perfectionist?)

**Session Agenda:**

**1. Welcome & Context (5 min)**
- "Elle, you're one of 2 students ready to start immediately"
- "Your 97.6% accuracy over 12 weeks is exceptional - that precision is exactly what we need"
- Show her cohort ranking: 2nd in accuracy, 3rd in velocity

**2. The Gap We're Targeting (10 min)**
- "You know HOW to do calculus. But AP FRQs fail students who can't JUSTIFY"
- Show sample FRQ with common error: "Applied MVT, got c=0" (missing condition check)
- "This student got 2/9 points. They could DO the math, couldn't EXPLAIN why it works"
- Connect to her strength: "Your precision will shine here - it's about catching what's missing"

**3. CERC Framework Introduction (15 min)**
- Walk through the 4 components:
  - **Claim:** Your conclusion
  - **Evidence:** Your computation
  - **Reasoning:** The theorem connecting them
  - **Conditions:** Verification that theorem applies

- **Live Example:** MVT on f(x)=1/x² on [-1,1]
  - Ask her: "What conditions does MVT require?"
  - Guide her: "Is f(x)=1/x² continuous on [-1,1]?"
  - Reveal trap: "Discontinuity at x=0 means MVT doesn't apply"
  - "This is Week 1 content - error-forcing problems that break if you skip conditions"

**4. Week 1 Preview (10 min)**
- "Starting Monday March 25, you'll get 2-3 problems on TimeBack"
- "Each problem awards XP based on mastery:"
  - Identify missing condition: +50 XP
  - Complete CERC with scaffolding: +75 XP
  - Badge potential: 🔍 'The Skeptic' for surviving error-forcing traps
- Show timeline: 4 weeks → Boss Battle in Week 4

**5. Personalized Prep (5 min)**
- "Your challenge: Don't overthink. Trust your intuition on conditions"
- "Your strength: That 97.6% accuracy means you catch details - use it"
- "Goal for Week 1: 2 problems, aim for 'The Skeptic' badge"
- "Keep MathAcademy at 150+ XP/week - that's your baseline"

**Action Items:**
- [ ] Wait for TimeBack course notification (Monday Mar 25)
- [ ] Review sent materials: CERC framework cheat sheet
- [ ] Keep MathAcademy pace: 150+ XP this week
- [ ] Optional: Watch intro video (link in email)

---

#### Emily Smith - Kickoff Coaching Session

**Scheduled:** Tuesday, March 18, 10:30 AM (45 min)

**Pre-Session Prep:**
- Review her 12-week data:
  - Recent performance: 232 XP/week (186% of target - HIGHEST in Tier A)
  - Accuracy: 92.1% (excellent, 3rd in cohort)
  - Focus: 87% (strong)
  - Trend: Improving dramatically (was 136 avg → now 232 recent)
- Key strength: Velocity + work ethic
- Note: Precalculus level (not taking May AP, summer completion goal)

**Session Agenda:**

**1. Welcome & Recognition (5 min)**
- "Emily, your velocity is exceptional - 232 XP/week is the highest in Tier A"
- "That work ethic is going to be your superpower in this program"
- "You're not taking the May AP, which means NO PRESSURE - this is pure skill building"
- Show her growth: 136 XP/week → 232 XP/week (71% increase in 12 weeks!)

**2. The Why for You (10 min)**
- "You're on track for summer AP Calc AB completion"
- "This program prepares you for the FRQ reasoning you'll need in 4 months"
- "Most students learn justification AFTER bombing their first AP - you're learning it BEFORE"
- Show precalculus → AB bridge: "We'll use precalc problems this week, then preview AB reasoning"

**3. CERC Framework Introduction (15 min)**
- Walk through components (same as Elle)
- **Live Example:** Precalculus-level
  - "Is f(x) = √x continuous on [-1, 1]?"
  - Guide her through reasoning: Domain issue at x<0
  - "This is a CERC problem: What's your claim? What's your evidence? What's your reasoning?"

- Show AB preview: "Week 2-3, we'll move to derivative conditions (continuity, differentiability)"

**4. Week 1 Preview (10 min)**
- "Starting March 25, you get Precalculus-adapted problems"
- "Same XP structure as AP students - you're in the same cohort"
- "Your advantage: No exam pressure, so you can focus 100% on LEARNING the framework"
- "By Week 3-4, we'll preview AP Calc AB reasoning (preparation for summer)"

**5. Personalized Prep (5 min)**
- "Your challenge: Balance velocity with precision - don't rush the reasoning"
- "Your strength: That 232 XP/week means you LOVE progress - use it to master CERC"
- "Goal for Week 1: 2 problems, focus on quality over speed"
- "Keep MathAcademy at 220+ XP/week - you're crushing it"

**Action Items:**
- [ ] Wait for TimeBack course notification (Monday Mar 25)
- [ ] Review sent materials: CERC framework cheat sheet (Precalc version)
- [ ] Keep MathAcademy pace: 220+ XP this week
- [ ] Optional: Watch intro video (link in email)

---

### TIER B: Ananya Kakarlapudi
**Goal:** Accuracy coaching + program explanation + decision on start date

---

#### Ananya Kakarlapudi - Accuracy Coaching + Kickoff

**Scheduled:** Wednesday, March 19, 2:00 PM (60 min)

**Pre-Session Prep:**
- Review her 12-week data:
  - Performance: 367 XP/week (294% of target - HIGHEST in entire cohort!)
  - Accuracy: 80.9% (lowest in group, below 85% threshold)
  - Focus: 92.8% (excellent - highest in cohort)
  - Trend: Improving (started 68% → now 85-94% recent weeks)
  - Pattern: RUSHING - high velocity, lower accuracy
- Critical insight: She CAN be accurate (94% in Week 12) but inconsistent
- Tier B reason: Velocity is exceptional, but accuracy <85% threshold

**Session Agenda:**

**1. Celebration + Context (5 min)**
- "Ananya, you're the FASTEST student in the entire cohort - 367 XP/week is incredible"
- "Your focus integrity (92.8%) is also #1 - you're deeply engaged when you work"
- "Here's the challenge: Your accuracy is 80.9% overall, we need 85%+ for justification training"
- Show her trend: "Started at 68%, now hitting 94% - you're improving fast"

**2. The Accuracy Challenge (15 min)**
- "Let's look at your error pattern over 12 weeks"
- Show data:
  - Weeks with high XP (500+): Accuracy drops to 79-84%
  - Weeks with moderate XP (200-350): Accuracy rises to 85-88%
  - Week 12 (142 XP): 94% accuracy
- **Diagnosis:** "You rush when you push for high XP. You're capable of 94% when you slow down"
- Ask her: "What's driving the 500+ XP weeks? Time pressure? Competition?"

**3. The Trade-Off (10 min)**
- "For AP Justification, we need PRECISION over speed"
- "Here's the goal: 250 XP/week at 88%+ accuracy"
- "That's still DOUBLE the target (125 XP), but with quality"
- Show math: "Currently 367 XP × 80.9% = 297 'quality XP'. Target: 250 XP × 88% = 220 'quality XP'"
- "You'll get MORE credit for fewer problems done RIGHT"

**4. CERC Framework Introduction (15 min)**
- "This program rewards reasoning, not speed"
- Walk through CERC (same structure as Elle)
- **Key point:** "If you rush and miss a condition, you get 0 XP. If you slow down and catch it, +50 XP"
- Show error-forcing example: "This PUNISHES rushing. You have to read carefully."

**5. Decision Point (10 min)**
- "Here's your path:"
  - **Option A:** 2 weeks accuracy focus (Mar 18-31) → Start Week 1 on April 1
    - Goal: 250 XP/week, 88%+ accuracy for 2 consecutive weeks
    - If successful: Join course April 1, compressed Week 1-2
  - **Option B:** Start March 25 with Elle/Emily, slower pace
    - Risk: Error-forcing problems will expose rushing habit
    - Benefit: Learn alongside Tier A
- Ask her preference

**6. Personalized Prep (5 min)**
- "Your challenge: Slow down. Treat every problem like Week 12 (94% accuracy)"
- "Your strength: That 92.8% focus means you CAN concentrate - apply it to accuracy"
- "Action: Next 2 weeks, target 250 XP at 88%+"
- "We'll check in March 26 - if you hit target, you start April 1"

**Action Items:**
- [ ] Choose Option A or B (accuracy focus first vs. start now)
- [ ] If Option A: Target 250 XP/week, 88%+ accuracy (track daily)
- [ ] If Option B: Wait for TimeBack course notification (March 25)
- [ ] Review error analysis: Pull last 20 incorrect problems, find pattern
- [ ] Check-in call: Wednesday, March 26 (progress review)

---

### TIER C: Maddie Price & Sloka Vudumu
**Goal:** Reactivation/consistency coaching + program explanation + build to eligibility

---

#### Maddie Price - Consistency Building + Kickoff

**Scheduled:** Thursday, March 20, 9:00 AM (45 min)

**Pre-Session Prep:**
- Review her 12-week data:
  - Performance: 22 XP/week average (18% of target)
  - Accuracy: 85.3% (GOOD when active)
  - Focus: 76.6% (decent)
  - Pattern: Sporadic (active Weeks 2-3, 5, 12; zero activity Weeks 4, 6-11)
  - Recent: Week 12 = 89 XP at 90% accuracy (strong when engaged)
- Key insight: QUALITY is there, CONSISTENCY is missing
- Only 1 active week in last 4 weeks

**Session Agenda:**

**1. Recognition + Reality Check (5 min)**
- "Maddie, when you're active, your quality is excellent - 85% accuracy, 90% in Week 12"
- "The challenge: You've only been active 4 out of 12 weeks"
- "This program requires 4 consecutive weeks of 80+ XP to be eligible"
- Show pattern: "Weeks 2-3 you did great, then 8 weeks off, then Week 12 strong again"

**2. Understanding Barriers (10 min)**
- "Let's figure out what's blocking consistency"
- Ask open questions:
  - "What happened in Weeks 4-11? (8 weeks zero activity)"
  - "What made Week 12 different? (89 XP, 90% accuracy)"
  - "Is it time? Motivation? Technical issues? Other priorities?"
- Listen for patterns: Scheduling, competing demands, course difficulty

**3. The Justification Program (10 min)**
- "This program is perfect for your profile"
- "It's about QUALITY reasoning, not volume - your 85% accuracy is strong"
- "But it requires consistent engagement - 2-3 problems per week, every week"
- Show structure: 4 weeks, 2-3 problems/week, ~20-30 min per problem
- "Total commitment: ~2 hours/week for 4 weeks"

**4. Building Consistency Plan (15 min)**
- "Here's the path to eligibility:"
  - **Weeks 1-4 (Mar 18 - Apr 14):** Build 4-week pattern
    - Target: 80-100 XP/week (lower than target, but CONSISTENT)
    - Goal: Prove you can do 4 consecutive weeks
    - Check-ins: Biweekly (Mar 26, Apr 9)
  - **Week 5 (Apr 15):** Eligibility decision
    - If 4 consecutive weeks achieved → Start justification Week 1
    - If not → Defer to post-May cohort (June)

- Create schedule together:
  - "When during the week can you commit 90 minutes?"
  - Block specific times: "Tuesday 4-5pm, Thursday 4-5pm, Saturday 10-11am?"
  - "Let's make it ROUTINE, not ad-hoc"

**5. Accountability Setup (5 min)**
- "Your challenge: Habits. We need to build a 4-week streak"
- "Your strength: 90% accuracy shows you GET the math when you do it"
- "Action: This week (Mar 18-24), aim for 80 XP minimum"
- "I'll check in March 26 - if Week 1 succeeds, we continue. If not, we troubleshoot"

**Action Items:**
- [ ] Schedule MathAcademy time: 3 blocks per week (write them down)
- [ ] Target Week 1: 80+ XP by March 24
- [ ] Check-in call: Wednesday, March 26 (progress review)
- [ ] Identify barriers: Write down what blocks consistency (share at check-in)
- [ ] Optional: Justification program overview video (to build motivation)

---

#### Sloka Vudumu - Reactivation + Kickoff

**Scheduled:** Thursday, March 20, 2:00 PM (45 min)

**Pre-Session Prep:**
- Review her 12-week data:
  - Performance: 79 XP/week average (63% of target)
  - Recent: 41 XP/week (dropped 50%)
  - Accuracy: 85.6% (good)
  - Focus: 77.6% (decent)
  - Pattern: Consistent Weeks 2-9, then dropped off (Weeks 10, 12 = 0 XP)
  - XP Remaining: 6,773 on AP Calc AB
- Key insight: WAS consistent (8 weeks), then paused. Reactivation needed.
- Challenge: Accuracy lower than Maddie (85.6% vs 85.3%), but better consistency history

**Session Agenda:**

**1. Welcome Back + Context (5 min)**
- "Sloka, you had a strong 8-week run from January to mid-February"
- "Then Weeks 10 and 12 were zero activity - what happened?"
- "Your accuracy (85.6%) and focus (77.6%) are solid when you're working"
- Show data: "Weeks 2-9 you averaged 100+ XP/week consistently"

**2. Understanding the Pause (10 min)**
- "Let's talk about what caused the pause"
- Ask open questions:
  - "What changed in late February/early March?"
  - "Is it related to school workload? Personal? Course difficulty?"
  - "Week 11 you did 80 XP, but Week 12 was zero again - what's the pattern?"
- Listen for: Burnout, external factors, lost motivation, technical issues

**3. The Restart Plan (10 min)**
- "Here's what we need: Restart at 80 XP/week for 3 consecutive weeks"
- Show timeline:
  - **Week 1 (Mar 18-24):** Restart - aim for 80 XP
  - **Week 2 (Mar 25-31):** Sustain - 80 XP again
  - **Week 3 (Apr 1-7):** Confirm pattern - 80 XP again
  - **Week 4 (Apr 8-14):** Eligibility decision
    - If 3 weeks successful → Start justification training April 8
    - If not → Defer to post-May cohort
- "This is LOWER than your Weeks 2-9 average (100 XP), so it's achievable"

**4. AP Calc AB Timeline (10 min)**
- "You have 6,773 XP remaining on AP Calc AB"
- Math: "At 80 XP/week, that's 85 weeks (~20 months)"
- "The May 2026 AP is 8 weeks away - not realistic for this year"
- "Target: May 2027 AP (60 weeks away)"
  - Need: 113 XP/week average
  - Path: Restart at 80, build to 100, then 120+
- "Justification training will HELP your May 2027 score - it's perfect timing"

**5. Accountability Setup (10 min)**
- "Your challenge: Restarting after a pause is hard - momentum is gone"
- "Your strength: You DID 8 consecutive weeks before - you know you can do it"
- "Action: This week (Mar 18-24), restart at 80 XP"
- "Check-in: Monday, March 24 - if Week 1 succeeds, we continue. If not, troubleshoot"

- Create schedule together:
  - "When worked best for you in Weeks 2-9?"
  - "Let's recreate that routine"
  - Block specific times

**Action Items:**
- [ ] Understand pause: Write down what caused the drop-off (share at check-in)
- [ ] Restart target: 80 XP this week (Mar 18-24)
- [ ] Check-in call: Monday, March 24 (Week 1 restart review)
- [ ] Long-term goal: May 2027 AP (not May 2026)
- [ ] Optional: Justification program overview video

---

### TIER D: Alex Mathew & Sloane Price
**Goal:** Status verification / engagement intervention + program explanation if eligible

---

#### Alex Mathew - Status Verification Call

**Scheduled:** Friday, March 21, 9:00 AM (30 min)

**Pre-Session Prep:**
- Review his 12-week data:
  - Performance: 64 XP/week average
  - Recent: 0 XP/week (8 consecutive weeks zero activity)
  - Accuracy: 98.7% (HIGHEST in cohort when active!)
  - Active period: Weeks 1-4 (Dec 29 - Jan 19): 767 XP total
  - Pattern: Strong burst, then complete stop
- Hypothesis: Likely COMPLETED AP Calc BC in January
- No reactivation attempt - went from 43 XP (Week 4) to 0 (Weeks 5-12)

**Session Agenda:**

**1. Status Check (10 min)**
- "Alex, I see you were very active December-January (767 XP at 98.7% accuracy!)"
- "Then zero activity since late January - what happened?"
- Ask directly:
  - "Did you complete AP Calc BC?"
  - "Are you still enrolled in the course?"
  - "Is there a reason you stopped?"
- Listen for: Course completion, switched courses, technical issues, lost access

**2. If COMPLETED Course: (5 min)**
- "Congratulations on finishing BC!"
- "The justification program is still valuable for the May AP exam"
- "You'd be learning the CERC framework for FRQ reasoning"
- "Are you taking the AP exam in May?"
  - If YES: "Let's talk about FRQ prep"
  - If NO: "Then this program isn't needed - you're good"

**3. If STILL ENROLLED But Inactive: (10 min)**
- "Let's figure out what's blocking you"
- Ask barriers: Time, motivation, difficulty, technical issues
- "Your 98.7% accuracy is EXCEPTIONAL - that precision is rare"
- "If you can restart, the justification program is perfect for your profile"
- Create restart plan (similar to Sloka)

**4. Decision Point (5 min)**
- **Option A:** Completed BC → Not eligible (course done)
- **Option B:** Paused but interested → Restart path (similar to Sloka)
- **Option C:** Not interested / too busy → Remove from pilot

**Action Items:**
- [ ] Clarify status: Completed BC? Still enrolled? Taking May AP?
- [ ] If eligible and interested: Create restart plan
- [ ] If not eligible: Remove from pilot roster
- [ ] Follow-up: Email summary of conversation

---

#### Sloane Price - Engagement Intervention Call

**Scheduled:** Friday, March 21, 2:00 PM (45 min)

**Pre-Session Prep:**
- Review her 12-week data:
  - Performance: 12 XP/week average (10% of target)
  - Recent: 6 XP/week (only 1 session in last 4 weeks)
  - Accuracy: 82.7% (decent when active - small sample)
  - Focus: 58.5% (LOW - distracted sessions)
  - Pattern: Highly sporadic (only 4 active weeks out of 12)
  - Active weeks: 2 (77 XP), 3 (20 XP), 6 (23 XP), 11 (22 XP)
- Key insight: Minimal engagement, but 90% accuracy in Week 11 (small sample)
- Challenge: Need 3+ sessions/week, currently ~1 session/month

**Session Agenda:**

**1. Understanding the Situation (15 min)**
- "Sloane, let's start with honesty: You've had 4 active weeks out of 12"
- "When you DO work, your accuracy is decent (82-90%)"
- "But you're only doing about 1 session per month"
- "Before we talk about the justification program, let's understand what's going on"

Ask open questions:
- "What's making it hard to engage with MathAcademy?"
- "Is it the course difficulty? Time? Motivation? Technical issues?"
- "What's different about the 4 weeks you WERE active?"
- Listen for: Overwhelm, competing priorities, lack of structure, external factors

**2. The Engagement Gap (10 min)**
- "For the justification program, we need 3+ sessions per week minimum"
- "Right now you're at ~1 session per month - that's a 12x gap"
- Show math: "3 sessions/week = 12 sessions/month vs. your current 1"
- "This isn't about being 'bad at math' - your 90% accuracy in Week 11 shows you CAN do it"
- "This is about ROUTINE and HABIT"

**3. Building Engagement Plan (15 min)**
- "Here's what needs to happen:"
  - **Goal:** 3 sessions per week for 4 consecutive weeks
  - **XP Target:** 60+ XP/week (lower than standard, but CONSISTENT)
  - **Timeline:** March 18 - April 14 (4 weeks)

- Create concrete plan:
  - "When can you commit 30 minutes, 3x per week?"
  - Block specific times: "Monday 7pm, Wednesday 7pm, Friday 7pm?"
  - "What reminders work? Calendar? Alarms? Parent check-in?"
  - "What environment works best? Home? Library? After school?"

- Accountability structure:
  - Check-in call: Thursday, March 27 (Week 1 review)
  - Target: 3 sessions by March 27
  - If successful: Continue. If not: Troubleshoot barriers again

**4. Decision Point (5 min)**
- "Be honest: Is this realistic for you right now?"
- "If you're overwhelmed with other things, that's OKAY - we can defer"
- "But if you commit, we need to see 3 sessions/week minimum"

**Options:**
- **Option A:** Commit to 4-week engagement build (3 sessions/week)
- **Option B:** Not ready / too busy → Remove from pilot, revisit in summer
- Ask her to choose

**Action Items:**
- [ ] Decide: Commit to Option A or Option B?
- [ ] If Option A: Schedule 3 sessions this week (write down times)
- [ ] If Option A: Target 60+ XP by March 24
- [ ] If Option A: Check-in call Thursday, March 27
- [ ] If Option B: Remove from pilot roster, plan summer check-in

---

## Part 4: WEEK 2 ONWARD - Course Goes Live on TimeBack (Starting Mar 25)

**Course Structure on TimeBack:**
- Deployed as "AP Math Justification Training" (Supplementary Course)
- 4-week progression: Error-forcing → Condition verification → Global argumentation → Boss Battle
- XP awarded based on mastery (tracked automatically on TimeBack)
- Integrated with MathAcademy XP totals

---

### Week 2: March 25-31 (WEEK 1 OF COURSE)

**Course Content Goes Live:** Monday, March 25

**Active Students:** Elle Liemandt, Emily Smith, + Ananya Kakarlapudi (if approved)

**Deliverables on TimeBack:**

| Student | Problems | XP Available | Scaffolding |
|---------|----------|--------------|-------------|
| Elle Liemandt | Problem 1: MVT condition bypass<br>Problem 2: IVT discontinuity trap | +75 XP per problem<br>+50 XP bonus for "Skeptic" badge | Full CERC sentence frames |
| Emily Smith | Problem 1: Precalc continuity reasoning<br>Problem 2: Domain verification | +75 XP per problem<br>+50 XP bonus for "Skeptic" badge | Full CERC sentence frames |
| Ananya Kakarlapudi<br>(if approved) | Problem 1: MVT condition bypass<br>Problem 2: IVT discontinuity trap | +75 XP per problem<br>+50 XP bonus for "Skeptic" badge | Full CERC sentence frames |

**Check-in Calls (Optional):**
- Wednesday, March 26: Ananya accuracy review (approve for Week 1 if 250 XP + 88% achieved)
- Friday, March 28: Tier A progress check (15 min each, Elle + Emily)

**Parallel Actions:**
- Maddie: Week 2 of consistency building (target: 80 XP)
- Sloka: Week 2 of restart (target: 80 XP)
- Alex: Follow-up based on status call outcome
- Sloane: Week 1 of engagement build (target: 3 sessions) OR removed from pilot

---

### Week 3: April 1-7 (WEEK 2 OF COURSE)

**Active Students:** Elle, Emily, Ananya (if on track)

**Deliverables on TimeBack:**

| Student | Problems | XP Available | Scaffolding |
|---------|----------|--------------|-------------|
| Elle & Ananya | Problem 3: Global vs local argument (EVT) | +100 XP (structural outline only) | Outline only - no sentence frames |
| Emily | Problem 3: Precalc domain/range reasoning | +100 XP (structural outline only) | Outline only - no sentence frames |

**Scaffolding Change:** Sentence frames removed - students construct full argument with outline guide only

**Check-in Calls:**
- Tuesday, April 1: Tier A progress review (30 min group call - Elle + Emily + Ananya)
- Thursday, April 3: Maddie eligibility review (4 weeks consistency check)
- Friday, April 4: Sloka eligibility review (3 weeks restart check)

**Parallel Actions:**
- Maddie: Week 4 of consistency (eligibility decision)
- Sloka: Week 3 of restart (eligibility decision next week)

---

### Week 4: April 8-14 (WEEK 3 OF COURSE)

**Active Students:** Elle, Emily, Ananya, + Maddie (if approved), + Sloka (if approved)

**Deliverables on TimeBack:**

| Student | Problems | XP Available | Scaffolding |
|---------|----------|--------------|-------------|
| Elle, Emily, Ananya | Problems 4-5: Condition verification (blank canvas) | +150 XP per problem | NONE - blank canvas |
| Maddie (if approved) | Problem 1: MVT condition bypass<br>Problem 2: IVT trap | +75 XP per problem | Full CERC sentence frames |
| Sloka (if approved) | Problem 1: MVT condition bypass | +75 XP | Full CERC sentence frames |

**Scaffolding Change (Tier A):** ZERO scaffolding - students must construct complete CERC argument independently

**Check-in Calls:**
- Tuesday, April 8: Maddie/Sloka kickoff (if approved) - 45 min each
- Friday, April 11: Tier A Week 3 progress review

---

### Week 5: April 15-21 (WEEK 4 OF COURSE - BOSS BATTLE)

**Active Students:** Elle, Emily, Ananya, Maddie, Sloka

**Deliverables on TimeBack:**

| Student | Problems | XP Available | Special |
|---------|----------|--------------|---------|
| Elle, Emily, Ananya | Week 4: Boss Battle (integrated FRQ) | +200 XP<br>+"Boss Slayer" badge | Multi-phase collaborative challenge |
| Maddie, Sloka | Week 2: Condition verification | +100 XP | Outline only |

**Boss Battle Structure (Tier A only):**
- **Phase 1 (Individual, 15 min):** Untangle algebraic evidence
- **Phase 2 (Team, 20 min):** Construct CERC argument collaboratively (all 3 work together)
- **Phase 3 (Curveball):** Unexpected constraint introduced
- **Final (Timed, 30 min):** Complete FRQ under AP conditions

**Check-in Calls:**
- Wednesday, April 16: Boss Battle debrief (group call - Tier A)
- Friday, April 18: Program completion celebration (Tier A)

---

### SPRING BREAK: April 22-28

**No mandatory coursework**
- Optional practice problems available on TimeBack
- MathAcademy tracking continues (normal XP goals)

---

### Week 6: April 29 - May 5 (FINAL PREP WEEK)

**Active Students:** Maddie, Sloka (completing Week 3-4), + Tier A (review/practice)

**Deliverables:**
- Maddie/Sloka: Week 3-4 content (if on track)
- Tier A: Optional practice FRQs, confidence building

**Check-in Calls:**
- Tuesday, April 29: Maddie/Sloka progress review
- Thursday, May 1: All students - AP exam strategy session (optional)

---

## Part 5: Success Metrics & Monitoring

### Individual Success Criteria

**Tier A (Elle, Emily, Ananya):**
- Complete all 4 weeks by April 21
- Earn "The Architect" badge (unassisted CERC proof in Week 3)
- Demonstrate formal deductive reasoning on Boss Battle
- Target: 90%+ on final FRQ

**Tier B (Ananya specific):**
- Improve accuracy to 88%+ within 2 weeks (by April 1)
- Complete compressed Weeks 1-2 if late start
- Maintain 250 XP/week (down from 367)
- Earn "The Skeptic" badge minimum

**Tier C (Maddie, Sloka):**
- Establish consistent 80+ XP/week for 4 weeks before starting
- Complete Weeks 1-2 before May AP exam
- Demonstrate understanding of CERC framework
- Target: Identify missing conditions in worked examples

**Tier D (Alex, Sloane):**
- Alex: Clarify status (completed BC? taking AP?)
- Sloane: 3 sessions/week for 4 weeks OR remove from pilot

### Cohort Success Metrics

**Participation:**
- Target: 60%+ of eligible students complete full program
- Stretch: 80%+ complete at least Weeks 1-2

**Reasoning Advancement:**
- Target: 80%+ show progression from empirical → generic or formal
- Measured via pre/post CERC response quality

**AP Impact:**
- Target: 10%+ improvement on May AP FRQ scores vs historical baseline

### Weekly Monitoring

**Automated (via TimeBack):**
- XP awards per problem (mastery-based)
- Time spent per problem
- Hint usage tracking
- Completion rates

**Manual (Sebastian Review):**
- CERC submission quality (empirical/generic/formal reasoning stage)
- Error patterns (condition bypass, CER breakdown, local-only arguments)
- Badge unlock progress
- Engagement consistency

**Escalation Triggers:**
- Missing 2 consecutive problems → check-in call within 48 hours
- Accuracy drop below 75% on course problems → prerequisite review
- Hint usage >5 per problem → wheel-spinning protocol
- Zero activity for 5+ days → engagement intervention

---

## Part 6: Technical Implementation on TimeBack

### Course Setup Requirements

**TimeBack Configuration:**
- Course Type: Supplementary Course
- Course Name: "AP Math Justification Training"
- Duration: 4 weeks (March 25 - April 21)
- Target Students: 7 students (Tier A-D)
- XP Integration: Yes (counts toward MathAcademy total)

**Problem Deployment:**
- Format: QTI 3.0 items with CERC submission form
- Scaffolding levels:
  - Week 1: Full sentence frames (embedded in problem)
  - Week 2: Structural outline only
  - Week 3-4: Blank canvas
- Mastery criteria:
  - Condition identified correctly: +50 XP
  - Complete CERC with scaffolding: +75 XP
  - Complete CERC without scaffolding: +150 XP
  - Peer critique (Week 3): +100 XP

**XP Estimation:**
- Week 1 problem (with scaffolding): 20-30 min → +75 XP
- Week 2 problem (outline only): 30-40 min → +100 XP
- Week 3 problem (blank canvas): 40-50 min → +150 XP
- Week 4 Boss Battle: 60-90 min → +200 XP

**Badge System:**
- 🔍 "The Skeptic": Unlock criteria = Complete Week 1 Problem 1 with 0 hints
- 🏛️ "The Architect": Unlock criteria = Complete Week 3 problem with 0 hints + 100% accuracy
- ⚔️ "Boss Slayer": Unlock criteria = Complete Week 4 Boss Battle with full CERC + team collaboration

---

## Part 7: Open Decisions & Next Steps

### Open Decisions

1. **TimeBack Deployment Timeline:** Can course go live Monday March 25, or need more time?

2. **Ananya Start Date:** If she hits 88% accuracy by April 1, compress Weeks 1-2 into 1 week to catch up with Tier A?

3. **Maddie/Sloka Eligibility:** Require 4 consecutive weeks or accept 3 weeks with high quality?

4. **Alex Status:** If completed BC but taking May AP, offer FRQ-only crash course (Weeks 3-4 only)?

5. **Sloane Intervention:** Give 4-week engagement build period or remove from pilot now?

6. **Emily Post-Program:** After completing 4 weeks, offer "AB Preview" module or keep focus on Precalc mastery?

7. **Post-May Cohort:** Plan June-August program for deferred students (Alex, Sloane, + anyone who doesn't complete)?

### Next Steps (This Week: Mar 18-24)

**Monday, March 17:**
- [ ] Finalize TimeBack course deployment (ready for March 25 launch)
- [ ] Send kickoff email to all 7 students with call schedules
- [ ] Prepare coaching session materials (CERC cheat sheets, example problems)

**Tuesday, March 18:**
- [ ] 9:00 AM: Elle Liemandt kickoff (45 min)
- [ ] 10:30 AM: Emily Smith kickoff (45 min)

**Wednesday, March 19:**
- [ ] 2:00 PM: Ananya Kakarlapudi accuracy coaching + kickoff (60 min)

**Thursday, March 20:**
- [ ] 9:00 AM: Maddie Price consistency building + kickoff (45 min)
- [ ] 2:00 PM: Sloka Vudumu reactivation + kickoff (45 min)

**Friday, March 21:**
- [ ] 9:00 AM: Alex Mathew status verification (30 min)
- [ ] 2:00 PM: Sloane Price engagement intervention (45 min)
- [ ] End of day: Send week summary + Week 2 preview to Tier A

**Monday, March 25:**
- [ ] Course goes live on TimeBack for Tier A (Elle, Emily)
- [ ] Send notification: "Your Week 1 problems are ready"

---

## Appendix: Kickoff Call Scripts

[Note: Each call agenda detailed in Part 3 above]

**Materials to Send Before Calls:**
- [ ] CERC Framework Cheat Sheet (1-pager)
- [ ] Example error-forcing problem (worked solution)
- [ ] Program timeline overview (4-week structure)
- [ ] XP/Badge system explanation
- [ ] Calendar invite with Zoom link

**Materials to Send After Calls:**
- [ ] Call summary email (personalized action items)
- [ ] CERC framework detailed guide (PDF)
- [ ] Optional: Intro video (5 min explainer)
- [ ] Week 2 notification: "Course goes live Monday March 25"

---

**Document Generated:** March 17, 2026
**Next Update:** March 24, 2026 (after kickoff week complete)
**Owner:** Sebastian

`;

// Combine with existing data
const fullDocument = existingData.replace(
  '## Part 3: Week-by-Week Implementation Plan',
  personalizedPlan + '\n\n## Part 7: Original Week-by-Week Plan (Reference)'
);

fs.writeFileSync('./CLAUDE_AI_DOCX_INPUT.txt', fullDocument);

console.log('\n✅ Updated CLAUDE_AI_DOCX_INPUT.txt with personalized kickoff plans');
console.log('\n📋 What was added:');
console.log('   - Part 3: Week 1 Kickoff (Mar 18-24) with 7 personalized coaching sessions');
console.log('   - Part 4: Week 2+ Course Implementation (starting Mar 25)');
console.log('   - Part 5: Success Metrics & Monitoring');
console.log('   - Part 6: Technical Implementation on TimeBack');
console.log('   - Part 7: Open Decisions & Next Steps');
console.log('   - Appendix: Kickoff call scripts');
console.log('\n📄 File ready for Claude.ai DOCX creation');
console.log('   Location: ./CLAUDE_AI_DOCX_INPUT.txt');
console.log('   Lines: ~1000+ (detailed personalization for each student)\n');
