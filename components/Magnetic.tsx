import React, { useEffect, useRef } from 'react';

// Access global GSAP
const gsap = (window as any).gsap;

interface MagneticProps {
  children: React.ReactElement;
  className?: string;
}

const Magnetic: React.FC<MagneticProps> = ({ children, className = "" }) => {
  // Changed from HTMLDivElement to HTMLElement to support various child elements like <a> and <button>
  const magnetic = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!gsap || !magnetic.current) return;

    const xTo = gsap.quickTo(magnetic.current, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(magnetic.current, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const mouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      if (!magnetic.current) return;

      const { height, width, left, top } = magnetic.current.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      
      // Move with a factor to keep it subtle
      xTo(x * 0.35);
      yTo(y * 0.35);
    };

    const mouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    const element = magnetic.current;
    element.addEventListener("mousemove", mouseMove);
    element.addEventListener("mouseleave", mouseLeave);

    return () => {
      element.removeEventListener("mousemove", mouseMove);
      element.removeEventListener("mouseleave", mouseLeave);
    };
  }, []);

  // Fix: Cast children to any to allow ref injection and accessing className on unknown props
  const child = children as React.ReactElement<any>;

  return React.cloneElement(child, { 
    ref: magnetic, 
    className: `${child.props.className || ''} ${className}`.trim()
  });
};

export default Magnetic;