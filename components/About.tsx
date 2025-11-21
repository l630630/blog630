import React, { useEffect, useRef } from 'react';
import { EXPERIENCES, SKILLS } from '../constants';

// Access global GSAP and ScrollTrigger loaded via index.html scripts
// This avoids "Failed to load module" errors common with CDN import maps for plugins
const gsap = (window as any).gsap;
const ScrollTrigger = (window as any).ScrollTrigger;

// Register plugin if available
if (gsap && ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

const About: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || !gsap || !ScrollTrigger) return;

    const ctx = gsap.context(() => {
      // Animate Timeline Items
      gsap.utils.toArray('.timeline-item').forEach((item: any, i: number) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
          },
          x: i % 2 === 0 ? -50 : 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out"
        });
      });

      // Animate Skill Bars
      gsap.utils.toArray('.skill-bar-fill').forEach((bar: any) => {
        gsap.fromTo(bar, 
          { width: 0 },
          {
            width: bar.dataset.width,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: bar,
              start: "top 90%"
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={containerRef} className="py-20 relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Experience Column */}
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-heading font-bold mb-10 flex items-center gap-3">
              <i className="fas fa-briefcase text-neon-purple"></i> 工作经历
            </h2>
            
            <div className="relative border-l-2 border-glass-border ml-3 space-y-10 pl-8 pb-8">
              {EXPERIENCES.map((exp) => (
                <div key={exp.id} className="timeline-item relative">
                  <span className="absolute -left-[39px] top-0 w-5 h-5 rounded-full bg-neon-purple border-4 border-slate-50 dark:border-slate-900"></span>
                  <div className="glass-panel p-6 rounded-2xl hover:bg-glass-200 transition-colors duration-300">
                    <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                      <h3 className="text-xl font-bold">{exp.role}</h3>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-neon-purple/20 text-neon-purple">
                        {exp.period}
                      </span>
                    </div>
                    <h4 className="text-slate-500 dark:text-slate-400 mb-3">{exp.company}</h4>
                    <p className="text-sm leading-relaxed opacity-80">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Column */}
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-heading font-bold mb-10 flex items-center gap-3">
              <i className="fas fa-code text-neon-blue"></i> 技能栈
            </h2>
            
            <div className="space-y-6">
              {SKILLS.map((skill) => (
                <div key={skill.name} className="group">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <span className="font-bold" style={{color: skill.color}}>{skill.level}%</span>
                  </div>
                  <div className="h-3 bg-glass-dark rounded-full overflow-hidden">
                    <div 
                      className="skill-bar-fill h-full rounded-full relative"
                      data-width={`${skill.level}%`}
                      style={{ backgroundColor: skill.color }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Extra Info */}
            <div className="mt-12 p-6 glass-panel rounded-2xl border-l-4 border-neon-pink">
              <h3 className="text-xl font-bold mb-3">我的理念</h3>
              <p className="text-sm opacity-80 leading-relaxed">
                我相信最好的数字体验是自然、直观且充满魔力的。通过将技术精准度与艺术表现力相结合，我致力于创造不仅功能强大，而且令人难忘的 Web 体验。
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;