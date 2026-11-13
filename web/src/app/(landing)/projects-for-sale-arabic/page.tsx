import Image from "next/image";
import LeadForm from "@/components/LeadForm";
import LeadModal from "@/components/landing/LeadModal";
import {
  AssociateSection,
  FeatureList,
  MediaFrame,
  PhotoBand,
  ProjectBlock,
  ShowcaseHero,
  featureIcons as fi,
} from "@/components/landing/ProjectsShowcase";
import { BenefitRow, FormBox, LinksFooter, LpHeading, Reviews, WhatsAppFloat, btn, projectFields } from "@/components/landing/shared";
import { getPage, seoMetadata } from "@/lib/content";

export const metadata = seoMetadata(getPage("/projects-for-sale-arabic/")!);

const FORM = "Projects for Sale (Arabic)";
// The Arabic page lists the same six projects as /thank-you-projects/ (which links their brochures)
const REDIRECT = "/thank-you-projects/";
const SUBMIT = "احجز استشارة مجانية";

const projects = [
  {
    title: ["داماك", "لاجونز إيبيزا"],
    image: "1.jpg",
    description:
      "حياة العطلات والأجواء المتوسطية تنتظرك في قلب لاجونز إيبيزا، حيث أسلوب الحياة يحاكي العيش على جزيرة إيبيزا الإسبانية الشهيرة في قلب البحر الأبيض المتوسط.",
    facts: ["أسعار تبدأ من: 2.3 مليون درهم إماراتي", "تعداد غرف النوم: 4", "التسليم: يونيو 2026", "الموقع: داماك لاجونز"],
  },
  {
    title: ["إعمار", "أنيا 2 في المرابع العربية 3"],
    image: "2.jpg",
    description:
      "مجتمع ساحر من العقارات الفخمة التي تنضح بالرقي والجود والراحة مؤمنةً لسكانها محيطاً مدنياً مثالياً لجو العائلات ومزوداً بأفضل تسهيلات الراحة وأعلاها جودةً.",
    facts: ["أسعار تبدأ من: 2.26 مليون درهم إماراتي", "تعداد غرف النوم: 3-4", "التسليم: ديسمبر 2026", "الموقع: المرابع العربية 3"],
  },
  {
    title: ["ماج", "ماج 22"],
    image: "3.jpg",
    description: "مشروع فخم برؤية مميزة تتناغم مع البيئة لوضع تصميم أبديّ الرُقي، بتركيز على نظافة الخطوط ودقة التفاصيل.",
    facts: ["أسعار تبدأ من: 3.999 مليون درهم إماراتي", "تعداد غرف النوم: 2-3", "التسليم: الربع الرابع من 2024", "الموقع: ند الشيبا"],
  },
  {
    title: ["أرادَ", "جوري هيلز"],
    image: "4.jpg",
    description:
      "جوري هيلز هي وجهة عالمية للغولف السكني وتضم منازلاً فاخرة ومرافق ترفيهية وسط ملعبي بطولات غولف يحظيان بإشادة دولية، لتكون بذلك مكاناً مميزاً لأسلوب حياة لا مثيل له في قلب دبي الجديدة.",
    facts: ["أسعار تبدأ من: 4.2 مليون درهم إماراتي", "تعداد غرف النوم: 3-6", "التسليم: يونيو 2025", "الموقع: عقارات جميرا للجولف"],
  },
  {
    title: ["ماج", "كيتورا ريزيرف"],
    image: "5.jpg",
    description: "مشروع فخم برؤية مميزة تتناغم مع البيئة لوضع تصميم أبديّ الرُقي، بتركيز على نظافة الخطوط ودقة التفاصيل.",
    facts: ["7.75 مليون درهم إماراتي", null, null, "مدينة محمد بن راشد"],
  },
  {
    title: ["شوبا", "ريزيرف"],
    image: "6.jpg",
    description:
      "هذا المشروع منارة التميز العقاري بمعايير متفوقة في مجال التصميم المدني. مجمع شوبا ريزيرف يرتقي بالرفاهية المنزلية لمستوى آخر من الفخامة، مقدماً لك إحساساً لا مثيل له من التميز في ملاذك العصري.",
    facts: ["أسعار تبدأ من: 8.8 مليون درهم إماراتي", "تعداد غرف النوم: 4-5", "التسليم: يونيو 2026", "الموقع: وادي الصفا 2"],
  },
];
const factIcons = [fi.price, fi.bed, fi.keys, fi.pin];

