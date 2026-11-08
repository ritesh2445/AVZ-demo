const fs = require('fs');

const CONSOLIDATED_PRODUCTS = [
  {
    id: "avz-in-0001",
    sku: "IN0001",
    name: "Spikeria bra",
    title: "Spikeria bra",
    price: 1999,
    compare_at_price: null,
    stock: 50,
    category: "Bralettes",
    tag: "BEST SELLER",
    materials: ["Hand-Set Metallic Spikes", "Reinforced Bra Base", "Upcycled Hardware"],
    sizes: ["S (Bust 32-34in)", "M (Bust 34-36in)", "L (Bust 36-38in)"],
    images: [
      "/assets/collection/bralettes/bralettes_30.webp",
      "/assets/collection/bralettes/bralettes_31.webp",
      "/assets/collection/bralettes/bralettes_32.webp"
    ],
    image: "/assets/collection/bralettes/bralettes_30.webp",
    description: "Bra with spikes studded — individually hand-set metallic cone spikes over a structured bra base. Raw metallic rebellion and punk cyber-couture.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Hand-set conical metallic spikes with reinforced inner lining",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: true,
    customMade: false
  },
  {
    id: "avz-in-0002",
    sku: "IN0002",
    name: "Keyboard bra",
    title: "Keyboard bra",
    price: 2500,
    compare_at_price: null,
    stock: 100,
    category: "Bralettes",
    tag: "SIGNATURE",
    materials: ["Upcycled Mechanical Keycaps", "Structured Bra Cups", "Industrial Hardware"],
    sizes: ["S (Bust 32-34in)", "M (Bust 34-36in)", "L (Bust 36-38in)"],
    images: [
      "/assets/collection/bralettes/bralettes_33.webp",
      "/assets/collection/bralettes/bralettes_03.webp",
      "/assets/collection/bralettes/bralettes_04.webp",
      "/assets/collection/bralettes/bralettes_05.webp"
    ],
    image: "/assets/collection/bralettes/bralettes_33.webp",
    description: "Bra w keyboard studded — deconstructed mechanical keyboard keycaps individually set across structured bust cups. Tactile maximalism and wearable sculpture.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Upcycled salvaged tactile keycaps",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: true,
    customMade: false
  },
  {
    id: "avz-in-0003",
    sku: "IN0003",
    name: "Jersey co ord",
    title: "Jersey co ord",
    price: 3500,
    compare_at_price: null,
    stock: 1,
    category: "Co-ord sets",
    tag: "1 OF 1 ARCHIVE",
    materials: ["Upcycled Sports Jersey", "Heavy Front Zipper", "Pleated Mesh Hem"],
    sizes: ["Size: Small"],
    images: [
      "/assets/collection/co_ords/co_ords_07.webp",
      "/assets/collection/co_ords/co_ords_01.webp",
      "/assets/collection/co_ords/co_ords_08.webp",
      "/assets/collection/co_ords/co_ords_09.webp",
      "/assets/collection/co_ords/co_ords_19.webp",
      "/assets/collection/co_ords/co_ords_23.webp",
      "/assets/collection/co_ords/co_ords_25.webp"
    ],
    image: "/assets/collection/co_ords/co_ords_07.webp",
    description: "Jersey upcycled corset & skirt — reconstructed sports jersey tailored into a boned corset bodice with heavy front industrial zipper and matching pleated skirt.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "1-of-1 archival upcycled jersey reconstruction",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: true,
    customMade: false
  },
  {
    id: "avz-in-0004",
    sku: "IN0004",
    name: "Spike arm cuffs",
    title: "Spike arm cuffs",
    price: 600,
    compare_at_price: null,
    stock: 30,
    category: "Arm cuffs",
    tag: "ACCESSORY",
    materials: ["Metallic Cone Spikes", "Black Rexine / Leatherette Base", "Adjustable Snaps"],
    sizes: ["One Size (Adjustable)"],
    images: [
      "/assets/collection/armcuffs/armcuffs_01.webp",
      "/assets/collection/armcuffs/armcuffs_03.webp",
      "/assets/collection/armcuffs/armcuffs_04.webp",
      "/assets/collection/armcuffs/armcuffs_05.webp"
    ],
    image: "/assets/collection/armcuffs/armcuffs_01.webp",
    description: "Armcuffs w spikes — studded forearm and wrist gauntlets with hand-set metallic spikes. Statement armor for subcultural and editorial styling.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Heavy industrial conical spikes",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: false,
    customMade: false
  },
  {
    id: "avz-in-0005",
    sku: "IN0005",
    name: "Frills belt purple",
    title: "Frills belt purple",
    price: 800,
    compare_at_price: null,
    stock: 1,
    category: "Belts",
    tag: "1 OF 1 ARCHIVE",
    materials: ["Cascading Reclaimed Fabric Frills", "Ribbon Drapes", "Upcycled Hardware Clasp"],
    sizes: ["One Size (Adjustable Waist)"],
    images: [
      "/assets/collection/belts/belts_01.webp",
      "/assets/collection/belts/belts_02.webp",
      "/assets/collection/belts/belts_03.webp",
      "/assets/collection/belts/belts_04.webp"
    ],
    image: "/assets/collection/belts/belts_01.webp",
    description: "Belt with fabrics hanging — multi-textured waist harness adorned with cascading purple and printed fabric frills and free-hanging ribbons.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Upcycled deadstock fabric frills",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: false,
    customMade: false
  },
  {
    id: "avz-in-0006",
    sku: "IN0006",
    name: "Spike beaded bralette body chainmail",
    title: "Spike beaded bralette body chainmail",
    price: 1800,
    compare_at_price: null,
    stock: 5,
    category: "Body chainmail",
    tag: "HAND-FORGED",
    materials: ["Hand-Strung Seed Beads", "Metallic Cone Spikes", "Stainless Steel Chainmail Links"],
    sizes: ["One Size (Adjustable Chain Drape)"],
    images: [
      "/assets/collection/body_chainmail/body_chainmail_13.webp",
      "/assets/collection/body_chainmail/body_chainmail_01.webp",
      "/assets/collection/body_chainmail/body_chainmail_03.webp",
      "/assets/collection/body_chainmail/body_chainmail_07.webp",
      "/assets/collection/body_chainmail/body_chainmail_08.webp",
      "/assets/collection/body_chainmail/body_chainmail_09.webp",
      "/assets/collection/body_chainmail/body_chainmail_10.webp"
    ],
    image: "/assets/collection/body_chainmail/body_chainmail_13.webp",
    description: "Beaded bralette w spikes and punk theme — intricate bib collar of cascading hand-beaded loops, stainless steel chain links, and metallic spikes.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Over 500 hand-threaded glass beads and steel links",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: true,
    customMade: false
  },
  {
    id: "avz-in-0007",
    sku: "IN0007",
    name: "Psychedelic brown denim bag",
    title: "Psychedelic brown denim bag",
    price: 999,
    compare_at_price: null,
    stock: 1,
    category: "Bags",
    tag: "1 OF 1 ARCHIVE",
    materials: ["Upcycled Acid-Washed Denim Jeans", "Neon Hand-Painted Motifs", "Satin Ribbons & Chains"],
    sizes: ["One Size (Shoulder Bag)"],
    images: [
      "/assets/collection/bags/bags_03.webp",
      "/assets/collection/bags/bags_01.webp",
      "/assets/collection/bags/bags_02.webp",
      "/assets/collection/bags/bags_04.webp",
      "/assets/collection/bags/bags_05.webp"
    ],
    image: "/assets/collection/bags/bags_03.webp",
    description: "Bag with acid paint denim jeans upcycled — one-of-a-kind slouchy shoulder bag deconstructed from brown denim jeans with psychedelic neon painting, charms, and satin ties.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Deconstructed vintage jeans with hand-painted artwork",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: false,
    customMade: false
  },
  {
    id: "avz-in-0008",
    sku: "IN0008",
    name: "Spike tube top",
    title: "Spike tube top",
    price: 2000,
    compare_at_price: null,
    stock: 3,
    category: "Tops",
    tag: "PUNK COUTURE",
    materials: ["Black Rexine Bodice", "Metallic Spikes Cross Motif", "Elastic Stretch Support"],
    sizes: ["XS-S (Bust 30-33in)", "M-L (Bust 34-37in)"],
    images: [
      "/assets/collection/tops/tops_16.webp",
      "/assets/collection/tops/tops_22.webp",
      "/assets/collection/tops/tops_41.webp"
    ],
    image: "/assets/collection/tops/tops_16.webp",
    description: "Tube top rexine black with spikes forming cross — sleek black leatherette tube top with heavy metallic cone spikes arranged in an extended crucifix motif down the torso.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Hand-riveted spikes with structured boning",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: true,
    customMade: false
  },
  {
    id: "avz-in-0009",
    sku: "IN0009",
    name: "Purple jibaro cross top",
    title: "Purple jibaro cross top",
    price: 1500,
    compare_at_price: null,
    stock: 1,
    category: "Tops",
    tag: "1 OF 1 ARCHIVE",
    materials: ["Lustrous Purple Silk/Satin", "Gold Threadwork & Filigree", "Blood-Red Gems & Safety Pins"],
    sizes: ["Size: Small"],
    images: [
      "/assets/collection/tops/tops_20.webp",
      "/assets/collection/tops/tops_07.webp",
      "/assets/collection/tops/tops_19.webp",
      "/assets/collection/tops/tops_26.webp",
      "/assets/collection/tops/tops_27.webp",
      "/assets/collection/tops/tops_34.webp",
      "/assets/collection/bralettes/bralettes_20.webp"
    ],
    image: "/assets/collection/tops/tops_20.webp",
    description: "Cross top halter purple with gold and red embellishment — halter neck cross-silhouette top in rich purple fabric lavishly embellished with metallic filigree, hanging charms, and safety-pin hardware.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Intricate hand-embellished vintage charms",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: true,
    customMade: false
  },
  {
    id: "avz-in-0010",
    sku: "IN0010",
    name: "Chainmail bra",
    title: "Chainmail bra",
    price: 1800,
    compare_at_price: null,
    stock: 50,
    category: "Bralettes",
    tag: "METAL ARMOR",
    materials: ["Hand-Linked Stainless Steel Rings", "Reinforced Neck & Back Chains", "Lobster Clasps"],
    sizes: ["S (Bust 32-34in)", "M (Bust 34-36in)", "L (Bust 36-38in)"],
    images: [
      "/assets/collection/body_chainmail/body_chainmail_14.webp"
    ],
    image: "/assets/collection/body_chainmail/body_chainmail_14.webp",
    description: "Bra made out of chain links — fluid metallic armor constructed entirely from hand-interlinked stainless steel rings. Ergonomic contouring and adjustable chain ties.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Corrosion-resistant surgical steel jump rings",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: true,
    customMade: false
  },
  {
    id: "avz-in-0011",
    sku: "IN0011",
    name: "Purple pink beaded bralette",
    title: "Purple pink beaded bralette",
    price: 1500,
    compare_at_price: null,
    stock: 1,
    category: "Bralettes",
    tag: "1 OF 1 ARCHIVE",
    materials: ["Hand-Strung Glass & Acrylic Beads", "Multi-Strand Bib Cascade", "Adjustable Hardware"],
    sizes: ["One Size (Adjustable Body Chain)"],
    images: [
      "/assets/collection/bralettes/bralettes_08.webp",
      "/assets/collection/bralettes/bralettes_01.webp",
      "/assets/collection/bralettes/bralettes_06.webp",
      "/assets/collection/bralettes/bralettes_07.webp",
      "/assets/collection/bralettes/bralettes_09.webp",
      "/assets/collection/bralettes/bralettes_10.webp"
    ],
    image: "/assets/collection/bralettes/bralettes_08.webp",
    description: "Bralette/ bodychain made with pink and purple beads — multi-layered wearable jewelry draped across the bust with thousands of hand-strung beads in violet and magenta.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Over 1,200 micro-beads individually hand-threaded",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: false,
    customMade: false
  },
  {
    id: "avz-in-0012",
    sku: "IN0012",
    name: "Apex Cuffs",
    title: "Apex Cuffs",
    price: 499,
    compare_at_price: null,
    stock: 10,
    category: "Arm cuffs",
    tag: "UNDER ₹1K",
    materials: ["Metallic Spike Hardware", "Riveted Leatherette Wristband", "Snap Fasteners"],
    sizes: ["One Size (Adjustable)"],
    images: [
      "/assets/collection/armcuffs/armcuffs_02.webp",
      "/assets/collection/armcuffs/armcuffs_05.webp",
      "/assets/collection/armcuffs/armcuffs_01.webp"
    ],
    image: "/assets/collection/armcuffs/armcuffs_02.webp",
    description: "Hand cuffs w spikes — minimal yet fierce black wristbands studded with double rows of chrome spikes. Heavy punk styling.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Adjustable multi-snap wrist clasp",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: false,
    customMade: false
  },
  {
    id: "avz-in-0013",
    sku: "IN0013",
    name: "Denim upcycled headgear",
    title: "Denim upcycled headgear",
    price: 1700,
    compare_at_price: null,
    stock: 1,
    category: "Headgear",
    tag: "1 OF 1 ARCHIVE",
    materials: ["Deconstructed Reclaimed Denim", "Handcrafted Plastic Bottle Flowers", "Vintage Ribbons & Lace"],
    sizes: ["One Size (Headpiece with Mask & Ties)"],
    images: [
      "/assets/collection/headgears/headgears_03.webp",
      "/assets/collection/headgears/headgears_01.webp",
      "/assets/collection/headgears/headgears_02.webp",
      "/assets/collection/headgears/headgears_04.webp",
      "/assets/collection/headgears/headgears_05.webp",
      "/assets/collection/headgears/headgears_06.webp",
      "/assets/collection/headgears/headgears_07.webp"
    ],
    image: "/assets/collection/headgears/headgears_03.webp",
    description: "Denim headgear with green plastic bottle flowers and ribbons and laces vaganza — avant-garde sculptural headpiece and mask sculpted from frayed denim seams, heat-formed plastic bottle flowers, and draping ribbons.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Upcycled zero-waste wearable sculpture",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: false,
    customMade: false
  },
  {
    id: "avz-in-0014",
    sku: "IN0014",
    name: "Jhumka jacket",
    title: "Jhumka jacket",
    price: 2600,
    compare_at_price: null,
    stock: 1,
    category: "Jackets",
    tag: "1 OF 1 ARCHIVE",
    materials: ["Lush Brown Faux Fur", "Traditional Brass Jhumka Bells", "Draped Hardware Chains"],
    sizes: ["One Size (Oversized Boxy Silhouette)"],
    images: [
      "/assets/collection/jackets/jackets_04.webp",
      "/assets/collection/jackets/jackets_01.webp",
      "/assets/collection/jackets/jackets_02.webp",
      "/assets/collection/jackets/jackets_03.webp",
      "/assets/collection/jackets/jackets_05.webp",
      "/assets/collection/jackets/jackets_06.webp",
      "/assets/collection/jackets/jackets_10.webp"
    ],
    image: "/assets/collection/jackets/jackets_04.webp",
    description: "Jacket fur brown jhumkhas — rich chocolate brown faux fur cropped jacket adorned with dozens of traditional Indian brass jhumkas and connecting chain swags.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Authentic brass jhumka hardware hand-stitched",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: true,
    customMade: false
  },
  {
    id: "avz-in-0015",
    sku: "IN0015",
    name: "Black Cat Co ord Set",
    title: "Black Cat Co ord Set",
    price: 2200,
    compare_at_price: null,
    stock: 1,
    category: "Co-ord sets",
    tag: "1 OF 1 ARCHIVE",
    materials: ["Textured Silver Boned Corset", "Black Faux Fur Trim Mini Skirt", "Heavy Eyelet Hardware"],
    sizes: ["Size: Small"],
    images: [
      "/assets/collection/co_ords/co_ords_16.webp",
      "/assets/collection/co_ords/co_ords_02.webp",
      "/assets/collection/co_ords/co_ords_03.webp",
      "/assets/collection/co_ords/co_ords_05.webp",
      "/assets/collection/co_ords/co_ords_11.webp",
      "/assets/collection/co_ords/co_ords_22.webp",
      "/assets/collection/co_ords/co_ords_31.webp",
      "/assets/collection/co_ords/co_ords_37.webp"
    ],
    image: "/assets/collection/co_ords/co_ords_16.webp",
    description: "Silver corset and black fur skirt — sculptural two-piece ensemble featuring an engraved silver-finish corset top paired with a micro mini skirt trimmed in dense black faux fur.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Hand-structured corset boning with metal grommets",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: true,
    customMade: false
  },
  {
    id: "avz-in-0016",
    sku: "IN0016",
    name: "Cheetah print cavewoman set",
    title: "Cheetah print cavewoman set",
    price: 1999,
    compare_at_price: null,
    stock: 1,
    category: "Co-ord sets",
    tag: "1 OF 1 ARCHIVE",
    materials: ["Cheetah & Leopard Pattern Velour", "Brown Fur Accents", "Raw Asymmetric Hemline"],
    sizes: ["Size: 34 Medium"],
    images: [
      "/assets/collection/co_ords/co_ords_20.webp",
      "/assets/collection/co_ords/co_ords_10.webp",
      "/assets/collection/co_ords/co_ords_14.webp",
      "/assets/collection/co_ords/co_ords_24.webp",
      "/assets/collection/co_ords/co_ords_35.webp",
      "/assets/collection/co_ords/co_ords_36.webp",
      "/assets/collection/co_ords/co_ords_38.webp"
    ],
    image: "/assets/collection/co_ords/co_ords_20.webp",
    description: "Cavewoman bra and leopard skirt — ferocious wild-animal print co-ord pairing an asymmetric ruched bralette with an uneven raw-hem leopard skirt.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Subcultural Y2K grunge styling",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: false,
    customMade: false
  },
  {
    id: "avz-in-0017",
    sku: "IN0017",
    name: "Silver Jesus cross charm top",
    title: "Silver Jesus cross charm top",
    price: 999,
    compare_at_price: null,
    stock: 0,
    category: "Tops",
    tag: "SOLD OUT",
    materials: ["Silver Metallic Cross Halter", "Black Butterfly Choker", "Draped Silver Tone Chains"],
    sizes: ["Size: small"],
    images: [
      "/assets/collection/tops/tops_38.webp",
      "/assets/collection/tops/tops_21.webp",
      "/assets/collection/tops/tops_37.webp",
      "/assets/collection/tops/tops_46.webp"
    ],
    image: "/assets/collection/tops/tops_38.webp",
    description: "Cross shape halter top with black butterfly choker and silver elements — architectural cross-formed metallic top connected with chains and accompanied by a signature butterfly choker.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Archived piece — request a custom commission",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: false,
    customMade: false
  },
  {
    id: "avz-in-0018",
    sku: "IN0018",
    name: "Flowery",
    title: "Flowery",
    price: 1799,
    compare_at_price: null,
    stock: 6,
    category: "Tops",
    tag: "CROCHET ART",
    materials: ["Hand-Crocheted Cotton Yarn", "Multi-Colored 3D Floral Appliques", "Lace-Up Back"],
    sizes: ["XS-S (Bust 30-33in)", "M-L (Bust 34-37in)"],
    images: [
      "/assets/collection/tops/tops_23.webp",
      "/assets/collection/tops/tops_06.webp",
      "/assets/collection/tops/tops_33.webp"
    ],
    image: "/assets/collection/tops/tops_23.webp",
    description: "Crocheted top with flowers multi colored — hand-knit kaleidoscopic crop top blooming with vibrant three-dimensional crochet flowers over a supportive frame.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Individually hand-crocheted 3D flowers",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: false,
    customMade: false
  },
  {
    id: "avz-in-0019",
    sku: "IN0019",
    name: "Pearlite crochet top",
    title: "Pearlite crochet top",
    price: 1500,
    compare_at_price: null,
    stock: 12,
    category: "Tops",
    tag: "HAND-BEADED",
    materials: ["Freshwater-Style White Pearls", "Crocheted Metallic Thread Base", "Satin Ties"],
    sizes: ["XS-S (Bust 30-33in)", "M-L (Bust 34-37in)"],
    images: [
      "/assets/collection/bralettes/bralettes_13.webp",
      "/assets/collection/bralettes/bralettes_11.webp",
      "/assets/collection/bralettes/bralettes_12.webp",
      "/assets/collection/bralettes/bralettes_14.webp",
      "/assets/collection/bralettes/bralettes_15.webp",
      "/assets/collection/bralettes/bralettes_16.webp",
      "/assets/collection/bralettes/bralettes_17.webp"
    ],
    image: "/assets/collection/bralettes/bralettes_13.webp",
    description: "White pearls crocheted on bikini top — ethereal halter bikini top hand-woven with hundreds of luminous white pearls crocheted into an organic mesh.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Hand-crocheted pearl architecture",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: true,
    customMade: false
  },
  {
    id: "avz-in-0020",
    sku: "IN0020",
    name: "Barbie set",
    title: "Barbie set",
    price: 3500,
    compare_at_price: null,
    stock: 12,
    category: "Co-ord sets",
    tag: "CAMP MAXIMALISM",
    materials: ["Sculpted Pink Starfish Bra", "Distressed Denim Mini with Pink Fur Trim", "Plush Headgear"],
    sizes: ["XS-S (Bust 30-33in)", "M-L (Bust 34-37in)"],
    images: [
      "/assets/collection/co_ords/co_ords_26.webp",
      "/assets/collection/co_ords/co_ords_27.webp",
      "/assets/collection/co_ords/co_ords_28.webp"
    ],
    image: "/assets/collection/co_ords/co_ords_26.webp",
    description: "Pink starfish bra + Barbie short skirt + green & pink fluffy headgear — the quintessential maximalist trio: sculpted hot pink starfish bralette, frayed denim mini edged with neon pink faux fur, and fluffy headpiece.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Three-piece complete editorial ensemble",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: true,
    customMade: false
  },
  {
    id: "avz-in-0021",
    sku: "IN0021",
    name: "Spiral body chainmail top",
    title: "Spiral body chainmail top",
    price: 2500,
    compare_at_price: null,
    stock: 1,
    category: "Body chainmail",
    tag: "1 OF 1 ARCHIVE",
    materials: ["Architectural Spiral Coiled Wire", "Hand-Linked Stainless Steel Chains", "Draped Halter Harness"],
    sizes: ["One Size (Adjustable Torso Drape)"],
    images: [
      "/assets/collection/body_chainmail/body_chainmail_22.webp",
      "/assets/collection/body_chainmail/body_chainmail_15.webp",
      "/assets/collection/body_chainmail/body_chainmail_16.webp",
      "/assets/collection/body_chainmail/body_chainmail_17.webp",
      "/assets/collection/body_chainmail/body_chainmail_19.webp",
      "/assets/collection/body_chainmail/body_chainmail_21.webp"
    ],
    image: "/assets/collection/body_chainmail/body_chainmail_22.webp",
    description: "Spiral wired  chained top in silver — concentric wire spirals coiled and woven with steel chains to create a sculptural breastplate that cascades down the torso.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Hand-coiled silver-tone steel wire",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: true,
    customMade: false
  },
  {
    id: "avz-in-0022",
    sku: "IN0022",
    name: "Cross tape bralette",
    title: "Cross tape bralette",
    price: 1200,
    compare_at_price: null,
    stock: 18,
    category: "Bralettes",
    tag: "CYBER-GRUNGE",
    materials: ["Structural Black Vinyl Tape Illusion", "Industrial Chain Straps", "Snap Fasteners"],
    sizes: ["XS-S (Bust 30-33in)", "S-M (Bust 32-35in)", "M-L (Bust 34-37in)"],
    images: [
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
    image: "/assets/collection/bralettes/bralettes_23.webp",
    description: "Bralette in the illusion of taped bust — deconstructed black vinyl crosses creating the visual illusion of electrical tape with chain linkages and comfortable inner lining.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Durable industrial hardware connectors",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: false,
    customMade: false
  },
  {
    id: "avz-in-0023",
    sku: "IN0023",
    name: "Spike grey blouse/bra",
    title: "Spike grey blouse/bra",
    price: 2000,
    compare_at_price: null,
    stock: 1,
    category: "Tops",
    tag: "1 OF 1 ARCHIVE",
    materials: ["Heavy Hand-Set Metallic Spikes", "Tailored Saree Blouse Base", "Silver Hardware Accents"],
    sizes: ["Size: Small-Medium"],
    images: [
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
    image: "/assets/collection/tops/tops_08.webp",
    description: "Blouse with spikes — traditional Indian grey saree blouse transformed into high-impact wearable armor with hundreds of pointed cone spikes covering the bodice.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Custom tailored base with metallic spike field",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: false,
    customMade: false
  },
  {
    id: "avz-in-0024",
    sku: "IN0024",
    name: "Silver shoe corset and skirt set",
    title: "Silver shoe corset and skirt set",
    price: 3500,
    compare_at_price: null,
    stock: 1,
    category: "Co-ord sets",
    tag: "1 OF 1 ARCHIVE",
    materials: ["Deconstructed Silver Athletic Sneaker", "Brown Faux Fur Trim", "Matching Metallic Mini Skirt"],
    sizes: ["One Size (Custom Studio Fit)"],
    images: [
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
    image: "/assets/collection/corsets/corsets_03.webp",
    description: "Corset in silver color made out of shoe and brown fur and similar skirt for a set — avant-garde runway set where athletic sneakers were unstitched and re-formed into a boned corset trimmed with brown fur, paired with metallic mini skirt.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Deconstructed sneaker upper wearable architecture",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: true,
    customMade: false
  },
  {
    id: "avz-in-0025",
    sku: "IN0025",
    name: "Spike red top",
    title: "Spike red top",
    price: 2200,
    compare_at_price: null,
    stock: 2,
    category: "Tops",
    tag: "HOT PIECE",
    materials: ["Sculpted Red Heart Bustier", "Hand-Mounted Metallic Spikes", "Backless Strappy Tie Closure"],
    sizes: ["XS-S (Bust 30-33in)", "M-L (Bust 34-37in)"],
    images: [
      "/assets/collection/tops/tops_10.webp",
      "/assets/collection/tops/tops_01.webp",
      "/assets/collection/tops/tops_15.webp",
      "/assets/collection/tops/tops_28.webp",
      "/assets/collection/tops/tops_47.webp"
    ],
    image: "/assets/collection/tops/tops_10.webp",
    description: "Red heart top with spikes backless — sculpted crimson heart-shaped halter crop top studded with gleaming spikes with an open criss-cross strappy back.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Heart silhouette with conical spike studs",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: true,
    customMade: false
  },
  {
    id: "avz-in-0026",
    sku: "IN0026",
    name: "Check mini red skirt",
    title: "Check mini red skirt",
    price: 1600,
    compare_at_price: null,
    stock: 1,
    category: "Skirts",
    tag: "1 OF 1 ARCHIVE",
    materials: ["Red Gingham Check Cotton", "Overlaid Black Fishnet", "Rose & Ribbon Waist Hardware"],
    sizes: ["Size: Small (Waist 24-27in)"],
    images: [
      "/assets/collection/skirts/skirts_03.webp",
      "/assets/collection/skirts/skirts_01.webp",
      "/assets/collection/skirts/skirts_02.webp"
    ],
    image: "/assets/collection/skirts/skirts_03.webp",
    description: "Red skirt w checks and fishnet mini size — pleated red and white gingham mini skirt overlaid with deconstructed black fishnet mesh, red rose rosette, and ribbon tails.",
    details: [
      "100% Handcrafted by Dhrisni in Guwahati",
      "Gingham check with fishnet overlay and flower pin",
      "AVZ Vaganza Certificate of Authenticity included"
    ],
    featured: false,
    customMade: false
  }
];

fs.writeFileSync('scratch/consolidated_products_clean.json', JSON.stringify(CONSOLIDATED_PRODUCTS, null, 2));
console.log('Saved 26 consolidated products to scratch/consolidated_products_clean.json');
