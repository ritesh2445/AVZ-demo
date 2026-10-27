import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ASSET_MANIFEST } from '../data/brandData';
import { Play, Pause, Volume2, VolumeX, Film, Sparkles, Eye, EyeOff } from 'lucide-react';
import { playSound } from '../utils/audio';
import CinemaReelModal from './CinemaReelModal';

export default function HeroThreeDimension({ onNavigate, onOpenTunnel, isReady = true }) {
  const mountRef = useRef(null);
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Cinematic Transition State (Smooth, zero blast, zero violent shaking)
  const [isCinematicMode, setIsCinematicMode] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 1
  const [sheenActive, setSheenActive] = useState(false);

  const holdStartRef = useRef(null);
  const holdFrameRef = useRef(null);
  const emblemGroupRef = useRef(null);
  const photoPlanesGroupRef = useRef(null);
  const coreMatRef = useRef(null);
  const materialsRef = useRef([]);
  const dissolveAnimIdRef = useRef(null);

  useEffect(() => {
    setIsMobileDevice(window.innerWidth < 768);
  }, []);

  // WebGL 3D Scene Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = window.innerWidth < 768;

    // 1. Scene, Camera, WebGL Renderer (Transparent to reveal uncompressed native master video reel)
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

    // 3. Central Kinetic Sculpture
    const emblemGroup = new THREE.Group();
    emblemGroupRef.current = emblemGroup;
    scene.add(emblemGroup);

    // 4. Floating Photo Planes Group
    const photoPlanesGroup = new THREE.Group();
    photoPlanesGroupRef.current = photoPlanesGroup;
    scene.add(photoPlanesGroup);

    // Store all materials for ultra-smooth opacity fading
    const allMaterials = [];

    const chromeMat = new THREE.MeshPhysicalMaterial({
      color: 0xC0C0C0,
      emissive: 0x240e2b,
      metalness: 0.95,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      reflectivity: 1.0,
      transparent: true,
      opacity: 1.0
    });
    chromeMat.userData.baseOpacity = 1.0;
    allMaterials.push(chromeMat);

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
      clearcoat: 1.0,
      transparent: true,
      opacity: 1.0
    });
    coreMat.userData.baseOpacity = 1.0;
    coreMatRef.current = coreMat;
    allMaterials.push(coreMat);

    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    emblemGroup.add(coreMesh);

    const wireGeom = new THREE.IcosahedronGeometry(1.8, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    wireMat.userData.baseOpacity = 0.25;
    allMaterials.push(wireMat);

    const wireMesh = new THREE.Mesh(wireGeom, wireMat);
    emblemGroup.add(wireMesh);

    // Construct Floating Photography Panels
    const textureLoader = new THREE.TextureLoader();
    const photoPlanes = [];
    const loadedTextures = [];
    const planeGeoms = [];

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
        mat.userData.baseOpacity = 0.95;
        allMaterials.push(mat);

        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(pd.x, pd.y, pd.z);
        mesh.rotation.set(pd.rx, pd.ry, 0);

        // Thin neon wireframe border
        const wireBorderGeom = new THREE.EdgesGeometry(geom);
        const wireBorderMat = new THREE.LineBasicMaterial({
          color: 0xF4C2C2,
          transparent: true,
          opacity: 0.4
        });
        wireBorderMat.userData.baseOpacity = 0.4;
        allMaterials.push(wireBorderMat);

        const wireBorder = new THREE.LineSegments(wireBorderGeom, wireBorderMat);
        mesh.add(wireBorder);

        photoPlanesGroup.add(mesh);
        photoPlanes.push(mesh);
      });
    });

    materialsRef.current = allMaterials;

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

      camera.position.x = currentMouseX * 1.5;
      camera.position.y = currentMouseY * 1.2;
      camera.position.z = 13;
      camera.lookAt(0, 0, 0);

      // Emblem kinetic animation
      if (emblemGroup.visible) {
        ringMesh.rotation.z = elapsedTime * 0.12;
        ringMesh.rotation.y = elapsedTime * 0.08;
        innerRingMesh.rotation.x = -elapsedTime * 0.15;
        innerRingMesh.rotation.z = elapsedTime * 0.09;
        thirdRingMesh.rotation.y = -elapsedTime * 0.06;
        coreMesh.rotation.y = elapsedTime * 0.2;
        coreMesh.rotation.x = elapsedTime * 0.14;
        wireMesh.rotation.x = -elapsedTime * 0.1;
        wireMesh.rotation.y = -elapsedTime * 0.12;
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.25 : 1.5));
    };

    window.addEventListener('resize', handleResize);
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (animId) cancelAnimationFrame(animId);
      if (sectionRef.current) observer.unobserve(sectionRef.current);

      ringGeom.dispose();
      innerRingGeom.dispose();
      thirdRingGeom.dispose();
      coreGeom.dispose();
      wireGeom.dispose();
      chromeMat.dispose();
      coreMat.dispose();
      wireMat.dispose();

      planeGeoms.forEach((g) => g.dispose());
      allMaterials.forEach((m) => m.dispose());
      loadedTextures.forEach((t) => t.dispose());

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  // Synchronized Master Video & Audio Controls
  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || !audio) return;

    if (isPlaying) {
      const p1 = video.play();
      if (p1 && p1.catch) p1.catch(() => {});
      if (!isMuted) {
        const p2 = audio.play();
        if (p2 && p2.catch) p2.catch(() => {});
      }
    } else {
      video.pause();
      audio.pause();
    }
  }, [isPlaying, isMuted]);

  const handleVideoTimeUpdate = () => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || !audio || isMuted) return;

    if (Math.abs(video.currentTime - audio.currentTime) > 0.18) {
      audio.currentTime = video.currentTime;
    }
  };

  const handleTogglePlay = (e) => {
    e.stopPropagation();
    playSound('pip');
    setIsPlaying((prev) => !prev);
  };

  const handleToggleMute = (e) => {
    e.stopPropagation();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    playSound(newMuted ? 'toggle_off' : 'toggle_on');

    const audio = audioRef.current;
    const video = videoRef.current;
    if (!audio) return;

    if (!newMuted) {
      if (video) audio.currentTime = video.currentTime;
      audio.muted = false;
      audio.play().catch(() => {});
    } else {
      audio.pause();
      audio.muted = true;
    }
  };

  // =========================================================================
  // CINEMATIC DISSOLVE TRANSITION (Smooth af, zero blast, zero vibration)
  // =========================================================================
  const executeCinematicDissolve = () => {
    setIsHolding(false);
    setHoldProgress(1);
    setIsTransitioning(true);

    const emblemGroup = emblemGroupRef.current;
    const photoPlanesGroup = photoPlanesGroupRef.current;
    const mats = materialsRef.current;

    // Trigger soft visual sheen and velvety harmonic sound
    setSheenActive(true);
    playSound('museum_rotate');

    // 1200ms silky-smooth cubic-bezier dissolve
    const duration = 1200;
    const startTime = performance.now();
    const initialZ = emblemGroup ? emblemGroup.position.z : 0;
    const initialScale = emblemGroup ? emblemGroup.scale.x : 1;

    const dissolveLoop = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, Math.max(0, elapsed / duration));
      // Smooth cubic-bezier(0.16, 1, 0.3, 1) easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const alpha = 1 - ease;

      // Smoothly fade opacities of all 3D mesh materials
      mats.forEach((m) => {
        if (m) {
          const base = m.userData.baseOpacity !== undefined ? m.userData.baseOpacity : 1;
          m.opacity = Math.max(0, base * alpha);
        }
      });

      // Smoothly drift emblem into depth of space while dissolving
      if (emblemGroup) {
        emblemGroup.position.z = initialZ - ease * 3.5;
        emblemGroup.scale.setScalar(initialScale * (1 - ease * 0.2));
      }
      if (photoPlanesGroup) {
        photoPlanesGroup.position.z = initialZ - ease * 4.0;
      }

      if (progress < 1) {
        dissolveAnimIdRef.current = requestAnimationFrame(dissolveLoop);
      } else {
        // Complete dissolve: clean hide without abrupt cuts
        if (emblemGroup) emblemGroup.visible = false;
        if (photoPlanesGroup) photoPlanesGroup.visible = false;
        setIsCinematicMode(true);
        setIsTransitioning(false);
        setSheenActive(false);
        dissolveAnimIdRef.current = null;
      }
    };

    dissolveAnimIdRef.current = requestAnimationFrame(dissolveLoop);
  };

  // Restore 3D Atelier (Smooth fade back in)
  const restore3dAtelier = (e) => {
    if (e) e.stopPropagation();
    playSound('sparkle');

    const emblemGroup = emblemGroupRef.current;
    const photoPlanesGroup = photoPlanesGroupRef.current;
    const mats = materialsRef.current;

    if (emblemGroup) {
      emblemGroup.visible = true;
      emblemGroup.position.z = 0;
      emblemGroup.scale.setScalar(1);
    }
    if (photoPlanesGroup) {
      photoPlanesGroup.visible = true;
      photoPlanesGroup.position.z = 0;
    }

    const duration = 800;
    const startTime = performance.now();

    const fadeInLoop = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, Math.max(0, elapsed / duration));
      const ease = 1 - Math.pow(1 - progress, 3);

      mats.forEach((m) => {
        if (m) {
          const base = m.userData.baseOpacity !== undefined ? m.userData.baseOpacity : 1;
          m.opacity = base * ease;
        }
      });

      if (progress < 1) {
        requestAnimationFrame(fadeInLoop);
      } else {
        setIsCinematicMode(false);
      }
    };

    requestAnimationFrame(fadeInLoop);
  };

  // TAP & HOLD FOR CINEMATIC DISSOLVE
  const startHold = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return;
    if (isCinematicMode || isTransitioning) return;

    setIsHolding(true);
    holdStartRef.current = performance.now();
    playSound('cyber_hover');

    const updateHold = (now) => {
      const elapsed = now - holdStartRef.current;
      const progress = Math.min(1, Math.max(0, elapsed / 2800)); // 2.8s smooth duration
      setHoldProgress(progress);

      if (progress < 1) {
        holdFrameRef.current = requestAnimationFrame(updateHold);
      } else {
        executeCinematicDissolve();
      }
    };

    holdFrameRef.current = requestAnimationFrame(updateHold);
  };

  const endHold = () => {
    if (!isHolding) return;
    setIsHolding(false);
    setHoldProgress(0);
    if (holdFrameRef.current) {
      cancelAnimationFrame(holdFrameRef.current);
      holdFrameRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (dissolveAnimIdRef.current) cancelAnimationFrame(dissolveAnimIdRef.current);
      if (holdFrameRef.current) cancelAnimationFrame(holdFrameRef.current);
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
      className="relative w-full min-h-screen h-screen flex items-center justify-center overflow-hidden bg-black select-none cursor-default"
    >
      {/* 0. Synchronized Master Audio Soundtrack */}
      <audio
        ref={audioRef}
        src={audioSource}
        loop
        preload="auto"
      />

      {/* 1. Native Master Video Reel (Complete, Full Brightness, Zero Cropping) */}
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

      {/* 2. 3D WebGL Three.js Layer with Butter-Smooth Dissolve Engine */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full pointer-events-auto z-[2]"
      />

      {/* 3. ELEGANT CINEMATIC HOLD HUD (Smooth, Minimal, Refined) */}
      {isHolding && !isCinematicMode && (
        <div className="absolute inset-0 z-[25] pointer-events-none flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity duration-200">
          <div className="relative flex flex-col items-center gap-3">
            {/* Elegant Radial Progress Dial */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-white/10"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-[#f472b6]"
                  strokeWidth="3.5"
                  strokeDasharray="264"
                  strokeDashoffset={264 * (1 - holdProgress)}
                  strokeLinecap="round"
                  fill="none"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(244,114,182,0.8))',
                    transition: 'stroke-dashoffset 0.05s linear'
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-white font-bold tracking-wider">
                {(holdProgress * 100).toFixed(0)}%
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 border border-[#f472b6]/50 text-[10px] sm:text-[11px] font-mono tracking-widest text-[#f472b6] uppercase shadow-[0_0_20px_rgba(244,114,182,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-pink animate-pulse" />
              <span>DISSOLVING TO CINEMATIC REEL</span>
            </div>
            <p className="text-silver/60 text-[10px] font-mono tracking-widest uppercase">
              HOLD TO REVEAL PURE MASTER REEL
            </p>
          </div>
        </div>
      )}

      {/* 4. VELVETY CINEMATIC LIGHT SHEEN (Zero Blast, Smooth af) */}
      {sheenActive && (
        <div className="absolute inset-0 z-[30] pointer-events-none overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f472b6]/15 to-transparent animate-out fade-out duration-1000" />
        </div>
      )}

      {/* 5. Video, Audio & Mode Controls HUD (Bottom-Left) */}
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

        {/* Toggle between Cinematic Video Mode and 3D Atelier Mode */}
        {isCinematicMode && (
          <button
            onClick={restore3dAtelier}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/80 hover:bg-pink/20 border border-[#f472b6]/50 text-white hover:text-pink text-[10px] font-mono tracking-wider uppercase transition-all backdrop-blur-md cursor-pointer shadow-lg animate-in fade-in"
            title="Bring back 3D Kinetic Sculpture"
          >
            <Eye className="w-3 h-3 text-[#f472b6]" />
            <span>RE-ENGAGE 3D</span>
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            playSound('pip');
            setIsCinemaOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black/70 hover:bg-pink/20 border border-white/20 hover:border-pink text-white hover:text-pink text-xs font-mono transition-all backdrop-blur-md cursor-pointer shadow-lg"
          title="Open Cinema Master Reel Modal"
        >
          <Film className="w-3.5 h-3.5 text-pink" />
          <span className="hidden sm:inline">FULL CINEMA REEL</span>
        </button>
      </div>

      {/* 6. Ultra-clean Minimalist Scroll Guide (Bottom-Center) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-[10] opacity-60">
        <div className="w-[1px] h-9 bg-gradient-to-b from-transparent via-pink to-transparent animate-pulse" />
      </div>

      {/* 7. Dedicated Cinema Reel Modal */}
      <CinemaReelModal
        isOpen={isCinemaOpen}
        onClose={() => setIsCinemaOpen(false)}
        videoSource={videoSource}
      />
    </section>
  );
}
