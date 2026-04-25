import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Activity, PlaySquare, RotateCcw, Gauge, Compass, Play, Pause } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProjectileSimulationProps {
  initialVelocity?: number;
  initialAngle?: number;
}

export function ProjectileSimulation({ initialVelocity = 20, initialAngle = 45 }: ProjectileSimulationProps) {
  const [activeTab, setActiveTab] = useState<'projectile' | 'graphs'>('projectile');

  // --- Projectile State ---
  const [velocity, setVelocity] = useState(initialVelocity);
  const [angle, setAngle] = useState(initialAngle);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);

  // --- Graphs State ---
  const [initialVel2, setInitialVel2] = useState(20);
  const [accel, setAccel] = useState(9.8);
  const [playGraphs, setPlayGraphs] = useState(false);
  const [graphTime, setGraphTime] = useState(0);

  const g = 9.81;
  const angleRad = (angle * Math.PI) / 180;
  
  const vx = velocity * Math.cos(angleRad);
  const vy = velocity * Math.sin(angleRad);
  
  const flightTime = (2 * vy) / g;
  const maxHeight = Math.pow(vy, 2) / (2 * g); // u^2 sin^2 theta / 2g
  const maxRange = vx * flightTime;

  const requestRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  const maxGraphTime = 5;

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const progress = (timestamp - startTimeRef.current) / 1000; // in seconds

    if (activeTab === 'projectile') {
      const simTime = progress * 1.5; 
      if (simTime < flightTime) {
        setTime(simTime);
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setTime(flightTime);
        setIsPlaying(false);
      }
    } else {
      if (progress < maxGraphTime) {
        setGraphTime(progress);
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setGraphTime(maxGraphTime);
        setPlayGraphs(false);
      }
    }
  };

  useEffect(() => {
    if ((activeTab === 'projectile' && isPlaying) || (activeTab === 'graphs' && playGraphs)) {
      startTimeRef.current = undefined;
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, playGraphs, flightTime, activeTab]);

  const resetProjectile = () => {
    setIsPlaying(false);
    setTime(0);
    setVelocity(initialVelocity);
    setAngle(initialAngle);
  };

  const resetGraphs = () => {
    setPlayGraphs(false);
    setGraphTime(0);
  };

  const currentX = vx * time;
  const currentY = (vy * time) - (0.5 * g * Math.pow(time, 2));

  const scale = 5; 
  const svgWidth = 600;
  const svgHeight = 300;

  return (
    <div className="bg-white rounded-3xl border border-nat-border shadow-inner relative flex flex-col overflow-hidden w-full">
      <div className="flex border-b border-nat-border bg-nat-light">
        <button 
          onClick={() => setActiveTab('projectile')}
          className={cn(
            "flex-1 py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2",
            activeTab === 'projectile' ? "bg-white text-nat-primary border-b-2 border-nat-primary" : "text-nat-muted hover:text-nat-dark"
          )}
        >
          <PlaySquare className="w-4 h-4" /> Projectile Motion
        </button>
        <button 
          onClick={() => setActiveTab('graphs')}
          className={cn(
            "flex-1 py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2",
            activeTab === 'graphs' ? "bg-white text-nat-primary border-b-2 border-nat-primary" : "text-nat-muted hover:text-nat-dark"
          )}
        >
          <Activity className="w-4 h-4" /> Kinematic Graphs
        </button>
      </div>

      {activeTab === 'projectile' && (
        <>
          <div className="relative flex-1 min-h-[350px] flex items-end justify-start bg-white p-6">
             <div className="absolute top-6 left-6 z-10 pointer-events-none">
               <h3 className="text-2xl font-serif italic text-nat-dark leading-tight">Interactive Lab: Projectile</h3>
               <p className="text-sm text-nat-muted max-w-[200px]">Simulate a launch. Note that range is maximized at an angle of 45°.</p>
             </div>

             <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="xMidYMax meet" className="absolute bottom-0 left-0 w-full h-full">
               <g stroke="#e5e2d9" strokeWidth="1" opacity="0.7">
                 {Array.from({length: 20}).map((_, i) => (
                   <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2={svgHeight} />
                 ))}
                 {Array.from({length: 10}).map((_, i) => (
                   <line key={`h-${i}`} x1="0" y1={svgHeight - i * 50} x2={svgWidth} y2={svgHeight - i * 50} />
                 ))}
               </g>

               <line x1="0" y1={svgHeight - 2} x2={svgWidth} y2={svgHeight - 2} stroke="#d5d2c9" strokeWidth="4" />

               {time === 0 && (
                 <g>
                   <path d={`M 0 ${svgHeight} A 50 50 0 0 0 ${50 * Math.cos(angleRad)} ${svgHeight - 50 * Math.sin(angleRad)}`} fill="none" stroke="#8c9c75" strokeWidth="2" opacity="0.4" />
                   <text x={20} y={svgHeight - 15} fontSize="12" fill="#8c9c75" fontWeight="bold">θ</text>
                 </g>
               )}

               <path 
                 d={`M 0 ${svgHeight} 
                     Q ${maxRange * scale / 2} ${svgHeight - (maxHeight * scale * 2)}, 
                       ${maxRange * scale} ${svgHeight}`}
                 fill="none" 
                 stroke="#d5d2c9" 
                 strokeWidth="2" 
                 strokeDasharray="4,4" 
               />

               <motion.circle 
                 cx={Math.max(0, currentX * scale)} 
                 cy={Math.min(svgHeight, svgHeight - (currentY * scale))} 
                 r="8" 
                 fill="#c27a56" 
                 stroke="#a05a36"
                 strokeWidth="2"
                 initial={false}
                 animate={{ cx: Math.max(0, currentX * scale), cy: Math.min(svgHeight, svgHeight - (currentY * scale)) }}
                 transition={{ type: "tween", duration: 0 }}
               />
             </svg>
          </div>

          <div className="bg-nat-panel border-t border-nat-border flex flex-col items-center p-6 md:px-10 gap-8 shrink-0">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-4 rounded-2xl border border-nat-border shadow-sm group hover:border-nat-primary/30 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-nat-primary/10 rounded-lg text-nat-primary">
                      <Gauge className="w-4 h-4" />
                    </div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-nat-dark">Initial Velocity (u)</label>
                  </div>
                  <span className="text-xs font-mono font-bold text-nat-primary bg-nat-light px-2 py-1 rounded border border-nat-border">{velocity} m/s</span>
                </div>
                <input 
                  type="range" 
                  min="5" max="40" step="1" 
                  value={velocity} 
                  onChange={(e) => { setVelocity(Number(e.target.value)); setTime(0); setIsPlaying(false); }}
                  className="w-full h-2 bg-nat-light rounded-lg appearance-none cursor-pointer accent-nat-primary"
                  disabled={isPlaying && time > 0}
                />
                <div className="flex justify-between mt-2 text-[9px] font-bold text-nat-muted uppercase tracking-tighter">
                  <span>5 m/s</span>
                  <span>40 m/s</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-nat-border shadow-sm group hover:border-nat-secondary/30 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-nat-secondary/10 rounded-lg text-nat-secondary">
                      <Compass className="w-4 h-4" />
                    </div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-nat-dark">Launch Angle (θ)</label>
                  </div>
                  <span className="text-xs font-mono font-bold text-nat-secondary bg-nat-light px-2 py-1 rounded border border-nat-border">{angle}°</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="90" step="1" 
                  value={angle} 
                  onChange={(e) => { setAngle(Number(e.target.value)); setTime(0); setIsPlaying(false); }}
                  className="w-full h-2 bg-nat-light rounded-lg appearance-none cursor-pointer accent-nat-secondary"
                  disabled={isPlaying && time > 0}
                />
                <div className="flex justify-between mt-2 text-[9px] font-bold text-nat-muted uppercase tracking-tighter">
                  <span>0°</span>
                  <span>90°</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-6">
              <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-2xl border border-nat-border shadow-sm">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-nat-muted">Current Time</span>
                  <span className="text-sm font-mono font-bold text-nat-primary italic">{time.toFixed(2)}s</span>
                </div>
                <div className="w-[1px] h-8 bg-nat-border"></div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-nat-muted">Max Range</span>
                  <span className="text-sm font-mono font-bold text-nat-primary italic">{maxRange.toFixed(1)}m</span>
                </div>
                <div className="w-[1px] h-8 bg-nat-border"></div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-nat-muted">Max Height</span>
                  <span className="text-sm font-mono font-bold text-nat-primary italic">{maxHeight.toFixed(1)}m</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={resetProjectile} 
                  className="px-5 py-3 bg-white text-nat-dark rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] border border-nat-border hover:bg-nat-panel hover:text-nat-primary transition-all flex items-center gap-2 shadow-sm active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Lab
                </button>
                
                {isPlaying ? (
                  <button 
                    onClick={() => setIsPlaying(false)} 
                    className="px-8 py-3 bg-nat-accent text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-nat-accent/90 transition-all flex items-center gap-2 shadow-lg active:scale-95"
                  >
                    <Pause className="w-4 h-4 fill-current" />
                    Halt
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsPlaying(true)} 
                    className="px-8 py-3 bg-nat-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-nat-primary-hover transition-all flex items-center gap-2 shadow-lg shadow-nat-primary/30 active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    {time > 0 ? "Resume" : "Launch"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'graphs' && (
        <>
          <div className="flex-1 flex flex-col md:flex-row min-h-[400px] bg-white divide-y md:divide-y-0 md:divide-x divide-nat-border overflow-hidden">
            <div className="flex-1 p-8 relative flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-nat-secondary">Vertical Displacement</h4>
                  <p className="text-[10px] text-nat-muted mt-1 leading-relaxed">y = ut + ½at² • (Parabolic Curve)</p>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-bold text-nat-muted uppercase tracking-widest">Max Peak</div>
                  <div className="text-sm font-mono font-bold text-nat-secondary italic">
                    {Math.max(0, (initialVel2 * (initialVel2 / (accel || 1))) + (0.5 * -accel * Math.pow(initialVel2 / (accel || 1), 2))).toFixed(1)}m
                  </div>
                </div>
              </div>
              
              <div className="flex-1 relative min-h-[200px] bg-nat-panel-alt/20 rounded-2xl border border-nat-border/50 border-dashed m-1">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-full p-6 pt-2 pb-2 pl-2 overflow-visible">
                  {/* Grid Lines */}
                  {[0, 25, 50, 75, 100].map(v => (
                    <g key={v}>
                      <line x1="0" y1={v} x2="100" y2={v} stroke="#d5d2c9" strokeWidth="0.5" strokeDasharray="2,2" />
                      <line x1={v} y1="0" x2={v} y2="100" stroke="#d5d2c9" strokeWidth="0.5" strokeDasharray="2,2" />
                    </g>
                  ))}
                  <line x1="0" y1="100" x2="100" y2="100" stroke="#8c9c75" strokeWidth="2" />
                  <line x1="0" y1="0" x2="0" y2="100" stroke="#8c9c75" strokeWidth="2" />
                  
                  <motion.polyline 
                    points={Array.from({length: 101}).map((_, i) => {
                      const t = (i / 100) * maxGraphTime;
                      const d = (initialVel2 * t) - (0.5 * accel * t * t);
                      const displayT = (t / maxGraphTime) * 100;
                      // Scaling d: assuming max d is around 75m for the box
                      const displayD = 100 - (d / 75) * 100;
                      return t <= graphTime ? `${displayT},${displayD}` : '';
                    }).filter(p => p !== '').join(' ')}
                    fill="none" 
                    stroke="#8c9c75" 
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {graphTime > 0 && (
                    <circle 
                      cx={(graphTime / maxGraphTime) * 100} 
                      cy={100 - (((initialVel2 * graphTime) - (0.5 * accel * graphTime * graphTime)) / 75) * 100} 
                      r="4" fill="#8c9c75" 
                    />
                  )}
                </svg>
              </div>
            </div>

            <div className="flex-1 p-8 relative flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-nat-primary">Vertical Velocity</h4>
                  <p className="text-[10px] text-nat-muted mt-1 leading-relaxed">v = u + at • (Linear Slope = Acceleration)</p>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-bold text-nat-muted uppercase tracking-widest">Initial Head</div>
                  <div className="text-sm font-mono font-bold text-nat-primary italic">{initialVel2} m/s</div>
                </div>
              </div>

              <div className="flex-1 relative min-h-[200px] bg-nat-panel-alt/20 rounded-2xl border border-nat-border/50 border-dashed m-1">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-full p-6 pt-2 pb-2 pl-2 overflow-visible">
                  {[0, 25, 50, 75, 100].map(v => (
                    <g key={v}>
                      <line x1="0" y1={v} x2="100" y2={v} stroke="#d5d2c9" strokeWidth="0.5" strokeDasharray="2,2" />
                      <line x1={v} y1="0" x2={v} y2="100" stroke="#d5d2c9" strokeWidth="0.5" strokeDasharray="2,2" />
                    </g>
                  ))}
                  <line x1="0" y1="100" x2="100" y2="100" stroke="#c27a56" strokeWidth="2" />
                  <line x1="0" y1="0" x2="0" y2="100" stroke="#c27a56" strokeWidth="2" />
                  
                  <motion.polyline 
                    points={Array.from({length: 101}).map((_, i) => {
                      const t = (i / 100) * maxGraphTime;
                      const v = initialVel2 - (accel * t);
                      const displayT = (t / maxGraphTime) * 100;
                      // Mapping: v can be negative. 100 = -40, 0 = 40
                      const displayV = 50 - (v / 80) * 100;
                      return t <= graphTime ? `${displayT},${displayV}` : '';
                    }).filter(p => p !== '').join(' ')}
                    fill="none" 
                    stroke="#c27a56" 
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {graphTime > 0 && (
                    <circle 
                      cx={(graphTime / maxGraphTime) * 100} 
                      cy={50 - ((initialVel2 - (accel * graphTime)) / 80) * 100} 
                      r="4" fill="#c27a56" 
                    />
                  )}
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-nat-panel border-t border-nat-border flex flex-col p-8 gap-8 shrink-0">
             <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-5 rounded-2xl border border-nat-border shadow-sm group hover:border-[#8c9c75]/30 transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-[#8c9c75]/10 rounded-lg text-[#8c9c75]">
                      <Gauge className="w-4 h-4" />
                    </div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-nat-dark">Initial Velocity (u)</label>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#8c9c75] bg-nat-light px-2 py-1 rounded border border-nat-border">{initialVel2} m/s</span>
                </div>
                <input 
                  type="range" min="0" max="40" step="1" 
                  value={initialVel2} 
                  onChange={(e) => { setInitialVel2(Number(e.target.value)); resetGraphs(); }}
                  className="w-full h-2 bg-nat-light rounded-lg appearance-none cursor-pointer accent-[#8c9c75]"
                  disabled={playGraphs && graphTime > 0}
                />
              </div>

              <div className="bg-white p-5 rounded-2xl border border-nat-border shadow-sm group hover:border-nat-accent/30 transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-nat-accent/10 rounded-lg text-nat-accent">
                      <Activity className="w-4 h-4" />
                    </div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-nat-dark">Grav. Acceleration (g)</label>
                  </div>
                  <span className="text-xs font-mono font-bold text-nat-accent bg-nat-light px-2 py-1 rounded border border-nat-border">{accel} m/s²</span>
                </div>
                <input 
                  type="range" min="1" max="20" step="0.5" 
                  value={accel} 
                  onChange={(e) => { setAccel(Number(e.target.value)); resetGraphs(); }}
                  className="w-full h-2 bg-nat-light rounded-lg appearance-none cursor-pointer accent-nat-accent"
                  disabled={playGraphs && graphTime > 0}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-2xl border border-nat-border shadow-sm">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-nat-muted">Analysis Time</span>
                  <span className="text-sm font-mono font-bold text-nat-primary italic">{graphTime.toFixed(2)}s</span>
                </div>
                <div className="w-[1px] h-8 bg-nat-border"></div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-nat-muted">Point Velocity</span>
                   <span className="text-sm font-mono font-bold text-nat-primary italic">{(initialVel2 - (accel * graphTime)).toFixed(1)} m/s</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={resetGraphs} 
                  className="px-5 py-3 bg-white text-nat-dark rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] border border-nat-border hover:bg-nat-panel hover:text-nat-primary transition-all flex items-center gap-2 shadow-sm active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear Data
                </button>
                
                {playGraphs ? (
                  <button 
                    onClick={() => setPlayGraphs(false)} 
                    className="px-8 py-3 bg-nat-accent text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-nat-accent/90 transition-all flex items-center gap-2 shadow-lg active:scale-95"
                  >
                    <Pause className="w-4 h-4 fill-current" />
                    Pause
                  </button>
                ) : (
                  <button 
                    onClick={() => setPlayGraphs(true)} 
                    className="px-8 py-3 bg-nat-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-nat-primary-hover transition-all flex items-center gap-2 shadow-lg active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    {graphTime > 0 ? "Resume" : "Plot Logic"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
