import { ReasoningStage, CERCScaffolding, ScaffoldingLevel, ContentLink } from "@/lib/types";

/**
 * Generates CERC scaffolding based on student's reasoning stage
 * Full → Structural → Minimal → None as student progresses
 */
export function generateCERCScaffolding(
  reasoningStage: ReasoningStage,
  topic: string
): CERCScaffolding {
  const level = getScaffoldingLevel(reasoningStage);

  switch (level) {
    case "full":
      return {
        level: "full",
        sentenceFrames: getFullSentenceFrames(topic),
        theoremHints: getTheoremHints(topic),
      };

    case "structural":
      return {
        level: "structural",
        sentenceFrames: undefined, // No sentence frames, just structure
        theoremHints: getTheoremHints(topic),
      };

    case "minimal":
      return {
        level: "minimal",
        sentenceFrames: undefined,
        theoremHints: [getMinimalHint(topic)],
      };

    case "none":
      return {
        level: "none",
        sentenceFrames: undefined,
        theoremHints: undefined,
      };
  }
}

function getScaffoldingLevel(reasoningStage: ReasoningStage): ScaffoldingLevel {
  switch (reasoningStage) {
    case "empirical":
      return "full";
    case "generic":
      return "structural";
    case "formal":
      return "minimal";
  }
}

/**
 * Full sentence frames for empirical-stage students
 */
function getFullSentenceFrames(topic: string): string[] {
  const topicLower = topic.toLowerCase();

  // MVT-related topics
  if (
    topicLower.includes("mean value") ||
    topicLower.includes("mvt") ||
    topicLower.includes("derivative") ||
    topicLower.includes("rate of change")
  ) {
    return [
      "**Claim**: The Mean Value Theorem [applies / does not apply] to this function because...",
      "**Evidence**: We can verify that f(x) = ___ is [continuous / discontinuous] on [a, b] by checking...",
      "**Reasoning**: Since the MVT requires (1) continuity on [a,b] and (2) differentiability on (a,b), and we have shown that...",
      "**Conditions**: Checking the hypotheses explicitly: (1) Continuity on [a,b]: ___ ; (2) Differentiability on (a,b): ___",
    ];
  }

  // IVT-related topics
  if (
    topicLower.includes("intermediate value") ||
    topicLower.includes("ivt") ||
    topicLower.includes("continuity") ||
    topicLower.includes("existence")
  ) {
    return [
      "**Claim**: By the Intermediate Value Theorem, there [exists / does not exist] a value c in (a, b) such that...",
      "**Evidence**: We observe that f(a) = ___ and f(b) = ___, and we want f(c) = ___",
      "**Reasoning**: The IVT states that if f is continuous on [a,b] and N is between f(a) and f(b), then...",
      "**Conditions**: Verifying continuity on [a,b]: f is [continuous / has a discontinuity at x = ___] because...",
    ];
  }

  // FTC-related topics
  if (
    topicLower.includes("fundamental theorem") ||
    topicLower.includes("ftc") ||
    topicLower.includes("integral") ||
    topicLower.includes("antiderivative")
  ) {
    return [
      "**Claim**: Using the Fundamental Theorem of Calculus, we can evaluate this integral as...",
      "**Evidence**: The antiderivative F(x) of f(x) is ___, so F(b) - F(a) = ___",
      "**Reasoning**: The FTC Part 1 states that if f is continuous on [a,b], then...",
      "**Conditions**: Checking that f(x) is continuous on [a,b]: ___",
    ];
  }

  // Related Rates
  if (
    topicLower.includes("related rate") ||
    topicLower.includes("chain rule") ||
    topicLower.includes("implicit")
  ) {
    return [
      "**Claim**: The rate of change of ___ with respect to time is...",
      "**Evidence**: Setting up the equation relating the variables: ___. Taking the derivative with respect to t: ___",
      "**Reasoning**: By the chain rule, d/dt[___] = ___ because...",
      "**Conditions**: We assume that ___ is differentiable with respect to time and that...",
    ];
  }

  // Default CERC frames
  return [
    "**Claim**: [State your conclusion clearly]",
    "**Evidence**: [Show the relevant calculations and data]",
    "**Reasoning**: [Explain which theorem or principle connects your evidence to your claim]",
    "**Conditions**: [Verify explicitly that all theorem hypotheses are satisfied]",
  ];
}

/**
 * Theorem hints for structural scaffolding
 */
