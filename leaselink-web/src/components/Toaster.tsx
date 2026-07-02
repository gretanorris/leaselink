import { useApp } from "@/lib/store";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const ICONS = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const COLORS = {
  success: "border-green-200",
  error: "border-red-200",
  info: "border-blue-200",
};

export default function AppToaster() {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="fixed top-20 right-4 z-[100] space-y-2 max-w-sm w-[calc(100%-2rem)] sm:w-auto">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`bg-white shadow-xl rounded-xl border ${COLORS[t.type]} p-4 flex items-start gap-3 animate-in slide-in-from-right-5 fade-in duration-300`}
        >
          <div className="flex-shrink-0 mt-0.5">{ICONS[t.type]}</div>
          <p className="flex-1 text-sm font-medium text-gray-800">{t.message}</p>
          <button
            onClick={() => dismissToast(t.id)}
            className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
