import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect as useReactEffect } from 'react';
import { HistoryState, pushToHistory, undoHistory, redoHistory, jumpToHistory, useKeyboardShortcuts } from '@/hooks/useHistory';

export type EffectType = 'glow' | 'glass' | 'neomorph' | 'clay';
export type ThemeModeType = 'dark' | 'light' | 'auto';
export type GlowAnimationType = 'none' | 'pulse' | 'breathe' | 'wave';

export interface GlowSettings {
  lightness: number;
  chroma: number;
  hue: number;
  baseColor: string;
  animation: GlowAnimationType;
  animationSpeed: number;
  animationIntensity: number;
}

interface BlurSettings {
  x: number;
  y: number;
}

export interface GlassSettings {
  blur: number;
  opacity: number;
  saturation: number;
  borderWidth: number;
  borderOpacity: number;
  tint: string;
  tintStrength: number;
}

export interface NeomorphSettings {
  distance: number;
  blur: number;
  intensity: number;
  shape: 'flat' | 'concave' | 'convex' | 'pressed';
  lightSource: number;
  surfaceColor: string;
}

export interface ClaySettings {
  depth: number;
  spread: number;
  borderRadius: number;
  highlightColor: string;
  shadowColor: string;
  surfaceTexture: 'smooth' | 'matte' | 'glossy';
  bendAngle: number;
}

interface EffectState {
  powerOn: boolean;
  activeEffects: Record<EffectType, boolean>;
  themeMode: ThemeModeType;
  glowSettings: GlowSettings;
  blurSettings: BlurSettings;
  glassSettings: GlassSettings;
  neomorphSettings: NeomorphSettings;
  claySettings: ClaySettings;
}

interface EffectContextType {
  state: EffectState;
  togglePower: () => void;
  toggleEffect: (effect: EffectType) => void;
  setThemeMode: (mode: ThemeModeType) => void;
  updateGlowSettings: (settings: Partial<GlowSettings>) => void;
  updateBlurSettings: (settings: Partial<BlurSettings>) => void;
  updateGlassSettings: (settings: Partial<GlassSettings>) => void;
  updateNeomorphSettings: (settings: Partial<NeomorphSettings>) => void;
  updateClaySettings: (settings: Partial<ClaySettings>) => void;
  resetBlurPosition: () => void;
  getActiveEffectsCount: () => number;
  getOklchColor: () => string;
  generateCSS: () => string;
  history: HistoryState<EffectState>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  jumpToHistoryEntry: (id: string) => void;
  clearHistory: () => void;
}

const defaultGlassSettings: GlassSettings = {
  blur: 12,
  opacity: 20,
  saturation: 120,
  borderWidth: 1,
  borderOpacity: 20,
  tint: '#ffffff',
  tintStrength: 10,
};

const defaultNeomorphSettings: NeomorphSettings = {
  distance: 10,
  blur: 30,
  intensity: 50,
  shape: 'flat',
  lightSource: 145,
  surfaceColor: '#2a2a2a',
};

const defaultClaySettings: ClaySettings = {
  depth: 10,
  spread: 10,
  borderRadius: 24,
  highlightColor: '#ffffff',
  shadowColor: '#000000',
  surfaceTexture: 'smooth',
  bendAngle: 0,
};

const defaultState: EffectState = {
  powerOn: true,
  activeEffects: {
    glow: true,
    glass: false,
    neomorph: false,
    clay: false,
  },
  themeMode: 'dark',
  glowSettings: {
    lightness: 78,
    chroma: 0.18,
    hue: 70,
    baseColor: '#FF9F00',
    animation: 'none',
    animationSpeed: 2,
    animationIntensity: 50,
  },
  blurSettings: {
    x: -590,
    y: -1070,
  },
  glassSettings: defaultGlassSettings,
  neomorphSettings: defaultNeomorphSettings,
  claySettings: defaultClaySettings,
};

const STORAGE_KEY = 'effect-editor';

const EffectContext = createContext<EffectContextType | undefined>(undefined);

