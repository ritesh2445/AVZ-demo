import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ASSET_MANIFEST, BRAND_INFO } from '../data/brandData';
import { Play, Pause, Volume2, VolumeX, Maximize2, Film, Sparkles, Zap, Flame } from 'lucide-react';
import { playSound } from '../utils/audio';
import CinemaReelModal from './CinemaReelModal';

export default function HeroThreeDimension({ onNavigate, onOpenTunnel, isReady = true }) {
  const mountRef = useRef(null);
  const maskRef = useRef(null);
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Easter Egg: Tap & Hold 4 seconds to Shake, Vibrate & Blast
  const [isBlasted, setIsBlasted] = useState(() => {
    try {
      return sessionStorage.getItem('avz_hero_blasted') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 1
  const [blastFlash, setBlastFlash] = useState(false);

  const holdStartRef = useRef(null);
  const holdFrameRef = useRef(null);
  const shakeIntensityRef = useRef(0);
  const emblemGroupRef = useRef(null);
  const coreMatRef = useRef(null);

  useEffect(() => {
    setIsMobileDevice(window.innerWidth < 768);
  }, []);

  // WebGL Scene Initialization
  useEffect(() => {
    if (!isReady) return;

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = window.innerWidth < 768;

    // 1. Scene, Camera, WebGL Renderer (Transparent to allow live native video reel through)
    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.FogExp2(0x180b1e, 0.025);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 13);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("WebGL not available for 3D Hero, using fallback", e);
      return;
    }

    // 2. Dynamic 3D Lights
    const ambientLight = new THREE.AmbientLight(0x301934, 0.95);
    scene.add(ambientLight);

    const spotlight = new THREE.SpotLight(0xF4C2C2, 28, 40, Math.PI / 4, 0.35, 1.2);
    spotlight.position.set(0, 2, 10);
    scene.add(spotlight);

    const lavenderPoint = new THREE.PointLight(0xE6E6FA, 10, 25);
    lavenderPoint.position.set(-6, -4, 4);
    scene.add(lavenderPoint);

    const deepViolet = new THREE.PointLight(0x7654b5, 14, 30);
    deepViolet.position.set(6, 5, 2);
    scene.add(deepViolet);

    // 3. Central Kinetic Sculpture (Subject to tap-and-hold blast Easter Egg)
    const emblemGroup = new THREE.Group();
    emblemGroupRef.current = emblemGroup;
    scene.add(emblemGroup);

    // If already blasted this session, hide emblem completely
    if (isBlasted) {
      emblemGroup.visible = false;
    }

    const chromeMat = new THREE.MeshPhysicalMaterial({
      color: 0xC0C0C0,
      emissive: 0x240e2b,
      metalness: 0.95,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      reflectivity: 1.0
    });

    const ringGeom = new THREE.TorusGeometry(3.6, 0.08, 16, isMobile ? 48 : 80);
    const ringMesh = new THREE.Mesh(ringGeom, chromeMat);
    ringMesh.rotation.x = Math.PI / 3;
    emblemGroup.add(ringMesh);

    const innerRingGeom = new THREE.TorusGeometry(2.5, 0.05, 16, isMobile ? 36 : 64);
    const innerRingMesh = new THREE.Mesh(innerRingGeom, chromeMat);
    innerRingMesh.rotation.y = Math.PI / 4;
    emblemGroup.add(innerRingMesh);

    const thirdRingGeom = new THREE.TorusGeometry(4.4, 0.04, 16, isMobile ? 48 : 96);
    const thirdRingMesh = new THREE.Mesh(thirdRingGeom, chromeMat);
    thirdRingMesh.rotation.z = Math.PI / 6;
    emblemGroup.add(thirdRingMesh);

    const coreGeom = new THREE.OctahedronGeometry(1.2, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xF4C2C2,
      emissive: 0x301934,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0
    });
    coreMatRef.current = coreMat;
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    emblemGroup.add(coreMesh);

    const wireGeom = new THREE.IcosahedronGeometry(1.8, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xE6E6FA,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const wireMesh = new THREE.Mesh(wireGeom, wireMat);
    emblemGroup.add(wireMesh);

    // 4. Client Photography Panels
    const textureLoader = new THREE.TextureLoader();
    const photoPlanes = [];
    const loadedTextures = [];
    const planeGeoms = [];
    const planeMats = [];

    const photoData = [
      { url: ASSET_MANIFEST.products.divaTop, x: -4.2, y: 1.4, z: 1.2, rx: 0.05, ry: 0.22, w: 2.3, h: 2.8 },
      { url: ASSET_MANIFEST.editorialHero, x: 4.2, y: -0.6, z: 1.8, rx: -0.08, ry: -0.25, w: 2.4, h: 3.2 },
      { url: ASSET_MANIFEST.products.spikeBra, x: -3.4, y: -2.4, z: 0.6, rx: 0.12, ry: 0.18, w: 1.9, h: 2.1 },
      { url: ASSET_MANIFEST.products.coordSet, x: 3.6, y: 2.5, z: -0.8, rx: -0.05, ry: -0.15, w: 2.1, h: 2.5 }
    ];

    photoData.forEach((pd) => {
      textureLoader.load(pd.url, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        loadedTextures.push(tex);
        const geom = new THREE.PlaneGeometry(pd.w, pd.h);
        planeGeoms.push(geom);
        const mat = new THREE.MeshPhysicalMaterial({
          map: tex,
          side: THREE.DoubleSide,
          roughness: 0.35,
          metalness: 0.1,
          clearcoat: 0.5,
          transparent: true,
          opacity: 0.95
        });
        planeMats.push(mat);

        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(pd.x, pd.y, pd.z);
        mesh.rotation.set(pd.rx, pd.ry, 0);

        // Thin neon wireframe border
        const wireBorderGeom = new THREE.EdgesGeometry(geom);
        const wireBorderMat = new THREE.LineBasicMaterial({ color: 0xF4C2C2, transparent: true, opacity: 0.4 });
        const wireBorder = new THREE.LineSegments(wireBorderGeom, wireBorderMat);
        mesh.add(wireBorder);

        scene.add(mesh);
        photoPlanes.push(mesh);
      });
    });

    // 5. Star Dust & Floating Metallic Scraps
    const scrapCount = isMobile ? 120 : 200;
    const scrapGeom = new THREE.BufferGeometry();
    const scrapPos = new Float32Array(scrapCount * 3);
    for (let i = 0; i < scrapCount * 3; i += 3) {
      scrapPos[i] = (Math.random() - 0.5) * 32;
      scrapPos[i + 1] = (Math.random() - 0.5) * 22;
      scrapPos[i + 2] = (Math.random() - 0.5) * 26;
    }
    scrapGeom.setAttribute('position', new THREE.BufferAttribute(scrapPos, 3));
    const scrapMat = new THREE.PointsMaterial({
      color: 0xE6E6FA,
      size: 0.08,
      transparent: true,
      opacity: 0.65
    });
    const scrapParticles = new THREE.Points(scrapGeom, scrapMat);
    scene.add(scrapParticles);

    // 6. Interactive Spotlight & Camera Movement
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handlePointerMove = (e) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const x = (e.clientX / w) * 2 - 1;
      const y = -((e.clientY / h) * 2 - 1);
      targetMouseX = Math.max(-1, Math.min(1, x));
      targetMouseY = Math.max(-1, Math.min(1, y));
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Render loop
    let animId = null;
    let isVisible = true;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!isVisible) return;
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth pointer interpolation
      currentMouseX += (targetMouseX - currentMouseX) * 0.06;
      currentMouseY += (targetMouseY - currentMouseY) * 0.06;

      // Update 2D lighting mask directly on DOM ref
      if (maskRef.current) {
        const px = ((currentMouseX + 1) * 50).toFixed(1);
        const py = ((1 - currentMouseY) * 50).toFixed(1);
        maskRef.current.style.background = `radial-gradient(750px circle at ${px}% ${py}%, rgba(244, 194, 194, 0.12) 0%, rgba(48, 25, 52, 0.22) 45%, rgba(0, 0, 0, 0.85) 85%)`;
      }

      // Spotlight tracks pointer in 3D
      spotlight.position.x = currentMouseX * 10;
      spotlight.position.y = currentMouseY * 7;
      spotlight.target.position.set(currentMouseX * 4, currentMouseY * 3, 0);
      spotlight.target.updateMatrixWorld();

      // Apply Easter egg shake & vibration to camera and emblem
      const currentShake = shakeIntensityRef.current;
      const shakeX = (Math.random() - 0.5) * currentShake * 1.8;
      const shakeY = (Math.random() - 0.5) * currentShake * 1.8;
      const shakeZ = (Math.random() - 0.5) * currentShake * 1.2;

      camera.position.x = currentMouseX * 1.5 + shakeX;
      camera.position.y = currentMouseY * 1.2 + shakeY;
      camera.position.z = 13 + shakeZ;
      camera.lookAt(0, 0, 0);

      // Emblem dynamic animation (speeds up drastically during tap & hold vibration)
      if (emblemGroup.visible) {
        const speedMultiplier = 1 + currentShake * 18;
        ringMesh.rotation.z = elapsedTime * 0.12 * speedMultiplier + shakeX * 0.5;
        ringMesh.rotation.y = elapsedTime * 0.08 * speedMultiplier;
        innerRingMesh.rotation.x = -elapsedTime * 0.15 * speedMultiplier + shakeY * 0.5;
        innerRingMesh.rotation.z = elapsedTime * 0.09 * speedMultiplier;
        thirdRingMesh.rotation.y = -elapsedTime * 0.06 * speedMultiplier;
        coreMesh.rotation.y = elapsedTime * 0.2 * speedMultiplier;
        coreMesh.rotation.x = elapsedTime * 0.14 * speedMultiplier;
        wireMesh.rotation.x = -elapsedTime * 0.1 * speedMultiplier;
        wireMesh.rotation.y = -elapsedTime * 0.12 * speedMultiplier;

        // Core supercharge color effect during vibration
        if (coreMatRef.current) {
          if (currentShake > 0.1) {
            coreMatRef.current.color.setHex(0xFFFFFF);
            coreMatRef.current.emissive.setHex(0xFF1493);
            coreMatRef.current.emissiveIntensity = 2 + currentShake * 10;
          } else {
            coreMatRef.current.color.setHex(0xF4C2C2);
            coreMatRef.current.emissive.setHex(0x301934);
            coreMatRef.current.emissiveIntensity = 1;
          }
        }
      }

      // Floating photos gentle oscillation
      for (let i = 0; i < photoPlanes.length; i++) {
        const mesh = photoPlanes[i];
        mesh.position.y += Math.sin(elapsedTime * 1.2 + i * 1.5) * 0.003;
        mesh.rotation.z = Math.sin(elapsedTime * 0.8 + i) * 0.03;
      }

      scrapParticles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    // IntersectionObserver to suspend animation when offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible) {
          clock.start();
          if (!animId) animId = requestAnimationFrame(animate);
        } else if (!isVisible && animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!renderer || !container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);

      ringGeom.dispose();
      innerRingGeom.dispose();
      thirdRingGeom.dispose();
      coreGeom.dispose();
      wireGeom.dispose();
      scrapGeom.dispose();
      chromeMat.dispose();
      coreMat.dispose();
      wireMat.dispose();
      scrapMat.dispose();

      planeGeoms.forEach((g) => g.dispose());
      planeMats.forEach((m) => m.dispose());
      loadedTextures.forEach((t) => t.dispose());

      scene.clear();
      if (renderer) {
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
    };
  }, [isReady, isBlasted]);

  // Audio & Video Synchronization
  const handleTogglePlay = (e) => {
    e?.stopPropagation();
    playSound('glitch_click');
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      if (!isMuted && audioRef.current) {
        audioRef.current.currentTime = videoRef.current.currentTime || 0;
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = (e) => {
    e?.stopPropagation();
    playSound('glitch_click');
    if (isMuted) {
      // Unmute: Start audio in exact sync with video
      setIsMuted(false);
      if (audioRef.current && videoRef.current) {
        audioRef.current.currentTime = videoRef.current.currentTime || 0;
        audioRef.current.play().catch((err) => {
          console.warn('Audio play error:', err);
        });
      }
    } else {
      // Mute: Pause audio track
      setIsMuted(true);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  // Sync audio loop when video loops or updates
  const handleVideoTimeUpdate = () => {
    if (!isMuted && audioRef.current && videoRef.current) {
      const diff = Math.abs(audioRef.current.currentTime - videoRef.current.currentTime);
      if (diff > 0.3) {
        audioRef.current.currentTime = videoRef.current.currentTime;
      }
    }
  };

  // EASTER EGG: TAP & HOLD TO VIBRATE & BLAST
  const startHold = (e) => {
    // Ignore clicks on HUD control buttons
    if (e.target.closest('button') || e.target.closest('a')) return;
    if (isBlasted) return;

    setIsHolding(true);
    holdStartRef.current = performance.now();
    playSound('charge');

    const updateHold = (now) => {
      const elapsed = now - holdStartRef.current;
      const progress = Math.min(1, Math.max(0, elapsed / 4000));
      setHoldProgress(progress);

      // Exponentially ramp up shake intensity from 0 to 0.75
      shakeIntensityRef.current = Math.pow(progress, 2.2) * 0.75;

      if (progress < 1) {
        holdFrameRef.current = requestAnimationFrame(updateHold);
      } else {
        // 4 SECONDS REACHED: BLAST SUPERNOVA!
        detonateBlast();
      }
    };

    holdFrameRef.current = requestAnimationFrame(updateHold);
  };

  const endHold = () => {
    if (!isHolding) return;
    setIsHolding(false);
    setHoldProgress(0);
    shakeIntensityRef.current = 0;
    if (holdFrameRef.current) {
      cancelAnimationFrame(holdFrameRef.current);
      holdFrameRef.current = null;
    }
  };

  const detonateBlast = () => {
    setIsHolding(false);
    setHoldProgress(1);
    shakeIntensityRef.current = 0;
    if (holdFrameRef.current) {
      cancelAnimationFrame(holdFrameRef.current);
    }

    // Trigger visual blast flash & blast sound
    setBlastFlash(true);
    playSound('blast');

    // Permanently hide the 3D emblem for this session
    setIsBlasted(true);
    try {
      sessionStorage.setItem('avz_hero_blasted', 'true');
    } catch (e) {}

    if (emblemGroupRef.current) {
      emblemGroupRef.current.visible = false;
    }

    setTimeout(() => {
      setBlastFlash(false);
    }, 900);
  };

  const videoSource = isMobileDevice ? ASSET_MANIFEST.videos.heroMobile : ASSET_MANIFEST.videos.heroDesktop;
  const audioSource = isMobileDevice ? ASSET_MANIFEST.audio.heroMobile : ASSET_MANIFEST.audio.heroDesktop;

  return (
    <section
      ref={sectionRef}
      onPointerDown={startHold}
      onPointerUp={endHold}
      onPointerLeave={endHold}
      onPointerCancel={endHold}
      className={`relative w-full h-[88vh] md:h-[92vh] flex items-center justify-center overflow-hidden bg-pitch-black select-none touch-pan-y ${
        isHolding ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
      }`}
    >
      {/* 0. Synchronized Master Audio Soundtrack */}
      <audio
        ref={audioRef}
        src={audioSource}
        loop
        preload="auto"
      />

      {/* 1. Native Ultra-High-Definition Uncompressed Master Video Reel */}
      <video
        ref={videoRef}
        key={videoSource}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onTimeUpdate={handleVideoTimeUpdate}
        onLoadedData={() => setVideoLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-0 pointer-events-none ${
          videoLoaded ? 'opacity-65' : 'opacity-0'
        }`}
      >
        <source src={videoSource} type="video/mp4" />
      </video>

      {/* 2. Atmospheric Haute-Couture Vignette (Deep violet & black scrim for contrast) */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(circle at center, rgba(32, 10, 40, 0.45) 0%, rgba(10, 2, 15, 0.75) 60%, rgba(0, 0, 0, 0.94) 100%)',
          mixBlendMode: 'multiply'
        }}
      />

      {/* 3. 3D WebGL Three.js Layer with Transparent Background */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full pointer-events-auto z-[2]"
      />

      {/* 4. Dynamic 2D Ambient Lighting Mask Following Pointer */}
      <div
        ref={maskRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-700 z-[3]"
        style={{
          background: 'radial-gradient(750px circle at 50% 50%, rgba(244, 194, 194, 0.12) 0%, rgba(48, 25, 52, 0.22) 45%, rgba(0, 0, 0, 0.85) 85%)',
          mixBlendMode: 'screen'
        }}
      />

      {/* 5. TAP & HOLD 4S CHARGING HUD OVERLAY */}
      {isHolding && !isBlasted && (
        <div className="absolute inset-0 z-[25] pointer-events-none flex flex-col items-center justify-center bg-black/30 backdrop-blur-[1px] animate-in fade-in duration-200">
          <div className="relative flex flex-col items-center gap-3">
            {/* Pulsating Cyber Reticle */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border-2 border-pink/30 animate-spin"
                style={{ animationDuration: `${Math.max(0.4, 3 - holdProgress * 2.5)}s` }}
              />
              <div
                className="absolute inset-2 rounded-full border-2 border-t-pink border-r-transparent border-b-pink border-l-transparent animate-spin"
                style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
              />
              <div
                className="w-16 h-16 rounded-full bg-pink/20 border border-pink flex items-center justify-center text-pink font-mono font-bold text-xs shadow-[0_0_35px_rgba(244,194,194,0.6)]"
              >
                {(holdProgress * 4).toFixed(1)}s
              </div>
            </div>

            {/* Warning Text with Baddie Energy */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 border border-pink/60 text-[11px] font-mono tracking-widest text-pink uppercase shadow-[0_0_20px_rgba(244,194,194,0.3)]">
              <Flame className="w-3.5 h-3.5 text-pink animate-pulse" />
              <span>HOLDING TO OVERCHARGE // {(holdProgress * 100).toFixed(0)}%</span>
            </div>
            <p className="text-silver/80 text-[11px] font-mono tracking-widest uppercase">
              HOLD 4 SECONDS TO DETONATE DIMENSION
            </p>
          </div>
        </div>
      )}

      {/* 6. BLAST SUPERNOVA SHOCKWAVE FLASH */}
      {blastFlash && (
        <div className="absolute inset-0 z-[50] pointer-events-none bg-white animate-out fade-out duration-700 flex items-center justify-center">
          <div className="w-full h-full bg-radial-gradient from-pink via-purple-600 to-transparent opacity-80 animate-ping" />
        </div>
      )}

      {/* 7. Post-Blast Baddie Badge Notification */}
      {isBlasted && (
        <div className="absolute top-20 left-6 z-[10] flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-pink/40 text-[10px] font-mono tracking-widest text-pink shadow-[0_0_20px_rgba(244,194,194,0.25)]">
            <span>💥 UNHINGED BLAST DETONATED // REFRESH TO REGENERATE EMBLEM</span>
          </div>
        </div>
      )}

      {/* 8. Luxury Live Editorial Film HUD Badge (Top-Left) */}
      <div className="absolute top-6 left-6 z-[10] flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-pink/30 text-[10px] font-mono tracking-widest text-pink shadow-[0_0_20px_rgba(244,194,194,0.2)]">
          <span className="w-2 h-2 rounded-full bg-pink animate-ping inline-block" />
          <span>EDITORIAL FASHION REEL // SS26 ARCHIVE</span>
        </div>
      </div>

      {/* 9. Luxury Video & Audio Controls HUD (Bottom-Left) */}
      <div className="absolute bottom-6 left-6 z-[10] flex items-center gap-2.5">
        <button
          onClick={handleTogglePlay}
          className="p-2.5 rounded-full bg-black/70 hover:bg-pink/20 border border-white/20 hover:border-pink text-white hover:text-pink transition-all backdrop-blur-md cursor-pointer group shadow-lg"
          title={isPlaying ? 'Pause Background Reel' : 'Play Background Reel'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
        </button>

        <button
          onClick={handleToggleMute}
          className={`p-2.5 rounded-full border transition-all backdrop-blur-md cursor-pointer group shadow-lg flex items-center gap-1.5 ${
            isMuted
              ? 'bg-black/70 border-white/20 hover:border-pink text-silver/80 hover:text-pink'
              : 'bg-pink/20 border-pink text-pink shadow-[0_0_15px_rgba(244,194,194,0.4)]'
          }`}
          title={isMuted ? 'Unmute Audio Soundtrack' : 'Mute Audio Soundtrack'}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-silver/70 group-hover:text-pink" />
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-pink animate-pulse" />
              <span className="text-[10px] font-mono tracking-wider text-pink hidden sm:inline">SOUND ON</span>
            </>
          )}
        </button>

        <button
          onClick={() => {
            playSound('modal_open');
            setIsCinemaOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink/20 via-black/80 to-purple-900/40 hover:from-pink/30 hover:to-purple-900/60 border border-pink/40 hover:border-pink text-[11px] font-spartan font-bold text-white hover:text-pink tracking-widest uppercase transition-all backdrop-blur-md cursor-pointer shadow-[0_0_25px_rgba(244,194,194,0.25)]"
        >
          <Film className="w-3.5 h-3.5 text-pink" />
          <span>CINEMA REEL ↗</span>
        </button>
      </div>

      {/* 10. Ultra-clean Minimalist Scroll Guide (Bottom-Center) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-[10] opacity-60">
        <div className="w-[1px] h-9 bg-gradient-to-b from-transparent via-pink to-transparent animate-pulse" />
      </div>

      {/* 11. Dedicated Cinema Reel Modal */}
      <CinemaReelModal
        isOpen={isCinemaOpen}
        onClose={() => setIsCinemaOpen(false)}
        isMobile={isMobileDevice}
      />
    </section>
  );
}
