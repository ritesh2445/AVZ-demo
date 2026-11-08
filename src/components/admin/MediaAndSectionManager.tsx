'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Copy,
  Search,
  X,
  Check,
  Plus,
  ArrowDown,
  Layers,
  Palette,
  ShoppingBag,
  BookOpen,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Eye,
  RefreshCw,
  Tag
} from 'lucide-react';
import { CATEGORIES } from '@/src/data/brandData';

interface MediaAsset {
  id: string;
  title: string;
  url: string;
  media_type?: string;
  alt_text?: string;
  tags?: string[];
  category?: string;
  created_at?: number;
}

interface MediaAndSectionManagerProps {
  showNotification: (msg: string, type?: 'success' | 'error') => void;
  onRefreshProducts?: () => void;
}

const FRAME_OPTIONS = [
  { id: 'ornate_baroque', name: 'Ornate Baroque (Sculpted Triple Gold)' },
  { id: 'gilded_rococo', name: 'Gilded Rococo (24k Lustrous Leaf)' },
  { id: 'florentine_gold', name: 'Florentine Gold (Renaissance Egg-and-Dart)' },
  { id: 'antique_fillet', name: 'Antique Fillet (Ebonized Wood & 24k Gold)' },
  { id: 'classical_cavetto', name: 'Classical Cavetto (French Fluted Molding)' },
  { id: 'tarnished_brass', name: 'Tarnished Brass (Aged Verdigris Relief)' }
];

const SHOP_CATEGORIES = [
  'Tops',
  'Bralettes',
  'Corsets',
  'Jackets',
  'Co-ord sets',
  'Skirts',
  'Body chainmail',
  'Arm cuffs',
  'Belts',
  'Bags',
  'Headgear'
];

