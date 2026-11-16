import type { Property } from "./properties";

// Original editorial summaries researched from Provident's area guides, 16 November 2026.
// Reference: https://providentestate.com/area-guides/ and the corresponding community pages.
// Keep editorial copy separate from the CRM-managed JSON. Avoid prices, returns and completion dates.
const overviews: Record<string, string[]> = {
  // https://providentestate.com/area-guides/jumeirah-village-circle/
  "jumeirah-village-circle": [
    "Jumeirah Village Circle brings together apartment buildings, townhouses and villas in a residential setting shaped around neighbourhood parks and landscaped walking routes. Developed by Nakheel, JVC offers a community-focused alternative to Dubai’s busier waterfront and business districts, with homes suited to individuals, couples and families.",
    "Circle Mall is a local hub for shopping and dining, while supermarkets, cafés and everyday services are distributed throughout the neighbourhood. Nurseries and JSS International School add to the area’s appeal for families, and the parks offer space for outdoor exercise and relaxed evenings close to home.",
    "Connections to Al Khail Road and Sheikh Mohammed Bin Zayed Road link JVC with the wider city. When choosing a property, compare the building’s access routes, parking, facilities and distance from local amenities, as the experience can vary between individual developments.",
  ],
  "palm-jumeirah": [
    "Palm Jumeirah is Dubai’s distinctive palm-shaped island, combining waterfront apartments with villas and penthouses across its trunk, fronds and crescent. Its residential neighbourhoods sit alongside resort hotels and coastal leisure destinations, offering several different ways to enjoy island living.",
    "Beach venues, restaurants and attractions such as Atlantis, The Palm make the island a destination beyond its homes. Apartment communities and villa enclaves offer different outlooks and facilities, so beach access, views and shared amenities should be checked for each property.",
    "Road connections and the Palm Monorail support journeys around the island and towards the mainland. Consider the position of a home on the trunk, fronds or crescent alongside its layout and access requirements.",
  ],
  "dubai-marina": [
    "Dubai Marina is a waterfront district where residential towers frame a yacht marina and a network of waterside promenades. Apartments and penthouses dominate the housing mix, with outlooks ranging from the marina basin to the surrounding skyline.",
    "Marina Walk brings cafés, restaurants and shops into everyday life, while nearby JBR adds beachside leisure to the area’s urban character. The neighbourhood suits residents who enjoy an active setting with dining and entertainment close to home.",
    "Compare individual towers for parking, shared facilities, balcony space and the orientation of the view. A marina address can offer very different living experiences depending on the building and its position within the district.",
  ],
  "downtown-dubai": [
    "Downtown Dubai centres on some of the city’s best-known landmarks, including Burj Khalifa, Dubai Mall and Dubai Opera. Its residential towers and boulevard-side homes offer an urban setting with shopping, dining and cultural destinations nearby.",
    "The area’s appeal lies in combining a central address with a broad choice of apartments and high-rise residences. Established buildings and newer developments offer different layouts, outlooks and shared facilities.",
    "When comparing homes, consider the precise view, building access and distance from the places you use regularly. Boulevard activity and proximity to major attractions are part of the neighbourhood’s character.",
  ],
  "business-bay": [
    "Business Bay combines residential towers, offices and hotels around the Dubai Water Canal. Close to Downtown Dubai, it offers a city-focused setting for residents who want their home, workplace and leisure options within the same wider district.",
    "Canal-side routes, restaurants and hotel venues give the neighbourhood a mix of daytime activity and evening destinations. The residential market includes apartments in buildings with varied layouts, facilities and skyline or water outlooks.",
    "Building location matters when comparing Business Bay properties. Check access to transport and main roads, parking arrangements and the relationship between the apartment’s actual view and its advertised canal or city setting.",
  ],
  "dubai-sports-city": [
    "Dubai Sports City places residential neighbourhoods alongside sporting and golf facilities. Its housing ranges from apartments in residential towers to larger homes in villa communities, giving residents a choice of settings within the wider district.",
    "Sport and outdoor recreation shape the area’s identity, while individual buildings and communities provide their own facilities. The neighbourhood can suit residents who want a home linked to an active lifestyle rather than a city-centre address.",
    "Access via Al Khail Road and Hessa Street connects the district with the wider city. Compare the specific building, parking, shared amenities and outlook when considering apartments described as having golf-course or community views.",
  ],
  "jumeirah-lake-towers": [
    "Jumeirah Lake Towers mixes homes and workplaces in clusters of towers around landscaped lakes. Its apartments, penthouses and office spaces create a neighbourhood where residential and business activity sit close together.",
    "Lakeside paths and local dining contribute to the community atmosphere, while Dubai Metro connections are part of the area’s appeal. Different clusters offer distinct outlooks and different relationships to shops, services and transport.",
    "Check the individual tower’s facilities, parking and walking routes when shortlisting a home. The cluster and floor level can be as important as the apartment layout when deciding which property best fits your routine.",
  ],
  "jumeirah-beach-residence": [
    "Jumeirah Beach Residence combines apartment living with a lively beachfront setting beside Dubai Marina. Residential towers overlook the surrounding neighbourhood, marina or sea, depending on their position and orientation.",
    "The Walk and the beachside dining and retail destinations give residents plenty to explore close to home. This is a setting for people who enjoy outdoor activity and an established coastal neighbourhood with an urban atmosphere.",
    "Compare each apartment’s outlook, balcony, parking and building facilities. Access arrangements and the activity around individual buildings can make a noticeable difference to everyday life.",
  ],
  "dubai-hills-estate": [
    "Dubai Hills Estate combines apartments, townhouses and villas within a master-planned landscape focused on greenery and open space. Its golf course is a defining feature, while different residential communities offer their own scale and character.",
    "The district forms part of the wider Mohammed Bin Rashid City development and sits along Al Khail Road. Residents can choose between apartment living and larger family homes rather than a single uniform property type.",
    "Look at the individual community and building when comparing properties. Outdoor space, access routes, shared facilities and the position of a home within the development all influence its suitability.",
  ],
  "dubai-harbour": [
    "Dubai Harbour is a coastal destination shaped around marina facilities, cruise terminals and waterfront residences. Its location near Palm Jumeirah and Dubai Marina connects it with an established part of Dubai’s coastline.",
    "The residential offering includes apartments and penthouses, with sea, marina and skyline outlooks depending on the development. EMAAR Beachfront forms a distinct residential destination within the wider harbour setting.",
    "Compare waterfront homes by their exact location, access arrangements and building amenities. Beach access and views are specific to each property and should be confirmed when arranging a viewing.",
  ],
  "dubai-islands": [
    "Dubai Islands is an evolving waterfront destination off Deira, bringing new residential developments together with plans for hospitality, beach and leisure spaces. Its island setting provides a different perspective on the older neighbourhoods along Dubai’s northern coastline.",
    "The residential offering includes apartment developments and villa projects, with facilities and delivery schedules varying between individual schemes. Buyers should distinguish completed amenities from those planned as part of the wider development.",
    "When considering a home here, review the project’s location, access, payment terms and confirmed handover information. Our property specialists can help explain the details attached to an available listing.",
  ],
  "mohammed-bin-rashid-city": [
    "Mohammed Bin Rashid City is a broad residential destination containing distinct communities rather than one uniform neighbourhood. Areas such as District One, Sobha Hartland and developments around Meydan offer different styles of living within the wider district.",
    "The housing mix includes contemporary apartments and larger villa homes, with landscaping and leisure facilities varying between communities. A specific project’s setting is more useful than the wider district name alone when comparing properties.",
    "Consider the home’s exact location, access routes and completed facilities alongside its floor plan. Check which amenities belong to the individual development and which are part of the broader master plan.",
  ],
  meydan: [
    "Meydan is a wider residential and leisure destination associated with Meydan Racecourse and the Dubai World Cup. Its different developments combine contemporary homes with a setting shaped by major sporting and residential projects.",
    "The district’s scale means neighbourhoods can vary significantly in layout, property style and stage of development. Compare the precise project location and its surrounding facilities rather than treating every Meydan address as the same setting.",
    "For a property shortlist, review access routes, parking and the amenities available within the development. Confirm planned facilities and handover details separately for any home still under construction.",
  ],
  "damac-hills-akoya-by-damac": [
    "DAMAC Hills brings apartments and villa neighbourhoods together around a golf-focused landscape. Parks and outdoor leisure spaces contribute to a residential environment with a different rhythm from Dubai’s denser city districts.",
    "Homes within the wider community vary in size, outlook and relationship to shared facilities. Apartment buildings and villa enclaves offer different options for residents comparing indoor space, outdoor areas and community living.",
    "Check the individual development’s amenities and access arrangements when selecting a property. Golf views, garden areas and shared facilities depend on the specific home rather than the community address alone.",
  ],
  "arabian-ranches": [
    "Arabian Ranches is an established residential community known for villa living, landscaped surroundings and a suburban character. Its neighbourhoods offer an alternative to apartment-focused districts for residents who value space and a more residential setting.",
    "Community facilities, schools and a golf course are part of the area’s wider appeal. The different villa communities provide varied layouts and outdoor spaces, making the individual neighbourhood an important part of the search.",
    "Compare garden size, parking and the condition of the home alongside its internal layout. The proximity of everyday facilities and the property’s position within its neighbourhood can help shape a practical shortlist.",
  ],
  deira: [
    "Deira is one of Dubai’s long-established urban districts, with neighbourhoods shaped by trade, traditional markets and the creek-side setting. Its commercial streets and residential buildings offer a different character from the city’s newer master-planned communities.",
    "The wider district includes several distinct neighbourhoods, so the exact address matters when assessing a property. Local shops, services and business activity form an important part of everyday life in the area.",
    "Consider the building’s condition, parking and access to the places you use regularly. Residential and commercial options should be assessed against the needs of the individual occupant or business.",
  ],
  "dubai-creek-harbour": [
    "Dubai Creek Harbour brings contemporary residential developments to a waterfront setting beside Dubai Creek. Apartment buildings, open spaces and waterside routes shape a neighbourhood with a different outlook from the city’s beach and marina districts.",
    "The appeal is a combination of modern homes and a community planned around its connection to the water. Individual developments offer different views, layouts and shared amenities within the wider master plan.",
    "Compare the precise building location, completed facilities and access arrangements when shortlisting a home. Confirm the outlook from the actual apartment rather than relying on general images of the community.",
  ],
  "emaar-beachfront-2": [
    "EMAAR Beachfront is a residential destination within Dubai Harbour, offering apartment living in a coastal setting near Dubai Marina and Palm Jumeirah. Its towers combine different home layouts with views across the sea and surrounding waterfront.",
    "The development’s beach-focused character distinguishes it from nearby city districts. Individual towers provide their own facilities and residential options, so the experience depends on the building as well as the wider address.",
    "Review the apartment’s orientation, beach access and shared amenities when comparing properties. A viewing can help establish how the layout, outlook and building facilities suit your everyday needs.",
  ],
  difc: [
    "DIFC combines a major business district with residential addresses, dining and cultural destinations. Its galleries and architecture give the area a character that extends beyond the working day.",
    "The neighbourhood appeals to residents looking for a central urban setting alongside established commercial activity. Individual residential buildings offer different layouts, views and shared facilities within the district.",
    "When comparing homes, consider building access, parking and the places you expect to visit regularly. The exact tower and apartment layout help determine how well a property fits your routine.",
  ],
};

const aliases: Record<string, string> = { "meydan-horizon": "meydan", "damac-hills": "damac-hills-akoya-by-damac", "dubai-creek-harbour-the-lagoons": "dubai-creek-harbour" };

/** Unknown/new CRM communities get useful inventory-based copy, never invented local amenities. */
export function areaOverview(slug: string, name: string, summary: string, listings: Property[]): string[] {
  const editorial = overviews[aliases[slug] ?? slug];
  if (editorial) return editorial;
  const types = [...new Set(listings.map((property) => property.type.toLowerCase()))];
  const typeText = types.length ? `The current property selection in ${name} includes ${types.join(", ")}. ` : "";
  return [
    summary,
    `${typeText}Compare the available homes by layout, internal space, outdoor areas and the facilities described in each listing. Details such as parking, furnishing and the position of the property within its building or community can help narrow your shortlist.`,
    `When considering a property in ${name}, review its exact location and access to the services you use regularly. For new developments, confirm which amenities are completed and which are planned. Our specialists can help arrange viewings and clarify the details of an available property.`,
  ];
}
