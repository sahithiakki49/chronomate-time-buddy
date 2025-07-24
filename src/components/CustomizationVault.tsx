import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Mail, Bell, Palette, Heart, Briefcase, Users } from 'lucide-react';

export const CustomizationVault: React.FC = () => {
  const [reminderTone, setReminderTone] = useState('friendly');
  const [notificationStyle, setNotificationStyle] = useState('popup');
  const [goals, setGoals] = useState(['health']);
  const [theme, setTheme] = useState('galaxy');

  const tones = [
    { id: 'friendly', label: 'Friendly', preview: "Hey there! Time for a water break! 💧" },
    { id: 'strict', label: 'Strict', preview: "Water break NOW. Your health depends on it." },
    { id: 'playful', label: 'Playful', preview: "Glug glug time! 🐠 Your body is calling for H2O!" }
  ];

  const notifications = [
    { id: 'popup', label: 'Pop-up', icon: <Bell className="w-4 h-4" /> },
    { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
    { id: 'voice', label: 'Voice', icon: <Volume2 className="w-4 h-4" /> }
  ];

  const goalTypes = [
    { id: 'health', label: 'Health', icon: <Heart className="w-4 h-4" />, color: 'hsl(120, 100%, 60%)' },
    { id: 'work', label: 'Work', icon: <Briefcase className="w-4 h-4" />, color: 'hsl(267, 100%, 70%)' },
    { id: 'family', label: 'Family', icon: <Users className="w-4 h-4" />, color: 'hsl(30, 100%, 60%)' }
  ];

  const themes = [
    { 
      id: 'galaxy', 
      label: 'Galaxy 🌌', 
      preview: 'linear-gradient(135deg, hsl(267, 100%, 70%), hsl(240, 100%, 50%))',
      description: 'Deep space vibes'
    },
    { 
      id: 'zen', 
      label: 'Zen 🌿', 
      preview: 'linear-gradient(135deg, hsl(120, 60%, 70%), hsl(180, 60%, 60%))',
      description: 'Calm and natural'
    },
    { 
      id: 'futuristic', 
      label: 'Futuristic 🔵', 
      preview: 'linear-gradient(135deg, hsl(180, 100%, 60%), hsl(200, 100%, 70%))',
      description: 'Cyberpunk aesthetic'
    }
  ];

  const toggleGoal = (goalId: string) => {
    setGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(g => g !== goalId)
        : [...prev, goalId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Reminder Tone */}
      <Card className="glass-strong p-6">
        <h3 className="text-xl font-semibold mb-4 gradient-text">Reminder Tone</h3>
        <div className="space-y-3">
          {tones.map((tone) => (
            <motion.div
              key={tone.id}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                reminderTone === tone.id 
                  ? 'bg-primary/20 border-primary/50' 
                  : 'bg-muted/20 border-border/30 hover:bg-muted/30'
              }`}
              onClick={() => setReminderTone(tone.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{tone.label}</span>
                {reminderTone === tone.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">"{tone.preview}"</p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Notification Style */}
      <Card className="glass-strong p-6">
        <h3 className="text-xl font-semibold mb-4 gradient-text">Notification Style</h3>
        <div className="grid grid-cols-3 gap-3">
          {notifications.map((notification) => (
            <motion.button
              key={notification.id}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                notificationStyle === notification.id
                  ? 'bg-primary/20 border-primary/50'
                  : 'bg-muted/20 border-border/30 hover:bg-muted/30'
              }`}
              onClick={() => setNotificationStyle(notification.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex flex-col items-center gap-2">
                {notification.icon}
                <span className="text-sm font-medium">{notification.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Goals */}
      <Card className="glass-strong p-6">
        <h3 className="text-xl font-semibold mb-4 gradient-text">Focus Areas</h3>
        <div className="grid grid-cols-3 gap-3">
          {goalTypes.map((goal) => (
            <motion.button
              key={goal.id}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                goals.includes(goal.id)
                  ? 'border-2'
                  : 'bg-muted/20 border-border/30 hover:bg-muted/30'
              }`}
              style={{
                backgroundColor: goals.includes(goal.id) ? `${goal.color}20` : undefined,
                borderColor: goals.includes(goal.id) ? goal.color : undefined
              }}
              onClick={() => toggleGoal(goal.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex flex-col items-center gap-2">
                <div style={{ color: goal.color }}>
                  {goal.icon}
                </div>
                <span className="text-sm font-medium">{goal.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Themes */}
      <Card className="glass-strong p-6">
        <h3 className="text-xl font-semibold mb-4 gradient-text">Theme</h3>
        <div className="space-y-3">
          {themes.map((themeOption) => (
            <motion.div
              key={themeOption.id}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                theme === themeOption.id
                  ? 'bg-primary/20 border-primary/50'
                  : 'bg-muted/20 border-border/30 hover:bg-muted/30'
              }`}
              onClick={() => setTheme(themeOption.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-background"
                  style={{ background: themeOption.preview }}
                />
                <div className="flex-1">
                  <div className="font-medium">{themeOption.label}</div>
                  <div className="text-sm text-muted-foreground">{themeOption.description}</div>
                </div>
                {theme === themeOption.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm"
                  >
                    ✓
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Live Preview */}
      <Card className="glass p-6 border-2 border-primary/30">
        <h3 className="text-lg font-semibold mb-4 text-primary">Live Preview</h3>
        <motion.div
          key={`${reminderTone}-${notificationStyle}-${theme}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="p-3 bg-secondary/30 rounded-lg">
            <p className="text-sm">
              <strong>Tone:</strong> {tones.find(t => t.id === reminderTone)?.preview}
            </p>
          </div>
          <div className="p-3 bg-accent/10 rounded-lg">
            <p className="text-sm">
              <strong>Style:</strong> {notifications.find(n => n.id === notificationStyle)?.label} notifications
            </p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <p className="text-sm">
              <strong>Focus:</strong> {goals.map(g => goalTypes.find(gt => gt.id === g)?.label).join(', ')}
            </p>
          </div>
        </motion.div>
      </Card>
    </div>
  );
};