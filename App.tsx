import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Blog from './components/Blog';
import Contact from './components/Contact';
import ThreeBackground from './components/ThreeBackground';
import { BackgroundMode } from './types';

function App() {
  const [isDark, setIsDark] = useState(true);
  const [bgMode, setBgMode] = useState<BackgroundMode>(BackgroundMode.PARTICLES);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="relative min-h-screen">
      {/* 3D Background */}
      <ThreeBackground mode={bgMode} />

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col">
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />
        
        <main>
          <Hero />
          <About />
          <Projects />
          <Blog />
          <Contact />
        </main>

        {/* Background Switcher Control (Bottom Right) */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
          <div className="glass-panel p-2 rounded-xl flex flex-col gap-2 backdrop-blur-xl">
             <button 
               onClick={() => setBgMode(BackgroundMode.PARTICLES)}
               className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${bgMode === BackgroundMode.PARTICLES ? 'bg-neon-blue text-slate-900' : 'hover:bg-white/10'}`}
               title="Particles"
             >
               <i className="fas fa-wind"></i>
             </button>
             <button 
               onClick={() => setBgMode(BackgroundMode.GRID)}
               className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${bgMode === BackgroundMode.GRID ? 'bg-neon-purple text-white' : 'hover:bg-white/10'}`}
               title="Grid"
             >
               <i className="fas fa-border-all"></i>
             </button>
             <button 
               onClick={() => setBgMode(BackgroundMode.STARS)}
               className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${bgMode === BackgroundMode.STARS ? 'bg-neon-pink text-white' : 'hover:bg-white/10'}`}
               title="Stars"
             >
               <i className="fas fa-star"></i>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
