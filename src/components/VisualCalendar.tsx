import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Plus, 
  CheckCircle, 
  AlertCircle,
  Heart,
  Briefcase,
  Home,
  GraduationCap,
  Utensils,
  Coffee,
  Sun,
  Moon
} from 'lucide-react';
import { DateTime } from 'luxon';
import { toast } from 'sonner';

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

interface VisualCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: DateTime) => void;
  onAddEvent?: (date: DateTime) => void;
}

type ViewMode = 'month' | 'week' | 'day';

export const VisualCalendar: React.FC<VisualCalendarProps> = ({
  events,
  onEventClick,
  onDateClick,
  onAddEvent
}) => {
  const [currentDate, setCurrentDate] = useState(DateTime.now());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState<DateTime | null>(null);

  const getEventIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting': return <Briefcase className="w-3 h-3" />;
      case 'task': return <CheckCircle className="w-3 h-3" />;
      case 'reminder': return <AlertCircle className="w-3 h-3" />;
      case 'birthday': return <Heart className="w-3 h-3" />;
      case 'health': return <Heart className="w-3 h-3" />;
      case 'personal': return <Home className="w-3 h-3" />;
      default: return <Calendar className="w-3 h-3" />;
    }
  };

  const getEventColor = (type: CalendarEvent['type'], priority: CalendarEvent['priority']) => {
    const baseColors = {
      meeting: 'bg-blue-500',
      task: 'bg-green-500',
      reminder: 'bg-yellow-500',
      birthday: 'bg-pink-500',
      health: 'bg-red-500',
      personal: 'bg-purple-500'
    };

    const priorityOpacity = {
      low: '20',
      medium: '60',
      high: '100'
    };

    return `${baseColors[type]}/${priorityOpacity[priority]}`;
  };

  const getEventsForDate = (date: DateTime) => {
    return events.filter(event => 
      DateTime.fromISO(event.date).hasSame(date, 'day')
    );
  };

  const getEventsForWeek = (weekStart: DateTime) => {
    const weekEnd = weekStart.plus({ days: 6 });
    return events.filter(event => {
      const eventDate = DateTime.fromISO(event.date);
      return eventDate >= weekStart && eventDate <= weekEnd;
    });
  };

  const renderMonthView = () => {
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startOfCalendar = startOfMonth.startOf('week');
    const endOfCalendar = endOfMonth.endOf('week');

    const days: DateTime[] = [];
    let current = startOfCalendar;
    
    while (current <= endOfCalendar) {
      days.push(current);
      current = current.plus({ days: 1 });
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const isToday = day.hasSame(DateTime.now(), 'day');
          const isCurrentMonth = day.hasSame(currentDate, 'month');
          const isSelected = selectedDate?.hasSame(day, 'day');

          return (
            <motion.div
              key={index}
              className={`relative min-h-[80px] p-1 border border-border/20 rounded-lg cursor-pointer transition-all duration-200 ${
                isToday ? 'bg-primary/10 border-primary/50' : ''
              } ${isSelected ? 'ring-2 ring-primary/50' : ''} ${
                !isCurrentMonth ? 'opacity-40' : 'hover:bg-muted/30'
              }`}
              onClick={() => {
                setSelectedDate(day);
                onDateClick?.(day);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-sm font-medium mb-1">
                {day.day}
              </div>
              
              {/* Events */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <motion.div
                    key={event.id}
                    className={`p-1 rounded text-xs flex items-center gap-1 cursor-pointer ${getEventColor(event.type, event.priority)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {getEventIcon(event.type)}
                    <span className="truncate">{event.title}</span>
                  </motion.div>
                ))}
                
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>

              {/* Add event button */}
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddEvent?.(day);
                }}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = currentDate.startOf('week');
    const weekDays: DateTime[] = [];
    
    for (let i = 0; i < 7; i++) {
      weekDays.push(weekStart.plus({ days: i }));
    }

    const weekEvents = getEventsForWeek(weekStart);

    return (
      <div className="space-y-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const dayEvents = getEventsForDate(day);
            const isToday = day.hasSame(DateTime.now(), 'day');
            
            return (
              <div
                key={day.toISO()}
                className={`p-3 rounded-lg border ${
                  isToday ? 'bg-primary/10 border-primary/50' : 'border-border/30'
                }`}
              >
                <div className="text-sm font-medium text-muted-foreground">
                  {day.toFormat('EEE')}
                </div>
                <div className="text-lg font-bold">
                  {day.day}
                </div>
                <div className="text-xs text-muted-foreground">
                  {dayEvents.length} events
                </div>
              </div>
            );
          })}
        </div>

        {/* Events timeline */}
        <div className="space-y-2">
          {weekEvents.map((event) => (
            <motion.div
              key={event.id}
              className={`p-3 rounded-lg border cursor-pointer ${getEventColor(event.type, event.priority)}`}
              onClick={() => onEventClick?.(event)}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getEventIcon(event.type)}
                  <span className="font-medium">{event.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  {event.time && (
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {event.time}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {DateTime.fromISO(event.date).toFormat('MMM d')}
                  </Badge>
                </div>
              </div>
              {event.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {event.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);
    const timeSlots = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="space-y-4">
        {/* Day header */}
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <h3 className="text-xl font-bold">
            {currentDate.toFormat('EEEE, MMMM d, yyyy')}
          </h3>
          <p className="text-muted-foreground">
            {dayEvents.length} events scheduled
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          {timeSlots.map((hour) => {
            const hourEvents = dayEvents.filter(event => {
              if (!event.time) return false;
              const eventHour = parseInt(event.time.split(':')[0]);
              return eventHour === hour;
            });

            return (
              <div key={hour} className="flex gap-4">
                <div className="w-16 text-sm text-muted-foreground text-right pt-2">
                  {DateTime.fromObject({ hour }).toFormat('h a')}
                </div>
                <div className="flex-1 min-h-[60px] border-l border-border/30 pl-4 relative">
                  {hourEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      className={`absolute left-4 right-0 p-2 rounded border cursor-pointer ${getEventColor(event.type, event.priority)}`}
                      onClick={() => onEventClick?.(event)}
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="flex items-center gap-2">
                        {getEventIcon(event.type)}
                        <span className="font-medium text-sm">{event.title}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' 
      ? currentDate.minus({ [viewMode === 'month' ? 'month' : 'week']: 1 })
      : currentDate.plus({ [viewMode === 'month' ? 'month' : 'week']: 1 });
    setCurrentDate(newDate);
  };

  return (
    <Card className="glass-strong p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-semibold gradient-text">Calendar</h3>
          <div className="flex gap-1">
            {(['month', 'week', 'day'] as ViewMode[]).map((mode) => (
              <Button
                key={mode}
                size="sm"
                variant={viewMode === mode ? "default" : "outline"}
                onClick={() => setViewMode(mode)}
                className="capitalize"
              >
                {mode}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate('prev')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setCurrentDate(DateTime.now())}
          >
            Today
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate('next')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewMode}-${currentDate.toISO()}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'day' && renderDayView()}
        </motion.div>
      </AnimatePresence>

      {/* Quick stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-primary">
            {events.filter(e => !e.completed).length}
          </div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-green-500">
            {events.filter(e => e.completed).length}
          </div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-accent">
            {events.filter(e => e.priority === 'high').length}
          </div>
          <div className="text-sm text-muted-foreground">High Priority</div>
        </div>
      </div>
    </Card>
  );
}; 