//InteractiveOwl.jsx
import React from 'react';

const InteractiveOwl = ({ state, size = 92, showStatus = true }) => {
  return (
    <div className={`owl-container ${state}`}>
      <svg className="cute-owl" viewBox="0 0 100 100" width={size} height={size}>
        {/* Rama */}
        <rect x="10" y="88" width="80" height="4" rx="2" fill="#3a2a1a" opacity="0.4" />

        {/* Alas plegadas (detrás del cuerpo) */}
        <path d="M 22 45 Q 8 60 18 82 Q 26 70 30 55 Z" fill="#1c2b52" className="owl-wing owl-wing-left" />
        <path d="M 78 45 Q 92 60 82 82 Q 74 70 70 55 Z" fill="#1c2b52" className="owl-wing owl-wing-right" />

        {/* Cuerpo */}
        <ellipse cx="50" cy="58" rx="28" ry="30" fill="#26355f" stroke="#4a7fe8" strokeWidth="2.5" />

        {/* Vientre con plumas en V */}
        <g stroke="#4a7fe8" strokeWidth="1.5" opacity="0.5" fill="none">
          <path d="M 38 55 Q 50 60 62 55" />
          <path d="M 38 63 Q 50 68 62 63" />
          <path d="M 40 71 Q 50 75 60 71" />
        </g>

        {/* Orejas / mechones de plumas */}
        <path d="M 30 30 L 24 14 L 38 26 Z" fill="#26355f" stroke="#4a7fe8" strokeWidth="2" />
        <path d="M 70 30 L 76 14 L 62 26 Z" fill="#26355f" stroke="#4a7fe8" strokeWidth="2" />

        {/* Cabeza */}
        <circle cx="50" cy="34" r="22" fill="#1c2b52" stroke="#4a7fe8" strokeWidth="2.5" />

        {/* Disco facial */}
        <circle cx="50" cy="36" r="17" fill="#141d3d" />

        {/* Ojos */}
        {state === 'thinking' ? (
          <>
            <circle cx="41" cy="35" r="7" fill="#0d1430" stroke="hsla(42, 81%, 20%, 0.80)" strokeWidth="2" />
            <circle cx="59" cy="35" r="7" fill="#0d1430" stroke="#f0b429" strokeWidth="2" />
            <circle cx="41" cy="33" r="2.4" fill="#f0b429" className="owl-pupil-think" />
            <circle cx="59" cy="33" r="2.4" fill="#f0b429" className="owl-pupil-think" />
          </>
        ) : state === 'happy' ? (
          <>
            {/* Ojos felices, entrecerrados */}
            <path d="M 34 35 Q 41 28 48 35" stroke="#f0b429" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 52 35 Q 59 28 66 35" stroke="#f0b429" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <circle cx="41" cy="35" r="7.5" fill="#0d1430" stroke="#f0b429" strokeWidth="2" />
            <circle cx="59" cy="35" r="7.5" fill="#0d1430" stroke="#f0b429" strokeWidth="2" />
            <circle cx="41" cy="35" r="3" fill="#f0b429" className="owl-pupil-idle" />
            <circle cx="59" cy="35" r="3" fill="#f0b429" className="owl-pupil-idle" />
            <circle cx="42.5" cy="33.5" r="1" fill="#fff8e7" />
            <circle cx="60.5" cy="33.5" r="1" fill="#fff8e7" />
          </>
        )}

        {/* Pico */}
        <path d="M 46 44 L 54 44 L 50 51 Z" fill="#f0b429" />

        {/* Garras sobre la rama */}
        <path d="M 42 86 L 40 91 M 42 86 L 44 91" stroke="#f0b429" strokeWidth="2" strokeLinecap="round" />
        <path d="M 58 86 L 56 91 M 58 86 L 60 91" stroke="#f0b429" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {showStatus && (
        <div className="owl-status">
          {state === 'thinking' ? 'PoliBúho está pensando…' : 'PoliBúho en línea'}
        </div>
      )}
    </div>
  );
};

export default InteractiveOwl;