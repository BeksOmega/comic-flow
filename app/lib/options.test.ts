import { getScaleChoices, Scale } from "./options";

describe("getScaleChoices", () => {
  describe("basic functionality", () => {
    it("should return generic options for empty feels array", () => {
      const result = getScaleChoices([]);
      expect(result.size).toBe(5);
    });

    it("should return generic scale choices for any feel", () => {
      const result = getScaleChoices(["Action"]);

      // Should include generic scales
      expect(result.get(Scale.PLANET)).toEqual(["World"]);
      expect(result.get(Scale.CONTINENT)).toEqual(["Region"]);
      expect(result.get(Scale.CITY)).toEqual(["City"]);
      expect(result.get(Scale.TOWN)).toEqual(["Town"]);
      expect(result.get(Scale.BUILDING)).toEqual(["Building"]);
    });
  });

  describe("specific feel overrides", () => {
    it("should override generic scales with specific feel scales", () => {
      const result = getScaleChoices(["Sci-Fi"]);

      // Generic scales should be overridden by Sci-Fi specific ones
      expect(result.get(Scale.UNIVERSE)).toEqual(["Universe"]);
      expect(result.get(Scale.STAR_SYSTEM)).toEqual(["Star system"]);
      expect(result.get(Scale.PLANET)).toEqual(["Planet"]);
      expect(result.get(Scale.CONTINENT)).toEqual(["Continent"]);
      expect(result.get(Scale.NATION_STATE)).toEqual(["Nation state"]);
      expect(result.get(Scale.CITY)).toEqual(["City"]);
      expect(result.get(Scale.TOWN)).toEqual(["Station"]); // Overridden from generic 'Town'
      expect(result.get(Scale.BUILDING)).toEqual(["Ship"]); // Overridden from generic 'Building']
    });

    it("should handle feels with no specific scales", () => {
      const result = getScaleChoices(["Comedy"]);

      // Should only have generic scales since Comedy has no specific scales
      expect(result.get(Scale.PLANET)).toEqual(["World"]);
      expect(result.get(Scale.CITY)).toEqual(["City"]);
      expect(result.get(Scale.TOWN)).toEqual(["Town"]);
    });
  });

  describe("multiple feels with different values", () => {
    it("should include different values for the same scale from different feels", () => {
      const result = getScaleChoices(["Fantasy", "Gothic"]);

      // Fantasy provides "Village" for Town, Gothic provides "Village" for Town
      // Since they're the same value, it should be deduped
      expect(result.get(Scale.TOWN)).toEqual(["Village"]);

      // Fantasy provides "Edifice" for Building, Gothic provides "Edifice" for Building
      expect(result.get(Scale.BUILDING)).toEqual(["Edifice"]);

      // Fantasy provides "Kingdom" for Nation state
      expect(result.get(Scale.NATION_STATE)).toEqual(["Kingdom"]);
    });

    it("should handle feels with overlapping but different scales", () => {
      const result = getScaleChoices(["Sci-Fi", "Fantasy"]);

      // Sci-Fi provides "Station" for Town, Fantasy provides "Village" for Town
      // Both should be included since they're different values
      expect(result.get(Scale.TOWN)).toEqual(["Station", "Village"]);

      // Sci-Fi provides "Ship" for Building, Fantasy provides "Edifice" for Building
      expect(result.get(Scale.BUILDING)).toEqual(["Ship", "Edifice"]);
    });
  });

  describe("deduplication", () => {
    it("should deduplicate identical values from different feels", () => {
      const result = getScaleChoices(["Fantasy", "Gothic", "Pulpy"]);

      // All three feels provide "Village" for Town scale
      expect(result.get(Scale.TOWN)).toEqual(["Village"]);

      // All three feels provide "Edifice" for Building scale
      expect(result.get(Scale.BUILDING)).toEqual(["Edifice"]);
    });

    it("should deduplicate identical values from generic and specific feels", () => {
      const result = getScaleChoices(["Action", "War"]);

      // Generic provides "Town" for Town scale, but Action and War don't override it
      // So it should just be the generic "Town"
      expect(result.get(Scale.TOWN)).toEqual(["Town"]);
    });
  });

  describe("complex scenarios", () => {
    it("should handle multiple feels with mixed generic and specific scales", () => {
      const result = getScaleChoices(["Sci-Fi", "Fantasy", "Action"]);

      // Sci-Fi specific scales
      expect(result.get(Scale.UNIVERSE)).toEqual(["Universe"]);
      expect(result.get(Scale.STAR_SYSTEM)).toEqual(["Star system"]);
      expect(result.get(Scale.PLANET)).toEqual(["Planet"]);

      // Town scale: Sci-Fi provides "Station", Fantasy provides "Village"
      expect(result.get(Scale.TOWN)).toEqual(["Station", "Village"]);

      // Building scale: Sci-Fi provides "Ship", Fantasy provides "Edifice"
      expect(result.get(Scale.BUILDING)).toEqual(["Ship", "Edifice"]);

      // Site scale: Action provides "Battlefield"
      expect(result.get(Scale.SITE)).toEqual(["Battlefield"]);
    });

    it("should handle feels with undefined values", () => {
      const result = getScaleChoices(["Magical Realism"]);

      // Magical Realism has some undefined values which should be filtered out
      expect(result.get(Scale.UNIVERSE)).toBeUndefined();
      expect(result.get(Scale.CONTINENT)).toBeUndefined();
      expect(result.get(Scale.NATION_STATE)).toEqual(["Nation"]);
      expect(result.get(Scale.CITY)).toEqual(["Metropolis"]);
    });
  });

  describe("edge cases", () => {
    it("should handle feels that are not in SCALE_CHOICES", () => {
      const result = getScaleChoices(["NonExistentFeel", "Action"]);

      // Should still work and include generic scales
      expect(result.get(Scale.PLANET)).toEqual(["World"]);
      expect(result.get(Scale.CITY)).toEqual(["City"]);

      // Action specific scales should still work
      expect(result.get(Scale.SITE)).toEqual(["Battlefield"]);
    });

    it("should handle feels with empty specific scale maps", () => {
      // This test ensures the function doesn't crash on feels with no specific scales
      const result = getScaleChoices(["Comedy", "Drama", "Romance"]);

      // Should only contain generic scales
      expect(result.get(Scale.PLANET)).toEqual(["World"]);
      expect(result.get(Scale.CITY)).toEqual(["City"]);
      expect(result.get(Scale.TOWN)).toEqual(["Town"]);
    });

    it("should handle mixed undefined and defined values for the same scale", () => {
      const result = getScaleChoices(["Magical Realism", "Sci-Fi"]);

      // Magical Realism excludes UNIVERSE and CONTINENT, but Sci-Fi provides them
      // Sci-Fi should override the exclusion
      expect(result.get(Scale.UNIVERSE)).toEqual(["Universe"]);
      expect(result.get(Scale.CONTINENT)).toEqual(["Continent"]);

      // Other scales should work normally
      expect(result.get(Scale.PLANET)).toEqual(["Planet"]);
      // NATION_STATE gets both "Nation" from Magical Realism and "Nation state" from Sci-Fi
      expect(result.get(Scale.NATION_STATE)).toEqual([
        "Nation",
        "Nation state",
      ]);
    });

    it("should handle all undefined values correctly", () => {
      const result = getScaleChoices(["Magical Realism"]);

      // Magical Realism has some undefined values but also some defined ones
      // It should only return the defined scales
      expect(result.get(Scale.NATION_STATE)).toEqual(["Nation"]);
      expect(result.get(Scale.CITY)).toEqual(["Metropolis"]);
      expect(result.get(Scale.TOWN)).toEqual(["District"]);
      expect(result.get(Scale.SITE)).toEqual(["Neighbourhood"]);
      expect(result.get(Scale.BUILDING)).toEqual(["Building"]);

      // The undefined scales should not be present
      expect(result.get(Scale.UNIVERSE)).toBeUndefined();
      expect(result.get(Scale.CONTINENT)).toBeUndefined();
    });
  });
});
