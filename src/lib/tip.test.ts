import { TipInput, calculateTip, formatCents, parseDecimal } from './tip';

const validInput: TipInput = { amount: '100', tipPercent: '10', people: '3' };

describe('parseDecimal', () => {
  it('parses a plain integer', () => {
    expect(parseDecimal('100')).toBe(100);
  });

  it('accepts a dot as decimal separator', () => {
    expect(parseDecimal('100.5')).toBe(100.5);
  });

  it('accepts a comma as decimal separator', () => {
    expect(parseDecimal('100,5')).toBe(100.5);
  });

  it('tolerates surrounding whitespace', () => {
    expect(parseDecimal('  42,25  ')).toBe(42.25);
  });

  it('parses a leading-dot decimal', () => {
    expect(parseDecimal(',5')).toBe(0.5);
  });

  it('returns null for empty input', () => {
    expect(parseDecimal('')).toBeNull();
    expect(parseDecimal('   ')).toBeNull();
  });

  it('returns null for non-numeric input', () => {
    expect(parseDecimal('abc')).toBeNull();
    expect(parseDecimal('1.2.3')).toBeNull();
    expect(parseDecimal('12,3,4')).toBeNull();
  });

  it('returns null for values that are not finite', () => {
    expect(parseDecimal('Infinity')).toBeNull();
    expect(parseDecimal('NaN')).toBeNull();
  });
});

describe('formatCents', () => {
  it('always shows two decimals and the euro sign', () => {
    expect(formatCents(0)).toBe('0,00 €');
    expect(formatCents(5)).toBe('0,05 €');
    expect(formatCents(1000)).toBe('10,00 €');
    expect(formatCents(11000)).toBe('110,00 €');
    expect(formatCents(3667)).toBe('36,67 €');
  });

  it('uses a dot as thousands separator', () => {
    expect(formatCents(123456)).toBe('1.234,56 €');
  });
});

describe('calculateTip — valid cases', () => {
  it('computes the standard case (100 / 10 % / 3 people)', () => {
    const result = calculateTip(validInput);
    expect(result.errors).toEqual([]);
    expect(result.tipCents).toBe(1000);
    expect(result.totalCents).toBe(11000);
    expect(result.perPersonCents).toBe(3667);
  });

  it('formats the standard case as shown on the screen', () => {
    const result = calculateTip(validInput);
    expect(formatCents(result.tipCents)).toBe('10,00 €');
    expect(formatCents(result.totalCents)).toBe('110,00 €');
    expect(formatCents(result.perPersonCents)).toBe('36,67 €');
  });

  it('treats 0 percent tip as valid and equals the total to the amount', () => {
    const result = calculateTip({ amount: '100', tipPercent: '0', people: '1' });
    expect(result.errors).toEqual([]);
    expect(result.tipCents).toBe(0);
    expect(result.totalCents).toBe(10000);
    expect(result.perPersonCents).toBe(10000);
  });

  it('accepts 100 percent as the upper bound', () => {
    const result = calculateTip({ amount: '100', tipPercent: '100', people: '1' });
    expect(result.errors).toEqual([]);
    expect(result.tipCents).toBe(10000);
    expect(result.totalCents).toBe(20000);
  });

  it('splits across several people, rounding the per-person share half-up', () => {
    const result = calculateTip({ amount: '100', tipPercent: '10', people: '2' });
    expect(result.errors).toEqual([]);
    expect(result.perPersonCents).toBe(5500);
  });

  it('gives the same result for comma and dot input', () => {
    const withComma = calculateTip({ amount: '100,5', tipPercent: '12,5', people: '3' });
    const withDot = calculateTip({ amount: '100.5', tipPercent: '12.5', people: '3' });
    expect(withComma).toEqual(withDot);
    expect(withComma.errors).toEqual([]);
  });

  it('gives the same result for comma and dot in the tip percentage', () => {
    const withComma = calculateTip({ amount: '80', tipPercent: '7,5', people: '1' });
    const withDot = calculateTip({ amount: '80', tipPercent: '7.5', people: '1' });
    expect(withComma).toEqual(withDot);
  });
});

describe('calculateTip — rounding to whole cents', () => {
  it('rounds halves up', () => {
    const result = calculateTip({ amount: '1,005', tipPercent: '0', people: '1' });
    expect(result.errors).toEqual([]);
    expect(result.totalCents).toBe(101);
  });

  it('rounds the tip to whole cents', () => {
    const result = calculateTip({ amount: '0,05', tipPercent: '50', people: '1' });
    expect(result.errors).toEqual([]);
    expect(result.tipCents).toBe(3);
    expect(result.totalCents).toBe(8);
  });
});

describe('calculateTip — invalid cases', () => {
  it('reports an empty amount', () => {
    const result = calculateTip({ amount: '', tipPercent: '10', people: '1' });
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].field).toBe('amount');
    expect(result.tipCents).toBe(0);
    expect(result.totalCents).toBe(0);
    expect(result.perPersonCents).toBe(0);
  });

  it('reports a non-numeric amount', () => {
    const result = calculateTip({ amount: 'abc', tipPercent: '10', people: '1' });
    expect(result.errors.map((error) => error.field)).toEqual(['amount']);
    expect(result.errors[0].message).toContain('Betrag');
  });

  it('reports a negative amount', () => {
    const result = calculateTip({ amount: '-5', tipPercent: '10', people: '1' });
    expect(result.errors.map((error) => error.field)).toEqual(['amount']);
  });

  it('reports an empty tip percentage', () => {
    const result = calculateTip({ amount: '100', tipPercent: '', people: '1' });
    expect(result.errors.map((error) => error.field)).toEqual(['tipPercent']);
    expect(result.errors[0].message).toContain('Trinkgeld');
  });

  it('reports a non-numeric tip percentage', () => {
    const result = calculateTip({ amount: '100', tipPercent: 'abc', people: '1' });
    expect(result.errors.map((error) => error.field)).toEqual(['tipPercent']);
  });

  it('reports a tip percentage below 0', () => {
    const result = calculateTip({ amount: '100', tipPercent: '-1', people: '1' });
    expect(result.errors.map((error) => error.field)).toEqual(['tipPercent']);
  });

  it('reports a tip percentage above 100', () => {
    const result = calculateTip({ amount: '100', tipPercent: '101', people: '1' });
    expect(result.errors.map((error) => error.field)).toEqual(['tipPercent']);
  });

  it('reports an empty person count', () => {
    const result = calculateTip({ amount: '100', tipPercent: '10', people: '' });
    expect(result.errors.map((error) => error.field)).toEqual(['people']);
    expect(result.errors[0].message).toContain('Personenzahl');
  });

  it('reports a person count below 1', () => {
    const result = calculateTip({ amount: '100', tipPercent: '10', people: '0' });
    expect(result.errors.map((error) => error.field)).toEqual(['people']);
  });

  it('reports a non-integer person count', () => {
    const result = calculateTip({ amount: '100', tipPercent: '10', people: '2,5' });
    expect(result.errors.map((error) => error.field)).toEqual(['people']);
  });

  it('collects one error per invalid field and leaves the amounts at 0', () => {
    const result = calculateTip({ amount: '', tipPercent: '101', people: '0' });
    expect(result.errors.map((error) => error.field)).toEqual(['amount', 'tipPercent', 'people']);
    expect(result.tipCents).toBe(0);
    expect(result.totalCents).toBe(0);
    expect(result.perPersonCents).toBe(0);
  });
});
