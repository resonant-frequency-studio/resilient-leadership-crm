/**
 * Extract first and last name from email address
 * 
 * Patterns:
 * - dorothy.adams@yahoo.com -> firstName: "Dorothy", lastName: "Adams"
 * - dorothy@gmail.com -> firstName: "Dorothy", lastName: null
 * - john.doe.smith@example.com -> firstName: "John", lastName: "Doe Smith" (takes first two parts)
 * - jdoe@example.com -> firstName: "Jdoe", lastName: null (single word)
 */
export function extractNamesFromEmail(email: string): { firstName: string | null; lastName: string | null } {
  if (!email || !email.includes("@")) {
    return { firstName: null, lastName: null };
  }

  const localPart = email.split("@")[0].toLowerCase();
  
  // Remove common prefixes/suffixes
  const cleaned = localPart
    .replace(/\+.*/, "") // Remove +alias and everything after it
    .replace(/\.(gmail|yahoo|hotmail|outlook|icloud)$/i, ""); // Remove domain-like suffixes

  // Split by common separators
  const parts = cleaned.split(/[._-]/).filter(part => part.length > 0);

  if (parts.length === 0) {
    return { firstName: null, lastName: null };
  }

  if (parts.length === 1) {
    // Single part: use as firstName
    return {
      firstName: capitalizeName(parts[0]),
      lastName: null,
    };
  }

  // Multiple parts: first part is firstName, rest is lastName
  const firstName = capitalizeName(parts[0]);
  const lastName = parts.slice(1).map(capitalizeName).join(" ");

  return {
    firstName,
    lastName: lastName || null,
  };
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeName(name: string): string {
  if (!name) return "";
  
  return name
    .split(/[\s-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Check if a name is well-formed
 * Well-formed means: uppercase first character, lowercase rest of characters
 * For multi-word names, each word should follow this pattern
 */
export function isWellFormedName(name: string | null | undefined): boolean {
  if (!name || name.trim() === "") {
    return false;
  }

  const trimmed = name.trim();
  
  // Split by spaces and hyphens to check each word
  const words = trimmed.split(/[\s-]+/).filter(word => word.length > 0);
  
  if (words.length === 0) {
    return false;
  }

  // Check each word follows the pattern: first char uppercase, rest lowercase
  return words.every(word => {
    if (word.length === 0) return false;
    
    const firstChar = word[0];
    const rest = word.slice(1);
    
    // First character must be uppercase
    if (firstChar !== firstChar.toUpperCase() || firstChar === firstChar.toLowerCase()) {
      return false;
    }
    
    // Rest of characters must be lowercase (if there are any)
    if (rest.length > 0 && rest !== rest.toLowerCase()) {
      return false;
    }
    
    return true;
  });
}

