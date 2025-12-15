import { useState, useCallback, useRef, useEffect } from "react";
import { toast, useToast } from "@/components/ui/use-toast";

interface UndoAction<T> {
  item: T;
  action: () => void;
  timeout: NodeJS.Timeout;
}

export function useUndo<T>(delay: number = 5000) {
  const { toast } = useToast();
  const [pendingUndo, setPendingUndo] = useState<UndoAction<T> | null>(null);
  const toastIdRef = useRef<{ dismiss: () => void } | null>(null);

  const clearPending = useCallback(() => {
    if (pendingUndo) {
      clearTimeout(pendingUndo.timeout);
      setPendingUndo(null);
    }
    if (toastIdRef.current) {
      toastIdRef.current.dismiss();
      toastIdRef.current = null;
    }
  }, [pendingUndo]);

  const executeWithUndo = useCallback(
    (item: T, action: () => void, undoAction: () => void, message: string): void => {
      // Önceki pending varsa temizle
      clearPending();

      // Action'ı hemen çalıştır
      action();

      // Timeout oluştur
      const timeout = setTimeout(() => {
        setPendingUndo(null);
        if (toastIdRef.current) {
          toastIdRef.current.dismiss();
          toastIdRef.current = null;
        }
      }, delay);

      // Pending action'ı kaydet
      const undoActionData: UndoAction<T> = {
        item,
        action: undoAction,
        timeout,
      };
      setPendingUndo(undoActionData);

      // Toast göster
      const toastResult = toast({
        title: message,
        description: `Geri almak için ${delay / 1000} saniye`,
        action: (
          <button
            onClick={() => {
              clearTimeout(timeout);
              undoAction();
              setPendingUndo(null);
              if (toastIdRef.current) {
                toastIdRef.current.dismiss();
                toastIdRef.current = null;
              }
              toast({
                title: "Geri alındı",
                description: "İşlem geri alındı",
              });
            }}
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-transparent bg-primary px-3 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Geri Al
          </button>
        ),
      });

      toastIdRef.current = toastResult;
    },
    [delay, toast, clearPending]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pendingUndo) {
        clearTimeout(pendingUndo.timeout);
      }
      if (toastIdRef.current) {
        toastIdRef.current.dismiss();
      }
    };
  }, [pendingUndo]);

  return { executeWithUndo, clearPending };
}
