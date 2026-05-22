"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const typeConfig: Record<ToastType, { bg: string; icon: string }> = {
  success: { bg: "bg-success", icon: "✓" },
  error: { bg: "bg-danger", icon: "✕" },
  info: { bg: "bg-brand", icon: "ℹ" },
};

export function Toast({ message, type = "success", duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);
  const { bg, icon } = typeConfig[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={[
        "flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-lg max-w-sm transition-all duration-300",
        bg,
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      ].join(" ")}
    >
      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20 text-xs font-bold shrink-0">
        {icon}
      </span>
      {message}
    </div>
  );
}

// ── Toast container + hook ────────────────────────────────────────────────────

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;
type Listener = (toasts: ToastItem[]) => void;
const listeners: Set<Listener> = new Set();
let toasts: ToastItem[] = [];

function notify(toasts: ToastItem[]) {
  listeners.forEach((l) => l([...toasts]));
}

export const toast = {
  show(message: string, type: ToastType = "success") {
    const id = ++toastId;
    toasts = [...toasts, { id, message, type }];
    notify(toasts);
  },
  success(message: string) { this.show(message, "success"); },
  error(message: string)   { this.show(message, "error"); },
  info(message: string)    { this.show(message, "info"); },
  remove(id: number) {
    toasts = toasts.filter((t) => t.id !== id);
    notify(toasts);
  },
};

export function ToastContainer() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (t: ToastItem[]) => setItems(t);
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end">
      {items.map((item) => (
        <Toast
          key={item.id}
          message={item.message}
          type={item.type}
          onClose={() => toast.remove(item.id)}
        />
      ))}
    </div>
  );
}