const whyDubai = [
  { icon: "Group-16-1.png", w: 96, h: 133, label: "استثمار معفى من الضرائب" },
  { icon: "Group-13.png", w: 91, h: 108, label: "تأشيرة ذهبية" },
  { icon: "Group-12.png", w: 113, h: 120, label: "عائدات إيجار مرتفعة" },
  { icon: "crown1.png", w: 126, h: 95, label: "أسلوب حياة مميز" },
  { icon: "reward.png", w: 79, h: 142, label: "وسائل راحة عالمية المستوى" },
];

const reviews = [
  {
    name: "سكالوولد ليتا",
    text: "كان العمل مع إلميرا رائعاً، حيث استجابت لمكالماتنا ورسائلنا على الفور وكانت متجاوبة بنفس القدر مع ملاك العقار أثناء مساعدتنا في العثور على منزل جديد. كما أن معرفتها في المجال تستحق التقدير من حيث ما هو متاح وفيما كانت توقعاتك للأسعار تتوافق مع أرض الواقع أم لا.\nنحن مسرورون جداً ونتطلع لمنزلنا الجديد وممنون جداً لتجربتنا الناجحة مع إلميرا!",
  },
  {
    name: "شارميلا موهناني",
    text: "من حسن حظي أني التقيت بالسيد إلياس صلاح من Prestige Luxury للعقارات. فهو نشيط جداً ومتعاون وإنسان ذكي للغاية ومريح، كما أنه صبور وساعدنا كثيراً. اندهشنا أنا وزوجي كثيراً بأداءه، حيث كان ملتزماً معنا ومتفانياً جداً.\nنتمنى له نجاحاً مبهراً في مستقبله، كما نتمنى النجاح ل Prestige Luxury.",
  },
  {
    name: "كوريسكالب",
    text: "لا يسعني إلا أن أوصي بخدمات Prestige Luxury للعقارات، وخصوصاً إيما أودونيل.\n\nكنا نعاني من تجربة سيئة مع وكالة مشبوهة عندما عثرنا على إيما وPrestige Luxury بمحض الصدفة.\nساعدونا في إيجاد شقة ممتازة بسعر مناسب خلال أيام وحسب ونظموا كل شيء وأكثر بالتكيّف مع جدول أعمالنا وملاقاتنا بعد أوقات الدوام والتأكد من سير كل الأمور على ما يرام مع مالك العقار ومعنا شخصياً.\nلكل من يقرأ، كونوا متأكدين أنكم تعملون مع محترفين حقيقيين واطلبوا التعامل مع إيما، فهي لطيفة ومجدة وتمتلك ضميراً حياً.",
  },
];

