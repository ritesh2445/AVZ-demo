// AVZ VAGANZA — SOURCE OF TRUTH BRAND DATA & ASSET MANIFEST
// Derived faithfully from the Client Questionnaire and authentic assets.

export const BRAND_INFO = {
  name: "AVZ Vaganza",
  legalName: "AVZ VAGANZA",
  tagline: "Sculptural Haute Couture & Archival Wearable Art",
  domain: "aveezahvaganza.com",
  instagram: "@avz.vaganza",
  instagramUrl: "https://www.instagram.com/avz.vaganza",
  businessEmail: "aveezahstore@gmail.com",
  founderEmail: "dhrisni@aveezahvaganza.com",
  whatsappPrimary: "+91 73042 64901",
  whatsappSecondary: "+91 82910 13848",
  whatsappLinkPrimary: "https://wa.me/917304264901",
  whatsappLinkSecondary: "https://wa.me/918291013848",
  registeredAddress: "H No. 1, Mayur Path, Rukminigaon, Guwahati, Assam: 781006",
  founder: {
    name: "Dhrisni",
    alias: "Dhristroyer",
    role: "Founder, Creative Director & Master Artisan",
    bio: "Known to the world as Dhrisni or Dhristroyer, she wears many titles like model, actor, content creator, and designer. But if you strip all of that away, at her absolute core, she is just an artist. Growing up in a household where she was not allowed to wear revealing clothes, not even sleeveless tops, her creativity had to find an outlet. That restriction is what first pushed her to pick up a pair of scissors and start cutting up clothes for Instagram. She despises minimalism, loathes cookie-cutter aesthetics, and has zero patience for AI-generated sameness. She is all about maximalism, chaos, texture, and raw human grit. Building wearable art with her own two hands is the ultimate rebellion."
  },
  philosophy: {
    headline: "WEARABLE ART. NOT MADE TO REPEAT.",
    principles: [
      { title: "Maximalism Over Minimalism", text: "We fiercely reject cookie-cutter minimalism. Raw textures, metallic spikes, motherboard circuit boards, and industrial hardware collide." },
      { title: "Human Hands Over Machine Sameness", text: "In a world drowning in fast fashion and AI generation, things built by real human hands are the ultimate luxury." },
      { title: "Upcycling & Reclaimed Textiles", text: "Tired of stuffed closets and landfill waste, we transform discarded garments and unconventional hardware into one-of-a-kind armor." },
      { title: "Empowering Women Artisans", text: "We hire and train women directly under Dhrisni's close personal supervision in our Guwahati studio." }
    ]
  },
  pricingTiers: [
    {
      tier: "Accessories & Small Pieces",
      range: "Under ₹1,000",
      description: "Custom wire pieces, keycap jewelry, chokers, spike accents, and ear cuffs."
    },
    {
      tier: "Core Statement Pieces",
      range: "₹1,000 – ₹3,000",
      description: "Handcrafted bralettes, corsets, custom skirts, and motherboard tops."
    },
    {
      tier: "Full Outfits & Heavy Art",
      range: "₹3,000+",
      description: "Complex hardware outfits, custom jackets, and full runway sets."
    }
  ],
  customTimeline: "2 to 3 weeks (hand-built from scratch)",
  shipping: {
    domestic: "Flat-rate shipping across India (1–2 weeks delivery)",
    international: "Worldwide courier delivery available (Rates calculated at checkout)",
    freeThreshold: 5000,
    freeThresholdText: "Free shipping across India on orders above ₹5,000"
  },
  returnsPolicy: {
    summary: "Return if visible product damage exists, or replacement if there is a sizing issue.",
    requirement: "For visible damage claims, an uncut unboxing video must be sent to our official WhatsApp concierge within 48 hours of delivery."
  },
  packaging: {
    headline: "Unboxing The Alternate Dimension",
    items: [
      "Signature matte-black & violet boxes with embossed AVZ logo",
      "Handwritten thank-you card from Dhrisni",
      "Gourmet artisanal chocolates",
      "Surprise hardware freebies and sticker seals on eligible drops"
    ]
  }
};

// ASSET MANIFEST MAPPING
export const ASSET_MANIFEST = {
  logo: "/assets/avz_logo_official.png",
  cat: "/assets/cat_companion.png",
  editorialHero: "/assets/editorial_hero_portrait.jpg",
  editorialLookbook: "/assets/editorial_lookbook_ref.jpg",
  products: {
    divaTop: "/assets/product_diva_top.jpg",
    spikeBra: "/assets/product_spike_bra.jpg",
    beadedBralette: "/assets/product_beaded_bralette.jpg",
    reworkedJacket: "/assets/product_reworked_jacket.jpg",
    coordSet: "/assets/product_coord_set.jpg",
    spikeTop: "/assets/product_spike_top.jpg",
    archiveBralette: "/assets/product_archive_bralette.jpg",
    chainmailArmor: "/assets/look_chainmail_armor.jpg",
    spikeBodice: "/assets/look_spike_bodice.jpg",
    motherboardCuff: "/assets/prod_motherboard_cuff.jpg"
  },
  heroRunwayVideo: "/assets/hero_reel_desktop.mp4",
  heroRunwayVideoVertical: "/assets/hero_reel_mobile.mp4",
  heroRunwayAudio: "/assets/hero_audio_desktop.mp4",
  videos: {
    heroDesktop: "/assets/hero_reel_desktop.mp4",
    heroMobile: "/assets/hero_reel_mobile.mp4",
    vimeoDesktop: "https://vimeo.com/1243094637",
    vimeoMobile: "https://vimeo.com/1239586843",
    vimeoEmbedDesktop: "https://player.vimeo.com/video/1243094637?h=f23215a874&autoplay=1&loop=1&autopause=0&title=0&byline=0&portrait=0",
    vimeoEmbedMobile: "https://player.vimeo.com/video/1239586843?autoplay=1&loop=1&autopause=0&title=0&byline=0&portrait=0"
  },
  audio: {
    heroDesktop: "/assets/hero_audio_desktop.mp4",
    heroMobile: "/assets/hero_audio_mobile.mp4"
  }
};

// CATEGORIES SPECIFIED BY CLIENT
export const CATEGORIES = [
  "All",
  "Jackets",
  "Tops",
  "Earrings",
  "Neckpieces",
  "Arm cuffs",
  "Bags",
  "Corsets",
  "Bralettes",
  "Pants",
  "Skirts",
  "Leg warmers",
  "Headgear",
  "Belts",
  "Body chainmail",
  "Co-ord sets",
  "Custom-order pieces"
];

// MATERIAL FILTERS
export const MATERIALS = [
  "All Materials",
  "Upcycled Hardware",
  "Motherboards & Circuits",
  "Metal Spikes & Chains",
  "Keycaps & Tech Scrap",
  "Reclaimed Denim",
  "Industrial Wire",
  "Chainmail"
];

