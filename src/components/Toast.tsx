import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export interface ToastProps {
  id?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: () => void;
  isVisible: boolean;
}

export default function Toast({
  type,
  title,
  message,
  duration = 5000,
  onClose,
  isVisible
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200',
          icon: 'text-green-600',
          iconBg: 'bg-green-100',
          title: 'text-green-800',
          message: 'text-green-700',
          closeButton: 'text-green-400 hover:text-green-600'
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          icon: 'text-red-600',
          iconBg: 'bg-red-100',
          title: 'text-red-800',
          message: 'text-red-700',
          closeButton: 'text-red-400 hover:text-red-600'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          icon: 'text-yellow-600',
          iconBg: 'bg-yellow-100',
          title: 'text-yellow-800',
          message: 'text-yellow-700',
          closeButton: 'text-yellow-400 hover:text-yellow-600'
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-600',
          iconBg: 'bg-blue-100',
          title: 'text-blue-800',
          message: 'text-blue-700',
          closeButton: 'text-blue-400 hover:text-blue-600'
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200',
          icon: 'text-gray-600',
          iconBg: 'bg-gray-100',
          title: 'text-gray-800',
          message: 'text-gray-700',
          closeButton: 'text-gray-400 hover:text-gray-600'
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
      <div className={`max-w-sm w-full border rounded-lg shadow-lg ${styles.container}`}>
        <div className="p-4">
          <div className="flex items-start">
            <div className={`flex-shrink-0 p-1 rounded-full ${styles.iconBg}`}>
              <div className={styles.icon}>
                {getIcon()}
              </div>
            </div>
            
            <div className="ml-3 flex-1">
              <h4 className={`text-sm font-medium ${styles.title}`}>
                {title}
              </h4>
              {message && (
                <p className={`mt-1 text-sm ${styles.message}`}>
                  {message}
                </p>
              )}
            </div>
            
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 ${styles.closeButton} hover:bg-white/20 transition-colors`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
