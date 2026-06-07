export const noop = () => undefined;

export function parseNumberInput(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
