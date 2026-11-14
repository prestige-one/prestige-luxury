// Site-wide settings copied from the original prestigeluxury.ae

export const site = {
  name: "Prestige Luxury Real Estate",
  tagline: "Personal and Exclusive",
  description: "Buy, Rent, Sell and Property Management",
  url: "https://prestigeluxury.ae",
  phone: "+971 52 370 2269",
  phoneHref: "tel:+971523702269",
  officePhone: "+971 4 446 8300",
  officePhoneHref: "tel:+97144468300",
  // Same number on WhatsApp — digits only, as wa.me requires.
  whatsapp: "971523702269",
  whatsappHref: "https://wa.me/971523702269",
  email: "info@prestigeluxury.ae",
  address: "Office No. 1603, 16th Floor, Marina Plaza, Dubai Marina – UAE",
  about:
    "As an established real estate agency in Dubai, we bring together ambitious professionals, market expertise and a shared commitment to delivering exceptional client experiences.",
  logoWhite: "/wp-content/uploads/2022/11/logo-prestige-luxury-white-2x.png",
  // 438x82, re-coloured from the white mark by crawl/make-black-logo.mjs. The only black file
  // in the media library is 234x44, which looked soft at the header's new size.
  logoBlack: "/wp-content/uploads/2022/11/logo-prestige-luxury-black-2x.png",
  heroVideoId: "viL_Gac5rt0",
  ctaImage: "/images/dubai-waterfront-cta.webp",
  /**
   * Checked live on 13 Nov 2026, because the old contact page and the old footer disagreed.
   * The contact page's Facebook (prestigerealestatemarina) and Instagram
   * (prestigerealestatedubai) are both dead — Facebook says the content isn't available and
   * Instagram says the profile isn't available — so the footer's handles are the real ones.
   * The two YouTube URLs resolve to the same channel; the @handle is used as it reads better.
   */
  socials: [
    { name: "Facebook", href: "https://www.facebook.com/prestigeluxuryrealestatedubai/" }, // 39K followers
    { name: "Instagram", href: "https://www.instagram.com/prestigeluxuryrealestate/" }, // 9.7K followers
    { name: "LinkedIn", href: "https://www.linkedin.com/company/prestige-real-estate-mena" },
    { name: "YouTube", href: "https://www.youtube.com/@PrestigeLuxuryRealEstate" },
    { name: "X", href: "https://x.com/DubaiPrestigeRE" }, // 7,910 posts, active since 2010
  ],
} as const;

export const contactPhones = [
  { number: site.phone, href: site.phoneHref },
  { number: site.officePhone, href: site.officePhoneHref },
] as const;

/** Unpublished pages retain their source so they can be restored by removing their path here. */
export const unpublishedPagePaths = [
  "/prestige-embankment/",
  "/the-residence-by-prestige-one/",
  "/vista-by-prestige-one/",
  "/services/property-management/",
  "/orra-embankment/",
] as const;
const unpublished = new Set<string>([...unpublishedPagePaths, "/property-management/"]);

/** Same-site URLs only: a matching path on another website remains an external link. */
export function isPagePublished(href: string): boolean {
  const local = href.replace(/^(?:https?:)?\/\/(?:www\.)?prestigeluxury\.ae(?=\/|$)/i, "");
  if (!local.startsWith("/") || local.startsWith("//")) return true;
  const path = `${local.split(/[?#]/, 1)[0].replace(/\/+$/, "")}/`;
  return !unpublished.has(path);
}

// ---- Navigation -----------------------------------------------------------------------------
// Pure data only: this file is imported by the client Header, so it must never pull in
// lib/properties, lib/listing-views or any large JSON content.

/** Keys understood by `NavIcon` in components/icons.tsx. */
export type IconName = "apartment" | "villa" | "townhouse" | "studio" | "commercial" | "office" | "grid";

