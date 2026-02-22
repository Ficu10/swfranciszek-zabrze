import DOMPurify from 'dompurify';

/**
 * Client-side HTML sanitization for React components
 * Uses browser's DOMPurify - DO NOT import from server code
 * For server-side sanitization, use sanitize-server.ts instead
 * @param dirty - The raw HTML content that needs to be sanitized
 * @returns Sanitized HTML content safe for rendering
 */
export const sanitizeHtmlClient = (dirty: string): string => {
  if (!dirty) return '';
  
  // Check if running in browser
  if (typeof window === 'undefined') {
    // Fallback for SSR - just strip tags to prevent issues
    return dirty.replace(/<[^>]*>/g, '');
  }
  
  try {
    return DOMPurify.sanitize(dirty);
  } catch (error) {
    console.error('Client-side HTML sanitization failed:', error);
    return dirty.replace(/<[^>]*>/g, '');
  }
};