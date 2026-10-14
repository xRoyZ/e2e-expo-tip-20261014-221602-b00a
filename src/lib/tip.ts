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

const DECIMAL_PATTERN = /^[+-]?(\d+(\.\d*)?|\.\d+)$/;

/**
 * Parses a user-entered decimal. Accepts ',' or '.' as decimal separator,
 * trims surrounding whitespace and returns null for anything that is not a
 * finite number. Pure and side-effect free.
 */
export function parseDecimal(value: string): number | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (trimmed === '') {
    return null;
  }
  const normalized = trimmed.replace(',', '.');
  if (!DECIMAL_PATTERN.test(normalized)) {
    return null;
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Formats integer cents into the German money string shown on the screen:
 * dot as thousands separator, comma as decimal separator and always two
 * decimals ("1.234,56 €").
 */
export function formatCents(cents: number): string {
  const rounded = Math.round(cents);
  const negative = rounded < 0;
  const absolute = Math.abs(rounded);
  const euros = Math.floor(absolute / 100);
  const rest = absolute % 100;
  const eurosText = String(euros).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const centsText = String(rest).padStart(2, '0');
  return `${negative ? '-' : ''}${eurosText},${centsText} €`;
}

function roundHalfUp(value: number): number {
  return Math.floor(value + 0.5 + 1e-9);
}

function invalidAmount(): TipError {
  return {
    field: 'amount',
    message: 'Betrag muss eine Zahl größer oder gleich 0 sein.',
  };
}

function invalidTipPercent(): TipError {
  return {
    field: 'tipPercent',
    message: 'Trinkgeld muss zwischen 0 und 100 liegen.',
  };
}

function invalidPeople(): TipError {
  return {
    field: 'people',
    message: 'Personenzahl muss eine ganze Zahl von mindestens 1 sein.',
  };
}

/**
 * Validates the three raw fields and computes tip, total and per-person
 * amounts in integer cents, rounded half-up. An invalid field adds its
 * TipError and leaves every amount at 0. Pure: same input, same output.
 */
export function calculateTip(input: TipInput): TipResult {
  const errors: TipError[] = [];

  const amount = parseDecimal(input.amount);
  const tipPercent = parseDecimal(input.tipPercent);
  const people = parseDecimal(input.people);

  if (amount === null || amount < 0) {
    errors.push(invalidAmount());
  }
  if (tipPercent === null || tipPercent < 0 || tipPercent > 100) {
    errors.push(invalidTipPercent());
  }
  if (people === null || people < 1 || !Number.isInteger(people)) {
    errors.push(invalidPeople());
  }

  if (errors.length > 0 || amount === null || tipPercent === null || people === null) {
    return { tipCents: 0, totalCents: 0, perPersonCents: 0, errors };
  }

  const amountCents = roundHalfUp(amount * 100);
  const tipCents = roundHalfUp((amountCents * tipPercent) / 100);
  const totalCents = amountCents + tipCents;
  const perPersonCents = roundHalfUp(totalCents / people);

  return { tipCents, totalCents, perPersonCents, errors: [] };
}
