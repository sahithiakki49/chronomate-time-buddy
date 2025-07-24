import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Send, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface AIAssistantProps {
  mood?: string;
  onReminderCreated?: (reminder: string) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ mood = "neutral", onReminderCreated }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your ChronoMate AI assistant. I'm here to help you manage your time and well-being. How can I support you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Mood-based responses
    const moodResponses = {
      happy: "I love your energy! ✨",
      sad: "I'm here for you. Let's take things one step at a time. 💙",
      stressed: "Take a deep breath. We'll organize this together. 🌸",
      tired: "You've been working hard. How about we schedule some rest? 😴",
      neutral: ""
    };

    const moodPrefix = moodResponses[mood as keyof typeof moodResponses] || "";

    if (lowerMessage.includes('remind') && lowerMessage.includes('water')) {
      onReminderCreated?.('Water reminder set for every 2 hours');
      return `${moodPrefix} Perfect! I've set up water reminders every 2 hours. Hydration is so important! 💧`;
    }
    
    if (lowerMessage.includes('checkup') || lowerMessage.includes('doctor')) {
      onReminderCreated?.('Health checkup reminder created');
      return `${moodPrefix} Got it! I've scheduled a health checkup reminder. Taking care of your health is wonderful! 🩺`;
    }
    
    if (lowerMessage.includes('goal') || lowerMessage.includes('task')) {
      return `${moodPrefix} I'd love to help you set and track goals! What specific goal would you like to work on?`;
    }
    
    if (lowerMessage.includes('break') || lowerMessage.includes('rest')) {
      return `${moodPrefix} Rest is productive too! How about a 15-minute break? I'll remind you when it's time to get back.`;
    }
    
    if (lowerMessage.includes('schedule') || lowerMessage.includes('plan')) {
      return `${moodPrefix} Let's create an amazing schedule! I can help you balance work, health, and personal time.`;
    }
    
    return `${moodPrefix} That's interesting! I'm learning more about you every day. How can I help make your schedule work better for you?`;
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
      const botResponse = getBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Speak the response
      if (voices.length > 0) {
        const femaleVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('female') || 
          voice.name.toLowerCase().includes('samantha') ||
          voice.name.toLowerCase().includes('alex')
        ) || voices[0];
        
        speak({ text: botResponse, voice: femaleVoice });
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

  const samplePrompts = [
    "Remind me to drink water every 2 hours",
    "Set a checkup reminder for October",
    "Help me plan a productive morning",
    "I'm feeling overwhelmed with tasks"
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
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
                    ? 'bg-secondary/50 text-secondary-foreground'
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
              <div className="bg-secondary/50 p-3 rounded-2xl">
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

      {/* Sample Prompts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {samplePrompts.map((prompt, index) => (
          <motion.button
            key={index}
            onClick={() => setInputValue(prompt)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-3 text-sm bg-muted/30 hover:bg-muted/50 rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-200 text-left"
          >
            {prompt}
          </motion.button>
        ))}
      </div>
    </div>
  );
};