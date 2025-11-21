
import React, { useState, useEffect, useRef } from 'react';
import Magnetic from './Magnetic';
import { BackgroundMode } from '../types';

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
  bgMode: BackgroundMode;
}

// Use reliable direct MP3 links (Pixabay/Royalty Free) to ensure playback works
const TRACKS = {
  [BackgroundMode.PARTICLES]: {
    title: "Lofi Study",
    subtitle: "FASSounds",
    // Reliable Lofi track
    src: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3"
  },
  [BackgroundMode.GRID]: {
    title: "Synthwave 80s",
    subtitle: "Grand_Project",
    // Upbeat Synthwave
    src: "https://cdn.pixabay.com/download/audio/2021/11/01/audio_00fa5593f3.mp3?filename=retro-platforming-2047.mp3"
  },
  [BackgroundMode.STARS]: {
    title: "Ambient Space",
    subtitle: "RelaxingTime",
    // Deep Space Ambient
    src: "https://cdn.pixabay.com/download/audio/2020/05/18/audio_52640eb297.mp3?filename=space-atmosphere-2047.mp3"
  }
};

const Navbar: React.FC<NavbarProps> = ({ isDark, toggleTheme, bgMode }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6); // Default volume 60%
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(TRACKS[BackgroundMode.PARTICLES]);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const isTogglingRef = useRef(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync volume state with audio element continuously
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // 1. Watch for bgMode changes to update track info
  useEffect(() => {
    const newTrack = TRACKS[bgMode];
    if (newTrack.src !== currentTrack.src) {
      const wasPlaying = isPlaying;
      
      // Update track state
      setCurrentTrack(newTrack);
      
      // If it was playing, we want to resume the new track after it loads
      if (wasPlaying && audioRef.current) {
        // Small timeout to let React update the src prop
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.load();
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        // Auto-play might be blocked if user hasn't interacted yet
                        if (error.name === 'NotAllowedError') {
                            setIsPlaying(false);
                        }
                    });
                }
            }
        }, 100);
      }
    }
  }, [bgMode]);

  const togglePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio || isTogglingRef.current) return;

    isTogglingRef.current = true;

    try {
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            // Ensure volume is set before playing
            audio.volume = volume;
            await audio.play();
            setIsPlaying(true);
        }
    } catch (error: any) {
        // Ignore AbortError (happens if user clicks fast)
        if (error.name !== 'AbortError') {
             console.error("Playback error:", error);
        }
        // If not allowed, reset state
        if (error.name === 'NotAllowedError') {
            setIsPlaying(false);
        }
    } finally {
        isTogglingRef.current = false;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
        audioRef.current.volume = newVol;
    }
  };

  // Ensure volume is applied when metadata loads (fixes "no sound" issue)
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
        audioRef.current.volume = volume;
    }
  };

  const handleEnded = () => {
    if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
    }
  };

  // Smooth scroll handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        setIsMobileMenuOpen(false);
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
        {/* 
          Audio Element Fixed:
          1. Removed crossOrigin (causes issues with some CDNs)
          2. Added onLoadedMetadata to force volume sync
        */}
        <audio 
            ref={audioRef} 
            src={currentTrack.src}
            preload="auto"
            loop
            onEnded={handleEnded}
            onLoadedMetadata={handleLoadedMetadata}
        />

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
          {/* Music Player */}
          <div className="hidden sm:flex items-center gap-3 bg-glass-200 rounded-full px-4 py-2 border border-glass-border backdrop-blur-md transition-transform hover:scale-105">
            
            {/* Play Button */}
            <button 
              onClick={togglePlay}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 hover:text-neon-blue transition-colors focus:outline-none"
              aria-label={isPlaying ? "暂停音乐" : "播放音乐"}
            >
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-xs`}></i>
            </button>

            {/* Track Info */}
            <div className="flex flex-col leading-none select-none min-w-[80px] mr-2 overflow-hidden">
              <span key={currentTrack.title} className="text-[10px] font-bold opacity-90 animate-[fadeIn_0.5s_ease-out] whitespace-nowrap">{currentTrack.title}</span>
              <span key={currentTrack.subtitle} className="text-[8px] opacity-60 animate-[fadeIn_0.5s_ease-out] whitespace-nowrap">{currentTrack.subtitle}</span>
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-2 border-l border-white/10 pl-3">
               <i className={`fas ${volume === 0 ? 'fa-volume-mute' : 'fa-volume-down'} text-[10px] opacity-70 w-3`}></i>
               <input 
                 type="range" 
                 min="0" 
                 max="1" 
                 step="0.05" 
                 value={volume} 
                 onChange={handleVolumeChange}
                 className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-neon-blue"
                 aria-label="音量调节"
               />
            </div>
          </div>

          {/* Theme Toggle */}
          <Magnetic>
            <button 
              onClick={toggleTheme}
              className="relative w-10 h-10 rounded-full flex items-center justify-center border border-glass-border hover:bg-glass-100 transition-all overflow-hidden"
              aria-label="切换主题"
            >
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 transform ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`}>
                <i className="fas fa-sun text-yellow-400 text-lg"></i>
              </div>
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 transform ${!isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}>
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
          <div className="mt-8 p-6 bg-white/5 rounded-2xl w-64 flex flex-col items-center">
              <div className="text-center mb-4">
                <div className="text-sm font-bold text-white mb-1">{currentTrack.title}</div>
                <div className="text-xs opacity-70 text-slate-300">{currentTrack.subtitle}</div>
              </div>
              
              <div className="flex items-center gap-6 mb-4">
                  <button 
                    onClick={togglePlay} 
                    className="w-12 h-12 rounded-full bg-neon-blue text-slate-900 flex items-center justify-center text-lg hover:scale-110 transition-transform"
                  >
                    <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                  </button>
              </div>

              <input 
                 type="range" 
                 min="0" 
                 max="1" 
                 step="0.05" 
                 value={volume} 
                 onChange={handleVolumeChange}
                 className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-neon-blue"
              />
          </div>
      </div>
    </nav>
  );
};

export default Navbar;
