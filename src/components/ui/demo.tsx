import SocialCards, { CardItem } from "@/components/ui/card-fan-carousel";

const DEMO_CARDS: CardItem[] = [
  {
    imgUrl: "/assets/look_chainmail_armor.jpg",
    alt: "Stainless Steel Chainmail",
    title: "Guwahati Chainmail",
    category: "ARCHIVAL ART",
    price: "₹3,000+"
  },
  {
    imgUrl: "/assets/prod_motherboard_cuff.jpg",
    alt: "Motherboard Circuitry Gauntlet",
    title: "Circuitry Gauntlet",
    category: "CYBER ACCESSORY",
    price: "Under ₹1,000"
  },
  {
    imgUrl: "/assets/look_spike_bodice.jpg",
    alt: "Chrome Spike Bodice Top",
    title: "Spike Bodice Top",
    category: "1-OF-1 STATEMENT",
    price: "₹1,000 – ₹3,000"
  },
  {
    imgUrl: "/assets/product_reworked_jacket.jpg",
    alt: "Reconstructed Denim Jacket",
    title: "Denim Statement Jacket",
    category: "RECONSTRUCTED ART",
    price: "₹3,000+"
  },
  {
    imgUrl: "/assets/product_diva_top.jpg",
    alt: "Diva Top",
    title: "Diva Top",
    category: "HAUTE COUTURE",
    price: "₹2,400"
  },
  {
    imgUrl: "/assets/product_spike_bra.jpg",
    alt: "Spike Bra",
    title: "Industrial Spike Bra",
    category: "SCULPTURAL BRA",
    price: "₹1,800"
  },
  {
    imgUrl: "/assets/product_beaded_bralette.jpg",
    alt: "Beaded Bralette",
    title: "Beaded Bralette",
    category: "HAND-BEADED",
    price: "₹1,600"
  }
];

export default function DemoOne() {
  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col items-center justify-center py-12">
      <h1 className="text-3xl font-mono uppercase tracking-widest text-center mb-8">
        Museum Archive Fan Carousel
      </h1>
      <SocialCards cards={DEMO_CARDS} />
    </div>
  );
}
