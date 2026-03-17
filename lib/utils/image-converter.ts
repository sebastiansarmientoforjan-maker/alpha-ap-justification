/**
 * Image conversion utilities for Claude Vision grading
 */

/**
 * Convert a File object to base64 string
 * Used when uploading images directly from browser
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data URL prefix (data:image/jpeg;base64,)
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Convert a URL (Firebase Storage, S3, etc.) to base64
 * Used when fetching already-uploaded images
 */
export async function urlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const blob = await response.blob();
  return blobToBase64(blob);
}

/**
 * Convert a Blob to base64 string
 */
export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Validate image file before upload
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file type
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload JPG, PNG, or WebP images.",
    };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File too large. Please upload images smaller than 10MB.",
    };
  }

  return { valid: true };
}

/**
 * Get image dimensions from File
 * Useful for checking if resolution is sufficient
 */
export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.width,
        height: img.height,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * Check if image resolution is sufficient for OCR
 * Recommended: at least 1200x800px for handwritten math
 */
export async function checkImageQuality(file: File): Promise<{
  sufficient: boolean;
  dimensions: { width: number; height: number };
  recommendation?: string;
}> {
  const dimensions = await getImageDimensions(file);
  const minWidth = 1200;
  const minHeight = 800;

  const sufficient =
    dimensions.width >= minWidth && dimensions.height >= minHeight;

  return {
    sufficient,
    dimensions,
    recommendation: sufficient
      ? undefined
      : `Image resolution (${dimensions.width}x${dimensions.height}) is low. Recommended: at least ${minWidth}x${minHeight}px for best AI grading accuracy. Consider retaking with better lighting or higher camera resolution.`,
  };
}
