# AVZ VAGANZA: THE OTHER DIMENSION 🪐✨

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r173-black?logo=threedotjs&logoColor=white)](https://threejs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

> *"A high fashion brand made by baddies for baddies"*  
> **Brand Atelier:** Guwahati, Assam, India | **Instagram:** [@avz.vaganza](https://www.instagram.com/avz.vaganza) | **Founder & Master Artisan:** Dhrisni (*Dhristroyer*)

---

## 📖 Overview

**AVZ VAGANZA** is an experimental, psychedelic, three-dimensional fashion universe and progressive digital storefront for 1-of-1 wearable art, bespoke couture, and upcycled visionary garments. 

Designed to disrupt traditional e-commerce conventions, the application merges WebGL 3D spatial experiences with high-performance responsive shopping, immersive storytelling, real-time client inquiry dispatching, and sensory micro-interactions.

---

## ⚡ Key Highlights & Experiences

### 🌌 1. 3D Spatial Experiences (Three.js & CSS 3D)
- **3D Emblem Portal Sequence:** Interactive Three.js particle constellation dynamically assembling the 4-directional AVZ emblem upon boot (with one-touch skip & ESC shortcut).
- **Interactive 3D Spotlight Hero:** Interactive pointer-tracked volumetric lighting across monumental kinetic typography (`"WEARABLE ART."` → `"NOT MADE TO REPEAT."`) with floating fashion planes.
- **Continuous 3D Image Hyper-Tunnel:** Endless procedural 3D corridor displaying editorial archival runways with speed throttle, pause/play toggle, and pointer tilt controls.
- **Asymmetric Parallax Lookbook:** Drifting editorial fashion strip with smooth dampening and full-bleed high-resolution lightbox inspector.
- **Expanded Accordion Cards:** Kinetic card sliders with fixed layout captions and smooth depth transitions.

### 🛍️ 2. Comprehensive E-Commerce Architecture
- **Curated Multi-Category Catalogue:** Filter by 16+ distinct categories, silhouette styles, and sustainable material compositions (Denim, Organza, Heavy Metal, Velvet).
- **1-of-1 Inventory & Product Detail Modal:** Custom sizing tables, product origin notes, and real-time stock limits (strict single-edition enforcement).
- **Interactive Slide-Out Shopping Bag:** Free shipping dynamic progress tracker, promo code validation engine, and simulated checkout flow.
- **Wishlist & Multi-Currency Switcher:** Instant price conversions across `INR (₹)`, `USD ($)`, `EUR (€)`, and `GBP (£)` with localized currency formats.
- **AVZ Museum Vault:** Curated retrospective archive showcasing milestone garments and runway editions with pre-filled bespoke commission requests.
- **Squad Buy & Order Tracking Modals:** Social shopping capabilities and order lookup interface.

### 🧵 3. Custom Bespoke Atelier Dispatch
- **Direct WhatsApp Atelier Dispatch:** Seamless form validation compiling bespoke custom inquiries directly dispatched to founder & master artisan Dhrisni (`+91 73042 64901`).
- **Interactive Size & Specification Builder:** Select silhouette, target budget, deadline, reference links, and upload garment inspirations.

### 🐱 4. Roaming Cyber-Cat Companion & Audio Engine
- **Mascot Companion:** Floating roaming anime kitten companion delivering contextual advice, brand secrets, and mood commentary (toggleable anytime in the navbar).
- **Web Audio API Feedback:** Custom synthesized futuristic soundscapes and interactive haptic clicks across micro-interactions.

---

## 🎨 Visual Identity & Design System

The visual design is grounded in brutalist haute-couture aesthetics, cyber-psychedelia, and dark mode elegance:

| Token | Hex Code | Visual Application |
|---|---|---|
| **Pitch Black** | `#000000` | Void background, backdrop framing |
| **Dark Purple** | `#301934` | Atmospheric nebula shadows, card surfaces |
| **Baby Pink** | `#F4C2C2` | Primary brand accent, glowing badges, primary CTA buttons |
| **Lavender** | `#E6E6FA` | Ambient cosmic particles, subtitles, secondary borders |
| **Metallic Silver** | `#C0C0C0` | Hardware typography, reflective badges, dividers |

---

## 🛠️ Tech Stack

- **Framework:** [React 18](https://reactjs.org/)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **3D Graphics & Canvas:** [Three.js](https://threejs.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS Modules
- **Icons:** [Lucide React](https://lucide.dev/)
- **Audio:** Web Audio API Native Synthesizer

---

## 📂 Project Structure

```
AVZ-1/
├── public/                     # Static assets and media files
│   ├── assets/                 # Client lookbook and product photographs
│   ├── client_assets/          # Brand photography and assets
│   └── logo.png                # Brand high-resolution emblem
├── src/
│   ├── components/             # React modular components
│   │   ├── AvzMuseum.jsx       # Curated retrospective archive
│   │   ├── CartDrawer.jsx      # Slide-out cart & checkout drawer
│   │   ├── CatCompanion.jsx    # Roaming cyber-cat companion
│   │   ├── CustomOrders.jsx    # Custom bespoke inquiry builder & WhatsApp dispatch
│   │   ├── ExpandedCards.jsx   # Interactive accordion cards
│   │   ├── Footer.jsx          # Studio credits, newsletter & links
│   │   ├── FoundersSection.jsx # Brand story, philosophy & artisan manifesto
│   │   ├── HeroThreeDimension.jsx # 3D spotlight hero with kinetic typography
│   │   ├── ImageTunnel.jsx     # Endless 3D runway tunnel
│   │   ├── InformationalPages.jsx # Atelier policies, shipping & terms
│   │   ├── LoadingExperience.jsx # Three.js 3D constellation boot sequence
│   │   ├── Navbar.jsx          # Header navigation, currency selector & cart counter
│   │   ├── OrderTrackingModal.jsx # Order status tracker
│   │   ├── ParallaxRow.jsx     # Parallax editorial showcase
│   │   ├── ProductDetailModal.jsx # Detailed single-item view with size guide
│   │   ├── SearchModal.jsx     # Live catalogue search modal
│   │   ├── ShopCatalogue.jsx   # Product grid with category & material filters
│   │   ├── SquadBuyModal.jsx   # Collaborative group purchasing modal
│   │   └── WishlistDrawer.jsx  # Saved items drawer
│   ├── data/                   # Product catalogues, brand data & questionnaire
│   ├── utils/                  # Currency conversions, audio engine & helper utilities
│   ├── App.jsx                 # Main application state orchestration
│   ├── index.css               # Global typography, color tokens & custom animations
│   └── main.jsx                # React application entry point
├── package.json                # Project dependencies and run scripts
├── vite.config.js              # Vite configuration
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ritesh2445/AVZ-demo.git
   cd AVZ-demo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```
   Preview the production build locally:
   ```bash
   npm run preview
   ```

---

## 🏛️ Atelier & Legal

- **Atelier Address:** H No. 1, Mayur Path, Rukminigaon, Guwahati, Assam 781006, India
- **Inquiries & Bespoke Commissions:** [WhatsApp Dhrisni](https://wa.me/917304264901)
- **Instagram:** [@avz.vaganza](https://www.instagram.com/avz.vaganza)

© 2026 AVZ VAGANZA. All Rights Reserved. Crafted for Baddies.
