import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, Sliders, Info, Zap, Sparkles, Move } from 'lucide-react';
import { cn } from '../lib/utils';

type OpticsMode = 'refraction' | 'lens' | 'mirror' | 'wave';

export function OpticsSimulation() {
  const [mode, setMode] = useState<OpticsMode>('refraction');
  
  // Spectral parameters
  const [wavelength, setWavelength] = useState(550); // nm (Green default)
  
  // Refraction state
  const [angle1, setAngle1] = useState(45);
  const [n1Base, setN1Base] = useState(1.0); 
  const [n2Base, setN2Base] = useState(1.5); 
  
  // Compute dispersive indices (Simplified Cauchy equation: n = n_base + B/λ^2)
  const B_const = 0.04; 
  const n1 = n1Base + (B_const * 250000) / (wavelength * wavelength);
  const n2 = n2Base + (B_const * 250000) / (wavelength * wavelength);

  // Lens state
  const [focalLength, setFocalLength] = useState(150);
  const [sphericalAberration, setSphericalAberration] = useState(0.2);
  const [chromaticAberration, setChromaticAberration] = useState(0.2);

  // Mirror state
  const [mirrorFocal, setMirrorFocal] = useState(150);
  const [isConcave, setIsConcave] = useState(true);
  const [objectDist, setObjectDist] = useState(250); // Measured from mirror center
  const [objectHeight, setObjectHeight] = useState(60);

  // Wave state
  const [slitWidth, setSlitWidth] = useState(20);
  const [slitDistance, setSlitDistance] = useState(50);
  const [isDoubleSlit, setIsDoubleSlit] = useState(false);

  // Utility to get color from wavelength
  const wavelengthToHex = (nm: number) => {
    if (nm < 440) return '#8b5cf6'; // Violet
    if (nm < 480) return '#3b82f6'; // Blue
    if (nm < 510) return '#06b6d4'; // Cyan
    if (nm < 580) return '#22c55e'; // Green
    if (nm < 610) return '#eab308'; // Yellow
    if (nm < 670) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const currentColor = wavelengthToHex(wavelength);

  const angle1Rad = (angle1 * Math.PI) / 180;
  
  // Snell's law: n1 * sin(θ1) = n2 * sin(θ2)
  const sinTheta2 = (n1 / n2) * Math.sin(angle1Rad);
  
  let angle2Rad = 0;
  let isTIR = false; 

  if (Math.abs(sinTheta2) > 1) {
    isTIR = true;
  } else {
    angle2Rad = Math.asin(sinTheta2);
  }

  const angle2 = (angle2Rad * 180) / Math.PI;

  const width = 600;
  const height = 400;
  const cx = width / 2;
  const cy = height / 2;

  // Render Refraction Lab
  const renderRefraction = () => {
    const rayLength = 300;
    const incX = cx - rayLength * Math.sin(angle1Rad);
    const incY = cy - rayLength * Math.cos(angle1Rad);
    const refX = cx + rayLength * Math.sin(angle2Rad);
    const refY = cy + rayLength * Math.cos(angle2Rad);
    const reflX = cx + rayLength * Math.sin(angle1Rad);
    const reflY = cy - rayLength * Math.cos(angle1Rad);

    return (
      <>
        <rect x="0" y="0" width={width} height={height/2} fill="#fdfcf9" />
        <text x="30" y="45" fontSize="11" fill="#a05a36" fontWeight="bold" className="uppercase tracking-widest opacity-80">Medium 1 (n₁ ≈ {n1.toFixed(2)})</text>
        
        <rect x="0" y={height/2} width={width} height={height/2} fill="#eff0e8" opacity="0.6" />
        <text x="30" y={height - 35} fontSize="11" fill="#5a5a40" fontWeight="bold" className="uppercase tracking-widest opacity-80">Medium 2 (n₂ ≈ {n2.toFixed(2)})</text>

        <line x1={cx} y1="0" x2={cx} y2={height} stroke="#d5d2c9" strokeWidth="1" strokeDasharray="6,6" />
        <line x1="0" y1={cy} x2={width} y2={cy} stroke="#8a8a70" strokeWidth="1" />

        {/* Incident Angle Arc */}
        <path d={`M ${cx} ${cy - 40} A 40 40 0 0 0 ${cx - 40 * Math.sin(angle1Rad)} ${cy - 40 * Math.cos(angle1Rad)}`} fill="none" stroke={currentColor} strokeWidth="2" opacity="0.5" />
        <text 
          x={cx - 50 * Math.sin(angle1Rad/2)} 
          y={cy - 50 * Math.cos(angle1Rad/2)} 
          fontSize="12" fill={currentColor} fontWeight="bold" textAnchor="end" className="font-mono"
        >
          {angle1}°
        </text>

        {/* Refracted Angle Arc - Measured from Interface (Inverted) */}
        {!isTIR && (
          <>
            <path 
              d={`M ${cx + 40} ${cy} A 40 40 0 0 1 ${cx + 40 * Math.sin(angle2Rad)} ${cy + 40 * Math.cos(angle2Rad)}`} 
              fill="none" stroke="#ea580c" strokeWidth="2" opacity="0.5" 
            />
            <text 
              x={cx + 50 * Math.cos((Math.PI/2 - angle2Rad)/2)} 
              y={cy + 50 * Math.sin((Math.PI/2 - angle2Rad)/2)} 
              fontSize="12" fill="#ea580c" fontWeight="bold" className="font-mono"
            >
              {(90 - angle2).toFixed(1)}°
            </text>
          </>
        )}

        {/* Rays */}
        <line x1={incX} y1={incY} x2={cx} y2={cy} stroke={currentColor} strokeWidth="4" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={reflX} y2={reflY} stroke={currentColor} strokeWidth={isTIR ? 4 : 1.5} opacity={isTIR ? 1 : 0.2} strokeLinecap="round" />

        {!isTIR && (
          <line x1={cx} y1={cy} x2={refX} y2={refY} stroke={currentColor} strokeWidth="4" strokeLinecap="round" />
        )}

        {isTIR && (
           <text x={cx + 20} y={cy - 20} fontSize="14" fill={currentColor} fontWeight="bold" className="italic font-serif">Total Internal Reflection</text>
        )}
      </>
    );
  };

  // Render Lens Lab
  const renderLens = () => {
    const lensX = 100;
    const numRays = 7;
    const raySpacing = 20;
    const startX = 20;

    return (
      <>
        <line x1="0" y1={cy} x2={width} y2={cy} stroke="#d5d2c9" strokeWidth="1" strokeDasharray="5,5" />
        <path 
           d={`M ${lensX} ${cy-80} Q ${lensX + 15} ${cy} ${lensX} ${cy+80} Q ${lensX - 15} ${cy} ${lensX} ${cy-80}`}
           fill="rgba(186, 230, 253, 0.4)"
           stroke="#0ea5e9"
           strokeWidth="2"
        />
        <text x={lensX - 20} y={cy + 100} fontSize="10" fill="#0ea5e9" fontWeight="bold" className="uppercase tracking-widest text-center">Biconvex Lens</text>

        {Array.from({ length: numRays }).map((_, i) => {
          const yOffset = (i - Math.floor(numRays / 2)) * raySpacing;
          const saFactor = (yOffset * yOffset) / 200 * sphericalAberration;
          
          // Chromatic dispersion: n varies with wavelength, focal length f ∝ 1/(n-1)
          const dispersionShift = (wavelength - 550) * chromaticAberration * 0.2;
          const currentF = focalLength - saFactor + dispersionShift;
          const focusX = lensX + currentF;
          
          return (
            <g key={`ray-${i}`}>
              <line x1={startX} y1={cy + yOffset} x2={lensX} y2={cy + yOffset} stroke={currentColor} strokeWidth={2} opacity={0.4} />
              <line 
                x1={lensX} y1={cy + yOffset} 
                x2={width} y2={cy + (yOffset * (width - lensX) / (lensX - focusX))} 
                stroke={currentColor} 
                strokeWidth={2} 
                opacity={0.7} 
              />
              <circle cx={focusX} cy={cy} r="2" fill={currentColor} opacity={0.3} />
            </g>
          );
        })}
      </>
    );
  };

  // Render Mirror Lab
  const renderMirror = () => {
    const mirrorX = 400;
    const f = mirrorFocal * (isConcave ? 1 : -1);
    const u = -objectDist; // Object distance is negative in sign convention
    
    // Lens/Mirror Formula: 1/f = 1/v + 1/u => 1/v = 1/f - 1/u
    // v = (f * u) / (u - f)
    const v = (f * u) / (u - f);
    const magnification = -v / u;
    const imgHeight = objectHeight * magnification;
    const imgX = mirrorX + v;
    const isVirtual = v > 0;

    // Draw Optical Axis
    const axis = (
      <line x1="0" y1={cy} x2={width} y2={cy} stroke="#d5d2c9" strokeWidth="1" strokeDasharray="5,5" />
    );

    // Cardinal Points
    const points = (
      <g>
        {/* Focal Point */}
        <circle cx={mirrorX - f} cy={cy} r="3" fill="#ef4444" />
        <text x={mirrorX - f} y={cy + 15} fontSize="9" textAnchor="middle" fill="#ef4444" fontWeight="bold">F</text>
        
        {/* Center of Curvature (2F) */}
        {isConcave && (
          <>
            <circle cx={mirrorX - 2 * f} cy={cy} r="3" fill="#8b5cf6" />
            <text x={mirrorX - 2 * f} y={cy + 15} fontSize="9" textAnchor="middle" fill="#8b5cf6" fontWeight="bold">C (2F)</text>
          </>
        )}
      </g>
    );

    // Object
    const obj = (
      <motion.g 
        drag="x" 
        dragConstraints={{ left: 50, right: mirrorX - 20 }}
        dragElastic={0}
        onDrag={(_, info) => setObjectDist(mirrorX - info.point.x)}
        className="cursor-move"
      >
        <line x1={mirrorX + u} y1={cy} x2={mirrorX + u} y2={cy - objectHeight} stroke="#0ea5e9" strokeWidth="3" markerEnd="url(#arrowhead-obj)" />
        <rect x={mirrorX + u - 20} y={cy - objectHeight - 25} width="40" height="12" rx="4" fill="white" stroke="#0ea5e9" strokeWidth="1" className="drop-shadow-sm" />
        <text x={mirrorX + u} y={cy - objectHeight - 16} fontSize="8" textAnchor="middle" fill="#0ea5e9" fontWeight="bold">OBJ: {Math.abs(u).toFixed(0)}</text>
        <circle cx={mirrorX + u} cy={cy - objectHeight/2} r="10" fill="white" stroke="#0ea5e9" strokeWidth="1" className="opacity-0 hover:opacity-100 transition-opacity" />
        <path d={`M ${mirrorX+u-4} ${cy-objectHeight/2} L ${mirrorX+u+4} ${cy-objectHeight/2} M ${mirrorX+u} ${cy-objectHeight/2-4} L ${mirrorX+u} ${cy-objectHeight/2+4}`} stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" pointerEvents="none" />
      </motion.g>
    );

    // Image
    const img = (
      <g opacity={0.8}>
        <line 
          x1={imgX} y1={cy} 
          x2={imgX} y2={cy - imgHeight} 
          stroke={isVirtual ? "#8b5cf6" : "#f97316"} 
          strokeWidth="3" 
          strokeDasharray={isVirtual ? "4,2" : "0"}
          markerEnd={isVirtual ? "url(#arrowhead-virtual)" : "url(#arrowhead-real)"} 
        />
        <rect x={imgX - 20} y={cy - imgHeight + (imgHeight > 0 ? -25 : 5)} width="40" height="12" rx="4" fill="white" stroke={isVirtual ? "#8b5cf6" : "#f97316"} strokeWidth="1" className="drop-shadow-sm" />
        <text x={imgX} y={cy - imgHeight + (imgHeight > 0 ? -16 : 14)} fontSize="8" textAnchor="middle" fill={isVirtual ? "#8b5cf6" : "#f97316"} fontWeight="bold">
          IMG: {Math.abs(v).toFixed(0)}
        </text>
      </g>
    );

    // Principal Rays
    const rays = (
      <g opacity={0.6}>
        {/* 1. Parallel Ray -> Passes through F (or extension does) */}
        <line 
          x1={mirrorX + u} y1={cy - objectHeight} 
          x2={mirrorX} y2={cy - objectHeight} 
          stroke={currentColor} strokeWidth="1.5"
        />
        <line 
          x1={mirrorX} y1={cy - objectHeight} 
          x2={isVirtual ? mirrorX + (mirrorX - (mirrorX - f)) * 2 : 0} 
          y2={isVirtual ? cy - objectHeight + (cy - (cy - objectHeight)) * 2 : cy + ( (cy - objectHeight) - cy) * ( (0 - mirrorX) / (mirrorX - (mirrorX - f)) )} 
          stroke={currentColor} strokeWidth="1.5"
        />
        {isVirtual && (
          <line 
            x1={mirrorX} y1={cy - objectHeight} 
            x2={imgX} y2={cy - imgHeight} 
            stroke={currentColor} strokeWidth="1" strokeDasharray="4,2" 
          />
        )}

        {/* 2. Ray through Center C -> Reflects back on itself */}
        <line 
          x1={mirrorX + u} y1={cy - objectHeight} 
          x2={mirrorX} y2={cy + ( (cy-objectHeight) - cy) * (mirrorX / (mirrorX + u))} 
          stroke={currentColor} strokeWidth="1" opacity="0.3"
        />
      </g>
    );

    return (
      <>
        <defs>
          <marker id="arrowhead-obj" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#0ea5e9" />
          </marker>
          <marker id="arrowhead-real" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="10 0, 0 3.5, 10 7" fill="#f97316" transform={imgHeight > 0 ? "scale(1,1)" : "rotate(180, 5, 3.5)"} />
          </marker>
          <marker id="arrowhead-virtual" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="10 0, 0 3.5, 10 7" fill="#8b5cf6" transform={imgHeight > 0 ? "scale(1,1)" : "rotate(180, 5, 3.5)"} />
          </marker>
        </defs>
        {axis}
        {points}
        
        {/* Mirror Shape */}
        <path 
          d={isConcave 
            ? `M ${mirrorX} ${cy-140} Q ${mirrorX - 40} ${cy} ${mirrorX} ${cy+140}`
            : `M ${mirrorX} ${cy-140} Q ${mirrorX + 40} ${cy} ${mirrorX} ${cy+140}`
          }
          fill="rgba(148, 163, 184, 0.1)"
          stroke="#94a3b8"
          strokeWidth="6"
          strokeLinecap="round"
        />
        
        {rays}
        {img}
        {obj}

        <text x={20} y={height - 20} fontSize="11" fill="#64748b" className="font-mono">
          u: {u.toFixed(1)} px | v: {v.toFixed(1)} px | m: {magnification.toFixed(2)}
        </text>
      </>
    );
  };

  // Render Wave Lab (Diffraction/Interference)
  const renderWave = () => {
    const barrierX = 150;
    const screenX = 550;
    const patternWidth = screenX - barrierX;

    return (
      <>
        {/* Barrier */}
        <line x1={barrierX} y1={0} x2={barrierX} y2={cy - slitWidth/2} stroke="#334155" strokeWidth="4" />
        <line x1={barrierX} y1={cy + slitWidth/2} x2={barrierX} y2={height} stroke="#334155" strokeWidth="4" />
        
        {isDoubleSlit && (
          <>
            <rect x={barrierX-2} y={cy - slitDistance/2 - slitWidth/2} width="4" height={slitWidth} fill="white" stroke="#334155" strokeWidth="1" />
            <rect x={barrierX-2} y={cy + slitDistance/2 - slitWidth/2} width="4" height={slitWidth} fill="white" stroke="#334155" strokeWidth="1" />
            <line x1={barrierX} y1={cy - slitDistance/2 + slitWidth/2} x2={barrierX} y2={cy + slitDistance/2 - slitWidth/2} stroke="#334155" strokeWidth="4" />
          </>
        )}

        {/* Screen */}
        <line x1={screenX} y1={0} x2={screenX} y2={height} stroke="#000" strokeWidth="2" />
        
        {/* Pattern Visualization */}
        {Array.from({ length: 100 }).map((_, i) => {
          const y = (i / 100) * height;
          const theta = Math.atan((y - cy) / patternWidth);
          
          // Diffraction: I = I0 * [sin(β)/β]^2 where β = (π*slitWidth/λ) * sin(θ)
          const beta = (Math.PI * (slitWidth * 50) / wavelength) * Math.sin(theta);
          const diffraction = Math.pow(beta === 0 ? 1 : Math.sin(beta) / beta, 2);
          
          // Interference: I = I_diff * cos^2(δ) where δ = (π*slitDistance/λ) * sin(θ)
          let intensity = diffraction;
          if (isDoubleSlit) {
            const delta = (Math.PI * (slitDistance * 100) / wavelength) * Math.sin(theta);
            intensity *= Math.pow(Math.cos(delta), 2);
          }

          return (
            <rect 
              key={`fringe-${i}`}
              x={screenX + 5} y={y} 
              width="20" height={height/100}
              fill={currentColor}
              opacity={intensity}
            />
          );
        })}

        <text x={screenX - 80} y={30} fontSize="10" fill="#000" fontWeight="bold" className="uppercase tracking-widest">Intensity Pattern</text>
      </>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-nat-border shadow-sm flex flex-col overflow-hidden w-full h-full">
      {/* Header */}
      <div className="p-6 border-b border-nat-border flex justify-between items-center bg-nat-panel-alt/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-nat-primary/10 rounded-xl">
            <Eye className="w-5 h-5 text-nat-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-nat-dark font-serif italic leading-tight">Optics Laboratory</h3>
            <p className="text-[10px] text-nat-muted uppercase tracking-[0.2em] font-bold">
              {mode === 'refraction' && "Refraction & Snell's Law"}
              {mode === 'lens' && "Lens Aberrations & Focus"}
              {mode === 'mirror' && "Mirror Reflections & Images"}
              {mode === 'wave' && "Interference & Diffraction"}
            </p>
          </div>
        </div>
        
        <div className="flex bg-nat-light p-1 rounded-xl border border-nat-border overflow-x-auto max-w-[150px] sm:max-w-none">
          {[
            { id: 'refraction', label: "Refract" },
            { id: 'lens', label: 'Lens' },
            { id: 'mirror', label: 'Mirrors' },
            { id: 'wave', label: 'Waves' }
          ].map(opt => (
            <button 
              key={opt.id}
              onClick={() => setMode(opt.id as OpticsMode)}
              className={cn(
                "px-3 sm:px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                mode === opt.id ? "bg-white text-nat-dark shadow-sm" : "text-nat-muted hover:text-nat-dark"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex-1 min-h-[400px] flex items-center justify-center bg-white overflow-hidden p-4">
        <svg 
           width="100%" 
           height="100%" 
           viewBox={`0 0 ${width} ${height}`} 
           preserveAspectRatio="xMidYMid meet"
           className="max-w-full drop-shadow-sm"
        >
          {mode === 'refraction' && renderRefraction()}
          {mode === 'lens' && renderLens()}
          {mode === 'mirror' && renderMirror()}
          {mode === 'wave' && renderWave()}
        </svg>
        
        <div className="absolute top-6 right-6 flex items-start gap-3 max-w-[200px] bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-nat-border shadow-lg z-10">
           <Zap className={cn("w-4 h-4 mt-0.5 shrink-0", mode === 'wave' ? "text-purple-500" : "text-nat-accent")} />
           <p className="text-[11px] text-nat-text leading-relaxed font-medium italic">
             {mode === 'refraction' && "Note how the ray bends toward the normal in denser media. n is wavelength-dependent (Cauchy dispersion)."}
             {mode === 'lens' && "Observe chromatic aberration: different wavelengths focus at slightly different points."}
             {mode === 'mirror' && "Mirrors use reflection laws. Convex mirrors always produce virtual, upright, and diminished images."}
             {mode === 'wave' && "Diffraction (bending around corners) and Interference (superposition) reveal the wave nature of light."}
           </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-nat-panel border-t border-nat-border p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {/* Universal Wavelength Slider */}
          <div className="bg-white p-4 rounded-2x1 border border-nat-border shadow-sm ring-1 ring-nat-primary/5 flex flex-col gap-3">
             <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-nat-dark">
               <label className="opacity-70">Wavelength</label>
               <span className="font-mono text-xs" style={{ color: currentColor }}>{wavelength}nm</span>
             </div>
             <input 
               type="range" min="380" max="750" step="10" 
               value={wavelength} onChange={(e) => setWavelength(Number(e.target.value))}
               className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
               style={{ background: `linear-gradient(to right, #8b5cf6, #3b82f6, #06b6d4, #22c55e, #eab308, #f97316, #ef4444)` }}
             />
           </div>

          {mode === 'refraction' && (
            <>
              <div className="bg-white p-4 rounded-2xl border border-nat-border shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-nat-dark">
                  <label className="opacity-70">Incidence θ₁</label>
                  <span className="text-xs font-mono font-bold text-nat-primary">{angle1}°</span>
                </div>
                <input 
                  type="range" min="0" max="89" step="1" 
                  value={angle1} onChange={(e) => setAngle1(Number(e.target.value))}
                  className="w-full appearance-none bg-nat-light h-1.5 rounded-full accent-nat-primary cursor-pointer"
                />
              </div>
              <div className="bg-white p-4 rounded-2xl border border-nat-border shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-nat-dark">
                  <label className="opacity-70">Medium 1 (n₀)</label>
                  <span className="text-xs font-mono font-bold text-nat-primary">{n1Base.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="1.0" max="2.5" step="0.05" 
                  value={n1Base} onChange={(e) => setN1Base(Number(e.target.value))}
                  className="w-full appearance-none bg-nat-light h-1.5 rounded-full accent-nat-primary cursor-pointer"
                />
              </div>
              <div className="bg-white p-4 rounded-2xl border border-nat-border shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-nat-dark">
                  <label className="opacity-70">Medium 2 (n₀)</label>
                  <span className="text-xs font-mono font-bold text-nat-primary">{n2Base.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="1.0" max="2.5" step="0.05" 
                  value={n2Base} onChange={(e) => setN2Base(Number(e.target.value))}
                  className="w-full appearance-none bg-nat-light h-1.5 rounded-full accent-nat-primary cursor-pointer"
                />
              </div>
            </>
          )}

          {mode === 'lens' && (
            <>
              <div className="bg-white p-4 rounded-2xl border border-nat-border shadow-sm">
                <div className="flex justify-between mb-3">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-nat-dark">Focus Point</label>
                  <span className="text-xs font-mono font-bold text-nat-primary">{focalLength}</span>
                </div>
                <input 
                  type="range" min="100" max="250" step="10" 
                  value={focalLength} onChange={(e) => setFocalLength(Number(e.target.value))}
                  className="w-full appearance-none bg-nat-light h-1.5 rounded-full accent-nat-primary cursor-pointer"
                />
              </div>
              <div className="bg-white p-4 rounded-2xl border border-nat-border shadow-sm">
                <div className="flex justify-between mb-3">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-nat-dark">Spherical Ab.</label>
                  <span className="text-xs font-mono font-bold text-nat-primary">{(sphericalAberration * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.05" 
                  value={sphericalAberration} onChange={(e) => setSphericalAberration(Number(e.target.value))}
                  className="w-full appearance-none bg-nat-light h-1.5 rounded-full accent-nat-primary cursor-pointer"
                />
              </div>
              <div className="bg-white p-4 rounded-2xl border border-nat-border shadow-sm">
                <div className="flex justify-between mb-3">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-nat-dark">Dispersion</label>
                  <span className="text-xs font-mono font-bold text-nat-primary">{(chromaticAberration * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.05" 
                  value={chromaticAberration} onChange={(e) => setChromaticAberration(Number(e.target.value))}
                  className="w-full appearance-none bg-nat-light h-1.5 rounded-full accent-nat-primary cursor-pointer"
                />
              </div>
            </>
          )}

          {mode === 'mirror' && (
            <>
              <div className="bg-white p-4 rounded-2xl border border-nat-border shadow-sm flex flex-col justify-center">
                 <div className="flex items-center gap-2 mb-3">
                    <button 
                      onClick={() => setIsConcave(true)}
                      className={cn("flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all", isConcave ? "bg-nat-dark text-white" : "bg-nat-light text-nat-muted")}
                    >
                      Concave
                    </button>
                    <button 
                      onClick={() => setIsConcave(false)}
                      className={cn("flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all", !isConcave ? "bg-nat-dark text-white" : "bg-nat-light text-nat-muted")}
                    >
                      Convex
                    </button>
                 </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-nat-border shadow-sm">
                <div className="flex justify-between mb-3 text-[11px] font-bold uppercase tracking-widest text-nat-dark">
                  <label>Mirror F</label>
                  <span className="text-nat-primary font-mono">{mirrorFocal}px</span>
                </div>
                <input 
                  type="range" min="50" max="250" step="10" 
                  value={mirrorFocal} onChange={(e) => setMirrorFocal(Number(e.target.value))}
                  className="w-full appearance-none bg-nat-light h-1.5 rounded-full accent-nat-primary cursor-pointer"
                />
              </div>
              <div className="bg-white p-4 rounded-2xl border border-nat-border shadow-sm">
                <div className="flex justify-between mb-3 text-[11px] font-bold uppercase tracking-widest text-nat-dark">
                  <label>Object Dist</label>
                  <span className="text-nat-primary font-mono">{objectDist}px</span>
                </div>
                <input 
                  type="range" min="20" max="350" step="5" 
                  value={objectDist} onChange={(e) => setObjectDist(Number(e.target.value))}
                  className="w-full appearance-none bg-nat-light h-1.5 rounded-full accent-nat-primary cursor-pointer"
                />
              </div>
              <div className="bg-white p-4 rounded-2xl border border-nat-border shadow-sm">
                <div className="flex justify-between mb-3 text-[11px] font-bold uppercase tracking-widest text-nat-dark">
                  <label>Obj Height</label>
                  <span className="text-nat-primary font-mono">{objectHeight}px</span>
                </div>
                <input 
                  type="range" min="10" max="100" step="5" 
                  value={objectHeight} onChange={(e) => setObjectHeight(Number(e.target.value))}
                  className="w-full appearance-none bg-nat-light h-1.5 rounded-full accent-nat-primary cursor-pointer"
                />
              </div>
            </>
          )}

          {mode === 'wave' && (
            <>
              <div className="bg-white p-4 rounded-2xl border border-nat-border shadow-sm">
                <div className="flex justify-between mb-3">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-nat-dark">Slit Width (a)</label>
                  <span className="text-xs font-mono font-bold text-nat-primary">{slitWidth}µm</span>
                </div>
                <input 
                  type="range" min="5" max="50" step="1" 
                  value={slitWidth} onChange={(e) => setSlitWidth(Number(e.target.value))}
                  className="w-full appearance-none bg-nat-light h-1.5 rounded-full accent-nat-primary cursor-pointer"
                />
              </div>
              <div className="bg-white p-4 rounded-2xl border border-nat-border shadow-sm">
                <label className="text-[11px] font-bold uppercase tracking-widest text-nat-dark mb-3 block">Pattern Type</label>
                <div className="flex gap-2">
                   <button 
                      onClick={() => setIsDoubleSlit(false)}
                      className={cn("flex-1 py-2 rounded-lg text-[10px] font-bold transition-all", !isDoubleSlit ? "bg-nat-dark text-white" : "bg-nat-light text-nat-muted")}
                    >
                      Single Slit
                    </button>
                    <button 
                      onClick={() => setIsDoubleSlit(true)}
                      className={cn("flex-1 py-2 rounded-lg text-[10px] font-bold transition-all", isDoubleSlit ? "bg-nat-dark text-white" : "bg-nat-light text-nat-muted")}
                    >
                      Double Slit
                    </button>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-nat-border shadow-sm">
                <div className="flex justify-between mb-3">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-nat-dark">Slit Distance (d)</label>
                  <span className="text-xs font-mono font-bold text-nat-primary">{slitDistance}µm</span>
                </div>
                <input 
                  type="range" min="20" max="100" step="5" 
                  value={slitDistance} onChange={(e) => setSlitDistance(Number(e.target.value))}
                  className="w-full appearance-none bg-nat-light h-1.5 rounded-full accent-nat-primary cursor-pointer"
                  disabled={!isDoubleSlit}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

