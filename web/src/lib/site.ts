// Site-wide settings copied from the original prestigeluxury.ae

export const site = {
  name: "Prestige Luxury Real Estate",
  tagline: "Personal and Exclusive",
  description: "Buy, Rent, Sell and Property Management",
  url: "https://prestigeluxury.ae",
  phone: "+971(0) 4 446 8302",
  phoneHref: "tel:+97144468302",
  email: "info@prestigeluxury.ae",
  address: "Office No. 1603, 16th Floor, Marina Plaza, Dubai Marina – UAE",
  about:
    "As an established real estate agency in Dubai, we bring together ambitious professionals, market expertise and a shared commitment to delivering exceptional client experiences.",
  logoWhite: "/wp-content/uploads/2022/11/logo-prestige-luxury-white-2x.png",
  logoBlack: "/wp-content/uploads/2020/06/logo-prestige-black-1x.png",
  heroVideoId: "viL_Gac5rt0",
  socials: [
    { name: "Facebook", href: "https://www.facebook.com/prestigeluxuryrealestatedubai/" },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/prestige-real-estate-mena" },
    { name: "Instagram", href: "https://www.instagram.com/prestigeluxuryrealestate/" },
    { name: "YouTube", href: "https://www.youtube.com/@PrestigeLuxuryRealEstate" },
  ],
} as const;

export type NavItem = { label: string; href: string; children?: NavItem[] };

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Properties",
    href: "/properties/",
    children: [
      { label: "Buy", href: "/status/for-sale/" },
      { label: "Rent", href: "/status/for-rent/" },
      { label: "Off-Plan", href: "/status/off-plan/" },
      { label: "New Projects", href: "/projects-for-sale/" },
      { label: "Commercial", href: "/property-type/other-commercial/" },
    ],
  },
  { label: "List With Us", href: "/sell/" },
  { label: "Our Story", href: "/about/" },
  { label: "Careers", href: "/careers/" },
  { label: "Contact Us", href: "/contact-us/" },
];

export const footerColumns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Buy",
    links: [
      { label: "Properties for Sale", href: "/status/for-sale/" },
      { label: "Luxury Apartments", href: "/property-type/apartment/" },
      { label: "Villas & Penthouses", href: "/property-type/villa/" },
      { label: "Buyer’s Guide", href: "/blog/" },
    ],
  },
  {
    title: "Rent",
    links: [
      { label: "Properties for Rent", href: "/status/for-rent/" },
      { label: "Residential Leasing", href: "/status/for-rent/" },
      { label: "Commercial Leasing", href: "/property-type/other-commercial/" },
      { label: "Tenant’s Guide", href: "/blog/" },
    ],
  },
  {
    title: "Off-Plan",
    links: [
      { label: "New Developments", href: "/status/off-plan/" },
      { label: "Developers", href: "/projects-for-sale/" },
      { label: "Investment Guide", href: "/blog/" },
      { label: "Featured Projects", href: "/projects-for-sale/" },
    ],
  },
  {
    title: "Pages",
    links: [
      { label: "Frequently Asked Questions", href: "/frequently-asked-questions/" },
      { label: "Testimonials", href: "/testimonials/" },
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
];