// COLLECTION ARCHIVE — Curated from authentic studio inventory with multi-shot frame grouping
export const PRODUCTS = [
  {
    "id": "avz-col-arm-1",
    "sku": "AVZ-ARM-0001",
    "name": "Hand-Riveted Spikeria Gauntlet",
    "category": "Arm cuffs",
    "price": 1800,
    "tag": "BEST SELLER",
    "stock": 1,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Steel Wire"
    ],
    "images": [
      "/assets/collection/armcuffs/armcuffs_01.webp"
    ],
    "image": "/assets/collection/armcuffs/armcuffs_01.webp",
    "description": "Hand-Riveted Spikeria Gauntlet — handcrafted archival wrist and bicep armor sculpted in the Guwahati studio.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Upcycled non-traditional materials",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Adjustable Free Size"
    ],
    "featured": true
  },
  {
    "id": "avz-col-arm-2",
    "sku": "AVZ-ARM-0002",
    "name": "Salvaged Motherboard Cyber Cuff",
    "category": "Arm cuffs",
    "price": 1950,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Steel Wire"
    ],
    "images": [
      "/assets/collection/armcuffs/armcuffs_02.webp"
    ],
    "image": "/assets/collection/armcuffs/armcuffs_02.webp",
    "description": "Salvaged Motherboard Cyber Cuff — handcrafted archival wrist and bicep armor sculpted in the Guwahati studio.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Upcycled non-traditional materials",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Adjustable Free Size"
    ],
    "featured": false
  },
  {
    "id": "avz-col-arm-3",
    "sku": "AVZ-ARM-0003",
    "name": "Liquid Stainless Mesh Armlet",
    "category": "Arm cuffs",
    "price": 2100,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Steel Wire"
    ],
    "images": [
      "/assets/collection/armcuffs/armcuffs_03.webp"
    ],
    "image": "/assets/collection/armcuffs/armcuffs_03.webp",
    "description": "Liquid Stainless Mesh Armlet — handcrafted archival wrist and bicep armor sculpted in the Guwahati studio.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Upcycled non-traditional materials",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Adjustable Free Size"
    ],
    "featured": false
  },
  {
    "id": "avz-col-arm-4",
    "sku": "AVZ-ARM-0004",
    "name": "Tactile Hardware Bicep Shackle",
    "category": "Arm cuffs",
    "price": 2250,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Steel Wire"
    ],
    "images": [
      "/assets/collection/armcuffs/armcuffs_04.webp"
    ],
    "image": "/assets/collection/armcuffs/armcuffs_04.webp",
    "description": "Tactile Hardware Bicep Shackle — handcrafted archival wrist and bicep armor sculpted in the Guwahati studio.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Upcycled non-traditional materials",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Adjustable Free Size"
    ],
    "featured": false
  },
  {
    "id": "avz-col-arm-5",
    "sku": "AVZ-ARM-0005",
    "name": "Sculpted Wire Carapace Gauntlet",
    "category": "Arm cuffs",
    "price": 2400,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Steel Wire"
    ],
    "images": [
      "/assets/collection/armcuffs/armcuffs_05.webp"
    ],
    "image": "/assets/collection/armcuffs/armcuffs_05.webp",
    "description": "Sculpted Wire Carapace Gauntlet — handcrafted archival wrist and bicep armor sculpted in the Guwahati studio.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Upcycled non-traditional materials",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Adjustable Free Size"
    ],
    "featured": false
  },
  {
    "id": "avz-col-bag-1",
    "sku": "AVZ-BAG-0006",
    "name": "Silicon Motherboard Core Micro Bag",
    "category": "Bags",
    "price": 2400,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Heavy Denim"
    ],
    "images": [
      "/assets/collection/bags/bags_01.webp"
    ],
    "image": "/assets/collection/bags/bags_01.webp",
    "description": "Silicon Motherboard Core Micro Bag — structured wearable sculpture built from salvaged electronic waste and industrial hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Upcycled non-traditional materials",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "One Size (Micro Silhouette)"
    ],
    "featured": true
  },
  {
    "id": "avz-col-bag-2",
    "sku": "AVZ-BAG-0007",
    "name": "Heavy Chain & O-Ring Hardware Pouch",
    "category": "Bags",
    "price": 2600,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Heavy Denim"
    ],
    "images": [
      "/assets/collection/bags/bags_02.webp"
    ],
    "image": "/assets/collection/bags/bags_02.webp",
    "description": "Heavy Chain & O-Ring Hardware Pouch — structured wearable sculpture built from salvaged electronic waste and industrial hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Upcycled non-traditional materials",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "One Size (Micro Silhouette)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-bag-3",
    "sku": "AVZ-BAG-0008",
    "name": "Deconstructed Denim Kinetic Holster Bag",
    "category": "Bags",
    "price": 2800,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Heavy Denim"
    ],
    "images": [
      "/assets/collection/bags/bags_03.webp"
    ],
    "image": "/assets/collection/bags/bags_03.webp",
    "description": "Deconstructed Denim Kinetic Holster Bag — structured wearable sculpture built from salvaged electronic waste and industrial hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Upcycled non-traditional materials",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "One Size (Micro Silhouette)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-bag-4",
    "sku": "AVZ-BAG-0009",
    "name": "Cyber-Goth Grommet Mini Handbag",
    "category": "Bags",
    "price": 3000,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Heavy Denim"
    ],
    "images": [
      "/assets/collection/bags/bags_04.webp"
    ],
    "image": "/assets/collection/bags/bags_04.webp",
    "description": "Cyber-Goth Grommet Mini Handbag — structured wearable sculpture built from salvaged electronic waste and industrial hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Upcycled non-traditional materials",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "One Size (Micro Silhouette)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-bag-5",
    "sku": "AVZ-BAG-0010",
    "name": "Reclaimed Circuit Crossbody Capsule",
    "category": "Bags",
    "price": 3200,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Heavy Denim"
    ],
    "images": [
      "/assets/collection/bags/bags_05.webp"
    ],
    "image": "/assets/collection/bags/bags_05.webp",
    "description": "Reclaimed Circuit Crossbody Capsule — structured wearable sculpture built from salvaged electronic waste and industrial hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Upcycled non-traditional materials",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "One Size (Micro Silhouette)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-belt-1",
    "sku": "AVZ-BLT-0011",
    "name": "Raw Steel O-Ring Matrix Waist Belt",
    "category": "Belts",
    "price": 2100,
    "tag": "STUDIO PIECE",
    "stock": 3,
    "materials": [
      "Upcycled Hardware",
      "Stainless Rings",
      "Reinforced Webbing"
    ],
    "images": [
      "/assets/collection/belts/belts_01.webp"
    ],
    "image": "/assets/collection/belts/belts_01.webp",
    "description": "Raw Steel O-Ring Matrix Waist Belt — heavy industrial waist harness designed for subcultural clubwear and everyday defiance.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Fully adjustable clasps and ringlets",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (24-30 in)",
      "M / L (30-36 in)",
      "Custom Waist Measurement"
    ],
    "featured": true
  },
  {
    "id": "avz-col-belt-2",
    "sku": "AVZ-BLT-0012",
    "name": "Barbed Kinetic Link Suspender Harness",
    "category": "Belts",
    "price": 2350,
    "tag": "STUDIO PIECE",
    "stock": 3,
    "materials": [
      "Upcycled Hardware",
      "Stainless Rings",
      "Reinforced Webbing"
    ],
    "images": [
      "/assets/collection/belts/belts_02.webp"
    ],
    "image": "/assets/collection/belts/belts_02.webp",
    "description": "Barbed Kinetic Link Suspender Harness — heavy industrial waist harness designed for subcultural clubwear and everyday defiance.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Fully adjustable clasps and ringlets",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (24-30 in)",
      "M / L (30-36 in)",
      "Custom Waist Measurement"
    ],
    "featured": false
  },
  {
    "id": "avz-col-belt-3",
    "sku": "AVZ-BLT-0013",
    "name": "Heavy Duty Carabiner Utility Cincher",
    "category": "Belts",
    "price": 2600,
    "tag": "STUDIO PIECE",
    "stock": 3,
    "materials": [
      "Upcycled Hardware",
      "Stainless Rings",
      "Reinforced Webbing"
    ],
    "images": [
      "/assets/collection/belts/belts_03.webp"
    ],
    "image": "/assets/collection/belts/belts_03.webp",
    "description": "Heavy Duty Carabiner Utility Cincher — heavy industrial waist harness designed for subcultural clubwear and everyday defiance.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Fully adjustable clasps and ringlets",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (24-30 in)",
      "M / L (30-36 in)",
      "Custom Waist Measurement"
    ],
    "featured": false
  },
  {
    "id": "avz-col-belt-4",
    "sku": "AVZ-BLT-0014",
    "name": "Multi-Ring Cyberpunk Hip Holster",
    "category": "Belts",
    "price": 2850,
    "tag": "STUDIO PIECE",
    "stock": 3,
    "materials": [
      "Upcycled Hardware",
      "Stainless Rings",
      "Reinforced Webbing"
    ],
    "images": [
      "/assets/collection/belts/belts_04.webp"
    ],
    "image": "/assets/collection/belts/belts_04.webp",
    "description": "Multi-Ring Cyberpunk Hip Holster — heavy industrial waist harness designed for subcultural clubwear and everyday defiance.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Fully adjustable clasps and ringlets",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (24-30 in)",
      "M / L (30-36 in)",
      "Custom Waist Measurement"
    ],
    "featured": false
  },
  {
    "id": "avz-col-skirt-1",
    "sku": "AVZ-SKT-0015",
    "name": "Acid-Wash Reclaimed Hardware Cargo Skirt",
    "category": "Skirts",
    "price": 3800,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Industrial Eyelets",
      "Chunky Zippers"
    ],
    "images": [
      "/assets/collection/skirts/skirts_01.webp",
      "/assets/collection/skirts/skirts_02.webp",
      "/assets/collection/skirts/skirts_03.webp"
    ],
    "image": "/assets/collection/skirts/skirts_01.webp",
    "description": "Acid-Wash Reclaimed Hardware Cargo Skirt — deconstructed raw-edge denim skirt with segmented hardware pocket suspension and industrial drapes.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "3 distinct editorial angles available in gallery",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS (Waist 25-26 in)",
      "S (Waist 27-28 in)",
      "M (Waist 29-30 in)"
    ],
    "featured": true
  },
  {
    "id": "avz-col-head-1",
    "sku": "AVZ-HDG-0016",
    "name": "Sculpted Silver Wire Carapace Halo",
    "category": "Headgear",
    "price": 2400,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 2,
    "materials": [
      "Industrial Wire",
      "Upcycled Hardware",
      "Assam Hand-Dyed Cotton"
    ],
    "images": [
      "/assets/collection/headgears/headgears_01.webp"
    ],
    "image": "/assets/collection/headgears/headgears_01.webp",
    "description": "Sculpted Silver Wire Carapace Halo — sculptural headpiece handcrafted by Dhrisni in Guwahati. Bridges ritual ornamentation with cold industrial cyberpunk aesthetics.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "1 shot captured in studio",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Adjustable Head Fit"
    ],
    "featured": false
  },
  {
    "id": "avz-col-head-2",
    "sku": "AVZ-HDG-0017",
    "name": "Cyberpunk Salvaged Cable Crown",
    "category": "Headgear",
    "price": 2600,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 2,
    "materials": [
      "Industrial Wire",
      "Upcycled Hardware",
      "Assam Hand-Dyed Cotton"
    ],
    "images": [
      "/assets/collection/headgears/headgears_02.webp"
    ],
    "image": "/assets/collection/headgears/headgears_02.webp",
    "description": "Cyberpunk Salvaged Cable Crown — sculptural headpiece handcrafted by Dhrisni in Guwahati. Bridges ritual ornamentation with cold industrial cyberpunk aesthetics.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "1 shot captured in studio",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Adjustable Head Fit"
    ],
    "featured": false
  },
  {
    "id": "avz-col-head-3",
    "sku": "AVZ-HDG-0018",
    "name": "Barbed Wire Radial Corona Headpiece",
    "category": "Headgear",
    "price": 2800,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 2,
    "materials": [
      "Industrial Wire",
      "Upcycled Hardware",
      "Assam Hand-Dyed Cotton"
    ],
    "images": [
      "/assets/collection/headgears/headgears_03.webp"
    ],
    "image": "/assets/collection/headgears/headgears_03.webp",
    "description": "Barbed Wire Radial Corona Headpiece — sculptural headpiece handcrafted by Dhrisni in Guwahati. Bridges ritual ornamentation with cold industrial cyberpunk aesthetics.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "1 shot captured in studio",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Adjustable Head Fit"
    ],
    "featured": false
  },
  {
    "id": "avz-col-head-4",
    "sku": "AVZ-HDG-0019",
    "name": "Industrial Filigree Ear & Head Shroud",
    "category": "Headgear",
    "price": 3000,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 2,
    "materials": [
      "Industrial Wire",
      "Upcycled Hardware",
      "Assam Hand-Dyed Cotton"
    ],
    "images": [
      "/assets/collection/headgears/headgears_04.webp"
    ],
    "image": "/assets/collection/headgears/headgears_04.webp",
    "description": "Industrial Filigree Ear & Head Shroud — sculptural headpiece handcrafted by Dhrisni in Guwahati. Bridges ritual ornamentation with cold industrial cyberpunk aesthetics.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "1 shot captured in studio",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Adjustable Head Fit"
    ],
    "featured": false
  },
  {
    "id": "avz-col-head-5",
    "sku": "AVZ-HDG-0020",
    "name": "Dark Wave Spiked Face Veil",
    "category": "Headgear",
    "price": 3200,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 2,
    "materials": [
      "Industrial Wire",
      "Upcycled Hardware",
      "Assam Hand-Dyed Cotton"
    ],
    "images": [
      "/assets/collection/headgears/headgears_05.webp"
    ],
    "image": "/assets/collection/headgears/headgears_05.webp",
    "description": "Dark Wave Spiked Face Veil — sculptural headpiece handcrafted by Dhrisni in Guwahati. Bridges ritual ornamentation with cold industrial cyberpunk aesthetics.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "1 shot captured in studio",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Adjustable Head Fit"
    ],
    "featured": false
  },
  {
    "id": "avz-col-head-6",
    "sku": "AVZ-HDG-0021",
    "name": "Mermaidcore Wire Tendril Headband",
    "category": "Headgear",
    "price": 3400,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 2,
    "materials": [
      "Industrial Wire",
      "Upcycled Hardware",
      "Assam Hand-Dyed Cotton"
    ],
    "images": [
      "/assets/collection/headgears/headgears_06.webp"
    ],
    "image": "/assets/collection/headgears/headgears_06.webp",
    "description": "Mermaidcore Wire Tendril Headband — sculptural headpiece handcrafted by Dhrisni in Guwahati. Bridges ritual ornamentation with cold industrial cyberpunk aesthetics.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "1 shot captured in studio",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Adjustable Head Fit"
    ],
    "featured": false
  },
  {
    "id": "avz-col-head-7",
    "sku": "AVZ-HDG-0022",
    "name": "Hand-Knit Spiked Balaclava & Halo",
    "category": "Headgear",
    "price": 3600,
    "tag": "BEST SELLER",
    "stock": 2,
    "materials": [
      "Industrial Wire",
      "Upcycled Hardware",
      "Assam Hand-Dyed Cotton"
    ],
    "images": [
      "/assets/collection/headgears/headgears_07.webp",
      "/assets/collection/headgears/headgears_08.webp"
    ],
    "image": "/assets/collection/headgears/headgears_07.webp",
    "description": "Hand-Knit Spiked Balaclava & Halo — sculptural headpiece handcrafted by Dhrisni in Guwahati. Bridges ritual ornamentation with cold industrial cyberpunk aesthetics.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "2 shots captured in studio",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Adjustable Head Fit"
    ],
    "featured": true
  },
  {
    "id": "avz-col-cor-1",
    "sku": "AVZ-COR-0023",
    "name": "Heavy Riveted Obsidian Armor Bodice",
    "category": "Corsets",
    "price": 3600,
    "tag": "BEST SELLER",
    "stock": 1,
    "materials": [
      "Metal Spikes & Chains",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/corsets/corsets_01.webp",
      "/assets/collection/corsets/corsets_02.webp"
    ],
    "image": "/assets/collection/corsets/corsets_01.webp",
    "description": "Heavy Riveted Obsidian Armor Bodice — form-sculpted defensive armor bodice engineered with raw hardware, boning, and hand-riveted cones.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "2 angles available",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS (Bust 30-32 in)",
      "S (Bust 32-34 in)",
      "M (Bust 34-36 in)",
      "Custom Sizing"
    ],
    "featured": true
  },
  {
    "id": "avz-col-cor-2",
    "sku": "AVZ-COR-0024",
    "name": "Mermaidcore Cyber-Chitin Bodice",
    "category": "Corsets",
    "price": 3900,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Metal Spikes & Chains",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/corsets/corsets_03.webp"
    ],
    "image": "/assets/collection/corsets/corsets_03.webp",
    "description": "Mermaidcore Cyber-Chitin Bodice — form-sculpted defensive armor bodice engineered with raw hardware, boning, and hand-riveted cones.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "1 angle available",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS (Bust 30-32 in)",
      "S (Bust 32-34 in)",
      "M (Bust 34-36 in)",
      "Custom Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-cor-3",
    "sku": "AVZ-COR-0025",
    "name": "Asymmetrical Cone Spike Cyber Corset",
    "category": "Corsets",
    "price": 4200,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Metal Spikes & Chains",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/corsets/corsets_04.webp"
    ],
    "image": "/assets/collection/corsets/corsets_04.webp",
    "description": "Asymmetrical Cone Spike Cyber Corset — form-sculpted defensive armor bodice engineered with raw hardware, boning, and hand-riveted cones.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "1 angle available",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS (Bust 30-32 in)",
      "S (Bust 32-34 in)",
      "M (Bust 34-36 in)",
      "Custom Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-cor-4",
    "sku": "AVZ-COR-0026",
    "name": "Industrial Raw Canvas Corset Top",
    "category": "Corsets",
    "price": 4500,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Metal Spikes & Chains",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/corsets/corsets_05.webp"
    ],
    "image": "/assets/collection/corsets/corsets_05.webp",
    "description": "Industrial Raw Canvas Corset Top — form-sculpted defensive armor bodice engineered with raw hardware, boning, and hand-riveted cones.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "1 angle available",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS (Bust 30-32 in)",
      "S (Bust 32-34 in)",
      "M (Bust 34-36 in)",
      "Custom Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-cor-5",
    "sku": "AVZ-COR-0027",
    "name": "Reclaimed Distressed Denim Micro-Bustier",
    "category": "Corsets",
    "price": 4800,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Metal Spikes & Chains",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/corsets/corsets_06.webp"
    ],
    "image": "/assets/collection/corsets/corsets_06.webp",
    "description": "Reclaimed Distressed Denim Micro-Bustier — form-sculpted defensive armor bodice engineered with raw hardware, boning, and hand-riveted cones.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "1 angle available",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS (Bust 30-32 in)",
      "S (Bust 32-34 in)",
      "M (Bust 34-36 in)",
      "Custom Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-cor-6",
    "sku": "AVZ-COR-0028",
    "name": "Dystopian Spikeria Cuirass",
    "category": "Corsets",
    "price": 5100,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Metal Spikes & Chains",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/corsets/corsets_07.webp"
    ],
    "image": "/assets/collection/corsets/corsets_07.webp",
    "description": "Dystopian Spikeria Cuirass — form-sculpted defensive armor bodice engineered with raw hardware, boning, and hand-riveted cones.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "1 angle available",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS (Bust 30-32 in)",
      "S (Bust 32-34 in)",
      "M (Bust 34-36 in)",
      "Custom Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-jkt-1",
    "sku": "AVZ-JKT-0029",
    "name": "Syllabic Denim Kinetic Shrug (Archival)",
    "category": "Jackets",
    "price": 4200,
    "tag": "BEST SELLER",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Zippers"
    ],
    "images": [
      "/assets/collection/jackets/jackets_01.webp"
    ],
    "image": "/assets/collection/jackets/jackets_01.webp",
    "description": "Syllabic Denim Kinetic Shrug (Archival) — deconstructed kinetic jacket handcrafted from deadstock denim and reclaimed heavy metals.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic reworked vintage textile base",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Free Size (Oversized Slouch Fit)",
      "Custom Studio Sizing"
    ],
    "featured": true
  },
  {
    "id": "avz-col-jkt-2",
    "sku": "AVZ-JKT-0030",
    "name": "Deconstructed Moto Bolero with Spike Accents",
    "category": "Jackets",
    "price": 4400,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Zippers"
    ],
    "images": [
      "/assets/collection/jackets/jackets_02.webp"
    ],
    "image": "/assets/collection/jackets/jackets_02.webp",
    "description": "Deconstructed Moto Bolero with Spike Accents — deconstructed kinetic jacket handcrafted from deadstock denim and reclaimed heavy metals.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic reworked vintage textile base",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Free Size (Oversized Slouch Fit)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-jkt-3",
    "sku": "AVZ-JKT-0031",
    "name": "Industrial Heavy Grommet Denim Jacket",
    "category": "Jackets",
    "price": 4600,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Zippers"
    ],
    "images": [
      "/assets/collection/jackets/jackets_03.webp"
    ],
    "image": "/assets/collection/jackets/jackets_03.webp",
    "description": "Industrial Heavy Grommet Denim Jacket — deconstructed kinetic jacket handcrafted from deadstock denim and reclaimed heavy metals.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic reworked vintage textile base",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Free Size (Oversized Slouch Fit)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-jkt-4",
    "sku": "AVZ-JKT-0032",
    "name": "Acid-Wash Asymmetrical Sleeve Bolero",
    "category": "Jackets",
    "price": 4800,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Zippers"
    ],
    "images": [
      "/assets/collection/jackets/jackets_04.webp"
    ],
    "image": "/assets/collection/jackets/jackets_04.webp",
    "description": "Acid-Wash Asymmetrical Sleeve Bolero — deconstructed kinetic jacket handcrafted from deadstock denim and reclaimed heavy metals.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic reworked vintage textile base",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Free Size (Oversized Slouch Fit)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-jkt-5",
    "sku": "AVZ-JKT-0033",
    "name": "Multi-Zipped Reclaimed Streetwear Shrug",
    "category": "Jackets",
    "price": 5000,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Zippers"
    ],
    "images": [
      "/assets/collection/jackets/jackets_05.webp"
    ],
    "image": "/assets/collection/jackets/jackets_05.webp",
    "description": "Multi-Zipped Reclaimed Streetwear Shrug — deconstructed kinetic jacket handcrafted from deadstock denim and reclaimed heavy metals.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic reworked vintage textile base",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Free Size (Oversized Slouch Fit)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-jkt-6",
    "sku": "AVZ-JKT-0034",
    "name": "Raw Edge Denim Arm Guard Bolero",
    "category": "Jackets",
    "price": 5200,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Zippers"
    ],
    "images": [
      "/assets/collection/jackets/jackets_06.webp"
    ],
    "image": "/assets/collection/jackets/jackets_06.webp",
    "description": "Raw Edge Denim Arm Guard Bolero — deconstructed kinetic jacket handcrafted from deadstock denim and reclaimed heavy metals.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic reworked vintage textile base",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Free Size (Oversized Slouch Fit)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-jkt-7",
    "sku": "AVZ-JKT-0035",
    "name": "Distressed Barbed Hardware Shrug",
    "category": "Jackets",
    "price": 5400,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Zippers"
    ],
    "images": [
      "/assets/collection/jackets/jackets_07.webp"
    ],
    "image": "/assets/collection/jackets/jackets_07.webp",
    "description": "Distressed Barbed Hardware Shrug — deconstructed kinetic jacket handcrafted from deadstock denim and reclaimed heavy metals.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic reworked vintage textile base",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Free Size (Oversized Slouch Fit)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-jkt-8",
    "sku": "AVZ-JKT-0036",
    "name": "Liquid Chrome Chain Waterfall Shrug",
    "category": "Jackets",
    "price": 5600,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Zippers"
    ],
    "images": [
      "/assets/collection/jackets/jackets_08.webp"
    ],
    "image": "/assets/collection/jackets/jackets_08.webp",
    "description": "Liquid Chrome Chain Waterfall Shrug — deconstructed kinetic jacket handcrafted from deadstock denim and reclaimed heavy metals.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic reworked vintage textile base",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Free Size (Oversized Slouch Fit)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-jkt-9",
    "sku": "AVZ-JKT-0037",
    "name": "Patchwork Reconstructed Denim Trucker",
    "category": "Jackets",
    "price": 5800,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Zippers"
    ],
    "images": [
      "/assets/collection/jackets/jackets_09.webp"
    ],
    "image": "/assets/collection/jackets/jackets_09.webp",
    "description": "Patchwork Reconstructed Denim Trucker — deconstructed kinetic jacket handcrafted from deadstock denim and reclaimed heavy metals.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic reworked vintage textile base",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Free Size (Oversized Slouch Fit)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-jkt-10",
    "sku": "AVZ-JKT-0038",
    "name": "Tactile Hardware Suspender Jacket",
    "category": "Jackets",
    "price": 6000,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Zippers"
    ],
    "images": [
      "/assets/collection/jackets/jackets_10.webp"
    ],
    "image": "/assets/collection/jackets/jackets_10.webp",
    "description": "Tactile Hardware Suspender Jacket — deconstructed kinetic jacket handcrafted from deadstock denim and reclaimed heavy metals.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic reworked vintage textile base",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Free Size (Oversized Slouch Fit)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-jkt-11",
    "sku": "AVZ-JKT-0039",
    "name": "Nocturnal Armor Crop Bolero",
    "category": "Jackets",
    "price": 6200,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Zippers"
    ],
    "images": [
      "/assets/collection/jackets/jackets_11.webp"
    ],
    "image": "/assets/collection/jackets/jackets_11.webp",
    "description": "Nocturnal Armor Crop Bolero — deconstructed kinetic jacket handcrafted from deadstock denim and reclaimed heavy metals.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic reworked vintage textile base",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Free Size (Oversized Slouch Fit)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-jkt-12",
    "sku": "AVZ-JKT-0040",
    "name": "Dhristroyer Signature Spiked Moto Relic",
    "category": "Jackets",
    "price": 6400,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Zippers"
    ],
    "images": [
      "/assets/collection/jackets/jackets_12.webp"
    ],
    "image": "/assets/collection/jackets/jackets_12.webp",
    "description": "Dhristroyer Signature Spiked Moto Relic — deconstructed kinetic jacket handcrafted from deadstock denim and reclaimed heavy metals.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic reworked vintage textile base",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Free Size (Oversized Slouch Fit)",
      "Custom Studio Sizing"
    ],
    "featured": true
  },
  {
    "id": "avz-col-chn-1",
    "sku": "AVZ-CHN-0041",
    "name": "Guwahati Stainless Chainmail Cuirass",
    "category": "Body chainmail",
    "price": 5400,
    "tag": "BEST SELLER",
    "stock": 2,
    "materials": [
      "16-Gauge Stainless Steel",
      "Industrial Rings",
      "Chrome Clasps"
    ],
    "images": [
      "/assets/collection/body_chainmail/body_chainmail_15.webp",
      "/assets/collection/body_chainmail/body_chainmail_16.webp",
      "/assets/collection/body_chainmail/body_chainmail_17.webp",
      "/assets/collection/body_chainmail/body_chainmail_18.webp",
      "/assets/collection/body_chainmail/body_chainmail_19.webp",
      "/assets/collection/body_chainmail/body_chainmail_20.webp",
      "/assets/collection/body_chainmail/body_chainmail_21.webp",
      "/assets/collection/body_chainmail/body_chainmail_22.webp"
    ],
    "image": "/assets/collection/body_chainmail/body_chainmail_15.webp",
    "description": "Guwahati Stainless Chainmail Cuirass — over 1,400 individually hand-linked stainless steel ringlets flex dynamically across torso curves. Includes 8 distinct shoot angles.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "8 detailed photoshoot angles in product gallery",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 32-36 in)",
      "M / L (Bust 36-40 in)",
      "Custom Studio Measurement"
    ],
    "featured": true
  },
  {
    "id": "avz-col-chn-2",
    "sku": "AVZ-CHN-0042",
    "name": "Liquid Steel Drape Halter Top",
    "category": "Body chainmail",
    "price": 4600,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Stainless Steel Chainmail",
      "O-Ring Hardware"
    ],
    "images": [
      "/assets/collection/body_chainmail/body_chainmail_13.webp",
      "/assets/collection/body_chainmail/body_chainmail_14.webp"
    ],
    "image": "/assets/collection/body_chainmail/body_chainmail_13.webp",
    "description": "Liquid Steel Drape Halter Top — fluid medieval futurism that hugs the collarbones and ribcage with soothing, reassuring physical weight.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "2 detailed angles in product gallery",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Adjustable Lobster Clasp Fit"
    ],
    "featured": true
  },
  {
    "id": "avz-col-chn-3",
    "sku": "AVZ-CHN-0043",
    "name": "Vertebrae Articulated Spine Armor",
    "category": "Body chainmail",
    "price": 4200,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Chainmail",
      "Stainless Steel",
      "Upcycled Hardware"
    ],
    "images": [
      "/assets/collection/body_chainmail/body_chainmail_01.webp"
    ],
    "image": "/assets/collection/body_chainmail/body_chainmail_01.webp",
    "description": "Vertebrae Articulated Spine Armor — wearable stainless steel sculpture created ring-by-ring in our Guwahati workshop.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Custom stainless hardware",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Free Size Adjustable"
    ],
    "featured": true
  },
  {
    "id": "avz-col-chn-4",
    "sku": "AVZ-CHN-0044",
    "name": "Cascading Waterfall Chainmail Shrug",
    "category": "Body chainmail",
    "price": 4400,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Chainmail",
      "Stainless Steel",
      "Upcycled Hardware"
    ],
    "images": [
      "/assets/collection/body_chainmail/body_chainmail_02.webp"
    ],
    "image": "/assets/collection/body_chainmail/body_chainmail_02.webp",
    "description": "Cascading Waterfall Chainmail Shrug — wearable stainless steel sculpture created ring-by-ring in our Guwahati workshop.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Custom stainless hardware",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Free Size Adjustable"
    ],
    "featured": false
  },
  {
    "id": "avz-col-chn-5",
    "sku": "AVZ-CHN-0045",
    "name": "Rib Cage Steel Matrix Cuirass",
    "category": "Body chainmail",
    "price": 4600,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Chainmail",
      "Stainless Steel",
      "Upcycled Hardware"
    ],
    "images": [
      "/assets/collection/body_chainmail/body_chainmail_03.webp"
    ],
    "image": "/assets/collection/body_chainmail/body_chainmail_03.webp",
    "description": "Rib Cage Steel Matrix Cuirass — wearable stainless steel sculpture created ring-by-ring in our Guwahati workshop.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Custom stainless hardware",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Free Size Adjustable"
    ],
    "featured": false
  },
  {
    "id": "avz-col-chn-6",
    "sku": "AVZ-CHN-0046",
    "name": "Barbed Hardware Torso Harness",
    "category": "Body chainmail",
    "price": 4800,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Chainmail",
      "Stainless Steel",
      "Upcycled Hardware"
    ],
    "images": [
      "/assets/collection/body_chainmail/body_chainmail_04.webp"
    ],
    "image": "/assets/collection/body_chainmail/body_chainmail_04.webp",
    "description": "Barbed Hardware Torso Harness — wearable stainless steel sculpture created ring-by-ring in our Guwahati workshop.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Custom stainless hardware",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Free Size Adjustable"
    ],
    "featured": false
  },
  {
    "id": "avz-col-chn-7",
    "sku": "AVZ-CHN-0047",
    "name": "Asymmetrical Shoulder Pauldron Mail",
    "category": "Body chainmail",
    "price": 5000,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Chainmail",
      "Stainless Steel",
      "Upcycled Hardware"
    ],
    "images": [
      "/assets/collection/body_chainmail/body_chainmail_05.webp"
    ],
    "image": "/assets/collection/body_chainmail/body_chainmail_05.webp",
    "description": "Asymmetrical Shoulder Pauldron Mail — wearable stainless steel sculpture created ring-by-ring in our Guwahati workshop.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Custom stainless hardware",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Free Size Adjustable"
    ],
    "featured": false
  },
  {
    "id": "avz-col-chn-8",
    "sku": "AVZ-CHN-0048",
    "name": "Liquid Chrome Midriff Suspenders",
    "category": "Body chainmail",
    "price": 5200,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Chainmail",
      "Stainless Steel",
      "Upcycled Hardware"
    ],
    "images": [
      "/assets/collection/body_chainmail/body_chainmail_06.webp"
    ],
    "image": "/assets/collection/body_chainmail/body_chainmail_06.webp",
    "description": "Liquid Chrome Midriff Suspenders — wearable stainless steel sculpture created ring-by-ring in our Guwahati workshop.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Custom stainless hardware",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Free Size Adjustable"
    ],
    "featured": false
  },
  {
    "id": "avz-col-chn-9",
    "sku": "AVZ-CHN-0049",
    "name": "Geometric Hex-Link Chainmail Vest",
    "category": "Body chainmail",
    "price": 5400,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Chainmail",
      "Stainless Steel",
      "Upcycled Hardware"
    ],
    "images": [
      "/assets/collection/body_chainmail/body_chainmail_07.webp"
    ],
    "image": "/assets/collection/body_chainmail/body_chainmail_07.webp",
    "description": "Geometric Hex-Link Chainmail Vest — wearable stainless steel sculpture created ring-by-ring in our Guwahati workshop.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Custom stainless hardware",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Free Size Adjustable"
    ],
    "featured": false
  },
  {
    "id": "avz-col-chn-10",
    "sku": "AVZ-CHN-0050",
    "name": "Multi-Ring Cyber Body Net",
    "category": "Body chainmail",
    "price": 5600,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Chainmail",
      "Stainless Steel",
      "Upcycled Hardware"
    ],
    "images": [
      "/assets/collection/body_chainmail/body_chainmail_08.webp"
    ],
    "image": "/assets/collection/body_chainmail/body_chainmail_08.webp",
    "description": "Multi-Ring Cyber Body Net — wearable stainless steel sculpture created ring-by-ring in our Guwahati workshop.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Custom stainless hardware",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Free Size Adjustable"
    ],
    "featured": false
  },
  {
    "id": "avz-col-chn-11",
    "sku": "AVZ-CHN-0051",
    "name": "Sacred Geometry Torso Chandelier",
    "category": "Body chainmail",
    "price": 5800,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Chainmail",
      "Stainless Steel",
      "Upcycled Hardware"
    ],
    "images": [
      "/assets/collection/body_chainmail/body_chainmail_09.webp"
    ],
    "image": "/assets/collection/body_chainmail/body_chainmail_09.webp",
    "description": "Sacred Geometry Torso Chandelier — wearable stainless steel sculpture created ring-by-ring in our Guwahati workshop.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Custom stainless hardware",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Free Size Adjustable"
    ],
    "featured": false
  },
  {
    "id": "avz-col-chn-12",
    "sku": "AVZ-CHN-0052",
    "name": "Dystopian Warrior Chainmail Gorget",
    "category": "Body chainmail",
    "price": 6000,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Chainmail",
      "Stainless Steel",
      "Upcycled Hardware"
    ],
    "images": [
      "/assets/collection/body_chainmail/body_chainmail_10.webp"
    ],
    "image": "/assets/collection/body_chainmail/body_chainmail_10.webp",
    "description": "Dystopian Warrior Chainmail Gorget — wearable stainless steel sculpture created ring-by-ring in our Guwahati workshop.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Custom stainless hardware",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Free Size Adjustable"
    ],
    "featured": false
  },
  {
    "id": "avz-col-chn-13",
    "sku": "AVZ-CHN-0053",
    "name": "Obsidian Steel Scale Halter",
    "category": "Body chainmail",
    "price": 6200,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Chainmail",
      "Stainless Steel",
      "Upcycled Hardware"
    ],
    "images": [
      "/assets/collection/body_chainmail/body_chainmail_11.webp"
    ],
    "image": "/assets/collection/body_chainmail/body_chainmail_11.webp",
    "description": "Obsidian Steel Scale Halter — wearable stainless steel sculpture created ring-by-ring in our Guwahati workshop.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Custom stainless hardware",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Free Size Adjustable"
    ],
    "featured": false
  },
  {
    "id": "avz-col-chn-14",
    "sku": "AVZ-CHN-0054",
    "name": "Cyber-Goth Chain Drape Shackle",
    "category": "Body chainmail",
    "price": 6400,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Chainmail",
      "Stainless Steel",
      "Upcycled Hardware"
    ],
    "images": [
      "/assets/collection/body_chainmail/body_chainmail_12.webp"
    ],
    "image": "/assets/collection/body_chainmail/body_chainmail_12.webp",
    "description": "Cyber-Goth Chain Drape Shackle — wearable stainless steel sculpture created ring-by-ring in our Guwahati workshop.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Custom stainless hardware",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Free Size Adjustable"
    ],
    "featured": false
  },
  {
    "id": "avz-col-bra-1",
    "sku": "AVZ-BRA-0055",
    "name": "Dhristroyer Masterwork Sculpted Wire Bralette",
    "category": "Bralettes",
    "price": 3600,
    "tag": "BEST SELLER",
    "stock": 3,
    "materials": [
      "Sculpted Wire",
      "Iridescent Crystal Beads",
      "Reclaimed Metals"
    ],
    "images": [
      "/assets/collection/bralettes/bralettes_03.webp",
      "/assets/collection/bralettes/bralettes_04.webp",
      "/assets/collection/bralettes/bralettes_05.webp",
      "/assets/collection/bralettes/bralettes_06.webp",
      "/assets/collection/bralettes/bralettes_07.webp",
      "/assets/collection/bralettes/bralettes_08.webp",
      "/assets/collection/bralettes/bralettes_09.webp",
      "/assets/collection/bralettes/bralettes_10.webp"
    ],
    "image": "/assets/collection/bralettes/bralettes_03.webp",
    "description": "Dhristroyer Masterwork Sculpted Wire Bralette — Dhrisni's iconic hand-coiled wire bralette adorned with glistening beadwork. 8 editorial photoshoot angles included.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "8 distinct editorial shots available in card gallery",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS (Bust 30-32 in)",
      "S (Bust 32-34 in)",
      "M (Bust 34-36 in)"
    ],
    "featured": true
  },
  {
    "id": "avz-col-bra-2",
    "sku": "AVZ-BRA-0056",
    "name": "Spikeria Hand-Built Studded Bra",
    "category": "Bralettes",
    "price": 2900,
    "tag": "BEST SELLER",
    "stock": 4,
    "materials": [
      "Metal Spikes & Chains",
      "Upcycled Hardware",
      "Blackened Canvas"
    ],
    "images": [
      "/assets/collection/bralettes/bralettes_11.webp",
      "/assets/collection/bralettes/bralettes_12.webp",
      "/assets/collection/bralettes/bralettes_13.webp",
      "/assets/collection/bralettes/bralettes_14.webp",
      "/assets/collection/bralettes/bralettes_15.webp",
      "/assets/collection/bralettes/bralettes_16.webp",
      "/assets/collection/bralettes/bralettes_17.webp"
    ],
    "image": "/assets/collection/bralettes/bralettes_11.webp",
    "description": "Spikeria Hand-Built Studded Bra — sharp metallic cone spikes individually mounted by hand on structured cups. 7 studio shots included.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "7 distinct studio shots available in card gallery",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S (Bust 32-34 in)",
      "M (Bust 34-36 in)",
      "L (Bust 36-38 in)"
    ],
    "featured": true
  },
  {
    "id": "avz-col-bra-3",
    "sku": "AVZ-BRA-0057",
    "name": "Sculptural Kinetic Cyber Bralette",
    "category": "Bralettes",
    "price": 3200,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Industrial Wire",
      "Chrome Hardware",
      "Translucent Filaments"
    ],
    "images": [
      "/assets/collection/bralettes/bralettes_21.webp",
      "/assets/collection/bralettes/bralettes_22.webp",
      "/assets/collection/bralettes/bralettes_23.webp",
      "/assets/collection/bralettes/bralettes_24.webp",
      "/assets/collection/bralettes/bralettes_25.webp",
      "/assets/collection/bralettes/bralettes_26.webp",
      "/assets/collection/bralettes/bralettes_27.webp",
      "/assets/collection/bralettes/bralettes_28.webp",
      "/assets/collection/bralettes/bralettes_29.webp"
    ],
    "image": "/assets/collection/bralettes/bralettes_21.webp",
    "description": "Sculptural Kinetic Cyber Bralette — delicate biomorphic wire structures that contour with breathing and body motion. 9 studio angles included.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "9 distinct studio angles available in card gallery",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "Custom Fitted Bust"
    ],
    "featured": true
  },
  {
    "id": "avz-col-bra-4",
    "sku": "AVZ-BRA-0058",
    "name": "Dual Wire Cyber Shrug Bralette",
    "category": "Bralettes",
    "price": 2800,
    "tag": "STUDIO PIECE",
    "stock": 2,
    "materials": [
      "Sculpted Wire",
      "Silver Solder",
      "Chains"
    ],
    "images": [
      "/assets/collection/bralettes/bralettes_18.webp",
      "/assets/collection/bralettes/bralettes_19.webp"
    ],
    "image": "/assets/collection/bralettes/bralettes_18.webp",
    "description": "Dual Wire Cyber Shrug Bralette — twin wire tendrils that sweep from shoulder blades to sternum with crystalline beads.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "2 distinct studio shots available in card gallery",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 32-36 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-bra-5",
    "sku": "AVZ-BRA-0059",
    "name": "Circuit-Trace Kinetic Bralette",
    "category": "Bralettes",
    "price": 3100,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboard Circuits",
      "Upcycled Hardware",
      "Black Velvet Backing"
    ],
    "images": [
      "/assets/collection/bralettes/bralettes_31.webp",
      "/assets/collection/bralettes/bralettes_32.webp"
    ],
    "image": "/assets/collection/bralettes/bralettes_31.webp",
    "description": "Circuit-Trace Kinetic Bralette — deconstructed motherboard leads contoured into wearable armor with soft lining.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "2 distinct studio shots available in card gallery",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "M (Bust 34-36 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-bra-6",
    "sku": "AVZ-BRA-0060",
    "name": "Motherboard Bralette (Prototype 01)",
    "category": "Bralettes",
    "price": 2700,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Upcycled Hardware",
      "Metal Spikes & Chains",
      "Reclaimed Wire"
    ],
    "images": [
      "/assets/collection/bralettes/bralettes_01.webp"
    ],
    "image": "/assets/collection/bralettes/bralettes_01.webp",
    "description": "Motherboard Bralette (Prototype 01) — authentic 1-of-1 archival specimen hand-forged in Guwahati studio.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 32-35 in)"
    ],
    "featured": true
  },
  {
    "id": "avz-col-bra-7",
    "sku": "AVZ-BRA-0061",
    "name": "Crystalline Sculpted Cyber Bralette",
    "category": "Bralettes",
    "price": 2900,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Upcycled Hardware",
      "Metal Spikes & Chains",
      "Reclaimed Wire"
    ],
    "images": [
      "/assets/collection/bralettes/bralettes_02.webp"
    ],
    "image": "/assets/collection/bralettes/bralettes_02.webp",
    "description": "Crystalline Sculpted Cyber Bralette — authentic 1-of-1 archival specimen hand-forged in Guwahati studio.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 32-35 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-bra-8",
    "sku": "AVZ-BRA-0062",
    "name": "Barbed Wire Accented Bralette",
    "category": "Bralettes",
    "price": 3100,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Upcycled Hardware",
      "Metal Spikes & Chains",
      "Reclaimed Wire"
    ],
    "images": [
      "/assets/collection/bralettes/bralettes_20.webp"
    ],
    "image": "/assets/collection/bralettes/bralettes_20.webp",
    "description": "Barbed Wire Accented Bralette — authentic 1-of-1 archival specimen hand-forged in Guwahati studio.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 32-35 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-bra-9",
    "sku": "AVZ-BRA-0063",
    "name": "Reflective Dystopian Mesh Bralette",
    "category": "Bralettes",
    "price": 3300,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Upcycled Hardware",
      "Metal Spikes & Chains",
      "Reclaimed Wire"
    ],
    "images": [
      "/assets/collection/bralettes/bralettes_30.webp"
    ],
    "image": "/assets/collection/bralettes/bralettes_30.webp",
    "description": "Reflective Dystopian Mesh Bralette — authentic 1-of-1 archival specimen hand-forged in Guwahati studio.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 32-35 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-bra-10",
    "sku": "AVZ-BRA-0064",
    "name": "Cyberpunk Hardware Bralette Relic",
    "category": "Bralettes",
    "price": 3500,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Upcycled Hardware",
      "Metal Spikes & Chains",
      "Reclaimed Wire"
    ],
    "images": [
      "/assets/collection/bralettes/bralettes_33.webp"
    ],
    "image": "/assets/collection/bralettes/bralettes_33.webp",
    "description": "Cyberpunk Hardware Bralette Relic — authentic 1-of-1 archival specimen hand-forged in Guwahati studio.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 32-35 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-1",
    "sku": "AVZ-CRD-0065",
    "name": "Runway Kinetic Cargo Co-Ord Set",
    "category": "Co-ord sets",
    "price": 5800,
    "tag": "BEST SELLER",
    "stock": 2,
    "materials": [
      "Reclaimed Denim",
      "Industrial Carabiners",
      "Segmented Straps"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_26.webp",
      "/assets/collection/co_ords/co_ords_27.webp",
      "/assets/collection/co_ords/co_ords_28.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_26.webp",
    "description": "Runway Kinetic Cargo Co-Ord Set — matching deconstructed corset bodice and modular cargo skirt with heavy hardware suspension. 3 editorial slide angles included.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "3 distinct editorial angles in gallery",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Fit"
    ],
    "featured": true
  },
  {
    "id": "avz-col-crd-2",
    "sku": "AVZ-CRD-0066",
    "name": "Reclaimed Denim & Hardware Co-Ord Set",
    "category": "Co-ord sets",
    "price": 4900,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Raw Edge Trims"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_39.webp",
      "/assets/collection/co_ords/co_ords_40.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_39.webp",
    "description": "Reclaimed Denim & Hardware Co-Ord Set — two-piece artisanal ensemble featuring structured distressed crop bodice and asymmetric matching skirt.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "2 distinct angles in gallery",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S (Bust 32-34 in, Waist 26-27 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-3",
    "sku": "AVZ-CRD-0067",
    "name": "Subcultural Acid-Wash Denim Co-Ord",
    "category": "Co-ord sets",
    "price": 4400,
    "tag": "BEST SELLER",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_01.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_01.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": true
  },
  {
    "id": "avz-col-crd-4",
    "sku": "AVZ-CRD-0068",
    "name": "Cyber-Goth Spiked Micro Set",
    "category": "Co-ord sets",
    "price": 4650,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_02.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_02.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-5",
    "sku": "AVZ-CRD-0069",
    "name": "Liquid Metal Mesh & Denim Ensemble",
    "category": "Co-ord sets",
    "price": 4900,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_03.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_03.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-6",
    "sku": "AVZ-CRD-0070",
    "name": "Dystopian Carabiner Bustier & Skirt",
    "category": "Co-ord sets",
    "price": 5150,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_04.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_04.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-7",
    "sku": "AVZ-CRD-0071",
    "name": "Industrial Grommet Halter Set",
    "category": "Co-ord sets",
    "price": 5400,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_05.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_05.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-8",
    "sku": "AVZ-CRD-0072",
    "name": "Reconstructed Camo Kinetic Co-Ord",
    "category": "Co-ord sets",
    "price": 5650,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_06.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_06.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-9",
    "sku": "AVZ-CRD-0073",
    "name": "Raw Edge Deconstructed Duo",
    "category": "Co-ord sets",
    "price": 4400,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_07.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_07.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-10",
    "sku": "AVZ-CRD-0074",
    "name": "Hardware Suspension Festival Set",
    "category": "Co-ord sets",
    "price": 4650,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_08.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_08.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-11",
    "sku": "AVZ-CRD-0075",
    "name": "Nocturnal Armor Two-Piece Relic",
    "category": "Co-ord sets",
    "price": 4900,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_09.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_09.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-12",
    "sku": "AVZ-CRD-0076",
    "name": "Cyberpunk Utility Harness Co-Ord",
    "category": "Co-ord sets",
    "price": 5150,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_10.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_10.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-13",
    "sku": "AVZ-CRD-0077",
    "name": "Subcultural Acid-Wash Denim Co-Ord (Edition 11)",
    "category": "Co-ord sets",
    "price": 5400,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_11.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_11.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-14",
    "sku": "AVZ-CRD-0078",
    "name": "Cyber-Goth Spiked Micro Set (Edition 12)",
    "category": "Co-ord sets",
    "price": 5650,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_12.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_12.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-15",
    "sku": "AVZ-CRD-0079",
    "name": "Liquid Metal Mesh & Denim Ensemble (Edition 13)",
    "category": "Co-ord sets",
    "price": 4400,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_13.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_13.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-16",
    "sku": "AVZ-CRD-0080",
    "name": "Dystopian Carabiner Bustier & Skirt (Edition 14)",
    "category": "Co-ord sets",
    "price": 4650,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_14.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_14.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-17",
    "sku": "AVZ-CRD-0081",
    "name": "Industrial Grommet Halter Set (Edition 15)",
    "category": "Co-ord sets",
    "price": 4900,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_15.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_15.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-18",
    "sku": "AVZ-CRD-0082",
    "name": "Reconstructed Camo Kinetic Co-Ord (Edition 16)",
    "category": "Co-ord sets",
    "price": 5150,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_16.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_16.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-19",
    "sku": "AVZ-CRD-0083",
    "name": "Raw Edge Deconstructed Duo (Edition 17)",
    "category": "Co-ord sets",
    "price": 5400,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_17.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_17.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-20",
    "sku": "AVZ-CRD-0084",
    "name": "Hardware Suspension Festival Set (Edition 18)",
    "category": "Co-ord sets",
    "price": 5650,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_18.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_18.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-21",
    "sku": "AVZ-CRD-0085",
    "name": "Nocturnal Armor Two-Piece Relic (Edition 19)",
    "category": "Co-ord sets",
    "price": 4400,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_19.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_19.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-22",
    "sku": "AVZ-CRD-0086",
    "name": "Cyberpunk Utility Harness Co-Ord (Edition 20)",
    "category": "Co-ord sets",
    "price": 4650,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_20.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_20.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-23",
    "sku": "AVZ-CRD-0087",
    "name": "Subcultural Acid-Wash Denim Co-Ord (Edition 21)",
    "category": "Co-ord sets",
    "price": 4900,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_21.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_21.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-24",
    "sku": "AVZ-CRD-0088",
    "name": "Cyber-Goth Spiked Micro Set (Edition 22)",
    "category": "Co-ord sets",
    "price": 5150,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_22.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_22.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-25",
    "sku": "AVZ-CRD-0089",
    "name": "Liquid Metal Mesh & Denim Ensemble (Edition 23)",
    "category": "Co-ord sets",
    "price": 5400,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_23.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_23.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-26",
    "sku": "AVZ-CRD-0090",
    "name": "Dystopian Carabiner Bustier & Skirt (Edition 24)",
    "category": "Co-ord sets",
    "price": 5650,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_24.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_24.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-27",
    "sku": "AVZ-CRD-0091",
    "name": "Industrial Grommet Halter Set (Edition 25)",
    "category": "Co-ord sets",
    "price": 4400,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_25.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_25.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-28",
    "sku": "AVZ-CRD-0092",
    "name": "Reconstructed Camo Kinetic Co-Ord (Edition 26)",
    "category": "Co-ord sets",
    "price": 4650,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_29.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_29.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-29",
    "sku": "AVZ-CRD-0093",
    "name": "Raw Edge Deconstructed Duo (Edition 27)",
    "category": "Co-ord sets",
    "price": 4900,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_30.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_30.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-30",
    "sku": "AVZ-CRD-0094",
    "name": "Hardware Suspension Festival Set (Edition 28)",
    "category": "Co-ord sets",
    "price": 5150,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_31.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_31.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-31",
    "sku": "AVZ-CRD-0095",
    "name": "Nocturnal Armor Two-Piece Relic (Edition 29)",
    "category": "Co-ord sets",
    "price": 5400,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_32.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_32.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-32",
    "sku": "AVZ-CRD-0096",
    "name": "Cyberpunk Utility Harness Co-Ord (Edition 30)",
    "category": "Co-ord sets",
    "price": 5650,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_33.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_33.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-33",
    "sku": "AVZ-CRD-0097",
    "name": "Subcultural Acid-Wash Denim Co-Ord (Edition 31)",
    "category": "Co-ord sets",
    "price": 4400,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_34.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_34.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-34",
    "sku": "AVZ-CRD-0098",
    "name": "Cyber-Goth Spiked Micro Set (Edition 32)",
    "category": "Co-ord sets",
    "price": 4650,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_35.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_35.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-35",
    "sku": "AVZ-CRD-0099",
    "name": "Liquid Metal Mesh & Denim Ensemble (Edition 33)",
    "category": "Co-ord sets",
    "price": 4900,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_36.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_36.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-36",
    "sku": "AVZ-CRD-0100",
    "name": "Dystopian Carabiner Bustier & Skirt (Edition 34)",
    "category": "Co-ord sets",
    "price": 5150,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_37.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_37.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-crd-37",
    "sku": "AVZ-CRD-0101",
    "name": "Industrial Grommet Halter Set (Edition 35)",
    "category": "Co-ord sets",
    "price": 5400,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Reclaimed Denim",
      "Upcycled Hardware",
      "Industrial Eyelets"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_38.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_38.webp",
    "description": "Handcrafted 1-of-1 archival co-ord ensemble constructed from upcycled denim and raw metallic hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "S / M (Bust 33-36 in, Waist 26-29 in)"
    ],
    "featured": false
  },
  {
    "id": "avz-col-top-1",
    "sku": "AVZ-TOP-0102",
    "name": "Dhristroyer Motherboard Diva Top",
    "category": "Tops",
    "price": 2800,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_01.webp"
    ],
    "image": "/assets/collection/tops/tops_01.webp",
    "description": "Dhristroyer Motherboard Diva Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. ",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic 1-of-1 piece",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": true
  },
  {
    "id": "avz-col-top-2",
    "sku": "AVZ-TOP-0103",
    "name": "Hand-Riveted Spikeria Crop Top",
    "category": "Tops",
    "price": 3000,
    "tag": "BEST SELLER",
    "stock": 3,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_02.webp",
      "/assets/collection/tops/tops_03.webp"
    ],
    "image": "/assets/collection/tops/tops_02.webp",
    "description": "Hand-Riveted Spikeria Crop Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. Includes 2 distinct product shots in gallery.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "2 distinct product shots in gallery",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": true
  },
  {
    "id": "avz-col-top-3",
    "sku": "AVZ-TOP-0104",
    "name": "Salvaged PCB Cyber Gorget Top",
    "category": "Tops",
    "price": 3200,
    "tag": "BEST SELLER",
    "stock": 3,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_04.webp",
      "/assets/collection/tops/tops_05.webp"
    ],
    "image": "/assets/collection/tops/tops_04.webp",
    "description": "Salvaged PCB Cyber Gorget Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. Includes 2 distinct product shots in gallery.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "2 distinct product shots in gallery",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": true
  },
  {
    "id": "avz-col-top-4",
    "sku": "AVZ-TOP-0105",
    "name": "Stainless Steel Chainmail Halter Top",
    "category": "Tops",
    "price": 3400,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_06.webp"
    ],
    "image": "/assets/collection/tops/tops_06.webp",
    "description": "Stainless Steel Chainmail Halter Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. ",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic 1-of-1 piece",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-top-5",
    "sku": "AVZ-TOP-0106",
    "name": "Deconstructed Denim Kinetic Top",
    "category": "Tops",
    "price": 3600,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_07.webp"
    ],
    "image": "/assets/collection/tops/tops_07.webp",
    "description": "Deconstructed Denim Kinetic Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. ",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic 1-of-1 piece",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-top-6",
    "sku": "AVZ-TOP-0107",
    "name": "Crystalline Wire Sculpted Top",
    "category": "Tops",
    "price": 3800,
    "tag": "BEST SELLER",
    "stock": 3,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_08.webp",
      "/assets/collection/tops/tops_09.webp"
    ],
    "image": "/assets/collection/tops/tops_08.webp",
    "description": "Crystalline Wire Sculpted Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. Includes 2 distinct product shots in gallery.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "2 distinct product shots in gallery",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": true
  },
  {
    "id": "avz-col-top-7",
    "sku": "AVZ-TOP-0108",
    "name": "Barbed Hardware Kinetic Halter",
    "category": "Tops",
    "price": 4000,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_10.webp"
    ],
    "image": "/assets/collection/tops/tops_10.webp",
    "description": "Barbed Hardware Kinetic Halter — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. ",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic 1-of-1 piece",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-top-8",
    "sku": "AVZ-TOP-0109",
    "name": "Mechanical Keycap Mosaic Bustier Top",
    "category": "Tops",
    "price": 4200,
    "tag": "BEST SELLER",
    "stock": 3,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_11.webp",
      "/assets/collection/tops/tops_12.webp"
    ],
    "image": "/assets/collection/tops/tops_11.webp",
    "description": "Mechanical Keycap Mosaic Bustier Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. Includes 2 distinct product shots in gallery.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "2 distinct product shots in gallery",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": true
  },
  {
    "id": "avz-col-top-9",
    "sku": "AVZ-TOP-0110",
    "name": "Raw Steel O-Ring Harness Top",
    "category": "Tops",
    "price": 2800,
    "tag": "BEST SELLER",
    "stock": 3,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_13.webp",
      "/assets/collection/tops/tops_14.webp"
    ],
    "image": "/assets/collection/tops/tops_13.webp",
    "description": "Raw Steel O-Ring Harness Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. Includes 2 distinct product shots in gallery.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "2 distinct product shots in gallery",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": true
  },
  {
    "id": "avz-col-top-10",
    "sku": "AVZ-TOP-0111",
    "name": "Iridescent Pearlite Wire Crop Top",
    "category": "Tops",
    "price": 3000,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_15.webp"
    ],
    "image": "/assets/collection/tops/tops_15.webp",
    "description": "Iridescent Pearlite Wire Crop Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. ",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic 1-of-1 piece",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-top-11",
    "sku": "AVZ-TOP-0112",
    "name": "Spiked Cybernetic Shoulder Top",
    "category": "Tops",
    "price": 3200,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_16.webp"
    ],
    "image": "/assets/collection/tops/tops_16.webp",
    "description": "Spiked Cybernetic Shoulder Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. ",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic 1-of-1 piece",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-top-12",
    "sku": "AVZ-TOP-0113",
    "name": "Industrial Heavy Grommet Halter Top",
    "category": "Tops",
    "price": 3400,
    "tag": "BEST SELLER",
    "stock": 3,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_17.webp",
      "/assets/collection/tops/tops_18.webp"
    ],
    "image": "/assets/collection/tops/tops_17.webp",
    "description": "Industrial Heavy Grommet Halter Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. Includes 2 distinct product shots in gallery.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "2 distinct product shots in gallery",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": true
  },
  {
    "id": "avz-col-top-13",
    "sku": "AVZ-TOP-0114",
    "name": "Hand-Linked Stainless Mesh Top",
    "category": "Tops",
    "price": 3600,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_19.webp"
    ],
    "image": "/assets/collection/tops/tops_19.webp",
    "description": "Hand-Linked Stainless Mesh Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. ",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic 1-of-1 piece",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-top-14",
    "sku": "AVZ-TOP-0115",
    "name": "Cyber-Goth Spiked Rib Cage Top",
    "category": "Tops",
    "price": 3800,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_20.webp"
    ],
    "image": "/assets/collection/tops/tops_20.webp",
    "description": "Cyber-Goth Spiked Rib Cage Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. ",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic 1-of-1 piece",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-top-15",
    "sku": "AVZ-TOP-0116",
    "name": "Guwahati Raw Filament Wire Top",
    "category": "Tops",
    "price": 4000,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_21.webp"
    ],
    "image": "/assets/collection/tops/tops_21.webp",
    "description": "Guwahati Raw Filament Wire Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. ",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic 1-of-1 piece",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-top-16",
    "sku": "AVZ-TOP-0117",
    "name": "Multi-Chain Waterfall Torso Top",
    "category": "Tops",
    "price": 4200,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_22.webp"
    ],
    "image": "/assets/collection/tops/tops_22.webp",
    "description": "Multi-Chain Waterfall Torso Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. ",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic 1-of-1 piece",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-top-17",
    "sku": "AVZ-TOP-0118",
    "name": "Deconstructed Zipper Kinetic Top",
    "category": "Tops",
    "price": 2800,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_23.webp"
    ],
    "image": "/assets/collection/tops/tops_23.webp",
    "description": "Deconstructed Zipper Kinetic Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. ",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic 1-of-1 piece",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-top-18",
    "sku": "AVZ-TOP-0119",
    "name": "Salvaged Green PCB Statement Top",
    "category": "Tops",
    "price": 3000,
    "tag": "BEST SELLER",
    "stock": 3,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_24.webp",
      "/assets/collection/tops/tops_25.webp"
    ],
    "image": "/assets/collection/tops/tops_24.webp",
    "description": "Salvaged Green PCB Statement Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. Includes 2 distinct product shots in gallery.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "2 distinct product shots in gallery",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": true
  },
  {
    "id": "avz-col-top-19",
    "sku": "AVZ-TOP-0120",
    "name": "Stainless D-Ring Cyber Top",
    "category": "Tops",
    "price": 3200,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_26.webp"
    ],
    "image": "/assets/collection/tops/tops_26.webp",
    "description": "Stainless D-Ring Cyber Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. ",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic 1-of-1 piece",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-top-20",
    "sku": "AVZ-TOP-0121",
    "name": "Distressed Raw Edge Denim Top",
    "category": "Tops",
    "price": 3400,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_27.webp"
    ],
    "image": "/assets/collection/tops/tops_27.webp",
    "description": "Distressed Raw Edge Denim Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. ",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic 1-of-1 piece",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-top-21",
    "sku": "AVZ-TOP-0122",
    "name": "Hand-Coiled Industrial Wire Top",
    "category": "Tops",
    "price": 3600,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_28.webp"
    ],
    "image": "/assets/collection/tops/tops_28.webp",
    "description": "Hand-Coiled Industrial Wire Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. ",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic 1-of-1 piece",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-top-22",
    "sku": "AVZ-TOP-0123",
    "name": "Cyberpunk Keycap Torso Shackle Top",
    "category": "Tops",
    "price": 3800,
    "tag": "BEST SELLER",
    "stock": 3,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_29.webp",
      "/assets/collection/tops/tops_30.webp"
    ],
    "image": "/assets/collection/tops/tops_29.webp",
    "description": "Cyberpunk Keycap Torso Shackle Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. Includes 2 distinct product shots in gallery.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "2 distinct product shots in gallery",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": true
  },
  {
    "id": "avz-col-top-23",
    "sku": "AVZ-TOP-0124",
    "name": "Reconstructed Denim Bolero Top",
    "category": "Tops",
    "price": 4000,
    "tag": "BEST SELLER",
    "stock": 3,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_31.webp",
      "/assets/collection/tops/tops_32.webp"
    ],
    "image": "/assets/collection/tops/tops_31.webp",
    "description": "Reconstructed Denim Bolero Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. Includes 2 distinct product shots in gallery.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "2 distinct product shots in gallery",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": true
  },
  {
    "id": "avz-col-top-24",
    "sku": "AVZ-TOP-0125",
    "name": "Liquid Chrome Tendril Top",
    "category": "Tops",
    "price": 4200,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_33.webp"
    ],
    "image": "/assets/collection/tops/tops_33.webp",
    "description": "Liquid Chrome Tendril Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. ",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic 1-of-1 piece",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-top-25",
    "sku": "AVZ-TOP-0126",
    "name": "Subterranean Strobe Crop Top",
    "category": "Tops",
    "price": 2800,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_34.webp"
    ],
    "image": "/assets/collection/tops/tops_34.webp",
    "description": "Subterranean Strobe Crop Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. ",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic 1-of-1 piece",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-top-26",
    "sku": "AVZ-TOP-0127",
    "name": "Acid-Wash Asymmetrical Shrug Top",
    "category": "Tops",
    "price": 3000,
    "tag": "BEST SELLER",
    "stock": 3,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_35.webp",
      "/assets/collection/tops/tops_36.webp"
    ],
    "image": "/assets/collection/tops/tops_35.webp",
    "description": "Acid-Wash Asymmetrical Shrug Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. Includes 2 distinct product shots in gallery.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "2 distinct product shots in gallery",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": true
  },
  {
    "id": "avz-col-top-27",
    "sku": "AVZ-TOP-0128",
    "name": "Mermaidcore Wire Carapace Top",
    "category": "Tops",
    "price": 3200,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_37.webp"
    ],
    "image": "/assets/collection/tops/tops_37.webp",
    "description": "Mermaidcore Wire Carapace Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. ",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic 1-of-1 piece",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-top-28",
    "sku": "AVZ-TOP-0129",
    "name": "Industrial Carabiner Suspension Top",
    "category": "Tops",
    "price": 3400,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_38.webp"
    ],
    "image": "/assets/collection/tops/tops_38.webp",
    "description": "Industrial Carabiner Suspension Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. ",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic 1-of-1 piece",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-top-29",
    "sku": "AVZ-TOP-0130",
    "name": "Barbed Wire Accented Halter Top",
    "category": "Tops",
    "price": 3600,
    "tag": "BEST SELLER",
    "stock": 3,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_39.webp",
      "/assets/collection/tops/tops_40.webp"
    ],
    "image": "/assets/collection/tops/tops_39.webp",
    "description": "Barbed Wire Accented Halter Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. Includes 2 distinct product shots in gallery.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "2 distinct product shots in gallery",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": true
  },
  {
    "id": "avz-col-top-30",
    "sku": "AVZ-TOP-0131",
    "name": "Nocturnal Metal Scale Top",
    "category": "Tops",
    "price": 3800,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_41.webp"
    ],
    "image": "/assets/collection/tops/tops_41.webp",
    "description": "Nocturnal Metal Scale Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. ",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic 1-of-1 piece",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-top-31",
    "sku": "AVZ-TOP-0132",
    "name": "Reflective Wet-Look Vinyl Top",
    "category": "Tops",
    "price": 4000,
    "tag": "BEST SELLER",
    "stock": 3,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_42.webp",
      "/assets/collection/tops/tops_43.webp"
    ],
    "image": "/assets/collection/tops/tops_42.webp",
    "description": "Reflective Wet-Look Vinyl Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. Includes 2 distinct product shots in gallery.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "2 distinct product shots in gallery",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": true
  },
  {
    "id": "avz-col-top-32",
    "sku": "AVZ-TOP-0133",
    "name": "Heavy Duty Hardware Bustier Top",
    "category": "Tops",
    "price": 4200,
    "tag": "BEST SELLER",
    "stock": 3,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_44.webp",
      "/assets/collection/tops/tops_45.webp"
    ],
    "image": "/assets/collection/tops/tops_44.webp",
    "description": "Heavy Duty Hardware Bustier Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. Includes 2 distinct product shots in gallery.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "2 distinct product shots in gallery",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": true
  },
  {
    "id": "avz-col-top-33",
    "sku": "AVZ-TOP-0134",
    "name": "Cybernetic Boned Mesh Top",
    "category": "Tops",
    "price": 2800,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_46.webp"
    ],
    "image": "/assets/collection/tops/tops_46.webp",
    "description": "Cybernetic Boned Mesh Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. ",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic 1-of-1 piece",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-top-34",
    "sku": "AVZ-TOP-0135",
    "name": "Raw Edge Upcycled Denim Shrug Top",
    "category": "Tops",
    "price": 3000,
    "tag": "1 OF 1 ARCHIVE",
    "stock": 1,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_47.webp"
    ],
    "image": "/assets/collection/tops/tops_47.webp",
    "description": "Raw Edge Upcycled Denim Shrug Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. ",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic 1-of-1 piece",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": false
  },
  {
    "id": "avz-col-top-35",
    "sku": "AVZ-TOP-0136",
    "name": "Dhristroyer Crown Kinetic Top",
    "category": "Tops",
    "price": 3200,
    "tag": "BEST SELLER",
    "stock": 3,
    "materials": [
      "Motherboards & Circuits",
      "Upcycled Hardware",
      "Reclaimed Denim"
    ],
    "images": [
      "/assets/collection/tops/tops_48.webp",
      "/assets/collection/tops/tops_49.webp",
      "/assets/collection/tops/tops_50.webp"
    ],
    "image": "/assets/collection/tops/tops_48.webp",
    "description": "Dhristroyer Crown Kinetic Top — authentic wearable art top handcrafted by Dhrisni in the Guwahati studio. Includes 3 distinct product shots in gallery.",
    "details": [
      "100% Handcrafted by Dhrisni in Guwahati",
      "3 distinct product shots in gallery",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "sizes": [
      "XS / S (Bust 30-34 in)",
      "M / L (Bust 34-38 in)",
      "Custom Studio Sizing"
    ],
    "featured": true
  }
];

