'use server';

import DOMPurify from 'dompurify';

// Configure DOMPurify with safe options
const purifyConfig = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'table', 'thead', 'tbody',
    'tr', 'th', 'td', 'div', 'span'
  ],
  ALLOWED_ATTR: [
    'href', 'title', 'alt', 'src', 'width', 'height', 'class', 'id'
  ],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
};

// Server-side DOMPurify setup - only initialize on server
let purify: ReturnType<typeof DOMPurify> | null = null;
let purifyInitialized = false;

function initializePurify() {
  if (purifyInitialized) return;
  purifyInitialized = true;
  
  try {
    // Only require jsdom on Node.js server environment
    // eslint-disable-next-line global-require
    const { JSDOM } = require('jsdom');
    const window = new JSDOM('').window;
    purify = DOMPurify(window as any);
    purify.setConfig(purifyConfig);
  } catch (error) {
    console.warn('JSDOM initialization failed, using basic sanitization:', error);
    // Fallback: create a minimal sanitizer that prevents XSS
    purify = {
      sanitize: (dirty: string) => {
        return (dirty || '').replace(/<[^>]*>/g, '');
      },
      setConfig: () => {},
    } as any;
  }
}

/**
 * Server-side sanitization function (runs on Node.js server only)
 * Sanitizes HTML content to prevent XSS attacks
 * @param dirty - The raw HTML content that needs to be sanitized
 * @returns Sanitized HTML content safe for rendering
 */
export const sanitizeHtml = async (dirty: string): Promise<string> => {
  if (!dirty) return '';
  
  if (!purifyInitialized) {
    initializePurify();
  }
  
  try {
    if (purify && 'sanitize' in purify) {
      return purify.sanitize(dirty, { RETURN_DOM_FRAGMENT: false }) as string;
    }
  } catch (error) {
    console.error('HTML sanitization failed:', error);
  }
  
  // Fallback: strip all HTML tags if sanitization fails
  return dirty.replace(/<[^>]*>/g, '');
};
