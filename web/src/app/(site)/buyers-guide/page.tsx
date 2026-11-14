import type { Metadata } from "next";
import GuidePage, { type Guide } from "@/components/guides/GuidePage";
import { communityPhoto } from "@/lib/imagery";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Buyer's Guide to Dubai Property",
  description:
    "How buying property in Dubai works: budget and mortgages, ready versus off-plan, Form F, the NOC and the transfer at the Land Department — plus every fee to budget for.",
  alternates: { canonical: "/buyers-guide/" },
  openGraph: { url: `${site.url}/buyers-guide/` },
};

/*
 * Figures were checked in November 2026 against several current 2026 sources. Where those
 * sources disagreed (the title-deed fee, non-resident lending), the guide gives a range or
 * says "around" rather than picking one; where they agreed (the 4% transfer fee, the
 * trustee-office tiers, 0.25% mortgage registration), the figure is given plainly.
 * Re-check this table whenever DLD or the Central Bank announce a change.
 */
const guide: Guide = {
  title: "Buyer's Guide",
  subtitle: "Buying property in Dubai, step by step — what happens, in what order, and what it costs.",
  image: communityPhoto("Downtown Dubai", { size: "full" }) ?? "/wp-content/uploads/2019/06/emaar-downtown-1536x864.jpg",
  crumb: "Buyer's Guide",
  intro: [
    "Dubai is one of the most straightforward places in the world to buy property. Foreign buyers can own freehold in designated areas outright, there is no annual property tax, and every sale is registered centrally with the Dubai Land Department (DLD), which keeps the process transparent and the paperwork standardised.",
    "This guide walks through a typical purchase of a ready (completed) property from start to finish, explains how buying off-plan differs, and sets out the costs you should budget for on top of the price. Every purchase is different, so treat it as an orientation — your Prestige Luxury advisor will take you through the specifics of yours.",
  ],
  glance: [
    { label: "Who can buy", value: "Anyone, in freehold areas" },
    { label: "Main government fee", value: "4% DLD transfer fee" },
    { label: "Typical all-in costs", value: "≈ 6–7% on top of price" },
    { label: "Ready property, cash", value: "≈ 3–4 weeks" },
    { label: "With a mortgage", value: "≈ 4–8 weeks" },
    { label: "Annual property tax", value: "None" },
  ],
  stepsTitle: "How a purchase works",
  steps: [
    {
      title: "Set your budget and, if you need one, get mortgage pre-approval",
      text: "Decide whether you are buying in cash or with a mortgage. If you are borrowing, ask a bank or broker for pre-approval before you view seriously: it tells you exactly what you can spend and lets you move quickly when you find the right home. Remember to keep roughly 6–7% of the price aside for fees, on top of your deposit.",
    },
    {
      title: "Choose the area, the property, and ready or off-plan",
      text: "A ready property can be moved into or let straight away. An off-plan property is bought from the developer before completion, usually on a staged payment plan, and is typically priced lower in exchange for waiting. Your advisor will shortlist homes against your brief and arrange viewings.",
    },
    {
      title: "Agree the price and sign the MOU (Form F)",
      text: "Once an offer is accepted, buyer and seller sign the Memorandum of Understanding — RERA's standard Form F — which sets the price, the completion date and who pays which fee. The buyer usually gives a security deposit of 10% of the price, held by the agency as a cheque until transfer.",
    },
    {
      title: "The seller obtains the developer's NOC",
      text: "The seller applies to the developer for a No Objection Certificate, which confirms there are no outstanding service charges on the property. If the seller still has a mortgage, their bank provides a liability letter so the loan can be settled at transfer.",
    },
    {
      title: "Transfer at a Land Department trustee office",
      text: "Both parties (or their representatives under power of attorney) attend a DLD-registered trustee office. The buyer hands over the balance as a manager's cheque, the DLD fees are paid, and ownership is registered there and then. The new title deed is issued electronically in the buyer's name.",
    },
    {
      title: "Handover",
      text: "You receive the keys and access cards, register with DEWA for electricity and water, and the home is yours. If you are letting it out, our property management team can take it from here.",
    },
  ],
  costsTitle: "What to budget for",
  costsIntro:
    "On a ready property, a buyer typically pays the following on top of the purchase price. Off-plan purchases differ: the 4% fee is paid at registration (known as Oqood), and there is usually no trustee-office fee or seller NOC.",
  costs: [
    {
      item: "DLD transfer fee",
      amount: "4% of the price",
      note: "Calculated on the sale price or the DLD's own valuation, whichever is higher. By market convention the buyer pays the full 4%.",
    },
    { item: "Trustee office fee", amount: "AED 4,000 + VAT", note: "AED 2,000 + VAT where the price is below AED 500,000." },
    { item: "Title deed and DLD admin fees", amount: "A few hundred dirhams", note: "Commonly around AED 250–580, depending on property type." },
    { item: "Agency commission", amount: "2% of the price + VAT", note: "The industry norm; agreed in Form F." },
    { item: "Mortgage registration (if borrowing)", amount: "0.25% of the loan + ≈ AED 290" },
    { item: "Bank arrangement fee (if borrowing)", amount: "Up to 1% of the loan", note: "Varies by bank; some waive it." },
    { item: "Property valuation (if borrowing)", amount: "≈ AED 2,500–3,500 + VAT", note: "Required by the lender before final approval." },
  ],
  checkedAt: "November 2026",
  confirmWith: "the Dubai Land Department and your bank",
  checklistTitle: "Before you commit",
  checklist: [
    "Get mortgage pre-approval before making offers, if you are borrowing.",
    "Keep about 6–7% of the price aside for fees, separate from your deposit.",
    "Check the service charge per square foot — it is paid every year you own.",
    "For off-plan, confirm the project is registered with RERA and payments go to its escrow account.",
    "Ask whether the property is vacant or tenanted, and see the tenancy contract if it is.",
    "Make sure the price and every fee split are written into Form F.",
    "If you cannot attend the transfer, arrange a power of attorney in good time.",
    "Bring your original passport to the trustee office — copies are not accepted.",
  ],
  faqs: [
    {
      q: "Can foreigners buy property in Dubai?",
      a: "Yes. Non-UAE nationals can buy freehold property outright in Dubai's designated freehold areas, which include most of the communities international buyers look at — Dubai Marina, Downtown Dubai, Palm Jumeirah, Business Bay, JVC and many more. You do not need to be a UAE resident.",
    },
    {
      q: "How much can I borrow?",
      a: "The UAE Central Bank caps lending against the property's value. For a resident expatriate buying a first home under AED 5 million, banks can lend up to 80%, so you need a 20% deposit. Lower limits apply above AED 5 million, on second properties, and on off-plan purchases (usually up to 50%). Non-residents can borrow too, but most banks lend around 50–60% and may set a minimum property value. A mortgage broker or your bank will confirm what applies to you.",
    },
    {
      q: "Does buying property give me a UAE visa?",
      a: "Property ownership can support a residence visa. Owning property worth AED 2 million or more can qualify an investor for the 10-year Golden Visa, subject to the government's current conditions. The rules are set by the immigration authorities and change from time to time, so check the latest requirements before relying on them.",
    },
    {
      q: "What is the difference between ready and off-plan?",
      a: "A ready property is complete — you can live in it or let it from the day of transfer. An off-plan property is bought from the developer before it is finished, normally on a payment plan spread over construction, and often at a lower price. Off-plan payments are made into a RERA-supervised escrow account for that project, which protects buyers' money.",
    },
    {
      q: "Do I need to be in Dubai to buy?",
      a: "No. Many of our clients buy from abroad. Viewings can be done by video, documents signed digitally, and the transfer completed by someone you appoint under a power of attorney.",
    },
    {
      q: "Are there ongoing costs after I buy?",
      a: "There is no annual property tax in Dubai. Owners pay a yearly service charge to the community or building for maintenance and shared facilities, plus utilities. If you let the property, budget for property management if you would rather not handle tenants yourself.",
    },
  ],
  cta: {
    title: "Ready to start your search?",
    lines: ["Tell us what you are looking for and a property specialist will put together a shortlist for you."],
    label: "Speak to a Property Specialist",
    href: "/contact-us/",
    image: "/wp-content/uploads/2019/06/emaar-downtown-1536x864.jpg",
  },
  related: [
    { label: "Properties for sale", href: "/status/for-sale/" },
    { label: "New developments", href: "/status/off-plan/" },
    { label: "Investment Guide", href: "/investment-guide/" },
    { label: "Tenant's Guide", href: "/tenants-guide/" },
    { label: "Frequently asked questions", href: "/frequently-asked-questions/" },
  ],
};

export default function BuyersGuidePage() {
  return <GuidePage g={guide} />;
}
