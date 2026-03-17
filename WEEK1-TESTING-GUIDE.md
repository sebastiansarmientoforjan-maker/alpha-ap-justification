# Week 1 Testing Guide
**Quick Start:** Cómo testar el nuevo contenido de Week 1

---

## 🚀 Start Dev Server

```bash
cd /c/Users/sebas/alpha-ap-justification
npm run dev
```

Navega a: `http://localhost:3000`

---

## 🧪 Test Paths

### 1. Landing Page de Week 1
**URL:** `http://localhost:3000/student/materials/week/1`

**Qué verificar:**
- ✅ Hero section con Spotlight y Orbiting Circles
- ✅ Video placeholder (coming soon)
- ✅ 4 Pillars con Animated Beams (hover para ver conexiones)
- ✅ Reasoning Ladder (empirical → generic → formal)
- ✅ Error-forcing traps warning
- ✅ CTAs al final:
  - Button principal: "Start Error-Forcing Problems" → `/student/week/1/problems`
  - Button secundario: "Try Model Problem" → `/student/materials/week/1/practice`

---

### 2. Problems Selection Page
**URL:** `http://localhost:3000/student/week/1/problems`

**Qué verificar:**
- ✅ Course selector (Calculus AB/BC/Statistics)
- ✅ 3 problemas por curso
- ✅ Problem cards con:
  - Número badge (1, 2, 3)
  - Título + error category tag
  - Theorem name + estimated time
  - Trap description
  - "Start Problem" button
- ✅ Progress indicator (0 of 3 completed)
- ✅ Lock/unlock mechanism:
  - Problem 1: Siempre available
  - Problem 2: Locked hasta completar Problem 1
  - Problem 3: Locked hasta completar Problem 2
- ✅ Week 1 objectives display
- ✅ "How to Approach" guide box
- ✅ Breadcrumb navigation works

**Test course switching:**
- Cambiar entre Calculus/Statistics
- Verificar que los problemas cambien

---

### 3. Problem Solver (MVT Discontinuity)
**URL:** `http://localhost:3000/student/week/1/problem/w1-mvt-001`

**Flujo completo a testar:**

#### Phase 1: Understand
- ✅ Lee el problema en el sidebar izquierdo
- ✅ Click "Show Theorem" para ver condiciones del MVT
- ✅ Click "I understand the problem →"

#### Phase 2: Solve
- ✅ Selecciona work location (paper/whiteboard/scratchpad)
- ✅ Timer comienza a correr
- ✅ Click "Done with calculations →"

#### Phase 3: Justify (CERC)
- ✅ Sentence frames visibles arriba como helper
- ✅ 4 text areas: Claim, Evidence, Reasoning, Conditions
- ✅ Color-coded labels (C-E-R-C)
- ✅ Escribe CERC response (no importa qué, es testing)
- ✅ Click "Submit for self-check →"

#### Phase 4: Self-Check
- ✅ Split view: Tu trabajo (izq) vs Resources (der)
- ✅ Tu CERC visible en cards
- ✅ Click "View Hint Level 1" → Hint se revela
- ✅ Click "View Hint Level 2" → Hint se revela
- ✅ Click "View Hint Level 3" → Hint se revela
- ✅ Click "View Full Solution" → Model answer aparece
- ✅ Click "← Revise my CERC" → Vuelve a Phase 3
- ✅ O click "Continue to Reflection →"

#### Phase 5: Reflection
- ✅ 5 learnings checklist (checkbox funciona)
- ✅ Custom reflection textarea
- ✅ Click "Complete Problem" → XP Modal aparece

#### XP Modal
- ✅ Trophy animation (rotation)
- ✅ Base XP: +20
- ✅ Bonuses listados (si aplican)
- ✅ Total XP calculado
- ✅ Timer final mostrado
- ✅ Click "Back to Problems" → Regresa a selection page

---

### 4. Other Problems
**Test estos también:**

**Calculus:**
- `w1-ivt-001` - IVT with jump discontinuity
- `w1-mvt-002` - MVT with absolute value (not differentiable)

**Statistics:**
- `w1-stats-001` - t-test independence trap
- `w1-stats-002` - t-test sample size trap
- `w1-stats-003` - CI random sampling trap

**URL pattern:**
`http://localhost:3000/student/week/1/problem/[problemId]`

---

### 5. Model Problem (Alternative)
**URL:** `http://localhost:3000/student/materials/week/1/practice`

**Qué es:**
- Mismo problema MVT discontinuity
- Hardcoded (no dinámico)
- Workflow idéntico a problem solver
- Puede usarse como tutorial/demo

---

## ✅ Functionality Checklist

