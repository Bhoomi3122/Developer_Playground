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
      showToast('Code copied successfully');
      setTimeout(() => setCopySuccess(''), 1500);
    } catch {
      showToast('Failed to copy code');
    }
  };

  if (availableTabs.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-500">No code provided</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Tabs */}
      <div className="flex bg-gray-50 rounded-t-lg border-b border-gray-200">
        {availableTabs.map((tab) => (
          <motion.button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors border-r border-gray-200 last:border-r-0 ${
              activeTab === tab.key 
                ? 'bg-white text-gray-900 border-b-2 border-blue-500' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span className="text-xs">{tab.icon}</span>
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <button
          onClick={() => handleCopy(codes[activeTab] || '', activeTab)}
          className="absolute top-2 right-2 p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors z-10"
          title="Copy code"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        {copySuccess === activeTab && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-2 right-12 bg-green-500 text-white px-2 py-1 rounded text-xs z-20"
          >
            Copied
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            <textarea
              value={codes[activeTab] || ''}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="w-full h-full p-3 bg-white text-gray-800 font-mono text-xs leading-relaxed resize-none outline-none rounded-b-lg border-0 placeholder-gray-400"
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