import { useCallback, useEffect, useRef, useMemo } from 'react';

// ==================== TÍPUSDEFINÍCIÓK ====================
export interface HistoryEntry<T> {
  id: string;
  timestamp: number;
  label: string;
  state: T;
}

export interface HistoryState<T> {
  past: HistoryEntry<T>[];
  present: T;
  future: HistoryEntry<T>[];
}

export interface HistoryConfig {
  maxSize?: number;
  debounceMs?: number;
  enableKeyboardShortcuts?: boolean;
}

export interface UseHistoryReturn<T> {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  jumpTo: (entryId: string) => void;
  clear: () => void;
  getStats: () => HistoryStats;
}

export interface HistoryStats {
  pastCount: number;
  futureCount: number;
  totalSize: number;
  oldestTimestamp: number | null;
  newestTimestamp: number | null;
}

interface KeyboardShortcutConfig {
  undo: string;
  redo: string[];
  modifierKey: 'ctrl' | 'meta' | 'both';
}

// ==================== KONSTANSOK ====================
const DEFAULT_CONFIG: Required<HistoryConfig> = {
  maxSize: 50,
  debounceMs: 300,
  enableKeyboardShortcuts: true,
};

const KEYBOARD_SHORTCUTS: KeyboardShortcutConfig = {
  undo: 'z',
  redo: ['z', 'y'],
  modifierKey: 'both',
};

const LABELS = {
  UNDO_POINT: 'Undo point',
  REDO_POINT: 'Redo point',
  CURRENT_STATE: 'Current state',
  INITIAL_STATE: 'Initial state',
} as const;

// ==================== HELPER OSZTÁLYOK ====================
class IdGenerator {
  private static counter = 0;

  /**
   * Generál egy egyedi ID-t timestamp és random string kombinációjával
   */
  static generate(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    const count = this.counter++;
    return `${timestamp}-${count}-${random}`;
  }

  /**
   * Reset a számlálót (teszteléshez hasznos)
   */
  static reset(): void {
    this.counter = 0;
  }
}

class HistoryValidator {
  /**
   * Ellenőrzi, hogy a history state valid-e
   */
  static isValid<T>(history: HistoryState<T>): boolean {
    return (
      Array.isArray(history.past) &&
      Array.isArray(history.future) &&
      history.present !== undefined
    );
  }

  /**
   * Ellenőrzi, hogy egy entry valid-e
   */
  static isValidEntry<T>(entry: unknown): entry is HistoryEntry<T> {
    const e = entry as HistoryEntry<T>;
    return (
      typeof e?.id === 'string' &&
      typeof e?.timestamp === 'number' &&
      typeof e?.label === 'string' &&
      e?.state !== undefined
    );
  }

  /**
   * Sanitizálja a history state-et
   */
  static sanitize<T>(history: HistoryState<T>): HistoryState<T> {
    return {
      past: Array.isArray(history.past) ? history.past : [],
      present: history.present,
      future: Array.isArray(history.future) ? history.future : [],
    };
  }
}

class HistoryAnalyzer {
  /**
   * Kiszámítja a history statisztikáit
   */
  static getStats<T>(history: HistoryState<T>): HistoryStats {
    const allEntries = [...history.past, ...history.future];
    const timestamps = allEntries.map(e => e.timestamp).filter(Boolean);

    return {
      pastCount: history.past.length,
      futureCount: history.future.length,
      totalSize: allEntries.length,
      oldestTimestamp: timestamps.length > 0 ? Math.min(...timestamps) : null,
      newestTimestamp: timestamps.length > 0 ? Math.max(...timestamps) : null,
    };
  }

  /**
   * Ellenőrzi, hogy elérhető-e az undo
   */
  static canUndo<T>(history: HistoryState<T>): boolean {
    return history.past.length > 0;
  }

  /**
   * Ellenőrzi, hogy elérhető-e a redo
   */
  static canRedo<T>(history: HistoryState<T>): boolean {
    return history.future.length > 0;
  }

  /**
   * Megkeresi az entry indexét a past vagy future listában
   */
  static findEntryIndex<T>(
    entries: HistoryEntry<T>[],
    entryId: string
  ): number {
    return entries.findIndex(e => e.id === entryId);
  }
}

class HistoryOperations {
  /**
   * Létrehoz egy új history entry-t
   */
  static createEntry<T>(state: T, label: string): HistoryEntry<T> {
    return {
      id: IdGenerator.generate(),
      timestamp: Date.now(),
      label,
      state,
    };
  }

