"use client";

import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={24} className="text-green-400" />,
    error: <AlertCircle size={24} className="text-blue-400" />,
    info: <Info size={24} className="text-blue-400" />,
    warning: <AlertTriangle size={24} className="text-yellow-400" />,
  };

  const bgColors = {
    success: "bg-green-950/90 border-green-500/50",
    error: "bg-blue-950/90 border-red-500/50",
    info: "bg-blue-950/90 border-blue-500/50",
    warning: "bg-yellow-950/90 border-yellow-500/50",
  };

  const textColors = {
    success: "text-green-100",
    error: "text-red-100",
    info: "text-blue-100",
    warning: "text-yellow-100",
  };

  return (
    <div
      className={`${bgColors[type]} ${textColors[type]} border-2 rounded-xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md flex items-start gap-3 min-w-[320px] max-w-md animate-slide-in`}
    >
      <div className="shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        <p className="text-sm font-medium leading-relaxed">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="shrink-0 hover:bg-white/10 rounded-lg p-1 transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
}
