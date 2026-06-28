import React, { useEffect, useRef } from 'react';

const BackgroundAnimation = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const mousePos = { x: 0, y: 0 };
  const particles = [];
  const lines = [];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Initialize grid lines
      lines.length = 0;
      const spacing = 50;
      for (let x = 0; x <= canvas.width; x += spacing) {
        lines.push({
          x1: x, y1: 0, x2: x, y2: canvas.height,
          alpha: 0.05,
          maxAlpha: 0.05
        });
      }
      for (let y = 0; y <= canvas.height; y += spacing) {
        lines.push({
          x1: 0, y1: y, x2: canvas.width, y2: y,
          alpha: 0.05,
          maxAlpha: 0.05
        });
      }
    };

    const onMouseMove = (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', onMouseMove);
    resizeCanvas();

    // Animation loop
    let animationFrame;
    const animate = () => {
      // Validate context
      if (!ctxRef.current) {
        cancelAnimationFrame(animationFrame);
        return;
      }
      const ctx = ctxRef.current;

      // Clear with dark translucent background
      ctx.fillStyle = 'rgba(0, 5, 15, 0.8)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines with subtle pulse
      lines.forEach(line => {
        // Skip if line object missing
        if (!line) return;
        // Pulse effect based on mouse distance
        const dx = mousePos.x - (line.x1 + line.x2) / 2;
        const dy = mousePos.y - (line.y1 + line.y2) / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = Math.max(canvas.width, canvas.height) / 2;
        const intensity = Math.max(0, 1 - distance / maxDistance);

        line.alpha = line.maxAlpha * (0.5 + intensity * 0.5);

        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        // Fix color: ensure alpha is a number between 0 and 1
        const alpha = Math.min(1, Math.max(0, line.alpha * 0.5));
        ctx.strokeStyle = `rgba(0, 100, 250, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // Add particles near mouse occasionally
      if (Math.random() < 0.3) { // Add particles intermittently
        particles.push({
          x: mousePos.x + (Math.random() - 0.5) * 20,
          y: mousePos.y + (Math.random() - 0.5) * 20,
          radius: Math.random() * 2 + 1,
          life: 0,
          maxLife: Math.random() * 60 + 40,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          hue: 180 + Math.random() * 60, // Cyan to blue
          saturation: 70 + Math.random() * 20,
          lightness: 50 + Math.random() * 20
        });
        particles[particles.length - 1].life = particles[particles.length - 1].maxLife;
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (!p) continue;

        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Apply gentle drift away from mouse
        const dx = p.x - mousePos.x;
        const dy = p.y - mousePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          const force = 0.02 * (1 - distance / 100);
          p.vx += (dx / distance) * force;
          p.vy += (dy / distance) * force;
        }

        // Slow down
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Update life
        p.life--;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle with glow
        const lifeRatio = p.life / p.maxLife;
        const alpha = Math.min(1, Math.max(0, lifeRatio * 0.6));
        const size = p.radius * (0.5 + lifeRatio * 0.5);

        // Outer glow
        ctx.save();
        ctx.shadowColor = `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${alpha * 0.3})`;
        ctx.shadowBlur = size * 2;

        // Main particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${alpha})`;
        ctx.fill();

        ctx.restore();
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', onMouseMove);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1, background: 'transparent' }} />;
};

export default BackgroundAnimation;