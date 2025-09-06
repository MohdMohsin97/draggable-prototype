import { useCallback, memo, useMemo, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { type GridItem } from '../data/emojis';

type ItemElement = HTMLDivElement & { __animating?: boolean };

interface ItemsProps {
  gridItems: GridItem[];
  onMouseEnter: (itemId: number) => void;
  onMouseLeave: () => void;
  itemRefs: React.MutableRefObject<{ [key: number]: HTMLDivElement | null }>;
}

// Props interface for the Item component
interface ItemProps {
  item: GridItem;
  onMouseEnter: (itemId: number) => void;
  onMouseLeave: () => void;
  itemRefs: React.MutableRefObject<{ [key: number]: HTMLDivElement | null }>;
}

const Item = memo<ItemProps>(({ 
  item, 
  onMouseEnter, 
  onMouseLeave, 
  itemRefs,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  
  const itemStyle = useMemo(() => ({
    left: `${item.x}px`,
    top: `${item.y}px`,
    width: `${item.size}px`,
    height: `${item.size}px`,
    fontSize: `${item.fontSize}px`,
    zIndex: 1,
    willChange: 'transform',
    transform: 'scale(0)', // Start with scale 0 for the animation
    opacity: 0, // Start with opacity 0 for the animation
  }), [item.x, item.y, item.size, item.fontSize]);

  // Animate on mount
  useEffect(() => {
    if (!itemRef.current) return;
    
    gsap.to(itemRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      delay: Math.random() * 0.5, // Random stagger
      ease: 'back.out(1.7)',
      overwrite: 'auto'
    });
    
    return () => {
      if (itemRef.current) {
        gsap.killTweensOf(itemRef.current);
      }
    };
  }, []);

  const setItemRef = useCallback((el: ItemElement | null) => {
    itemRef.current = el;
    itemRefs.current[item.id] = el;
  }, [item.id, itemRefs]);

  return (
    <div
      ref={setItemRef}
      data-item-id={item.id}
      className="grid-item absolute flex items-center justify-center select-none"
      style={itemStyle}
      onMouseEnter={() => onMouseEnter(item.id)}
      onMouseLeave={onMouseLeave}
    >
      {item.emoji}
    </div>
  );
});

Item.displayName = 'Item';

function ItemsComponent({ 
  gridItems,
  onMouseEnter, 
  onMouseLeave, 
  itemRefs 
}: ItemsProps) {

  return (
    <>
      {gridItems.map(item => (
        <Item
          key={item.id}
          item={item}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          itemRefs={itemRefs}
        />
      ))}
    </>
  );
}

// Memoize the component with a custom comparison function
const areEqual = (prevProps: ItemsProps, nextProps: ItemsProps) => {
  // Re-render if gridItems array length changes
  if (prevProps.gridItems.length !== nextProps.gridItems.length) {
    return false;
  }
  
  // Deep compare grid items to check for changes
  const hasItemChanges = prevProps.gridItems.some((prevItem, index) => {
    const nextItem = nextProps.gridItems[index];
    return (
      prevItem.id !== nextItem.id ||
      prevItem.x !== nextItem.x ||
      prevItem.y !== nextItem.y ||
      prevItem.size !== nextItem.size ||
      prevItem.emoji !== nextItem.emoji
    );
  });
  
  return !hasItemChanges;
};

export default memo(ItemsComponent, areEqual);
