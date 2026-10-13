export function noop(..._args: any[]): void {}

export function parseNumberInput(input: number | string): number {
  return typeof input === 'string' ? parseInt(input, 10) : input;
}

