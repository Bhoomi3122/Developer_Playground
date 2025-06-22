import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../ToastProvider';

const OutputScreen = ({ htmlCode = '', cssCode = '', jsCode = '' }) => {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const showToast = useToast();
 

  // Listen for errors from iframe scripts
  useEffect(() => {
    function handleMessage(event) {
      if (event.data?.type === 'iframe-error') {
        showToast(event.data.message || 'JavaScript error in preview');
        setIsLoading(false);
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [showToast]);

  const updateIframe = () => {
    if (!iframeRef.current) return;

    setIsLoading(true);

    try {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

      const fullHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Preview</title>
          <style>
            /* Base responsive styles */
            * {
              box-sizing: border-box;
            }
            
            html, body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              background: #ffffff;
              overflow-x: auto;
              overflow-y: auto;
              min-height: 100vh;
              width: 100%;
            }
            
            body {
              padding: 16px;
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
            
            /* Make images responsive by default */
            img {
              max-width: 100%;
              height: auto;
              display: block;
            }
            
            /* Make tables responsive */
            table {
              width: 100%;
              max-width: 100%;
              overflow-x: auto;
              display: block;
              white-space: nowrap;
            }
            
            /* Make pre and code blocks responsive */
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              overflow-x: auto;
              max-width: 100%;
            }
            
            code {
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
            
            /* Make containers responsive */
            .container, .wrapper, .content {
              max-width: 100%;
              overflow-x: auto;
            }
            
            /* Responsive text */
            h1, h2, h3, h4, h5, h6, p, div, span {
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
            
            /* Make flex containers responsive */
            .flex, [style*="display: flex"], [style*="display:flex"] {
              flex-wrap: wrap;
            }
            
            /* Responsive utilities */
            .responsive {
              max-width: 100%;
              overflow-x: auto;
            }
            
            /* Override common fixed widths that might cause overflow */
            [style*="width: 100%"], [style*="width:100%"] {
              width: 100% !important;
            }
            
            /* Media query for smaller screens */
            @media (max-width: 768px) {
              body {
                padding: 8px;
                font-size: 14px;
              }
              
              h1 { font-size: 1.5em; }
              h2 { font-size: 1.3em; }
              h3 { font-size: 1.1em; }
              
              /* Stack flex items on mobile */
              .flex, [style*="display: flex"], [style*="display:flex"] {
                flex-direction: column;
              }
            }
            
            /* User's custom CSS */
            ${cssCode}
          </style>
        </head>
        <body>
          <div class="preview-container responsive">
            ${htmlCode}
          </div>
          <script>
            window.onerror = function(message, source, lineno, colno, error) {
              parent.postMessage({ type: 'iframe-error', message }, '*');
            };
            
            try {
              // Auto-adjust zoom if content is too wide
              function adjustZoom() {
                const body = document.body;
                const container = document.querySelector('.preview-container');
                const iframe = window.parent.document.querySelector('iframe[title="Live preview"]');
                
                if (container && iframe) {
                  const containerWidth = container.scrollWidth;
                  const iframeWidth = iframe.clientWidth - 32; // Account for padding
                  
                  if (containerWidth > iframeWidth) {
                    const zoomRatio = Math.max(0.5, iframeWidth / containerWidth);
                    body.style.zoom = zoomRatio;
                    body.style.transform = 'scale(' + zoomRatio + ')';
                    body.style.transformOrigin = 'top left';
                    body.style.width = (100 / zoomRatio) + '%';
                  }
                }
              }
              
              // Wait for content to load, then adjust
              setTimeout(adjustZoom, 100);
              window.addEventListener('resize', adjustZoom);
              
              // User's custom JavaScript
              ${jsCode}
              
            } catch (e) {
              parent.postMessage({ type: 'iframe-error', message: e.message }, '*');
            }
          </script>
        </body>
        </html>
      `;

      iframeDoc.open();
      iframeDoc.write(fullHTML);
      iframeDoc.close();
    } catch (err) {
      setIsLoading(false);
      showToast('Failed to render preview');
    }
  };

  // Auto-update when code changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateIframe();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [htmlCode, cssCode, jsCode]);

  // Set loading false on iframe load event
  const onIframeLoad = () => {
    setIsLoading(false);
  };

  // Zoom controls
  const handleZoomIn = () => {
    const newZoom = Math.min(2, zoomLevel + 0.1);
    setZoomLevel(newZoom);
    if (iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument;
      if (iframeDoc && iframeDoc.body) {
        iframeDoc.body.style.zoom = newZoom;
      }
    }
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(0.3, zoomLevel - 0.1);
    setZoomLevel(newZoom);
    if (iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument;
      if (iframeDoc && iframeDoc.body) {
        iframeDoc.body.style.zoom = newZoom;
      }
    }
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
    if (iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument;
      if (iframeDoc && iframeDoc.body) {
        iframeDoc.body.style.zoom = 1;
        iframeDoc.body.style.transform = 'none';
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  const loadingVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className="h-full flex flex-col bg-white rounded-lg border border-slate-300 shadow-lg overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-100 px-4 py-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>🔍</span>
          <span>Live Preview</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Zoom Controls */}
          <button
            onClick={handleZoomOut}
            className="p-1 hover:bg-slate-200 rounded transition-colors text-xs"
            title="Zoom Out"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-xs text-slate-500 min-w-[3rem] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1 hover:bg-slate-200 rounded transition-colors text-xs"
            title="Zoom In"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={handleZoomReset}
            className="p-1 hover:bg-slate-200 rounded transition-colors text-xs"
            title="Reset Zoom"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={updateIframe}
            className="p-1 hover:bg-slate-200 rounded transition-colors ml-1"
            title="Refresh Preview"
          >
            <svg
              className="w-4 h-4 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative bg-white overflow-hidden">
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10"
            variants={loadingVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="text-sm text-slate-600">
                Rendering preview...
              </span>
            </div>
          </motion.div>
        )}

        <iframe
          ref={iframeRef}
          title="Live preview"
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-full border-0"
          onLoad={onIframeLoad}
          srcDoc="<html><body><p style='color:#888; padding:10px;'>Your live preview will appear here.</p></body></html>"
        />
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-slate-200 text-xs text-slate-500 select-none flex justify-between items-center">
        <div>
          {htmlCode && 'HTML '}
          {cssCode && 'CSS '}
          {jsCode && 'JS '}
          {!htmlCode && !cssCode && !jsCode && 'No code provided.'}
        </div>
        <div className="text-xs text-slate-400">
          📱 Responsive Preview
        </div>
      </div>
    </motion.div>
  );
};

export default OutputScreen;