  /**
   * Hozzáad egy új state-et a history-hoz
   */
  static push<T>(
    history: HistoryState<T>,
    newState: T,
    label: string,
    maxSize: number
  ): HistoryState<T> {
    const entry = this.createEntry(history.present, label);
    const newPast = [...history.past, entry];

    // Limitáljuk a history méretet
    const trimmedPast = newPast.length > maxSize 
      ? newPast.slice(-maxSize)
      : newPast;

    return {
      past: trimmedPast,
      present: newState,
      future: [], // Clear future when new state is pushed
    };
  }

  /**
   * Undo művelet
   */
  static undo<T>(history: HistoryState<T>): HistoryState<T> | null {
    if (!HistoryAnalyzer.canUndo(history)) return null;

    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);
    const futureEntry = this.createEntry(history.present, LABELS.REDO_POINT);

    return {
      past: newPast,
      present: previous.state,
      future: [futureEntry, ...history.future],
    };
  }

  /**
   * Redo művelet
   */
  static redo<T>(history: HistoryState<T>): HistoryState<T> | null {
    if (!HistoryAnalyzer.canRedo(history)) return null;

    const next = history.future[0];
    const newFuture = history.future.slice(1);
    const pastEntry = this.createEntry(history.present, LABELS.UNDO_POINT);

    return {
      past: [...history.past, pastEntry],
      present: next.state,
      future: newFuture,
    };
  }

  /**
   * Ugrik egy adott history entry-re
   */
  static jumpTo<T>(
    history: HistoryState<T>,
    entryId: string
  ): HistoryState<T> | null {
    const pastIndex = HistoryAnalyzer.findEntryIndex(history.past, entryId);

    if (pastIndex === -1) return null;

    const targetEntry = history.past[pastIndex];
    const newPast = history.past.slice(0, pastIndex);
    const skippedEntries = history.past.slice(pastIndex + 1);
    const currentEntry = this.createEntry(history.present, LABELS.CURRENT_STATE);

    return {
      past: newPast,
      present: targetEntry.state,
      future: [...skippedEntries, currentEntry, ...history.future],
    };
  }

  /**
   * Törli a teljes history-t
   */
  static clear<T>(present: T): HistoryState<T> {
    return {
      past: [],
      present,
      future: [],
    };
  }
}

// ==================== KEYBOARD SHORTCUTS ====================
class KeyboardShortcutManager {
  private static isModifierPressed(
    event: KeyboardEvent,
    config: KeyboardShortcutConfig
  ): boolean {
    switch (config.modifierKey) {
      case 'ctrl':
        return event.ctrlKey && !event.metaKey;
      case 'meta':
        return event.metaKey && !event.ctrlKey;
      case 'both':
        return event.ctrlKey || event.metaKey;
      default:
        return false;
    }
  }

  static handleKeyDown(
    event: KeyboardEvent,
    handlers: {
      undo: () => void;
      redo: () => void;
      canUndo: boolean;
      canRedo: boolean;
    },
    config: KeyboardShortcutConfig = KEYBOARD_SHORTCUTS
  ): void {
    if (!this.isModifierPressed(event, config)) return;

    // Undo: Ctrl/Cmd + Z
    if (event.key.toLowerCase() === config.undo && !event.shiftKey) {
      event.preventDefault();
      if (handlers.canUndo) handlers.undo();
      return;
    }

    // Redo: Ctrl/Cmd + Shift + Z vagy Ctrl/Cmd + Y
    if (
      (event.key.toLowerCase() === config.undo && event.shiftKey) ||
      config.redo.includes(event.key.toLowerCase())
    ) {
      event.preventDefault();
      if (handlers.canRedo) handlers.redo();
      return;
    }
  }
}

// ==================== CUSTOM HOOKS ====================

/**
 * Hook a keyboard shortcuts kezeléséhez
 */
export const useKeyboardShortcuts = (
  undo: () => void,
  redo: () => void,
  canUndo: boolean,
  canRedo: boolean,
  enabled: boolean = true
): void => {
  const handlersRef = useRef({ undo, redo, canUndo, canRedo });

  // Update refs when handlers change
  useEffect(() => {
    handlersRef.current = { undo, redo, canUndo, canRedo };
  }, [undo, redo, canUndo, canRedo]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      KeyboardShortcutManager.handleKeyDown(event, handlersRef.current);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);
};

