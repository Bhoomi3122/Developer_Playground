import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CodeEditor from './CodeEditor';
import OutputScreen from './LiveCode';
import ControlPanel from './Controls';
import { useToast } from '../ToastProvider';
import { SnippetProvider } from '../../context/SnippetContext';

const CodePlayground = ({ snippets = [] }) => {
  const cleanCode = (code) => {
    if (!code) return '';
    return code
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\r/g, '\r')
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\\\/g, '\\')
      .trim();
  };

  const [allCodes, setAllCodes] = useState(() => {
    return snippets.map(snippet => ({
      html: cleanCode(snippet.html) || '',
      css: cleanCode(snippet.css) || '',
      js: cleanCode(snippet.js) || ''
    }));
  });

  const [showRenamePrompt, setShowRenamePrompt] = useState(false);
  const [newSnippetName, setNewSnippetName] = useState('');
  const [snippetToRename, setSnippetToRename] = useState(null);

  const [allPreviewCodes, setAllPreviewCodes] = useState(() => {
    return snippets.map(snippet => ({
      html: cleanCode(snippet.html) || '',
      css: cleanCode(snippet.css) || '',
      js: cleanCode(snippet.js) || ''
    }));
  });

  const { showToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };

    checkAuth();
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCodeChange = (snippetIndex, language, value) => {
    setAllCodes(prev => {
      const newCodes = [...prev];
      newCodes[snippetIndex] = { ...newCodes[snippetIndex], [language]: value };
      return newCodes;
    });
  };

  const handleRun = async (snippetIndex) => {
    setAllPreviewCodes(prev => {
      const newPreviewCodes = [...prev];
      newPreviewCodes[snippetIndex] = { ...allCodes[snippetIndex] };
      return newPreviewCodes;
    });
    await new Promise(resolve => setTimeout(resolve, 200));
  };

  const handleSave = async (snippetIndex) => {
    if (!isAuthenticated) {
      showToast("Please log in to save your code");
      return { success: false };
    }

    const snippet = snippets[snippetIndex];
    const currentCode = allCodes[snippetIndex];

    const payload = {
      name: snippet.name,
      tags: snippet.tags,
      html: currentCode.html,
      css: currentCode.css,
      js: currentCode.js,
    };

    const token = localStorage.getItem('authToken');
    const baseUrl = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${baseUrl}/api/code/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.message?.includes('already saved')) {
          setSnippetToRename(snippetIndex);
          setShowRenamePrompt(true);
          return { success: false, showRename: true };
        }

        throw new Error(errorData.message || 'Save failed');
      }

      showToast('Code saved successfully');
      return { success: true };
    } catch (error) {
      showToast(`Failed to save: ${error.message}`);
      return { success: false };
    }
  };

  const handleAI = async (snippetIndex) => {
    const snippet = snippets[snippetIndex];
    showToast(`Enhancing ${snippet.name}...`);

    const currentCss = allCodes[snippetIndex].css;
    const enhancement = '\n\n/* AI Enhanced */\nbody {\n  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  line-height: 1.6;\n}';

    setAllCodes(prev => {
      const newCodes = [...prev];
      newCodes[snippetIndex] = { ...newCodes[snippetIndex], css: currentCss + enhancement };
      return newCodes;
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  if (snippets.length === 0) {
    return (
      <div className="bg-neutral-100 border border-neutral-300 rounded-lg p-6 text-center max-w-4xl mx-auto">
        <div className="text-neutral-500 mb-3">
          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <p className="text-sm text-neutral-600">No code snippets available</p>
      </div>
    );
  }

  return (
    <SnippetProvider>
      <div className="mt-10 max-w-6xl mx-auto space-y-10 px-4">
        {snippets.map((snippet, index) => (
          <motion.div
            key={snippet.id || index}
            className="bg-neutral-50 rounded-xl shadow-md ring-1 ring-neutral-300 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {/* Header - AI Chatbot Style */}
            <div className="px-6 py-5 border-b border-neutral-300 bg-gradient-to-r from-neutral-700 to-neutral-800 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white">{snippet.name}</h3>
                  {snippet.description && (
                    <p className="text-sm text-rose-300 mt-1">{snippet.description}</p>
                  )}
                </div>

                {snippet.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                    {snippet.tags.map((tag, idx) => {
                      const colorMap = {
                        html: "bg-white/20 text-white border border-white/30",
                        css: "bg-rose-400/20 text-rose-200 border border-rose-300/40",
                        javascript: "bg-white/30 text-white border border-white/40",
                      };
                      return (
                        <span
                          key={idx}
                          className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${colorMap[tag.toLowerCase()] || "bg-white/20 text-white border border-white/30"
                            }`}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-neutral-200">
              {/* Code Editor */}
              <div>
                <h4 className="text-sm font-medium text-neutral-800 mb-2">Code Editor</h4>
                <div className="h-80 border border-neutral-600 rounded-md overflow-hidden bg-white">
                  <CodeEditor
                    codes={allCodes[index]}
                    onCodeChange={(language, value) => handleCodeChange(index, language, value)}
                  />
                </div>
              </div>

              {/* Output Preview */}
              <div>
                <h4 className="text-sm font-medium text-neutral-800 mb-2">Live Preview</h4>
                <div className="h-80 border border-neutral-600 rounded-md bg-white overflow-hidden">
                  <OutputScreen
                    htmlCode={allPreviewCodes[index].html}
                    cssCode={allPreviewCodes[index].css}
                    jsCode={allPreviewCodes[index].js}
                  />
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="px-6 py-2 border-t border-neutral-400 bg-neutral-300">
              <ControlPanel
                onRun={() => handleRun(index)}
                onSave={() => handleSave(index)}
                onAI={() => handleAI(index)}
                isAuthenticated={isAuthenticated}
                snippetId={snippet.id || index}
                snippetInfo={{
                  name: snippet.name,
                  codes: allCodes[index],
                  tags: snippet.tags
                }}
                onCodeUpdate={(newCode) => handleCodeChange(index, 'html', newCode.html) || handleCodeChange(index, 'css', newCode.css) || handleCodeChange(index, 'js', newCode.js)}
              />
            </div>
          </motion.div>
        ))}

        {/* Rename Modal */}
        {showRenamePrompt && (
          <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center z-30">
            <div className="bg-white rounded-lg shadow-xl border border-neutral-300 p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold text-neutral-900 mb-3">A code snippet with this title is already saved.</h2>
              <p className="text-sm text-neutral-700 mb-4">Do you want to rename your code snippet?</p>

              <input
                type="text"
                placeholder="Enter new name"
                value={newSnippetName}
                onChange={(e) => setNewSnippetName(e.target.value)}
                className="w-full border border-neutral-400 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-neutral-600 text-neutral-900"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRenamePrompt(false);
                    setNewSnippetName('');
                    setSnippetToRename(null);
                  }}
                  className="px-4 py-2 text-sm bg-neutral-200 text-neutral-800 rounded-md hover:bg-neutral-300"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    if (!newSnippetName.trim()) {
                      showToast("Please provide a new name");
                      return;
                    }

                    const index = snippetToRename;
                    const snippet = snippets[index];
                    const currentCode = allCodes[index];

                    const payload = {
                      name: newSnippetName,
                      tags: snippet.tags,
                      html: currentCode.html,
                      css: currentCode.css,
                      js: currentCode.js,
                    };

                    const token = localStorage.getItem('authToken');
                    const baseUrl = import.meta.env.VITE_API_URL;

                    try {
                      const response = await fetch(`${baseUrl}/api/code/save`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(payload),
                      });

                      if (!response.ok) {
                        const errData = await response.json();
                        throw new Error(errData.message || 'Failed');
                      }

                      showToast('Code saved successfully with new name!');
                      setShowRenamePrompt(false);
                      setNewSnippetName('');
                      setSnippetToRename(null);
                    } catch (err) {
                      showToast(`Error: ${err.message}`);
                    }
                  }}
                  className="px-4 py-2 text-sm bg-neutral-700 text-white rounded-md hover:bg-neutral-800"
                >
                  Save with New Name
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SnippetProvider>
  );
};

export default CodePlayground;
