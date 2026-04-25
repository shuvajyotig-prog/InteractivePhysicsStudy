import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlaySquare, Activity, Compass, Zap, Eye, Magnet, Repeat } from 'lucide-react';
import { cn } from '../lib/utils';

interface OtherSimulationsProps {
  topicId: string;
}

export function OtherSimulations({ topicId }: OtherSimulationsProps) {
  // Normalize topic ID
  const map: Record<string, string> = {
    'force': 'dynamics',
    'laws-of-motion': 'dynamics',
    'gravitation': 'gravitation',
    'gravitation-11': 'gravitation',
    'work-energy': 'workEnergy',
    'work-energy-power': 'workEnergy',
    'human-eye': 'eye',
    'magnetic-effects': 'magnetism',
    'magnetism': 'magnetism',
    'electrostatics': 'electrostatics',
  };
  
  const simulationType = map[topicId] || 'dynamics';

  if (simulationType === 'dynamics') {
    return <DynamicsSimulation />;
  }
  if (simulationType === 'gravitation') {
    return <GravitationSimulation />;
  }
  if (simulationType === 'workEnergy') {
    return <WorkEnergySimulation />;
  }
  if (simulationType === 'eye') {
    return <EyeSimulation />;
  }
  if (simulationType === 'magnetism') {
    return <MagnetismSimulation />;
  }
  if (simulationType === 'electrostatics') {
    return <ElectrostaticsSimulation />;
  }

  return <div>Lab not found.</div>;
}

function DynamicsSimulation() {
  const [mass, setMass] = useState(5);
  const [force, setForce] = useState(20);
  const [friction, setFriction] = useState(5);
  
  const netForce = force - friction;
  const acceleration = netForce > 0 ? netForce / mass : 0;

  return (
    <div className="bg-white rounded-3xl border border-nat-border shadow-inner p-6">
      <h3 className="text-xl font-bold font-serif italic mb-4">Newton's Second Law</h3>
      <div className="bg-nat-light h-48 rounded-xl relative overflow-hidden mb-6 border border-nat-border flex items-end">
        <motion.div 
          className="w-16 h-16 bg-blue-500 rounded border-2 border-blue-700 flex items-center justify-center text-white font-bold mb-8 z-10"
          animate={acceleration > 0 ? { x: [0, 500] } : { x: 0 }}
          transition={{ duration: acceleration > 0 ? 10 / acceleration : 0, ease: "easeIn", repeat: Infinity }}
        >
          {mass} kg
        </motion.div>
        
        {/* Surface */}
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gray-300" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase mb-2">Mass ({mass} kg)</label>
          <input type="range" min="1" max="20" value={mass} onChange={e => setMass(Number(e.target.value))} className="w-full accent-nat-primary" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase mb-2">Push Force ({force} N)</label>
          <input type="range" min="0" max="50" value={force} onChange={e => setForce(Number(e.target.value))} className="w-full accent-nat-primary" />
        </div>
         <div>
          <label className="block text-xs font-bold uppercase mb-2">Friction ({friction} N)</label>
          <input type="range" min="0" max="25" value={friction} onChange={e => setFriction(Number(e.target.value))} className="w-full accent-nat-primary" />
        </div>
      </div>
      
      <div className="mt-6 bg-nat-panel p-4 rounded-xl flex gap-6 text-sm font-mono">
        <div>Net Force: <span className="font-bold text-nat-primary">{netForce} N</span></div>
        <div>Acceleration: <span className="font-bold text-nat-primary">{acceleration.toFixed(2)} m/s²</span></div>
      </div>
    </div>
  );
}