// AVZ MUSEUM ARCHIVE ENTRIES
export const MUSEUM_ITEMS = [
  {
    id: "mus-001",
    name: "The Original Dhristroyer Motherboard Bralette (Archived Prototype 01)",
    shortName: "Original Motherboard",
    aspectRatio: 220 / 415,
    year: "2023",
    tag: "ARCHIVE · SOLD OUT",
    materials: "Salvaged 1998 Motherboard, Copper Wire, Velvet Ties",
    priceTier: "Core Statement Pieces (₹1,000 – ₹3,000)",
    originalOwner: "Private Collection (Mumbai)",
    image: ASSET_MANIFEST.products.archiveBralette,
    story: "The piece that sparked the entire AVZ Vaganza movement. Dhrisni hand-cut an obsolete Intel Pentium motherboard on her bedroom floor using heavy garden snips. It became viral on Instagram, establishing her signature juxtaposition of cold silicon chips against soft velvet ties.",
    recreationNote: "Because computer chip layouts vary, your custom version will feature its own unique microprocessor architecture."
  },
  {
    id: "mus-002",
    name: "The Mechanical Keycap 'CTRL+Z' Choker Harness",
    shortName: "'CTRL+Z' Choker",
    aspectRatio: 360 / 460,
    year: "2024",
    tag: "ARCHIVE · SOLD OUT",
    materials: "IBM Model M Keycaps, Silver Chainmail, Stainless Steel Carabiner",
    priceTier: "Accessories & Small Pieces (Under ₹1,000)",
    originalOwner: "Created for Boiler Room Delhi",
    image: ASSET_MANIFEST.products.beadedBralette,
    story: "Worn under strobe lights at an underground warehouse rave. The mechanical keys click when tapped, making it an interactive audio-visual garment.",
    recreationNote: "Keycap labels and colors can be customized to your preferred keyboard shortcuts."
  },
  {
    id: "mus-003",
    name: "The Heavy Industry Spiked Moto Shrug",
    shortName: "Spiked Moto Shrug",
    aspectRatio: 245 / 435,
    year: "2024",
    tag: "ARCHIVE · SOLD OUT",
    materials: "Reclaimed Biker Leather, 72 Solid Steel Spikes, Raw Hardware",
    priceTier: "Full Outfits & Heavy Art (₹3,000+)",
    originalOwner: "Custom Order (Berlin)",
    image: ASSET_MANIFEST.products.reworkedJacket,
    story: "Constructed from a discarded 1980s motorcycle jacket found in a thrift crate in Guwahati. Cropped high above the bust line, with massive chrome shoulders that evoke dystopian post-apocalyptic royalty.",
    recreationNote: "Requires full shoulder and arm measurements for custom armhole drafting."
  },
  {
    id: "mus-004",
    name: "Mermaidcore Cyber-Chitin Bodice",
    shortName: "Cyber-Chitin Bodice",
    aspectRatio: 832 / 1152,
    year: "2024",
    tag: "ARCHIVE · SOLD OUT",
    materials: "Iridescent Tech Scrap, Wire Weave, Glass Crystal Beads",
    priceTier: "Core Statement Pieces (₹1,000 – ₹3,000)",
    originalOwner: "Fashion Creator Editorial Feature",
    image: ASSET_MANIFEST.editorialHero,
    story: "A synthesis of oceanic biological curves and synthetic e-waste. Reflects baby pink and lavender iridescence under directional lighting.",
    recreationNote: "Takes 3 weeks of delicate wire sculpting."
  }
];

