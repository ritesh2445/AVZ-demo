import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ASSET_MANIFEST } from '../data/brandData';
import { Play, Pause, Volume2, VolumeX, Film, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';
import CinemaReelModal from './CinemaReelModal';

export default function HeroThreeDimension({ onNavigate, onOpenTunnel, isReady = true }) {
  const mountRef = useRef(null);
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const dustCanvasRef = useRef(null);
  const dustAnimIdRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Easter Egg: Tap & Hold 4 seconds to Shake, Vibrate & Blast into Purple Dust
  // Restores automatically when user refreshes screen
  const [isBlasted, setIsBlasted] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 1
  const [blastActive, setBlastActive] = useState(false);

  const holdStartRef = useRef(null);
  const holdFrameRef = useRef(null);
  const shakeIntensityRef = useRef(0);
  const emblemGroupRef = useRef(null);
  const photoPlanesGroupRef = useRef(null);
  const coreMatRef = useRef(null);

  useEffect(() => {
    setIsMobileDevice(window.innerWidth < 768);
    try {
      sessionStorage.removeItem('avz_hero_blasted');
    } catch (e) {}
  }, []);

  // WebGL 3D Scene Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = window.innerWidth < 768;

    // 1. Scene, Camera, WebGL Renderer (Transparent to allow live native video reel through)
    const scene = new THREE.Scene();
    scene.background = null;

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
      console.warn("WebGL not available for 3D Hero", e);
      return;
    }

    // 2. Dynamic 3D Lights
    const ambientLight = new THREE.AmbientLight(0x301934, 0.95);
    scene.add(ambientLight);

    const spotlight = new THREE.SpotLight(0xF4C2C2, 28, 40, Math.PI / 4, 0.35, 1.2);
    spotlight.position.set(0, 2, 10);
    scene.add(spotlight);

    const lavenderPoint = new THREE.PointLight(0x9d4edd, 10, 25);
    lavenderPoint.position.set(-6, -4, 4);
    scene.add(lavenderPoint);

    const deepViolet = new THREE.PointLight(0x7654b5, 14, 30);
    deepViolet.position.set(6, 5, 2);
    scene.add(deepViolet);

    // 3. Central Kinetic Sculpture (Vanishes on blast into purple dust)
    const emblemGroup = new THREE.Group();
    emblemGroupRef.current = emblemGroup;
    scene.add(emblemGroup);

    // 4. Floating Photo Planes Group (Vanishes on blast into purple dust)
    const photoPlanesGroup = new THREE.Group();
    photoPlanesGroupRef.current = photoPlanesGroup;
    scene.add(photoPlanesGroup);

    // If already blasted this session, hide both completely
    if (isBlasted) {
      emblemGroup.visible = false;
      photoPlanesGroup.visible = false;
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
      color: 0xc084fc,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const wireMesh = new THREE.Mesh(wireGeom, wireMat);
    emblemGroup.add(wireMesh);

    // Construct Floating Photography Panels
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

        photoPlanesGroup.add(mesh);
        photoPlanes.push(mesh);
      });
    });

    // NOTE: All ambient white dots/stardust have been completely removed.
    // Zero white dots exist in this 3D scene.

    // 5. Interactive Spotlight & Camera Movement
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
            coreMatRef.current.emissive.setHex(0xC084FC);
            coreMatRef.current.emissiveIntensity = 2 + currentShake * 10;
          } else {
            coreMatRef.current.color.setHex(0xF4C2C2);
            coreMatRef.current.emissive.setHex(0x301934);
            coreMatRef.current.emissiveIntensity = 1;
          }
        }
      }

      // Floating photos gentle oscillation (if visible)
      if (photoPlanesGroup.visible) {
        for (let i = 0; i < photoPlanes.length; i++) {
          const mesh = photoPlanes[i];
          mesh.position.y += Math.sin(elapsedTime * 1.2 + i * 1.5) * 0.003;
          mesh.rotation.z = Math.sin(elapsedTime * 0.8 + i) * 0.03;
        }
      }

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
      chromeMat.dispose();
      coreMat.dispose();
      wireMat.dispose();

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
      setIsMuted(false);
      if (audioRef.current && videoRef.current) {
        audioRef.current.currentTime = videoRef.current.currentTime || 0;
        audioRef.current.play().catch((err) => {
          console.warn('Audio play error:', err);
        });
      }
    } else {
      setIsMuted(true);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  const handleVideoTimeUpdate = () => {
    if (!isMuted && audioRef.current && videoRef.current) {
      const diff = Math.abs(audioRef.current.currentTime - videoRef.current.currentTime);
      if (diff > 0.3) {
        audioRef.current.currentTime = videoRef.current.currentTime;
      }
    }
  };

  // =========================================================================
  // REAL PURPLE DUST PARTICLE VIEWPORT ENGINE (HTML5 Canvas + Vanilla JS)
  // Zero white dots: authentic organic purple powder, micro-milled dust,
  // glowing violet flecks, and billowing purple convective plumes.
  // =========================================================================
  const triggerPurpleDustBurst = () => {
    const canvas = dustCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Authentic Rich Purple Dust Palette (Strictly purple hues: NO WHITE)
    const purpleDustPalette = [
      [147, 51, 234],  // #9333ea electric violet
      [168, 85, 247],  // #a855f7 vibrant orchid powder
      [217, 70, 239],  // #d946ef neon magenta-purple
      [126, 34, 206],  // #7e22ce royal purple
      [192, 132, 252], // #c084fc soft lilac dust
      [107, 33, 168],  // #6b21a8 deep amethyst
      [232, 121, 249], // #e879f9 luminous violet
      [88, 28, 135]    // #581c87 deep shadow plum
    ];

    // Five Detonation Seed Points: Screen Center (50%) + 4 Floating Card Positions (12.5% each)
    const origins = [
      { x: (width * 0.5) * dpr, y: (height * 0.5) * dpr, weight: 0.5 },
      { x: (width * 0.28) * dpr, y: (height * 0.38) * dpr, weight: 0.125 },
      { x: (width * 0.72) * dpr, y: (height * 0.44) * dpr, weight: 0.125 },
      { x: (width * 0.34) * dpr, y: (height * 0.68) * dpr, weight: 0.125 },
      { x: (width * 0.68) * dpr, y: (height * 0.28) * dpr, weight: 0.125 }
    ];

    const particleCount = width < 768 ? 950 : 1800;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      // Pick origin based on weighted distribution
      const randOrigin = Math.random();
      let chosenOrigin = origins[0];
      let accWeight = 0;
      for (const orig of origins) {
        accWeight += orig.weight;
        if (randOrigin <= accWeight) {
          chosenOrigin = orig;
          break;
        }
      }

      const angle = Math.random() * Math.PI * 2;
      const isBillow = Math.random() < 0.22; // 22% are soft billowing dust puffs, 78% micro dust specks
      const speed = isBillow
        ? (Math.random() * 3.5 + 0.8) * dpr
        : (Math.random() * 12 + 2.5) * dpr;

      const color = purpleDustPalette[Math.floor(Math.random() * purpleDustPalette.length)];
      const radius = isBillow
        ? (Math.random() * 9 + 4.5) * dpr
        : (Math.random() * 2.2 + 0.8) * dpr;

      particles.push({
        x: chosenOrigin.x + (Math.random() - 0.5) * 24 * dpr,
        y: chosenOrigin.y + (Math.random() - 0.5) * 24 * dpr,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        friction: isBillow ? 0.93 : 0.96,
        radius,
        isBillow,
        color,
        alpha: Math.random() * 0.35 + 0.65,
        decay: Math.random() * 0.0075 + 0.0055, // ~2.2s total smooth dissipation
        seed: Math.random() * 100,
        age: 0
      });
    }

    if (dustAnimIdRef.current) {
      cancelAnimationFrame(dustAnimIdRef.current);
    }

    let lastTime = performance.now();

    const renderDust = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'screen';

      let aliveCount = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.alpha <= 0) continue;

        aliveCount++;
        p.age += dt;

        // Airborne dust physics: friction deceleration
        p.vx *= p.friction;
        p.vy *= p.friction;

        // Thermal convection: warm dust plume gently lifts upwards
        p.vy -= 0.045 * dpr;

        // Fluid dust turbulence & curl drift
        const curlX = Math.sin(p.age * 3.8 + p.seed) * 0.45 * dpr;
        const curlY = Math.cos(p.age * 3.8 + p.seed) * 0.35 * dpr;

        p.x += p.vx + curlX;
        p.y += p.vy + curlY;
        p.alpha -= p.decay;

        const [r, g, b] = p.color;

        if (p.isBillow) {
          // Soft radial dust puff cloud
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
          grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.45})`);
          grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.18})`);
          grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Microscopic purple powder grain
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(0, p.alpha)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (aliveCount > 0) {
        dustAnimIdRef.current = requestAnimationFrame(renderDust);
      } else {
        // When completely faded, clear canvas cleanly and stop RAF loop
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dustAnimIdRef.current = null;
      }
    };

    dustAnimIdRef.current = requestAnimationFrame(renderDust);
  };

  // EASTER EGG: TAP & HOLD TO VIBRATE & BLAST
  const startHold = (e) => {
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

    // Instantly vanish 3D kinetic emblem and floating photos into pure purple dust
    if (emblemGroupRef.current) {
      emblemGroupRef.current.visible = false;
    }
    if (photoPlanesGroupRef.current) {
      photoPlanesGroupRef.current.visible = false;
    }
    setIsBlasted(true);

    // Detonate the real purple dust particle viewport engine
    triggerPurpleDustBurst();

    // Trigger visual purple shockwave and sound
    setBlastActive(true);
    playSound('blast');

    setTimeout(() => {
      setBlastActive(false);
    }, 1400);
  };

  // Cleanup dust canvas RAF on unmount
  useEffect(() => {
    return () => {
      if (dustAnimIdRef.current) {
        cancelAnimationFrame(dustAnimIdRef.current);
      }
    };
  }, []);

  const videoSource = isMobileDevice ? ASSET_MANIFEST.videos.heroMobile : ASSET_MANIFEST.videos.heroDesktop;
  const audioSource = isMobileDevice ? ASSET_MANIFEST.audio.heroMobile : ASSET_MANIFEST.audio.heroDesktop;

  return (
    <section
      ref={sectionRef}
      onPointerDown={startHold}
      onPointerUp={endHold}
      onPointerLeave={endHold}
      onPointerCancel={endHold}
      onMouseDown={startHold}
      onMouseUp={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      className={`relative w-full min-h-screen h-screen flex items-center justify-center overflow-hidden bg-black select-none touch-pan-y ${
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

      {/* 1. Native Ultra-High-Definition Uncompressed Master Video Reel (Complete, Uncropped) */}
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
        className={`absolute inset-0 w-full h-full object-contain z-0 pointer-events-none transition-opacity duration-700 ease-out ${
          videoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          filter: 'none',
          imageRendering: 'high-quality',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'translateZ(0)'
        }}
      >
        <source src={videoSource} type="video/mp4" />
      </video>

      {/* 2. 3D WebGL Three.js Layer (Zero white dots, disappears on blast) */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full pointer-events-auto z-[2]"
      />

      {/* 3. HTML5 Canvas Purple Dust Particle Viewport Overlay */}
      <canvas
        ref={dustCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[30]"
      />

      {/* 4. TAP & HOLD 4S CHARGING HUD OVERLAY */}
      {isHolding && !isBlasted && (
        <div className="absolute inset-0 z-[25] pointer-events-none flex flex-col items-center justify-center bg-black/35 backdrop-blur-[1px] animate-in fade-in duration-200">
          <div className="relative flex flex-col items-center gap-3">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border-2 border-purple-400/40 animate-spin"
                style={{ animationDuration: `${Math.max(0.3, 2.5 - holdProgress * 2.2)}s` }}
              />
              <div
                className="absolute inset-2 rounded-full border-2 border-t-pink border-r-transparent border-b-purple-400 border-l-transparent animate-spin"
                style={{ animationDirection: 'reverse', animationDuration: '0.7s' }}
              />
              <div
                className="w-16 h-16 rounded-full bg-purple-950/40 border border-pink flex items-center justify-center text-pink font-mono font-bold text-xs shadow-[0_0_35px_rgba(244,194,194,0.6)]"
              >
                {(holdProgress * 4).toFixed(1)}s
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/85 border border-pink/60 text-[11px] font-mono tracking-widest text-pink uppercase shadow-[0_0_20px_rgba(244,194,194,0.3)]">
              <Sparkles className="w-3.5 h-3.5 text-pink animate-pulse" />
              <span>SUPERCHARGING VORTEX // {(holdProgress * 100).toFixed(0)}%</span>
            </div>
            <p className="text-silver/80 text-[11px] font-mono tracking-widest uppercase">
              HOLD 4 SECONDS TO DISINTEGRATE INTO PURPLE DUST
            </p>
          </div>
        </div>
      )}

      {/* 5. PURPLE SHOCKWAVE PULSE (Strictly Purple, Zero White) */}
      {blastActive && (
        <div className="absolute inset-0 z-[40] pointer-events-none overflow-hidden flex items-center justify-center">
          <div className="absolute w-[700px] h-[700px] rounded-full bg-radial-gradient from-purple-500/50 via-fuchsia-600/25 to-transparent opacity-90 animate-ping duration-1000" />
          <div className="absolute inset-0 bg-[#3b0764]/25 mix-blend-screen animate-out fade-out duration-1000" />
        </div>
      )}

      {/* 6. Video & Audio Controls HUD (Bottom-Left) */}
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

      {/* 7. Ultra-clean Minimalist Scroll Guide (Bottom-Center) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-[10] opacity-60">
        <div className="w-[1px] h-9 bg-gradient-to-b from-transparent via-pink to-transparent animate-pulse" />
      </div>

      {/* 8. Dedicated Cinema Reel Modal */}
      <CinemaReelModal
        isOpen={isCinemaOpen}
        onClose={() => setIsCinemaOpen(false)}
        isMobile={isMobileDevice}
      />
    </section>
  );
}
