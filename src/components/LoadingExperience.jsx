import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { playSound } from '../utils/audio';

export default function LoadingExperience({ onComplete }) {
  const mountRef = useRef(null);
  const pctRef = useRef(null);
  const barRef = useRef(null);
  const phaseRef = useRef(null);
  const [isExiting, setIsExiting] = useState(false);
  const hasFinishedRef = useRef(false);

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

    // Hypnotic, unhurried 4.6-second timeline progression
    let animId;
    const startTime = performance.now();
    const duration = 4600; // Exact 4.6s duration requested by client

    const triggerFinish = () => {
      if (hasFinishedRef.current) return;
      hasFinishedRef.current = true;
      setIsExiting(true);
      playSound('baddie_alert');
      setTimeout(() => {
        onComplete();
      }, 350);
    };

    const animate = (time) => {
      animId = requestAnimationFrame(animate);
      const elapsed = time - startTime;
      const t = Math.min(1, Math.max(0, elapsed / duration));

      // Continuous, fluid easing for majestic steady progression
      const easeVal = 1 - Math.pow(1 - t, 2.8);
      const currentPct = Math.min(100, Math.round(easeVal * 100));

      // Direct DOM updates (Zero React re-render lag)
      if (pctRef.current) {
        pctRef.current.textContent = currentPct < 10 ? `0${currentPct}` : `${currentPct}`;
      }
      if (barRef.current) {
        barRef.current.style.width = `${currentPct}%`;
      }
      if (phaseRef.current) {
        if (currentPct < 22) {
          phaseRef.current.textContent = "AWAKENING THE OTHER DIMENSION";
        } else if (currentPct < 48) {
          phaseRef.current.textContent = "SCULPTING 1-OF-1 WEARABLE ART FOR BADDIES";
        } else if (currentPct < 72) {
          phaseRef.current.textContent = "DECONSTRUCTING ARCHIVES & MOTHERBOARDS";
        } else if (currentPct < 92) {
          phaseRef.current.textContent = "SYNTHESIZING ZERO-WASTE RUNWAY GRAILS";
        } else {
          phaseRef.current.textContent = "DIMENSION UNLOCKED. CERTIFIED SLAY ERA.";
        }
      }

      // 3D rotations
      ring1.rotation.z = elapsed * 0.0012;
      ring1.rotation.x = elapsed * 0.0008;
      ring2.rotation.y = -elapsed * 0.0015;
      ring2.rotation.z = elapsed * 0.001;
      core.rotation.y = elapsed * 0.0018;
      core.rotation.x = elapsed * 0.0012;
      wireMesh.rotation.y = -elapsed * 0.0009;

      particles.rotation.y = elapsed * 0.0002;

      // Camera rush in final stretch
      if (t > 0.85) {
        const rush = (t - 0.85) / 0.15;
        camera.position.z = 12 - rush * 3.5;
        group.scale.set(1 + rush * 0.35, 1 + rush * 0.35, 1 + rush * 0.35);
      }

      renderer.render(scene, camera);

      if (t >= 1 && !hasFinishedRef.current) {
        triggerFinish();
      }
    };

    animId = requestAnimationFrame(animate);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
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
    <div
      className={`fixed inset-0 z-[9999] bg-pitch-black flex flex-col justify-between p-8 md:p-14 select-none transition-all duration-400 ease-out will-change-[opacity,transform] ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 3D Kinetic Background */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Top Bar - Clean Frameless Info */}
      <div className="relative z-10 w-full flex items-center justify-between text-xs font-mono tracking-widest uppercase">
        <div className="flex items-center gap-3 text-silver/80">
          <span className="w-2 h-2 rounded-full bg-pink animate-ping" />
          <span>AVZ VAGANZA // GUWAHATI ATELIER</span>
        </div>
        <div className="text-silver/50 hidden sm:block">
          DHRISTROYER WEARABLE ART ARCHIVE
        </div>
      </div>

      {/* Center Kinetic Typography Counter */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto pointer-events-none text-center">
        <div className="text-[11px] font-mono tracking-[0.4em] text-pink/90 uppercase mb-3">
          INITIALIZING DIMENSIONAL ENGINE
        </div>

        {/* High FPS Numeric Display */}
        <div className="flex items-baseline justify-center">
          <span
            ref={pctRef}
            className="text-8xl sm:text-9xl md:text-[11rem] font-spartan font-black text-white leading-none tracking-tighter"
          >
            00
          </span>
          <span className="text-3xl sm:text-4xl md:text-5xl font-mono text-pink ml-2 font-bold">
            %
          </span>
        </div>

        {/* Phase Subtitle Status */}
        <div
          ref={phaseRef}
          className="text-xs sm:text-sm font-mono tracking-[0.25em] text-silver/80 uppercase mt-4"
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
            className="h-full bg-gradient-to-r from-pink via-purple-400 to-white shadow-[0_0_15px_#F4C2C2] rounded-full transition-all duration-75"
            style={{ width: '0%' }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-silver/50 tracking-wider">
          <span>EXPERIENCE SPATIAL LUXURY</span>
          <span>PRESS SPACE OR ESC TO SKIP</span>
        </div>
      </div>
    </div>
  );
}
