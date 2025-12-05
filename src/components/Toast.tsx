"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
  type: "success" | "error" | "warning";
  message: string;
  onClose: () => void;
}

export default function Toast({ type, message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1250);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <XCircle className="text-red-500" size={20} />,
    warning: <AlertCircle className="text-yellow-500" size={20} />,
  };

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8, rotateX: 90 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      exit={{ 
        opacity: 0, 
        y: -30, 
        scale: 0.8, 
        rotateX: -90,
        transition: { 
          duration: 0.2, 
          ease: "easeInOut" 
        }
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
      className={`fixed top-4 right-4 z-50 flex items-center space-x-3 p-4 rounded-lg border shadow-lg max-w-md ${colors[type]}`}
    >
      {icons[type]}
      <p className="flex-1 text-sm font-medium">{message}</p>
    </motion.div>
  );
}
