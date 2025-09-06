// Emoji data and utilities
export const EMOJIS = [
  "🍽️", "☕", "🥣", "🍷", "🍴", "🥄", "🍵", "🥤",
  "🍜", "🍸", "🔪", "🥢", "🥗", "🥃", "🍛", "🍺",
  "🧀", "🍎", "🍊", "🍋", "🥖", "🍇", "🥐", "🍯",
  "🍕", "🌮", "🌯", "🥙", "🍔", "🌭", "🥪", "🍖",
  "🍗", "🥓", "🍳", "🥞", "🧇", "🍞", "🥨", "🥯",
  "🥜", "🌰", "🍯", "🥛", "🍼", "🍪", "🍩", "🧁",
  "🍰", "🎂", "🍫", "🍬", "🍭", "🍮", "🍯", "🍼",
  "🥤", "🧃", "🧉", "🧊", "🥛", "🍾", "🍷", "☕",
  "🍶", "🍾", "🍷", "🍸", "🍹", "🍺", "🍻", "🥂",
  "🥃", "🧊", "🍾", "🍷", "🍸", "🍹", "🍺", "🍻",
  "🥂", "🥃", "🧊", "🍾", "🍷", "🍸", "🍹", "🍺",
  "🍻", "🥂", "🥃", "🧊", "🍾", "🍷", "🍸", "🍹"
];

// Grid item interface
export interface GridItem {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  fontSize: number;
}

// Generate grid items with random sizes and positions
export const generateGridItems = (): GridItem[] => {
  const items = [];
  const baseItemSize = 80;
  const spacing = 200;
  
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Add buffer zone around viewport
  const cols = Math.ceil(viewportWidth / spacing) + 4;
  const rows = Math.ceil(viewportHeight / spacing) + 4;
  
  const totalWidth = cols * spacing;
  const totalHeight = rows * spacing;
  const offsetX = (viewportWidth - totalWidth) / 2;
  const offsetY = (viewportHeight - totalHeight) / 2;
  
  // Pre-generate random sizes for performance
  const sizeMultipliers = Array.from({ length: cols * rows }, () => 0.5 + Math.random() * 0.5);
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const paddingY = col % 2 === 0 ? 0 : spacing / 3;
      const x = col * spacing + offsetX;
      const y = row * spacing + offsetY + paddingY;
      const index = row * cols + col;
      const emojiIndex = index % EMOJIS.length;
      const sizeMultiplier = sizeMultipliers[index];
      
      items.push({
        id: index,
        emoji: EMOJIS[emojiIndex],
        x,
        y,
        size: Math.floor(baseItemSize * sizeMultiplier),
        fontSize: Math.floor(100 * sizeMultiplier),
      });
    }
  }
  
  return items;
};
