import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Copy, Eye, Trash2, FileText, Palette, Zap } from 'lucide-react';
import { useToast } from './ToastProvider';

const SavedCodes = () => {
  const [savedCodes, setSavedCodes] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [activeTab, setActiveTab] = useState('html');
  const [copySuccess, setCopySuccess] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [codeToDelete, setCodeToDelete] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuth(!!token);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const fetchCodes = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseUrl}/api/code/my-codes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch codes');
      const data = await response.json();
      setSavedCodes(data);
    } catch (error) {
      console.error('Error fetching codes:', error);
      showToast('Failed to fetch codes, please try again.');
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const getTechStack = (code) => {
    const stack = [];
    if (code.html?.trim()) stack.push('HTML');
    if (code.css?.trim()) stack.push('CSS');
    if (code.js?.trim()) stack.push('JS');
    return stack;
  };

  const getTechIcon = (tech) => {
    switch (tech) {
      case 'HTML': return <FileText className="w-3 h-3" />;
      case 'CSS': return <Palette className="w-3 h-3" />;
      case 'JS': return <Zap className="w-3 h-3" />;
      default: return null;
    }
  };

  const getTechColor = (tech) => {
    switch (tech) {
      case 'HTML': return 'bg-gradient-to-r from-rose-500 to-rose-600 text-white border-neutral-400';
      case 'CSS': return ' bg-gradient-to-r from-rose-500 to-rose-600 text-white border-stone-400';
      case 'JS': return 'bg-neutral-300 text-neutral-900 border-neutral-600';
      default: return 'bg-neutral-100 text-neutral-700 border-neutral-300';
    }
  };

  const handleViewCode = (codeId) => {
    if (expandedCard === codeId) {
      setExpandedCard(null);
    } else {
      setExpandedCard(codeId);
      const code = savedCodes.find(c => c.id === codeId);
      const stack = getTechStack(code);
      if (stack.length > 0) setActiveTab(stack[0].toLowerCase());
    }
  };

  const handleUnsaveClick = (id) => {
    setCodeToDelete(id);
    setShowConfirmModal(true);
  };

  const handleUnsave = async (id) => {
    setShowConfirmModal(false);
    const authToken = localStorage.getItem("authToken");
    const baseUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${baseUrl}/api/code/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const data = await response.json();
        showToast(`Error: ${data.message || "Failed to delete snippet"}`);
        return;
      }

      showToast("Snippet deleted successfully");
      await fetchCodes();
    } catch (error) {
      console.error("Error deleting snippet:", error);
      showToast("Server error occurred while deleting");
    }
  };

  const cancelUnsave = () => {
    setShowConfirmModal(false);
    setCodeToDelete(null);
  };

  const handleCopy = async (code, tab) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(tab);
      showToast('Code copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
      showToast('Failed to copy code, try again.');
    }
  };

  const getActiveTabContent = (code) => {
    switch (activeTab) {
      case 'html': return code.html;
      case 'css': return code.css;
      case 'js': return code.js;
      default: return '';
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0 }
  };

  if (savedCodes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Code2 className="w-16 h-16 text-neutral-500 mx-auto mb-4" />
          <p className="text-neutral-700 text-base font-medium">
            {isAuth ? "Saved Codes will appear here" : "Login to Save Reusable Codes here"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 relative">
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 10, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute left-1/2 transform -translate-x-1/2 z-20 w-full max-w-md p-6 rounded-lg shadow-lg bg-gradient-to-r from-neutral-800 to-neutral-900 text-white font-medium"
          >
            <p className="mb-4">Are you sure you want to unsave this code snippet?</p>
            <div className="flex justify-end gap-3">
              <button onClick={cancelUnsave} className="px-4 py-2 bg-neutral-300 text-neutral-900 rounded-lg font-semibold hover:bg-neutral-400 transition hover:cursor-pointer">Cancel</button>
              <button onClick={() => handleUnsave(codeToDelete)} className="px-4 py-2 bg-neutral-700 text-white rounded-lg font-semibold hover:bg-neutral-600 transition hover:cursor-pointer">Yes, Unsave</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">Saved Code Snippets</h1>
          <p className="text-neutral-700 text-sm">Your collection of reusable code components</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isAuth && savedCodes.map((code) => {
            const techStack = getTechStack(code);
            const isExpanded = expandedCard === code.id;

            return (
              <motion.div
                key={code.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className={`bg-white rounded-xl shadow-md border border-neutral-300 overflow-hidden hover:shadow-lg hover:border-neutral-400 transition-all duration-300 ${isExpanded ? 'lg:col-span-2 xl:col-span-3' : ''}`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-neutral-900 mb-2">{code.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        {techStack.map((tech) => (
                          <span
                            key={tech}
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTechColor(tech)}`}
                          >
                            {getTechIcon(tech)}
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleViewCode(code.id)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-neutral-700  text-white rounded-lg hover:bg-neutral-800 transition hover:cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      {isExpanded ? 'Hide Code' : 'View Code'}
                    </button>
                    <button
                      onClick={() => handleUnsaveClick(code.id)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-neutral-300 text-neutral-800 rounded-lg hover:bg-neutral-400 transition hover:cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      Unsave
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="border-t border-neutral-300 bg-neutral-100"
                    >
                      <div className="p-5">
                        <div className="flex border-b border-neutral-300 mb-4">
                          {techStack.map((tech) => {
                            const tabKey = tech.toLowerCase();
                            const isActive = activeTab === tabKey;
                            const hasContent = code[tabKey] && code[tabKey].trim();

                            if (!hasContent) return null;

                            return (
                              <button
                                key={tabKey}
                                onClick={() => setActiveTab(tabKey)}
                                className={`px-4 py-2 text-sm font-medium rounded-t-md transition-all duration-200 ${
                                  isActive
                                    ? 'text-neutral-900 bg-white border-l border-r border-t border-neutral-300 -mb-px shadow-sm'
                                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                                }`}
                              >
                                <div className="flex items-center gap-1">
                                  {getTechIcon(tech)}
                                  {tech}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        <div className="relative">
                          <button
                            onClick={() => handleCopy(getActiveTabContent(code), activeTab)}
                            className="absolute top-3 right-3 p-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition"
                            aria-label="Copy Code"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          <motion.pre
                            key={activeTab + code.id}
                            variants={tabContentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="whitespace-pre-wrap p-4 rounded-md border border-neutral-400 bg-white font-mono text-sm overflow-x-auto max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-400 text-neutral-900"
                          >
                            {getActiveTabContent(code)}
                          </motion.pre>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SavedCodes;
