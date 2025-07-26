import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Volume2, Settings, UserCircle, Clock, CheckCircle, AlertCircle, Sparkles, Brain, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit';
import { toast } from 'sonner';
import { useUserProfile } from '@/hooks/useUserProfile';
import { chronoMateAI, AIResponse, ConversationContext } from '@/lib/ai-service';
import { notificationService } from '@/lib/notification-service';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  sentiment?: 'positive' | 'negative' | 'neutral';
  category?: 'reminder' | 'task' | 'reflection' | 'general';
  actions?: AIResponse['actions'];
}

interface EnhancedAIProps {
  mood?: string;
  onReminderCreated?: (reminder: string) => void;
  onTaskCreated?: (task: any) => void;
  onCalendarEventCreated?: (event: any) => void;
}

export const EnhancedAI: React.FC<EnhancedAIProps> = ({ 
  mood = "neutral", 
  onReminderCreated,
  onTaskCreated,
  onCalendarEventCreated
}) => {
  const { profile, trackInteraction, addHabit, addGoal, completeTask } = useUserProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
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

  // Initialize AI with user context
  useEffect(() => {
    const initializeAI = async () => {
      try {
        const context: ConversationContext = {
          userProfile: profile,
          recentMessages: [],
          currentMood: mood,
          activeTasks: [],
          habits: profile.habits,
          goals: profile.goals
        };

        await chronoMateAI.initialize(context);
        setIsInitialized(true);

        // Generate initial greeting and insights
        const greeting = `Hi ${profile.name}! 🌟 I'm ChronoMate, your compassionate AI assistant. I've been learning from our ${profile.history.interactions} conversations and I'm here to help you thrive. How are you feeling today?`;
        
        const insights = await chronoMateAI.generateDailyInsights();
        setAiInsights(insights);

        setMessages([{
          id: '1',
          text: greeting,
          isBot: true,
          timestamp: new Date(),
          sentiment: 'positive',
          category: 'general'
        }]);

        // Show morning greeting if it's morning
        const hour = new Date().getHours();
        if (hour >= 6 && hour <= 10) {
          notificationService.showMorningGreeting(profile.name, profile.goals.length);
        }

      } catch (error) {
        console.error('Error initializing AI:', error);
        // Fallback greeting
        setMessages([{
          id: '1',
          text: `Hi ${profile.name}! 🌟 I'm ChronoMate, your AI assistant. How can I help you today?`,
          isBot: true,
          timestamp: new Date(),
          sentiment: 'positive',
          category: 'general'
        }]);
      }
    };

    if (!isInitialized) {
      initializeAI();
    }
  }, [profile, mood, isInitialized]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !isInitialized) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Process message with AI
      const aiResponse = await chronoMateAI.processMessage(inputValue);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        isBot: true,
        timestamp: new Date(),
        sentiment: aiResponse.sentiment,
        actions: aiResponse.actions
      };

      setMessages(prev => [...prev, botMessage]);
      setSuggestions(aiResponse.suggestions || []);

      // Handle AI actions
      if (aiResponse.actions) {
        for (const action of aiResponse.actions) {
          switch (action.type) {
            case 'reminder':
              handleReminderAction(action.data);
              break;
            case 'task':
              handleTaskAction(action.data);
              break;
            case 'calendar':
              handleCalendarAction(action.data);
              break;
            case 'mood':
              handleMoodAction(action.data);
              break;
            case 'goal':
              handleGoalAction(action.data);
              break;
          }
        }
      }

      // Track interaction
      trackInteraction(mood);

      // Speak response if voice is enabled
      if (voices.length > 0 && !speaking) {
        const preferredVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('female') || 
          voice.name.toLowerCase().includes('samantha')
        ) || voices[0];
        
        speak({ text: aiResponse.text, voice: preferredVoice });
      }

    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble processing that right now. Could you try rephrasing? I'm here to help! 🤗",
        isBot: true,
        timestamp: new Date(),
        sentiment: 'neutral'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReminderAction = (data: any) => {
    const reminder = {
      title: data.title,
      time: data.time || '09:00',
      repeat: data.repeat || 'once',
      priority: data.priority || 'medium'
    };

    onReminderCreated?.(`Reminder created: ${reminder.title}`);
    
    // Schedule notification
    const reminderTime = new Date();
    if (data.time) {
      const [hours, minutes] = data.time.split(':');
      reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    }

    notificationService.scheduleReminder({
      title: reminder.title,
      message: `Time for: ${reminder.title}`,
      time: reminderTime,
      actions: {
        snooze: () => notificationService.snoozeReminder(reminder.title, 5),
        complete: () => notificationService.completeReminder(reminder.title),
        dismiss: () => notificationService.dismissReminder(reminder.title)
      }
    });

    toast.success('Reminder Created!', {
      description: `I'll remind you about "${reminder.title}"`,
      duration: 3000
    });
  };

  const handleTaskAction = (data: any) => {
    const task = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      priority: data.priority || 'medium',
      category: data.category || 'other',
      completed: false,
      createdAt: new Date().toISOString(),
      aiSuggested: true
    };

    onTaskCreated?.(task);
    toast.success('Task Created!', {
      description: `Added "${task.title}" to your tasks`,
      duration: 3000
    });
  };

  const handleCalendarAction = (data: any) => {
    const event = {
      id: Date.now().toString(),
      title: data.title,
      date: data.date,
      time: data.time,
      type: data.type || 'personal',
      priority: data.priority || 'medium',
      description: data.description
    };

    onCalendarEventCreated?.(event);
    toast.success('Calendar Event Created!', {
      description: `Added "${event.title}" to your calendar`,
      duration: 3000
    });
  };

  const handleMoodAction = (data: any) => {
    // Handle mood-related actions
    console.log('Mood action:', data);
  };

  const handleGoalAction = (data: any) => {
    if (data.action === 'add') {
      addGoal(data.title, data.deadline ? new Date(data.deadline) : undefined);
      toast.success('Goal Added!', {
        description: `Added "${data.title}" to your goals`,
        duration: 3000
      });
    }
  };

  const toggleListening = () => {
    if (listening) {
      stop();
    } else {
      listen();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
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
            <div className="text-lg font-semibold flex items-center gap-2">
              ChronoMate - AI Assistant
              {isInitialized && (
                <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Powered
                </Badge>
              )}
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

      {/* AI Insights */}
      {aiInsights && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4"
        >
          <Card className="glass-strong p-4 border-primary/20">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <div className="font-medium text-sm mb-1">AI Insight</div>
                <p className="text-sm text-muted-foreground">{aiInsights}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* User Profile Panel */}
      <AnimatePresence>
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
      </AnimatePresence>

      {/* Chat Interface */}
      <Card className="glass-strong p-6 mb-4">
        <div className="h-80 overflow-y-auto mb-4 space-y-4">
          <AnimatePresence>
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
                  
                  {/* Show action indicators */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-2 flex gap-1">
                      {message.actions.map((action, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          {action.type}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
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
              disabled={!isInitialized}
            />
          </div>
          
          <Button
            onClick={toggleListening}
            variant={listening ? "destructive" : "secondary"}
            size="icon"
            className="h-12 w-12 rounded-xl"
            disabled={!isInitialized}
          >
            {listening ? <MicOff /> : <Mic />}
          </Button>
          
          <Button
            onClick={handleSendMessage}
            className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/80"
            size="icon"
            disabled={!isInitialized || !inputValue.trim()}
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

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <Card className="glass-strong p-4 mb-4">
          <div className="text-sm text-muted-foreground mb-3">
            AI Suggestions:
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                size="sm"
                variant="outline"
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Smart Prompts */}
      <div className="grid grid-cols-1 gap-2">
        <div className="text-sm text-muted-foreground mb-2">
          Quick actions:
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