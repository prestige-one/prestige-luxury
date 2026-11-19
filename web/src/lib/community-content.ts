import communityData from "../../content/communities.json";
import neighbourhoodImages from "../../content/neighbourhood-images.json";

// Editorial presentation stays separate from the imported source data.
export const communityImages: Readonly<Record<string, string>> = {
  ...neighbourhoodImages,
  difc: "/images/areas/difc-landing-cover-hq.webp",
};

const difc = {
  slug: "difc",
  name: "DIFC",
  lifestyle: "City living",
  image: communityImages.difc,
  description: "A central business and residential district with contemporary apartments, renowned dining, art galleries and convenient connections across Dubai.",
};

export const communities = [...communityData.filter((community) => community.slug !== "difc"), difc];

export const directoryCommunities = communities
  .filter((community) => community.slug !== "deira" && community.slug !== "difc")
  .flatMap((community) => community.slug === "arabian-ranches" ? [difc, community] : [community]);
