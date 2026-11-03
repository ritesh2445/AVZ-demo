'use client';

import React, { useState, useEffect } from 'react';
import {
  Palette,
  Plus,
  Edit3,
  Trash2,
  Eye,
  ExternalLink,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Check,
  X,
  RefreshCw,
  Compass
} from 'lucide-react';
import QuickFrameEditorModal from '../museum/QuickFrameEditorModal';

const FRAME_STYLES = [
  { id: 'ornate_baroque', name: 'Ornate Baroque (Sculpted Triple Gold)' },
  { id: 'gilded_rococo', name: 'Gilded Rococo (24k Lustrous Leaf)' },
  { id: 'florentine_gold', name: 'Florentine Gold (Renaissance Egg-and-Dart)' },
  { id: 'antique_fillet', name: 'Antique Fillet (Ebonized Wood & 24k Gold)' },
  { id: 'classical_cavetto', name: 'Classical Cavetto (French Fluted Molding)' },
  { id: 'tarnished_brass', name: 'Tarnished Brass (Aged Verdigris Relief)' }
];

export default function MuseumGalleryAdminTab({ showNotification }: { showNotification?: (msg: string, type?: 'success' | 'error') => void }) {
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTarget, setEditingTarget] = useState<any>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // New artwork form state
  const [newArt, setNewArt] = useState({
    title: '',
    artist: 'Dhrisni & The AVZ Atelier',
    image_url: '/assets/editorial_hero_portrait.jpg',
    year: new Date().getFullYear().toString(),
    category: 'Archival Haute Couture',
    frame_style: 'ornate_baroque',
    aspect_ratio: '3:4',
    width_px: 360,
    display_order: 1,
    is_published: 1,
    description: '',
    medium: 'Salvaged microcircuits, steel spikes, upcycled textile',
    provenance: 'Guwahati Permanent Salon Collection',
    dimensions_cm: '75 × 100 cm',
    sconce_light: true,
    hanging_bracket: 'brass_chains'
  });

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/gallery');
      if (!res.ok) throw new Error('Failed to load gallery artworks');
      const data = await res.json();
      setArtworks(data.artworks || []);
    } catch (err: any) {
      showNotification?.(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newArt,
        metadata: {
          medium: newArt.medium,
          provenance: newArt.provenance,
          dimensions_cm: newArt.dimensions_cm,
          sconce_light: newArt.sconce_light,
          hanging_bracket: newArt.hanging_bracket
        }
      };

      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to mount painting');

      showNotification?.('New painting mounted to the gallery wall successfully!', 'success');
      setIsCreatingNew(false);
      setNewArt({
        title: '',
        artist: 'Dhrisni & The AVZ Atelier',
        image_url: '/assets/editorial_hero_portrait.jpg',
        year: new Date().getFullYear().toString(),
        category: 'Archival Haute Couture',
        frame_style: 'ornate_baroque',
        aspect_ratio: '3:4',
        width_px: 360,
        display_order: artworks.length + 1,
        is_published: 1,
        description: '',
        medium: 'Salvaged microcircuits, steel spikes, upcycled textile',
        provenance: 'Guwahati Permanent Salon Collection',
        dimensions_cm: '75 × 100 cm',
        sconce_light: true,
        hanging_bracket: 'brass_chains'
      });
      fetchArtworks();
    } catch (err: any) {
      showNotification?.(err.message, 'error');
    }
  };

  const handleTogglePublish = async (art: any) => {
    const updatedStatus = art.is_published ? 0 : 1;
    try {
      const res = await fetch(`/api/admin/gallery/${art.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: updatedStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');

      setArtworks((prev) =>
        prev.map((a) => (a.id === art.id ? { ...a, is_published: updatedStatus } : a))
      );
      showNotification?.(
        updatedStatus ? `"${art.title}" is now published on the gallery wall` : `"${art.title}" is now hidden`,
        'success'
      );
    } catch (err: any) {
      showNotification?.(err.message, 'error');
    }
  };

  const handleReorder = async (art: any, direction: 'up' | 'down') => {
    const currentIdx = artworks.findIndex((a) => a.id === art.id);
    if (currentIdx === -1) return;
    const targetIdx = direction === 'up' ? currentIdx - 1 : currentIdx + 1;
    if (targetIdx < 0 || targetIdx >= artworks.length) return;

    const targetArt = artworks[targetIdx];
    const newOrder1 = targetArt.display_order;
    const newOrder2 = art.display_order;

    try {
      await Promise.all([
        fetch(`/api/admin/gallery/${art.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_order: newOrder1 })
        }),
        fetch(`/api/admin/gallery/${targetArt.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_order: newOrder2 })
        })
      ]);

      fetchArtworks();
      showNotification?.('Gallery wall order updated', 'success');
    } catch (err: any) {
      showNotification?.(err.message, 'error');
    }
  };

  const handleDelete = async (art: any) => {
    if (!confirm(`Are you sure you want to dismount "${art.title}" from the gallery wall?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/gallery/${art.id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete');

      setArtworks((prev) => prev.filter((a) => a.id !== art.id));
      showNotification?.('Artwork dismounted and removed from gallery', 'success');
    } catch (err: any) {
      showNotification?.(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#14060b] border border-[#d4af37]/40 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#fae596]">
              AUTHENTIC EUROPEAN SALON WALL
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#fff3cc] uppercase tracking-wide">
            Vintage Art Gallery Wall Manager
          </h2>
          <p className="text-xs text-[#c5b099] mt-1 font-serif italic">
            Curate antique gilded frames, replace painting images, adjust dimensions, and reorder artwork on the continuous museum wall.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/#museum"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#2b0a12] hover:bg-[#3d0d1a] border border-[#d4af37]/40 text-[#fae596] text-xs font-mono flex items-center gap-2 shadow-sm transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Wall</span>
          </a>

          <button
            onClick={() => setIsCreatingNew(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#b3892c] via-[#fae596] to-[#b3892c] text-black font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Mount New Painting</span>
          </button>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#120408] border border-[#d4af37]/30 p-4 rounded-xl">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#fae596]/70 block">Total Artworks</span>
          <span className="text-2xl font-serif font-bold text-white">{artworks.length}</span>
        </div>
        <div className="bg-[#120408] border border-[#d4af37]/30 p-4 rounded-xl">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#fae596]/70 block">Active On Wall</span>
          <span className="text-2xl font-serif font-bold text-[#d4af37]">
            {artworks.filter((a) => a.is_published).length}
          </span>
        </div>
        <div className="bg-[#120408] border border-[#d4af37]/30 p-4 rounded-xl">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#fae596]/70 block">Salon Wall Style</span>
          <span className="text-sm font-serif font-bold text-white mt-1 block">Burgundy Plaster</span>
        </div>
        <div className="bg-[#120408] border border-[#d4af37]/30 p-4 rounded-xl">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#fae596]/70 block">Direct On-Frame Edit</span>
          <span className="text-sm font-mono font-bold text-green-400 mt-1 block">Enabled for Admins</span>
        </div>
      </div>

      {/* Artworks List / Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-16 bg-[#100407] border border-[#d4af37]/20 rounded-2xl">
            <RefreshCw className="w-6 h-6 text-[#d4af37] animate-spin mx-auto mb-2" />
            <span className="text-xs font-mono text-[#fae596]">Loading Gallery Wall Collections...</span>
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-16 bg-[#100407] border border-[#d4af37]/20 rounded-2xl text-neutral-400 font-serif text-sm">
            No paintings mounted yet. Click "Mount New Painting" to curate the museum salon wall.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {artworks.map((art, idx) => (
              <div
                key={art.id}
                className="bg-[#14060b] border border-[#d4af37]/35 rounded-2xl p-5 flex flex-col justify-between shadow-xl transition-all hover:border-[#d4af37]"
              >
                <div>
                  {/* Painting Preview Frame */}
                  <div className="h-48 rounded-xl overflow-hidden bg-black/90 relative mb-4 border border-[#d4af37]/30 flex items-center justify-center">
                    <img
                      src={art.image_url}
                      alt={art.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />

                    {/* Frame style badge */}
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded text-[9px] font-mono bg-black/85 text-[#fae596] border border-[#d4af37]/50 uppercase tracking-wider">
                      {art.frame_style?.replace('_', ' ') || 'Baroque'}
                    </span>

                    {/* Published status badge */}
                    <button
                      onClick={() => handleTogglePublish(art)}
                      className={`absolute top-2 right-2 px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider cursor-pointer border transition-all ${
                        art.is_published
                          ? 'bg-green-950/80 text-green-300 border-green-500'
                          : 'bg-neutral-900 text-neutral-400 border-neutral-700'
                      }`}
                    >
                      {art.is_published ? 'Published' : 'Hidden'}
                    </button>

                    {/* Aspect ratio */}
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono bg-black/80 text-zinc-300 border border-white/10 uppercase">
                      {art.aspect_ratio || '3:4'}
                    </span>
                  </div>

                  {/* Artwork Metadata */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#d4af37]">
                      <span>ORDER #{art.display_order || idx + 1}</span>
                      <span>ANNO {art.year || '2024'}</span>
                    </div>

                    <h3 className="font-serif font-bold text-white text-base leading-snug line-clamp-1">
                      {art.title}
                    </h3>

                    <p className="text-xs font-serif italic text-[#c5b099] line-clamp-1">
                      {art.artist}
                    </p>

                    <p className="text-xs font-serif text-neutral-400 line-clamp-2 mt-2 leading-relaxed">
                      {art.description || 'No curatorial narrative entered.'}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-4 border-t border-[#d4af37]/20 flex items-center justify-between">
                  {/* Reorder Arrows */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleReorder(art, 'up')}
                      disabled={idx === 0}
                      title="Move Left on Wall"
                      className="w-7 h-7 rounded bg-[#240810] border border-[#d4af37]/40 text-[#fae596] hover:bg-[#d4af37] hover:text-black flex items-center justify-center disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleReorder(art, 'down')}
                      disabled={idx === artworks.length - 1}
                      title="Move Right on Wall"
                      className="w-7 h-7 rounded bg-[#240810] border border-[#d4af37]/40 text-[#fae596] hover:bg-[#d4af37] hover:text-black flex items-center justify-center disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingTarget(art)}
                      className="px-3 py-1.5 rounded-lg bg-[#240810] hover:bg-[#380c18] border border-[#d4af37]/50 text-[#fae596] text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Frame</span>
                    </button>

                    <button
                      onClick={() => handleDelete(art)}
                      title="Dismount Painting"
                      className="w-7 h-7 rounded bg-red-950/60 border border-red-800 text-red-300 hover:bg-red-900 flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create New Artwork Modal */}
      {isCreatingNew && (
        <div
          onClick={() => setIsCreatingNew(false)}
          className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-[#1a050b] border-2 border-[#d4af37] p-6 sm:p-8 rounded-none text-left my-8 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#d4af37]/40 pb-4 mb-6">
              <h3 className="text-lg font-serif font-bold text-[#fff2cc] uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#d4af37]" />
                Mount New Painting to Gallery Wall
              </h3>
              <button
                onClick={() => setIsCreatingNew(false)}
                className="w-8 h-8 rounded-full bg-black/60 border border-[#d4af37]/60 text-[#fae596] hover:bg-[#d4af37] hover:text-black flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#fae596] uppercase tracking-wider mb-1">
                    Artwork Title *
                  </label>
                  <input
                    type="text"
                    value={newArt.title}
                    onChange={(e) => setNewArt({ ...newArt, title: e.target.value })}
                    required
                    placeholder="e.g. Portrait of the Cyber Empress"
                    className="w-full px-3 py-2 bg-black/70 border border-[#d4af37]/50 text-white font-serif text-sm focus:outline-none focus:border-[#fae596]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#fae596] uppercase tracking-wider mb-1">
                    Artist Name *
                  </label>
                  <input
                    type="text"
                    value={newArt.artist}
                    onChange={(e) => setNewArt({ ...newArt, artist: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-black/70 border border-[#d4af37]/50 text-white font-serif text-sm focus:outline-none focus:border-[#fae596]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#fae596] uppercase tracking-wider mb-1">
                  Painting Image URL *
                </label>
                <input
                  type="text"
                  value={newArt.image_url}
                  onChange={(e) => setNewArt({ ...newArt, image_url: e.target.value })}
                  required
                  placeholder="/assets/editorial_hero_portrait.jpg or https://..."
                  className="w-full px-3 py-2 bg-black/70 border border-[#d4af37]/50 text-white font-mono text-xs focus:outline-none focus:border-[#fae596]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#fae596] uppercase tracking-wider mb-1">
                    Antique Gold Frame Style
                  </label>
                  <select
                    value={newArt.frame_style}
                    onChange={(e) => setNewArt({ ...newArt, frame_style: e.target.value })}
                    className="w-full px-3 py-2 bg-black/80 border border-[#d4af37]/50 text-[#fae596] font-mono text-xs focus:outline-none"
                  >
                    {FRAME_STYLES.map((f) => (
                      <option key={f.id} value={f.id} className="bg-[#1a050b] text-white">
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#fae596] uppercase tracking-wider mb-1">
                    Aspect Ratio
                  </label>
                  <select
                    value={newArt.aspect_ratio}
                    onChange={(e) => setNewArt({ ...newArt, aspect_ratio: e.target.value })}
                    className="w-full px-3 py-2 bg-black/80 border border-[#d4af37]/50 text-[#fae596] font-mono text-xs focus:outline-none"
                  >
                    <option value="3:4" className="bg-[#1a050b] text-white">3:4 Classic Portrait</option>
                    <option value="4:5" className="bg-[#1a050b] text-white">4:5 Salon Vertical</option>
                    <option value="1:1" className="bg-[#1a050b] text-white">1:1 Archival Square</option>
                    <option value="4:3" className="bg-[#1a050b] text-white">4:3 Salon Landscape</option>
                    <option value="16:9" className="bg-[#1a050b] text-white">16:9 Monumental Wide</option>
                    <option value="2:3" className="bg-[#1a050b] text-white">2:3 Tall Masterpiece</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#fae596] uppercase tracking-wider mb-1">
                    Creation Year
                  </label>
                  <input
                    type="text"
                    value={newArt.year}
                    onChange={(e) => setNewArt({ ...newArt, year: e.target.value })}
                    className="w-full px-3 py-1.5 bg-black/70 border border-[#d4af37]/50 text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#fae596] uppercase tracking-wider mb-1">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={newArt.width_px}
                    onChange={(e) => setNewArt({ ...newArt, width_px: Number(e.target.value) })}
                    min={260}
                    max={540}
                    className="w-full px-3 py-1.5 bg-black/70 border border-[#d4af37]/50 text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#fae596] uppercase tracking-wider mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={newArt.display_order}
                    onChange={(e) => setNewArt({ ...newArt, display_order: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-black/70 border border-[#d4af37]/50 text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#fae596] uppercase tracking-wider mb-1">
                  Curatorial Narrative & Story
                </label>
                <textarea
                  value={newArt.description}
                  onChange={(e) => setNewArt({ ...newArt, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-black/70 border border-[#d4af37]/50 text-white font-serif text-xs leading-relaxed focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#fae596] uppercase tracking-wider mb-1">
                    Medium & Materials
                  </label>
                  <input
                    type="text"
                    value={newArt.medium}
                    onChange={(e) => setNewArt({ ...newArt, medium: e.target.value })}
                    className="w-full px-3 py-1.5 bg-black/70 border border-[#d4af37]/50 text-white font-serif text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#fae596] uppercase tracking-wider mb-1">
                    Provenance / Custody
                  </label>
                  <input
                    type="text"
                    value={newArt.provenance}
                    onChange={(e) => setNewArt({ ...newArt, provenance: e.target.value })}
                    className="w-full px-3 py-1.5 bg-black/70 border border-[#d4af37]/50 text-white font-serif text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#d4af37]/30">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="px-4 py-2 border border-white/20 text-zinc-300 text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-[#b3892c] via-[#fae596] to-[#b3892c] text-black font-serif font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 cursor-pointer"
                >
                  Mount to Wall
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal Target */}
      {editingTarget && (
        <QuickFrameEditorModal
          artwork={editingTarget}
          onClose={() => setEditingTarget(null)}
          onSaveSuccess={() => {
            fetchArtworks();
            showNotification?.('Painting updated on gallery wall', 'success');
          }}
          onDeleteSuccess={() => {
            fetchArtworks();
            showNotification?.('Painting dismounted from gallery wall', 'success');
          }}
        />
      )}
    </div>
  );
}
