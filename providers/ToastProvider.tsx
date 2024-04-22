'use client';

import { createContext, useEffect, useState } from 'react';
import { Toast, ToastType } from '../components/Toast';

const ToastContext = createContext({
  showToast: (_message: string, _type?: ToastType) => {},
});

const ToastProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [type, setType] = useState<ToastType>('alert-success');
  const [message, setMessage] = useState('');

  const showToast = (message: string, type: ToastType = 'alert-success') => {
    setIsVisible(false);
    setMessage(message);
    setType(type);
    setIsVisible(true);
  };

  useEffect(() => {
    if (isVisible) {
      const hideToast = setTimeout(() => {
        setIsVisible(false);
      }, 5 * 1000);

      return () => {
        clearTimeout(hideToast);
      };
    }
  }, [isVisible]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {isVisible && (
        <Toast type={type} message={message} setIsVisible={setIsVisible} />
      )}
    </ToastContext.Provider>
  );
};

export { ToastContext, ToastProvider };
