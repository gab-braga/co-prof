import React, { useEffect, useRef, useState } from 'react';

export default () => {
  const [isCopied, setIdCopied] = useState(false);
  const timeoutFeedback = useRef(null);

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      showCopiedFeedback();
    } catch {
      console.error("Error copy to clipboard.");
    }
  }
  
  function showCopiedFeedback() {
    clearTimeoutFeedback();
    setIdCopied(true);
    timeoutFeedback.current = setTimeout(() => {
      setIdCopied(false);
    }, 1000);
  }

  function clearTimeoutFeedback() {
    if (timeoutFeedback.current) {
      clearTimeout(timeoutFeedback.current);
      timeoutFeedback.current = null;
    }
  }

  useEffect(() => {
    return () => clearTimeoutFeedback();
  }, []);

  return { copyToClipboard, isCopied };
}