### Navigation
- [ ] Breadcrumbs work on all pages
- [ ] "Back" buttons work
- [ ] Links between pages functional

### Content Display
- [ ] LaTeX renders correctly (problemas con $$ y $)
- [ ] Sentence frames display in justify phase
- [ ] Theorem collapsible panel works
- [ ] Error category tags visible

### Interactive Elements
- [ ] Course selector changes problems
- [ ] Hover effects on problem cards
- [ ] Animated Beams on 4 Pillars (hover)
- [ ] Progress checkmarks update
- [ ] Timer starts Phase 2, displays correctly

### Phase Workflow
- [ ] Can complete all 5 phases sequentially
- [ ] Can revise CERC from self-check
- [ ] Hints reveal progressively
- [ ] Solution reveals on click
- [ ] Reflection checkboxes work

### XP System
- [ ] XP calculated correctly
- [ ] Bonuses display
- [ ] Modal appears on completion
- [ ] Can close modal and return

### Lock/Unlock
- [ ] Problem 1 always available
- [ ] Problem 2 locked initially
- [ ] Problem 3 locked initially
- [ ] (Manual test: mark P1 complete → P2 unlocks)

### Visual/UX
- [ ] Glassmorphic effects visible
- [ ] Colors match Alpha branding
- [ ] Typography hierarchy clear
- [ ] Animations smooth (Framer Motion)
- [ ] Icons display (Lucide React)

### Responsive
- [ ] Works on desktop (1920x1080)
- [ ] Works on laptop (1366x768)
- [ ] Works on tablet (768px)
- [ ] Works on mobile (375px)

---

## 🐛 Known Issues (Expected)

### Database Integration Pending
- **Problem:** Completed problems NOT saved to database
- **Why:** Data service integration pending
- **Impact:** Progress resets on page refresh
- **Workaround:** Manual testing flow, don't refresh mid-session

### Lock/Unlock Not Persisting
- **Problem:** Sequential locking resets
- **Why:** State not persisted to DB
- **Impact:** All problems always "available" on refresh
- **Workaround:** Test lock logic by completing P1 → immediately check P2 (same session)

### Course Not Detected
- **Problem:** Course selector manual, not from user profile
- **Why:** Mock adapter, no user auth
- **Impact:** Must manually select course
- **Workaround:** Use dropdown to switch courses for testing

---

## 🔧 Debug Tips

### If LaTeX doesn't render:
- Check browser console for KaTeX errors
- Verify `katex/dist/katex.min.css` imported
- Check problem statement formatting (should use `$$` for block math)

### If animations stutter:
- Check Framer Motion version in package.json
- Verify GPU acceleration enabled in browser
- Try reducing number of Meteors (currently 35)

### If build fails:
- Check for unescaped quotes in JSX (should be `&apos;` `&ldquo;` `&rdquo;`)
- Run `npm run lint` to catch issues
- Check console for TypeScript errors

### If navigation breaks:
- Verify all Links use correct paths
- Check breadcrumbs array structure
- Ensure dynamic route `[problemId]` matches problem IDs

---

## 📊 Expected Test Results

### Successful Test Flow:
1. Navigate Week 1 landing → Problems → Problem 1
2. Complete all 5 phases
3. See XP modal (should be 20-80 XP)
4. Return to problems page
5. (Expected: P2 still locked without DB integration)

### Performance Benchmarks:
- Page load: <2 seconds
- Phase transitions: <500ms
- Animations: 60fps
- Timer: Accurate to second

---

## 🎯 Next Steps After Testing

### If everything works:
1. ✅ Mark Week 1 implementation as complete
2. Move to Phase B (Dual Grading UI)
3. Or move to Phase C (Week 2-3 content)

### If issues found:
1. Document bugs in GitHub issues
2. Prioritize by severity (P0-P3)
3. Fix critical issues first
4. Re-test after fixes

---

## 💾 Manual Save Workaround (Testing Only)

Since DB not connected yet, you can manually track progress:

```javascript
// Browser console (F12)
// Save completed problem to localStorage
localStorage.setItem('week1_completed', JSON.stringify(['w1-mvt-001']));

// Check completed problems
JSON.parse(localStorage.getItem('week1_completed') || '[]');

// Clear progress
localStorage.removeItem('week1_completed');
```

---

## 🎬 Video Testing Checklist

If recording demo:
1. Start at Week 1 landing page
2. Scroll through all sections
3. Click "Start Error-Forcing Problems"
4. Show problem cards
5. Click Problem 1
6. Go through all 5 phases quickly
7. Show XP modal
8. Return to problems
9. Try another problem (Statistics)

---

**Good luck testing! 🚀**

Si encuentras bugs, anótalos y podemos arreglarlos juntos.
