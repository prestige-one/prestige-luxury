import type { Metadata } from "next";
import GuidePage, { type Guide } from "@/components/guides/GuidePage";
import { brandedTitle, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: brandedTitle("Investment Guide to Dubai Property"),
  description:
    "How property investment in Dubai works: ready versus off-plan, long-term and holiday-home lets, yields after costs, tax, and every cost of buying, holding and selling.",
  path: "/investment-guide/",
});

/*
 * Written as general information, not advice: it explains how investing works and what it costs,
 * and never tells a reader what to buy. Yields are given as the broad range current sources
 * agree on, with the gross-versus-net caveat, rather than as a promise.
 *
 * Figures were checked in November 2026 against current 2026 sources (mostly broker and agency
 * guides, so they need confirming against official schedules). Where they disagreed — the
 * holiday-home permit fee in particular, quoted anywhere from a few hundred to a few thousand
 * dirhams — the guide says "varies" and names the authority rather than picking a number. The
 * agency's own management prices are deliberately not quoted here; the property management page
 * is the single place they live.
 */
const guide: Guide = {
  path: "/investment-guide/",
  title: "Investment Guide",
  subtitle: "Investing in Dubai property — the strategies, the returns after costs, and what to check before you buy.",
  image: "/images/faq-dubai-skyline-4k.webp",
  imageQuality: 85,
  imageClassName: "opacity-80 object-[center_75%]",
  intro: [
    "Dubai attracts property investors from all over the world for a few simple reasons: foreign buyers can own freehold outright, there is no annual property tax, individuals pay no tax on rental income or on the gain when they sell, and rents have historically delivered gross yields that compare well with most major cities.",
    "This guide explains how investing here works in practice — choosing between ready and off-plan, letting long-term or as a holiday home, and what you actually keep once every cost is counted. It is general information to help you ask the right questions, not financial advice; your Prestige Luxury advisor can take you through the numbers on any specific property.",
  ],
  introChecklist: {
    title: "Create a focused property brief",
    items: [
      "Define your preferred communities, property types and intended use.",
      "Set out your purchase timeline and expected ownership period.",
      "List the property details and running costs you want to review.",
      "Discuss property management and ongoing support with your specialist.",
    ],
    cta: { label: "Explore available properties", href: "/properties/" },
  },
  glance: [
    { label: "Tax on rent (individuals)", value: "None" },
    { label: "Capital gains tax (individuals)", value: "None" },
    { label: "Annual property tax", value: "None" },
    { label: "Gross yields, typically", value: "≈ 5–9%" },
    { label: "Net is usually lower by", value: "≈ 1.5–2.5 points" },
    { label: "Golden Visa threshold", value: "AED 2 million+" },
  ],
  stepsTitle: "How to approach an investment",
  steps: [
    {
      title: "Decide what you want the property to do",
      text: "Income, capital growth, a home for later, or a residence visa — each points to a different kind of property. A compact apartment in a busy rental community usually suits income; a villa or a prime-waterfront home tends to be bought for long-term value. Be clear on your goal and your time horizon before you look.",
    },
    {
      title: "Choose ready or off-plan",
      text: "A ready property earns rent from the day you complete, and you can see exactly what you are buying. Off-plan is bought from the developer before completion on a staged payment plan, often at a lower entry price — you wait for the return, and your payments are protected in the project's RERA-regulated escrow account.",
    },
    {
      title: "Choose how you will let it",
      text: "A long-term let (usually 12 months) gives steady income with little involvement. A holiday-home let can earn more but varies by season, needs a holiday-home permit from Dubai's Department of Economy and Tourism, and costs more to run. Check that the building permits short-term letting before you buy with that in mind.",
    },
    {
      title: "Work out the net yield, not just the gross",
      text: "Gross yield is the annual rent divided by the price. What you keep is lower: take off the annual service charge, management fees, maintenance and any vacant months. Compare buildings on service charge per square foot — two similar flats can differ by thousands of dirhams a year.",
    },
    {
      title: "Buy, register and let",
      text: "The purchase itself follows the same steps as any other — see our Buyer's Guide. Once the property is yours, our leasing and property management teams can find a tenant, register the tenancy and look after the property for you.",
    },
  ],
  costsTitle: "What it costs to buy, hold and sell",
  costsIntro:
    "The costs below are what an individual investor typically meets over the life of an investment. Buying costs are set out in more detail in the Buyer's Guide.",
  costs: [
    { item: "Buying: DLD transfer fee", amount: "4% of the price", note: "Plus trustee, title deed and agency fees — around 6–7% of the price in total." },
    { item: "Holding: service charge", amount: "≈ AED 10–35 per sq ft a year", note: "Set by the building or community; ask for the latest figure on any property you consider." },
    { item: "Holding: long-term property management", amount: "≈ 5–10% of annual rent", note: "Finding tenants, rent collection, renewals and maintenance coordination." },
    { item: "Holding: holiday-home management", amount: "≈ 15–25% of booking revenue", note: "Higher, because the operator handles guests, cleaning and listings." },
    { item: "Holding: holiday-home permit", amount: "Varies", note: "Issued per unit by the Department of Economy and Tourism (DET); renewed yearly." },
    { item: "Holding: maintenance and vacancy", amount: "Allow ≈ 1 month's rent a year", note: "A prudent allowance, not a fixed fee." },
    { item: "Selling: agency commission", amount: "Typically 2% of the price + VAT" },
    { item: "Selling: developer NOC", amount: "Varies by developer", note: "Confirms no service charges are outstanding before transfer." },
  ],
  checkedAt: "November 2026",
  confirmWith: "the Dubai Land Department, the Department of Economy and Tourism and your tax adviser",
  checklistTitle: "Before you invest",
  checklist: [
    "Compare buildings on net yield — after service charges — not on the advertised gross.",
    "Ask for the service charge per sq ft and how it has moved over recent years.",
    "Check recent rents and sale prices for the same building, not just the area.",
    "For off-plan, confirm the project is RERA-registered and paid into escrow.",
    "Check the developer's record of completing projects on time.",
    "If you plan a holiday let, confirm the building allows it before you buy.",
    "Keep a cash buffer for vacant months and maintenance.",
    "Take tax advice in your home country — Dubai not taxing you does not mean nowhere will.",
  ],
  faqs: [
    {
      q: "Is rental income taxed in Dubai?",
      a: "Individuals who own property in their own name pay no UAE tax on rental income, and no tax on the gain when they sell. Holding property through a company can be treated differently under UAE corporate tax, and holiday-home income can bring VAT obligations above the registration threshold. Your home country may also tax your Dubai income — take advice on both before you buy.",
    },
    {
      q: "What rental yield can I expect?",
      a: "Current sources put gross yields for Dubai residential property broadly between about 5% and 9%, depending on the community, the type of property and its size. Net yields — after service charges, management and vacancy — are typically 1.5 to 2.5 percentage points lower. Past yields are not a guarantee of future returns, and rents rise and fall with the market.",
    },
    {
      q: "Is off-plan a good way to invest?",
      a: "Off-plan lets you buy at today's price on a payment plan and, often, at a lower entry price than comparable ready homes. In exchange, you earn no rent until completion and depend on the developer delivering on time. Your payments go into the project's escrow account, which is regulated by RERA, but it is still important to choose an established developer.",
    },
    {
      q: "Long-term let or holiday home?",
      a: "A long-term let is simpler and steadier: one tenant, rent paid by cheque, little to manage. A holiday home can earn more in a strong location, but income varies with the season, running costs are higher, a permit is required, and not every building allows it. Many investors start long-term and switch once they know the property and the area.",
    },
    {
      q: "Can I get a visa by investing in property?",
      a: "Owning property worth AED 2 million or more can qualify an investor for the 10-year Golden Visa, subject to the immigration authorities' current conditions, which change from time to time. Check the latest requirements before you rely on them.",
    },
    {
      q: "Can I invest from abroad?",
      a: "Yes. Many investors buy without visiting: viewings by video, documents signed digitally, the transfer completed under a power of attorney, and the property let and managed on their behalf.",
    },
  ],
  cta: {
    title: "Talk through an investment",
    lines: ["Tell us your budget and your goals, and a specialist will show you what the numbers look like on real properties."],
    label: "Speak to a Property Specialist",
    href: "/contact-us/",
    image: "/wp-content/uploads/2019/06/emaar-downtown-1536x864.jpg",
  },
  related: [
    { label: "New developments", href: "/status/off-plan/" },
    { label: "Property management", href: "/services/property-management/" },
    { label: "Buyer's Guide", href: "/buyers-guide/" },
    { label: "Tenant's Guide", href: "/tenants-guide/" },
  ],
};

export default function InvestmentGuidePage() {
  return <GuidePage g={guide} />;
}
