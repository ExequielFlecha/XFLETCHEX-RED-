
import React, { useMemo } from 'react';

const GalaxyBackground: React.FC = () => {
  // Generamos estrellas de fondo (estáticas pero con centelleo)
  const twinklingStars = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => ({
      id: `twinkle-${i}`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      duration: `${Math.random() * 3 + 2}s`,
      delay: `${Math.random() * 5}s`,
    }));
  }, []);

  // Generamos estrellas que caen
  const fallingStars = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: `fall-${i}`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      duration: `${Math.random() * 5 + 5}s`,
      delay: `${Math.random() * 10}s`,
    }));
  }, []);

  return (
    <div className="fixed inset-0 -z-50 bg-[#020205] overflow-hidden pointer-events-none">
      {/* Nebulosas profundas para dar color al vacío */}
      <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-purple-900/10 rounded-full nebula-glow"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-900/10 rounded-full nebula-glow" style={{ animationDelay: '-5s' }}></div>
      <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] bg-red-900/5 rounded-full nebula-glow" style={{ animationDelay: '-10s' }}></div>

      {/* Capa 1: Estrellas de fondo (Centelleantes) */}
      <div className="absolute inset-0">
        {twinklingStars.map((s) => (
          <div
            key={s.id}
            className="absolute bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              animation: `twinkle ${s.duration} infinite ease-in-out ${s.delay}`,
            }}
          />
        ))}
      </div>

      {/* Capa 2: Estrellas que caen con estela y brillo */}
      <div className="absolute inset-0">
        {fallingStars.map((s) => (
          <div
            key={s.id}
            className="falling-star"
            style={{
              left: s.left,
              width: s.size,
              height: s.size,
              animation: `star-fall ${s.duration} infinite linear ${s.delay}`,
            }}
          />
        ))}
      </div>

      {/* Efecto de partículas de polvo espacial (muy sutil) */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[length:40px_40px]"></div>
      </div>

      {/* Overlay de viñeta para profundidad */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]"></div>
    </div>
  );
};

export default GalaxyBackground;