export default function ProjectsForSaleArabicPage() {
  const fields = projectFields("ar");
  const modal = (label: string, className: string, project: string) => (
    <LeadModal
      label={label}
      className={className}
      title="تواصل معنا"
      form={FORM}
      fields={fields}
      extra={{ request: `Brochure – ${project}` }}
      submitLabel={SUBMIT}
      redirectTo={REDIRECT}
      dir="rtl"
    />
  );

  return (
    <div dir="rtl" lang="ar">
      <ShowcaseHero
        background="/wp-content/uploads/2023/04/Rectangle-53.png"
        title="عقارات راقية وفخمة في دبي"
        titleClass="text-[44px] !leading-[1.45] md:text-[64px] xl:text-[88px]"
        text={<p>رفاهية تحاكي تطلعاتك</p>}
        form={
          <FormBox title="تواصل معنا">
            <LeadForm form={FORM} fields={fields} submitLabel={SUBMIT} redirectTo={REDIRECT} dark />
          </FormBox>
        }
        benefits={<BenefitRow labels={["خطط سداد ملائمة", "أقساط بدون فوائد", "0% ضريبة ملكية", "تأشيرة ذهبية"]} />}
      />

      <section id="projects" className="scroll-mt-4 px-5 pt-12 md:px-[100px]">
        <LpHeading className="mx-auto max-w-[1300px] lg:leading-[100px]">اختر ما يلائمك من مجموعة عقارات راقية وتمتع بحياة من الرفاهية</LpHeading>
      </section>

      {projects.map((p, i) => (
        <ProjectBlock
          key={p.image}
          n={i + 1}
          titleClass="text-[32px] font-normal md:text-[48px] md:leading-[70px]"
          title={
            <>
              {p.title[0]}
              <br />
              {p.title[1]}
            </>
          }
          mediaFirst={i % 2 === 0}
          media={
            <MediaFrame>
              <Image
                src={`/wp-content/uploads/2023/04/${p.image}`}
                alt={p.title.join(" ")}
                width={618}
                height={681}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="h-auto w-full rounded-[10px]"
              />
            </MediaFrame>
          }
          description={p.description}
          features={p.facts.flatMap((text, k) => (text ? [{ icon: factIcons[k], text }] : []))}
          actions={
            <>
              {modal("عرض البروشور", btn.black, p.title.join(" "))}
              <a href="#contact" className={btn.grey}>
                اعرف المزيد
              </a>
            </>
          }
          footer={
            <FeatureList
              className="mt-10 lg:w-1/2"
              items={[
                { icon: fi.visa, text: "فيزا ذهبية" },
                {
                  icon: fi.tax,
                  text: (
                    <>
                      0% ضريبة ملكية أو دخل إيجار
                      <br /> تصريح إقامة للمالك وعائلته
                    </>
                  ),
                },
              ]}
            />
          }
        />
      ))}

      <PhotoBand heading="العقارات في دبي تمنحك الرقي والرفاهية وغيرها الكثير!">
        <ul id="benefits" className="mx-auto grid max-w-[1300px] grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
          {whyDubai.map((w) => (
            <li key={w.label} className="flex flex-col items-center text-center">
              <Image src={`/wp-content/uploads/2023/04/${w.icon}`} alt="" width={w.w} height={w.h} className="h-[100px] w-auto object-contain md:h-[130px]" />
              <span className="mt-5 text-[20px] font-medium leading-snug md:text-[26px]">{w.label}</span>
            </li>
          ))}
        </ul>
      </PhotoBand>

      <section id="map" className="scroll-mt-4 px-5 pt-16 md:px-[100px] md:pt-[100px]">
        <LpHeading>اعثر على عقارك</LpHeading>
        <Image
          src="/wp-content/uploads/2023/04/map2-1-1024x729.png"
          alt="خريطة المشاريع في دبي"
          width={1024}
          height={729}
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="mx-auto mt-12 h-auto w-full max-w-[1024px]"
        />
      </section>

      <AssociateSection
        heading="Prestige Luxury ستوصلك لحياة الرفاهية التي تستحقها!"
        paragraphs={[
          "العقارات التي نختارها مصممة لتمنحك أسلوب حياة لا مثيل له من حيث الرفاهية والرقي، فكل عقار منها مميز بتصميمه عالي الجودة ودقة تفاصيله.",
          "هذه العقارات الفاخرة تقع في أرقى المناطق من دبي لتمنحك سهولة حياة المدينة وراحة حياة الترف معاً في آن واحد.",
          "تهدف Prestige Luxury لتؤمن لك تجربة حياة فريدة تتميز بالرفاهية سواءً كنت تبحث عن تاون هاوس أو فيلا فاخرة، هذه العقارات مصممة لتلبي احتياجاتك وتفوق توقعاتك.",
          "مجموعة العقارات المنوعة التي يمكنك الوصول إليها عن طريق Prestige Luxury ستكون تجسيداً لحياة الترف التي تطمح إليها وتستحقها، بأسلوب حياة مميز يجمع بين العصرية والرخاء.",
        ]}
        action={modal(SUBMIT, `${btn.black} px-8 py-3 md:text-[32px]`, "استشارة مجانية")}
      />

      <Reviews id="testimonials" title="آراء عملائنا" reviews={reviews} />

      <section id="contact" className="scroll-mt-4 px-5 pb-20 pt-16 md:px-[100px] md:pb-[100px]">
        <LpHeading className="mx-auto max-w-[1100px]">تمتع برفاهية تحاكي تطلعاتك</LpHeading>
        <FormBox title="تواصل معنا" className="mt-12 max-w-[640px]">
          <LeadForm form={FORM} fields={fields} submitLabel={SUBMIT} redirectTo={REDIRECT} dark />
        </FormBox>
      </section>

      <LinksFooter
        lang="ar"
        links={[
          { key: "projects", label: "المشاريع", href: "#projects" },
          { key: "benefits", label: "المزايا", href: "#benefits" },
          { key: "testimonials", label: "شهادات العملاء", href: "#testimonials" },
          { key: "map", label: "الخريطة", href: "#map" },
        ]}
      />
      <WhatsAppFloat />
    </div>
  );
}
