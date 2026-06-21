import React, { useState, useEffect } from "react";
import { loadingHints } from "../data";
import { ShieldCheck, Play, Radio, Volume2, Gamepad } from "lucide-react";

interface LobbyLoaderProps {
  onComplete: () => void;
}

const artworks = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200&h=700", // Gaming desk neon setup
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1200&h=700", // Retro arcade gaming vibe
  "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=1200&h=700"  // Cyberpunk orange room
];

export default function LobbyLoader({ onComplete }: LobbyLoaderProps) {
  const [progress, setProgress] = useState<number>(0);
  const [currentHintIndex, setCurrentHintIndex] = useState<number>(0);
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);

  // Progressive loading simulation
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsDone(true);
          return 100;
        }
        // Random step speeds resembling real GTA files loading
        const randomStep = Math.floor(Math.random() * 8) + 3;
        return Math.min(prev + randomStep, 100);
      });
    }, 120);

    return () => clearInterval(progressInterval);
  }, []);

  // Set rotating text intervals for hints
  useEffect(() => {
    const hintInterval = setInterval(() => {
      setCurrentHintIndex((prev) => (prev + 1) % loadingHints.length);
    }, 3500);

    return () => clearInterval(hintInterval);
  }, []);

  // Slider change for artwork
  useEffect(() => {
    const artInterval = setInterval(() => {
       setCurrentArtworkIndex((prev) => (prev + 1) % artworks.length);
    }, 4500);
    return () => clearInterval(artInterval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#020204] z-50 flex flex-col justify-between overflow-hidden">
      
      {/* Background artwork slider */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
          style={{ 
            backgroundImage: `url(${artworks[currentArtworkIndex]})`,
            filter: "brightness(0.24) contrast(1.1) saturate(0.85)"
          }} 
        />
        {/* Radial vignette mask matching GTA loading colors */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020204] via-transparent to-[#020204]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_20%,rgba(5,5,8,0.95)_90%)]" />
      </div>

      {/* Header element */}
      <header className="relative z-10 p-6 sm:p-10 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded border border-orange-500/20 uppercase">
              Grand RP Server Hub
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tighter">
             KAMMATTIPADAM
          </h1>
          <p className="text-xs font-mono text-slate-400 tracking-wider">
             ESTD 2024 • THE MOST POWERFUL SYNDICATE
          </p>
        </div>

        <div className="hidden md:flex flex-col items-end">
          <span className="text-xs font-mono text-slate-500">CLIENT PROTOCOL</span>
          <span className="text-xs font-mono font-bold text-slate-300">SECURE SHELL V3.41</span>
        </div>
      </header>

      {/* Bottom Content Area */}
      <div className="relative z-10 p-6 sm:p-10 max-w-4xl">
        <div className="relative pl-6 border-l-2 border-orange-500 mb-6 bg-black/40 backdrop-blur-md p-4 rounded-r-xl border border-white/5">
          <span className="text-[10px] uppercase font-mono font-bold text-orange-400 block tracking-widest mb-1">
             LOADING HEIST LOGISTCS & INTEL
          </span>
          <p className="text-sm sm:text-base text-slate-200 transition-all duration-500 leading-relaxed font-sans font-medium">
             "{loadingHints[currentHintIndex]}"
          </p>
        </div>

        {/* Loading Progress Slider */}
        <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex justify-between items-center text-xs font-mono mb-2.5">
            <span className="text-slate-400 font-bold flex items-center gap-2">
              <Gamepad className="w-4 h-4 text-orange-500 animate-pulse" />
              {isDone ? "ALL ASSETS INJECTED" : "INITIALIZING GAMING ENGINE COMPONENTS"}
            </span>
            <span className="text-orange-400 font-extrabold text-sm">{progress}%</span>
          </div>

          {/* Progress bar container */}
          <div className="w-full h-3 bg-black/80 rounded-full border border-white/10 overflow-hidden p-[1.5px]">
            <div 
              className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/5 text-[9.5px] text-slate-500 font-mono">
             <span>MODULES: WEBAUDIO_SYNTH: ACTIVE • WEBGL_DYN: CACHED</span>
             <span>GRAND RP INTEGRATION: STANDBY</span>
          </div>
        </div>

        {/* Enter Portal Active Button */}
        {isDone && (
          <div className="mt-6 flex justify-center sm:justify-start animate-bounce">
            <button
               onClick={onComplete}
               className="px-8 py-4 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-display font-extrabold text-sm rounded-xl tracking-wider shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] transform hover:scale-[1.02] transition duration-200 cursor-pointer flex items-center gap-3 uppercase"
            >
               <Play className="w-4 h-4 fill-white" />
               <span>Join Safe Zone</span>
            </button>
          </div>
        )}
      </div>

      {/* Cinematic footer lines */}
      <footer className="relative z-10 p-6 text-[10px] text-slate-500 font-mono border-t border-white/5 flex justify-between items-center bg-black/60 backdrop-blur-xl">
         <span>KAMMATTIPADAM ORG • ALL ASSETS COMPILE GREEN</span>
         <span>SECURE ENCRYPTED HTTPS CONTAINER</span>
      </footer>
    </div>
  );
}
