import React, { useEffect, useRef, useState } from 'react';
import { X, Sparkles } from 'lucide-react';

/**
 * CartCelebrationOverlay
 * Renders immersive, festival-themed celebratory canvas particle spectacles
 * inside the Cart window when a discount/privilege code is successfully verified.
 * 
 * Supported Themes:
 * - diwali: Glowing earthen earthen diyas with flickering flames + radiant firecracker sparkler bursts
 * - holi: Vibrant organic blooming gulal color powder splashes & pichkari splatters
 * - cyberpunk: Neon cyan & magenta laser matrix lines and glitch sparks
 * - luxury_gold: 3D tumbling royal gold medallions, coins & shimmering glitter dust
 * - hearts: Floating glowing romantic hearts & rose petals
 * - sparkles: Classic couture confetti streamers & diamond starbursts
 */
export default function CartCelebrationOverlay({ theme = 'sparkles', promoCode, discountLabel, onClose }) {
  const canvasRef = useRef(null);
  const [visible, setVisible] = useState(true);

  // Auto-dismiss after 4.8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 4800);
    return () => clearTimeout(timer);
  }, [onClose]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // ==========================================
    // THEME-SPECIFIC PARTICLE INITIALIZATION
    // ==========================================
    const normalizedTheme = (theme || 'sparkles').toLowerCase();

    // 1. DIWALI THEME
    // Diyas rising gracefully + firecracker bursts
    const diwaliDiyas = [];
    const diwaliSparks = [];
    if (normalizedTheme === 'diwali') {
      const diyaCount = Math.min(8, Math.max(5, Math.floor(width / 70)));
      for (let i = 0; i < diyaCount; i++) {
        diwaliDiyas.push({
          x: (width / (diyaCount + 1)) * (i + 1) + (Math.random() * 20 - 10),
          y: height + Math.random() * 80 + i * 35,
          vy: 0.8 + Math.random() * 0.5,
          baseY: height,
          wobbleSpeed: 0.02 + Math.random() * 0.02,
          wobbleOffset: Math.random() * Math.PI * 2,
          size: 20 + Math.random() * 8,
          flamePhase: Math.random() * Math.PI * 2,
          alpha: 0
        });
      }

      // Firecracker launch triggers
      const spawnFirecracker = (cx, cy) => {
        const count = 30;
        const colors = ['#FBBF24', '#F59E0B', '#EF4444', '#F43F5E', '#FFFFFF', '#FDE047'];
        for (let j = 0; j < count; j++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.5 + Math.random() * 4.5;
          diwaliSparks.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            gravity: 0.06,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            size: 2 + Math.random() * 2.5,
            decay: 0.015 + Math.random() * 0.02,
            crackle: Math.random() > 0.5
          });
        }
      };

      // Periodic cracker bursts
      setTimeout(() => spawnFirecracker(width * 0.25, height * 0.35), 300);
      setTimeout(() => spawnFirecracker(width * 0.75, height * 0.28), 700);
      setTimeout(() => spawnFirecracker(width * 0.5, height * 0.45), 1200);
      setTimeout(() => spawnFirecracker(width * 0.3, height * 0.2), 2000);
      setTimeout(() => spawnFirecracker(width * 0.7, height * 0.22), 2600);
    }

    // 2. HOLI THEME
    // Vibrant expanding gulal pigment clouds & high-speed color powder splashes
    const holiClouds = [];
    const holiSplashes = [];
    if (normalizedTheme === 'holi') {
      const holiColors = [
        '#F43F5E', // Vivid Gulal Pink
        '#06B6D4', // Turquoise Blue
        '#EAB308', // Haldi Yellow
        '#84CC16', // Neon Green
        '#A855F7', // Royal Purple
        '#F97316'  // Saffron Orange
      ];

      // Create initial blooming bursts of powder
      const burstPoints = [
        { x: width * 0.25, y: height * 0.35 },
        { x: width * 0.75, y: height * 0.4 },
        { x: width * 0.5, y: height * 0.25 },
        { x: width * 0.3, y: height * 0.6 },
        { x: width * 0.7, y: height * 0.65 }
      ];

      burstPoints.forEach((pt, bIdx) => {
        // Soft cloud puff
        for (let c = 0; c < 7; c++) {
          const angle = (Math.PI * 2 / 7) * c + Math.random() * 0.4;
          const dist = Math.random() * 25;
          holiClouds.push({
            x: pt.x + Math.cos(angle) * dist,
            y: pt.y + Math.sin(angle) * dist,
            vx: Math.cos(angle) * (1.2 + Math.random() * 2.2),
            vy: Math.sin(angle) * (1.2 + Math.random() * 2.2) - 0.3,
            radius: 24 + Math.random() * 32,
            growth: 0.6 + Math.random() * 0.5,
            color: holiColors[(bIdx + c) % holiColors.length],
            alpha: 0.85,
            decay: 0.008 + Math.random() * 0.007
          });
        }

        // Pichkari splatter dots
        for (let s = 0; s < 18; s++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2.5 + Math.random() * 5.5;
          holiSplashes.push({
            x: pt.x,
            y: pt.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            gravity: 0.08,
            color: holiColors[Math.floor(Math.random() * holiColors.length)],
            radius: 2.5 + Math.random() * 4,
            alpha: 0.95,
            decay: 0.012 + Math.random() * 0.015
          });
        }
      });
    }

    // 3. CYBERPUNK THEME
    // Neon matrix streams & laser glitch sparks
    const cyberSparks = [];
    const cyberLines = [];
    if (normalizedTheme === 'cyberpunk') {
      const colors = ['#06B6D4', '#F43F5E', '#A855F7', '#22D3EE', '#FFFFFF'];
      for (let i = 0; i < 45; i++) {
        cyberSparks.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 1.5 + Math.random() * 3,
          alpha: 1,
          decay: 0.015 + Math.random() * 0.02
        });
      }
      for (let i = 0; i < 15; i++) {
        cyberLines.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.4,
          speed: 4 + Math.random() * 6,
          length: 30 + Math.random() * 60,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.8
        });
      }
    }

    // 4. LUXURY GOLD THEME
    // Royal gold coins tumbling in 3D + metallic shimmer dust
    const goldCoins = [];
    const goldDust = [];
    if (normalizedTheme === 'luxury_gold') {
      for (let i = 0; i < 22; i++) {
        goldCoins.push({
          x: Math.random() * width,
          y: -30 - Math.random() * 200,
          vy: 1.8 + Math.random() * 2.2,
          radius: 12 + Math.random() * 7,
          rot: Math.random() * Math.PI,
          rotSpeed: 0.04 + Math.random() * 0.05,
          tilt: Math.random() * 0.4 - 0.2,
          wobble: Math.random() * Math.PI * 2,
          alpha: 1
        });
      }
      for (let i = 0; i < 50; i++) {
        goldDust.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1,
          vy: 0.5 + Math.random() * 1.5,
          size: 1.5 + Math.random() * 2.5,
          twinkle: Math.random() * Math.PI * 2,
          alpha: 0.8
        });
      }
    }

    // 5. HEARTS THEME
    // Floating glowing romantic hearts & rose petals
    const romanticHearts = [];
    if (normalizedTheme === 'hearts') {
      for (let i = 0; i < 24; i++) {
        romanticHearts.push({
          x: Math.random() * width,
          y: height + 20 + Math.random() * 250,
          vy: 1.2 + Math.random() * 1.6,
          size: 14 + Math.random() * 14,
          wobbleOffset: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.03 + Math.random() * 0.02,
          color: Math.random() > 0.4 ? '#F43F5E' : '#EC4899',
          alpha: 0.9
        });
      }
    }

    // 6. SPARKLES / DEFAULT THEME
    // Metallic confetti & diamond starbursts
    const confettiPieces = [];
    if (normalizedTheme === 'sparkles' || (!['diwali', 'holi', 'cyberpunk', 'luxury_gold', 'hearts'].includes(normalizedTheme))) {
      const colors = ['#FBBF24', '#F472B6', '#60A5FA', '#34D399', '#A78BFA', '#F3F4F6', '#E5E7EB'];
      for (let i = 0; i < 60; i++) {
        confettiPieces.push({
          x: Math.random() * width,
          y: -20 - Math.random() * 200,
          w: 6 + Math.random() * 6,
          h: 10 + Math.random() * 8,
          vx: (Math.random() - 0.5) * 2,
          vy: 2 + Math.random() * 3,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: 0.05 + Math.random() * 0.08,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1
        });
      }
    }

    // ==========================================
    // ANIMATION RENDER LOOP
    // ==========================================
    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // --- RENDER: DIWALI ---
      if (normalizedTheme === 'diwali') {
        // Draw firecracker sparks
        for (let i = diwaliSparks.length - 1; i >= 0; i--) {
          const s = diwaliSparks[i];
          s.x += s.vx;
          s.y += s.vy;
          s.vy += s.gravity;
          s.vx *= 0.98;
          s.alpha -= s.decay;

          if (s.alpha <= 0) {
            diwaliSparks.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = Math.max(0, s.alpha);
          ctx.fillStyle = s.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = s.color;

          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();

          // Spark crackle stars
          if (s.crackle && frame % 4 === 0) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(s.x - 1, s.y - 1, 3, 3);
          }
          ctx.restore();
        }

        // Draw rising glowing earthen Diyas
        diwaliDiyas.forEach((diya) => {
          diya.y -= diya.vy;
          diya.flamePhase += 0.15;
          const wobble = Math.sin(frame * diya.wobbleSpeed + diya.wobbleOffset) * 12;
          const curX = diya.x + wobble;
          const curY = diya.y;

          // Fade in as it enters
          if (diya.alpha < 1) diya.alpha = Math.min(1, diya.alpha + 0.03);

          ctx.save();
          ctx.globalAlpha = diya.alpha;

          // 1. Warm radial golden halo glow around flame
          const flameSize = diya.size * 0.55;
          const flameTipY = curY - diya.size * 0.5;
          const glowGrad = ctx.createRadialGradient(curX, flameTipY, 2, curX, flameTipY, diya.size * 2);
          glowGrad.addColorStop(0, 'rgba(251, 191, 36, 0.7)');
          glowGrad.addColorStop(0.4, 'rgba(245, 158, 11, 0.35)');
          glowGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(curX, flameTipY, diya.size * 2, 0, Math.PI * 2);
          ctx.fill();

          // 2. Terracotta Clay Diya Body (earthen curved boat shape)
          ctx.fillStyle = '#9A3412'; // Rich burnt sienna clay
          ctx.strokeStyle = '#D97706'; // Golden rim highlight
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(curX, curY, diya.size * 0.9, diya.size * 0.4, 0, 0, Math.PI);
          ctx.fill();
          ctx.stroke();

          // Golden embellished rim
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.ellipse(curX, curY, diya.size * 0.9, diya.size * 0.18, 0, 0, Math.PI * 2);
          ctx.fill();

          // 3. Flickering Golden Flame
          const flickerY = Math.sin(diya.flamePhase) * 2;
          const flameGrad = ctx.createLinearGradient(curX, curY - 2, curX, flameTipY + flickerY);
          flameGrad.addColorStop(0, '#EF4444'); // Crimson base
          flameGrad.addColorStop(0.3, '#F59E0B'); // Warm amber
          flameGrad.addColorStop(0.8, '#FDE047'); // Bright yellow
          flameGrad.addColorStop(1, '#FFFFFF'); // Pure white holy tip

          ctx.fillStyle = flameGrad;
          ctx.beginPath();
          ctx.moveTo(curX - flameSize * 0.5, curY - 2);
          ctx.quadraticCurveTo(curX - flameSize * 0.6, flameTipY + flickerY + flameSize * 0.4, curX, flameTipY + flickerY);
          ctx.quadraticCurveTo(curX + flameSize * 0.6, flameTipY + flickerY + flameSize * 0.4, curX + flameSize * 0.5, curY - 2);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        });
      }

      // --- RENDER: HOLI ---
      else if (normalizedTheme === 'holi') {
        // Draw soft expanding gulal powder clouds
        for (let i = holiClouds.length - 1; i >= 0; i--) {
          const c = holiClouds[i];
          c.x += c.vx;
          c.y += c.vy;
          c.vx *= 0.96;
          c.vy *= 0.96;
          c.radius += c.growth;
          c.growth *= 0.97;
          c.alpha -= c.decay;

          if (c.alpha <= 0) {
            holiClouds.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = Math.max(0, c.alpha);

          const grad = ctx.createRadialGradient(c.x, c.y, 2, c.x, c.y, c.radius);
          grad.addColorStop(0, c.color);
          grad.addColorStop(0.5, c.color + '99');
          grad.addColorStop(1, c.color + '00');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Draw flying pichkari droplet splatters
        for (let i = holiSplashes.length - 1; i >= 0; i--) {
          const s = holiSplashes[i];
          s.x += s.vx;
          s.y += s.vy;
          s.vy += s.gravity;
          s.vx *= 0.98;
          s.alpha -= s.decay;

          if (s.alpha <= 0) {
            holiSplashes.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = Math.max(0, s.alpha);
          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // --- RENDER: CYBERPUNK ---
      else if (normalizedTheme === 'cyberpunk') {
        // Laser scanlines
        cyberLines.forEach((line) => {
          line.y += line.speed;
          if (line.y > height) {
            line.y = -line.length;
            line.x = Math.random() * width;
          }
          ctx.save();
          ctx.strokeStyle = line.color;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = line.alpha;
          ctx.shadowBlur = 8;
          ctx.shadowColor = line.color;
          ctx.beginPath();
          ctx.moveTo(line.x, line.y);
          ctx.lineTo(line.x, line.y + line.length);
          ctx.stroke();
          ctx.restore();
        });

        // Glitch sparks
        for (let i = cyberSparks.length - 1; i >= 0; i--) {
          const s = cyberSparks[i];
          s.x += s.vx;
          s.y += s.vy;
          s.alpha -= s.decay;
          if (s.alpha <= 0) {
            s.alpha = 1;
            s.x = Math.random() * width;
            s.y = Math.random() * height;
          }
          ctx.save();
          ctx.fillStyle = s.color;
          ctx.globalAlpha = s.alpha;
          ctx.shadowBlur = 6;
          ctx.shadowColor = s.color;
          ctx.fillRect(s.x, s.y, s.size * 2, s.size);
          ctx.restore();
        }
      }

      // --- RENDER: LUXURY GOLD ---
      else if (normalizedTheme === 'luxury_gold') {
        // Falling gold dust
        goldDust.forEach((d) => {
          d.y += d.vy;
          d.x += d.vx;
          d.twinkle += 0.1;
          if (d.y > height) d.y = -10;
          const alpha = 0.4 + Math.sin(d.twinkle) * 0.4;
          ctx.save();
          ctx.fillStyle = '#FDE047';
          ctx.globalAlpha = alpha;
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#FBBF24';
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // 3D spinning gold coins
        goldCoins.forEach((c) => {
          c.y += c.vy;
          c.rot += c.rotSpeed;
          c.wobble += 0.04;
          const scaleX = Math.cos(c.rot);

          ctx.save();
          ctx.translate(c.x + Math.sin(c.wobble) * 15, c.y);
          ctx.scale(scaleX, 1);

          // Coin body
          const coinGrad = ctx.createLinearGradient(-c.radius, -c.radius, c.radius, c.radius);
          coinGrad.addColorStop(0, '#FDE047');
          coinGrad.addColorStop(0.5, '#F59E0B');
          coinGrad.addColorStop(1, '#B45309');
          ctx.fillStyle = coinGrad;
          ctx.strokeStyle = '#FEF08A';
          ctx.lineWidth = 1.5;

          ctx.beginPath();
          ctx.arc(0, 0, c.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // AVZ monogram on coin face
          if (Math.abs(scaleX) > 0.4) {
            ctx.fillStyle = '#78350F';
            ctx.font = `bold ${Math.floor(c.radius * 0.7)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('₹', 0, 0);
          }
          ctx.restore();
        });
      }

      // --- RENDER: HEARTS ---
      else if (normalizedTheme === 'hearts') {
        romanticHearts.forEach((h) => {
          h.y -= h.vy;
          const wobble = Math.sin(frame * h.wobbleSpeed + h.wobbleOffset) * 15;
          const curX = h.x + wobble;

          ctx.save();
          ctx.translate(curX, h.y);
          ctx.globalAlpha = h.alpha;
          ctx.fillStyle = h.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = h.color;

          // Draw heart path
          const s = h.size / 15;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-5 * s, -10 * s, -15 * s, -5 * s, -15 * s, 5 * s);
          ctx.bezierCurveTo(-15 * s, 15 * s, 0, 22 * s, 0, 25 * s);
          ctx.bezierCurveTo(0, 22 * s, 15 * s, 15 * s, 15 * s, 5 * s);
          ctx.bezierCurveTo(15 * s, -5 * s, 5 * s, -10 * s, 0, 0);
          ctx.fill();
          ctx.restore();
        });
      }

      // --- RENDER: SPARKLES / DEFAULT ---
      else {
        confettiPieces.forEach((p) => {
          p.y += p.vy;
          p.x += p.vx;
          p.rot += p.rotSpeed;
          if (p.y > height) {
            p.y = -20;
            p.x = Math.random() * width;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  if (!visible) return null;

  // Theme metadata banner config
  const themeDetails = {
    diwali: {
      title: 'SHUBH DIWALI PRIVILEGE',
      subtitle: 'Auspicious festive discount applied with golden diyas & crackers',
      icon: '🪔',
      border: 'border-amber-400/40',
      bg: 'bg-gradient-to-r from-amber-950/90 via-black/90 to-amber-950/90',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.35)]',
      text: 'text-amber-300'
    },
    holi: {
      title: 'RANGOTSAV • HOLI SPECIAL CELEBRATION',
      subtitle: 'Festival of colors discount unlocked with vibrant gulal splash',
      icon: '🎨',
      border: 'border-pink-500/40',
      bg: 'bg-gradient-to-r from-purple-950/90 via-black/90 to-pink-950/90',
      glow: 'shadow-[0_0_30px_rgba(236,72,153,0.35)]',
      text: 'text-pink-300'
    },
    cyberpunk: {
      title: 'CYBER PROTOCOL • CIPHER OVERRIDE ACTIVE',
      subtitle: 'Matrix algorithmic discount applied to your order',
      icon: '⚡',
      border: 'border-cyan-400/40',
      bg: 'bg-gradient-to-r from-cyan-950/90 via-black/90 to-fuchsia-950/90',
      glow: 'shadow-[0_0_30px_rgba(6,182,212,0.35)]',
      text: 'text-cyan-300'
    },
    luxury_gold: {
      title: 'STUDIO ROYAL RESERVE PRIVILEGE',
      subtitle: 'Couture gold medallion privilege unlocked on your order',
      icon: '🪙',
      border: 'border-yellow-400/40',
      bg: 'bg-gradient-to-r from-yellow-950/90 via-black/90 to-amber-950/90',
      glow: 'shadow-[0_0_30px_rgba(234,179,8,0.35)]',
      text: 'text-yellow-300'
    },
    hearts: {
      title: 'LOVERS\' COUTURE PRIVILEGE ACTIVE',
      subtitle: 'Bespoke romance savings applied to your selected pieces',
      icon: '💖',
      border: 'border-rose-400/40',
      bg: 'bg-gradient-to-r from-rose-950/90 via-black/90 to-pink-950/90',
      glow: 'shadow-[0_0_30px_rgba(244,63,94,0.35)]',
      text: 'text-rose-300'
    },
    sparkles: {
      title: 'STUDIO PRIVILEGE CODE UNLOCKED',
      subtitle: 'Special celebratory savings applied to your cart bag',
      icon: '✨',
      border: 'border-purple-400/40',
      bg: 'bg-gradient-to-r from-purple-950/90 via-black/90 to-zinc-950/90',
      glow: 'shadow-[0_0_30px_rgba(168,85,247,0.35)]',
      text: 'text-purple-300'
    }
  };

  const currentTheme = themeDetails[theme?.toLowerCase()] || themeDetails.sparkles;

  return (
    <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden flex flex-col justify-between p-4 animate-fade-in select-none">
      {/* Background Interactive Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Celebration Announcement Banner (Top of Cart) */}
      <div className="relative pointer-events-auto z-50 mx-auto w-full max-w-sm pt-2 animate-bounce-short">
        <div className={`p-3 rounded-2xl border ${currentTheme.border} ${currentTheme.bg} ${currentTheme.glow} backdrop-blur-md flex items-center justify-between gap-3`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-2xl filter drop-shadow animate-pulse">{currentTheme.icon}</span>
            <div className="min-w-0">
              <div className={`text-[11px] font-mono font-bold uppercase tracking-wider ${currentTheme.text} flex items-center gap-1.5`}>
                <span>{currentTheme.title}</span>
              </div>
              <p className="text-[10px] font-mono text-zinc-300 truncate">
                {promoCode ? `Code ${promoCode} applied • ` : ''}{discountLabel || 'Exclusive Discount Unlocked'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setVisible(false);
              onClose?.();
            }}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Dismiss celebration"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Dismiss Hint */}
      <div className="relative pointer-events-auto z-50 text-center pb-2">
        <button
          onClick={() => {
            setVisible(false);
            onClose?.();
          }}
          className="text-[9px] font-mono uppercase tracking-widest text-zinc-400/80 hover:text-white bg-black/50 px-3 py-1 rounded-full border border-white/10 backdrop-blur cursor-pointer transition-colors"
        >
          Tap to skip animation
        </button>
      </div>
    </div>
  );
}

