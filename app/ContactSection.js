import React, { useEffect, useRef } from 'react';

// Interactive particle constellation with parallax, glow, and ripple effects
export default function ContactSection({
  primaryColor = '#0A0A0A',
  accentColor = '#00FFFF',
  particleCount = 180,
  enableInteractivity = true,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const state = {
      width: 0,
      height: 0,
      particles: [],
      maxConnectionsPerParticle: 4,
      baseCount: particleCount,
      mouse: { x: null, y: null, active: false },
      ripples: [],
      prefersReducedMotion: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    };

    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
    const rand = (min, max) => Math.random() * (max - min) + min;
    const hexToRgb = (hex) => {
      const parsed = hex.replace('#', '');
      const bigint = parseInt(parsed.length === 3
        ? parsed.split('').map((c) => c + c).join('')
        : parsed, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return { r, g, b };
    };
    const accentRgb = hexToRgb(accentColor);
    const primaryRgb = hexToRgb(primaryColor);

    const setSize = () => {
      const { clientWidth, clientHeight } = canvas;
      state.width = clientWidth;
      state.height = clientHeight;
      canvas.width = Math.floor(clientWidth * dpr);
      canvas.height = Math.floor(clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Scale particle count with area, keep within bounds
      const area = state.width * state.height;
      const scale = area / (1200 * 700);
      const target = Math.round(clamp(state.baseCount * scale, 120, 360));
      // Add or remove particles to match target
      if (state.particles.length < target) {
        const toAdd = target - state.particles.length;
        for (let i = 0; i < toAdd; i++) state.particles.push(createParticle());
      } else if (state.particles.length > target) {
        state.particles.length = target;
      }
    };

    const createParticle = () => {
      const depth = rand(0.6, 1.6); // parallax/depth factor
      const speed = rand(0.1, 0.7) / depth;
      const size = rand(1.2, 2.8) / Math.sqrt(depth);
      return {
        x: rand(0, state.width || canvas.clientWidth || 1),
        y: rand(0, state.height || canvas.clientHeight || 1),
        vx: rand(-speed, speed),
        vy: rand(-speed, speed),
        size,
        depth,
        twinkleOffset: Math.random() * Math.PI * 2,
        linkCount: 0,
      };
    };

    const drawBackground = () => {
      // Soft radial gradient using primary color
      const gradient = ctx.createRadialGradient(
        state.width * 0.7,
        state.height * 0.3,
        50,
        state.width * 0.5,
        state.height * 0.5,
        Math.max(state.width, state.height) * 0.9
      );
      const p = primaryRgb;
      gradient.addColorStop(0, `rgba(${p.r}, ${p.g}, ${p.b}, 0.90)`);
      gradient.addColorStop(1, `rgba(${p.r}, ${p.g}, ${p.b}, 1)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, state.width, state.height);
    };

    const update = () => {
      for (const particle of state.particles) {
        if (!state.prefersReducedMotion) {
          particle.x += particle.vx;
          particle.y += particle.vy;
        }

        // Bounce softly on edges
        if (particle.x < 0) { particle.x = 0; particle.vx = Math.abs(particle.vx); }
        if (particle.x > state.width) { particle.x = state.width; particle.vx = -Math.abs(particle.vx); }
        if (particle.y < 0) { particle.y = 0; particle.vy = Math.abs(particle.vy); }
        if (particle.y > state.height) { particle.y = state.height; particle.vy = -Math.abs(particle.vy); }

        // Mouse attraction
        if (enableInteractivity && state.mouse.active && state.mouse.x != null) {
          const dx = state.mouse.x - particle.x;
          const dy = state.mouse.y - particle.y;
          const dist2 = dx * dx + dy * dy;
          const radius = 140 * particle.depth;
          if (dist2 < radius * radius) {
            const force = 0.0025 / (1 + dist2);
            particle.vx += dx * force;
            particle.vy += dy * force;
          }
        }
      }

      // Ripples: outward impulse
      state.ripples = state.ripples.filter((r) => r.alpha > 0.02);
      for (const ripple of state.ripples) {
        ripple.radius += ripple.speed;
        ripple.alpha *= 0.985;
        for (const particle of state.particles) {
          const dx = particle.x - ripple.x;
          const dy = particle.y - ripple.y;
          const dist = Math.hypot(dx, dy);
          const ring = Math.abs(dist - ripple.radius);
          if (ring < 12) {
            const impulse = (12 - ring) * 0.015 / particle.depth;
            const nx = dx / (dist || 1);
            const ny = dy / (dist || 1);
            particle.vx += nx * impulse;
            particle.vy += ny * impulse;
          }
        }
      }
    };

    const draw = () => {
      drawBackground();

      // Lines between nearby particles
      const maxDistance = Math.min(180, Math.max(110, Math.min(state.width, state.height) * 0.20));
      const acc = accentRgb;
      for (let i = 0; i < state.particles.length; i++) {
        const a = state.particles[i];
        a.linkCount = 0;
      }
      for (let i = 0; i < state.particles.length; i++) {
        const a = state.particles[i];
        for (let j = i + 1; j < state.particles.length; j++) {
          const b = state.particles[j];
          if (a.linkCount >= state.maxConnectionsPerParticle && b.linkCount >= state.maxConnectionsPerParticle) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < maxDistance * maxDistance) {
            const dist = Math.sqrt(dist2);
            const t = 1 - dist / maxDistance; // proximity factor
            const alpha = clamp(0.08 + t * 0.22, 0.08, 0.3) * (2 / (a.depth + b.depth));
            ctx.strokeStyle = `rgba(${acc.r}, ${acc.g}, ${acc.b}, ${alpha.toFixed(3)})`;
            ctx.lineWidth = clamp(1 + t * 1.5, 0.75, 2.5);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            a.linkCount++;
            b.linkCount++;
          }
        }
      }

      // Particles with glow and twinkle
      ctx.shadowColor = `rgba(${acc.r}, ${acc.g}, ${acc.b}, 0.8)`;
      for (const p of state.particles) {
        const twinkle = 0.6 + 0.4 * Math.sin(p.twinkleOffset + performance.now() / (800 + p.depth * 600));
        const size = p.size * twinkle;
        ctx.shadowBlur = 8 * (2 / p.depth);
        ctx.fillStyle = `rgba(${acc.r}, ${acc.g}, ${acc.b}, ${clamp(0.65 * twinkle, 0.35, 0.9).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw ripples
      for (const r of state.ripples) {
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${acc.r}, ${acc.g}, ${acc.b}, ${r.alpha.toFixed(3)})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    };

    const frame = () => {
      update();
      draw();
      rafRef.current = requestAnimationFrame(frame);
    };

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      state.mouse.x = x;
      state.mouse.y = y;
      state.mouse.active = true;
    };
    const onPointerLeave = () => { state.mouse.active = false; };
    const onClick = (e) => {
      if (!enableInteractivity) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      state.ripples.push({ x, y, radius: 4, alpha: 0.45, speed: 5 });
    };

    setSize();
    // Initialize particles if empty
    if (state.particles.length === 0) {
      const initial = Math.round(clamp(state.baseCount, 120, 360));
      for (let i = 0; i < initial; i++) state.particles.push(createParticle());
    }

    window.addEventListener('resize', setSize);
    canvas.addEventListener('mousemove', onPointerMove, { passive: true });
    canvas.addEventListener('mouseleave', onPointerLeave, { passive: true });
    canvas.addEventListener('touchstart', onPointerMove, { passive: true });
    canvas.addEventListener('touchmove', onPointerMove, { passive: true });
    canvas.addEventListener('touchend', onPointerLeave, { passive: true });
    canvas.addEventListener('click', onClick, { passive: true });

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', setSize);
      canvas.removeEventListener('mousemove', onPointerMove);
      canvas.removeEventListener('mouseleave', onPointerLeave);
      canvas.removeEventListener('touchstart', onPointerMove);
      canvas.removeEventListener('touchmove', onPointerMove);
      canvas.removeEventListener('touchend', onPointerLeave);
      canvas.removeEventListener('click', onClick);
    };
  }, [primaryColor, accentColor, particleCount, enableInteractivity]);

  return (
    <div style={{ width: '100vw', height: '100vh' }} className="relative">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />
    </div>
  );
}
