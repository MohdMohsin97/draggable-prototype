import { useMemo, useRef } from "react";
import { generateGridItems } from "./data/emojis";
import { useDraggable } from "./hooks/useDraggable";
import Items from "./components/Items";

export default function App() {
  const itemRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Generate grid items using the emoji utility
  const gridItems = useMemo(() => generateGridItems(), []);

  // Custom hooks
  const { containerRef } = useDraggable();
  
  // Mouse event handlers
  const handleMouseEnter = (_itemId: number) => {
    // Handle mouse enter if needed
  };

  const handleMouseLeave = () => {
    // Handle mouse leave if needed
  };

  const setContainerRef = (el: HTMLDivElement | null) => {
    containerRef.current = el;
  };

  return (
    <div className="w-screen h-screen bg-gray-100 overflow-hidden">
      <div
        ref={setContainerRef}
        className="relative cursor-grab origin-center active:cursor-grabbing"
        style={{
          width: "200vw",
          height: "200vh",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      >
        <Items
          gridItems={gridItems}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          itemRefs={itemRefs}
        />
      </div>
    </div>
  );
}