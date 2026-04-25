import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Activity, PlaySquare } from 'lucide-react';
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
  const [initialVel2, setInitialVel2] = useState(0);
  const [accel, setAccel] = useState(5);
  const [playGraphs, setPlayGraphs] = useState(false);
  const [graphTime, setGraphTime] = useState(0);

  const g = 9.81;
  const angleRad = (angle * Math.PI) / 180;
  
  const vx = velocity * Math.cos(angleRad);
  const vy = velocity * Math.sin(angleRad);
  
  const flightTime = (2 * vy) / g;
  const maxHeight = Math.pow(vy, 2) / (2 * g);
  const maxRange = vx * flightTime;

  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const maxGraphTime = 10;

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const progress = (timestamp - startTimeRef.current) / 1000; // in seconds

    if (activeTab === 'projectile') {
      const simTime = progress * 2; 
      if (simTime < flightTime) {
        setTime(simTime);
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setTime(flightTime);
        setIsPlaying(false);
      }
    } else {
      const gTime = progress;
      if (gTime < maxGraphTime) {
        setGraphTime(gTime);
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

          <div className="bg-nat-light border-t border-nat-border flex flex-col md:flex-row items-center p-6 md:px-10 gap-8 shrink-0">
            <div className="flex-1 w-full flex gap-8">
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-nat-dark">Velocity (u)</label>
                  <span className="text-xs font-mono text-nat-muted">{velocity} m/s</span>
                </div>
                <input 
                  type="range" 
                  min="5" max="40" step="1" 
                  value={velocity} 
                  onChange={(e) => { setVelocity(Number(e.target.value)); resetProjectile(); }}
                  className="w-full accent-nat-primary"
                  disabled={isPlaying && time > 0}
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-nat-dark">Angle (θ)</label>
                  <span className="text-xs font-mono text-nat-muted">{angle}°</span>
                </div>
                <input 
                  type="range" 
                  min="10" max="80" step="1" 
                  value={angle} 
                  onChange={(e) => { setAngle(Number(e.target.value)); resetProjectile(); }}
                  className="w-full accent-nat-primary"
                  disabled={isPlaying && time > 0}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
              <div className="flex gap-4 mr-4 text-[10px] uppercase font-bold text-nat-muted tracking-wide text-right">
                <div>
                  <div className="mb-0.5">Time</div>
                  <div className="font-mono text-nat-primary">{time.toFixed(1)}s</div>
                </div>
                <div>
                  <div className="mb-0.5">Range</div>
                  <div className="font-mono text-nat-primary">{maxRange.toFixed(0)}m</div>
                </div>
              </div>

              <button onClick={resetProjectile} className="px-4 py-3 bg-white text-nat-dark rounded-full text-xs font-bold uppercase tracking-widest border border-nat-border hover:bg-nat-panel transition-colors">
                Reset
              </button>
              
              {isPlaying ? (
                <button onClick={() => setIsPlaying(false)} className="px-6 py-3 bg-[#c27a56] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#a05a36] transition-colors">
                  Pause
                </button>
              ) : (
                <button onClick={() => setIsPlaying(true)} className="px-6 py-3 bg-nat-primary text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-nat-primary-hover transition-colors">
                  {time > 0 ? "Resume" : "Run"}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'graphs' && (
        <>
          <div className="flex-1 flex flex-col md:flex-row min-h-[350px] bg-white divide-y md:divide-y-0 md:divide-x divide-nat-border">
            <div className="flex-1 p-6 relative h-[250px] md:h-auto">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#8c9c75] mb-2 z-10 relative">Displacement-Time (s-t)</h4>
              <p className="text-[10px] text-nat-muted mb-4 z-10 relative max-w-[200px]">Slope = Velocity. Curve indicates acceleration.</p>
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-full p-4 pt-16 pb-8 pl-8 overflow-visible">
                <line x1="0" y1="100" x2="100" y2="100" stroke="#d5d2c9" strokeWidth="2" />
                <line x1="0" y1="0" x2="0" y2="100" stroke="#d5d2c9" strokeWidth="2" />
                <polyline 
                  points={Array.from({length: Math.floor(graphTime * 10)}).map((_, i) => {
                    const t = i / 10;
                    const d = (initialVel2 * t) + (0.5 * accel * t * t);
                    return `${(t / maxGraphTime) * 100},${100 - Math.min((d / 200) * 100, 100)}`;
                  }).join(' ')}
                  fill="none" stroke="#8c9c75" strokeWidth="3"
                />
              </svg>
            </div>
            <div className="flex-1 p-6 relative h-[250px] md:h-auto">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#c27a56] mb-2 z-10 relative">Velocity-Time (v-t)</h4>
               <p className="text-[10px] text-nat-muted mb-4 z-10 relative max-w-[200px]">Slope = Acceleration. Area under curve = Displacement.</p>
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-full p-4 pt-16 pb-8 pl-8 overflow-visible">
                <line x1="0" y1="100" x2="100" y2="100" stroke="#d5d2c9" strokeWidth="2" />
                <line x1="0" y1="0" x2="0" y2="100" stroke="#d5d2c9" strokeWidth="2" />
                 <polyline 
                  points={Array.from({length: Math.floor(graphTime * 10)}).map((_, i) => {
                    const t = i / 10;
                    const v = initialVel2 + (accel * t);
                    return `${(t / maxGraphTime) * 100},${100 - Math.min((v / 60) * 100, 100)}`;
                  }).join(' ')}
                  fill="none" stroke="#c27a56" strokeWidth="3"
                />
              </svg>
            </div>
          </div>

          <div className="bg-nat-light border-t border-nat-border flex flex-col md:flex-row items-center p-6 md:px-10 gap-8 shrink-0">
            <div className="flex-1 w-full flex gap-8">
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-nat-dark">Initial Velocity (u)</label>
                  <span className="text-xs font-mono text-nat-muted">{initialVel2} m/s</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="25" step="1" 
                  value={initialVel2} 
                  onChange={(e) => { setInitialVel2(Number(e.target.value)); resetGraphs(); }}
                  className="w-full accent-nat-primary"
                  disabled={playGraphs && graphTime > 0}
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-nat-dark">Acceleration (a)</label>
                  <span className="text-xs font-mono text-nat-muted">{accel} m/s²</span>
                </div>
                <input 
                  type="range" 
                  min="-5" max="10" step="1" 
                  value={accel} 
                  onChange={(e) => { setAccel(Number(e.target.value)); resetGraphs(); }}
                  className="w-full accent-nat-primary"
                  disabled={playGraphs && graphTime > 0}
                />
              </div>
            </div>
            
             <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
               <div className="flex gap-4 mr-4 text-[10px] uppercase font-bold text-nat-muted tracking-wide text-right">
                <div>
                  <div className="mb-0.5">Time</div>
                  <div className="font-mono text-nat-primary">{graphTime.toFixed(1)}s</div>
                </div>
              </div>

               <button onClick={resetGraphs} className="px-4 py-3 bg-white text-nat-dark rounded-full text-xs font-bold uppercase tracking-widest border border-nat-border hover:bg-nat-panel transition-colors">
                Reset
              </button>
              
              {playGraphs ? (
                <button onClick={() => setPlayGraphs(false)} className="px-6 py-3 bg-[#c27a56] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#a05a36] transition-colors">
                  Pause
                </button>
              ) : (
                <button onClick={() => setPlayGraphs(true)} className="px-6 py-3 bg-nat-primary text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-nat-primary-hover transition-colors">
                  {graphTime > 0 ? "Resume" : "Run"}
                </button>
              )}
             </div>
          </div>
        </>
      )}
    </div>
  );
}
