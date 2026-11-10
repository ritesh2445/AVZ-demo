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
    "stock": 1,
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
    "price": 1800,
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
    "id": "mus-001",
    "name": "Cyberpunk Spiked Denim Corset",
    "shortName": "Spiked Denim Corset",
    "aspectRatio": 0.6666666666666666,
    "year": "2024-2026",
    "tag": "ARCHIVE · MUSEUM EXHIBITION",
    "materials": "Deconstructed raw 14oz denim, 48 industrial chrome cone spikes, boned corset armature",
    "priceTier": "Core Statement Pieces (₹1,000 – ₹3,000)",
    "originalOwner": "AVZ Studio Permanent Collection",
    "image": "/assets/museum/museum_piece_01.webp",
    "story": "Custom sculpted bodice with high-tensile eyelets and brutalist chrome spikes engineered directly into reinforced denim ribs. Built for dark techno rooms and high-stakes runway.",
    "recreationNote": "Handcrafted upon custom request with bespoke boning tailored to your exact anatomical measurements."
  },
  {
    "id": "mus-002",
    "name": "Fluid Stainless Chainmail Cowl",
    "shortName": "Chainmail Cowl",
    "aspectRatio": 0.782608695652174,
    "year": "2024",
    "tag": "ARCHIVE · MUSEUM EXHIBITION",
    "materials": "1,800 surgical stainless steel rings, hand-knit liquid drape, heavy toggle clasps",
    "priceTier": "Core Statement Pieces (₹1,000 – ₹3,000)",
    "originalOwner": "Boiler Room & Salon Showcase",
    "image": "/assets/museum/museum_piece_02.webp",
    "story": "Over 1,800 rings linked by hand ring-by-ring in our Studio. Cold to the touch, heavy in your hands, cascading across collarbones like shimmering mercury.",
    "recreationNote": "Hand-linked ring-by-ring to custom neck and chest dimensions."
  },
  {
    "id": "mus-003",
    "name": "Sculptural Shoe-Armor Hybrid Corset",
    "shortName": "Boot Armor Corset",
    "aspectRatio": 0.5632183908045977,
    "year": "2024",
    "tag": "ARCHIVE · RUNWAY ICON",
    "materials": "Deconstructed combat boots, heavy leather tongues, speed hooks, steel shanks",
    "priceTier": "Full Outfits & Heavy Art (₹3,000+)",
    "originalOwner": "Runway Exhibition Archive",
    "image": "/assets/museum/museum_piece_21.webp",
    "story": "The infamous AVZ boot-corset made from disassembled combat boots. The steel shanks provide natural boning while speed-lacing wraps the waist in aggressive posture.",
    "recreationNote": "Requires full waist and ribcage measurements for custom leather drafting."
  },
  {
    "id": "mus-004",
    "name": "Dhristroyer Imperial Relic Corset",
    "shortName": "Imperial Relic Corset",
    "aspectRatio": 0.7222222222222222,
    "year": "2024",
    "tag": "ARCHIVE · MASTERPIECE",
    "materials": "Raw industrial denim, salvage alloy embellishments, raw steel closures, hand embroidery",
    "priceTier": "Core Statement Pieces (₹1,000 – ₹3,000)",
    "originalOwner": "Dhrisni Private Collection",
    "image": "/assets/museum/museum_piece_42.webp",
    "story": "The crown jewel of Dhrisni's private collection. A triumph of maximalist post-industrial craftsmanship incorporating every core studio discipline: raw denim, cold steel, and handcrafted hardware.",
    "recreationNote": "Available exclusively as a bespoke one-of-one commission."
  }
];

