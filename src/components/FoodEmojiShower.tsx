import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Emoji {
  id: number;
  emoji: string;
  x: number;
  delay: number;
  size: number;
  rotation: number;
  wobble: number;
}

export function FoodEmojiShower({ isActive }: { isActive: boolean }) {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  
  const foodEmojis = [
    '🍕', '🍔', '🍟', '🌮', '🍜', '🍱', '🍣', '🍰', '🍦', '🍩', 
    '🥗', '🍝', '🍖', '🥘', '🍲', '🍤', '🥙', '🌯', '🥪', '🍿',
    '🧁', '🍪', '🎂', '🍮', '🧇', '🥞', '🍌', '🍓', '🍇', '🍉',
    '🥐', '🥖', '🥨', '🍞', '🥚', '🧀', '🍗', '🍳', '🥓', '🌭'
  ];

  useEffect(() => {
    if (isActive) {
      const newEmojis: Emoji[] = [];
      for (let i = 0; i < 40; i++) {
        newEmojis.push({
          id: i,
          emoji: foodEmojis[Math.floor(Math.random() * foodEmojis.length)],
          x: Math.random() * 100,
          delay: Math.random() * 0.8,
          size: 2 + Math.random() * 3, // 2rem to 5rem
          rotation: (Math.random() - 0.5) * 720, // -360 to 360
          wobble: (Math.random() - 0.5) * 40, // -20 to 20
        });
      }
      setEmojis(newEmojis);

      const timer = setTimeout(() => {
        setEmojis([]);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {emojis.map((emoji) => (
          <motion.div
            key={emoji.id}
            initial={{ 
              y: -100, 
              x: `${emoji.x}vw`, 
              opacity: 0,
              rotate: 0,
              scale: 0
            }}
            animate={{ 
              y: '120vh',
              x: [`${emoji.x}vw`, `${emoji.x + emoji.wobble}vw`, `${emoji.x - emoji.wobble}vw`, `${emoji.x}vw`],
              rotate: emoji.rotation,
              opacity: [0, 1, 1, 1, 0.8, 0.5, 0],
              scale: [0, 1.2, 1, 1, 0.9, 0.8, 0.6]
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              duration: 3 + Math.random() * 1.5,
              delay: emoji.delay,
              ease: [0.33, 0, 0.67, 1],
              x: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }
            }}
            style={{
              fontSize: `${emoji.size}rem`,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
            }}
            className="absolute"
          >
            {emoji.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
