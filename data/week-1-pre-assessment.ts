/**
 * Week 1 Pre-Assessment
 * Quick diagnostic to assess current reasoning stage
 * Duration: 2-3 minutes
 */

export interface PreAssessmentQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "yes-no" | "scale";
  options?: string[];
  correctAnswer?: string;
  reasoningStageIndicator: {
    empirical?: string[];
    generic?: string[];
    formal?: string[];
  };
}

export const week1PreAssessment = {
  title: "Quick Diagnostic: Your Reasoning Stage",
  description: "This 2-minute assessment helps us understand your current approach to justification. There are no wrong answers—just honest ones!",
  duration: "2-3 minutes",
  totalQuestions: 5,

  questions: [
    {
      id: "q1",
      question: "When applying the Mean Value Theorem, do you verify that the function is continuous on [a,b] BEFORE calculating?",
      type: "yes-no",
      options: ["Always", "Sometimes", "Rarely", "Never"],
      reasoningStageIndicator: {
        empirical: ["Rarely", "Never"],
        generic: ["Sometimes"],
        formal: ["Always"],
      },
      weight: 2, // Higher weight = more important indicator
    },

    {
      id: "q2",
      question: "A classmate says: 'By MVT, there exists c where f'(c) = 0.' What's your first thought?",
      type: "multiple-choice",
      options: [
        "A) Sounds right—MVT guarantees a solution exists",
        "B) Wait, did they check if f is continuous and differentiable?",
        "C) I'd verify the conditions myself before agreeing",
        "D) I don't know what MVT requires",
      ],
      correctAnswer: "C",
      reasoningStageIndicator: {
        empirical: ["A", "D"],
        generic: ["B"],
        formal: ["C"],
      },
      weight: 3,
    },

    {
      id: "q3",
      question: "You're solving an AP FRQ that says 'Justify your answer.' How much of your response focuses on verifying theorem conditions?",
      type: "scale",
      options: [
        "I skip it—just state the theorem name",
        "1-2 sentences mentioning conditions",
        "About half my response—I check most conditions",
        "Most of my response—I explicitly verify EVERY hypothesis",
      ],
      reasoningStageIndicator: {
        empirical: ["I skip it—just state the theorem name"],
        generic: ["1-2 sentences mentioning conditions", "About half my response—I check most conditions"],
        formal: ["Most of my response—I explicitly verify EVERY hypothesis"],
      },
      weight: 3,
    },

    {
      id: "q4",
      question: "When a problem asks 'Does the Intermediate Value Theorem guarantee a solution?', what do you check first?",
      type: "multiple-choice",
      options: [
        "A) Whether the desired value is between f(a) and f(b)",
        "B) Whether f is continuous on [a,b]",
        "C) Both—IVT needs continuity AND the intermediate value condition",
        "D) I'm not sure what IVT requires",
      ],
      correctAnswer: "C",
      reasoningStageIndicator: {
        empirical: ["A", "D"],
        generic: ["B"],
        formal: ["C"],
      },
      weight: 2,
    },

    {
      id: "q5",
      question: "A function is continuous on [-2, 2] but NOT differentiable at x=0. Can you apply MVT on this interval?",
      type: "multiple-choice",
      options: [
        "A) Yes—continuity is enough",
        "B) No—MVT needs differentiability on (a,b), and 0 is in (-2,2)",
        "C) Maybe—depends on what the problem asks",
        "D) I don't know what MVT requires",
      ],
      correctAnswer: "B",
      reasoningStageIndicator: {
        empirical: ["A", "C", "D"],
        generic: ["B (but not confident)"],
        formal: ["B"],
      },
      weight: 3,
    },
  ],

  // Scoring rubric
  scoring: {
    empirical: {
      range: [0, 5],
      label: "Empirical Reasoning",
      description: "You currently rely on intuition and examples. Week 1 will teach you to systematically verify conditions.",
      color: "red",
    },
    generic: {
      range: [6, 10],
      label: "Generic Reasoning",
      description: "You're starting to check conditions but not consistently. Week 1 will build the habit of rigorous verification.",
      color: "yellow",
    },
    formal: {
      range: [11, 15],
      label: "Formal Reasoning",
      description: "You already verify conditions carefully. Week 1 will refine your precision and introduce edge cases.",
      color: "green",
    },
  },

  // Adaptive scaffolding based on results
  scaffoldingRecommendations: {
    empirical: {
      sentenceFrames: "Full sentence frames with every field",
      hints: "Show Level 1 hints proactively",
      feedback: "Extra detail on what conditions are and why they matter",
    },
    generic: {
      sentenceFrames: "Partial frames (structural outline)",
      hints: "Make hints available but don't push",
      feedback: "Focus on consistency and completeness",
    },
    formal: {
      sentenceFrames: "Minimal scaffolding (just CERC labels)",
      hints: "Only on request",
      feedback: "Challenge precision and edge case handling",
    },
  },
};

export default week1PreAssessment;