// FEATURED PIECES (BEST SELLERS) — Curated from authentic studio vault
export const FEATURED_PIECES = [
  {
    "id": "featured-in0015",
    "sku": "IN0015",
    "name": "Black Cat Co ord Set",
    "title": "Black Cat Co ord Set",
    "category": "Co-ord sets",
    "price": 2200,
    "tag": "VAULT MASTERPIECE",
    "stock": 1,
    "materials": [
      "Textured Silver Boned Corset",
      "Black Faux Fur Trim Mini Skirt",
      "Heavy Eyelet Hardware"
    ],
    "image": "/assets/collection/co_ords/co_ords_16.webp",
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
    "imgUrl": "/assets/collection/co_ords/co_ords_16.webp",
    "alt": "Black Cat Co ord Set",
    "description": "Silver corset and black fur skirt — sculptural two-piece ensemble featuring an engraved silver-finish corset top paired with a micro mini skirt trimmed in dense black faux fur.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom wearable art",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true,
    "customMade": false
  },
  {
    "id": "featured-in0008",
    "sku": "IN0008",
    "name": "Spike tube top",
    "title": "Spike tube top",
    "category": "Tops",
    "price": 2000,
    "tag": "BEST SELLER",
    "stock": 3,
    "materials": [
      "Black Rexine Bodice",
      "Metallic Spikes Cross Motif",
      "Elastic Stretch Support"
    ],
    "image": "/assets/collection/tops/tops_16.webp",
    "images": [
      "/assets/collection/tops/tops_16.webp",
      "/assets/collection/tops/tops_22.webp",
      "/assets/collection/tops/tops_41.webp"
    ],
    "imgUrl": "/assets/collection/tops/tops_16.webp",
    "alt": "Spike tube top",
    "description": "Tube top rexine black with spikes forming cross — sleek black leatherette tube top with heavy metallic cone spikes arranged in an extended crucifix motif down the torso.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom wearable art",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true,
    "customMade": false
  },
  {
    "id": "featured-in0007",
    "sku": "IN0007",
    "name": "Psychedelic brown denim bag",
    "title": "Psychedelic brown denim bag",
    "category": "Bags",
    "price": 999,
    "tag": "BEST SELLER",
    "stock": 1,
    "materials": [
      "Upcycled Acid-Washed Denim Jeans",
      "Neon Hand-Painted Motifs",
      "Satin Ribbons & Chains"
    ],
    "image": "/assets/collection/bags/bags_03.webp",
    "images": [
      "/assets/collection/bags/bags_03.webp",
      "/assets/collection/bags/bags_01.webp",
      "/assets/collection/bags/bags_02.webp",
      "/assets/collection/bags/bags_04.webp",
      "/assets/collection/bags/bags_05.webp"
    ],
    "imgUrl": "/assets/collection/bags/bags_03.webp",
    "alt": "Psychedelic brown denim bag",
    "description": "Bag with acid paint denim jeans upcycled — one-of-a-kind slouchy shoulder bag deconstructed from brown denim jeans with psychedelic neon painting, charms, and satin ties.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom wearable art",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true,
    "customMade": false
  },
  {
    "id": "featured-in0001",
    "sku": "IN0001",
    "name": "Spikeria bra",
    "title": "Spikeria bra",
    "category": "Bralettes",
    "price": 1999,
    "tag": "BEST SELLER",
    "stock": 50,
    "materials": [
      "Hand-Set Metallic Spikes",
      "Reinforced Bra Base",
      "Upcycled Hardware"
    ],
    "image": "/assets/collection/bralettes/bralettes_30.webp",
    "images": [
      "/assets/collection/bralettes/bralettes_30.webp",
      "/assets/collection/bralettes/bralettes_31.webp",
      "/assets/collection/bralettes/bralettes_32.webp"
    ],
    "imgUrl": "/assets/collection/bralettes/bralettes_30.webp",
    "alt": "Spikeria bra",
    "description": "Bra with spikes studded — individually hand-set metallic cone spikes over a structured bra base. Raw metallic rebellion and punk cyber-couture.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom wearable art",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true,
    "customMade": false
  },
  {
    "id": "featured-in0002",
    "sku": "IN0002",
    "name": "Keyboard bra",
    "title": "Keyboard bra",
    "category": "Bralettes",
    "price": 2500,
    "tag": "BEST SELLER",
    "stock": 100,
    "materials": [
      "Upcycled Mechanical Keycaps",
      "Structured Bra Cups",
      "Industrial Hardware"
    ],
    "image": "/assets/collection/bralettes/bralettes_33.webp",
    "images": [
      "/assets/collection/bralettes/bralettes_33.webp",
      "/assets/collection/bralettes/bralettes_03.webp",
      "/assets/collection/bralettes/bralettes_04.webp",
      "/assets/collection/bralettes/bralettes_05.webp"
    ],
    "imgUrl": "/assets/collection/bralettes/bralettes_33.webp",
    "alt": "Keyboard bra",
    "description": "Bra w keyboard studded — deconstructed mechanical keyboard keycaps individually set across structured bust cups. Tactile maximalism and wearable sculpture.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom wearable art",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true,
    "customMade": false
  },
  {
    "id": "featured-in0003",
    "sku": "IN0003",
    "name": "Jersey co ord",
    "title": "Jersey co ord",
    "category": "Co-ord sets",
    "price": 3500,
    "tag": "KEY PIECE",
    "stock": 1,
    "materials": [
      "Upcycled Sports Jersey",
      "Heavy Front Zipper",
      "Pleated Mesh Hem"
    ],
    "image": "/assets/collection/co_ords/co_ords_07.webp",
    "images": [
      "/assets/collection/co_ords/co_ords_07.webp",
      "/assets/collection/co_ords/co_ords_01.webp",
      "/assets/collection/co_ords/co_ords_08.webp",
      "/assets/collection/co_ords/co_ords_09.webp",
      "/assets/collection/co_ords/co_ords_19.webp",
      "/assets/collection/co_ords/co_ords_23.webp",
      "/assets/collection/co_ords/co_ords_25.webp"
    ],
    "imgUrl": "/assets/collection/co_ords/co_ords_07.webp",
    "alt": "Jersey co ord",
    "description": "Jersey upcycled corset & skirt — reconstructed sports jersey tailored into a boned corset bodice with heavy front industrial zipper and matching pleated skirt.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom wearable art",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true,
    "customMade": false
  },
  {
    "id": "featured-in0006",
    "sku": "IN0006",
    "name": "Spike beaded bralette body chainmail",
    "title": "Spike beaded bralette body chainmail",
    "category": "Body chainmail",
    "price": 1800,
    "tag": "KEY PIECE",
    "stock": 5,
    "materials": [
      "Hand-Strung Seed Beads",
      "Metallic Cone Spikes",
      "Stainless Steel Chainmail Links"
    ],
    "image": "/assets/collection/body_chainmail/body_chainmail_13.webp",
    "images": [
      "/assets/collection/body_chainmail/body_chainmail_13.webp",
      "/assets/collection/body_chainmail/body_chainmail_01.webp",
      "/assets/collection/body_chainmail/body_chainmail_03.webp",
      "/assets/collection/body_chainmail/body_chainmail_07.webp",
      "/assets/collection/body_chainmail/body_chainmail_08.webp",
      "/assets/collection/body_chainmail/body_chainmail_09.webp",
      "/assets/collection/body_chainmail/body_chainmail_10.webp"
    ],
    "imgUrl": "/assets/collection/body_chainmail/body_chainmail_13.webp",
    "alt": "Spike beaded bralette body chainmail",
    "description": "Beaded bralette w spikes and punk theme — intricate bib collar of cascading hand-beaded loops, stainless steel chain links, and metallic spikes.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom wearable art",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true,
    "customMade": false
  },
  {
    "id": "featured-in0009",
    "sku": "IN0009",
    "name": "Purple jibaro cross top",
    "title": "Purple jibaro cross top",
    "category": "Tops",
    "price": 1500,
    "tag": "KEY PIECE",
    "stock": 1,
    "materials": [
      "Lustrous Purple Silk/Satin",
      "Gold Threadwork & Filigree",
      "Blood-Red Gems & Safety Pins"
    ],
    "image": "/assets/collection/tops/tops_20.webp",
    "images": [
      "/assets/collection/tops/tops_20.webp",
      "/assets/collection/tops/tops_07.webp",
      "/assets/collection/tops/tops_19.webp",
      "/assets/collection/tops/tops_26.webp",
      "/assets/collection/tops/tops_27.webp",
      "/assets/collection/tops/tops_34.webp",
      "/assets/collection/bralettes/bralettes_20.webp"
    ],
    "imgUrl": "/assets/collection/tops/tops_20.webp",
    "alt": "Purple jibaro cross top",
    "description": "Cross top halter purple with gold and red embellishment — halter neck cross-silhouette top in rich purple fabric lavishly embellished with metallic filigree, hanging charms, and safety-pin hardware.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom wearable art",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true,
    "customMade": false
  },
  {
    "id": "featured-in0010",
    "sku": "IN0010",
    "name": "Chainmail bra",
    "title": "Chainmail bra",
    "category": "Bralettes",
    "price": 1800,
    "tag": "KEY PIECE",
    "stock": 50,
    "materials": [
      "Hand-Linked Stainless Steel Rings",
      "Reinforced Neck & Back Chains",
      "Lobster Clasps"
    ],
    "image": "/assets/collection/body_chainmail/body_chainmail_14.webp",
    "images": [
      "/assets/collection/body_chainmail/body_chainmail_14.webp"
    ],
    "imgUrl": "/assets/collection/body_chainmail/body_chainmail_14.webp",
    "alt": "Chainmail bra",
    "description": "Bra made out of chain links — fluid metallic armor constructed entirely from hand-interlinked stainless steel rings. Ergonomic contouring and adjustable chain ties.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom wearable art",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true,
    "customMade": false
  },
  {
    "id": "featured-in0011",
    "sku": "IN0011",
    "name": "Purple pink beaded bralette",
    "title": "Purple pink beaded bralette",
    "category": "Bralettes",
    "price": 1500,
    "tag": "KEY PIECE",
    "stock": 1,
    "materials": [
      "Hand-Strung Glass & Acrylic Beads",
      "Multi-Strand Bib Cascade",
      "Adjustable Hardware"
    ],
    "image": "/assets/collection/bralettes/bralettes_08.webp",
    "images": [
      "/assets/collection/bralettes/bralettes_08.webp",
      "/assets/collection/bralettes/bralettes_01.webp",
      "/assets/collection/bralettes/bralettes_06.webp",
      "/assets/collection/bralettes/bralettes_07.webp",
      "/assets/collection/bralettes/bralettes_09.webp",
      "/assets/collection/bralettes/bralettes_10.webp"
    ],
    "imgUrl": "/assets/collection/bralettes/bralettes_08.webp",
    "alt": "Purple pink beaded bralette",
    "description": "Bralette/ bodychain made with pink and purple beads — multi-layered wearable jewelry draped across the bust with thousands of hand-strung beads in violet and magenta.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom wearable art",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true,
    "customMade": false
  },
  {
    "id": "featured-in0013",
    "sku": "IN0013",
    "name": "Denim upcycled headgear",
    "title": "Denim upcycled headgear",
    "category": "Headgear",
    "price": 1700,
    "tag": "KEY PIECE",
    "stock": 1,
    "materials": [
      "Deconstructed Reclaimed Denim",
      "Handcrafted Plastic Bottle Flowers",
      "Vintage Ribbons & Lace"
    ],
    "image": "/assets/collection/headgears/headgears_03.webp",
    "images": [
      "/assets/collection/headgears/headgears_03.webp",
      "/assets/collection/headgears/headgears_01.webp",
      "/assets/collection/headgears/headgears_02.webp",
      "/assets/collection/headgears/headgears_04.webp",
      "/assets/collection/headgears/headgears_05.webp",
      "/assets/collection/headgears/headgears_06.webp",
      "/assets/collection/headgears/headgears_07.webp"
    ],
    "imgUrl": "/assets/collection/headgears/headgears_03.webp",
    "alt": "Denim upcycled headgear",
    "description": "Denim headgear with green plastic bottle flowers and ribbons and laces vaganza — avant-garde sculptural headpiece and mask sculpted from frayed denim seams, heat-formed plastic bottle flowers, and draping ribbons.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom wearable art",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true,
    "customMade": false
  },
  {
    "id": "featured-in0014",
    "sku": "IN0014",
    "name": "Jhumka jacket",
    "title": "Jhumka jacket",
    "category": "Jackets",
    "price": 2600,
    "tag": "KEY PIECE",
    "stock": 1,
    "materials": [
      "Lush Brown Faux Fur",
      "Traditional Brass Jhumka Bells",
      "Draped Hardware Chains"
    ],
    "image": "/assets/collection/jackets/jackets_04.webp",
    "images": [
      "/assets/collection/jackets/jackets_04.webp",
      "/assets/collection/jackets/jackets_01.webp",
      "/assets/collection/jackets/jackets_02.webp",
      "/assets/collection/jackets/jackets_03.webp",
      "/assets/collection/jackets/jackets_05.webp",
      "/assets/collection/jackets/jackets_06.webp",
      "/assets/collection/jackets/jackets_10.webp"
    ],
    "imgUrl": "/assets/collection/jackets/jackets_04.webp",
    "alt": "Jhumka jacket",
    "description": "Jacket fur brown jhumkhas — rich chocolate brown faux fur cropped jacket adorned with dozens of traditional Indian brass jhumkas and connecting chain swags.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom wearable art",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true,
    "customMade": false
  },
  {
    "id": "featured-in0016",
    "sku": "IN0016",
    "name": "Cheetah print cavewoman set",
    "title": "Cheetah print cavewoman set",
    "category": "Co-ord sets",
    "price": 1999,
    "tag": "KEY PIECE",
    "stock": 1,
    "materials": [
      "Cheetah & Leopard Pattern Velour",
      "Brown Fur Accents",
      "Raw Asymmetric Hemline"
    ],
    "image": "/assets/collection/co_ords/co_ords_20.webp",
    "images": [
      "/assets/collection/co_ords/co_ords_20.webp",
      "/assets/collection/co_ords/co_ords_10.webp",
      "/assets/collection/co_ords/co_ords_14.webp",
      "/assets/collection/co_ords/co_ords_24.webp",
      "/assets/collection/co_ords/co_ords_35.webp",
      "/assets/collection/co_ords/co_ords_36.webp",
      "/assets/collection/co_ords/co_ords_38.webp"
    ],
    "imgUrl": "/assets/collection/co_ords/co_ords_20.webp",
    "alt": "Cheetah print cavewoman set",
    "description": "Cavewoman bra and leopard skirt — ferocious wild-animal print co-ord pairing an asymmetric ruched bralette with an uneven raw-hem leopard skirt.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom wearable art",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true,
    "customMade": false
  },
  {
    "id": "featured-in0018",
    "sku": "IN0018",
    "name": "Flowery",
    "title": "Flowery",
    "category": "Tops",
    "price": 1799,
    "tag": "KEY PIECE",
    "stock": 6,
    "materials": [
      "Hand-Crocheted Cotton Yarn",
      "Multi-Colored 3D Floral Appliques",
      "Lace-Up Back"
    ],
    "image": "/assets/collection/tops/tops_23.webp",
    "images": [
      "/assets/collection/tops/tops_23.webp",
      "/assets/collection/tops/tops_06.webp",
      "/assets/collection/tops/tops_33.webp"
    ],
    "imgUrl": "/assets/collection/tops/tops_23.webp",
    "alt": "Flowery",
    "description": "Crocheted top with flowers multi colored — hand-knit kaleidoscopic crop top blooming with vibrant three-dimensional crochet flowers over a supportive frame.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom wearable art",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true,
    "customMade": false
  },
  {
    "id": "featured-in0019",
    "sku": "IN0019",
    "name": "Pearlite crochet top",
    "title": "Pearlite crochet top",
    "category": "Tops",
    "price": 1500,
    "tag": "KEY PIECE",
    "stock": 12,
    "materials": [
      "Freshwater-Style White Pearls",
      "Crocheted Metallic Thread Base",
      "Satin Ties"
    ],
    "image": "/assets/collection/bralettes/bralettes_13.webp",
    "images": [
      "/assets/collection/bralettes/bralettes_13.webp",
      "/assets/collection/bralettes/bralettes_11.webp",
      "/assets/collection/bralettes/bralettes_12.webp",
      "/assets/collection/bralettes/bralettes_14.webp",
      "/assets/collection/bralettes/bralettes_15.webp",
      "/assets/collection/bralettes/bralettes_16.webp",
      "/assets/collection/bralettes/bralettes_17.webp"
    ],
    "imgUrl": "/assets/collection/bralettes/bralettes_13.webp",
    "alt": "Pearlite crochet top",
    "description": "White pearls crocheted on bikini top — ethereal halter bikini top hand-woven with hundreds of luminous white pearls crocheted into an organic mesh.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom wearable art",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true,
    "customMade": false
  },
  {
    "id": "featured-in0020",
    "sku": "IN0020",
    "name": "Barbie set",
    "title": "Barbie set",
    "category": "Co-ord sets",
    "price": 3500,
    "tag": "KEY PIECE",
    "stock": 12,
    "materials": [
      "Sculpted Pink Starfish Bra",
      "Distressed Denim Mini with Pink Fur Trim",
      "Plush Headgear"
    ],
    "image": "/assets/collection/co_ords/co_ords_26.webp",
    "images": [
      "/assets/collection/co_ords/co_ords_26.webp",
      "/assets/collection/co_ords/co_ords_27.webp",
      "/assets/collection/co_ords/co_ords_28.webp"
    ],
    "imgUrl": "/assets/collection/co_ords/co_ords_26.webp",
    "alt": "Barbie set",
    "description": "Pink starfish bra + Barbie short skirt + green & pink fluffy headgear — the quintessential maximalist trio: sculpted hot pink starfish bralette, frayed denim mini edged with neon pink faux fur, and fluffy headpiece.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom wearable art",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true,
    "customMade": false
  },
  {
    "id": "featured-in0021",
    "sku": "IN0021",
    "name": "Spiral body chainmail top",
    "title": "Spiral body chainmail top",
    "category": "Body chainmail",
    "price": 2500,
    "tag": "KEY PIECE",
    "stock": 1,
    "materials": [
      "Architectural Spiral Coiled Wire",
      "Hand-Linked Stainless Steel Chains",
      "Draped Halter Harness"
    ],
    "image": "/assets/collection/body_chainmail/body_chainmail_22.webp",
    "images": [
      "/assets/collection/body_chainmail/body_chainmail_22.webp",
      "/assets/collection/body_chainmail/body_chainmail_15.webp",
      "/assets/collection/body_chainmail/body_chainmail_16.webp",
      "/assets/collection/body_chainmail/body_chainmail_17.webp",
      "/assets/collection/body_chainmail/body_chainmail_19.webp",
      "/assets/collection/body_chainmail/body_chainmail_21.webp"
    ],
    "imgUrl": "/assets/collection/body_chainmail/body_chainmail_22.webp",
    "alt": "Spiral body chainmail top",
    "description": "Spiral wired  chained top in silver — concentric wire spirals coiled and woven with steel chains to create a sculptural breastplate that cascades down the torso.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom wearable art",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true,
    "customMade": false
  },
  {
    "id": "featured-in0023",
    "sku": "IN0023",
    "name": "Spike grey blouse/bra",
    "title": "Spike grey blouse/bra",
    "category": "Tops",
    "price": 2000,
    "tag": "KEY PIECE",
    "stock": 1,
    "materials": [
      "Heavy Hand-Set Metallic Spikes",
      "Tailored Saree Blouse Base",
      "Silver Hardware Accents"
    ],
    "image": "/assets/collection/tops/tops_08.webp",
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
    "imgUrl": "/assets/collection/tops/tops_08.webp",
    "alt": "Spike grey blouse/bra",
    "description": "Blouse with spikes — traditional Indian grey saree blouse transformed into high-impact wearable armor with hundreds of pointed cone spikes covering the bodice.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom wearable art",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true,
    "customMade": false
  },
  {
    "id": "featured-in0024",
    "sku": "IN0024",
    "name": "Silver shoe corset and skirt set",
    "title": "Silver shoe corset and skirt set",
    "category": "Co-ord sets",
    "price": 3500,
    "tag": "KEY PIECE",
    "stock": 1,
    "materials": [
      "Deconstructed Silver Athletic Sneaker",
      "Brown Faux Fur Trim",
      "Matching Metallic Mini Skirt"
    ],
    "image": "/assets/collection/corsets/corsets_03.webp",
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
    "imgUrl": "/assets/collection/corsets/corsets_03.webp",
    "alt": "Silver shoe corset and skirt set",
    "description": "Corset in silver color made out of shoe and brown fur and similar skirt for a set — avant-garde runway set where athletic sneakers were unstitched and re-formed into a boned corset trimmed with brown fur, paired with metallic mini skirt.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom wearable art",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true,
    "customMade": false
  },
  {
    "id": "featured-in0025",
    "sku": "IN0025",
    "name": "Spike red top",
    "title": "Spike red top",
    "category": "Tops",
    "price": 2200,
    "tag": "KEY PIECE",
    "stock": 2,
    "materials": [
      "Sculpted Red Heart Bustier",
      "Hand-Mounted Metallic Spikes",
      "Backless Strappy Tie Closure"
    ],
    "image": "/assets/collection/tops/tops_10.webp",
    "images": [
      "/assets/collection/tops/tops_10.webp",
      "/assets/collection/tops/tops_01.webp",
      "/assets/collection/tops/tops_15.webp",
      "/assets/collection/tops/tops_28.webp",
      "/assets/collection/tops/tops_47.webp"
    ],
    "imgUrl": "/assets/collection/tops/tops_10.webp",
    "alt": "Spike red top",
    "description": "Red heart top with spikes backless — sculpted crimson heart-shaped halter crop top studded with gleaming spikes with an open criss-cross strappy back.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom wearable art",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true,
    "customMade": false
  },
  {
    "id": "featured-in0026",
    "sku": "IN0026",
    "name": "Check mini red skirt",
    "title": "Check mini red skirt",
    "category": "Skirts",
    "price": 1800,
    "tag": "KEY PIECE",
    "stock": 1,
    "materials": [
      "Red Gingham Check Cotton",
      "Overlaid Black Fishnet",
      "Rose & Ribbon Waist Hardware"
    ],
    "image": "/assets/collection/skirts/skirts_03.webp",
    "images": [
      "/assets/collection/skirts/skirts_03.webp",
      "/assets/collection/skirts/skirts_01.webp",
      "/assets/collection/skirts/skirts_02.webp"
    ],
    "imgUrl": "/assets/collection/skirts/skirts_03.webp",
    "alt": "Check mini red skirt",
    "description": "Red skirt w checks and fishnet mini size — pleated red and white gingham mini skirt overlaid with deconstructed black fishnet mesh, red rose rosette, and ribbon tails.",
    "details": [
      "100% Handcrafted by Dhrisni in our Studio",
      "Authentic upcycled hardware and custom wearable art",
      "AVZ Vaganza authenticity certificate included"
    ],
    "care": "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    "sizes": [
      "Free Size"
    ],
    "inMuseum": false,
    "featured": true,
    "customMade": false
  }
];

