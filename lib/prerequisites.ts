/**
 * Prerequisites Logic
 * Determines if student can receive FRQ assignments based on training problem completion
 */

import { StudentWeekSummary } from "./types/week-progress";

export interface PrerequisiteCheck {
  canReceiveFRQ: boolean;
  reason: string;
  weekNumber: number;
  problemsCompleted: number;
  problemsRequired: number;
}

/**
 * Check if student meets prerequisites for FRQ assignment
 *
 * Rules:
 * - Week 1: Must complete 2 of 3 training problems
 * - Week 2: Must complete 2 of 3 training problems
 * - Week 3: Must complete 2 of 3 training problems
 * - Week 4: Must complete all previous weeks
 */
export function checkFRQPrerequisites(
  studentId: string,
  weekNumber: number,
  weekSummary: StudentWeekSummary
): PrerequisiteCheck {
  // Define requirements per week
  const REQUIRED_PROBLEMS = 2; // Minimum problems to complete per week
  const TOTAL_PROBLEMS = 3; // Total problems available per week (for Week 1)

  const problemsCompleted = weekSummary.problemsCompleted;

  // Check if student has completed enough problems
  if (problemsCompleted < REQUIRED_PROBLEMS) {
    return {
      canReceiveFRQ: false,
      reason: `Complete at least ${REQUIRED_PROBLEMS} training problems in Week ${weekNumber} first. Currently: ${problemsCompleted}/${TOTAL_PROBLEMS}`,
      weekNumber,
      problemsCompleted,
      problemsRequired: REQUIRED_PROBLEMS,
    };
  }

  // Prerequisites met
  return {
    canReceiveFRQ: true,
    reason: `Prerequisites met: ${problemsCompleted}/${TOTAL_PROBLEMS} problems completed`,
    weekNumber,
    problemsCompleted,
    problemsRequired: REQUIRED_PROBLEMS,
  };
}

/**
 * Check prerequisites for multiple weeks (for Week 4 Boss Battle)
 */
export function checkMultiWeekPrerequisites(
  weekSummaries: Record<number, StudentWeekSummary>,
  targetWeek: number
): PrerequisiteCheck {
  const REQUIRED_PER_WEEK = 2;

  // Check all previous weeks
  for (let week = 1; week < targetWeek; week++) {
    const summary = weekSummaries[week];
    if (!summary || summary.problemsCompleted < REQUIRED_PER_WEEK) {
      return {
        canReceiveFRQ: false,
        reason: `Complete Week ${week} training (${summary?.problemsCompleted || 0}/${REQUIRED_PER_WEEK} done)`,
        weekNumber: week,
        problemsCompleted: summary?.problemsCompleted || 0,
        problemsRequired: REQUIRED_PER_WEEK,
      };
    }
  }

  // All prerequisites met
  return {
    canReceiveFRQ: true,
    reason: `All prerequisites met for Week ${targetWeek}`,
    weekNumber: targetWeek,
    problemsCompleted: 0, // N/A for multi-week check
    problemsRequired: REQUIRED_PER_WEEK,
  };
}

/**
 * Get user-friendly message for blocked FRQ
 */
export function getBlockedFRQMessage(check: PrerequisiteCheck): string {
  if (check.canReceiveFRQ) {
    return "Ready for FRQ assignment";
  }

  const remaining = check.problemsRequired - check.problemsCompleted;

  return `🔒 Complete ${remaining} more training problem${remaining > 1 ? 's' : ''} in Week ${check.weekNumber} to unlock FRQ assignments`;
}
