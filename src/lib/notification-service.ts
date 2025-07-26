import { toast } from 'sonner';

export interface NotificationOptions {
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  voice?: boolean;
  priority?: 'low' | 'normal' | 'high';
}

export interface ReminderNotification {
  id: string;
  title: string;
  message: string;
  time: Date;
  completed: boolean;
  snoozed?: Date;
  actions?: {
    snooze: () => void;
    complete: () => void;
    dismiss: () => void;
  };
}

class NotificationService {
  private permission: NotificationPermission = 'default';
  private voiceEnabled: boolean = true;
  private notifications: Map<string, ReminderNotification> = new Map();

  constructor() {
    this.initialize();
  }

  private async initialize() {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return;
    }

    // Request permission
    if (Notification.permission === 'default') {
      this.permission = await Notification.requestPermission();
    } else {
      this.permission = Notification.permission;
    }

    // Check if speech synthesis is available
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      this.voiceEnabled = false;
    }

    // Set up periodic checks for due reminders
    setInterval(() => {
      this.checkDueReminders();
    }, 30000); // Check every 30 seconds
  }

  async showNotification(options: NotificationOptions) {
    const {
      title,
      message,
      type = 'info',
      duration = 5000,
      action,
      voice = false,
      priority = 'normal'
    } = options;

    // Show toast notification
    const toastOptions: any = {
      duration,
      description: message
    };

    if (action) {
      toastOptions.action = {
        label: action.label,
        onClick: action.onClick
      };
    }

    switch (type) {
      case 'success':
        toast.success(title, toastOptions);
        break;
      case 'warning':
        toast.warning(title, toastOptions);
        break;
      case 'error':
        toast.error(title, toastOptions);
        break;
      default:
        toast.info(title, toastOptions);
    }

    // Show browser notification if permitted
    if (this.permission === 'granted') {
      this.showBrowserNotification(title, message, priority);
    }

    // Speak the message if voice is enabled
    if (voice && this.voiceEnabled) {
      this.speak(message);
    }
  }

  private showBrowserNotification(title: string, message: string, priority: 'low' | 'normal' | 'high') {
    const notification = new Notification(title, {
      body: message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'chronomate-notification',
      requireInteraction: priority === 'high',
      silent: false
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto-close after 10 seconds unless high priority
    if (priority !== 'high') {
      setTimeout(() => {
        notification.close();
      }, 10000);
    }
  }

  private speak(text: string) {
    if (!this.voiceEnabled) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('alex')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.1; // Slightly higher pitch
    utterance.volume = 0.8;

    window.speechSynthesis.speak(utterance);
  }

  scheduleReminder(reminder: Omit<ReminderNotification, 'id' | 'completed'>) {
    const id = `reminder-${Date.now()}-${Math.random()}`;
    const fullReminder: ReminderNotification = {
      ...reminder,
      id,
      completed: false
    };

    this.notifications.set(id, fullReminder);
    return id;
  }

  private checkDueReminders() {
    const now = new Date();
    
    this.notifications.forEach((reminder, id) => {
      if (!reminder.completed && !reminder.snoozed && reminder.time <= now) {
        this.showReminderNotification(reminder);
      }
    });
  }

  private showReminderNotification(reminder: ReminderNotification) {
    // Show browser notification
    if (this.permission === 'granted') {
      const notification = new Notification(reminder.title, {
        body: reminder.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: reminder.id,
        requireInteraction: true,
        silent: false
      });

      notification.onclick = () => {
        window.focus();
        reminder.actions?.complete();
        notification.close();
      };
    }

    // Show toast with actions
    toast.info(reminder.title, {
      description: reminder.message,
      duration: 0, // Don't auto-dismiss
      action: {
        label: 'Mark Done',
        onClick: () => {
          reminder.actions?.complete();
        }
      }
    });

    // Speak the reminder
    if (this.voiceEnabled) {
      this.speak(`${reminder.title}. ${reminder.message}`);
    }
  }

  snoozeReminder(id: string, minutes: number = 5) {
    const reminder = this.notifications.get(id);
    if (reminder) {
      reminder.snoozed = new Date(Date.now() + minutes * 60 * 1000);
      this.notifications.set(id, reminder);
    }
  }

  completeReminder(id: string) {
    const reminder = this.notifications.get(id);
    if (reminder) {
      reminder.completed = true;
      this.notifications.set(id, reminder);
    }
  }

  dismissReminder(id: string) {
    this.notifications.delete(id);
  }

  // Morning greeting
  showMorningGreeting(userName: string, tasksCount: number) {
    const greeting = `Good morning ${userName}! You have ${tasksCount} tasks planned for today. Let's make it a productive day! 🌅`;
    
    this.showNotification({
      title: 'Good Morning!',
      message: greeting,
      type: 'success',
      voice: true,
      duration: 8000
    });
  }

  // Evening reflection
  showEveningReflection(completedTasks: number, totalTasks: number) {
    const completionRate = Math.round((completedTasks / totalTasks) * 100);
    let message = '';
    
    if (completionRate >= 80) {
      message = `Amazing work today! You completed ${completedTasks} out of ${totalTasks} tasks. You're on fire! 🔥`;
    } else if (completionRate >= 60) {
      message = `Good progress today! You completed ${completedTasks} out of ${totalTasks} tasks. Keep it up! 💪`;
    } else {
      message = `You completed ${completedTasks} out of ${totalTasks} tasks today. Tomorrow is a new opportunity! 🌟`;
    }

    this.showNotification({
      title: 'Evening Reflection',
      message,
      type: 'info',
      voice: true,
      duration: 10000
    });
  }

  // Inactivity alert
  showInactivityAlert() {
    this.showNotification({
      title: 'Taking a break?',
      message: "You've been inactive for a while. Want to review your progress or plan your next steps?",
      type: 'warning',
      voice: true,
      action: {
        label: 'Review Progress',
        onClick: () => {
          // Scroll to analytics section
          document.getElementById('analytics-section')?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  // Streak celebration
  showStreakCelebration(streakDays: number) {
    this.showNotification({
      title: '🔥 Streak Achievement!',
      message: `Congratulations! You've maintained a ${streakDays}-day streak! You're building amazing habits!`,
      type: 'success',
      voice: true,
      duration: 12000
    });
  }

  // Health reminder
  showHealthReminder(type: 'water' | 'exercise' | 'break' | 'meditation') {
    const reminders = {
      water: {
        title: '💧 Hydration Check',
        message: "Time to drink some water! Staying hydrated helps you stay focused and energized."
      },
      exercise: {
        title: '💪 Move Your Body',
        message: "Take a short walk or do some stretching. Your body and mind will thank you!"
      },
      break: {
        title: '☕ Take a Break',
        message: "You've been working hard. Take a 5-minute break to refresh your mind."
      },
      meditation: {
        title: '🧘 Mindful Moment',
        message: "Time for a quick meditation session. Even 2 minutes can make a difference."
      }
    };

    const reminder = reminders[type];
    
    this.showNotification({
      title: reminder.title,
      message: reminder.message,
      type: 'info',
      voice: true,
      action: {
        label: 'Mark Done',
        onClick: () => {
          // Track the health activity
          console.log(`Health activity completed: ${type}`);
        }
      }
    });
  }

  // Task deadline warning
  showDeadlineWarning(taskTitle: string, minutesLeft: number) {
    this.showNotification({
      title: '⏰ Deadline Approaching',
      message: `"${taskTitle}" is due in ${minutesLeft} minutes. Need to reschedule?`,
      type: 'warning',
      voice: true,
      priority: 'high',
      action: {
        label: 'Reschedule',
        onClick: () => {
          // Open task edit modal or calendar
          console.log('Opening task reschedule');
        }
      }
    });
  }

  // Mood check-in reminder
  showMoodCheckIn() {
    this.showNotification({
      title: '😊 How are you feeling?',
      message: "Take a moment to check in with yourself. Your mood affects your productivity!",
      type: 'info',
      voice: true,
      action: {
        label: 'Check Mood',
        onClick: () => {
          // Scroll to mood slider
          document.getElementById('mood-section')?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  // Enable/disable voice
  setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
  }

  // Get notification permission status
  getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      this.permission = await Notification.requestPermission();
      return this.permission;
    }
    return 'denied';
  }
}

// Export singleton instance
export const notificationService = new NotificationService(); 