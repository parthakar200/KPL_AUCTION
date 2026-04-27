import { useRef, useEffect } from 'react';

export default function Confetti({ trigger }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width, y: -10,
      r: Math.random() * 8 + 4,
      c: `hsl(${Math.random() * 360},80%,60%)`,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 4 + 2,
      rot: Math.random() * 360,
      rsp: (Math.random() - 0.5) * 6,
    }));
    let frame = 0;
    let raf;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.5);
        ctx.restore();
        p.x += p.vx; p.y += p.vy; p.rot += p.rsp; p.vy += 0.08;
      });
      frame++;
      if (frame < 120) raf = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, [trigger]);

  return <canvas id="confetti-canvas" ref={canvasRef} />;
}
