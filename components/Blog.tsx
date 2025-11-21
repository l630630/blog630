import React from 'react';
import { BLOG_POSTS } from '../constants';

const Blog: React.FC = () => {
  return (
    <section id="blog" className="py-20 relative z-10 bg-slate-100/50 dark:bg-slate-900/30 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-heading font-bold mb-12 text-center">最新 <span className="text-neon-pink">思考</span></h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article key={post.id} className="glass-panel p-1 rounded-2xl hover:shadow-[0_0_20px_rgba(188,19,254,0.2)] transition-all duration-300 hover:-translate-y-2">
              <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden h-full flex flex-col">
                <div className="h-48 overflow-hidden relative">
                   <img src={post.image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                   <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                     <div className="text-xs font-bold mb-1 opacity-80">{post.date} • {post.readTime}</div>
                   </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-3 hover:text-neon-purple transition-colors cursor-pointer">{post.title}</h3>
                  <p className="text-sm opacity-70 mb-4 flex-1">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {post.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 text-[10px] uppercase font-bold tracking-wide rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;