function GravitationSimulation() {
  const [mass1, setMass1] = useState(1);
  const [mass2, setMass2] = useState(10);
  const [distance, setDistance] = useState(2);
  
  const force = (mass1 * mass2) / Math.pow(distance, 2);

  return (
    <div className="bg-white rounded-3xl border border-nat-border shadow-inner p-6">
      <h3 className="text-xl font-bold font-serif italic mb-4">Universal Gravitation</h3>
      <div className="bg-slate-900 h-48 rounded-xl relative overflow-hidden mb-6 flex items-center justify-center gap-4">
        <div 
          className="rounded-full bg-blue-400 opacity-80 transition-all flex items-center justify-center text-xs font-bold"
          style={{ width: 20 + mass1 * 5, height: 20 + mass1 * 5 }}
        >
          m1
        </div>
        
        {/* Distance representation */}
        <div className="h-0.5 bg-white/20 transition-all flex items-center justify-center text-white/50 text-xs" style={{ width: distance * 50 }}>
          {distance}r
        </div>

        <div 
          className="rounded-full bg-orange-400 opacity-80 transition-all flex items-center justify-center text-xs font-bold text-white shadow-[0_0_15px_rgba(251,146,60,0.5)]"
          style={{ width: 20 + mass2 * 2, height: 20 + mass2 * 2 }}
        >
          m2
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase mb-2">Mass 1 ({mass1} M)</label>
          <input type="range" min="1" max="10" value={mass1} onChange={e => setMass1(Number(e.target.value))} className="w-full accent-nat-primary" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase mb-2">Mass 2 ({mass2} M)</label>
          <input type="range" min="1" max="20" value={mass2} onChange={e => setMass2(Number(e.target.value))} className="w-full accent-nat-primary" />
        </div>
         <div>
          <label className="block text-xs font-bold uppercase mb-2">Distance ({distance} r)</label>
          <input type="range" min="1" max="5" value={distance} onChange={e => setDistance(Number(e.target.value))} className="w-full accent-nat-primary" />
        </div>
      </div>
      
      <div className="mt-6 bg-nat-panel p-4 rounded-xl text-sm font-mono flex items-center justify-between">
        <div>Relative Force: <span className="font-bold text-nat-primary">{force.toFixed(2)} F</span></div>
        <div className="text-xs text-nat-muted max-w-[200px]">Notice how increasing distance rapidly drops the force due to the inverse square law!</div>
      </div>
    </div>
  );
}

