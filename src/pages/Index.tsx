import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Mic, Download, Github, Linkedin, Twitter } from 'lucide-react';
import { PersonalizedAI } from '@/components/PersonalizedAI';
import { MoodSlider } from '@/components/MoodSlider';
import { Timeline } from '@/components/Timeline';
import { Analytics } from '@/components/Analytics';
import { CustomizationVault } from '@/components/CustomizationVault';
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { SuccessAnimation } from '@/components/SuccessAnimation';
import { TextAnimation, TypewriterText, WaveText, BounceText, GlowText, FloatingText } from '@/components/TextAnimations';
import { toast } from 'sonner';

const Index = () => {
  const [currentMood, setCurrentMood] = useState('neutral');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState({ message: '', type: 'completion' as const });

  const handleReminderCreated = (reminder: string) => {
    toast.success('Reminder Created!', {
      description: reminder,
      duration: 3000,
    });
    
    setSuccessData({ message: reminder, type: 'completion' });
    setShowSuccess(true);
  };

  const handleMoodChange = (mood: string) => {
    setCurrentMood(mood);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <motion.div 
          className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
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
              <TypewriterText duration={0.1}>ChronoMate</TypewriterText>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              <WaveText delay={1}>Because time deserves to care for you too.</WaveText>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button size="lg" className="px-8 py-6 text-lg rounded-full bg-primary hover:bg-primary/80 glow">
              <Play className="w-5 h-5 mr-2" />
              Try Demo
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-full glass">
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

      {/* Problem Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-12 gradient-text"
          >
            <BounceText delay={0.5}>We're all busy, but not always balanced.</BounceText>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🍱', title: 'Missed meals', desc: 'Skipping nutrition in the rush' },
              { icon: '🩺', title: 'Forgotten checkups', desc: 'Health takes a backseat' },
              { icon: '🎯', title: 'Skipped goals', desc: 'Dreams delayed by deadlines' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="glass p-8 h-full">
                  <div className="text-4xl mb-4">
                    <FloatingText>{item.icon}</FloatingText>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    <WaveText delay={0.5}>{item.title}</WaveText>
                  </h3>
                  <p className="text-muted-foreground">
                    <TypewriterText delay={1} duration={0.03}>{item.desc}</TypewriterText>
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
            <GlowText delay={1.5}>"Your calendar should care about <em>you</em>, not just time."</GlowText>
          </motion.p>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section id="ai-assistant-section" className="py-20 px-4 bg-secondary/10">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-12 gradient-text"
          >
            <WaveText>Meet Your Personalized AI Assistant</WaveText>
          </motion.h2>
          <PersonalizedAI mood={currentMood} onReminderCreated={handleReminderCreated} />
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-12 gradient-text"
          >
            <BounceText>Dynamic Daily Timeline</BounceText>
          </motion.h2>
          <Timeline />
        </div>
      </section>

      {/* Mood Section */}
      <section className="py-20 px-4 bg-secondary/10">
        <div className="max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-4 gradient-text"
          >
            <TypewriterText duration={0.08}>ChronoMate doesn't just remind.</TypewriterText>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-center mb-12 italic"
          >
            <GlowText delay={2}>It <em>understands</em>.</GlowText>
          </motion.p>
          <MoodSlider onMoodChange={handleMoodChange} />
        </div>
      </section>

      {/* Analytics Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-12 gradient-text"
          >
            <WaveText>Weekly Habit Analytics</WaveText>
          </motion.h2>
          <Analytics />
        </div>
      </section>

      {/* Customization Section */}
      <section className="py-20 px-4 bg-secondary/10">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-12 gradient-text"
          >
            <BounceText>Customization Vault</BounceText>
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
            Built with ❤️ for India National Hackathon
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
