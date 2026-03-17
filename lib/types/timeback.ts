/**
 * TimeBack Webhook Payload Types
 * Based on OneRoster 1.2 + TimeBack proprietary extensions
 */

export interface TimeBackWebhookPayload {
  event: 'assessment.completed' | 'result.graded';
  timestamp: string; // ISO 8601
  student: {
    sourcedId: string;
    givenName: string;
    familyName: string;
    email: string;
  };
  assessment: {
    sourcedId: string;
    title: string;
    type: 'Quiz' | 'Exam' | 'Test';
    course: {
      sourcedId: string;
      title: string;
    };
  };
  result: {
    sourcedId: string;
    score: number; // 0.0 - 1.0 (e.g., 0.85 = 85%)
    scoreStatus: 'exempt' | 'fully graded' | 'not submitted' | 'partially graded' | 'submitted';
    date: string; // ISO 8601
    comment?: string;
  };
}

export interface WebhookValidationResult {
  valid: boolean;
  error?: string;
  payload?: TimeBackWebhookPayload;
}

export interface AssessmentTriggerResult {
  triggered: boolean;
  reason: string;
  frqId?: string;
  studentId: string;
  assessmentTitle: string;
  score: number;
}
