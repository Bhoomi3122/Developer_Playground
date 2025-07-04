import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Save, Bot, CheckCheck } from 'lucide-react';
import { useToast } from '../ToastProvider';

const ControlPanel = ({ onRun, onSave, onAI }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [runComplete, setRunComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveComplete, setSaveComplete] = useState(false);
  // const [isAiRunning, setIsAiRunning] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { showToast } = useToast();

  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  };

  useEffect(() => {
    checkAuth();
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

 const handleRunClick = async () => {
  setIsRunning(true);
  setRunComplete(false);

  try {
    await onRun();

    // Ensure "Running..." shows for at least 1s
    setTimeout(() => {
      setRunComplete(true);

      // Auto-hide success after 2s
      setTimeout(() => setRunComplete(false), 2000);
    }, 1000);
  } catch (error) {
    showToast('Run failed. Please try again.');
  } finally {
    setTimeout(() => {
      setIsRunning(false);
    }, 1000); // Delay to match above
  }
};


  const handleSaveClick = async () => {
    if (!isAuthenticated) {
      showToast('Please login to save your code');
      return;
    }

    setIsSaving(true);
    setSaveComplete(false);
    try {
      const result = await onSave();
      if (result?.success) {
        setSaveComplete(true);
        setTimeout(() => setSaveComplete(false), 2000);
      }
    } catch (error) {
      showToast('Save failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAiClick = async () => {
      showToast('AI enhancement feature is coming soon.');
    
  };

  return (
    <motion.div 
      className="flex justify-center gap-3 mt-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Run Button */}
      <motion.button
        className="bg-blue-600  hover:cursor-pointer hover:bg-blue-700 text-white rounded-2xl shadow px-6 py-3 text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-all"
        onClick={handleRunClick}
        disabled={isRunning}
        whileHover={{ scale: 1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isRunning ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Running...
          </>
        ) : runComplete ? (
          <>
            <CheckCheck className="w-4 h-4" />
            Success
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Run
          </>
        )}
      </motion.button>

      {/* Save Button */}
      <motion.button
        className={`${
          isAuthenticated 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-gray-400 cursor-not-allowed'
        } text-white rounded-2xl shadow px-6 py-3 text-sm font-semibold  hover:cursor-pointer flex items-center gap-2 disabled:opacity-50 transition-all`}
        onClick={handleSaveClick}
        disabled={isSaving || !isAuthenticated}
        whileHover={isAuthenticated ? { scale: 1.05 } : {}}
        whileTap={isAuthenticated ? { scale: 0.95 } : {}}
      >
        {isSaving ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : saveComplete ? (
          <>
            <CheckCheck className="w-4 h-4" />
            Saved
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            {isAuthenticated ? 'Save' : 'Login to Save'}
          </>
        )}
      </motion.button>

      {/* AI Button */}
      <motion.button
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl shadow px-6 py-3 text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-all hover:cursor-pointer"
        onClick={handleAiClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        AI Enhance
      </motion.button>
    </motion.div>
  );
};

export default ControlPanel;