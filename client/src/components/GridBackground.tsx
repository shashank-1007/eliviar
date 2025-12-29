import { motion } from "framer-motion";

export function GridBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Base Grid */}
      <div 
        className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(120, 120, 120, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(120, 120, 120, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Animated Moving Gradient Blob */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]"
      />
      
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
          delay: 2
        }}
        className="absolute bottom-[-20%] right-[20%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]"
      />
    </div>
  );
}
