export interface GalleryArtwork {
  id: string;
  title: string;
  artist: string;
  image_url: string;
  thumbnail_url?: string;
  description: string;
  year: string;
  category: string;
  frame_style: string;
  aspect_ratio: string;
  width_px: number;
  height_px: number;
  display_order: number;
  is_published: number;
  metadata: {
    medium?: string;
    dimensions_cm?: string;
    provenance?: string;
    hanging_bracket?: string;
    wall_position?: string;
    sconce_light?: boolean;
    object_position?: string;
    [key: string]: any;
  };
}

export const INITIAL_GALLERY_ARTWORKS: GalleryArtwork[] = [
  {
    "id": "art-01",
    "title": "Cyberpunk Spiked Denim Corset",
    "artist": "Dhrisni & AVZ Studio",
    "image_url": "/assets/museum/museum_piece_01.webp",
    "thumbnail_url": "/assets/museum/museum_piece_01.webp",
    "description": "Custom sculpted bodice with high-tensile eyelets and brutalist chrome spikes engineered directly into reinforced denim ribs. Built for dark techno rooms and high-stakes runway.",
    "year": "2024-2026",
    "category": "Defensive Haute Couture",
    "frame_style": "ornate_baroque",
    "aspect_ratio": "2:3",
    "width_px": 340,
    "height_px": 510,
    "display_order": 1,
    "is_published": 1,
    "metadata": {
      "medium": "Deconstructed raw 14oz denim, 48 industrial chrome cone spikes, boned corset armature",
      "dimensions_cm": "Bust 32-35\" / Custom Laced",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "brass_chains",
      "wall_position": "center",
      "sconce_light": true,
      "object_position": "center center"
    }
  },
  {
    "id": "art-02",
    "title": "Fluid Stainless Chainmail Cowl",
    "artist": "Studio Guild & Dhrisni",
    "image_url": "/assets/museum/museum_piece_02.webp",
    "thumbnail_url": "/assets/museum/museum_piece_02.webp",
    "description": "Over 1,800 rings linked by hand ring-by-ring in our Studio. Cold to the touch, heavy in your hands, cascading across collarbones like shimmering mercury.",
    "year": "2024-2026",
    "category": "Fluid Armor",
    "frame_style": "gilded_rococo",
    "aspect_ratio": "2:3",
    "width_px": 340,
    "height_px": 510,
    "display_order": 2,
    "is_published": 1,
    "metadata": {
      "medium": "1,800 surgical stainless steel rings, hand-knit liquid drape, heavy toggle clasps",
      "dimensions_cm": "Torso Wrap / Fluid Drape",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "wire",
      "wall_position": "center",
      "sconce_light": false,
      "object_position": "center center"
    }
  },
  {
    "id": "art-04",
    "title": "Subcultural Spiked Spine Harness",
    "artist": "AVZ Studio",
    "image_url": "/assets/museum/museum_piece_04.webp",
    "thumbnail_url": "/assets/museum/museum_piece_04.webp",
    "description": "An aggressive silhouette traced along the spine. Articulated alloy spikes flex with torso motion while heavy chrome rings anchor the load.",
    "year": "2024-2026",
    "category": "Hardware Intimates",
    "frame_style": "antique_fillet",
    "aspect_ratio": "3:4",
    "width_px": 360,
    "height_px": 479,
    "display_order": 3,
    "is_published": 1,
    "metadata": {
      "medium": "Hand-dyed bridle leather, lathe-turned alloy spikes, chrome O-rings",
      "dimensions_cm": "Fully Adjustable Modular Straps",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "brass_chains",
      "wall_position": "center",
      "sconce_light": false,
      "object_position": "center center"
    }
  },
  {
    "id": "art-05",
    "title": "Reclaimed Sculptural Chainmail Bodice",
    "artist": "Dhrisni & Studio Guild",
    "image_url": "/assets/museum/museum_piece_05.webp",
    "thumbnail_url": "/assets/museum/museum_piece_05.webp",
    "description": "Hand-linked stainless steel rings and cold-forged industrial spikes sculpted to body contours.",
    "year": "2024-2026",
    "category": "Wearable Hardware",
    "frame_style": "classical_cavetto",
    "aspect_ratio": "3:4",
    "width_px": 360,
    "height_px": 480,
    "display_order": 4,
    "is_published": 1,
    "metadata": {
      "medium": "Hand-cut metallic mesh, golden wire pathways, genuine leather backing",
      "dimensions_cm": "Bust 34A-36B",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "wire",
      "wall_position": "center",
      "sconce_light": true,
      "object_position": "center center"
    }
  },
  {
    "id": "art-06",
    "title": "Gothic Architectural Shard Bodice",
    "artist": "Dhrisni",
    "image_url": "/assets/museum/museum_piece_06.webp",
    "thumbnail_url": "/assets/museum/museum_piece_06.webp",
    "description": "Faceted metal plates angled to bounce strobe light and club beams. An intimidating wearable exoskeleton constructed for AVZ underground salons.",
    "year": "2024-2026",
    "category": "Sculptural Armory",
    "frame_style": "tarnished_brass",
    "aspect_ratio": "2:3",
    "width_px": 340,
    "height_px": 510,
    "display_order": 5,
    "is_published": 1,
    "metadata": {
      "medium": "Laser-scored aluminum shards, rivet reinforcements, structured denim ribcage",
      "dimensions_cm": "Bust 32-34\"",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "hidden",
      "wall_position": "center",
      "sconce_light": false,
      "object_position": "center center"
    }
  },
  {
    "id": "art-09",
    "title": "Pierced Chrome Eyelet Bustier",
    "artist": "Dhrisni",
    "image_url": "/assets/museum/museum_piece_09.webp",
    "thumbnail_url": "/assets/museum/museum_piece_09.webp",
    "description": "Punctuated by over a hundred nickel-free chrome eyelets that catch the light from every angle. Back lacing allows micro-adjustments.",
    "year": "2024-2026",
    "category": "Hardware Intimates",
    "frame_style": "florentine_gold",
    "aspect_ratio": "2:3",
    "width_px": 340,
    "height_px": 510,
    "display_order": 6,
    "is_published": 1,
    "metadata": {
      "medium": "Black rigid denim, 120 silver eyelets, aircraft steel cable corset lace",
      "dimensions_cm": "Bust 30-34\" Adjustable",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "hidden",
      "wall_position": "center",
      "sconce_light": true,
      "object_position": "center center"
    }
  },
  {
    "id": "art-10",
    "title": "Crimson Velvet & Chain Gown Fragment",
    "artist": "Dhrisni",
    "image_url": "/assets/museum/museum_piece_10.webp",
    "thumbnail_url": "/assets/museum/museum_piece_10.webp",
    "description": "A museum study in tension between romantic velvet and cold metallic suspension chains. Conceived for private gallery exhibitions.",
    "year": "2024-2026",
    "category": "Salon Haute Couture",
    "frame_style": "antique_fillet",
    "aspect_ratio": "4:5",
    "width_px": 370,
    "height_px": 463,
    "display_order": 7,
    "is_published": 1,
    "metadata": {
      "medium": "Deep crimson silk velvet, hand-linked brass chains, antique gold embroidery",
      "dimensions_cm": "Full Floor Length",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "brass_chains",
      "wall_position": "center",
      "sconce_light": false,
      "object_position": "center center"
    }
  },
  {
    "id": "art-11",
    "title": "Brutalist Welded Wire Collar",
    "artist": "Studio Guild",
    "image_url": "/assets/museum/museum_piece_11.webp",
    "thumbnail_url": "/assets/museum/museum_piece_11.webp",
    "description": "An imposing architectural neck sculpture that frames the jawline like an avant-garde Elizabethan ruff forged from high-voltage conduit.",
    "year": "2024-2026",
    "category": "Wearable Sculpture",
    "frame_style": "classical_cavetto",
    "aspect_ratio": "2:3",
    "width_px": 340,
    "height_px": 510,
    "display_order": 8,
    "is_published": 1,
    "metadata": {
      "medium": "Cold-bent high-tensile steel wire, brass brazing joints, clear anti-tarnish coat",
      "dimensions_cm": "Neck 13-15\" Collar",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "wire",
      "wall_position": "center",
      "sconce_light": true,
      "object_position": "center center"
    }
  },
  {
    "id": "art-14",
    "title": "Industrial Webbing & Chain Harness",
    "artist": "AVZ Studio",
    "image_url": "/assets/museum/museum_piece_14.webp",
    "thumbnail_url": "/assets/museum/museum_piece_14.webp",
    "description": "Multi-point body harness that distributes physical weight evenly. Fully modular design that pairs over hoodies, jackets, or bare skin.",
    "year": "2024-2026",
    "category": "Rave Hardware",
    "frame_style": "gilded_rococo",
    "aspect_ratio": "2:3",
    "width_px": 340,
    "height_px": 510,
    "display_order": 9,
    "is_published": 1,
    "metadata": {
      "medium": "Military-grade ballistic webbing, welded steel O-rings, swivel snap hooks",
      "dimensions_cm": "Universal Body Harness",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "wire",
      "wall_position": "center",
      "sconce_light": false,
      "object_position": "center center"
    }
  },
  {
    "id": "art-16",
    "title": "AVZ Salon Exhibition Archival Flyer",
    "artist": "AVZ Studio Archive",
    "image_url": "/assets/museum/museum_piece_16.webp",
    "thumbnail_url": "/assets/museum/museum_piece_16.webp",
    "description": "The official curatorial exhibition print documenting the inaugural salon showcase. A collector piece marking the brand inception.",
    "year": "2024-2026",
    "category": "Ephemera & Print Archive",
    "frame_style": "antique_fillet",
    "aspect_ratio": "3:4",
    "width_px": 360,
    "height_px": 466,
    "display_order": 10,
    "is_published": 1,
    "metadata": {
      "medium": "Archival screenprint, vintage textured laid paper, museum mounting",
      "dimensions_cm": "30 × 42 cm Salon Poster",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "brass_chains",
      "wall_position": "center",
      "sconce_light": false,
      "object_position": "center center"
    }
  },
  {
    "id": "art-17",
    "title": "Draped Stainless Mail Halter",
    "artist": "Studio Guild",
    "image_url": "/assets/museum/museum_piece_17.webp",
    "thumbnail_url": "/assets/museum/museum_piece_17.webp",
    "description": "Flowing stainless steel micro-mesh that liquidly drapes over the décolletage. Breathable, hypoallergenic, and impervious to wear.",
    "year": "2024-2026",
    "category": "Fluid Armor",
    "frame_style": "classical_cavetto",
    "aspect_ratio": "2:3",
    "width_px": 340,
    "height_px": 510,
    "display_order": 11,
    "is_published": 1,
    "metadata": {
      "medium": "316L stainless steel chainmail, double lobster claps, neck loop",
      "dimensions_cm": "Chest 32-36\" Fluid Fit",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "wire",
      "wall_position": "center",
      "sconce_light": true,
      "object_position": "center center"
    }
  },
  {
    "id": "art-18",
    "title": "Reworked Vintage Flight Bomber",
    "artist": "Dhrisni",
    "image_url": "/assets/museum/museum_piece_18.webp",
    "thumbnail_url": "/assets/museum/museum_piece_18.webp",
    "description": "Deconstructed surplus flight bomber spliced with industrial zipper teeth along the back seams. Re-proportioned for cropped avant-garde posture.",
    "year": "2024-2026",
    "category": "Upcycled Outerwear",
    "frame_style": "tarnished_brass",
    "aspect_ratio": "2:3",
    "width_px": 340,
    "height_px": 510,
    "display_order": 12,
    "is_published": 1,
    "metadata": {
      "medium": "Military surplus nylon, safety orange lining, reclaimed steel hardware",
      "dimensions_cm": "Chest 40\" Cropped Fit",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "hidden",
      "wall_position": "center",
      "sconce_light": false,
      "object_position": "center center"
    }
  },
  {
    "id": "art-21",
    "title": "Sculptural Shoe-Armor Hybrid Corset",
    "artist": "Dhrisni",
    "image_url": "/assets/museum/museum_piece_21.webp",
    "thumbnail_url": "/assets/museum/museum_piece_21.webp",
    "description": "The infamous AVZ boot-corset made from disassembled combat boots. The steel shanks provide natural boning while speed-lacing wraps the waist.",
    "year": "2024-2026",
    "category": "Defensive Haute Couture",
    "frame_style": "florentine_gold",
    "aspect_ratio": "3:4",
    "width_px": 360,
    "height_px": 479,
    "display_order": 13,
    "is_published": 1,
    "metadata": {
      "medium": "Deconstructed combat boots, heavy leather tongues, speed hooks, steel shanks",
      "dimensions_cm": "Waist 24-27\" Extreme Taper",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "hidden",
      "wall_position": "center",
      "sconce_light": true,
      "object_position": "center center"
    }
  },
  {
    "id": "art-22",
    "title": "Studio Runway Panorama Study",
    "artist": "Dhrisni Studio",
    "image_url": "/assets/museum/museum_piece_22.webp",
    "thumbnail_url": "/assets/museum/museum_piece_22.webp",
    "description": "Panoramic wide-angle study capturing the full studio collection under atmospheric amber spotlights before public unveiling.",
    "year": "2024-2026",
    "category": "Curatorial Archive",
    "frame_style": "antique_fillet",
    "aspect_ratio": "16:9",
    "width_px": 480,
    "height_px": 270,
    "display_order": 14,
    "is_published": 1,
    "metadata": {
      "medium": "C-type photographic master print on archival rag, gilded framing",
      "dimensions_cm": "Panoramic Display",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "brass_chains",
      "wall_position": "center",
      "sconce_light": false,
      "object_position": "center center"
    }
  },
  {
    "id": "art-23",
    "title": "Frost Blue Crochet Armor Top",
    "artist": "Studio Guild",
    "image_url": "/assets/museum/museum_piece_23.webp",
    "thumbnail_url": "/assets/museum/museum_piece_23.webp",
    "description": "Hand-crocheted over 40 intensive hours by the studio women guild. Dense structural knit contrasted by delicate dangling silver bells.",
    "year": "2024-2026",
    "category": "Artisanal Knitwear",
    "frame_style": "classical_cavetto",
    "aspect_ratio": "3:4",
    "width_px": 360,
    "height_px": 480,
    "display_order": 15,
    "is_published": 1,
    "metadata": {
      "medium": "Heavy recycled cotton cord, hand-twisted floral crochet motifs, silver bell charms",
      "dimensions_cm": "Bust 32-36\" Flexible",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "wire",
      "wall_position": "center",
      "sconce_light": true,
      "object_position": "center center"
    }
  },
  {
    "id": "art-25",
    "title": "Pearlite Shimmer Crochet Vest",
    "artist": "Studio Guild",
    "image_url": "/assets/museum/museum_piece_25.webp",
    "thumbnail_url": "/assets/museum/museum_piece_25.webp",
    "description": "Intricate macro-crochet patterning infused with subtle iridescent lurex fibers that illuminate under ultraviolet light.",
    "year": "2024-2026",
    "category": "Artisanal Knitwear",
    "frame_style": "ornate_baroque",
    "aspect_ratio": "2:3",
    "width_px": 340,
    "height_px": 510,
    "display_order": 16,
    "is_published": 1,
    "metadata": {
      "medium": "Metallic lurex threads, off-white raw cotton, pearl bead accents",
      "dimensions_cm": "Chest 34-38\"",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "brass_chains",
      "wall_position": "center",
      "sconce_light": true,
      "object_position": "center center"
    }
  },
  {
    "id": "art-26",
    "title": "Amethyst Jibaro Asymmetric Top",
    "artist": "Dhrisni",
    "image_url": "/assets/museum/museum_piece_26.webp",
    "thumbnail_url": "/assets/museum/museum_piece_26.webp",
    "description": "Rich royal purple canvas draped with dramatic asymmetrical shoulder volume. Raw selvedge edges highlight organic studio craftsmanship.",
    "year": "2024-2026",
    "category": "Avant-Garde Silhouettes",
    "frame_style": "gilded_rococo",
    "aspect_ratio": "3:4",
    "width_px": 360,
    "height_px": 479,
    "display_order": 17,
    "is_published": 1,
    "metadata": {
      "medium": "Hand-dyed purple raw canvas, asymmetric shoulder capelet, brass grommets",
      "dimensions_cm": "Bust 32-36\"",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "wire",
      "wall_position": "center",
      "sconce_light": false,
      "object_position": "center center"
    }
  },
  {
    "id": "art-30",
    "title": "Sculptural Combat Boot Corset [Flatlay]",
    "artist": "Dhrisni",
    "image_url": "/assets/museum/museum_piece_30.webp",
    "thumbnail_url": "/assets/museum/museum_piece_30.webp",
    "description": "Flat studio archival documentation displaying the complete symmetrical layout of the deconstructed boot bodice.",
    "year": "2024-2026",
    "category": "Defensive Haute Couture",
    "frame_style": "tarnished_brass",
    "aspect_ratio": "4:3",
    "width_px": 450,
    "height_px": 300,
    "display_order": 18,
    "is_published": 1,
    "metadata": {
      "medium": "Combat boot uppers, steel lace eyelets, heavy pull tabs, canvas lining",
      "dimensions_cm": "Waist 24-27\"",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "hidden",
      "wall_position": "center",
      "sconce_light": false,
      "object_position": "center center"
    }
  },
  {
    "id": "art-32",
    "title": "Charcoal Spike Blouse [Shoulder Detail]",
    "artist": "Dhrisni",
    "image_url": "/assets/museum/museum_piece_32.webp",
    "thumbnail_url": "/assets/museum/museum_piece_32.webp",
    "description": "Macro detail photograph demonstrating the internal steel backing washers that secure each spike against structural tearing.",
    "year": "2024-2026",
    "category": "Subcultural Tailoring",
    "frame_style": "gilded_rococo",
    "aspect_ratio": "2:3",
    "width_px": 340,
    "height_px": 510,
    "display_order": 19,
    "is_published": 1,
    "metadata": {
      "medium": "Bolted turned steel spikes, double-needle topstitching",
      "dimensions_cm": "Detail Study",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "wire",
      "wall_position": "center",
      "sconce_light": false,
      "object_position": "center center"
    }
  },
  {
    "id": "art-33",
    "title": "Charcoal Spike Blouse [Editorial Mood]",
    "artist": "Dhrisni",
    "image_url": "/assets/museum/museum_piece_33.webp",
    "thumbnail_url": "/assets/museum/museum_piece_33.webp",
    "description": "Model editorial capturing the quiet menace of the spike-blouse silhouette in atmospheric ambient light.",
    "year": "2024-2026",
    "category": "Subcultural Tailoring",
    "frame_style": "florentine_gold",
    "aspect_ratio": "4:5",
    "width_px": 370,
    "height_px": 463,
    "display_order": 20,
    "is_published": 1,
    "metadata": {
      "medium": "Charcoal denim, steel hardware, archival framing",
      "dimensions_cm": "Editorial Print",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "hidden",
      "wall_position": "center",
      "sconce_light": true,
      "object_position": "center center"
    }
  },
  {
    "id": "art-37",
    "title": "Sculptural Cyber Armor [Process Archive]",
    "artist": "Studio Guild",
    "image_url": "/assets/museum/museum_piece_37.webp",
    "thumbnail_url": "/assets/museum/museum_piece_37.webp",
    "description": "Archival studio documentation of cold-formed metal plates and reclaimed hardware contours.",
    "year": "2024-2026",
    "category": "Wearable Hardware",
    "frame_style": "ornate_baroque",
    "aspect_ratio": "4:3",
    "width_px": 450,
    "height_px": 300,
    "display_order": 21,
    "is_published": 1,
    "metadata": {
      "medium": "Cold-rolled steel plates, copper ribbon wiring, industrial solder",
      "dimensions_cm": "Studio Archive",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "brass_chains",
      "wall_position": "center",
      "sconce_light": true,
      "object_position": "center center"
    }
  },
  {
    "id": "art-38",
    "title": "Monochrome Studio Architecture Study",
    "artist": "Studio Guild",
    "image_url": "/assets/museum/museum_piece_38.webp",
    "thumbnail_url": "/assets/museum/museum_piece_38.webp",
    "description": "High-contrast studio silhouette study of industrial hardware styling in monochrome.",
    "year": "2024-2026",
    "category": "Wearable Hardware",
    "frame_style": "gilded_rococo",
    "aspect_ratio": "4:3",
    "width_px": 450,
    "height_px": 300,
    "display_order": 22,
    "is_published": 1,
    "metadata": {
      "medium": "Telecom relay board fragments, brass rivets, leather cuff",
      "dimensions_cm": "Wrist 6-7.5\"",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "wire",
      "wall_position": "center",
      "sconce_light": false,
      "object_position": "center center"
    }
  },
  {
    "id": "art-40",
    "title": "Spike Tube Top [On-Body Editorial]",
    "artist": "Dhrisni",
    "image_url": "/assets/museum/museum_piece_40.webp",
    "thumbnail_url": "/assets/museum/museum_piece_40.webp",
    "description": "Editorial representation highlighting the razor-sharp profile and commanding posture created by the tube armor.",
    "year": "2024-2026",
    "category": "Hardware Intimates",
    "frame_style": "antique_fillet",
    "aspect_ratio": "2:3",
    "width_px": 340,
    "height_px": 510,
    "display_order": 23,
    "is_published": 1,
    "metadata": {
      "medium": "Armored denim, turned steel spikes",
      "dimensions_cm": "Editorial Print",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "brass_chains",
      "wall_position": "center",
      "sconce_light": false,
      "object_position": "center center"
    }
  },
  {
    "id": "art-41",
    "title": "Pearlite Crochet Top [Back View Detail]",
    "artist": "Studio Guild",
    "image_url": "/assets/museum/museum_piece_41.webp",
    "thumbnail_url": "/assets/museum/museum_piece_41.webp",
    "description": "Detailed rear perspective showing the hand-twisted corset back lacing that ensures an exact anatomical fit.",
    "year": "2024-2026",
    "category": "Artisanal Knitwear",
    "frame_style": "classical_cavetto",
    "aspect_ratio": "3:4",
    "width_px": 360,
    "height_px": 480,
    "display_order": 24,
    "is_published": 1,
    "metadata": {
      "medium": "Recycled cotton cord, intricate open-back ladder lacing, brass beads",
      "dimensions_cm": "Adjustable Back",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "wire",
      "wall_position": "center",
      "sconce_light": true,
      "object_position": "center center"
    }
  },
  {
    "id": "art-42",
    "title": "Dhristroyer Imperial Relic Corset",
    "artist": "Dhrisni (Personal Archive)",
    "image_url": "/assets/museum/museum_piece_42.webp",
    "thumbnail_url": "/assets/museum/museum_piece_42.webp",
    "description": "The crown jewel of Dhrisni's private collection. A triumph of maximalist post-industrial craftsmanship incorporating every core studio discipline.",
    "year": "2024-2026",
    "category": "Salon Masterpiece",
    "frame_style": "tarnished_brass",
    "aspect_ratio": "3:4",
    "width_px": 360,
    "height_px": 480,
    "display_order": 25,
    "is_published": 1,
    "metadata": {
      "medium": "Raw industrial denim, salvage alloy embellishments, raw steel closures, hand embroidery",
      "dimensions_cm": "Runway Custom Masterpiece",
      "provenance": "AVZ Studio Permanent Collection",
      "hanging_bracket": "hidden",
      "wall_position": "center",
      "sconce_light": false,
      "object_position": "center center"
    }
  }
];
