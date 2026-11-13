import { DocCard, ThankYouPage } from "@/components/landing/ThankYou";
import { getPage, seoMetadata } from "@/lib/content";

export const metadata = seoMetadata(getPage("/thank-you-projects/")!);

const brochures = [
  { title: "Damac Lagoons Ibiza", n: 1, href: "https://drive.google.com/file/d/1etQyeW1mvQZEhmln-_N-qhDtAJjRksPS/view" },
  { title: "Emaar | Anya 2 in Arabian Ranches 3", n: 2, href: "https://drive.google.com/file/d/1o4LcBHG73TqeOJ2GzIr-PXiVlGpi2cJo/view?usp=sharing" },
  { title: "Mag Mag 22", n: 3, href: "https://drive.google.com/file/d/1ySl7e96KVJvM1UorEg5ioLU3MiQPgsqp/view" },
  { title: "Arada Jouri Hills", n: 4, href: "https://drive.google.com/file/d/1bCz3xtuqK1WtStWz_eljw2ZKkINXeGe6/view?usp=sharing" },
  {
    title: "Mag Keturah Reserve Plots",
    n: 5,
    href: "https://magpdcom.sharepoint.com/sites/Marketing_Dept/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FMarketing%5FDept%2FShared%20Documents%2F%23Public%20links%2F%23Partners%27%20Assets%2FKeturah%20Reserve&p=true&ga=1",
  },
  { title: "Sobha Reserve", n: 6, href: "https://drive.google.com/drive/folders/14hzdjdso5oorMsR9qXaCmZQCXkE9iJ17" },
];

export default function ThankYouProjectsPage() {
  return (
    <ThankYouPage>
      <div className="mx-auto grid max-w-[1400px] gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        {brochures.map((b) => (
          <DocCard
            key={b.n}
            title={b.title}
            image={{ src: `/wp-content/uploads/2023/04/${b.n}.jpg`, width: 618, height: 681 }}
            href={b.href}
            label="View Brochure"
          />
        ))}
      </div>
    </ThankYouPage>
  );
}
