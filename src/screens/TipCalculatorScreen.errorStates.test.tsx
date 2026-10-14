import { fireEvent, render, screen } from '@testing-library/react-native';

const mockAmountEmpty = 'Bitte einen g\u00fcltigen Wert eingeben.';
const mockAmountNegative = 'Betrag darf nicht negativ sein.';
const mockTipInvalid = 'Trinkgeld muss zwischen 0 und 100 liegen.';
const mockPeopleInvalid = 'Personenzahl muss eine ganze Zahl von mindestens 1 sein.';

jest.mock('../lib/tip', () => {
  const error = (field: string, message: string) => ({ field, message });

  return {
    formatCents: (cents: number) => `${cents}\u00a2`,
    parseDecimal: () => null,
    calculateTip: (input: { amount: string; tipPercent: string; people: string }) => {
      const errors: { field: string; message: string }[] = [];
      const amountText = input.amount.trim();
      if (amountText === '') {
        errors.push(error('amount', mockAmountEmpty));
      } else {
        const amount = Number(amountText.replace(',', '.'));
        if (!Number.isFinite(amount)) {
          errors.push(error('amount', mockAmountEmpty));
        } else if (amount < 0) {
          errors.push(error('amount', mockAmountNegative));
        }
      }

      const tipText = input.tipPercent.trim();
      if (tipText === '') {
        errors.push(error('tipPercent', mockTipInvalid));
      } else {
        const tip = Number(tipText.replace(',', '.'));
        if (!Number.isFinite(tip) || tip < 0 || tip > 100) {
          errors.push(error('tipPercent', mockTipInvalid));
        }
      }

      const peopleText = input.people.trim();
      if (peopleText === '') {
        errors.push(error('people', mockPeopleInvalid));
      } else {
        const people = Number(peopleText);
        if (!Number.isInteger(people) || people < 1) {
          errors.push(error('people', mockPeopleInvalid));
        }
      }

      if (errors.length > 0) {
        return { tipCents: 0, totalCents: 0, perPersonCents: 0, errors };
      }
      return { tipCents: 123, totalCents: 456, perPersonCents: 789, errors: [] };
    },
  };
});

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default
);

import TipCalculatorScreen from './TipCalculatorScreen';

describe('TipCalculatorScreen error states and neutral start', () => {
  it('starts neutral: untouched form shows neither an error nor a result value', async () => {
    await render(<TipCalculatorScreen />);

    expect(screen.queryByText(mockAmountEmpty)).toBeNull();
    expect(screen.queryByText(mockTipInvalid)).toBeNull();
    expect(screen.queryByText(mockPeopleInvalid)).toBeNull();
    expect(screen.queryByText(/\u00a2/)).toBeNull();
  });

  it('shows the error at the touched field and no result values', async () => {
    await render(<TipCalculatorScreen />);

    await fireEvent.changeText(screen.getByTestId('input-amount'), '-5');

    expect(screen.getByText(mockAmountNegative)).toBeTruthy();
    expect(screen.queryByText(/\u00a2/)).toBeNull();
  });

  it('does not show an error for a field the user has not touched', async () => {
    await render(<TipCalculatorScreen />);

    await fireEvent.changeText(screen.getByTestId('input-amount'), '-5');

    expect(screen.queryByText(mockTipInvalid)).toBeNull();
    expect(screen.queryByText(mockPeopleInvalid)).toBeNull();
  });

  it('reveals the error after the field is blurred', async () => {
    await render(<TipCalculatorScreen />);

    await fireEvent(screen.getByTestId('input-amount'), 'blur');

    expect(screen.getByText(mockAmountEmpty)).toBeTruthy();
    expect(screen.queryByText(/\u00a2/)).toBeNull();
  });

  it('shows result values once every field is valid', async () => {
    await render(<TipCalculatorScreen />);

    await fireEvent.changeText(screen.getByTestId('input-amount'), '100');
    await fireEvent.changeText(screen.getByTestId('input-tip-percent'), '10');
    await fireEvent.changeText(screen.getByTestId('input-people'), '3');

    expect(screen.queryByText(mockAmountEmpty)).toBeNull();
    expect(screen.getByText('123\u00a2')).toBeTruthy();
    expect(screen.getByText('456\u00a2')).toBeTruthy();
    expect(screen.getByText('789\u00a2')).toBeTruthy();
  });
});
