import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useToast } from '../ToastProvider';

const OutputScreen = ({ htmlCode = '', cssCode = '', jsCode = '' }) => {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const { showToast } = useToast();

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
            * { box-sizing: border-box; }
            
            html, body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: #ffffff;
              min-height: 100vh;
              width: 100%;
            }
            
            body {
              padding: 12px;
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
            
            img { max-width: 100%; height: auto; display: block; }
            pre { white-space: pre-wrap; word-wrap: break-word; overflow-x: auto; max-width: 100%; }
            code { word-wrap: break-word; overflow-wrap: break-word; }
            
            @media (max-width: 768px) {
              body { padding: 8px; font-size: 14px; }
              h1 { font-size: 1.5em; }
              h2 { font-size: 1.3em; }
              h3 { font-size: 1.1em; }
            }
            
            ${cssCode}
          </style>
        </head>
        <body>
          <div class="preview-container">
            ${htmlCode}
          </div>
          <script>
            window.onerror = function(message, source, lineno, colno, error) {
              parent.postMessage({ type: 'iframe-error', message }, '*');
            };
            
            try {
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateIframe();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [htmlCode, cssCode, jsCode]);

  const onIframeLoad = () => {
    setIsLoading(false);
  };

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

  const hasCode = htmlCode || cssCode || jsCode;

  return (
    <motion.div
      className="h-full flex flex-col bg-neutral-200 rounded-lg border border-gray-200 shadow-sm overflow-hidden"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-neutral-200 px-3 py-2 border-b border-gray-200">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <span>🔍</span>
          <span>Live Preview</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <span className="text-xs text-gray-500 min-w-[2.5rem] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
          <button
            onClick={handleZoomReset}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
          <button
            onClick={updateIframe}
            className="p-1 hover:bg-gray-200 rounded transition-colors ml-1"
            title="Refresh Preview"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative bg-white overflow-hidden">
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
              <span className="text-xs text-gray-600">Rendering preview...</span>
            </div>
          </motion.div>
        )}

        {!hasCode ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-500">No code provided</p>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            title="Live preview"
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-full border-0"
            onLoad={onIframeLoad}
            srcDoc="<html><body style='padding:10px; color:#666; font-family:system-ui;'>Your live preview will appear here.</body></html>"
          />
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-1.5 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
        <div>
          {hasCode ? (
            <>
              {htmlCode && 'HTML '}
              {cssCode && 'CSS '}
              {jsCode && 'JS'}
            </>
          ) : (
            'No code provided'
          )}
        </div>
        <div className="text-xs text-gray-400">📱 Responsive</div>
      </div>
    </motion.div>
  );
};

export default OutputScreen;