import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export function CircuitSimulation() {
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(4);
  const [isPlaying, setIsPlaying] = useState(true);

  const current = voltage / resistance;
  const electronSpeed = current * 0.5; // Visual scaling factor

  // Generate electrons along the path
  const pathLength = 800; // rough perimeter
  const numElectrons = 20;

  return (
    <div className="bg-white rounded-3xl border border-nat-border shadow-inner relative flex flex-col overflow-hidden w-full">
      <div className="absolute top-8 left-8 z-10 pointer-events-none">
        <h3 className="text-xl font-serif italic text-nat-dark leading-tight">Interactive Lab: Ohm's Law</h3>
        <p className="text-xs text-nat-muted mt-1">Explore the relationship between V, I, and R.</p>
      </div>

      <div className="relative flex-1 min-h-[350px] flex items-center justify-center bg-[#fdfcf9]">
        <div className="relative w-full max-w-md aspect-video">
          <svg width="100%" height="100%" viewBox="0 0 400 200" className="opacity-80">
            {/* Circuit Wire */}
            <rect x="50" y="50" width="300" height="100" fill="none" stroke="#d5d2c9" strokeWidth="6" rx="10" />
            
            {/* Battery */}
            <g transform="translate(180, 40)">
              <rect x="0" y="0" width="40" height="20" fill="#fdfcf9" />
              <line x1="10" y1="-10" x2="10" y2="30" stroke="#4a4a40" strokeWidth="4" />
              <line x1="20" y1="0" x2="20" y2="20" stroke="#4a4a40" strokeWidth="8" />
              <line x1="30" y1="-10" x2="30" y2="30" stroke="#4a4a40" strokeWidth="4" />
              <line x1="40" y1="0" x2="40" y2="20" stroke="#4a4a40" strokeWidth="8" />
              <text x="25" y="-15" fontSize="14" fill="#4a4a40" textAnchor="middle" fontWeight="bold">{voltage}V</text>
              <text x="0" y="-15" fontSize="14" fill="#e11d48" fontWeight="bold">+</text>
              <text x="45" y="-15" fontSize="14" fill="#4a4a40" fontWeight="bold">-</text>
            </g>

            {/* Resistor */}
            <g transform="translate(150, 140)">
              <rect x="0" y="-10" width="100" height="20" fill="#fdfcf9" />
              <path d="M 0 10 L 10 0 L 20 20 L 30 0 L 40 20 L 50 0 L 60 20 L 70 0 L 80 20 L 90 0 L 100 10" fill="none" stroke="#c27a56" strokeWidth="4" strokeLinejoin="bevel" />
              <text x="50" y="40" fontSize="14" fill="#a05a36" textAnchor="middle" fontWeight="bold">{resistance} Ω</text>
            </g>

            {/* Ammeter */}
            <g transform="translate(350, 100)">
               <circle cx="0" cy="0" r="20" fill="#eff0e8" stroke="#8c9c75" strokeWidth="4" />
               <text x="0" y="5" fontSize="14" fill="#5a5a40" textAnchor="middle" fontWeight="bold">A</text>
               <text x="30" y="5" fontSize="14" fill="#8c9c75" fontWeight="bold">{current.toFixed(1)}A</text>
            </g>

          </svg>

          {/* Electrons Animation overlay */}
          {isPlaying && current > 0 && Array.from({length: numElectrons}).map((_, i) => (
             <motion.div
               key={i}
               className="absolute w-3 h-3 bg-nat-secondary rounded-full border-2 border-white shadow-sm"
               style={{ 
                 top: 0, 
                 left: 0, 
                 transformOrigin: 'center center',
                 offsetPath: `path('M 65 65 L 365 65 L 365 165 L 65 165 Z')`,
                 position: 'absolute'
               } as any}
               initial={{ offsetDistance: `${(i / numElectrons) * 100}%` }}
               animate={{ offsetDistance: [`${(i / numElectrons) * 100}%`, `${((i / numElectrons) * 100) + 100}%`] }}
               transition={{ 
                 duration: 10 / electronSpeed, 
                 ease: "linear", 
                 repeat: Infinity
               }}
             />
          ))}
        </div>
      </div>

      <div className="bg-nat-light border-t border-nat-border flex flex-col md:flex-row items-center p-6 md:px-10 gap-8 shrink-0">
        <div className="flex-1 w-full flex gap-8">
          <div className="flex-1 flex flex-col gap-3 bg-white p-4 rounded-xl border border-nat-border shadow-sm">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold uppercase tracking-widest text-nat-dark opacity-70">Voltage (V)</label>
              <span className="text-xs font-mono font-bold text-nat-primary">{voltage} V</span>
            </div>
            <input 
              type="range" 
              min="1" max="24" step="1" 
              value={voltage} 
              onChange={(e) => setVoltage(Number(e.target.value))}
              className="w-full accent-nat-primary cursor-pointer h-1.5"
            />
          </div>
          <div className="flex-1 flex flex-col gap-3 bg-white p-4 rounded-xl border border-nat-border shadow-sm">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold uppercase tracking-widest text-nat-dark opacity-70">Resistance (R)</label>
              <span className="text-xs font-mono font-bold text-nat-primary">{resistance} Ω</span>
            </div>
            <input 
              type="range" 
              min="1" max="24" step="1" 
              value={resistance} 
              onChange={(e) => setResistance(Number(e.target.value))}
              className="w-full accent-nat-primary cursor-pointer h-1.5"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
          <div className="flex gap-4 mx-4 text-[10px] uppercase font-bold text-nat-muted tracking-wide text-right">
            <div>
              <div className="mb-0.5">Current (I)</div>
              <div className="font-mono text-nat-primary text-lg">{current.toFixed(1)} A</div>
            </div>
          </div>

          {isPlaying ? (
            <button onClick={() => setIsPlaying(false)} className="px-6 py-3 bg-[#c27a56] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#a05a36] transition-colors">
              Pause
            </button>
          ) : (
            <button onClick={() => setIsPlaying(true)} className="px-6 py-3 bg-nat-primary text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-nat-primary-hover transition-colors">
              Run
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
