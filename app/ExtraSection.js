import React, { useEffect, useRef } from "react";

// Game Dev Sandbox: pixel-art mini arena with player, enemies, bullets, particles, and debug overlay
export default function ExtraSection({ primaryColor = "#000000", accentColor = "#FF0000" }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Logical pixel-art resolution (16:9)
    const LOGICAL_WIDTH = 320; // a bit wider than 240 for more room
    const LOGICAL_HEIGHT = 180; // keeps 16:9

    // Offscreen canvas for pixel-art rendering
    const offscreen = document.createElement("canvas");
    offscreen.width = LOGICAL_WIDTH;
    offscreen.height = LOGICAL_HEIGHT;
    const octx = offscreen.getContext("2d");

    // Input state
    const keys = new Set();
    const mouse = { x: LOGICAL_WIDTH / 2, y: LOGICAL_HEIGHT / 2, down: false };

    const settings = {
      paused: false,
      showOverlay: true,
      reducedMotion: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      enemyCount: 8,
      maxBullets: 40,
    };

    // Utility
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const rand = (a, b) => Math.random() * (b - a) + a;
    const hexToRgb = (hex) => {
      const p = hex.replace('#', '');
      const b = parseInt(p.length === 3 ? p.split('').map(c => c + c).join('') : p, 16);
      return { r: (b >> 16) & 255, g: (b >> 8) & 255, b: b & 255 };
    };
    const prgb = hexToRgb(primaryColor);
    const ar = hexToRgb(accentColor);

    // World entities
    const player = {
      x: LOGICAL_WIDTH * 0.5,
      y: LOGICAL_HEIGHT * 0.7,
      vx: 0,
      vy: 0,
      speed: settings.reducedMotion ? 45 : 70,
      radius: 3,
      hp: 3,
      invuln: 0,
    };

    /** Walls are rectangles (x, y, w, h) */
    const walls = [];
    const makeWalls = () => {
      walls.length = 0;
      // Outer bounds (leave small margin for visual border)
      walls.push({ x: 2, y: 2, w: LOGICAL_WIDTH - 4, h: 1 });
      walls.push({ x: 2, y: LOGICAL_HEIGHT - 3, w: LOGICAL_WIDTH - 4, h: 1 });
      walls.push({ x: 2, y: 2, w: 1, h: LOGICAL_HEIGHT - 4 });
      walls.push({ x: LOGICAL_WIDTH - 3, y: 2, w: 1, h: LOGICAL_HEIGHT - 4 });
      // A few interior blocks
      for (let i = 0; i < 5; i++) {
        const w = Math.floor(rand(10, 24));
        const h = Math.floor(rand(4, 10));
        const x = Math.floor(rand(8, LOGICAL_WIDTH - w - 8));
        const y = Math.floor(rand(8, LOGICAL_HEIGHT - h - 8));
        walls.push({ x, y, w, h });
      }
    };

    /** Enemies are simple seekers */
    const enemies = [];
    const spawnEnemy = () => {
      const e = {
        x: rand(10, LOGICAL_WIDTH - 10),
        y: rand(10, LOGICAL_HEIGHT - 10),
        vx: 0,
        vy: 0,
        speed: settings.reducedMotion ? rand(16, 26) : rand(20, 34),
        radius: 3,
        jitter: rand(0, Math.PI * 2),
      };
      enemies.push(e);
    };

    /** Bullets are small fast projectiles */
    const bullets = [];

    /** Particles for effects */
    const particles = [];
    const spawnParticles = (x, y, color, count = 10) => {
      for (let i = 0; i < count; i++) {
        const a = rand(0, Math.PI * 2);
        const sp = rand(15, 60);
        particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: rand(0.25, 0.6),
          age: 0,
          color,
        });
      }
    };

    // Populate world
    makeWalls();
    for (let i = 0; i < settings.enemyCount; i++) spawnEnemy();

    // Resize handling: fit canvas while keeping crisp pixels
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const cw = Math.max(1, rect.width);
      const ch = Math.max(1, rect.height);
      canvas.width = cw;
      canvas.height = ch;
      ctx.imageSmoothingEnabled = false;
    };
    resize();
    window.addEventListener("resize", resize);

    // Input handlers
    const onKeyDown = (e) => {
      if (e.repeat) return;
      keys.add(e.code);
      if (e.code === 'Space') settings.paused = !settings.paused;
      if (e.code === 'KeyE') settings.showOverlay = !settings.showOverlay;
    };
    const onKeyUp = (e) => { keys.delete(e.code); };
    const toLogical = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = rect.width / LOGICAL_WIDTH;
      const scaleY = rect.height / LOGICAL_HEIGHT;
      const sx = clientX - rect.left;
      const sy = clientY - rect.top;
      return { x: sx / scaleX, y: sy / scaleY };
    };
    const onMouseMove = (e) => {
      const p = toLogical(e.clientX, e.clientY);
      mouse.x = p.x; mouse.y = p.y;
    };
    const onMouseDown = (e) => {
      mouse.down = true;
      const p = toLogical(e.clientX, e.clientY);
      mouse.x = p.x; mouse.y = p.y;
      shootToward(p.x, p.y);
    };
    const onMouseUp = () => { mouse.down = false; };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('mousemove', onMouseMove, { passive: true });
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Physics helpers
    const rectsOverlap = (ax, ay, aw, ah, bx, by, bw, bh) => (
      ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
    );

    const collideCircleRect = (cx, cy, r, rx, ry, rw, rh) => {
      const nearestX = clamp(cx, rx, rx + rw);
      const nearestY = clamp(cy, ry, ry + rh);
      const dx = cx - nearestX;
      const dy = cy - nearestY;
      return dx * dx + dy * dy < r * r;
    };

    const resolveCircleRect = (entity, rect) => {
      // Push circle out of rectangle along smallest axis overlap
      const { x, y, radius } = entity;
      if (!collideCircleRect(x, y, radius, rect.x, rect.y, rect.w, rect.h)) return;
      // Compute overlap
      const left = (x - radius) - (rect.x + rect.w);
      const right = (rect.x) - (x + radius);
      const top = (y - radius) - (rect.y + rect.h);
      const bottom = (rect.y) - (y + radius);
      const maxLeft = Math.abs(left);
      const maxRight = Math.abs(right);
      const maxTop = Math.abs(top);
      const maxBottom = Math.abs(bottom);
      const minPen = Math.min(maxLeft, maxRight, maxTop, maxBottom);
      if (minPen === maxLeft) entity.x = rect.x + rect.w + radius;
      else if (minPen === maxRight) entity.x = rect.x - radius;
      else if (minPen === maxTop) entity.y = rect.y + rect.h + radius;
      else entity.y = rect.y - radius;
      // Damp velocity on collision
      entity.vx *= 0.5;
      entity.vy *= 0.5;
    };

    // Shooting
    const shootToward = (tx, ty) => {
      if (bullets.length >= settings.maxBullets) return;
      const dx = tx - player.x;
      const dy = ty - player.y;
      const d = Math.hypot(dx, dy) || 1;
      const speed = 120;
      bullets.push({ x: player.x, y: player.y, vx: (dx / d) * speed, vy: (dy / d) * speed, life: 1.4 });
      spawnParticles(player.x, player.y, `rgba(${ar.r}, ${ar.g}, ${ar.b}, 0.9)`, 6);
    };

    // Update/Render loop
    let last = performance.now();
    let fps = 60;

    const update = (dt) => {
      if (settings.paused) return;

      const accel = settings.reducedMotion ? 140 : 210;
      const friction = 0.86;
      let ax = 0, ay = 0;
      if (keys.has('KeyW') || keys.has('ArrowUp')) ay -= 1;
      if (keys.has('KeyS') || keys.has('ArrowDown')) ay += 1;
      if (keys.has('KeyA') || keys.has('ArrowLeft')) ax -= 1;
      if (keys.has('KeyD') || keys.has('ArrowRight')) ax += 1;
      const len = Math.hypot(ax, ay) || 1;
      ax /= len; ay /= len;
      player.vx += ax * accel * dt;
      player.vy += ay * accel * dt;

      player.vx *= friction;
      player.vy *= friction;

      const maxSpeed = player.speed * (keys.has('ShiftLeft') ? 1.4 : 1);
      const vmag = Math.hypot(player.vx, player.vy);
      if (vmag > maxSpeed) {
        player.vx = (player.vx / vmag) * maxSpeed;
        player.vy = (player.vy / vmag) * maxSpeed;
      }

      player.x += player.vx * dt;
      player.y += player.vy * dt;

      // Walls collision for player
      for (const w of walls) resolveCircleRect(player, w);

      // Enemies seek player with slight jitter
      for (const e of enemies) {
        const dx = player.x - e.x + Math.cos(e.jitter + performance.now() * 0.001) * 6;
        const dy = player.y - e.y + Math.sin(e.jitter + performance.now() * 0.001) * 6;
        const d = Math.hypot(dx, dy) || 1;
        const sp = e.speed * (settings.reducedMotion ? 0.7 : 1);
        e.vx = (dx / d) * sp;
        e.vy = (dy / d) * sp;
        e.x += e.vx * dt;
        e.y += e.vy * dt;
        // Collide against walls
        for (const w of walls) resolveCircleRect(e, w);

        // Enemy hits player
        const pdx = e.x - player.x;
        const pdy = e.y - player.y;
        if (pdx * pdx + pdy * pdy < (e.radius + player.radius) ** 2 && player.invuln <= 0) {
          player.hp = Math.max(0, player.hp - 1);
          player.invuln = 1.2;
          spawnParticles(player.x, player.y, `rgba(255,255,255,0.9)`, 12);
        }
      }

      if (player.invuln > 0) player.invuln -= dt;

      // Bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.life -= dt;
        if (b.life <= 0 || b.x < 0 || b.y < 0 || b.x > LOGICAL_WIDTH || b.y > LOGICAL_HEIGHT) {
          bullets.splice(i, 1);
          continue;
        }
        // Bullet vs walls
        let hitWall = false;
        for (const w of walls) {
          if (collideCircleRect(b.x, b.y, 1.5, w.x, w.y, w.w, w.h)) { hitWall = true; break; }
        }
        if (hitWall) {
          spawnParticles(b.x, b.y, `rgba(${ar.r}, ${ar.g}, ${ar.b}, 0.6)`, 8);
          bullets.splice(i, 1);
          continue;
        }
        // Bullet vs enemies
        for (let j = enemies.length - 1; j >= 0; j--) {
          const e = enemies[j];
          const dx = b.x - e.x;
          const dy = b.y - e.y;
          if (dx * dx + dy * dy < (e.radius + 1.5) ** 2) {
            spawnParticles(e.x, e.y, `rgba(${ar.r}, ${ar.g}, ${ar.b}, 0.9)`, 14);
            enemies.splice(j, 1);
            bullets.splice(i, 1);
            spawnEnemy();
            break;
          }
        }
      }

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.96; p.vy *= 0.96;
        p.age += dt;
        if (p.age >= p.life) particles.splice(i, 1);
      }
    };

    const draw = () => {
      // Background: blueprint grid inspired by primaryColor
      octx.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
      octx.fillStyle = `rgb(${prgb.r}, ${prgb.g}, ${prgb.b})`;
      octx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

      // Grid lines
      const gridStep = 8;
      octx.globalAlpha = 0.15;
      octx.strokeStyle = `rgb(${ar.r}, ${ar.g}, ${ar.b})`;
      octx.lineWidth = 1;
      octx.beginPath();
      for (let x = 0; x <= LOGICAL_WIDTH; x += gridStep) {
        octx.moveTo(x + 0.5, 0);
        octx.lineTo(x + 0.5, LOGICAL_HEIGHT);
      }
      for (let y = 0; y <= LOGICAL_HEIGHT; y += gridStep) {
        octx.moveTo(0, y + 0.5);
        octx.lineTo(LOGICAL_WIDTH, y + 0.5);
      }
      octx.stroke();
      octx.globalAlpha = 1;

      // Walls
      octx.fillStyle = `rgba(${ar.r}, ${ar.g}, ${ar.b}, 0.18)`;
      octx.strokeStyle = `rgba(${ar.r}, ${ar.g}, ${ar.b}, 0.6)`;
      for (const w of walls) {
        octx.fillRect(w.x, w.y, w.w, w.h);
        octx.strokeRect(w.x + 0.5, w.y + 0.5, w.w - 1, w.h - 1);
      }

      // Enemies
      for (const e of enemies) {
        // Base fill
        octx.fillStyle = `rgba(255,255,255,0.92)`;
        octx.beginPath();
        octx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        octx.fill();
        // Accent outline
        octx.lineWidth = 1;
        octx.strokeStyle = `rgba(${ar.r}, ${ar.g}, ${ar.b}, 1)`;
        octx.stroke();
        // Center dot for readability
        octx.fillStyle = `rgba(${ar.r}, ${ar.g}, ${ar.b}, 0.95)`;
        octx.fillRect(Math.round(e.x) - 1, Math.round(e.y) - 1, 2, 2);
      }

      // Bullets
      octx.fillStyle = `rgba(${ar.r}, ${ar.g}, ${ar.b}, 0.95)`;
      for (const b of bullets) {
        octx.fillRect(b.x - 1, b.y - 1, 2, 2);
      }

      // Player (triangle ship)
      const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
      const flicker = (player.invuln > 0) ? (Math.sin(performance.now() * 0.02) > 0 ? 0.2 : 1) : 1;
      octx.save();
      octx.translate(player.x, player.y);
      octx.rotate(angle);
      octx.globalAlpha = flicker;
      octx.fillStyle = `rgb(${ar.r}, ${ar.g}, ${ar.b})`;
      octx.beginPath();
      octx.moveTo(player.radius + 2, 0);
      octx.lineTo(-player.radius, player.radius);
      octx.lineTo(-player.radius, -player.radius);
      octx.closePath();
      octx.fill();
      octx.restore();

      // Particles
      for (const p of particles) {
        const t = 1 - p.age / p.life;
        octx.globalAlpha = Math.max(0, t);
        octx.fillStyle = p.color;
        octx.fillRect(p.x - 1, p.y - 1, 2, 2);
      }
      octx.globalAlpha = 1;

      // Overlay / HUD
      if (settings.showOverlay) {
        octx.fillStyle = `rgba(255,255,255,0.9)`;
        octx.font = '6px monospace';
        octx.textBaseline = 'top';
        octx.fillText(`Game Dev Sandbox`, 4, 4);
        octx.fillText(`FPS: ${Math.round(fps)}`, 4, 12);
        octx.fillText(`Entities: E${enemies.length} B${bullets.length} P${particles.length}`, 4, 20);
        octx.fillText(`WASD move  |  Click shoot  |  Space pause  |  E overlay`, 4, LOGICAL_HEIGHT - 10);
      }

      // Post-process: subtle vignette
      const grad = octx.createRadialGradient(
        LOGICAL_WIDTH / 2,
        LOGICAL_HEIGHT / 2,
        Math.min(LOGICAL_WIDTH, LOGICAL_HEIGHT) * 0.25,
        LOGICAL_WIDTH / 2,
        LOGICAL_HEIGHT / 2,
        Math.max(LOGICAL_WIDTH, LOGICAL_HEIGHT) * 0.6
      );
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.25)');
      octx.fillStyle = grad;
      octx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

      // Upscale to screen with pixelated look
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
    };

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      // Moving average FPS
      fps = fps * 0.9 + (1 / dt) * 0.1;
      last = now;
      update(dt);
      draw();
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [primaryColor, accentColor]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}
