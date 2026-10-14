import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TipError, TipField, TipInput, TipResult, calculateTip, formatCents } from '../lib/tip';
import { colors, radius, spacing, typography } from '../theme';

const EMPTY_INPUT: TipInput = { amount: '', tipPercent: '', people: '' };

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  placeholder: string;
  suffix?: string;
  keyboardType: TextInputProps['keyboardType'];
  inputMode: TextInputProps['inputMode'];
  testID: string;
  accessibilityLabel: string;
  error?: TipError;
}

function LabelledField({ label, value, onChangeText, onBlur, placeholder, suffix, keyboardType, inputMode, testID, accessibilityLabel, error }: FieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error ? styles.inputRowError : null]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          keyboardType={keyboardType}
          inputMode={inputMode}
          testID={testID}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={error ? error.message : undefined}
        />
        {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
      </View>
      {error ? (
        <Text style={styles.errorText} accessibilityLiveRegion="polite" testID={`${testID}-error`}>
          {error.message}
        </Text>
      ) : null}
    </View>
  );
}

interface ResultCardProps {
  result: TipResult;
  people: string;
  showValues: boolean;
}

function ResultCard({ result, people, showValues }: ResultCardProps) {
  const value = (cents: number) => (showValues ? formatCents(cents) : '');

  return (
    <View style={styles.card}>
      <Text style={styles.cardHeader}>Ergebnis</Text>

      <View style={styles.resultRow} testID="result-tip">
        <Text style={styles.rowLabel}>Trinkgeld</Text>
        <Text style={styles.rowValueSecondary}>{value(result.tipCents)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.resultRow} testID="result-total">
        <Text style={styles.rowLabel}>Gesamt</Text>
        <Text style={styles.rowValuePrimary}>{value(result.totalCents)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.resultRow} testID="result-per-person">
        <View style={styles.rowLabelBlock}>
          <Text style={styles.rowLabel}>Pro Person</Text>
          {showValues && people.trim() !== '' ? (
            <Text style={styles.rowSubLabel}>auf {people} Personen aufgeteilt</Text>
          ) : null}
        </View>
        <Text style={styles.rowValueSecondary}>{value(result.perPersonCents)}</Text>
      </View>
    </View>
  );
}

const UNTOUCHED: Record<TipField, boolean> = {
  amount: false,
  tipPercent: false,
  people: false,
};

export default function TipCalculatorScreen() {
  const [input, setInput] = useState<TipInput>(EMPTY_INPUT);
  const [touched, setTouched] = useState<Record<TipField, boolean>>(UNTOUCHED);
  const result = calculateTip(input);

  const touchField = (field: TipField) => {
    setTouched((previous) => (previous[field] ? previous : { ...previous, [field]: true }));
  };
  const setField = (field: TipField, value: string) => {
    touchField(field);
    setInput((previous) => ({ ...previous, [field]: value }));
  };
  const errorFor = (field: TipField): TipError | undefined => {
    if (!touched[field]) {
      return undefined;
    }
    return result.errors.find((error) => error.field === field);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text style={styles.title}>Trinkgeld-Rechner</Text>
            <Text style={styles.formHint}>Werte aktualisieren sich sofort — kein Bestätigen nötig.</Text>

            <LabelledField
              label="Betrag"
              value={input.amount}
              onChangeText={(text) => setField('amount', text)}
              onBlur={() => touchField('amount')}
              placeholder="0,00"
              suffix="€"
              keyboardType="decimal-pad"
              inputMode="decimal"
              testID="input-amount"
              accessibilityLabel="Betrag"
              error={errorFor('amount')}
            />
            <LabelledField
              label="Trinkgeld"
              value={input.tipPercent}
              onChangeText={(text) => setField('tipPercent', text)}
              onBlur={() => touchField('tipPercent')}
              placeholder="10"
              suffix="%"
              keyboardType="decimal-pad"
              inputMode="decimal"
              testID="input-tip-percent"
              accessibilityLabel="Trinkgeld in Prozent"
              error={errorFor('tipPercent')}
            />
            <LabelledField
              label="Personenzahl"
              value={input.people}
              onChangeText={(text) => setField('people', text)}
              onBlur={() => touchField('people')}
              placeholder="1"
              keyboardType="number-pad"
              inputMode="numeric"
              testID="input-people"
              accessibilityLabel="Personenzahl"
              error={errorFor('people')}
            />

            <ResultCard result={result} people={input.people} showValues={result.errors.length === 0} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.space4,
    paddingTop: spacing.space5,
    paddingBottom: spacing.space6,
    alignItems: 'center',
  },
  content: { width: '100%', maxWidth: 480 },
  title: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizeTitle,
    fontWeight: typography.headingWeight,
    color: colors.fg,
    marginBottom: spacing.space0,
  },
  formHint: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizeCaption,
    color: colors.muted,
    marginBottom: spacing.space4,
  },
  fieldGroup: { marginBottom: spacing.space3 },
  label: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizeLabel,
    fontWeight: typography.labelWeight,
    color: colors.fg,
    marginBottom: spacing.space1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.space3,
  },
  inputRowError: {
    borderColor: colors.error,
    backgroundColor: colors.errorBg,
  },
  input: {
    flex: 1,
    fontFamily: typography.fontFamily,
    fontSize: 18,
    color: colors.fg,
    padding: 0,
  },
  suffix: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizeBody,
    color: colors.fgSubtle,
    marginLeft: spacing.space1,
  },
  errorText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizeCaption,
    color: colors.error,
    marginTop: 6,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.space4,
    marginTop: spacing.space5,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardHeader: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizeCaption,
    color: colors.fgSubtle,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: spacing.space3,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabelBlock: { flexShrink: 1 },
  rowLabel: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizeBody,
    fontWeight: typography.bodyWeight,
    color: colors.fgSubtle,
  },
  rowSubLabel: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizeCaption,
    color: colors.muted,
    marginTop: 2,
  },
  rowValuePrimary: {
    fontFamily: typography.fontFamilyMono,
    fontSize: typography.sizeDisplay,
    fontWeight: typography.headingWeight,
    color: colors.fg,
    textAlign: 'right',
  },
  rowValueSecondary: {
    fontFamily: typography.fontFamilyMono,
    fontSize: typography.sizeTitle,
    fontWeight: typography.labelWeight,
    color: colors.fg,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.space4,
  },
});
