import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, RotateCcw, Scissors, Sparkles, Layers } from 'lucide-react';
import { MUSEUM_ITEMS } from '../data/brandData';
import { playSound } from '../utils/audio';

// Helper to generate a 2D rounded-rectangle shape with true circular absarc corners
function createRoundedRectShape(width, height, radius) {
  const shape = new THREE.Shape();
  const x0 = -width / 2;
  const x1 = width / 2;
  const y0 = -height / 2;
  const y1 = height / 2;
  const r = Math.min(radius, width / 2, height / 2);

  shape.moveTo(x0 + r, y0);
  shape.lineTo(x1 - r, y0);
  shape.absarc(x1 - r, y0 + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(x1, y1 - r);
  shape.absarc(x1 - r, y1 - r, r, 0, Math.PI / 2, false);
  shape.lineTo(x0 + r, y1);
  shape.absarc(x0 + r, y1 - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(x0, y0 + r);
  shape.absarc(x0 + r, y0 + r, r, Math.PI, (3 * Math.PI) / 2, false);
  return shape;
}

export default function AvzMuseum({ onRequestCustomCommission, theme = 'dark', cmsMuseum }) {
  const mountRef = useRef(null);
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState('3d'); // '3d' or 'grid'

  // Mobile Lookbook Archive Gallery State
  const mobileTrackRef = useRef(null);

  const activeIndexRef = useRef(0);
  const activeItem = MUSEUM_ITEMS[activeIndex] || MUSEUM_ITEMS[0];

  // 3D references
  const carouselGroupRef = useRef(null);
  const pedestalsRef = useRef([]);
  const targetRotundaAngleRef = useRef(0);
  const currentRotundaAngleRef = useRef(0);
  const orbitAngleRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startDragXRef = useRef(0);
  const prevMouseXRef = useRef(0);

  // Keep activeIndexRef in sync
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Main 3D Canvas Lifecycle: Initialized for Desktop 3D view mode
  useEffect(() => {
    if (viewMode !== '3d') return;
    if (typeof window === 'undefined') return;

    // Only instantiate WebGL when on desktop screens (>= 768px) to eliminate mobile lag and touch conflicts
    if (window.innerWidth < 768) return;

    const container = mountRef.current;
    if (!container) return;

    // Clean up any residual child canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 640;
    const isLight = theme === 'light';
    const bgColor = isLight ? 0xf6f5f9 : 0x060608;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.FogExp2(bgColor, isLight ? 0.012 : 0.024);

    // Camera calibrated for majestic gallery viewing with enlarged frames:
    // Plinth rests solidly on floor grid, collar gleams, and grand framed pieces float with ample breathing room
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 2.35, 15.6);
    camera.lookAt(0, 2.25, 6.8);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = isLight ? 1.15 : 1.3;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('Museum WebGL not available', e);
      return;
    }

    // 2. Curatorial Gallery Lighting
    const ambientLight = new THREE.AmbientLight(isLight ? 0xffffff : 0x252535, isLight ? 2.2 : 1.4);
    scene.add(ambientLight);

    // Warm museum spotlight focused on the front active pedestal
    const spotlight = new THREE.SpotLight(isLight ? 0xfff0f5 : 0xF5EBE6, isLight ? 34 : 32, 40, Math.PI / 4, 0.4, 1.2);
    spotlight.position.set(0, 11, 12);
    spotlight.target.position.set(0, 2.35, 6.8);
    scene.add(spotlight);
    scene.add(spotlight.target);

    // Architectural rim lights for edge glow
    const rimLeft = new THREE.PointLight(isLight ? 0x9333ea : 0xa06cd5, isLight ? 6 : 5, 22);
    rimLeft.position.set(-8, 3.5, 4);
    scene.add(rimLeft);

    const rimRight = new THREE.PointLight(isLight ? 0xdb2777 : 0xd4afb9, isLight ? 6 : 5, 22);
    rimRight.position.set(8, 3.5, 4);
    scene.add(rimRight);

    // 3. Reflective Floor Grid
    const floorGeom = new THREE.PlaneGeometry(60, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xeeeaf4 : 0x08080a,
      roughness: isLight ? 0.25 : 0.35,
      metalness: isLight ? 0.3 : 0.8
    });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.55;
    scene.add(floor);

    const gridHelper = new THREE.GridHelper(
      50,
      40,
      isLight ? 0xd8b4fe : 0x33333f,
      isLight ? 0xf3e8ff : 0x14141a
    );
    gridHelper.position.y = -1.54;
    scene.add(gridHelper);

    // 4. Stardust floating particles
    const dustCount = 45;
    const dustGeom = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 24;
      dustPos[i + 1] = Math.random() * 8 - 1;
      dustPos[i + 2] = (Math.random() - 0.5) * 20;
    }
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: isLight ? 0x9333ea : 0xDCDCDC,
      size: 0.04,
      transparent: true,
      opacity: isLight ? 0.45 : 0.35
    });
    const dust = new THREE.Points(dustGeom, dustMat);
    scene.add(dust);

    // 5. Circular Rotunda Carousel with Rotating Idols & Frames
    const carouselGroup = new THREE.Group();
    carouselGroupRef.current = carouselGroup;
    scene.add(carouselGroup);

    const pedestals = [];
    const textureLoader = new THREE.TextureLoader();
    const radius = 6.8;
    const total = MUSEUM_ITEMS.length;

    // Shared materials
    const plinthMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xede4f7 : 0x111116,
      roughness: 0.35,
      metalness: isLight ? 0.5 : 0.8
    });
    const frameChassisMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0x27272a : 0x16161b,
      metalness: 0.9,
      roughness: 0.22
    });
    const frameTrimMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xbe185d : 0xC5A880,
      metalness: 0.95,
      roughness: 0.15
    });
    const backMat = new THREE.MeshStandardMaterial({
      color: 0x101014,
      roughness: 0.35,
      metalness: 0.85
    });

    const plinthHeight = 1.15;
    const plinthTopRadius = 1.25;
    const plinthBottomRadius = 1.45;
    const plinthGeom = new THREE.CylinderGeometry(plinthTopRadius, plinthBottomRadius, plinthHeight, 36);
    const ringGeom = new THREE.TorusGeometry(plinthTopRadius + 0.02, 0.035, 16, 48);
    const capGeom = new THREE.CircleGeometry(plinthTopRadius, 36);
    const riserGeom = new THREE.CylinderGeometry(0.2, 0.28, 0.24, 24);

    MUSEUM_ITEMS.forEach((item, idx) => {
      const angle = (idx / total) * Math.PI * 2;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;

      const group = new THREE.Group();
      group.position.set(x, -1.55, z);
      group.rotation.y = angle;

      // Solid Circular Plinth Base (rests solidly on reflective floor)
      const plinth = new THREE.Mesh(plinthGeom, plinthMat);
      plinth.position.y = plinthHeight / 2;
      group.add(plinth);

      // Plinth Top Cap Surface
      const cap = new THREE.Mesh(capGeom, plinthMat);
      cap.rotation.x = -Math.PI / 2;
      cap.position.y = plinthHeight + 0.001;
      group.add(cap);

      // Metallic Collar Ring
      const ring = new THREE.Mesh(ringGeom, frameTrimMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = plinthHeight;
      group.add(ring);

      // Architectural Gallery Mount / Easel Riser (bridges plinth collar to artwork frame)
      const riser = new THREE.Mesh(riserGeom, frameTrimMat);
      riser.position.y = plinthHeight + 0.12;
      group.add(riser);

      // Frame and Surface Proportions - calibrated to natural aspect ratio of the garment
      const targetHeight = 4.85;
      const itemAspect = item.aspectRatio || (
        idx === 0 ? 220 / 415 :
        idx === 1 ? 360 / 460 :
        idx === 2 ? 245 / 435 :
        832 / 1152
      );

      const picW = targetHeight * itemAspect;
      const picH = targetHeight;
      const frameW = picW + 0.26;
      const frameH = picH + 0.26;
      const frameR = Math.min(0.22, picW * 0.12);
      const picR = Math.min(0.16, picW * 0.09);

      const frameShape = createRoundedRectShape(frameW, frameH, frameR);
      const frameGeom = new THREE.ExtrudeGeometry(frameShape, {
        depth: 0.07,
        bevelEnabled: true,
        bevelSegments: 3,
        bevelSize: 0.02,
        bevelThickness: 0.02,
        curveSegments: 24
      });

      const picShape = createRoundedRectShape(picW, picH, picR);
      const picGeom = new THREE.ShapeGeometry(picShape, 24);

      // Precise normalized UV mapping preventing distortion
      const pos = picGeom.attributes.position;
      const uvs = [];
      for (let pIdx = 0; pIdx < pos.count; pIdx++) {
        const u = (pos.getX(pIdx) + picW / 2) / picW;
        const v = (pos.getY(pIdx) + picH / 2) / picH;
        uvs.push(u, v);
      }
      picGeom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

      // Calculate exact baseY so frame bottom rests cleanly above the pedestal
      const frameBottomY = plinthHeight + 0.29;
      const baseY = frameBottomY + (frameH / 2);

      // Artifact Sub-Group floating smoothly above the pedestal collar
      const artifactGroup = new THREE.Group();
      artifactGroup.position.y = baseY;

      // Frame Chassis
      const frameMesh = new THREE.Mesh(frameGeom, frameChassisMat);
      frameMesh.position.z = -0.07;
      artifactGroup.add(frameMesh);

      // Solid Back
      const backMesh = new THREE.Mesh(picGeom, backMat);
      backMesh.position.z = -0.071;
      backMesh.rotation.y = Math.PI;
      artifactGroup.add(backMesh);

      // Picture Display Surface
      const texture = textureLoader.load(
        item.image,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          if (picMat) picMat.needsUpdate = true;
        },
        undefined,
        (err) => {
          console.error(`Museum texture load error [${item.id}]:`, err);
        }
      );

      const picMat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        toneMapped: false,
        polygonOffset: true,
        polygonOffsetFactor: -1.0,
        polygonOffsetUnits: -4.0
      });

      const picMesh = new THREE.Mesh(picGeom, picMat);
      picMesh.position.z = 0.03;
      picMesh.renderOrder = 2;
      artifactGroup.add(picMesh);

      group.add(artifactGroup);
      carouselGroup.add(group);
      pedestals.push({ group, artifactGroup, angle, baseY, frameGeom, picGeom, picMat, texture });
    });

    pedestalsRef.current = pedestals;

    // Set initial rotunda angle
    currentRotundaAngleRef.current = -(activeIndexRef.current / total) * Math.PI * 2;
    targetRotundaAngleRef.current = currentRotundaAngleRef.current;
    carouselGroup.rotation.y = currentRotundaAngleRef.current;

    // Pointer Interaction (Desktop drag-to-orbit)
    const handlePointerDown = (e) => {
      isDraggingRef.current = true;
      startDragXRef.current = e.clientX;
      prevMouseXRef.current = e.clientX;
    };

    const handlePointerMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMouseXRef.current;
      orbitAngleRef.current += deltaX * 0.006;
      prevMouseXRef.current = e.clientX;
    };

    const handlePointerUp = (e) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      const totalDelta = e.clientX - startDragXRef.current;
      if (Math.abs(totalDelta) > 40) {
        if (totalDelta < 0) {
          nextArtifact();
        } else {
          prevArtifact();
        }
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smoothly interpolate rotunda carousel angle
      currentRotundaAngleRef.current += (targetRotundaAngleRef.current - currentRotundaAngleRef.current) * 0.08;
      if (carouselGroupRef.current) {
        carouselGroupRef.current.rotation.y = currentRotundaAngleRef.current;
      }

      // Smoothly return active piece orbit angle to zero
      if (!isDraggingRef.current) {
        orbitAngleRef.current *= 0.94;
      }

      // Subtly animate active front piece levitation
      const currentIdx = activeIndexRef.current;
      pedestalsRef.current.forEach((ped, idx) => {
        if (idx === currentIdx) {
          ped.artifactGroup.position.y = ped.baseY + Math.sin(elapsedTime * 1.5) * 0.025;
          ped.artifactGroup.rotation.y = orbitAngleRef.current;
        } else {
          ped.artifactGroup.position.y = ped.baseY;
          ped.artifactGroup.rotation.y = 0;
        }
      });

      // Animate dust particles
      dust.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 640;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domEl.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);

      // Clean disposal
      pedestalsRef.current.forEach((ped) => {
        if (ped.frameGeom) ped.frameGeom.dispose();
        if (ped.picGeom) ped.picGeom.dispose();
        if (ped.picMat) ped.picMat.dispose();
        if (ped.texture) ped.texture.dispose();
      });
      plinthGeom.dispose();
      ringGeom.dispose();
      dustGeom.dispose();
      floorGeom.dispose();

      pedestalsRef.current = [];
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [viewMode, theme]);

  // Rotunda Navigation Handlers
  const selectPedestal = (index) => {
    playSound('pip');
    setActiveIndex(index);
    const total = MUSEUM_ITEMS.length;
    let target = -(index / total) * Math.PI * 2;
    const current = targetRotundaAngleRef.current;
    const diff = (target - current) % (Math.PI * 2);
    let shortest = diff;
    if (diff > Math.PI) shortest -= Math.PI * 2;
    if (diff < -Math.PI) shortest += Math.PI * 2;
    targetRotundaAngleRef.current = current + shortest;
    orbitAngleRef.current = 0;
  };

  const nextArtifact = () => {
    playSound('pip');
    const nextIdx = (activeIndexRef.current + 1) % MUSEUM_ITEMS.length;
    selectPedestal(nextIdx);
  };

  const prevArtifact = () => {
    playSound('pip');
    const prevIdx = (activeIndexRef.current - 1 + MUSEUM_ITEMS.length) % MUSEUM_ITEMS.length;
    selectPedestal(prevIdx);
  };

  const selectMobileItem = (idx) => {
    const total = MUSEUM_ITEMS.length;
    const targetIdx = Math.max(0, Math.min(idx, total - 1));
    playSound('pip');
    setActiveIndex(targetIdx);
    selectPedestal(targetIdx);

    const el = mobileTrackRef.current;
    if (el) {
      const card = el.querySelector('article');
      const cardWidth = card ? card.clientWidth + 16 : 320;
      el.scrollTo({ left: targetIdx * cardWidth, behavior: 'smooth' });
    }
  };

  const handleMobileTrackScroll = () => {
    const el = mobileTrackRef.current;
    if (!el) return;
    const card = el.querySelector('article');
    const cardWidth = card ? card.clientWidth + 16 : 320;
    const idx = Math.min(Math.round(el.scrollLeft / cardWidth), MUSEUM_ITEMS.length - 1);
    if (idx >= 0 && idx !== activeIndex) {
      setActiveIndex(idx);
      selectPedestal(idx);
    }
  };

  const handleCommissionClick = (item) => {
    playSound('click');
    if (onRequestCustomCommission) {
      onRequestCustomCommission(`Archival Recreation: ${item.name}`);
    }
    const el = document.getElementById('custom');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const isLight = theme === 'light';

  return (
    <section
      id="museum"
      ref={sectionRef}
      className={`w-full py-10 sm:py-14 px-4 sm:px-8 lg:px-12 select-none border-t text-left transition-colors duration-300 ${
        isLight
          ? 'bg-[#faf9f6] border-purple-200/50 text-zinc-900'
          : 'bg-[#060608] border-white/8 text-silver'
      }`}
    >
      {/* Museum Editorial Header */}
      <div className="mb-6 sm:mb-8 pb-4 border-b border-white/8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          {/* Badge pill with pink pulse dot */}
          <div className="section-badge-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-2 text-[10px] font-mono tracking-[0.25em] uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse shrink-0" />
            <span className="hidden sm:inline">PERMANENT ARCHIVE • ONE-OF-A-KIND PIECES</span>
            <span className="inline sm:hidden">LOOKBOOK ARCHIVE • SPATIAL RUNWAY</span>
          </div>

          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-light font-mono uppercase tracking-[0.2em] leading-tight ${
            isLight ? 'text-zinc-900' : 'text-white'
          }`}>
            {cmsMuseum?.headline ? cmsMuseum.headline : (<>ARCHIVE <span className="text-zinc-500 font-normal">MUSEUM</span></>)}
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1.5 font-mono tracking-wider max-w-xl leading-relaxed">
            {cmsMuseum?.description || 'Our permanent archive of one-of-a-kind wearable art and past pieces. Handcrafted pieces available for custom recreation.'}
          </p>
        </div>

        {/* View Mode Switcher (Desktop only) */}
        <div className="hidden md:flex items-center gap-1.5 bg-[#101014] p-1.5 rounded-full border border-white/10 shrink-0">
          <button
            onClick={() => {
              playSound('glitch_click');
              setViewMode('3d');
            }}
            className={`px-4 py-1.5 rounded-full text-[11px] font-mono tracking-[0.18em] uppercase transition-all cursor-pointer ${
              viewMode === '3d'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            3D Rotunda
          </button>
          <button
            onClick={() => {
              playSound('glitch_click');
              setViewMode('grid');
            }}
            className={`px-4 py-1.5 rounded-full text-[11px] font-mono tracking-[0.18em] uppercase transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Archive Index
          </button>
        </div>
      </div>

      {/* =========================================================================
          MOBILE VIEW: LOOKBOOK ARCHIVE EXHIBITION (FLUID HORIZONTAL GALLERY)
          Native touch swiping, centered cards, zero Tinder stacks, zero scroll trap
          ========================================================================= */}
      <div className="block md:hidden w-full">
        {/* Progress & Navigation Controls HUD */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-pink uppercase font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse inline-block" />
              <span>SPECIMEN [ 0{activeIndex + 1} / 0{MUSEUM_ITEMS.length} ]</span>
            </span>
          </div>

          {/* Previous / Next Arrow Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => selectMobileItem(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous Artifact"
              className={`p-2.5 rounded-full border transition-all active:scale-95 cursor-pointer shadow-md ${
                activeIndex === 0
                  ? 'bg-black/30 border-white/5 text-zinc-600 cursor-not-allowed'
                  : isLight
                  ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-800'
                  : 'bg-black/80 hover:bg-white/15 border-white/20 text-white'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => selectMobileItem(activeIndex + 1)}
              disabled={activeIndex === MUSEUM_ITEMS.length - 1}
              aria-label="Next Artifact"
              className={`p-2.5 rounded-full border transition-all active:scale-95 cursor-pointer shadow-md ${
                activeIndex === MUSEUM_ITEMS.length - 1
                  ? 'bg-black/30 border-white/5 text-zinc-600 cursor-not-allowed'
                  : isLight
                  ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-800'
                  : 'bg-black/80 hover:bg-white/15 border-white/20 text-white'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Specimen Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 mb-4">
          {MUSEUM_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => selectMobileItem(idx)}
              className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all cursor-pointer border ${
                activeIndex === idx
                  ? 'bg-pink text-black font-bold border-pink shadow-md'
                  : isLight
                  ? 'bg-zinc-100 text-zinc-600 border-zinc-300 hover:border-pink'
                  : 'bg-white/5 text-zinc-400 border-white/10 hover:border-pink hover:text-white'
              }`}
            >
              0{idx + 1}
            </button>
          ))}
        </div>

        {/* Fluid Horizontal Native Carousel (Zero touch interception, zero vertical lock) */}
        <div
          ref={mobileTrackRef}
          onScroll={handleMobileTrackScroll}
          className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory py-2 px-1 scroll-smooth touch-pan-x"
        >
          {MUSEUM_ITEMS.map((item, idx) => (
            <article
              key={item.id}
              className={`snap-center shrink-0 w-[86vw] max-w-[360px] h-[550px] sm:h-[580px] rounded-3xl border p-5 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden mobile-grunge-card select-none ${
                isLight
                  ? 'border-zinc-300 bg-white text-zinc-900'
                  : 'border-white/15 bg-gradient-to-b from-[#16031b] via-[#0c0c12] to-[#060609] text-white'
              }`}
            >
              {/* Top Badge Bar */}
              <div className="flex items-center justify-between shrink-0 mb-2.5">
                <span className="px-3 py-1 rounded-full bg-pink/15 border border-pink/40 text-[9px] font-mono tracking-widest text-pink uppercase font-semibold">
                  {item.tag}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 tracking-wider">
                  EST. {item.year}
                </span>
              </div>

              {/* Main Specimen Image Frame with pointer-events-none */}
              <div className="relative w-full h-[280px] sm:h-[305px] rounded-2xl overflow-hidden border border-white/10 bg-black/95 shrink-0 flex items-center justify-center p-2">
                <img
                  src={item.image}
                  alt={item.name}
                  draggable={false}
                  className="w-full h-full object-contain filter brightness-95 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Corner Badge */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-white pointer-events-none">
                  <span className="bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20 uppercase tracking-widest text-[9px]">
                    {item.originalOwner}
                  </span>
                  <span className="text-pink text-[9px] font-bold">1-OF-1 ARCHIVE</span>
                </div>
              </div>

              {/* Details & Curatorial Copy */}
              <div className="flex flex-col justify-between flex-1 pt-2.5 pb-1 text-left">
                <div>
                  <h3 className={`font-mono text-sm sm:text-base font-semibold uppercase leading-tight line-clamp-1 mb-1.5 ${
                    isLight ? 'text-zinc-900' : 'text-white'
                  }`}>
                    {item.name}
                  </h3>
                  <p className={`text-[11px] font-montserrat italic line-clamp-2 leading-relaxed mb-2 ${
                    isLight ? 'text-zinc-700' : 'text-zinc-300'
                  }`}>
                    "{item.story}"
                  </p>
                </div>

                {/* Materials Pill */}
                <div className={`py-1 px-2.5 rounded-lg border text-[10px] font-mono line-clamp-1 mb-2.5 ${
                  isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-800' : 'bg-black/60 border-white/10 text-zinc-300'
                }`}>
                  <span className="text-pink font-semibold">CRAFT: </span>
                  {item.materials}
                </div>

                {/* Recreation Action Button */}
                <button
                  onClick={() => handleCommissionClick(item)}
                  className="w-full py-3 px-4 rounded-full bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs tracking-[0.18em] uppercase transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>REQUEST CUSTOM ORDER ↗</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* =========================================================================
          DESKTOP VIEW: PROPORTIONATE 3D ROTUNDA & CURATORIAL PLAQUE (MD+ SCREENS)
          Rotating pedestals/idols with frames on it, solid titanium frames, pristine plaque
          ========================================================================= */}
      <div className="hidden md:block w-full">
        {viewMode === '3d' ? (
          <div className={`relative w-full rounded-2xl overflow-hidden border shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-row items-stretch ${
            isLight ? 'border-zinc-300 bg-white' : 'border-white/12 bg-[#09090c]'
          }`}>
            {/* Three.js 3D Canvas (Left / Main Rotunda Showcase) */}
            <div className="museum-dark-canvas relative flex-1 h-[640px] lg:h-[720px] w-full cursor-grab active:cursor-grabbing overflow-hidden">
              <div ref={mountRef} className="w-full h-full" />

              {/* Minimal floating drag guide */}
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-3 py-1 rounded-full border backdrop-blur-md ${
                  isLight ? 'bg-white/80 text-zinc-700 border-zinc-300' : 'bg-black/60 text-zinc-400 border-white/10'
                }`}>
                  DRAG ROTUNDA TO ROTATE • PEDESTAL 0{activeIndex + 1}
                </span>
              </div>

              {/* Prev / Next Floating Navigation Controls */}
              <div className="absolute inset-y-0 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevArtifact();
                  }}
                  className="pointer-events-auto p-3.5 rounded-full bg-black/75 hover:bg-black/95 border border-white/20 text-white backdrop-blur-md transition-all cursor-pointer shadow-2xl active:scale-95"
                  title="Previous Artifact"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextArtifact();
                  }}
                  className="pointer-events-auto p-3.5 rounded-full bg-black/75 hover:bg-black/95 border border-white/20 text-white backdrop-blur-md transition-all cursor-pointer shadow-2xl active:scale-95"
                  title="Next Artifact"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Artifact Selector Strip (Framed above floor, never occluding plinth) */}
              <div className="absolute bottom-3 inset-x-4 z-10 flex items-center justify-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {MUSEUM_ITEMS.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectPedestal(idx);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-[10px] font-mono whitespace-nowrap transition-all cursor-pointer border ${
                      activeIndex === idx
                        ? 'bg-white text-black font-semibold border-white shadow-lg'
                        : 'bg-black/80 text-zinc-300 border-white/15 hover:border-pink hover:text-white backdrop-blur-md'
                    }`}
                  >
                    0{idx + 1} • {item.shortName || item.name.slice(0, 20)}
                  </button>
                ))}
              </div>
            </div>

            {/* Curatorial Archival Plaque (Right Panel - Clean, spacious editorial layout) */}
            <div className={`museum-plaque w-[390px] lg:w-[440px] p-6 lg:p-7 flex flex-col justify-between border-l shrink-0 text-left ${
              isLight ? 'bg-zinc-50 border-zinc-200 text-zinc-900' : 'bg-[#0c0c10] border-white/10 text-silver'
            }`}>
              <div>
                {/* Top Meta Badges */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-0.5 rounded-full bg-pink/15 border border-pink/30 text-[10px] font-mono text-pink tracking-[0.2em] uppercase font-semibold">
                    {activeItem.tag}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    EST. {activeItem.year} • 0{activeIndex + 1} OF 0{MUSEUM_ITEMS.length}
                  </span>
                </div>

                {/* Specimen Title */}
                <h3 className={`text-lg lg:text-xl font-mono font-semibold uppercase tracking-[0.14em] mb-2 leading-snug ${
                  isLight ? 'text-zinc-900' : 'text-white'
                }`}>
                  {activeItem.name}
                </h3>

                {/* Commission Tier Pill */}
                <div className="mb-3.5">
                  <span className={`px-2.5 py-1 rounded border text-[10px] font-mono inline-block ${
                    isLight ? 'bg-zinc-200/70 border-zinc-300 text-zinc-800' : 'bg-white/5 border-white/10 text-zinc-300'
                  }`}>
                    {activeItem.commissionTier}
                  </span>
                </div>

                {/* Provenance Story Box with Left Accent */}
                <div className={`story-box p-4 rounded-xl border relative overflow-hidden mb-4 ${
                  isLight ? 'bg-white border-zinc-200 text-zinc-800' : 'bg-black/60 border-white/10 text-zinc-200'
                }`}>
                  <div className="absolute top-0 left-0 w-1 h-full bg-pink" />
                  <p className="text-xs font-mono italic leading-relaxed pl-1.5">
                    "{activeItem.story}"
                  </p>
                </div>

                {/* Materials & Provenance Specs */}
                <div className="space-y-3 mb-4 text-xs font-mono">
                  <div className={`craft-box p-3 rounded-lg border ${
                    isLight ? 'bg-white border-zinc-200 text-zinc-800' : 'bg-black/40 border-white/10'
                  }`}>
                    <span className="text-zinc-400 block uppercase text-[9px] tracking-[0.2em] mb-1 font-semibold">
                      CRAFT & MEDIUM
                    </span>
                    <span className={`text-xs font-medium ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                      {activeItem.materials}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-1">
                    <span className="text-zinc-400 uppercase text-[9px] tracking-[0.2em]">
                      ORIGINAL STATUS
                    </span>
                    <span className={`text-xs font-medium ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>
                      {activeItem.originalOwner}
                    </span>
                  </div>

                  <div className="px-1">
                    <span className="text-zinc-400 block uppercase text-[9px] tracking-[0.2em] mb-1">
                      CUSTOM ORDER NOTE
                    </span>
                    <p className={`text-[11px] leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                      {activeItem.recreationNote}
                    </p>
                  </div>
                </div>
              </div>

              {/* Commission Archival Recreation Button */}
              <div className={`pt-3 border-t shrink-0 ${isLight ? 'border-zinc-200' : 'border-white/10'}`}>
                <button
                  onClick={() => handleCommissionClick(activeItem)}
                  className="btn-commission w-full py-3.5 px-5 rounded-full bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs tracking-[0.2em] uppercase transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Scissors className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
                  <span>REQUEST CUSTOM ORDER ↗</span>
                </button>
                <p className="text-[10px] font-mono text-zinc-400 text-center mt-2 uppercase tracking-wider">
                  Handmade in our Guwahati studio • 2 to 3 weeks
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Archive Index Grid View */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {MUSEUM_ITEMS.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => {
                  selectPedestal(idx);
                  setViewMode('3d');
                }}
                className={`group p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isLight
                    ? 'border-zinc-200 bg-white hover:border-pink/40 shadow-sm'
                    : 'border-white/10 bg-[#0d0d12] hover:border-pink/40'
                }`}
              >
                <div>
                  <div className="aspect-[4/5] rounded-xl overflow-hidden border border-white/10 bg-black mb-3 relative flex items-center justify-center p-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 border border-white/20 text-[9px] font-mono text-pink uppercase">
                      {item.tag}
                    </span>
                  </div>
                  <h4 className={`font-mono text-sm uppercase font-medium mb-1 line-clamp-1 ${
                    isLight ? 'text-zinc-900' : 'text-white'
                  }`}>
                    {item.name}
                  </h4>
                  <p className="text-[11px] font-mono text-zinc-400 line-clamp-2">
                    {item.materials}
                  </p>
                </div>
                <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between text-[10px] font-mono text-zinc-400 group-hover:text-pink transition-colors">
                  <span>PIECE 0{idx + 1}</span>
                  <span>VIEW IN 3D ↗</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
