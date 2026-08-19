import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiCheckCircle, 
  HiExclamationCircle, 
  HiInformationCircle, 
  HiExclamationTriangle, 
  HiXMark 
} from 'react-icons/hi2';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const showSuccess = useCallback((msg, duration) => addToast(msg, 'success', duration), [addToast]);
  const showError = useCallback((msg, duration) => addToast(msg, 'error', duration), [addToast]);
  const showInfo = useCallback((msg, duration) => addToast(msg, 'info', duration), [addToast]);
  const showWarning = useCallback((msg, duration) => addToast(msg, 'warning', duration), [addToast]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <HiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
      case 'error':
        return <HiExclamationCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
      case 'warning':
        return <HiExclamationTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />;
      default:
        return <HiInformationCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success': return 'border-emerald-300 bg-emerald-50 text-emerald-900';
      case 'error': return 'border-red-300 bg-red-50 text-red-900';
      case 'warning': return 'border-amber-300 bg-amber-50 text-amber-900';
      default: return 'border-blue-300 bg-blue-50 text-blue-900';
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, showSuccess, showError, showInfo, showWarning, removeToast }}>
      {children}
      
      {/* Toast Render Portal */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg ${getBorderColor(toast.type)}`}
            >
              {getIcon(toast.type)}
              <div className="flex-1 text-sm font-medium leading-snug">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="opacity-70 hover:opacity-100 transition-opacity p-0.5 rounded-lg hover:bg-white/10"
                aria-label="Dismiss notification"
              >
                <HiXMark className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      addToast: (msg) => console.log('[Toast Info]', msg),
      showSuccess: (msg) => console.log('[Toast Success]', msg),
      showError: (msg) => console.error('[Toast Error]', msg),
      showInfo: (msg) => console.log('[Toast Info]', msg),
      showWarning: (msg) => console.warn('[Toast Warning]', msg),
      removeToast: () => {},
    };
  }
  return context;
};

export default ToastContext;
