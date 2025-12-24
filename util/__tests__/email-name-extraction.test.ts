import {
  extractNamesFromEmail,
  capitalizeName,
  isWellFormedName,
} from "../email-name-extraction";

describe("email-name-extraction", () => {
  describe("extractNamesFromEmail", () => {
    it("should extract first and last name from dot-separated email", () => {
      const result = extractNamesFromEmail("dorothy.adams@yahoo.com");
      expect(result.firstName).toBe("Dorothy");
      expect(result.lastName).toBe("Adams");
    });

    it("should extract first name only from single-part email", () => {
      const result = extractNamesFromEmail("dorothy@gmail.com");
      expect(result.firstName).toBe("Dorothy");
      expect(result.lastName).toBeNull();
    });

    it("should handle multiple parts correctly", () => {
      const result = extractNamesFromEmail("john.doe.smith@example.com");
      expect(result.firstName).toBe("John");
      expect(result.lastName).toBe("Doe Smith");
    });

    it("should handle underscore separators", () => {
      const result = extractNamesFromEmail("john_doe@example.com");
      expect(result.firstName).toBe("John");
      expect(result.lastName).toBe("Doe");
    });

    it("should handle hyphen separators", () => {
      const result = extractNamesFromEmail("john-doe@example.com");
      expect(result.firstName).toBe("John");
      expect(result.lastName).toBe("Doe");
    });

    it("should handle single word email", () => {
      const result = extractNamesFromEmail("jdoe@example.com");
      expect(result.firstName).toBe("Jdoe");
      expect(result.lastName).toBeNull();
    });

    it("should remove +alias prefixes", () => {
      const result = extractNamesFromEmail("john.doe+alias@example.com");
      expect(result.firstName).toBe("John");
      expect(result.lastName).toBe("Doe");
    });

    it("should handle invalid email", () => {
      const result = extractNamesFromEmail("notanemail");
      expect(result.firstName).toBeNull();
      expect(result.lastName).toBeNull();
    });

    it("should handle empty string", () => {
      const result = extractNamesFromEmail("");
      expect(result.firstName).toBeNull();
      expect(result.lastName).toBeNull();
    });

    it("should handle email without local part", () => {
      const result = extractNamesFromEmail("@example.com");
      expect(result.firstName).toBeNull();
      expect(result.lastName).toBeNull();
    });
  });

  describe("capitalizeName", () => {
    it("should capitalize single word", () => {
      expect(capitalizeName("john")).toBe("John");
    });

    it("should capitalize multiple words", () => {
      expect(capitalizeName("john doe")).toBe("John Doe");
    });

    it("should handle hyphenated names", () => {
      expect(capitalizeName("mary-jane")).toBe("Mary Jane");
    });

    it("should handle already capitalized names", () => {
      expect(capitalizeName("John Doe")).toBe("John Doe");
    });

    it("should handle all uppercase", () => {
      expect(capitalizeName("JOHN DOE")).toBe("John Doe");
    });

    it("should handle empty string", () => {
      expect(capitalizeName("")).toBe("");
    });

    it("should handle single letter", () => {
      expect(capitalizeName("a")).toBe("A");
    });
  });

  describe("isWellFormedName", () => {
    it("should return true for well-formed single word name", () => {
      expect(isWellFormedName("John")).toBe(true);
    });

    it("should return true for well-formed multi-word name", () => {
      expect(isWellFormedName("John Doe")).toBe(true);
    });

    it("should return true for hyphenated well-formed name", () => {
      expect(isWellFormedName("Mary Jane")).toBe(true);
    });

    it("should return false for all lowercase", () => {
      expect(isWellFormedName("john")).toBe(false);
    });

    it("should return false for all uppercase", () => {
      expect(isWellFormedName("JOHN")).toBe(false);
    });

    it("should return false for mixed case", () => {
      expect(isWellFormedName("jOhN")).toBe(false);
    });

    it("should return false for empty string", () => {
      expect(isWellFormedName("")).toBe(false);
    });

    it("should return false for null", () => {
      expect(isWellFormedName(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isWellFormedName(undefined)).toBe(false);
    });

    it("should return false for whitespace only", () => {
      expect(isWellFormedName("   ")).toBe(false);
    });

    it("should return true for well-formed name with multiple words", () => {
      expect(isWellFormedName("John Michael Smith")).toBe(true);
    });

    it("should return false if any word is not well-formed", () => {
      expect(isWellFormedName("John michael Smith")).toBe(false);
    });
  });
});

