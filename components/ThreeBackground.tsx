import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import { BackgroundMode } from '../types';

// Fix TypeScript errors for R3F intrinsic elements if needed in environment
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      planeGeometry: any;
      meshBasicMaterial: any;
    }
  }
}

interface ThreeBackgroundProps {
  mode: BackgroundMode;
}

const ParticleField = ({ count = 1500 }: { count?: number }) => {
  const points = useRef<THREE.Points>(null!);

  // Generate random positions
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 15;
      p[i * 3 + 1] = (Math.random() - 0.5) * 15;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, [count]);

  // Generate random 'home' positions for spring-back effect
  const originalPositions = useMemo(() => positions.slice(), [positions]);

  useFrame((state) => {
    if (!points.current) return;
    
    // Mouse interaction in normalized device coordinates (-1 to +1)
    const mouseX = state.pointer.x * 7;
    const mouseY = state.pointer.y * 7;
    
    const positionsArray = points.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      const px = positionsArray[ix];
      const py = positionsArray[iy];
      
      // Original positions
      const ox = originalPositions[ix];
      const oy = originalPositions[iy];
      const oz = originalPositions[iz];

      // Distance to mouse
      const dx = mouseX - px;
      const dy = mouseY - py;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Repulsion force
      if (dist < 3) {
        const force = (3 - dist) * 3; // Strength
        const angle = Math.atan2(dy, dx);
        
        positionsArray[ix] -= Math.cos(angle) * force * 0.02;
        positionsArray[iy] -= Math.sin(angle) * force * 0.02;
      } else {
        // Return to original with gentle sine wave flow
        positionsArray[ix] += (ox - px) * 0.05;
        positionsArray[iy] += (oy - py) * 0.05;
      }

      // Gentle constant floating
      positionsArray[ix] += Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.002;
      positionsArray[iy] += Math.cos(state.clock.elapsedTime * 0.2 + i) * 0.002;
      
      // Reset Z slightly
      positionsArray[iz] = oz + Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.1;
    }
    
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00f3ff"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const RetroGrid = () => {
  const planeRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if(planeRef.current) {
      // Move grid towards camera
      planeRef.current.position.z = (state.clock.elapsedTime * 0.5) % 1;
    }
  });

  return (
    <group rotation={[Math.PI / 2.5, 0, 0]} position={[0, -2, 0]}>
      <mesh ref={planeRef} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20, 40, 40]} />
        <meshBasicMaterial wireframe color="#bc13fe" transparent opacity={0.2} />
      </mesh>
      <mesh position={[0, 0, -10]}>
        <planeGeometry args={[20, 20, 40, 40]} />
        <meshBasicMaterial wireframe color="#00f3ff" transparent opacity={0.1} />
      </mesh>
    </group>
  );
};

const FloatingShapes = () => {
    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Float>
    )
}

const ThreeBackground: React.FC<ThreeBackgroundProps> = ({ mode }) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]}>
        {mode === BackgroundMode.PARTICLES && <ParticleField />}
        {mode === BackgroundMode.GRID && <RetroGrid />}
        {mode === BackgroundMode.STARS && <FloatingShapes />}
      </Canvas>
      {/* Overlay gradient for better text readability - Added transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-transparent to-slate-50/80 dark:from-slate-900/60 dark:via-transparent dark:to-slate-900/90 pointer-events-none transition-colors duration-700 ease-in-out" />
    </div>
  );
};

export default ThreeBackground;