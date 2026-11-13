import OffPlanProject, { type OffPlanConfig } from "@/components/landing/OffPlanProject";
import { getPage, seoMetadata } from "@/lib/content";

export const metadata = seoMetadata(getPage("/vista-by-prestige-one/")!);

const up = (f: string) => `/wp-content/uploads/2023/05/${f}`;
const slide = (f: string) => ({ src: up(f), width: 1500, height: 885, alt: "Vista by Prestige One" });

const config: OffPlanConfig = {
  form: "Vista by Prestige One",
  redirectTo: "/thank-you-vista/",
  title: "Vista",
  developer: "By Prestige One",
  heroImage: up("Vista-by-prestige-One-Top-Banner-scaled.jpg"),
  stats: [
    { label: "Studio", value: "510,000", unit: "AED" },
    { label: "1-Bed", value: "895,000", unit: "AED" },
    { label: "2-Bed", value: "1,460,000", unit: "AED" },
    { label: "2-Bed", value: "1,989,000", unit: "AED" },
  ],
  heroLogo: { src: up("vista_oneline_white-1024x123.png"), width: 1024, height: 123 },
  intro: {
    title: "Vista",
    subtitle: "By Prestige One",
    text: "Vista by Prestige One, located in Victory Heights, offers luxurious apartment homes with stunning The Els Club golf views. Top-tier amenities include a rooftop infinity pool, fitness center, spa, sports courts, outdoor cinema, electric vehicle stations, and children’s play zones. Developed by Prestige One Developments, Vista combines high-end living with proximity to Dubai’s key attractions.",
  },
  amenitiesTop: [
    { icon: up("09_Fitness-Centre.png"), label: "High Quality Gym" },
    { icon: up("27_Roof-Deck.png"), label: "Roof Deck" },
    { icon: up("35_Mini-Golf.png"), label: "Putting Green" },
    { icon: up("44_Observation-Deck.png"), label: "Observation Deck" },
  ],
  galleryTop: [
    slide("Living2-Vista-gallery.jpg"),
    slide("Vista-bedroom-gallery.jpg"),
    slide("Living-Room-Vista-gallery.jpg"),
    slide("Bedroom-Vista-Gallery.jpg"),
    slide("Bedroom-2-Vista-gallery.jpg"),
    slide("Kitchen-Vista-gallery.jpg"),
  ],
  amenities: [
    { icon: up("32_Hotel-Like-Entrance.png"), label: "Spacious Lobby" },
    { icon: up("40_Outdoor-Cinema.png"), label: "Outdoor Cinema" },
    { icon: up("17_Childrens-Play-Area.png"), label: "Indoor & Outdoor Kids' Play Area" },
    { icon: up("19_Yoga-Area.png"), label: "Yoga Area" },
    { icon: up("82_Lawn.png"), label: "Open Lawn" },
    { icon: up("47_Jogging-Track.png"), label: "Landscaped Jogging Track" },
    { icon: up("21_BBQ-Area.png"), label: "BBQ Sunken Seating and Deck Areas" },
    { icon: up("33_EV-Charging.png"), label: "Electric Vehicle Charging/Parking" },
  ],
  galleryBottom: [
    slide("Pool-Vista-gallery.jpg"),
    slide("Vista-amenities-gallery.jpg"),
    slide("Vista-amenities-5-gallery.jpg"),
    slide("Vista-amenities-4-gallery.jpg"),
    slide("Vista-amenities-3-gallery.jpg"),
    slide("Vista-amenities-2-gallery.jpg"),
    slide("Outdoor-Cinema-Vista-amenities-gallery.jpg"),
    slide("Padel-Court-Vista-amenities-gallery.jpg"),
  ],
  galleryBottomWide: true,
  location: {
    title: "Victory",
    subtitle: "Heights",
    text: "Victory Heights provides residents with luxurious living in a secure, gated community surrounded by greenery. The family-friendly development features a nursery, international school, parks, and playgrounds. Properties range from townhouses to villas in a serene setting, with sporting facilities such as basketball courts, a swimming pool, a tennis club, and a golf course nearby. Victory Heights offers exclusive services and amenities while granting easy access to Dubai Living.",
  },
  contactTitle: "Invest in a Lifestyle of Prestige and Luxury",
};

export default function VistaPage() {
  return <OffPlanProject c={config} />;
}
