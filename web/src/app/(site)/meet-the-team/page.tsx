import type { Metadata } from "next";
import Media from "@/components/Media";
import { Container } from "@/components/ui";
import { getPage, seoMetadata } from "@/lib/content";

export const metadata: Metadata = seoMetadata(getPage("/meet-the-team/")!);

const team = [
  {
    name: "Shaun Cullen",
    role: "Managing Director",
    image: "/wp-content/uploads/2024/03/Shaun.jpg",
    text: "Meet Shaun, our Managing Director from Liverpool, UK. With 8 years of Dubai Real Estate experience, Shaun has grown within Prestige Luxury. Starting as a Property Consultant, he quickly became the Sales Director and now spearheads our operations as Managing Director.",
  },
  {
    name: "Pantea Rokni",
    role: "Team Director",
    image: "/wp-content/uploads/2024/03/Pantea.jpg",
    text: "Pantea Rokni, the epitome of luxury in real estate, is the director of the LUX team at Prestige. With over 15 years of experience and a 2021 Bayut Best Agent Award, she embodies the prestige spirit that elevates customer service to surpass expectations.",
  },
  {
    name: "Elena Komarnytska",
    role: "Area Director",
    image: "/wp-content/uploads/2024/03/Elena.jpg",
    text: "Originally from Ukraine, Elena came to Dubai 21 years ago. She built a strong foundation of satisfied and loyal real estate clientele. Her team focuses on luxury projects like Nad Al Sheba Gardens, Jumeirah Golf Estate, Polo Homes, and other villa communities...",
  },
  {
    name: "Bipin Pattni",
    role: "Area Director",
    image: "/wp-content/uploads/2024/03/Bipin.jpg",
    text: "Bipin is a real estate professional with over 17 years of experience in sales. He has a track record of delivering and sustaining revenue and profit gains in highly competitive real estate markets for ready-to-move...",
  },
  {
    name: "Anusha Bhowan",
    role: "Area Director",
    image: "/wp-content/uploads/2024/03/Anusha.jpg",
    text: "With her extended expertise and deep understanding of the Dubai Real Estate market, Anusha stands out from the crowd. She excels at building trustful and lasting professional relationships with her clients. Most especially, Anusha goes out of her way to make client satisfaction as her top priority.",
  },
  {
    name: "Katie-Jo Reid",
    role: "Head of Recruitment",
    image: "/wp-content/uploads/2024/03/Katie.jpg",
    text: "Katie, our esteemed Head of Recruitment, is your gateway to an exciting career in the UAE's dynamic property market. She is an expert in transitioning professionals from the UK to the UAE with full support and insights.",
  },
  {
    name: "Samuel Hartley",
    role: "HR Manager",
    image: "/wp-content/uploads/2024/03/Sam.jpg",
    text: "Sam is the cornerstone of our Human Resources and Development team. With his experience, he brings a wealth of knowledge from his tenure in education management and talent management HR.",
  },
];

export default function MeetTheTeamPage() {
  return (
    <section className="py-16 md:py-[100px]">
        <Container>
          <h1 className="mb-12 text-center font-heading text-[30px] font-normal capitalize text-ink md:text-[34px]">Meet our Team</h1>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-10">
            {team.map((m) => (
              <li key={m.name} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]">
                <article className="group">
                  <div className="relative aspect-[3/4] overflow-hidden bg-mist">
                    <Media
                      src={m.image}
                      alt={`${m.name}, ${m.role}`}
                      fill
                      sizes="(min-width: 1024px) 270px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                    {/* Houzez team widget: description slides over the photo on hover (desktop) */}
                    <div aria-hidden className="absolute inset-0 hidden flex-col justify-end bg-black/80 p-5 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:flex">
                      <p className="text-[13px] leading-[1.6]">{m.text}</p>
                    </div>
                  </div>
                  <h2 className="mt-4 text-[17px] font-semibold text-ink">{m.name}</h2>
                  <p className="text-[13px] uppercase tracking-wide text-muted">{m.role}</p>
                  <p className="mt-3 text-[13.5px] leading-[1.6] text-body lg:sr-only">{m.text}</p>
                </article>
              </li>
            ))}
          </ul>
      </Container>
    </section>
  );
}
