import { memo, useCallback } from 'react';
import { 
  Zap, 
  Copy, 
  RotateCcw, 
  Download, 
  Upload, 
  Palette, 
  Sparkles,
  Eye,
  EyeOff,
  Trash2,
  History,
  Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { useEffects, useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/hooks/use-toast';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  action: () => void;
  variant?: 'default' | 'primary' | 'destructive';
  disabled?: boolean;
}

export const QuickActionsPanel = memo(() => {
  const { 
    state, 
    togglePower, 
    resetToDefaults, 
    exportState, 
    importState,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory
  } = useEffects();
  const { resetTheme } = useTheme();

  const handleExport = useCallback(() => {
    const json = exportState();
    navigator.clipboard.writeText(json);
    toast({
      title: "Exported!",
      description: "Effect settings copied to clipboard.",
    });
  }, [exportState]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const result = importState(ev.target?.result as string);
          if (result) {
            toast({
              title: "Imported!",
              description: "Effect settings loaded successfully.",
            });
          } else {
            toast({
              title: "Import failed",
              description: "Invalid settings file.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [importState]);

  const handleResetAll = useCallback(() => {
    resetToDefaults();
    resetTheme();
    toast({
      title: "Reset Complete",
      description: "All settings restored to defaults.",
    });
  }, [resetToDefaults, resetTheme]);

  const handleClearHistory = useCallback(() => {
    clearHistory();
    toast({
      title: "History Cleared",
      description: "Undo/redo history has been cleared.",
    });
  }, [clearHistory]);

  const primaryActions: QuickAction[] = [
    {
      id: 'power',
      label: state.powerOn ? 'Disable Effects' : 'Enable Effects',
      icon: state.powerOn ? EyeOff : Eye,
      action: togglePower,
      variant: 'primary',
    },
    {
      id: 'export',
      label: 'Quick Export',
      icon: Copy,
      action: handleExport,
    },
  ];

  const secondaryActions: QuickAction[] = [
    {
      id: 'undo',
      label: 'Undo',
      icon: RotateCcw,
      action: undo,
      disabled: !canUndo,
    },
    {
      id: 'redo',
      label: 'Redo',
      icon: History,
      action: redo,
      disabled: !canRedo,
    },
    {
      id: 'import',
      label: 'Import',
      icon: Upload,
      action: handleImport,
    },
    {
      id: 'download',
      label: 'Download',
      icon: Download,
      action: () => {
        const json = exportState();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'effect-settings.json';
        a.click();
        URL.revokeObjectURL(url);
        toast({
          title: "Downloaded!",
          description: "Settings saved to file.",
        });
      },
    },
  ];

  const dangerActions: QuickAction[] = [
    {
      id: 'clear-history',
      label: 'Clear History',
      icon: Trash2,
      action: handleClearHistory,
      variant: 'destructive',
    },
    {
      id: 'reset',
      label: 'Reset All',
      icon: Settings,
      action: handleResetAll,
      variant: 'destructive',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <Zap className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
          <p className="text-xs text-muted-foreground">Fast access to common tasks</p>
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 border border-border/50">
        <div className={`w-2 h-2 rounded-full ${state.powerOn ? 'bg-emerald animate-pulse' : 'bg-muted-foreground'}`} />
        <span className="text-xs text-muted-foreground">
          Effects: <span className={`font-medium ${state.powerOn ? 'text-emerald' : 'text-muted-foreground'}`}>
            {state.powerOn ? 'Active' : 'Disabled'}
          </span>
        </span>
        <span className="text-xs text-muted-foreground ml-auto">
          {Object.values(state.activeEffects).filter(Boolean).length} active
        </span>
      </div>

      {/* Primary actions */}
      <div className="grid grid-cols-2 gap-2">
        {primaryActions.map(({ id, label, icon: Icon, action, variant }) => (
          <Button
            key={id}
            variant={variant === 'primary' ? 'default' : 'outline'}
            size="sm"
            onClick={action}
            className={`h-10 text-xs gap-2 ${
              variant === 'primary' 
                ? 'bg-primary hover:bg-primary/90' 
                : 'bg-secondary/50 hover:bg-secondary'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </Button>
        ))}
      </div>

      {/* Secondary actions */}
      <div className="grid grid-cols-4 gap-1.5">
        {secondaryActions.map(({ id, label, icon: Icon, action, disabled }) => (
          <button
            key={id}
            onClick={action}
            disabled={disabled}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all text-xs
              ${disabled 
                ? 'opacity-40 cursor-not-allowed border-border/30 bg-card' 
                : 'border-border/50 bg-card hover:bg-secondary hover:border-border active:scale-95'
              }`}
            title={label}
          >
            <Icon className="w-4 h-4 text-muted-foreground" />
            <span className="text-[9px] text-muted-foreground truncate w-full text-center">{label}</span>
          </button>
        ))}
      </div>

      {/* Danger zone */}
      <div className="pt-2 border-t border-border/50">
        <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">Reset Options</p>
        <div className="grid grid-cols-2 gap-2">
          {dangerActions.map(({ id, label, icon: Icon, action }) => (
            <button
              key={id}
              onClick={action}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 text-destructive text-xs transition-all active:scale-95"
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="pt-2 border-t border-border/50">
        <p className="text-[10px] text-muted-foreground">
          <span className="text-foreground font-medium">Tip:</span> Use Ctrl+Z / Ctrl+Y for quick undo/redo
        </p>
      </div>
    </div>
  );
});

QuickActionsPanel.displayName = 'QuickActionsPanel';
