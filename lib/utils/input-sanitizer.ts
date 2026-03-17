/**
 * Input Sanitization Utilities
 * Protects against XSS and injection attacks in user-submitted CERC responses
 */

/**
 * Sanitizes user input by removing HTML tags, scripts, and dangerous patterns
 * @param input - Raw user input string
 * @returns Sanitized string safe for storage and display
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove javascript: URLs
    .replace(/javascript:/gi, '')
    // Remove data: URLs (can be used for XSS)
    .replace(/data:text\/html/gi, '')
    // Remove on* event handlers
    .replace(/on\w+\s*=/gi, '')
    // Remove script tags even if encoded
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Trim whitespace
    .trim();
}

/**
 * Validates CERC response field
 * @param input - User input
 * @param minLength - Minimum required length
 * @returns Object with isValid flag and error message
 */
export function validateCERCField(
  input: string,
  minLength: number = 20
): { isValid: boolean; error?: string } {
  const sanitized = sanitizeInput(input);

  if (sanitized.length === 0) {
    return { isValid: false, error: 'This field cannot be empty' };
  }

  if (sanitized.length < minLength) {
    return {
      isValid: false,
      error: `Please provide at least ${minLength} characters`,
    };
  }

  return { isValid: true };
}

/**
 * Sanitizes all CERC responses in a session
 * @param responses - Raw CERC responses object
 * @returns Sanitized CERC responses
 */
export function sanitizeCERCResponses(responses: {
  claim: string;
  evidence: string;
  reasoning: string;
  conditions: string;
}) {
  return {
    claim: sanitizeInput(responses.claim),
    evidence: sanitizeInput(responses.evidence),
    reasoning: sanitizeInput(responses.reasoning),
    conditions: sanitizeInput(responses.conditions),
  };
}
