import React, { useState, useEffect } from 'react';
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
  const [shape, setShape] = useState<'line' | 'triangle' | 'square' | 'hexagon' | 'triangle-center' | 'square-center' | 'hexagon-center'>('triangle');
  const [charges, setCharges] = useState<number[]>([5, -5, 5]); // Initial for triangle

  // Reset charges when shape changes
  useEffect(() => {
    let numCharges = 2;
    if (shape === 'triangle') numCharges = 3;
    if (shape === 'square') numCharges = 4;
    if (shape === 'hexagon') numCharges = 6;
    if (shape === 'triangle-center') numCharges = 4;
    if (shape === 'square-center') numCharges = 5;
    if (shape === 'hexagon-center') numCharges = 7;
    setCharges(Array(numCharges).fill(0).map((_, i) => {
        // if it's the center charge, default it to positive for visibility
        if (i === numCharges - 1 && shape.includes('-center')) {
            return 8;
        }
        return i % 2 === 0 ? 5 : -5;
    }));
  }, [shape]);

  const updateCharge = (index: number, val: number) => {
    const newCharges = [...charges];
    newCharges[index] = val;
    setCharges(newCharges);
  };

  const getPoints = () => {
    const R = 100;
    if (shape === 'line') return [[-100, 0], [100, 0]];
    
    const triPoints = [[0, -R], [R * Math.cos(Math.PI/6), R * Math.sin(Math.PI/6)], [-R * Math.cos(Math.PI/6), R * Math.sin(Math.PI/6)]];
    if (shape === 'triangle') return triPoints;
    if (shape === 'triangle-center') return [...triPoints, [0, 0]];
    
    const sqPoints = [[-R, -R], [R, -R], [R, R], [-R, R]];
    if (shape === 'square') return sqPoints;
    if (shape === 'square-center') return [...sqPoints, [0, 0]];
    
    const hexPoints = Array.from({length: 6}).map((_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      return [R * Math.cos(angle), R * Math.sin(angle)];
    });
    if (shape === 'hexagon') return hexPoints;
    if (shape === 'hexagon-center') return [...hexPoints, [0, 0]];

    return [];
  };

  const points = getPoints();

  // Calculate forces
  const K = 50000; // Visual scaling constant
  const forces = points.map((p1, i) => {
    let fx = 0, fy = 0;
    points.forEach((p2, j) => {
      if (i === j) return;
      const dx = p1[0] - p2[0];
      const dy = p1[1] - p2[1];
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);
      if (dist === 0) return;
      
      const forceMag = (K * charges[i] * charges[j]) / (distSq * dist); // multiplied by dx/dist or dy/dist, so we divide by dist^3
      fx += forceMag * dx;
      fy += forceMag * dy;
    });
    return { fx, fy };
  });

  return (
    <div className="bg-white rounded-3xl border border-nat-border shadow-inner p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold font-serif italic mb-0">Vector Electrostatics</h3>
        <select 
          value={shape}
          onChange={(e) => setShape(e.target.value as any)}
          className="bg-nat-light border border-nat-border rounded-xl px-3 py-1.5 font-bold text-sm"
        >
          <option value="line">Line (2 Charges)</option>
          <option value="triangle">Triangle (3 Charges)</option>
          <option value="triangle-center">Triangle + Center</option>
          <option value="square">Square (4 Charges)</option>
          <option value="square-center">Square + Center</option>
          <option value="hexagon">Hexagon (6 Charges)</option>
          <option value="hexagon-center">Hexagon + Center</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-nat-light rounded-xl border border-nat-border border-dashed relative flex items-center justify-center p-4 min-h-[400px]">
          <svg viewBox="-200 -200 400 400" className="w-full h-full max-h-[350px]">
            {/* Draw connections */}
            {points.map((p, i) => {
              const rPerimeter = shape.includes('-center') ? points.length - 1 : points.length;
              if (i >= rPerimeter) return null;
              
              const nextP = points[(i + 1) % rPerimeter];
              if (shape === 'line' && i === 1) return null; // Don't close the line
              
              return (
                <line key={`l-${i}`} x1={p[0]} y1={p[1]} x2={nextP[0]} y2={nextP[1]} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5,5" />
              );
            })}
            {shape.includes('square') && (
              <>
                <line x1={points[0][0]} y1={points[0][1]} x2={points[2][0]} y2={points[2][1]} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5,5" />
                <line x1={points[1][0]} y1={points[1][1]} x2={points[3][0]} y2={points[3][1]} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5,5" />
              </>
            )}

            {/* Draw forces */}
            {forces.map((f, i) => {
              if (charges[i] === 0 || (f.fx === 0 && f.fy === 0)) return null;
              const p = points[i];
              // Cap visual length of force vector
              const fMag = Math.sqrt(f.fx*f.fx + f.fy*f.fy);
              const maxL = 100;
              const scale = fMag > maxL ? maxL / fMag : 1;
              const vx = f.fx * scale;
              const vy = f.fy * scale;
              
              return (
                <g key={`f-${i}`}>
                   <defs>
                     <marker id={`arrowhead-${i}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                       <polygon points="0 0, 6 3, 0 6" fill="#10b981" />
                     </marker>
                   </defs>
                   <line 
                     x1={p[0]} y1={p[1]} 
                     x2={p[0] + vx} y2={p[1] + vy} 
                     stroke="#10b981" 
                     strokeWidth="3"
                     markerEnd={`url(#arrowhead-${i})`}
                   />
                </g>
              );
            })}

            {/* Draw charges */}
            {points.map((p, i) => {
              const q = charges[i];
              const color = q < 0 ? '#ef4444' : q > 0 ? '#3b82f6' : '#94a3b8';
              const isCenter = shape.includes('-center') && i === points.length - 1;
              return (
                <g key={`q-${i}`} transform={`translate(${p[0]}, ${p[1]})`}>
                  <circle cx="0" cy="0" r="16" fill={color} className="shadow-lg drop-shadow-md" />
                  <text x="0" y="5" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                    {q > 0 ? `+${q}` : q}
                  </text>
                  <text x="0" y="-22" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">
                    {isCenter ? 'qCenter' : `q${i+1}`}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="bg-nat-panel rounded-xl border border-nat-border p-4 max-h-[400px] overflow-y-auto">
          <h4 className="text-xs font-bold uppercase tracking-widest text-nat-muted mb-4">Set Charges (μC)</h4>
          <div className="space-y-4">
            {charges.map((q, i) => {
              const isCenter = shape.includes('-center') && i === charges.length - 1;
              return (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-nat-dark">{isCenter ? 'Center (qC)' : `q${i + 1}`}</label>
                  <span className={cn("text-xs font-mono font-bold", q < 0 ? "text-red-600" : q > 0 ? "text-blue-600" : "text-gray-500")}>
                    {q > 0 ? '+' : ''}{q}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="-10" max="10" 
                  value={q} 
                  onChange={e => updateCharge(i, Number(e.target.value))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-nat-primary" 
                />
              </div>
            )})}
          </div>
          
          <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-100 flex items-start gap-2">
            <Zap className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
            <p className="text-xs text-green-800 leading-relaxed font-medium">
              The green arrows show the <strong>net force vector</strong> acting on each point charge, calculated by superimposing Coulomb forces from all other charges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
