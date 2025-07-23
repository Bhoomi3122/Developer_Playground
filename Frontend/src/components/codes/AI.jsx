import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, User, Menu, HelpCircle, Code, Maximize2, Minimize2 } from 'lucide-react';
import { useSnippetContext } from '../../context/SnippetContext';

const AIComponent = ({ onClose }) => {
  const {
    currentSnippet,
    snippetData,
    clearSnippet,
    updateSnippetCode,
    addChatMessage,
    getChatMessages
  } = useSnippetContext();

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [size, setSize] = useState({ width: 450, height: 600 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Get current snippet info and messages
  const currentSnippetInfo = currentSnippet ? snippetData[currentSnippet] : null;
  const messages = currentSnippet ? getChatMessages(currentSnippet) : [];

  // Sample AI enhancement suggestions based on code context
  const getContextualSuggestions = () => {
    if (!currentSnippetInfo) return [];
    
    const suggestions = [
      {
        text: "Make this responsive",
        icon: "📱",
        description: "Add responsive design features"
      },
      {
        text: "Add animations",
        icon: "✨",
        description: "Include CSS animations and transitions"
      },
      {
        text: "Improve accessibility",
        icon: "♿",
        description: "Add ARIA labels and accessibility features"
      },
      {
        text: "Optimize performance",
        icon: "⚡",
        description: "Optimize code for better performance"
      },
      {
        text: "Add dark mode",
        icon: "🌙",
        description: "Implement dark mode support"
      },
      {
        text: "Convert to modern syntax",
        icon: "🔄",
        description: "Update to ES6+ and modern practices"
      }
    ];

    return suggestions;
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // Handle mouse events for resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing && resizeDirection && !isMaximized) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        
        if (resizeDirection.includes('right')) {
          newWidth = Math.max(350, Math.min(800, resizeStart.width + deltaX));
        }
        if (resizeDirection.includes('left')) {
          newWidth = Math.max(350, Math.min(800, resizeStart.width - deltaX));
        }
        if (resizeDirection.includes('bottom')) {
          newHeight = Math.max(400, Math.min(800, resizeStart.height + deltaY));
        }
        if (resizeDirection.includes('top')) {
          newHeight = Math.max(400, Math.min(800, resizeStart.height - deltaY));
        }
        
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDirection('');
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeDirection, resizeStart, isMaximized]);

  // Simulate AI processing with context awareness
  const processAIRequest = async (userMessage) => {
    if (!currentSnippetInfo) return "No snippet context available.";

    // Simulate AI processing based on current snippet context
    const context = {
      snippetName: currentSnippetInfo.name,
      htmlCode: currentSnippetInfo.codes?.html || '',
      cssCode: currentSnippetInfo.codes?.css || '',
      jsCode: currentSnippetInfo.codes?.js || '',
      tags: currentSnippetInfo.tags || []
    };

    // Simulate different AI responses based on user input
    const responses = {
      responsive: {
        message: `I'll make "${context.snippetName}" responsive by adding mobile-first CSS media queries.`,
        codeChanges: {
          css: context.cssCode + `\n\n/* AI Enhancement: Responsive Design */\n@media (max-width: 768px) {\n  .container { padding: 1rem; }\n  .grid { grid-template-columns: 1fr; }\n}\n\n@media (max-width: 480px) {\n  body { font-size: 14px; }\n}`
        }
      },
      animation: {
        message: `Adding smooth animations to "${context.snippetName}" for better user experience.`,
        codeChanges: {
          css: context.cssCode + `\n\n/* AI Enhancement: Animations */\n* { transition: all 0.3s ease; }\n.fade-in { animation: fadeIn 0.5s ease-in; }\n@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`
        }
      },
      accessibility: {
        message: `Improving accessibility for "${context.snippetName}" with ARIA labels and semantic HTML.`,
        codeChanges: {
          html: context.htmlCode.replace(/<div/g, '<div role="region" aria-label="Content section"')
        }
      },
      performance: {
        message: `Optimizing "${context.snippetName}" for better performance and loading speed.`,
        codeChanges: {
          css: context.cssCode + `\n\n/* AI Enhancement: Performance */\n.optimized { will-change: transform; transform: translateZ(0); }\nimg { loading: lazy; }`
        }
      },
      dark: {
        message: `Adding dark mode support to "${context.snippetName}".`,
        codeChanges: {
          css: context.cssCode + `\n\n/* AI Enhancement: Dark Mode */\n@media (prefers-color-scheme: dark) {\n  body { background: #1a1a1a; color: #ffffff; }\n  .card { background: #2d2d2d; border-color: #404040; }\n}`
        }
      }
    };

    // Determine response based on user message
    const userMsg = userMessage.toLowerCase();
    let response = responses.responsive; // default

    if (userMsg.includes('responsive') || userMsg.includes('mobile')) {
      response = responses.responsive;
    } else if (userMsg.includes('animation') || userMsg.includes('animate')) {
      response = responses.animation;
    } else if (userMsg.includes('accessibility') || userMsg.includes('aria')) {
      response = responses.accessibility;
    } else if (userMsg.includes('performance') || userMsg.includes('optimize')) {
      response = responses.performance;
    } else if (userMsg.includes('dark') || userMsg.includes('theme')) {
      response = responses.dark;
    }

    return response;
  };

  const handleSendMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || !currentSnippet) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: trimmedInput,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    addChatMessage(currentSnippet, userMessage);
    setInputValue('');
    setIsLoading(true);

    try {
      // Process AI request with context
      const aiResponse = await processAIRequest(trimmedInput);
      
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          text: aiResponse.message,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          codeChanges: aiResponse.codeChanges
        };

        addChatMessage(currentSnippet, botMessage);

        // Apply code changes if provided
        if (aiResponse.codeChanges && currentSnippetInfo?.onCodeUpdate) {
          const newCode = {
            html: aiResponse.codeChanges.html || currentSnippetInfo.codes?.html || '',
            css: aiResponse.codeChanges.css || currentSnippetInfo.codes?.css || '',
            js: aiResponse.codeChanges.js || currentSnippetInfo.codes?.js || ''
          };
          
          updateSnippetCode(currentSnippet, newCode);
          if (currentSnippetInfo.onCodeUpdate) {
            currentSnippetInfo.onCodeUpdate(newCode);
          }
        }

        setIsLoading(false);
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      console.error('Error processing AI request:', error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    clearSnippet();
    onClose();
  };

  const handleResizeStart = (direction, e) => {
    if (isMaximized) return;
    e.preventDefault();
    setIsResizing(true);
    setResizeDirection(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  if (!currentSnippet || !currentSnippetInfo) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.3 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white rounded-2xl shadow-2xl border border-neutral-300 overflow-hidden flex flex-col relative"
        style={{
          width: isMaximized ? '90vw' : size.width,
          height: isMaximized ? '90vh' : size.height,
          maxWidth: '90vw',
          maxHeight: '90vh'
        }}
      >
        {/* Resize Handles - only show when not maximized */}
        {!isMaximized && (
          <>
            <div className="absolute top-0 left-2 right-2 h-1 cursor-ns-resize hover:bg-rose-500 hover:opacity-50 transition-all" onMouseDown={(e) => handleResizeStart('top', e)} />
            <div className="absolute bottom-0 left-2 right-2 h-1 cursor-ns-resize hover:bg-rose-500 hover:opacity-50 transition-all" onMouseDown={(e) => handleResizeStart('bottom', e)} />
            <div className="absolute left-0 top-2 bottom-2 w-1 cursor-ew-resize hover:bg-rose-500 hover:opacity-50 transition-all" onMouseDown={(e) => handleResizeStart('left', e)} />
            <div className="absolute right-0 top-2 bottom-2 w-1 cursor-ew-resize hover:bg-rose-500 hover:opacity-50 transition-all" onMouseDown={(e) => handleResizeStart('right', e)} />
            <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize hover:bg-rose-500 hover:opacity-50 transition-all" onMouseDown={(e) => handleResizeStart('top-left', e)} />
            <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize hover:bg-rose-500 hover:opacity-50 transition-all" onMouseDown={(e) => handleResizeStart('top-right', e)} />
            <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize hover:bg-rose-500 hover:opacity-50 transition-all" onMouseDown={(e) => handleResizeStart('bottom-left', e)} />
            <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize hover:bg-rose-500 hover:opacity-50 transition-all" onMouseDown={(e) => handleResizeStart('bottom-right', e)} />
          </>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-neutral-700 to-neutral-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="w-6 h-6 text-rose-400" />
            <div>
              <h3 className="font-semibold">AI Enhancement</h3>
              <p className="text-sm opacity-90">
                Editing: <span className="font-medium text-rose-300">{currentSnippetInfo.name}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMaximize}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              {isMaximized ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Context Info */}
        <div className="bg-gradient-to-r from-neutral-100 to-stone-100 px-4 py-2 border-b border-neutral-300">
          <div className="flex items-center space-x-2 text-sm">
            <Code className="w-4 h-4 text-rose-500" />
            <span className="text-neutral-700">
              Context: {currentSnippetInfo.tags?.join(', ') || 'Web Component'}
            </span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden bg-neutral-100">
          <div className="p-4 h-full overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col">
                <div className="text-center text-neutral-600 mb-6">
                  <Bot className="w-12 h-12 mx-auto mb-3 text-neutral-500" />
                  <p className="text-sm mb-2">Ready to enhance your code!</p>
                  <p className="text-xs text-neutral-500">
                    I can help you improve "<span className="text-rose-500 font-medium">{currentSnippetInfo.name}</span>"
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3 flex-1">
                  {getContextualSuggestions().map((suggestion, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-left p-3 bg-white hover:bg-neutral-50 rounded-xl border border-neutral-300 transition-all hover:shadow-md hover:border-rose-300"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{suggestion.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-900">{suggestion.text}</p>
                          <p className="text-xs text-neutral-600 mt-1">{suggestion.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white' 
                        : 'bg-white border border-neutral-300 text-neutral-800'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      {message.codeChanges && (
                        <div className="mt-2 p-2 bg-neutral-100 rounded text-xs">
                          <p className="font-medium text-neutral-700">Code updated!</p>
                        </div>
                      )}
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-rose-100' : 'text-neutral-500'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start mb-4"
                  >
                    <div className="bg-white border border-neutral-300 rounded-2xl px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-neutral-300 bg-white">
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Describe how to enhance "${currentSnippetInfo.name}"...`}
                className="w-full px-4 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                rows="2"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={`p-2 rounded-full transition-all ${
                inputValue.trim() && !isLoading
                  ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:shadow-lg'
                  : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIComponent;
