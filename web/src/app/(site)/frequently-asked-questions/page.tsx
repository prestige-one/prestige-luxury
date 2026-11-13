import type { Metadata } from "next";
import { Accordion } from "@/components/info/blocks";
import { Container, PageBanner } from "@/components/ui";
import { getPage, seoMetadata } from "@/lib/content";

export const metadata: Metadata = seoMetadata(getPage("/frequently-asked-questions/")!);

const groups = [
  {
    title: "Questions about selling",
    items: [
      {
        q: "Could you describe the sales and purchase process?",
        a: "<p>In most instances, the transaction process goes as follows:</p><ul><li>Buyer chooses the property.</li><li>Buyer and seller sign the sales and purchase agreement, where all the terms and conditions of the deal are mentioned: the purchase price, additional expenses (agency fee, transfer fee at the DLD, developer’s fee, service charge refund, etc), the transfer date of the deal at the DLD, terms of payment and clearly-defined responsibilities and penalties for both parties in case they fail to uphold the conditions set out in the agreement.</li><li>On signing the agreement, the buyer pays the deposit. This is usually 10% of the purchase price.</li><li>The seller applies for a no-objection certificate (NOC) from the developer in order to sell the property. The NOC is required for the transfer process at the DLD.</li><li>Once the NOC is ready, the buyer and seller can transfer the property and register it on the buyer’s name. Usually, payments need to be made at the time of registration.</li></ul>",
      },
    ],
  },
  {
    title: "Questions about renting",
    items: [
      {
        q: "How do we put an offer forward?",
        a: "<p>Your Prestige consultant will guide you through the process. This will involve fully understanding and your requirements and position so we can clearly forward this to the landlord and do our best to secure the property for you. A deposit amount is payable immediately upon acceptance, your consultant can advise on the amount.</p>",
      },
    ],
  },
  {
    title: "Questions about Property Management",
    items: [
      { q: "Will I get a discount if I have multiple properties?", a: "<p>Discounts are subject to review and Management Approval.</p>" },
      {
        q: "If I take property management will you also assist me in selling my property?",
        a: "<p>Yes, because we are not just a management company, we are also a brokerage company that specialize in renting and selling.</p>",
      },
      {
        q: "Can I pay after the property gets rented?",
        a: "<p>Yes, but you will have to pay a minimum of AED 3000 to cover the cost of management before the property is rented.</p>",
      },
      {
        q: "What if I am not satisfied with the service, how does cancellation work?",
        a: "<p>In the unlikely event that you are unhappy with the service we provide, we will require from you a 90-day notice letter in writing giving us reason for termination. The Managing Agent agrees to refund any outstanding rental funds held after relevant deductions made to the property (such as community charges, approved payments by you (Owner).</p>",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <PageBanner title="Frequently Asked Questions" />
      <section className="py-16 md:py-[100px]">
        <Container className="max-w-[960px] space-y-14">
          {groups.map((g) => (
            <div key={g.title}>
              <h2 className="mb-6 text-[24px] font-medium text-ink">{g.title}</h2>
              <Accordion items={g.items} />
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}
