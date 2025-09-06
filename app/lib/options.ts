// Story Feel Options
export const FEEL_CHOICES = [
  "Action",
  "Drama",
  "Romance",
  "Comedy",
  "Isekai",
  "Surreal",
  "Cyberpunk",
  "Steampunk",
  "Mythic",
  "Shojo",
  "Pulpy",
  "Noir",
  "Gothic",
  "Sci-Fi",
  "Magical Realism",
  "Fantasy",
  "Horror",
  "Shonen",
  "Slice of Life",
  "Mecha",
  "Utopian",
  "Satirical",
  "Space Opera",
  "Historical",
  "Dystopian",
  "War",
  "Cozy",
  "Cutesy",
];

// Story Draw Options
export const STORY_DRAW_CHOICES = [
  "World Building",
  "Plot Twists",
  "Emotional Journey",
  "Action Sequences",
  "Mystery",
  "Romance",
  "Humor",
];

export enum Scale {
  UNIVERSE = 0,
  STAR_SYSTEM = 10,
  PLANET = 20,
  CONTINENT = 30,
  NATION_STATE = 40,
  CITY = 50,
  TOWN = 60,
  SITE = 70,
  BUILDING = 80,
}

export const GENERIC_SCALE_CHOICES = new Map([
  [Scale.PLANET, "World"],
  [Scale.CONTINENT, "Region"],
  [Scale.CITY, "City"],
  [Scale.TOWN, "Town"],
  [Scale.BUILDING, "Building"],
]);

// Scale Choice Options
export const SCI_FI_SCALE_CHOICES = new Map([
  [Scale.UNIVERSE, "Universe"],
  [Scale.STAR_SYSTEM, "Star system"],
  [Scale.PLANET, "Planet"],
  [Scale.CONTINENT, "Continent"],
  [Scale.NATION_STATE, "Nation"],
  [Scale.CITY, "City"],
  [Scale.TOWN, "Station"],
  [Scale.BUILDING, "Ship"],
]);

export const FANTASY_SCALE_CHOICES = new Map([
  [Scale.NATION_STATE, "Kingdom"],
  [Scale.TOWN, "Village"],
  [Scale.BUILDING, "Edifice"],
]);

export const ACTION_SCALE_CHOICES = new Map([[Scale.SITE, "Battlefield"]]);

export const WAR_SCALE_CHOICES = new Map([[Scale.SITE, "Battlefield"]]);

export const MECHA_SCALE_CHOICES = new Map([[Scale.SITE, "Battlefield"]]);

export const DYSTOPIAN_SCALE_CHOICES = new Map([[Scale.BUILDING, "Compound"]]);

export const MYTHIC_SCALE_CHOICES = new Map([
  [Scale.UNIVERSE, "Cosmos"],
  [Scale.STAR_SYSTEM, "Divine realm"],
  [Scale.TOWN, "Village"],
  [Scale.SITE, "Sacred site"],
  [Scale.BUILDING, "Edifice"],
]);

export const MAGICAL_REALISM_SCALE_CHOICES = new Map([
  [Scale.PLANET, undefined],
  [Scale.CONTINENT, undefined],
  [Scale.NATION_STATE, "Nation"],
  [Scale.CITY, "Metropolis"],
  [Scale.TOWN, "District"],
  [Scale.SITE, "Neighbourhood"],
  [Scale.BUILDING, "Building"],
]);

export const GOTHIC_SCALE_CHOICES = new Map([
  [Scale.TOWN, "Village"],
  [Scale.SITE, "Site"],
  [Scale.BUILDING, "Edifice"],
]);

export const HORROR_SCALE_CHOICES = new Map([[Scale.SITE, "Facility"]]);

export const STEAMPUNK_SCALE_CHOICES = new Map([
  [Scale.TOWN, "District"],
  [Scale.SITE, "Fleet"],
  [Scale.BUILDING, "Ship"],
]);

export const PULPY_SCALE_CHOICES = new Map([
  [Scale.TOWN, "Village"],
  [Scale.SITE, "Sacred site"],
  [Scale.BUILDING, "Edifice"],
]);

const SCALE_CHOICES = new Map([
  ["Sci-Fi", SCI_FI_SCALE_CHOICES],
  ["Space Opera", SCI_FI_SCALE_CHOICES],
  ["Fantasy", FANTASY_SCALE_CHOICES],
  ["Action", ACTION_SCALE_CHOICES],
  ["War", WAR_SCALE_CHOICES],
  ["Mecha", MECHA_SCALE_CHOICES],
  ["Dystopian", DYSTOPIAN_SCALE_CHOICES],
  ["Mythic", MYTHIC_SCALE_CHOICES],
  ["Magical Realism", MAGICAL_REALISM_SCALE_CHOICES],
  ["Gothic", GOTHIC_SCALE_CHOICES],
  ["Horror", HORROR_SCALE_CHOICES],
  ["Steampunk", STEAMPUNK_SCALE_CHOICES],
  ["Pulpy", PULPY_SCALE_CHOICES],
]);

/**
 * Maps feels to scale choices.
 *
 * First takes the generic feels, and replaces any generic ones with the more
 * specific scales from the feels.
 * If two feels have different concrete values for the same scale, both are included.
 * But identical scales from different feels are deduped.
 */
export function getScaleChoices(feels: string[]): Map<Scale, string[]> {
  const result = new Map<Scale, Set<string>>();
  const hasSpecificValues = new Set<Scale>();

  // First, add generic scale choices for all feels
  for (const [scale, label] of GENERIC_SCALE_CHOICES) {
    if (label) {
      if (!result.has(scale)) {
        result.set(scale, new Set());
      }
      result.get(scale)!.add(label);
    }
  }

  // Then, override generic scales with specific scale choices from each feel
  for (const feel of feels) {
    const specificChoices = SCALE_CHOICES.get(feel);
    if (specificChoices) {
      for (const [scale, label] of specificChoices) {
        if (label === undefined) {
          // This feel explicitly excludes this scale
          if (result.has(scale) && !hasSpecificValues.has(scale)) {
            result.delete(scale);
          }
        } else if (label) {
          if (!result.has(scale)) {
            result.set(scale, new Set());
          }

          const currentLabels = result.get(scale)!;

          // If this is the first specific value for this scale, clear generic values
          if (!hasSpecificValues.has(scale)) {
            currentLabels.clear();
            hasSpecificValues.add(scale);
          }

          currentLabels.add(label);
        }
      }
    }
  }

  // Convert back to Map<Scale, string[]> for easier consumption
  const finalResult = new Map<Scale, string[]>();
  for (const [scale, labels] of result) {
    finalResult.set(scale, Array.from(labels));
  }

  return finalResult;
}
