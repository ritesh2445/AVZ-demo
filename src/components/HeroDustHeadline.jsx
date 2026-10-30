import React, { useEffect, useRef, useState } from 'react';

/**
 * Ultra-realistic Canvas Particle Disintegration (Haute Couture Dust & Ash Dissolve)
 * For the first 5.5 seconds, showcases the moving royal pinkish/magenta gradient
 * across the headline typography. At 5.5s, rasterizes the exact letterforms with
 * subpixel precision onto an offscreen canvas and disintegrates them into thousands
 * of glowing pink, rose gold, and silver dust micro-particles that drift away with the wind.
 */
export default function HeroDustHeadline({
  headline1 = 'WEARABLE ART.',
  headline2 = 'NOT MADE TO REPEAT.'
}) {
  const containerRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const canvasRef = useRef(null);
  const [isDusting, setIsDusting] = useState(false);
  const [isVanished, setIsVanished] = useState(false);
  const animFrameRef = useRef(null);

  useEffect(() => {
    // Wait 5.5 seconds of showcasing the moving royal gradient before triggering dust dissolution
    const timer = setTimeout(() => {
      triggerDustDisintegration();
    }, 5500);

    return () => {
      clearTimeout(timer);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [headline1, headline2]);

  const triggerDustDisintegration = async () => {
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
    // Expand canvas margins to allow dust particles to blow upward and rightward with natural wind
    const marginX = 140;
    const marginY = 120;
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

    // Create an offscreen buffer canvas to draw the typography with royal pinkish gradient
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

    // Subpixel-accurate positioning matching the DOM lines exactly
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

          const posX = x / dpr;
          const posY = y / dpr;

          // Dissolve in an organic left-to-right wind gust:
          // Particles on the left peel off first, followed progressively by particles to the right
          const progressRatio = posX / totalW;
          const staggerDelay = progressRatio * 40 + (Math.random() * 20);

          particles.push({
            x: posX,
            y: posY,
            origX: posX,
            origY: posY,
            r,
            g,
            b,
            baseAlpha: alpha / 255,
            size: (Math.random() * 1.8 + 1.0), // Micro-dust grain size: 1.0px to 2.8px
            vx: Math.random() * 2.2 + 0.8, // Ambient wind blowing rightwards
            vy: -(Math.random() * 2.5 + 1.0), // Thermal lift floating upwards
            wobbleSpeed: Math.random() * 0.08 + 0.03,
            wobbleAmp: Math.random() * 2.5 + 0.8,
            life: 0,
            maxLife: Math.floor(Math.random() * 55 + 65), // ~1.5 - 2.0 seconds lifespan per grain
            staggerDelay
          });
        }
      }
    }

    // Start disintegration: hide original DOM text smoothly
    setIsDusting(true);

    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, totalW, totalH);

      let aliveCount = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (frameCount < p.staggerDelay) {
          // Grain hasn't peeled away yet: draw static at original position
          ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.baseAlpha})`;
          ctx.fillRect(p.x, p.y, p.size, p.size);
          aliveCount++;
        } else {
          // Grain is actively flying and dissipating into dust
          p.life++;

          if (p.life < p.maxLife) {
            aliveCount++;

            // Physics: horizontal wind drift + harmonic turbulence + upward float
            p.x += p.vx + Math.sin(p.life * p.wobbleSpeed) * p.wobbleAmp;
            p.y += p.vy;
            p.vy -= 0.025; // upward acceleration like rising hot smoke/ash
            p.size *= 0.985; // particles disintegrate into microscopic dust

            const progress = p.life / p.maxLife;
            // Smooth ease-out fade to transparent
            const currentAlpha = (1 - progress) * p.baseAlpha;

            ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${Math.max(0, currentAlpha)})`;
            ctx.fillRect(p.x, p.y, Math.max(0.5, p.size), Math.max(0.5, p.size));
          }
        }
      }

      if (aliveCount > 0) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        // All particles have turned into dust and vanished: cleanly terminate RAF loop
        ctx.clearRect(0, 0, totalW, totalH);
        setIsVanished(true);
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);
  };

  return (
    <div ref={containerRef} className="relative w-full flex flex-col items-center justify-center select-none">
      {/* 1. Original Shimmering Royal Headline (Fades out when dust begins) */}
      <h1
        className={`text-3xl sm:text-5xl md:text-6xl font-cinzel font-bold tracking-wider uppercase leading-tight drop-shadow-[0_4px_35px_rgba(0,0,0,0.95)] transition-opacity duration-500 ease-out flex flex-col items-center justify-center ${
          isDusting || isVanished ? 'opacity-0 pointer-events-none' : 'opacity-100'
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

      {/* 2. Micro-Particle Canvas Overlay (Simulates ultra-realistic ash/dust dispersion) */}
      <canvas
        ref={canvasRef}
        className="absolute pointer-events-none z-10 will-change-transform"
        style={{
          display: isVanished ? 'none' : 'block'
        }}
      />
    </div>
  );
}