// FEATURED PIECES (BEST SELLERS) — Curated from authentic studio vault
export const FEATURED_PIECES = [
  {
    "id": "featured-01",
    "sku": "AVZ-FT-001",
    "name": "Dhristroyer Cyberpunk Motherboard Bralette",
    "title": "Dhristroyer Cyberpunk Motherboard Bralette",
    "category": "Bralettes",
    "price": 3800,
    "tag": "BEST SELLER",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_01.webp",
    "images": [
      "/assets/featured/featured_01.webp"
    ],
    "imgUrl": "/assets/featured/featured_01.webp",
    "alt": "Dhristroyer Cyberpunk Motherboard Bralette",
    "description": "Dhristroyer Cyberpunk Motherboard Bralette — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-02",
    "sku": "AVZ-FT-002",
    "name": "Hand-Riveted Spikeria Bodice Armor",
    "title": "Hand-Riveted Spikeria Bodice Armor",
    "category": "Corsets",
    "price": 4500,
    "tag": "STUDIO 1-OF-1",
    "stock": 1,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_02.webp",
    "images": [
      "/assets/featured/featured_02.webp"
    ],
    "imgUrl": "/assets/featured/featured_02.webp",
    "alt": "Hand-Riveted Spikeria Bodice Armor",
    "description": "Hand-Riveted Spikeria Bodice Armor — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-03",
    "sku": "AVZ-FT-003",
    "name": "Guwahati Stainless Chainmail Cuirass",
    "title": "Guwahati Stainless Chainmail Cuirass",
    "category": "Body chainmail",
    "price": 5200,
    "tag": "BEST SELLER",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_03.webp",
    "images": [
      "/assets/featured/featured_03.webp"
    ],
    "imgUrl": "/assets/featured/featured_03.webp",
    "alt": "Guwahati Stainless Chainmail Cuirass",
    "description": "Guwahati Stainless Chainmail Cuirass — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-04",
    "sku": "AVZ-FT-004",
    "name": "Salvaged Circuit Motherboard Gauntlet",
    "title": "Salvaged Circuit Motherboard Gauntlet",
    "category": "Arm cuffs",
    "price": 1800,
    "tag": "UPCYCLED TECH",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_04.webp",
    "images": [
      "/assets/featured/featured_04.webp"
    ],
    "imgUrl": "/assets/featured/featured_04.webp",
    "alt": "Salvaged Circuit Motherboard Gauntlet",
    "description": "Salvaged Circuit Motherboard Gauntlet — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-05",
    "sku": "AVZ-FT-005",
    "name": "Deconstructed Syllabic Denim Kinetic Relic",
    "title": "Deconstructed Syllabic Denim Kinetic Relic",
    "category": "Jackets",
    "price": 4600,
    "tag": "ARCHIVE 1-OF-1",
    "stock": 1,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_05.webp",
    "images": [
      "/assets/featured/featured_05.webp"
    ],
    "imgUrl": "/assets/featured/featured_05.webp",
    "alt": "Deconstructed Syllabic Denim Kinetic Relic",
    "description": "Deconstructed Syllabic Denim Kinetic Relic — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-06",
    "sku": "AVZ-FT-006",
    "name": "Crystalline Sculpted Wire Cyber Bralette",
    "title": "Crystalline Sculpted Wire Cyber Bralette",
    "category": "Bralettes",
    "price": 3200,
    "tag": "BEST SELLER",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_06.webp",
    "images": [
      "/assets/featured/featured_06.webp"
    ],
    "imgUrl": "/assets/featured/featured_06.webp",
    "alt": "Crystalline Sculpted Wire Cyber Bralette",
    "description": "Crystalline Sculpted Wire Cyber Bralette — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-07",
    "sku": "AVZ-FT-007",
    "name": "Hardware Diva Spiked Shrug Corset",
    "title": "Hardware Diva Spiked Shrug Corset",
    "category": "Corsets",
    "price": 4200,
    "tag": "RUNWAY ICON",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_07.webp",
    "images": [
      "/assets/featured/featured_07.webp"
    ],
    "imgUrl": "/assets/featured/featured_07.webp",
    "alt": "Hardware Diva Spiked Shrug Corset",
    "description": "Hardware Diva Spiked Shrug Corset — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-08",
    "sku": "AVZ-FT-008",
    "name": "Sacred Heart Barbed Wire Collar",
    "title": "Sacred Heart Barbed Wire Collar",
    "category": "Neckpieces",
    "price": 2100,
    "tag": "BEST SELLER",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_08.webp",
    "images": [
      "/assets/featured/featured_08.webp"
    ],
    "imgUrl": "/assets/featured/featured_08.webp",
    "alt": "Sacred Heart Barbed Wire Collar",
    "description": "Sacred Heart Barbed Wire Collar — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-09",
    "sku": "AVZ-FT-009",
    "name": "Mechanical Keycap Cyber Corset Top",
    "title": "Mechanical Keycap Cyber Corset Top",
    "category": "Tops",
    "price": 3500,
    "tag": "ARCHIVE 1-OF-1",
    "stock": 1,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_09.webp",
    "images": [
      "/assets/featured/featured_09.webp"
    ],
    "imgUrl": "/assets/featured/featured_09.webp",
    "alt": "Mechanical Keycap Cyber Corset Top",
    "description": "Mechanical Keycap Cyber Corset Top — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-10",
    "sku": "AVZ-FT-010",
    "name": "Raw Steel O-Ring Harness Matrix",
    "title": "Raw Steel O-Ring Harness Matrix",
    "category": "Belts",
    "price": 2400,
    "tag": "BEST SELLER",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_10.webp",
    "images": [
      "/assets/featured/featured_10.webp"
    ],
    "imgUrl": "/assets/featured/featured_10.webp",
    "alt": "Raw Steel O-Ring Harness Matrix",
    "description": "Raw Steel O-Ring Harness Matrix — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-11",
    "sku": "AVZ-FT-011",
    "name": "Iridescent Pearlite Wire Choker",
    "title": "Iridescent Pearlite Wire Choker",
    "category": "Neckpieces",
    "price": 1600,
    "tag": "STUDIO PIECE",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_11.webp",
    "images": [
      "/assets/featured/featured_11.webp"
    ],
    "imgUrl": "/assets/featured/featured_11.webp",
    "alt": "Iridescent Pearlite Wire Choker",
    "description": "Iridescent Pearlite Wire Choker — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-12",
    "sku": "AVZ-FT-012",
    "name": "Spiked Cybernetic Moto Shoulder Guard",
    "title": "Spiked Cybernetic Moto Shoulder Guard",
    "category": "Arm cuffs",
    "price": 2900,
    "tag": "BEST SELLER",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_12.webp",
    "images": [
      "/assets/featured/featured_12.webp"
    ],
    "imgUrl": "/assets/featured/featured_12.webp",
    "alt": "Spiked Cybernetic Moto Shoulder Guard",
    "description": "Spiked Cybernetic Moto Shoulder Guard — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-13",
    "sku": "AVZ-FT-013",
    "name": "Distressed Reworked Denim Micro-Bustier",
    "title": "Distressed Reworked Denim Micro-Bustier",
    "category": "Corsets",
    "price": 3100,
    "tag": "BEST SELLER",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_13.webp",
    "images": [
      "/assets/featured/featured_13.webp"
    ],
    "imgUrl": "/assets/featured/featured_13.webp",
    "alt": "Distressed Reworked Denim Micro-Bustier",
    "description": "Distressed Reworked Denim Micro-Bustier — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-14",
    "sku": "AVZ-FT-014",
    "name": "Liquid Chrome Spine Vertebrae Harness",
    "title": "Liquid Chrome Spine Vertebrae Harness",
    "category": "Body chainmail",
    "price": 4800,
    "tag": "ARCHIVE 1-OF-1",
    "stock": 1,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_14.webp",
    "images": [
      "/assets/featured/featured_14.webp"
    ],
    "imgUrl": "/assets/featured/featured_14.webp",
    "alt": "Liquid Chrome Spine Vertebrae Harness",
    "description": "Liquid Chrome Spine Vertebrae Harness — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-15",
    "sku": "AVZ-FT-015",
    "name": "Sculpted Crochet Balaclava & Wire Halo",
    "title": "Sculpted Crochet Balaclava & Wire Halo",
    "category": "Headgear",
    "price": 2800,
    "tag": "BEST SELLER",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_15.webp",
    "images": [
      "/assets/featured/featured_15.webp"
    ],
    "imgUrl": "/assets/featured/featured_15.webp",
    "alt": "Sculpted Crochet Balaclava & Wire Halo",
    "description": "Sculpted Crochet Balaclava & Wire Halo — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-16",
    "sku": "AVZ-FT-016",
    "name": "Acid-Wash Reclaimed Hardware Cargo Skirt",
    "title": "Acid-Wash Reclaimed Hardware Cargo Skirt",
    "category": "Skirts",
    "price": 3600,
    "tag": "STUDIO PIECE",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_16.webp",
    "images": [
      "/assets/featured/featured_16.webp"
    ],
    "imgUrl": "/assets/featured/featured_16.webp",
    "alt": "Acid-Wash Reclaimed Hardware Cargo Skirt",
    "description": "Acid-Wash Reclaimed Hardware Cargo Skirt — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-17",
    "sku": "AVZ-FT-017",
    "name": "Industrial Heavy Grommet Halter Top",
    "title": "Industrial Heavy Grommet Halter Top",
    "category": "Tops",
    "price": 2600,
    "tag": "BEST SELLER",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_17.webp",
    "images": [
      "/assets/featured/featured_17.webp"
    ],
    "imgUrl": "/assets/featured/featured_17.webp",
    "alt": "Industrial Heavy Grommet Halter Top",
    "description": "Industrial Heavy Grommet Halter Top — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-18",
    "sku": "AVZ-FT-018",
    "name": "Motherboard Core Micro Handbag Relic",
    "title": "Motherboard Core Micro Handbag Relic",
    "category": "Bags",
    "price": 2200,
    "tag": "UPCYCLED TECH",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_18.webp",
    "images": [
      "/assets/featured/featured_18.webp"
    ],
    "imgUrl": "/assets/featured/featured_18.webp",
    "alt": "Motherboard Core Micro Handbag Relic",
    "description": "Motherboard Core Micro Handbag Relic — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-19",
    "sku": "AVZ-FT-019",
    "name": "Hand-Linked Stainless Mesh Slip Top",
    "title": "Hand-Linked Stainless Mesh Slip Top",
    "category": "Tops",
    "price": 3900,
    "tag": "BEST SELLER",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_19.webp",
    "images": [
      "/assets/featured/featured_19.webp"
    ],
    "imgUrl": "/assets/featured/featured_19.webp",
    "alt": "Hand-Linked Stainless Mesh Slip Top",
    "description": "Hand-Linked Stainless Mesh Slip Top — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-20",
    "sku": "AVZ-FT-020",
    "name": "Barbed Hardware Kinetic Choker",
    "title": "Barbed Hardware Kinetic Choker",
    "category": "Neckpieces",
    "price": 1750,
    "tag": "STUDIO PIECE",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_20.webp",
    "images": [
      "/assets/featured/featured_20.webp"
    ],
    "imgUrl": "/assets/featured/featured_20.webp",
    "alt": "Barbed Hardware Kinetic Choker",
    "description": "Barbed Hardware Kinetic Choker — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-21",
    "sku": "AVZ-FT-021",
    "name": "Cyber-Goth Spiked Rib Cage Bodice",
    "title": "Cyber-Goth Spiked Rib Cage Bodice",
    "category": "Corsets",
    "price": 4600,
    "tag": "ARCHIVE 1-OF-1",
    "stock": 1,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_21.webp",
    "images": [
      "/assets/featured/featured_21.webp"
    ],
    "imgUrl": "/assets/featured/featured_21.webp",
    "alt": "Cyber-Goth Spiked Rib Cage Bodice",
    "description": "Cyber-Goth Spiked Rib Cage Bodice — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-22",
    "sku": "AVZ-FT-022",
    "name": "Guwahati Studio Raw Filament Wire Bra",
    "title": "Guwahati Studio Raw Filament Wire Bra",
    "category": "Bralettes",
    "price": 2700,
    "tag": "BEST SELLER",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_22.webp",
    "images": [
      "/assets/featured/featured_22.webp"
    ],
    "imgUrl": "/assets/featured/featured_22.webp",
    "alt": "Guwahati Studio Raw Filament Wire Bra",
    "description": "Guwahati Studio Raw Filament Wire Bra — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-23",
    "sku": "AVZ-FT-023",
    "name": "Multi-Chain Waterfall Torso Armor",
    "title": "Multi-Chain Waterfall Torso Armor",
    "category": "Body chainmail",
    "price": 4900,
    "tag": "BEST SELLER",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_23.webp",
    "images": [
      "/assets/featured/featured_23.webp"
    ],
    "imgUrl": "/assets/featured/featured_23.webp",
    "alt": "Multi-Chain Waterfall Torso Armor",
    "description": "Multi-Chain Waterfall Torso Armor — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-24",
    "sku": "AVZ-FT-024",
    "name": "Reconstructed Denim Shrug & Sleeve Bolero",
    "title": "Reconstructed Denim Shrug & Sleeve Bolero",
    "category": "Jackets",
    "price": 3800,
    "tag": "ARCHIVE 1-OF-1",
    "stock": 1,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_24.webp",
    "images": [
      "/assets/featured/featured_24.webp"
    ],
    "imgUrl": "/assets/featured/featured_24.webp",
    "alt": "Reconstructed Denim Shrug & Sleeve Bolero",
    "description": "Reconstructed Denim Shrug & Sleeve Bolero — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-25",
    "sku": "AVZ-FT-025",
    "name": "Cone-Spike Chained Gauntlet Band",
    "title": "Cone-Spike Chained Gauntlet Band",
    "category": "Arm cuffs",
    "price": 1950,
    "tag": "STUDIO PIECE",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_25.webp",
    "images": [
      "/assets/featured/featured_25.webp"
    ],
    "imgUrl": "/assets/featured/featured_25.webp",
    "alt": "Cone-Spike Chained Gauntlet Band",
    "description": "Cone-Spike Chained Gauntlet Band — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-26",
    "sku": "AVZ-FT-026",
    "name": "Circuit-Trace Kinetic Medallion",
    "title": "Circuit-Trace Kinetic Medallion",
    "category": "Neckpieces",
    "price": 1450,
    "tag": "BEST SELLER",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_26.webp",
    "images": [
      "/assets/featured/featured_26.webp"
    ],
    "imgUrl": "/assets/featured/featured_26.webp",
    "alt": "Circuit-Trace Kinetic Medallion",
    "description": "Circuit-Trace Kinetic Medallion — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-27",
    "sku": "AVZ-FT-027",
    "name": "Sculptural Wire Mermaidcore Headband",
    "title": "Sculptural Wire Mermaidcore Headband",
    "category": "Headgear",
    "price": 2100,
    "tag": "STUDIO PIECE",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_27.webp",
    "images": [
      "/assets/featured/featured_27.webp"
    ],
    "imgUrl": "/assets/featured/featured_27.webp",
    "alt": "Sculptural Wire Mermaidcore Headband",
    "description": "Sculptural Wire Mermaidcore Headband — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-28",
    "sku": "AVZ-FT-028",
    "name": "Heavy Carabiner Utility Suspender Harness",
    "title": "Heavy Carabiner Utility Suspender Harness",
    "category": "Belts",
    "price": 2750,
    "tag": "BEST SELLER",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_28.webp",
    "images": [
      "/assets/featured/featured_28.webp"
    ],
    "imgUrl": "/assets/featured/featured_28.webp",
    "alt": "Heavy Carabiner Utility Suspender Harness",
    "description": "Heavy Carabiner Utility Suspender Harness — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-29",
    "sku": "AVZ-FT-029",
    "name": "Hand-Pleated Reworked Camo Bustier",
    "title": "Hand-Pleated Reworked Camo Bustier",
    "category": "Corsets",
    "price": 3400,
    "tag": "ARCHIVE 1-OF-1",
    "stock": 1,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_29.webp",
    "images": [
      "/assets/featured/featured_29.webp"
    ],
    "imgUrl": "/assets/featured/featured_29.webp",
    "alt": "Hand-Pleated Reworked Camo Bustier",
    "description": "Hand-Pleated Reworked Camo Bustier — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-30",
    "sku": "AVZ-FT-030",
    "name": "Spike-Studded Asymmetric Collar Piece",
    "title": "Spike-Studded Asymmetric Collar Piece",
    "category": "Neckpieces",
    "price": 1850,
    "tag": "BEST SELLER",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_30.webp",
    "images": [
      "/assets/featured/featured_30.webp"
    ],
    "imgUrl": "/assets/featured/featured_30.webp",
    "alt": "Spike-Studded Asymmetric Collar Piece",
    "description": "Spike-Studded Asymmetric Collar Piece — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-31",
    "sku": "AVZ-FT-031",
    "name": "Stainless Steel Mesh Thigh Holster Relic",
    "title": "Stainless Steel Mesh Thigh Holster Relic",
    "category": "Belts",
    "price": 2950,
    "tag": "STUDIO PIECE",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_31.webp",
    "images": [
      "/assets/featured/featured_31.webp"
    ],
    "imgUrl": "/assets/featured/featured_31.webp",
    "alt": "Stainless Steel Mesh Thigh Holster Relic",
    "description": "Stainless Steel Mesh Thigh Holster Relic — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-32",
    "sku": "AVZ-FT-032",
    "name": "Deconstructed Zipper Kinetic Mesh Top",
    "title": "Deconstructed Zipper Kinetic Mesh Top",
    "category": "Tops",
    "price": 3300,
    "tag": "BEST SELLER",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_32.webp",
    "images": [
      "/assets/featured/featured_32.webp"
    ],
    "imgUrl": "/assets/featured/featured_32.webp",
    "alt": "Deconstructed Zipper Kinetic Mesh Top",
    "description": "Deconstructed Zipper Kinetic Mesh Top — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-33",
    "sku": "AVZ-FT-033",
    "name": "Salvaged Green PCB Statement Gorget",
    "title": "Salvaged Green PCB Statement Gorget",
    "category": "Neckpieces",
    "price": 2250,
    "tag": "UPCYCLED TECH",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_33.webp",
    "images": [
      "/assets/featured/featured_33.webp"
    ],
    "imgUrl": "/assets/featured/featured_33.webp",
    "alt": "Salvaged Green PCB Statement Gorget",
    "description": "Salvaged Green PCB Statement Gorget — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-34",
    "sku": "AVZ-FT-034",
    "name": "Hand-Forged Chainmail Cyber Bralette",
    "title": "Hand-Forged Chainmail Cyber Bralette",
    "category": "Bralettes",
    "price": 4100,
    "tag": "BEST SELLER",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_34.webp",
    "images": [
      "/assets/featured/featured_34.webp"
    ],
    "imgUrl": "/assets/featured/featured_34.webp",
    "alt": "Hand-Forged Chainmail Cyber Bralette",
    "description": "Hand-Forged Chainmail Cyber Bralette — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-35",
    "sku": "AVZ-FT-035",
    "name": "Multi-Buckle Industrial Waist Cincher",
    "title": "Multi-Buckle Industrial Waist Cincher",
    "category": "Corsets",
    "price": 3600,
    "tag": "ARCHIVE 1-OF-1",
    "stock": 1,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_35.webp",
    "images": [
      "/assets/featured/featured_35.webp"
    ],
    "imgUrl": "/assets/featured/featured_35.webp",
    "alt": "Multi-Buckle Industrial Waist Cincher",
    "description": "Multi-Buckle Industrial Waist Cincher — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-36",
    "sku": "AVZ-FT-036",
    "name": "Reclaimed Cable & Pearlite Cyber Tiara",
    "title": "Reclaimed Cable & Pearlite Cyber Tiara",
    "category": "Headgear",
    "price": 2500,
    "tag": "STUDIO PIECE",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_36.webp",
    "images": [
      "/assets/featured/featured_36.webp"
    ],
    "imgUrl": "/assets/featured/featured_36.webp",
    "alt": "Reclaimed Cable & Pearlite Cyber Tiara",
    "description": "Reclaimed Cable & Pearlite Cyber Tiara — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-37",
    "sku": "AVZ-FT-037",
    "name": "Layered Ringlet & Chain Shoulder Harness",
    "title": "Layered Ringlet & Chain Shoulder Harness",
    "category": "Body chainmail",
    "price": 4300,
    "tag": "BEST SELLER",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_37.webp",
    "images": [
      "/assets/featured/featured_37.webp"
    ],
    "imgUrl": "/assets/featured/featured_37.webp",
    "alt": "Layered Ringlet & Chain Shoulder Harness",
    "description": "Layered Ringlet & Chain Shoulder Harness — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-38",
    "sku": "AVZ-FT-038",
    "name": "Deconstructed Cyber Denim Flares (Archival)",
    "title": "Deconstructed Cyber Denim Flares (Archival)",
    "category": "Pants",
    "price": 4900,
    "tag": "ARCHIVE 1-OF-1",
    "stock": 1,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_38.webp",
    "images": [
      "/assets/featured/featured_38.webp"
    ],
    "imgUrl": "/assets/featured/featured_38.webp",
    "alt": "Deconstructed Cyber Denim Flares (Archival)",
    "description": "Deconstructed Cyber Denim Flares (Archival) — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-39",
    "sku": "AVZ-FT-039",
    "name": "Spike-Encrusted Bicep Armor Band",
    "title": "Spike-Encrusted Bicep Armor Band",
    "category": "Arm cuffs",
    "price": 1650,
    "tag": "BEST SELLER",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_39.webp",
    "images": [
      "/assets/featured/featured_39.webp"
    ],
    "imgUrl": "/assets/featured/featured_39.webp",
    "alt": "Spike-Encrusted Bicep Armor Band",
    "description": "Spike-Encrusted Bicep Armor Band — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-40",
    "sku": "AVZ-FT-040",
    "name": "Motherboard Fragment Heart Locket",
    "title": "Motherboard Fragment Heart Locket",
    "category": "Neckpieces",
    "price": 1550,
    "tag": "STUDIO PIECE",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_40.webp",
    "images": [
      "/assets/featured/featured_40.webp"
    ],
    "imgUrl": "/assets/featured/featured_40.webp",
    "alt": "Motherboard Fragment Heart Locket",
    "description": "Motherboard Fragment Heart Locket — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-41",
    "sku": "AVZ-FT-041",
    "name": "Sculpted Silver Wire Tendril Bustier",
    "title": "Sculpted Silver Wire Tendril Bustier",
    "category": "Corsets",
    "price": 4700,
    "tag": "ARCHIVE 1-OF-1",
    "stock": 1,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_41.webp",
    "images": [
      "/assets/featured/featured_41.webp"
    ],
    "imgUrl": "/assets/featured/featured_41.webp",
    "alt": "Sculpted Silver Wire Tendril Bustier",
    "description": "Sculpted Silver Wire Tendril Bustier — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-42",
    "sku": "AVZ-FT-042",
    "name": "Multi-Grommet Reclaimed Strap Shrug",
    "title": "Multi-Grommet Reclaimed Strap Shrug",
    "category": "Jackets",
    "price": 3500,
    "tag": "BEST SELLER",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_42.webp",
    "images": [
      "/assets/featured/featured_42.webp"
    ],
    "imgUrl": "/assets/featured/featured_42.webp",
    "alt": "Multi-Grommet Reclaimed Strap Shrug",
    "description": "Multi-Grommet Reclaimed Strap Shrug — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-43",
    "sku": "AVZ-FT-043",
    "name": "Stainless D-Ring Cyber Bralette",
    "title": "Stainless D-Ring Cyber Bralette",
    "category": "Bralettes",
    "price": 3000,
    "tag": "STUDIO PIECE",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_43.webp",
    "images": [
      "/assets/featured/featured_43.webp"
    ],
    "imgUrl": "/assets/featured/featured_43.webp",
    "alt": "Stainless D-Ring Cyber Bralette",
    "description": "Stainless D-Ring Cyber Bralette — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-44",
    "sku": "AVZ-FT-044",
    "name": "Distressed Heavy Raw Edge Denim Corset",
    "title": "Distressed Heavy Raw Edge Denim Corset",
    "category": "Corsets",
    "price": 3350,
    "tag": "BEST SELLER",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_44.webp",
    "images": [
      "/assets/featured/featured_44.webp"
    ],
    "imgUrl": "/assets/featured/featured_44.webp",
    "alt": "Distressed Heavy Raw Edge Denim Corset",
    "description": "Distressed Heavy Raw Edge Denim Corset — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-46",
    "sku": "AVZ-FT-045",
    "name": "Hand-Coiled Industrial Wire Gauntlet",
    "title": "Hand-Coiled Industrial Wire Gauntlet",
    "category": "Arm cuffs",
    "price": 2200,
    "tag": "STUDIO PIECE",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_46.webp",
    "images": [
      "/assets/featured/featured_46.webp"
    ],
    "imgUrl": "/assets/featured/featured_46.webp",
    "alt": "Hand-Coiled Industrial Wire Gauntlet",
    "description": "Hand-Coiled Industrial Wire Gauntlet — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-47",
    "sku": "AVZ-FT-046",
    "name": "Barbed Wire Chainmail Spine Drape",
    "title": "Barbed Wire Chainmail Spine Drape",
    "category": "Body chainmail",
    "price": 5400,
    "tag": "ARCHIVE 1-OF-1",
    "stock": 1,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_47.webp",
    "images": [
      "/assets/featured/featured_47.webp"
    ],
    "imgUrl": "/assets/featured/featured_47.webp",
    "alt": "Barbed Wire Chainmail Spine Drape",
    "description": "Barbed Wire Chainmail Spine Drape — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-48",
    "sku": "AVZ-FT-047",
    "name": "Cyberpunk Keycap Wrist Shackle",
    "title": "Cyberpunk Keycap Wrist Shackle",
    "category": "Arm cuffs",
    "price": 1400,
    "tag": "UPCYCLED TECH",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_48.webp",
    "images": [
      "/assets/featured/featured_48.webp"
    ],
    "imgUrl": "/assets/featured/featured_48.webp",
    "alt": "Cyberpunk Keycap Wrist Shackle",
    "description": "Cyberpunk Keycap Wrist Shackle — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-49",
    "sku": "AVZ-FT-048",
    "name": "Reconstructed Denim Waterfall Bolero",
    "title": "Reconstructed Denim Waterfall Bolero",
    "category": "Jackets",
    "price": 3950,
    "tag": "BEST SELLER",
    "stock": 5,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_49.webp",
    "images": [
      "/assets/featured/featured_49.webp"
    ],
    "imgUrl": "/assets/featured/featured_49.webp",
    "alt": "Reconstructed Denim Waterfall Bolero",
    "description": "Reconstructed Denim Waterfall Bolero — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-50",
    "sku": "AVZ-FT-049",
    "name": "Dhristroyer Signature Spikeria Apex Bodice",
    "title": "Dhristroyer Signature Spikeria Apex Bodice",
    "category": "Corsets",
    "price": 4800,
    "tag": "ARCHIVE 1-OF-1",
    "stock": 1,
    "materials": [
      "Upcycled Hardware",
      "Reclaimed Metals",
      "Artisanal Studio Elements"
    ],
    "image": "/assets/featured/featured_50.webp",
    "images": [
      "/assets/featured/featured_50.webp"
    ],
    "imgUrl": "/assets/featured/featured_50.webp",
    "alt": "Dhristroyer Signature Spikeria Apex Bodice",
    "description": "Dhristroyer Signature Spikeria Apex Bodice — authentic wearable art creation handcrafted by Dhrisni in the Guwahati studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in the Guwahati studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "XS / S",
      "M / L",
      "Custom Studio Sizing"
    ],
    "inMuseum": false,
    "featured": true
  }
];

