import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, duration = 2000, callback = null) => {
        setToast({ message });

        setTimeout(() => {
            setToast(null);
            if (callback) callback();
        }, duration);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] 
                 px-6 py-2 bg-gradient-to-r from-neutral-700 to-neutral-800 
                 text-white font-medium rounded-lg shadow-md 
                 hover:shadow-lg transition-all duration-200 
                 text-center text-base w-auto max-w-md border border-neutral-600"
                    >
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

        </ToastContext.Provider>
    );
};
