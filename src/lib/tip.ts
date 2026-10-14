export type TipField = 'amount' | 'tipPercent' | 'people';

export interface TipInput {
  amount: string;
  tipPercent: string;
  people: string;
}

export interface TipError {
  field: TipField;
  message: string;
}

export interface TipResult {
  tipCents: number;
  totalCents: number;
  perPersonCents: number;
  errors: TipError[];
}

export function parseDecimal(value: string): number | null {
  return null;
}

export function formatCents(cents: number): string {
  return '';
}

export function calculateTip(input: TipInput): TipResult {
  return { tipCents: 0, totalCents: 0, perPersonCents: 0, errors: [] };
}
