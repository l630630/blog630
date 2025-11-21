import React from 'react';
import { PROJECTS } from '../constants';

const ProjectCard: React.FC<{ project: any }> = ({ project }) => {
  // Simple vanilla JS tilt logic on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg tilt
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  };

  return (
    <div 
      className="glass-panel rounded-2xl overflow-hidden transition-transform duration-200 ease-out will-change-transform group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60"></div>
        <span className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white">
          {project.category}
        </span>
      </div>
      
      <div className="p-6 relative z-10 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm h-full">
        <h3 className="text-2xl font-heading font-bold mb-2 group-hover:text-neon-blue transition-colors">
          {project.title}
        </h3>
        <p className="text-sm opacity-70 mb-4 line-clamp-2">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((tech: string) => (
            <span key={tech} className="text-xs text-neon-purple font-medium">#{tech}</span>
          ))}
        </div>

        <a 
          href={project.link}
          className="inline-flex items-center gap-2 text-sm font-bold hover:text-neon-pink transition-colors"
        >
          查看项目 <i className="fas fa-arrow-right text-xs"></i>
        </a>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-20 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            精选 <span className="text-gradient">作品</span>
          </h2>
          <p className="text-lg opacity-60 max-w-2xl mx-auto">
            一系列交互式实验和生产级应用程序展示。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;