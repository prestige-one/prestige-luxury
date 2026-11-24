/** Owner-supplied biographies and existing agency portraits. */
export const team = [
  {
    slug: "chris-valentine",
    name: "Chris Valentine",
    role: "Associate Director",
    subtitle: "Prestige Luxury Real Estate",
    image: "/images/chris-3.webp",
    biography: [
      "With more than 24 years of real estate experience and a Master’s degree in Business Management, Chris Valentine combines extensive industry knowledge with commercial insight and a personal approach to client service.",
      "Chris has a strong track record in growing profitable businesses and leading successful sales teams. Through coaching, training and clear direction, he develops talent and builds teams committed to delivering results. His career achievements include being invited to join the main board of a prominent residential property company after six years.",
      "His expertise spans land acquisitions, development opportunities, off-plan sales, resales, leasing and property management. Working with developers, investors, homeowners and buyers across Dubai, he helps clients identify opportunities, assess their options and make confident property decisions.",
      "As Associate Director at Prestige Luxury Real Estate, Chris places lasting relationships at the heart of his work, offering honest advice, clear communication and dependable support throughout every transaction.",
    ],
  },
  {
    slug: "michael-cullen",
    name: "Michael Cullen",
    role: "Associate Director",
    subtitle: "Real Estate Sales & Leadership | Dubai",
    image: "/images/michael-3.webp",
    biography: [
      "With more than two decades of experience in real estate, Michael Cullen has built his career around two key strengths: delivering results through his own property sales and building, developing and leading successful sales teams.",
      "Throughout his career, Michael has remained actively involved in the market, working directly with buyers, sellers, developers and investors, while also taking on leadership responsibilities in recruiting, mentoring and managing sales professionals.",
      "His approach to leadership is rooted in hands-on experience. Having spent many years personally negotiating and closing property transactions, Michael understands what it takes to succeed in a competitive market. He believes that building successful teams requires strong leadership, practical training, accountability and an environment where individuals are encouraged to develop and perform at their best.",
      "Michael’s experience spans the full spectrum of real estate, including land sourcing, development opportunities, off-plan project launches, secondary market sales, leasing and asset management. This broad understanding of the industry has enabled him to combine commercial strategy with practical execution, whether identifying investment opportunities, structuring transactions, developing sales strategies or growing sales operations.",
      "Over the years, he has established long-standing relationships with developers, private investors, landlords and end users, built on trust, market knowledge and a consistent focus on delivering results.",
      "A key part of Michael’s career has been his passion for developing people alongside growing businesses. He takes particular pride in helping sales professionals build their confidence, improve their skills and achieve long-term success.",
      "Today, at Prestige Luxury Real Estate, Michael continues to combine his extensive market knowledge with his experience in sales leadership and business development, maintaining a hands-on approach to both client relationships and team performance.",
      "His philosophy is straightforward: sustainable success in real estate comes from strong relationships, the right people, consistent performance and a shared commitment to delivering results.",
    ],
  },
] as const;

export const getTeamMember = (slug: string) => team.find((member) => member.slug === slug);
