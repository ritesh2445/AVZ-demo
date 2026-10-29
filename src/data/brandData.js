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
      { title: "Empowering Women Artisans", text: "We hire and train women directly under Dhrisni's close personal supervision in our Guwahati atelier." }
    ]
  },
  pricingTiers: [
    {
      tier: "Tiny Details & Hardware Extras",
      range: "Under ₹1,000",
      description: "Custom wire pieces, keycap jewelry, hardware chokers, spike accents, and mini ear cuffs."
    },
    {
      tier: "The Core Statement Pieces",
      range: "₹1,000 – ₹3,000",
      description: "Hand-sculpted bralettes, corsets, reconstructed skirts, motherboard tops, and layered accessories."
    },
    {
      tier: "Heavy Art & Full Builds",
      range: "₹3,000+",
      description: "Complex hardware armors, tailored reworked jackets, structured archive recreations, and full editorial ensembles."
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
    requirement: "For visible damage claims, an uncut unboxing video must be sent to our WhatsApp (+91 73042 64901) within 48 hours of delivery."
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
  videos: {
    heroDesktop: "/assets/hero_reel_desktop.mp4",
    heroMobile: "/assets/hero_reel_mobile.mp4",
    vimeoDesktop: "https://vimeo.com/1239586933",
    vimeoMobile: "https://vimeo.com/1239586843",
    vimeoEmbedDesktop: "https://player.vimeo.com/video/1239586933?autoplay=1&loop=1&autopause=0&title=0&byline=0&portrait=0",
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

// REAL PRODUCT CATALOGUE
export const PRODUCTS = [
  {
    id: "avz-001",
    name: "Cyber Motherboard Diva Top",
    category: "Tops",
    subCategory: "Wearable Tech",
    price: 1899,
    tag: "ONE OF ONE",
    stock: 1, // Strict 1-of-1 restriction test
    materials: ["Motherboards & Circuits", "Upcycled Hardware", "Reclaimed Denim"],
    images: [
      ASSET_MANIFEST.products.divaTop,
      ASSET_MANIFEST.editorialHero,
      ASSET_MANIFEST.products.spikeTop
    ],
    description: "An experimental, sculptural top crafted from decommissioned computer motherboard chips, copper tracing, and upcycled structured denim. Designed to hug the torso with raw, tactile futuristic armor aesthetics.",
    details: [
      "Genuine salvaged computer motherboard panels",
      "Industrial grommet lace-up back for custom tightening",
      "Hand-trimmed edges sealed with metallic silver resin",
      "Zero waste, 100% reclaimed foundation"
    ],
    care: "Spot clean only with a dry microfiber cloth. Do not immerse circuit elements in water. Treat as wearable jewelry.",
    sizes: ["XS/S (Bust 30-33\")", "M/L (Bust 34-37\")"],
    inMuseum: false,
    featured: true
  },
  {
    id: "avz-002",
    name: "Industrial Chrome Spike Bralette",
    category: "Bralettes",
    subCategory: "Hardware Armor",
    price: 1999,
    tag: "HAND-BUILT",
    stock: 1,
    materials: ["Metal Spikes & Chains", "Upcycled Hardware"],
    images: [
      ASSET_MANIFEST.products.spikeBra,
      ASSET_MANIFEST.products.beadedBralette,
      ASSET_MANIFEST.products.archiveBralette
    ],
    description: "Cold-forged rebellion. Featuring individually bolted cone spikes, heavy stainless chains, and a soft, skin-safe under-lining. Sharp attitude, immaculate comfort, and zero apologies.",
    details: [
      "Over 48 hand-set metallic spikes",
      "Heavy-duty lobster clasp adjustable strap system",
      "Breathable cushioned inner lining for festival wear",
      "Designed & assembled by Dhristroyer"
    ],
    care: "Wipe metal spikes with soft dry cloth. Store flat in your AVZ dust bag.",
    sizes: ["Small (Bust 32A-34B)", "Medium (Bust 34C-36C)"],
    inMuseum: false,
    featured: true
  },
  {
    id: "avz-003",
    name: "Reclaimed Hardware Beaded Corset Bralette",
    category: "Corsets",
    subCategory: "Statement Corset",
    price: 2499,
    tag: "ONE OF ONE",
    stock: 1,
    materials: ["Upcycled Hardware", "Metal Spikes & Chains"],
    images: [
      ASSET_MANIFEST.products.beadedBralette,
      ASSET_MANIFEST.products.archiveBralette,
      ASSET_MANIFEST.products.divaTop
    ],
    description: "An intricate tapestry of salvaged steel nuts, machine washers, faceted glass crystals, and heavy wire work. A balance between extreme fragility and mechanical weight.",
    details: [
      "Double-boned silhouette for waist shaping",
      "Hand-threaded industrial hardware mesh",
      "Signature AVZ four-directional silver tag on reverse"
    ],
    care: "Keep away from moisture. Spot clean fabric underlay with gentle sponge.",
    sizes: ["Adjustable XS-M (Waist 24-28\")"],
    inMuseum: false,
    featured: true
  },
  {
    id: "avz-004",
    name: "Deconstructed Cyber Punk Reworked Jacket",
    category: "Jackets",
    subCategory: "Heavy Outerwear",
    price: 4499,
    tag: "ONE OF ONE",
    stock: 1,
    materials: ["Reclaimed Denim", "Upcycled Hardware", "Metal Spikes & Chains"],
    images: [
      ASSET_MANIFEST.products.reworkedJacket,
      ASSET_MANIFEST.editorialLookbook,
      ASSET_MANIFEST.products.coordSet
    ],
    description: "A vintage heavy cotton chore jacket torn apart, reversed, and reconstructed with exposed zipper hardware, barbed metal wire accents, and hand-distressed dimensional sleeves.",
    details: [
      "Over 18 hours of direct artisanal distressing",
      "Reconstructed multi-tonal patchwork sleeves",
      "Oversized boxy avant-garde silhouette",
      "Interior hand-signed provenance label"
    ],
    care: "Dry clean only by an alternative garment specialist.",
    sizes: ["Free Size / Oversized (Chest 42-46\")"],
    inMuseum: false,
    featured: true
  },
  {
    id: "avz-005",
    name: "Vaganza Dystopian Co-ord Set",
    category: "Co-ord sets",
    subCategory: "Two-Piece Statement",
    price: 3699,
    tag: "SMALL RUN",
    stock: 2,
    materials: ["Reclaimed Denim", "Upcycled Hardware"],
    images: [
      ASSET_MANIFEST.products.coordSet,
      ASSET_MANIFEST.products.divaTop,
      ASSET_MANIFEST.products.reworkedJacket
    ],
    description: "Matching asymmetric cropped bodice with modular low-rise micro skirt. Built with adjustable carabiner connectors and industrial parachute cord ties.",
    details: [
      "Includes modular crop top and detachable cargo harness skirt",
      "High-contrast metallic silver topstitching",
      "Functional multi-ring attachment points"
    ],
    care: "Hand wash cold inside out with gentle detergent. Hang dry away from direct sunlight.",
    sizes: ["Small (Waist 25-27\")", "Medium (Waist 28-30\")"],
    inMuseum: false,
    featured: true
  },
  {
    id: "avz-006",
    name: "Subcultural Spike Crop Top",
    category: "Tops",
    subCategory: "Everyday Armor",
    price: 1799,
    tag: "HAND-BUILT",
    stock: 1,
    materials: ["Metal Spikes & Chains", "Reclaimed Denim"],
    images: [
      ASSET_MANIFEST.products.spikeTop,
      ASSET_MANIFEST.products.spikeBra,
      ASSET_MANIFEST.editorialHero
    ],
    description: "Minimal cut, maximal attitude. Cotton rib-knit base infused with high-polish silver studs along collarbones and shoulders.",
    details: [
      "Signature raw-hem crop",
      "Riveted studs with rounded anti-snag backings",
      "Ultra-soft vintage washed cotton base"
    ],
    care: "Hand wash in cold water. Lay flat to dry.",
    sizes: ["XS", "S", "M"],
    inMuseum: false,
    featured: false
  },
  {
    id: "avz-007",
    name: "Mermaidcore Keycap Wire Neckpiece",
    category: "Neckpieces",
    subCategory: "Hardware Choker",
    price: 999,
    tag: "UNDER ₹1K",
    stock: 1,
    materials: ["Keycaps & Tech Scrap", "Industrial Wire"],
    images: [
      ASSET_MANIFEST.products.archiveBralette,
      ASSET_MANIFEST.products.divaTop,
      ASSET_MANIFEST.editorialHero
    ],
    description: "Mechanical keyboard keycaps ('ESC', 'CTRL', 'SHIFT') threaded on sculpted copper and memory wire with freshwater pearl accents. A love letter to digital decadence.",
    details: [
      "Original vintage mechanical keyboard stem keycaps",
      "Sculpted memory wire maintains shape on throat",
      "Hypoallergenic lobster clasp closure"
    ],
    care: "Wipe with soft cloth. Avoid perfumes or direct chemical sprays.",
    sizes: ["One Size / Adjustable (13-16\")"],
    inMuseum: false,
    featured: false
  },
  {
    id: "avz-008",
    name: "Dhristroyer Cyber Chainmail Body Harness",
    category: "Body chainmail",
    subCategory: "Body Jewelry",
    price: 3200,
    tag: "ONE OF ONE",
    stock: 1,
    materials: ["Chainmail", "Metal Spikes & Chains", "Upcycled Hardware"],
    images: [
      ASSET_MANIFEST.products.chainmailArmor
    ],
    description: "Full torso chainmail drape woven ring by ring from high-grade stainless steel. Drapes over shoulders and crosses the back with tension rings.",
    details: [
      "Over 1,200 hand-linked 16-gauge rings",
      "Weight: approx 650 grams of fluid metallic armor",
      "Fully adjustable waist and shoulder lengths"
    ],
    care: "Polish with jewelry silver cloth. Store hanging to prevent tangling.",
    sizes: ["One Size Fits Most (Adjustable)"],
    inMuseum: false,
    featured: true
  },
  {
    id: "avz-009",
    name: "Scrap Motherboard Circuit Ear Armor Cuff",
    category: "Earrings",
    subCategory: "Ear Armor",
    price: 799,
    tag: "UNDER ₹1K",
    stock: 2,
    materials: ["Motherboards & Circuits", "Industrial Wire"],
    images: [
      ASSET_MANIFEST.products.motherboardCuff
    ],
    description: "Pair of no-piercing required ear wraps fashioned from green & gold computer motherboard tracks with hanging wire tendrils.",
    details: [
      "No piercing needed — slips over upper ear cartilage",
      "Resin-coated smooth contact edges",
      "Ultra-lightweight"
    ],
    care: "Store in protective pouch.",
    sizes: ["One Size (Pliable)"],
    inMuseum: false,
    featured: false
  },
  {
    id: "avz-010",
    name: "Architectural Cone Spike Bodice Armor",
    category: "Corsets",
    subCategory: "Torso Armor",
    price: 2899,
    tag: "HAND-BUILT",
    stock: 1,
    materials: ["Upcycled Hardware", "Metal Spikes & Chains"],
    images: [
      ASSET_MANIFEST.products.spikeBodice
    ],
    description: "Cold-forged cone spike bustier top with reinforced steel eyelets, leather ribbing, and architectural silhouette.",
    details: [
      "Reinforced heavy-duty side buckles",
      "Hand-mounted solid steel spikes",
      "Precision curved bodice"
    ],
    care: "Spot clean.",
    sizes: ["Adjustable XS-M"],
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
    commissionTier: "The Core Statement Pieces (₹1,000 – ₹3,000)",
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
    commissionTier: "Tiny Details & Hardware Extras (Under ₹1,000)",
    originalOwner: "Commissioned for Boiler Room Delhi",
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
    commissionTier: "Heavy Art & Full Builds (₹3,000+)",
    originalOwner: "Custom Commission (Berlin)",
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
    commissionTier: "The Core Statement Pieces (₹1,000 – ₹3,000)",
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
    code: "LOOK 001 // THE SEVERED CIRCUIT",
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
    code: "LOOK 002 // NO FACTORY MINDSET",
    title: "Raw Hands, Pure Grit",
    subtitle: "Atelier Documentaries from Guwahati",
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
    code: "LOOK 003 // SOFT ARMOUR AFTER HOURS",
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
    code: "LOOK 004 // REWORKED ROMANCE",
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
    code: "LOOK 005 // TACTILE CYBER CHAINMAIL",
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
    code: "LOOK 006 // GLITCH HARNESS MATRIX",
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
    a: "Yes, through the AVZ Museum and vault archive. Sold-out or past custom pieces can be re-created for you, but because everything is hand-built with upcycled components and raw hardware, no two items will ever be an exact replica. Every commission is a one-of-a-kind evolution tailored entirely to you."
  },
  {
    q: "What are the pricing tiers and timelines for custom orders?",
    a: "• Tiny details and hardware extras (accessories, wire pieces, small hardware): Under ₹1,000.\n• Core statement pieces (bralettes, corsets, skirts, custom tops): ₹1,000 – ₹3,000.\n• Heavy art and full builds (complex hardware outfits, jackets, structured archive remakes): ₹3,000 and above.\nBecause every piece is meticulously built from scratch by hand, custom orders typically take 2 to 3 weeks to complete."
  },
  {
    q: "What is your return and exchange policy?",
    a: "We accept returns if there is visible damage on the product, or replacement if there is a sizing issue. Because of the delicate and one-of-a-kind nature of the garments, an uncut unboxing video must be sent to our WhatsApp contact (+91 73042 64901) for damage claims."
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
