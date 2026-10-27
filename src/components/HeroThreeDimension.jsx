import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ASSET_MANIFEST } from '../data/brandData';
import { Play, Pause, Volume2, VolumeX, Film, Sparkles, Compass, EyeOff } from 'lucide-react';
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

  // Synchronous initial mobile detection for instant, lag-free mobile video selection
  const [isMobileDevice, setIsMobileDevice] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Lightspeed Satellite Warp State (Pure 3D movement, zero pink line / extra effects)
  const [isCinematicMode, setIsCinematicMode] = useState(false);
  const [isWarping, setIsWarping] = useState(false);
  const [hoveredPhotoIndex, setHoveredPhotoIndex] = useState(null);
  const [autoTimerRemaining, setAutoTimerRemaining] = useState(6);

  const emblemGroupRef = useRef(null);
  const photoPlanesGroupRef = useRef(null);
  const photoPlanesRef = useRef([]);
  const coreMatRef = useRef(null);
  const warpAnimIdRef = useRef(null);
  const autoWarpTimerRef = useRef(null);
  const isInteractingRef = useRef(false);
  const hoveredIndexRef = useRef(null);
  const raycasterRef = useRef(null);
  const cameraRef = useRef(null);
  const mouseVectorRef = useRef(new THREE.Vector2(-999, -999));

  // Responsive device listener for mobile video switching
  useEffect(() => {
    const handleResize = () => {
      setIsMobileDevice(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // WebGL 3D Scene Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = window.innerWidth < 768;

    // 1. Scene, Camera, WebGL Renderer (Ultra-optimized for mobile 60-120fps)
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 140);
    camera.position.set(0, 0, 13);
    cameraRef.current = camera;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile, // Disable MSAA on mobile GPUs to completely eliminate lag
        alpha: true,
        powerPreference: 'high-performance',
        precision: isMobile ? 'mediump' : 'highp'
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(width, height);
      // Strict DPR clamp to avoid 3x/4x mobile GPU fill-rate throttling
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.5));
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

    // Optimized geometry segments on mobile
    const ringGeom = new THREE.TorusGeometry(3.6, 0.08, 16, isMobile ? 24 : 64);
    const ringMesh = new THREE.Mesh(ringGeom, chromeMat);
    ringMesh.rotation.x = Math.PI / 3;
    emblemGroup.add(ringMesh);

    const innerRingGeom = new THREE.TorusGeometry(2.5, 0.05, 16, isMobile ? 20 : 48);
    const innerRingMesh = new THREE.Mesh(innerRingGeom, chromeMat);
    innerRingMesh.rotation.y = Math.PI / 4;
    emblemGroup.add(innerRingMesh);

    const thirdRingGeom = new THREE.TorusGeometry(4.4, 0.04, 16, isMobile ? 24 : 64);
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
    allMaterials.push(wireMat);

    const wireMesh = new THREE.Mesh(wireGeom, wireMat);
    emblemGroup.add(wireMesh);

    // =========================================================================
    // DYNAMIC ORBITAL SATELLITE PHOTO ARRAY
    // =========================================================================
    const textureLoader = new THREE.TextureLoader();
    const photoPlanes = [];
    const loadedTextures = [];
    const planeGeoms = [];

    const satelliteConfig = [
      {
        url: ASSET_MANIFEST.products.divaTop,
        title: "DIVA CORSET // ARCHIVE 01",
        baseX: -4.5,
        baseY: 1.2,
        baseZ: 1.8,
        rotX: 0.08,
        rotY: 0.28,
        w: isMobile ? 1.8 : 2.4,
        h: isMobile ? 2.3 : 3.0,
        orbitSpeed: 0.35,
        orbitRadius: 0.25
      },
      {
        url: ASSET_MANIFEST.editorialHero,
        title: "EDITORIAL HERO // ARCHIVE 02",
        baseX: 4.6,
        baseY: -0.8,
        baseZ: 2.2,
        rotX: -0.06,
        rotY: -0.32,
        w: isMobile ? 1.9 : 2.5,
        h: isMobile ? 2.5 : 3.3,
        orbitSpeed: 0.28,
        orbitRadius: 0.3
      },
      {
        url: ASSET_MANIFEST.products.spikeBra,
        title: "SPIKE BRA // ARCHIVE 03",
        baseX: -3.6,
        baseY: -2.6,
        baseZ: 0.8,
        rotX: 0.14,
        rotY: 0.22,
        w: isMobile ? 1.6 : 2.0,
        h: isMobile ? 1.8 : 2.4,
        orbitSpeed: 0.42,
        orbitRadius: 0.2
      },
      {
        url: ASSET_MANIFEST.products.coordSet,
        title: "CO-ORD ARMOR // ARCHIVE 04",
        baseX: 3.8,
        baseY: 2.4,
        baseZ: -0.5,
        rotX: -0.08,
        rotY: -0.2,
        w: isMobile ? 1.7 : 2.2,
        h: isMobile ? 2.0 : 2.7,
        orbitSpeed: 0.32,
        orbitRadius: 0.22
      }
    ];

    satelliteConfig.forEach((cfg, idx) => {
      textureLoader.load(cfg.url, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        loadedTextures.push(tex);

        const geom = new THREE.PlaneGeometry(cfg.w, cfg.h);
        planeGeoms.push(geom);

        const mat = new THREE.MeshPhysicalMaterial({
          map: tex,
          side: THREE.DoubleSide,
          roughness: 0.35,
          metalness: 0.12,
          clearcoat: 0.6,
          transparent: true,
          opacity: 0.95
        });
        allMaterials.push(mat);

        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(cfg.baseX, cfg.baseY, cfg.baseZ);
        mesh.rotation.set(cfg.rotX, cfg.rotY, 0);

        mesh.userData = {
          index: idx,
          title: cfg.title,
          baseX: cfg.baseX,
          baseY: cfg.baseY,
          baseZ: cfg.baseZ,
          baseRotX: cfg.rotX,
          baseRotY: cfg.rotY,
          currentScale: 1.0,
          targetScale: 1.0,
          targetZOffset: 0,
          currentZOffset: 0,
          orbitSpeed: cfg.orbitSpeed,
          orbitRadius: cfg.orbitRadius
        };

        const wireGeom = new THREE.EdgesGeometry(geom);
        const wireMat = new THREE.LineBasicMaterial({
          color: 0xF4C2C2,
          transparent: true,
          opacity: 0.45
        });
        allMaterials.push(wireMat);

        const wireBorder = new THREE.LineSegments(wireGeom, wireMat);
        mesh.add(wireBorder);
        mesh.userData.wireBorder = wireBorder;
        mesh.userData.wireMat = wireMat;

        photoPlanesGroup.add(mesh);
        photoPlanes.push(mesh);
      });
    });

    photoPlanesRef.current = photoPlanes;

    // Raycaster for 3D Photo Hover Interactivity (Optimized: Throttled by mousemove only)
    const raycaster = new THREE.Raycaster();
    raycasterRef.current = raycaster;

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handlePointerMove = (e) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const x = (e.clientX / w) * 2 - 1;
      const y = -((e.clientY / h) * 2 - 1);

      mouseVectorRef.current.x = x;
      mouseVectorRef.current.y = y;

      targetMouseX = Math.max(-1, Math.min(1, x));
      targetMouseY = Math.max(-1, Math.min(1, y));

      // Throttled raycasting on pointer movement only (NOT inside per-frame animate loop!)
      if (photoPlanes.length > 0 && camera) {
        raycaster.setFromCamera(mouseVectorRef.current, camera);
        const intersects = raycaster.intersectObjects(photoPlanes, false);
        if (intersects.length > 0) {
          isInteractingRef.current = true;
          const idx = intersects[0].object.userData.index;
          hoveredIndexRef.current = idx;
          setHoveredPhotoIndex(idx);
          if (container) container.style.cursor = 'pointer';
        } else {
          isInteractingRef.current = false;
          hoveredIndexRef.current = null;
          setHoveredPhotoIndex(null);
          if (container) container.style.cursor = 'default';
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Click handler for 3D photo satellite exploration
    const handleClick = (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return;
      if (hoveredIndexRef.current !== null) {
        playSound('sparkle');
        setIsCinemaOpen(true);
      }
    };

    window.addEventListener('click', handleClick);

    // Render loop (Ultra-smooth 60-120fps, zero heavy calculations)
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

      // Smooth satellite mesh position & scale updates
      if (photoPlanesGroup.visible && !isWarping) {
        const activeHoverIdx = hoveredIndexRef.current;

        for (let i = 0; i < photoPlanes.length; i++) {
          const mesh = photoPlanes[i];
          const ud = mesh.userData;
          const isCurrentHovered = activeHoverIdx === ud.index;

          ud.targetScale = isCurrentHovered ? 1.15 : 1.0;
          ud.targetZOffset = isCurrentHovered ? 1.8 : 0;

          ud.currentScale += (ud.targetScale - ud.currentScale) * 0.1;
          ud.currentZOffset += (ud.targetZOffset - ud.currentZOffset) * 0.1;

          mesh.scale.setScalar(ud.currentScale);

          const orbitX = Math.cos(elapsedTime * ud.orbitSpeed + i * 1.5) * ud.orbitRadius;
          const orbitY = Math.sin(elapsedTime * ud.orbitSpeed * 1.2 + i) * (ud.orbitRadius * 0.8);

          mesh.position.x = ud.baseX + orbitX;
          mesh.position.y = ud.baseY + orbitY;
          mesh.position.z = ud.baseZ + ud.currentZOffset;

          if (isCurrentHovered) {
            mesh.rotation.x += (0 - mesh.rotation.x) * 0.1;
            mesh.rotation.y += (0 - mesh.rotation.y) * 0.1;
            if (ud.wireMat) {
              ud.wireMat.color.setHex(0xF4C2C2);
              ud.wireMat.opacity = 0.9;
            }
          } else {
            mesh.rotation.x += (ud.baseRotX - mesh.rotation.x) * 0.1;
            mesh.rotation.y += (ud.baseRotY - mesh.rotation.y) * 0.1;
            if (ud.wireMat) {
              ud.wireMat.color.setHex(0xF4C2C2);
              ud.wireMat.opacity = 0.4;
            }
          }
        }
      }

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
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.0 : 1.5));
    };

    window.addEventListener('resize', handleResize);
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('click', handleClick);
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
  }, [isWarping]);

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

  // =========================================================================
  // PURE MOVEMENT LIGHTSPEED WARP EXIT
  // Vanishes purely with 3D movement shrinking into distance like a satellite
  // ZERO pink lines, ZERO streaks, ZERO extra DOM overlay clutter
  // =========================================================================
  const triggerLightspeedWarp = (e) => {
    if (e) e.stopPropagation();
    if (isCinematicMode || isWarping) return;

    setIsWarping(true);
    playSound('lightspeed_warp');

    const emblemGroup = emblemGroupRef.current;
    const photoPlanesGroup = photoPlanesGroupRef.current;

    // Movement departure vector: Accelerates into the screen's depth towards upper-right
    const targetDx = 11.0;
    const targetDy = 6.5;
    const targetDz = -52.0;

    const initialEmblemX = emblemGroup ? emblemGroup.position.x : 0;
    const initialEmblemY = emblemGroup ? emblemGroup.position.y : 0;
    const initialEmblemZ = emblemGroup ? emblemGroup.position.z : 0;
    const initialScale = emblemGroup ? emblemGroup.scale.x : 1;

    const initialPhotoX = photoPlanesGroup ? photoPlanesGroup.position.x : 0;
    const initialPhotoY = photoPlanesGroup ? photoPlanesGroup.position.y : 0;
    const initialPhotoZ = photoPlanesGroup ? photoPlanesGroup.position.z : 0;

    const duration = 1000; // 1s pure kinetic hyperdrive
    const startTime = performance.now();

    const warpLoop = (now) => {
      const elapsed = now - startTime;
      const linearProgress = Math.min(1, Math.max(0, elapsed / duration));

      // Relativistic exponential warp velocity
      const warpSpeed = Math.pow(linearProgress, 2.7);

      // Shrinks progressively smaller and smaller like a distant satellite into deep space
      const currentScale = Math.max(0.0001, initialScale * (1 - Math.pow(linearProgress, 2.0)));

      if (emblemGroup) {
        emblemGroup.position.x = initialEmblemX + warpSpeed * targetDx;
        emblemGroup.position.y = initialEmblemY + warpSpeed * targetDy;
        emblemGroup.position.z = initialEmblemZ + warpSpeed * targetDz;
        emblemGroup.scale.setScalar(currentScale);
        emblemGroup.rotation.z += 0.09 * (1 + warpSpeed * 8);
      }

      if (photoPlanesGroup) {
        photoPlanesGroup.position.x = initialPhotoX + warpSpeed * targetDx;
        photoPlanesGroup.position.y = initialPhotoY + warpSpeed * targetDy;
        photoPlanesGroup.position.z = initialPhotoZ + warpSpeed * targetDz;
        photoPlanesGroup.scale.setScalar(currentScale);
      }

      if (linearProgress < 1) {
        warpAnimIdRef.current = requestAnimationFrame(warpLoop);
      } else {
        // Complete pure movement vanish
        if (emblemGroup) {
          emblemGroup.visible = false;
          emblemGroup.scale.setScalar(1);
          emblemGroup.position.set(0, 0, 0);
        }
        if (photoPlanesGroup) {
          photoPlanesGroup.visible = false;
          photoPlanesGroup.scale.setScalar(1);
          photoPlanesGroup.position.set(0, 0, 0);
        }

        setIsCinematicMode(true);
        setIsWarping(false);
        warpAnimIdRef.current = null;
      }
    };

    warpAnimIdRef.current = requestAnimationFrame(warpLoop);
  };

  // REVERSE WARP (Summon 3D Satellites Back from Deep Space)
  const summon3dSatellites = (e) => {
    if (e) e.stopPropagation();
    playSound('lightspeed_warp');
    setIsWarping(true);

    const emblemGroup = emblemGroupRef.current;
    const photoPlanesGroup = photoPlanesGroupRef.current;

    const startDx = 11.0;
    const startDy = 6.5;
    const startDz = -52.0;

    if (emblemGroup) {
      emblemGroup.visible = true;
      emblemGroup.position.set(startDx, startDy, startDz);
      emblemGroup.scale.setScalar(0.01);
    }
    if (photoPlanesGroup) {
      photoPlanesGroup.visible = true;
      photoPlanesGroup.position.set(startDx, startDy, startDz);
      photoPlanesGroup.scale.setScalar(0.01);
    }

    const duration = 950;
    const startTime = performance.now();

    const returnLoop = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, Math.max(0, elapsed / duration));
      const ease = 1 - Math.pow(1 - progress, 3);

      const currentScale = 0.01 + ease * 0.99;

      if (emblemGroup) {
        emblemGroup.position.x = startDx * (1 - ease);
        emblemGroup.position.y = startDy * (1 - ease);
        emblemGroup.position.z = startDz * (1 - ease);
        emblemGroup.scale.setScalar(currentScale);
      }
      if (photoPlanesGroup) {
        photoPlanesGroup.position.x = startDx * (1 - ease);
        photoPlanesGroup.position.y = startDy * (1 - ease);
        photoPlanesGroup.position.z = startDz * (1 - ease);
        photoPlanesGroup.scale.setScalar(currentScale);
      }

      if (progress < 1) {
        requestAnimationFrame(returnLoop);
      } else {
        if (emblemGroup) emblemGroup.position.set(0, 0, 0);
        if (photoPlanesGroup) photoPlanesGroup.position.set(0, 0, 0);
        setIsCinematicMode(false);
        setIsWarping(false);
      }
    };

    requestAnimationFrame(returnLoop);
  };

  // =========================================================================
  // AUTOMATIC VANISH TIMER (Vanishes automatically with movement in 6s if idle)
  // =========================================================================
  useEffect(() => {
    if (isCinematicMode || isWarping) return;

    let countdown = 6;
    setAutoTimerRemaining(countdown);

    const interval = setInterval(() => {
      // Pause countdown if user is hovering/interacting
      if (isInteractingRef.current) return;

      countdown -= 1;
      setAutoTimerRemaining(countdown);

      if (countdown <= 0) {
        clearInterval(interval);
        triggerLightspeedWarp();
      }
    }, 1000);

    autoWarpTimerRef.current = interval;

    return () => {
      clearInterval(interval);
    };
  }, [isCinematicMode]);

  useEffect(() => {
    return () => {
      if (warpAnimIdRef.current) cancelAnimationFrame(warpAnimIdRef.current);
    };
  }, []);

  // Distinct Video Reel for Mobile vs Desktop
  const videoSource = isMobileDevice ? ASSET_MANIFEST.videos.heroMobile : ASSET_MANIFEST.videos.heroDesktop;
  const audioSource = isMobileDevice ? ASSET_MANIFEST.audio.heroMobile : ASSET_MANIFEST.audio.heroDesktop;

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

      {/* 1. Native Master Video Reel: Mobile has dedicated 9:16 vertical reel, Desktop has landscape */}
      <video
        ref={videoRef}
        key={videoSource}
        autoPlay
        loop
        muted
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        preload="auto"
        disablePictureInPicture
        onTimeUpdate={handleVideoTimeUpdate}
        onLoadedData={() => setVideoLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transition-opacity duration-700 ease-out ${
          videoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          filter: 'none',
          imageRendering: 'high-quality',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'translate3d(0, 0, 0)'
        }}
      >
        <source src={videoSource} type="video/mp4" />
      </video>

      {/* 2. 3D WebGL Three.js Layer with Pure Movement Vanishing Transition */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full pointer-events-auto z-[2]"
      />

      {/* 3. HOVERED 3D SATELLITE PHOTO HUD BADGE */}
      {hoveredPhotoIndex !== null && !isCinematicMode && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[20] pointer-events-none animate-in fade-in zoom-in duration-150">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-[#be185d]/60 text-white text-xs font-mono tracking-widest shadow-[0_0_20px_rgba(190,24,93,0.35)]">
            <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-spin" />
            <span>CLICK TO VIEW ATELIER GRAIL</span>
          </div>
        </div>
      )}

      {/* 4. TOP-RIGHT HIDE 3D BUTTON (Clean, Minimalist) */}
      {!isCinematicMode && (
        <div className="absolute top-[60px] sm:top-[76px] right-4 sm:right-6 z-[20] flex items-center gap-2 animate-in fade-in duration-300">
          <button
            onClick={triggerLightspeedWarp}
            title="Warp 3D satellites into distance to reveal pure video reel"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-black/80 hover:bg-[#be185d]/30 border border-white/20 hover:border-[#be185d]/80 text-white hover:text-pink text-[10px] sm:text-xs font-mono tracking-wider backdrop-blur-md cursor-pointer transition-all shadow-lg active:scale-95 group"
          >
            <EyeOff className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink-300 group-hover:scale-110 transition-transform" />
            <span>HIDE 3D</span>
            <span className="text-[10px] text-silver/50 font-mono hidden sm:inline">
              ({autoTimerRemaining}s)
            </span>
          </button>
        </div>
      )}

      {/* 5. Video, Audio & Mode Controls HUD (Bottom-Left) */}
      <div className="absolute bottom-4 sm:bottom-6 left-3 sm:left-6 z-[10] flex items-center gap-2">
        <button
          onClick={handleTogglePlay}
          className="p-2 sm:p-2.5 rounded-full bg-black/70 hover:bg-pink/20 border border-white/20 hover:border-pink text-white hover:text-pink transition-all backdrop-blur-md cursor-pointer group shadow-lg"
          title={isPlaying ? 'Pause Background Reel' : 'Play Background Reel'}
        >
          {isPlaying ? <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />}
        </button>

        <button
          onClick={handleToggleMute}
          className={`p-2 sm:p-2.5 rounded-full border transition-all backdrop-blur-md cursor-pointer group shadow-lg flex items-center gap-1.5 ${
            isMuted
              ? 'bg-black/70 border-white/20 hover:border-pink text-silver/80 hover:text-pink'
              : 'bg-pink/20 border-pink text-pink shadow-[0_0_15px_rgba(244,194,194,0.4)]'
          }`}
          title={isMuted ? 'Unmute Audio Soundtrack' : 'Mute Audio Soundtrack'}
        >
          {isMuted ? (
            <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-silver/70 group-hover:text-pink" />
          ) : (
            <>
              <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink animate-pulse" />
              <span className="text-[10px] font-mono tracking-wider text-pink hidden sm:inline">SOUND ON</span>
            </>
          )}
        </button>

        {/* Bring Back 3D Satellites Button (When in Cinematic Video Mode) */}
        {isCinematicMode && (
          <button
            onClick={summon3dSatellites}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-black/85 hover:bg-pink/20 border border-[#be185d]/60 text-white hover:text-pink text-[9px] sm:text-xs font-mono tracking-wider uppercase transition-all backdrop-blur-md cursor-pointer shadow-[0_0_15px_rgba(190,24,93,0.3)] animate-in fade-in"
            title="Summon 3D Satellite Sculptures back from distance"
          >
            <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink-300 animate-spin" />
            <span className="hidden xs:inline">SUMMON 3D</span>
            <span className="xs:hidden">3D</span>
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            playSound('pip');
            setIsCinemaOpen(true);
          }}
          className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-black/70 hover:bg-pink/20 border border-white/20 hover:border-pink text-white hover:text-pink text-[9px] sm:text-xs font-mono transition-all backdrop-blur-md cursor-pointer shadow-lg"
          title="Open Cinema Master Reel Modal"
        >
          <Film className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink" />
          <span className="hidden sm:inline">FULL CINEMA REEL</span>
          <span className="sm:hidden">CINEMA</span>
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
