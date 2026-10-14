# Design — Project Identity

> This document is project-long-lived. Tokens are not changed without
> the Architect's approval. Developers MUST use these tokens
> instead of improvising their own colors/spacings.

## Style Direction

Calm, bright utility UI in the Linear/Stripe vein — generous whitespace, one confident accent colour, and a single elevated result card that makes the three money values the hero of the screen.

## Colors

- `--color-bg`: **#F7F8FA**
- `--color-surface`: **#FFFFFF**
- `--color-fg`: **#111827**
- `--color-fg_subtle`: **#6B7280**
- `--color-muted`: **#9CA3AF**
- `--color-border`: **#E5E7EB**
- `--color-border_focus`: **#1F6FEB**
- `--color-accent`: **#1F6FEB**
- `--color-accent_hover`: **#1A5FD0**
- `--color-accent_active`: **#154FAD**
- `--color-accent_soft`: **#EAF1FE**
- `--color-error`: **#D92D20**
- `--color-error_bg`: **#FEF3F2**
- `--color-disabled_bg`: **#D1D5DB**
- `--color-disabled_fg`: **#F9FAFB**

## Typography

- `font_family`: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
- `font_family_mono`: 'SF Mono', Menlo, Consolas, 'Roboto Mono', monospace
- `heading_weight`: 700
- `body_weight`: 400
- `label_weight`: 600
- `size_display`: 34px
- `size_title`: 22px
- `size_body`: 16px
- `size_label`: 14px
- `size_caption`: 12px
- `line_height_body`: 1.4

## Spacing Scale

- `--space-0`: 4px
- `--space-1`: 8px
- `--space-2`: 12px
- `--space-3`: 16px
- `--space-4`: 24px
- `--space-5`: 32px
- `--space-6`: 48px

## Border-Radii

- `--radius-sm`: 6px
- `--radius-md`: 12px
- `--radius-lg`: 20px
- `--radius-pill`: 999px

## Components

### Button

Primary action / label button. height min 48px (>=44px touch target), but this single-screen calculator has NO submit button — computation is live. The Button component is defined for completeness and future use only and must not be rendered on the calculator screen. Spec: padding 12px 24px, radius md (12px), bg=accent #1F6FEB, text=#FFFFFF 16px weight 600, full-width stretch inside its container. States: default bg #1F6FEB; hover (web/pointer) bg #1A5FD0; active/pressed bg #154FAD + scale 0.98; focus ring 2px #1F6FEB at 40% opacity offset 2px; disabled bg #D1D5DB, text #F9FAFB, opacity 1, pointer-events none, and always accompanied by a visible reason string (AC-10).

### ScreenContainer

Root scrollable view. bg=bg #F7F8FA, horizontal padding 24px, vertical padding 32px top / 48px bottom, content max-width 480px centred on tablets (flex align center). KeyboardAvoidingView + ScrollView so the result card stays reachable while the keyboard is open. No navigation bar, no tabs — one screen only.

### ScreenHeader

Title 'Trinkgeld-Rechner' 22px weight 700 color #111827, margin-bottom 4px; optional subtitle 14px color #6B7280 margin-bottom 32px. Left aligned. No icon, no back button.

### Input

