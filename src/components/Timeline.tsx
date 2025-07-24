import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Sun, Coffee, Utensils, Sunset, Moon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  type: 'morning' | 'afternoon' | 'evening';
}

export const Timeline: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: '1',
      time: '7:00 AM',
      title: 'Morning Meditation',
      description: 'Start your day with mindfulness',
      icon: <Sun className="w-4 h-4" />,
      completed: true,
      type: 'morning'
    },
    {
      id: '2',
      time: '8:30 AM',
      title: 'Healthy Breakfast',
      description: 'Fuel your body with nutrition',
      icon: <Coffee className="w-4 h-4" />,
      completed: true,
      type: 'morning'
    },
    {
      id: '3',
      time: '12:00 PM',
      title: 'Lunch Break',
      description: 'Take time to nourish yourself',
      icon: <Utensils className="w-4 h-4" />,
      completed: false,
      type: 'afternoon'
    },
    {
      id: '4',
      time: '3:00 PM',
      title: 'Water Check',
      description: 'Stay hydrated throughout the day',
      icon: <Coffee className="w-4 h-4" />,
      completed: false,
      type: 'afternoon'
    },
    {
      id: '5',
      time: '6:00 PM',
      title: 'Evening Walk',
      description: 'Wind down with gentle movement',
      icon: <Sunset className="w-4 h-4" />,
      completed: false,
      type: 'evening'
    },
    {
      id: '6',
      time: '10:00 PM',
      title: 'Sleep Prep',
      description: 'Prepare for restful sleep',
      icon: <Moon className="w-4 h-4" />,
      completed: false,
      type: 'evening'
    }
  ]);

  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  const toggleEvent = (id: string) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, completed: !event.completed } : event
    ));
  };

  const getTimeColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'morning': return 'hsl(60, 100%, 70%)';
      case 'afternoon': return 'hsl(180, 100%, 60%)';
      case 'evening': return 'hsl(267, 100%, 70%)';
      default: return 'hsl(var(--primary))';
    }
  };

  return (
    <Card className="glass-strong p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold gradient-text">Today's Timeline</h3>
        <Button size="sm" className="rounded-full">
          <Plus className="w-4 h-4 mr-1" />
          Add Event
        </Button>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-400 via-cyan-400 to-purple-400" />

        {/* Events */}
        <div className="space-y-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start gap-4"
              onMouseEnter={() => setHoveredEvent(event.id)}
              onMouseLeave={() => setHoveredEvent(null)}
            >
              {/* Timeline Dot */}
              <motion.div
                className={`relative z-10 w-6 h-6 rounded-full border-2 border-background flex items-center justify-center ${
                  event.completed ? 'bg-primary' : 'bg-muted'
                }`}
                style={{ backgroundColor: event.completed ? getTimeColor(event.type) : undefined }}
                whileHover={{ scale: 1.2 }}
                animate={{
                  boxShadow: hoveredEvent === event.id 
                    ? `0 0 20px ${getTimeColor(event.type)}` 
                    : 'none'
                }}
              >
                {event.icon}
              </motion.div>

              {/* Event Content */}
              <motion.div
                className={`flex-1 p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                  event.completed 
                    ? 'bg-primary/10 border-primary/30' 
                    : 'bg-muted/20 border-border/30 hover:bg-muted/30'
                }`}
                onClick={() => toggleEvent(event.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm" style={{ color: getTimeColor(event.type) }}>
                        {event.time}
                      </span>
                      <h4 className={`font-medium ${event.completed ? 'line-through opacity-70' : ''}`}>
                        {event.title}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                  </div>
                  
                  {event.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-primary text-xl"
                    >
                      ✓
                    </motion.div>
                  )}
                </div>

                {/* AI Explanation on Hover */}
                {hoveredEvent === event.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-3 bg-secondary/30 rounded-lg border border-border/20"
                  >
                    <p className="text-xs text-muted-foreground">
                      🤖 <strong>ChronoMate says:</strong> {" "}
                      {event.type === 'morning' && "Morning routines set a positive tone for your entire day!"}
                      {event.type === 'afternoon' && "Afternoon check-ins help maintain your energy and focus."}
                      {event.type === 'evening' && "Evening rituals are crucial for rest and recovery."}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="mt-6 p-4 bg-secondary/20 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Today's Progress</span>
          <span className="text-sm text-primary">
            {Math.round((events.filter(e => e.completed).length / events.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ 
              width: `${(events.filter(e => e.completed).length / events.length) * 100}%` 
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </Card>
  );
};