export const EffectProvider = ({ children }: { children: ReactNode }) => {
  const [historyState, setHistoryState] = useState<HistoryState<EffectState>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const initialState = stored 
        ? { ...defaultState, ...JSON.parse(stored) } 
        : defaultState;
      return {
        past: [],
        present: initialState,
        future: [],
      };
    } catch (error) {
      console.error('Failed to load saved state:', error);
      return {
        past: [],
        present: defaultState,
        future: [],
      };
    }
  });

  const state = historyState.present;

  useReactEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }, [state]);

  const pushHistory = useCallback((newState: EffectState, label: string) => {
    setHistoryState(prev => pushToHistory(prev, newState, label));
  }, []);

  const undo = useCallback(() => {
    setHistoryState(prev => undoHistory(prev) || prev);
  }, []);

  const redo = useCallback(() => {
    setHistoryState(prev => redoHistory(prev) || prev);
  }, []);

  const canUndo = historyState.past.length > 0;
  const canRedo = historyState.future.length > 0;

  useKeyboardShortcuts(undo, redo, canUndo, canRedo);

  const jumpToHistoryEntry = useCallback((id: string) => {
    setHistoryState(prev => jumpToHistory(prev, id) || prev);
  }, []);

  const clearHistory = useCallback(() => {
    setHistoryState(prev => ({
      past: [],
      present: prev.present,
      future: [],
    }));
  }, []);

  const togglePower = useCallback(() => {
    const newState = { ...state, powerOn: !state.powerOn };
    pushHistory(newState, `Power ${newState.powerOn ? 'on' : 'off'}`);
  }, [state, pushHistory]);

  const toggleEffect = useCallback((effect: EffectType) => {
    const newState = {
      ...state,
      activeEffects: {
        ...state.activeEffects,
        [effect]: !state.activeEffects[effect],
      },
    };
    pushHistory(newState, `${effect} ${newState.activeEffects[effect] ? 'enabled' : 'disabled'}`);
  }, [state, pushHistory]);

  const setThemeMode = useCallback((mode: ThemeModeType) => {
    const newState = { ...state, themeMode: mode };
    pushHistory(newState, `Theme: ${mode}`);
  }, [state, pushHistory]);

  const updateGlowSettings = useCallback((settings: Partial<GlowSettings>) => {
    const newState = {
      ...state,
      glowSettings: { ...state.glowSettings, ...settings },
    };
    const key = Object.keys(settings)[0];
    pushHistory(newState, `Glow ${key} changed`);
  }, [state, pushHistory]);

  const updateBlurSettings = useCallback((settings: Partial<BlurSettings>) => {
    const newState = {
      ...state,
      blurSettings: { ...state.blurSettings, ...settings },
    };
    pushHistory(newState, 'Blur position changed');
  }, [state, pushHistory]);

  const updateGlassSettings = useCallback((settings: Partial<GlassSettings>) => {
    const newState = {
      ...state,
      glassSettings: { ...state.glassSettings, ...settings },
    };
    const key = Object.keys(settings)[0];
    pushHistory(newState, `Glass ${key} changed`);
  }, [state, pushHistory]);

  const updateNeomorphSettings = useCallback((settings: Partial<NeomorphSettings>) => {
    const newState = {
      ...state,
      neomorphSettings: { ...state.neomorphSettings, ...settings },
    };
    const key = Object.keys(settings)[0];
    pushHistory(newState, `Neomorph ${key} changed`);
  }, [state, pushHistory]);

  const updateClaySettings = useCallback((settings: Partial<ClaySettings>) => {
    const newState = {
      ...state,
      claySettings: { ...state.claySettings, ...settings },
    };
    const key = Object.keys(settings)[0];
    pushHistory(newState, `Clay ${key} changed`);
  }, [state, pushHistory]);

  const resetBlurPosition = useCallback(() => {
    const newState = {
      ...state,
      blurSettings: { x: -590, y: -1070 },
    };
    pushHistory(newState, 'Blur position reset');
  }, [state, pushHistory]);

  const getActiveEffectsCount = useCallback(() => {
    return Object.values(state.activeEffects).filter(Boolean).length;
  }, [state.activeEffects]);

  const getOklchColor = useCallback(() => {
    const { lightness, chroma, hue } = state.glowSettings;
    return `oklch(${(lightness / 100).toFixed(2)} ${chroma.toFixed(3)} ${hue})`;
  }, [state.glowSettings]);

  const generateCSS = useCallback(() => {
    const oklch = getOklchColor();
    return `.glow-effect {
  background-color: ${oklch};
  filter: blur(180px);
}

.phone-preview {
  --glow-color: ${oklch};
  --blur-x: ${state.blurSettings.x}px;
  --blur-y: ${state.blurSettings.y}px;
}`;
  }, [getOklchColor, state.blurSettings]);

  const value = useMemo(() => ({
    state,
    togglePower,
    toggleEffect,
    setThemeMode,
    updateGlowSettings,
    updateBlurSettings,
    updateGlassSettings,
    updateNeomorphSettings,
    updateClaySettings,
    resetBlurPosition,
    getActiveEffectsCount,
    getOklchColor,
    generateCSS,
    history: historyState,
    undo,
    redo,
    canUndo,
    canRedo,
    jumpToHistoryEntry,
    clearHistory,
  }), [
    state, togglePower, toggleEffect, setThemeMode, 
    updateGlowSettings, updateBlurSettings, updateGlassSettings,
    updateNeomorphSettings, updateClaySettings, resetBlurPosition,
    getActiveEffectsCount, getOklchColor, generateCSS,
    historyState, undo, redo, canUndo, canRedo, jumpToHistoryEntry, clearHistory
  ]);

  return (
    <EffectContext.Provider value={value}>
      {children}
    </EffectContext.Provider>
  );
};

export const useEffects = () => {
  const context = useContext(EffectContext);
  if (!context) {
    throw new Error('useEffects must be used within EffectProvider');
  }
  return context;
};
