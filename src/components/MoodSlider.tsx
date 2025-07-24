import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface MoodSliderProps {
  onMoodChange: (mood: string) => void;
}

export const MoodSlider: React.FC<MoodSliderProps> = ({ onMoodChange }) => {
  const [selectedMood, setSelectedMood] = useState(2); // Default to neutral

  const moods = [
    { emoji: '😢', label: 'Sad', value: 'sad', color: 'hsl(240, 100%, 70%)' },
    { emoji: '😐', label: 'Meh', value: 'meh', color: 'hsl(200, 50%, 60%)' },
    { emoji: '😊', label: 'Good', value: 'neutral', color: 'hsl(180, 100%, 60%)' },
    { emoji: '😄', label: 'Great', value: 'happy', color: 'hsl(120, 100%, 60%)' },
    { emoji: '🚀', label: 'Amazing', value: 'excited', color: 'hsl(60, 100%, 60%)' }
  ];

  const handleMoodChange = (index: number) => {
    setSelectedMood(index);
    onMoodChange(moods[index].value);
  };

  return (
    <Card className="glass p-6">
      <h3 className="text-xl font-semibold mb-4 text-center">How are you feeling today?</h3>
      
      <div className="relative">
        {/* Slider Track */}
        <div className="w-full h-2 bg-muted/30 rounded-full mb-8">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: moods[selectedMood].color }}
            initial={{ width: '20%' }}
            animate={{ width: `${((selectedMood + 1) / moods.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Mood Options */}
        <div className="flex justify-between items-center relative">
          {moods.map((mood, index) => (
            <motion.button
              key={index}
              onClick={() => handleMoodChange(index)}
              className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                selectedMood === index 
                  ? 'bg-primary/20 scale-110' 
                  : 'hover:bg-muted/20 hover:scale-105'
              }`}
              whileHover={{ scale: selectedMood === index ? 1.1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-3xl mb-1">{mood.emoji}</span>
              <span className="text-xs font-medium">{mood.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* AI Response */}
      <motion.div
        key={selectedMood}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 p-4 rounded-xl bg-secondary/30 border border-border/30"
      >
        <p className="text-sm text-center">
          {selectedMood === 0 && "I see you're having a tough day. Want me to lighten your schedule and suggest some self-care? 💙"}
          {selectedMood === 1 && "Not feeling your best? Let's focus on small wins today. How about we start with something easy? 🤗"}
          {selectedMood === 2 && "You're in a good space! Perfect time to tackle your important tasks. I'm here to help! ✨"}
          {selectedMood === 3 && "You're feeling great! Your energy is contagious. Let's make today productive and fun! 🌟"}
          {selectedMood === 4 && "WOW! You're on fire today! 🔥 Let's channel this amazing energy into crushing your biggest goals!"}
        </p>
      </motion.div>

      {/* Mood Insights */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
        <div className="text-center">
          <div className="font-semibold text-primary">This Week</div>
          <div className="text-muted-foreground">3 good days</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-accent">Trend</div>
          <div className="text-muted-foreground">↗️ Improving</div>
        </div>
      </div>
    </Card>
  );
};