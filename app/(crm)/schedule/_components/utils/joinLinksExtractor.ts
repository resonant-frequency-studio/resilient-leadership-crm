export interface JoinLink {
  url: string;
  type: "zoom" | "meet" | "teams" | "other";
}

/**
 * Extract Zoom/Meet/Teams links from event description
 */
export function extractJoinLinks(description: string | null | undefined): JoinLink[] {
  if (!description) return [];
  
  const text = description.replace(/<[^>]*>/g, " "); // Strip HTML tags
  const links: JoinLink[] = [];
  
  // Zoom links
  const zoomRegex = /(https?:\/\/[^\s]*zoom\.us\/[^\s<>"']*)/gi;
  let match;
  while ((match = zoomRegex.exec(text)) !== null) {
    links.push({ url: match[0], type: "zoom" });
  }
  
  // Google Meet links
  const meetRegex = /(https?:\/\/[^\s]*meet\.google\.com\/[^\s<>"']*)/gi;
  while ((match = meetRegex.exec(text)) !== null) {
    links.push({ url: match[0], type: "meet" });
  }
  
  // Microsoft Teams links
  const teamsRegex = /(https?:\/\/[^\s]*teams\.microsoft\.com\/[^\s<>"']*)/gi;
  while ((match = teamsRegex.exec(text)) !== null) {
    links.push({ url: match[0], type: "teams" });
  }
  
  return links;
}

