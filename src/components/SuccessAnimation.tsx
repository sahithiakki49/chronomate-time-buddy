import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Card } from '@/components/ui/card';

interface SuccessAnimationProps {
  show: boolean;
  onComplete: () => void;
  message: string;
  type: 'streak' | 'completion' | 'milestone';
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  show,
  onComplete,
  message,
  type
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (show) {
      setShowConfetti(true);
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });

      // Play success sound (if available)
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRvgIAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQABAAEQARABIAEgATABMAFAAUABUAFQAWABYAFwAXABgAGAAZABkAGgAaABsAGwAcABwAHQAdAB4AHgAfAB8AIAAgACEAIQAiACIAIwAjACQAJAAlACUAJgAmACcAJwAoACgAKQApACoAKgArACsALAAsAC0ALQAuAC4ALwAvADAAMAAxADEAMgAyADMAMwA0ADQANQAuAC4ALwAvADAAMAAxADEAMgAyADMAMwA0ADQANQA1ADYANgA3ADcAOAA4ADkAOQA6ADoAOwA7ADwAPAA9AD0APgA+AD8APwBAAEAAQQBBAEIAQgBDAEMARABEAEUARQBGAEYARwBHAEgASABJAEkASgBKAEsASwBMAEwATQBNAE4ATgBPAE8AUABQAFEAUQBSAFIAUwBTAFQAVABVAFUAVgBWAFcAVwBYAFgAWQBZAFoAWgBbAFsAXABcAF0AXQBeAF4AXwBfAGAAYABhAGEAYgBiAGMAYwBkAGQAZQBlAGYAZgBnAGcAaABoAGkAaQBqAGoAawBrAGwAbABtAG0AbgBuAG8AbwBwAHAAcQBxAHIAcgBzAHMAdAB0AHUAdQB2AHYAdwB3AHgAeAB5AHkAegB6AHsAewB8AHwAfQB9AH4AfgB/AH8AhACEAIUAhQCGAIYAhwCHAIgAiACJAIkAigCKAIsAiwCMAIwAjQCNAI4AjgCPAI8AkACQAJEAkQCSAJIAkwCTAJQAlACVAJUAlgCWAJcAlwCYAJgAmQCZAJoAmgCbAJsAnACcAJ0AnQCeAJ4AnwCfAKAAoACRAJgAmQCZAJoAmgCbAJsAnACcAJ0AnQCeAJ4AnwCfAKAAoAChAKEAogCiAKMAowCkAKQApQClAKYApgCnAKcAqACoAKkAqQCqAKoAqwCrAKwArACtAK0ArgCuAK8ArwCwALAAsQCxALIAsgCzALMAzAA=');
        audio.play().catch(() => {
          // Ignore audio play errors in case autoplay is blocked
        });
      } catch (error) {
        // Ignore audio errors
      }

      const timer = setTimeout(() => {
        setShowConfetti(false);
        setTimeout(onComplete, 500);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  const getEmoji = () => {
    switch (type) {
      case 'streak': return '🔥';
      case 'completion': return '✅';
      case 'milestone': return '🎯';
      default: return '🎉';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'streak': return 'hsl(30, 100%, 60%)';
      case 'completion': return 'hsl(120, 100%, 60%)';
      case 'milestone': return 'hsl(267, 100%, 70%)';
      default: return 'hsl(var(--primary))';
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          {/* Confetti */}
          {showConfetti && (
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={200}
              gravity={0.3}
              colors={[
                '#8b5cf6', // primary
                '#06b6d4', // accent
                '#10b981', // success
                '#f59e0b', // warning
                '#ef4444'  // destructive
              ]}
            />
          )}

          {/* Success Card */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
          >
            <Card className="glass-strong p-8 text-center max-w-sm mx-4 border-2" style={{ borderColor: getColor() }}>
              {/* Animated Emoji */}
              <motion.div
                className="text-6xl mb-4"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 0.6,
                  repeat: 2,
                  ease: "easeInOut"
                }}
              >
                {getEmoji()}
              </motion.div>

              {/* Message */}
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-bold mb-2"
                style={{ color: getColor() }}
              >
                {type === 'streak' && 'Streak Milestone!'}
                {type === 'completion' && 'Task Completed!'}
                {type === 'milestone' && 'Achievement Unlocked!'}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground"
              >
                {message}
              </motion.p>

              {/* Pulse Ring */}
              <motion.div
                className="absolute inset-0 rounded-xl border-2"
                style={{ borderColor: getColor() }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};