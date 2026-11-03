'use client';

import React, { useState } from 'react';
import { X, Save, Trash2, Image, Layers, Sparkles, Check, RefreshCw } from 'lucide-react';
import { playSound } from '../../utils/audio';

const FRAME_OPTIONS = [
  { id: 'ornate_baroque', name: 'Ornate Baroque (Sculpted Triple Gold)' },
  { id: 'gilded_rococo', name: 'Gilded Rococo (24k Lustrous Leaf)' },
  { id: 'florentine_gold', name: 'Florentine Gold (Renaissance Egg-and-Dart)' },
  { id: 'antique_fillet', name: 'Antique Fillet (Ebonized Wood & 24k Gold)' },
  { id: 'classical_cavetto', name: 'Classical Cavetto (French Fluted Molding)' },
  { id: 'tarnished_brass', name: 'Tarnished Brass (Aged Verdigris Relief)' }
];

const ASPECT_RATIO_OPTIONS = [
  { id: '3:4', name: '3:4 Classic Portrait' },
  { id: '4:5', name: '4:5 Salon Vertical' },
  { id: '1:1', name: '1:1 Archival Square' },
  { id: '4:3', name: '4:3 Salon Landscape' },
  { id: '16:9', name: '16:9 Monumental Wide' },
  { id: '2:3', name: '2:3 Tall Masterpiece' }
];

