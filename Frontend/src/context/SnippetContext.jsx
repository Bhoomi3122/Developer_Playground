import React, { createContext, useContext, useState } from 'react';

const SnippetContext = createContext();

export const useSnippetContext = () => {
  const context = useContext(SnippetContext);
  if (!context) {
    throw new Error('useSnippetContext must be used within a SnippetProvider');
  }
  return context;
};

export const SnippetProvider = ({ children }) => {
  const [currentSnippet, setCurrentSnippet] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [snippetData, setSnippetData] = useState({});

  const bindSnippet = (snippetId, snippetInfo) => {
    // If switching to a different snippet, clear chat messages
    if (currentSnippet !== snippetId) {
      setCurrentSnippet(snippetId);
      setSnippetData(prev => ({
        ...prev,
        [snippetId]: {
          ...snippetInfo,
          chatMessages: [] // Reset chat messages for new snippet
        }
      }));
    }
    setIsChatOpen(true);
  };

  const clearSnippet = () => {
    setCurrentSnippet(null);
    setIsChatOpen(false);
    // Clear all chat messages when closing
    setSnippetData(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        if (updated[key].chatMessages) {
          updated[key].chatMessages = [];
        }
      });
      return updated;
    });
  };

  const updateSnippetCode = (snippetId, newCode) => {
    setSnippetData(prev => ({
      ...prev,
      [snippetId]: {
        ...prev[snippetId],
        codes: newCode
      }
    }));
  };

  const addChatMessage = (snippetId, message) => {
    setSnippetData(prev => ({
      ...prev,
      [snippetId]: {
        ...prev[snippetId],
        chatMessages: [...(prev[snippetId]?.chatMessages || []), message]
      }
    }));
  };

  const getChatMessages = (snippetId) => {
    return snippetData[snippetId]?.chatMessages || [];
  };

  return (
    <SnippetContext.Provider value={{
      currentSnippet,
      isChatOpen,
      setIsChatOpen,
      snippetData,
      bindSnippet,
      clearSnippet,
      updateSnippetCode,
      addChatMessage,
      getChatMessages
    }}>
      {children}
    </SnippetContext.Provider>
  );
};