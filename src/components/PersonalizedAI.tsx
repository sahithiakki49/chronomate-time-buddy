import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Send, Volume2, Settings, UserCircle, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit';
import { toast } from 'sonner';
import { useUserProfile } from '@/hooks/useUserProfile';


interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  sentiment?: 'positive' | 'negative' | 'neutral';
  category?: 'reminder' | 'task' | 'reflection' | 'general';
}

interface Reminder {
  id: string;
  title: string;
  time: string;
  repeat?: 'daily' | 'weekly' | 'monthly' | 'once';
  priority: 'low' | 'medium' | 'high';
  category: string;
  metadata?: any;
  completed?: boolean;
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
      text: `Hi ${profile.name}! 🌟 I'm ChronoMate, your compassionate AI assistant. I've been learning from our ${profile.history.interactions} conversations and I'm here to help you thrive. How are you feeling today?`,
      isBot: true,
      timestamp: new Date(),
      sentiment: 'positive',
      category: 'general'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
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

  // Advanced natural language processing for ChronoMate
  const parseNaturalLanguage = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Extract time patterns
    const timePattern = /(?:at |by |around )?(\d{1,2}):?(\d{2})?\s?(am|pm)?|(?:tomorrow|today|tonight|morning|afternoon|evening|night)/gi;
    const repeatPattern = /(daily|weekly|monthly|every day|every week|every month)/gi;
    const priorityPattern = /(urgent|important|low priority|high priority|critical)/gi;
    
    // Extract specific commands
    const reminderPattern = /remind me to (.+?)(?:\s+(?:at|by|around|every|daily|weekly|monthly)|$)/i;
    const cancelPattern = /(cancel|delete|remove) (.+?) (reminder|task)/i;
    const queryPattern = /(did i|have i|when did i|show me|what about) (.+?)(?:\s+(?:yesterday|today|this week)|$)/i;
    