/**
 * Debounce hook
 */
const useDebounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    }) as T,
    [delay]
  );
};

// ==================== EXPORTÁLT HELPER FUNKCIÓK ====================

/**
 * Létrehoz egy history entry-t
 */
export const createHistoryEntry = <T>(state: T, label: string): HistoryEntry<T> => {
  return HistoryOperations.createEntry(state, label);
};

/**
 * Hozzáad egy új state-et a history-hoz
 */
export const pushToHistory = <T>(
  history: HistoryState<T>,
  newState: T,
  label: string,
  maxSize: number = DEFAULT_CONFIG.maxSize
): HistoryState<T> => {
  if (!HistoryValidator.isValid(history)) {
    console.warn('Invalid history state provided, sanitizing...');
    history = HistoryValidator.sanitize(history);
  }

  return HistoryOperations.push(history, newState, label, maxSize);
};

/**
 * Undo művelet
 */
export const undoHistory = <T>(history: HistoryState<T>): HistoryState<T> | null => {
  if (!HistoryValidator.isValid(history)) {
    console.error('Invalid history state for undo');
    return null;
  }

  return HistoryOperations.undo(history);
};

/**
 * Redo művelet
 */
export const redoHistory = <T>(history: HistoryState<T>): HistoryState<T> | null => {
  if (!HistoryValidator.isValid(history)) {
    console.error('Invalid history state for redo');
    return null;
  }

  return HistoryOperations.redo(history);
};

/**
 * Jump to egy adott history entry-re
 */
export const jumpToHistory = <T>(
  history: HistoryState<T>,
  entryId: string
): HistoryState<T> | null => {
  if (!HistoryValidator.isValid(history)) {
    console.error('Invalid history state for jump');
    return null;
  }

  if (!entryId || typeof entryId !== 'string') {
    console.error('Invalid entry ID provided');
    return null;
  }

  return HistoryOperations.jumpTo(history, entryId);
};

/**
 * History statisztikák lekérdezése
 */
export const getHistoryStats = <T>(history: HistoryState<T>): HistoryStats => {
  if (!HistoryValidator.isValid(history)) {
    console.warn('Invalid history state for stats');
    return {
      pastCount: 0,
      futureCount: 0,
      totalSize: 0,
      oldestTimestamp: null,
      newestTimestamp: null,
    };
  }

  return HistoryAnalyzer.getStats(history);
};

/**
 * History törlése
 */
export const clearHistory = <T>(present: T): HistoryState<T> => {
  return HistoryOperations.clear(present);
};

/**
 * Hook a history kezeléséhez (advanced verzió setter callback-kel)
 */
export const useHistory = <T>(
  history: HistoryState<T>,
  setHistory: (history: HistoryState<T>) => void,
  config: HistoryConfig = {}
): UseHistoryReturn<T> => {
  const mergedConfig = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...config }),
    [config]
  );

  // Memoized values
  const canUndo = useMemo(() => HistoryAnalyzer.canUndo(history), [history]);
  const canRedo = useMemo(() => HistoryAnalyzer.canRedo(history), [history]);

  // Undo handler
  const undo = useCallback(() => {
    const newHistory = HistoryOperations.undo(history);
    if (newHistory) {
      setHistory(newHistory);
    }
  }, [history, setHistory]);

  // Redo handler
  const redo = useCallback(() => {
    const newHistory = HistoryOperations.redo(history);
    if (newHistory) {
      setHistory(newHistory);
    }
  }, [history, setHistory]);

  // Jump to handler
  const jumpTo = useCallback(
    (entryId: string) => {
      const newHistory = HistoryOperations.jumpTo(history, entryId);
      if (newHistory) {
        setHistory(newHistory);
      }
    },
    [history, setHistory]
  );

  // Clear handler
  const clear = useCallback(() => {
    setHistory(HistoryOperations.clear(history.present));
  }, [history.present, setHistory]);

  // Get stats handler
  const getStats = useCallback(() => {
    return HistoryAnalyzer.getStats(history);
  }, [history]);

  // Keyboard shortcuts
  useKeyboardShortcuts(
    undo,
    redo,
    canUndo,
    canRedo,
    mergedConfig.enableKeyboardShortcuts
  );

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    jumpTo,
    clear,
    getStats,
  };
};

// ==================== EXPORTÁLT UTILITIES ====================
export { HistoryValidator, HistoryAnalyzer, HistoryOperations, IdGenerator };
