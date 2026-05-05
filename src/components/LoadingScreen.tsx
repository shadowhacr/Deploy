import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Hexagon } from 'lucide-react';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setIsLoading } = useStore();

  // Canvas gradient mesh animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const points = [
      { x: canvas.width * 0.2, y: canvas.height * 0.3, vx: 0.3, vy: 0.2, color: 'rgba(124, 58, 237, 0.15)' },
      { x: canvas.width * 0.8, y: canvas.height * 0.2, vx: -0.2, vy: 0.3, color: 'rgba(6, 182, 212, 0.15)' },
      { x: canvas.width * 0.5, y: canvas.height * 0.7, vx: 0.15, vy: -0.25, color: 'rgba(245, 158, 11, 0.1)' },
      { x: canvas.width * 0.3, y: canvas.height * 0.8, vx: -0.3, vy: -0.15, color: 'rgba(124, 58, 237, 0.1)' },
      { x: canvas.width * 0.7, y: canvas.height * 0.5, vx: 0.25, vy: 0.2, color: 'rgba(6, 182, 212, 0.1)' },
    ];

    let animId: number;
    const animate = () => {
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      points.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 300);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animId);
  }, []);

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => setIsLoading(false), 600);
          }, 300);
          return 100;
        }
        return prev + (Math.random() * 3 + 1);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [setIsLoading]);

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Animated Hexagon */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Hexagon className="w-20 h-20 text-transparent" strokeWidth={1.5}
                style={{
                  stroke: 'url(#hexGradient)',
                  filter: 'drop-shadow(0 0 20px rgba(124, 58, 237, 0.5))',
                }}
              />
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Logo Text */}
            <motion.h1
              className="text-3xl font-bold bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              ShadowDeploy
            </motion.h1>

            {/* Loading Text */}
            <motion.div
              className="text-[#94a3b8] text-sm font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="inline-block min-w-[200px] text-center">
                {progress < 30 && 'Initializing...'}
                {progress >= 30 && progress < 60 && 'Loading Templates...'}
                {progress >= 60 && progress < 85 && 'Preparing Editor...'}
                {progress >= 85 && 'Almost Ready...'}
              </span>
            </motion.div>

            {/* Progress Bar */}
            <div className="w-72 h-2 bg-[#1a1a25] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                  boxShadow: '0 0 20px rgba(124, 58, 237, 0.5)',
                }}
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Template Count */}
            <motion.p
              className="text-[#94a3b8] text-xs font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.span
                key={Math.floor(progress / 10)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {Math.min(Math.floor(progress * 12), 1000)}+ Templates Ready
              </motion.span>
            </motion.p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="fixed inset-0 z-[9999]"
          initial={{ clipPath: 'inset(0 0 0 0)' }}
          animate={{ clipPath: 'inset(0 50% 0 50%)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-full h-full bg-[#0a0a0f]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
