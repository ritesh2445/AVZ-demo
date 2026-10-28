import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, RotateCcw, ArrowUpRight, Scissors } from 'lucide-react';
import { MUSEUM_ITEMS } from '../data/brandData';
import { playSound } from '../utils/audio';

// Helper to generate a 2D rounded-rectangle shape for solid beveled gallery frames
function createRoundedRectShape(width, height, radius) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

export default function AvzMuseum({ onRequestCustomCommission }) {
  const mountRef = useRef(null);
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState('3d'); // '3d' or 'grid'

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

  // Main 3D Canvas Lifecycle: Initialized ONCE per 3D view mode
  useEffect(() => {
    if (viewMode !== '3d') return;

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 550;
    const isMobile = width < 768;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060608);
    scene.fog = new THREE.FogExp2(0x060608, 0.032);

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    camera.position.set(0, 2.1, 11);
    camera.lookAt(0, 1.8, 6.8);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("Museum WebGL not available", e);
      return;
    }

    // 2. Curatorial Gallery Lighting
    const ambientLight = new THREE.AmbientLight(0x1a1a24, 1.0);
    scene.add(ambientLight);

    // Focused Warm Spotlight on Front Active Pedestal
    const spotlight = new THREE.SpotLight(0xF5EBE6, 24, 30, Math.PI / 4, 0.35, 1.2);
    spotlight.position.set(0, 8, 9);
    spotlight.target.position.set(0, 1.8, 6.8);
    scene.add(spotlight);
    scene.add(spotlight.target);

    // Subtle Architectural Rim Lights
    const rimLeft = new THREE.PointLight(0xa06cd5, 5, 20);
    rimLeft.position.set(-7, 3, 4);
    scene.add(rimLeft);

    const rimRight = new THREE.PointLight(0xd4afb9, 5, 20);
    rimRight.position.set(7, 3, 4);
    scene.add(rimRight);

    // 3. Reflective Obsidian Floor Grid
    const floorGeom = new THREE.PlaneGeometry(60, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x08080a,
      roughness: 0.3,
      metalness: 0.8
    });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.6;
    scene.add(floor);

    const gridHelper = new THREE.GridHelper(50, 40, 0x33333f, 0x14141a);
    gridHelper.position.y = -1.59;
    scene.add(gridHelper);

    // 4. Stardust floating dust particles
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
      color: 0xDCDCDC,
      size: 0.04,
      transparent: true,
      opacity: 0.35
    });
    const dust = new THREE.Points(dustGeom, dustMat);
    scene.add(dust);

    // 5. Continuous 360-Degree Circular Rotunda Carousel (Infinite)
    const carouselGroup = new THREE.Group();
    carouselGroupRef.current = carouselGroup;
    scene.add(carouselGroup);

    const pedestals = [];
    const textureLoader = new THREE.TextureLoader();
    const radius = 6.8;
    const total = MUSEUM_ITEMS.length;

    // Reusable Materials for Solid, Premium Frames
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x111116,
      roughness: 0.4,
      metalness: 0.8
    });
    const frameChassisMat = new THREE.MeshStandardMaterial({
      color: 0x18181f, // Solid dark titanium
      metalness: 0.9,
      roughness: 0.22
    });
    const frameTrimMat = new THREE.MeshStandardMaterial({
      color: 0xC5A880, // Subtle luxury pale bronze/gold rim
      metalness: 0.95,
      roughness: 0.15
    });

    // Precision Rounded Frame Geometry (Solid with slightly rounded corners)
    const frameShape = createRoundedRectShape(2.15, 2.75, 0.1);
    const frameGeom = new THREE.ExtrudeGeometry(frameShape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.02,
      bevelThickness: 0.02
    });

    // Picture Plane Geometry (Sitting inside the frame)
    const picShape = createRoundedRectShape(2.05, 2.65, 0.08);
    const picGeom = new THREE.ShapeGeometry(picShape);
    // Assign UVs to ShapeGeometry
    const pos = picGeom.attributes.position;
    const uvs = [];
    for (let i = 0; i < pos.count; i++) {
      const u = (pos.getX(i) + 1.025) / 2.05;
      const v = (pos.getY(i) + 1.325) / 2.65;
      uvs.push(u, v);
    }
    picGeom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

    MUSEUM_ITEMS.forEach((item, idx) => {
      const angle = (idx / total) * Math.PI * 2;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;

      const group = new THREE.Group();
      group.position.set(x, -0.6, z);
      group.rotation.y = angle;

      // Solid Circular Plinth Base
      const plinthGeom = new THREE.CylinderGeometry(1.2, 1.35, 1.8, 28);
      const plinth = new THREE.Mesh(plinthGeom, plinthMat);
      group.add(plinth);

      // Subtle Metallic Frame Collar Ring
      const ringGeom = new THREE.TorusGeometry(1.22, 0.035, 12, 32);
      const ring = new THREE.Mesh(ringGeom, frameTrimMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.9;
      group.add(ring);

      // Artifact Sub-Group (Frame + Picture Canvas)
      const artifactGroup = new THREE.Group();
      artifactGroup.position.y = 2.3;

      // 1. Solid Frame Chassis with Rounded Corners
      const frameMesh = new THREE.Mesh(frameGeom, frameChassisMat);
      frameMesh.position.z = -0.04;
      artifactGroup.add(frameMesh);

      // 2. Picture Display Surface with High-Def Texture
      const picMat = new THREE.MeshBasicMaterial({
        color: 0x111116
      });
      const picMesh = new THREE.Mesh(picGeom, picMat);
      picMesh.position.z = 0.045; // Sits snugly on front of solid frame
      artifactGroup.add(picMesh);

      // Load texture smoothly
      textureLoader.load(item.image, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 16;
        picMesh.material = new THREE.MeshBasicMaterial({ map: tex });
      });

      group.add(artifactGroup);
      carouselGroup.add(group);
      pedestals.push({ group, artifactGroup, angle });
    });

    pedestalsRef.current = pedestals;

    // Set initial rotunda angle
    currentRotundaAngleRef.current = -(activeIndexRef.current / total) * Math.PI * 2;
    targetRotundaAngleRef.current = currentRotundaAngleRef.current;
    carouselGroup.rotation.y = currentRotundaAngleRef.current;

    // Pointer Interaction (Orbit active piece & drag-to-swipe)
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
      // If user dragged horizontally > 60px, switch pedestal
      if (Math.abs(totalDelta) > 60) {
        if (totalDelta < 0) {
          selectPedestal((activeIndexRef.current + 1) % total);
        } else {
          selectPedestal((activeIndexRef.current - 1 + total) % total);
        }
      }
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);

    // Render loop with IntersectionObserver
    let animId = null;
    let isVisible = true;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!isVisible) return;
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth shortest-path angular rotation of carousel
      let diff = targetRotundaAngleRef.current - currentRotundaAngleRef.current;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      currentRotundaAngleRef.current += diff * 0.07;
      carouselGroup.rotation.y = currentRotundaAngleRef.current;

      // Spring back orbit rotation when pointer is released
      if (!isDraggingRef.current) {
        orbitAngleRef.current += (0 - orbitAngleRef.current) * 0.08;
      }

      // REDUCED, CALM MOVEMENT (Solid, poised gallery feel instead of bobbing)
      const currentIdx = activeIndexRef.current;
      const activePed = pedestals[currentIdx];
      if (activePed && activePed.artifactGroup) {
        // Minimal subtle breathing: 0.008 rad (less than half a degree)
        activePed.artifactGroup.rotation.y = orbitAngleRef.current + Math.sin(elapsed * 0.3) * 0.008;
      }

      // Background pedestals remain rock-steady
      pedestals.forEach((p, i) => {
        if (i !== currentIdx && p.artifactGroup) {
          p.artifactGroup.rotation.y = Math.sin(elapsed * 0.2 + i) * 0.005;
        }
        if (p.artifactGroup) {
          // Extremely subtle vertical presence
          p.artifactGroup.position.y = 2.3 + Math.sin(elapsed * 0.35 + i) * 0.006;
        }
      });

      dust.rotation.y = elapsed * 0.01;
      renderer.render(scene, camera);
    };

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
      const h = container.clientHeight || 550;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      if (sectionRef.current) observer.unobserve(sectionRef.current);
      cancelAnimationFrame(animId);

      scene.clear();
      if (renderer) {
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
    };
  }, [viewMode]);

  // Infinite Pedestal Selection: Calculates continuous carousel angle
  const selectPedestal = (idx) => {
    playSound('museum_rotate');
    const total = MUSEUM_ITEMS.length;
    const safeIdx = (idx + total) % total;
    setActiveIndex(safeIdx);
    activeIndexRef.current = safeIdx;
    orbitAngleRef.current = 0;
    targetRotundaAngleRef.current = -(safeIdx / total) * Math.PI * 2;
  };

  const nextArtifact = () => {
    selectPedestal(activeIndex + 1);
  };

  const prevArtifact = () => {
    selectPedestal(activeIndex - 1);
  };

  // Mobile Touch Swipe Handlers
  const touchStartXRef = useRef(null);
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        nextArtifact();
      } else {
        prevArtifact();
      }
    }
    touchStartXRef.current = null;
  };

  return (
    <section
      id="museum"
      ref={sectionRef}
      className="w-full py-20 sm:py-28 px-4 sm:px-8 lg:px-16 bg-[#060608] select-none border-t border-white/8 text-left"
    >
      {/* Museum Header */}
      <div className="mb-12 pb-6 border-b border-white/8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 mb-3 text-zinc-400 text-[10px] font-mono tracking-[0.25em] uppercase">
            <span>PERMANENT ARCHIVE // ONE-OF-ONE SPECIMENS</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-light font-mono uppercase tracking-[0.2em] text-white leading-tight">
            ARCHIVE <span className="text-zinc-500 font-normal">MUSEUM</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-3 font-mono tracking-wider max-w-xl leading-relaxed">
            Historic gallery of commissioned wearable art and sold-out atelier artifacts. Inspect in interactive 3D space or request a private bespoke recreation.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-[#101014] p-1.5 rounded-full border border-white/10">
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
            3D Gallery
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
            Index
          </button>
        </div>
      </div>

      {viewMode === '3d' ? (
        /* 3D EXHIBITION STAGE */
        <div className="relative w-full rounded-2xl overflow-hidden border border-white/12 bg-[#09090c] shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col lg:flex-row">
          {/* Three.js 3D Canvas (Left / Main) */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative flex-1 h-[440px] sm:h-[520px] lg:h-[620px] w-full cursor-grab active:cursor-grabbing overflow-hidden"
          >
            <div ref={mountRef} className="w-full h-full" />

            {/* Hint & Drag Badge */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none flex items-center gap-2 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/12 text-[10px] font-mono text-zinc-400 tracking-wider uppercase">
              <RotateCcw className="w-3 h-3 text-zinc-400" />
              <span>DRAG TO ROTATE // SWIPE TO CYCLE</span>
            </div>

            {/* Continuous Carousel Pedestal Navigation Arrows */}
            <div className="absolute inset-y-0 left-3 right-3 z-10 pointer-events-none flex items-center justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevArtifact();
                }}
                className="pointer-events-auto p-2.5 rounded-full bg-black/80 hover:bg-white/15 border border-white/15 hover:border-white/40 text-white backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-95"
                title="Previous Artifact"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextArtifact();
                }}
                className="pointer-events-auto p-2.5 rounded-full bg-black/80 hover:bg-white/15 border border-white/15 hover:border-white/40 text-white backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-95"
                title="Next Artifact"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Artifact Switcher Strip */}
            <div className="absolute bottom-4 inset-x-4 z-10 flex items-center justify-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {MUSEUM_ITEMS.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectPedestal(idx);
                  }}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-mono whitespace-nowrap transition-all cursor-pointer border ${
                    activeIndex === idx
                      ? 'bg-white text-black font-semibold border-white shadow-md'
                      : 'bg-black/80 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white backdrop-blur-md'
                  }`}
                >
                  [{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}] {item.name.slice(0, 18)}...
                </button>
              ))}
            </div>
          </div>

          {/* Curatorial Archival Plaque (Right Panel - Solid, Refined) */}
          <div className="w-full lg:w-[420px] bg-[#0d0d11] p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10">
            <div>
              {/* Top Meta Badges */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/12 text-[10px] font-mono text-zinc-300 tracking-[0.2em] uppercase">
                  {activeItem.tag}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  EST. {activeItem.year} // 0{activeIndex + 1} OF 0{MUSEUM_ITEMS.length}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-mono font-medium uppercase text-white tracking-[0.15em] mb-4 leading-snug">
                {activeItem.name}
              </h3>

              {/* Provenance Story */}
              <div className="p-4 rounded-xl bg-black/60 border border-white/8 mb-6">
                <p className="text-xs text-zinc-300 font-mono leading-relaxed">
                  "{activeItem.story}"
                </p>
              </div>

              {/* Materials & Provenance Specs */}
              <div className="space-y-4 mb-6 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 block uppercase text-[10px] tracking-[0.2em] mb-1.5">
                    CRAFT & MEDIUM
                  </span>
                  <span className="text-white bg-white/5 px-2.5 py-1 rounded border border-white/10 inline-block text-[11px]">
                    {activeItem.materials}
                  </span>
                </div>

                <div>
                  <span className="text-zinc-500 block uppercase text-[10px] tracking-[0.2em] mb-1.5">
                    PROVENANCE
                  </span>
                  <span className="text-zinc-300 text-[11px]">{activeItem.originalOwner}</span>
                </div>

                <div>
                  <span className="text-zinc-500 block uppercase text-[10px] tracking-[0.2em] mb-1.5">
                    ARCHIVAL RECREATION
                  </span>
                  <span className="text-zinc-400 text-[11px] leading-relaxed block">
                    {activeItem.recreationNote}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Bespoke Recreation Action */}
            <div className="pt-5 border-t border-white/10">
              <button
                onClick={() => {
                  playSound('click');
                  onRequestCustomCommission?.(`Recreate Archival Specimen: ${activeItem.name}`);
                  const el = document.getElementById('custom');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-zinc-200 text-black font-mono font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-200 shadow-lg cursor-pointer flex items-center justify-center gap-2 group"
              >
                <Scissors className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
                <span>COMMISSION ARCHIVAL RECREATION ↗</span>
              </button>
              <p className="text-[10px] font-mono text-zinc-500 text-center mt-2.5 uppercase tracking-wider">
                Hand-sculpted in Guwahati Atelier • 2 to 3 weeks
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ARCHIVE INDEX GRID VIEW — SOLID FRAMES WITH SLIGHTLY ROUNDED CORNERS */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MUSEUM_ITEMS.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => {
                selectPedestal(idx);
                setViewMode('3d');
              }}
              className="group bg-[#0d0d12] border border-white/12 hover:border-white/30 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/60 p-3 pb-0">
                <div className="w-full h-full rounded-xl overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-105"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[9px] font-mono tracking-widest text-zinc-300 uppercase">
                    {item.tag}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="text-[10px] font-mono text-zinc-500 tracking-[0.2em] uppercase mb-1">
                  SPECIMEN #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </div>
                <h4 className="text-base font-mono font-medium tracking-[0.15em] uppercase text-white mb-2">
                  {item.name}
                </h4>
                <p className="text-xs text-zinc-400 font-mono line-clamp-2 mb-4 leading-relaxed">
                  "{item.story}"
                </p>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-300 tracking-[0.15em] uppercase group-hover:text-white transition-colors">
                  <span>INSPECT IN 3D</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
