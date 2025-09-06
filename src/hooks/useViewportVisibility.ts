import { useState, useEffect, useRef, useCallback } from 'react';

export function useViewportVisibility(radius = 100) {
  const [visibleIds, setVisibleIds] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<{ [key: number]: HTMLElement | null }>({});

  const checkVisibility = useCallback(() => {
    if (!containerRef.current) {
      console.log('Container ref not set');
      return;
    }

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate the extended viewport bounds with the given radius
    const extendedLeft = -radius;
    const extendedTop = -radius;
    const extendedRight = viewportWidth + radius;
    const extendedBottom = viewportHeight + radius;
    
    console.log('Checking visibility for viewport:', { extendedLeft, extendedTop, extendedRight, extendedBottom });

    const newVisibleIds = new Set<number>();

    Object.entries(itemRefs.current).forEach(([id, element]) => {
      if (!element) return;
      
      const itemRect = element.getBoundingClientRect();
      
      // Check if element is within the extended viewport + radius
      const isInView = (
        itemRect.right >= extendedLeft &&
        itemRect.left <= extendedRight &&
        itemRect.bottom >= extendedTop &&
        itemRect.top <= extendedBottom
      );

      if (isInView) {
        newVisibleIds.add(Number(id));
      }
    });

    setVisibleIds(prev => {
      // Only update if there are changes to prevent unnecessary re-renders
      if (newVisibleIds.size !== prev.size || 
          Array.from(newVisibleIds).some(id => !prev.has(id))) {
        return new Set([...prev, ...newVisibleIds]);
      }
      return prev;
    });
  }, [radius]);

  // Set up event listeners
  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(checkVisibility);
    };

    const handleResize = () => {
      requestAnimationFrame(checkVisibility);
    };

    // Initial check with multiple attempts
    const maxAttempts = 5;
    let attempts = 0;
    
    const initialCheck = () => {
      attempts++;
      checkVisibility();
      
      // If no items visible, try again with a delay
      if (visibleIds.size === 0 && attempts < maxAttempts) {
        setTimeout(initialCheck, 100 * attempts);
      }
    };
    
    const timeoutId = setTimeout(initialCheck, 50);

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [checkVisibility]);

  const registerItem = useCallback((id: number, element: HTMLElement | null) => {
    itemRefs.current[id] = element;
    console.log(`Registered item ${id}`, { element });
    // Check visibility when a new item is registered
    requestAnimationFrame(() => {
      if (element) {
        const rect = element.getBoundingClientRect();
        console.log(`Item ${id} position:`, { 
          left: rect.left, 
          top: rect.top,
          inView: rect.right >= -radius && 
                 rect.left <= window.innerWidth + radius &&
                 rect.bottom >= -radius &&
                 rect.top <= window.innerHeight + radius
        });
      }
      checkVisibility();
    });
  }, [checkVisibility, radius]);

  return {
    containerRef,
    visibleIds,
    registerItem,
  };
}
