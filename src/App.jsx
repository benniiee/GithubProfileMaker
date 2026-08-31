import React, { useState, useEffect } from 'react';
import { ProfileProvider } from './store/profileStore';
import { Header } from './components/layout/Header';
import { SplitView } from './components/layout/SplitView';
import { Footer } from './components/layout/Footer';

export function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('gh_builder_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('gh_builder_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('gh_builder_theme', 'light');
    }
  }, [darkMode]);

  return (
    <ProfileProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
        <Header
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />
        <main className="flex-1">
          <SplitView />
        </main>
        <Footer />
      </div>
    </ProfileProvider>
  );
}

export default App;
