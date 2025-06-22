import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal box */}
          <motion.div
            className="fixed top-1/4 left-1/2 -translate-x-1/2 z-[9999] 
                       bg-gradient-to-r from-indigo-600 to-blue-600 
                       text-white font-medium rounded-lg shadow-md 
                       px-6 py-4 w-full max-w-md text-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-base mb-4">{message}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onConfirm}
                className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
              >
                Confirm
              </button>
              <button
                onClick={onClose}
                className="bg-transparent border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-indigo-600 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
