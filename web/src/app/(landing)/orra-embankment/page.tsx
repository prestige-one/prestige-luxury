import OffPlanProject, { type OffPlanConfig } from "@/components/landing/OffPlanProject";
import { getPage, seoMetadata } from "@/lib/content";
import { requirePublishedPage } from "@/lib/page-publication-guard";

export const metadata = seoMetadata(getPage("/orra-embankment/")!);

const up = (f: string) => `/wp-content/uploads/2023/05/${f}`;
const slide = (f: string) => ({ src: up(f), width: 1500, height: 885, alt: "The Embankment by ORRA" });

const config: OffPlanConfig = {
  form: "Orra Embankment",
  redirectTo: "/thank-you-embankment-2/",
  title: "Embankment",
  developer: "By ORRA",
  heroImage: up("Embankment-banner-1-scaled.jpg"),
  stats: [
    { label: "Price", value: "1.34M", unit: "AED" },
    { label: "Completion", value: "2024", unit: "Q2" },
    { label: "Size", value: "835", unit: "Sq.Ft" },
  ],
  intro: {
    title: "Embankment",
    subtitle: "By ORRA",
    text: "The Embankment, located in Uptown Dubai, offers unparalleled creativity, luxury, and extravagance. With world-class design and meticulous attention to detail, each residence is a masterpiece of opulence. Enjoy a vibrant 24-hour community, upscale boutiques, entertainment, and easy access to shopping malls, transport links, and elite institutions. The exquisite design blends with stunning interiors and exteriors, offering breathtaking views of Uptown Dubai, Jumeirah Island, and Ain Dubai. The one- & two-bedroom apartments feature lavish finishes, spacious bedrooms, ensuite baths, sundeck balconies, and panoramic views.",
  },
  amenitiesTop: [
    { icon: up("09_Fitness-Centre.png"), label: "Fully Equipped Gym" },
    { icon: up("03_Security-System.png"), label: "Security System" },
    { icon: up("02_High-Speed-Elevators.png"), label: "High-Speed Elevators" },
    { icon: up("44_Observation-Deck.png"), label: "Breathtaking Views" },
  ],
  galleryTop: [
    slide("embankment-buildinggallery.jpg"),
    slide("embankment-building-gallery.jpg"),
    slide("embankment-building-top-view-gallery.jpg"),
    slide("Embankment-bedroomgallery.jpg"),
    slide("Embankment-living-gallery.jpg"),
  ],
  amenities: [
    { icon: up("01_Spacious-Lobby-with-Concierge-Service.png"), label: "Spacious Lobby With Concierge Service" },
    { icon: up("09_Yoga-Studio.png"), label: "Yoga Studio" },
    { icon: up("11_Infinity-Pool.png"), label: "Infinity Deck Pool & Jacuzzi" },
    { icon: up("17_Childrens-Play-Area.png"), label: "Children’s Play Area" },
    { icon: up("04_Spa-and-Salon.png"), label: "Spa & Salon" },
    { icon: up("47_Jogging-Track.png"), label: "250-Meter Synthetic Jogging Track" },
    { icon: up("13_Multi-Sport-Court.png"), label: "Professional Multipurpose Court" },
    { icon: up("10_Rooftop-Cigar-Lounge.png"), label: "Rooftop Cigar Lounge" },
  ],
  galleryBottom: [
    slide("embankment-pool-gallery.jpg"),
    slide("Evening-pool-Residencesports-courts-gallery.jpg"),
    slide("embankment-buildingoutside-view.jpg"),
  ],
  location: {
    title: "Jumeriah",
    subtitle: "Lake Towers",
    text: "Jumeirah Lake Towers (JLT), with over 80 towers, houses over 100,000 residents since 2006. Located along Sheikh Zayed Road, JLT provides easy access to popular Dubai locations like Dubai Marina, The Palm, and Bluewaters Island. This neighbourhood offers a blend of Dubai’s extravagance and tranquillity, featuring 500+ retail outlets, 300 fitness and beauty spots, and numerous restaurants and cafes.",
  },
  contactTitle: "Choose a Property that Suits Your Lifestyle at The Embankment",
};

export default function OrraEmbankmentPage() {
  requirePublishedPage("/orra-embankment/");
  return <OffPlanProject c={config} />;
}
