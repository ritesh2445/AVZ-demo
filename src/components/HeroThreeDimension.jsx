import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Film
} from 'lucide-react';
import { BRAND_INFO, ASSET_MANIFEST } from '../data/brandData';
import CinemaReelModal from './CinemaReelModal';
import { playSound } from '../utils/audio';

export default function HeroThreeDimension({ onExploreCatalogue }) {
  const mountRef = useRef(null);
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);

  // Distinct Video Reel for Mobile vs Desktop
  const videoSource = isMobileDevice
    ? ASSET_MANIFEST.heroRunwayVideoVertical
    : ASSET_MANIFEST.heroRunwayVideo;

  const audioSource = ASSET_MANIFEST.heroRunwayAudio;

  // Responsive device listener for mobile video switching
  useEffect(() => {
    const checkMobile = () => {
      const isMob = window.innerWidth < 768;
      setIsMobileDevice(isMob);
      if (isMob) setIsMuted(true); // Default to muted on mobile to satisfy strict browser autoplay policies
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // WebGL 3D Scene Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;
    const isMobile = width < 768;

    // 1. Scene, Camera, WebGL Renderer (Ultra-optimized for mobile 60-120fps)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = isMobile ? 16 : 13;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
      precision: isMobile ? 'mediump' : 'highp'
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

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
    scene.add(emblemGroup);

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
    allMaterials.push(chromeMat);

    // Outer Gyro Ring
    const ringGeom = new THREE.TorusGeometry(3.6, 0.08, 16, isMobile ? 24 : 64);
    const ringMesh = new THREE.Mesh(ringGeom, chromeMat);
    ringMesh.rotation.x = Math.PI / 3;
    emblemGroup.add(ringMesh);

    // Inner Gyro Ring
    const innerRingGeom = new THREE.TorusGeometry(2.5, 0.05, 16, isMobile ? 20 : 48);
    const innerRingMesh = new THREE.Mesh(innerRingGeom, chromeMat);
    innerRingMesh.rotation.y = Math.PI / 4;
    emblemGroup.add(innerRingMesh);

    // Third Gyro Ring
    const thirdRingGeom = new THREE.TorusGeometry(4.4, 0.04, 16, isMobile ? 24 : 64);
    const thirdRingMesh = new THREE.Mesh(thirdRingGeom, chromeMat);
    thirdRingMesh.rotation.z = Math.PI / 6;
    emblemGroup.add(thirdRingMesh);

    // Core Crystal Specimen
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
    allMaterials.push(coreMat);

    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    emblemGroup.add(coreMesh);

    // Wireframe Exo-Sphere
    const wireGeom = new THREE.IcosahedronGeometry(1.8, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    allMaterials.push(wireMat);

    const wireMesh = new THREE.Mesh(wireGeom, wireMat);
    emblemGroup.add(wireMesh);

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
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      spotlight.position.x = currentMouseX * 8;
      spotlight.position.y = currentMouseY * 6;
      spotlight.target.position.set(currentMouseX * 3, currentMouseY * 2, 0);
      spotlight.target.updateMatrixWorld();

      camera.position.x = currentMouseX * 1.2;
      camera.position.y = currentMouseY * 0.9;
      camera.lookAt(0, 0, 0);

      // Emblem kinetic animation
      ringMesh.rotation.z = elapsedTime * 0.12;
      ringMesh.rotation.y = elapsedTime * 0.08;
      innerRingMesh.rotation.x = -elapsedTime * 0.15;
      innerRingMesh.rotation.z = elapsedTime * 0.09;
      thirdRingMesh.rotation.y = -elapsedTime * 0.06;
      coreMesh.rotation.y = elapsedTime * 0.2;
      coreMesh.rotation.x = elapsedTime * 0.14;
      wireMesh.rotation.x = -elapsedTime * 0.1;
      wireMesh.rotation.y = -elapsedTime * 0.12;

      renderer.render(scene, camera);
    };

    // IntersectionObserver to pause rendering when scrolled past hero
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

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      const isMob = newW < 768;
      camera.aspect = newW / newH;
      camera.position.z = isMob ? 16 : 13;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMob ? 1.0 : 1.5));
    };

    window.addEventListener('resize', handleResize);
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
      if (animId) cancelAnimationFrame(animId);

      allMaterials.forEach((m) => m.dispose());
      ringGeom.dispose();
      innerRingGeom.dispose();
      thirdRingGeom.dispose();
      coreGeom.dispose();
      wireGeom.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Autoplay handler
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markLoaded = () => setVideoLoaded(true);
    video.addEventListener('loadeddata', markLoaded);
    video.addEventListener('canplay', markLoaded);
    video.addEventListener('playing', markLoaded);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => markLoaded())
        .catch(() => {
          video.muted = true;
          video.play().then(markLoaded).catch(() => {});
        });
    }

    return () => {
      video.removeEventListener('loadeddata', markLoaded);
      video.removeEventListener('canplay', markLoaded);
      video.removeEventListener('playing', markLoaded);
    };
  }, [videoSource]);

  // Synchronized Master Video & Audio Controls
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        const p1 = video.play();
        if (p1 && p1.catch) {
          p1.catch(() => {
            video.muted = true;
            video.play().catch(() => {});
          });
        }
      } else {
        video.pause();
      }
    }

    const audio = audioRef.current;
    if (audio) {
      if (isPlaying && !isMuted) {
        const p2 = audio.play();
        if (p2 && p2.catch) p2.catch(() => {});
      } else {
        audio.pause();
      }
    }
  }, [isPlaying, isMuted, isMobileDevice]);

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

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[100dvh] h-[100dvh] flex items-center justify-center overflow-hidden bg-black select-none cursor-default"
    >
      {/* 0. Synchronized Master Audio Soundtrack */}
      <audio
        ref={audioRef}
        key={audioSource}
        src={audioSource}
        loop
        preload="auto"
      />

      {/* 1. Native Master Video Reel */}
      <video
        ref={videoRef}
        key={videoSource}
        src={videoSource}
        autoPlay
        loop
        muted
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        preload="auto"
        poster={ASSET_MANIFEST.editorialHero}
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback"
        onTimeUpdate={handleVideoTimeUpdate}
        onLoadedData={() => setVideoLoaded(true)}
        onCanPlay={() => setVideoLoaded(true)}
        onPlay={() => setVideoLoaded(true)}
        onPlaying={() => setVideoLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-100 transition-opacity duration-300 ease-out"
        style={{
          filter: 'contrast(105%) brightness(102%) saturate(104%)',
          objectPosition: 'center center',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
          imageRendering: '-webkit-optimize-contrast'
        }}
      >
        <source src={videoSource} type="video/mp4" />
      </video>

      {/* 2. 3D WebGL Three.js Kinetic Emblem Layer */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
      />

      {/* 3. Video & Audio Controls HUD (Bottom-Left) */}
      <div className="absolute bottom-6 left-4 sm:left-8 z-[10] flex items-center gap-2">
        <button
          onClick={handleTogglePlay}
          className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-white/10 border border-white/15 hover:border-white/30 text-zinc-300 hover:text-white transition-all backdrop-blur-md cursor-pointer shadow-md"
          title={isPlaying ? 'Pause Background Reel' : 'Play Background Reel'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
        </button>

        <button
          onClick={handleToggleMute}
          className={`p-2 sm:p-2.5 rounded-full border transition-all backdrop-blur-md cursor-pointer shadow-md flex items-center gap-1.5 ${
            isMuted
              ? 'bg-black/60 border-white/15 hover:border-white/30 text-zinc-400 hover:text-white'
              : 'bg-white/10 border-white/40 text-white'
          }`}
          title={isMuted ? 'Unmute Audio Soundtrack' : 'Mute Audio Soundtrack'}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-white" />
              <span className="text-[10px] font-mono tracking-wider text-white hidden sm:inline">SOUND ON</span>
            </>
          )}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            playSound('pip');
            setIsCinemaOpen(true);
          }}
          className="inline-flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 sm:py-2 rounded-full bg-black/60 hover:bg-white/10 border border-white/15 hover:border-white/30 text-zinc-300 hover:text-white text-[10px] sm:text-xs font-mono transition-all backdrop-blur-md cursor-pointer shadow-md"
          title="Open Cinema Master Reel Modal"
        >
          <Film className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden sm:inline">FULL CINEMA REEL</span>
          <span className="sm:hidden">CINEMA</span>
        </button>
      </div>

      {/* 4. Minimalist Scroll Guide (Bottom-Center) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-[10] opacity-60">
        <div className="w-[1px] h-9 bg-gradient-to-b from-transparent via-pink to-transparent animate-pulse" />
      </div>

      {/* 5. Dedicated Cinema Reel Modal */}
      <CinemaReelModal
        isOpen={isCinemaOpen}
        onClose={() => setIsCinemaOpen(false)}
        videoSource={videoSource}
      />
    </section>
  );
}
