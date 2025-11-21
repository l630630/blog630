
import React, { useState, useEffect, useRef } from 'react';
import Magnetic from './Magnetic';

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDark, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Use a ref to hold the Audio object instance to persist across renders
  const audioInstance = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Initialize Audio Object
    // Using a reliable Lofi track from Pixabay (Direct MP3 link)
    const audio = new Audio("https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = 'auto';
    
    audioInstance.current = audio;

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Cleanup audio on unmount
      if (audioInstance.current) {
        audioInstance.current.pause();
        audioInstance.current.src = "";
      }
    };
  }, []);

  const togglePlay = async () => {
    if (!audioInstance.current) return;

    if (isPlaying) {
      audioInstance.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioInstance.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Playback failed:", error);
        // Usually fails due to user not interacting with document yet, 
        // but since this is a click handler, it should pass.
        setIsPlaying(false);
      }
    }
  };

  // Smooth scroll handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        setIsMobileMenuOpen(false); // Close mobile menu on click
    }
  };

  const navLinks = [
    { name: '首页', href: '#hero' },
    { name: '关于', href: '#about' },
    { name: '作品', href: '#projects' },
    { name: '博客', href: '#blog' },
    { name: '联系', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
      scrolled ? 'py-4 glass-panel shadow-lg' : 'py-6 bg-transparent'
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a href="#" onClick={(e) => handleNavClick(e, '#hero')} className="text-2xl font-heading font-bold tracking-tighter hover:text-neon-blue transition-colors relative z-50">
          Lumina<span className="text-neon-blue">.</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium hover:text-neon-blue transition-colors hover-underline-center py-1"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 relative z-50">
          {/* Music Player - Simplified & Direct JS Control */}
          <div className="hidden sm:flex items-center gap-3 bg-glass-200 rounded-full px-4 py-2 border border-glass-border backdrop-blur-md transition-transform hover:scale-105 cursor-pointer" onClick={togglePlay}>
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-neon-green animate-pulse' : 'bg-slate-400'}`}></div>
            <button 
              className="flex items-center justify-center hover:text-neon-blue transition-colors focus:outline-none"
              aria-label={isPlaying ? "暂停音乐" : "播放音乐"}
            >
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-xs w-4`}></i>
            </button>
            <div className="flex flex-col leading-none select-none">
              <span className="text-[10px] font-bold opacity-90">Lofi Chill</span>
              <span className="text-[8px] opacity-60">Coding Mode</span>
            </div>
          </div>

          {/* Theme Toggle */}
          <Magnetic>
            <button 
              onClick={toggleTheme}
              className="relative w-10 h-10 rounded-full flex items-center justify-center border border-glass-border hover:bg-glass-100 transition-all overflow-hidden"
              aria-label="切换主题"
            >
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 transform ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`}>
                <i className="fas fa-sun text-yellow-400 text-lg"></i>
              </div>
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 transform ${!isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}>
                <i className="fas fa-moon text-slate-600 text-lg"></i>
              </div>
            </button>
          </Magnetic>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden w-10 h-10 flex items-center justify-center text-xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-slate-900/95 backdrop-blur-lg z-40 flex flex-col items-center justify-center gap-8 transition-all duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
         {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-2xl font-bold hover:text-neon-blue transition-colors"
            >
              {link.name}
            </a>
          ))}
          
          {/* Mobile Music Control */}
          <button 
            onClick={togglePlay} 
            className="flex items-center gap-4 mt-8 bg-white/10 px-6 py-3 rounded-xl hover:bg-white/20 transition-colors"
          >
             <div className="w-10 h-10 rounded-full bg-neon-blue text-slate-900 flex items-center justify-center text-lg">
                <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
             </div>
             <div className="text-left">
                <div className="text-sm font-bold text-white">Lofi Chill</div>
                <div className="text-xs opacity-70 text-slate-300">Coding Mode</div>
             </div>
          </button>
      </div>
    </nav>
  );
};

export default Navbar;
