import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { useEventBus } from "@/hooks";
import { toastVariants } from "@/animations/variants";

interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

const icons = {
  success: <CheckCircle size={16} className="text-emerald-400" />,
  error:   <AlertCircle size={16} className="text-red-400" />,
  info:    <Info size={16} className="text-sky-400" />,
  warning: <AlertTriangle size={16} className="text-amber-400" />,
};

const borders = {
  success: "border-emerald-500/30",
  error:   "border-red-500/30",
  info:    "border-sky-500/30",
  warning: "border-amber-500/30",
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEventBus("toast:show", ({ message, type }) => {
    const id = `toast-${Date.now()}`;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  });

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            variants={toastVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl
              bg-slate-900 border ${borders[toast.type]} shadow-xl backdrop-blur-sm min-w-64 max-w-sm`}
          >
            {icons[toast.type]}
            <span className="text-sm text-slate-200 flex-1">{toast.message}</span>
            <button
              onClick={() => setToasts((t) => t.filter((x) => x.id !== toast.id))}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