export const LOOKBOOK_ENTRIES = [
  {
    "id": "look-01",
    "code": "LOOK 001 • IN0013 • DENIM UPCYCLED HEADGEAR",
    "sku": "IN0013",
    "title": "Denim upcycled headgear",
    "subtitle": "Denim Headgear with Green Plastic Bottle Flowers & Ribbons",
    "image": "/assets/lookbook/lookbook_01.webp",
    "altImages": [
      "/assets/lookbook/lookbook_02.webp"
    ],
    "aspect": "portrait",
    "caption": "Handcrafted wearable art headgear featuring upcycled green bottle florals and delicate lace vaganza.",
    "story": "Denim headgear with green plastic bottle flowers and ribbons and laces vaganza. Handcrafted wearable art sculpture designed by Dhrisni.",
    "materials": "Reclaimed denim, upcycled plastic bottle florals, artisanal ribbons, delicate lace trimmings",
    "vibe": "Archival Headpiece",
    "category": "Headgear",
    "price": 1700
  },
  {
    "id": "look-02",
    "code": "LOOK 002 • IN0003 • JERSEY CO ORD",
    "sku": "IN0003",
    "title": "Jersey co ord",
    "subtitle": "Jersey Upcycled Corset & Skirt Set",
    "image": "/assets/lookbook/lookbook_03.webp",
    "altImages": [
      "/assets/lookbook/lookbook_04.webp"
    ],
    "aspect": "portrait",
    "caption": "Sculptural high-impact two-piece set meticulously reconstructed from reclaimed sports jersey textiles.",
    "story": "Jersey upcycled corset & skirt. Sculptural high-impact two-piece set meticulously reconstructed from reclaimed sports jersey textiles.",
    "materials": "Reconstructed vintage athletic jersey, structural corset boning, stretch ribbing, contrast stitching",
    "vibe": "Subcultural Streetwear",
    "category": "Co-ord sets",
    "price": 3500
  },
  {
    "id": "look-03",
    "code": "LOOK 003 • IN0009 • PURPLE JIBARO CROSS TOP",
    "sku": "IN0009",
    "title": "Purple jibaro cross top",
    "subtitle": "Cross Top Halter Purple with Gold & Red Embellishment",
    "image": "/assets/lookbook/lookbook_05.webp",
    "altImages": [
      "/assets/lookbook/lookbook_06.webp"
    ],
    "aspect": "portrait",
    "caption": "Avant-garde asymmetrical halter top adorned with regal metallic trims and ruby drops.",
    "story": "Cross top halter purple with gold and red embellishment. Avant-garde asymmetrical halter top adorned with regal metallic trims.",
    "materials": "Royal purple structured canvas, gilded gold bullion trims, crimson drop embellishments, tie fastening",
    "vibe": "Regal Avant-Garde",
    "category": "Tops",
    "price": 1500
  },
  {
    "id": "look-04",
    "code": "LOOK 004 • IN0006 • SPIKE BEADED BRALETTE BODY CHAINMAIL",
    "sku": "IN0006",
    "title": "Spike beaded bralette body chainmail",
    "subtitle": "Beaded Bralette with Spikes & Punk Theme",
    "image": "/assets/lookbook/lookbook_07.webp",
    "altImages": [
      "/assets/lookbook/lookbook_08.webp"
    ],
    "aspect": "landscape",
    "caption": "Intricately woven body chainmail dripping with metallic cone spikes and hand-strung beads.",
    "story": "Beaded bralette w spikes and punk theme. Intricately woven body chainmail dripping with metallic cone spikes and hand-strung beads.",
    "materials": "Hand-linked stainless steel chains, chrome cone spikes, iridescent glass beads, structural harness clasps",
    "vibe": "Cyberpunk Armor",
    "category": "Body chainmail",
    "price": 1800
  },
  {
    "id": "look-05",
    "code": "LOOK 005 • IN0010 • CHAINMAIL BRA",
    "sku": "IN0010",
    "title": "Chainmail bra",
    "subtitle": "Bra Made Out of Stainless Chain Links",
    "image": "/assets/lookbook/lookbook_09.webp",
    "altImages": [
      "/assets/lookbook/lookbook_10.webp"
    ],
    "aspect": "portrait",
    "caption": "Fluid stainless steel rings individually hand-interlinked to create an impenetrable, liquid-shine silhouette.",
    "story": "Bra made out of chain links. Fluid stainless steel rings individually hand-interlinked to create an impenetrable, liquid-shine silhouette.",
    "materials": "100% Stainless steel rings, lobster clasp closures, reinforced comfort suspension chain",
    "vibe": "Liquid Metal Armor",
    "category": "Bralettes",
    "price": 1800
  },
  {
    "id": "look-06",
    "code": "LOOK 006 • IN0015 • BLACK CAT CO ORD SET",
    "sku": "IN0015",
    "title": "Black Cat Co ord Set",
    "subtitle": "Silver Corset & Black Fur Skirt",
    "image": "/assets/lookbook/lookbook_11.webp",
    "altImages": [
      "/assets/lookbook/lookbook_12.webp"
    ],
    "aspect": "portrait",
    "caption": "Runway statement ensemble pairing a molded silver structural corset bodice with deep black textured fur.",
    "story": "Silver corset and black fur skirt. Runway statement ensemble pairing a molded silver structural corset bodice with deep black textured fur.",
    "materials": "Silver metallic reclaimed hardware, reinforced corset boning, deconstructed plush black faux fur",
    "vibe": "Dark Runway Elegance",
    "category": "Co-ord sets",
    "price": 2200
  },
  {
    "id": "look-07",
    "code": "LOOK 007 • IN0026 • CHECK MINI RED SKIRT",
    "sku": "IN0026",
    "title": "Check mini red skirt",
    "subtitle": "Red Skirt with Checks & Fishnet Mini Size",
    "image": "/assets/lookbook/lookbook_13.webp",
    "altImages": [
      "/assets/lookbook/lookbook_14.webp"
    ],
    "aspect": "portrait",
    "caption": "Punk-rock pleated mini skirt layered with deconstructed distressed fishnet accents.",
    "story": "Red skirt w checks and fishnet mini size. Punk-rock pleated mini skirt layered with distressed fishnet accents.",
    "materials": "Red gingham woven plaid, industrial eyelet hardware, layered black fishnet lining",
    "vibe": "Subcultural Punk",
    "category": "Skirts",
    "price": 1800
  },
  {
    "id": "look-08",
    "code": "LOOK 008 • IN0019 • PEARLITE CROCHET TOP",
    "sku": "IN0019",
    "title": "Pearlite crochet top",
    "subtitle": "White Pearls Crocheted on Bikini Top",
    "image": "/assets/lookbook/lookbook_15.webp",
    "altImages": [
      "/assets/lookbook/lookbook_16.webp"
    ],
    "aspect": "portrait",
    "caption": "Hand-knitted artisanal bikini bodice richly embellished with luminescent faux pearl clusters.",
    "story": "White pearls crocheted on bikini top. Hand-knitted artisanal bikini bodice richly embellished with luminescent faux pearl clusters.",
    "materials": "Organic cotton yarn, lustrous faux pearl cabochons, adjustable back tie fastening",
    "vibe": "Artisanal Romance",
    "category": "Tops",
    "price": 1500
  },
  {
    "id": "look-09",
    "code": "LOOK 009 • IN0007 • PSYCHEDELIC BROWN DENIM BAG",
    "sku": "IN0007",
    "title": "Psychedelic brown denim bag",
    "subtitle": "Bag with Acid Paint Denim Jeans Upcycled",
    "image": "/assets/lookbook/lookbook_17.webp",
    "altImages": [
      "/assets/lookbook/lookbook_18.webp"
    ],
    "aspect": "portrait",
    "caption": "Shoulder bag handcrafted from repurposed denim jeans with custom acid dye bleach swirl wash.",
    "story": "Bag with acid paint denim jeans upcycled. Shoulder bag handcrafted from repurposed denim jeans with custom acid dye bleach swirl wash and chain swags.",
    "materials": "Upcycled heavy denim jeans, bleach-washed patterns, vintage bronze chain swags, floral denim brooches",
    "vibe": "Wearable Archive Accessory",
    "category": "Bags",
    "price": 999
  },
  {
    "id": "look-10",
    "code": "LOOK 010 • IN0009 • PURPLE JIBARO CROSS TOP",
    "sku": "IN0009",
    "title": "Purple jibaro cross top",
    "subtitle": "Cross Top Halter Purple with Gold & Red Embellishment (Detail)",
    "image": "/assets/lookbook/lookbook_19.webp",
    "altImages": [
      "/assets/lookbook/lookbook_20.webp"
    ],
    "aspect": "portrait",
    "caption": "Studio close-up highlighting the hand-applied gold braids and ruby accents on royal purple canvas.",
    "story": "Cross top halter purple with gold and red embellishment. Studio close-up highlighting the hand-applied gold braids and ruby accents.",
    "materials": "Heavyweight purple fabric, metallic gold braids, red cabochon beads, lace-up spine straps",
    "vibe": "Regal Avant-Garde",
    "category": "Tops",
    "price": 1500
  },
  {
    "id": "look-11",
    "code": "LOOK 011 • IN0022 • CROSS TAPE BRALETTE",
    "sku": "IN0022",
    "title": "Cross tape bralette",
    "subtitle": "Bralette in the Illusion of Taped Bust",
    "image": "/assets/lookbook/lookbook_21.webp",
    "altImages": [
      "/assets/lookbook/lookbook_22.webp"
    ],
    "aspect": "portrait",
    "caption": "Graphic deconstructed cross silhouette crafted to simulate electrical tape with wearable comfort.",
    "story": "Bralette in the illusion of taped bust. Graphic deconstructed cross silhouette crafted to simulate electrical tape with wearable comfort.",
    "materials": "Glossy black coated vinyl, stretch base fabric, comfort elastic backing, adjustable clasps",
    "vibe": "Brutalist Minimal",
    "category": "Bralettes",
    "price": 1200
  },
  {
    "id": "look-12",
    "code": "LOOK 012 • IN0015 • BLACK CAT CO ORD SET",
    "sku": "IN0015",
    "title": "Black Cat Co ord Set",
    "subtitle": "Silver Corset & Black Fur Skirt (Full Silhouette)",
    "image": "/assets/lookbook/lookbook_23.webp",
    "altImages": [
      "/assets/lookbook/lookbook_24.webp"
    ],
    "aspect": "portrait",
    "caption": "The full runway silhouette captured on model, balancing industrial silver boning against deep plush textures.",
    "story": "Silver corset and black fur skirt. The full runway silhouette captured on model, balancing industrial silver boning against deep plush textures.",
    "materials": "Silver metallic finish, flexible spiral steel bones, midnight black faux fur, rear eyelet lacing",
    "vibe": "Dark Runway Elegance",
    "category": "Co-ord sets",
    "price": 2200
  },
  {
    "id": "look-13",
    "code": "LOOK 013 • IN0021 • SPIRAL BODY CHAINMAIL TOP",
    "sku": "IN0021",
    "title": "Spiral body chainmail top",
    "subtitle": "Spiral Wired Chained Top in Silver",
    "image": "/assets/lookbook/lookbook_25.webp",
    "altImages": [
      "/assets/lookbook/lookbook_26.webp"
    ],
    "aspect": "portrait",
    "caption": "Concentric hand-wound wire coils interlaced with fluid chain links creating a futuristic kinetic bodice.",
    "story": "Spiral wired chained top in silver. Concentric hand-wound wire coils interlaced with fluid chain links creating a futuristic kinetic bodice.",
    "materials": "High-tensile silver wire spirals, stainless steel jump rings, adjustable neckline and torso chains",
    "vibe": "Kinetic Sculpture",
    "category": "Body chainmail",
    "price": 2500
  },
  {
    "id": "look-14",
    "code": "LOOK 014 • IN0004 • SPIKE ARM CUFFS",
    "sku": "IN0004",
    "title": "Spike arm cuffs",
    "subtitle": "Armcuffs with Spikes",
    "image": "/assets/lookbook/lookbook_27.webp",
    "altImages": [
      "/assets/lookbook/lookbook_28.webp"
    ],
    "aspect": "portrait",
    "caption": "High-impact wrist and forearm armor studded with menacing polished nickel cone spikes.",
    "story": "Armcuffs w spikes. High-impact wrist and forearm armor studded with menacing polished nickel cone spikes.",
    "materials": "Heavy vegan leather straps, 1-inch polished nickel cone spikes, adjustable buckle hardware",
    "vibe": "Defensive Hardware",
    "category": "Arm cuffs",
    "price": 600
  },
  {
    "id": "look-15",
    "code": "LOOK 015 • IN0005 • FRILLS BELT PURPLE",
    "sku": "IN0005",
    "title": "Frills belt purple",
    "subtitle": "Belt with Fabrics Hanging",
    "image": "/assets/lookbook/lookbook_29.webp",
    "altImages": [
      "/assets/lookbook/lookbook_30.webp"
    ],
    "aspect": "portrait",
    "caption": "Statement waist cincher with cascading raw-edge textile frills and distressed fabric tassels.",
    "story": "Belt with fabrics hanging. Statement waist cincher with cascading raw-edge textile frills and distressed fabric tassels.",
    "materials": "Distressed purple canvas, raw-cut chiffon frills, heavy grommeted utility belt strap",
    "vibe": "Tactile Grunge",
    "category": "Belts",
    "price": 800
  },
  {
    "id": "look-16",
    "code": "LOOK 016 • IN0025 • SPIKE RED TOP",
    "sku": "IN0025",
    "title": "Spike red top",
    "subtitle": "Red Heart Top with Spikes Backless",
    "image": "/assets/lookbook/lookbook_31.webp",
    "altImages": [
      "/assets/lookbook/lookbook_32.webp"
    ],
    "aspect": "portrait",
    "caption": "Sculpted crimson heart-shaped halter crop top studded with gleaming silver spikes with an open back.",
    "story": "Red heart top with spikes backless. Sculpted crimson heart-shaped halter crop top studded with gleaming silver spikes with an open back.",
    "materials": "Crimson structured vinyl, silver punk cone spikes, backless criss-cross tie straps",
    "vibe": "Aggressive Romance",
    "category": "Tops",
    "price": 2200
  },
  {
    "id": "look-17",
    "code": "LOOK 017 • IN0007 • PSYCHEDELIC BROWN DENIM BAG",
    "sku": "IN0007",
    "title": "Psychedelic brown denim bag",
    "subtitle": "Bag with Acid Paint Denim Jeans Upcycled",
    "image": "/assets/lookbook/lookbook_33.webp",
    "altImages": [
      "/assets/lookbook/lookbook_34.webp"
    ],
    "aspect": "square",
    "caption": "On-model capture featuring the one-of-one acid dye washed denim bag with brass chains and denim floral accents.",
    "story": "Bag with acid paint denim jeans upcycled. Handcrafted shoulder bag repurposed from denim jeans with custom acid dye bleach swirl wash and vintage chain swags.",
    "materials": "Upcycled acid-wash denim jeans, repurposed vintage brooches, chunky brass link chains, dual handle straps",
    "vibe": "Wearable Archive Accessory",
    "category": "Bags",
    "price": 999
  },
  {
    "id": "look-18",
    "code": "LOOK 018 • IN0008 • SPIKE TUBE TOP",
    "sku": "IN0008",
    "title": "Spike tube top",
    "subtitle": "Tube Top Rexine Black with Spikes Forming Cross",
    "image": "/assets/lookbook/lookbook_35.webp",
    "altImages": [
      "/assets/lookbook/lookbook_36.webp"
    ],
    "aspect": "portrait",
    "caption": "Studio on-model editorial capturing the matte black rexine tube top with gleaming silver spike crucifix motif.",
    "story": "Tube top rexine black with spikes forming cross. Tailored crop bodice constructed from black rexine with rows of high-impact cone spikes forming a sculptural cross.",
    "materials": "Matte black rexine vinyl, high-density alloy pyramid and cone spikes, elasticized inner grip",
    "vibe": "Subcultural Iconography",
    "category": "Tops",
    "price": 2000
  },
  {
    "id": "look-19",
    "code": "LOOK 019 • IN0016 • CHEETAH PRINT CAVEWOMAN SET",
    "sku": "IN0016",
    "title": "Cheetah print cavewoman set",
    "subtitle": "Cavewoman Bra & Leopard Skirt Set",
    "image": "/assets/lookbook/lookbook_37.webp",
    "altImages": [
      "/assets/lookbook/lookbook_38.webp"
    ],
    "aspect": "portrait",
    "caption": "Raw predatory two-piece set featuring asymmetrical cheetah print textile draping with jagged deconstructed hems.",
    "story": "Cavewoman bra and leopard skirt. Raw predatory two-piece set featuring asymmetrical cheetah print textile draping with jagged deconstructed hems.",
    "materials": "Printed faux cheetah velour, distressed faux suede ties, rustic raw edge finish",
    "vibe": "Feral Couture",
    "category": "Co-ord sets",
    "price": 1999
  },
  {
    "id": "look-20",
    "code": "LOOK 020 • IN0015 • BLACK CAT CO ORD SET",
    "sku": "IN0015",
    "title": "Black Cat Co ord Set",
    "subtitle": "Silver Corset & Black Fur Skirt",
    "image": "/assets/lookbook/lookbook_39.webp",
    "altImages": [
      "/assets/lookbook/lookbook_40.webp"
    ],
    "aspect": "portrait",
    "caption": "Editorial runway shoot of the iconic 'Black Cat' two-piece set pairing the molded silver eyelet corset with plush black faux fur.",
    "story": "Silver corset and black fur skirt. Runway statement ensemble pairing a molded silver structural corset bodice with deep black textured fur and Egyptian ankh choker.",
    "materials": "Silver eyelet corset bodice, structural front rings, premium midnight black faux fur, ankh hardware accent",
    "vibe": "Dark Glamour",
    "category": "Co-ord sets",
    "price": 2200
  },
  {
    "id": "look-21",
    "code": "LOOK 021 • IN0009 • PURPLE JIBARO CROSS TOP",
    "sku": "IN0009",
    "title": "Purple jibaro cross top",
    "subtitle": "Cross Top Halter Purple with Gold & Red Embellishment (Runway Cut)",
    "image": "/assets/lookbook/lookbook_41.webp",
    "altImages": [
      "/assets/lookbook/lookbook_42.webp"
    ],
    "aspect": "portrait",
    "caption": "Asymmetrical cross halter bodice showcasing ornate metallic galloon trims and deep purple draping.",
    "story": "Cross top halter purple with gold and red embellishment. Asymmetrical cross halter bodice showcasing ornate metallic galloon trims and deep purple draping.",
    "materials": "Structured royal purple weave, gold filigree trim, ruby glass drops, halter tie cords",
    "vibe": "Regal Avant-Garde",
    "category": "Tops",
    "price": 1500
  },
  {
    "id": "look-22",
    "code": "LOOK 022 • IN0014 • JHUMKA JACKET",
    "sku": "IN0014",
    "title": "Jhumka jacket",
    "subtitle": "Jacket Fur Brown Jhumkhas",
    "image": "/assets/lookbook/lookbook_43.webp",
    "altImages": [
      "/assets/lookbook/lookbook_44.webp"
    ],
    "aspect": "portrait",
    "caption": "Plush brown faux fur jacket adorned with traditional musical jhumka bells and oxidized metal bells that jingle with movement.",
    "story": "Jacket fur brown jhumkhas. Plush brown faux fur jacket adorned with traditional musical jhumka bells and oxidized metal bells that jingle with movement.",
    "materials": "Deep brown faux fur, traditional brass jhumkha ornaments, silk satin inner lining",
    "vibe": "Heritage Maximalism",
    "category": "Jackets",
    "price": 2600
  },
  {
    "id": "look-23",
    "code": "LOOK 023 • IN0015 • BLACK CAT CO ORD SET",
    "sku": "IN0015",
    "title": "Black Cat Co ord Set",
    "subtitle": "Silver Corset & Black Fur Skirt (Movement Study)",
    "image": "/assets/lookbook/lookbook_45.webp",
    "altImages": [
      "/assets/lookbook/lookbook_46.webp"
    ],
    "aspect": "portrait",
    "caption": "Close crop focusing on the tactile contrast between cold metallic eyelets and tactile fur in low-key studio lighting.",
    "story": "Silver corset and black fur skirt. Close crop focusing on the tactile contrast between cold metallic eyelets and tactile fur in low-key studio lighting.",
    "materials": "Reclaimed silver hardware, boned corset armature, plush black fur",
    "vibe": "Dark Glamour",
    "category": "Co-ord sets",
    "price": 2200
  },
  {
    "id": "look-24",
    "code": "LOOK 024 • IN0011 • PURPLE PINK BEADED BRALETTE",
    "sku": "IN0011",
    "title": "Purple pink beaded bralette",
    "subtitle": "Bralette / Bodychain Made with Pink & Purple Beads",
    "image": "/assets/lookbook/lookbook_47.webp",
    "altImages": [
      "/assets/lookbook/lookbook_48.webp"
    ],
    "aspect": "portrait",
    "caption": "Intricate handcrafted beadwork weaving shimmering candy pink and deep violet crystal beads across the bust.",
    "story": "Bralette/ bodychain made with pink and purple beads. Intricate handcrafted beadwork weaving shimmering candy pink and deep violet crystal beads across the bust.",
    "materials": "Faceted glass crystal beads, high-tensile wire thread, silver closure lobster clasps",
    "vibe": "Iridescent Body Armor",
    "category": "Bralettes",
    "price": 1500
  },
  {
    "id": "look-25",
    "code": "LOOK 025 • IN0023 • SPIKE GREY BLOUSE/BRA",
    "sku": "IN0023",
    "title": "Spike grey blouse/bra",
    "subtitle": "Blouse with Spikes",
    "image": "/assets/lookbook/lookbook_49.webp",
    "altImages": [
      "/assets/lookbook/lookbook_50.webp"
    ],
    "aspect": "portrait",
    "caption": "Traditional Indian grey saree blouse transformed into high-impact wearable armor with hundreds of hand-anchored metallic spikes.",
    "story": "Blouse with spikes. Traditional Indian grey saree blouse transformed into high-impact wearable armor with hundreds of hand-anchored metallic spikes.",
    "materials": "Grey textured saree fabric, hundreds of cone spikes, inner reinforced canvas lining, hook-and-eye closure",
    "vibe": "Deconstructed Traditional",
    "category": "Tops",
    "price": 2000
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