export default function MediaAndSectionManager({
  showNotification,
  onRefreshProducts
}: MediaAndSectionManagerProps) {
  // --- SECTION 1: MASTER MEDIA UPLOAD & POOL STATES ---
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [loadingMedia, setLoadingMedia] = useState<boolean>(true);
  const [mediaSearch, setMediaSearch] = useState<string>('');
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<string>('all');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteAsset, setConfirmDeleteAsset] = useState<MediaAsset | null>(null);

  // --- SECTION 2: WEBSITE SECTION PLACEMENT STATES ---
  const [activeSubSection, setActiveSubSection] = useState<'museum' | 'shop' | 'lookbook' | 'featured'>('museum');
  const [selectedPhoto, setSelectedPhoto] = useState<MediaAsset | null>(null);
  const [pickerModalOpen, setPickerModalOpen] = useState<boolean>(false);
  const [pickerSearch, setPickerSearch] = useState<string>('');

  // Sub-Section A: Museum Form State
  const [museumForm, setMuseumForm] = useState({
    title: '',
    artist: 'Dhrisni & The AVZ Atelier',
    year: new Date().getFullYear().toString(),
    category: 'Archival Haute Couture',
    frame_style: 'ornate_baroque',
    dimensions_cm: '75 × 100 cm',
    description: '',
    medium: 'Upcycled hardware, steel spikes, reclaimed materials'
  });
  const [savingMuseum, setSavingMuseum] = useState(false);
  const [museumArtworks, setMuseumArtworks] = useState<any[]>([]);

  // Sub-Section B: Shop Product Form State
  const [shopForm, setShopForm] = useState({
    name: '',
    price: '2500',
    category: 'Tops',
    stock: '1',
    sku: '',
    description: '1-of-1 handcrafted wearable art piece by Dhrisni in Guwahati atelier.'
  });
  const [savingShop, setSavingShop] = useState(false);
  const [shopProducts, setShopProducts] = useState<any[]>([]);

  // Sub-Section C: Lookbook Form State
  const [lookbookForm, setLookbookForm] = useState({
    title: '',
    season: 'Runway 2024 / Spring Archive',
    caption: '',
    materials: 'Reclaimed hardware, upcycled textiles, industrial wire'
  });
  const [savingLookbook, setSavingLookbook] = useState(false);
  const [lookbookEntries, setLookbookEntries] = useState<any[]>([]);

  // Sub-Section D: Featured Pieces Form State
  const [featuredForm, setFeaturedForm] = useState({
    title: '',
    tag: 'BEST SELLER',
    price: '3500',
    category: 'Bralettes'
  });
  const [savingFeatured, setSavingFeatured] = useState(false);
  const [featuredPieces, setFeaturedPieces] = useState<any[]>([]);

  const section2Ref = useRef<HTMLDivElement>(null);

  // Fetch Media Pool
  const fetchMedia = async () => {
    setLoadingMedia(true);
    try {
      const res = await fetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        setMediaAssets(data.assets || []);
      }
    } catch {
      showNotification('Failed to load media vault', 'error');
    } finally {
      setLoadingMedia(false);
    }
  };

  // Fetch Museum Artworks
  const fetchMuseum = async () => {
    try {
      const res = await fetch('/api/admin/gallery');
      if (res.ok) {
        const data = await res.json();
        setMuseumArtworks(data.artworks || []);
      }
    } catch {}
  };

  // Fetch Shop Products
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setShopProducts(data.products || []);
      }
    } catch {}
  };

  useEffect(() => {
    fetchMedia();
    fetchMuseum();
    fetchProducts();
  }, []);

  // Upload handler (R2 or direct image upload)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'uploads');

      try {
        const res = await fetch('/api/admin/media/upload', {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          successCount++;
        }
      } catch (err) {
        console.error('File upload error:', err);
      }
    }

    setIsUploading(false);
    if (successCount > 0) {
      showNotification(`Successfully uploaded ${successCount} photo${successCount > 1 ? 's' : ''} to media pool!`, 'success');
      fetchMedia();
    } else {
      showNotification('Failed to upload file to media vault', 'error');
    }
    e.target.value = '';
  };

  // Delete handler
  const handleDeleteMedia = async (asset: MediaAsset) => {
    setDeletingId(asset.id);
    try {
      const res = await fetch(`/api/admin/media?id=${encodeURIComponent(asset.id)}&url=${encodeURIComponent(asset.url)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMediaAssets(prev => prev.filter(a => a.id !== asset.id && a.url !== asset.url));
        if (selectedPhoto?.id === asset.id || selectedPhoto?.url === asset.url) {
          setSelectedPhoto(null);
        }
        showNotification('Photo deleted permanently from media vault', 'success');
      } else {
        showNotification(data.error || 'Failed to delete photo', 'error');
      }
    } catch {
      showNotification('Network error while deleting photo', 'error');
    } finally {
      setDeletingId(null);
      setConfirmDeleteAsset(null);
    }
  };

  // Select photo and jump to Section 2
  const handleAssignToSection = (asset: MediaAsset, targetSection?: 'museum' | 'shop' | 'lookbook' | 'featured') => {
    setSelectedPhoto(asset);
    if (targetSection) {
      setActiveSubSection(targetSection);
    }
    // Pre-populate titles if empty
    if (!museumForm.title) setMuseumForm(prev => ({ ...prev, title: asset.title }));
    if (!shopForm.name) setShopForm(prev => ({ ...prev, name: asset.title }));
    if (!lookbookForm.title) setLookbookForm(prev => ({ ...prev, title: asset.title }));
    if (!featuredForm.title) setFeaturedForm(prev => ({ ...prev, title: asset.title }));

    showNotification(`Selected "${asset.title}" for Section placement!`, 'success');

    // Smooth scroll down to Section 2
    section2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Publish to Museum
  const handlePublishMuseum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhoto) {
      showNotification('Please select a photo from Section 1 first', 'error');
      return;
    }
    if (!museumForm.title.trim()) {
      showNotification('Artwork title is required', 'error');
      return;
    }

    setSavingMuseum(true);
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: museumForm.title.trim(),
          artist: museumForm.artist.trim(),
          image_url: selectedPhoto.url,
          thumbnail_url: selectedPhoto.url,
          year: museumForm.year.trim(),
          category: museumForm.category.trim(),
          frame_style: museumForm.frame_style,
          aspect_ratio: '3:4',
          description: museumForm.description.trim(),
          metadata: {
            dimensions_cm: museumForm.dimensions_cm,
            medium: museumForm.medium
          }
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showNotification('🏛️ Successfully published artwork to Museum Wall!', 'success');
        fetchMuseum();
        setMuseumForm(prev => ({ ...prev, title: '', description: '' }));
      } else {
        showNotification(data.error || 'Failed to publish to Museum', 'error');
      }
    } catch {
      showNotification('Network error publishing to Museum', 'error');
    } finally {
      setSavingMuseum(false);
    }
  };

  // Publish to Shop Catalog
  const handlePublishShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhoto) {
      showNotification('Please select a photo from Section 1 first', 'error');
      return;
    }
    if (!shopForm.name.trim() || !shopForm.price) {
      showNotification('Product name and price are required', 'error');
      return;
    }

    setSavingShop(true);
    try {
      const autoSku = shopForm.sku.trim() || `AVZ-${shopForm.category.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: shopForm.name.trim(),
          price: Number(shopForm.price),
          category: shopForm.category,
          inventory_quantity: Number(shopForm.stock) || 1,
          sku: autoSku,
          description: shopForm.description.trim(),
          images: [selectedPhoto.url],
          status: 'published'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showNotification('🛍️ Successfully published product to Shop Catalog!', 'success');
        fetchProducts();
        onRefreshProducts?.();
        setShopForm(prev => ({ ...prev, name: '', sku: '' }));
      } else {
        showNotification(data.error || 'Failed to publish to Shop', 'error');
      }
    } catch {
      showNotification('Network error publishing to Shop', 'error');
    } finally {
      setSavingShop(false);
    }
  };

  // Publish to Lookbook
  const handlePublishLookbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhoto) {
      showNotification('Please select a photo from Section 1 first', 'error');
      return;
    }
    if (!lookbookForm.title.trim()) {
      showNotification('Look title is required', 'error');
      return;
    }

    const newEntry = {
      id: `look_${Date.now()}`,
      title: lookbookForm.title.trim(),
      season: lookbookForm.season.trim(),
      caption: lookbookForm.caption.trim(),
      image: selectedPhoto.url,
      materials: lookbookForm.materials.trim()
    };
    setLookbookEntries(prev => [newEntry, ...prev]);
    showNotification('📖 Successfully assigned look to Lookbook Editorial!', 'success');
    setLookbookForm(prev => ({ ...prev, title: '', caption: '' }));
  };

  // Publish to Featured Pieces
  const handlePublishFeatured = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhoto) {
      showNotification('Please select a photo from Section 1 first', 'error');
      return;
    }
    if (!featuredForm.title.trim()) {
      showNotification('Piece title is required', 'error');
      return;
    }

    const newPiece = {
      id: `feat_${Date.now()}`,
      title: featuredForm.title.trim(),
      tag: featuredForm.tag,
      price: Number(featuredForm.price) || 3500,
      category: featuredForm.category,
      image: selectedPhoto.url
    };
    setFeaturedPieces(prev => [newPiece, ...prev]);
    showNotification('✨ Successfully assigned to Featured Pieces Vault!', 'success');
    setFeaturedForm(prev => ({ ...prev, title: '' }));
  };

  // Filtered master media assets
  const filteredAssets = useMemo(() => {
    return mediaAssets.filter((asset) => {
      const matchesCat =
        mediaCategoryFilter === 'all' ||
        asset.category === mediaCategoryFilter ||
        (Array.isArray(asset.tags) && asset.tags.includes(mediaCategoryFilter)) ||
        (asset.url && asset.url.includes(`/${mediaCategoryFilter}/`)) ||
        (mediaCategoryFilter === 'editorial' && !asset.url?.includes('/collection/') && !asset.url?.includes('/featured/') && !asset.url?.includes('/lookbook/') && !asset.url?.includes('/museum/'));

      const q = mediaSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (asset.title && asset.title.toLowerCase().includes(q)) ||
        (asset.url && asset.url.toLowerCase().includes(q)) ||
        (Array.isArray(asset.tags) && asset.tags.some((t: string) => t.toLowerCase().includes(q)));

      return matchesCat && matchesSearch;
    });
  }, [mediaAssets, mediaCategoryFilter, mediaSearch]);

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      {/* ============================================================== */}
      {/* SECTION 1: MASTER MEDIA UPLOAD & PHOTO POOL                   */}
      {/* ============================================================== */}
      <section className="bg-[#0e0915] border border-pink/25 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-[#BE185D]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Section 1 Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-pink/20 border border-pink/40 flex items-center justify-center font-cinzel font-bold text-pink text-sm">
                1
              </span>
              <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-white tracking-wide">
                Master Media Upload & Photo Pool
              </h2>
            </div>
            <p className="text-xs text-neutral-400 mt-1 font-mono pl-11">
              All photos must first be uploaded here. Upload new photos, browse, copy URLs, or permanently delete unwanted photos.
            </p>
          </div>

          {/* Upload Button */}
          <label className="cursor-pointer px-5 py-3 rounded-2xl bg-gradient-to-r from-pink to-purple-600 hover:opacity-90 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-xl transition-all shrink-0 active:scale-95">
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Uploading Photos...' : 'Upload New Photos'}</span>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              disabled={isUploading}
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {/* Filter Pills & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-[#140e1c] border border-white/10 p-3 rounded-2xl mb-6">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: `All Photos (${mediaAssets.length})` },
              { id: 'collection', label: `Collection Archive (${mediaAssets.filter(a => a.category === 'collection' || a.tags?.includes('collection') || a.url?.includes('/collection/')).length})` },
              { id: 'featured', label: `Featured Best Sellers (${mediaAssets.filter(a => a.category === 'featured' || a.tags?.includes('featured') || a.url?.includes('/featured/')).length})` },
              { id: 'lookbook', label: `Lookbook (${mediaAssets.filter(a => a.category === 'lookbook' || a.tags?.includes('lookbook') || a.url?.includes('/lookbook/')).length})` },
              { id: 'museum', label: `Museum Artworks (${mediaAssets.filter(a => a.category === 'museum' || a.tags?.includes('museum') || a.url?.includes('/museum/')).length})` },
              { id: 'editorial', label: `Brand / Editorial` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMediaCategoryFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  mediaCategoryFilter === tab.id
                    ? 'bg-pink text-black font-bold shadow-md'
                    : 'bg-[#1e1529] text-neutral-400 hover:text-white hover:bg-[#2c1d3c]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={mediaSearch}
              onChange={(e) => setMediaSearch(e.target.value)}
              placeholder="Search by title, tag, or URL..."
              className="w-full bg-[#1e1529] border border-white/10 text-white text-xs pl-9 pr-8 py-2.5 rounded-xl font-mono focus:outline-none focus:border-pink"
            />
            {mediaSearch && (
              <button
                onClick={() => setMediaSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Photo Pool Grid */}
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-4 px-1">
          <span>Showing {filteredAssets.length} of {mediaAssets.length} photos</span>
          {selectedPhoto && (
            <span className="text-pink flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Selected for Section 2: <span className="font-bold text-white truncate max-w-[200px]">{selectedPhoto.title}</span>
            </span>
          )}
        </div>

        {loadingMedia ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <RefreshCw className="w-8 h-8 text-pink animate-spin mb-3" />
            <p className="text-xs font-mono text-neutral-400">Loading master photo vault...</p>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl bg-[#140e1c]">
            <ImageIcon className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm font-cinzel text-neutral-300">No photos found matching your search</p>
            <p className="text-xs font-mono text-neutral-500 mt-1">Upload a photo above or try a different filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredAssets.map((asset) => {
              const isSelected = selectedPhoto?.id === asset.id || selectedPhoto?.url === asset.url;
              return (
                <div
                  key={asset.id}
                  className={`group relative bg-[#130d1d] border rounded-2xl overflow-hidden transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-pink ring-2 ring-pink/50 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                      : 'border-white/10 hover:border-pink/40'
                  }`}
                >
                  {/* Photo Square View */}
                  <div className="aspect-square bg-black/90 relative overflow-hidden">
                    {asset.media_type === 'video' ? (
                      <div className="w-full h-full flex items-center justify-center bg-[#1A1224] text-pink font-mono text-xs">
                        Video (MP4)
                      </div>
                    ) : (
                      <img
                        src={asset.url}
                        alt={asset.alt_text || asset.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-2 left-2 z-10 pointer-events-none">
                      <span className="px-1.5 py-0.5 rounded-full bg-black/85 border border-white/15 text-[8px] font-mono text-white uppercase backdrop-blur-md">
                        {asset.category || (asset.tags && asset.tags[0]) || 'photo'}
                      </span>
                    </div>

                    {/* Quick Selected Indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 z-10">
                        <span className="w-5 h-5 rounded-full bg-pink text-black flex items-center justify-center font-bold text-xs shadow-lg">
                          ✓
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Photo Card Details & Actions */}
                  <div className="p-2.5 flex flex-col justify-between flex-1 bg-[#130d1d]">
                    <span className="text-[11px] font-semibold text-white truncate block mb-2" title={asset.title}>
                      {asset.title}
                    </span>

                    {/* Actions: Use in Section & Delete Photo */}
                    <div className="space-y-1.5 pt-2 border-t border-white/10 mt-auto">
                      {/* Pick for Section 2 */}
                      <button
                        onClick={() => handleAssignToSection(asset)}
                        className={`w-full py-1.5 px-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-pink text-black shadow-md'
                            : 'bg-white/10 hover:bg-pink hover:text-black text-white'
                        }`}
                      >
                        <span>{isSelected ? 'Selected' : 'Use in Section ➔'}</span>
                      </button>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(asset.url);
                            showNotification('Photo URL copied to clipboard', 'success');
                          }}
                          className="text-[9px] text-neutral-400 hover:text-white flex items-center gap-1 font-mono cursor-pointer"
                        >
                          <Copy className="w-2.5 h-2.5" /> Copy
                        </button>

                        {/* DELETE PHOTO BUTTON */}
                        <button
                          onClick={() => setConfirmDeleteAsset(asset)}
                          disabled={deletingId === asset.id}
                          className="text-[9px] text-red-400 hover:text-red-300 hover:bg-red-950/40 px-1.5 py-0.5 rounded flex items-center gap-1 font-mono cursor-pointer transition-colors"
                          title="Permanently delete this photo from media pool"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* SECTION 2: ASSIGN & PUBLISH TO WEBSITE SECTIONS                */}
      {/* ============================================================== */}
      <section ref={section2Ref} className="bg-[#0e0915] border border-pink/25 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-b from-purple-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Section 2 Header */}
        <div className="border-b border-white/10 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-pink/20 border border-pink/40 flex items-center justify-center font-cinzel font-bold text-pink text-sm">
              2
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-white tracking-wide">
                Publish Photos to Website Sections
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5 font-mono">
                Select which section of the website to place photos, choose a photo from Section 1 above, and put down the specific details.
              </p>
            </div>
          </div>

          {/* 4 Website Section Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6">
            {[
              { id: 'museum', label: '1. Museum Wall', icon: Palette, desc: 'Exhibition frames on #museum' },
              { id: 'shop', label: '2. Shop Products', icon: ShoppingBag, desc: 'Collection archive on #shop' },
              { id: 'lookbook', label: '3. Lookbook', icon: BookOpen, desc: 'Editorial runway drift on #lookbook' },
              { id: 'featured', label: '4. Featured Vault', icon: Sparkles, desc: 'Bestseller spotlight on #vault' }
            ].map((sub) => {
              const Icon = sub.icon;
              const isActive = activeSubSection === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubSection(sub.id as any)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-gradient-to-br from-pink/25 via-[#23122c] to-[#120a1c] border-pink text-white shadow-lg ring-1 ring-pink/50'
                      : 'bg-[#140e1c] border-white/10 hover:border-white/25 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-cinzel text-xs font-bold uppercase tracking-wider">{sub.label}</span>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-pink' : 'text-neutral-500'}`} />
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">{sub.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SUB-SECTION CONTAINER: Active Photo Preview + Detail Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5 Cols): Selected Photo Preview & Quick Picker */}
          <div className="lg:col-span-5 bg-[#140e1c] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block mb-3 font-semibold">
                Photo Selected from Section 1:
              </span>

              {selectedPhoto ? (
                <div className="space-y-3">
                  <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-black border border-pink/40 relative shadow-2xl">
                    <img
                      src={selectedPhoto.url}
                      alt={selectedPhoto.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded-full bg-black/80 border border-white/20 text-[9px] font-mono text-white uppercase backdrop-blur-md">
                        {selectedPhoto.category || 'Uploaded Photo'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-mono text-xs font-bold text-white truncate">{selectedPhoto.title}</h4>
                    <p className="text-[10px] font-mono text-neutral-400 truncate mt-0.5">{selectedPhoto.url}</p>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setPickerModalOpen(true)}
                  className="aspect-[3/4] w-full rounded-2xl border-2 border-dashed border-white/20 hover:border-pink bg-black/40 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-pink transition-all">
                    <ImageIcon className="w-6 h-6 text-neutral-400 group-hover:text-pink" />
                  </div>
                  <span className="text-xs font-cinzel font-bold text-white mb-1">Click to Pick a Photo</span>
                  <span className="text-[10px] font-mono text-neutral-400 leading-relaxed">
                    Choose from Section 1 above to assign to this section
                  </span>
                </div>
              )}
            </div>

            {/* Change Photo Button */}
            <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
              <button
                onClick={() => setPickerModalOpen(true)}
                className="text-xs font-mono text-pink hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{selectedPhoto ? 'Change Photo ↺' : 'Browse Section 1 Photos →'}</span>
              </button>

              {selectedPhoto && (
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="text-xs font-mono text-neutral-400 hover:text-red-400 cursor-pointer"
                >
                  Clear Selection
                </button>
              )}
            </div>
          </div>

          {/* Right Column (7 Cols): Section Details Form */}
          <div className="lg:col-span-7 bg-[#140e1c] border border-white/10 rounded-2xl p-5 sm:p-6">
            {/* SUB-SECTION 1: MUSEUM WALL */}
            {activeSubSection === 'museum' && (
              <form onSubmit={handlePublishMuseum} className="space-y-4">
                <div className="border-b border-white/10 pb-3 mb-4">
                  <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                    <Palette className="w-4 h-4 text-pink" />
                    <span>Museum Gallery Wall Placement</span>
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">
                    Frame this photo into a fine-art masterpiece on the 3D exhibition wall (#museum).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">Artwork Title *</label>
                    <input
                      type="text"
                      required
                      value={museumForm.title}
                      onChange={(e) => setMuseumForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Portrait of the Cyber Empress"
                      className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">Artist Name</label>
                    <input
                      type="text"
                      value={museumForm.artist}
                      onChange={(e) => setMuseumForm(prev => ({ ...prev, artist: e.target.value }))}
                      placeholder="Dhrisni & The AVZ Atelier"
                      className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">Exhibition Frame Style</label>
                    <select
                      value={museumForm.frame_style}
                      onChange={(e) => setMuseumForm(prev => ({ ...prev, frame_style: e.target.value }))}
                      className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                    >
                      {FRAME_OPTIONS.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">Dimensions</label>
                    <input
                      type="text"
                      value={museumForm.dimensions_cm}
                      onChange={(e) => setMuseumForm(prev => ({ ...prev, dimensions_cm: e.target.value }))}
                      placeholder="75 × 100 cm"
                      className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">Curatorial Description / Story</label>
                  <textarea
                    rows={2}
                    value={museumForm.description}
                    onChange={(e) => setMuseumForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the reclaimed materials, industrial spikes, or artistic rebellion..."
                    className="w-full bg-[#1b1325] border border-white/15 rounded-xl p-3 text-xs text-white font-mono focus:border-pink focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingMuseum || !selectedPhoto}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink to-purple-600 hover:opacity-90 disabled:opacity-50 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  <Palette className="w-4 h-4" />
                  <span>{savingMuseum ? 'Publishing Artwork...' : '🏛️ Publish Artwork to Museum Wall'}</span>
                </button>
              </form>
            )}

            {/* SUB-SECTION 2: SHOP PRODUCTS */}
            {activeSubSection === 'shop' && (
              <form onSubmit={handlePublishShop} className="space-y-4">
                <div className="border-b border-white/10 pb-3 mb-4">
                  <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-pink" />
                    <span>Shop Boutique & Catalog Placement</span>
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">
                    Add this photo as a wearable art product in the collection archive catalogue (#shop).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={shopForm.name}
                      onChange={(e) => setShopForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Acid-Wash Distressed Armor Top"
                      className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">Price (INR ₹) *</label>
                    <input
                      type="number"
                      required
                      value={shopForm.price}
                      onChange={(e) => setShopForm(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="2500"
                      className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">Collection Category</label>
                    <select
                      value={shopForm.category}
                      onChange={(e) => setShopForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                    >
                      {SHOP_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={shopForm.stock}
                      onChange={(e) => setShopForm(prev => ({ ...prev, stock: e.target.value }))}
                      placeholder="1 (for 1-of-1)"
                      className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">Product Story & Craft Notes</label>
                  <textarea
                    rows={2}
                    value={shopForm.description}
                    onChange={(e) => setShopForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Details about craftsmanship, upcycled hardware, fit, etc."
                    className="w-full bg-[#1b1325] border border-white/15 rounded-xl p-3 text-xs text-white font-mono focus:border-pink focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingShop || !selectedPhoto}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink to-purple-600 hover:opacity-90 disabled:opacity-50 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{savingShop ? 'Publishing Product...' : '🛍️ Publish Product to Shop Catalog'}</span>
                </button>
              </form>
            )}

            {/* SUB-SECTION 3: EDITORIAL LOOKBOOK */}
            {activeSubSection === 'lookbook' && (
              <form onSubmit={handlePublishLookbook} className="space-y-4">
                <div className="border-b border-white/10 pb-3 mb-4">
                  <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-pink" />
                    <span>Editorial Lookbook Placement</span>
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">
                    Feature this photo in the spatial parallax runway lookbook drift (#lookbook).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">Look Title *</label>
                    <input
                      type="text"
                      required
                      value={lookbookForm.title}
                      onChange={(e) => setLookbookForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. The Severed Circuit"
                      className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">Campaign / Season</label>
                    <input
                      type="text"
                      value={lookbookForm.season}
                      onChange={(e) => setLookbookForm(prev => ({ ...prev, season: e.target.value }))}
                      placeholder="Runway 2024 / Spring Archive"
                      className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">Runway Caption & Editorial Story</label>
                  <textarea
                    rows={2}
                    value={lookbookForm.caption}
                    onChange={(e) => setLookbookForm(prev => ({ ...prev, caption: e.target.value }))}
                    placeholder="Editorial concept, photographer notes, styling vibe..."
                    className="w-full bg-[#1b1325] border border-white/15 rounded-xl p-3 text-xs text-white font-mono focus:border-pink focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingLookbook || !selectedPhoto}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink to-purple-600 hover:opacity-90 disabled:opacity-50 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{savingLookbook ? 'Saving Look...' : '📖 Publish Look to Lookbook'}</span>
                </button>
              </form>
            )}

            {/* SUB-SECTION 4: FEATURED PIECES (VAULT) */}
            {activeSubSection === 'featured' && (
              <form onSubmit={handlePublishFeatured} className="space-y-4">
                <div className="border-b border-white/10 pb-3 mb-4">
                  <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink" />
                    <span>Featured Pieces (Vault Spotlight)</span>
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">
                    Highlight this photo in the top Vault Spotlight and best-seller carousel (#vault).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">Piece Title *</label>
                    <input
                      type="text"
                      required
                      value={featuredForm.title}
                      onChange={(e) => setFeaturedForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Cyberpunk Motherboard Bralette"
                      className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">Badge Tag</label>
                    <select
                      value={featuredForm.tag}
                      onChange={(e) => setFeaturedForm(prev => ({ ...prev, tag: e.target.value }))}
                      className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                    >
                      <option value="BEST SELLER">BEST SELLER</option>
                      <option value="1 OF 1">1 OF 1</option>
                      <option value="SIGNATURE PIECE">SIGNATURE PIECE</option>
                      <option value="VAULT EXCLUSIVE">VAULT EXCLUSIVE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">Price (INR ₹)</label>
                    <input
                      type="number"
                      value={featuredForm.price}
                      onChange={(e) => setFeaturedForm(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="3500"
                      className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">Category</label>
                    <select
                      value={featuredForm.category}
                      onChange={(e) => setFeaturedForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                    >
                      {SHOP_CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingFeatured || !selectedPhoto}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink to-purple-600 hover:opacity-90 disabled:opacity-50 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{savingFeatured ? 'Publishing to Vault...' : '✨ Publish to Featured Vault'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* CURRENTLY PUBLISHED IN ACTIVE SECTION */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-pink" />
              <span>
                Currently Published in {activeSubSection === 'museum' ? 'Museum Wall' : activeSubSection === 'shop' ? 'Shop Catalog' : activeSubSection === 'lookbook' ? 'Lookbook' : 'Featured Vault'}
              </span>
            </h4>
            <span className="text-xs font-mono text-neutral-400">
              {activeSubSection === 'museum' ? `${museumArtworks.length} Artworks` : activeSubSection === 'shop' ? `${shopProducts.length} Products` : `${lookbookEntries.length} Looks`}
            </span>
          </div>

          {activeSubSection === 'museum' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {museumArtworks.slice(0, 18).map((art) => (
                <div key={art.id} className="bg-[#140e1c] border border-white/10 rounded-xl overflow-hidden group">
                  <div className="aspect-[3/4] bg-black relative">
                    <img src={art.image_url} alt={art.title} className="w-full h-full object-cover" />
                    <div className="absolute top-1.5 left-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-black/80 text-[8px] font-mono text-pink">
                        {art.frame_style?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="p-2">
                    <span className="text-[10px] font-bold text-white block truncate">{art.title}</span>
                    <span className="text-[9px] font-mono text-neutral-400 block truncate">{art.year} • {art.artist}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSubSection === 'shop' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {shopProducts.slice(0, 18).map((prod) => (
                <div key={prod.id} className="bg-[#140e1c] border border-white/10 rounded-xl overflow-hidden group">
                  <div className="aspect-[3/4] bg-black relative">
                    <img src={Array.isArray(prod.images) ? prod.images[0] : prod.image} alt={prod.name || prod.title} className="w-full h-full object-cover" />
                    <div className="absolute top-1.5 left-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-black/80 text-[8px] font-mono text-white">
                        {prod.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-2">
                    <span className="text-[10px] font-bold text-white block truncate">{prod.title || prod.name}</span>
                    <span className="text-[9px] font-mono font-bold text-pink block">₹{prod.price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================== */}
      {/* QUICK PHOTO PICKER MODAL (when clicking "Browse Section 1")     */}
      {/* ============================================================== */}
      {pickerModalOpen && (
        <div
          onClick={() => setPickerModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-[#120b1c] border border-pink/30 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh]"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white">Select a Photo from Uploaded Media Pool</h3>
                <p className="text-xs font-mono text-neutral-400 mt-0.5">Click any photo below to instantly assign it to Section 2</p>
              </div>
              <button
                onClick={() => setPickerModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Picker Search */}
            <div className="mb-4">
              <input
                type="text"
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                placeholder="Search photos..."
                className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
              />
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {mediaAssets
                .filter(a => !pickerSearch || a.title?.toLowerCase().includes(pickerSearch.toLowerCase()) || a.url?.toLowerCase().includes(pickerSearch.toLowerCase()))
                .map(asset => (
                  <button
                    key={asset.id}
                    onClick={() => {
                      handleAssignToSection(asset);
                      setPickerModalOpen(false);
                    }}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-pink transition-all text-left bg-black cursor-pointer"
                  >
                    <img src={asset.url} alt={asset.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-x-0 bottom-0 p-1.5 bg-black/80 backdrop-blur-sm">
                      <span className="text-[9px] font-mono text-white block truncate">{asset.title}</span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DELETE CONFIRMATION MODAL                                      */}
      {/* ============================================================== */}
      {confirmDeleteAsset && (
        <div
          onClick={() => setConfirmDeleteAsset(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#140b1a] border border-red-500/40 rounded-3xl p-6 shadow-2xl text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-500/50 flex items-center justify-center mx-auto mb-4 text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="font-cinzel text-lg font-bold text-white mb-2">Delete Photo Permanently?</h3>
            <p className="text-xs font-mono text-neutral-300 mb-4 leading-relaxed">
              Are you sure you want to delete <span className="text-white font-bold">"{confirmDeleteAsset.title}"</span>? This will permanently remove it from the master photo vault.
            </p>

            <div className="aspect-[4/3] w-36 mx-auto rounded-xl overflow-hidden bg-black border border-white/10 mb-6">
              <img src={confirmDeleteAsset.url} alt={confirmDeleteAsset.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setConfirmDeleteAsset(null)}
                className="px-5 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-xs font-mono text-neutral-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMedia(confirmDeleteAsset)}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs uppercase cursor-pointer transition-all shadow-lg shadow-red-900/40"
              >
                Yes, Delete Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

