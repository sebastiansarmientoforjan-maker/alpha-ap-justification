# Claude Vision FRQ Grading System

## Overview

The system uses **Claude Opus 4.6 Vision** to automatically grade handwritten AP Calculus/Statistics FRQ submissions using the CERC framework.

## How It Works

### 1. Student Workflow
```
Student solves FRQ on paper
    ↓
Takes photo with phone/scanner
    ↓
Uploads to system
    ↓
Completes self-evaluation (0-9 scale)
    ↓
Submits
```

### 2. Admin Grading Workflow

**Option A: Claude Vision AI (Automatic)**
```
Admin opens "Grade FRQ" modal
    ↓
Clicks "AI Grade with Claude Vision"
    ↓
Claude reads handwritten work
    ↓
Applies CERC rubric automatically
    ↓
Pre-populates:
  - AI Output (detailed CERC analysis)
  - Score (0-9)
  - 3 Action Points
    ↓
Admin reviews/edits
    ↓
Saves & delivers to student
```

**Option B: External Grader (Manual)**
```
Admin downloads student's photo
    ↓
Uploads to MathGrader.AI or other external tool
    ↓
Copies output back to system
    ↓
Manually enters score & action points
    ↓
Saves & delivers to student
```

## CERC Rubric (9 points total)

Claude applies this rubric automatically:

### Claim (0-3 points)
- **3**: States conclusion clearly and precisely
- **2**: States conclusion with minor ambiguity
- **1**: States conclusion but lacks precision
- **0**: No clear claim or incorrect claim

### Evidence (0-3 points)
- **3**: Shows all relevant calculations with proper notation
- **2**: Shows most calculations, minor notation issues
- **1**: Shows some work but incomplete or unclear
- **0**: No supporting calculations or all incorrect

### Reasoning (0-2 points)
- **2**: Explicitly connects evidence to claim using correct theorem/principle
- **1**: Makes connection but not explicit or minor errors
- **0**: No logical connection or incorrect reasoning

### Conditions (0-1 point)
- **1**: Explicitly verifies all theorem hypotheses/conditions
- **0**: Does not verify conditions or verification is incorrect

## Reasoning Stage Detection

Claude also identifies the student's reasoning stage:

- **Empirical**: Relies only on examples, numerical verification, or graphs
- **Generic**: Uses general algebraic manipulation but doesn't cite theorems
- **Formal**: Explicitly invokes theorems and verifies hypotheses deductively

## Claude Vision Capabilities

✅ **Can Do:**
- Read handwritten calculus notation (derivatives, integrals, limits)
- Understand mathematical diagrams and graphs
- Process multi-page PDFs
- Analyze argument structure and logic
- Apply complex rubrics consistently
- Identify missing theorem verification
- Detect reasoning stage (empirical/generic/formal)

⚠️ **Best Practices:**
- Ensure legible handwriting (dark pen/pencil on white paper)
- Good lighting, perpendicular angle
- High-resolution photos (at least 1200x800px)
- Flat page, no shadows or overlapping pages
- Clearly separated parts (a/b/c/d) if multi-part problem

## API Usage & Costs

**Model**: Claude Opus 4.6 (best for complex grading)

**Pricing** (as of March 2025):
- Input: $15 / 1M tokens
- Output: $75 / 1M tokens
- Images: ~$7.50 per 1000 images

**Real-world cost example:**
- 10 students × 1 FRQ/week × 4 weeks = 40 submissions
- Estimated cost: **~$0.30 total** ($0.0075 per grading)

Compare to:
- MathGrader.AI: $20-50/month subscription
- Manual grading: 15-20 min per FRQ × 40 = 10-13 hours

## Implementation Status

### ✅ Completed
- Claude Vision service (`services/ai/claude-grader.ts`)
- AI grading API endpoint (`/api/admin/frq/ai-grade`)
- Grade FRQ Modal with "AI Grade" button
- CERC rubric application
- Reasoning stage detection
- Action points generation

### 🚧 In Progress
- Firebase Storage image fetching (currently using mock URLs)
- Real base64 conversion from uploaded photos

### 📋 Future Enhancements
- Batch grading (multiple students at once)
- Rubric customization per assignment
- Comparison view (Student self-eval vs AI vs Teacher final)
- Historical accuracy tracking (AI vs teacher grades)
- Student-facing partial AI feedback (hints without full solution)

## Environment Setup

Requires `ANTHROPIC_API_KEY` in `.env.local`:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
```

Get your API key at: https://console.anthropic.com/

## Testing

To test Claude Vision grading without real images:

1. Use the mock data submissions (Ananya's FRQ is in "submitted" status)
2. Click "Grade with AI" in the Grade FRQ Modal
3. System will show error about image fetching (expected for mock data)
4. For real testing, upload an actual handwritten FRQ photo

## Comparison: Claude vs MathGrader.AI

| Feature | Claude Vision (Internal) | MathGrader.AI (External) |
|---------|-------------------------|--------------------------|
| **AP-specific prompts** | ✅ Custom CERC/Harel | ⚠️ Generic math rubrics |
| **Reasoning stage** | ✅ Automatic detection | ❌ Not included |
| **Cost (40 submissions)** | ~$0.30 | $20-50/month |
| **Control** | ✅ Full prompt control | ❌ Vendor-dependent |
| **Privacy** | ✅ Direct Anthropic API | ⚠️ Third-party service |
| **Iteration speed** | ✅ Instant prompt updates | ❌ Slow (vendor updates) |
| **OCR Quality** | ✅ Native vision | ✅ Specialized math OCR |

## Support & Resources

- Anthropic Claude Vision docs: https://docs.anthropic.com/claude/docs/vision
- CERC Framework reference: `/CLAUDE.md`
- AP Calculus rubrics: College Board official guides
