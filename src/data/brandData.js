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

// REAL PRODUCT CATALOGUE — seeded from Patheros Labs inventory (IN0001–IN0024)
export const PRODUCTS = [
  {
    id: "avz-001",
    sku: "IN0001",
    name: "Spikeria Bra",
    category: "Bralettes",
    price: 1999,
    tag: "HAND-BUILT",
    stock: 50,
    materials: ["Metal Spikes & Chains", "Upcycled Hardware"],
    images: ["/assets/product_spike_bra.jpg", "/assets/product_beaded_bralette.jpg", "/assets/editorial_hero_portrait.jpg"],
    description: "Bra with spikes studded — a bold statement piece featuring individually hand-set metallic cone spikes on a form-fitted bra base. Cold-forged rebellion in wearable form.",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: ["S (Bust 32-34in)", "M (Bust 34-36in)", "L (Bust 36-38in)"],
    inMuseum: false,
    featured: true
  },
  {
    id: "avz-002",
    sku: "IN0002",
    name: "Keyboard Bra",
    category: "Bralettes",
    price: 2500,
    tag: "HAND-BUILT",
    stock: 100,
    materials: ["Keycaps & Tech Scrap", "Upcycled Hardware"],
    images: ["/assets/product_beaded_bralette.jpg", "/assets/editorial_hero_portrait.jpg"],
    description: "Bra with keyboard keys studded across the cups — mechanical keyboard keycaps hand-mounted on a structured bra base. Where tech trash meets torso art.",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: ["S (Bust 32-34in)", "M (Bust 34-36in)", "L (Bust 36-38in)"],
    inMuseum: false,
    featured: true
  },
  {
    id: "avz-003",
    sku: "IN0003",
    name: "Jersey Co-Ord Set",
    category: "Co-ord sets",
    price: 3500,
    tag: "ONE OF ONE",
    stock: 1,
    materials: ["Reclaimed Denim", "Upcycled Hardware"],
    images: ["/assets/product_coord_set.jpg", "/assets/editorial_hero_portrait.jpg"],
    description: "Jersey upcycled corset & skirt co-ord set — reclaimed jersey fabric reconstructed into a matching corset-bodice and midi skirt. Sustainable maximalism at its finest.",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: ["Size: Small"],
    inMuseum: false,
    featured: true
  },
  {
    id: "avz-004",
    sku: "IN0004",
    name: "Spike Arm Cuffs",
    category: "Arm cuffs",
    price: 600,
    tag: "UNDER ₹1K",
    stock: 30,
    materials: ["Metal Spikes & Chains", "Upcycled Hardware"],
    images: ["/assets/prod_motherboard_cuff.jpg", "/assets/editorial_hero_portrait.jpg"],
    description: "Arm cuffs with spikes — wrist and forearm cuffs loaded with hand-set metallic spikes. The ultimate punk accessory for festival and editorial looks.",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: ["One Size (Adjustable)"],
    inMuseum: false,
    featured: false
  },
  {
    id: "avz-005",
    sku: "IN0005",
    name: "Frills Belt Purple",
    category: "Belts",
    price: 800,
    tag: "ONE OF ONE",
    stock: 1,
    materials: ["Upcycled Hardware"],
    images: ["/assets/product_archive_bralette.jpg", "/assets/editorial_hero_portrait.jpg"],
    description: "Belt with fabrics hanging — a statement belt in deep purple with cascading fabric frills and draped ribbon accents. Structural accessory with fashion-forward attitude.",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: ["One Size (Adjustable)"],
    inMuseum: false,
    featured: false
  },
  {
    id: "avz-006",
    sku: "IN0006",
    name: "Spike Beaded Bralette Chainmail",
    category: "Bralettes",
    price: 1800,
    tag: "HAND-BUILT",
    stock: 5,
    materials: ["Chainmail", "Metal Spikes & Chains", "Upcycled Hardware"],
    images: ["/assets/product_beaded_bralette.jpg", "/assets/editorial_hero_portrait.jpg"],
    description: "Beaded bralette with spikes and punk theme — an intricate fusion of hand-beaded bralette construction, chainmail links, and metallic spike detailing. Statement armor for the fearless.",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: ["S (Bust 32-34in)", "M (Bust 34-36in)"],
    inMuseum: false,
    featured: true
  },
  {
    id: "avz-007",
    sku: "IN0007",
    name: "Psychedelic Brown Denim Bag",
    category: "Bags",
    price: 999,
    tag: "ONE OF ONE",
    stock: 1,
    materials: ["Reclaimed Denim", "Upcycled Hardware"],
    images: ["/assets/product_reworked_jacket.jpg", "/assets/editorial_hero_portrait.jpg"],
    description: "Bag with acid paint denim jeans upcycled — a one-of-a-kind bag reconstructed from acid-washed and hand-painted denim jeans. No two are alike, all are chaotic.",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: ["One Size"],
    inMuseum: false,
    featured: false
  },
  {
    id: "avz-008",
    sku: "IN0008",
    name: "Spike Tube Top",
    category: "Tops",
    price: 2000,
    tag: "HAND-BUILT",
    stock: 3,
    materials: ["Metal Spikes & Chains", "Upcycled Hardware"],
    images: ["/assets/product_spike_bra.jpg", "/assets/product_spike_top.jpg", "/assets/editorial_hero_portrait.jpg"],
    description: "Tube top in rexine black with spikes forming a cross pattern — a sleek black rexine-based tube top with individually placed metallic spikes arranged in a dramatic cross motif across the chest.",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: ["XS-S (Bust 30-33in)", "M-L (Bust 34-37in)"],
    inMuseum: false,
    featured: true
  },
  {
    id: "avz-009",
    sku: "IN0009",
    name: "Purple Jibaro Cross Top",
    category: "Tops",
    price: 1500,
    tag: "ONE OF ONE",
    stock: 1,
    materials: ["Upcycled Hardware"],
    images: ["/assets/product_diva_top.jpg", "/assets/product_spike_top.jpg", "/assets/editorial_hero_portrait.jpg"],
    description: "Cross top halter purple with gold and red embellishment — a dramatic halter-neck cross-top in deep purple, lavishly embellished with gold threadwork and blood-red accent gems. Inspired by the Jibaro aesthetic.",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: ["Size: Small"],
    inMuseum: false,
    featured: true
  },
  {
    id: "avz-010",
    sku: "IN0010",
    name: "Chainmail Bra",
    category: "Bralettes",
    price: 1800,
    tag: "HAND-BUILT",
    stock: 50,
    materials: ["Chainmail", "Metal Spikes & Chains"],
    images: ["/assets/look_chainmail_armor.jpg", "/assets/product_beaded_bralette.jpg", "/assets/editorial_hero_portrait.jpg"],
    description: "Bra made out of chain links — a full-coverage bra constructed entirely from hand-linked stainless steel chain rings. Over 800 individual links woven ring-by-ring. Fluid metallic armor.",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: ["S (Bust 32-34in)", "M (Bust 34-36in)", "L (Bust 36-38in)"],
    inMuseum: false,
    featured: true
  },
  {
    id: "avz-011",
    sku: "IN0011",
    name: "Purple Pink Beaded Bralette",
    category: "Bralettes",
    price: 1500,
    tag: "ONE OF ONE",
    stock: 1,
    materials: ["Upcycled Hardware"],
    images: ["/assets/product_beaded_bralette.jpg", "/assets/editorial_hero_portrait.jpg"],
    description: "Bralette / body chain made with pink and purple beads — a hand-strung beaded bralette doubling as a body chain, in a vivid pink and purple palette. Part jewelry, part fashion, entirely unique.",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: ["One Size (Adjustable Body Chain)"],
    inMuseum: false,
    featured: false
  },
  {
    id: "avz-012",
    sku: "IN0012",
    name: "Apex Cuffs",
    category: "Arm cuffs",
    price: 499,
    tag: "UNDER ₹1K",
    stock: 10,
    materials: ["Metal Spikes & Chains", "Upcycled Hardware"],
    images: ["/assets/prod_motherboard_cuff.jpg", "/assets/editorial_hero_portrait.jpg"],
    description: "Hand cuffs with spikes — a dramatic pair of wrist cuffs adorned with sharp metallic spikes. The Apex Cuffs are statement accessories designed for editorial and performance.",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: ["One Size (Adjustable)"],
    inMuseum: false,
    featured: false
  },
  {
    id: "avz-013",
    sku: "IN0013",
    name: "Denim Upcycled Headgear",
    category: "Headgear",
    price: 1700,
    tag: "ONE OF ONE",
    stock: 1,
    materials: ["Reclaimed Denim", "Upcycled Hardware"],
    images: ["/assets/product_reworked_jacket.jpg", "/assets/product_archive_bralette.jpg", "/assets/editorial_hero_portrait.jpg"],
    description: "Denim headgear with green plastic bottle flowers and ribbons and laces vaganza — an extraordinary headpiece reconstructed from upcycled denim, embellished with flowers crafted from reclaimed plastic bottles, ribbons, and lace.",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: ["One Size"],
    inMuseum: false,
    featured: false
  },
  {
    id: "avz-014",
    sku: "IN0014",
    name: "Jhumka Jacket",
    category: "Jackets",
    price: 2600,
    tag: "ONE OF ONE",
    stock: 1,
    materials: ["Upcycled Hardware"],
    images: ["/assets/product_reworked_jacket.jpg", "/assets/editorial_hero_portrait.jpg"],
    description: "Jacket fur brown with jhumkhas — a luxuriant brown fur jacket adorned with traditional Indian jhumka (chandelier earring) hardware as decorative closures and embellishments. East meets avant-garde.",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: ["Size: Free Size/Oversized"],
    inMuseum: false,
    featured: true
  },
  {
    id: "avz-015",
    sku: "IN0015",
    name: "Black Cat Co-Ord Set",
    category: "Co-ord sets",
    price: 2200,
    tag: "ONE OF ONE",
    stock: 1,
    materials: ["Upcycled Hardware", "Metal Spikes & Chains"],
    images: ["/assets/product_coord_set.jpg", "/assets/editorial_hero_portrait.jpg"],
    description: "Silver corset and black fur skirt — a fierce co-ord set pairing a structured silver-tone corset with a lush black faux-fur mini skirt. Statement dressing for the unafraid.",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: ["Size: Small"],
    inMuseum: false,
    featured: true
  },
  {
    id: "avz-016",
    sku: "IN0016",
    name: "Cheetah Print Cavewoman Set",
    category: "Co-ord sets",
    price: 1999,
    tag: "ONE OF ONE",
    stock: 1,
    materials: ["Upcycled Hardware"],
    images: ["/assets/product_coord_set.jpg", "/assets/editorial_hero_portrait.jpg"],
    description: "Cavewoman bra and leopard skirt — a primal power set featuring a hand-constructed cheetah-print bralette and matching leopard-print micro skirt. Unapologetically wild.",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: ["Size: 34 Medium"],
    inMuseum: false,
    featured: false
  },
  {
    id: "avz-017",
    sku: "IN0017",
    name: "Silver Jesus Cross Charm Top",
    category: "Tops",
    price: 999,
    tag: "SOLD OUT",
    stock: 0,
    materials: ["Metal Spikes & Chains", "Upcycled Hardware"],
    images: ["/assets/product_spike_bra.jpg", "/assets/product_spike_top.jpg", "/assets/editorial_hero_portrait.jpg"],
    description: "Cross shape halter top with black butterfly choker and silver elements — a sculptural halter top cut in a cross silhouette, paired with a matching black butterfly choker and draped silver chain elements.",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: ["Size: Small"],
    inMuseum: false,
    featured: false
  },
  {
    id: "avz-018",
    sku: "IN0018",
    name: "Flowery Crochet Top",
    category: "Tops",
    price: 1799,
    tag: "SMALL RUN",
    stock: 6,
    materials: ["Upcycled Hardware"],
    images: ["/assets/product_archive_bralette.jpg", "/assets/product_spike_top.jpg", "/assets/editorial_hero_portrait.jpg"],
    description: "Crocheted top with flowers multi colored — a hand-crocheted crop top blooming with multi-colored floral motifs. Each stitch is a small act of rebellion against the mass-produced and the mundane.",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: ["XS-S", "M-L"],
    inMuseum: false,
    featured: false
  },
  {
    id: "avz-019",
    sku: "IN0019",
    name: "Pearlite Crochet Top",
    category: "Tops",
    price: 1500,
    tag: "HAND-BUILT",
    stock: 12,
    materials: ["Upcycled Hardware"],
    images: ["/assets/product_beaded_bralette.jpg", "/assets/product_spike_top.jpg", "/assets/editorial_hero_portrait.jpg"],
    description: "White pearls crocheted on bikini top — a delicate yet bold bikini-style crop top with genuine freshwater pearls hand-crocheted into the construction. Mermaidcore meets punk maximalism.",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: ["XS-S (Bust 30-33in)", "M-L (Bust 34-37in)"],
    inMuseum: false,
    featured: true
  },
  {
    id: "avz-020",
    sku: "IN0020",
    name: "Barbie Set",
    category: "Co-ord sets",
    price: 3500,
    tag: "HAND-BUILT",
    stock: 12,
    materials: ["Upcycled Hardware"],
    images: ["/assets/product_coord_set.jpg", "/assets/editorial_hero_portrait.jpg"],
    description: "Pink starfish bra + Barbie short skirt + green & pink fluffy headgear — the ultimate maximalist set. A pink starfish-studded bra, Barbie-pink micro skirt, and a matching green-and-pink fluffy headpiece. Camp at its finest.",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: ["XS-S", "M-L"],
    inMuseum: false,
    featured: true
  },
  {
    id: "avz-021",
    sku: "IN0021",
    name: "Spiral Body Chainmail Top",
    category: "Body chainmail",
    price: 2500,
    tag: "ONE OF ONE",
    stock: 1,
    materials: ["Chainmail", "Industrial Wire", "Metal Spikes & Chains"],
    images: ["/assets/look_chainmail_armor.jpg", "/assets/editorial_hero_portrait.jpg"],
    description: "Spiral wired chained top in silver — an architectural silver-tone body top constructed with spiral-wired chainmail in a sculptural drape over the torso. Structural and otherworldly.",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: ["One Size (Adjustable)"],
    inMuseum: false,
    featured: true
  },
  {
    id: "avz-022",
    sku: "IN0022",
    name: "Cross Tape Bralette",
    category: "Bralettes",
    price: 1200,
    tag: "SMALL RUN",
    stock: 18,
    materials: ["Upcycled Hardware"],
    images: ["/assets/product_spike_bra.jpg", "/assets/product_beaded_bralette.jpg", "/assets/editorial_hero_portrait.jpg"],
    description: "Bralette in the illusion of taped bust — a minimal yet striking bralette that creates the visual illusion of a tape-bound look through precise structural fabric work. Available in multiple runs.",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: ["XS-S", "S-M", "M-L"],
    inMuseum: false,
    featured: false
  },
  {
    id: "avz-023",
    sku: "IN0023",
    name: "Spike Grey Blouse",
    category: "Tops",
    price: 2000,
    tag: "ONE OF ONE",
    stock: 1,
    materials: ["Metal Spikes & Chains", "Upcycled Hardware"],
    images: ["/assets/product_spike_bra.jpg", "/assets/product_spike_top.jpg", "/assets/editorial_hero_portrait.jpg"],
    description: "Blouse with spikes — a structured grey blouse with metallic spike embellishments arranged in precise formations. Statement ready-to-wear for the maximalist wardrobe.",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: ["Size: Small-Medium"],
    inMuseum: false,
    featured: false
  },
  {
    id: "avz-024",
    sku: "IN0024",
    name: "Silver Shoe Corset & Skirt Set",
    category: "Co-ord sets",
    price: 3500,
    tag: "ONE OF ONE",
    stock: 1,
    materials: ["Upcycled Hardware", "Reclaimed Denim"],
    images: ["/assets/look_spike_bodice.jpg", "/assets/product_coord_set.jpg", "/assets/editorial_hero_portrait.jpg"],
    description: "Corset in silver color made out of shoe and brown fur, with a matching skirt — a truly one-of-a-kind set where shoes are deconstructed and rebuilt into a sculptural silver corset, paired with a brown fur skirt.",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: ["One Size (Custom Fit)"],
    inMuseum: false,
    featured: true
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

// LOOKBOOK EDITORIAL CAMPAIGNS
export const LOOKBOOK_ENTRIES = [
  {
    id: "look-01",
    code: "LOOK 001 • THE SEVERED CIRCUIT",
    title: "The Severed Circuit",
    subtitle: "Silicon Corsetry at the Intersection of Tech & Haute Rebellion",
    image: ASSET_MANIFEST.editorialHero,
    altImages: [
      ASSET_MANIFEST.products.divaTop,
      ASSET_MANIFEST.products.spikeTop
    ],
    aspect: "portrait",
    caption: "Model styled in Motherboard Diva Top and Spike Cuffs under high-intensity ultraviolet neon.",
    story: "What happens when the technology designed to automate us is dismantled and reclaimed to adorn us? Dhrisni treats motherboards not as e-waste, but as intricate futuristic armor.",
    materials: "Silicon Motherboards, Gold Trace Leads, Industrial Rivets, Heavy Steel Wire",
    vibe: "Cyberpunk Couture"
  },
  {
    id: "look-02",
    code: "LOOK 002 • NO FACTORY MINDSET",
    title: "Raw Hands, Pure Grit",
    subtitle: "Studio Stories from Guwahati",
    image: ASSET_MANIFEST.products.divaTop,
    altImages: [
      ASSET_MANIFEST.editorialHero,
      ASSET_MANIFEST.products.archiveBralette
    ],
    aspect: "square",
    caption: "Behind the scenes at the Guwahati workshop. Hand-threading 16-gauge chain links.",
    story: "Every piece passes through Dhrisni's hands and the women she has personally trained. No high-speed conveyor belts. No exploited third-party sweatshops. Just pure tactile artistry.",
    materials: "Deconstructed Electronic Boards, Steel Ringlets, High-Tensile Filament",
    vibe: "Artisanal Maximalism"
  },
  {
    id: "look-03",
    code: "LOOK 003 • SOFT ARMOUR AFTER HOURS",
    title: "Soft Armour After Hours",
    subtitle: "Nightlife, Subculture, and Archival Armor",
    image: ASSET_MANIFEST.editorialLookbook,
    altImages: [
      ASSET_MANIFEST.products.reworkedJacket,
      ASSET_MANIFEST.products.coordSet
    ],
    aspect: "landscape",
    caption: "The Spiked Moto Shrug and Mesh Bralette captured in low-light rave velocity.",
    story: "AVZ clothes are built to move, sweat, dance, and hold space. They are defensive mechanisms against boring parties and conformity.",
    materials: "Distressed Heavy Denim, Industrial Zippers, Barbed Hardware",
    vibe: "Cyber-Grunge"
  },
  {
    id: "look-04",
    code: "LOOK 004 • REWORKED ROMANCE",
    title: "Reworked Romance",
    subtitle: "Tenderness Clashing With Cold Metal",
    image: ASSET_MANIFEST.products.coordSet,
    altImages: [
      ASSET_MANIFEST.products.spikeBra,
      ASSET_MANIFEST.products.beadedBralette
    ],
    aspect: "portrait",
    caption: "Dystopian Co-ord set styled with delicate lace and heavy carabiners.",
    story: "Maximalism doesn't mean harshness. It means feeling everything at maximum volume, where sweet romantic silhouettes collide with raw mechanics.",
    materials: "Upcycled Denim, Carabiner Clasps, Safety Wire Accents",
    vibe: "Post-Apocalyptic Romance"
  },
  {
    id: "look-05",
    code: "LOOK 005 • TACTILE CYBER CHAINMAIL",
    title: "Liquid Steel Exoskeleton",
    subtitle: "Over 1,200 Hand-Linked Stainless Steel Rings",
    image: ASSET_MANIFEST.products.chainmailArmor,
    altImages: [
      ASSET_MANIFEST.products.beadedBralette
    ],
    aspect: "portrait",
    caption: "Heavy fluid chain drape that flexes with bodily contours.",
    story: "A modern homage to medieval body protection transformed into sultry clubwear armor. Cold to the touch, heavy in weight, impossible to ignore.",
    materials: "16-Gauge Stainless Steel, Glass Beads, Chrome Buckles",
    vibe: "Medieval Futurism"
  },
  {
    id: "look-06",
    code: "LOOK 006 • GLITCH HARNESS MATRIX",
    title: "Subcultural Bodice Spikes",
    subtitle: "Aggressive Geometry & Architectural Curves",
    image: ASSET_MANIFEST.products.spikeBodice,
    altImages: [
      ASSET_MANIFEST.products.spikeBra
    ],
    aspect: "portrait",
    caption: "Cone spikes precision-mounted on recycled structural denim framework.",
    story: "Defensive fashion engineered for those who refuse to be touched without permission. A sharp statement of autonomy and raw self-possession.",
    materials: "Heavy Cone Spikes, Reclaimed Black Denim, Reinforced Eyelets",
    vibe: "Dark Industrial Punk"
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
