import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import Magnetic from './Magnetic';

// Use global GSAP loaded via script tag to avoid import map path issues
const gsap = (window as any).gsap;

const LOCAL_STORAGE_KEY = 'lumina_hero_image';

const Hero: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null); // Specifically for the name scramble
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  const [heroImage, setHeroImage] = useState<string>("https://picsum.photos/800/800?random=99");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Initialize image from LocalStorage or Generate
  useEffect(() => {
    const savedImage = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (savedImage) {
      setHeroImage(savedImage);
    } else {
      // Only generate if no saved image exists to save tokens and load time
      generateDefaultImage();
    }
  }, []);

  const generateDefaultImage = async () => {
    if (!process.env.API_KEY) return;

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { text: 'A futuristic, cyberpunk style portrait of a creative developer, neon lighting, glassmorphism elements, digital art, 8k resolution, highly detailed' }
          ]
        }
      });

      if (response.candidates?.[0]?.content?.parts) {
         for (const part of response.candidates[0].content.parts) {
           if (part.inlineData) {
              const imageData = `data:image/png;base64,${part.inlineData.data}`;
              setHeroImage(imageData);
              localStorage.setItem(LOCAL_STORAGE_KEY, imageData);
              break;
           }
         }
      }
    } catch (error) {
      console.error("Failed to generate default image", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Advanced GSAP Entrance Animations
  useEffect(() => {
    if (!gsap || !containerRef.current) return;
    
    const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        // Helper: Text Scramble Effect
        const scrambleText = (element: HTMLElement, finalText: string, duration: number = 1.5) => {
            const chars = "!<>-_\\/[]{}—=+*^?#________";
            const obj = { p: 0 };
            
            gsap.to(obj, {
                p: 1,
                duration: duration,
                ease: "power4.inOut",
                onUpdate: () => {
                    const progress = Math.floor(obj.p * finalText.length);
                    let str = finalText.substring(0, progress);
                    for (let i = progress; i < finalText.length; i++) {
                        // Add random char if not finished
                        str += (Math.random() > 0.5) ? chars[Math.floor(Math.random() * chars.length)] : '';
                    }
                    element.innerText = str;
                },
                onComplete: () => {
                    element.innerText = finalText;
                }
            });
        };

        // 1. Initial Setup
        gsap.set(containerRef.current, { visibility: 'visible' });
        gsap.set(titleRef.current?.children || [], { opacity: 0, y: 20 });
        gsap.set(subtitleRef.current, { clipPath: 'polygon(0 0, 0 100%, 0 100%, 0 0)', opacity: 1 }); // Hidden by clip-path
        gsap.set(buttonRef.current, { opacity: 0, y: 20 });
        gsap.set(imageRef.current, { scale: 0, opacity: 0, filter: 'blur(20px) brightness(2)' });

        // 2. Animation Sequence
        
        // Step A: Avatar "Teleport" Entry (Scale + Blur/Brightness Glitch)
        if (imageRef.current) {
            tl.to(imageRef.current, {
                scale: 1,
                opacity: 1,
                filter: 'blur(0px) brightness(1)',
                duration: 1.5,
                ease: "elastic.out(1, 0.5)"
            });
        }

        // Step B: Staggered Text Entry
        if (titleRef.current) {
            // "Hello, I am" fade in
            tl.to(titleRef.current.firstElementChild, {
                opacity: 1,
                y: 0,
                duration: 0.8
            }, "-=1.2");

            // Name Scramble Trigger
            tl.call(() => {
                if (nameRef.current) {
                    nameRef.current.style.opacity = '1';
                    scrambleText(nameRef.current, "张健");
                }
            }, [], "-=0.8");
        }

        // Step C: Subtitle Swipe Reveal (Cyberpunk scan effect)
        if (subtitleRef.current) {
            tl.to(subtitleRef.current, {
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                duration: 1.2,
                ease: "expo.inOut"
            }, "-=1.0");
        }

        // Step D: Buttons Pop in
        if (buttonRef.current) {
            tl.to(buttonRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "back.out(1.7)"
            }, "-=0.8");
        }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setHeroImage(result);
        localStorage.setItem(LOCAL_STORAGE_KEY, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <section id="hero" ref={containerRef} className="min-h-screen flex items-center justify-center relative pt-20 pb-10 overflow-hidden invisible">
      <div className="container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Text Content */}
        <div className="lg:w-1/2 text-center lg:text-left z-10">
          <h1 ref={titleRef} className="text-5xl md:text-7xl font-heading font-bold leading-tight mb-6 tracking-tight">
            <span className="block text-slate-800 dark:text-slate-100">你好，我是</span>
            <span ref={nameRef} className="text-gradient inline-block min-w-[150px] opacity-0"></span>
          </h1>
          <p ref={subtitleRef} className="text-lg md:text-xl mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed relative">
             一位热衷于打造沉浸式 Web 体验的<span className="text-neon-blue font-bold">创意开发者</span>。
             我将艺术设计与前沿技术融合，构建通往未来的数字桥梁。
          </p>
          
          <div ref={buttonRef} className="flex flex-wrap justify-center lg:justify-start gap-4">
             <Magnetic>
                <a href="#projects" className="px-8 py-4 bg-white dark:bg-white text-slate-900 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] transition-all duration-300">
                  浏览作品
                </a>
             </Magnetic>
             <Magnetic>
                <a href="#contact" className="px-8 py-4 glass-panel rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300">
                  联系我
                </a>
             </Magnetic>
          </div>
        </div>

        {/* Image / Avatar Area */}
        <div className="lg:w-1/2 flex justify-center z-10 relative">
            <div ref={imageRef} className="relative w-72 h-72 md:w-96 md:h-96">
                {/* Decorative rings */}
                <div className="absolute inset-0 rounded-full border-2 border-neon-blue/30 animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute -inset-4 rounded-full border border-neon-purple/20 animate-[spin_15s_linear_infinite_reverse]"></div>
                
                {/* Main Image Container */}
                <div className="w-full h-full rounded-full overflow-hidden glass-panel p-2 relative group">
                    <div className="w-full h-full rounded-full overflow-hidden relative bg-slate-800">
                        {isGenerating ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20">
                                <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
                                <span className="ml-3 text-xs font-bold text-neon-blue">AI 生成中...</span>
                            </div>
                        ) : null}
                        
                        <img 
                            src={heroImage} 
                            alt="Profile" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Upload Overlay */}
                        <div 
                            onClick={triggerFileInput}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center cursor-pointer z-10"
                        >
                            <i className="fas fa-camera text-2xl text-white mb-2"></i>
                            <span className="text-xs font-bold text-white uppercase tracking-wider">更换照片</span>
                        </div>
                    </div>
                </div>

                {/* Floating decorative elements */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-neon-blue/20 blur-xl rounded-full animate-pulse"></div>
                <div className="absolute bottom-10 -left-10 w-24 h-24 bg-neon-purple/20 blur-xl rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
            />
        </div>

      </div>
    </section>
  );
};

export default Hero;