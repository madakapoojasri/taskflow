import { useState, useRef, useMemo, useCallback } from "react";
import { ToastContext } from "./toastContext";

const DURATION = 3500; // milliseconds a toast stays on screen

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message, type) => {
      const id = nextId.current++;
      // keep at most 4 toasts on screen
      setToasts((prev) => [...prev, { id, message, type }].slice(-4));
      setTimeout(() => dismiss(id), DURATION);
    },
    [dismiss]
  );

  // Stable object, so components using useToast don't re-render needlessly
  const toast = useMemo(
    () => ({
      success: (message) => show(message, "success"),
      error: (message) => show(message, "error"),
      info: (message) => show(message, "info"),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}

      <div className="toast-container" role="region" aria-live="polite" aria-label="Notifications">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="toast-message">{t.message}</span>
            <button
              type="button"
              className="toast-close"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}