import { useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  preferences: {
    reminderFrequency: 'high' | 'medium' | 'low';
    focusAreas: string[];
    preferredTimes: string[];
    communicationStyle: 'formal' | 'casual' | 'friendly';
  };
  history: {
    interactions: number;
    completedTasks: number;
    averageMood: string;
    lastActive: Date;
  };
  habits: {
    [key: string]: {
      count: number;
      streak: number;
      lastCompleted: Date;
    };
  };
  goals: {
    id: string;
    title: string;
    progress: number;
    deadline?: Date;
  }[];
}

const defaultProfile: UserProfile = {
  id: 'user-1',
  name: 'User',
  preferences: {
    reminderFrequency: 'medium',
    focusAreas: ['health', 'productivity'],
    preferredTimes: ['09:00', '13:00', '18:00'],
    communicationStyle: 'friendly',
  },
  history: {
    interactions: 0,
    completedTasks: 0,
    averageMood: 'neutral',
    lastActive: new Date(),
  },
  habits: {},
  goals: [],
};

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('chronomate-user-profile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile({ ...defaultProfile, ...parsedProfile });
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    localStorage.setItem('chronomate-user-profile', JSON.stringify(newProfile));
  };

  const trackInteraction = (mood?: string) => {
    updateProfile({
      history: {
        ...profile.history,
        interactions: profile.history.interactions + 1,
        averageMood: mood || profile.history.averageMood,
        lastActive: new Date(),
      },
    });
  };

  const addHabit = (habitName: string) => {
    const existingHabit = profile.habits[habitName];
    const now = new Date();
    const today = now.toDateString();
    const lastCompleted = existingHabit?.lastCompleted?.toDateString();

    updateProfile({
      habits: {
        ...profile.habits,
        [habitName]: {
          count: (existingHabit?.count || 0) + 1,
          streak: lastCompleted === today ? existingHabit.streak : (existingHabit?.streak || 0) + 1,
          lastCompleted: now,
        },
      },
    });
  };

  const addGoal = (title: string, deadline?: Date) => {
    const newGoal = {
      id: Date.now().toString(),
      title,
      progress: 0,
      deadline,
    };

    updateProfile({
      goals: [...profile.goals, newGoal],
    });
  };

  const updateGoalProgress = (goalId: string, progress: number) => {
    updateProfile({
      goals: profile.goals.map(goal =>
        goal.id === goalId ? { ...goal, progress } : goal
      ),
    });
  };

  const completeTask = () => {
    updateProfile({
      history: {
        ...profile.history,
        completedTasks: profile.history.completedTasks + 1,
      },
    });
  };

  return {
    profile,
    isLoading,
    updateProfile,
    trackInteraction,
    addHabit,
    addGoal,
    updateGoalProgress,
    completeTask,
  };
};