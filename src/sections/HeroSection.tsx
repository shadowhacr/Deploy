import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  // Particle network animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const PARTICLE_COUNT = 80;
    const CONNECTION_DISTANCE = 150;
    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; color: string;
    }> = [];

    const colors = ['rgba(124, 58, 237, 0.6)', 'rgba(6, 182, 212, 0.6)', 'rgba(245, 158, 11, 0.4)'];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1;

        // Mouse attraction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          p.vx += dx * 0.0001;
          p.vy += dy * 0.0001;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.15 * (1 - dist / CONNECTION_DISTANCE)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const stats = [
    { value: '1000+', label: 'Templates' },
    { value: '50K+', label: 'Deployments' },
    { value: '2', label: 'Free Daily' },
    { value: '99.9%', label: 'Uptime' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: '#0a0a0f' }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.08) 0%, transparent 60%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-[900px] mx-auto px-6 pt-20">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#12121a] border border-[#27273a] mb-8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300, delay: 0.3 }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: '#10b981', boxShadow: '0 0 10px #10b981' }}
          />
          <span className="text-sm text-[#94a3b8]">1000+ Premium Templates</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span
            className="bg-clip-text text-transparent animate-gradient"
            style={{
              backgroundImage: 'linear-gradient(90deg, #7c3aed, #06b6d4, #f59e0b, #7c3aed)',
              backgroundSize: '300% 100%',
              animation: 'gradientShift 6s ease infinite',
            }}
          >
            Build & Deploy Websites
          </span>
          <br />
          <span className="text-white">in Seconds</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl text-[#94a3b8] mb-10 max-w-[600px] mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Choose from 1000+ stunning templates, customize with ease, and deploy your website instantly. No coding required.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button
            onClick={() => navigate('/templates')}
            className="h-14 px-8 text-lg font-semibold rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] hover:from-[#6d28d9] hover:to-[#0891b2] text-white transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:-translate-y-1"
          >
            <LayoutGrid className="w-5 h-5 mr-2" />
            Explore Templates
          </Button>
          <Button
            variant="outline"
            className="h-14 px-8 text-lg font-semibold rounded-xl border-[#27273a] text-white hover:bg-[#12121a] hover:border-[#7c3aed]/50 transition-all duration-300"
          >
            <Play className="w-5 h-5 mr-2" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[700px] mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-[#94a3b8] mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}
