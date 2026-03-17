/**
 * Utility functions for activity instructions validation
 */

export function checkInstructionsCompleted(activityId: string): boolean {
  if (typeof window === "undefined") return false;

  const completedKey = `activity-instructions-completed-${activityId}`;
  return localStorage.getItem(completedKey) === "true";
}

export function redirectToInstructions(activityId: string, activityPath: string) {
  if (typeof window === "undefined") return;

  if (!checkInstructionsCompleted(activityId)) {
    console.warn(`⚠️ Instructions not completed for ${activityId}. Redirecting...`);
    window.location.href = `${activityPath}/instructions`;
  }
}

export function clearInstructionsState(activityId: string) {
  if (typeof window === "undefined") return;

  const storageKey = `activity-instructions-${activityId}`;
  const completedKey = `activity-instructions-completed-${activityId}`;
  const timestampKey = `activity-instructions-timestamp-${activityId}`;

  localStorage.removeItem(storageKey);
  localStorage.removeItem(completedKey);
  localStorage.removeItem(timestampKey);
}

export function getInstructionsTimestamp(activityId: string): string | null {
  if (typeof window === "undefined") return null;

  const timestampKey = `activity-instructions-timestamp-${activityId}`;
  return localStorage.getItem(timestampKey);
}
