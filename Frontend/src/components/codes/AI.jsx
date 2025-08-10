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
  const messagesContainerRef = useRef(null);

  const currentSnippetInfo = currentSnippet ? snippetData[currentSnippet] : null;
  const messages = currentSnippet ? getChatMessages(currentSnippet) : [];

  const getContextualSuggestions = () => {
    if (!currentSnippetInfo) return [];
    
    const suggestions = [
      {
        text: "Change background color to light gray",
        icon: "🎨",
        description: "Modify the background color of the page or section"
      },
      {
        text: "Change text color to black",
        icon: "🖌️",
        description: "Update the text color of the content"
      },
      {
        text: "Increase font size of headings",
        icon: "🔠",
        description: "Make the headings more prominent"
      },
      {
        text: "Change button color to blue",
        icon: "🔵",
        description: "Update button styles with a new color"
      },
      {
        text: "Center align all text",
        icon: "📐",
        description: "Align text content to center"
      },
      {
        text: "Change font family to Roboto",
        icon: "🆎",
        description: "Apply Roboto font to all text"
      },
      {
        text: "Increase padding inside containers",
        icon: "📦",
        description: "Add more spacing inside elements"
      },
      {
        text: "Add hover effect on links",
        icon: "🖱️",
        description: "Style links to react on hover"
      },
      {
        text: "Round the corners of cards",
        icon: "🟪",
        description: "Apply border-radius to card components"
      },
      {
        text: "Change navbar background to white",
        icon: "⬜",
        description: "Customize the navbar section"
      }
    ];

    return suggestions;
  };

  useEffect(() => {
    if (messagesContainerRef.current && messages.length > 0) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

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

  const matchIntent = (userInput) => {
    const intents = getContextualSuggestions();
    const input = userInput.toLowerCase();
    return intents.find(intent => {
      const keyWords = intent.text.toLowerCase().split(' ');
      return keyWords.some(word => input.includes(word));
    });
  };

  const handleSendMessage = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || !currentSnippet) return;

    const matched = matchIntent(trimmed);

    if (!matched) {
      addChatMessage(currentSnippet, {
        id: Date.now(),
        text: "Request not recognized. Please choose one of the supported enhancements.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
      });
      return;
    }

    addChatMessage(currentSnippet, {
      id: Date.now() + 1,
      text: trimmed,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
    });
    setInputValue('');
    setIsLoading(true);

    addChatMessage(currentSnippet, {
      id: Date.now() + 2,
      text: "🤖 Processing your request… hang tight!",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
    });

    const payload = {
      html: currentSnippetInfo.codes?.html || '',
      css: currentSnippetInfo.codes?.css || '',
      js: currentSnippetInfo.codes?.js || '',
      instruction: trimmed
    };

    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${baseUrl}/api/enhance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Server error');

      const updatedCode = await res.json();

      const newCode = {
        html: updatedCode.html || currentSnippetInfo.codes?.html || '',
        css: updatedCode.css || currentSnippetInfo.codes?.css || '',
        js: updatedCode.js || currentSnippetInfo.codes?.js || ''
      };

      updateSnippetCode(currentSnippet, newCode);
      currentSnippetInfo.onCodeUpdate?.(newCode);
      if (typeof onRun === 'function') {
        await onRun();
      }

      addChatMessage(currentSnippet, {
        id: Date.now() + 3,
        text: "Code updated successfully! Hit 'Run' to view changes in the live preview.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
      });

      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err) {
      addChatMessage(currentSnippet, {
        id: Date.now() + 4,
        text: "Failed to update code. Please try again.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
      });
    } finally {
      setIsLoading(false);
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

        <div className="bg-gradient-to-r from-neutral-700 to-neutral-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="w-6 h-6 text-rose-400" />
            <div>
              <h4 className="font-semibold">AI Enhancement</h4>
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

        <div className="bg-gradient-to-r from-neutral-300 to-stone-300 px-4 py-2 border-b border-neutral-300">
          <div className="flex items-center space-x-2 text-sm">
            <Code className="w-4 h-4 text-rose-500" />
            <span className="text-neutral-800">
              Context: {currentSnippetInfo.tags?.join(', ') || 'Web Component'}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-neutral-200">
          <div ref={messagesContainerRef} className="p-4 h-full overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col">
                <div className="text-center text-neutral-600 mb-6">
                  <Bot className="w-12 h-12 mx-auto mb-3 text-neutral-600" />
                  <p className="text-sm mb-2 text-neutral-900">Ready to enhance your code!</p>
                  <p className="text-xs text-neutral-800">
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
                      className="text-left p-3 bg-neutral-300 hover:cursor-pointer hover:bg-neutral-400 rounded-xl border border-neutral-400 transition-all hover:shadow-md hover:border-neutral-600"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-900">{suggestion.text}</p>
                          <p className="text-xs text-neutral-800 mt-1">{suggestion.description}</p>
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
                        : 'bg-neutral-100 border border-neutral-300 text-neutral-800'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      {message.codeChanges && (
                        <div className="mt-2 p-2 bg-neutral-100 rounded text-xs">
                          <p className="font-medium text-neutral-700">Code updated!</p>
                        </div>
                      )}
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-rose-100' : 'text-neutral-700'
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
              </>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-neutral-300 bg-neutral-100">
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Describe how to enhance "${currentSnippetInfo.name}"...`}
                className="w-full text-sm px-4 py-2 rounded-xl border border-neutral-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                rows="2"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={`p-2 rounded-full transition-all ${
                inputValue.trim() && !isLoading
                  ? 'bg-gradient-to-r hover:cursor-pointer from-neutral-800 to-neutral-900 text-white hover:shadow-lg'
                  : 'bg-neutral-300   text-neutral-500 cursor-not-allowed'
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