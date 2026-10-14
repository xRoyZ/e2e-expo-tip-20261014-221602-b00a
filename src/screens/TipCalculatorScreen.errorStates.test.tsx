import { fireEvent, render, screen } from '@testing-library/react-native';

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default
);

import TipCalculatorScreen from './TipCalculatorScreen';

const AMOUNT_INVALID = 'Betrag muss eine Zahl größer oder gleich 0 sein.';
const TIP_INVALID = 'Trinkgeld muss zwischen 0 und 100 liegen.';
const PEOPLE_INVALID = 'Personenzahl muss eine ganze Zahl von mindestens 1 sein.';
const INVALID_RESULT = 'Kein Ergebnis — bitte Eingaben prüfen.';
const EMPTY_RESULT = 'Ergebnis erscheint hier.';

describe('TipCalculatorScreen error states and neutral start', () => {
  it('starts neutral: untouched form shows neither an error nor a result value', async () => {
    await render(<TipCalculatorScreen />);

    expect(screen.queryByText(AMOUNT_INVALID)).toBeNull();
    expect(screen.queryByText(TIP_INVALID)).toBeNull();
    expect(screen.queryByText(PEOPLE_INVALID)).toBeNull();
    expect(screen.getByText(EMPTY_RESULT)).toBeTruthy();
    expect(screen.queryByTestId('result-tip')).toBeNull();
    expect(screen.queryByTestId('result-total')).toBeNull();
    expect(screen.queryByTestId('result-per-person')).toBeNull();
  });

  it('shows the error at the touched field and replaces the result rows', async () => {
    await render(<TipCalculatorScreen />);

    await fireEvent.changeText(screen.getByTestId('input-amount'), '-5');

    expect(screen.getByText(AMOUNT_INVALID)).toBeTruthy();
    expect(screen.getByText(INVALID_RESULT)).toBeTruthy();
    expect(screen.queryByTestId('result-tip')).toBeNull();
    expect(screen.queryByTestId('result-total')).toBeNull();
    expect(screen.queryByTestId('result-per-person')).toBeNull();
  });

  it('does not show an error for a field the user has not touched', async () => {
    await render(<TipCalculatorScreen />);

    await fireEvent.changeText(screen.getByTestId('input-amount'), '-5');

    expect(screen.queryByText(TIP_INVALID)).toBeNull();
    expect(screen.queryByText(PEOPLE_INVALID)).toBeNull();
  });

  it('reveals the error after the field is blurred', async () => {
    await render(<TipCalculatorScreen />);

    await fireEvent(screen.getByTestId('input-amount'), 'blur');

    expect(screen.getByText(AMOUNT_INVALID)).toBeTruthy();
    expect(screen.getByText(INVALID_RESULT)).toBeTruthy();
    expect(screen.queryByTestId('result-tip')).toBeNull();
  });

  it('shows the three result values once every field is valid', async () => {
    await render(<TipCalculatorScreen />);

    await fireEvent.changeText(screen.getByTestId('input-amount'), '100');
    await fireEvent.changeText(screen.getByTestId('input-tip-percent'), '10');
    await fireEvent.changeText(screen.getByTestId('input-people'), '3');

    expect(screen.queryByText(AMOUNT_INVALID)).toBeNull();
    expect(screen.queryByText(INVALID_RESULT)).toBeNull();
    expect(screen.getByTestId('result-tip')).toBeTruthy();
    expect(screen.getByTestId('result-total')).toBeTruthy();
    expect(screen.getByTestId('result-per-person')).toBeTruthy();
    expect(screen.getByText('10,00 \u20ac')).toBeTruthy();
    expect(screen.getByText('110,00 \u20ac')).toBeTruthy();
    expect(screen.getByText('36,67 \u20ac')).toBeTruthy();
  });
});
