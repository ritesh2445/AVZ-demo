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
      { title: "Maximalism Over Minimalism", text: "We fiercely reject cookie-cutter minimalism. Raw textures, metallic spikes, hand-linked chainmail, and industrial hardware collide." },
      { title: "Human Hands Over Machine Sameness", text: "In a world drowning in fast fashion and AI generation, things built by real human hands are the ultimate luxury." },
      { title: "Upcycling & Reclaimed Textiles", text: "Tired of stuffed closets and landfill waste, we transform discarded garments and unconventional hardware into one-of-a-kind armor." },
      { title: "Empowering Women Artisans", text: "We hire and train women directly under Dhrisni's close personal supervision in our Studio." }
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
      description: "Handcrafted bralettes, corsets, custom skirts, and metal-based cyber couture."
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
  "Metal Spikes & Chains",
  "Stainless Steel Chainmail",
  "Reclaimed Denim",
  "Deadstock Textiles",
  "Industrial Wire",
  "Pearls & Beads"
];

// COLLECTION ARCHIVE — Curated from authentic studio inventory with multi-shot frame grouping
export const PRODUCTS = [
  {
    "id": "avz-in-0001",
    "sku": "IN0001",
    "name": "Spikeria bra",
    "title": "Spikeria bra",
    "price": 1999,
    "compare_at_price": null,
    "stock": 50,
    "category": "Bralettes",
    "tag": "BEST SELLER",
    "materials": [
      "Hand-Set Metallic Spikes",
      "Reinforced Bra Base",
      "Upcycled Hardware"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/bralettes/bralettes_30.webp",
      "/assets/collection/bralettes/bralettes_31.webp",
      "/assets/collection/bralettes/bralettes_32.webp"
    ],
    "image": "/assets/collection/bralettes/bralettes_30.webp",
    "description": "Bra with spikes studded — individually hand-set metallic cone spikes over a structured bra base. Raw metallic rebellion and punk cyber-couture.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Hand-set conical metallic spikes with reinforced inner lining",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": true,
    "customMade": false
  },
  {
    "id": "avz-in-0002",
    "sku": "IN0002",
    "name": "Keyboard bra",
    "title": "Keyboard bra",
    "price": 2500,
    "compare_at_price": null,
    "stock": 100,
    "category": "Bralettes",
    "tag": "SIGNATURE",
    "materials": [
      "Upcycled Mechanical Keycaps",
      "Structured Bra Cups",
      "Industrial Hardware"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/bralettes/bralettes_33.webp",
      "/assets/collection/bralettes/bralettes_03.webp",
      "/assets/collection/bralettes/bralettes_04.webp",
      "/assets/collection/bralettes/bralettes_05.webp"
    ],
    "image": "/assets/collection/bralettes/bralettes_33.webp",
    "description": "Bra w keyboard studded — deconstructed mechanical keyboard keycaps individually set across structured bust cups. Tactile maximalism and wearable sculpture.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Upcycled salvaged tactile keycaps",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": true,
    "customMade": false
  },
  {
    "id": "avz-in-0003",
    "sku": "IN0003",
    "name": "Jersey co ord",
    "title": "Jersey co ord",
    "price": 3500,
    "compare_at_price": null,
    "stock": 1,
    "category": "Co-ord sets",
    "tag": "1 OF 1 ARCHIVE",
    "materials": [
      "Upcycled Sports Jersey",
      "Heavy Front Zipper",
      "Pleated Mesh Hem"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_07.webp",
      "/assets/collection/co_ords/co_ords_01.webp",
      "/assets/collection/co_ords/co_ords_08.webp",
      "/assets/collection/co_ords/co_ords_09.webp",
      "/assets/collection/co_ords/co_ords_19.webp",
      "/assets/collection/co_ords/co_ords_23.webp",
      "/assets/collection/co_ords/co_ords_25.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_07.webp",
    "description": "Jersey upcycled corset & skirt — reconstructed sports jersey tailored into a boned corset bodice with heavy front industrial zipper and matching pleated skirt.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "1-of-1 archival upcycled jersey reconstruction",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": true,
    "customMade": false
  },
  {
    "id": "avz-in-0004",
    "sku": "IN0004",
    "name": "Spike arm cuffs",
    "title": "Spike arm cuffs",
    "price": 600,
    "compare_at_price": null,
    "stock": 30,
    "category": "Arm cuffs",
    "tag": "ACCESSORY",
    "materials": [
      "Metallic Cone Spikes",
      "Black Rexine / Leatherette Base",
      "Adjustable Snaps"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/armcuffs/armcuffs_01.webp",
      "/assets/collection/armcuffs/armcuffs_03.webp",
      "/assets/collection/armcuffs/armcuffs_04.webp",
      "/assets/collection/armcuffs/armcuffs_05.webp"
    ],
    "image": "/assets/collection/armcuffs/armcuffs_01.webp",
    "description": "Armcuffs w spikes — studded forearm and wrist gauntlets with hand-set metallic spikes. Statement armor for subcultural and editorial styling.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Heavy industrial conical spikes",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": false,
    "customMade": false
  },
  {
    "id": "avz-in-0005",
    "sku": "IN0005",
    "name": "Frills belt purple",
    "title": "Frills belt purple",
    "price": 800,
    "compare_at_price": null,
    "stock": 1,
    "category": "Belts",
    "tag": "1 OF 1 ARCHIVE",
    "materials": [
      "Cascading Reclaimed Fabric Frills",
      "Ribbon Drapes",
      "Upcycled Hardware Clasp"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/belts/belts_01.webp",
      "/assets/collection/belts/belts_02.webp",
      "/assets/collection/belts/belts_03.webp",
      "/assets/collection/belts/belts_04.webp"
    ],
    "image": "/assets/collection/belts/belts_01.webp",
    "description": "Belt with fabrics hanging — multi-textured waist harness adorned with cascading purple and printed fabric frills and free-hanging ribbons.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Upcycled deadstock fabric frills",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": false,
    "customMade": false
  },
  {
    "id": "avz-in-0006",
    "sku": "IN0006",
    "name": "Spike beaded bralette body chainmail",
    "title": "Spike beaded bralette body chainmail",
    "price": 1800,
    "compare_at_price": null,
    "stock": 5,
    "category": "Body chainmail",
    "tag": "HAND-FORGED",
    "materials": [
      "Hand-Strung Seed Beads",
      "Metallic Cone Spikes",
      "Stainless Steel Chainmail Links"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/body_chainmail/body_chainmail_13.webp",
      "/assets/collection/body_chainmail/body_chainmail_01.webp",
      "/assets/collection/body_chainmail/body_chainmail_03.webp",
      "/assets/collection/body_chainmail/body_chainmail_07.webp",
      "/assets/collection/body_chainmail/body_chainmail_08.webp",
      "/assets/collection/body_chainmail/body_chainmail_09.webp",
      "/assets/collection/body_chainmail/body_chainmail_10.webp"
    ],
    "image": "/assets/collection/body_chainmail/body_chainmail_13.webp",
    "description": "Beaded bralette w spikes and punk theme — intricate bib collar of cascading hand-beaded loops, stainless steel chain links, and metallic spikes.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Over 500 hand-threaded glass beads and steel links",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": true,
    "customMade": false
  },
  {
    "id": "avz-in-0007",
    "sku": "IN0007",
    "name": "Psychedelic brown denim bag",
    "title": "Psychedelic brown denim bag",
    "price": 999,
    "compare_at_price": null,
    "stock": 1,
    "category": "Bags",
    "tag": "1 OF 1 ARCHIVE",
    "materials": [
      "Upcycled Acid-Washed Denim Jeans",
      "Neon Hand-Painted Motifs",
      "Satin Ribbons & Chains"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/bags/bags_03.webp",
      "/assets/collection/bags/bags_01.webp",
      "/assets/collection/bags/bags_02.webp",
      "/assets/collection/bags/bags_04.webp",
      "/assets/collection/bags/bags_05.webp"
    ],
    "image": "/assets/collection/bags/bags_03.webp",
    "description": "Bag with acid paint denim jeans upcycled — one-of-a-kind slouchy shoulder bag deconstructed from brown denim jeans with psychedelic neon painting, charms, and satin ties.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Deconstructed vintage jeans with hand-painted artwork",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": false,
    "customMade": false
  },
  {
    "id": "avz-in-0008",
    "sku": "IN0008",
    "name": "Spike tube top",
    "title": "Spike tube top",
    "price": 2000,
    "compare_at_price": null,
    "stock": 3,
    "category": "Tops",
    "tag": "PUNK COUTURE",
    "materials": [
      "Black Rexine Bodice",
      "Metallic Spikes Cross Motif",
      "Elastic Stretch Support"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/tops/tops_16.webp",
      "/assets/collection/tops/tops_22.webp",
      "/assets/collection/tops/tops_41.webp"
    ],
    "image": "/assets/collection/tops/tops_16.webp",
    "description": "Tube top rexine black with spikes forming cross — sleek black leatherette tube top with heavy metallic cone spikes arranged in an extended crucifix motif down the torso.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Hand-riveted spikes with structured boning",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": true,
    "customMade": false
  },
  {
    "id": "avz-in-0009",
    "sku": "IN0009",
    "name": "Purple jibaro cross top",
    "title": "Purple jibaro cross top",
    "price": 1500,
    "compare_at_price": null,
    "stock": 1,
    "category": "Tops",
    "tag": "1 OF 1 ARCHIVE",
    "materials": [
      "Lustrous Purple Silk/Satin",
      "Gold Threadwork & Filigree",
      "Blood-Red Gems & Safety Pins"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/tops/tops_20.webp",
      "/assets/collection/tops/tops_07.webp",
      "/assets/collection/tops/tops_19.webp",
      "/assets/collection/tops/tops_26.webp",
      "/assets/collection/tops/tops_27.webp",
      "/assets/collection/tops/tops_34.webp",
      "/assets/collection/bralettes/bralettes_20.webp"
    ],
    "image": "/assets/collection/tops/tops_20.webp",
    "description": "Cross top halter purple with gold and red embellishment — halter neck cross-silhouette top in rich purple fabric lavishly embellished with metallic filigree, hanging charms, and safety-pin hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Intricate hand-embellished vintage charms",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": true,
    "customMade": false
  },
  {
    "id": "avz-in-0010",
    "sku": "IN0010",
    "name": "Chainmail bra",
    "title": "Chainmail bra",
    "price": 1800,
    "compare_at_price": null,
    "stock": 50,
    "category": "Bralettes",
    "tag": "METAL ARMOR",
    "materials": [
      "Hand-Linked Stainless Steel Rings",
      "Reinforced Neck & Back Chains",
      "Lobster Clasps"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/body_chainmail/body_chainmail_14.webp"
    ],
    "image": "/assets/collection/body_chainmail/body_chainmail_14.webp",
    "description": "Bra made out of chain links — fluid metallic armor constructed entirely from hand-interlinked stainless steel rings. Ergonomic contouring and adjustable chain ties.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Corrosion-resistant surgical steel jump rings",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": true,
    "customMade": false
  },
  {
    "id": "avz-in-0011",
    "sku": "IN0011",
    "name": "Purple pink beaded bralette",
    "title": "Purple pink beaded bralette",
    "price": 1500,
    "compare_at_price": null,
    "stock": 1,
    "category": "Bralettes",
    "tag": "1 OF 1 ARCHIVE",
    "materials": [
      "Hand-Strung Glass & Acrylic Beads",
      "Multi-Strand Bib Cascade",
      "Adjustable Hardware"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/bralettes/bralettes_08.webp",
      "/assets/collection/bralettes/bralettes_01.webp",
      "/assets/collection/bralettes/bralettes_06.webp",
      "/assets/collection/bralettes/bralettes_07.webp",
      "/assets/collection/bralettes/bralettes_09.webp",
      "/assets/collection/bralettes/bralettes_10.webp"
    ],
    "image": "/assets/collection/bralettes/bralettes_08.webp",
    "description": "Bralette/ bodychain made with pink and purple beads — multi-layered wearable jewelry draped across the bust with thousands of hand-strung beads in violet and magenta.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Over 1,200 micro-beads individually hand-threaded",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": false,
    "customMade": false
  },
  {
    "id": "avz-in-0012",
    "sku": "IN0012",
    "name": "Apex Cuffs",
    "title": "Apex Cuffs",
    "price": 499,
    "compare_at_price": null,
    "stock": 10,
    "category": "Arm cuffs",
    "tag": "UNDER ₹1K",
    "materials": [
      "Metallic Spike Hardware",
      "Riveted Leatherette Wristband",
      "Snap Fasteners"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/armcuffs/armcuffs_02.webp",
      "/assets/collection/armcuffs/armcuffs_05.webp",
      "/assets/collection/armcuffs/armcuffs_01.webp"
    ],
    "image": "/assets/collection/armcuffs/armcuffs_02.webp",
    "description": "Hand cuffs w spikes — minimal yet fierce black wristbands studded with double rows of chrome spikes. Heavy punk styling.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Adjustable multi-snap wrist clasp",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": false,
    "customMade": false
  },
  {
    "id": "avz-in-0013",
    "sku": "IN0013",
    "name": "Denim upcycled headgear",
    "title": "Denim upcycled headgear",
    "price": 1700,
    "compare_at_price": null,
    "stock": 1,
    "category": "Headgear",
    "tag": "1 OF 1 ARCHIVE",
    "materials": [
      "Deconstructed Reclaimed Denim",
      "Handcrafted Plastic Bottle Flowers",
      "Vintage Ribbons & Lace"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/headgears/headgears_03.webp",
      "/assets/collection/headgears/headgears_01.webp",
      "/assets/collection/headgears/headgears_02.webp",
      "/assets/collection/headgears/headgears_04.webp",
      "/assets/collection/headgears/headgears_05.webp",
      "/assets/collection/headgears/headgears_06.webp",
      "/assets/collection/headgears/headgears_07.webp"
    ],
    "image": "/assets/collection/headgears/headgears_03.webp",
    "description": "Denim headgear with green plastic bottle flowers and ribbons and laces vaganza — avant-garde sculptural headpiece and mask sculpted from frayed denim seams, heat-formed plastic bottle flowers, and draping ribbons.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Upcycled zero-waste wearable sculpture",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": false,
    "customMade": false
  },
  {
    "id": "avz-in-0014",
    "sku": "IN0014",
    "name": "Jhumka jacket",
    "title": "Jhumka jacket",
    "price": 2600,
    "compare_at_price": null,
    "stock": 1,
    "category": "Jackets",
    "tag": "1 OF 1 ARCHIVE",
    "materials": [
      "Lush Brown Faux Fur",
      "Traditional Brass Jhumka Bells",
      "Draped Hardware Chains"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/jackets/jackets_04.webp",
      "/assets/collection/jackets/jackets_01.webp",
      "/assets/collection/jackets/jackets_02.webp",
      "/assets/collection/jackets/jackets_03.webp",
      "/assets/collection/jackets/jackets_05.webp",
      "/assets/collection/jackets/jackets_06.webp",
      "/assets/collection/jackets/jackets_10.webp"
    ],
    "image": "/assets/collection/jackets/jackets_04.webp",
    "description": "Jacket fur brown jhumkhas — rich chocolate brown faux fur cropped jacket adorned with dozens of traditional Indian brass jhumkas and connecting chain swags.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Authentic brass jhumka hardware hand-stitched",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": true,
    "customMade": false
  },
  {
    "id": "avz-in-0015",
    "sku": "IN0015",
    "name": "Black Cat Co ord Set",
    "title": "Black Cat Co ord Set",
    "price": 2200,
    "compare_at_price": null,
    "stock": 1,
    "category": "Co-ord sets",
    "tag": "1 OF 1 ARCHIVE",
    "materials": [
      "Textured Silver Boned Corset",
      "Black Faux Fur Trim Mini Skirt",
      "Heavy Eyelet Hardware"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_16.webp",
      "/assets/collection/co_ords/co_ords_02.webp",
      "/assets/collection/co_ords/co_ords_03.webp",
      "/assets/collection/co_ords/co_ords_05.webp",
      "/assets/collection/co_ords/co_ords_11.webp",
      "/assets/collection/co_ords/co_ords_22.webp",
      "/assets/collection/co_ords/co_ords_31.webp",
      "/assets/collection/co_ords/co_ords_37.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_16.webp",
    "description": "Silver corset and black fur skirt — sculptural two-piece ensemble featuring an engraved silver-finish corset top paired with a micro mini skirt trimmed in dense black faux fur.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Hand-structured corset boning with metal grommets",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": true,
    "customMade": false
  },
  {
    "id": "avz-in-0016",
    "sku": "IN0016",
    "name": "Cheetah print cavewoman set",
    "title": "Cheetah print cavewoman set",
    "price": 1999,
    "compare_at_price": null,
    "stock": 1,
    "category": "Co-ord sets",
    "tag": "1 OF 1 ARCHIVE",
    "materials": [
      "Cheetah & Leopard Pattern Velour",
      "Brown Fur Accents",
      "Raw Asymmetric Hemline"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_20.webp",
      "/assets/collection/co_ords/co_ords_10.webp",
      "/assets/collection/co_ords/co_ords_14.webp",
      "/assets/collection/co_ords/co_ords_24.webp",
      "/assets/collection/co_ords/co_ords_35.webp",
      "/assets/collection/co_ords/co_ords_36.webp",
      "/assets/collection/co_ords/co_ords_38.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_20.webp",
    "description": "Cavewoman bra and leopard skirt — ferocious wild-animal print co-ord pairing an asymmetric ruched bralette with an uneven raw-hem leopard skirt.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Subcultural Y2K grunge styling",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": false,
    "customMade": false
  },
  {
    "id": "avz-in-0017",
    "sku": "IN0017",
    "name": "Silver Jesus cross charm top",
    "title": "Silver Jesus cross charm top",
    "price": 999,
    "compare_at_price": null,
    "stock": 0,
    "category": "Tops",
    "tag": "SOLD OUT",
    "materials": [
      "Silver Metallic Cross Halter",
      "Black Butterfly Choker",
      "Draped Silver Tone Chains"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/tops/tops_38.webp",
      "/assets/collection/tops/tops_21.webp",
      "/assets/collection/tops/tops_37.webp",
      "/assets/collection/tops/tops_46.webp"
    ],
    "image": "/assets/collection/tops/tops_38.webp",
    "description": "Cross shape halter top with black butterfly choker and silver elements — architectural cross-formed metallic top connected with chains and accompanied by a signature butterfly choker.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Archived piece — request a custom commission",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": false,
    "customMade": false
  },
  {
    "id": "avz-in-0018",
    "sku": "IN0018",
    "name": "Flowery",
    "title": "Flowery",
    "price": 1799,
    "compare_at_price": null,
    "stock": 6,
    "category": "Tops",
    "tag": "CROCHET ART",
    "materials": [
      "Hand-Crocheted Cotton Yarn",
      "Multi-Colored 3D Floral Appliques",
      "Lace-Up Back"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/tops/tops_23.webp",
      "/assets/collection/tops/tops_06.webp",
      "/assets/collection/tops/tops_33.webp"
    ],
    "image": "/assets/collection/tops/tops_23.webp",
    "description": "Crocheted top with flowers multi colored — hand-knit kaleidoscopic crop top blooming with vibrant three-dimensional crochet flowers over a supportive frame.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Individually hand-crocheted 3D flowers",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": false,
    "customMade": false
  },
  {
    "id": "avz-in-0019",
    "sku": "IN0019",
    "name": "Pearlite crochet top",
    "title": "Pearlite crochet top",
    "price": 1500,
    "compare_at_price": null,
    "stock": 12,
    "category": "Tops",
    "tag": "HAND-BEADED",
    "materials": [
      "Freshwater-Style White Pearls",
      "Crocheted Metallic Thread Base",
      "Satin Ties"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/bralettes/bralettes_13.webp",
      "/assets/collection/bralettes/bralettes_11.webp",
      "/assets/collection/bralettes/bralettes_12.webp",
      "/assets/collection/bralettes/bralettes_14.webp",
      "/assets/collection/bralettes/bralettes_15.webp",
      "/assets/collection/bralettes/bralettes_16.webp",
      "/assets/collection/bralettes/bralettes_17.webp"
    ],
    "image": "/assets/collection/bralettes/bralettes_13.webp",
    "description": "White pearls crocheted on bikini top — ethereal halter bikini top hand-woven with hundreds of luminous white pearls crocheted into an organic mesh.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Hand-crocheted pearl architecture",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": true,
    "customMade": false
  },
  {
    "id": "avz-in-0020",
    "sku": "IN0020",
    "name": "Barbie set",
    "title": "Barbie set",
    "price": 3500,
    "compare_at_price": null,
    "stock": 12,
    "category": "Co-ord sets",
    "tag": "CAMP MAXIMALISM",
    "materials": [
      "Sculpted Pink Starfish Bra",
      "Distressed Denim Mini with Pink Fur Trim",
      "Plush Headgear"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/co_ords/co_ords_26.webp",
      "/assets/collection/co_ords/co_ords_27.webp",
      "/assets/collection/co_ords/co_ords_28.webp"
    ],
    "image": "/assets/collection/co_ords/co_ords_26.webp",
    "description": "Pink starfish bra + Barbie short skirt + green & pink fluffy headgear — the quintessential maximalist trio: sculpted hot pink starfish bralette, frayed denim mini edged with neon pink faux fur, and fluffy headpiece.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Three-piece complete editorial ensemble",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": true,
    "customMade": false
  },
  {
    "id": "avz-in-0021",
    "sku": "IN0021",
    "name": "Spiral body chainmail top",
    "title": "Spiral body chainmail top",
    "price": 2500,
    "compare_at_price": null,
    "stock": 1,
    "category": "Body chainmail",
    "tag": "1 OF 1 ARCHIVE",
    "materials": [
      "Architectural Spiral Coiled Wire",
      "Hand-Linked Stainless Steel Chains",
      "Draped Halter Harness"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/body_chainmail/body_chainmail_22.webp",
      "/assets/collection/body_chainmail/body_chainmail_15.webp",
      "/assets/collection/body_chainmail/body_chainmail_16.webp",
      "/assets/collection/body_chainmail/body_chainmail_17.webp",
      "/assets/collection/body_chainmail/body_chainmail_19.webp",
      "/assets/collection/body_chainmail/body_chainmail_21.webp"
    ],
    "image": "/assets/collection/body_chainmail/body_chainmail_22.webp",
    "description": "Spiral wired  chained top in silver — concentric wire spirals coiled and woven with steel chains to create a sculptural breastplate that cascades down the torso.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Hand-coiled silver-tone steel wire",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": true,
    "customMade": false
  },
  {
    "id": "avz-in-0022",
    "sku": "IN0022",
    "name": "Cross tape bralette",
    "title": "Cross tape bralette",
    "price": 1200,
    "compare_at_price": null,
    "stock": 18,
    "category": "Bralettes",
    "tag": "CYBER-GRUNGE",
    "materials": [
      "Structural Black Vinyl Tape Illusion",
      "Industrial Chain Straps",
      "Snap Fasteners"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/bralettes/bralettes_23.webp",
      "/assets/collection/bralettes/bralettes_21.webp",
      "/assets/collection/bralettes/bralettes_22.webp",
      "/assets/collection/bralettes/bralettes_24.webp",
      "/assets/collection/bralettes/bralettes_25.webp",
      "/assets/collection/bralettes/bralettes_26.webp",
      "/assets/collection/bralettes/bralettes_27.webp",
      "/assets/collection/bralettes/bralettes_28.webp",
      "/assets/collection/bralettes/bralettes_29.webp"
    ],
    "image": "/assets/collection/bralettes/bralettes_23.webp",
    "description": "Bralette in the illusion of taped bust — deconstructed black vinyl crosses creating the visual illusion of electrical tape with chain linkages and comfortable inner lining.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Durable industrial hardware connectors",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": false,
    "customMade": false
  },
  {
    "id": "avz-in-0023",
    "sku": "IN0023",
    "name": "Spike grey blouse/bra",
    "title": "Spike grey blouse/bra",
    "price": 2000,
    "compare_at_price": null,
    "stock": 1,
    "category": "Tops",
    "tag": "1 OF 1 ARCHIVE",
    "materials": [
      "Heavy Hand-Set Metallic Spikes",
      "Tailored Saree Blouse Base",
      "Silver Hardware Accents"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/tops/tops_08.webp",
      "/assets/collection/tops/tops_02.webp",
      "/assets/collection/tops/tops_04.webp",
      "/assets/collection/tops/tops_31.webp",
      "/assets/collection/tops/tops_32.webp",
      "/assets/collection/tops/tops_44.webp",
      "/assets/collection/tops/tops_45.webp",
      "/assets/collection/tops/tops_48.webp",
      "/assets/collection/tops/tops_50.webp"
    ],
    "image": "/assets/collection/tops/tops_08.webp",
    "description": "Blouse with spikes — traditional Indian grey saree blouse transformed into high-impact wearable armor with hundreds of pointed cone spikes covering the bodice.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Custom tailored base with metallic spike field",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": false,
    "customMade": false
  },
  {
    "id": "avz-in-0024",
    "sku": "IN0024",
    "name": "Silver shoe corset and skirt set",
    "title": "Silver shoe corset and skirt set",
    "price": 3500,
    "compare_at_price": null,
    "stock": 1,
    "category": "Co-ord sets",
    "tag": "1 OF 1 ARCHIVE",
    "materials": [
      "Deconstructed Silver Athletic Sneaker",
      "Brown Faux Fur Trim",
      "Matching Metallic Mini Skirt"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/corsets/corsets_03.webp",
      "/assets/collection/corsets/corsets_01.webp",
      "/assets/collection/corsets/corsets_02.webp",
      "/assets/collection/corsets/corsets_04.webp",
      "/assets/collection/corsets/corsets_05.webp",
      "/assets/collection/corsets/corsets_06.webp",
      "/assets/collection/corsets/corsets_07.webp",
      "/assets/collection/co_ords/co_ords_32.webp",
      "/assets/collection/co_ords/co_ords_39.webp",
      "/assets/collection/co_ords/co_ords_40.webp"
    ],
    "image": "/assets/collection/corsets/corsets_03.webp",
    "description": "Corset in silver color made out of shoe and brown fur and similar skirt for a set — avant-garde runway set where athletic sneakers were unstitched and re-formed into a boned corset trimmed with brown fur, paired with metallic mini skirt.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Deconstructed sneaker upper wearable architecture",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": true,
    "customMade": false
  },
  {
    "id": "avz-in-0025",
    "sku": "IN0025",
    "name": "Spike red top",
    "title": "Spike red top",
    "price": 2200,
    "compare_at_price": null,
    "stock": 2,
    "category": "Tops",
    "tag": "HOT PIECE",
    "materials": [
      "Sculpted Red Heart Bustier",
      "Hand-Mounted Metallic Spikes",
      "Backless Strappy Tie Closure"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/tops/tops_10.webp",
      "/assets/collection/tops/tops_01.webp",
      "/assets/collection/tops/tops_15.webp",
      "/assets/collection/tops/tops_28.webp",
      "/assets/collection/tops/tops_47.webp"
    ],
    "image": "/assets/collection/tops/tops_10.webp",
    "description": "Red heart top with spikes backless — sculpted crimson heart-shaped halter crop top studded with gleaming spikes with an open criss-cross strappy back.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Heart silhouette with conical spike studs",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": true,
    "customMade": false
  },
  {
    "id": "avz-in-0026",
    "sku": "IN0026",
    "name": "Check mini red skirt",
    "title": "Check mini red skirt",
    "price": 1600,
    "compare_at_price": null,
    "stock": 1,
    "category": "Skirts",
    "tag": "1 OF 1 ARCHIVE",
    "materials": [
      "Red Gingham Check Cotton",
      "Overlaid Black Fishnet",
      "Rose & Ribbon Waist Hardware"
    ],
    "sizes": [
      "Free Size"
    ],
    "images": [
      "/assets/collection/skirts/skirts_03.webp",
      "/assets/collection/skirts/skirts_01.webp",
      "/assets/collection/skirts/skirts_02.webp"
    ],
    "image": "/assets/collection/skirts/skirts_03.webp",
    "description": "Red skirt w checks and fishnet mini size — pleated red and white gingham mini skirt overlaid with deconstructed black fishnet mesh, red rose rosette, and ribbon tails.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Gingham check with fishnet overlay and flower pin",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    "featured": false,
    "customMade": false
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
    materials: "Reclaimed Industrial Metal, Steel Wire, Velvet Ties",
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
    story: "Constructed from a discarded 1980s motorcycle jacket found in a thrift crate. Cropped high above the bust line, with massive chrome shoulders that evoke dystopian post-apocalyptic royalty.",
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
    "name": "Dhristroyer Cyberpunk Spikeria Bralette",
    "title": "Dhristroyer Cyberpunk Spikeria Bralette",
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
    "alt": "Dhristroyer Cyberpunk Spikeria Bralette",
    "description": "Dhristroyer Cyberpunk Spikeria Bralette — authentic wearable art creation handcrafted by Dhrisni in our Studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
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
    "description": "Hand-Riveted Spikeria Bodice Armor — authentic wearable art creation handcrafted by Dhrisni in our Studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-03",
    "sku": "AVZ-FT-003",
    "name": "Stainless Chainmail Cuirass",
    "title": "Stainless Chainmail Cuirass",
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
    "alt": "Stainless Chainmail Cuirass",
    "description": "Stainless Chainmail Cuirass — authentic wearable art creation handcrafted by Dhrisni in our Studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-04",
    "sku": "AVZ-FT-004",
    "name": "Hand-Riveted Spike Gauntlet",
    "title": "Hand-Riveted Spike Gauntlet",
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
    "alt": "Hand-Riveted Spike Gauntlet",
    "description": "Hand-Riveted Spike Gauntlet — authentic wearable art creation handcrafted by Dhrisni in our Studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
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
    "description": "Raw Steel O-Ring Harness Matrix — authentic wearable art creation handcrafted by Dhrisni in our Studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
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
    "description": "Spiked Cybernetic Moto Shoulder Guard — authentic wearable art creation handcrafted by Dhrisni in our Studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
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
    "description": "Acid-Wash Reclaimed Hardware Cargo Skirt — authentic wearable art creation handcrafted by Dhrisni in our Studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true
  },
  {
    "id": "featured-18",
    "sku": "AVZ-FT-018",
    "name": "Psychedelic Acid-Wash Denim Relic Bag",
    "title": "Psychedelic Acid-Wash Denim Relic Bag",
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
    "alt": "Psychedelic Acid-Wash Denim Relic Bag",
    "description": "Psychedelic Acid-Wash Denim Relic Bag — authentic wearable art creation handcrafted by Dhrisni in our Studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
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
    "description": "Hand-Linked Stainless Mesh Slip Top — authentic wearable art creation handcrafted by Dhrisni in our Studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
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
    "description": "Barbed Hardware Kinetic Choker — authentic wearable art creation handcrafted by Dhrisni in our Studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
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
    "description": "Cyber-Goth Spiked Rib Cage Bodice — authentic wearable art creation handcrafted by Dhrisni in our Studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
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
    "description": "Reconstructed Denim Shrug & Sleeve Bolero — authentic wearable art creation handcrafted by Dhrisni in our Studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
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
    "description": "Spike-Studded Asymmetric Collar Piece — authentic wearable art creation handcrafted by Dhrisni in our Studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
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
    "description": "Deconstructed Zipper Kinetic Mesh Top — authentic wearable art creation handcrafted by Dhrisni in our Studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
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
    "description": "Multi-Buckle Industrial Waist Cincher — authentic wearable art creation handcrafted by Dhrisni in our Studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
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
    "description": "Deconstructed Cyber Denim Flares (Archival) — authentic wearable art creation handcrafted by Dhrisni in our Studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
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
    "description": "Sculpted Silver Wire Tendril Bustier — authentic wearable art creation handcrafted by Dhrisni in our Studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
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
    "description": "Barbed Wire Chainmail Spine Drape — authentic wearable art creation handcrafted by Dhrisni in our Studio. Built from raw hardware and reclaimed elements.",
    "details": [
      "Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom metalwork",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true
  }
];

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
    "caption": "Model styled in Purple Jibaro Cross Top and Spike Cuffs under high-intensity neon.",
    "story": "What happens when the technology designed to automate us is dismantled and reclaimed to adorn us? Dhrisni treats circuit boards not as e-waste, but as sacred cybernetic armor.",
    "materials": "Reclaimed Metals, Stainless Chains, Hand-Set Spikes, Industrial Rivets",
    "vibe": "Cyberpunk Couture"
  },
  {
    "id": "look-02",
    "code": "LOOK 002 • STUDIO TACTILE GRIT",
    "title": "Raw Hands, Pure Grit",
    "subtitle": "Studio Stories & Hand-Linked Armor from Assam",
    "image": "/assets/lookbook/lookbook_03.webp",
    "altImages": [
      "/assets/lookbook/lookbook_04.webp"
    ],
    "aspect": "portrait",
    "caption": "Behind the scenes at our Studio workshop. Hand-threading 16-gauge chain links.",
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
    "story": "Born from late-night studio sessions where discarded tech finds second life under UV strobe pulses.",
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
    "materials": "Reclaimed Metals, Gold-Plated Filigree, Velvet Backing",
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
    "caption": "Signature editorial campaign portrait directed by Dhrisni in our Studio.",
    "story": "The definitive statement of Aveezah Vaganza. A manifesto written in solder, denim, and steel by Dhristroyer herself.",
    "materials": "Upcycled Hardware, Hand-Linked Stainless Rings, Studio Relics",
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
    a: "Absolute maximalism, texture, chaos, and grit. The brand fiercely rejects minimalism, cookie-cutter aesthetics, and AI-generated sameness. It specializes in subcultural styles like cyber-grunge, Y2K, mermaidcore, industrial punk, and avant-garde streetwear, built from non-traditional materials like hand-linked chainmail, cold-forged spikes, reclaimed metals, and upcycled hardware."
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
