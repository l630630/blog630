import React from 'react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 relative z-10">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="glass-panel rounded-3xl p-8 md:p-16 text-center border border-glass-border shadow-2xl relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent"></div>
          
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">让我们共同创造 <br/><span className="text-gradient">非凡体验</span></h2>
          <p className="text-lg opacity-70 mb-10 max-w-2xl mx-auto">
            目前我接受自由职业项目委托和全职工作机会。
            无论您是有项目咨询还是仅仅想打个招呼，我都会尽快回复您！
          </p>
          
          <a 
            href="mailto:hello@lumina.dev"
            className="inline-block px-10 py-4 bg-gradient-to-r from-neon-purple to-neon-pink text-white rounded-full font-bold text-lg shadow-lg hover:shadow-[0_0_30px_rgba(255,0,85,0.4)] hover:scale-105 transition-all duration-300"
          >
            发送邮件 <i className="fas fa-paper-plane ml-2"></i>
          </a>

          <div className="mt-12 flex justify-center gap-6">
            {['twitter', 'github', 'linkedin', 'dribbble'].map((social) => (
              <a 
                key={social} 
                href="#" 
                className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-xl hover:bg-white hover:text-slate-900 transition-all duration-300 hover:-translate-y-1"
              >
                <i className={`fab fa-${social}`}></i>
              </a>
            ))}
          </div>
        </div>
        
        <footer className="mt-20 text-center opacity-40 text-sm">
          <p>&copy; {new Date().getFullYear()} Lumina Portfolio. 使用 React, Three.js & GSAP 构建。</p>
        </footer>
      </div>
    </section>
  );
};

export default Contact;