import { Project, BlogPost, Experience, Skill } from './types';

export const EXPERIENCES: Experience[] = [
  {
    id: 1,
    role: "高级前端工程师",
    company: "Tech Nova Inc.",
    period: "2021 - 至今",
    description: "主导前端架构向 React 18 迁移，实施设计系统，并将核心 Web 指标（Core Web Vitals）优化了 40%。"
  },
  {
    id: 2,
    role: "全栈开发工程师",
    company: "Creative Solutions",
    period: "2018 - 2021",
    description: "使用 WebGL 和 Vue.js 开发交互式营销活动页面。负责管理 AWS 基础设施以应对高流量活动。"
  },
  {
    id: 3,
    role: "UI/UX 设计师 & 开发者",
    company: "自由职业",
    period: "2016 - 2018",
    description: "为初创公司打造定制化网站，专注于独特的交互体验和品牌识别度建设。"
  }
];

export const SKILLS: Skill[] = [
  { name: "React / Next.js", level: 95, color: "#00f3ff" },
  { name: "TypeScript", level: 90, color: "#3178c6" },
  { name: "Three.js / WebGL", level: 75, color: "#bc13fe" },
  { name: "Node.js", level: 85, color: "#6cc24a" },
  { name: "UI/UX 设计", level: 80, color: "#ff0055" }
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Nebula 数据看板",
    category: "SaaS 平台",
    image: "https://picsum.photos/800/600?random=1",
    description: "一个实时分析仪表盘，使用 WebGL 数据地图可视化加密货币趋势。",
    technologies: ["React", "D3.js", "Three.js", "Tailwind"],
    link: "#"
  },
  {
    id: 2,
    title: "沉浸式 XR 电商",
    category: "购物体验",
    image: "https://picsum.photos/800/600?random=2",
    description: "沉浸式购物体验，允许用户直接在浏览器中通过 AR 查看产品。",
    technologies: ["WebXR", "React Three Fiber", "Node.js"],
    link: "#"
  },
  {
    id: 3,
    title: "Zen 任务管理器",
    category: "生产力工具",
    image: "https://picsum.photos/800/600?random=3",
    description: "极简主义任务管理器，采用玻璃拟态界面并集成了专注音效。",
    technologies: ["Vue 3", "Firebase", "Howler.js"],
    link: "#"
  },
  {
    id: 4,
    title: "赛博朋克作品集",
    category: "网页设计",
    image: "https://picsum.photos/800/600?random=4",
    description: "我个人作品集的上一代版本，探索了霓虹美学和故障艺术效果。",
    technologies: ["HTML5", "GSAP", "SCSS"],
    link: "#"
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "精通 Web 3D 开发",
    excerpt: "深入探讨 React Three Fiber 以及如何针对低端设备优化 WebGL 性能。",
    date: "2023年10月12日",
    readTime: "5 分钟阅读",
    tags: ["WebGL", "性能优化"],
    image: "https://picsum.photos/600/400?random=10"
  },
  {
    id: 2,
    title: "玻璃拟态的未来",
    excerpt: "为什么毛玻璃美学将持续流行，以及如何以无障碍的方式实现它。",
    date: "2023年9月28日",
    readTime: "4 分钟阅读",
    tags: ["设计", "CSS"],
    image: "https://picsum.photos/600/400?random=11"
  },
  {
    id: 3,
    title: "GSAP ScrollTrigger 秘籍",
    excerpt: "无需阻塞主线程即可创建屡获殊荣的滚动交互动画。",
    date: "2023年8月15日",
    readTime: "7 分钟阅读",
    tags: ["动画", "GSAP"],
    image: "https://picsum.photos/600/400?random=12"
  }
];