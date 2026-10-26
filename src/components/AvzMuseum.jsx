import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Shield, Sparkles, ChevronLeft, ChevronRight, RotateCcw, Eye, ArrowUpRight, Scissors, Layers } from 'lucide-react';
import { MUSEUM_ITEMS } from '../data/brandData';
import { playSound } from '../utils/audio';

export default function AvzMuseum({ onRequestCustomCommission }) {
  const mountRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState('3d'); // '3d' or 'grid'

  const activeItem = MUSEUM_ITEMS[activeIndex] || MUSEUM_ITEMS[0];

  // Three.js references
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const pedestalsRef = useRef([]);
  const spotlightRef = useRef(null);
  const targetCameraX = useRef(0);
  const targetCameraZ = useRef(9);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const orbitAngleRef = useRef(0);

  useEffect(() => {
    if (viewMode !== '3d') return;

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 550;
    const isMobile = width < 768;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x06010a);
    scene.fog = new THREE.FogExp2(0x06010a, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;
    camera.position.set(0, 2.5, 9);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        powerPreference: 'high-performance'
      });
      rendererRef.current = renderer;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("Museum WebGL not available", e);
      return;
    }

    // 2. Museum Atmospheric Lights
    const ambientLight = new THREE.AmbientLight(0x280e34, 0.9);
    scene.add(ambientLight);

    // Dynamic Focused Spotlight on Active Pedestal
    const spotlight = new THREE.SpotLight(0xF4C2C2, 24, 25, Math.PI / 4, 0.35, 1.2);
    spotlight.position.set(0, 7, 5);
    spotlightRef.current = spotlight;
    scene.add(spotlight);
    scene.add(spotlight.target);

    // Rim gallery lights
    const rimViolet = new THREE.PointLight(0x9d4edd, 8, 20);
    rimViolet.position.set(-6, 3, 2);
    scene.add(rimViolet);

    const rimPink = new THREE.PointLight(0xf472b6, 8, 20);
    rimPink.position.set(6, 3, 2);
    scene.add(rimPink);

    // 3. Reflective Obsidian Floor Grid
    const floorGeom = new THREE.PlaneGeometry(60, 60, 30, 30);
    const floorMat = new THREE.MeshPhysicalMaterial({
      color: 0x07010d,
      roughness: 0.18,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.6;
    scene.add(floor);

    // Grid wireframe on floor
    const gridHelper = new THREE.GridHelper(50, 50, 0xbe185d, 0x1f0627);
    gridHelper.position.y = -1.59;
    scene.add(gridHelper);

    // 4. Stardust floating dust particles
    const dustCount = 80;
    const dustGeom = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 24;
      dustPos[i + 1] = Math.random() * 8 - 1;
      dustPos[i + 2] = (Math.random() - 0.5) * 20;
    }
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xE6E6FA,
      size: 0.06,
      transparent: true,
      opacity: 0.5
    });
    const dust = new THREE.Points(dustGeom, dustMat);
    scene.add(dust);

    // 5. Construct 3D Pedestals for each Museum Item in an Arc
    const pedestals = [];
    const textureLoader = new THREE.TextureLoader();
    const radius = 6.5;
    const total = MUSEUM_ITEMS.length;

    MUSEUM_ITEMS.forEach((item, idx) => {
      const angle = ((idx - total / 2 + 0.5) / total) * (Math.PI * 0.7);
      const x = Math.sin(angle) * radius;
      const z = -Math.cos(angle) * radius + 2.5;

      const group = new THREE.Group();
      group.position.set(x, -0.6, z);
      group.rotation.y = -angle;

      // Pedestal Plinth Base
      const plinthGeom = new THREE.CylinderGeometry(1.2, 1.4, 1.8, 16);
      const plinthMat = new THREE.MeshPhysicalMaterial({
        color: 0x14051a,
        emissive: 0x09010e,
        metalness: 0.9,
        roughness: 0.25,
        clearcoat: 0.8
      });
      const plinth = new THREE.Mesh(plinthGeom, plinthMat);
      plinth.position.y = 0;
      group.add(plinth);

      // Chrome Ring on Top of Plinth
      const ringGeom = new THREE.TorusGeometry(1.25, 0.05, 12, 32);
      const chromeMat = new THREE.MeshPhysicalMaterial({
        color: 0xC0C0C0,
        metalness: 0.95,
        roughness: 0.1,
        clearcoat: 1.0
      });
      const ring = new THREE.Mesh(ringGeom, chromeMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.9;
      group.add(ring);

      // Under-Plinth Neon Glow Ring
      const neonGeom = new THREE.TorusGeometry(1.42, 0.04, 12, 32);
      const neonMat = new THREE.MeshBasicMaterial({ color: 0xF4C2C2 });
      const neon = new THREE.Mesh(neonGeom, neonMat);
      neon.rotation.x = Math.PI / 2;
      neon.position.y = -0.85;
      group.add(neon);

      // Floating Couture Artifact Display Tablet
      const artifactGeom = new THREE.BoxGeometry(2.0, 2.6, 0.1);
      const defaultMat = new THREE.MeshPhysicalMaterial({
        color: 0x301934,
        metalness: 0.5,
        roughness: 0.3
      });

      const artifactMesh = new THREE.Mesh(artifactGeom, defaultMat);
      artifactMesh.position.y = 2.4;
      group.add(artifactMesh);

      // Load artifact texture
      textureLoader.load(item.image, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        const frontMat = new THREE.MeshPhysicalMaterial({
          map: tex,
          roughness: 0.2,
          metalness: 0.1,
          clearcoat: 0.8
        });
        const edgeMat = new THREE.MeshPhysicalMaterial({
          color: 0xC0C0C0,
          metalness: 0.95,
          roughness: 0.1
        });
        // Multi-material box
        artifactMesh.material = [edgeMat, edgeMat, edgeMat, edgeMat, frontMat, edgeMat];
      });

      // Holographic Glass Vitrine (Outer protective enclosure)
      const glassGeom = new THREE.BoxGeometry(2.3, 3.0, 0.6);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xE6E6FA,
        transparent: true,
        opacity: 0.2,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.85,
        ior: 1.45
      });
      const glassVitrine = new THREE.Mesh(glassGeom, glassMat);
      glassVitrine.position.y = 2.4;
      group.add(glassVitrine);

      scene.add(group);
      pedestals.push({ group, artifactMesh, x, z, angle });
    });

    pedestalsRef.current = pedestals;

    // Mouse / Touch Drag to Rotate Active Pedestal
    const handlePointerDown = (e) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      orbitAngleRef.current += deltaX * 0.008;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera interpolation towards selected pedestal
      camera.position.x += (targetCameraX.current - camera.position.x) * 0.06;
      camera.position.z += (targetCameraZ.current - camera.position.z) * 0.06;
      camera.position.y = 2.4 + Math.sin(elapsed * 0.6) * 0.08;

      // Look at active pedestal center
      const activePedestal = pedestals[activeIndex];
      if (activePedestal) {
        camera.lookAt(activePedestal.x, 1.8, activePedestal.z);

        // Move spotlight smoothly
        if (spotlight) {
          spotlight.position.x += (activePedestal.x - spotlight.position.x) * 0.08;
          spotlight.position.z += (activePedestal.z + 3 - spotlight.position.z) * 0.08;
          spotlight.target.position.set(activePedestal.x, 1.8, activePedestal.z);
          spotlight.target.updateMatrixWorld();
        }

        // Apply interactive drag rotation to active artifact
        activePedestal.artifactMesh.rotation.y = orbitAngleRef.current + Math.sin(elapsed * 0.8) * 0.08;
      }

      // Gentle floating animation for all pedestals
      pedestals.forEach((p, i) => {
        if (i !== activeIndex) {
          p.artifactMesh.rotation.y = Math.sin(elapsed * 0.5 + i) * 0.15;
        }
        p.artifactMesh.position.y = 2.4 + Math.sin(elapsed * 1.2 + i * 1.5) * 0.05;
      });

      // Dust gentle drifting
      dust.rotation.y = elapsed * 0.015;

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!renderer || !container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 550;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);

      scene.clear();
      if (renderer) {
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
    };
  }, [viewMode, activeIndex]);

  // Handle active index change
  const selectPedestal = (idx) => {
    playSound('museum_rotate');
    setActiveIndex(idx);
    orbitAngleRef.current = 0;

    const ped = pedestalsRef.current[idx];
    if (ped) {
      // Position camera right in front of this pedestal
      targetCameraX.current = ped.x * 0.65;
      targetCameraZ.current = ped.z + 5.5;
    }
  };

  const nextArtifact = () => {
    selectPedestal((activeIndex + 1) % MUSEUM_ITEMS.length);
  };

  const prevArtifact = () => {
    selectPedestal((activeIndex - 1 + MUSEUM_ITEMS.length) % MUSEUM_ITEMS.length);
  };

  return (
    <section id="museum" className="w-full py-24 px-4 sm:px-8 lg:px-16 bg-pitch-black select-none border-t border-white/5 text-left">
      {/* Museum Header */}
      <div className="mb-10 pb-6 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c041f]/90 border border-pink/40 backdrop-blur-md mb-3 text-pink text-[11px] font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(244,194,194,0.25)]">
            <Shield className="w-3.5 h-3.5 text-pink" />
            <span>3D ATELIER VAULT // PAST GRAILS & SOLD-OUT ARCHIVES</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black font-spartan uppercase tracking-tight text-white leading-none">
            AVZ <span className="chrome-text">3D MUSEUM</span>
          </h2>
          <p className="text-silver/80 text-sm mt-3 font-montserrat max-w-2xl">
            Inspect our historic 1-of-1 creations on interactive 3D pedestals. Drag to orbit, explore the craft, or commission a bespoke version tailored for you.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-full border border-white/15">
          <button
            onClick={() => {
              playSound('glitch_click');
              setViewMode('3d');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
              viewMode === '3d'
                ? 'bg-pink text-black font-bold shadow-[0_0_15px_rgba(244,194,194,0.4)]'
                : 'text-silver hover:text-white'
            }`}
          >
            3D Exhibition
          </button>
          <button
            onClick={() => {
              playSound('glitch_click');
              setViewMode('grid');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-pink text-black font-bold shadow-[0_0_15px_rgba(244,194,194,0.4)]'
                : 'text-silver hover:text-white'
            }`}
          >
            Archive Grid
          </button>
        </div>
      </div>

      {viewMode === '3d' ? (
        /* 3D EXHIBITION STAGE */
        <div className="relative w-full rounded-3xl overflow-hidden border border-pink/25 bg-[#06010a] shadow-[0_20px_70px_rgba(18,2,24,0.9)] flex flex-col lg:flex-row">
          {/* Three.js 3D Canvas (Left / Main) */}
          <div className="relative flex-1 h-[440px] sm:h-[520px] lg:h-[620px] w-full cursor-grab active:cursor-grabbing overflow-hidden">
            <div ref={mountRef} className="w-full h-full" />

            {/* Hint & Drag Badge */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono text-pink tracking-widest uppercase">
              <RotateCcw className="w-3 h-3 text-pink" />
              <span>DRAG TO ROTATE 3D ARTIFACT</span>
            </div>

            {/* Pedestal Navigation Arrows */}
            <div className="absolute inset-y-0 left-3 right-3 z-10 pointer-events-none flex items-center justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevArtifact();
                }}
                className="pointer-events-auto p-3 rounded-full bg-black/70 hover:bg-pink/25 border border-white/20 hover:border-pink text-white hover:text-pink backdrop-blur-md transition-all cursor-pointer shadow-lg"
                title="Previous Pedestal"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextArtifact();
                }}
                className="pointer-events-auto p-3 rounded-full bg-black/70 hover:bg-pink/25 border border-white/20 hover:border-pink text-white hover:text-pink backdrop-blur-md transition-all cursor-pointer shadow-lg"
                title="Next Pedestal"
              >
                <ChevronRight className="w-5 h-5" />
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
                      ? 'bg-pink text-black font-bold border-pink shadow-[0_0_15px_rgba(244,194,194,0.4)]'
                      : 'bg-black/70 text-silver/80 border-white/15 hover:border-pink/40 hover:text-white backdrop-blur-md'
                  }`}
                >
                  [{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}] {item.name.slice(0, 18)}...
                </button>
              ))}
            </div>
          </div>

          {/* Curatorial Archival Plaque (Right Panel) */}
          <div className="w-full lg:w-[420px] bg-gradient-to-b from-[#14041b] via-[#0d0212] to-black p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-pink/20">
            <div>
              {/* Top Meta Badges */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-pink/15 border border-pink/40 text-[10px] font-mono text-pink tracking-widest uppercase">
                  {activeItem.tag}
                </span>
                <span className="text-xs font-mono text-silver/60">
                  EST. {activeItem.year} // GRAIL #{activeIndex + 1}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-spartan font-black uppercase text-white tracking-tight mb-3 leading-tight">
                {activeItem.name}
              </h3>

              {/* Provenance Story with Baddie Energy */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 mb-4">
                <p className="text-xs sm:text-sm text-silver/90 font-montserrat leading-relaxed italic">
                  "{activeItem.story}"
                </p>
              </div>

              {/* Materials & Provenance Specs */}
              <div className="space-y-3 mb-6 text-xs font-mono">
                <div>
                  <span className="text-pink/70 block uppercase text-[10px] tracking-widest mb-1">CRAFT MATERIALS</span>
                  <span className="text-white bg-white/5 px-2.5 py-1 rounded-md border border-white/10 inline-block">
                    {activeItem.materials}
                  </span>
                </div>

                <div>
                  <span className="text-pink/70 block uppercase text-[10px] tracking-widest mb-1">PROVENANCE / PREVIOUS DROP</span>
                  <span className="text-silver/80">{activeItem.originalOwner}</span>
                </div>

                <div>
                  <span className="text-pink/70 block uppercase text-[10px] tracking-widest mb-1">RECREATION GUARANTEE</span>
                  <span className="text-silver/70 text-[11px] leading-relaxed block">
                    {activeItem.recreationNote}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Bespoke Recreation Action */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  playSound('baddie_alert');
                  onRequestCustomCommission?.(`Recreate Museum Grail: ${activeItem.name}`);
                  const el = document.getElementById('custom');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink via-pink-400 to-purple-400 hover:from-white hover:to-pink text-black font-spartan font-black text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_30px_rgba(244,194,194,0.35)] cursor-pointer flex items-center justify-center gap-2 group"
              >
                <Scissors className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                <span>RECREATE THIS BESPOKE GRAIL ↗</span>
              </button>
              <p className="text-[10px] font-mono text-silver/50 text-center mt-2 uppercase tracking-wider">
                Tailored to your measurements in 2 to 3 weeks
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ARCHIVE DOSSIER GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MUSEUM_ITEMS.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => {
                selectPedestal(idx);
                setViewMode('3d');
              }}
              className="group bg-[#0d020f]/80 border border-pink/20 hover:border-pink rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-[0_15px_40px_rgba(244,194,194,0.2)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-mono text-pink uppercase">
                  {item.tag}
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-spartan font-bold text-white mb-2">{item.name}</h4>
                <p className="text-xs text-silver/80 font-montserrat line-clamp-2 mb-4 italic">
                  "{item.story}"
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-pink uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                  <span>INSPECT ON 3D PEDESTAL</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