export default function QuickFrameEditorModal({
  artwork,
  onClose,
  onSaveSuccess,
  onDeleteSuccess
}) {
  const [formData, setFormData] = useState({
    title: artwork.title || '',
    artist: artwork.artist || '',
    image_url: artwork.image_url || '',
    year: artwork.year || '2024',
    category: artwork.category || 'Archival Haute Couture',
    frame_style: artwork.frame_style || 'ornate_baroque',
    aspect_ratio: artwork.aspect_ratio || '3:4',
    width_px: artwork.width_px || 360,
    display_order: artwork.display_order || 0,
    is_published: Boolean(artwork.is_published),
    description: artwork.description || '',
    medium: artwork.metadata?.medium || '',
    provenance: artwork.metadata?.provenance || '',
    dimensions_cm: artwork.metadata?.dimensions_cm || '',
    object_position: artwork.metadata?.object_position || 'center 20%',
    sconce_light: Boolean(artwork.metadata?.sconce_light),
    hanging_bracket: artwork.metadata?.hanging_bracket || 'brass_chains'
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    playSound('pip');

    try {
      const payload = {
        title: formData.title,
        artist: formData.artist,
        image_url: formData.image_url,
        thumbnail_url: formData.image_url,
        year: formData.year,
        category: formData.category,
        frame_style: formData.frame_style,
        aspect_ratio: formData.aspect_ratio,
        width_px: Number(formData.width_px) || 360,
        height_px: Math.round((Number(formData.width_px) || 360) * 1.33),
        display_order: Number(formData.display_order) || 0,
        is_published: formData.is_published ? 1 : 0,
        description: formData.description,
        metadata: {
          medium: formData.medium,
          provenance: formData.provenance,
          dimensions_cm: formData.dimensions_cm,
          object_position: formData.object_position,
          sconce_light: formData.sconce_light,
          hanging_bracket: formData.hanging_bracket
        }
      };

      const res = await fetch(`/api/admin/gallery/${artwork.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update artwork');

      playSound('snap');
      onSaveSuccess?.({ ...artwork, ...payload });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to dismount "${artwork.title}" from the gallery wall?`)) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/gallery/${artwork.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');

      playSound('trash');
      onDeleteSuccess?.(artwork.id);
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-[#1f090e] border-2 border-[#d4af37] shadow-2xl p-6 sm:p-8 rounded-none text-left my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#d4af37]/40 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#fae596] to-[#b3892c] flex items-center justify-center text-black font-bold text-xs">
              ✦
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#fff2cc] uppercase tracking-wider">
                Curator Frame Editor
              </h3>
              <p className="text-[11px] font-mono text-[#d4af37]/80">
                Direct on-wall customization • Changes save immediately to live gallery
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/60 border border-[#d4af37]/60 text-[#fae596] hover:bg-[#d4af37] hover:text-black flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-mono">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Image URL & Live Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-mono text-[#fae596] uppercase tracking-wider">
                Painting Image URL (Cloudinary or CDN)
              </label>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://... or /assets/..."
                required
                className="w-full px-3 py-2 bg-black/70 border border-[#d4af37]/50 text-white font-mono text-xs focus:outline-none focus:border-[#fae596]"
              />
              <p className="text-[10px] font-mono text-zinc-400">
                Paste any high-resolution image URL or internal asset path.
              </p>
            </div>

            {/* Quick Preview Thumbnail */}
            <div className="flex flex-col items-center justify-center p-2 bg-black/60 border border-[#d4af37]/40 h-28">
              {formData.image_url ? (
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="max-h-24 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-[10px] font-mono text-zinc-500">No Image</span>
              )}
            </div>
          </div>

          {/* Frame Style & Aspect Ratio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#fae596] uppercase tracking-wider mb-1">
                Antique Gold Frame Style
              </label>
              <select
                name="frame_style"
                value={formData.frame_style}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-black/80 border border-[#d4af37]/50 text-[#fae596] font-mono text-xs focus:outline-none focus:border-[#fae596]"
              >
                {FRAME_OPTIONS.map((f) => (
                  <option key={f.id} value={f.id} className="bg-[#1a050b] text-white">
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#fae596] uppercase tracking-wider mb-1">
                Aspect Ratio / Dimensions
              </label>
              <select
                name="aspect_ratio"
                value={formData.aspect_ratio}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-black/80 border border-[#d4af37]/50 text-[#fae596] font-mono text-xs focus:outline-none focus:border-[#fae596]"
              >
                {ASPECT_RATIO_OPTIONS.map((a) => (
                  <option key={a.id} value={a.id} className="bg-[#1a050b] text-white">
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title & Artist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#fae596] uppercase tracking-wider mb-1">
                Artwork Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-black/70 border border-[#d4af37]/50 text-white font-serif text-sm focus:outline-none focus:border-[#fae596]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#fae596] uppercase tracking-wider mb-1">
                Artist Name & Atelier
              </label>
              <input
                type="text"
                name="artist"
                value={formData.artist}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-black/70 border border-[#d4af37]/50 text-white font-serif text-sm focus:outline-none focus:border-[#fae596]"
              />
            </div>
          </div>

          {/* Year, Category, Display Order, Width */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#fae596] uppercase tracking-wider mb-1">
                Creation Year
              </label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-black/70 border border-[#d4af37]/50 text-white font-mono text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#fae596] uppercase tracking-wider mb-1">
                Frame Width (px)
              </label>
              <input
                type="number"
                name="width_px"
                value={formData.width_px}
                onChange={handleChange}
                min={260}
                max={540}
                className="w-full px-3 py-1.5 bg-black/70 border border-[#d4af37]/50 text-white font-mono text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#fae596] uppercase tracking-wider mb-1">
                Display Order
              </label>
              <input
                type="number"
                name="display_order"
                value={formData.display_order}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-black/70 border border-[#d4af37]/50 text-white font-mono text-xs focus:outline-none"
              />
            </div>

            <div className="flex flex-col justify-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleChange}
                  className="accent-[#d4af37]"
                />
                <span className="text-xs font-mono text-white">Publish on Wall</span>
              </label>
            </div>
          </div>

          {/* Description / Story */}
          <div>
            <label className="block text-xs font-mono text-[#fae596] uppercase tracking-wider mb-1">
              Curatorial Narrative & Story
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-black/70 border border-[#d4af37]/50 text-white font-serif text-xs leading-relaxed focus:outline-none focus:border-[#fae596]"
            />
          </div>

          {/* Medium & Provenance (Metadata) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#fae596] uppercase tracking-wider mb-1">
                Medium & Materials
              </label>
              <input
                type="text"
                name="medium"
                value={formData.medium}
                onChange={handleChange}
                placeholder="e.g. Salvaged PCB, steel spikes, denim"
                className="w-full px-3 py-1.5 bg-black/70 border border-[#d4af37]/50 text-white font-serif text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#fae596] uppercase tracking-wider mb-1">
                Provenance / Collection
              </label>
              <input
                type="text"
                name="provenance"
                value={formData.provenance}
                onChange={handleChange}
                placeholder="e.g. Permanent Salon Collection"
                className="w-full px-3 py-1.5 bg-black/70 border border-[#d4af37]/50 text-white font-serif text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-[#d4af37]/40 pt-5">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2.5 bg-red-950/80 border border-red-500 text-red-300 hover:bg-red-900 text-xs font-mono tracking-wider uppercase flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Dismount Painting</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-white/20 text-zinc-300 hover:bg-white/10 text-xs font-mono tracking-wider uppercase cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-[#b3892c] via-[#fae596] to-[#b3892c] text-black font-mono font-bold text-xs tracking-widest uppercase flex items-center gap-2 cursor-pointer shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-black" />
                <span>{saving ? 'Saving...' : 'Save to Gallery Wall'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