Labelled numeric text field. Structure per field: Label (14px, weight 600, #111827, margin-bottom 8px), TextInput (height 52px, bg #FFFFFF, border 1px #E5E7EB, radius md 12px, padding 0 16px, font-size 18px color #111827, placeholder color #9CA3AF), ErrorText slot (12px #D92D20, margin-top 6px). States: idle (untouched) border #E5E7EB, no error text — never show a red state before first input (AC-06); focused border 2px #1F6FEB, background #FFFFFF; filled (valid) border #E5E7EB; invalid border 1px #D92D20, background #FEF3F2, ErrorText visible. keyboardType: 'decimal-pad' for amount + tip percent, 'number-pad' for persons. inputMode numeric. Suffix on the right inside the field: '€' for amount, '%' for tip, 'Personen' never as suffix (it is the label). Field order top to bottom: 1) 'Betrag' placeholder '0,00' suffix '€', 2) 'Trinkgeld' placeholder '10' suffix '%', 3) 'Personenzahl' placeholder '1'. Vertical gap between fields 16px.

### ErrorText

Inline error message under its field. 12px (size_caption), weight 400, color #D92D20, margin-top 6px, one line, wraps if needed. Must name the field and the expectation, e.g. 'Betrag muss eine Zahl größer oder gleich 0 sein.', 'Trinkgeld muss zwischen 0 und 100 liegen.', 'Personenzahl muss eine ganze Zahl von mindestens 1 sein.', 'Bitte einen gültigen Wert eingeben.' Accessible via accessibilityLiveRegion='polite' and linked with accessibilityHint on the input.

### ResultCard

The hero of the screen. bg #FFFFFF, radius lg 20px, padding 24px, border 1px #E5E7EB, subtle shadow (elevation 2 / shadowOpacity 0.06 radius 12 offset 0,4). Top margin 32px. Header row inside card: caption 'Ergebnis' 12px uppercase letter-spacing 0.5px color #6B7280, margin-bottom 16px. Holds three ResultRow entries separated by 1px #E5E7EB dividers (24px vertical padding around divider), order: 'Trinkgeld', 'Gesamt', 'Pro Person'. Empty state (nothing typed yet): card is visible but shows the muted hint 'Ergebnis erscheint hier.' 14px #9CA3AF in place of the rows. Invalid state: the rows are replaced entirely by the message 'Kein Ergebnis — bitte Eingaben prüfen.' 14px #D92D20, so no stale number is ever displayed (AC-05).

### ResultRow

Label/value pair inside ResultCard. Row: label left, 16px weight 400 color #6B7280; value right, right-aligned. Primary value (Gesamt) 34px (size_display) weight 700 color #111827; secondary values (Trinkgeld, Pro Person) 22px weight 600 color #111827. Use tabular/mono numerals (fontVariant numeric + font_family_mono fallback) so digits do not shift while typing. Value strings are the single source of truth for formatting, see layout_principles: '12,35 €'. 'Pro Person' additionally shows a muted sub-label under the label, e.g. 'auf 3 Personen aufgeteilt', 12px #9CA3AF. accessibilityLabel combines label and formatted value.

### FormHint

Small static helper under the header: 'Werte aktualisieren sich sofort — kein Bestätigen nötig.' 12px color #9CA3AF, margin-bottom 24px. Explains the live behaviour so no invisible affordance is expected (supports AC-02/AC-10). Purely informational, never interactive.

## Layout Principles

- Single screen only: no navigation, no tabs, no settings, no theme switch (matching the Architect's directive 'ein einziger Bildschirm, schlicht und aufgeräumt'). Vertical order: ScreenHeader -> FormHint -> three Inputs -> ResultCard. Nothing else.
- Container: full width on phones with 24px horizontal padding; content capped at 480px max-width and horizontally centred on tablets/large screens. Vertical rhythm uses the spacing scale only: 8px label-to-input, 16px between fields, 32px before the result card, 24px inside cards.
- Mobile-first: designed for a 360-390px-wide viewport (iPhone/Android phone) as the design target; the only breakpoint is 480px (content cap) and 768px (centred column with extra outer padding). Every interactive target is at least 48px high, never below 44px.
- Colour discipline: neutral greys carry the layout, exactly one accent (#1F6FEB) for focus only, red (#D92D20) reserved exclusively for the error state. No gradients, no icons, no illustrations.
- ONE number format everywhere — money is always '1.234,56 €' (German, dot as thousands separator, comma as decimal separator, always exactly two decimals, no space before €). Computation rounds half-up to whole cents before formatting, so a displayed value is never re-rounded (AC-03).
- Percentages are always shown as '10 %' (value + non-breaking space + % ), integers without decimals; a percent between 0 and 100 keeps at most two decimals. Person count is shown as a bare integer ('3'), never with a unit.
- Input parsing accepts both ',' and '.' as decimal separator for amount and tip percent and echoes the user's own notation while typing (uncontrolled display), but all results are formatted in the one display format above — so typing '100.5' and '100,5' yields identical results (AC-04).
- Live computation: results recompute on every keystroke with no submit button; while a field is invalid the result rows are replaced by a single error message, and an untouched form never shows red (AC-05, AC-06).
- Accessibility/readability: body text at least 14px, all money values at least 22px, contrast of #111827 on #FFFFFF is ~16:1 and of #6B7280 on #FFFFFF ~5.9:1; never rely on colour alone — every error also carries a text message linked to its field.
