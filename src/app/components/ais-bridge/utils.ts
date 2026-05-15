/**
 * Utility functions replacing angular-instantsearch utilities
 */

export function noop() {}

export function parseNumberInput(input: any): number {
  if (typeof input === 'number') {
    return input;
  }
  return typeof input === 'string' ? parseInt(input, 10) : Number(input) || 0;
}

/**
 * Generate BEM-style CSS class names (replaces angular-instantsearch cx())
 */
export function cx(widgetName: string, suffix?: string): string {
  const base = `ais-${widgetName}`;
  return suffix ? `${base}--${suffix}` : base;
}
