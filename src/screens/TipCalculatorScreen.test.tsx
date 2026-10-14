import { fireEvent, render, screen } from '@testing-library/react-native';

import TipCalculatorScreen from './TipCalculatorScreen';

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default
);

describe('TipCalculatorScreen structure', () => {
  it('renders the three input fields', async () => {
    await render(<TipCalculatorScreen />);

    expect(screen.getByTestId('input-amount')).toBeTruthy();
    expect(screen.getByTestId('input-tip-percent')).toBeTruthy();
    expect(screen.getByTestId('input-people')).toBeTruthy();
  });

  it('renders the three result rows', async () => {
    await render(<TipCalculatorScreen />);

    expect(screen.getByTestId('result-tip')).toBeTruthy();
    expect(screen.getByTestId('result-total')).toBeTruthy();
    expect(screen.getByTestId('result-per-person')).toBeTruthy();
  });

  it('keeps the typed characters in the amount field', async () => {
    await render(<TipCalculatorScreen />);

    const amount = screen.getByTestId('input-amount');
    await fireEvent.changeText(amount, '12,50');

    expect(screen.getByTestId('input-amount').props.value).toBe('12,50');
  });
});