// LOOKBOOK EDITORIAL CAMPAIGNS — Shot and directed by Dhrisni
export const LOOKBOOK_ENTRIES = [
  {
    "id": "look-01",
    "code": "LOOK 001 • THE SEVERED CIRCUIT",
    "title": "The Severed Circuit",
    "subtitle": "Silicon Corsetry at the Intersection of Tech & Haute Rebellion",
    "image": "/assets/lookbook/lookbook_01.webp",
    "altImages": [
      "/assets/lookbook/lookbook_02.webp"
    ],
    "aspect": "portrait",
    "caption": "Model styled in Motherboard Diva Top and Spike Cuffs under high-intensity neon.",
    "story": "What happens when the technology designed to automate us is dismantled and reclaimed to adorn us? Dhrisni treats circuit boards not as e-waste, but as sacred cybernetic armor.",
    "materials": "Reclaimed Motherboards, 16-Gauge Copper Wire, Industrial Rivets",
    "vibe": "Cyberpunk Couture"
  },
  {
    "id": "look-02",
    "code": "LOOK 002 • GUWAHATI TACTILE GRIT",
    "title": "Raw Hands, Pure Grit",
    "subtitle": "Studio Stories & Hand-Linked Armor from Assam",
    "image": "/assets/lookbook/lookbook_03.webp",
    "altImages": [
      "/assets/lookbook/lookbook_04.webp"
    ],
    "aspect": "portrait",
    "caption": "Behind the scenes at the Guwahati workshop. Hand-threading 16-gauge chain links.",
    "story": "Every piece passes through Dhrisni's hands and the women she has personally trained. No conveyor belts. No sweatshops. Just pure tactile rebellion.",
    "materials": "Deconstructed Electronic Boards, Steel Ringlets, High-Tensile Filament",
    "vibe": "Artisanal Maximalism"
  },
  {
    "id": "look-03",
    "code": "LOOK 003 • SOFT ARMOUR AFTER HOURS",
    "title": "Soft Armour After Hours",
    "subtitle": "Nightlife Velocity, Subculture & Archival Protection",
    "image": "/assets/lookbook/lookbook_05.webp",
    "altImages": [
      "/assets/lookbook/lookbook_06.webp"
    ],
    "aspect": "portrait",
    "caption": "The Spiked Moto Shrug and Mesh Bralette captured in low-light rave velocity.",
    "story": "AVZ clothes are built to move, sweat, dance, and hold space. They are defensive mechanisms against conformity and boring parties.",
    "materials": "Distressed Heavy Denim, Industrial Zippers, Barbed Hardware",
    "vibe": "Cyber-Grunge"
  },
  {
    "id": "look-04",
    "code": "LOOK 004 • WATERFALL KINETIC DRIFT",
    "title": "Cascading Silver Relic",
    "subtitle": "Organic Fluidity Clashing With Cold Stainless Steel",
    "image": "/assets/lookbook/lookbook_07.webp",
    "altImages": [
      "/assets/lookbook/lookbook_08.webp"
    ],
    "aspect": "landscape",
    "caption": "Archival kinetic chain cuirass styled in dramatic outdoor mountain waterfall shoot.",
    "story": "Shot on location against rushing mountain currents. The liquid steel mesh catches refracted water droplets like synthetic dragon scales.",
    "materials": "Stainless Mesh, Heavy O-Rings, Water-Resistant Hardware",
    "vibe": "Mermaidcore Brutalism"
  },
  {
    "id": "look-05",
    "code": "LOOK 005 • REWORKED ROMANCE",
    "title": "Reworked Romance",
    "subtitle": "Tenderness Clashing With Cold Metal Clasps",
    "image": "/assets/lookbook/lookbook_09.webp",
    "altImages": [
      "/assets/lookbook/lookbook_10.webp"
    ],
    "aspect": "portrait",
    "caption": "Dystopian Co-ord set styled with delicate lace and heavy carabiners.",
    "story": "Maximalism doesn't mean harshness. It means feeling everything at maximum volume, where sweet romantic silhouettes collide with raw mechanics.",
    "materials": "Upcycled Denim, Carabiner Clasps, Safety Wire Accents",
    "vibe": "Post-Apocalyptic Romance"
  },
  {
    "id": "look-06",
    "code": "LOOK 006 • LIQUID STEEL EXOSKELETON",
    "title": "Liquid Steel Exoskeleton",
    "subtitle": "Over 1,200 Hand-Linked Stainless Steel Rings",
    "image": "/assets/lookbook/lookbook_11.webp",
    "altImages": [
      "/assets/lookbook/lookbook_12.webp"
    ],
    "aspect": "portrait",
    "caption": "Heavy fluid chain drape that flexes with bodily contours.",
    "story": "A modern homage to medieval body protection transformed into sultry clubwear armor. Cold to the touch, heavy in weight, impossible to ignore.",
    "materials": "16-Gauge Stainless Steel, Glass Beads, Chrome Buckles",
    "vibe": "Medieval Futurism"
  },
  {
    "id": "look-07",
    "code": "LOOK 007 • GLITCH HARNESS MATRIX",
    "title": "Subcultural Bodice Spikes",
    "subtitle": "Aggressive Geometry & Architectural Curves",
    "image": "/assets/lookbook/lookbook_13.webp",
    "altImages": [
      "/assets/lookbook/lookbook_14.webp"
    ],
    "aspect": "portrait",
    "caption": "Cone spikes precision-mounted on recycled structural denim framework.",
    "story": "Defensive fashion engineered for those who refuse to be touched without permission. A sharp statement of autonomy and raw self-possession.",
    "materials": "Heavy Cone Spikes, Reclaimed Black Denim, Reinforced Eyelets",
    "vibe": "Dark Industrial Punk"
  },
  {
    "id": "look-08",
    "code": "LOOK 008 • NEON SUBTERRANEAN",
    "title": "Subterranean Cyber Pulse",
    "subtitle": "Low-Frequency Night Visions & High-Gloss Hardware",
    "image": "/assets/lookbook/lookbook_15.webp",
    "altImages": [
      "/assets/lookbook/lookbook_16.webp"
    ],
    "aspect": "portrait",
    "caption": "Strobe-lit editorial framing the reflective polymer corset.",
    "story": "Born from late-night studio sessions in Guwahati where discarded tech finds second life under UV strobe pulses.",
    "materials": "Reflective Polymer, Salvaged Cables, Industrial Grommets",
    "vibe": "Cyber-Underground"
  },
  {
    "id": "look-09",
    "code": "LOOK 009 • THE MONOLITHIC DRAPE",
    "title": "Monolithic Mesh Shroud",
    "subtitle": "Heavyweight Architectural Drapes with Bare Midriff",
    "image": "/assets/lookbook/lookbook_17.webp",
    "altImages": [
      "/assets/lookbook/lookbook_18.webp"
    ],
    "aspect": "portrait",
    "caption": "High-contrast studio silhouette capturing structural drape.",
    "story": "Balancing monumental industrial mass with delicate, exposed human skin. Structural tension made wearable.",
    "materials": "Steel Weave Mesh, Chrome D-Rings, Weathered Canvas",
    "vibe": "Industrial Gothic"
  },
  {
    "id": "look-10",
    "code": "LOOK 010 • ETHEREAL CHITIN WIRE",
    "title": "Crystalline Wire Chitin",
    "subtitle": "Bespoke Hand-Sculpted Wire & Iridescent Facets",
    "image": "/assets/lookbook/lookbook_19.webp",
    "altImages": [
      "/assets/lookbook/lookbook_20.webp"
    ],
    "aspect": "portrait",
    "caption": "Intricate wire-sculpted bralette reflecting directional studio keylights.",
    "story": "Organic curves mimicking alien carapace and deep-sea coral. Delicate in appearance, remarkably rigid in structural form.",
    "materials": "Hand-Coiled Silver Wire, Crystal Beads, Fiber Optics",
    "vibe": "Mermaidcore Glitch"
  },
  {
    "id": "look-11",
    "code": "LOOK 011 • THE DECONSTRUCTED REBEL",
    "title": "Syllabic Denim Kinetic Shrug",
    "subtitle": "Multi-Zipped Reclaimed Denim & Exposed Seams",
    "image": "/assets/lookbook/lookbook_21.webp",
    "altImages": [
      "/assets/lookbook/lookbook_22.webp"
    ],
    "aspect": "portrait",
    "caption": "Modular denim shrug styled with raw edge distressing.",
    "story": "Rescuing denim destined for landfills and reconstructing it into modular streetwear that transforms on the body.",
    "materials": "Upcycled Denim Trove, Chunky YKK Zippers, Copper Rivets",
    "vibe": "Tactile Street Couture"
  },
  {
    "id": "look-12",
    "code": "LOOK 012 • TECH SCRAP GORGET",
    "title": "Silicon Choker & Collar Armor",
    "subtitle": "Golden Trace Pathways Salvaged from Obsolete Servers",
    "image": "/assets/lookbook/lookbook_23.webp",
    "altImages": [
      "/assets/lookbook/lookbook_24.webp"
    ],
    "aspect": "portrait",
    "caption": "Close-up editorial crop highlighting microscopic copper circuits.",
    "story": "Why should microchips stay hidden inside plastic shells? Dhrisni surfaces the hidden beauty of the machine age.",
    "materials": "Motherboard Fragments, Gold-Plated Leads, Velvet Backing",
    "vibe": "Tech-Deco"
  },
  {
    "id": "look-13",
    "code": "LOOK 013 • DARK CARAPACE CUIRASS",
    "title": "Riveted Obsidian Armor",
    "subtitle": "Form-Fitted Bodice with Asymmetrical Cone Spikes",
    "image": "/assets/lookbook/lookbook_25.webp",
    "altImages": [
      "/assets/lookbook/lookbook_26.webp"
    ],
    "aspect": "portrait",
    "caption": "Low-angle editorial angle highlighting sculpted metallic breastplate.",
    "story": "Designed to intimidate and empower. An impenetrable outer shell for the nocturnal warrior.",
    "materials": "Heavy Gauge Blackened Steel, Reinforced Canvas, Leather Straps",
    "vibe": "Aggressive Haute"
  },
  {
    "id": "look-14",
    "code": "LOOK 014 • VERTEBRAE HARNESS DRIFT",
    "title": "Biomechanical Spine Cage",
    "subtitle": "Articulated Chrome Segments Tracing the Backbone",
    "image": "/assets/lookbook/lookbook_27.webp",
    "altImages": [
      "/assets/lookbook/lookbook_28.webp"
    ],
    "aspect": "portrait",
    "caption": "Rear editorial view capturing spine articulation.",
    "story": "Tracing the curve of the human spine with cold metallic geometry. Every link moves harmoniously with body articulation.",
    "materials": "Articulated Chrome Hardware, Heavy O-Rings, Ball Chains",
    "vibe": "Biomechanical Couture"
  },
  {
    "id": "look-15",
    "code": "LOOK 015 • DYSTOPIAN CO-ORD DRIFT",
    "title": "Industrial Cargo Relic",
    "subtitle": "Segmented Pockets & Heavy Strap Suspensions",
    "image": "/assets/lookbook/lookbook_29.webp",
    "altImages": [
      "/assets/lookbook/lookbook_30.webp"
    ],
    "aspect": "portrait",
    "caption": "Full-length runway frame showcasing segmented pocket harness.",
    "story": "Utilitarian functionality elevated to conceptual runway high fashion. Ready for any subcultural battlefield.",
    "materials": "Heavy Twill, Webbing Straps, Quick-Release Buckles",
    "vibe": "Cyber-Military"
  },
  {
    "id": "look-16",
    "code": "LOOK 016 • RAINWEAR MATRIX",
    "title": "Hyper-Gloss Wet-Look Shrug",
    "subtitle": "Reflective Industrial Textures Meeting Cold Metal Clad",
    "image": "/assets/lookbook/lookbook_31.webp",
    "altImages": [
      "/assets/lookbook/lookbook_32.webp"
    ],
    "aspect": "portrait",
    "caption": "Moody ambient editorial capturing high-gloss vinyl reflections.",
    "story": "Reflecting neon city lights across drenched pavements. The armor of the late-night nomad.",
    "materials": "High-Gloss Vinyl, Steel Eyelets, Heavy Chains",
    "vibe": "Dark Wave"
  },
  {
    "id": "look-17",
    "code": "LOOK 017 • CROCHET MEETS CHROME",
    "title": "Hand-Knit Balaclava Halo",
    "subtitle": "Soft Hand-Dyed Yarn Encircled with Metallic Spikes",
    "image": "/assets/lookbook/lookbook_33.webp",
    "altImages": [
      "/assets/lookbook/lookbook_34.webp"
    ],
    "aspect": "square",
    "caption": "Editorial portrait showcasing the spiked crochet balaclava.",
    "story": "The ultimate paradox: cozy artisanal knitting weaponized with sharp industrial steel.",
    "materials": "Assam Cotton Yarn, Nickel Spikes, Steel Wire Frame",
    "vibe": "Avant-Garde Rave"
  },
  {
    "id": "look-18",
    "code": "LOOK 018 • KEYCAP RELIC CORSET",
    "title": "Mechanical Keycap Mosaic",
    "subtitle": "Hundreds of Mechanical Keyboard Switches Hand-Set",
    "image": "/assets/lookbook/lookbook_35.webp",
    "altImages": [
      "/assets/lookbook/lookbook_36.webp"
    ],
    "aspect": "portrait",
    "caption": "Micro-detail crop of vintage mechanical keyboard bodice.",
    "story": "Typing out a tactile love letter to obsolete computing. Every key tells a forgotten story of human input.",
    "materials": "Vintage Keycaps, Reclaimed Wire, Structural Canvas",
    "vibe": "Post-Digital Art"
  },
  {
    "id": "look-19",
    "code": "LOOK 019 • LIQUID CHAINMAIL DRAPE",
    "title": "Cascading Haltermail",
    "subtitle": "Fluid Drapes of Polished Stainless Chain Links",
    "image": "/assets/lookbook/lookbook_37.webp",
    "altImages": [
      "/assets/lookbook/lookbook_38.webp"
    ],
    "aspect": "portrait",
    "caption": "Dynamic model pose demonstrating chainmail fluidity.",
    "story": "Like liquid silver poured over collarbones and torso. Breathes with the wearer with reassuring weight.",
    "materials": "18-Gauge Mirror-Polish Rings, Lobster Clasps",
    "vibe": "Haute Armor"
  },
  {
    "id": "look-20",
    "code": "LOOK 020 • THE BARBED HALO",
    "title": "Barbed Wire Headpiece",
    "subtitle": "Blunted Steel Wire Hand-Shaped into Crown Silhouette",
    "image": "/assets/lookbook/lookbook_39.webp",
    "altImages": [
      "/assets/lookbook/lookbook_40.webp"
    ],
    "aspect": "portrait",
    "caption": "Studio headshot capturing illuminated barbed halo.",
    "story": "Subverting religious iconography into modern subcultural empowerment. A crown for those who rule themselves.",
    "materials": "Decorative Barbed Wire, Silver Filigree, Glass Drops",
    "vibe": "Gothic Iconography"
  },
  {
    "id": "look-21",
    "code": "LOOK 021 • ASYMMETRICAL ACID BOLERO",
    "title": "Acid-Washed Denim Sleeve Bolero",
    "subtitle": "One-Sleeve Architectural Construct with Chain Swags",
    "image": "/assets/lookbook/lookbook_41.webp",
    "altImages": [
      "/assets/lookbook/lookbook_42.webp"
    ],
    "aspect": "portrait",
    "caption": "Action editorial capture featuring one-sleeve chain swing.",
    "story": "Deliberate asymmetry breaking all rules of conventional garment drafting. Bold, disruptive, and effortless.",
    "materials": "Acid-Wash Reclaimed Denim, Heavy Steel Swags",
    "vibe": "Experimental Streetwear"
  },
  {
    "id": "look-22",
    "code": "LOOK 022 • CYBERNETIC GIRDLE",
    "title": "High-Waist Hardware Girdle",
    "subtitle": "Dual Steel Ribs with Center Zipper Suspension",
    "image": "/assets/lookbook/lookbook_43.webp",
    "altImages": [
      "/assets/lookbook/lookbook_44.webp"
    ],
    "aspect": "portrait",
    "caption": "Close crop of cinched waist construction and dual roller buckles.",
    "story": "Cinched geometry engineered to hold structure without compromising ease of motion on the dance floor.",
    "materials": "Steel Boning, Heavy Gauge Elastic, Roller Buckles",
    "vibe": "Industrial Fetish"
  },
  {
    "id": "look-23",
    "code": "LOOK 023 • THE SHADOW CUIRASS",
    "title": "Matte Black Steel Cuirass",
    "subtitle": "Individually Cut Metal Scales Riveted to Black Denim",
    "image": "/assets/lookbook/lookbook_45.webp",
    "altImages": [
      "/assets/lookbook/lookbook_46.webp"
    ],
    "aspect": "portrait",
    "caption": "Sculptural silhouette in low-key studio lighting.",
    "story": "Subtle yet lethal. Under ambient light, the scales shimmer like beetle wings in darkness.",
    "materials": "Powder-Coated Steel Scales, Waxed Thread, Black Denim",
    "vibe": "Nocturnal Armor"
  },
  {
    "id": "look-24",
    "code": "LOOK 024 • THE CHROME CORONA",
    "title": "Radial Wire Sunburst Shrug",
    "subtitle": "Stiffened Wire Tendrils Projecting outward from Shoulders",
    "image": "/assets/lookbook/lookbook_47.webp",
    "altImages": [
      "/assets/lookbook/lookbook_48.webp"
    ],
    "aspect": "portrait",
    "caption": "Dramatic wide-angle frame showcasing the radial sunburst silhouette.",
    "story": "An explosive silhouette that demands respect and commands physical space in any room.",
    "materials": "Spring Steel Wire, Silver Solder, Leather Epaulettes",
    "vibe": "Celestial Cyberpunk"
  },
  {
    "id": "look-25",
    "code": "LOOK 025 • DHRISTROYER APEX EDITORIAL",
    "title": "Dhristroyer Apex Campaign",
    "subtitle": "Creative Direction & Styling by Dhrisni — The Masterwork",
    "image": "/assets/lookbook/lookbook_49.webp",
    "altImages": [
      "/assets/lookbook/lookbook_50.webp"
    ],
    "aspect": "portrait",
    "caption": "Signature editorial campaign portrait directed by Dhrisni in Guwahati.",
    "story": "The definitive statement of Aveezah Vaganza. A manifesto written in solder, denim, and steel by Dhristroyer herself.",
    "materials": "Upcycled Motherboards, Hand-Linked Stainless Rings, Studio Relics",
    "vibe": "Crown Archival Art"
  }
];

