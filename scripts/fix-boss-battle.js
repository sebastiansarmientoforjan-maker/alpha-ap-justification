/**
 * Fix Boss Battle structure to match exact specification
 */

const fs = require('fs');

const correctBossBattleSection = `### Week 4: Boss Battle Structure

Multi-phase challenge combining individual work and team collaboration:

| Phase | Format | Duration | Description |
|-------|--------|----------|-------------|
| **1** | Individual | 15 min | Untangle algebraic evidence — each student works alone |
| **2** | Team | 20 min | Construct CERC argument collaboratively — full cohort as ONE TEAM |
| **3** | Curveball | ~5 min | Unexpected constraint introduced (e.g., function no longer differentiable at x=0) |
| **Final** | AP-timed FRQ | 30 min | Complete FRQ simulation under AP exam conditions — individual |

**How it works:**
- Phase 1: Each student receives the same problem and works independently to organize the evidence
- Phase 2: All students come together (Zoom/live session) to collectively build the CERC argument
- Phase 3: Mid-collaboration, a curveball is introduced that changes the problem conditions
- Final: Students separate again and each completes their own FRQ under timed AP conditions

**Rationale:**
- Phase 1 (individual): Builds analytical skills
- Phase 2 (team): Fosters peer learning, exposes different reasoning approaches
- Phase 3 (curveball): Tests adaptability and condition-checking vigilance
- Final (individual): Simulates actual AP exam pressure

Full cohort works as ONE TEAM during Phase 2 only (not competing against each other).`;

// Read the file
let content = fs.readFileSync('./CLAUDE_AI_DOCX_INPUT.txt', 'utf-8');

// Find and replace the Boss Battle section
const oldSection = /### Week 4: Boss Battle Structure\n\nMulti-phase collaborative challenge:[\s\S]*?Full cohort works as ONE TEAM against the problem \(not competing against each other\)\./;

content = content.replace(oldSection, correctBossBattleSection);

// Also update the table in Week 2 summary
content = content.replace(
  /\| 4 \| Boss Battle \| Timed \(AP conditions\) \| Integrated FRQ synthesis \| \+150 XP for complete CERC \|/,
  '| 4 | Boss Battle | Individual + Team (hybrid) | Phase 1: Individual, Phase 2: Team CERC, Phase 3-4: Individual | +150 XP + "Boss Slayer" badge |'
);

// Update Week 5 Boss Battle description
content = content.replace(
  /\*\*Boss Battle Structure \(Tier A only\):\*\*\n- \*\*Phase 1 \(Individual, 15 min\):\*\* Untangle algebraic evidence\n- \*\*Phase 2 \(Team, 20 min\):\*\* Construct CERC argument collaboratively \(all 3 work together\)\n- \*\*Phase 3 \(Curveball\):\*\* Unexpected constraint introduced\n- \*\*Final \(Timed, 30 min\):\*\* Complete FRQ under AP conditions/,
  '**Boss Battle Structure (Tier A only):**\n\n| Phase | Format | Duration | Description |\n|-------|--------|----------|-------------|\n| 1 | Individual | 15 min | Each student untangles algebraic evidence alone |\n| 2 | Team | 20 min | Full cohort collaborates to construct CERC argument (Zoom session) |\n| 3 | Curveball | ~5 min | Unexpected constraint introduced |\n| Final | Individual | 30 min | Each student completes FRQ under AP timed conditions |'
);

// Save the updated file
fs.writeFileSync('./CLAUDE_AI_DOCX_INPUT.txt', content);

console.log('✅ Boss Battle section updated with correct structure');
console.log('   - Phase 1: Individual (15 min)');
console.log('   - Phase 2: Team collaboration (20 min)');
console.log('   - Phase 3: Curveball (~5 min)');
console.log('   - Final: Individual AP-timed (30 min)');
console.log('\n📄 Document ready: CLAUDE_AI_DOCX_INPUT.txt');
