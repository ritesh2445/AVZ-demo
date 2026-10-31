import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { playSound } from '../utils/audio';

export default function LoadingExperience({ onComplete }) {
  const mountRef = useRef(null);
  const pctRef = useRef(null);
  const barRef = useRef(null);
  const phaseRef = useRef(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isCompleted100, setIsCompleted100] = useState(false);
  const hasFinishedRef = useRef(false);
  const triggerFinishRef = useRef(null);

  useEffect(() => {
    // Only bypass if user strictly requested reduced motion in OS settings
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete();
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 12);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);
    } catch (e) {
      onComplete();
      return;
    }

    // 2. Lights
    const ambient = new THREE.AmbientLight(0x2a1230, 0.9);
    scene.add(ambient);

    const pointLight = new THREE.PointLight(0xF4C2C2, 16, 30);
    pointLight.position.set(0, 3, 6);
    scene.add(pointLight);

    const rimLight = new THREE.PointLight(0x9d4edd, 10, 25);
    rimLight.position.set(-5, -3, 3);
    scene.add(rimLight);

    // 3. Central Monogram Sculpture with Gyro Rings
    const group = new THREE.Group();
    scene.add(group);

    const chromeMat = new THREE.MeshPhysicalMaterial({
      color: 0xE0E0E0,
      emissive: 0x240e2b,
      metalness: 0.95,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });

    const ring1Geom = new THREE.TorusGeometry(3.2, 0.06, 16, isMobile ? 40 : 64);
    const ring1 = new THREE.Mesh(ring1Geom, chromeMat);
    group.add(ring1);

    const ring2Geom = new THREE.TorusGeometry(2.3, 0.04, 16, isMobile ? 32 : 48);
    const ring2 = new THREE.Mesh(ring2Geom, chromeMat);
    ring2.rotation.x = Math.PI / 3;
    group.add(ring2);

    const coreGeom = new THREE.OctahedronGeometry(1.2, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xF4C2C2,
      emissive: 0x301934,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    group.add(core);

    const wireGeom = new THREE.IcosahedronGeometry(1.8, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xE6E6FA,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const wireMesh = new THREE.Mesh(wireGeom, wireMat);
    group.add(wireMesh);

    // Subtle Particle Field
    const count = isMobile ? 100 : 180;
    const pGeom = new THREE.BufferGeometry();
    const pPos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 22;
      pPos[i + 1] = (Math.random() - 0.5) * 18;
      pPos[i + 2] = (Math.random() - 0.5) * 18;
    }
    pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xF4C2C2,
      size: 0.08,
      transparent: true,
      opacity: 0.5
    });
    const particles = new THREE.Points(pGeom, pMat);
    scene.add(particles);

    // GUARANTEED NON-SKIPPING DISCRETE STEPPER: 00 to 100
    // Exactly 100 increments. 42ms per step = 4,200ms total + 350ms triumph hold = ~4.55 seconds
    let animId;
    let currentCount = 0;
    let lastStepTime = performance.now();
    const stepDuration = 12; // ms per count: brisk, responsive 1.2s load

    const triggerFinish = () => {
      if (hasFinishedRef.current) return;
      hasFinishedRef.current = true;
      setIsExiting(true);

      // Play dramatic cinematic soundscape
      playSound('subdrop');
      playSound('blast');

      // Allow 850ms for cinematic letterbox aperture & anamorphic light sweep to open
      setTimeout(() => {
        onComplete();
      }, 850);
    };
    triggerFinishRef.current = triggerFinish;

    const animate = (time) => {
      animId = requestAnimationFrame(animate);

      // Strictly sequential 00 to 100 counter (NEVER skips any integer)
      if (currentCount < 100) {
        if (time - lastStepTime >= stepDuration) {
          currentCount++;
          lastStepTime = time;

          const formatted = currentCount < 10 ? `0${currentCount}` : `${currentCount}`;
          if (pctRef.current) {
            pctRef.current.textContent = formatted;
          }
          if (barRef.current) {
            barRef.current.style.width = `${currentCount}%`;
          }

          // Subtle milestone audio feedback
          if (currentCount === 25 || currentCount === 50 || currentCount === 75) {
            playSound('pip');
          } else if (currentCount === 100) {
            setIsCompleted100(true);
            playSound('sparkle');
          }

          // Dynamic phase subtitles
          if (phaseRef.current) {
            if (currentCount < 20) {
              phaseRef.current.textContent = "INITIALIZING WEARABLE ART UNIVERSE";
            } else if (currentCount < 45) {
              phaseRef.current.textContent = "SCULPTING ONE-OF-ONE WEARABLE ART";
            } else if (currentCount < 70) {
              phaseRef.current.textContent = "DECONSTRUCTING ARCHIVES & HARDWARE";
            } else if (currentCount < 90) {
              phaseRef.current.textContent = "SYNTHESIZING ZERO-WASTE SILHOUETTES";
            } else if (currentCount < 100) {
              phaseRef.current.textContent = "CALIBRATING HAUTE-COUTURE RUNWAY";
            } else {
              phaseRef.current.textContent = "AVZ FASHION DIMENSION READY";
            }
          }
        }
      } else if (!hasFinishedRef.current) {
        // Triumphant hold at 100% for 380ms before triggering cinematic aperture
        if (time - lastStepTime >= 180) {
          triggerFinish();
        }
      }

      // Smooth kinetic 3D rotations
      const speedMultiplier = currentCount >= 95 ? 2.5 : 1.0;
      ring1.rotation.z += 0.015 * speedMultiplier;
      ring1.rotation.x += 0.01 * speedMultiplier;
      ring2.rotation.y -= 0.018 * speedMultiplier;
      ring2.rotation.z += 0.012 * speedMultiplier;
      core.rotation.y += 0.02 * speedMultiplier;
      core.rotation.x += 0.015 * speedMultiplier;
      wireMesh.rotation.y -= 0.01 * speedMultiplier;
      particles.rotation.y += 0.003;

      // Camera rush toward the core in final stretch (from 88% onwards)
      if (currentCount > 88) {
        const rush = (currentCount - 88) / 12;
        camera.position.z = 12 - rush * 4.2;
        group.scale.set(1 + rush * 0.45, 1 + rush * 0.45, 1 + rush * 0.45);
        if (coreMat) {
          coreMat.emissiveIntensity = 1 + rush * 3.5;
        }
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    window.__skipLoading = triggerFinish;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ') {
        triggerFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const handleResize = () => {
      if (!renderer) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);

      // Clean GPU memory
      ring1Geom.dispose();
      ring2Geom.dispose();
      coreGeom.dispose();
      wireGeom.dispose();
      pGeom.dispose();
      chromeMat.dispose();
      coreMat.dispose();
      wireMat.dispose();
      pMat.dispose();
      scene.clear();

      if (renderer) {
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
    };
  }, [onComplete]);

  return (
    <div id="loading-experience" className="fixed inset-0 z-[99999] pointer-events-none select-none overflow-hidden">
      {/* ========================================================
          CINEMATIC APERTURE / LETTERBOX SHUTTER SYSTEM
          Top and bottom cinema curtains split vertically on exit
          ======================================================== */}
      <div
        className={`absolute top-0 left-0 right-0 h-1/2 bg-black transition-transform duration-[850ms] pointer-events-auto will-change-transform z-20 ${
          isExiting ? '-translate-y-full' : 'translate-y-0'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      />
      <div
        className={`absolute bottom-0 left-0 right-0 h-1/2 bg-black transition-transform duration-[850ms] pointer-events-auto will-change-transform z-20 ${
          isExiting ? 'translate-y-full' : 'translate-y-0'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      />

      {/* ========================================================
          ANAMORPHIC CINEMA LIGHT FLARE STREAK
          Flashes horizontally across screen at moment of transition
          ======================================================== */}
      <div
        className={`absolute top-1/2 left-0 right-0 h-[3px] -translate-y-1/2 bg-gradient-to-r from-transparent via-[#f472b6] via-white to-transparent pointer-events-none z-30 transition-all duration-700 ease-out ${
          isExiting
            ? 'scale-x-[3] opacity-0 blur-[2px]'
            : isCompleted100
            ? 'scale-x-100 opacity-90 blur-[1px]'
            : 'scale-x-0 opacity-0'
        }`}
      />

      {/* ========================================================
          MAIN LOADER CONTENT (Fades & zooms smoothly on exit)
          ======================================================== */}
      <div
        className={`absolute inset-0 z-25 flex flex-col justify-between p-8 md:p-14 transition-all duration-700 ease-out will-change-[transform,opacity] ${
          isExiting ? 'scale-115 opacity-0 blur-md' : 'scale-100 opacity-100'
        }`}
      >
        {/* 3D Kinetic Background */}
        <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Top Bar - Clean Frameless Info */}
        <div className="relative z-10 w-full flex items-center justify-between text-xs font-mono tracking-widest uppercase">
          <div className="flex items-center gap-3 text-silver/80">
            <span className="w-2 h-2 rounded-full bg-[#f472b6] animate-ping" />
            <span>AVZ VAGANZA • GUWAHATI STUDIO</span>
          </div>
          <div className="text-silver/50 hidden sm:block">
            DHRISTROYER WEARABLE ART ARCHIVE
          </div>
        </div>

        {/* Center Kinetic Typography Counter */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto pointer-events-none text-center">
          <div className="text-[11px] font-mono tracking-[0.4em] text-[#f472b6] font-bold uppercase mb-3">
            PREPARING EXPERIENCE
          </div>

          {/* High FPS Numeric Display */}
          <div className="flex items-baseline justify-center">
            <span
              ref={pctRef}
              style={{ color: '#ffffff' }}
              className={`loading-counter-number text-8xl sm:text-9xl md:text-[11rem] font-spartan font-black text-white leading-none tracking-tighter transition-all duration-300 ${
                isCompleted100 ? 'text-white drop-shadow-[0_0_40px_rgba(244,114,182,0.95)]' : ''
              }`}
            >
              00
            </span>
            <span
              style={{ color: '#f472b6' }}
              className="text-3xl sm:text-4xl md:text-5xl font-mono text-[#f472b6] ml-2 font-bold"
            >
              %
            </span>
          </div>

          {/* Phase Subtitle Status */}
          <div
            ref={phaseRef}
            className="text-xs sm:text-sm font-mono tracking-[0.25em] text-silver/85 uppercase mt-4 font-medium"
          >
            LOCATING THE OTHER DIMENSION
          </div>
        </div>

        {/* Bottom Liquid Progress Bar & Metadata */}
        <div className="relative z-10 w-full flex flex-col gap-3 max-w-3xl mx-auto">
          {/* Progress Track */}
          <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden relative">
            <div
              ref={barRef}
              className="h-full bg-gradient-to-r from-[#f472b6] via-[#c084fc] to-white shadow-[0_0_15px_#f472b6] rounded-full transition-all duration-75"
              style={{ width: '0%' }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-silver/50 tracking-wider">
            <span>EXPERIENCE SPATIAL LUXURY</span>
            <button
              onClick={() => triggerFinishRef.current?.()}
              className="pointer-events-auto hover:text-white transition-colors cursor-pointer bg-transparent border-none text-[10px] font-mono text-silver/50"
            >
              PRESS SPACE OR ESC TO SKIP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