export type NavLink = { label: string; href: string; icon?: IconName };
export type NavGroup = { title?: string; links: NavLink[] };
export type NavPromo = { title: string; subtitle?: string; href: string; image: string; cta: string };
export type NavMega = { heading: string; groups: NavGroup[]; promo?: NavPromo };
export type NavItem = { label: string; href: string; children?: NavLink[]; mega?: NavMega };

/** Flattens a mega panel's groups into the plain `children` list other consumers expect. */
const childrenOf = (mega: NavMega): NavLink[] => mega.groups.flatMap((g) => g.links);

/** Gives every mega item a derived `children` list, so `isActive` and any other consumer still work. */
const withChildren = (items: NavItem[]): NavItem[] => items.filter((item) => isPagePublished(item.href)).map((item) => {
  const mega = item.mega ? {
    ...item.mega,
    groups: item.mega.groups.map((group) => ({ ...group, links: group.links.filter((link) => isPagePublished(link.href)) })).filter((group) => group.links.length),
    promo: item.mega.promo && isPagePublished(item.mega.promo.href) ? item.mega.promo : undefined,
  } : undefined;
  return { ...item, mega, children: item.children?.filter((link) => isPagePublished(link.href)) || (mega ? childrenOf(mega) : undefined) };
});

const buyMega: NavMega = {
  heading: "Properties for Sale in Dubai",
  groups: [
    {
      title: "Properties by type",
      links: [
        { label: "Apartments", href: "/property-type/apartments/", icon: "apartment" },
        { label: "Villas", href: "/property-type/villa/", icon: "villa" },
        { label: "Townhouses", href: "/property-type/townhouse/", icon: "townhouse" },
        { label: "Studios", href: "/property-type/studio/", icon: "studio" },
        { label: "Commercial", href: "/property-type/other-commercial/", icon: "commercial" },
        { label: "See All Properties", href: "/status/for-sale/", icon: "grid" },
        { label: "Exclusive Collection", href: "/exclusive-collection/", icon: "grid" },
      ],
    },
    {
      title: "Buyer resources",
      links: [
        { label: "Buyer's Guide", href: "/buyers-guide/" },
        { label: "Market Appraisal", href: "/services/market-appraisal/" },
        { label: "Browse Developers", href: "/developers/" },
        { label: "FAQs", href: "/frequently-asked-questions/" },
      ],
    },
  ],
  // Was "Signature Living", but that page is unedited Elementor template content ("Surf's up!",
  // "Writing, made simple."), so the menu no longer drives buyers to it. The photograph is of
  // Address Downtown, so the panel now promotes the community it actually shows.
  promo: {
    title: "Downtown Dubai",
    subtitle: "Homes beside Burj Khalifa",
    href: "/area/downtown-dubai/",
    cta: "Explore Downtown",
    image:
      "/wp-content/uploads/2024/04/Address-Downtown-Downtown-Dubai-Downtown-Dubai-ADM240062-Prestige-Luxury-Real-Estate-30-1170x785.jpg",
  },
};

const rentMega: NavMega = {
  heading: "Properties for Rent in Dubai",
  groups: [
    {
      title: "Properties by type",
      links: [
        { label: "Apartments", href: "/property-type/apartments/", icon: "apartment" },
        { label: "Villas", href: "/property-type/villa/", icon: "villa" },
        { label: "Townhouses", href: "/property-type/townhouse/", icon: "townhouse" },
        { label: "Studios", href: "/property-type/studio/", icon: "studio" },
        { label: "Offices", href: "/property-type/office/", icon: "office" },
        { label: "See All Properties", href: "/status/for-rent/", icon: "grid" },
      ],
    },
    {
      title: "Tenant resources",
      links: [
        { label: "Tenant's Guide", href: "/tenants-guide/" },
        { label: "Property Management", href: "/services/property-management/" },
        { label: "FAQs", href: "/frequently-asked-questions/" },
        { label: "Speak to a Leasing Agent", href: "/contact-us/" },
      ],
    },
  ],
  promo: {
    title: "Hot Properties",
    subtitle: "in Dubai Marina",
    href: "/area/dubai-marina/",
    cta: "Explore Now",
    image:
      "/wp-content/uploads/2024/03/Princess-Tower-Dubai-Marina-Dubai-Marina-SAL240055-Prestige-Luxury-Real-Estate-1170x785.jpg",
  },
};