function getTheoremHints(topic: string): string[] {
  const topicLower = topic.toLowerCase();

  if (topicLower.includes("mean value") || topicLower.includes("mvt")) {
    return [
      "Recall: MVT requires continuity on [a,b] AND differentiability on (a,b)",
      "Check for discontinuities (division by zero, jumps, asymptotes)",
      "Verify differentiability at all points in the open interval",
    ];
  }

  if (topicLower.includes("intermediate value") || topicLower.includes("ivt")) {
    return [
      "Recall: IVT requires continuity on [a,b]",
      "Check if the target value N is between f(a) and f(b)",
      "Look for discontinuities on the closed interval",
    ];
  }

  if (topicLower.includes("fundamental theorem") || topicLower.includes("ftc")) {
    return [
      "Recall: FTC requires f to be continuous on [a,b]",
      "Find the antiderivative F(x) of f(x)",
      "Evaluate F(b) - F(a)",
    ];
  }

  if (topicLower.includes("related rate")) {
    return [
      "Set up the equation relating all variables",
      "Differentiate both sides with respect to time (implicit differentiation)",
      "Plug in known values and solve for the unknown rate",
    ];
  }

  if (topicLower.includes("derivative") || topicLower.includes("differentiation")) {
    return [
      "State the derivative definition or rule you're using",
      "Show all algebraic steps",
      "Verify any conditions needed for the rule to apply",
    ];
  }

  if (topicLower.includes("integral") || topicLower.includes("integration")) {
    return [
      "Identify the integration technique (substitution, parts, etc.)",
      "Show setup and all steps",
      "Verify bounds and evaluate carefully",
    ];
  }

  if (topicLower.includes("limit")) {
    return [
      "Check if direct substitution works",
      "Identify indeterminate forms",
      "Apply appropriate technique (factoring, L'Hôpital, etc.)",
    ];
  }

  // Default hints
  return [
    "Identify which theorem or principle applies",
    "State the theorem's hypotheses explicitly",
    "Verify each hypothesis before applying the conclusion",
  ];
}

/**
 * Minimal hint for formal-stage students
 */
function getMinimalHint(topic: string): string {
  const topicLower = topic.toLowerCase();

  if (topicLower.includes("mean value") || topicLower.includes("mvt")) {
    return "Remember to verify MVT hypotheses before applying.";
  }

  if (topicLower.includes("intermediate value") || topicLower.includes("ivt")) {
    return "Check continuity on [a,b] explicitly.";
  }

  if (topicLower.includes("fundamental theorem") || topicLower.includes("ftc")) {
    return "Verify continuity before using FTC.";
  }

  return "Apply the CERC framework: state hypotheses, verify conditions, then conclude.";
}

/**
 * Determine which week content is most relevant for a topic
 */
export function determineRelevantWeek(topic: string): number {
  const topicLower = topic.toLowerCase();

  // Week 1: Error-forcing problems (MVT, IVT traps)
  if (
    topicLower.includes("mean value") ||
    topicLower.includes("intermediate value") ||
    topicLower.includes("condition")
  ) {
    return 1;
  }

  // Week 2: Condition verification (MVT/IVT/EVT/FTC)
  if (
    topicLower.includes("verify") ||
    topicLower.includes("hypothesis") ||
    topicLower.includes("fundamental theorem")
  ) {
    return 2;
  }

  // Week 3: Global argumentation + communication
  if (
    topicLower.includes("justify") ||
    topicLower.includes("explain") ||
    topicLower.includes("communicate")
  ) {
    return 3;
  }

  // Week 4: Integrated synthesis (defaults here)
  return 4;
}

/**
 * Generate content links for a topic
 */
export function generateContentLinks(topic: string): ContentLink[] {
  const topicLower = topic.toLowerCase();
  const links: ContentLink[] = [];

  if (topicLower.includes("mean value") || topicLower.includes("mvt")) {
    links.push({
      weekNumber: 1,
      section: "Error-Forcing Problems",
      concept: "MVT condition trap: What happens when continuity fails",
    });
    links.push({
      weekNumber: 2,
      section: "Condition Verification",
      concept: "Explicitly checking MVT hypotheses (continuity + differentiability)",
    });
  }

  if (topicLower.includes("intermediate value") || topicLower.includes("ivt")) {
    links.push({
      weekNumber: 1,
      section: "Error-Forcing Problems",
      concept: "IVT failure: Discontinuity breaks the theorem",
    });
    links.push({
      weekNumber: 2,
      section: "Condition Verification",
      concept: "Verifying continuity on closed intervals",
    });
  }

  if (topicLower.includes("fundamental theorem") || topicLower.includes("ftc")) {
    links.push({
      weekNumber: 2,
      section: "Condition Verification",
      concept: "FTC Part 1: Continuity requirement",
    });
  }

  if (topicLower.includes("related rate")) {
    links.push({
      weekNumber: 2,
      section: "Chain Rule Application",
      concept: "Implicit differentiation with respect to time",
    });
    links.push({
      weekNumber: 3,
      section: "Communication Precision",
      concept: "Stating assumptions and defining variables clearly",
    });
  }

  // Always include Week 3 for communication if no links yet
  if (links.length === 0) {
    links.push({
      weekNumber: 3,
      section: "Global Argumentation",
      concept: "Applying CERC framework to any problem",
    });
  }

  return links;
}