// OFFICIAL FAQS FROM QUESTIONNAIRE
export const FAQS = [
  {
    q: "What is AVZ Vaganza (Aveezah Vaganza) and who is behind it?",
    a: "AVZ Vaganza (Aveezah Vaganza) is an independent, sustainable, and alternative high fashion label founded, directed, and designed by Dhrisni, also known online as Dhristroyer. Dhrisni is an artist first who also works across modeling, acting, and digital creation, and she pours her entire creative soul into building wearable art rather than factory-made fast fashion."
  },
  {
    q: "Where did the brand start?",
    a: "It started out of pure rebellion. Growing up in a household where strict clothing rules meant no revealing outfits or even sleeveless tops, Dhrisni had to find an outlet for her creativity. She grabbed a pair of scissors, started cutting up her own clothes for Instagram, and never looked back."
  },
  {
    q: "What is the design philosophy of AVZ Vaganza?",
    a: "Absolute maximalism, texture, chaos, and grit. The brand fiercely rejects minimalism, cookie-cutter aesthetics, and AI-generated sameness. It specializes in subcultural styles like cyber-grunge, Y2K, mermaidcore, industrial punk, and avant-garde streetwear, built from non-traditional materials like computer motherboards, mechanical keyboard keycaps, chainmail, metal spikes, and upcycled hardware."
  },
  {
    q: "Are the pieces mass-produced?",
    a: "Never. AVZ Vaganza does not care about mass quantities or factory lines because the focus is entirely on craftsmanship, raw materials, and keeping true, tangible art alive. The brand exclusively hires and trains women directly under Dhrisni's supervision to handcraft the pieces. In a world drowning in fast fashion and digital convenience, things made by real human hands are the ultimate luxury."
  },
  {
    q: "Can I order past designs or custom pieces from the archive?",
    a: "Yes, through the AVZ Museum and vault archive. Sold-out or past custom pieces can be re-created for you, but because everything is hand-built with upcycled components and raw hardware, no two items will ever be an exact replica. Every custom order is one-of-a-kind and made specially for you."
  },
  {
    q: "What are the pricing tiers and timelines for custom orders?",
    a: "• Accessories and small pieces (wire pieces, keycap jewelry, small hardware): Under ₹1,000.\n• Core statement pieces (bralettes, corsets, skirts, custom tops): ₹1,000 – ₹3,000.\n• Full custom outfits and heavy art (complex hardware outfits, jackets, structured remakes): ₹3,000 and above.\nBecause every piece is meticulously built from scratch by hand, custom orders typically take 2 to 3 weeks to complete."
  },
  {
    q: "What is your return and exchange policy?",
    a: "We accept returns if there is visible damage on the product, or replacement if there is a sizing issue. Because of the delicate and one-of-a-kind nature of the garments, an uncut unboxing video must be sent to our official WhatsApp concierge for damage claims."
  },
  {
    q: "What does the packaging include?",
    a: "Every order arrives in cute signature boxes with AVZ logos, freebies on eligible orders, personalized thank-you cards from Dhrisni, and delicious artisanal chocolates."
  }
];

