import OffPlanProject, { type OffPlanConfig } from "@/components/landing/OffPlanProject";
import { getPage, seoMetadata } from "@/lib/content";
import { requirePublishedPage } from "@/lib/page-publication-guard";

export const metadata = seoMetadata(getPage("/the-residence-by-prestige-one/")!);

const up = (f: string) => `/wp-content/uploads/2023/05/${f}`;
const alt = "The Residence by Prestige One";
const slide = (f: string, width = 1500, height = 885) => ({ src: up(f), width, height, alt });

const config: OffPlanConfig = {
  form: "The Residence by Prestige One",
  redirectTo: "/thank-you-the-residence/",
  title: "The Residence",
  developer: "By Prestige One",
  heroImage: up("The-Residence-banner-5-scaled-1.jpg"),
  stats: [
    { label: "Studio", value: "562,000", unit: "AED" },
    { label: "1-Bed", value: "880,000", unit: "AED" },
    { label: "2-Bed", value: "1,339,000", unit: "AED" },
  ],
  heroLogo: { src: up("residence_oneline_white-1024x114.png"), width: 1024, height: 114 },
  intro: {
    title: "The Residence",
    subtitle: "By Prestige One",
    text: "An elegant mid-rise tower comprising of carefully crafted residential studios, one and two bedroom unit apartments. The contemporary residential development is complemented by thoughtfully-designed amenities that all inspire a balanced lifestyle that will elevate your mornings, evenings, and weekends. Located in a residential community settled within the center of Dubai, offering easy access to the community’s amenities and main throughways, The Residence brings a relaxing experience to it’s residents.",
  },
  amenitiesTop: [
    { icon: up("09_Fitness-Centre.png"), label: "High Quality Gym" },
    { icon: up("27_Roof-Deck.png"), label: "Roof Deck" },
    { icon: up("35_Mini-Golf.png"), label: "Putting Deck" },
    { icon: up("11_Infinity-Pool.png"), label: "Swimming Pool & Hot Tub" },
  ],
  galleryTop: [
    slide("The-residence-studio.jpg", 1200, 750),
    slide("The-residence-kitchen.jpg", 1200, 750),
    slide("The-residence-kitchen-living.jpg", 1200, 750),
    slide("The-residence-bedroom.jpg", 1200, 750),
    slide("The-residence-bathroom.jpg", 1200, 750),
    slide("The-residence-powder-room.jpg", 1200, 750),
  ],
  amenities: [
    { icon: up("GRAY_02_Smart-Home-white.png"), label: "Units will be wired for smart home automation" },
    { icon: up("White_03_USB-Outlets.png"), label: "All units will have USB outlets in all rooms" },
    { icon: up("33_EV-Charging.png"), label: "Electric Vehicle Charging / Parking" },
    { icon: up("White_04_Smart-Locks.png"), label: "Smart Locks" },
    { icon: up("17_Childrens-Play-Area.png"), label: "Outdoor Kids' Play Area" },
    { icon: up("77_Rolling-Hills.png"), label: "Rolling Terrain Lawn" },
    { icon: up("21_BBQ-Area.png"), label: "BBQ Sunken Seating and Deck Areas" },
    { icon: up("30_Lounge.png"), label: "Cabanas & Sunbeds" },
  ],
  galleryBottom: [
    slide("Evening-pool-Residence-bottom-gallery.jpg"),
    slide("Gym-Residence-bottom-gallery.jpg"),
    slide("Pool-Residence-bottom-gallery.jpg"),
    slide("Roof-deck-Residence-bottom-gallery.jpg"),
  ],
  galleryBottomWide: true,
  location: {
    title: "Jumeirah",
    subtitle: "Village Circle",
    text: "Situated in Dubai, Jumeirah Village Circle is a thriving, upscale community, Residents are provided with an array of dining and retail choices, promoting a cultured lifestyle within a secure, friendly setting. Not to mention, access to Central Dubai is a breeze via the adjacent Sheikh Mohammed Bin Zayed Road.",
  },
  contactTitle: "Invest in a Lifestyle of Prestige and Luxury",
};

export default function TheResidencePage() {
  requirePublishedPage("/the-residence-by-prestige-one/");
  return <OffPlanProject c={config} />;
}
