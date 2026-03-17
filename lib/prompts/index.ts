/**
 * Intelligent Prompt Selection for AP FRQ Generation
 * Selects course-specific prompts based on student enrollment
 */

import { CALCULUS_AB_SYSTEM_PROMPT, getCalculusABUserPrompt } from './calculus-ab';
import { CALCULUS_BC_SYSTEM_PROMPT, getCalculusBCUserPrompt } from './calculus-bc';
import { STATISTICS_SYSTEM_PROMPT, getStatisticsUserPrompt } from './statistics';

export type CourseType = 'calculus-ab' | 'calculus-bc' | 'statistics';

/**
 * Get system prompt for specific course
 */
export function getSystemPromptForCourse(course: CourseType): string {
  switch (course) {
    case 'calculus-ab':
      return CALCULUS_AB_SYSTEM_PROMPT;
    case 'calculus-bc':
      return CALCULUS_BC_SYSTEM_PROMPT;
    case 'statistics':
      return STATISTICS_SYSTEM_PROMPT;
    default:
      // Fallback to AB if course not recognized
      console.warn(`[Prompts] Unknown course: ${course}, using Calculus AB`);
      return CALCULUS_AB_SYSTEM_PROMPT;
  }
}

/**
 * Get user prompt for specific course
 */
export function getUserPromptForCourse(
  course: CourseType,
  topic: string,
  score: number,
  frqType: 'general' | 'topic'
): string {
  switch (course) {
    case 'calculus-ab':
      return getCalculusABUserPrompt(topic, score, frqType);
    case 'calculus-bc':
      return getCalculusBCUserPrompt(topic, score, frqType);
    case 'statistics':
      return getStatisticsUserPrompt(topic, score, frqType);
    default:
      console.warn(`[Prompts] Unknown course: ${course}, using Calculus AB`);
      return getCalculusABUserPrompt(topic, score, frqType);
  }
}

/**
 * Detect course from student ID or quiz context
 */
export async function detectCourse(
  studentId: string,
  assessmentTitle: string
): Promise<CourseType> {
  // Try to detect from assessment title first
  const titleLower = assessmentTitle.toLowerCase();

  if (titleLower.includes('calculus bc') || titleLower.includes('calc bc')) {
    return 'calculus-bc';
  }

  if (titleLower.includes('statistics') || titleLower.includes('stats')) {
    return 'statistics';
  }

  if (titleLower.includes('calculus ab') || titleLower.includes('calc ab') || titleLower.includes('calculus')) {
    return 'calculus-ab';
  }

  // Fallback: Try to get from student record
  try {
    const { getDataService } = await import('@/services/data');
    const dataService = await getDataService();
    const student = await dataService.getUserById(studentId);

    if (student && 'course' in student) {
      return student.course as CourseType;
    }
  } catch (error) {
    console.error('[Prompts] Error fetching student course:', error);
  }

  // Default fallback
  console.warn(`[Prompts] Could not detect course for student ${studentId}, defaulting to Calculus AB`);
  return 'calculus-ab';
}
