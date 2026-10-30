import React, { useEffect, useRef, useState } from 'react';

/**
 * Ultra-realistic Canvas Particle Dust Materialization (Haute Couture Dust Assembly)
 * Instead of vanishing, the headline starts as dispersed cosmic dust / glowing particles
 * that swirl, stream, and coalesce into the exact razor-sharp letterforms.
 * Once assembled, it blooms into the moving royal pink/rose-gold gradient and remains
 * permanently visible.
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
    // Initial brief 300ms pause after hero mount before cosmic dust streams in
    const timer = setTimeout(() => {
      triggerDustAssembly();
    }, 300);

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

    // Ensure all web fonts (Cinzel) are completely rendered before rasterizing
    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch (e) {
        // Fallback gracefully if document.fonts throws
      }
    }

    const containerRect = container.getBoundingClientRect();
    if (containerRect.width === 0 || containerRect.height === 0) return;

    const r1 = l1.getBoundingClientRect();
    const r2 = line2Ref.current ? line2Ref.current.getBoundingClientRect() : null;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Expand canvas margins to allow swirling dust particles from outside the text area
    const marginX = 160;
    const marginY = 140;
    const totalW = containerRect.width + marginX * 2;
    const totalH = containerRect.height + marginY * 2;

    canvas.width = totalW * dpr;
    canvas.height = totalH * dpr;
    canvas.style.width = `${totalW}px`;
    canvas.style.height = `${totalH}px`;
    canvas.style.left = `${-marginX}px`;
    canvas.style.top = `${-marginY}px`;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    // Compute exact computed font styling from line 1
    const computed = window.getComputedStyle(l1);
    const fontSize = parseFloat(computed.fontSize) || 48;
    const fontFamily = computed.fontFamily || "'Cinzel', serif";
    const fontWeight = computed.fontWeight || '700';

    // Create an offscreen buffer canvas to draw the target typography with royal pinkish gradient
    const offCanvas = document.createElement('canvas');
    offCanvas.width = totalW * dpr;
    offCanvas.height = totalH * dpr;
    const offCtx = offCanvas.getContext('2d');
    if (!offCtx) return;

    offCtx.scale(dpr, dpr);
    offCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    if ('letterSpacing' in offCtx) {
      offCtx.letterSpacing = computed.letterSpacing !== 'normal' ? computed.letterSpacing : '0.05em';
    }
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';

    // Luxury Royal Pinkish Gradient matching the moving shimmer palette
    const textGrad = offCtx.createLinearGradient(marginX, 0, totalW - marginX, totalH);
    textGrad.addColorStop(0.0, '#ffffff');
    textGrad.addColorStop(0.12, '#fce7f3');
    textGrad.addColorStop(0.3, '#f472b6');
    textGrad.addColorStop(0.5, '#ec4899');
    textGrad.addColorStop(0.7, '#be185d');
    textGrad.addColorStop(0.88, '#f472b6');
    textGrad.addColorStop(1.0, '#ffffff');

    offCtx.fillStyle = textGrad;

    // Subpixel-accurate target positioning matching the DOM lines exactly
    const x1 = r1.left + r1.width / 2 - containerRect.left + marginX;
    const y1 = r1.top + r1.height / 2 - containerRect.top + marginY;
    offCtx.fillText(headline1, x1, y1);

    if (r2 && headline2) {
      const x2 = r2.left + r2.width / 2 - containerRect.left + marginX;
      const y2 = r2.top + r2.height / 2 - containerRect.top + marginY;
      offCtx.fillText(headline2, x2, y2);
    }

    // Sample the rendered pixels to generate micro-dust particles
    const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
    const pixels = imgData.data;
    const particles = [];

    // Particle sampling step: 2px on desktop, 3px on mobile for optimal 60fps performance
    const isMobile = window.innerWidth < 768;
    const step = isMobile ? 3 : 2;

    for (let y = 0; y < offCanvas.height; y += step) {
      for (let x = 0; x < offCanvas.width; x += step) {
        const index = (y * offCanvas.width + x) * 4;
        const alpha = pixels[index + 3];

        if (alpha > 35) {
          const r = pixels[index];
          const g = pixels[index + 1];
          const b = pixels[index + 2];

          const targetX = x / dpr;
          const targetY = y / dpr;

          // Disperse initial starting coordinates in a swirling cosmic dust cloud
          const angle = Math.atan2(targetY - totalH / 2, targetX - totalW / 2) + (Math.random() - 0.5) * 1.5;
          const dist = 140 + Math.random() * 260;
          const startX = targetX + Math.cos(angle) * dist + (Math.random() - 0.5) * 80;
          // Sweep slightly from upward/left like an elegant atmospheric wind
          const startY = targetY + Math.sin(angle) * dist - (40 + Math.random() * 100);

          const progressRatio = targetX / totalW;
          // Stagger entry: particles stream across from left to right organically
          const staggerDelay = progressRatio * 35 + Math.random() * 25;
          const duration = 48 + Math.random() * 26; // frames to travel into letterform

          particles.push({
            targetX,
            targetY,
            startX,
            startY,
            r,
            g,
            b,
            baseAlpha: alpha / 255,
            targetSize: Math.random() * 1.2 + 0.9, // settled grain size: 0.9px - 2.1px
            staggerDelay,
            duration,
            phase: Math.random() * Math.PI * 2,
            turbSpeed: Math.random() * 0.08 + 0.04,
            turbAmp: Math.random() * 28 + 12
          });
        }
      }
    }

    let frameCount = 0;
    // Calculate total frames when all particles have converged
    const maxFrames = Math.max(...particles.map((p) => p.staggerDelay + p.duration));

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, totalW, totalH);

      let allArrived = true;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (frameCount < p.staggerDelay) {
          allArrived = false;
          continue;
        }

        const elapsed = frameCount - p.staggerDelay;
        const t = Math.min(1, elapsed / p.duration);

        if (t < 1) {
          allArrived = false;
        }

        // Cubic ease-out: particles rush in fast then gracefully decelerate into exact letterform
        const ease = 1 - Math.pow(1 - t, 3);

        // Harmonic turbulence decays to zero as particle locks into letter pixel
        const damp = 1 - ease;
        const turbX = Math.sin(p.phase + frameCount * p.turbSpeed) * p.turbAmp * damp;
        const turbY = Math.cos(p.phase + frameCount * p.turbSpeed * 0.9) * (p.turbAmp * 0.7) * damp;

        const curX = p.startX + (p.targetX - p.startX) * ease + turbX;
        const curY = p.startY + (p.targetY - p.startY) * ease + turbY;

        // Sparkle alpha: micro-twinkle during transit, solidifying into full letter color
        const sparkle = 0.85 + 0.15 * Math.sin(frameCount * 0.25 + p.phase);
        const curAlpha = Math.min(p.baseAlpha, t * 1.6 * p.baseAlpha) * sparkle;

        // Particle size starts slightly larger and blooms into fine dust grain
        const curSize = p.targetSize + (1 - ease) * 1.1;

        ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${curAlpha})`;
        ctx.fillRect(curX, curY, curSize, curSize);
      }

      // Smooth handoff: around 80% assembly, fade in the live DOM gradient text
      if (frameCount >= maxFrames * 0.82) {
        setShowDomText(true);
      }

      // Complete assembly: cleanly terminate canvas RAF loop and hand off to permanent DOM text
      if (allArrived && frameCount >= maxFrames + 12) {
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
      {/* 1. Permanent Shimmering Royal Headline (Materializes via particle assembly and stays visible) */}
      <h1
        className={`text-3xl sm:text-5xl md:text-6xl font-cinzel font-bold tracking-wider uppercase leading-tight drop-shadow-[0_4px_35px_rgba(0,0,0,0.95)] transition-opacity duration-700 ease-out flex flex-col items-center justify-center ${
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

      {/* 2. Micro-Particle Canvas Overlay (Assembles dust grains into the letterforms) */}
      {!isAssembled && (
        <canvas
          ref={canvasRef}
          className="absolute pointer-events-none z-10 will-change-transform"
          style={{
            display: isDusting ? 'block' : 'none'
          }}
        />
      )}
    </div>
  );
}
