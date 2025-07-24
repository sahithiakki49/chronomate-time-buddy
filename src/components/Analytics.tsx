import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Clock, Target, Coffee } from 'lucide-react';

export const Analytics: React.FC = () => {
  const stats = [
    {
      icon: <Target className="w-6 h-6" />,
      label: 'Completion Rate',
      value: '87%',
      trend: '+12%',
      color: 'hsl(120, 100%, 60%)'
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      label: 'Most Snoozed',
      value: 'Lunch',
      trend: '3x this week',
      color: 'hsl(30, 100%, 60%)'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Peak Hour',
      value: '10 AM',
      trend: 'Most focused',
      color: 'hsl(267, 100%, 70%)'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Streak',
      value: '5 days',
      trend: 'Personal best!',
      color: 'hsl(180, 100%, 60%)'
    }
  ];

  const weeklyData = [
    { day: 'Mon', completed: 85, total: 100 },
    { day: 'Tue', completed: 92, total: 100 },
    { day: 'Wed', completed: 78, total: 100 },
    { day: 'Thu', completed: 95, total: 100 },
    { day: 'Fri', completed: 88, total: 100 },
    { day: 'Sat', completed: 70, total: 100 },
    { day: 'Sun', completed: 82, total: 100 }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass p-4 hover:glass-strong transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="p-2 rounded-lg" 
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <div style={{ color: stat.color }}>
                    {stat.icon}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
                <div className="text-xs" style={{ color: stat.color }}>
                  {stat.trend}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Weekly Chart */}
      <Card className="glass-strong p-6">
        <h3 className="text-xl font-semibold mb-4 gradient-text">Weekly Habit Analytics</h3>
        
        <div className="space-y-4">
          {weeklyData.map((day, index) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="w-8 text-sm font-medium">{day.day}</div>
              <div className="flex-1 relative">
                <div className="w-full h-4 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${day.completed}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
              </div>
              <div className="w-12 text-sm text-right">{day.completed}%</div>
            </motion.div>
          ))}
        </div>

        {/* AI Insights */}
        <div className="mt-6 space-y-4">
          <h4 className="font-semibold text-primary">🤖 AI Insights</h4>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-4 bg-secondary/20 rounded-xl border border-border/30"
          >
            <p className="text-sm mb-3">
              <strong>ChronoMate noticed:</strong> You tend to skip lunch on busy days. 
              Want me to be stricter about meal reminders?
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                Yes, be stricter
              </Button>
              <Button size="sm" variant="ghost" className="text-xs">
                Keep it gentle
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="p-4 bg-accent/10 rounded-xl border border-accent/30"
          >
            <p className="text-sm mb-3">
              <strong>Productivity Tip:</strong> You're most focused at 10 AM! 
              How about scheduling deep work during this time?
            </p>
            <div className="flex gap-2">
              <Button size="sm" className="text-xs bg-accent hover:bg-accent/80">
                Schedule deep work
              </Button>
              <Button size="sm" variant="ghost" className="text-xs">
                Maybe later
              </Button>
            </div>
          </motion.div>
        </div>
      </Card>
    </div>
  );
};