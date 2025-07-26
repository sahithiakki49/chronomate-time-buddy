import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Mic, Download, Github, Linkedin, Twitter, Calendar, CheckSquare, Brain, Settings } from 'lucide-react';
import { EnhancedAI } from '@/components/EnhancedAI';
import { VisualCalendar } from '@/components/VisualCalendar';
import { SmartTodoList } from '@/components/SmartTodoList';
import { MoodSlider } from '@/components/MoodSlider';
import { Analytics } from '@/components/Analytics';
import { CustomizationVault } from '@/components/CustomizationVault';
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { SuccessAnimation } from '@/components/SuccessAnimation';
import { toast } from 'sonner';
import { DateTime } from 'luxon';
import { notificationService } from '@/lib/notification-service';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'meeting' | 'task' | 'reminder' | 'birthday' | 'health' | 'personal';
  priority: 'low' | 'medium' | 'high';
  completed?: boolean;
  description?: string;
  color?: string;
}

interface TodoItem {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  category: 'work' | 'personal' | 'health' | 'learning' | 'other';
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  aiSuggested?: boolean;
  streak?: number;
}

const Index = () => {
  const [currentMood, setCurrentMood] = useState('neutral');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState({
    message: '',
    type: 'completion' as const
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'tasks' | 'ai'>('dashboard');
  
  // State for calendar events
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Morning Meditation',
      date: DateTime.now().toISO(),
      time: '07:00',
      type: 'health',
      priority: 'medium',
      completed: true
    },
    {
      id: '2',
      title: 'Team Meeting',
      date: DateTime.now().toISO(),
      time: '10:00',
      type: 'meeting',
      priority: 'high',
      completed: false
    },
    {
      id: '3',
      title: 'Lunch Break',
      date: DateTime.now().toISO(),
      time: '12:30',
      type: 'health',
      priority: 'medium',
      completed: false
    },
    {
      id: '4',
      title: 'Project Review',
      date: DateTime.now().toISO(),
      time: '15:00',
      type: 'task',
      priority: 'high',
      completed: false
    }
  ]);

  // State for todo items
  const [todoItems, setTodoItems] = useState<TodoItem[]>([
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Finish the Q4 project proposal document',
      priority: 'high',
      category: 'work',
      completed: false,
      createdAt: DateTime.now().toISO()
    },
    {
      id: '2',
      title: 'Drink water',
      description: 'Stay hydrated throughout the day',
      priority: 'medium',
      category: 'health',
      completed: true,
      createdAt: DateTime.now().toISO()
    },
    {
      id: '3',
      title: 'Read 30 minutes',
      description: 'Continue reading the new book',
      priority: 'low',
      category: 'learning',
      completed: false,
      createdAt: DateTime.now().toISO()
    }
  ]);

  const handleReminderCreated = (reminder: string) => {
    toast.success('Reminder Created!', {
      description: reminder,
      duration: 3000
    });
    setSuccessData({
      message: reminder,
      type: 'completion'
    });
    setShowSuccess(true);
  };

  const handleTaskCreated = (task: TodoItem) => {
    setTodoItems(prev => [...prev, task]);
    toast.success('Task Added!', {
      description: `Added "${task.title}" to your tasks`,
      duration: 3000
    });
  };

  const handleCalendarEventCreated = (event: CalendarEvent) => {
    setCalendarEvents(prev => [...prev, event]);
    toast.success('Event Added!', {
      description: `Added "${event.title}" to your calendar`,
      duration: 3000
    });
  };

  const handleMoodChange = (mood: string) => {
    setCurrentMood(mood);
  };

  const handleAddTodo = (todo: Omit<TodoItem, 'id' | 'createdAt' | 'completed'>) => {
    const newTodo: TodoItem = {
      ...todo,
      id: Date.now().toString(),
      createdAt: DateTime.now().toISO(),
      completed: false
    };
    setTodoItems(prev => [...prev, newTodo]);
  };

  const handleToggleTodo = (id: string) => {
    setTodoItems(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = (id: string) => {
    setTodoItems(prev => prev.filter(todo => todo.id !== id));
  };

  const handleUpdateTodo = (id: string, updates: Partial<TodoItem>) => {
    setTodoItems(prev => prev.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ));
  };

  const handleEventClick = (event: CalendarEvent) => {
    toast.info('Event Details', {
      description: `${event.title} - ${event.time || 'All day'}`,
      duration: 3000
    });
  };

  const handleDateClick = (date: DateTime) => {
    toast.info('Date Selected', {
      description: `Selected ${date.toFormat('MMMM d, yyyy')}`,
      duration: 2000
    });
  };

  const handleAddEvent = (date: DateTime) => {
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: 'New Event',
      date: date.toISO(),
      type: 'personal',
      priority: 'medium',
      completed: false
    };
    setCalendarEvents(prev => [...prev, newEvent]);
  };

  // Set up periodic health reminders
  useEffect(() => {
    const healthReminders = [
      { type: 'water' as const, interval: 2 * 60 * 60 * 1000 }, // Every 2 hours
      { type: 'break' as const, interval: 1 * 60 * 60 * 1000 }, // Every hour
      { type: 'exercise' as const, interval: 4 * 60 * 60 * 1000 }, // Every 4 hours
    ];

    const intervals = healthReminders.map(reminder => 
      setInterval(() => {
        notificationService.showHealthReminder(reminder.type);
      }, reminder.interval)
    );

    return () => intervals.forEach(clearInterval);
  }, []);

  // Set up inactivity monitoring
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        notificationService.showInactivityAlert();
      }, 10 * 60 * 1000); // 10 minutes
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <motion.div 
          className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" 
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0]
          }} 
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }} 
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" 
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0]
          }} 
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }} 
        />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative px-4">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 gradient-text">
              ChronoMate
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Because time deserves to care for you too.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg rounded-full bg-primary hover:bg-primary/80 glow"
              onClick={() => setActiveTab('dashboard')}
            >
              <Play className="w-5 h-5 mr-2" />
              Try Demo
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-6 text-lg rounded-full glass"
              onClick={() => setActiveTab('ai')}
            >
              <Mic className="w-5 h-5 mr-2" />
              Talk to AI Assistant
            </Button>
          </motion.div>

          {/* Floating AI Avatar */}
          <motion.div 
            className="text-8xl animate-float" 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            🤖
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-8 px-4 border-b border-border/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center gap-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <Brain className="w-4 h-4" /> },
              { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
              { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" /> },
              { id: 'ai', label: 'AI Assistant', icon: <Brain className="w-4 h-4" /> }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex items-center gap-2"
              >
                {tab.icon}
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - AI Assistant */}
              <div className="lg:col-span-1">
                <EnhancedAI 
                  mood={currentMood}
                  onReminderCreated={handleReminderCreated}
                  onTaskCreated={handleTaskCreated}
                  onCalendarEventCreated={handleCalendarEventCreated}
                />
              </div>

              {/* Center Column - Calendar */}
              <div className="lg:col-span-1">
                <VisualCalendar
                  events={calendarEvents}
                  onEventClick={handleEventClick}
                  onDateClick={handleDateClick}
                  onAddEvent={handleAddEvent}
                />
              </div>

              {/* Right Column - Todo List */}
              <div className="lg:col-span-1">
                <SmartTodoList
                  todos={todoItems}
                  onAddTodo={handleAddTodo}
                  onToggleTodo={handleToggleTodo}
                  onDeleteTodo={handleDeleteTodo}
                  onUpdateTodo={handleUpdateTodo}
                />
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="max-w-4xl mx-auto">
              <VisualCalendar
                events={calendarEvents}
                onEventClick={handleEventClick}
                onDateClick={handleDateClick}
                onAddEvent={handleAddEvent}
              />
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="max-w-4xl mx-auto">
              <SmartTodoList
                todos={todoItems}
                onAddTodo={handleAddTodo}
                onToggleTodo={handleToggleTodo}
                onDeleteTodo={handleDeleteTodo}
                onUpdateTodo={handleUpdateTodo}
              />
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="max-w-2xl mx-auto">
              <EnhancedAI 
                mood={currentMood}
                onReminderCreated={handleReminderCreated}
                onTaskCreated={handleTaskCreated}
                onCalendarEventCreated={handleCalendarEventCreated}
              />
            </div>
          )}
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-12 gradient-text"
          >
            We're all busy, but not always balanced.
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🍱',
                title: 'Missed meals',
                desc: 'Skipping nutrition in the rush'
              },
              {
                icon: '🩺',
                title: 'Forgotten checkups',
                desc: 'Health takes a backseat'
              },
              {
                icon: '🎯',
                title: 'Skipped goals',
                desc: 'Dreams delayed by deadlines'
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="glass p-8 h-full">
                  <div className="text-4xl mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-lg text-muted-foreground mt-12 italic"
          >
            Your calendar should care about <em>you</em>, not just time.
          </motion.p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-secondary/10">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-12 gradient-text"
          >
            Dynamic Daily Timeline
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <VisualCalendar
                events={calendarEvents}
                onEventClick={handleEventClick}
                onDateClick={handleDateClick}
                onAddEvent={handleAddEvent}
              />
            </div>
            <div>
              <SmartTodoList
                todos={todoItems}
                onAddTodo={handleAddTodo}
                onToggleTodo={handleToggleTodo}
                onDeleteTodo={handleDeleteTodo}
                onUpdateTodo={handleUpdateTodo}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mood Section */}
      <section id="mood-section" className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-4 gradient-text"
          >
            ChronoMate doesn't just remind.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-center mb-12 italic"
          >
            It <em>understands</em>.
          </motion.p>
          <MoodSlider onMoodChange={handleMoodChange} />
        </div>
      </section>

      {/* Analytics Section */}
      <section id="analytics-section" className="py-20 px-4 bg-secondary/10">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-12 gradient-text"
          >
            Weekly Habit Analytics
          </motion.h2>
          <Analytics />
        </div>
      </section>

      {/* Customization Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-12 gradient-text"
          >
            Customization Vault
          </motion.h2>
          <CustomizationVault />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-6 mb-6">
            <Button variant="ghost" size="icon">
              <Github className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Linkedin className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Twitter className="w-5 h-5" />
            </Button>
          </div>
          <Button variant="outline" className="mb-4">
            <Download className="w-4 h-4 mr-2" />
            Download Pitch Deck
          </Button>
          <p className="text-sm text-muted-foreground">
            © 2024 ChronoMate. Built with ❤️ for better time management.
          </p>
        </div>
      </footer>

      {/* Floating Assistant */}
      <FloatingAssistant />

      {/* Success Animation */}
      <SuccessAnimation 
        show={showSuccess} 
        onComplete={() => setShowSuccess(false)} 
        message={successData.message} 
        type={successData.type} 
      />
    </div>
  );
};

export default Index;