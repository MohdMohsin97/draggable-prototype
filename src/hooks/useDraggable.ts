import { useRef, useCallback, useEffect } from "react";
import gsap from "gsap";
import Draggable from "gsap/Draggable";

gsap.registerPlugin(Draggable);

export function useDraggable() {
  const containerRef = useRef<HTMLDivElement>(null);

  const setupDraggable = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    gsap.killTweensOf(container);
    
    Draggable.create(container, {
      type: "x,y",
      inertia: true,
      origin: "center",
      bounds: {
        minX: -500,
        minY: -500,
        maxX: 500,
        maxY: 500,
      },
      liveSnap: false,
      snap: false as any,
      dragResistance: 0.1,
    });
  }, []);

  useEffect(() => {
    setupDraggable();
    
    return () => {
      const container = containerRef.current;
      if (container) {
        gsap.killTweensOf(container);
      }
    };
  }, [setupDraggable]);

  return { containerRef };
}