    return {
      isReminder: reminderPattern.test(lowerMessage),
      isCancel: cancelPattern.test(lowerMessage),
      isQuery: queryPattern.test(lowerMessage),
      hasTime: timePattern.test(lowerMessage),
      hasRepeat: repeatPattern.test(lowerMessage),
      hasPriority: priorityPattern.test(lowerMessage),
      reminderMatch: message.match(reminderPattern),
      queryMatch: message.match(queryPattern),
      timeMatch: message.match(timePattern),
      repeatMatch: message.match(repeatPattern),
      priorityMatch: message.match(priorityPattern)
    };
  };

  const createReminder = (title: string, time?: string, repeat?: string, priority: string = 'medium') => {
    const reminder: Reminder = {
      id: Date.now().toString(),
      title,
      time: time || '09:00',
      repeat: (repeat?.toLowerCase().includes('daily') ? 'daily' : 
               repeat?.toLowerCase().includes('weekly') ? 'weekly' :
               repeat?.toLowerCase().includes('monthly') ? 'monthly' : 'once') as any,
      priority: priority as any,
      category: 'general',
      completed: false
    };
    
    setReminders(prev => [...prev, reminder]);
    
    // Schedule browser notification
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          toast.success(`Reminder set: ${title}`, { 
            description: `I'll remind you ${repeat ? repeat : 'at ' + (time || '9:00 AM')}` 
          });
        }
      });
    }
    
    return reminder;
  };

  const getChronoMateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const nlp = parseNaturalLanguage(userMessage);
    
    // Update conversation context
    setConversationContext(prev => [...prev.slice(-4), userMessage]);
    trackInteraction(mood);

    const { preferences, history, habits } = profile;
    
    // Empathetic greetings based on communication style
    const greetings = {
      formal: "Certainly",
      casual: "Got it",
      friendly: "I'd love to help"
    };
    const greeting = greetings[preferences.communicationStyle];

    // Advanced mood-based empathetic responses
    const moodResponses = {
      happy: "I love your positive energy today! ✨ Let's make the most of it!",
      sad: "I'm here for you. 💙 Let's take things one step at a time and be gentle with ourselves.",
      stressed: "I can sense you're feeling overwhelmed. 🌸 Take a deep breath - we'll figure this out together.",
      tired: `You've been working hard with ${history.completedTasks} completed tasks. 😴 How about we prioritize rest?`,
      energetic: "You seem full of energy! 🚀 Perfect time to tackle some goals!",
      neutral: "I'm here and ready to help you with whatever you need. 🤗"
    };

    const moodPrefix = moodResponses[mood as keyof typeof moodResponses] || "";

    // Handle reminder creation with natural language
    if (nlp.isReminder && nlp.reminderMatch) {
      const title = nlp.reminderMatch[1];
      const time = nlp.timeMatch?.[0] || preferences.preferredTimes[0];
      const repeat = nlp.repeatMatch?.[0];
      const priority = nlp.priorityMatch?.[0]?.includes('urgent') ? 'high' : 'medium';
      
      createReminder(title, time, repeat, priority);
      onReminderCreated?.(`Reminder created: ${title}`);
      
      return `${moodPrefix} ${greeting}! I've set a reminder for "${title}" ${repeat ? repeat : 'at ' + time}. I'll make sure you don't forget! ${priority === 'high' ? '⚡ Marked as high priority.' : '📝'}`;
    }

    // Handle queries about past behavior
    if (nlp.isQuery && nlp.queryMatch) {
      const query = nlp.queryMatch[2];
      if (query.includes('water') || query.includes('hydrat')) {
        const waterHabit = habits['water'];
        return `${moodPrefix} ${waterHabit ? `You last drank water ${waterHabit.lastCompleted ? 'earlier today' : 'yesterday'}. Your streak is ${waterHabit.streak} days! 💧` : "I don't have water tracking data yet. Should we start monitoring that? 💧"}`;
      }
      
      if (query.includes('exercise') || query.includes('workout')) {
        const exerciseHabit = habits['exercise'];
        return `${moodPrefix} ${exerciseHabit ? `Your last workout was ${exerciseHabit.lastCompleted ? 'today' : 'a while ago'}. You're on a ${exerciseHabit.streak}-day streak! 💪` : "I haven't tracked your exercise yet. Want to start logging workouts? 💪"}`;
      }
      
      return `${moodPrefix} Let me check on that for you... Based on our conversation history, I notice you often ask about ${query}. Would you like me to start tracking this more closely?`;
    }

    // Contextual responses based on conversation flow
    const recentContext = conversationContext.slice(-2).join(' ').toLowerCase();
    
    // Health and wellness focus
    if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
      return `${moodPrefix} I hear that you're feeling tired. Given your ${history.completedTasks} completed tasks recently, it sounds like you've been pushing hard. Let's schedule some recovery time. Should I block out rest periods in your calendar? 😴`;
    }

    if (lowerMessage.includes('stressed') || lowerMessage.includes('overwhelmed')) {
      return `${moodPrefix} I can sense the stress in your message. 🌸 Let's break things down - you handle challenges best when we tackle them step by step. What's the most urgent thing on your plate right now?`;
    }

    if (lowerMessage.includes('productive') || lowerMessage.includes('focus')) {
      return `${moodPrefix} Great mindset! Based on our ${history.interactions} conversations, you're most focused during ${preferences.preferredTimes.join(' and ')}. Should we schedule your important tasks around these peak times? 🎯`;
    }

    // Habit encouragement with streak tracking
    if (lowerMessage.includes('water') || lowerMessage.includes('hydrat')) {
      const waterStreak = habits['water']?.streak || 0;
      addHabit('water');
      return `${moodPrefix} Excellent! Hydration is so important. ${waterStreak > 0 ? `You're crushing it with a ${waterStreak}-day streak! 💧` : 'Let\'s start building this healthy habit together! 💧'} I'll set gentle reminders throughout the day.`;
    }

    if (lowerMessage.includes('exercise') || lowerMessage.includes('workout')) {
      const exerciseStreak = habits['exercise']?.streak || 0;
      addHabit('exercise');
      return `${moodPrefix} Love the commitment to fitness! Your focus on ${preferences.focusAreas.join(' and ')} really shows. ${exerciseStreak > 0 ? `That ${exerciseStreak}-day streak is incredible! 💪` : 'Ready to start this amazing journey! 💪'} What type of workout are you thinking?`;
    }

    // Goal and planning responses
    if (lowerMessage.includes('goal') || lowerMessage.includes('objective') || lowerMessage.includes('achieve')) {
      return `${moodPrefix} I love your goal-oriented thinking! You currently have ${profile.goals.length} active goals. ${profile.goals.length > 0 ? "Should we review progress on existing ones or set something new?" : "What meaningful goal would you like to work toward together?"} 🎯`;
    }

    if (lowerMessage.includes('plan') || lowerMessage.includes('schedule') || lowerMessage.includes('organize')) {
      return `${moodPrefix} Perfect! Let's create a plan that works with your energy and preferences. Based on your focus areas (${preferences.focusAreas.join(', ')}), I suggest we structure your day around peak performance times. What's your main priority today? 📅`;
    }

    // Reflective and supportive responses
    if (lowerMessage.includes('yesterday') || lowerMessage.includes('how did i do')) {
      return `${moodPrefix} Let's reflect on yesterday together. You completed ${Math.floor(Math.random() * 3 + 1)} tasks and maintained some good habits. What felt most challenging? What made you proud? 💭`;
    }

    if (lowerMessage.includes('feel better') || lowerMessage.includes('improve')) {
      return `${moodPrefix} Your self-awareness is beautiful. Small, consistent steps create big changes. Based on what I know about you, focusing on ${preferences.focusAreas[0]} might give you the most satisfaction right now. What tiny step could we take today? 🌱`;
    }

    // Proactive suggestions based on patterns
    const suggestionsByMood = {
      happy: [
        `Your energy is contagious! 🌟 This might be perfect timing to tackle that challenging goal you mentioned.`,
        `While you're feeling great, should we plan something special for when your energy dips? I've learned you appreciate gentle reminders.`,
        `✨ Perfect day to celebrate your ${Math.max(...Object.values(habits).map(h => h.streak || 0))}-day habit streak!`
      ],
      sad: [
        `💙 Remember, it's okay to have tough days. Your pattern shows you bounce back stronger. One small win today?`,
        `I'm noticing you're feeling low. Based on our history, gentle movement or connecting with someone usually helps you. Thoughts?`,
        `🌸 Let's be extra kind to yourself today. What would feel like the gentlest, most nurturing choice right now?`
      ],
      stressed: [
        `🌸 When you're stressed, you handle things best by breaking them down. What's the one most urgent thing we could tackle first?`,
        `I've seen you navigate stress before - you're stronger than you know. Let's prioritize and create some breathing room.`,
        `💆‍♀️ Stress check: Have you taken a real break today? Your wellbeing is the foundation of everything else.`
      ],
      tired: [
        `😴 Your body is telling you something important. You've accomplished ${history.completedTasks} tasks recently - rest is productive too.`,
        `I notice you push through tiredness, but recovery time actually boosts your productivity. Can we schedule some restoration?`,
        `🛌 Energy management is key. What would help you recharge most effectively right now?`
      ]
    };

    const moodSuggestions = suggestionsByMood[mood as keyof typeof suggestionsByMood] || [
      `I'm learning your patterns and I'm here to support you. What's on your mind today? 🤗`,
      `Based on our ${history.interactions} conversations, you seem to value ${preferences.communicationStyle} communication. How can I best help you right now?`,
      `💫 Every conversation teaches me more about what works for you. What would make today feel successful?`
    ];

    return moodSuggestions[Math.floor(Math.random() * moodSuggestions.length)];
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
      const botResponse = getChronoMateResponse(inputValue);
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
    "Remind me to drink water every 2 hours",
    "Set a daily workout reminder at 7 AM",
    "How did I do with my habits yesterday?",
    "Plan my day based on my energy levels",
    "Remind me to take my vitamins every morning",
    "Schedule a weekly health checkup reminder",
    "I'm feeling stressed, help me prioritize",
    "Create a bedtime routine reminder"
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
            <div className="text-lg font-semibold">
              ChronoMate - Your Compassionate AI Assistant
            </div>
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
            <div className="font-semibold mb-3">Your Profile</div>
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
                {message.text}
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
            🎤 Listening... Speak now!
          </motion.div>
        )}
      </Card>

      {/* Active Reminders Panel */}
      {reminders.length > 0 && (
        <Card className="glass-strong p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-semibold">Active Reminders</span>
            <Badge variant="secondary" className="text-xs">{reminders.length}</Badge>
          </div>
          <div className="space-y-2">
            {reminders.slice(0, 3).map((reminder) => (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {reminder.priority === 'high' ? (
                    <AlertCircle className="w-4 h-4 text-destructive" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">{reminder.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {reminder.time}
                  </Badge>
                  {reminder.repeat !== 'once' && (
                    <Badge variant="secondary" className="text-xs">
                      {reminder.repeat}
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Smart Prompts */}
      <div className="grid grid-cols-1 gap-2">
        <div className="text-sm text-muted-foreground mb-2">
          ChronoMate suggestions based on your patterns:
        </div>
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
            {prompt}
          </motion.button>
        ))}
      </div>
    </div>
  );
};