import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

export function RotatingLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for smooth 3D mouse tilting
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for high-end feel
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const rotateXSpring = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateYSpring = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), springConfig);
  const scaleSpring = useSpring(isHovered ? 1.05 : 0.98, springConfig);

  // Mouse move handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalised mouse coordinates (-0.5 to 0.5)
    // Left edge is -0.5, right edge is 0.5
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;
    
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className="w-full h-full min-h-[380px] flex items-center justify-center relative overflow-hidden select-none cursor-pointer"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
      id="rotating-logo-container"
    >
      {/* Dynamic ambient backlighting */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-80 h-80 rounded-full bg-amber-500/10 blur-[100px] animate-pulse duration-[8000ms]" />
        <div className="w-60 h-60 rounded-full bg-orange-500/5 blur-[80px] absolute translate-y-24" />
      </div>

      {/* Grid Floor Perspective Line Accents */}
      <div className="absolute bottom-0 inset-x-0 h-28 pointer-events-none opacity-20 border-t border-slate-350/20 bg-gradient-to-t from-slate-200/5 to-transparent z-0 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="10" y1="100" x2="35" y2="0" stroke="currentColor" strokeWidth="0.2" className="text-slate-400" />
          <line x1="30" y1="100" x2="45" y2="0" stroke="currentColor" strokeWidth="0.2" className="text-slate-400" />
          <line x1="50" y1="100" x2="50" y2="0" stroke="currentColor" strokeWidth="0.2" className="text-slate-400" />
          <line x1="70" y1="100" x2="55" y2="0" stroke="currentColor" strokeWidth="0.2" className="text-slate-400" />
          <line x1="90" y1="100" x2="65" y2="0" stroke="currentColor" strokeWidth="0.2" className="text-slate-400" />
        </svg>
      </div>

      {/* 3D Transform Object Wrapper */}
      <motion.div
        className="w-full max-w-[420px] aspect-square flex items-center justify-center relative z-10 p-4"
        style={{
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          scale: scaleSpring,
          transformStyle: "preserve-3d",
        }}
        animate={!isHovered ? {
          y: [0, -8, 0],
          rotateY: [0, 8, -8, 0],
        } : { y: 0 }}
        transition={{
          repeat: Infinity,
          duration: 7,
          ease: "easeInOut",
        }}
      >
        <svg 
          viewBox="0 0 500 500" 
          className="w-full h-full drop-shadow-[0_25px_40px_rgba(15,23,42,0.12)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Spotlight cone subtle translucent fading gradient */}
            <linearGradient id="spotlightCone" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f1f5f9" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#f8fafc" stopOpacity="0.0" />
            </linearGradient>

            {/* Subtle glow for the yellow text */}
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Behind Spotlight Beam / Cone of Light (just like the original design) */}
          <polygon 
            points="120,105 380,105 272,490 228,490"
            fill="url(#spotlightCone)"
            style={{ mixBlendMode: "multiply", transformStyle: "preserve-3d", transform: "translateZ(-15px)" }}
            className="transition-all duration-300"
          />

          {/* 2. Dust/Air particles shimmering in the ray of light */}
          <g style={{ transform: "translateZ(-5px)" }}>
            <circle cx="210" cy="220" r="2" fill="#e2e8f0" opacity="0.4" className="animate-pulse" />
            <circle cx="290" cy="180" r="1.5" fill="#e2e8f0" opacity="0.6" className="animate-pulse duration-1000" />
            <circle cx="240" cy="340" r="2.5" fill="#e2e8f0" opacity="0.3" className="animate-pulse duration-3000" />
            <circle cx="265" cy="270" r="1.5" fill="#cbd5e1" opacity="0.7" className="animate-pulse duration-700" />
            <circle cx="180" cy="400" r="2" fill="#e2e8f0" opacity="0.4" className="animate-pulse duration-[4000ms]" />
            <circle cx="320" cy="310" r="2" fill="#cbd5e1" opacity="0.5" className="animate-pulse duration-1500" />
          </g>

          {/* 3. The 3D Extruded Text Shadow (Black athletic block style layers) */}
          {/* We repeat the text offsets to form an authentic, physical, hard 3D bevel/shadow block */}
          {Array.from({ length: 14 }).map((_, i) => {
            const opacity = 1 - (i / 14) * 0.7; // fade the outline slightly
            const dy = 1 + i * 1.5;
            const dx = -i * 0.4;
            return (
              <text
                key={i}
                x={250 + dx}
                y={100 + dy}
                textAnchor="middle"
                className="font-display font-extrabold select-none"
                style={{
                  fontSize: "39px",
                  fontWeight: 900,
                  fill: "#000000",
                  letterSpacing: "-0.5px",
                  opacity: opacity,
                  transformStyle: "preserve-3d",
                  transform: `translateZ(${-i}px)`,
                }}
              >
                KAMMATTIPADAM
              </text>
            );
          })}

          {/* 4. Super Premium Yellow Top Face Text with clean stroke */}
          <text
            x="250"
            y="100"
            textAnchor="middle"
            filter="url(#softGlow)"
            className="font-display font-extrabold select-none"
            style={{
              fontSize: "39px",
              fontWeight: 900,
              fill: "#ffff00", // Vibrant Neon Yellow
              stroke: "#000000",
              strokeWidth: "2.5",
              strokeLinejoin: "miter",
              letterSpacing: "-0.5px",
              transformStyle: "preserve-3d",
              transform: "translateZ(10px)",
            }}
          >
            KAMMATTIPADAM
          </text>
        </svg>

        {/* Outer 3D floating badge glow */}
        <div 
          className="absolute inset-0 border border-amber-500/10 rounded-full pointer-events-none scale-90 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.35 : 0.15,
            background: "radial-gradient(circle, rgba(245,158,11,0.04) 0%, rgba(255,255,255,0) 70%)",
            transform: "translateZ(-20px) scale(0.95)"
          }}
        />
      </motion.div>

      {/* Floating Interactive 3D HUD compass details on margins */}
      <div className="absolute top-4 right-4 text-[9px] font-mono text-slate-500 pointer-events-none flex flex-col gap-1 items-end z-10">
        <span>GRID_ROTY: {isHovered ? "MANUAL_AXIS" : "AUTOROT_Y"}</span>
        <div className="flex gap-1 items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span>3D VECTOR CORE</span>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-4 text-[9px] font-mono text-slate-500 pointer-events-none flex flex-col gap-1 z-10">
        <span>PERSPECTIVE: 1200PX</span>
        <span>HUD_SCALE: {(1 + (isHovered ? 0.05 : -0.02)).toFixed(2)}x</span>
      </div>
    </div>
  );
}
