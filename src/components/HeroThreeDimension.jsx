import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ASSET_MANIFEST, BRAND_INFO } from '../data/brandData';
import { Play, Pause, Volume2, VolumeX, Maximize2, Film, Sparkles, Zap, Flame } from 'lucide-react';
import { playSound } from '../utils/audio';
import CinemaReelModal from './CinemaReelModal';

// Helper to create realistic 4-point starry sparkle texture
function createStarrySparkleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const cx = 32;
  const cy = 32;

  // Soft purple circular glow
  const radGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
  radGlow.addColorStop(0, 'rgba(255, 255, 255, 1)');
  radGlow.addColorStop(0.2, 'rgba(230, 160, 255, 0.95)');
  radGlow.addColorStop(0.5, 'rgba(168, 85, 247, 0.65)');
  radGlow.addColorStop(0.8, 'rgba(123, 44, 191, 0.3)');
  radGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radGlow;
  ctx.fillRect(0, 0, 64, 64);

  // 4-point radiant diamond star spikes
  ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
  ctx.beginPath();
  ctx.moveTo(cx, 4);
  ctx.bezierCurveTo(cx + 2, cy - 2, cx + 2, cy - 2, cx + 28, cy);
  ctx.bezierCurveTo(cx + 2, cy + 2, cx + 2, cy + 2, cx, cy + 28);
  ctx.bezierCurveTo(cx - 2, cy + 2, cx - 2, cy + 2, cx - 28, cy);
  ctx.bezierCurveTo(cx - 2, cy - 2, cx - 2, cy - 2, cx, 4);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

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
  // Vanishes on blast; automatically restored whenever user refreshes screen or revisits the site
  const [isBlasted, setIsBlasted] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 1
  const [blastActive, setBlastActive] = useState(false);
  const [sparkleSprinkles, setSparkleSprinkles] = useState([]);

  const holdStartRef = useRef(null);
  const holdFrameRef = useRef(null);
  const shakeIntensityRef = useRef(0);
  const emblemGroupRef = useRef(null);
  const photoPlanesGroupRef = useRef(null);
  const coreMatRef = useRef(null);
  const blastTriggerFnRef = useRef(null);

  useEffect(() => {
    setIsMobileDevice(window.innerWidth < 768);
    try {
      sessionStorage.removeItem('avz_hero_blasted');
    } catch (e) {}
  }, []);

  // WebGL Scene Initialization (Pre-warmed on mount for instant zero-lag visibility)
  useEffect(() => {
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

    // 3. Central Kinetic Sculpture (Vanish on blast)
    const emblemGroup = new THREE.Group();
    emblemGroupRef.current = emblemGroup;
    scene.add(emblemGroup);

    // 4. Floating Photo Planes Group (MUST ALSO VANISH ON BLAST)
    const photoPlanesGroup = new THREE.Group();
    photoPlanesGroupRef.current = photoPlanesGroup;
    scene.add(photoPlanesGroup);

    // If already blasted this session, hide both emblem and photo planes completely
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
      color: 0xE6E6FA,
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

    // 5. Ambient Stardust
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

    // 6. REALISTIC PURPLE STAR SPARKLE SPRINKLE EXPLOSION SYSTEM
    const sparkleCount = 1400;
    const sparkleGeom = new THREE.BufferGeometry();
    const sparklePositions = new Float32Array(sparkleCount * 3);
    const sparkleVelocities = new Float32Array(sparkleCount * 3);
    const sparkleColors = new Float32Array(sparkleCount * 3);
    const sparkleSizes = new Float32Array(sparkleCount);
    const sparkleAlphas = new Float32Array(sparkleCount);

    const purplePalette = [
      new THREE.Color(0xd946ef), // Radiant orchid
      new THREE.Color(0xa855f7), // Galactic purple
      new THREE.Color(0xc084fc), // Starry lavender
      new THREE.Color(0xf472b6), // Neon pink
      new THREE.Color(0xffffff)  // Star diamond core
    ];

    for (let i = 0; i < sparkleCount; i++) {
      // Hidden initially far offscreen
      sparklePositions[i * 3] = 0;
      sparklePositions[i * 3 + 1] = -1000;
      sparklePositions[i * 3 + 2] = 0;

      sparkleVelocities[i * 3] = 0;
      sparkleVelocities[i * 3 + 1] = 0;
      sparkleVelocities[i * 3 + 2] = 0;

      const col = purplePalette[Math.floor(Math.random() * purplePalette.length)];
      sparkleColors[i * 3] = col.r;
      sparkleColors[i * 3 + 1] = col.g;
      sparkleColors[i * 3 + 2] = col.b;

      sparkleSizes[i] = 0.3 + Math.random() * 0.7;
      sparkleAlphas[i] = 0;
    }

    sparkleGeom.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    sparkleGeom.setAttribute('color', new THREE.BufferAttribute(sparkleColors, 3));

    const starTexture = createStarrySparkleTexture();
    const sparkleMat = new THREE.PointsMaterial({
      size: 0.65,
      map: starTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0
    });

    const sparkleSystem = new THREE.Points(sparkleGeom, sparkleMat);
    scene.add(sparkleSystem);

    let sparklesActive = false;
    let sparkleStartTime = 0;

    // Trigger Blast Sparkles Explosion Function
    blastTriggerFnRef.current = () => {
      sparklesActive = true;
      sparkleStartTime = performance.now();
      sparkleMat.opacity = 1;

      // Instantly vanish central kinetic emblem, floating photos, and all floating scrap/star particles
      emblemGroup.visible = false;
      photoPlanesGroup.visible = false;
      scrapParticles.visible = false;

      // Seed burst origins from center emblem + floating cards
      const origins = [
        { x: 0, y: 0, z: 0 },
        { x: -4.2, y: 1.4, z: 1.2 },
        { x: 4.2, y: -0.6, z: 1.8 },
        { x: -3.4, y: -2.4, z: 0.6 },
        { x: 3.6, y: 2.5, z: -0.8 }
      ];

      const posArr = sparkleGeom.attributes.position.array;
      const velArr = sparkleVelocities;

      for (let i = 0; i < sparkleCount; i++) {
        const origin = origins[i % origins.length];
        posArr[i * 3] = origin.x + (Math.random() - 0.5) * 0.5;
        posArr[i * 3 + 1] = origin.y + (Math.random() - 0.5) * 0.5;
        posArr[i * 3 + 2] = origin.z + (Math.random() - 0.5) * 0.5;

        // Spherical outward burst velocity with air resistance
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const speed = 0.15 + Math.random() * 0.45;

        velArr[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
        velArr[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed + 0.05; // slight upward pop
        velArr[i * 3 + 2] = Math.cos(phi) * speed;
      }
      sparkleGeom.attributes.position.needsUpdate = true;
    };

    // 7. Interactive Spotlight & Camera Movement
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

      // Animate Realistic Purple Star Sparkle Sprinkles
      if (sparklesActive) {
        const timeSinceBlast = (performance.now() - sparkleStartTime) / 1000;
        const posArr = sparkleGeom.attributes.position.array;
        const velArr = sparkleVelocities;

        // Twinkling sparkle opacity decay over 1.6s; completely vanish to leave pure pitch black background
        if (timeSinceBlast > 1.6) {
          sparklesActive = false;
          sparkleMat.opacity = 0;
          sparkleSystem.visible = false;
        } else {
          sparkleMat.opacity = Math.max(0, 1 - timeSinceBlast / 1.6);
          // Sparkle twinkle scale fluttering
          sparkleMat.size = 0.65 + Math.sin(elapsedTime * 18) * 0.15;

          for (let i = 0; i < sparkleCount; i++) {
            // Apply velocity with air drag
            posArr[i * 3] += velArr[i * 3];
            posArr[i * 3 + 1] += velArr[i * 3 + 1];
            posArr[i * 3 + 2] += velArr[i * 3 + 2];

            // Gentle gravity float: sprinkles fall like starry glitter
            velArr[i * 3 + 1] -= 0.0025;

            // Drag resistance
            velArr[i * 3] *= 0.985;
            velArr[i * 3 + 1] *= 0.985;
            velArr[i * 3 + 2] *= 0.985;
          }
          sparkleGeom.attributes.position.needsUpdate = true;
        }
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
      sparkleGeom.dispose();
      chromeMat.dispose();
      coreMat.dispose();
      wireMat.dispose();
      scrapMat.dispose();
      sparkleMat.dispose();
      starTexture.dispose();

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

    // Trigger Three.js purple sparkles explosion
    if (blastTriggerFnRef.current) {
      blastTriggerFnRef.current();
    }

    // Trigger visual blast flash & DOM purple starry sparkles
    setBlastActive(true);
    playSound('blast');

    // Generate 60 randomized DOM starry sparkles for full-screen sparkle sprinkles
    const sparkles = [];
    for (let i = 0; i < 60; i++) {
      sparkles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 10 + Math.random() * 26,
        delay: Math.random() * 0.4,
        duration: 1.5 + Math.random() * 1.5,
        color: ['#f472b6', '#c084fc', '#e879f9', '#a855f7', '#ffffff'][Math.floor(Math.random() * 5)]
      });
    }
    setSparkleSprinkles(sparkles);

    // Hide BOTH 3D emblem AND floating images during current session (restores on refresh)
    setIsBlasted(true);

    if (emblemGroupRef.current) {
      emblemGroupRef.current.visible = false;
    }
    if (photoPlanesGroupRef.current) {
      photoPlanesGroupRef.current.visible = false;
    }

    setTimeout(() => {
      setBlastActive(false);
      setSparkleSprinkles([]);
    }, 1400);
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

      {/* 2. 3D WebGL Three.js Layer with Transparent Background */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full pointer-events-auto z-[2]"
      />

      {/* 5. TAP & HOLD 4S CHARGING HUD OVERLAY */}
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
              HOLD 4 SECONDS FOR PURPLE STARRY SUPERNOVA
            </p>
          </div>
        </div>
      )}

      {/* 6. REALISTIC PURPLE STARRY GLITTER SPRINKLES OVERLAY */}
      {blastActive && (
        <div className="absolute inset-0 z-[50] pointer-events-none overflow-hidden flex items-center justify-center">
          {/* Central Violet/Pink Shockwave Radial Flash */}
          <div className="absolute w-[800px] h-[800px] rounded-full bg-radial-gradient from-white via-purple-500/60 to-transparent opacity-90 animate-ping duration-1000" />
          <div className="absolute inset-0 bg-[#3b0764]/40 mix-blend-screen animate-out fade-out duration-1000" />

          {/* Twinkling 4-Point Starry Sprinkles Drifting Across Viewport */}
          {sparkleSprinkles.map((sp) => (
            <div
              key={sp.id}
              className="absolute animate-in fade-in zoom-in duration-300"
              style={{
                left: `${sp.x}%`,
                top: `${sp.y}%`,
                animationDelay: `${sp.delay}s`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <svg
                width={sp.size}
                height={sp.size}
                viewBox="0 0 24 24"
                fill={sp.color}
                className="animate-spin"
                style={{
                  filter: `drop-shadow(0 0 8px ${sp.color})`,
                  animationDuration: `${sp.duration}s`
                }}
              >
                <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* Video & Audio Controls HUD (Bottom-Left) */}
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
