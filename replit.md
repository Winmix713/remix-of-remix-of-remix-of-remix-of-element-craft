# Multi-Effect Editor

## Áttekintés
Multi-Effect Editor alkalmazás vizuális effektek (Glow, Glass, Neomorph, Clay) valós idejű szerkesztéséhez. Interaktív telefon előnézet, preset kezelés és visszavonás/újra funkcióval.

## Jelenlegi állapot
- Migráció Lovable-ról Replit környezetre: **Befejezve**
- DOM hibák javítása (beágyazott gombok): **Befejezve**
- Nyelvi egységesítés (magyar): **Befejezve**

## Legutóbbi módosítások (2025.12.17)

### DOM hibák javítása
- `HistoryTimeline.tsx`: CollapsibleTrigger átstruktúrálása - Undo/Redo gombok kikerültek a triggerből
- `PresetsGallery.tsx`: PresetCard komponens átalakítása div-re role="button" attribútummal

### Nyelvi egységesítés (Magyar)
- `GlowEditor.tsx`: Slider címkék, animáció opciók, téma opciók
- `PresetsGallery.tsx`: Fejléc, gombok, toast üzenetek, dialógusok
- `PhonePreview.tsx`: Húzás indikátor szöveg
- `Index.tsx`: Tab nevek, lábléc szövegek

### Hozzáadott data-testid attribútumok
- Gombok: undo, redo, export, import, save-preset, reset-blur-position
- Inputok: preset-name, preset-description
- Switchek: glow-power
- Selectek: theme-mode, animation-type
- Tabok: actions, presets, theme, inspector, export
- Preset kártyák: preset-card-{id}, button-delete-preset-{id}

## Projekt architektúra

### Fő komponensek
```
src/
├── components/
│   ├── GlowEditor.tsx      # Glow effekt szerkesztő (OKLCH színtér)
│   ├── GlassEditor.tsx     # Üveg effekt szerkesztő
│   ├── NeomorphEditor.tsx  # Neumorph árnyék szerkesztő
│   ├── ClayEditor.tsx      # Clay/plasztikus effekt
│   ├── PresetsGallery.tsx  # Preset galéria és kezelés
│   ├── HistoryTimeline.tsx # Előzmények panel
│   ├── PhonePreview.tsx    # Interaktív telefon előnézet
│   └── EffectEditorTabs.tsx# Effekt tab kezelő
├── contexts/
│   ├── ThemeContext.tsx    # Fő állapot kezelés
│   └── SelectionContext.tsx# Kijelölés context
├── hooks/
│   └── useHistory.ts       # Undo/Redo logika
└── pages/
    └── Index.tsx           # Főoldal
```

### Állapot tárolás
- localStorage kulcsok: `effect-editor`, `theme-customizer`, `effect-editor-custom-presets`

### Billentyűparancsok
- `Ctrl+Z`: Visszavonás
- `Ctrl+Y`: Újra

## Felhasználói preferenciák
- Nyelv: Magyar
- UI stílus: Sötét téma

## Fejlesztési környezet
- Vite dev szerver: port 5000
- React + TypeScript + Shadcn UI
- TanStack Query v5
