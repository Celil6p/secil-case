"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

// Helper function to show toasts
export const toast = {
  success: (title: string, message?: string) => {
    useToastStore.getState().addToast({ type: "success", title, message, duration: 4000 });
  },
  error: (title: string, message?: string) => {
    useToastStore.getState().addToast({ type: "error", title, message, duration: 5000 });
  },
  warning: (title: string, message?: string) => {
    useToastStore.getState().addToast({ type: "warning", title, message, duration: 4000 });
  },
  info: (title: string, message?: string) => {
    useToastStore.getState().addToast({ type: "info", title, message, duration: 4000 });
  },
};

const icons = {
  success: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const colors = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
};

const iconColors = {
  success: "text-green-500 bg-green-100",
  error: "text-red-500 bg-red-100",
  warning: "text-amber-500 bg-amber-100",
  info: "text-blue-500 bg-blue-100",
};

function ToastItem({ toast: t, onRemove }: { toast: Toast; onRemove: () => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setIsVisible(true));

    // Auto dismiss
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onRemove, 300);
    }, t.duration || 4000);

    return () => clearTimeout(timer);
  }, [t.duration, onRemove]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(onRemove, 300);
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
    >
      <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${colors[t.type]} max-w-sm`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${iconColors[t.type]}`}>
          {icons[t.type]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{t.title}</p>
          {t.message && <p className="text-sm opacity-80 mt-0.5">{t.message}</p>}
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 hover:bg-black/5 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
      ))}
    </div>
  );
}
