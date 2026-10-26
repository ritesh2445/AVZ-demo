import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ASSET_MANIFEST, BRAND_INFO } from '../data/brandData';
import { Play, Pause, Volume2, VolumeX, Maximize2, Film, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';
import CinemaReelModal from './CinemaReelModal';

export default function HeroThreeDimension({ onNavigate, onOpenTunnel, isReady = true }) {
  const mountRef = useRef(null);
  const maskRef = useRef(null);
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsMobileDevice(window.innerWidth < 768);
  }, []);

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

    // 3. Central Kinetic Sculpture
    const emblemGroup = new THREE.Group();
    scene.add(emblemGroup);

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

        const borderGeom = new THREE.EdgesGeometry(geom);
        planeGeoms.push(borderGeom);
        const borderMat = new THREE.LineBasicMaterial({ color: 0xF4C2C2, transparent: true, opacity: 0.45 });
        planeMats.push(borderMat);
        const wireBorder = new THREE.LineSegments(borderGeom, borderMat);
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

    // 6. Interactive Spotlight & Camera Movement (Direct DOM / Variable, Zero React Re-render)
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

    // Render loop with Visibility Optimization (pauses when out of viewport)
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

      // Update 2D lighting mask directly on DOM ref without React re-render
      if (maskRef.current) {
        const px = ((currentMouseX + 1) * 50).toFixed(1);
        const py = ((1 - currentMouseY) * 50).toFixed(1);
        maskRef.current.style.background = `radial-gradient(750px circle at ${px}% ${py}%, rgba(244, 194, 194, 0.14) 0%, rgba(48, 25, 52, 0.25) 45%, rgba(0, 0, 0, 0.9) 85%)`;
      }

      // Spotlight tracks pointer in 3D
      spotlight.position.x = currentMouseX * 10;
      spotlight.position.y = currentMouseY * 7;
      spotlight.target.position.set(currentMouseX * 4, currentMouseY * 3, 0);
      spotlight.target.updateMatrixWorld();

      // Parallax camera drift
      camera.position.x = currentMouseX * 1.5;
      camera.position.y = currentMouseY * 1.2;
      camera.lookAt(0, 0, 0);

      // Central kinetic rings & core gentle rotation
      ringMesh.rotation.z = elapsedTime * 0.12;
      ringMesh.rotation.y = elapsedTime * 0.08;
      innerRingMesh.rotation.x = -elapsedTime * 0.15;
      innerRingMesh.rotation.z = elapsedTime * 0.09;
      thirdRingMesh.rotation.y = -elapsedTime * 0.06;
      coreMesh.rotation.y = elapsedTime * 0.2;
      coreMesh.rotation.x = elapsedTime * 0.14;
      wireMesh.rotation.x = -elapsedTime * 0.1;
      wireMesh.rotation.y = -elapsedTime * 0.12;

      // Floating photos gentle oscillation
      for (let i = 0; i < photoPlanes.length; i++) {
        const mesh = photoPlanes[i];
        mesh.position.y += Math.sin(elapsedTime * 1.2 + i * 1.5) * 0.003;
        mesh.rotation.z = Math.sin(elapsedTime * 0.8 + i) * 0.03;
      }

      scrapParticles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    // IntersectionObserver to suspend animation when scrolled offscreen
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

      // Complete GPU memory cleanup
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
  }, [isReady]);

  const handleTogglePlay = (e) => {
    e?.stopPropagation();
    playSound('click');
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = (e) => {
    e?.stopPropagation();
    playSound('click');
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const videoSource = isMobileDevice ? ASSET_MANIFEST.videos.heroMobile : ASSET_MANIFEST.videos.heroDesktop;

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[88vh] md:h-[92vh] flex items-center justify-center overflow-hidden bg-pitch-black touch-pan-y"
    >
      {/* 0. Native Ultra-High-Definition Uncompressed Master Video Reel */}
      <video
        ref={videoRef}
        key={videoSource}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        preload="auto"
        onLoadedData={() => setVideoLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-0 pointer-events-none ${
          videoLoaded ? 'opacity-65' : 'opacity-0'
        }`}
      >
        <source src={videoSource} type="video/mp4" />
      </video>

      {/* 1. Atmospheric Haute-Couture Vignette (Deep violet & black scrim for contrast) */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(circle at center, rgba(32, 10, 40, 0.45) 0%, rgba(10, 2, 15, 0.75) 60%, rgba(0, 0, 0, 0.94) 100%)',
          mixBlendMode: 'multiply'
        }}
      />

      {/* 2. 3D WebGL Three.js Layer with Transparent Background */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing z-[2]"
      />

      {/* 3. Dynamic 2D Ambient Lighting Mask Following Pointer */}
      <div
        ref={maskRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-700 z-[3]"
        style={{
          background: 'radial-gradient(750px circle at 50% 50%, rgba(244, 194, 194, 0.12) 0%, rgba(48, 25, 52, 0.22) 45%, rgba(0, 0, 0, 0.85) 85%)',
          mixBlendMode: 'screen'
        }}
      />

      {/* 4. Luxury Live Editorial Film HUD Badge (Top-Left) */}
      <div className="absolute top-6 left-6 z-[10] flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-pink/30 text-[10px] font-mono tracking-widest text-pink shadow-[0_0_20px_rgba(244,194,194,0.2)]">
          <span className="w-2 h-2 rounded-full bg-pink animate-ping inline-block" />
          <span>EDITORIAL FASHION REEL // SS26 ARCHIVE</span>
        </div>
      </div>

      {/* 5. Luxury Video Controls HUD (Bottom-Left) */}
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
          className="p-2.5 rounded-full bg-black/70 hover:bg-pink/20 border border-white/20 hover:border-pink text-white hover:text-pink transition-all backdrop-blur-md cursor-pointer group shadow-lg"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-silver/70 group-hover:text-pink" /> : <Volume2 className="w-3.5 h-3.5 text-pink" />}
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

      {/* 6. Ultra-clean Minimalist Scroll Guide (Bottom-Center) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-[10] opacity-60">
        <div className="w-[1px] h-9 bg-gradient-to-b from-transparent via-pink to-transparent animate-pulse" />
      </div>

      {/* 7. Dedicated Cinema Reel Modal */}
      <CinemaReelModal
        isOpen={isCinemaOpen}
        onClose={() => setIsCinemaOpen(false)}
        isMobile={isMobileDevice}
      />
    </section>
  );
}