function WorkEnergySimulation() {
  const [height, setHeight] = useState(10);
  const [mass, setMass] = useState(2);
  const g = 9.8;
  const potentialEnergy = mass * g * height;

  return (
    <div className="bg-white rounded-3xl border border-nat-border shadow-inner p-6">
      <h3 className="text-xl font-bold font-serif italic mb-4">Conservation of Energy</h3>
      <div className="bg-sky-50 h-48 rounded-xl relative overflow-hidden mb-6 border border-nat-border">
        {/* Ground */}
        <div className="absolute bottom-0 left-0 w-full h-8 bg-green-200 border-t-2 border-green-300" />
        
        {/* Ball */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-red-500 shadow-md transition-all duration-300 ease-in-out"
          style={{ bottom: 32 + (height * 10) }}
        />
        
        {/* Height indicator */}
        <div 
          className="absolute left-1/2 translate-x-8 border-l border-dashed border-gray-400 transition-all flex items-center pl-2 text-xs text-gray-500 font-mono"
          style={{ bottom: 32, height: height * 10 }}
        >
          {height}m
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase mb-2">Height (h = {height} m)</label>
          <input type="range" min="0" max="15" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full accent-nat-primary" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase mb-2">Mass (m = {mass} kg)</label>
          <input type="range" min="1" max="10" value={mass} onChange={e => setMass(Number(e.target.value))} className="w-full accent-nat-primary" />
        </div>
      </div>
      
      <div className="mt-6 flex gap-4">
        <div className="flex-1 bg-blue-50 p-4 rounded-xl border border-blue-100">
          <div className="text-xs uppercase tracking-widest font-bold text-blue-800 mb-1">Potential Energy (Max)</div>
          <div className="text-lg font-mono font-bold text-blue-600">{potentialEnergy.toFixed(1)} J</div>
        </div>
        <div className="flex-1 bg-orange-50 p-4 rounded-xl border border-orange-100">
          <div className="text-xs uppercase tracking-widest font-bold text-orange-800 mb-1">Kinetic Energy (At Impact)</div>
          <div className="text-lg font-mono font-bold text-orange-600">{potentialEnergy.toFixed(1)} J</div>
        </div>
      </div>
    </div>
  );
}

function EyeSimulation() {
  const [defect, setDefect] = useState<'normal' | 'myopia' | 'hypermetropia'>('normal');
  const [correction, setCorrection] = useState(false);

  return (
    <div className="bg-white rounded-3xl border border-nat-border shadow-inner p-6">
      <h3 className="text-xl font-bold font-serif italic mb-4">Human Eye Defect Simulator</h3>
      
      <div className="bg-rose-50 h-64 rounded-xl relative overflow-hidden mb-6 border border-nat-border flex items-center justify-center">
         <svg viewBox="0 0 400 200" className="w-full h-full max-w-lg">
           {/* Light source */}
           <circle cx="20" cy="100" r="5" fill="#f59e0b" />
           
           {/* Rays entering eye */}
           <path d="M 20 100 L 150 70 M 20 100 L 150 100 M 20 100 L 150 130" stroke="#fcd34d" strokeWidth="2" fill="none" />
           
           {/* Correction Lens */}
           {correction && defect === 'myopia' && (
             <path d="M 130 60 Q 140 100 130 140 L 140 140 Q 130 100 140 60 Z" fill="rgba(100,200,255,0.4)" stroke="#38bdf8" strokeWidth="1" />
           )}
           {correction && defect === 'hypermetropia' && (
             <path d="M 135 60 Q 150 100 135 140 Q 120 100 135 60 Z" fill="rgba(100,200,255,0.4)" stroke="#38bdf8" strokeWidth="1" />
           )}

           {/* Eye shape */}
           <path d="M 150 40 C 250 -20, 350 -20, 350 100 C 350 220, 250 220, 150 160 C 120 130, 120 70, 150 40 Z" fill="#ffe4e6" stroke="#fb7185" strokeWidth="3" />
           
           {/* Eye Lens */}
           <ellipse cx="160" cy="100" rx="8" ry="30" fill="#fda4af" />
           
           {/* Retina */}
           <path d="M 320 40 Q 360 100 320 160" fill="none" stroke="#e11d48" strokeWidth="4" />
           
           {/* Refracted Rays inside eye */}
           {!correction && defect === 'normal' && (
             <path d="M 160 70 L 340 100 M 160 100 L 340 100 M 160 130 L 340 100" stroke="#f59e0b" strokeWidth="2" fill="none" />
           )}
           {!correction && defect === 'myopia' && (
             <path d="M 160 70 L 260 100 L 340 140 M 160 100 L 260 100 L 340 100 M 160 130 L 260 100 L 340 60" stroke="#f59e0b" strokeWidth="2" fill="none" />
           )}
           {!correction && defect === 'hypermetropia' && (
             <path d="M 160 70 L 380 100 M 160 100 L 380 100 M 160 130 L 380 100" stroke="#f59e0b" strokeWidth="2" fill="none" />
           )}
           
           {/* Corrected Rays */}
           {correction && (
             <path d="M 160 70 L 340 100 M 160 100 L 340 100 M 160 130 L 340 100" stroke="#10b981" strokeWidth="2" fill="none" />
           )}
         </svg>
      </div>

      <div className="flex gap-4">
        <select 
          value={defect} 
          onChange={(e) => { setDefect(e.target.value as any); setCorrection(false); }}
          className="flex-1 bg-nat-light border border-nat-border rounded-xl px-4 py-3 font-bold text-sm"
        >
          <option value="normal">Normal Vision</option>
          <option value="myopia">Myopia (Nearsighted)</option>
          <option value="hypermetropia">Hypermetropia (Farsighted)</option>
        </select>
        
        <button 
          onClick={() => setCorrection(!correction)}
          disabled={defect === 'normal'}
          className={cn(
            "px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors",
            defect === 'normal' ? "bg-nat-light text-nat-muted" : (correction ? "bg-red-100 text-red-600" : "bg-nat-primary text-white")
          )}
        >
          {correction ? "Remove Lens" : "Add Lens"}
        </button>
      </div>
    </div>
  );
}

function MagnetismSimulation() {
  const [current, setCurrent] = useState(5);
  const [distance, setDistance] = useState(2);
  const bField = (current / distance).toFixed(2);

  return (
    <div className="bg-white rounded-3xl border border-nat-border shadow-inner p-6">
      <h3 className="text-xl font-bold font-serif italic mb-4">Magnetic Effect of Current</h3>
      
      <div className="bg-gray-100 h-64 rounded-xl relative overflow-hidden mb-6 border border-gray-200 flex flex-col items-center justify-center p-8">
         <div className="w-1 h-full bg-orange-600 absolute left-1/2 -translate-x-1/2" />
         
         {/* Magnetic field rings */}
         {current > 0 && Array.from({length: 4}).map((_, i) => (
           <motion.div 
             key={i}
             className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500"
             style={{ width: (i+1)*40, height: (i+1)*15, opacity: 1 - (i*0.2) }}
             animate={{ rotateX: [70, 70], rotateZ: [0, 360] }}
             transition={{ duration: 10 / current, repeat: Infinity, ease: 'linear' }}
           />
         ))}

         <div className="absolute right-10 top-1/2 text-xs bg-white p-2 rounded shadow-sm">
           <strong>B = \u03bc\u2080I / (2\u03c0r)</strong>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase mb-2">Wire Current (I = {current} A)</label>
          <input type="range" min="0" max="20" value={current} onChange={e => setCurrent(Number(e.target.value))} className="w-full accent-nat-primary" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase mb-2">Distance (r = {distance} cm)</label>
          <input type="range" min="1" max="10" value={distance} onChange={e => setDistance(Number(e.target.value))} className="w-full accent-nat-primary" />
        </div>
      </div>
      
      <div className="mt-6 flex gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
        <div>Relative B-Field Strength: <span className="font-bold text-blue-600 ml-2">{bField} T</span></div>
      </div>
    </div>
  );
}

function ElectrostaticsSimulation() {
  const [q1, setQ1] = useState(-5);
  const [q2, setQ2] = useState(5);
  const [distance, setDistance] = useState(4);
  
  const forceRaw = (q1 * q2) / Math.pow(distance, 2);
  const forceMag = Math.abs(forceRaw).toFixed(2);
  const isAttractive = forceRaw < 0;

  return (
    <div className="bg-white rounded-3xl border border-nat-border shadow-inner p-6">
      <h3 className="text-xl font-bold font-serif italic mb-4">Coulomb's Law</h3>
      
      <div className="bg-nat-light h-48 rounded-xl relative overflow-hidden mb-6 flex items-center justify-center gap-4 border border-nat-border border-dashed">
         <motion.div 
           className={cn(
             "w-16 h-16 rounded-full flex items-center justify-center font-bold text-white shadow-lg transition-transform",
             q1 < 0 ? "bg-red-500" : q1 > 0 ? "bg-blue-500" : "bg-gray-400"
           )}
           animate={{ x: isAttractive && q1 !== 0 && q2 !== 0 ? 10 : q1 !== 0 && q2 !== 0 ? -10 : 0 }}
         >
           {q1 > 0 ? `+${q1}` : q1}
         </motion.div>
         
         <div className="flex-1 max-w-[200px] flex flex-col items-center">
            {q1 !== 0 && q2 !== 0 && (
              <div className="text-xs uppercase tracking-widest font-bold text-nat-muted mb-2">
                {isAttractive ? "Attraction" : "Repulsion"}
              </div>
            )}
            <div className="w-full flex items-center gap-2">
              <div className="h-0.5 bg-nat-border flex-1" />
              <div className="text-xs font-mono">{distance}m</div>
              <div className="h-0.5 bg-nat-border flex-1" />
            </div>
         </div>

         <motion.div 
           className={cn(
             "w-16 h-16 rounded-full flex items-center justify-center font-bold text-white shadow-lg transition-transform",
             q2 < 0 ? "bg-red-500" : q2 > 0 ? "bg-blue-500" : "bg-gray-400"
           )}
           animate={{ x: isAttractive && q1 !== 0 && q2 !== 0 ? -10 : q1 !== 0 && q2 !== 0 ? 10 : 0 }}
         >
           {q2 > 0 ? `+${q2}` : q2}
         </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase mb-2">Charge 1 ({q1} C)</label>
          <input type="range" min="-10" max="10" value={q1} onChange={e => setQ1(Number(e.target.value))} className="w-full accent-nat-primary" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase mb-2">Charge 2 ({q2} C)</label>
          <input type="range" min="-10" max="10" value={q2} onChange={e => setQ2(Number(e.target.value))} className="w-full accent-nat-primary" />
        </div>
         <div>
          <label className="block text-xs font-bold uppercase mb-2">Distance ({distance} m)</label>
          <input type="range" min="1" max="10" value={distance} onChange={e => setDistance(Number(e.target.value))} className="w-full accent-nat-primary" />
        </div>
      </div>
      
      <div className="mt-6 flex gap-4 bg-nat-panel p-4 rounded-xl border border-nat-border items-center">
        <Zap className={cn("w-5 h-5", isAttractive ? "text-purple-500" : "text-yellow-500")} />
        <div className="font-mono text-sm">Electric Force Mag: <span className="font-bold ml-1">{forceMag} F</span></div>
      </div>
    </div>
  );
}
