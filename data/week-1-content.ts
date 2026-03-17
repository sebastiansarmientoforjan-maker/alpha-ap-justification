/**
 * Week 1: Error-Forcing Problems
 * Focus: Breaking empirical illusions - students learn that intuition can mislead
 * Scaffolding: Full CERC sentence frames
 */

export interface WeekProblem {
  id: string;
  title: string;
  statement: string;
  course: "calculus-ab" | "calculus-bc" | "statistics"; // Course-specific problems
  errorCategory: "CONDITION_BYPASS" | "LOCAL_ONLY_ARGUMENT" | "CER_BREAKDOWN";
  trap: string; // What happens if conditions aren't verified
  correctCERCResponse: {
    claim: string;
    evidence: string;
    reasoning: string;
    conditions: string;
  };
  sentenceFrames: {
    claim: string;
    evidence: string;
    reasoning: string;
    conditions: string;
  };
  theoremInfo: {
    name: string;
    statement: string;
    hypotheses: string[];
  };
  hints: {
    level1: string; // Location of flaw
    level2: string; // Which CERC element is broken
    level3: string; // Explicit correction
  };
}

export const week1Problems: WeekProblem[] = [
  // CALCULUS PROBLEMS
  {
    id: "w1-mvt-001",
    course: "calculus-bc", // Also suitable for AB
    title: "Mean Value Theorem: The Discontinuity Trap",
    statement: `Consider the function $f(x) = \\frac{1}{x^2}$ on the interval $[-1, 1]$.

**Task:** Apply the Mean Value Theorem to find a value $c$ in $(-1, 1)$ such that

$$f'(c) = \\frac{f(1) - f(-1)}{1 - (-1)}$$

Use the CERC framework to structure your argument. Explicitly verify all theorem conditions before drawing your conclusion.`,
    errorCategory: "CONDITION_BYPASS",
    trap: "The function is discontinuous at x=0, so MVT does not apply. Students who skip condition verification will attempt to solve algebraically and get confused when no solution exists.",
    correctCERCResponse: {
      claim: "The Mean Value Theorem does not apply to this problem. [AP Rubric: 1 point - Correct conclusion about theorem applicability]",
      evidence: "The function f(x) = 1/x² is undefined at x = 0, which lies in the interval [-1, 1]. Evaluating the difference quotient: (f(1) - f(-1))/(1-(-1)) = (1 - 1)/2 = 0. [AP Rubric: 1 point - Identifying the discontinuity and showing relevant calculations]",
      reasoning: "The Mean Value Theorem requires the function to be continuous on [a,b] and differentiable on (a,b). Since f is not continuous on [-1,1] (it has a discontinuity at x=0), the theorem's hypotheses are not satisfied. [AP Rubric: 1 point - Connecting the failed hypothesis to the conclusion]",
      conditions: "Checking continuity: f(x) = 1/x² is discontinuous at x = 0 because lim(x→0) f(x) = ∞ (the function is not defined at x=0). Therefore, the MVT cannot be applied. [AP Rubric: 1 point - Explicit verification with mathematical justification]",
    },
    sentenceFrames: {
      claim: "**Claim**: The Mean Value Theorem [applies / does not apply] to this function on [-1, 1] because...",
      evidence: "**Evidence**: We can verify that f(x) = 1/x² is [continuous / discontinuous] on [-1, 1] by checking... The difference quotient equals...",
      reasoning: "**Reasoning**: Since the MVT requires (1) continuity on [a,b] and (2) differentiability on (a,b), and we have shown that...",
      conditions: "**Conditions**: Checking the hypotheses explicitly: (1) Continuity on [-1,1]: ... ; (2) Differentiability on (-1,1): ...",
    },
    theoremInfo: {
      name: "Mean Value Theorem",
      statement: "If f is continuous on [a, b] and differentiable on (a, b), then there exists at least one point c in (a, b) such that f'(c) = (f(b) - f(a))/(b - a).",
      hypotheses: [
        "f is continuous on the closed interval [a, b]",
        "f is differentiable on the open interval (a, b)",
      ],
    },
    hints: {
      level1: "Check the domain of the function carefully. Is there any value in [-1, 1] where f(x) is not defined?",
      level2: "Your conditions section needs attention. You need to verify continuity on [a,b] before applying MVT. What happens at x = 0?",
      level3: "The function f(x) = 1/x² is discontinuous at x = 0, which is inside the interval [-1, 1]. Since continuity on [a,b] is a required hypothesis for MVT, the theorem does not apply. Your claim should state that MVT cannot be used here.",
    },
  },
  {
    id: "w1-ivt-001",
    course: "calculus-bc", // Also suitable for AB
    title: "Intermediate Value Theorem: The Jump Discontinuity",
    statement: `Let $g(x) = \\begin{cases} x^2 & \\text{if } x < 1 \\\\ 3 & \\text{if } x \\geq 1 \\end{cases}$ on the interval $[0, 2]$.

**Task:** Determine whether there exists a value $c$ in $(0, 2)$ such that $g(c) = 2$.

Use the CERC framework. Explicitly check whether the Intermediate Value Theorem applies.`,
    errorCategory: "CONDITION_BYPASS",
    trap: "The function has a jump discontinuity at x=1. Students who verify only that 2 is between g(0)=0 and g(2)=3 will incorrectly conclude that IVT guarantees a solution exists.",
    correctCERCResponse: {
      claim: "The Intermediate Value Theorem does not apply, so we cannot conclude that such a value c exists (though one does exist by direct observation, the IVT cannot be used to prove it). [AP Rubric: 1 point - Recognizing theorem does not apply with nuanced understanding]",
      evidence: "g(0) = 0² = 0, g(2) = 3, and 2 is between 0 and 3. However, g has a jump discontinuity at x = 1: lim(x→1⁻) g(x) = 1² = 1, but g(1) = 3. [AP Rubric: 1 point - Computing function values and identifying the discontinuity]",
      reasoning: "The IVT requires continuity on [a,b]. Since g is not continuous at x = 1 (which is in [0,2]), the hypothesis is violated and the theorem cannot be applied. [AP Rubric: 1 point - Stating theorem requirements and explaining why they fail]",
      conditions: "Checking continuity: g is continuous on [0,1) and on [1,2], but at x=1, lim(x→1⁻) g(x) = 1 ≠ 3 = g(1). Therefore g is not continuous on [0,2], and IVT does not apply. [AP Rubric: 1 point - Rigorous verification using limits]",
    },
    sentenceFrames: {
      claim: "**Claim**: By the Intermediate Value Theorem, there [exists / does not exist] a value c in (0, 2) such that g(c) = 2 because...",
      evidence: "**Evidence**: We observe that g(0) = ___ and g(2) = ___, and we want g(c) = ___. Checking continuity at x = 1: lim(x→1⁻) g(x) = ___ while g(1) = ___.",
      reasoning: "**Reasoning**: The IVT states that if f is continuous on [a,b] and N is between f(a) and f(b), then there exists c in (a,b) such that f(c) = N. However...",
      conditions: "**Conditions**: Verifying continuity on [0,2]: g is [continuous / has a discontinuity at x = ___] because...",
    },
    theoremInfo: {
      name: "Intermediate Value Theorem",
      statement: "If f is continuous on [a, b] and N is any number between f(a) and f(b), then there exists at least one number c in (a, b) such that f(c) = N.",
      hypotheses: [
        "f is continuous on the closed interval [a, b]",
        "N is between f(a) and f(b) (i.e., f(a) ≤ N ≤ f(b) or f(b) ≤ N ≤ f(a))",
      ],
    },
    hints: {
      level1: "Look carefully at what happens at x = 1. Is the function continuous there?",
      level2: "Your conditions section is incomplete. You need to verify that g is continuous on the entire interval [0, 2]. Check the limit from the left at x = 1.",
      level3: "The function has a jump discontinuity at x = 1 because lim(x→1⁻) g(x) = 1 but g(1) = 3. Since IVT requires continuity on [a,b], and g is not continuous on [0,2], the theorem does not apply. Note: A value c where g(c) = 2 does exist (any c in approximately (0, √2)), but IVT cannot be used to prove it.",
    },
  },
  {
    id: "w1-mvt-002",
    course: "calculus-bc", // Also suitable for AB
    title: "MVT: The Absolute Value Function",
    statement: `Consider the function $h(x) = |x|$ on the interval $[-2, 2]$.

**Task:** Use the Mean Value Theorem to find a value $c$ in $(-2, 2)$ such that

$$h'(c) = \\frac{h(2) - h(-2)}{2 - (-2)}$$

Apply the CERC framework and verify all conditions.`,
    errorCategory: "CONDITION_BYPASS",
    trap: "The function is continuous on [-2,2] but NOT differentiable at x=0. Students may verify continuity but forget to check differentiability.",
    correctCERCResponse: {
      claim: "The Mean Value Theorem does not apply to h(x) = |x| on [-2, 2]. [AP Rubric: 1 point - Correct conclusion]",
      evidence: "h(-2) = 2, h(2) = 2, so (h(2) - h(-2))/4 = 0. The function h is continuous everywhere, but at x = 0, the left derivative is -1 and the right derivative is +1. [AP Rubric: 1 point - Computing average rate and identifying non-differentiability]",
      reasoning: "MVT requires both continuity on [a,b] AND differentiability on (a,b). While h is continuous on [-2,2], it is not differentiable at x = 0 (which is in the open interval (-2,2)), so the theorem's hypotheses are not fully satisfied. [AP Rubric: 1 point - Explaining which hypothesis fails]",
      conditions: "Checking: (1) Continuity on [-2,2]: h is continuous everywhere. ✓ (2) Differentiability on (-2,2): h'(x) = -1 for x<0 and h'(x) = 1 for x>0, but h'(0) does not exist (sharp corner). ✗ Therefore MVT does not apply. [AP Rubric: 1 point - Systematic verification of both conditions]",
    },
    sentenceFrames: {
      claim: "**Claim**: The Mean Value Theorem [applies / does not apply] because...",
      evidence: "**Evidence**: Calculating the average rate of change: (h(2) - h(-2))/(2-(-2)) = ___. Examining differentiability at x = 0: the left derivative is ___ and the right derivative is ___.",
      reasoning: "**Reasoning**: MVT requires two conditions: continuity on [a,b] and differentiability on (a,b). We have shown that...",
      conditions: "**Conditions**: (1) Continuity: ___ ; (2) Differentiability: At x = 0, h'(0⁻) = ___ and h'(0⁺) = ___, so h'(0) [exists / does not exist].",
    },
    theoremInfo: {
      name: "Mean Value Theorem",
      statement: "If f is continuous on [a, b] and differentiable on (a, b), then there exists at least one point c in (a, b) such that f'(c) = (f(b) - f(a))/(b - a).",
      hypotheses: [
        "f is continuous on the closed interval [a, b]",
        "f is differentiable on the open interval (a, b)",
      ],
    },
    hints: {
      level1: "You've correctly verified continuity, but there's another hypothesis to check. Is h differentiable at every point in (-2, 2)?",
      level2: "Your conditions section is missing differentiability verification. Look at x = 0 specifically - what is h'(0)?",
      level3: "At x = 0, the function has a sharp corner. The derivative from the left is -1 and from the right is +1, so h'(0) does not exist. Since differentiability on (a,b) is required for MVT and h is not differentiable at x=0 ∈ (-2,2), the theorem does not apply.",
    },
  },

  // AP STATISTICS PROBLEMS
  {
    id: "w1-stats-001",
    course: "statistics",
    title: "Two-Sample t-Test: The Independence Trap",
    statement: `A researcher wants to test whether a new study technique improves test scores. She administers a pre-test to 20 students, then teaches them the new technique, then administers a post-test to the same 20 students.

**Data:**
- Mean pre-test score: 72.5
- Mean post-test score: 78.3
- Standard deviation of differences: 8.2

**Task:** The researcher proposes using a two-sample t-test to determine if the mean post-test score is significantly higher than the mean pre-test score. Use the CERC framework to evaluate whether this inference procedure is appropriate.`,
    errorCategory: "CONDITION_BYPASS",
    trap: "The two-sample t-test requires independent samples, but these are paired data (same students measured twice). Students who skip the independence condition will incorrectly apply the two-sample procedure instead of a paired t-test.",
    correctCERCResponse: {
      claim: "A two-sample t-test is not appropriate for these data. [AP Rubric: 1 point - Identifying incorrect procedure]",
      evidence: "The same 20 students were measured twice (pre-test and post-test). The data consist of paired observations, not two independent samples. The standard deviation of differences (8.2) has already been calculated, suggesting the data structure is paired. [AP Rubric: 1 point - Identifying data structure from context]",
      reasoning: "The two-sample t-test requires that the two samples be independent (observations in one group should not influence observations in the other group). Since these are measurements from the same students before and after the intervention, the samples are dependent, not independent. [AP Rubric: 1 point - Explaining why procedure doesn't match conditions]",
      conditions: "Checking independence: The pre-test and post-test scores come from the same 20 students, so they are clearly dependent (a student's pre-test score is likely related to their post-test score). This violates the independence condition required for a two-sample t-test. The correct procedure would be a paired t-test. [AP Rubric: 1 point - Explicit condition check with correct alternative]",
    },
    sentenceFrames: {
      claim: "**Claim**: A two-sample t-test [is / is not] appropriate for these data because...",
      evidence: "**Evidence**: Examining the study design: The same ___ students were measured [once / twice]. The data consist of [independent samples / paired observations] because...",
      reasoning: "**Reasoning**: The two-sample t-test requires that observations in one group be independent of observations in the other group. In this study...",
      conditions: "**Conditions**: Checking the independence condition: Are the two samples independent? The pre-test group and post-test group consist of...",
    },
    theoremInfo: {
      name: "Two-Sample t-Test",
      statement: "A two-sample t-test is used to determine whether there is a significant difference between the means of two independent groups. The test compares the sample means and accounts for sample variability.",
      hypotheses: [
        "The two samples must be independent (observations in one group should not be related to observations in the other group)",
        "The populations from which the samples are drawn should be approximately normal, or the sample sizes should be large enough (n ≥ 30) for the Central Limit Theorem to apply",
        "The samples should be random samples from their respective populations",
      ],
    },
    hints: {
      level1: "Look carefully at how the data were collected. Were two different groups of students tested, or were the same students tested twice?",
      level2: "Your conditions section needs to address independence. Check whether the pre-test scores and post-test scores come from independent samples or from the same students.",
      level3: "The same 20 students were measured twice (pre and post). This creates paired/dependent data, not independent samples. The two-sample t-test requires independence, so it cannot be used here. The correct procedure is a paired t-test, which accounts for the dependency in the data.",
    },
  },
  {
    id: "w1-stats-002",
    course: "statistics",
    title: "Hypothesis Test: The Sample Size Trap",
    statement: `A quality control manager claims that the mean weight of cereal boxes is 500 grams. A random sample of n = 8 boxes has a mean weight of 495 grams with a standard deviation of 12 grams. The distribution of the sample data appears skewed to the left.

**Task:** Determine whether a one-sample t-test can be used to test the manager's claim at the α = 0.05 significance level. Use the CERC framework to justify your answer.`,
    errorCategory: "CONDITION_BYPASS",
    trap: "Students may proceed with the t-test without verifying normality. With n = 8 (small sample) and skewed data, the normality condition is violated, making the t-test invalid.",
    correctCERCResponse: {
      claim: "A one-sample t-test should not be used for these data. [AP Rubric: 1 point - Correct conclusion about procedure appropriateness]",
      evidence: "The sample size is n = 8, which is small. The sample data appear skewed to the left, indicating the distribution is not approximately normal. The normality condition is not satisfied. [AP Rubric: 1 point - Identifying relevant sample characteristics]",
      reasoning: "The one-sample t-test requires that either the population is approximately normal, or the sample size is large enough (n ≥ 30) for the Central Limit Theorem to ensure the sampling distribution is approximately normal. With n = 8 and skewed data, neither condition is met. [AP Rubric: 1 point - Explaining connection between conditions and conclusion]",
      conditions: "Checking normality: The sample size n = 8 is small (< 30), so we cannot rely on CLT. The data are described as skewed, so the population is not approximately normal. Therefore, the normality condition required for the t-test is not satisfied. [AP Rubric: 1 point - Systematic check of both normality pathways]",
    },
    sentenceFrames: {
      claim: "**Claim**: A one-sample t-test [can / should not] be used because...",
      evidence: "**Evidence**: The sample size is n = ___. The distribution of the sample data is described as [approximately normal / skewed]. For small samples, we need...",
      reasoning: "**Reasoning**: The t-test requires that the population be approximately normal OR that the sample size be large enough (n ≥ 30) for CLT. In this case...",
      conditions: "**Conditions**: Checking normality/sample size: Is n ≥ 30? ___ Is the population approximately normal? The data are ___, so...",
    },
    theoremInfo: {
      name: "One-Sample t-Test",
      statement: "A one-sample t-test is used to determine whether a sample mean differs significantly from a hypothesized population mean.",
      hypotheses: [
        "The sample must be a random sample from the population",
        "The population from which the sample is drawn should be approximately normal, OR the sample size should be large (n ≥ 30) for the Central Limit Theorem to apply",
        "The observations must be independent",
      ],
    },
    hints: {
      level1: "Check the sample size. Is it large enough to rely on the Central Limit Theorem? If not, what do you need to verify?",
      level2: "Your conditions section should address normality. With n = 8 (small sample), can you use CLT? What does the problem say about the distribution shape?",
      level3: "The sample size n = 8 is too small to invoke CLT (which requires n ≥ 30). Since the data are skewed (not approximately normal), the normality condition for the t-test is violated. You should not proceed with the t-test. A non-parametric test (like the sign test) would be more appropriate here.",
    },
  },
  {
    id: "w1-stats-003",
    course: "statistics",
    title: "Confidence Interval: The Random Sampling Trap",
    statement: `A school administrator wants to estimate the mean number of hours students at her high school spend on homework per week. She surveys the 25 students in her AP Statistics class and finds a mean of 12.5 hours with a standard deviation of 3.2 hours.

**Task:** The administrator proposes constructing a 95% confidence interval using these data to estimate the mean homework time for all students at the school. Use the CERC framework to evaluate whether this procedure is appropriate.`,
    errorCategory: "CONDITION_BYPASS",
    trap: "Students may focus on checking normality/sample size but miss the critical flaw: the sample is not random. AP Statistics students are not representative of all students - using them creates sampling bias.",
    correctCERCResponse: {
      claim: "It is not appropriate to construct a confidence interval using these data to make inferences about all students at the school. [AP Rubric: 1 point - Recognizing sampling bias invalidates inference]",
      evidence: "The sample consists only of students in the AP Statistics class. AP Statistics students are likely not representative of all students at the school (they may be more academically motivated, take more rigorous courses, etc.). The sample was not randomly selected from the population of all students. [AP Rubric: 1 point - Explaining why sample is not representative]",
      reasoning: "Confidence intervals are valid for making inferences about a population only when the sample is a random sample from that population. A non-random sample may suffer from sampling bias, where certain characteristics are over- or under-represented. Since AP Statistics students are not a random sample, the confidence interval will not accurately reflect the true mean for all students. [AP Rubric: 1 point - Connecting lack of randomness to validity of inference]",
      conditions: "Checking random sampling: The sample was taken from one specific class (AP Statistics), not randomly selected from all students at the school. This is a convenience sample, not a random sample. Therefore, the random sampling condition required for valid inference is violated, and the confidence interval should not be used to generalize to all students. [AP Rubric: 1 point - Explicit verification of random sampling condition]",
    },
    sentenceFrames: {
      claim: "**Claim**: It [is / is not] appropriate to use these data to construct a confidence interval for all students because...",
      evidence: "**Evidence**: The sample consists of students from [a random sample of all students / one AP Statistics class]. AP Statistics students may differ from the general student population in...",
      reasoning: "**Reasoning**: For a confidence interval to provide valid inference about a population, the sample must be a random sample. A non-random sample may introduce bias because...",
      conditions: "**Conditions**: Checking random sampling: Was the sample randomly selected from all students? The sample came from ___, which [is / is not] a random sample because...",
    },
    theoremInfo: {
      name: "Confidence Interval for a Mean",
      statement: "A confidence interval provides a range of plausible values for an unknown population parameter (such as a population mean) based on sample data.",
      hypotheses: [
        "The sample must be a random sample from the population of interest",
        "The population should be approximately normal OR the sample size should be large enough (n ≥ 30) for CLT to apply",
        "The observations must be independent (typically satisfied if sample size is less than 10% of population size)",
      ],
    },
    hints: {
      level1: "Think about how the sample was collected. Does the AP Statistics class represent a random sample of all students at the school?",
      level2: "Your conditions section should address random sampling. Consider whether AP Statistics students are typical of all students at the school in terms of homework hours.",
      level3: "The sample was taken only from the AP Statistics class, which is a convenience sample, not a random sample. AP Statistics students are likely not representative of all students (they may spend more time on homework due to taking more rigorous courses). Without random sampling, the confidence interval cannot be used to make valid inferences about all students at the school.",
    },
  },
];

export const week1Config = {
  weekNumber: 1,
  title: "Error-Forcing Problems",
  focus: "Breaking empirical illusions - learning to identify when theorems cannot be applied",
  scaffoldingLevel: "full" as const,
  description: `This week challenges your intuition. Each problem looks solvable at first glance, but something is wrong.

Your task: **identify the trap** before falling into it. This is where mathematical rigor separates correct reasoning from convincing-but-wrong arguments.

**Course-Adaptive:** Problems are tailored to your AP course (Calculus or Statistics). You'll work with the theorems and inference procedures specific to your class.

By the end of this week, you'll instinctively check theorem conditions before applying them - the foundation of formal mathematical reasoning.`,
  objectives: [
    "Recognize that theorems/procedures have hypotheses/conditions that MUST be verified",
    "Identify when critical conditions are violated (Calculus: continuity/differentiability; Statistics: independence/randomness/normality)",
    "Distinguish between 'the answer exists' and 'the theorem/procedure applies'",
    "Use the CERC framework with full sentence frames",
  ],
  estimatedTime: "15-20 minutes per problem",
  problems: week1Problems,
};