const offPlanMega: NavMega = {
  heading: "New Projects in Dubai",
  groups: [
    {
      title: "Featured projects",
      links: [
        { label: "Prestige Embankment", href: "/prestige-embankment/" },
        { label: "Orra Embankment", href: "/orra-embankment/" },
        { label: "Vista by Prestige One", href: "/vista-by-prestige-one/" },
        { label: "The Residence by Prestige One", href: "/the-residence-by-prestige-one/" },
        { label: "All New Projects", href: "/projects-for-sale/" },
      ],
    },
    {
      title: "Off-plan resources",
      links: [
        { label: "Off-Plan Listings", href: "/status/off-plan/" },
        { label: "Investment Guide", href: "/investment-guide/" },
        { label: "Browse Developers", href: "/developers/" },
      ],
    },
  ],
  promo: {
    title: "Prestige One Developments",
    href: "/developers/prestige-one-developments/",
    cta: "View Developer",
    image: "/wp-content/uploads/2023/05/embankment-buildingoutside-view.jpg",
  },
};

const developersMega: NavMega = {
  heading: "Real Estate Developers in Dubai",
  groups: [
    {
      title: "Featured developers",
      links: [
        { label: "Prestige One Developments", href: "/developers/prestige-one-developments/" },
        { label: "Emaar Properties", href: "/developers/emaar-properties/" },
        { label: "DAMAC Properties", href: "/developers/damac-properties/" },
        { label: "Nakheel", href: "/developers/nakheel/" },
        { label: "Sobha Realty", href: "/developers/sobha-realty/" },
        { label: "Binghatti Developers", href: "/developers/binghatti-developers/" },
        { label: "Meraas", href: "/developers/meraas/" },
        { label: "Omniyat", href: "/developers/omniyat/" },
      ],
    },
    { title: "Browse", links: [{ label: "All Developers", href: "/developers/" }] },
  ],
  promo: {
    title: "37 Registered Developers",
    subtitle: "One directory",
    href: "/developers/",
    cta: "View Directory",
    image: "/wp-content/uploads/2019/06/emaar-downtown-1536x864.jpg",
  },
};

// The ten communities with the most listings in content/properties.json (slugs from
// lib/properties.ts's `slugify`, all resolved by the /area/[area]/ route).
const areasMega: NavMega = {
  heading: "Dubai Communities",
  groups: [
    {
      title: "Popular communities",
      links: [
        { label: "Dubai Sports City", href: "/area/dubai-sports-city/" },
        { label: "Dubai Marina", href: "/area/dubai-marina/" },
        { label: "Jumeirah Village Circle", href: "/area/jumeirah-village-circle/" },
        { label: "Business Bay", href: "/area/business-bay/" },
        { label: "Downtown Dubai", href: "/area/downtown-dubai/" },
        { label: "DIFC", href: "/area/difc/" },
        { label: "Jumeirah Beach Residence", href: "/area/jumeirah-beach-residence/" },
        { label: "Dubai Maritime City", href: "/area/dubai-maritime-city/" },
        { label: "Dubai Islands", href: "/area/dubai-islands/" },
        { label: "Palm Jumeirah", href: "/area/palm-jumeirah/" },
      ],
    },
    {
      title: "Browse",
      links: [
        { label: "All Areas", href: "/areas/" },
        { label: "Dubai Neighbourhoods", href: "/dubai-neighbourhoods/" },
      ],
    },
  ],
  promo: {
    title: "Area Guides",
    href: "/areas/",
    cta: "Explore Areas",
    image: "/wp-content/uploads/2019/07/jbr-beach-2048x1271.jpg",
  },
};

