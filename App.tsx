import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { Subject, UserProfile, AttendanceStatus, AppTheme } from './types';
import { formatDate } from './utils/attendance';
import { Icons } from './constants';

const LOCAL_STORAGE_KEY = 'attendly_data_v3';
const THEME_MODE_KEY = 'attendly_theme_mode';

const INITIAL_PROFILE: UserProfile = {
  name: '',
  rollNumber: '',
  institution: '',
  overallTarget: 75,
  theme: 'modern'
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile'>('dashboard');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load theme mode and data
  useEffect(() => {
    const savedMode = localStorage.getItem(THEME_MODE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const isDark = savedMode ? savedMode === 'dark' : prefersDark;
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');

    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    const legacyV2 = localStorage.getItem('attendly_data_v2');
    const legacyX = localStorage.getItem('attendx_data_v2');

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSubjects(parsed.subjects || []);
        
        // Ensure the loaded theme is valid, otherwise fallback to modern
        const theme = parsed.profile?.theme === 'retro' ? 'retro' : 'modern';
        setProfile({
          ...INITIAL_PROFILE,
          ...(parsed.profile || {}),
          theme
        });
      } catch (e) {
        console.error("Failed to parse storage", e);
      }
    } else if (legacyV2 || legacyX) {
      try {
        const parsed = JSON.parse((legacyV2 || legacyX)!);
        setSubjects(parsed.subjects || []);
        setProfile({ ...INITIAL_PROFILE, ...(parsed.profile || {}) });
      } catch (e) {
        console.error("Migration failed", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Apply visual theme to body
  useEffect(() => {
    if (isLoaded) {
      const body = document.body;
      const themes: AppTheme[] = ['modern', 'retro'];
      // Remove all theme classes first
      body.classList.remove('theme-modern', 'theme-notebook', 'theme-bullet', 'theme-retro', 'theme-midnight');
      body.classList.add(`theme-${profile.theme}`);
    }
  }, [profile.theme, isLoaded]);

  // Sync to Storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ subjects, profile }));
    }
  }, [subjects, profile, isLoaded]);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    const modeStr = next ? 'dark' : 'light';
    localStorage.setItem(THEME_MODE_KEY, modeStr);
    if (next) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const handleUpdateAttendance = (id: string, status: AttendanceStatus, date?: string) => {
    const dateStr = date || formatDate(new Date());
    setSubjects(prev => prev.map(sub => {
      if (sub.id !== id) return sub;
      const newHistory = { ...sub.history };
      if (status === 'NONE') delete newHistory[dateStr];
      else newHistory[dateStr] = status;
      return { ...sub, history: newHistory, lastUpdated: Date.now() };
    }));
  };

  const handleAddSubject = (name: string, target: number) => {
    const newSub: Subject = {
      id: crypto.randomUUID(),
      name,
      target,
      history: {},
      lastUpdated: Date.now()
    };
    setSubjects(prev => [newSub, ...prev]);
  };

  const handleDeleteSubject = (id: string) => {
    if (window.confirm("Delete this subject and all its records?")) {
      setSubjects(prev => prev.filter(sub => sub.id !== id));
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="relative min-h-screen">
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === 'dashboard' ? (
          <Dashboard 
            subjects={subjects} 
            profile={profile}
            onUpdateAttendance={handleUpdateAttendance}
            onAddSubject={handleAddSubject}
            onDeleteSubject={handleDeleteSubject}
          />
        ) : (
          <Profile 
            profile={profile}
            onUpdate={setProfile}
          />
        )}
      </Layout>

      <button
        onClick={toggleDarkMode}
        className="fixed bottom-6 right-6 z-[100] p-4 rounded-full bg-white dark:bg-slate-800 text-primary shadow-2xl border border-slate-200 dark:border-slate-700 hover:scale-110 active:scale-95 transition-all duration-300"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Icons.Sun /> : <Icons.Moon />}
      </button>
      <Analytics />
    </div>
  );
};

export default App;
