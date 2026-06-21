import React, { useState, useEffect, useRef } from "react";
import { Play, Square, Volume2, VolumeX, Radio } from "lucide-react";

export default function AudioEngine() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.3);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mainGainRef = useRef<GainNode | null>(null);
  const bassTimerRef = useRef<number | null>(null);
  const arpTimerRef = useRef<number | null>(null);

  // Stop dynamic loops
  const stopSynth = () => {
    if (bassTimerRef.current) {
      window.clearInterval(bassTimerRef.current);
      bassTimerRef.current = null;
    }
    if (arpTimerRef.current) {
      window.clearInterval(arpTimerRef.current);
      arpTimerRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  // Start synthwave looping audio sequencer
  const startSynth = () => {
    try {
      // Create new AudioContext
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      // Master output volume gain
      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(volume, ctx.currentTime);
      mainGain.connect(ctx.destination);
      mainGainRef.current = mainGain;

      setIsPlaying(true);

      const notes = [110, 110, 130, 130, 98, 98, 146, 146]; // Bassline frequency map (A, C, G, D)
      let currentBassStep = 0;

      // 1. Cyber Synth Bassline Loop (140 BPM)
      const bassInterval = (60 / 140) * 1000 * 0.5; // Eighth note interval
      
      bassTimerRef.current = window.setInterval(() => {
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed") return;
        const now = audioCtxRef.current.currentTime;
        
        // Custom simple synthesizer voice for bass
        const osc = audioCtxRef.current.createOscillator();
        const oscGain = audioCtxRef.current.createGain();
        
        osc.type = "sawtooth";
        const hz = notes[currentBassStep % notes.length];
        osc.frequency.setValueAtTime(hz, now);
        
        // Add subtle pitch glide for synthwave flavor
        osc.frequency.exponentialRampToValueAtTime(hz * 0.5, now + 0.35);

        // Lowpass filter for warm cyber rumble
        const filter = audioCtxRef.current.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(320, now);

        oscGain.gain.setValueAtTime(0.08, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(mainGainRef.current!);
        
        osc.start(now);
        osc.stop(now + 0.32);

        currentBassStep++;
      }, bassInterval);


      // 2. Neon Melodic Arpeggiator Loop
      const arpHZ = [440, 523.25, 587.33, 659.25, 783.99, 880]; // Pentatonic notes in A minor
      let currentArpStep = 0;
      const arpInterval = (60 / 140) * 1000; // Quarter note

      arpTimerRef.current = window.setInterval(() => {
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed") return;
        const now = audioCtxRef.current.currentTime;

        // Skip random beats to build a dynamic syncopated gaming melody
        if (Math.random() > 0.65) return;

        const osc = audioCtxRef.current.createOscillator();
        const oscGain = audioCtxRef.current.createGain();

        osc.type = "square";
        const baseHz = arpHZ[currentArpStep % arpHZ.length];
        osc.frequency.setValueAtTime(baseHz, now);

        // Subtly pan melody notes left & right
        const pan = audioCtxRef.current.createStererPanner ? audioCtxRef.current.createStererPanner() : null;

        oscGain.gain.setValueAtTime(0.02, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

        // Delay echo effect
        const delay = audioCtxRef.current.createDelay();
        delay.delayTime.setValueAtTime(0.24, now);
        const feedback = audioCtxRef.current.createGain();
        feedback.gain.setValueAtTime(0.3, now);

        if (pan) {
          pan.pan.setValueAtTime((Math.random() * 2) - 1, now);
          osc.connect(pan);
          pan.connect(oscGain);
        } else {
          osc.connect(oscGain);
        }

        oscGain.connect(mainGainRef.current!);
        
        // Simple echo routing
        oscGain.connect(delay);
        delay.connect(feedback);
        feedback.connect(mainGainRef.current!);

        osc.start(now);
        osc.stop(now + 0.6);

        currentArpStep++;
      }, arpInterval);

    } catch (e) {
      console.error("Audio Synthesis Sandbox Failed:", e);
    }
  };

  // Adjust volume dynamically
  useEffect(() => {
    if (mainGainRef.current && audioCtxRef.current) {
      mainGainRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (bassTimerRef.current) window.clearInterval(bassTimerRef.current);
      if (arpTimerRef.current) window.clearInterval(arpTimerRef.current);
    };
  }, []);

  const handleToggle = () => {
    if (isPlaying) {
      stopSynth();
    } else {
      startSynth();
    }
  };

  return (
    <div className="flex items-center gap-3 bg-[#0a0a14] border border-white/10 px-4 py-2.5 rounded-2xl shadow-lg relative overflow-hidden">
      {/* Background neon strip */}
      <div className={`absolute top-0 left-0 h-[2px] bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-500 ${isPlaying ? 'w-full' : 'w-0'}`} />

      <div className="flex items-center gap-2">
        <button
          id="audio-toggle-btn"
          onClick={handleToggle}
          className={`w-9 h-9 flex items-center justify-center rounded-xl transition cursor-pointer ${
            isPlaying 
              ? "bg-gradient-to-br from-red-600 to-amber-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse" 
              : "bg-white/5 text-slate-400 hover:text-slate-100 hover:bg-white/10"
          }`}
          title={isPlaying ? "Mute Background Soundtrack" : "Play GTA Cyber Bass Soundtrack"}
        >
          {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <div className="hidden sm:block">
          <p className="text-[10px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Radio className={`w-3 h-3 ${isPlaying ? 'text-red-500 animate-spin' : 'text-slate-600'}`} />
            SYNTH SOUNDTRACK
          </p>
          <p className="text-[9px] font-mono text-slate-500 uppercase">
            {isPlaying ? "Live Procedural Synthwave 140BPM" : "Soundtrack Offline"}
          </p>
        </div>
      </div>

      {isPlaying && (
        <div className="flex items-center gap-2 border-l border-white/5 pl-3">
          <span className="text-[9px] font-mono text-slate-500">GAIN</span>
          <input
            id="volume-slider"
            type="range"
            min="0"
            max="0.6"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>
      )}
    </div>
  );
}
