'use client';

import { useEffect } from 'react';

export default function ThreeJsScript() {
  useEffect(() => {
    // Create a script element
    const script = document.createElement('script');
    script.src = '/vendor/three.js';
    script.async = false; // Changed to false to ensure sequential loading
    
    // Add an onload handler to notify when THREE is available
    script.onload = () => {
      // Create a custom event to notify that THREE is ready
      const event = new CustomEvent('THREEReady');
      window.dispatchEvent(event);
      console.log('THREE.js loaded successfully');
    };
    
    // Add error handling
    script.onerror = () => {
      console.error('Failed to load THREE.js');
    };
    
    // Append to document
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return null;
}