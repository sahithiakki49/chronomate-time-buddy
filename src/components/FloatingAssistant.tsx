import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const FloatingAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [lastScrollTime, setLastScrollTime] = useState(Date.now());

  const messages = [
    "Hi! I'm your ChronoMate AI. Need help with anything?",
    "I noticed you've been scrolling for a while. Want to take a break?",
    "Ready to plan something amazing together?",
    "How are you feeling today? I'd love to know!",
    "Let's make your schedule work for you, not against you."
  ];

  // Monitor scroll behavior
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;
    
    const handleScroll = () => {
      setLastScrollTime(Date.now());
      
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        // If user has been scrolling for more than 30 seconds, show nudge
        if (Date.now() - lastScrollTime > 30000 && !isOpen) {
          setCurrentMessage(1); // "You've been scrolling for a while..."
          setIsOpen(true);
        }
      }, 30000);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, [isOpen, lastScrollTime]);

  // Auto-show assistant periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOpen) {
        setCurrentMessage(prev => (prev + 1) % messages.length);
        setIsOpen(true);
      }
    }, 60000); // Show every minute

    return () => clearInterval(interval);
  }, [isOpen, messages.length]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleInteract = () => {
    // This would typically scroll to the chat section or open the main AI interface
    const chatSection = document.getElementById('ai-assistant-section');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Avatar */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 200 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg border-2 border-background flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Animated AI Avatar */}
          <motion.div
            className="text-2xl"
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🤖
          </motion.div>
          
          {/* Pulse Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/50"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.button>

        {/* Notification Badge */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full border-2 border-background flex items-center justify-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 bg-accent-foreground rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Message Bubble */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 z-40 max-w-xs"
          >
            <Card className="glass-strong p-4 border border-primary/30">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🤖</div>
                <div className="flex-1">
                  <p className="text-sm mb-3">{messages[currentMessage]}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleInteract}
                      className="text-xs h-7 bg-primary hover:bg-primary/80"
                    >
                      Let's Chat
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleClose}
                      className="text-xs h-7"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Speech bubble tail */}
              <div className="absolute bottom-0 right-8 transform translate-y-full">
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-border" />
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-card absolute top-0 left-[2px]" />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};