import type { Metadata } from "next";
import GuidePage, { type Guide } from "@/components/guides/GuidePage";
import { communityPhoto } from "@/lib/imagery";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tenant's Guide to Renting in Dubai",
  description:
    "How renting in Dubai works: viewings, the tenancy contract, Ejari, DEWA, deposits and cheques, rent increases and notice periods — plus every upfront cost to budget for.",
  alternates: { canonical: "/tenants-guide/" },
  openGraph: { url: `${site.url}/tenants-guide/` },
};

/*
 * Figures were checked in November 2026 against several current 2026 sources. They agreed on
 * the deposit caps, the 5% agency fee, the DEWA deposits, the 5% housing fee and the 90-day
 * notice for rent increases, which are given plainly. The Ejari fee varied between sources
 * (roughly AED 170–220 depending on channel), so it is given as "around". The rent-increase
 * bands are deliberately not reproduced — the guide points to the official RERA calculator,
 * which is the only figure that counts in a dispute.
 */
const guide: Guide = {
  title: "Tenant's Guide",
  subtitle: "Renting a home in Dubai, step by step — your rights, the paperwork, and the costs to plan for.",
  image: communityPhoto("Dubai Marina", { size: "full" }) ?? "/wp-content/uploads/2020/07/Dubai-Marina-2.jpg",
  crumb: "Tenant's Guide",
  intro: [
    "Renting in Dubai is well regulated. Every residential tenancy is registered with the government through Ejari, deposits are capped, rent increases are tied to an official index, and tenants have clear protections on notice and eviction under the Dubai tenancy law administered by RERA.",
    "This guide takes you through a typical rental from first viewing to moving in, sets out what you will pay upfront, and explains the rules that matter most once you are living there. Your Prestige Luxury leasing agent will handle the detail of your own tenancy with you.",
  ],
  glance: [
    { label: "Usual contract length", value: "12 months" },
    { label: "Rent paid by", value: "1–4 cheques a year, usually" },
    { label: "Security deposit", value: "5% (10% furnished)" },
    { label: "Agency fee", value: "5% of annual rent + VAT" },
    { label: "Notice of rent increase", value: "90 days before renewal" },
    { label: "Registered with", value: "Ejari (DLD / RERA)" },
  ],
  stepsTitle: "How renting works",
  steps: [
    {
      title: "Set your budget and gather your documents",
      text: "Work out your annual budget, and how many cheques you can offer — fewer cheques often earns a better rent. Have your passport, UAE residence visa and Emirates ID ready; landlords will ask for copies before agreeing terms.",
    },
    {
      title: "View, choose and make an offer",
      text: "Your agent will shortlist homes and arrange viewings. When you find the right one, the offer sets out the rent, the number of cheques and the start date. Some landlords ask for a small holding deposit to take the property off the market while the contract is prepared.",
    },
    {
      title: "Sign the tenancy contract and pay",
      text: "You sign the standard Dubai tenancy contract, and any addendum agreed with the landlord. You then hand over the rent cheques, the refundable security deposit and the agency fee. Read the addendum carefully — it is where maintenance responsibilities and any special terms are written.",
    },
    {
      title: "Register the contract with Ejari",
      text: "Every tenancy must be registered with Ejari, the government's rental registration system. Registration makes the contract legally binding, and you need it to connect electricity and water, sponsor family visas, and bring any case before the Rental Disputes Centre.",
    },
    {
      title: "Connect DEWA and move in",
      text: "With the Ejari certificate you open a DEWA account for electricity and water, paying a refundable connection deposit. Your monthly DEWA bill also carries the Dubai Municipality housing fee. Collect the keys and access cards, note the property's condition with photos, and the home is yours.",
    },
  ],
  costsTitle: "What to budget for upfront",
  costsIntro: "On top of the rent itself, a tenant typically pays the following when a new tenancy starts.",
  costs: [
    { item: "Rent", amount: "Annual rent, in 1–4 cheques", note: "Usually post-dated cheques; the first is cashed at the start of the tenancy." },
    { item: "Security deposit", amount: "5% of annual rent", note: "10% if the property is furnished. Refundable at the end, less any damage beyond normal wear." },
    { item: "Agency fee", amount: "5% of annual rent + VAT", note: "Some agencies set a minimum fee on lower rents." },
    { item: "Ejari registration", amount: "Around AED 170–220", note: "Depending on whether it is registered online or at a typing centre." },
    { item: "DEWA connection deposit", amount: "AED 2,000 (apartment) · AED 4,000 (villa)", note: "Refundable when you close the account." },
    { item: "Housing fee", amount: "5% of annual rent", note: "Collected monthly through the DEWA bill, rather than upfront." },
  ],
  checkedAt: "November 2026",
  confirmWith: "the Dubai Land Department, RERA and DEWA",
  checklistTitle: "Before you sign",
  checklist: [
    "Check the landlord owns the property — ask to see the title deed and their ID.",
    "Make sure the rent, cheques, deposit and start date are written into the contract.",
    "Read the addendum: who pays for maintenance and repairs?",
    "Photograph the property's condition on the day you move in.",
    "Register the contract with Ejari — without it, you cannot connect DEWA.",
    "Keep copies of every cheque and receipt you hand over.",
    "Note your renewal date: any rent increase needs 90 days' written notice.",
    "Check the RERA rental index before agreeing to an increase.",
  ],
  faqs: [
    {
      q: "How much can my landlord increase the rent?",
      a: "Rent increases at renewal are governed by the RERA rental index. Whether your landlord can increase the rent, and by how much, depends on how your current rent compares with the average for similar homes in your area. Your landlord must also give you at least 90 days' written notice before the contract ends. The official RERA rental calculator on the Dubai Land Department website will tell you the increase allowed for your home.",
    },
    {
      q: "Can my landlord ask me to leave?",
      a: "Only on the grounds the tenancy law allows. If the landlord wants the property back at the end of a contract — for example to sell it, or to live in it themselves — they must give 12 months' notice, served through a notary public or by registered post. During the contract, eviction is only possible for specific reasons, such as unpaid rent.",
    },
    {
      q: "Do I get my security deposit back?",
      a: "Yes. The deposit is returned when you move out, provided the property is handed back in the condition you received it, allowing for normal wear and tear. Photos taken on the day you move in are the best protection if there is a disagreement.",
    },
    {
      q: "Can I pay rent monthly?",
      a: "Most landlords still prefer one to four cheques a year, and fewer cheques can help you negotiate a lower rent. Some landlords and buildings now accept monthly payments, often at a slightly higher rent — ask your agent which homes on your shortlist offer it.",
    },
    {
      q: "What if I need to leave before the contract ends?",
      a: "Check your contract first: early termination terms, and any penalty, should be written into it or its addendum. A penalty of one or two months' rent is common. If the contract is silent, speak to your landlord — and to us — before you give notice.",
    },
    {
      q: "Who pays for maintenance?",
      a: "Major maintenance is normally the landlord's responsibility, while minor upkeep may fall to the tenant. The split varies between contracts, which is why it should be written into the addendum before you sign.",
    },
  ],
  cta: {
    title: "Looking for your next home?",
    lines: ["Tell us what you need and a leasing specialist will put together a shortlist for you."],
    label: "Speak to a Leasing Agent",
    href: "/contact-us/",
    image: "/wp-content/uploads/2019/06/emaar-downtown-1536x864.jpg",
  },
  related: [
    { label: "Properties for rent", href: "/status/for-rent/" },
    { label: "Property management", href: "/services/property-management/" },
    { label: "Buyer's Guide", href: "/buyers-guide/" },
    { label: "Frequently asked questions", href: "/frequently-asked-questions/" },
  ],
};

export default function TenantsGuidePage() {
  return <GuidePage g={guide} />;
}
