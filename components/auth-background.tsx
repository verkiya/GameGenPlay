"use client"

import { motion } from "framer-motion"

const shapes = [
  { id: 1, size: 60, left: "10%", type: "square", delay: 0, duration: 20 },
  { id: 2, size: 120, left: "85%", type: "circle", delay: 2, duration: 25 },
  { id: 3, size: 80, left: "40%", type: "square", delay: 5, duration: 18 },
  { id: 4, size: 40, left: "70%", type: "circle", delay: 1, duration: 22 },
  { id: 5, size: 90, left: "20%", type: "square", delay: 4, duration: 24 },
  { id: 6, size: 50, left: "90%", type: "square", delay: 3, duration: 19 },
  { id: 7, size: 70, left: "55%", type: "circle", delay: 7, duration: 21 },
]

export function AuthBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-zinc-950">
      {/* 1. Perspective Grid (Engine Viewport) */}
      <div 
        className="absolute inset-0 origin-bottom"
        style={{ perspective: "800px" }}
      >
        <motion.div
          animate={{
            translateY: [0, 48],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute left-[-50%] top-[-50%] h-[200%] w-[200%]"
          style={{
            transform: "rotateX(60deg)",
            backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* 2. Dynamic Ambient Lighting */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ 
            opacity: [0.1, 0.25, 0.1], 
            scale: [1, 1.2, 1],
            x: [0, 150, 0],
            y: [0, -100, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-[600px] w-[600px] rounded-full bg-primary blur-[120px]"
        />
        <motion.div
          animate={{ 
            opacity: [0.05, 0.15, 0.05], 
            scale: [1, 1.4, 1],
            x: [0, -200, 0],
            y: [0, 150, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-[500px] w-[500px] rounded-full bg-orange-600 blur-[100px]"
        />
      </div>

      {/* 3. Floating Geometric Primitives (Game Assets) */}
      <div className="absolute inset-0 overflow-hidden">
        {shapes.map((shape) => (
          <motion.div
            key={shape.id}
            initial={{ y: "100vh", opacity: 0, rotate: 0 }}
            animate={{ 
              y: "-50vh", 
              opacity: [0, 1, 1, 0], 
              rotate: 360 
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              delay: shape.delay,
              ease: "linear",
            }}
            style={{
              left: shape.left,
              width: shape.size,
              height: shape.size,
            }}
            className={`absolute bottom-[-20%] border border-primary/30 bg-primary/5 backdrop-blur-[2px] ${
              shape.type === "circle" ? "rounded-full" : "rounded-xl"
            }`}
          />
        ))}
      </div>

      {/* 4. Noise Texture */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="h-full w-full opacity-[0.03]"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
          }}
        />
      </div>
    </div>
  )
}
