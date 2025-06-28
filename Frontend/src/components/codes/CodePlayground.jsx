import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CodeEditor from './CodeEditor';
import OutputScreen from './LiveCode';
import ControlPanel from './Controls';
import { useToast } from '../ToastProvider';

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
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center max-w-4xl mx-auto">
        <div className="text-gray-400 mb-3">
          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <p className="text-sm text-gray-500">No code snippets available</p>
      </div>
    );
  }

  return (
    <div className="mt-10 max-w-6xl mx-auto space-y-10 px-4 bg-[#f9fafb]">
      {snippets.map((snippet, index) => (
        <motion.div
          key={snippet.id || index}
          className="bg-slate-50 rounded-xl shadow-md ring-1 ring-slate-200 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-indigo-400 to-slate-400">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white">{snippet.name}</h3>
                {snippet.description && (
                  <p className="text-sm text-white mt-1">{snippet.description}</p>
                )}
              </div>

              {snippet.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                  {snippet.tags.map((tag, idx) => {
                    const colorMap = {
                      html: "bg-orange-100 text-orange-700",
                      css: "bg-blue-100 text-blue-700",
                      javascript: "bg-yellow-100 text-yellow-700",
                    };
                    return (
                      <span
                        key={idx}
                        className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${colorMap[tag.toLowerCase()] || "bg-slate-100 text-slate-600"
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
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-200">
            {/* Code Editor */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2">Code Editor</h4>
              <div className="h-80 border border-slate-500 rounded-md overflow-hidden bg-white">
                <CodeEditor
                  codes={allCodes[index]}
                  onCodeChange={(language, value) => handleCodeChange(index, language, value)}
                />
              </div>
            </div>

            {/* Output Preview */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2">Live Preview</h4>
              <div className="h-80 border border-slate-500 rounded-md bg-white overflow-hidden">
                <OutputScreen
                  htmlCode={allPreviewCodes[index].html}
                  cssCode={allPreviewCodes[index].css}
                  jsCode={allPreviewCodes[index].js}
                />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="px-6 py-2 border-t border-slate-100 bg-slate-200">
            <ControlPanel
              onRun={() => handleRun(index)}
              onSave={() => handleSave(index)}
              onAI={() => handleAI(index)}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </motion.div>
      ))}

      {/* Rename Modal */}
      {showRenamePrompt && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-white/20 p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">A code snippet with this title is already saved.</h2>
            <p className="text-sm text-slate-600 mb-4">Do you want to rename your code snippet?</p>

            <input
              type="text"
              placeholder="Enter new name"
              value={newSnippetName}
              onChange={(e) => setNewSnippetName(e.target.value)}
              className="w-full border border-slate-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRenamePrompt(false);
                  setNewSnippetName('');
                  setSnippetToRename(null);
                }}
                className="px-4 py-2 text-sm bg-slate-100 text-slate-800 rounded-md hover:bg-slate-200"
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
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Save with New Name
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodePlayground;