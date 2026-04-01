import React from 'react';
import { motion } from 'motion/react';

export function ChristmasLights() {
  const lights = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    color: ['#ff0000', '#00ff00', '#ffff00', '#0000ff', '#ffffff'][i % 5],
    delay: i * 0.2,
  }));

  return (
    <div className="absolute top-0 left-0 w-full h-4 flex justify-around pointer-events-none z-50 overflow-hidden">
      {lights.map((light) => (
        <div key={light.id} className="relative flex flex-col items-center">
          {/* Wire */}
          <div className="w-px h-2 bg-neutral-700" />
          {/* Bulb */}
          <motion.div
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.9, 1.1, 0.9],
              boxShadow: [
                `0 0 5px ${light.color}`,
                `0 0 15px ${light.color}`,
                `0 0 5px ${light.color}`,
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: light.delay,
              ease: "easeInOut",
            }}
            className="w-2 h-3 rounded-full"
            style={{ backgroundColor: light.color }}
          />
        </div>
      ))}
      
      {/* Hanging Garland Effect */}
      <svg className="absolute top-0 left-0 w-full h-4 opacity-20" preserveAspectRatio="none">
        <path
          d="M0,2 Q50,8 100,2 T200,2 T300,2 T400,2 T500,2 T600,2 T700,2 T800,2 T900,2 T1000,2"
          fill="none"
          stroke="#1a472a"
          strokeWidth="2"
          strokeDasharray="4 2"
        />
      </svg>
    </div>
  );
}
