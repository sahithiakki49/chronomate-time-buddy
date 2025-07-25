import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Send, Volume2, Settings, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit';
import { toast } from 'sonner';
import { useUserProfile } from '@/hooks/useUserProfile';
import { TextAnimation, TypewriterText, WaveText } from './TextAnimations';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

interface PersonalizedAIProps {
  mood?: string;
  onReminderCreated?: (reminder: string) => void;
}

export const PersonalizedAI: React.FC<PersonalizedAIProps> = ({ mood = "neutral", onReminderCreated }) => {
  const { profile, trackInteraction, addHabit, addGoal, completeTask } = useUserProfile();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi ${profile.name}! I'm your personalized ChronoMate AI. I've learned from our ${profile.history.interactions} previous interactions. How can I help you today?`,
      isBot: true,
      timestamp: new Date(),
      sentiment: 'positive'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { speak, voices, speaking } = useSpeechSynthesis();
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result: string) => {
      setInputValue(result);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getPersonalizedResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    trackInteraction(mood);

    // Personalization based on user profile
    const { preferences, history, habits } = profile;
    const greetings = {
      formal: "Certainly",
      casual: "Sure thing",
      friendly: "I'd love to help"
    };
    const greeting = greetings[preferences.communicationStyle];

    // Mood-based responses
    const moodResponses = {
      happy: "I love seeing you in such great spirits! ✨",
      sad: "I'm here for you. Let's take this step by step. 💙",
      stressed: "Take a deep breath. I've noticed you handle stress well when we break things down. 🌸",
      tired: `You've completed ${history.completedTasks} tasks recently - you deserve some rest! 😴`,
      neutral: ""
    };

    const moodPrefix = moodResponses[mood as keyof typeof moodResponses] || "";

    // Habit tracking responses
    if (lowerMessage.includes('water') || lowerMessage.includes('hydrat')) {
      const waterStreak = habits['water']?.streak || 0;
      addHabit('water');
      onReminderCreated?.('Personalized water reminder set based on your routine');
      return `${moodPrefix} ${greeting}! I've set up water reminders. ${waterStreak > 0 ? `Keep up that ${waterStreak}-day streak! 💧` : 'Let\'s start building a healthy habit! 💧'}`;
    }

    if (lowerMessage.includes('exercise') || lowerMessage.includes('workout')) {
      const exerciseStreak = habits['exercise']?.streak || 0;
      addHabit('exercise');
      return `${moodPrefix} Based on your focus on ${preferences.focusAreas.join(' and ')}, I recommend a routine. ${exerciseStreak > 0 ? `Your ${exerciseStreak}-day streak is impressive! 💪` : 'Let\'s get moving! 💪'}`;
    }

    if (lowerMessage.includes('goal') || lowerMessage.includes('objective')) {
      return `${moodPrefix} I see you're goal-oriented! You currently have ${profile.goals.length} active goals. What new goal would you like to set?`;
    }

    if (lowerMessage.includes('remind') && lowerMessage.includes('checkup')) {
      onReminderCreated?.('Health checkup reminder created with your preferred timing');
      return `${moodPrefix} Perfect! I've scheduled it for your preferred time. Your health is a priority! 🩺`;
    }

    if (lowerMessage.includes('schedule') || lowerMessage.includes('plan')) {
      const focusAreas = preferences.focusAreas.join(', ');
      return `${moodPrefix} Let's create a schedule that balances your focus areas: ${focusAreas}. Based on our ${history.interactions} interactions, I know what works for you!`;
    }

    if (lowerMessage.includes('productivity') || lowerMessage.includes('focus')) {
      return `${moodPrefix} I've noticed you're most productive around ${preferences.preferredTimes.join(', ')}. Let's optimize your schedule around these times!`;
    }

    if (lowerMessage.includes('break') || lowerMessage.includes('rest')) {
      return `${moodPrefix} Based on your ${history.completedTasks} completed tasks, you've earned this break! I'll remind you when it's time to return.`;
    }

    // Learning from interactions
    const responses = [
      `${moodPrefix} That's fascinating! In our ${history.interactions} chats, I've learned you prefer ${preferences.communicationStyle} communication. How can I support your ${preferences.focusAreas.join(' and ')} goals?`,
      `${moodPrefix} I'm constantly learning about your patterns. Your average mood has been ${history.averageMood}. What would make today even better?`,
      `${moodPrefix} Based on your habits, I think you'd benefit from... What specific area would you like to focus on?`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = getPersonalizedResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date(),
        sentiment: 'positive'
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Speak the response with personalized voice
      if (voices.length > 0) {
        const preferredVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('female') || 
          voice.name.toLowerCase().includes('samantha')
        ) || voices[0];
        
        speak({ text: botResponse, voice: preferredVoice });
      }
    }, 1000 + Math.random() * 1000);
  };

  const toggleListening = () => {
    if (listening) {
      stop();
    } else {
      listen();
    }
  };

  const smartPrompts = [
    `Set a ${profile.preferences.focusAreas[0]} reminder for ${profile.preferences.preferredTimes[0]}`,
    "Track my progress on current goals",
    "Plan my day based on my energy patterns",
    "Create a personalized routine",
    "Show my habit streaks"
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* AI Personality Display */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="text-3xl animate-pulse-glow">🤖</div>
          <div>
            <TypewriterText className="text-lg font-semibold">
              Your Personalized AI Assistant
            </TypewriterText>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {profile.history.interactions} interactions
              </Badge>
              <Badge variant="outline" className="text-xs">
                {profile.preferences.communicationStyle} mode
              </Badge>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowProfile(!showProfile)}
          className="hover:bg-primary/10"
        >
          <UserCircle className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* User Profile Panel */}
      {showProfile && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4"
        >
          <Card className="glass-strong p-4">
            <WaveText className="font-semibold mb-3">Your Profile</WaveText>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Focus Areas:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile.preferences.focusAreas.map((area, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{area}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Completed Tasks:</span>
                <div className="text-primary font-bold">{profile.history.completedTasks}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Active Goals:</span>
                <div className="text-accent font-bold">{profile.goals.length}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Habit Streaks:</span>
                <div className="text-green-400 font-bold">
                  {Object.values(profile.habits).reduce((max, habit) => Math.max(max, habit.streak), 0)}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Chat Interface */}
      <Card className="glass-strong p-6 mb-4">
        <div className="h-80 overflow-y-auto mb-4 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.isBot
                    ? 'bg-secondary/50 text-secondary-foreground border border-primary/20'
                    : 'bg-primary/80 text-primary-foreground'
                }`}
              >
                {message.isBot ? (
                  <TextAnimation type="typewriter" duration={0.03}>
                    {message.text}
                  </TextAnimation>
                ) : (
                  message.text
                )}
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-secondary/50 p-3 rounded-2xl border border-primary/20">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything..."
              className="w-full p-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            />
          </div>
          
          <Button
            onClick={toggleListening}
            variant={listening ? "destructive" : "secondary"}
            size="icon"
            className="h-12 w-12 rounded-xl"
          >
            {listening ? <MicOff /> : <Mic />}
          </Button>
          
          <Button
            onClick={handleSendMessage}
            className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/80"
            size="icon"
          >
            <Send />
          </Button>
        </div>

        {listening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2 text-center text-sm text-primary animate-pulse"
          >
            🎤 <TextAnimation type="wave">Listening... Speak now!</TextAnimation>
          </motion.div>
        )}
      </Card>

      {/* Smart Prompts */}
      <div className="grid grid-cols-1 gap-2">
        <WaveText className="text-sm text-muted-foreground mb-2">
          Personalized suggestions for you:
        </WaveText>
        {smartPrompts.map((prompt, index) => (
          <motion.button
            key={index}
            onClick={() => setInputValue(prompt)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 text-sm bg-muted/30 hover:bg-muted/50 rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-200 text-left hover:glow"
          >
            <TextAnimation type="floating" delay={index * 0.2}>
              {prompt}
            </TextAnimation>
          </motion.button>
        ))}
      </div>
    </div>
  );
};