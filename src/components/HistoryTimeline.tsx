import { useEffects } from '@/contexts/EffectContext';
import { History, Undo2, Redo2, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { cn } from '@/lib/utils';
import { useState, useCallback, useMemo } from 'react';

export const HistoryTimeline = () => {
  const { history, undo, redo, canUndo, canRedo, jumpToHistoryEntry, clearHistory } = useEffects();
  const [isOpen, setIsOpen] = useState(false);

  const formatTime = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('hu-HU', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  }, []);

  const reversedHistory = useMemo(() => [...history.past].reverse(), [history.past]);
  const historyCount = history.past.length;

  const handleUndo = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    undo();
  }, [undo]);

  const handleRedo = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    redo();
  }, [redo]);

  return (
    <div className="w-full bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-300">Előzmények</span>
            <span className="text-xs text-zinc-500">({historyCount} lépés)</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-white/10 disabled:opacity-40"
              disabled={!canUndo}
              onClick={handleUndo}
              title="Visszavonás (Ctrl+Z)"
              aria-label="Visszavonás"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-white/10 disabled:opacity-40"
              disabled={!canRedo}
              onClick={handleRedo}
              title="Újra (Ctrl+Y)"
              aria-label="Újra"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="border-t border-white/5">
            {historyCount === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-zinc-500">
                Még nincs előzmény. Végezz változtatásokat, hogy megjelenjenek itt.
              </div>
            ) : (
              <>
                <ScrollArea className="h-48">
                  <div className="p-2 space-y-1">
                    {reversedHistory.map((entry) => (
                      <button
                        key={entry.id}
                        onClick={() => jumpToHistoryEntry(entry.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200",
                          "hover:bg-white/10 active:scale-[0.98] group"
                        )}
                        aria-label={`Ugrás: ${entry.label}`}
                      >
                        <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500/70 group-hover:bg-amber-400 transition-colors" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-zinc-300 truncate group-hover:text-zinc-100 transition-colors">
                            {entry.label}
                          </p>
                          <p className="text-[10px] text-zinc-500 group-hover:text-zinc-400 transition-colors">
                            {formatTime(entry.timestamp)}
                          </p>
                        </div>
                        <span className="text-[10px] text-zinc-600 opacity-0 group-hover:opacity-100 group-hover:text-amber-400 transition-all font-medium">
                          Ugrás
                        </span>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-2 border-t border-white/5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-8 text-xs text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    onClick={clearHistory}
                    aria-label="Előzmények törlése"
                  >
                    <Trash2 className="w-3 h-3 mr-1.5" />
                    Előzmények törlése
                  </Button>
                </div>
              </>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
