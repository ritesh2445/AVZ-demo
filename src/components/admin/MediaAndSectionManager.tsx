'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Edit3,
  Copy,
  Search,
  X,
  Check,
  Plus,
  Layers,
  Palette,
  ShoppingBag,
  BookOpen,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Eye,
  RefreshCw,
  Tag,
  Star,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { LOOKBOOK_ENTRIES, FEATURED_PIECES, CATEGORIES } from '@/src/data/brandData';

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

type SectionTab = 'vault' | 'lookbook' | 'key_pieces' | 'collection' | 'archive_gallery';

export default function MediaAndSectionManager({
  showNotification,
  onRefreshProducts
}: MediaAndSectionManagerProps) {
  // =========================================================================
  // SECTION 1: MASTER MEDIA UPLOAD & PHOTO POOL (Clean: images only, no tags)
  // =========================================================================
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [loadingMedia, setLoadingMedia] = useState<boolean>(true);
  const [mediaSearch, setMediaSearch] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteAsset, setConfirmDeleteAsset] = useState<MediaAsset | null>(null);

  // =========================================================================
  // SECTION 2: 5 SUB-SECTIONS (Visible as a Whole, Editable & Deletable, Multi-Photo)
  // 1. The Vault Pieces
  // 2. Lookbook Archive
  // 3. Key Pieces
  // 4. Collection Archive
  // 5. The Archive Gallery
  // =========================================================================
  const [activeSubSection, setActiveSubSection] = useState<SectionTab>('collection');

  // Multi-photo state for the active form (allows attaching multiple pictures!)
  const [formPhotos, setFormPhotos] = useState<string[]>([]);
  const [pickerModalOpen, setPickerModalOpen] = useState<boolean>(false);
  const [pickerSearch, setPickerSearch] = useState<string>('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Section 2 Data Stores
  const [vaultPieces, setVaultPieces] = useState<any[]>(FEATURED_PIECES || []);
  const [lookbookEntriesList, setLookbookEntriesList] = useState<any[]>(LOOKBOOK_ENTRIES || []);
  const [keyPiecesList, setKeyPiecesList] = useState<any[]>([]);
  const [collectionProducts, setCollectionProducts] = useState<any[]>([]);
  const [museumArtworks, setMuseumArtworks] = useState<any[]>([]);

  // Category filter and pagination for Section 4 (Collection Archive)
  const [collectionFilter, setCollectionFilter] = useState<string>('All');
  const [collectionSearch, setCollectionSearch] = useState<string>('');
  const [collectionPage, setCollectionPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 24;

  // Forms State for all 5 Sub-sections
  // 1. Vault Pieces Form
  const [vaultForm, setVaultForm] = useState({
    title: '',
    price: '3800',
    tag: '1 OF 1',
    category: 'Bralettes',
    story: 'Archival masterpiece from the private vault, hand-crafted with upcycled hardware.'
  });

  // 2. Lookbook Form

  const [lookbookForm, setLookbookForm] = useState({
    title: '',
    code: 'LOOK 001 • EDITORIAL RUNWAY',
    subtitle: 'Metal Corsetry at the Intersection of Rebellion & Haute Cyber-Couture',
    caption: 'Model styled in bespoke upcycled armor under studio lighting.',
    story: 'A conceptual study in raw hardware and reconstructed silhouette.',
    materials: 'Reclaimed Metals, Stainless Chains, Hand-Set Spikes, Industrial Rivets'
  });

  // 3. Key Pieces Form
  const [keyPieceForm, setKeyPieceForm] = useState({
    title: '',
    price: '3200',
    category: 'Tops',
    tag: 'KEY PIECE',
    description: 'Signature studio statement piece sculpted with cold-forged spikes.'
  });

  // 4. Collection Archive Form
  const [collectionForm, setCollectionForm] = useState({
    name: '',
    price: '2500',
    category: 'Tops',
    stock: '1',
    sku: '',
    description: 'Handcrafted 1-of-1 wearable art piece by Dhrisni in our Studio.',
    sizes: ['Free Size'] as string[]
  });

  // 5. The Archive Gallery Form
  const [museumForm, setMuseumForm] = useState({
    title: '',
    artist: 'Dhrisni & The AVZ Studio',
    year: new Date().getFullYear().toString(),
    category: 'Archival Haute Couture',
    frame_style: 'ornate_baroque',
    dimensions_cm: '75 × 100 cm',
    description: 'Reclaimed metal chains, steel spikes, and upcycled industrial hardware.'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDeleteItem, setConfirmDeleteItem] = useState<{ type: SectionTab; item: any } | null>(null);

  const section2Ref = useRef<HTMLDivElement>(null);

  // --- API FETCHES ---
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

  const fetchMuseum = async () => {
    try {
      const res = await fetch('/api/admin/gallery');
      if (res.ok) {
        const data = await res.json();
        setMuseumArtworks(data.artworks || []);
      }
    } catch {}
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        const prods = data.products || [];
        setCollectionProducts(prods);

        // Filter out Key Pieces and Vault pieces
        const vault = prods.filter((p: any) => p.is_featured || p.category === 'Vault' || (p.tag && p.tag.includes('VAULT')));
        if (vault.length > 0) setVaultPieces(vault);

        const keys = prods.filter((p: any) => (p.tag && p.tag.includes('KEY')) || p.custom_made);
        if (keys.length > 0) setKeyPiecesList(keys);
        else setKeyPiecesList(prods.slice(0, 8));
      }
    } catch {}
  };

  useEffect(() => {
    fetchMedia();
    fetchMuseum();
    fetchProducts();
  }, []);

  // --- UPLOAD PHOTOS INTO SECTION 1 ---
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
        if (res.ok) successCount++;
      } catch (err) {
        console.error('File upload error:', err);
      }
    }

    setIsUploading(false);
    if (successCount > 0) {
      showNotification(`Uploaded ${successCount} photo${successCount > 1 ? 's' : ''} to media pool!`, 'success');
      fetchMedia();
    } else {
      showNotification('Failed to upload file to media vault', 'error');
    }
    e.target.value = '';
  };

  // --- DELETE PHOTO FROM SECTION 1 ---
  const handleDeleteMedia = async (asset: MediaAsset) => {
    setDeletingId(asset.id);
    try {
      const res = await fetch(`/api/admin/media?id=${encodeURIComponent(asset.id)}&url=${encodeURIComponent(asset.url)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMediaAssets(prev => prev.filter(a => a.id !== asset.id && a.url !== asset.url));
        setFormPhotos(prev => prev.filter(u => u !== asset.url));
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

  // Add photo to current form (supports multiple!)
  const handleAddPhotoToForm = (url: string) => {
    if (!formPhotos.includes(url)) {
      setFormPhotos(prev => [...prev, url]);
      showNotification('Photo added to selection!', 'success');
    }
  };

  const handleRemovePhotoFromForm = (url: string) => {
    setFormPhotos(prev => prev.filter(u => u !== url));
  };

  // Quick "Use in Section" from Section 1
  const handleQuickUseFromPool = (asset: MediaAsset) => {
    handleAddPhotoToForm(asset.url);
    section2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showNotification(`Selected "${asset.title}" for Section 2!`, 'success');
  };

  // Reset Form
  const resetActiveForm = () => {
    setEditingItemId(null);
    setFormPhotos([]);
    setCollectionForm({
      name: '',
      price: '2500',
      category: 'Tops',
      stock: '1',
      sku: '',
      description: 'Handcrafted 1-of-1 wearable art piece by Dhrisni in our Studio.',
      sizes: ['Free Size']
    });
    setMuseumForm({
      title: '',
      artist: 'Dhrisni & The AVZ Studio',
      year: new Date().getFullYear().toString(),
      category: 'Archival Haute Couture',
      frame_style: 'ornate_baroque',
      dimensions_cm: '75 × 100 cm',
      description: 'Reclaimed metal chains, steel spikes, and upcycled industrial hardware.'
    });
    setVaultForm({
      title: '',
      price: '3800',
      tag: '1 OF 1',
      category: 'Bralettes',
      story: 'Archival masterpiece from the private vault, hand-crafted with upcycled hardware.'
    });
    setKeyPieceForm({
      title: '',
      price: '3200',
      category: 'Tops',
      tag: 'KEY PIECE',
      description: 'Signature studio statement piece sculpted with cold-forged spikes.'
    });
    setLookbookForm({
      title: '',
      code: 'LOOK 001 • EDITORIAL RUNWAY',
      subtitle: 'Metal Corsetry at the Intersection of Rebellion & Haute Cyber-Couture',
      caption: 'Model styled in bespoke upcycled armor under studio lighting.',
      story: 'A conceptual study in raw hardware and reconstructed silhouette.',
      materials: 'Reclaimed Metals, Stainless Chains, Hand-Set Spikes, Industrial Rivets'
    });
  };

  // --- EDIT TRIGGER: Populates Form Above ---
  const handleStartEdit = (type: SectionTab, item: any) => {
    setActiveSubSection(type);
    setEditingItemId(item.id);

    // Extract item photos
    let images: string[] = [];
    if (Array.isArray(item.images) && item.images.length > 0) {
      images = item.images;
    } else if (item.image_url) {
      images = [item.image_url];
    } else if (item.image) {
      images = [item.image];
    }
    setFormPhotos(images);

    if (type === 'collection') {
      const extractedSizes = (() => {
        if (Array.isArray(item.sizes) && item.sizes.length > 0) return item.sizes;
        if (Array.isArray(item.variants) && item.variants.length > 0) {
          return item.variants.map((v: any) => typeof v === 'object' ? (v.size || v.name) : v).filter(Boolean);
        }
        return ['Free Size'];
      })();

      setCollectionForm({
        name: item.title || item.name || '',
        price: String(item.price || 2500),
        category: item.category || 'Tops',
        stock: String(item.inventory_quantity ?? item.stock ?? 1),
        sku: item.sku || '',
        description: item.description || '',
        sizes: extractedSizes
      });
    } else if (type === 'archive_gallery') {
      setMuseumForm({
        title: item.title || '',
        artist: item.artist || 'Dhrisni & The AVZ Studio',
        year: String(item.year || '2024'),
        category: item.category || 'Archival Haute Couture',
        frame_style: item.frame_style || 'ornate_baroque',
        dimensions_cm: item.metadata?.dimensions_cm || item.dimensions_cm || '75 × 100 cm',
        description: item.description || ''
      });
    } else if (type === 'vault') {
      setVaultForm({
        title: item.name || item.title || '',
        price: String(item.price || 3800),
        tag: item.tag || '1 OF 1',
        category: item.category || 'Bralettes',
        story: item.description || item.story || ''
      });
    } else if (type === 'key_pieces') {
      setKeyPieceForm({
        title: item.name || item.title || '',
        price: String(item.price || 3200),
        category: item.category || 'Tops',
        tag: item.tag || 'KEY PIECE',
        description: item.description || ''
      });
    } else if (type === 'lookbook') {
      setLookbookForm({
        title: item.title || '',
        code: item.code || 'LOOK • RUNWAY ARCHIVE',
        subtitle: item.subtitle || '',
        caption: item.caption || '',
        story: item.story || '',
        materials: item.materials || ''
      });
    }

    section2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showNotification(`Editing "${item.title || item.name}". Form populated below!`, 'success');
  };

  // --- DELETE ITEM TRIGGER ---
  const handleExecuteDelete = async () => {
    if (!confirmDeleteItem) return;
    const { type, item } = confirmDeleteItem;

    try {
      if (type === 'archive_gallery') {
        const res = await fetch(`/api/admin/gallery/${item.id}`, { method: 'DELETE' });
        if (res.ok) {
          setMuseumArtworks(prev => prev.filter(x => x.id !== item.id));
          showNotification('Artwork deleted from Archive Gallery', 'success');
        } else {
          showNotification('Failed to delete artwork', 'error');
        }
      } else if (type === 'collection' || type === 'vault' || type === 'key_pieces') {
        const res = await fetch(`/api/admin/products/${item.id}`, { method: 'DELETE' });
        if (res.ok) {
          setCollectionProducts(prev => prev.filter(x => x.id !== item.id));
          setVaultPieces(prev => prev.filter(x => x.id !== item.id));
          setKeyPiecesList(prev => prev.filter(x => x.id !== item.id));
          onRefreshProducts?.();
          showNotification('Item removed from website catalog', 'success');
        } else {
          showNotification('Failed to delete product', 'error');
        }
      } else if (type === 'lookbook') {
        setLookbookEntriesList(prev => prev.filter(x => x.id !== item.id));
        showNotification('Lookbook entry deleted', 'success');
      }
    } catch {
      showNotification('Network error while deleting item', 'error');
    } finally {
      setConfirmDeleteItem(null);
    }
  };

  // --- SUBMIT HANDLERS ---
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formPhotos.length === 0) {
      showNotification('Please attach at least one photo from Section 1!', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. THE VAULT PIECES
      if (activeSubSection === 'vault') {
        const endpoint = editingItemId ? `/api/admin/products/${editingItemId}` : '/api/admin/products';
        const method = editingItemId ? 'PUT' : 'POST';
        const sku = `AVZ-VLT-${Date.now().toString().slice(-4)}`;

        const res = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: vaultForm.title.trim(),
            price: Number(vaultForm.price),
            category: vaultForm.category,
            tag: vaultForm.tag,
            sku,
            inventory_quantity: 1,
            description: vaultForm.story.trim(),
            images: formPhotos,
            is_featured: true,
            status: 'published'
          })
        });

        if (res.ok) {
          showNotification(editingItemId ? 'Vault Piece updated!' : 'Vault Piece published to website!', 'success');
          fetchProducts();
          resetActiveForm();
        } else {
          const err = await res.json();
          showNotification(err.error || 'Failed to save Vault Piece', 'error');
        }
      }

      // 2. LOOKBOOK ARCHIVE
      else if (activeSubSection === 'lookbook') {
        const newLook = {
          id: editingItemId || `look_${Date.now()}`,
          title: lookbookForm.title.trim(),
          code: lookbookForm.code.trim(),
          subtitle: lookbookForm.subtitle.trim(),
          caption: lookbookForm.caption.trim(),
          story: lookbookForm.story.trim(),
          materials: lookbookForm.materials.trim(),
          image: formPhotos[0],
          altImages: formPhotos.slice(1)
        };

        setLookbookEntriesList(prev => {
          if (editingItemId) return prev.map(x => x.id === editingItemId ? newLook : x);
          return [newLook, ...prev];
        });
        showNotification(editingItemId ? 'Lookbook entry updated!' : 'Published to Lookbook Archive!', 'success');
        resetActiveForm();
      }

      // 3. KEY PIECES
      else if (activeSubSection === 'key_pieces') {
        const endpoint = editingItemId ? `/api/admin/products/${editingItemId}` : '/api/admin/products';
        const method = editingItemId ? 'PUT' : 'POST';
        const sku = `AVZ-KEY-${Date.now().toString().slice(-4)}`;

        const res = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: keyPieceForm.title.trim(),
            price: Number(keyPieceForm.price),
            category: keyPieceForm.category,
            tag: keyPieceForm.tag,
            sku,
            inventory_quantity: 1,
            description: keyPieceForm.description.trim(),
            images: formPhotos,
            custom_made: true,
            status: 'published'
          })
        });

        if (res.ok) {
          showNotification(editingItemId ? 'Key Piece updated!' : 'Published to Key Pieces!', 'success');
          fetchProducts();
          resetActiveForm();
        } else {
          const err = await res.json();
          showNotification(err.error || 'Failed to save Key Piece', 'error');
        }
      }

      // 4. COLLECTION ARCHIVE
      else if (activeSubSection === 'collection') {
        const endpoint = editingItemId ? `/api/admin/products/${editingItemId}` : '/api/admin/products';
        const method = editingItemId ? 'PUT' : 'POST';
        const autoSku = collectionForm.sku.trim() || `AVZ-${collectionForm.category.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;

        const res = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: collectionForm.name.trim(),
            price: Number(collectionForm.price),
            category: collectionForm.category,
            inventory_quantity: Number(collectionForm.stock) || 1,
            sku: autoSku,
            description: collectionForm.description.trim(),
            images: formPhotos, // MULTIPLE PICTURES ARRAY
            sizes: collectionForm.sizes && collectionForm.sizes.length > 0 ? collectionForm.sizes : ['One Size (Adjustable)'],
            status: 'published'
          })
        });

        if (res.ok) {
          showNotification(editingItemId ? 'Collection product updated!' : 'Published to Collection Archive!', 'success');
          fetchProducts();
          onRefreshProducts?.();
          resetActiveForm();
        } else {
          const err = await res.json();
          showNotification(err.error || 'Failed to save Collection Product', 'error');
        }
      }

      // 5. THE ARCHIVE GALLERY
      else if (activeSubSection === 'archive_gallery') {
        const endpoint = editingItemId ? `/api/admin/gallery/${editingItemId}` : '/api/admin/gallery';
        const method = editingItemId ? 'PUT' : 'POST';

        const res = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: museumForm.title.trim(),
            artist: museumForm.artist.trim(),
            image_url: formPhotos[0],
            thumbnail_url: formPhotos[0],
            year: museumForm.year.trim(),
            category: museumForm.category.trim(),
            frame_style: museumForm.frame_style,
            aspect_ratio: '3:4',
            description: museumForm.description.trim(),
            metadata: {
              dimensions_cm: museumForm.dimensions_cm
            }
          })
        });

        if (res.ok) {
          showNotification(editingItemId ? 'Gallery Artwork updated!' : 'Published to Archive Gallery!', 'success');
          fetchMuseum();
          resetActiveForm();
        } else {
          const err = await res.json();
          showNotification(err.error || 'Failed to save Artwork', 'error');
        }
      }
    } catch {
      showNotification('Network error saving section item', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean filtered master media assets (clean images only, zero clutter tags)
  const cleanFilteredAssets = useMemo(() => {
    const q = mediaSearch.toLowerCase().trim();
    if (!q) return mediaAssets;
    return mediaAssets.filter(asset =>
      (asset.title && asset.title.toLowerCase().includes(q)) ||
      (asset.url && asset.url.toLowerCase().includes(q))
    );
  }, [mediaAssets, mediaSearch]);

  // Paginated Collection Archive
  const paginatedCollection = useMemo(() => {
    let list = collectionProducts;
    if (collectionFilter !== 'All') {
      list = list.filter(p => p.category === collectionFilter);
    }
    if (collectionSearch.trim()) {
      const q = collectionSearch.toLowerCase().trim();
      list = list.filter(p =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q))
      );
    }
    const startIndex = (collectionPage - 1) * ITEMS_PER_PAGE;
    return {
      total: list.length,
      totalPages: Math.ceil(list.length / ITEMS_PER_PAGE) || 1,
      items: list.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    };
  }, [collectionProducts, collectionFilter, collectionSearch, collectionPage]);

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-24 text-left">
      {/* ========================================================================= */}
      {/* SECTION 1: MASTER MEDIA UPLOAD & PHOTO POOL (Clean: Images Only)         */}
      {/* ========================================================================= */}
      <section className="bg-[#0e0915] border border-pink/25 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-pink/20 border border-pink/40 flex items-center justify-center font-cinzel font-bold text-pink text-sm">
                1
              </span>
              <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-white tracking-wide">
                Master Media Upload
              </h2>
            </div>
            <p className="text-xs text-neutral-400 mt-1 font-mono pl-11">
              Upload all raw photos here first. Click any photo to use in website sections below, or delete unwanted photos.
            </p>
          </div>

          {/* Action Row: Upload Button & Search */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={mediaSearch}
                onChange={(e) => setMediaSearch(e.target.value)}
                placeholder="Search photos..."
                className="w-full bg-[#181124] border border-white/10 text-white text-xs pl-8 pr-7 py-2.5 rounded-xl font-mono focus:outline-none focus:border-pink"
              />
              {mediaSearch && (
                <button
                  onClick={() => setMediaSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink to-purple-600 hover:opacity-90 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shrink-0 transition-all active:scale-95">
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Uploading...' : 'Upload Photos'}</span>
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
        </div>

        {/* Clean Photos Grid (No tag buttons, no tag pills — Pure Clean Image Gallery) */}
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-3 px-1">
          <span>{cleanFilteredAssets.length} Photos in Vault</span>
          {formPhotos.length > 0 && (
            <span className="text-pink font-bold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> {formPhotos.length} photo{formPhotos.length > 1 ? 's' : ''} attached to Section 2 below
            </span>
          )}
        </div>

        {loadingMedia ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <RefreshCw className="w-8 h-8 text-pink animate-spin mb-3" />
            <p className="text-xs font-mono text-neutral-400">Loading photos...</p>
          </div>
        ) : cleanFilteredAssets.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl bg-[#140e1c]">
            <ImageIcon className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm font-cinzel text-neutral-300">No photos found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {cleanFilteredAssets.map((asset) => {
              const isAttached = formPhotos.includes(asset.url);
              return (
                <div
                  key={asset.id}
                  className={`group relative bg-[#130d1d] border rounded-2xl overflow-hidden transition-all flex flex-col justify-between ${
                    isAttached
                      ? 'border-pink ring-2 ring-pink/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                      : 'border-white/10 hover:border-pink/40'
                  }`}
                >
                  {/* Image View */}
                  <div
                    onClick={() => handleAddPhotoToForm(asset.url)}
                    className="aspect-square bg-black/90 relative overflow-hidden cursor-pointer"
                  >
                    <img
                      src={asset.url}
                      alt={asset.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {isAttached && (
                      <div className="absolute top-2 right-2 z-10">
                        <span className="w-5 h-5 rounded-full bg-pink text-black flex items-center justify-center font-bold text-xs shadow-lg">
                          ✓
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="p-2 flex items-center justify-between border-t border-white/10 bg-[#130d1d]">
                    <button
                      onClick={() => handleQuickUseFromPool(asset)}
                      className={`text-[9px] font-mono font-bold uppercase px-2 py-1 rounded-lg transition-all cursor-pointer ${
                        isAttached
                          ? 'bg-pink text-black'
                          : 'bg-white/10 text-white hover:bg-pink hover:text-black'
                      }`}
                    >
                      {isAttached ? 'Attached' : '+ Use'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(asset.url);
                          showNotification('URL copied', 'success');
                        }}
                        className="p-1 text-neutral-400 hover:text-white"
                        title="Copy image URL"
                      >
                        <Copy className="w-3 h-3" />
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => setConfirmDeleteAsset(asset)}
                        disabled={deletingId === asset.id}
                        className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded transition-colors"
                        title="Delete photo permanently"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: UPLOAD & ASSIGN TO WEBSITE SECTIONS (Completely Separate)     */}
      {/* Sub-sections:                                                             */}
      {/* 1. The Vault Pieces                                                       */}
      {/* 2. Lookbook Archive                                                       */}
      {/* 3. Key Pieces                                                             */}
      {/* 4. Collection Archive                                                     */}
      {/* 5. The Archive Gallery                                                    */}
      {/* ========================================================================= */}
      <section ref={section2Ref} className="bg-[#0e0915] border border-pink/25 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Section Header */}
        <div className="border-b border-white/10 pb-5 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-pink/20 border border-pink/40 flex items-center justify-center font-cinzel font-bold text-pink text-sm">
                2
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-white tracking-wide">
                  Publish to Website Sections
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5 font-mono">
                  Select website section, attach one or multiple pictures, and put down the specific details.
                </p>
              </div>
            </div>

            {editingItemId && (
              <button
                onClick={resetActiveForm}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer hover:bg-amber-500/25"
              >
                <span>Editing Mode Active • Click to Cancel</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 5 Exact Sub-Sections Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-6">
            {[
              { id: 'vault', label: '1. The Vault Pieces', icon: Sparkles, desc: '#vault rail' },
              { id: 'lookbook', label: '2. Lookbook Archive', icon: BookOpen, desc: '#lookbook drift' },
              { id: 'key_pieces', label: '3. Key Pieces', icon: Star, desc: 'Key statements' },
              { id: 'collection', label: '4. Collection Archive', icon: ShoppingBag, desc: '#shop catalogue' },
              { id: 'archive_gallery', label: '5. The Archive Gallery', icon: Palette, desc: '#museum exhibition' }
            ].map((sub) => {
              const Icon = sub.icon;
              const isActive = activeSubSection === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    setActiveSubSection(sub.id as any);
                    resetActiveForm();
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-gradient-to-br from-pink/25 via-[#23122c] to-[#120a1c] border-pink text-white shadow-lg ring-1 ring-pink/50'
                      : 'bg-[#140e1c] border-white/10 hover:border-white/25 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-cinzel text-xs font-bold uppercase tracking-wider">{sub.label}</span>
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-pink' : 'text-neutral-500'}`} />
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">{sub.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 2 WORKBENCH: Multi-Photo Attacher + Details Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-10">
          {/* Multi-Photo Frame Selector (5 Cols) */}
          <div className="lg:col-span-5 bg-[#140e1c] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase text-neutral-400 font-bold tracking-wider">
                Product Photos ({formPhotos.length})
              </span>
              <button
                onClick={() => setPickerModalOpen(true)}
                className="text-xs font-mono text-pink hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add from Media Pool</span>
              </button>
            </div>

            {/* Photos Strip with Primary Cover and Alternate Angles */}
            {formPhotos.length === 0 ? (
              <div
                onClick={() => setPickerModalOpen(true)}
                className="aspect-[4/3] w-full rounded-2xl border-2 border-dashed border-white/20 hover:border-pink bg-black/40 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-pink transition-all">
                  <ImageIcon className="w-6 h-6 text-neutral-400 group-hover:text-pink" />
                </div>
                <span className="text-xs font-cinzel font-bold text-white mb-1">No Photos Attached</span>
                <span className="text-[10px] font-mono text-neutral-400">
                  Click to select one or multiple photos from Section 1 above
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Primary Cover Image */}
                <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black border border-pink/50 relative shadow-2xl">
                  <img src={formPhotos[0]} alt="Primary Shot" className="w-full h-full object-cover" />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-pink text-black text-[9px] font-mono uppercase font-bold shadow-md">
                      PRIMARY COVER SHOT
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemovePhotoFromForm(formPhotos[0])}
                    className="absolute top-2.5 right-2.5 p-1 rounded-full bg-black/80 hover:bg-red-600 text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Additional Multi-Angle Thumbnails */}
                {formPhotos.length > 1 && (
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 block mb-1.5 uppercase">
                      Additional Angle Shots ({formPhotos.length - 1}):
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {formPhotos.slice(1).map((photoUrl, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-black border border-white/15 group">
                          <img src={photoUrl} alt={`Shot ${idx + 2}`} className="w-full h-full object-cover" />
                          <div className="absolute bottom-1 left-1">
                            <span className="px-1 py-0.2 rounded bg-black/80 text-[8px] font-mono text-neutral-300">
                              #{idx + 2}
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemovePhotoFromForm(photoUrl)}
                            className="absolute top-1 right-1 p-0.5 rounded-full bg-black/80 hover:bg-red-600 text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Details Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#140e1c] border border-white/10 rounded-2xl p-5 sm:p-6">
            <form onSubmit={handleSaveItem} className="space-y-4">
              {/* SUB-SECTION 1: THE VAULT PIECES */}
              {activeSubSection === 'vault' && (
                <>
                  <div className="border-b border-white/10 pb-3 mb-3">
                    <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink" />
                      <span>{editingItemId ? 'Edit Vault Piece' : 'Publish to The Vault Pieces (#vault)'}</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">Piece Title *</label>
                      <input
                        type="text"
                        required
                        value={vaultForm.title}
                        onChange={(e) => setVaultForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Cyberpunk Spikeria Bralette"
                        className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">Price (INR ₹) *</label>
                      <input
                        type="number"
                        required
                        value={vaultForm.price}
                        onChange={(e) => setVaultForm(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="3800"
                        className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">Badge Tag</label>
                      <select
                        value={vaultForm.tag}
                        onChange={(e) => setVaultForm(prev => ({ ...prev, tag: e.target.value }))}
                        className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                      >
                        <option value="1 OF 1">1 OF 1</option>
                        <option value="VAULT EXCLUSIVE">VAULT EXCLUSIVE</option>
                        <option value="BEST SELLER">BEST SELLER</option>
                        <option value="CORE STATEMENT">CORE STATEMENT</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">Category</label>
                      <select
                        value={vaultForm.category}
                        onChange={(e) => setVaultForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                      >
                        {SHOP_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">Studio Story / Description</label>
                    <textarea
                      rows={2}
                      value={vaultForm.story}
                      onChange={(e) => setVaultForm(prev => ({ ...prev, story: e.target.value }))}
                      className="w-full bg-[#1b1325] border border-white/15 rounded-xl p-3 text-xs text-white font-mono focus:border-pink focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* SUB-SECTION 2: LOOKBOOK ARCHIVE */}
              {activeSubSection === 'lookbook' && (
                <>
                  <div className="border-b border-white/10 pb-3 mb-3">
                    <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-pink" />
                      <span>{editingItemId ? 'Edit Lookbook Entry' : 'Publish to Lookbook Archive (#lookbook)'}</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">Look Title *</label>
                      <input
                        type="text"
                        required
                        value={lookbookForm.title}
                        onChange={(e) => setLookbookForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Sculptural Armor in Motion"
                        className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">Editorial Code / Subtitle</label>
                      <input
                        type="text"
                        value={lookbookForm.code}
                        onChange={(e) => setLookbookForm(prev => ({ ...prev, code: e.target.value }))}
                        placeholder="LOOK 001 • SCULPTURAL ARMOR"
                        className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">Runway Caption & Story</label>
                    <textarea
                      rows={2}
                      value={lookbookForm.caption}
                      onChange={(e) => setLookbookForm(prev => ({ ...prev, caption: e.target.value }))}
                      placeholder="Model styled in Spikeria Bra and Apex Cuffs..."
                      className="w-full bg-[#1b1325] border border-white/15 rounded-xl p-3 text-xs text-white font-mono focus:border-pink focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">Materials Used</label>
                    <input
                      type="text"
                      value={lookbookForm.materials}
                      onChange={(e) => setLookbookForm(prev => ({ ...prev, materials: e.target.value }))}
                      placeholder="Reclaimed Metals, Stainless Chains, Hand-Set Spikes"
                      className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* SUB-SECTION 3: KEY PIECES */}
              {activeSubSection === 'key_pieces' && (
                <>
                  <div className="border-b border-white/10 pb-3 mb-3">
                    <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                      <Star className="w-4 h-4 text-pink" />
                      <span>{editingItemId ? 'Edit Key Piece' : 'Publish to Key Pieces'}</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">Piece Title *</label>
                      <input
                        type="text"
                        required
                        value={keyPieceForm.title}
                        onChange={(e) => setKeyPieceForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Spiral Body Chainmail Top"
                        className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">Price (INR ₹) *</label>
                      <input
                        type="number"
                        required
                        value={keyPieceForm.price}
                        onChange={(e) => setKeyPieceForm(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="3200"
                        className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">Category</label>
                      <select
                        value={keyPieceForm.category}
                        onChange={(e) => setKeyPieceForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                      >
                        {SHOP_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={keyPieceForm.tag}
                        onChange={(e) => setKeyPieceForm(prev => ({ ...prev, tag: e.target.value }))}
                        placeholder="KEY PIECE"
                        className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">Craft Description</label>
                    <textarea
                      rows={2}
                      value={keyPieceForm.description}
                      onChange={(e) => setKeyPieceForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-[#1b1325] border border-white/15 rounded-xl p-3 text-xs text-white font-mono focus:border-pink focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* SUB-SECTION 4: COLLECTION ARCHIVE */}
              {activeSubSection === 'collection' && (
                <>
                  <div className="border-b border-white/10 pb-3 mb-3">
                    <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-pink" />
                      <span>{editingItemId ? 'Edit Collection Product' : 'Publish to Collection Archive (#shop)'}</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">Product Name *</label>
                      <input
                        type="text"
                        required
                        value={collectionForm.name}
                        onChange={(e) => setCollectionForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Acid-Wash Hardware Cargo Skirt"
                        className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">Price (INR ₹) *</label>
                      <input
                        type="number"
                        required
                        value={collectionForm.price}
                        onChange={(e) => setCollectionForm(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="2500"
                        className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">Category</label>
                      <select
                        value={collectionForm.category}
                        onChange={(e) => setCollectionForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                      >
                        {SHOP_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">Stock (1 for 1-of-1)</label>
                      <input
                        type="number"
                        value={collectionForm.stock}
                        onChange={(e) => setCollectionForm(prev => ({ ...prev, stock: e.target.value }))}
                        placeholder="1"
                        className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">Product Craft Story</label>
                    <textarea
                      rows={2}
                      value={collectionForm.description}
                      onChange={(e) => setCollectionForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-[#1b1325] border border-white/15 rounded-xl p-3 text-xs text-white font-mono focus:border-pink focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* SUB-SECTION 5: THE ARCHIVE GALLERY */}
              {activeSubSection === 'archive_gallery' && (
                <>
                  <div className="border-b border-white/10 pb-3 mb-3">
                    <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                      <Palette className="w-4 h-4 text-pink" />
                      <span>{editingItemId ? 'Edit Gallery Artwork' : 'Publish to The Archive Gallery (#museum)'}</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">Artwork Title *</label>
                      <input
                        type="text"
                        required
                        value={museumForm.title}
                        onChange={(e) => setMuseumForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Portrait of the Cyber Empress"
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
                        {FRAME_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">Artist Name</label>
                      <input
                        type="text"
                        value={museumForm.artist}
                        onChange={(e) => setMuseumForm(prev => ({ ...prev, artist: e.target.value }))}
                        className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">Dimensions</label>
                      <input
                        type="text"
                        value={museumForm.dimensions_cm}
                        onChange={(e) => setMuseumForm(prev => ({ ...prev, dimensions_cm: e.target.value }))}
                        className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">Curatorial Description</label>
                    <textarea
                      rows={2}
                      value={museumForm.description}
                      onChange={(e) => setMuseumForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-[#1b1325] border border-white/15 rounded-xl p-3 text-xs text-white font-mono focus:border-pink focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || formPhotos.length === 0}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink to-purple-600 hover:opacity-90 disabled:opacity-50 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Saving...'
                      : editingItemId
                      ? 'Update Item on Website'
                      : 'Publish to Website Section'}
                  </span>
                </button>

                {editingItemId && (
                  <button
                    type="button"
                    onClick={resetActiveForm}
                    className="py-3 px-4 rounded-xl border border-white/20 text-neutral-300 font-mono text-xs hover:bg-white/10"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CURRENTLY PUBLISHED SECTION ITEMS (VISIBLE AS A WHOLE, EDITABLE & DELETABLE)*/}
        {/* ========================================================================= */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-pink" />
                <span>
                  Currently Published in{' '}
                  {activeSubSection === 'vault'
                    ? 'The Vault Pieces'
                    : activeSubSection === 'lookbook'
                    ? 'Lookbook Archive'
                    : activeSubSection === 'key_pieces'
                    ? 'Key Pieces'
                    : activeSubSection === 'collection'
                    ? 'Collection Archive'
                    : 'The Archive Gallery'}
                </span>
              </h3>
              <p className="text-xs font-mono text-neutral-400 mt-1">
                Visible as a whole. Click Edit to load details into the form above, or click Delete to unpublish.
              </p>
            </div>

            {/* Filter bar for Collection Archive */}
            {activeSubSection === 'collection' && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={collectionFilter}
                  onChange={(e) => {
                    setCollectionFilter(e.target.value);
                    setCollectionPage(1);
                  }}
                  className="bg-[#1b1325] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-pink focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  {SHOP_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <input
                  type="text"
                  value={collectionSearch}
                  onChange={(e) => {
                    setCollectionSearch(e.target.value);
                    setCollectionPage(1);
                  }}
                  placeholder="Search products..."
                  className="bg-[#1b1325] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-pink focus:outline-none w-36 sm:w-44"
                />
              </div>
            )}
          </div>

          {/* 1. THE VAULT PIECES GRID */}
          {activeSubSection === 'vault' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {vaultPieces.map((piece) => (
                <div key={piece.id} className="bg-[#130d1d] border border-white/10 hover:border-pink/40 rounded-2xl overflow-hidden group flex flex-col justify-between">
                  <div className="aspect-[3/4] bg-black relative overflow-hidden">
                    <img
                      src={Array.isArray(piece.images) ? piece.images[0] : piece.image}
                      alt={piece.name || piece.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-full bg-pink-950/90 border border-pink-500/70 text-[9px] font-mono text-pink-200 uppercase font-bold">
                        {piece.tag || 'VAULT'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="text-xs font-bold text-white truncate">{piece.name || piece.title}</h4>
                      <span className="text-xs font-mono font-bold text-pink block mt-1">₹{piece.price}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-white/10 mt-3">
                      <button
                        onClick={() => handleStartEdit('vault', piece)}
                        className="text-[10px] font-mono font-bold text-neutral-300 hover:text-pink flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => setConfirmDeleteItem({ type: 'vault', item: piece })}
                        className="text-[10px] font-mono text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. LOOKBOOK ARCHIVE GRID */}
          {activeSubSection === 'lookbook' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {lookbookEntriesList.map((entry) => (
                <div key={entry.id} className="bg-[#130d1d] border border-white/10 hover:border-pink/40 rounded-2xl overflow-hidden group flex flex-col justify-between">
                  <div className="aspect-[3/4] bg-black relative overflow-hidden">
                    <img
                      src={entry.image}
                      alt={entry.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-full bg-black/85 border border-white/20 text-[8px] font-mono text-white uppercase">
                        {entry.code || 'LOOK'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="text-xs font-bold text-white truncate">{entry.title}</h4>
                      <p className="text-[10px] font-mono text-neutral-400 truncate mt-1">{entry.caption}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-white/10 mt-3">
                      <button
                        onClick={() => handleStartEdit('lookbook', entry)}
                        className="text-[10px] font-mono font-bold text-neutral-300 hover:text-pink flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => setConfirmDeleteItem({ type: 'lookbook', item: entry })}
                        className="text-[10px] font-mono text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3. KEY PIECES GRID */}
          {activeSubSection === 'key_pieces' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {keyPiecesList.map((piece) => (
                <div key={piece.id} className="bg-[#130d1d] border border-white/10 hover:border-pink/40 rounded-2xl overflow-hidden group flex flex-col justify-between">
                  <div className="aspect-[3/4] bg-black relative overflow-hidden">
                    <img
                      src={Array.isArray(piece.images) ? piece.images[0] : piece.image}
                      alt={piece.name || piece.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-full bg-purple-950/90 border border-purple-500/70 text-[9px] font-mono text-purple-200 uppercase font-bold">
                        {piece.tag || 'KEY PIECE'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="text-xs font-bold text-white truncate">{piece.name || piece.title}</h4>
                      <span className="text-xs font-mono font-bold text-pink block mt-1">₹{piece.price}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-white/10 mt-3">
                      <button
                        onClick={() => handleStartEdit('key_pieces', piece)}
                        className="text-[10px] font-mono font-bold text-neutral-300 hover:text-pink flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => setConfirmDeleteItem({ type: 'key_pieces', item: piece })}
                        className="text-[10px] font-mono text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. COLLECTION ARCHIVE (Visible as a Whole with Pagination) */}
          {activeSubSection === 'collection' && (
            <div>
              <div className="text-xs font-mono text-neutral-400 mb-3">
                Showing {paginatedCollection.items.length} of {paginatedCollection.total} products in Collection Archive
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {paginatedCollection.items.map((prod) => {
                  const shotCount = Array.isArray(prod.images) ? prod.images.length : 1;
                  return (
                    <div key={prod.id} className="bg-[#130d1d] border border-white/10 hover:border-pink/40 rounded-2xl overflow-hidden group flex flex-col justify-between">
                      <div className="aspect-[3/4] bg-black relative overflow-hidden">
                        <img
                          src={Array.isArray(prod.images) ? prod.images[0] : prod.image}
                          alt={prod.name || prod.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="px-1.5 py-0.5 rounded-full bg-black/85 border border-white/20 text-[8px] font-mono text-white uppercase">
                            {prod.category}
                          </span>
                        </div>
                        {shotCount > 1 && (
                          <div className="absolute top-2 right-2">
                            <span className="px-1.5 py-0.5 rounded-full bg-pink text-black text-[8px] font-mono font-bold">
                              {shotCount} SHOTS
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-2.5 flex flex-col justify-between flex-1">
                        <div>
                          <h4 className="text-[11px] font-bold text-white truncate">{prod.title || prod.name}</h4>
                          <span className="text-xs font-mono font-bold text-pink block mt-0.5">₹{prod.price}</span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-2.5">
                          <button
                            onClick={() => handleStartEdit('collection', prod)}
                            className="text-[9px] font-mono font-bold text-neutral-300 hover:text-pink flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-2.5 h-2.5" /> Edit
                          </button>
                          <button
                            onClick={() => setConfirmDeleteItem({ type: 'collection', item: prod })}
                            className="text-[9px] font-mono text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-2.5 h-2.5" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {paginatedCollection.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    disabled={collectionPage <= 1}
                    onClick={() => setCollectionPage(p => p - 1)}
                    className="px-3 py-1.5 rounded-xl border border-white/20 text-xs font-mono text-white disabled:opacity-30 cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-mono text-neutral-400 px-3">
                    Page {collectionPage} of {paginatedCollection.totalPages}
                  </span>
                  <button
                    disabled={collectionPage >= paginatedCollection.totalPages}
                    onClick={() => setCollectionPage(p => p + 1)}
                    className="px-3 py-1.5 rounded-xl border border-white/20 text-xs font-mono text-white disabled:opacity-30 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 5. THE ARCHIVE GALLERY (MUSEUM WALL - Full Grid, Visible as a Whole) */}
          {activeSubSection === 'archive_gallery' && (
            <div>
              <div className="text-xs font-mono text-neutral-400 mb-3">
                Showing all {museumArtworks.length} artworks in The Archive Gallery (no scrollers)
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {museumArtworks.map((art) => (
                  <div key={art.id} className="bg-[#130d1d] border border-white/10 hover:border-pink/40 rounded-2xl overflow-hidden group flex flex-col justify-between">
                    <div className="aspect-[3/4] bg-black relative overflow-hidden">
                      <img
                        src={art.image_url}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="px-1.5 py-0.5 rounded-full bg-black/85 border border-white/20 text-[8px] font-mono text-pink uppercase">
                          {art.frame_style?.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 flex flex-col justify-between flex-1">
                      <div>
                        <h4 className="text-[11px] font-bold text-white truncate">{art.title}</h4>
                        <span className="text-[9px] font-mono text-neutral-400 block mt-0.5 truncate">{art.year} • {art.artist}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-2.5">
                        <button
                          onClick={() => handleStartEdit('archive_gallery', art)}
                          className="text-[9px] font-mono font-bold text-neutral-300 hover:text-pink flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-2.5 h-2.5" /> Edit
                        </button>
                        <button
                          onClick={() => setConfirmDeleteItem({ type: 'archive_gallery', item: art })}
                          className="text-[9px] font-mono text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-2.5 h-2.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* QUICK MULTI-PHOTO PICKER MODAL (Add Photos from Section 1 Pool)           */}
      {/* ========================================================================= */}
      {pickerModalOpen && (
        <div
          onClick={() => setPickerModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-[#120b1c] border border-pink/30 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh]"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white">Select Photos from Media Pool</h3>
                <p className="text-xs font-mono text-neutral-400 mt-0.5">Click any photo to attach it to the current product/piece</p>
              </div>
              <button
                onClick={() => setPickerModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                placeholder="Search photos..."
                className="w-full bg-[#1b1325] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
              />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {mediaAssets
                .filter(a => !pickerSearch || a.title?.toLowerCase().includes(pickerSearch.toLowerCase()) || a.url?.toLowerCase().includes(pickerSearch.toLowerCase()))
                .map(asset => {
                  const isAttached = formPhotos.includes(asset.url);
                  return (
                    <button
                      key={asset.id}
                      onClick={() => handleAddPhotoToForm(asset.url)}
                      className={`group relative aspect-square rounded-xl overflow-hidden border transition-all text-left bg-black cursor-pointer ${
                        isAttached ? 'border-pink ring-2 ring-pink' : 'border-white/10 hover:border-pink'
                      }`}
                    >
                      <img src={asset.url} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      {isAttached && (
                        <div className="absolute top-1.5 right-1.5">
                          <span className="w-4 h-4 rounded-full bg-pink text-black flex items-center justify-center font-bold text-[10px]">
                            ✓
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
            </div>

            <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-400">{formPhotos.length} photos currently attached</span>
              <button
                onClick={() => setPickerModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-pink text-black font-mono font-bold text-xs uppercase cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL (Section 1 Photo or Section 2 Item)            */}
      {/* ========================================================================= */}
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
              Are you sure you want to delete <span className="text-white font-bold">"{confirmDeleteAsset.title}"</span>? This will permanently delete it from the master photo vault.
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
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Item from Website Section Confirmation Modal */}
      {confirmDeleteItem && (
        <div
          onClick={() => setConfirmDeleteItem(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#140b1a] border border-red-500/40 rounded-3xl p-6 shadow-2xl text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-500/50 flex items-center justify-center mx-auto mb-4 text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="font-cinzel text-lg font-bold text-white mb-2">Remove Item from Website?</h3>
            <p className="text-xs font-mono text-neutral-300 mb-4 leading-relaxed">
              Are you sure you want to unpublish and delete{' '}
              <span className="text-white font-bold">"{confirmDeleteItem.item.title || confirmDeleteItem.item.name}"</span>?
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setConfirmDeleteItem(null)}
                className="px-5 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-xs font-mono text-neutral-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs uppercase cursor-pointer transition-all shadow-lg shadow-red-900/40"
              >
                Yes, Remove Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
