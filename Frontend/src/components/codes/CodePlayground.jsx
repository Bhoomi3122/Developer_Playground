import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CodeEditor from './CodeEditor';
import OutputScreen from './LiveCode';
import ControlPanel from './Controls';
import { useToast } from '../ToastProvider';

const CodePlayground = ({ snippets = [] }) => {
  const cleanCode = (code) => {
    if (!code) return '';

    // Unescape common escaped characters
    return code
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\r/g, '\r')
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\\\/g, '\\')
      .trim();
  };

  // Initialize state for all snippets
  const [allCodes, setAllCodes] = useState(() => {
    return snippets.map(snippet => ({
      html: cleanCode(snippet.html) || '<h1>Hello World!</h1>\n<p>Start coding here...</p>',
      css: cleanCode(snippet.css) || 'h1 {\n  color: #333;\n  text-align: center;\n}\n\np {\n  color: #666;\n  text-align: center;\n}',
      js: cleanCode(snippet.js) || '// Add your JavaScript here\nconsole.log("Hello from the playground!");'
    }));
  });

  const [allPreviewCodes, setAllPreviewCodes] = useState(() => {
    return snippets.map(snippet => ({
      html: cleanCode(snippet.html) || '<h1>Hello World!</h1>\n<p>Start coding here...</p>',
      css: cleanCode(snippet.css) || 'h1 {\n  color: #333;\n  text-align: center;\n}\n\np {\n  color: #666;\n  text-align: center;\n}',
      js: cleanCode(snippet.js) || '// Add your JavaScript here\nconsole.log("Hello from the playground!");'
    }));
  });

  // ADD STATE FOR DEFAULT PLAYGROUND
  const [defaultCode, setDefaultCode] = useState({
    html: '<h1>Hello World!</h1>\n<p>Start coding here...</p>',
    css: 'h1 {\n  color: #333;\n  text-align: center;\n}\n\np {\n  color: #666;\n  text-align: center;\n}',
    js: '// Add your JavaScript here\nconsole.log("Hello from the playground!");'
  });

  const [defaultPreviewCode, setDefaultPreviewCode] = useState({
    html: '<h1>Hello World!</h1>\n<p>Start coding here...</p>',
    css: 'h1 {\n  color: #333;\n  text-align: center;\n}\n\np {\n  color: #666;\n  text-align: center;\n}',
    js: '// Add your JavaScript here\nconsole.log("Hello from the playground!");'
  });

  const { showToast } = useToast();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  };

  useEffect(() => {
    checkAuth(); // initial check

    const interval = setInterval(() => {
      checkAuth();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle code changes for a specific snippet
  const handleCodeChange = (snippetIndex, language, value) => {
    setAllCodes(prev => {
      const newCodes = [...prev];
      newCodes[snippetIndex] = { ...newCodes[snippetIndex], [language]: value };
      return newCodes;
    });
  };

  // HANDLE CODE CHANGES FOR DEFAULT PLAYGROUND
  const handleDefaultCodeChange = (language, value) => {
    setDefaultCode(prev => ({ ...prev, [language]: value }));
  };

  // Handle run for a specific snippet
  const handleRun = async (snippetIndex) => {
    setAllPreviewCodes(prev => {
      const newPreviewCodes = [...prev];
      newPreviewCodes[snippetIndex] = { ...allCodes[snippetIndex] };
      return newPreviewCodes;
    });
    return new Promise(resolve => setTimeout(resolve, 300));
  };

  // HANDLE RUN FOR DEFAULT PLAYGROUND
  const handleDefaultRun = async () => {
    setDefaultPreviewCode({ ...defaultCode });
    return new Promise(resolve => setTimeout(resolve, 300));
  };

  // Handle save for a specific snippet
  const handleSave = async (snippetIndex) => {
    if (!isAuthenticated) {
      showToast("User not authenticated. Please login to save.");
      return;
    }

    try {
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
        throw new Error(errorData.message || 'Failed to save snippet');
      }

      const responseData = await response.json();
      showToast('Save successful!');
      return responseData;
    } catch (error) {
      showToast(`Save failed: ${error.message}`);
      throw error;
    }
  };

  // HANDLE SAVE FOR DEFAULT PLAYGROUND
  const handleDefaultSave = async () => {
    if (!isAuthenticated) {
      showToast("User not authenticated. Please login to save.");
      return;
    }

    try {
      const payload = {
        name: 'Code Playground',
        tags: ['HTML', 'CSS', 'JavaScript'],
        html: defaultCode.html,
        css: defaultCode.css,
        js: defaultCode.js,
      };

      const token = localStorage.getItem('authToken');
      const baseUrl = import.meta.env.VITE_API_URL;
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
        throw new Error(errorData.message || 'Failed to save snippet');
      }

      const responseData = await response.json();
      showToast('Save successful!');
      return responseData;
    } catch (error) {
      showToast(`Save failed: ${error.message}`);
      throw error;
    }
  };

  // Handle AI enhancement for a specific snippet
  const handleAI = async (snippetIndex) => {
    const snippet = snippets[snippetIndex];
    showToast(`AI enhancement requested for: ${snippet.name}`);

    // Simulate AI enhancement
    const currentCss = allCodes[snippetIndex].css;
    const aiEnhancedCSS = currentCss + '\n\n/* AI Enhanced Styles */\nbody {\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  min-height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n}';

    setAllCodes(prev => {
      const newCodes = [...prev];
      newCodes[snippetIndex] = { ...newCodes[snippetIndex], css: aiEnhancedCSS };
      return newCodes;
    });

    return new Promise(resolve => setTimeout(resolve, 1500));
  };

  // HANDLE AI FOR DEFAULT PLAYGROUND
  const handleDefaultAI = async () => {
    showToast('AI enhancement requested for Code Playground');

    // Simulate AI enhancement
    const currentCss = defaultCode.css;
    const aiEnhancedCSS = currentCss + '\n\n/* AI Enhanced Styles */\nbody {\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  min-height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n}';

    setDefaultCode(prev => ({ ...prev, css: aiEnhancedCSS }));

    return new Promise(resolve => setTimeout(resolve, 1500));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  if (snippets.length === 0) {
    const defaultSnippet = {
      name: 'Code Playground',
      description: 'An interactive playground for HTML, CSS, and JavaScript',
      id: 'playground-1',
      tags: ['HTML', 'CSS', 'JavaScript']
    };

    return (
      <motion.div
        className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden max-w-7xl mx-auto mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6"
          variants={itemVariants}
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold mb-2">{defaultSnippet.name}</h2>
              <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                {defaultSnippet.description}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Active</span>
              </div>
            </div>
          </div>

          {/* Tech Stack Indicators */}
          <div className="flex items-center gap-2 mt-4">
            <span className="bg-orange-500 bg-opacity-20 text-white px-2 py-1 rounded text-xs font-medium">
              HTML
            </span>
            <span className="bg-blue-500 bg-opacity-20 text-white px-2 py-1 rounded text-xs font-medium">
              CSS
            </span>
            <span className="bg-yellow-500 bg-opacity-20 text-white px-2 py-1 rounded text-xs font-medium">
              JavaScript
            </span>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="p-6">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
            variants={itemVariants}
          >
            {/* Code Editor */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <h3 className="font-semibold text-slate-800">Code Editor</h3>
              </div>
              <div className="h-96">
                <CodeEditor
                  codes={defaultCode}
                  onCodeChange={handleDefaultCodeChange}
                />
              </div>
            </div>

            {/* Output Screen */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20l9-8-9-8-9 8 9 8z" />
                </svg>
                <h3 className="font-semibold text-slate-800">Output</h3>
              </div>
              <div className="h-96 border border-slate-300 rounded bg-white overflow-auto">
                <OutputScreen
                  htmlCode={defaultPreviewCode.html}
                  cssCode={defaultPreviewCode.css}
                  jsCode={defaultPreviewCode.js}
                />
              </div>
            </div>
          </motion.div>

          {/* Controls */}
          <ControlPanel
            onRun={handleDefaultRun}
            onSave={handleDefaultSave}
            onAI={handleDefaultAI}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden max-w-7xl mx-auto mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {snippets.map((snippet, index) => (
        <motion.div
          key={snippet.id || index}
          className="mb-10 border-b border-slate-300 last:border-b-0"
          variants={itemVariants}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold mb-2">{snippet.name}</h2>
                <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                  {snippet.description}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Active</span>
                </div>
              </div>
            </div>

            {/* Tech Stack Indicators */}
            <div className="flex items-center gap-2 mt-4">
              {snippet.tags && snippet.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    tag.toLowerCase() === 'html' ? 'bg-orange-500 bg-opacity-20 text-white' :
                    tag.toLowerCase() === 'css' ? 'bg-blue-500 bg-opacity-20 text-white' :
                    tag.toLowerCase() === 'javascript' ? 'bg-yellow-500 bg-opacity-20 text-white' :
                    'bg-gray-300 text-gray-700'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="p-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Code Editor */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <h3 className="font-semibold text-slate-800">Code Editor</h3>
                </div>
                <div className="h-90">
                  <CodeEditor
                    codes={allCodes[index]}
                    onCodeChange={(language, value) => handleCodeChange(index, language, value)}
                  />
                </div>
              </div>

              {/* Output Screen */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20l9-8-9-8-9 8 9 8z" />
                  </svg>
                  <h3 className="font-semibold text-slate-800">Output</h3>
                </div>
                <div className="h-90 border border-slate-300 rounded bg-white overflow-auto">
                  <OutputScreen
                    htmlCode={allPreviewCodes[index].html}
                    cssCode={allPreviewCodes[index].css}
                    jsCode={allPreviewCodes[index].js}
                  />
                </div>
              </div>
            </div>

            {/* Controls */}
            <ControlPanel
              onRun={() => handleRun(index)}
              onSave={() => handleSave(index)}
              onAI={() => handleAI(index)}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CodePlayground;