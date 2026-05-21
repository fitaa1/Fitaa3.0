import { useEffect, useRef } from "react";

const PARTICLE_COUNT  = 70;
const MAX_SPEED       = 0.28;
const CONNECTION_DIST = 120;
const PARTICLE_RADIUS = 1.2;
const COLOR_RUBY = "rgba(155,18,44,";
const COLOR_GOLD = "rgba(212,175,55,";

interface Particle { x: number; y: number; vx: number; vy: number; color: string; alpha: number; }

function createParticle(w: number, h: number): Particle {
  const isRuby = Math.random() > 0.35;
  return {
    x: Math.random() * w, y: Math.random() * h,
    vx: (Math.random() - 0.5) * MAX_SPEED * 2,
    vy: (Math.random() - 0.5) * MAX_SPEED * 2,
    color: isRuby ? COLOR_RUBY : COLOR_GOLD,
    alpha: 0.22 + Math.random() * 0.4,
  };
}

function CanvasParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let particles: Particle[] = [], afId: number;
    const init = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(canvas.width, canvas.height));
    };
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const la = (1 - dist / CONNECTION_DIST) * 0.12;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `${a.color}${la})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      for (const p of particles) {
        ctx.beginPath(); ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`; ctx.fill();
      }
      afId = requestAnimationFrame(animate);
    };
    init(); animate();
    const ro = new ResizeObserver(init);
    ro.observe(canvas);
    return () => { cancelAnimationFrame(afId); ro.disconnect(); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}

export function ParticleBackground() {
  return (
    <>
      {/* Canvas particles — desktop only */}
      <div className="absolute inset-0 hidden md:block pointer-events-none" aria-hidden="true">
        <CanvasParticles />
      </div>
      {/* CSS ambient glow — mobile */}
      <div
        className="md:hidden absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 20%, rgba(155,18,44,0.18) 0%, transparent 60%)," +
            "radial-gradient(ellipse 60% 50% at 80% 80%, rgba(212,175,55,0.10) 0%, transparent 55%)",
        }}
      />
    </>
  );
}
