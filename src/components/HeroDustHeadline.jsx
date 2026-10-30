import React, { useEffect, useRef, useState } from 'react';

/**
 * Ultra-Fast, 60fps-Smooth Stardust Materialization Headline
 * Fast, crisp cosmic dust grains rush in and assemble into the sharp letterforms
 * within ~0.6s. Zero lag, zero blur, subpixel-crisp vector typography handoff.
 */
export default function HeroDustHeadline({
  headline1 = 'WEARABLE ART.',
  headline2 = 'NOT MADE TO REPEAT.'
}) {
  const containerRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const canvasRef = useRef(null);

  const [isDusting, setIsDusting] = useState(true);
  const [showDomText, setShowDomText] = useState(false);
  const [isAssembled, setIsAssembled] = useState(false);
  const animFrameRef = useRef(null);

  useEffect(() => {
    // Snappy 120ms start for immediate visual feedback without awkward lag
    const timer = setTimeout(() => {
      triggerDustAssembly();
    }, 120);

    return () => {
      clearTimeout(timer);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [headline1, headline2]);

  const triggerDustAssembly = async () => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const l1 = line1Ref.current;
    if (!container || !canvas || !l1) return;

    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch (e) {
        // Continue gracefully
      }
    }

    const containerRect = container.getBoundingClientRect();
    if (containerRect.width === 0 || containerRect.height === 0) return;

    const r1 = l1.getBoundingClientRect();
    const r2 = line2Ref.current ? line2Ref.current.getBoundingClientRect() : null;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const marginX = 100;
    const marginY = 80;
    const totalW = containerRect.width + marginX * 2;
    const totalH = containerRect.height + marginY * 2;

    canvas.width = Math.round(totalW * dpr);
    canvas.height = Math.round(totalH * dpr);
    canvas.style.width = `${totalW}px`;
    canvas.style.height = `${totalH}px`;
    canvas.style.left = `${-marginX}px`;
    canvas.style.top = `${-marginY}px`;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    const computed = window.getComputedStyle(l1);
    const fontSize = parseFloat(computed.fontSize) || 48;
    const fontFamily = computed.fontFamily || "'Cinzel', serif";
    const fontWeight = computed.fontWeight || '700';

    // Offscreen canvas for sampling target letter coordinates
    const offCanvas = document.createElement('canvas');
    offCanvas.width = Math.round(totalW);
    offCanvas.height = Math.round(totalH);
    const offCtx = offCanvas.getContext('2d');
    if (!offCtx) return;

    offCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    if ('letterSpacing' in offCtx) {
      offCtx.letterSpacing = computed.letterSpacing !== 'normal' ? computed.letterSpacing : '0.05em';
    }
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';

    // Luxury Royal Gradient
    const textGrad = offCtx.createLinearGradient(marginX, 0, totalW - marginX, totalH);
    textGrad.addColorStop(0.0, '#ffffff');
    textGrad.addColorStop(0.15, '#fce7f3');
    textGrad.addColorStop(0.35, '#f472b6');
    textGrad.addColorStop(0.55, '#ec4899');
    textGrad.addColorStop(0.75, '#be185d');
    textGrad.addColorStop(0.9, '#f472b6');
    textGrad.addColorStop(1.0, '#ffffff');

    offCtx.fillStyle = textGrad;

    const x1 = Math.round(r1.left + r1.width / 2 - containerRect.left + marginX);
    const y1 = Math.round(r1.top + r1.height / 2 - containerRect.top + marginY);
    offCtx.fillText(headline1, x1, y1);

    if (r2 && headline2) {
      const x2 = Math.round(r2.left + r2.width / 2 - containerRect.left + marginX);
      const y2 = Math.round(r2.top + r2.height / 2 - containerRect.top + marginY);
      offCtx.fillText(headline2, x2, y2);
    }

    const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
    const pixels = imgData.data;

    // Collect solid candidate pixels
    const candidates = [];
    const step = 3; // Optimal 3px step ensures sharp letter definition with zero frame lag

    for (let y = 0; y < offCanvas.height; y += step) {
      for (let x = 0; x < offCanvas.width; x += step) {
        const idx = (y * offCanvas.width + x) * 4;
        const alpha = pixels[idx + 3];
        if (alpha > 70) {
          candidates.push({
            x,
            y,
            r: pixels[idx],
            g: pixels[idx + 1],
            b: pixels[idx + 2],
            a: alpha / 255
          });
        }
      }
    }

    // Limit to max 1,100 particles for locked 60fps/120fps performance
    const maxParticles = 1100;
    const stride = Math.max(1, Math.floor(candidates.length / maxParticles));
    const particles = [];

    for (let i = 0; i < candidates.length; i += stride) {
      const c = candidates[i];
      // Scattered starting cloud from perimeter
      const angle = Math.atan2(c.y - totalH / 2, c.x - totalW / 2) + (Math.random() - 0.5) * 1.4;
      const dist = 90 + Math.random() * 180;
      const startX = c.x + Math.cos(angle) * dist + (Math.random() - 0.5) * 60;
      const startY = c.y + Math.sin(angle) * dist - (30 + Math.random() * 70);

      // Pre-compute trajectory and colors once to eliminate in-loop math
      const targetX = c.x;
      const targetY = c.y;
      const deltaX = targetX - startX;
      const deltaY = targetY - startY;

      // Stagger by horizontal position: left letters assemble first, sweeping rapidly to right
      const xProgress = targetX / totalW;
      const delay = Math.round(xProgress * 14 + (i % 8) * 1.2);
      const duration = Math.round(20 + (i % 12)); // Fast 20-32 frame flight (~0.4s)

      particles.push({
        targetX,
        targetY,
        startX,
        startY,
        deltaX,
        deltaY,
        delay,
        duration,
        curveOffset: (Math.random() - 0.5) * 35,
        colorMid: `rgba(${c.r}, ${c.g}, ${c.b}, 0.85)`,
        colorFinal: `rgba(${c.r}, ${c.g}, ${c.b}, 1)`
      });
    }

    let frame = 0;
    const totalFrames = 38; // Whole animation executes in ~0.6 seconds

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, totalW, totalH);

      const len = particles.length;
      for (let i = 0; i < len; i++) {
        const p = particles[i];
        const elapsed = frame - p.delay;

        if (elapsed <= 0) continue;

        if (elapsed >= p.duration) {
          // Locked into position with crisp 1.5px stardust pixel
          ctx.fillStyle = p.colorFinal;
          ctx.fillRect(p.targetX, p.targetY, 1.5, 1.5);
          continue;
        }

        const t = elapsed / p.duration;
        // Cubic ease-out: rapid acceleration then snappy settling
        const ease = 1 - (1 - t) * (1 - t) * (1 - t);
        const damp = (1 - ease);

        // Integer coordinates eliminate blurry subpixel anti-aliasing
        const curX = (p.startX + p.deltaX * ease + damp * p.curveOffset) | 0;
        const curY = (p.startY + p.deltaY * ease - damp * p.curveOffset * 0.4) | 0;

        ctx.fillStyle = p.colorMid;
        ctx.fillRect(curX, curY, 2, 2);
      }

      // Smooth handoff: reveal razor-sharp vector text right as particles settle
      if (frame >= 26) {
        setShowDomText(true);
      }

      // Complete assembly: cleanly dismiss canvas and stop RAF
      if (frame >= totalFrames) {
        ctx.clearRect(0, 0, totalW, totalH);
        setIsAssembled(true);
        setIsDusting(false);
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      } else {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);
  };

  return (
    <div ref={containerRef} className="relative w-full flex flex-col items-center justify-center select-none">
      {/* 1. Permanent Shimmering Royal Headline (100% Crisp Vector Live Typography) */}
      <h1
        className={`text-3xl sm:text-5xl md:text-6xl font-cinzel font-bold tracking-wider uppercase leading-tight drop-shadow-[0_4px_35px_rgba(0,0,0,0.95)] transition-opacity duration-300 ease-out flex flex-col items-center justify-center ${
          showDomText || isAssembled ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span ref={line1Ref} className="royal-gradient-shimmer inline-block">
          {headline1}
        </span>
        {headline2 && (
          <span ref={line2Ref} className="royal-gradient-shimmer inline-block mt-1 sm:mt-2">
            {headline2}
          </span>
        )}
      </h1>

      {/* 2. Ultra-Fast Stardust Micro-Canvas Overlay */}
      {!isAssembled && (
        <canvas
          ref={canvasRef}
          className="absolute pointer-events-none z-10"
          style={{
            display: isDusting ? 'block' : 'none'
          }}
        />
      )}
    </div>
  );
}
