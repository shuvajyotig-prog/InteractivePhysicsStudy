import React, { useState } from 'react';

export function OpticsSimulation() {
  const [angle1, setAngle1] = useState(45);
  const [n1, setN1] = useState(1.0); // Air
  const [n2, setN2] = useState(1.5); // Glass

  const angle1Rad = (angle1 * Math.PI) / 180;
  
  // Snell's law: n1 * sin(θ1) = n2 * sin(θ2)
  // sin(θ2) = (n1 / n2) * sin(θ1)
  const sinTheta2 = (n1 / n2) * Math.sin(angle1Rad);
  
  let angle2Rad = 0;
  let isTIR = false; // Total Internal Reflection

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
  const rayLength = 300;

  // Incident ray
  const incX = cx - rayLength * Math.sin(angle1Rad);
  const incY = cy - rayLength * Math.cos(angle1Rad);

  // Refracted ray (if no TIR)
  const refX = cx + rayLength * Math.sin(angle2Rad);
  const refY = cy + rayLength * Math.cos(angle2Rad);

  // Reflected ray
  const reflX = cx + rayLength * Math.sin(angle1Rad);
  const reflY = cy - rayLength * Math.cos(angle1Rad);

  return (
    <div className="bg-white rounded-3xl border border-nat-border shadow-inner relative flex flex-col overflow-hidden w-full">
      <div className="absolute top-6 left-6 z-10 pointer-events-none bg-white/80 p-2 rounded-xl backdrop-blur-sm">
        <h3 className="text-2xl font-serif italic text-nat-dark leading-tight">Interactive Lab: Refraction</h3>
        <p className="text-sm text-nat-muted">Observe Snell's Law & Total Internal Reflection.</p>
      </div>

      <div className="relative flex-1 min-h-[350px] flex items-center justify-center bg-white overflow-hidden">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
          {/* Medium 1 (Top) */}
          <rect x="0" y="0" width={width} height={height/2} fill="#fdfcf9" />
          <text x="20" y="30" fontSize="14" fill="#a05a36" fontWeight="bold">Medium 1 (n₁ = {n1.toFixed(2)})</text>
          
          {/* Medium 2 (Bottom) */}
          <rect x="0" y={height/2} width={width} height={height/2} fill="#eff0e8" opacity="0.6" />
          <text x="20" y={height - 20} fontSize="14" fill="#5a5a40" fontWeight="bold">Medium 2 (n₂ = {n2.toFixed(2)})</text>

          {/* Interface Normal */}
          <line x1={cx} y1="0" x2={cx} y2={height} stroke="#d5d2c9" strokeWidth="2" strokeDasharray="6,6" />
          
          {/* Interface Line */}
          <line x1="0" y1={cy} x2={width} y2={cy} stroke="#8a8a70" strokeWidth="2" />

          {/* Angles Arcs */}
          {/* Incident Arc */}
          <path d={`M ${cx} ${cy - 40} A 40 40 0 0 0 ${cx - 40 * Math.sin(angle1Rad)} ${cy - 40 * Math.cos(angle1Rad)}`} fill="none" stroke="#e11d48" strokeWidth="2" />
          <text x={cx - 15 - 30 * Math.sin(angle1Rad/2)} y={cy - 15 - 30 * Math.cos(angle1Rad/2)} fontSize="12" fill="#e11d48">{angle1}°</text>

          {/* Incident Ray */}
          <line x1={incX} y1={incY} x2={cx} y2={cy} stroke="#e11d48" strokeWidth="4" />
          
          {/* Reflected Ray (faint mostly, bright if TIR) */}
          <line x1={cx} y1={cy} x2={reflX} y2={reflY} stroke="#e11d48" strokeWidth={isTIR ? 4 : 1.5} opacity={isTIR ? 1 : 0.3} />

          {/* Refracted Ray */}
          {!isTIR && (
            <>
              <line x1={cx} y1={cy} x2={refX} y2={refY} stroke="#ea580c" strokeWidth="4" />
              <path d={`M ${cx} ${cy + 40} A 40 40 0 0 1 ${cx + 40 * Math.sin(angle2Rad)} ${cy + 40 * Math.cos(angle2Rad)}`} fill="none" stroke="#ea580c" strokeWidth="2" />
              <text x={cx + 15 + 30 * Math.sin(angle2Rad/2)} y={cy + 15 + 30 * Math.cos(angle2Rad/2)} fontSize="12" fill="#ea580c">{angle2.toFixed(1)}°</text>
            </>
          )}

          {isTIR && (
             <text x={cx + 20} y={cy - 20} fontSize="14" fill="#e11d48" fontWeight="bold">Total Internal Reflection</text>
          )}

        </svg>
      </div>

      <div className="bg-nat-light border-t border-nat-border flex flex-col md:flex-row items-center p-6 md:px-10 gap-8 shrink-0">
        <div className="flex-1 w-full flex gap-6">
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-nat-dark">Incidence θ₁</label>
              <span className="text-xs font-mono text-nat-muted">{angle1}°</span>
            </div>
            <input 
              type="range" 
              min="0" max="89" step="1" 
              value={angle1} 
              onChange={(e) => setAngle1(Number(e.target.value))}
              className="w-full accent-nat-primary"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-nat-dark">Medium 1 (n₁)</label>
              <span className="text-xs font-mono text-nat-muted">{n1.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="1.0" max="2.5" step="0.05" 
              value={n1} 
              onChange={(e) => setN1(Number(e.target.value))}
              className="w-full accent-nat-primary"
            />
          </div>
           <div className="flex-1">
            <div className="flex justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-nat-dark">Medium 2 (n₂)</label>
              <span className="text-xs font-mono text-nat-muted">{n2.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="1.0" max="2.5" step="0.05" 
              value={n2} 
              onChange={(e) => setN2(Number(e.target.value))}
              className="w-full accent-nat-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
