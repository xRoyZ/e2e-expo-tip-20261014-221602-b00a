# Trinkgeld-Rechner

Eine mobile Expo-App (React Native, TypeScript) mit genau einem Bildschirm: Aus
Betrag, Trinkgeld-Prozent und Personenzahl berechnet sie live das Trinkgeld, den
Gesamtbetrag und den Betrag pro Person. Alle Geldwerte werden auf ganze Cent
kaufmännisch gerundet. Die App arbeitet vollständig offline — keine
Netzwerkkommunikation, keine Speicherung der Eingaben auf dem Gerät.

## Tech-Stack

- **Plattform**: Expo (React Native)
- **Sprache**: TypeScript (strict)
- **UI**: React-Native-Komponenten, ohne zusätzliche UI-Bibliothek
- **Tests**: Jest mit dem `jest-expo`-Preset
- **Laufzeit**: Node/npm, Expo-CLI

## Installation

Voraussetzung: Node.js und npm.

```bash
npm ci
```

## Entwicklung starten

```bash
npm start
```

Anschließend den QR-Code mit der Expo-Go-App (iOS/Android) scannen oder im
Terminal `a` (Android-Emulator), `i` (iOS-Simulator, nur macOS) bzw. `w` (Web)
drücken.

## Web-Build für die Produktion

```bash
npm run build
```

Der Befehl exportiert die Web-Variante nach `dist/`. Dieses Verzeichnis kann mit
einem beliebigen statischen Server ausgeliefert werden, z. B.:

```bash
npx serve dist
```

## Tests

```bash
npm test
```

## So wird die App benutzt

Die App zeigt nur den Rechner-Bildschirm:

1. **Betrag** eingeben (z. B. `100` oder `100,50`; Punkt und Komma sind beide
   erlaubt).
2. **Trinkgeld** in Prozent eingeben (z. B. `10`).
3. **Personenzahl** eingeben (z. B. `3`).

Die drei Ergebniszeilen — **Trinkgeld**, **Gesamt** und **Pro Person** — werden
bei jeder Änderung sofort neu berechnet; es gibt keinen Bestätigen-Knopf. Bei
einer ungültigen Eingabe erscheint an dem betroffenen Feld eine Fehlermeldung und
die Ergebniswerte werden nicht angezeigt.

## Funktionen

- Ein einziger Rechner-Bildschirm mit drei Eingabefeldern (Betrag, Trinkgeld in
  Prozent, Personenzahl).
- Live-Berechnung ohne Submit-Knopf bei jeder Eingabe.
- Kaufmännische Rundung auf ganze Cent, Anzeige mit zwei Nachkommastellen.
- Komma und Punkt als Dezimaltrennzeichen werden gleich behandelt.
- Feldbezogene Fehlermeldungen bei ungültigen Eingaben.
- Vollständig offline: keine Netzwerkkommunikation, keine Speicherung der
  Eingaben.
