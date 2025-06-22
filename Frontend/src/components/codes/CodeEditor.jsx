import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy } from 'lucide-react';
import { useToast } from '../ToastProvider';

const CodeEditor = ({ codes, onCodeChange }) => {
  const [activeTab, setActiveTab] = useState('html');
  const [copySuccess, setCopySuccess] = useState('');
    const { showToast } = useToast();
  const getAvailableTabs = () => {
    const tabs = [];
    if (codes.html !== undefined) tabs.push({ key: 'html', label: 'HTML', icon: '🏗️' });
    if (codes.css !== undefined) tabs.push({ key: 'css', label: 'CSS', icon: '🎨' });
    if (codes.js !== undefined) tabs.push({ key: 'js', label: 'JS', icon: '⚡' });
    return tabs;
  };

  const availableTabs = getAvailableTabs();

  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.find(tab => tab.key === activeTab)) {
      setActiveTab(availableTabs[0].key);
    }
  }, [codes, activeTab, availableTabs]);

  const handleCodeChange = (newCode) => {
    if (onCodeChange) {
      onCodeChange(activeTab, newCode || '');
    }
  };

  const handleCopy = async (code, tab) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(tab);
      if (showToast) showToast('Code copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch {
      if (showToast) showToast('Failed to copy code. Please try again.');
    }
  };

  const tabVariants = {
    inactive: { backgroundColor: '#475569', color: '#94a3b8', scale: 0.95 },
    active: { backgroundColor: '#1e293b', color: '#ffffff', scale: 1 }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  if (availableTabs.length === 0) {
    if (showToast) showToast('No code available for this snippet');
    return (
      <div className="flex items-center justify-center h-96 bg-slate-800 rounded-lg border border-slate-600">
        <p className="text-slate-400">No code available for this snippet</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex bg-slate-700 rounded-t-lg overflow-hidden relative">
        {availableTabs.map((tab) => (
          <motion.button
            key={tab.key}
            variants={tabVariants}
            animate={activeTab === tab.key ? 'active' : 'inactive'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all duration-200 border-r border-slate-600 last:border-r-0 relative"
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {activeTab === tab.key && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1 relative bg-slate-800 rounded-b-lg">
        <button
          onClick={() => handleCopy(codes[activeTab] || '', activeTab)}
          className="absolute top-3 right-3 p-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors duration-200 z-10"
          title="Copy code"
        >
          <Copy className="w-4 h-4" />
        </button>

        {copySuccess === activeTab && (
          <div className="absolute top-3 right-16 bg-green-500 text-white px-3 py-1 rounded-lg text-sm z-40">
            Copied!
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <textarea
              value={codes[activeTab] || ''}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="w-full h-full p-4 bg-slate-800 text-white font-mono text-sm resize-none outline-none rounded-b-lg"
              placeholder={`Enter your ${activeTab.toUpperCase()} code here...`}
              spellCheck={false}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CodeEditor;