const servicesMega: NavMega = {
  heading: "Our Services",
  groups: [
    {
      title: "What we do",
      links: [
        { label: "Sell Your Property", href: "/sell/" },
        { label: "Property Management", href: "/services/property-management/" },
        { label: "Market Appraisal", href: "/services/market-appraisal/" },
        { label: "List With Us", href: "/sell/" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Our Story", href: "/about/" },
        { label: "Meet the Team", href: "/meet-the-team/" },
        { label: "Careers", href: "/careers/" },
        { label: "Testimonials", href: "/testimonials/" },
        { label: "Sustainable Living", href: "/signature-living/" },
      ],
    },
  ],
  promo: {
    title: "List Your Property",
    subtitle: "Free market appraisal",
    href: "/sell/",
    cta: "Get a Valuation",
    image: "/wp-content/uploads/2021/04/aerial-view-of-dubai-palm-jumeirah-island-1170x785.jpg",
  },
};

export const mainNav: NavItem[] = withChildren([
  { label: "Buy", href: "/status/for-sale/", mega: buyMega },
  { label: "Rent", href: "/status/for-rent/", mega: rentMega },
  { label: "Off-Plan", href: "/status/off-plan/", mega: offPlanMega },
  { label: "Developers", href: "/developers/", mega: developersMega },
  { label: "Areas", href: "/areas/", mega: areasMega },
  { label: "Services", href: "/services/", mega: servicesMega },
  {
    label: "More",
    href: "/contact-us/",
    children: [
      { label: "Our Story", href: "/about/" },
      { label: "Meet the Team", href: "/meet-the-team/" },
      { label: "Careers", href: "/careers/" },
      { label: "Testimonials", href: "/testimonials/" },
      { label: "FAQs", href: "/frequently-asked-questions/" },
      { label: "Contact Us", href: "/contact-us/" },
    ],
  },
]);

/** The header's primary call to action, shown as a button beside the menu. */
export const navCta = { label: "Book a Property Valuation", href: "/property-valuation/" };

export const footerColumns: { title: string; links: { label: string; href: string }[] }[] = [
  // Footer links stay focused on each client journey; guide links use the new site routes.
  {
    title: "Buy",
    links: [
      { label: "Luxury Apartments", href: "/property-type/apartments/" },
      { label: "Luxury Villas", href: "/property-type/villa/" },
      { label: "Off-Plan Properties", href: "/status/off-plan/" },
      { label: "Buyer's Guide", href: "/buyers-guide/" },
    ],
  },
  {
    title: "Rent",
    links: [
      { label: "Properties for Rent", href: "/status/for-rent/" },
      { label: "Rental Valuation", href: "/property-valuation/" },
      { label: "Commercial Leasing", href: "/property-type/office/" },
      { label: "Tenant's Guide", href: "/tenants-guide/" },
    ],
  },
  {
    title: "Off-Plan",
    links: [
      { label: "New Developments", href: "/status/off-plan/" },
      { label: "Developers", href: "/developers/" },
      { label: "Investment Guide", href: "/investment-guide/" },
      { label: "Featured Projects", href: "/projects-for-sale/" },
    ],
  },
  {
    title: "Pages",
    links: [
      { label: "Frequently Asked Questions", href: "/frequently-asked-questions/" },
      { label: "Blog", href: "/blog/" },
      { label: "Privacy Policy", href: "/privacy-policy/" },
      { label: "Terms and Conditions", href: "/terms-and-conditions/" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Sell Your Property", href: "/sell/" },
      { label: "Property Valuation", href: "/services/market-appraisal/" },
      { label: "Property Management", href: "/services/property-management/" },
      { label: "Speak to an Advisor", href: "/contact-us/" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Story", href: "/about/" },
      { label: "Meet the Team", href: "/meet-the-team/" },
      { label: "Careers", href: "/careers/" },
      { label: "Contact Us", href: "/contact-us/" },
    ],
  },
].map((column) => ({ ...column, links: column.links.filter((link) => isPagePublished(link.href)) }));