// CURRENCY CONVERSION (INR Default with clean rates for all major global currencies)
export const CURRENCIES = {
  INR: { symbol: "₹", rate: 1, label: "INR (₹)", name: "Indian Rupee", flag: "🇮🇳" },
  USD: { symbol: "$", rate: 0.012, label: "USD ($)", name: "US Dollar", flag: "🇺🇸" },
  EUR: { symbol: "€", rate: 0.011, label: "EUR (€)", name: "Euro", flag: "🇪🇺" },
  GBP: { symbol: "£", rate: 0.0095, label: "GBP (£)", name: "British Pound", flag: "🇬🇧" },
  CAD: { symbol: "CA$", rate: 0.016, label: "CAD (CA$)", name: "Canadian Dollar", flag: "🇨🇦" },
  AUD: { symbol: "A$", rate: 0.018, label: "AUD (A$)", name: "Australian Dollar", flag: "🇦🇺" },
  JPY: { symbol: "¥", rate: 1.80, label: "JPY (¥)", name: "Japanese Yen", flag: "🇯🇵" },
  AED: { symbol: "AED ", rate: 0.044, label: "AED (AED)", name: "UAE Dirham", flag: "🇦🇪" },
  SGD: { symbol: "SG$", rate: 0.016, label: "SGD (SG$)", name: "Singapore Dollar", flag: "🇸🇬" },
  CHF: { symbol: "CHF ", rate: 0.0105, label: "CHF (CHF)", name: "Swiss Franc", flag: "🇨🇭" }
};

export function formatPrice(priceInInr, currencyKey = 'INR') {
  const curr = CURRENCIES[currencyKey] || CURRENCIES.INR;
  const converted = Math.round(priceInInr * curr.rate);
  return `${curr.symbol}${converted.toLocaleString()}`;
}
