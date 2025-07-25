import React from 'react';
import { motion } from 'framer-motion';

interface TextAnimationProps {
  children: React.ReactNode;
  type?: 'typewriter' | 'wave' | 'bounce' | 'glow' | 'rainbow' | 'floating';
  delay?: number;
  duration?: number;
  className?: string;
}

export const TextAnimation: React.FC<TextAnimationProps> = ({
  children,
  type = 'typewriter',
  delay = 0,
  duration = 0.05,
  className = ''
}) => {
  const text = children?.toString() || '';

  const animations = {
    typewriter: {
      hidden: { opacity: 0 },
      visible: (i: number) => ({
        opacity: 1,
        transition: {
          delay: delay + i * duration,
        },
      }),
    },
    wave: {
      hidden: { opacity: 0, y: 20 },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: delay + i * 0.1,
          type: "spring" as const,
          damping: 12,
          stiffness: 200,
        },
      }),
    },
    bounce: {
      hidden: { opacity: 0, scale: 0 },
      visible: (i: number) => ({
        opacity: 1,
        scale: 1,
        transition: {
          delay: delay + i * 0.08,
          type: "spring" as const,
          damping: 10,
          stiffness: 300,
        },
      }),
    },
    glow: {
      hidden: { opacity: 0 },
      visible: (i: number) => ({
        opacity: 1,
        textShadow: [
          "0 0 10px hsl(var(--primary))",
          "0 0 20px hsl(var(--primary))",
          "0 0 30px hsl(var(--primary))",
          "0 0 10px hsl(var(--primary))"
        ],
        transition: {
          delay: delay + i * 0.1,
          duration: 2,
          repeat: Infinity,
        },
      }),
    },
    rainbow: {
      hidden: { opacity: 0 },
      visible: (i: number) => ({
        opacity: 1,
        color: [
          "hsl(0, 100%, 60%)",
          "hsl(60, 100%, 60%)",
          "hsl(120, 100%, 60%)",
          "hsl(180, 100%, 60%)",
          "hsl(240, 100%, 60%)",
          "hsl(300, 100%, 60%)",
          "hsl(0, 100%, 60%)"
        ],
        transition: {
          delay: delay + i * 0.1,
          duration: 3,
          repeat: Infinity,
        },
      }),
    },
    floating: {
      hidden: { opacity: 0, y: 0 },
      visible: (i: number) => ({
        opacity: 1,
        y: [-10, 10, -10],
        transition: {
          delay: delay + i * 0.2,
          duration: 2 + (i * 0.1),
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      }),
    },
  };

  if (type === 'typewriter' || type === 'wave' || type === 'bounce') {
    return (
      <motion.span
        initial="hidden"
        animate="visible"
        className={className}
      >
        {text.split('').map((char, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={animations[type]}
            className="inline-block"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  if (type === 'glow' || type === 'rainbow' || type === 'floating') {
    return (
      <motion.span
        initial="hidden"
        animate="visible"
        className={`${className} inline-block`}
      >
        {text.split(' ').map((word, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={animations[type]}
            className="inline-block mr-1"
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  return <span className={className}>{children}</span>;
};

// Preset animated text components
export const TypewriterText: React.FC<Omit<TextAnimationProps, 'type'>> = (props) => (
  <TextAnimation {...props} type="typewriter" />
);

export const WaveText: React.FC<Omit<TextAnimationProps, 'type'>> = (props) => (
  <TextAnimation {...props} type="wave" />
);

export const BounceText: React.FC<Omit<TextAnimationProps, 'type'>> = (props) => (
  <TextAnimation {...props} type="bounce" />
);

export const GlowText: React.FC<Omit<TextAnimationProps, 'type'>> = (props) => (
  <TextAnimation {...props} type="glow" />
);

export const RainbowText: React.FC<Omit<TextAnimationProps, 'type'>> = (props) => (
  <TextAnimation {...props} type="rainbow" />
);

export const FloatingText: React.FC<Omit<TextAnimationProps, 'type'>> = (props) => (
  <TextAnimation {...props} type="floating" />
);