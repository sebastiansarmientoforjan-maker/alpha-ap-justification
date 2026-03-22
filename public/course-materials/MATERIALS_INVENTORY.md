# Course Materials Inventory
**Last Updated:** 2026-03-22
**Status:** 12/12 Infographics ✓ | 5/12 Videos (7 pending)

## 📊 MATERIALS BY COURSE

### AP CALCULUS AB (4 weeks)

**Week 1: Error-Forcing Problems**
- ✅ Infographic: `mvt-ivt-evt-traps.png` (5.8MB)
- ⏳ Video: Pending (generate tomorrow)

**Week 2: Rigorous Verification**
- ✅ Infographic: `rigorous-proof-guide.png` (5.6MB)
- ✅ Video: `complete-ivt-proofs.mp4` (36MB)

**Week 3: Synthesis Without Scaffolding**
- ✅ Infographic: `multi-concept-integration.png` (5.3MB)
- ✅ Video: `multi-concept-synthesis.mp4` (31MB)

**Week 4: Boss Battle**
- ✅ Infographic: `boss-battle-challenge.png` (5.6MB)
- ⏳ Video: Pending (generate tomorrow)

---

### AP CALCULUS BC (4 weeks)

**Week 1: Advanced Error-Forcing**
- ✅ Infographic: `series-parametric-traps.png` (5.7MB)
- ⏳ Video: Pending (generate tomorrow)

**Week 2: Series Convergence Proofs**
- ✅ Infographic: `series-convergence-proofs.png` (5.1MB)
- ✅ Video: `series-convergence-system.mp4` (40MB)

**Week 3: BC Synthesis**
- ✅ Infographic: `synthesis-without-scaffolding.png` (5.1MB)
- ✅ Video: `parametric-arc-length.mp4` (34MB)

**Week 4: BC Boss Battle**
- ✅ Infographic: `polar-curve-challenge.png` (5.6MB)
- ⏳ Video: Pending (generate tomorrow)

---

### AP STATISTICS (4 weeks)

**Week 1: Inference Assumptions**
- ✅ Infographic: `randomness-illusion-guide.png` (5.4MB)
- ✅ Video: `identifying-random-samples.mp4` (42MB)

**Week 2: Condition Verification**
- ✅ Infographic: `inference-conditions-checklist.png` (5.3MB)
- ⏳ Video: Pending (generate tomorrow)

**Week 3: Causation vs Correlation**
- ✅ Infographic: `causation-vs-correlation.png` (5.7MB)
- ⏳ Video: Pending (generate tomorrow)

**Week 4: Study Critique Boss Battle**
- ✅ Infographic: `study-critique-challenge.png` (5.4MB)
- ⏳ Video: Pending (generate tomorrow)

---

## 📁 FOLDER STRUCTURE

```
public/course-materials/
├── calculus-ab/
│   ├── week1/ (infographics/, videos/)
│   ├── week2/ (infographics/, videos/)
│   ├── week3/ (infographics/, videos/)
│   └── week4/ (infographics/, videos/)
├── calculus-bc/
│   ├── week1/ (infographics/, videos/)
│   ├── week2/ (infographics/, videos/)
│   ├── week3/ (infographics/, videos/)
│   └── week4/ (infographics/, videos/)
└── statistics/
    ├── week1/ (infographics/, videos/)
    ├── week2/ (infographics/, videos/)
    ├── week3/ (infographics/, videos/)
    └── week4/ (infographics/, videos/)
```

---

## ⏰ PENDING (7 videos - Generate Tomorrow)

**NotebookLM rate limit hit today (6 videos generated)**
**Next batch:** 2026-03-22 (after 24h cooldown)

1. AB Week 1: MVT/IVT verification video
2. AB Week 4: Boss Battle preparation guide
3. BC Week 1: Series convergence traps video
4. BC Week 4: Polar challenge Boss Battle
5. Stats Week 2: Inference conditions video
6. Stats Week 3: Causation analysis video
7. Stats Week 4: Study critique Boss Battle

**Strategy for tomorrow:**
- Space video requests 30-60 min apart
- Use `--retry 5` flag
- Monitor rate limit carefully
- Generate 1 video at a time

---

## 📊 TOTAL SIZE

- Infographics: ~66MB (12 files × 5.5MB avg)
- Videos: ~183MB (5 files × 36.6MB avg)
- **Total:** ~249MB

---

## 🎯 USAGE IN NEXT.JS APP

```typescript
// Example: Load Week 1 AB materials
const week1ABInfographic = "/course-materials/calculus-ab/week1/infographics/mvt-ivt-evt-traps.png";
const week2ABVideo = "/course-materials/calculus-ab/week2/videos/complete-ivt-proofs.mp4";

// Dynamic import by course and week
function getMaterials(course: 'calculus-ab' | 'calculus-bc' | 'statistics', week: 1 | 2 | 3 | 4) {
  return {
    infographic: `/course-materials/${course}/week${week}/infographics/`,
    video: `/course-materials/${course}/week${week}/videos/`
  };
}
```

---

## ✅ READY FOR USE

**All 3 courses have complete Week 1-4 infographics**
**Videos available for Week 2-3 (most critical content weeks)**

Students can start Week 1 with infographics only, videos will be added tomorrow.
