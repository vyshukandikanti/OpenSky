/**
 * Escapes unsafe HTML characters to prevent cross-site scripting (XSS).
 * @param str Raw untrusted string.
 * @returns Escaped HTML string.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Safely sets plain text content on a DOM element.
 * @param element Target HTMLElement.
 * @param text Plain text value.
 */
export function setSafeText(element: HTMLElement | null, text: string): void {
  if (element !== null) {
    element.textContent = text;
  }
}
